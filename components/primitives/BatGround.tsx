/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​‌​​​‌​‌​​‌‌​​‌‌​‌​​​‌​‌​‌​​​‌​​‌​‌‌​‌​​‌​‌‌​‌​‌​‌‌‌​‌​​​​‌​​​‌‌​‌‌​​‌​‌‌​‌​​​‌​‌‌​‌​‌‌​​​‌‌​‌‌​​‌‌‌​​‌‌​‌‌‌​​‌‌​​‌​​‌‌‌​​​‌​‌‌​‌​​​​​‌​‌‌​‌​‌‌​​‌​​​‌​​​​‌‌​‌​​‌‌‌‌​‌​‌​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.dS4TKKWB6Z-cg72qh-dCOW
 */
import BatGlyph from "./BatGlyph";
import { groundMark } from "@/lib/batGround";

/* The page ground: one large bat, fixed behind every page.
 *
 * Mounted once in app/layout.tsx.
 *
 * REVISION 8 — one mark, not four. This drew four era logos in four
 * quadrants; the owner asked for a single high-resolution image
 * instead, which is the better call for a reason the four-up never
 * solved: four marks at four corners are four things to notice, and a
 * ground should be one thing you stop noticing. The art is reduced
 * from his own wallpaper — the glossy render separated from its
 * backdrop and flattened to ink, so it themes instead of fighting the
 * palette. See lib/batGround.ts.
 *
 * THE FOUR CONSTRAINTS HE SET, and how each is met:
 *
 *   "faint"            — 5% on paper, 8% on the slab. Dark gets more
 *                        because a light mark on near-black at 5%
 *                        disappears, while dark ink on bone at 8%
 *                        starts to read as a shape rather than a tint.
 *   "visible even when
 *    animations are
 *    reduced"          — there is no animation here at all. Not an
 *                        animation that gets disabled: none authored.
 *                        Nothing can be reduced away, which is the
 *                        only real guarantee of what he asked for.
 *   "must not interfere
 *    with any elements" — `fixed`, `inset: 0`, `z-index: 0`,
 *                        `pointer-events: none`, `aria-hidden`. Out of
 *                        flow, out of the tab order, out of the
 *                        accessibility tree, and it cannot take a
 *                        click. §5h gives every other direct child of
 *                        <body> `z-index: 1`, so the whole document
 *                        floats above it without each section opting
 *                        in.
 *   "subtle"           — the mark is masked radially so its own alpha
 *                        reaches zero before the edges of the
 *                        viewport. It therefore has no boundary to
 *                        collide with anything, which is the §5b
 *                        feathering rule applied to a single image.
 *
 * WHY FIXED RATHER THAN ABSOLUTE. A ground that scrolled with a
 * 7000px dossier would be off screen for nine screenfuls in ten.
 * Fixed means it sits still while the page moves over it — which is
 * also what a wall does, and this is meant to read as something the
 * page is printed on. */
export default function BatGround() {
  const mark = groundMark();

  return (
    <div className="bat-ground" aria-hidden="true">
      {mark ? (
        /* A plain <img>, not next/image: a decorative static asset on
           an unoptimized static export gains nothing from the wrapper
           and the srcset. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mark.src}
          alt=""
          /* Intrinsic size, read off the file at build time. The CSS
             overrides both with `width: 128vw; height: auto`, but the
             attributes still give the browser the aspect ratio before
             the bytes land, which is what stops a layout shift. */
          width={mark.width}
          height={mark.height}
          /* REVISION 12. This is the first <img> in the body and it is
             genuinely inside the viewport, so the browser was treating
             it as a candidate for the largest contentful paint and
             emitting a `rel=preload` for it in <head> — ahead of the
             stylesheet, alongside the four font preloads. A 10 KB
             decoration behind the entire document was therefore
             competing for the opening connection with the type the
             headline is set in.

             `fetchPriority="low"` states the truth instead: it is in
             view, so lazy-loading would be wrong and would only make
             it arrive late with a visible fade-in, but nothing waits
             on it. `decoding="async"` keeps the decode off the main
             thread, which matters because this is the largest raster
             on the page and the decode would otherwise land in the
             same window as hydration. */
          fetchPriority="low"
          decoding="async"
          className="bat-ground-mark"
        />
      ) : (
        /* Honestly a fallback, and not labelled as anything else. */
        <BatGlyph className="bat-ground-mark" />
      )}
    </div>
  );
}
