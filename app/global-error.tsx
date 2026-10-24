/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌​‌​‌​​‌‌‌​​‌​​​‌​​​‌‌​​‌​​​‌‌‌​‌‌‌​‌‌​​​​‌​‌‌‌​‌‌​​‌​‌‌​​‌​‌‌​‌​​‌​‌​‌‌​​​​‌‌‌​‌​​​‌‌‌‌​​‌​‌​​​​​‌​‌‌​‌‌‌‌​‌‌​‌​​​​‌​‌‌‌‌‌​​‌‌​​‌​​‌‌‌​‌‌‌​‌​​‌​‌‌​‌​​‌​​‌​‌​​‌​​​​‌​​‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.ENDdwavYiXtyAoh_2wKIHH
 */
"use client";

import Link from "next/link";
import "./globals.css";

/* The last resort. This replaces the root layout, so it brings its own
   <html> and <body> and gets nothing the layout provides: no nav, no
   footer, no BootScript, no JSON-LD, and — the part worth being honest
   about — none of the font or theme plumbing.

   What that means concretely, rather than optimistically:

   · The three typefaces are loaded by next/font in the layout, which
     publishes them as --font-display-face / --font-sans-face /
     --font-mono-face on <html>. Those custom properties do not exist
     here, so every `font-family` built on them resolves to an invalid
     value and the element silently falls back to the browser default.
     That is why this page does not use `t-display`, `t-anno` or
     `t-metric`: they would look like they were applied and would not
     be. The stacks below are written out literally instead.

   · The theme attribute is written by BootScript before first paint,
     also in the layout. With no attribute, the `:root` block in
     globals.css applies, which is the light palette. A visitor who
     prefers dark will get drafting-paper here. That is a real
     regression in this one state and it is not worth a second copy of
     the palette or an inline script inside an error boundary to fix —
     so it is stated here rather than papered over.

   The colour tokens themselves do work: they live on `:root` in the
   stylesheet this file imports, so `bg-ground`, `text-body` and
   `border-rule` resolve normally and the page still reads as this site
   rather than as a browser error screen.

   `reset()` is preserved and is the one filled control — it is Next's
   re-render of the whole tree and the only thing here that can fix
   anything.

   The email address is written out rather than imported from
   lib/data/profile. That module pulls in the project and certification
   records to build its counts, and a boundary that imports the data
   graph is a boundary that can fail the same way as the thing it is
   catching. One duplicated string is the cheaper risk. */

const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-ground text-body" style={{ fontFamily: SANS }}>
        <main className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="flex items-center gap-4">
            <span
              className="shrink-0 text-mute"
              style={{ fontFamily: MONO, fontSize: "0.625rem", letterSpacing: "0.16em", textTransform: "uppercase" }}
            >
              500
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            <span
              className="shrink-0 text-signal"
              style={{ fontFamily: MONO, fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              Error
            </span>
          </div>

          <h1
            className="mt-6 max-w-2xl text-[2rem] sm:text-[2.75rem]"
            style={{ fontWeight: 400, lineHeight: 1.06, letterSpacing: "-0.012em" }}
          >
            One quick reload should do it
          </h1>

          <p className="mt-5 max-w-[62ch] text-mute">
            The site needs one more go at rendering this page. A reload almost
            always sorts it. If it doesn&rsquo;t, email{" "}
            <a className="link" href="mailto:srinivasan.shyam2000@gmail.com">
              srinivasan.shyam2000@gmail.com
            </a>{" "}
            and I&rsquo;ll get it sorted.
          </p>

          {error.digest && (
            <p
              className="mt-4 text-mute"
              style={{ fontFamily: MONO, fontSize: "0.8125rem" }}
            >
              reference: {error.digest}
            </p>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-signal" onClick={reset}>
              Reload the page
            </button>
            <Link href="/" className="btn">
              Back home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
