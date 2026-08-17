"use client";

import { useEffect, useRef } from "react";

/* Cursor-following glass lens.
   Not WebGL: a 3D scene has nothing real drawn behind the mesh, so no
   material can refract the actual page — it can only refract whatever
   else exists inside that same scene. backdrop-filter instead reads
   the page's already-composited pixels, so an SVG feDisplacementMap
   filter genuinely bends the real content sitting under the lens. */
export default function FluidCursor() {
  const lensRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;

    const el = lensRef.current;
    if (!el) return;

    let seeded = false;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      // Snap to the first real position instead of easing in from the
      // (0,0) default — otherwise the lens visibly slides in from the
      // top-left corner on the first move of every page.
      if (!seeded) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        seeded = true;
      }
      el.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove);

    const tick = () => {
      pos.current.x += (pointer.current.x - pos.current.x) * 0.28;
      pos.current.y += (pointer.current.y - pos.current.y) * 0.28;
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* width/height 0: this SVG exists only to host the filter
          definition that the lens div references by id — it never
          renders anything itself. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="lens-refraction" x="-50%" y="-50%" width="200%" height="200%">
          {/* Raw turbulence displaces per-pixel, so it reads as static
              grain, not glass. Apple's liquid-glass look comes from
              displacing by a smooth field instead — so the noise gets
              blurred into soft rolling hills before it's used as the
              map, which turns sharp static into a gentle continuous
              warp with no visible texture of its own. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="6" result="noiseSmooth" />
          <feDisplacementMap in="SourceGraphic" in2="noiseSmooth" scale="45" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        ref={lensRef}
        className="fluid-cursor"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          // z-index 40: above page content (z 1) but below Nav (z 50),
          // so the nav and its links/buttons always win the stacking
          // order.
          zIndex: 40,
          width: 72,
          height: 72,
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.25s ease",
          filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.3))",
        }}
      >
        {/* Warp layer: the actual glass. Separated from the highlight
            below because a filter and a background on the same element
            get distorted together, which smears the specular gloss
            into the noise instead of keeping it crisp on top. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            // Safari has no support for referencing an SVG filter from
            // backdrop-filter, so it silently falls back to just the
            // blur/saturate — still glassy, just without the warp.
            backdropFilter: "url(#lens-refraction) blur(0.5px) saturate(1.5) brightness(1.05)",
            WebkitBackdropFilter: "blur(6px) saturate(1.5) brightness(1.05)",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        {/* Highlight layer: an off-center specular bloom plus a
            bright-top/dark-bottom inset shading, the two cues that
            read as "convex glass" rather than "frosted circle". */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.75), rgba(255,255,255,0.08) 55%, rgba(255,255,255,0) 75%)",
            boxShadow:
              "inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -8px 16px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(255,255,255,0.3)",
            mixBlendMode: "overlay",
          }}
        />
      </div>
    </>
  );
}
