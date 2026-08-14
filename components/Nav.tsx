"use client";

import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/certifications", label: "Certifications" },
  { href: "/resume.pdf", label: "Résumé" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
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
          flexWrap: "wrap",
        }}
      >
        <a href="/" className="eyebrow" style={{ color: "var(--sage)" }}>
          @srinivasan.devops
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="eyebrow" style={{ fontSize: "0.8rem" }}>
              {l.label}
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
