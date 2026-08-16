"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type * as T from "three";
import type { Cert, Row } from "@/lib/certs";

/* A deck of certificates, dealt one at a time.

   The first version flew the camera down a helix. It looked good in
   motion and was useless to actually read: nothing was ever stationary
   or square-on to the camera, so every certificate arrived tilted,
   moving, and blurred by the perspective squeeze. A certificate is a
   document — the whole point is reading it.

   So: the focused card is always dead centre, dead-on, and completely
   still. The remaining cards stack behind it, stepped down and back so
   the deck's depth is visible without competing. Navigation is
   discrete — one card per gesture, snapped, never free-scrolling. You
   land on a card and it stops.

   Textures are built lazily in a window around the focus. A card
   readable at 62% of viewport height needs ~1400px of texture, and 22
   of those at once is ~115MB of GPU memory for cards nobody is looking
   at. A ±4 window is ~47MB and indistinguishable on screen. */

const CARD_W = 660;
const CARD_H = 462;
const TEX_W = 1400;
const TEX_H = 980;
const CAM_Z = 900;
const WINDOW = 4; // how many cards either side keep a live texture

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
  const prev = x.textAlign;
  x.textAlign = "left";
  for (const ch of text) {
    x.fillText(ch, px, y);
    px += x.measureText(ch).width + sp;
  }
  x.textAlign = prev;
}

