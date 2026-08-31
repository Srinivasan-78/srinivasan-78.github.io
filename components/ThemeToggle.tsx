/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌​​​‌‌​​​‌​‌‌​‌‌​​​​‌‌​‌​​​‌​​‌‌‌​​‌‌‌‌​​​​‌​‌‌​​​​‌​‌​​​‌​‌‌​​‌​​​‌​‌‌‌‌‌​‌‌‌‌​​​​‌​​‌‌​​​‌‌​‌​‌​​​‌‌​​‌​​‌‌‌‌​​​​‌​‌‌​​​​‌​‌​‌​​​‌​​‌‌‌‌​‌‌​‌‌​​​‌​​​​‌​​‌​‌​‌‌​​‌‌‌​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.21l4NxXQd_xLj2xXTOlBVr
 */
"use client";

import { useEffect, useState } from "react";

/* The palette switch. It renders more than once — the desktop nav and
   the phone's menu each mount one — and each copy having its own idea
   of the current theme was the bug that sank the first version: click
   one, and the other's state went stale, so its next click computed the
   wrong value and flipped the theme back.

   Fix: the DOM attribute is the single source of truth. Every click
   reads it fresh, and a MutationObserver keeps every instance's label in
   sync no matter which one was clicked.

   Initial state is `false` deliberately. The server renders <html> with
   no data-theme, which the stylesheet reads as light, so a first client
   render that assumed anything else would disagree with the server and
   React would report a hydration mismatch. BootScript has already set
   the real attribute by this point; the effect below reads it and
   corrects the label on the first commit. */

function isDark() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(isDark());

    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    /* Follow the OS while the visitor has no explicit choice on record.
       Someone whose machine flips to dark at sunset should see the page
       follow it; someone who has pressed this button has said what they
       want and is not overridden. */
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {
        return;
      }
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    mq.addEventListener("change", onScheme);

    return () => {
      obs.disconnect();
      mq.removeEventListener("change", onScheme);
    };
  }, []);

  const toggle = () => {
    // Read from the DOM, never from local state.
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    // The observer above updates every instance, including this one.
  };

  return (
    <button
      type="button"
      data-theme-toggle=""
      onClick={toggle}
      /* aria-pressed, not a switch role: this is a two-state control and
         "pressed" is the state screen readers already announce for one.
         The label says what the press will do, which is the thing a
         visitor who cannot see the icon needs to know. */
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "1px solid var(--ink-15)",
        borderRadius: 999,
        padding: "0.3rem 0.7rem",
        color: "var(--ink-70)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        cursor: "pointer",
      }}
    >
      {/* Decorative: the accessible name is on the button. Left in the
          tree unhidden and it gets read out as "sun with rays". */}
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
