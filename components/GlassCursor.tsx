"use client";

import { useEffect, useRef } from "react";
import GlassSurface from "./GlassSurface";

type GlassCursorProps = {
  /** Lens diameter at rest, px. */
  size?: number;
  /** Lens diameter while hovering an interactive element, px. */
  hoverSize?: number;
};

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

/* Cursor-following glass lens, every route — the same GlassSurface the
   sticky header uses, shaped into a disc and moved with the pointer.

   Same mechanics as the header: an SVG displacement map bent through
   backdrop-filter, so it refracts whatever the page is painting behind
   it rather than a scene of its own. That is why this works everywhere
   and the WebGL lens it replaced only ever worked inside its canvas.

   Every distance in that map is measured in element pixels, so the
   header's numbers do not carry over to a 30px disc — a -110 scale
   would displace nearly four lens-widths and sample past the element
   entirely. The props below are the header's look re-derived at cursor
   size: edge band, blur, distortion and channel offsets all expressed
   as fractions of `size`. */
export default function GlassCursor({ size = 30, hoverSize = 46 }: GlassCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const scale = useRef(1);
  const raf = useRef(0);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No persistent pointer to attach a lens to on touch, and
    // reduced-motion asked for this class of effect off. Both keep the
    // plain system cursor.
    if (isCoarse || reduced) return;

    const el = cursorRef.current;
    if (!el) return;

    let seeded = false;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      // Snap to the first real position rather than easing in from
      // (0,0), so the lens doesn't slide in from the corner on load.
      if (!seeded) {
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
        seeded = true;
        // Snapped, not faded. An ancestor at opacity < 1 is a backdrop
        // root: the lens would sample only what is inside this wrapper
        // — nothing — and refract air for the whole fade.
        el.style.opacity = "1";
      }
    };
    window.addEventListener("pointermove", onMove);

    const onOver = (e: PointerEvent) => {
      hovering.current = !!(e.target as Element).closest?.(HOVER_SELECTOR);
    };
    window.addEventListener("pointerover", onOver);

    const tick = () => {
      pos.current.x += (pointer.current.x - pos.current.x) * 0.3;
      pos.current.y += (pointer.current.y - pos.current.y) * 0.3;

      // Scale eases slower than position, so opening over a link reads
      // as a deliberate focus change rather than jitter.
      const target = hovering.current ? hoverSize / size : 1;
      scale.current += (target - scale.current) * 0.2;

      el.style.transform =
        `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${scale.current})`;

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
    <div ref={cursorRef} className="glass-cursor" aria-hidden="true" style={{ width: size, height: size }}>
      <GlassSurface
        width={size}
        height={size}
        borderRadius={size / 2}
        /* A quarter of the radius as glass edge. The header's 0.07 is
           a hairline on a 1900px bar and would vanish here. */
        borderWidth={0.5}
        brightness={58}
        opacity={0.93}
        blur={Math.round(size * 0.12)}
        displace={0.5}
        /* Frost, not fog: the header can sit at 0.72 because text
           needs a backing, but past ~0.15 a disc this small stops
           being a lens and becomes a dot. */
        backgroundOpacity={0.1}
        saturation={1.6}
        distortionScale={-Math.round(size * 0.8)}
        redOffset={0}
        greenOffset={Math.round(size * 0.12)}
        blueOffset={Math.round(size * 0.24)}
      />
    </div>
  );
}
