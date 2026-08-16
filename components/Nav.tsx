"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import Marquee from "./Marquee";

/* The URL stays /resume.pdf — it may already be in sent emails and on
   LinkedIn — but the saved file gets a name that means something in a
   recruiter's downloads folder. */
const RESUME_FILENAME = "Srinivasan-Vijayaraghavan-DevOps.pdf";

const LINKS: { href: string; label: string; download?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/certifications", label: "Certifications" },
  { href: "/resume.pdf", label: "Résumé", download: true },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname?.startsWith(href);
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);

  /* The mobile menu previously had no way out except tapping a link:
     Escape did nothing, tapping the page behind it did nothing, and it
     survived a route change if the destination was reached any other
     way. All three are baseline expectations for a disclosure menu. */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      // Focus goes back to the control that opened it, not to <body>.
      navRef.current?.querySelector<HTMLButtonElement>(".nav-toggle")?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    // Capture phase: a link inside the menu still gets its own click,
    // but a tap anywhere outside closes before that target reacts.
    document.addEventListener("pointerdown", onPointer, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer, true);
    };
  }, [open]);

  // Any navigation closes it, including back/forward.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      ref={navRef}
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
          {LINKS.map((l) =>
            /* resume.pdf is a static asset, not an app route — next/link
               would try to client-navigate to it and prefetch a page that
               doesn't exist, so plain <a> for downloads. */
            l.download ? (
              <a key={l.href} href={l.href} download={RESUME_FILENAME} className="eyebrow lnk" style={{ fontSize: "0.8rem" }}>
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="eyebrow lnk"
                aria-current={isActive(l.href) ? "page" : undefined}
                style={{
                  fontSize: "0.8rem",
                  textDecoration: isActive(l.href) ? "underline" : "none",
                  textUnderlineOffset: "4px",
                  color: isActive(l.href) ? "var(--sage)" : undefined,
                }}
              >
                {l.label}
              </Link>
            )
          )}
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
          {LINKS.map((l) =>
            l.download ? (
              <a
                key={l.href}
                href={l.href}
                download={RESUME_FILENAME}
                onClick={() => setOpen(false)}
                className="eyebrow"
                style={{ fontSize: "0.85rem" }}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="eyebrow"
                aria-current={isActive(l.href) ? "page" : undefined}
                style={{
                  fontSize: "0.85rem",
                  textDecoration: isActive(l.href) ? "underline" : "none",
                  textUnderlineOffset: "4px",
                  color: isActive(l.href) ? "var(--sage)" : undefined,
                }}
              >
                {l.label}
              </Link>
            )
          )}
          <ThemeToggle />
        </div>
      )}

      {isHome && <Marquee />}
    </nav>
  );
}