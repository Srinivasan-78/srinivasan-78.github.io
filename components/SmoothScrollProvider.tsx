"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return; // native scroll, no Lenis, no rAF loop

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // next/link does client-side navigation (no full reload), but Lenis
  // keeps its own virtual scroll state — without this it stays wherever
  // the previous page left off instead of snapping to the new page's top,
  // and ScrollTrigger positions computed on the new page start out of sync.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    // Recompute trigger start/end now that the new page's DOM is in place.
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
