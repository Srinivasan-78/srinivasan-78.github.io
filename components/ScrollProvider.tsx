"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
/* Replaces the Lenis-backed provider this used to be.

   Lenis took a scroll the compositor handles on its own thread and
   recomputed it in JavaScript every frame. That buys a slightly softer
   deceleration curve and costs the one input on the page that has to
   feel instant. It also fights the OS: trackpad momentum, the scroll
   wheel's own detents, and Safari's rubber-band all get overwritten by
   one fixed lerp. Native scrolling is what the reference sites this
   design follows actually use.

   What survives from that component is the scroll lock, which dialogs
   still need, and the scroll-to-top on route change.

   The ScrollTrigger refreshes that used to live here are gone with it:
   they existed because GSAP measures a trigger's position once, when it
   is created, so lazy images arriving later left every trigger below
   them firing at the wrong scroll offset. Nothing on the page is tied
   to a scroll position any more — see the motion primitive in
   globals.css — so there is nothing to re-measure.

   Calls are ref-counted: two overlapping locks (a lightbox opened from a
   page that already locked) must not have the first one to close
   release the scroll for both. */
type ScrollLock = { lock: () => void; unlock: () => void };

const ScrollLockContext = createContext<ScrollLock>({
  lock: () => {},
  unlock: () => {},
});

export function useScrollLock() {
  return useContext(ScrollLockContext);
}

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const locks = useRef(0);

  const lock = useCallback(() => {
    locks.current += 1;
    if (locks.current > 1) return;
    /* Compensate for the scrollbar the lock removes, or the whole page
       jumps sideways by its width the moment a dialog opens. Zero on
       overlay-scrollbar platforms, which is the correct answer there. */
    const gap = window.innerWidth - document.documentElement.clientWidth;
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    document.body.style.overflow = "hidden";
  }, []);

  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current > 0) return;
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }, []);

  const value = useMemo(() => ({ lock, unlock }), [lock, unlock]);

  return (
    <ScrollLockContext.Provider value={value}>{children}</ScrollLockContext.Provider>
  );
}
