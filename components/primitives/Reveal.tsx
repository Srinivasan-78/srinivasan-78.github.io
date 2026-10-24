/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​‌​​​‌​​​​‌‌‌​​​​‌‌​​​‌​​‌‌​​‌‌​​‌‌‌​‌​​​‌‌‌​‌‌‌​‌‌​‌​‌‌​‌‌‌​​‌​​‌‌‌​​​‌​‌‌​​‌​​​‌‌​‌‌‌‌​‌‌​‌‌‌​​‌​‌‌​​​​‌‌‌​​‌​​‌​​‌‌‌‌​​‌‌​​​​​‌‌‌‌​‌​​​‌‌​​‌‌​‌‌‌​​‌‌​‌‌​​​‌​​‌​‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.9D8bftwkrqdonXrO0z3sbU
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
/* ONE OBSERVER FOR THE WHOLE PAGE, shared by every instance.
 *
 * Revision 12. This component used to construct its own
 * IntersectionObserver per element, which on the home page meant
 * twenty-three of them and on /projects more — each with its own root
 * bookkeeping, and all twenty-three created during the same hydration
 * pass that the browser is already spending its first few hundred
 * milliseconds on. The options were identical in every case, so the
 * observers were identical, so they could be one.
 *
 * A single observer with many targets is the arrangement the API is
 * actually designed for: `entries` arrives as a batch, the browser
 * computes intersections for all targets in one pass off the main
 * thread, and there is one callback instead of twenty-three.
 *
 * It is created lazily on the first `observe` rather than at module
 * scope, so importing this file on the server — or on a client where
 * nothing reveals — constructs nothing. */
const REVEAL_OPTIONS: IntersectionObserverInit = {
  /* A negative bottom margin means an element has to be properly
     on screen before it animates, not merely one pixel in. */
  rootMargin: "0px 0px -8% 0px",
  threshold: 0.05,
};

let shared: IntersectionObserver | null = null;

/* The live targets, as a SET rather than a count, and that choice is
   load-bearing rather than taste.
 *
 * `unobserve` is reached by two paths that can both run for the same
 * element — the callback drops it once it has revealed, and the effect
 * cleanup drops it on unmount — so the bookkeeping has to be
 * idempotent. A counter can be made idempotent with a flag, but it
 * still has a hole: if one entry in a batch takes the count to zero
 * the observer is torn down mid-loop, and the later entries in that
 * same batch are then operating against a disconnected observer and a
 * stale flag. A double-decrement that follows disconnects a NEW
 * observer early, and the elements still waiting on it never reveal
 * until their 2.5s floor fires — i.e. the page quietly stops
 * animating.
 *
 * A set has no such state to get wrong: membership IS the flag,
 * `delete` is naturally idempotent, and `size` is always the truth. */
const watched = new Set<HTMLElement>();

function reveal(el: HTMLElement) {
  /* The per-instance delay rides on the element rather than in a map
     keyed by it: it is already a DOM-shaped fact, it needs no cleanup,
     and it cannot leak a detached node the way a Map would. */
  const delay = Number(el.dataset.revealDelay) || 0;
  window.setTimeout(() => {
    el.dataset.shown = "true";
  }, delay);
}

function observe(el: HTMLElement) {
  if (!shared) {
    shared = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        /* Reveal BEFORE dropping it, so an element always animates
           even if dropping it is what tears the observer down. */
        reveal(target);
        /* Fires once per element. Scrolling back up must not replay
           anything — a thing that re-animates every time it passes the
           viewport is a thing still demanding attention after you have
           read it. */
        unobserve(target);
      }
    }, REVEAL_OPTIONS);
  }
  if (watched.has(el)) return;
  watched.add(el);
  shared.observe(el);
}

function unobserve(el: HTMLElement) {
  if (!shared || !watched.delete(el)) return;
  shared.unobserve(el);
  /* Torn down when the last target goes, rather than outliving the
     page that needed it. A later mount builds a fresh one. */
  if (watched.size === 0) {
    shared.disconnect();
    shared = null;
  }
}

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

    el.dataset.revealDelay = String(delay);
    observe(el);

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
      unobserve(el);
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
