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

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };

    // Ease the bar toward the real value rather than snapping to it, so
    // the rail glides with Lenis instead of stuttering ahead of it.
    const tick = () => {
      current += (target - current) * 0.12;
      bar.style.transform = `scaleX(${current})`;
      const rounded = Math.round(current * 100);
      if (rounded !== last) {
        pct.textContent = String(rounded).padStart(2, "0") + "%";
        last = rounded;
      }
      raf.current = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    raf.current = requestAnimationFrame(tick);

    return () => {
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
