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
  const dotRef = useRef<HTMLDivElement>(null);
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
    const dot = dotRef.current;
    const displace = displaceRef.current;
    const highlight = highlightRef.current;
    if (!el || !dot || !displace || !highlight) return;

    const restRefraction = size * 0.72;
    const hoverRefraction = hoverSize * 0.72;
    // Rest state stays faint on purpose — "almost invisible on simple
    // backgrounds" was the point, with the warp/blur doing the work of
    // making it noticeable over actual content. Hover pushes it up so
    // interactive elements get a clearer glass cue.
    const restHighlight = 0.35;
    const hoverHighlightOpacity = 0.7;

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
      dot.style.opacity = "1";
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
      // Dot rides the same eased position but is never itself scaled —
      // it's the "still visible even if the glass isn't" marker, so it
      // stays a fixed small size regardless of hover/rest lens size.
      dot.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;

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
      {/* Fallback dot: a fixed marker at the exact cursor position,
          independent of the glass entirely — if backdrop-filter is
          unsupported, blocked, or just fails to paint for some reason
          on a given machine, this is what's left instead of nothing.
          mix-blend-mode: difference inverts whatever's under it, so a
          plain white dot reads as visible on any background color
          without needing a light/dark branch. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          // z-index 151: above Nav (50) and the lightbox modal (100).
          // pointer-events: none is what actually keeps clicks passing
          // through to whatever's underneath — stacking order plays no
          // part in that, so there's no reason to keep the cursor
          // *behind* UI it needs to stay visible over.
          zIndex: 151,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#fff",
          mixBlendMode: "difference",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.25s ease",
        }}
      />
      <div
        ref={lensRef}
        className="fluid-cursor"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          // z-index 150: same reasoning as the dot above — nothing
          // depends on this being below Nav/the lightbox, and hovering
          // either used to leave no cursor visible at all.
          zIndex: 150,
          width: hoverSize,
          height: hoverSize,
          borderRadius: "50%",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.25s ease",
          filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.1))",
        }}
      >
        {/* Base glass: real blur/saturate on the actual backdrop, no
            url() in the mix. Split out from the warp layer below on
            purpose — a browser that rejects the SVG-filter reference
            in backdrop-filter drops the ENTIRE declaration it's part
            of, not just that one function, so combining them in one
            list meant an unsupported warp took the blur down with it.
            This layer alone is the "simpler fallback" the spec asked
            for: on any browser without displacement-map support, this
            is what's left, and it's still real glass, not a fake
            gradient — no browser is ever left with nothing. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: size,
            height: size,
            margin: "auto",
            borderRadius: "50%",
            backdropFilter: "blur(3px) saturate(1.35) contrast(1.06) brightness(1.03)",
            WebkitBackdropFilter: "blur(3px) saturate(1.35) contrast(1.06) brightness(1.03)",
            background: "rgba(255,255,255,0.025)",
          }}
        />
        {/* Warp layer: displacement only, stacked on top of the base
            glass so it bends the already-blurred read (still the real
            backdrop, just softened). Kept to a single filter function
            so an unsupported url() only drops this div's own (already
            near-invisible without it) effect, never the base blur. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: size,
            height: size,
            margin: "auto",
            borderRadius: "50%",
            backdropFilter: "url(#lens-refraction)",
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
            // Stops pulled in to 78%+ instead of starting at 34–58%: a
            // real Fresnel edge is a thin bright/dark rim right at the
            // silhouette, not a gradient filling most of the disc — the
            // wide version was covering the middle even where there was
            // nothing behind it to justify the shading, which is what
            // read as "solid ball" over a plain background.
            background:
              "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.3), rgba(255,255,255,0) 16%), " +
              "radial-gradient(circle, transparent 80%, rgba(255,255,255,0.16) 93%, rgba(255,255,255,0.03) 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.4), " +
              "inset 0 -1px 2px rgba(0,0,0,0.12), " +
              "inset 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        />
      </div>
    </>
  );
}
