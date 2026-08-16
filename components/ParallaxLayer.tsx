"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Depth-scrolls any block of content as it passes the viewport.

   Parallax needs *contrast* to read — one element moving is just an
   animation. Give siblings different `speed` values (a heading at 0.3,
   its image at -0.5) and the gap between them opens and closes as you
   scroll, which is what the eye reads as depth.

   Positive speed drifts up (moves faster than the page), negative
   drifts down (lags behind it). */
export default function ParallaxLayer({
  speed = 0.3,
  fade = false,
  as: Tag = "div",
  className,
  style,
  children,
}: {
  /** Travel in % of the element's own height. Negative = lags behind. */
  speed?: number;
  /** Also fade in as it enters — for text that shouldn't just slide. */
  fade?: boolean;
  as?: any;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: speed * 100, ...(fade ? { opacity: 0 } : {}) },
        {
          yPercent: -speed * 100,
          ...(fade ? { opacity: 1 } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [speed, fade]);

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
