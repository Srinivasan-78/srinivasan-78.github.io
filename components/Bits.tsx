"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/* useLayoutEffect warns during SSR, where it is a no-op anyway. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* Small animated UI primitives, written for this project.

   These are originals in the same spirit as React Bits. The real React
   Bits components the site uses — LogoLoop, ClickSpark, BorderGlow,
   ProfileCard, Lanyard — live in components/ui/, ported to TypeScript
   and kept diffable against upstream. This file is the local pair to
   them, not a placeholder for them. */

/** Counts up to `value` once it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className,
  style,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  /* Starts at the real value, not at zero. The server renders this
     component too, so a visitor with scripting off — or anyone reading
     the page before hydration — used to get a row of zeros where the
     numbers should be. The count is reset to zero below, inside a layout
     effect, so it happens before the browser paints and there is no
     flash of the final figure. */
  const [n, setN] = useState(value);
  const done = useRef(false);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);

    // Tracked so teardown can stop it. Disconnecting the observer alone
    // leaves an in-flight rAF loop running against an unmounted node.
    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          io.unobserve(e.target);

          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // easeOutExpo — fast start, long settle
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setN(Math.round(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {n}
      {suffix}
    </span>
  );
}
