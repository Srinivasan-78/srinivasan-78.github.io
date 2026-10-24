/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌‌‌‌​​‌‌​‌​‌​‌‌​‌​​​​​‌‌​​​‌​‌​​‌​​​​‌​‌‌​‌​​‌‌‌​‌​‌​‌‌‌‌​​​​‌​​​​‌‌​‌​​‌‌‌‌​‌​‌​​‌‌​‌‌​​‌​​​‌​​‌​‌‌​‌​‌‌​​​​‌​‌​​‌​​‌​‌‌​​‌​​‌‌​​​‌​‌‌‌‌​‌​​‌‌​‌​‌​​‌​​‌‌‌‌​​‌‌‌​​​​‌‌​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.o5h1HZuxCOSdKXRY1zjO8g
 */
"use client";

import { useCallback, useRef, type ReactNode } from "react";

/* Pointer spotlight over a grid — the reactbits "magic bento" idea,
 * rebuilt as two custom properties.
 *
 * Wrap a grid in this and give each cell `.spotlight`. The wrapper
 * writes --mx/--my once per pointer move and every cell lights the part
 * of itself nearest the cursor, because each cell's own
 * `background: radial-gradient(... at var(--mx) var(--my))` resolves
 * against its own box. One listener and two properties for a
 * twenty-cell grid, rather than per-cell state and twenty re-renders.
 *
 * Three things keep it honest:
 *
 * One, it never re-renders. The coordinates go straight onto the DOM
 * node with setProperty — routing them through useState would re-render
 * the whole grid on every mousemove, which is how this effect usually
 * ends up janky.
 *
 * Two, the write is throttled to one per animation frame. A pointer can
 * fire far more often than the screen refreshes, and the extra writes
 * are invisible work.
 *
 * Three, no JavaScript means no effect, not a broken one: with the
 * properties unset the gradient sits at 50%/50% at zero opacity and the
 * cells render exactly as they would without this wrapper. The glow is
 * also gated behind `@media (hover: hover)` in CSS, so a touch device
 * never gets a stuck highlight where the finger last was. */

type SpotlightProps = {
  children: ReactNode;
  className?: string;
};

export default function Spotlight({ children, className = "" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    /* Coalesce to one write per frame. */
    if (frame.current) return;
    const { clientX, clientY } = e;

    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const host = ref.current;
      if (!host) return;

      /* Position is resolved per cell, not per grid: each `.spotlight`
         cell needs the pointer in *its own* coordinate space, so the
         percentages are computed against each cell's rect. Reading
         rects for every cell on every frame would be a layout thrash,
         so the grid writes pixel offsets relative to itself and each
         cell corrects using its own offset position — which is static
         and therefore free. */
      const rect = host.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      /* The host carries the coordinates too, not just the cells.
         Custom properties inherit, so anything dropped inside the host
         that is not itself a `.spotlight` cell — the detective reticle
         in §5e is the one that needs this — resolves against the
         host's own box without a second listener. Cells still override
         with their own values below, which is what keeps the per-cell
         glow correct. */
      host.style.setProperty("--mx", `${x}px`);
      host.style.setProperty("--my", `${y}px`);

      for (const cell of Array.from(
        host.querySelectorAll<HTMLElement>(".spotlight")
      )) {
        cell.style.setProperty("--mx", `${x - cell.offsetLeft}px`);
        cell.style.setProperty("--my", `${y - cell.offsetTop}px`);
      }
    });
  }, []);

  const onLeave = useCallback(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight-host ${className}`}
    >
      {children}
    </div>
  );
}
