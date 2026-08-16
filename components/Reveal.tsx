"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Wraps any group of children and staggers them into view on scroll.
   Children animate as a batch so a grid row arrives together rather
   than one tile at a time down the page. */
export default function Reveal({
  children,
  className,
  style,
  stagger = 0.07,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const kids = Array.from(el.children) as HTMLElement[];
    if (!kids.length) return;

    gsap.set(kids, { opacity: 0, y });

    const triggers = ScrollTrigger.batch(kids, {
      start: "top 92%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
          stagger,
        }),
    });

    return () => triggers.forEach((t) => t.kill());
  }, [stagger, y]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
