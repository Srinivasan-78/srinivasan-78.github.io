/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌​​‌‌​​‌​​​‌​​​​‌‌​‌‌‌​‌‌‌​‌‌​​​‌‌​‌‌‌​​​​​‌​‌​‌‌​​‌​‌‌​‌​​‌​‌​​​‌​‌‌​‌​‌‌​‌​​‌​‌​​‌‌‌‌​‌​​‌‌‌​‌​​​​‌‌​​​‌​‌‌​‌​​​​‌​​‌‌‌​​‌‌​‌‌‌​​‌​​​‌​‌​‌‌​​‌‌​​‌​​‌‌‌​​‌‌​​​‌‌​‌​​​‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.BdCwcpVZQkJzt1hNnEfNcG
 */
import Link from "next/link";
import { FOOTER_LINKS, FOOTER_COPY, PROFILE } from "@/lib/data/profile";

/* The colophon.

   Set as a drawing's title block: the ruled strip at the corner of a
   technical drawing that records who drew it, when, and under what
   revision. That is a real convention rather than a borrowed look, and
   it is the correct form for a footer on a site whose subject is
   provenance — this is a repository where every source file carries a
   keyed authorship watermark and a bot audits the account nightly to
   check they are all still there.

   The year is computed, not written. A footer that says 2026 in 2027 is
   the smallest possible broken promise, and this one is rendered on the
   server at build time — the site is statically exported — so it is the
   build date rather than the visitor's clock. For a site that rebuilds
   on every push that is the more honest of the two. */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    /* No top rule — see the matching note in components/Nav.tsx. The
       header's bottom border and this one were the two sides of a frame
       around the whole document. The title block below keeps its own
       rules, because a drawing's title block genuinely is a bordered
       box; what it does not need is a second border enclosing the
       sheet it sits on. */
    <footer className="mt-16">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* The title block. Three ruled cells on a wide screen, stacked
            on a narrow one, each labelled in the annotation register. */}
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
          <div className="bg-ground p-4">
            <div className="t-anno-sm mb-1.5 text-mute">Drawn by</div>
            <div className="t-display text-base text-body">{PROFILE.name}</div>
            <div className="t-anno-sm mt-1 text-mute">{PROFILE.role}</div>
          </div>

          <div className="bg-ground p-4">
            <div className="t-anno-sm mb-1.5 text-mute">Station</div>
            <div className="t-metric text-[0.8125rem] text-body">
              {PROFILE.location}
            </div>
            <div className="t-anno-sm mt-1 text-mute">{PROFILE.website.host}</div>
          </div>

          <div className="bg-ground p-4">
            <div className="t-anno-sm mb-1.5 text-mute">Revision</div>
            <div className="t-metric text-[0.8125rem] text-body">
              © {year} · MIT
            </div>
            <div className="t-anno-sm mt-1 text-mute">
              Watermarked at source
            </div>
          </div>
        </div>

        <nav
          aria-label="Footer"
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5"
        >
          {FOOTER_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-anno-sm text-mute transition-colors duration-150 hover:text-detect"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="t-anno-sm text-mute transition-colors duration-150 hover:text-detect"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <p className="t-anno-sm mt-5 text-mute">
          © {year} {FOOTER_COPY.copyrightSuffix}
        </p>
      </div>
    </footer>
  );
}
