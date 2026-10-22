/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌​​​​‌​​‌‌​‌​‌​‌​‌​​​‌​‌‌​​​​​‌‌​‌​‌​​‌‌​‌‌​​‌‌‌​‌‌‌​‌​‌​‌​​​‌​​‌​‌‌​‌‌​​‌‌‌​‌​​‌‌‌‌​​‌‌​‌‌​​‌‌​​​​‌​‌‌‌​​‌​​‌​​‌‌‌​​​‌‌​​​​​‌​​​​​‌​‌‌​​​​‌​‌‌‌‌​​‌​​‌‌‌​​‌​‌​​‌​‌​​‌‌‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.XMTX56wTKgO6arN0Aay9Jy
 */
"use client";

import { useEffect, useRef, useState } from "react";

/* One IntersectionObserver, one boolean, fires once.

   This is the whole motion system now. Everything on the site that
   animates on scroll goes through here and gets the same treatment: the
   element crosses a threshold, a class flips, and CSS runs a single
   transition. Nothing is scrubbed against scroll position, so nothing
   re-renders while you are reading it, and there is no per-frame JS on
   the scroll path at all.

   Reduced motion resolves to `true` on the first tick instead of
   observing, so the content is simply present. */

/* One observer per root margin, shared by every element that asked for
   that margin — rather than one observer per element, which is what this
   hook used to create.

   The difference is not academic on the long route. Every heading, every
   grid and every tile on it calls this hook, so a page was standing up
   somewhere north of fifty IntersectionObservers, each holding a single
   target. The browser computes intersections for each registered observer
   separately, and the work is proportional to the number of observers as
   well as to the number of targets; fifty observers with one target each
   is the most expensive way to ask the same question fifty times. One
   observer with fifty targets is the cheap way.

   Keyed by root margin because that is the only option any caller varies,
   and two different margins are two genuinely different questions. The
   observers are module-level and deliberately never torn down: the set of
   distinct margins on the site is two, they are created on first use, and
   an observer with no remaining targets costs nothing. */
type Shared = {
  observer: IntersectionObserver;
  /* WeakMap, so an element that is removed from the document without its
     effect cleaning up — which React does not do, but which a stray
     innerHTML write or a browser extension can — does not keep its node
     alive through this table. */
  callbacks: WeakMap<Element, () => void>;
};

const shared = new Map<string, Shared>();

function sharedObserver(rootMargin: string): Shared {
  const existing = shared.get(rootMargin);
  if (existing) return existing;

  const callbacks = new WeakMap<Element, () => void>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const fire = callbacks.get(entry.target);
        /* Unobserved before the callback runs, not after. Every caller
           here is a fires-once reveal, so a target that has reported in
           has nothing left to say and should stop being measured — which
           is also what keeps the shared observer's target list shrinking
           to nothing as the visitor reads down the page. */
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
        fire?.();
      }
    },
    { rootMargin, threshold: 0.01 }
  );

  const entry = { observer, callbacks };
  shared.set(rootMargin, entry);
  return entry;
}

/* -8%, not -12%.

   The margin decides how far into the viewport an element has to be
   before it is allowed to arrive, and 12% of a desktop viewport is well
   over a hundred pixels — far enough that the element was fully on screen
   and visibly sitting there, un-animated, before anything happened to it.
   That is the half of "the scroll feels weak" that is not about frame
   rate: the page was consistently reacting after the fact. At 8% the
   reveal starts as the element crosses in, which is what makes the motion
   read as belonging to the scroll rather than trailing it. Still negative,
   so nothing animates while it is below the fold and a fast scroll does
   not waste the arrival off screen. */
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }

    const { observer, callbacks } = sharedObserver(rootMargin);
    callbacks.set(el, () => setInView(true));
    observer.observe(el);

    return () => {
      /* Unobserving an element the callback already retired is a no-op, so
         this is safe either way round. */
      callbacks.delete(el);
      observer.unobserve(el);
    };
  }, [rootMargin]);

  return { ref, inView };
}
