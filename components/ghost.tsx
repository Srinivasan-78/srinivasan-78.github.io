"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* An oversized section word that sharpens from blur as it crosses the
   viewport, then softens again on the way out.

   Blur rather than fade: fading changes how *present* something is,
   blur changes how *resolved* it is, and the second reads as the page
   pulling focus. Scrubbed both ways so scrolling back up reverses it.

   aria-hidden throughout — this is texture behind the real heading, and
   a screen reader announcing a decorative word twice the size of the
   content is noise. */
export default function Ghost({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // The blur class is applied in markup so there's no flash before
      // hydration; reduced motion has to clear it explicitly.
      el.classList.remove("ghost-blur");
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { filter: "blur(14px)", opacity: 0 },
        {
          filter: "blur(0px)",
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            end: "center 55%",
            scrub: 0.7,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={"ghost ghost-blur" + (className ? " " + className : "")}
    >
      {text}
    </div>
  );
}