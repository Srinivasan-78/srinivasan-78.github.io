"use client";

import { useEffect, useState } from "react";

/* This component renders more than once (desktop nav + mobile menu).
   Each copy having its own idea of the current theme was the bug: click
   one, and the other's state went stale, so its next click computed the
   wrong value and flipped the theme the wrong way.

   Fix: the DOM attribute is the single source of truth. Every click
   reads it fresh, and a MutationObserver keeps every instance's label
   in sync no matter which one was clicked. */

function isDark() {
  return document.documentElement.getAttribute("data-theme") !== "light";
}

export default function ThemeToggle() {
  // Dark is the unconditional default, so this matches what the server
  // renders and what ThemeScript applies before paint.
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(isDark());

    const obs = new MutationObserver(() => setDark(isDark()));
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
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
      onClick={toggle}
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
      <span>{dark ? "☀" : "☾"}</span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
