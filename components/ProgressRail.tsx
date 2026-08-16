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

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
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

    measure();
    current = target;
    tick();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      running = false;
      cancelAnimationFrame(raf.current);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
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
