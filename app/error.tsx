/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌​​​‌​​‌​​​​​‌‌‌​​​​‌‌​‌​‌‌​‌‌​​​‌‌​‌​​​​‌‌​​‌‌‌​​​​‌​‌‌‌‌‌​‌‌‌​​‌​​‌‌​​​‌​​​‌‌​‌​​​‌‌​​​‌​​‌​‌‌​‌​​​‌​‌‌​‌​‌​‌‌​‌​​‌​​‌‌​​​‌‌‌​‌‌​​‌​​​‌​​​‌​‌‌​​​​‌‌‌​​​‌​‌‌‌​‌​​​​‌‌​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.TH8kcC8_rb4bZ-ZLvDXqt2
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Icon from "@/components/primitives/Icon";
import SectionHead from "@/components/primitives/SectionHead";
import { NOT_FOUND_ROUTES } from "@/lib/data/profile";

/* The route-level error boundary.

   `reset()` is Next's re-render of the failed segment and it is the only
   thing on this page that can actually fix anything, so it is the one
   filled control. The `console.error` in the effect is preserved too:
   this site has no error-reporting service, which means the browser
   console is the only place a digest ever lands.

   The admission uses the `contingency` line, same as the 404 — a
   boundary that says "oops, something went wrong" and nothing else is a
   boundary pretending it does not know what happened. It says which
   layer failed and that nothing was lost.

   The destinations are the 404's routes rather than a second list kept
   in this file: there is exactly one set of places a stuck visitor
   should be offered, and two copies of it drift. */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SectionHead
          index="500"
          kicker="Application Error"
          title="Let’s try that again."
          titleAs="h1"
        />

        <p className="contingency max-w-2xl">
          <span>Contingency</span>
          <span>
            A client component encountered an unexpected error. Everything you
            had is safe.
          </span>
        </p>

        {/* The digest is the only handle anyone has on this failure, so
            it is set in the metric register and shown verbatim rather
            than summarised. */}
        {error.digest && (
          <p className="t-metric mt-4 text-[0.8125rem] text-mute">
            Reference code: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button type="button" onClick={reset} className="btn btn-signal">
            Try Again
          </button>
          <Link href="/" className="btn">
            Back Home
          </Link>
        </div>

        <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {NOT_FOUND_ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="flex h-full flex-col justify-between bg-ground p-5 transition-colors duration-150 hover:text-detect sm:p-6"
            >
              <div>
                <div className="flex items-center gap-2.5 text-mute">
                  <Icon name={route.icon} className="h-4 w-4" />
                  <h2 className="t-anno">{route.title}</h2>
                </div>

                <p className="mt-4 text-[0.875rem] leading-relaxed text-mute">
                  {route.body}
                </p>
              </div>

              <span className="t-anno-sm mt-6 flex items-center justify-between gap-3 border-t border-rule pt-4 text-body">
                {route.go}
                <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
