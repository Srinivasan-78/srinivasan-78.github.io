"use client";

import { useEffect, useRef } from "react";

type SystemCursorProps = {
  /** Reticle diameter at rest, px. */
  size?: number;
  /** Reticle diameter while hovering an interactive element, px. */
  hoverSize?: number;
};

const HOVER_SELECTOR = 'a, button, input, textarea, select, [role="button"], [data-cursor-hover]';

/* Cursor-following status reticle — a target/scan ring, the same
   visual language as the health-check region list and the "open to
   opportunities" pulse dot elsewhere on this site, instead of a
   decorative glass lens.

   Deliberately plain CSS + SVG, no backdrop-filter and no WebGL. The
   glass version it replaces relied on `url()` SVG filters inside
   backdrop-filter, which is unsupported or unreliable outside
   Chromium — when the browser rejected it, the *entire* filter
   declaration dropped, so the effect either silently failed or
   rendered as a flat shaded blob. This has no such failure mode: it's
   a stroke and two dots, rendered the same way in every browser.

   mix-blend-mode: difference inverts whatever's directly under the
   reticle, so a single white stroke reads as dark-on-light and
   light-on-dark automatically — no theme branch needed, and no risk
   of vanishing on a light background the way the old highlight layer
   did. */
export default function SystemCursor({ size = 22, hoverSize = 34 }: SystemCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const hovering = useRef(false);
  const scale = useRef(1);
  const raf = useRef(0);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch devices have no persistent hover pointer to attach a
    // reticle to, and reduced-motion visitors asked for this class of
    // effect to be off — both keep the plain system cursor.
    if (isCoarse || reduced) return;

    const el = cursorRef.current;
    if (!el) return;

    let seeded = false;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      // Snap to the first real position instead of easing in from the
      // (0,0) default, so the reticle doesn't visibly slide in from
      // the corner on the first move of every page.
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
      pos.current.x += (pointer.current.x - pos.current.x) * 0.3;
      pos.current.y += (pointer.current.y - pos.current.y) * 0.3;

      // "Lock-on" scale: the reticle pulls open slightly over anything
      // interactive, easing more slowly than position so it reads as
      // a deliberate focus change rather than jitter.
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
    <div
      ref={cursorRef}
      className="system-cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        // 150: above Nav (50) and the lightbox modal (100) — the glass
        // version originally sat below Nav on the theory that mattered
        // for clicks, but pointer-events: none (below) is what
        // actually guarantees that, so there's no reason for the
        // cursor to render invisible behind UI it needs to stay above.
        zIndex: 150,
        width: size,
        height: size,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.25s ease",
        mixBlendMode: "difference",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20" style={{ overflow: "visible", display: "block" }}>
        {/* Locked-on center point. */}
        <circle cx="10" cy="10" r="1.3" fill="#fff" />
        {/* Scan ring — open, not a filled disc, so it reads as a
            reticle rather than a cursor blob. */}
        <circle cx="10" cy="10" r="7" fill="none" stroke="#fff" strokeWidth="1" opacity="0.85" />
        {/* Four corner ticks: the camera/targeting-reticle cue. */}
        <line x1="10" y1="-2" x2="10" y2="1.5" stroke="#fff" strokeWidth="1" />
        <line x1="10" y1="18.5" x2="10" y2="22" stroke="#fff" strokeWidth="1" />
        <line x1="-2" y1="10" x2="1.5" y2="10" stroke="#fff" strokeWidth="1" />
        <line x1="18.5" y1="10" x2="22" y2="10" stroke="#fff" strokeWidth="1" />
      </svg>
    </div>
  );
}
