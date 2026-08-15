"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type * as T from "three";
import type { Cert, Row } from "@/lib/certs";

/* An immersive reader for one shelf of certificates.

   The certificates are strung along a helix receding into the distance
   and the camera travels down its axis, so moving through the set is
   flying rather than paging. Every card faces a point on the axis in
   front of it, which means a card turns to meet you as you approach
   and turns away as you pass — the rotation is the depth cue, so no
   fog or shadow is needed to sell the corridor.

   Card faces are canvas textures. A certificate is mostly type, and
   type baked at 2x into a texture stays crisp under the perspective
   squeeze in a way that scaled DOM does not. */

const RADIUS = 210;
const Z_STEP = 300;
const ANGLE_STEP = 0.55;
const CAM_LEAD = 720; // how far in front of the focused card the camera sits
const CARD_W = 380;
const CARD_H = 266;
const TEX_W = 1000;
const TEX_H = 700;

function wrapLines(x: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (x.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else line = t;
  }
  if (lines.length < maxLines && line) lines.push(line);
  return lines.slice(0, maxLines);
}

function tracked(x: CanvasRenderingContext2D, text: string, cx: number, y: number, sp: number) {
  const w = x.measureText(text).width + sp * (text.length - 1);
  let px = cx - w / 2;
  for (const ch of text) {
    x.fillText(ch, px, y);
    px += x.measureText(ch).width + sp;
  }
}

function drawCert(c: Cert, index: number, total: number) {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const x = cv.getContext("2d")!;
  const serif = 'Georgia, "Times New Roman", serif';
  const mono = 'ui-monospace, "SF Mono", Menlo, monospace';

  // Paper
  x.fillStyle = "#f2efe6";
  x.fillRect(0, 0, TEX_W, TEX_H);

  // Double rule, the way an actual certificate is bordered
  x.strokeStyle = "rgba(20,20,20,0.55)";
  x.lineWidth = 3;
  x.strokeRect(30, 30, TEX_W - 60, TEX_H - 60);
  x.lineWidth = 1;
  x.strokeRect(46, 46, TEX_W - 92, TEX_H - 92);

  x.textBaseline = "middle";
  x.textAlign = "left";

  // Issuer
  x.fillStyle = "rgba(20,20,20,0.6)";
  x.font = `500 20px ${mono}`;
  tracked(x, "LINKEDIN LEARNING", TEX_W / 2, 118, 6);

  x.strokeStyle = "rgba(20,20,20,0.25)";
  x.lineWidth = 1;
  x.beginPath();
  x.moveTo(TEX_W / 2 - 90, 148);
  x.lineTo(TEX_W / 2 + 90, 148);
  x.stroke();

  // Name
  x.fillStyle = "#141414";
  x.font = `400 52px ${serif}`;
  x.textAlign = "center";
  const lines = wrapLines(x, c.name, TEX_W - 220, 3);
  const startY = 250 - ((lines.length - 1) * 62) / 2;
  lines.forEach((l, i) => x.fillText(l, TEX_W / 2, startY + i * 62));

  // Date
  x.fillStyle = "rgba(20,20,20,0.55)";
  x.font = `400 22px ${mono}`;
  tracked(x, c.date.toUpperCase(), TEX_W / 2, 420, 4);

  // Skills
  if (c.skills.length) {
    x.font = `400 19px ${mono}`;
    x.fillStyle = "rgba(20,20,20,0.45)";
    tracked(x, c.skills.join("  ·  ").toUpperCase(), TEX_W / 2, 470, 2);
  }

  // Seal
  const sy = 560;
  x.strokeStyle = "#7a4b63";
  x.lineWidth = 3;
  x.beginPath();
  x.arc(TEX_W / 2, sy, 42, 0, Math.PI * 2);
  x.stroke();
  x.lineWidth = 1;
  x.beginPath();
  x.arc(TEX_W / 2, sy, 34, 0, Math.PI * 2);
  x.stroke();
  x.fillStyle = "#7a4b63";
  x.font = `400 17px ${mono}`;
  x.textAlign = "center";
  x.fillText("✓", TEX_W / 2, sy - 6);
  x.font = `400 12px ${mono}`;
  tracked(x, "VERIFIED", TEX_W / 2, sy + 14, 2);

  // Index, bottom corners
  x.font = `400 18px ${mono}`;
  x.fillStyle = "rgba(20,20,20,0.4)";
  x.textAlign = "left";
  x.fillText(String(index + 1).padStart(2, "0"), 76, TEX_H - 76);
  x.textAlign = "right";
  x.fillText(`/ ${String(total).padStart(2, "0")}`, TEX_W - 76, TEX_H - 76);

  return cv;
}

