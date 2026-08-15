"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Dark is the unconditional default, so the server-rendered markup
  // says "dark" too. Starting at false made the button briefly show
  // "Dark" on a page that was already dark, then flip once the effect
  // ran — that flicker read as the theme changing on its own.
  const [dark, setDark] = useState(true);

  // Corrects the label for the one case that differs: a visitor who
  // previously chose light.
  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") !== "light");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(!dark);
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
