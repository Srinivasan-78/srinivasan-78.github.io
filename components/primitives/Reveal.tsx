/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌‌​​​‌‌‌‌​​​​‌‌‌​​​​​‌‌‌‌​​​​‌‌‌​​​​​‌​‌​‌‌‌​‌‌​​‌​​​​‌‌​‌‌​​‌​‌‌​​​​‌‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​‌‌​​‌​‌‌‌‌‌​​‌‌​‌​‌​‌​​​‌​‌​​‌‌​​‌​​‌‌​‌​‌​​‌​​‌‌​​​‌​​​​​‌​‌‌​‌‌​​​‌‌​​​​‌​‌‌​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.lxpxpWd6XsyV_5E2jLAlan
 */
"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/* The one piece of motion on the site: an 8px rise on first sight.

   Three constraints it has to respect, all from the brief.

   One, it must never hide content. The transition starts at opacity 0,
   so if the observer never fires the page is blank. That is why the
   initial state lives behind `html.js .reveal` in globals.css — the
   flag is set by BootScript before paint, so a visitor with scripting
   off or broken gets the content with no animation at all rather than
   an empty page.

   Two, it fires once. `unobserve` on first intersection, so scrolling
   back up does not replay anything. A thing that re-animates every
   time it passes the viewport is a thing that is still demanding
   attention after you have read it.

   Three, prefers-reduced-motion removes it entirely — handled in CSS
   rather than here, so there is no window in which the JS has not yet
   read the media query. */

/* Which entrance to use. All four are driven by the same observer and
   the same `data-shown` flag — only the CSS differs, which is why this
   is one component with a prop rather than four near-identical ones.

   rise  — opacity and 10px of travel. For body copy, where a
           directional wipe would be fussy.
   wipe  — a hard edge travelling across the element. For panels and
           headlines: a comic panel is read one edge at a time, and a
           fade has no direction while this does.
   draw  — stroke-dashoffset on a child SVG, so the real geometry inks
           itself. For the schematic rules and the pipeline.
   none  — no entrance; just sets `data-shown`, for a caller that wants
           to drive something else off it.

   Revision 3 adds three more for detective mode (globals.css §5e).
   They are effects on this component rather than a second
   observer-driven component, for the reason recorded in the
   SectionHead note in docs/redesign-todo.md: the moment two components
   own the same anatomy they drift, and an entrance is an anatomy.

   sweep — a bright line crosses the element once. Unlike `wipe` this
           does not hide the content first, so it composes with the
           others: a panel can be `wipe` on the outside and `sweep` on
           the inside and read as one gesture.
   xray  — display type arrives as a cyan outline and fills in.

   There was a `chain` effect here too, for the games board's traced
   spine. Revision 7 replaced that board with genre segments and the
   effect went with the thing it drew — see the note where its CSS
   used to be in globals.css §5e. */
export type RevealEffect =
  | "rise"
  | "wipe"
  | "draw"
  | "sweep"
  | "xray"
  | "none";

const EFFECT_CLASS: Record<RevealEffect, string> = {
  rise: "reveal",
  wipe: "wipe",
  draw: "drawn",
  sweep: "sweep",
  xray: "xray",
  none: "",
};

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  effect?: RevealEffect;
  /** Stagger within a group, in ms. Keep under ~120ms total across a
      row: a stagger long enough to notice is a stagger that delays. */
  delay?: number;
  /** For `draw`: the dash length to animate. It only has to be at
      least as long as the longest path — an overshoot just means the
      line starts further off-stage, which is invisible. */
  drawLength?: number;
  className?: string;
};

export default function Reveal({
  children,
  as: Tag = "div",
  effect = "rise",
  delay = 0,
  drawLength = 1200,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* No IntersectionObserver (or a test environment without one):
       show the content immediately. Degrading to visible is the only
       acceptable direction for this component to fail in. */
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.shown = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          window.setTimeout(() => {
            target.dataset.shown = "true";
          }, delay);
          io.unobserve(target);
        }
      },
      /* A negative bottom margin means an element has to be properly
         on screen before it animates, not merely one pixel in. */
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    io.observe(el);

    /* The safety net.
     *
     * `wipe` and `xray` both START by hiding their content — one clips
     * it away, the other makes the fill transparent. That is fine while
     * the observer is guaranteed to fire, and the no-script case is
     * already covered by the `html.js` gate. But it leaves one failure
     * mode with no floor: if the observer somehow never fires for an
     * element, that element's content stays invisible FOREVER while
     * still occupying its full height — which presents as a page of
     * correctly-spaced empty boxes.
     *
     * So the flag is also set unconditionally after a timeout. If the
     * observer has already done its job this is a no-op write of the
     * same value and nothing re-animates, because the animations are
     * keyed on the attribute rather than triggered by the write. The
     * cost is one timer per revealed element; the benefit is that
     * "invisible content" is no longer reachable by any path.
     *
     * Two and a half seconds is chosen to be far longer than any
     * legitimate scroll-into-view, so it never pre-empts the real
     * entrance on a normal page load. */
    const floor = window.setTimeout(() => {
      if (ref.current) ref.current.dataset.shown = "true";
    }, 2500 + delay);

    return () => {
      io.disconnect();
      window.clearTimeout(floor);
    };
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={[EFFECT_CLASS[effect], className].filter(Boolean).join(" ")}
      /* Passed as a custom property rather than a class so a caller can
         tune it per instance without a new utility for every length. */
      style={effect === "draw" ? { ["--draw-len" as string]: drawLength } : undefined}
    >
      {children}
    </Tag>
  );
}
