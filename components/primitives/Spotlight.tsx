/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌​​​‌​‌​‌‌‌​‌‌‌‌​‌​​‌​​‌​‌‌​‌​‌‌‌‌‌​‌​‌‌​‌​​‌​‌​‌​​​‌​​​​​‌​‌​​​‌‌​​‌​‌​‌​​​‌​​‌​‌​​‌‌​‌‌‌​​‌‌‌‌​​‌​‌​​​‌​‌​​‌‌​​‌​​‌‌​‌‌​​​‌​‌‌​‌​​​‌‌​‌‌‌​‌​‌​‌‌‌​‌​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.LWzK_ZTAFTJnyE2lZ7WWeV
 */
"use client";

import { useCallback, useRef, type ReactNode } from "react";

/* One pointer listener that publishes the cursor position as two
 * custom properties on its host, for anything inside to read.
 *
 * WHAT IT IS ACTUALLY USED FOR, as of revision 13: the home cover, and
 * only the home cover, which needs `--mx`/`--my` for the reticle in
 * §5e. Custom properties inherit, so the reticle reads them off the
 * host with nothing else wired up.
 *
 * It was BUILT for a different job — the reactbits "magic bento" glow,
 * where you wrap a grid, give each cell `.spotlight`, and every cell
 * lights the part of itself nearest the cursor. That job has no
 * consumer on this site and has not had one; the per-cell write loop
 * that served it was deleted in revision 13 after it was found walking
 * the DOM sixty times a second to update zero elements. See the note
 * in `onMove` before reinstating it, because the obvious reinstatement
 * reintroduces a repaint bug that was removed elsewhere.
 *
 * Three things keep it honest:
 *
 * One, it never re-renders. The coordinates go straight onto the DOM
 * node with setProperty — routing them through useState would re-render
 * the whole subtree on every mousemove, which is how this effect
 * usually ends up janky.
 *
 * Two, the write is throttled to one per animation frame. A pointer can
 * fire far more often than the screen refreshes, and the extra writes
 * are invisible work.
 *
 * Three, no JavaScript means no effect, not a broken one: with the
 * properties unset every consumer falls back to a resting value and
 * renders exactly as it would without this wrapper. Both the reticle
 * and the dead cell glow are gated behind `@media (hover: hover)` in
 * CSS too, so a touch device never gets a stuck highlight where the
 * finger last was. */

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

      /* REVISION 13 — THE PER-CELL LOOP IS GONE, because it had no
         cells to write to.
       *
         What was here walked `host.querySelectorAll(".spotlight")` on
         every pointer frame and wrote two properties per result. It
         was correct code for the grid use case described in the header
         — and NOTHING ON THIS SITE CARRIES `.spotlight`. The only
         consumer of this component is the home cover, which wraps it
         for the reticle, and the reticle reads the host's own
         properties by inheritance. So the query returned an empty
         NodeList sixty times a second, forever, on the one page where
         the frame budget is already tightest.
       *
         A `querySelectorAll` that matches nothing is cheap but it is
         not free: it is a full descendant walk of the cover's subtree,
         and it ran inside the rAF callback alongside the layout read
         above it. Deleting it is the whole saving — there is no
         replacement, because inheritance was already doing the job.
       *
         IF THE GRID CASE COMES BACK, do not restore this loop as it
         was. `.spotlight::before` in §5d positions a radial gradient
         at `var(--mx) var(--my)`, and a gradient whose geometry is
         driven by a custom property re-rasterises the element on every
         change — the exact bug revision 13 removed from `.reticle`,
         which would here be paid once per cell. The compositable
         shape is a fixed-size glow element translated into position.
         The dead paint is left in the stylesheet, with that warning on
         it, rather than being deleted and silently reintroduced. */
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
