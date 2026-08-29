/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌​‌​‌‌‌‌​‌​​‌‌‌​‌​‌​​‌‌​‌​​​‌‌​​​​‌​‌​​‌​​​​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌‌​‌​​‌​‌​​‌‌​‌​‌​​‌​​​​‌​‌​​​​​‌‌​​‌‌​​‌‌‌​​‌‌​​‌‌​‌​​​‌​​‌​‌‌​‌​‌‌​‌​​‌​‌​‌​​​‌​‌​‌​‌​​‌‌​‌​‌​‌‌​‌‌‌‌​‌‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Mzu4aHzoiMHPfs4KZTU5om
 */
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  /* Whether anything is actually scrolled underneath the bar.

     The header carried a 1px rule along its bottom edge at all times,
     including at the top of the page where there is nothing under it to
     separate from. A permanent divider is a drawn line; an edge that
     appears only where floating chrome overlaps content is the content
     telling you it has gone behind something. The class drives a soft
     gradient rather than a hairline — see .nav-glass in globals.css.

     One passive listener, coalesced to a frame, writing a boolean that
     changes twice per page: at the top and away from it. */
  const [floating, setFloating] = useState(false);
  const queued = useRef(false);

  useEffect(() => {
    const read = () => {
      queued.current = false;
      setFloating(window.scrollY > 4);
    };
    const onScroll = () => {
      if (queued.current) return;
      queued.current = true;
      requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={"nav-glass" + (floating ? " is-floating" : "")}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
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
                /* The underline is `.lnk[aria-current="page"]::after` in
                   globals.css, not a text-decoration: it animates, and a
                   text-decoration cannot. */
                style={{
                  fontSize: "0.8rem",
                  color: isActive(l.href) ? "var(--accent)" : undefined,
                }}
              >
                {l.label}
              </Link>
            ))}
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
