"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, isActiveRoute } from "@/lib/nav";
import ThemeToggle from "./ThemeToggle";

/* The floating glass nav.

   It replaces the dossier header: a full-width sticky bar with
   numbered destinations, a tracked-out mono type register and a
   thirty-nine-mark skills ticker riding underneath it. What is here
   now is a capsule that hovers over the page with the content
   visibly passing beneath — see `.site-header` and
   `.site-header-glass` in globals.css §5g for the surface itself.

   THE ACTIVE STATE IS A SLIDING PILL, not a sliding hairline, and it
   works the same way the hairline did: one element that is a
   persistent child of the list, moved by the route change, rather
   than two elements cross-fading. A CSS transition handles that case
   natively — there is nothing here that needs an animation library,
   and the previous revision's note records what reaching for one
   cost (215 KB raw, on every route, for a one-pixel line).

   `translate3d` + `scaleX` on a 1px-wide box means both the travel
   and the width ride on one compositor transform. Re-targeting
   mid-flight works because a CSS transition whose target changes
   interpolates from the current computed value, so clicking a third
   destination while the pill is still travelling redirects it from
   wherever it has got to.

   Reduced motion gets no slide. The pill is not mounted at all and
   the static per-item background below is what renders — which is
   also the first-paint and no-JS state, so the active destination is
   never unmarked and never wrong. */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* Close on route change. Without this the drawer stays open over
     the new page, because the component is not remounted by
     navigation. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* The pill's measured box, or null for "not measured yet, or motion
     is refused" — in which case the static per-item background is
     what renders. */
  const list = useRef<HTMLUListElement | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;

    const reduce =
      typeof matchMedia !== "undefined"
        ? matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const place = () => {
      if (reduce?.matches) {
        setPill(null);
        return;
      }
      const item = ul.querySelector<HTMLElement>("[data-active]");
      if (!item || !item.offsetWidth) {
        setPill(null);
        return;
      }
      setPill({ x: item.offsetLeft, w: item.offsetWidth });
    };

    place();

    /* Three things move the items after the first measurement, and
       all three would leave the pill under the wrong word: a viewport
       resize, the text face arriving and re-metricking the labels,
       and the visitor changing the motion setting. */
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

  /* Two surfaces, not one. At the very top the capsule is invisible and
     the hero reads uninterrupted; past the first scroll it becomes the
     dense glass plane in globals.css §5b. The threshold is small on
     purpose — the shift should read as the page moving under a fixed
     object, not as a thing that happens later on.

     No rAF loop and no measurement: the handler compares one boolean
     and React drops the update when it has not changed. */
  const [raised, setRaised] = useState(false);
  useEffect(() => {
    const onScroll = () => setRaised(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Escape closes it. A drawer that can only be dismissed by hitting
     the same small button again is a trap on a phone. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div
        /* The open drawer hangs off the capsule, so a transparent
           capsule above a dense sheet would read as two unrelated
           objects. */
        data-scrolled={raised || open ? "" : undefined}
        className="site-header-glass flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5"
      >
        {/* Identity. The full name at the weight the display register
            carries, with the role beneath it on wide screens only —
            at 390px the two lines plus five destinations is a capsule
            with nothing in it but type. */}
        <Link
          href="/"
          className="group min-w-0 shrink-0 rounded-[var(--r-sm)] px-1 py-0.5"
        >
          <span className="t-display block text-[0.9375rem] leading-tight text-body transition-colors duration-200 group-hover:text-signal">
            Srinivasan Vijayaraghavan
          </span>
          <span className="mt-0.5 hidden text-[0.6875rem] leading-tight text-mute sm:block">
            DevOps &amp; Site Reliability
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop destinations */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul ref={list} className="relative flex items-center gap-0.5">
              {/* The pill. Rendered first so it paints behind the
                  labels without either needing a z-index. */}
              {pill && (
                <span
                  aria-hidden="true"
                  className="nav-pill"
                  style={{
                    transform: `translate3d(${pill.x}px, 0, 0) scaleX(${pill.w})`,
                  }}
                />
              )}

              {NAV_ITEMS.map((item) => {
                const active = isActiveRoute(item.href, pathname);
                return (
                  <li
                    key={item.href}
                    className="relative"
                    /* The measurement hook, and only on the active
                       one so the query above cannot match two. */
                    data-active={active ? "" : undefined}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative block rounded-[var(--r-pill)] px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors duration-200 ${
                        active
                          ? "text-body"
                          : "text-mute hover:text-body"
                      } ${
                        /* The static state: what the server renders,
                           what a visitor with no JS keeps, and what
                           reduced motion keeps. It yields to the
                           slider the moment that has a real
                           measurement, so the two are never both
                           drawn. */
                        active && !pill ? "bg-panel-2" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ThemeToggle />

          {/* Mobile trigger. A real hamburger that crosses out — the
              two bars rotate into an X, which is the one icon
              transition worth the four lines it costs because it
              states the control's own state. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-[var(--r-pill)] border border-rule text-body transition-colors duration-200 hover:bg-panel-2 md:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-200 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-full rounded-full bg-current transition-transform duration-200 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0.5"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile destinations. `hidden` rather than a class toggle, so
          nothing inside is focusable while it is shut. */}
      <nav
        id="nav-panel"
        aria-label="Primary"
        hidden={!open}
        className="nav-drawer md:hidden"
      >
        <ul className="p-2">
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-[var(--r-sm)] px-3.5 py-3 text-[0.9375rem] font-medium transition-colors duration-200 ${
                    active ? "bg-panel-2 text-body" : "text-mute"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
