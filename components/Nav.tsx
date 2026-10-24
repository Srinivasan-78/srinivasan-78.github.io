/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌‌‌​‌​​​​‌‌​​​​​‌‌​‌​​​​‌‌‌​​​​​‌‌​​​​‌​​‌‌‌​​‌​‌‌‌​‌​​​‌‌‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​​‌‌​‌‌‌​‌‌​‌‌​‌​‌​‌​‌‌​​‌​​​‌​​​‌‌‌​‌‌​​​‌‌​​​​​‌​​‌‌​​​‌‌​​‌‌​​‌‌‌​‌‌‌​‌​​‌​​​​‌‌‌​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.3t0hpa9tyvU7mVDv0LfwHr
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NAV_ITEMS, isActiveRoute } from "@/lib/nav";
import ThemeToggle from "./ThemeToggle";
import SkillTicker from "./SkillTicker";

/* The dossier header.

   Destinations are numbered — 01 through 05 — which is the same
   case-index motif the sections and panels use. It costs nothing and it
   makes the site feel like one indexed document rather than five pages
   that happen to share a stylesheet.

   NO LONGER TRUE, kept because the trade is worth recording: this bar
   was deliberately NOT sticky for five revisions, on the grounds that
   something following you down the page is another thing occupying
   attention, and that the visitor gets back up with Home, the browser
   or a scroll. The owner has asked for it static and that is his call
   to make — it is his site and his navigation. What the argument buys
   is the shape of the concession: the sticky block is the shortest it
   can be while holding both rows, it has no shadow and no floating
   card edge, and the ticker inside it pauses the moment anyone looks
   at it. Sticky was conceded; demanding attention was not.

   The mobile disclosure replaces the previous design's radial option
   wheel: 766 lines of custom pointer, keyboard and haptics handling for
   four links. A disclosure is four links.

   REVISION 3 — the tracking marker.

   The active destination carries a cyan rule that SLIDES between the
   four items as the route changes, rather than switching off under one
   and on under the next. It is the one place on the site that uses
   `motion` for what only `motion` can do.

   That claim is worth justifying, because the rest of this design
   rebuilt its effects in CSS rather than installing them. A shared
   marker needs to measure where it currently is, measure where it has
   to end up, and interpolate between two *different DOM elements* —
   and it has to survive being re-targeted mid-flight when someone
   clicks a third destination while it is still travelling. CSS has no
   way to express "animate from that element's box to this one":
   `transition` interpolates a property on one element, and a
   view-transition would animate the whole document rather than a
   marker inside persistent chrome. `layoutId` is exactly this problem,
   and re-targeting is handled by the spring rather than by restarting.

   Reduced motion gets a plain static rule under the active item. Not a
   faster slide — no slide. The marker's job is to say which
   destination you are on, and the static version says it completely.

   The marker is also the reason the active item keeps `text-signal`
   while everything else in revision 3 moved to cyan. Active is not a
   hover state: it is a persistent fact about the page you are on, so
   by the §1b rule it belongs to the static amber register. The cyan
   here is the marker's travel, which is transient by definition. */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  /* Close on route change. Without this the panel stays open over the
     new page, because the component is not remounted by navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Escape closes it. A disclosure that can only be dismissed by
     hitting the same small button again is a trap on a phone. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    /* REVISION 6 — sticky, on instruction, and carrying the ticker.

       Revision 4 removed this element's bottom rule because the
       bordered header and bordered footer were the two sides of a
       frame around the document. That still holds for the FOOTER,
       which stays unframed. This one gets a rule back, and it is not a
       reversal: a sticky bar overlapping the content it floats above
       genuinely needs an edge, or the page appears to slide underneath
       nothing. The frame was two rules at the extremes of a static
       sheet; this is one rule marking a real boundary between a fixed
       layer and a moving one. Different thing, same hairline.

       `.site-header` in §5g carries the stickiness, a backdrop blur
       and that rule. The blur is the only way forty small marks
       scrolling under forty small marks stays legible. */
    <header className="site-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        {/* Identity. The monogram is set in the display serif at a size
            where its high contrast actually reads, with the role in the
            annotation register under it — the two registers touching,
            which is the whole type idea stated once at the top. */}
        <Link href="/" className="group min-w-0 shrink-0">
          <span className="t-display block text-[1.0625rem] leading-none text-body transition-colors duration-150 group-hover:text-detect">
            Srinivasan Vijayaraghavan
          </span>
          <span className="t-anno-sm mt-1 block truncate text-mute">
            DevOps &amp; Site Reliability
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-5">
          {/* Desktop destinations */}
          <nav aria-label="Primary" className="hidden sm:block">
            <ul className="flex items-center gap-5">
              {NAV_ITEMS.map((item, i) => {
                const active = isActiveRoute(item.href, pathname);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`t-anno-sm flex items-baseline gap-1.5 pb-1.5 transition-colors duration-150 ${
                        active
                          ? "text-signal"
                          : "text-mute hover:text-body"
                      }`}
                    >
                      <span className="text-mute">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>

                    {/* Only the active item renders a marker, and every
                        one of them shares the same `layoutId` — which is
                        what makes the single element travel from the old
                        item to the new one instead of being swapped.
                        aria-hidden because `aria-current` above already
                        states which destination is active; this is the
                        visual half of a fact that is already announced. */}
                    {active &&
                      (reduced ? (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-px left-0 h-px w-full bg-detect"
                        />
                      ) : (
                        <motion.span
                          aria-hidden="true"
                          layoutId="nav-active"
                          className="absolute -bottom-px left-0 h-px w-full bg-detect"
                          /* Stiff and well-damped: a marker that
                             overshoots its destination reads as a toy.
                             This settles in about 300ms without a
                             visible bounce. */
                          transition={{
                            type: "spring",
                            stiffness: 520,
                            damping: 38,
                            mass: 0.6,
                          }}
                        />
                      ))}
                  </li>
                );
              })}
            </ul>
          </nav>

          <ThemeToggle />

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-panel"
            className="t-anno-sm flex items-center gap-2 border border-rule px-2.5 py-1.5 text-mute transition-colors duration-150 hover:border-rule-strong hover:text-body sm:hidden"
          >
            {open ? "Close" : "Index"}
            <span aria-hidden="true" className="relative block h-2.5 w-2.5">
              <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
              <span
                className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-150 ${
                  open ? "scale-y-0" : "scale-y-100"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile destinations */}
      <nav
        id="nav-panel"
        aria-label="Primary"
        hidden={!open}
        className="border-t border-rule sm:hidden"
      >
        <ul className="divide-y divide-rule">
          {NAV_ITEMS.map((item, i) => {
            const active = isActiveRoute(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`t-anno flex items-baseline gap-3 px-5 py-3.5 transition-colors duration-150 ${
                    active ? "text-signal" : "text-mute"
                  }`}
                >
                  <span className="text-mute">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* The ticker rides with the header rather than sitting in the
          page, so the thing the owner asked to be "static along with"
          the nav genuinely is. It is the second of the two rows the
          sticky block holds, and the reason that block is kept as
          short as it is. */}
      <SkillTicker />
    </header>
  );
}
