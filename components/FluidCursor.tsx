"use client";

import { useEffect, useRef } from "react";

type FluidCursorProps = {
  /** Lens diameter at rest, px. */
  size?: number;
  /** Lens diameter while hovering an interactive element, px. */
  hoverSize?: number;
};

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

/* Cursor-following glass lens.
   Not WebGL/canvas: a 3D scene or a canvas snapshot has nothing real
   drawn behind it, so neither can refract the *actual* page — only a
   copy of it. backdrop-filter instead reads the page's already-
   composited pixels live, and an SVG feDisplacementMap filter bends
   that live read — genuine per-frame refraction of the real content,
   for the cost of a single composited layer (no DOM cloning, no
   render-to-texture, GPU-composited like any other CSS filter). */
export default function FluidCursor({ size = 56, hoverSize = 72 }: FluidCursorProps) {
  const lensRef = useRef<HTMLDivElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  // Current values the rAF loop eases toward their targets — one loop,
  // one transform write per frame, so position, size and refraction
  // strength all settle together instead of each fighting its own
  // transition timing.
  const scale = useRef(1);
  const raf = useRef(0);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch devices have no persistent hover pointer to attach a lens
    // to, and reduced-motion visitors asked for exactly this kind of
    // effect to be off — both get the plain system cursor, which is
    // the correct "fallback" here rather than a degraded lens.
    if (isCoarse || reduced) return;

    const el = lensRef.current;
    const displace = displaceRef.current;
    const highlight = highlightRef.current;
    if (!el || !displace || !highlight) return;

    const restRefraction = size * 0.72;
    const hoverRefraction = hoverSize * 0.72;
    // Normal blending now (see the highlight-layer comment below), so
    // these read as direct alpha rather than an overlay-blend fraction
    // — hence the higher numbers than before.
    const restHighlight = 0.55;
    const hoverHighlightOpacity = 0.9;

    let seeded = false;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      if (!seeded) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        seeded = true;
      }
      el.style.opacity = "1";
    };
    window.addEventListener("pointermove", onMove);

    const onOver = (e: PointerEvent) => {
      hovering.current = !!(e.target as Element).closest?.(HOVER_SELECTOR);
    };
    window.addEventListener("pointerover", onOver);

    const tick = () => {
      // Position: chase the real pointer.
      pos.current.x += (pointer.current.x - pos.current.x) * 0.28;
      pos.current.y += (pointer.current.y - pos.current.y) * 0.28;

      // Size / refraction strength / highlight: chase the hover state,
      // slower than position so a hover pop-in feels like inertia, not
      // a snap.
      const targetScale = hovering.current ? hoverSize / size : 1;
      scale.current += (targetScale - scale.current) * 0.18;

      el.style.transform =
        `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${scale.current})`;

      const t = (scale.current - 1) / (hoverSize / size - 1 || 1);
      const clampedT = Math.min(1, Math.max(0, t));
      displace.setAttribute("scale", String(restRefraction + (hoverRefraction - restRefraction) * clampedT));
      highlight.style.opacity = String(restHighlight + (hoverHighlightOpacity - restHighlight) * clampedT);

      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [size, hoverSize]);

  return (
    <>
      {/* width/height 0: this SVG exists only to host the filter
          definition that the lens div references by id — it never
          renders anything itself. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="lens-refraction" x="-50%" y="-50%" width="200%" height="200%">
          {/* Raw turbulence displaces per-pixel and reads as static
              grain, not glass — blurring it into a smooth field first
              turns sharp noise into a gentle continuous warp, which is
              what actually sells "curved glass" over "distortion
              filter". */}
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="6" result="noiseSmooth" />
          <feDisplacementMap
            ref={displaceRef}
            in="SourceGraphic"
            in2="noiseSmooth"
            scale={size * 0.72}
            xChannelSelector="R"
            yChannelSelector="G"
          />
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
          width: hoverSize,
          height: hoverSize,
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.25s ease",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
        }}
      >
        {/* Warp layer: the actual glass. Separated from the highlight
            below because a filter and a background on the same element
            get distorted together, which smears the specular gloss
            into the noise instead of keeping it crisp on top. Sized to
            the hover-state box and centered, so the earlier JS scale()
            grows/shrinks it uniformly instead of resizing the element
            (transform-only keeps this off the layout/paint path). */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: size,
            height: size,
            margin: "auto",
            borderRadius: "50%",
            // Safari has no support for referencing an SVG filter from
            // backdrop-filter, so it silently falls back to just the
            // blur/saturate — still glassy, just without the warp.
            backdropFilter: "url(#lens-refraction) blur(0.3px) saturate(1.3) brightness(1.02) contrast(1.05)",
            WebkitBackdropFilter: "blur(5px) saturate(1.3) brightness(1.02)",
            background: "rgba(255,255,255,0.02)",
          }}
        />
        {/* Highlight layer: a faint off-center specular dot plus a
            Fresnel-style ring that brightens only near the rim — glass
            reflects more at grazing angles than head-on, so the edge
            reading brighter than the center is what makes this look
            like curved glass rather than a tinted disc.

            Deliberately NOT mix-blend-mode: overlay (what this shipped
            with first). Overlay composites as screen() on a light
            backdrop, and screen(white, anything) = white — so on a
            white/light-mode background the entire ring silently
            became a no-op and the lens vanished outright. Plain alpha
            compositing has no such blind spot: a light rim (visible on
            dark backgrounds) and a dark rim (visible on light ones)
            painted at the same time both stay visible on any
            background, because neither depends on the backdrop's own
            luminance to render. Opacity is tweened per-frame from the
            tick loop above. */}
        <div
          ref={highlightRef}
          style={{
            position: "absolute",
            inset: 0,
            width: size,
            height: size,
            margin: "auto",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.5), rgba(255,255,255,0) 34%), " +
              "radial-gradient(circle, transparent 58%, rgba(255,255,255,0.22) 82%, rgba(255,255,255,0.05) 100%)",
            boxShadow:
              "inset 0 1.5px 2px rgba(255,255,255,0.55), " +
              "inset 0 -2px 4px rgba(0,0,0,0.16), " +
              "inset 0 0 0 1px rgba(0,0,0,0.09), " +
              "0 1px 3px rgba(0,0,0,0.12)",
          }}
        />
      </div>
    </>
  );
}
