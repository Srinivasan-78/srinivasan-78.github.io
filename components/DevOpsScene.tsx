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
    // Narrow viewports bail too. Below ~1280px the 880px text column
    // spans most of the screen, and the readability mask drops anything
    // behind it to ~12% — a whole WebGL context to render something all
    // but invisible is the worst trade on the page. Matched by a
    // display:none in globals.css so the masked stage layer goes too.
    if (window.innerWidth < 1280) return;

    // Reduced motion does NOT bail. It means reduce motion, not remove
    // content: the scene is built and rendered exactly once, so the
    // geometry is still there, just perfectly still. Bailing here was
    // hiding the entire background from anyone with the OS setting on.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const build = async () => {
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

      // No MSAA and a 1.5x ceiling on pixel ratio. At 2x with antialias
      // this was shading four samples per screen pixel across the whole
      // viewport, every frame, for line art that the mask already keeps
      // faint. 1.5x still supersamples the lines enough to read clean.
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      host.appendChild(renderer.domElement);

      /* ---- shared line material; one instance so a theme change is
         a single colour write rather than a walk over every object ---- */
      const line = new THREE.LineBasicMaterial({
        color: new THREE.Color(cssColor("--sage", "#0095f6")),
        transparent: true,
        opacity: 0.55,
      });
      const lineDim = new THREE.LineBasicMaterial({
        color: new THREE.Color(cssColor("--ink-45", "#85827d")),
        transparent: true,
        opacity: 0.3,
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
      place(stack, -19, 6, -6, 0.85, [0.0006, 0.0011, 0]);

      /* ---- CI gear: torus hub plus radial spokes ---- */
      const gear = new THREE.Group();
      gear.add(wire(new THREE.TorusGeometry(2.4, 0.55, 6, 18), line));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const tooth = wire(new THREE.BoxGeometry(0.7, 0.7, 0.7), line);
        tooth.position.set(Math.cos(a) * 3.1, Math.sin(a) * 3.1, 0);
        gear.add(tooth);
      }
      place(gear, 20, 2.5, -9, 0.6, [0, 0, 0.0016]);

      /* ---- multi-cloud globe ---- */
      place(
        wire(new THREE.IcosahedronGeometry(4.2, 1), lineDim),
        19,
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
      place(rack, -21, -8, -11, 0.5, [0, 0.0007, 0]);

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
      place(pipe, -17, -10, -5, 0.95, [0, 0.0005, 0]);

      /* ---- orchestration knot ---- */
      place(
        wire(new THREE.TorusKnotGeometry(2.6, 0.7, 48, 6, 2, 3), lineDim),
        17,
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
        wake();
      };
      const onPointer = (e: PointerEvent) => {
        tmx = (e.clientX / window.innerWidth - 0.5) * 2;
        tmy = (e.clientY / window.innerHeight - 0.5) * 2;
        wake();
      };
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // setSize clears the buffer, and the loop is usually parked, so
        // the repaint has to be explicit — otherwise a resize leaves the
        // scene blank until the next scroll. wake() covers the animated
        // case; `still` never has a loop to wake.
        if (still) renderer.render(scene, camera);
        else wake();
      };
      // A hidden tab renders nothing anyone can see. Throttled rAF still
      // costs a full scene draw per callback, so stop rather than idle.
      const onVisibility = () => {
        if (document.hidden) {
          running = false;
          cancelAnimationFrame(raf);
        } else {
          wake();
        }
      };

      const home = objects.map((o) => o.mesh.position.clone());
      let stop = -1;
      let raf = 0;
      let running = false;
      let lastInput = 0;
      let lastDraw = 0;

      /* 30fps, not 60. This is a background field of slowly drifting
         wireframes — nobody can see the missing frames — and halving the
         draw rate halves far more than this canvas. Every
         backdrop-filter on the page (the cards, the nav, the HUD) sits
         over this canvas, and a blurred backdrop can never be cached
         while what is behind it repaints, so each scene frame drags a
         re-blur of every glass surface along with it. */
      const FRAME_MS = 1000 / 30;

      // Everything has arrived where it was heading, so the next frame
      // would draw the same image.
      const settled = () =>
        Math.abs(target - current) < 0.0005 &&
        Math.abs(tmx - mx) < 0.001 &&
        Math.abs(tmy - my) < 0.001;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);

        if (now - lastDraw < FRAME_MS) return;
        lastDraw = now;

        // Ease constants are doubled from their 60fps values: half the
        // frames means half the steps, and the old numbers made the
        // parallax visibly lag the scroll at this rate.
        current += (target - current) * 0.12;
        mx += (tmx - mx) * 0.1;
        my += (tmy - my) * 0.1;

        objects.forEach((o, i) => {
          const h = home[i];
          // The depth multiplier is the whole effect: same scroll
          // input, different travel per object.
          o.mesh.position.y = h.y + current * 46 * o.depth;
          o.mesh.position.x = h.x + mx * 1.1 * o.depth;
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

        /* Park once input has stopped and the eased values have caught
           up. The per-object spins are the only thing still moving at
           that point, and at ~0.0006 rad/frame they are not worth
           keeping a WebGL context — and every glass surface above it —
           awake for while the visitor sits still reading. Any scroll or
           pointer move brings it straight back. */
        if (now - lastInput > 500 && settled()) {
          cancelAnimationFrame(raf);
          running = false;
        }
      };

      const wake = () => {
        // Reduced motion has no loop to wake: it gets one static frame.
        if (still) return;
        lastInput = performance.now();
        if (running || document.hidden) return;
        running = true;
        // Reset so the first frame back is never skipped by the cap.
        lastDraw = 0;
        raf = requestAnimationFrame(frame);
      };

      onScroll();
      if (still) {
        // One frame, at rest. No rAF loop, no scroll or pointer
        // listeners — nothing that could move.
        line.color.set(cssColor(STOPS[0], "#0095f6"));
        stop = 0;
        renderer.render(scene, camera);
      } else {
        wake();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("pointermove", onPointer, { passive: true });
      }
      window.addEventListener("resize", onResize);
      document.addEventListener("visibilitychange", onVisibility);

      const obs = new MutationObserver(() => {
        line.color.set(cssColor(STOPS[stop < 0 ? 0 : stop], "#0095f6"));
        lineDim.color.set(cssColor("--ink-45", "#85827d"));
        // The loop is usually parked and `still` never has one, so the
        // new colour needs its own frame or the theme toggle appears to
        // miss the background entirely.
        renderer.render(scene, camera);
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });

      cleanup = () => {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointermove", onPointer);
        // Both removes are unconditional: removing a listener that was
        // never added is a no-op, and branching here would leak if the
        // media query flipped between mount and unmount.
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        obs.disconnect();
        scene.traverse((o: any) => {
          if (o.geometry) o.geometry.dispose();
        });
        line.dispose();
        lineDim.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    };

    /* three.js is ~170KB gzipped and this is background decoration, so
       the import waits for the main thread to go quiet: hydration,
       fonts and the first images all land before the scene starts
       building. The timeout is the escape hatch for a page that never
       reports an idle period. */
    const hasIdle = typeof window.requestIdleCallback === "function";
    const handle = hasIdle
      ? window.requestIdleCallback(() => build(), { timeout: 2500 })
      : window.setTimeout(build, 900);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
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