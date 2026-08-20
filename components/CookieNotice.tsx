"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "sv-notice-dismissed";

/* This site sets no tracking cookies — analytics is cookieless and the only
   browser storage is the theme preference — so this is a disclosure, not a
   consent gate. Nothing is withheld until it is dismissed, and dismissing it
   grants nothing. If a cookie-setting tool is ever added, this has to become
   a real opt-in gate that blocks the script until accepted. */
export default function CookieNotice() {
  // Starts hidden and only appears after the storage check, so the notice can
  // never flash for someone who already dismissed it.
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      // Private mode or blocked storage: show it, accept that it returns.
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* Nothing to do — the notice simply shows again next visit. */
    }
  };

  if (!show) return null;

  return (
    <div className="cookie-notice" role="region" aria-label="Privacy notice">
      <div className="cookie-notice-body">
        <span className="eyebrow">Privacy</span>
        <p>
          No tracking cookies here. Analytics is cookieless and aggregate, and the only thing
          stored in your browser is your theme choice.{" "}
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
