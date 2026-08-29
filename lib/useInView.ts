/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​‌​‌​​‌‌​‌​‌​‌​‌​​​​​​‌‌​‌‌​​‌‌​‌​​‌​‌​​‌​‌​​‌​‌​‌​‌​‌‌​‌‌​​​‌​​‌‌‌​​‌‌‌​‌‌​​‌‌​​‌‌​​​‌‌​​‌​​‌​​‌​‌‌​‌‌​‌‌​‌​‌​‌​​‌​​‌​​​​‌​​‌​‌​​‌‌​‌​‌​‌​‌​‌​‌​​​‌​‌‌‌​​​​​‌​​​‌‌‌​‌​‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.e5P6iJUlNvf2KmRBSUQpGY
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
export function useInView<T extends HTMLElement>(rootMargin = "0px 0px -12% 0px") {
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

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
