"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* A persistent WebGL field of DevOps objects behind the whole page.

   Everything is line-art (EdgesGeometry -> LineSegments) rather than
   shaded solids: it matches the SVG schematics used on the cards, costs
   almost nothing to render, and recolours instantly on theme change by
   assigning to material.color — no relighting, no texture reload.

   Parallax is per-object rather than a single camera move. Each object
   carries a `depth` in 0..1; scroll progress is multiplied by it, so
   near objects travel far and distant ones barely drift. That
   difference IS the parallax — moving the camera alone would shift
   everything by the same amount and read as flat.

   Deliberately NOT done: postprocessing, shadows, and per-frame
   geometry rebuilds. All three would stutter on a field this wide. */

type Depth = { mesh: any; depth: number; spin: [number, number, number] };

const STOPS = ["--sage", "--slate", "--plum", "--brass"] as const;

function cssColor(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function DevOpsScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Coarse pointer still bails entirely — a phone gains nothing from a
    // WebGL context it can't interact with, and pays for it in battery.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    // Reduced motion does NOT bail. It means reduce motion, not remove
    // content: the scene is built and rendered exactly once, so the
    // geometry is still there, just perfectly still. Bailing here was
    // hiding the entire background from anyone with the OS setting on.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (cancelled || !hostRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        200
      );
      camera.position.set(0, 0, 26);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      host.appendChild(renderer.domElement);

      /* ---- shared line material; one instance so a theme change is
         a single colour write rather than a walk over every object ---- */
      const line = new THREE.LineBasicMaterial({
        color: new THREE.Color(cssColor("--sage", "#0095f6")),
        transparent: true,
        opacity: 0.9,
      });
      const lineDim = new THREE.LineBasicMaterial({
        color: new THREE.Color(cssColor("--ink-45", "#85827d")),
        transparent: true,
        opacity: 0.5,
      });

      const wire = (geo: any, mat: any) =>
        new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);

      const objects: Depth[] = [];

      const place = (
        mesh: any,
        x: number,
        y: number,
        z: number,
        depth: number,
        spin: [number, number, number]
      ) => {
        mesh.position.set(x, y, z);
        scene.add(mesh);
        objects.push({ mesh, depth, spin });
      };

      /* ---- container stack: offset boxes, the Docker/artifact motif ---- */
      const stack = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const b = wire(new THREE.BoxGeometry(3.4, 1.1, 2.2), i === 1 ? line : lineDim);
        b.position.set(i * 0.5 - 0.5, i * 1.3 - 1.3, 0);
        stack.add(b);
      }
      place(stack, -11, 6, -6, 0.85, [0.0006, 0.0011, 0]);

      /* ---- CI gear: torus hub plus radial spokes ---- */
      const gear = new THREE.Group();
      gear.add(wire(new THREE.TorusGeometry(2.4, 0.55, 6, 18), line));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const tooth = wire(new THREE.BoxGeometry(0.7, 0.7, 0.7), line);
        tooth.position.set(Math.cos(a) * 3.1, Math.sin(a) * 3.1, 0);
        gear.add(tooth);
      }
      place(gear, 12, 2.5, -9, 0.6, [0, 0, 0.0016]);

      /* ---- multi-cloud globe ---- */
      place(
        wire(new THREE.IcosahedronGeometry(4.2, 1), lineDim),
        10,
        -9,
        -14,
        0.35,
        [0.0004, 0.0009, 0]
      );

      /* ---- server rack: tall shell with slotted blades ---- */
      const rack = new THREE.Group();
      rack.add(wire(new THREE.BoxGeometry(3, 7.5, 3), lineDim));
      for (let i = 0; i < 5; i++) {
        const blade = wire(new THREE.BoxGeometry(2.6, 0.55, 2.6), i % 2 ? lineDim : line);
        blade.position.y = i * 1.35 - 2.7;
        rack.add(blade);
      }
      place(rack, -13, -8, -11, 0.5, [0, 0.0007, 0]);

      /* ---- pipeline: nodes joined by connectors, the CD motif.
         CylinderGeometry rotated onto Z — r134 has no CapsuleGeometry. ---- */
      const pipe = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const node = wire(new THREE.OctahedronGeometry(0.85, 0), line);
        node.position.x = i * 3.2;
        pipe.add(node);
        if (i < 3) {
          const link = wire(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 6), lineDim);
          link.rotation.z = Math.PI / 2;
          link.position.x = i * 3.2 + 1.6;
          pipe.add(link);
        }
      }
      pipe.rotation.set(0.3, -0.5, 0.12);
      place(pipe, -6, -10, -5, 0.95, [0, 0.0005, 0]);

      /* ---- orchestration knot ---- */
      place(
        wire(new THREE.TorusKnotGeometry(2.6, 0.7, 48, 6, 2, 3), lineDim),
        6,
        14,
        -12,
        0.45,
        [0.0008, 0.0006, 0]
      );

      /* ---- scroll + pointer state, both eased in the frame loop so
         neither handler ever touches the renderer directly ---- */
      let target = 0;
      let current = 0;
      let mx = 0;
      let my = 0;
      let tmx = 0;
      let tmy = 0;

      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      };
      const onPointer = (e: PointerEvent) => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 2;
        tmy = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // setSize clears the buffer. With no rAF loop running, nothing
        // would repaint it, so the still scene needs an explicit redraw.
        if (still) renderer.render(scene, camera);
      };

      const home = objects.map((o) => o.mesh.position.clone());
      let stop = -1;
      let raf = 0;

      const frame = () => {
        raf = requestAnimationFrame(frame);
        current += (target - current) * 0.06;
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;

        objects.forEach((o, i) => {
          const h = home[i];
          // The depth multiplier is the whole effect: same scroll
          // input, different travel per object.
          o.mesh.position.y = h.y + current * 46 * o.depth;
          o.mesh.position.x = h.x + mx * 2.2 * o.depth;
          o.mesh.rotation.x += o.spin[0];
          o.mesh.rotation.y += o.spin[1];
          o.mesh.rotation.z += o.spin[2];
        });

        camera.position.x = mx * 1.1;
        camera.position.y = -my * 0.9;
        camera.lookAt(0, 0, 0);

        // Accent stages are discrete — recolouring per frame would be
        // invisible motion at real cost.
        const next = Math.min(STOPS.length - 1, Math.floor(current * STOPS.length));
        if (next !== stop) {
          stop = next;
          line.color.set(cssColor(STOPS[next], "#0095f6"));
        }

        renderer.render(scene, camera);
      };

      onScroll();
      if (still) {
        // One frame, at rest. No rAF loop, no scroll or pointer
        // listeners — nothing that could move.
        line.color.set(cssColor(STOPS[0], "#0095f6"));
        stop = 0;
        renderer.render(scene, camera);
      } else {
        frame();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointermove", onPointer, { passive: true });
      }
      window.addEventListener("resize", onResize);

      const obs = new MutationObserver(() => {
        line.color.set(cssColor(STOPS[stop < 0 ? 0 : stop], "#0095f6"));
        lineDim.color.set(cssColor("--ink-45", "#85827d"));
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        // Both removes are unconditional: removing a listener that was
        // never added is a no-op, and branching here would leak if the
        // media query flipped between mount and unmount.
        window.removeEventListener("resize", onResize);
        obs.disconnect();
        scene.traverse((o: any) => {
          if (o.geometry) o.geometry.dispose();
        });
        line.dispose();
        lineDim.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Route changes alter document height, so the scroll mapping restarts.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [pathname]);

  return (
    <div className="scene-stage" aria-hidden="true">
      <div className="scene-gl" ref={hostRef} />
    </div>
  );
}