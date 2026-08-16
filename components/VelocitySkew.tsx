"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Skews flagged elements in proportion to scroll velocity, then springs
   them back to flat when scrolling stops. This is the single cheapest
   trick for making a page feel like it has weight: the content appears
   to resist acceleration rather than teleporting with the viewport.

   Applied via [data-skew] rather than wrapping components, so it can
   decorate existing markup without changing any component tree. */
export default function VelocitySkew() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = gsap.utils.toArray<HTMLElement>("[data-skew]");
    if (!targets.length) return;

    const setters = targets.map((el) => gsap.quickSetter(el, "skewY", "deg"));
    const clamp = gsap.utils.clamp(-2.5, 2.5);
    let current = 0;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        // getVelocity() is px/sec; divide down to a sane degree range.
        const target = clamp(self.getVelocity() / -600);
        // Only re-render when the change is visible — avoids writing
        // styles every frame while scrolling at constant speed.
        if (Math.abs(target - current) > 0.06) {
          current = target;
          setters.forEach((set) => set(current));
        }
      },
      onScrubComplete: () => {
        current = 0;
        setters.forEach((set) => set(0));
      },
    });

    // Spring back to flat once scrolling stops.
    let idle: ReturnType<typeof setTimeout>;
    const settle = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        current = 0;
        targets.forEach((el) =>
          gsap.to(el, { skewY: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" })
        );
      }, 120);
    };
    window.addEventListener("scroll", settle, { passive: true });

    return () => {
      st.kill();
      clearTimeout(idle);
      window.removeEventListener("scroll", settle);
      gsap.set(targets, { skewY: 0 });
    };
    // Re-query on navigation: this component lives in the layout and
    // never unmounts, but [data-skew] elements belong to the page that
    // just swapped out, so the old targets would be stale nodes.
  }, [pathname]);

  return null;
}