function drawCert(c: Cert, index: number, total: number) {
  const cv = document.createElement("canvas");
  cv.width = TEX_W;
  cv.height = TEX_H;
  const x = cv.getContext("2d")!;
  const serif = 'Georgia, "Times New Roman", serif';
  const mono = 'ui-monospace, "SF Mono", Menlo, monospace';
  // Layout is authored against a 1000-unit width, then scaled up to
  // whatever TEX_W is — so raising the texture resolution never means
  // re-tuning any coordinate below.
  const S = TEX_W / 1000;

  x.save();
  x.scale(S, S);
  const W = 1000;
  const H = TEX_H / S;

  x.fillStyle = "#f4f1e9";
  x.fillRect(0, 0, W, H);

  x.strokeStyle = "rgba(20,20,20,0.5)";
  x.lineWidth = 3;
  x.strokeRect(28, 28, W - 56, H - 56);
  x.lineWidth = 1;
  x.strokeRect(42, 42, W - 84, H - 84);

  x.textBaseline = "middle";
  x.textAlign = "center";

  x.fillStyle = "rgba(20,20,20,0.62)";
  x.font = `500 19px ${mono}`;
  tracked(x, "LINKEDIN LEARNING", W / 2, 108, 6);

  x.strokeStyle = "rgba(20,20,20,0.22)";
  x.lineWidth = 1;
  x.beginPath();
  x.moveTo(W / 2 - 88, 136);
  x.lineTo(W / 2 + 88, 136);
  x.stroke();

  x.fillStyle = "rgba(20,20,20,0.45)";
  x.font = `400 17px ${mono}`;
  tracked(x, "THIS CERTIFIES THE COMPLETION OF", W / 2, 178, 3);

  x.fillStyle = "#131313";
  x.font = `400 54px ${serif}`;
  const lines = wrapLines(x, c.name, W - 200, 3);
  const startY = 286 - ((lines.length - 1) * 64) / 2;
  lines.forEach((l, i) => x.fillText(l, W / 2, startY + i * 64));

  x.fillStyle = "rgba(20,20,20,0.55)";
  x.font = `400 21px ${mono}`;
  tracked(x, c.date.toUpperCase(), W / 2, 424, 4);

  if (c.skills.length) {
    x.font = `400 18px ${mono}`;
    x.fillStyle = "rgba(20,20,20,0.42)";
    tracked(x, c.skills.join("   ·   ").toUpperCase(), W / 2, 464, 2);
  }

  const sy = 552;
  x.strokeStyle = "#7a4b63";
  x.lineWidth = 3;
  x.beginPath();
  x.arc(W / 2, sy, 40, 0, Math.PI * 2);
  x.stroke();
  x.lineWidth = 1;
  x.beginPath();
  x.arc(W / 2, sy, 32, 0, Math.PI * 2);
  x.stroke();
  x.fillStyle = "#7a4b63";
  x.font = `400 20px ${mono}`;
  x.fillText("✓", W / 2, sy - 5);
  x.font = `400 11px ${mono}`;
  tracked(x, "VERIFIED", W / 2, sy + 15, 2);

  x.font = `400 17px ${mono}`;
  x.fillStyle = "rgba(20,20,20,0.38)";
  x.textAlign = "left";
  x.fillText(String(index + 1).padStart(2, "0"), 72, H - 72);
  x.textAlign = "right";
  x.fillText(`/ ${String(total).padStart(2, "0")}`, W - 72, H - 72);

  x.restore();
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
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const goRef = useRef<(i: number) => void>(() => {});

  const goto = useCallback((i: number) => goRef.current(i), []);

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
        45,
        host.clientWidth / host.clientHeight,
        1,
        5000
      );
      camera.position.set(0, 0, CAM_Z);

      // On a narrow phone screen the vertical FOV stays fixed but the
      // visible width shrinks with the aspect ratio, so a card sized
      // for desktop overflows the viewport. Scale the whole deck down
      // to fit when the host is mobile-width; leave desktop untouched.
      const MOBILE_BP = 720;
      let fitScale = 1;
      const updateFitScale = () => {
        if (host.clientWidth > MOBILE_BP) {
          fitScale = 1;
          return;
        }
        const fovRad = (camera.fov * Math.PI) / 180;
        const visibleH = 2 * Math.tan(fovRad / 2) * CAM_Z;
        const visibleW = visibleH * camera.aspect;
        const margin = 0.72; // room for the top bar / readout overlays
        fitScale = Math.min(1, margin * Math.min(visibleW / CARD_W, visibleH / CARD_H));
      };
      updateFitScale();

      const geo = new THREE.PlaneGeometry(CARD_W, CARD_H);
      const cards = certs.map((_, i) => {
        /* Blank paper until a texture is built for it. Cards outside
           the window are nearly transparent anyway, so the swap is
           never visible. */
        const mat = new THREE.MeshBasicMaterial({
          color: 0xf4f1e9,
          transparent: true,
          depthTest: false,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData.i = i;
        scene.add(mesh);
        return { mesh, mat };
      });

      const texCache = new Map<number, T.CanvasTexture>();
      const maxAniso = renderer.capabilities.getMaxAnisotropy();

      function syncTextures(center: number) {
        for (let i = 0; i < certs.length; i++) {
          const near = Math.abs(i - center) <= WINDOW;
          if (near && !texCache.has(i)) {
            const tex = new THREE.CanvasTexture(drawCert(certs[i], i, certs.length));
            tex.anisotropy = maxAniso;
            texCache.set(i, tex);
            cards[i].mat.map = tex;
            cards[i].mat.color.setHex(0xffffff);
            cards[i].mat.needsUpdate = true;
          } else if (!near && texCache.has(i)) {
            texCache.get(i)!.dispose();
            texCache.delete(i);
            cards[i].mat.map = null;
            cards[i].mat.color.setHex(0xf4f1e9);
            cards[i].mat.needsUpdate = true;
          }
        }
      }
      syncTextures(0);

      // ---- discrete navigation -----------------------------------
      const last = certs.length - 1;
      const clamp = (v: number) => Math.max(0, Math.min(last, v));
      const nav = { p: 0 }; // animated position; always settles on an integer
      let current = 0;

      function goTo(i: number) {
        const t = clamp(Math.round(i));
        if (t === current) return;
        current = t;
        setIndex(t);
        syncTextures(t);
        gsap.killTweensOf(nav);
        gsap.to(nav, { p: t, duration: 0.62, ease: "power3.out" });
      }
      goRef.current = goTo;
      const step = (d: number) => goTo(current + d);

      const el = renderer.domElement;
      el.style.touchAction = "none";
      const ndc = new THREE.Vector2(-2, -2);
      const ray = new THREE.Raycaster();

      /* Wheel events arrive in bursts, especially from trackpads.
         Accumulate to a threshold then lock out briefly, so one
         physical gesture advances exactly one card instead of flinging
         through six. This is the whole fix for "everything zips past". */
      let acc = 0;
      let cool = 0;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const now = performance.now();
        if (now < cool) return;
        acc += e.deltaY;
        if (Math.abs(acc) >= 40) {
          step(acc > 0 ? 1 : -1);
          acc = 0;
          cool = now + 300;
        }
      };

      let dragging = false;
      let startY = 0;
      let dy = 0;
      const onDown = (e: PointerEvent) => {
        dragging = true;
        startY = e.clientY;
        dy = 0;
        el.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        ndc.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1
        );
        if (dragging) dy = e.clientY - startY;
      };
      const onUp = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* already released */
        }
        // A swipe moves exactly one card, however far it travelled.
        if (Math.abs(dy) > 48) {
          step(dy < 0 ? 1 : -1);
          return;
        }
        if (Math.abs(dy) > 6) return; // a nudge, not a click
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(scene.children, false)[0];
        if (!hit) return;
        const i = hit.object.userData.i as number;
        if (i === current) window.open(certs[i].url, "_blank", "noopener");
        else goTo(i);
      };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
        if (e.key === "Home") goTo(0);
        if (e.key === "End") goTo(last);
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
      window.addEventListener("keydown", onKey);

      // Deal the first card in from below.
      nav.p = -0.8;
      gsap.to(nav, { p: 0, duration: 0.8, ease: "power3.out" });

      const tick = () => {
        for (const c of cards) {
          const o = (c.mesh.userData.i as number) - nav.p;
          let z: number, y: number, scale: number, opacity: number;
          if (o >= 0) {
            // Still in the deck: stepped down and back behind the focus.
            z = -o * 170;
            y = -o * 34;
            scale = 1 - o * 0.045;
            opacity = 1 - o * 0.2;
          } else {
            // Dealt: lifts away upward and fades within one step.
            const k = -o;
            z = k * 140;
            y = k * 300;
            scale = 1 + k * 0.06;
            opacity = 1 - k * 1.4;
          }
          if (opacity <= 0.01) {
            c.mesh.visible = false;
            continue;
          }
          c.mesh.visible = true;
          c.mesh.position.set(0, y, z);
          c.mesh.scale.setScalar(Math.max(0.01, scale) * fitScale);
          c.mat.opacity = Math.min(1, opacity);
          /* Depth testing is off, so paint order is the only thing
             stacking these — nearer cards must render last. */
          c.mesh.renderOrder = Math.round(z);
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
        updateFitScale();
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        gsap.ticker.remove(tick);
        gsap.killTweensOf(nav);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("keydown", onKey);
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
        texCache.forEach((t) => t.dispose());
        texCache.clear();
        cards.forEach((c) => c.mat.dispose());
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const cert = certs[index];

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
            {String(index + 1).padStart(2, "0")} / {String(certs.length).padStart(2, "0")}
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

      <div className="cv-nav">
        <button
          type="button"
          className="cv-step"
          onClick={() => goto(index - 1)}
          disabled={index === 0}
          aria-label="Previous certificate"
        >
          ↑
        </button>
        <button
          type="button"
          className="cv-step"
          onClick={() => goto(index + 1)}
          disabled={index === certs.length - 1}
          aria-label="Next certificate"
        >
          ↓
        </button>
      </div>

      <div className="cv-rail">
        {certs.map((c, i) => (
          <button
            key={c.url}
            type="button"
            className={"cv-tick" + (i === index ? " is-on" : "")}
            onClick={() => goto(i)}
            aria-label={`Go to ${c.name}`}
          />
        ))}
      </div>

      <span className="cv-hint micro">one card per scroll · click the card to verify</span>
    </div>
  );
}
