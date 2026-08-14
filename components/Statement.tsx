"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* A single oversized line that drifts horizontally as it passes through
   the viewport — the one place on the page where type is the whole
   composition rather than a label on something else. */
export default function Statement() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".statement-line-a",
        { xPercent: -6 },
        {
          xPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
      gsap.fromTo(
        ".statement-line-b",
        { xPercent: 6 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="statement" ref={ref}>
      <div className="statement-line statement-line-a">SHIP IT</div>
      <div className="statement-line statement-line-b statement-outline">ROLL IT BACK</div>
      <p className="statement-caption">
        Both paths automated. That&rsquo;s the job.
      </p>
    </section>
  );
}
