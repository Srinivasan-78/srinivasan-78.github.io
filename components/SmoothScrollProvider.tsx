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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // lerp gives frame-rate-independent smoothing and reads more
      // naturally than a fixed duration on high-refresh displays.
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Lenis runs its own rAF loop by default; we drive it from the
      // GSAP ticker instead, so leaving that on would step the scroll
      // twice per frame and double the apparent speed.
      autoRaf: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    // Named so it can actually be removed. An anonymous callback here
    // leaks on unmount, and under React StrictMode's double-mount that
    // leaves two Lenis instances advancing the same scroll.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Trigger positions are measured when they're created, but the page
    // has ~12 lazy images that change layout height as they arrive.
    // Without a refresh, every trigger below an image fires at the wrong
    // scroll position.
    const refresh = () => ScrollTrigger.refresh();
    const imgs = Array.from(document.images);
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    window.addEventListener("load", refresh, { once: true });

    // Font swap changes text metrics, shifting every text-based trigger.
    if (document.fonts) document.fonts.ready.then(refresh);

    return () => {
      gsap.ticker.remove(raf);
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      window.removeEventListener("load", refresh);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
