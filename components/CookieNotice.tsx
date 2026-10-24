/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌‌​‌‌​​‌​‌​‌​​‌​‌​​​‌‌​​‌​​‌‌​‌​​‌​‌‌​‌​​​​‌‌‌​‌‌‌​‌‌‌​​​‌​‌​‌​‌​‌​‌‌‌​​​‌​‌‌​‌​‌​​‌​​‌​​​​​‌‌​​‌​​​‌‌​​​​​​‌‌​​​‌​‌​​‌‌​‌​‌​‌‌​​​​‌​​​‌​‌​​‌‌​​‌‌​​‌‌​​‌​​‌‌‌‌​‌​​​‌‌​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.CeJ2ihwqUqjH201MXE32z7
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const KEY = "sv-notice-dismissed";

/** Matches the exit transition on the panel below. */
const EXIT_MS = 220;

/* Three states rather than a boolean, because the panel has to still be
   in the DOM while it animates out. `closing` keeps it mounted for the
   length of the exit, then unmounts. */
type Phase = "hidden" | "shown" | "closing";

/* This site sets no tracking cookies — analytics is cookieless and the only
   browser storage is this notice's own dismissal flag — so this is a
   disclosure, not a consent gate. Nothing is withheld until it is dismissed, and dismissing it
   grants nothing. If a cookie-setting tool is ever added, this has to become
   a real opt-in gate that blocks the script until accepted.

   Restyled for Contingency, with the consent logic untouched: a quiet
   ruled band across the bottom of the viewport rather than a floating
   card. A card implies something modal that has to be dealt with; a band
   on a hairline reads as part of the page furniture, which is the right
   weight for a disclosure nobody has to act on.

   Neither choice is privileged. "Got it" is a plain `btn`, not the
   filled `btn-signal` — a notice that makes dismissal the brightest
   thing on the screen is nudging, and the point of being honest about
   storage is undone by nudging about it. The policy link keeps the
   underline it has everywhere else on the site.

   The exit uses an inline transition rather than a utility so its
   duration is literally EXIT_MS and cannot drift from the unmount
   timer. The global prefers-reduced-motion rule carries `!important`
   and so still beats it — the panel then simply disappears. */
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

  const closing = phase === "closing";

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-panel"
      style={{
        transition: `opacity ${EXIT_MS}ms var(--ease-cx), transform ${EXIT_MS}ms var(--ease-cx)`,
        opacity: closing ? 0 : 1,
        transform: closing ? "translateY(0.5rem)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:gap-8 sm:px-8">
        <div className="min-w-0 flex-1">
          <div className="t-anno text-mute">Privacy</div>
          <p className="t-prose mt-1.5 text-[0.875rem] leading-relaxed text-mute">
            Your privacy is safe here. Analytics is cookieless and aggregate, and the only thing
            kept in your browser is the fact that you closed this notice.{" "}
            <Link className="link" href="/privacy">
              Read the privacy policy
            </Link>
            .
          </p>
        </div>

        <button type="button" className="btn shrink-0 self-start sm:self-auto" onClick={dismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
