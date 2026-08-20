"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import TechLoop from "./TechLoop";
import MobileNavigation from "./navigation/MobileNavigation";
import { NAV_ITEMS, isActiveRoute } from "@/lib/nav";

/* The header. Two interfaces onto one set of routes: the row below
   720px-wide screens, and <MobileNavigation> above them — the wheel.
   Both read from lib/nav.ts, so a new route appears in both or neither.

   The résumé is not in the list. It is a download, not a destination,
   and a header is for places you can go — it stays on the hero button,
   the sticky bar a phone visitor carries down the page, and the
   thank-you page, all of which sit next to the moment someone actually
   wants it. Every entry here is a route, so both interfaces render a
   plain <Link>; the download branch that used to sit here went with the
   résumé. */

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) => isActiveRoute(href, pathname);

  return (
    <nav
      className="nav-glass"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--ink-15)",
      }}
    >
      {/* The header is the one place on the site that still frosts what
          is behind it. It is fixed over scrolling content, so the blur is
          doing a job — telling you the bar is a layer above the page —
          rather than decorating a panel that never moves.

          It used to frost through <GlassLayer>, which builds its effect
          from an SVG filter that displaces the red, green and blue
          channels of the backdrop by different amounts. That is where its
          edge refraction comes from, and it is also why a paragraph
          scrolling underneath came out mirrored and colour-fringed across
          the bar — legible enough to recognise, mangled enough to read as
          a rendering fault, and directly over the navigation labels.

          It is a plain backdrop blur now: 20px and a translucent surface.
          <GlassLayer> had no other caller, so the component and its ~90
          lines of stylesheet went with it. */}
      <div className="nav-bar">
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
          <Link href="/" className="eyebrow" style={{ color: "var(--accent)" }}>
            @srinivasan.devops
          </Link>

          {/* Desktop links — hidden below 720px, replaced by the wheel */}
          <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {NAV_ITEMS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="eyebrow lnk"
                aria-current={isActive(l.href) ? "page" : undefined}
                style={{
                  fontSize: "0.8rem",
                  textDecoration: isActive(l.href) ? "underline" : "none",
                  textUnderlineOffset: "4px",
                  color: isActive(l.href) ? "var(--accent)" : undefined,
                }}
              >
                {l.label}
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* The phone's navigation: trigger here, full-screen wheel
              portalled to <body>. Renders nothing above 720px. */}
          <MobileNavigation />
        </div>
      </div>

      {/* The tooling strip. It sits under the bar rather than inside it
          so the links keep their own line and their own baseline. */}
      <TechLoop />
    </nav>
  );
}
