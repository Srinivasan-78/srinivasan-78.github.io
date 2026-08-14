"use client";

import { useEffect, useState } from "react";

const THEME_SCRIPT = `
(function(){
  var d = document.documentElement;
  function stored(){ try{ return localStorage.getItem('theme'); }catch(e){ return null; } }
  var t = stored();
  if (t !== 'dark' && t !== 'light'){
    t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  d.setAttribute('data-theme', t);
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
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
