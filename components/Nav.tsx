"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
  { href: "/resume.pdf", label: "Résumé", download: true },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 2,
        zIndex: 50,
        background: "var(--paper)",
        borderBottom: "1px solid var(--ink-15)",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.9rem 24px",
          gap: "1rem",
        }}
      >
        <Link href="/" className="eyebrow" style={{ color: "var(--sage)" }}>
          @srinivasan.devops
        </Link>

        {/* Desktop links — hidden below 720px, replaced by the toggle below */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} download={l.download} className="eyebrow" style={{ fontSize: "0.8rem" }}>
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile toggle — hidden above 720px via nav-toggle CSS below */}
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="navMenu"
          onClick={() => setOpen((o) => !o)}
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--ink-15)",
            borderRadius: 6,
            padding: "0.35rem 0.7rem",
            color: "var(--ink-70)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
          }}
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {open && (
        <div
          id="navMenu"
          className="nav-mobile-menu"
          style={{
            display: "none",
            flexDirection: "column",
            borderTop: "1px solid var(--ink-15)",
            padding: "0.75rem 24px 1rem",
            gap: "0.75rem",
          }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              download={l.download}
              onClick={() => setOpen(false)}
              className="eyebrow"
              style={{ fontSize: "0.85rem" }}
            >
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      )}

      <style>{`
        @media (max-width: 720px) {
          .nav-links { display: none !important; }
          .nav-toggle { display: inline-flex !important; }
          .nav-mobile-menu { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