export default function CertViewer({
  row,
  certs,
  onClose,
}: {
  row: Row;
  certs: Cert[];
  onClose: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);
  const [ready, setReady] = useState(false);
  const gotoRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !certs.length) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const mod = await import("three").catch(() => null);
      if (!mod || disposed) return;
      const THREE: typeof import("three") = mod;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        58,
        host.clientWidth / host.clientHeight,
        1,
        6000
      );

      const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
      const cards = certs.map((c, i) => {
        const tex = new THREE.CanvasTexture(drawCert(c, i, certs.length));
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const a = i * ANGLE_STEP;
        const z = -i * Z_STEP;
        mesh.position.set(Math.cos(a) * RADIUS, Math.sin(a) * RADIUS * 0.6, z);
        /* Aimed at a point on the axis ahead of the card rather than at
           the camera. A true billboard would stay flat and kill the
           sense of travel; this way each card pivots to meet you. */
        mesh.lookAt(0, 0, z + CAM_LEAD);
        mesh.userData.i = i;
        scene.add(mesh);
        return { mesh, mat, tex };
      });

      // ---- travel state ------------------------------------------
      let p = 0; // fractional position along the helix
      let target = 0;
      let dragging = false;
      let moved = 0;
      let lastY = 0;
      const last = certs.length - 1;
      const clamp = (v: number) => Math.max(0, Math.min(last, v));

      const el = renderer.domElement;
      el.style.touchAction = "none";
      const ndc = new THREE.Vector2(-2, -2);
      const ray = new THREE.Raycaster();

      /* One reusable proxy object rather than a throwaway per tween:
         GSAP callbacks are typed as plain functions, so reading the
         tween's own target through `this` trips noImplicitThis. */
      const nav = { v: 0 };
      function tweenTo(v: number, duration: number, ease: string) {
        gsap.killTweensOf(nav);
        nav.v = target;
        gsap.to(nav, {
          v: clamp(v),
          duration,
          ease,
          onUpdate: () => {
            target = nav.v;
          },
        });
      }
      function goto(i: number) {
        tweenTo(i, 0.7, "power3.inOut");
      }
      gotoRef.current = goto;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        target = clamp(target + e.deltaY * 0.0022);
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        moved = 0;
        lastY = e.clientY;
        el.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1
        );
        if (!dragging) return;
        const dy = e.clientY - lastY;
        lastY = e.clientY;
        moved += Math.abs(dy);
        target = clamp(target - dy * 0.006);
      };
      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* pointer already released */
        }
        if (moved > 6) {
          // Settle onto the nearest card rather than between two.
          tweenTo(Math.round(target), 0.5, "power2.out");
          return;
        }
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(scene.children, false)[0];
        if (!hit) return;
        const i = hit.object.userData.i as number;
        if (i === Math.round(p)) window.open(certs[i].url, "_blank", "noopener");
        else goto(i);
      };


      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") goto(Math.round(target) + 1);
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") goto(Math.round(target) - 1);
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      window.addEventListener("keydown", onKey);

      // Fly in from behind the first card.
      p = -1.6;
      let shown = -1;

      const tick = () => {
        p += (target - p) * 0.1;
        camera.position.set(0, 0, -p * Z_STEP + CAM_LEAD);

        const near = Math.round(p);
        if (near !== shown) {
          shown = near;
          setFocus(Math.max(0, Math.min(last, near)));
        }

        for (const c of cards) {
          const d = c.mesh.position.z - camera.position.z; // negative = ahead
          const ahead = -d;
          // Behind the camera, or too far down the corridor to matter.
          if (ahead < -260 || ahead > 2600) {
            c.mesh.visible = false;
            continue;
          }
          c.mesh.visible = true;
          const dist = Math.abs(c.mesh.userData.i - p);
          const fade =
            ahead < 0 ? Math.max(0, 1 + ahead / 260) : Math.max(0, 1 - (ahead - 400) / 2200);
          c.mat.opacity = Math.min(1, fade);
          // The focused card lifts a little and brightens.
          const lift = 1 + Math.max(0, 1 - dist) * 0.14;
          c.mesh.scale.setScalar(lift);
          c.mat.color.setScalar(0.62 + Math.max(0, 1 - dist * 0.8) * 0.38);
        }

        renderer.render(scene, camera);
      };
      gsap.ticker.add(tick);
      setReady(true);

      const onResize = () => {
        if (!host.clientWidth) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("keydown", onKey);
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        cards.forEach((c) => {
          c.mat.dispose();
          c.tex.dispose();
        });
        geo.dispose();
        renderer.dispose();
        el.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [certs]);

  // Escape closes, from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cert = certs[focus];

  return (
    <div className="cv-root" role="dialog" aria-modal="true" aria-label={`${row.label} certificates`}>
      <div ref={hostRef} className="cv-canvas" />

      <div className="cv-top">
        <span className="cv-shelf">
          {row.label}
          <sup>({certs.length})</sup>
        </span>
        <button type="button" className="cv-close" onClick={onClose}>
          Close ✕
        </button>
      </div>

      {ready && cert && (
        <div className="cv-readout">
          <span className="cv-index">
            {String(focus + 1).padStart(2, "0")} / {String(certs.length).padStart(2, "0")}
          </span>
          <span className="cv-name">{cert.name}</span>
          <span className="cv-meta">
            {cert.date}
            {cert.skills.length ? ` · ${cert.skills.join(", ")}` : ""}
          </span>
          <a className="cv-link" href={cert.url} target="_blank" rel="noopener">
            Show credential ↗
          </a>
        </div>
      )}

      <div className="cv-rail" aria-hidden="true">
        {certs.map((c, i) => (
          <button
            key={c.url}
            type="button"
            className={"cv-tick" + (i === focus ? " is-on" : "")}
            onClick={() => gotoRef.current(i)}
            tabIndex={-1}
          />
        ))}
      </div>

      <span className="cv-hint micro">scroll or drag to travel · click the card to verify</span>
    </div>
  );
}
