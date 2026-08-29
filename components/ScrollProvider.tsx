/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌​​​‌‌​‌​‌​‌‌‌​​‌​​‌​​‌‌‌​​​‌‌​‌‌​​‌​‌‌‌‌‌​‌‌‌​‌​‌​‌​​‌​‌​​‌‌​​‌​​​‌‌‌​​‌​​‌​​‌​​‌​‌‌​​​‌‌​‌​‌‌‌‌‌​‌‌​​​‌‌​‌​‌​‌‌​​‌​‌​​​​​‌​‌‌​​​​​‌​‌‌​‌​‌‌​‌‌​​​‌‌‌​​​​​​‌‌​​​​​‌‌​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.25rN6_uJdrIc_cVPX-lp0g
 */
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
    /* A modal dims the page behind it *and* pushes it back, so the two
       read as separate layers in depth rather than as one flat image
       with a dark rectangle over it. The push itself is in globals.css;
       this is the only place on the site that knows a modal is open at
       all, which makes it the right place to say so.

       Every dialog that pushes the page back must be outside the pushed
       subtree — <main> is transformed, and a transformed ancestor
       becomes the containing block for its fixed-position descendants,
       which would trap the dialog inside the very thing it is floating
       above. The two that lock both portal themselves to <body>. */
    document.documentElement.classList.add("dialog-open");
  }, []);

  const unlock = useCallback(() => {
    locks.current = Math.max(0, locks.current - 1);
    if (locks.current > 0) return;
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.documentElement.classList.remove("dialog-open");
  }, []);

  const value = useMemo(() => ({ lock, unlock }), [lock, unlock]);

  return (
    <ScrollLockContext.Provider value={value}>{children}</ScrollLockContext.Provider>
  );
}
