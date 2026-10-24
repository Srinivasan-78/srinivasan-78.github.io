/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌‌​​‌‌​‌‌‌​‌​​‌‌‌‌​‌​‌‌​‌​​‌‌​‌​‌​​​‌‌​‌​‌​​‌‌​​‌‌​‌‌‌​​​‌​‌​‌​‌‌​​‌​‌​‌​‌​‌‌‌‌​‌​​​‌‌​​‌​​​‌‌​‌​​​‌​​‌​​​​‌‌​‌‌​​​‌​​​‌​‌​‌‌‌​‌‌​​‌‌​​‌​‌​‌​‌​​‌​​‌​​‌​​‌​‌​‌​‌​‌​​‌‌​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.O7OZj53qVUz24HlEveRIU2
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, isActiveRoute } from "@/lib/nav";
import ThemeToggle from "./ThemeToggle";

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
   and on under the next.

   REVISION 12 — THIS NO LONGER USES `motion`, AND THE OLD ARGUMENT FOR
   IT WAS WRONG. It read: a shared marker has to interpolate between
   two *different DOM elements*, CSS has no way to express "animate
   from that element's box to this one", so `layoutId` is the only
   tool for the job. The flaw is in the premise. There do not have to
   be two elements. There is ONE marker, a persistent child of the
   list, and the route change moves it — which is the ordinary case a
   CSS transition handles, not the exotic one.

   What it cost to be wrong about that: `motion/react` was the only
   import of the library on the site, it sits in the root layout, and
   it is not tree-shakeable down to `layoutId` — the whole layout
   projection engine comes with it. 215 KB raw, 78 KB gzipped, parsed
   and executed on every page load on every route, in the same window
   the browser is hydrating the document and the cover's shader is
   compiling. For a one-pixel line. That is the single largest thing
   that was making the top of this site lag, and it was spent on the
   quietest effect in the design.

   The replacement measures the active item's box and writes it to the
   marker as `translate3d` plus `scaleX` on a 1px-wide element, so the
   travel is a compositor transform and never a layout or a repaint —
   cheaper per frame than the spring was, as well as free to load.
   Re-targeting mid-flight works for the reason the old comment
   assumed it would not: a CSS transition whose target changes
   interpolates from the current *computed* value, so clicking a third
   destination while the marker is still travelling redirects it from
   wherever it has got to.

   Reduced motion gets a plain static rule under the active item. Not a
   faster slide — no slide. The marker's job is to say which
   destination you are on, and the static version says it completely.
   It is also the first-paint and no-JS marker: the static rule is what
   the server renders, and the slider only takes over once it has a
   real measurement, so the marker is never missing and never wrong.

   The marker is also the reason the active item keeps `text-signal`
   while everything else in revision 3 moved to cyan. Active is not a
   hover state: it is a persistent fact about the page you are on, so
   by the §1b rule it belongs to the static amber register. The cyan
   here is the marker's travel, which is transient by definition. */
