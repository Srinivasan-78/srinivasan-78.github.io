"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { isLite } from "@/lib/lite";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Lenis drives scrolling itself, so `document.body.style.overflow =
   "hidden"` — what the dialogs used to do — does not stop it. Lenis
   keeps consuming wheel and touch and keeps calling window.scrollTo, so
   the page carried on moving behind every open modal.

   Exposing stop/start is the actual fix, and a context is the smallest
   way to reach the instance from a dialog several levels down. Calls
   are ref-counted: two overlapping locks (a lightbox opened from a page
   that already locked) must not have the first one to close release the
   scroll for both. */
type ScrollLock = { lock: () => void; unlock: () => void };

const ScrollLockContext = createContext<ScrollLock>({
  lock: () => {},
  unlock: () => {},
});

export function useScrollLock() {
  return useContext(ScrollLockContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Touch devices keep native scrolling. Lenis replaces a scroll the
       compositor handles on its own thread with one computed in JS every
       frame, which is exactly the "laggy scroll" phones were reporting —
       and momentum on mobile already feels right without it. */
    if (isLite()) return;

    // Imported here rather than at module scope so the bail above is also
    // a bail on downloading it. Phones and reduced-motion visitors never
    // fetch a scroll library they will not run.
    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const { default: Lenis } = await import("lenis");
      // The effect was torn down while the import was in flight — under
      // StrictMode's double-mount that is the common case, not the edge.
      if (cancelled) return;

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

      teardown = () => {
        gsap.ticker.remove(raf);
        imgs.forEach((img) => img.removeEventListener("load", refresh));
        window.removeEventListener("load", refresh);
        lenis.destroy();
        lenisRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  useEffect(() => {
    /* Without Lenis — touch, or reduced motion — the same reset has to go
       through the window, or a route change lands mid-page. */
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  const locks = useRef(0);

  const lock = useCallback(() => {
    locks.current += 1;
    if (locks.current > 1) return;
    lenisRef.current?.stop();
    // Still set on body: Lenis is skipped entirely under reduced motion,
    // and native scrolling has to be held back in that case too.
    document.body.style.overflow = "hidden";
  }, []);

  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current > 0) return;
    lenisRef.current?.start();
    document.body.style.overflow = "";
  }, []);

  const value = useMemo(() => ({ lock, unlock }), [lock, unlock]);

  return (
    <ScrollLockContext.Provider value={value}>{children}</ScrollLockContext.Provider>
  );
}
