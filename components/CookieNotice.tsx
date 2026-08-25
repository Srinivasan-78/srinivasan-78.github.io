"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const KEY = "sv-notice-dismissed";

/** Matches the exit animation on `.cookie-notice.is-closing` in globals.css. */
const EXIT_MS = 220;

/* Three states rather than a boolean, because the panel has to still be
   in the DOM while it animates out. `closing` keeps it mounted for the
   length of the exit, then unmounts — the same shape <MobileNavigation>
   and the work lightbox both use. */
type Phase = "hidden" | "shown" | "closing";

/* This site sets no tracking cookies — analytics is cookieless and the only
   browser storage is this notice's own dismissal flag — so this is a
   disclosure, not a consent gate. Nothing is withheld until it is dismissed, and dismissing it
   grants nothing. If a cookie-setting tool is ever added, this has to become
   a real opt-in gate that blocks the script until accepted. */
export default function CookieNotice() {
  // Starts hidden and only appears after the storage check, so the notice can
  // never flash for someone who already dismissed it.
  const [phase, setPhase] = useState<Phase>("hidden");
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setPhase("shown");
    } catch {
      // Private mode or blocked storage: show it, accept that it returns.
      setPhase("shown");
    }
  }, []);

  // Unmount only once the exit has had its time.
  useEffect(() => {
    if (phase !== "closing") return;
    exitTimer.current = setTimeout(() => setPhase("hidden"), EXIT_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
      exitTimer.current = null;
    };
  }, [phase]);

  const dismiss = () => {
    /* The write happens now, not when the animation finishes. A visitor
       who dismisses this and immediately navigates must not get it back
       because the exit was still running when the page unloaded. */
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* Nothing to do — the notice simply shows again next visit. */
    }
    setPhase((p) => (p === "shown" ? "closing" : p));
  };

  if (phase === "hidden") return null;

  return (
    <div
      className={"cookie-notice" + (phase === "closing" ? " is-closing" : "")}
      role="region"
      aria-label="Privacy notice"
    >
      <div className="cookie-notice-body">
        <span className="eyebrow">Privacy</span>
        <p>
          Your privacy is safe here. Analytics is cookieless and aggregate, and the only thing
          kept in your browser is the fact that you closed this notice.{" "}
          <Link className="lnk" href="/privacy">
            Read the privacy policy
          </Link>
          .
        </p>
      </div>
      <button type="button" className="btn cookie-notice-btn" onClick={dismiss}>
        Got it
      </button>
    </div>
  );
}
