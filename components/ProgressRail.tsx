/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌‌​‌​‌​​‌​​‌​​​‌​‌​‌‌​​‌‌‌​‌‌‌​‌​​​‌​‌​​‌‌​​‌‌​​​​​‌​‌​​​‌​​‌‌​​‌‌​‌​​‌‌‌‌​‌​‌​‌​‌​​‌‌​​‌​​‌​​​​‌‌​‌‌​‌​‌‌​‌​‌​‌‌‌​‌‌​‌‌‌‌​‌‌‌‌​​​​‌​​​​‌​​‌‌​‌​‌​​‌​​‌‌​‌​‌‌​‌‌​‌​‌​‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.cREgtS0Q3OU2CkWoxBjMmP
 */
"use client";

import { useEffect, useRef } from "react";

/* A hairline at the top of the viewport showing how far down the page
   you are. The only piece of ambient chrome left on the site.

   The percentage pill that used to sit in the corner alongside it is
   gone: it was a second readout of the same fact, parked over the
   content, in a corner that on a phone already belongs to the CTA bar
   and the chat launcher.

   No smoothing loop either. That existed to keep the bar in step with
   Lenis's interpolated scroll position; with native scrolling the real
   value is already the right one, so this writes it directly from a
   passive listener and never schedules a frame of its own. */
export default function ProgressRail() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    /* Scrollable distance, cached. Reading scrollHeight forces the browser
       to lay the document out, and this ran on every scroll event — a full
       layout per event, on the one device that cannot spare it. It only
       changes when the page does, so it is measured then instead. */
    let max = 0;
    let queued = false;

    const paint = () => {
      queued = false;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    // Coalesce to one write per frame: a trackpad can fire scroll events
    // faster than the compositor paints them.
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    const remeasure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
      onScroll();
    };

    remeasure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    /* Lazy images and font swaps change the document height after load, and
       neither fires a resize. Without this the rail reaches 100% early and
       then sits there for the rest of the page. */
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <div className="rail" aria-hidden="true">
      <div ref={barRef} className="rail-bar" />
    </div>
  );
}