export default function Nav({ ticker }: { ticker?: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* Close on route change. Without this the panel stays open over the
     new page, because the component is not remounted by navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* The tracking marker's measured box, or null for "not measured yet,
     or motion is refused" — in which case the static per-item rule
     below is what renders. */
  const list = useRef<HTMLUListElement | null>(null);
  const [marker, setMarker] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;

    const reduce =
      typeof matchMedia !== "undefined"
        ? matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const place = () => {
      if (reduce?.matches) {
        setMarker(null);
        return;
      }
      /* The <li> is the box, not the <a>: the rule has always spanned
         the full item including its leading ordinal. `offsetLeft` is
         relative to the nearest positioned ancestor, which is this
         list — hence `relative` on the <ul> below. */
      const item = ul.querySelector<HTMLElement>("[data-active]");
      if (!item || !item.offsetWidth) {
        setMarker(null);
        return;
      }
      setMarker({ x: item.offsetLeft, w: item.offsetWidth });
    };

    place();

    /* Three things move the items after the first measurement, and all
       three would leave the marker under the wrong word:
       a viewport resize, the display face arriving and re-metricking
       the labels, and the visitor changing the motion setting. */
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(place) : null;
    ro?.observe(ul);
    reduce?.addEventListener("change", place);
    document.fonts?.ready.then(place).catch(() => {});

    return () => {
      ro?.disconnect();
      reduce?.removeEventListener("change", place);
    };
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

       `.site-header` in §5g carries the stickiness and that rule.

       REVISION 12 — THE BLUR MOVED OFF IT, onto `.site-header-glass`
       around the nav rows only, and that one level of nesting is a
       real performance fix rather than tidying.

       `backdrop-filter` was on this element, and this element also
       contained the ticker — thirty-nine marks on a 64-second
       `infinite` transform, running from the first frame of every page
       load for as long as the tab is open. A continuously animating
       descendant inside a backdrop-filter root keeps forcing that
       filter to be re-rasterised: a 10px blur plus a saturate over the
       full width of the viewport, every frame, forever, whether or not
       anything is scrolling. It was the most expensive thing on the
       site per frame, it was at the top of the page where arrival
       already competes with hydration and the cover's shader, and it
       was paid on every route.

       The ticker is now a sibling of the blurred element rather than
       its child, so the filter is only re-evaluated when the backdrop
       actually changes — i.e. while scrolling, which is what it was
       for. The ticker gets an opaque ground instead, which solves
       "forty small marks scrolling under forty small marks" more
       completely than a blur did: nothing shows through at all. */
    <header className="site-header">
      <div className="site-header-glass">
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
            <ul ref={list} className="relative flex items-center gap-5">
              {NAV_ITEMS.map((item, i) => {
                const active = isActiveRoute(item.href, pathname);
                return (
                  <li
                    key={item.href}
                    className="relative"
                    /* The measurement hook, and only on the active one
                       so the query above cannot match two. */
                    data-active={active ? "" : undefined}
                  >
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

                    {/* The static rule: what the server renders, what a
                        visitor with no JS keeps, and what reduced
                        motion keeps. It yields to the slider below the
                        moment that has a real measurement, so the two
                        are never both present.

                        aria-hidden because `aria-current` above already
                        states which destination is active; this is the
                        visual half of a fact that is already
                        announced. */}
                    {active && !marker && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-px left-0 h-px w-full bg-detect"
                      />
                    )}
                  </li>
                );
              })}

              {/* The slider. One element for the whole list, 1px wide
                  and stretched by `scaleX`, so both the travel and the
                  resize are a single compositor transform — see the
                  revision 12 note above. */}
              {marker && (
                <span
                  aria-hidden="true"
                  className="nav-marker"
                  style={{
                    transform: `translate3d(${marker.x}px, 0, 0) scaleX(${marker.w})`,
                  }}
                />
              )}
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
      </div>

      {/* The ticker rides with the header rather than sitting in the
          page, so the thing the owner asked to be "static along with"
          the nav genuinely is. It is the second of the two rows the
          sticky block holds, and the reason that block is kept as
          short as it is.

          PASSED IN, NOT IMPORTED, and that is a performance fix rather
          than a style preference. This file carries "use client", so
          anything it imports joins the client graph — and the ticker
          is thirty-nine marks rendered twice, each with a brand glyph
          and a bat divider, plus the whole of lib/data/skills.ts.
          Measured on the home page, gzipped, importing it here cost
          24 KB more than taking it as a slot, and cost it in the
          expensive place: as JavaScript to parse and execute during
          arrival rather than as markup to stream. The full numbers are
          in the header of components/SkillTicker.tsx.

          It also re-rendered on every route change, because this
          component re-renders on `pathname` — 156 SVG nodes for React
          to diff, for a component that takes no props and holds no
          state and therefore cannot produce a different tree.

          The root layout owns the import. This is the same arrangement
          BrandSprite already uses there, for the same reason. */}
      {ticker}
    </header>
  );
}
