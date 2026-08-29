/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌‌​‌‌‌‌​​​​‌‌‌​‌‌​​‌‌​‌‌​​​​‌‌​​‌‌​‌​​‌​‌​​‌​‌‌​​‌​‌‌​​‌​​​​‌‌​​‌‌​‌​​​‌‌​​‌‌‌​‌‌​​​‌‌​​‌​​‌​‌‌​‌​​‌​​‌​​​​‌​​‌‌‌‌​‌​​​‌​​​‌​​‌​‌​​​‌‌​‌​‌​‌‌​​‌‌​​‌​‌​‌​​​‌‌​​‌‌​​​‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Oxvl3JYd3Fv2ZHODJ5fTf4
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import OptionWheel, { type OptionWheelHandle } from "./OptionWheel";
import { useScrollLock } from "../ScrollProvider";
import { NAV_ITEMS, activeIndex } from "@/lib/nav";
import "./MobileNavigation.css";

/* The phone's navigation.

   The header row does not survive a narrow screen — five mono labels in
   a 320px bar is a scroll, not a menu — so below the site's existing
   720px breakpoint the links are replaced by this: a trigger in the
   header, and a full-screen layer built around a curved wheel.

   Division of labour, deliberately: <OptionWheel> knows how to be a
   wheel — position, drag, snap, the arc, the frame loop — and nothing
   about this site. This component knows about the site — which routes
   exist, which one you are on, what happens when you choose one — and
   nothing about arcs. The wheel is handed strings and hands back an
   index.

   Three states rather than a boolean, because the layer has to still be
   in the DOM while it animates out. `closing` keeps it mounted for the
   length of the exit, then unmounts.

   There is no tap-outside-to-close. The layer is full-screen and its
   three rows fill it, so there is no "outside" to tap — and the one
   region that looks like empty ground, around the wheel, is where a
   drag starts. Dismissing on a tap there would close the menu on a
   fumbled swipe. The ways out are the Close button, Escape, and
   choosing a destination. */

type Phase = "closed" | "open" | "closing";

/** Matches --mn-exit in MobileNavigation.css. */
const EXIT_MS = 260;

export default function MobileNavigation() {
  const [phase, setPhase] = useState<Phase>("closed");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { lock, unlock } = useScrollLock();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<OptionWheelHandle>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* The index the wheel should show. Read when the layer opens and not
     tracked as state afterwards: the wheel owns its own position from
     that point, and feeding it back on every render is what makes a
     wheel jump under the finger. */
  const selectedRef = useRef(activeIndex(pathname));

  const isOpen = phase === "open";

  // The portal target only exists in the browser. Rendering nothing on
  // the server and on the first client pass keeps the two agreeing.
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setPhase((p) => (p === "open" ? "closing" : p));
  }, []);

  const open = useCallback(() => {
    selectedRef.current = activeIndex(pathname);
    setPhase("open");
  }, [pathname]);

  // Unmount only after the exit animation has had its time.
  useEffect(() => {
    if (phase !== "closing") return;
    exitTimer.current = setTimeout(() => setPhase("closed"), EXIT_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      exitTimer.current = null;
    };
  }, [phase]);

  /* Scroll lock, Escape, focus. All three live and die with the open
     state, and all three are the site's existing mechanisms: the lock is
     the ref-counted one from ScrollProvider, which also compensates for
     the scrollbar it removes. */
  useEffect(() => {
    if (!isOpen) return;

    lock();
    const opener = triggerRef.current;
    // Focus the wheel itself: it is the listbox, so arrow keys work the
    // moment the layer is up.
    const focusTimer = setTimeout(() => wheelRef.current?.focus(), 60);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      // Keep Tab inside the layer. Without this a keyboard user walks
      // straight out of the menu and into the page behind it.
      const root = overlayRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearTimeout(focusTimer);
      unlock();
      // Focus goes back where it came from, not to <body>.
      opener?.focus();
    };
  }, [isOpen, lock, unlock, close]);

  // A route change closes the layer, including one from Back/Forward.
  useEffect(() => {
    setPhase((p) => (p === "closed" ? p : "closing"));
  }, [pathname]);

  const activate = useCallback(
    (index: number) => {
      const item = NAV_ITEMS[index];
      if (!item) return;
      close();
      // Already here: closing is the whole action.
      if (item.href === pathname) return;
      router.push(item.href);
    },
    [close, pathname, router]
  );

  const layer =
    phase === "closed" ? null : (
      <div
        ref={overlayRef}
        className={"mobile-nav__overlay" + (phase === "closing" ? " is-closing" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <div className="mobile-nav__bar">
          <span className="eyebrow mobile-nav__eyebrow">Menu</span>
          <div className="mobile-nav__controls">
            <button
              type="button"
              className="mobile-nav__close"
              onClick={close}
              aria-label="Close navigation"
            >
              Close
            </button>
          </div>
        </div>

        <nav className="mobile-nav__wheel" aria-label="Mobile navigation">
          <OptionWheel
            ref={wheelRef}
            items={NAV_ITEMS.map((item) => item.label)}
            defaultSelected={selectedRef.current}
            aria-label="Pages"
            side="left"
            fontSize={2.35}
            spacing={1.5}
            curve={0.9}
            tilt={6}
            blur={1.6}
            /* Four destinations, all of them on screen at once. The
               fade is set so the furthest still reads as a word rather
               than a smudge — a menu should show you everything it
               has. */
            fade={0.26}
            minOpacity={0.2}
            smoothing={165}
            inset={28}
            loop={false}
            draggable
            textColor="var(--ink-45)"
            activeColor="var(--ink)"
            /* No audio. The site has no sound design to belong to, and
               a tick nobody asked for is not a premium detail. */
            soundUrl=""
            onActivate={activate}
          />
        </nav>

        <div className="mobile-nav__foot">
          <p className="micro mobile-nav__hint">(swipe · tap the centred name to go)</p>
        </div>
      </div>
    );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="nav-toggle mobile-nav__trigger"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => (isOpen ? close() : open())}
      >
        {isOpen ? "close" : "menu"}
      </button>
      {/* Portalled to <body>. The header is a stacking context of its
          own (sticky, z-index 50), and a fixed layer inside it can never
          rise above the chat panel or the work lightbox no matter what
          z-index it is given. */}
      {mounted && layer ? createPortal(layer, document.body) : null}
    </>
  );
}
