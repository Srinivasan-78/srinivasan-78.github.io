"use client";

import { useEffect, useRef } from "react";

export default function ProgressRail() {
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const bar = barRef.current;
    const pct = pctRef.current;
    if (!bar || !pct) return;

    let target = 0;
    let current = 0;
    let last = -1;
    let running = false;

    /* Scrollable distance, cached. Reading scrollHeight forces the browser
       to lay the document out, and this ran on every scroll event — a full
       layout per event, on the one device that cannot spare it. It only
       changes when the page does, so it is measured then instead. */
    let max = 0;
    const remeasure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
      measure();
    };

    const measure = () => {
      target = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      start();
    };

    /* Ease the bar toward the real value rather than snapping to it, so
       the rail glides with Lenis instead of stuttering ahead of it — but
       park the loop once it has converged. Previously this rAF ran for
       the life of the page whether or not anything moved, keeping the
       main thread awake on every route even while the user sat still
       reading. */
    const tick = () => {
      current += (target - current) * 0.12;

      if (Math.abs(target - current) < 0.0005) {
        current = target;
        running = false;
      }

      bar.style.transform = `scaleX(${current})`;
      const rounded = Math.round(current * 100);
      if (rounded !== last) {
        pct.textContent = String(rounded).padStart(2, "0") + "%";
        last = rounded;
      }

      if (running) raf.current = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf.current = requestAnimationFrame(tick);
    };

    remeasure();
    current = target;
    tick();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", remeasure);
    /* Lazy images and font swaps change the document height after load, and
       neither fires a resize. Without this the rail reaches 100% early and
       then sits there for the rest of the page. */
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);

    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", remeasure);
    };
  }, []);

  return (
    <>
      <div className="rail">
        <div ref={barRef} className="rail-bar" />
      </div>
      <span className="rail-pct" aria-hidden="true">
        <span ref={pctRef}>00%</span>
      </span>
    </>
  );
}
