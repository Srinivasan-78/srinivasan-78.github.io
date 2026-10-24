/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​​​​‌‌​​‌‌‌​‌​​​‌​​​‌​‌​​‌​​‌​‌​​​‌​‌​​​‌‌​​‌​‌​‌‌‌​‌‌​​​​‌​‌‌​​‌‌​​​‌‌​​‌​​‌​​‌​​​​‌‌​‌​‌​​​‌‌​‌​​​‌‌​‌‌‌‌​‌​‌​​‌​​​‌‌​‌​‌​‌​​‌‌​‌​‌‌​​‌​‌​‌​​‌​‌‌​‌‌​‌‌​‌​​‌‌​​​‌​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.pgDRQFWaf2Hj4oR5MeKm1O
 */

/* The route placeholder.

   No spinner and no pulse. A spinner claims progress that nothing here
   measures, and the site's motion rule is that nothing moves without
   input — a skeleton that throbs is the page demanding attention while
   it has nothing to show. So this is the shape of a section head and
   three ruled cells, drawn in the panel value step and holding still.

   It is announced once, politely, through `role="status"` and the
   sr-only line rather than through anything visual: a screen-reader
   visitor does not benefit from grey rectangles. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading content"
      className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      {/* The section-head shape: index, rule, kicker — the same
          furniture every real page opens with, so the swap when the
          content lands does not move the layout. */}
      <div aria-hidden="true">
        <div className="mb-5 flex items-center gap-4">
          <span className="h-2.5 w-7 shrink-0 bg-panel-2" />
          <span className="h-px flex-1 bg-rule" />
          <span className="h-2.5 w-24 shrink-0 bg-panel-2" />
        </div>

        <div className="h-9 w-full max-w-2xl bg-panel-2 sm:h-12" />
        <div className="mt-4 h-3.5 w-full max-w-xl bg-panel-2" />
        <div className="mt-2.5 h-3.5 w-2/3 max-w-md bg-panel-2" />

        <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-3">
          {[0, 1, 2].map((cell) => (
            <div
              key={cell}
              className="flex h-44 flex-col justify-between bg-ground p-5 sm:p-6"
            >
              <div>
                <div className="h-2.5 w-16 bg-panel-2" />
                <div className="mt-4 h-5 w-4/5 bg-panel-2" />
                <div className="mt-3 h-3 w-full bg-panel-2" />
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-rule pt-4">
                <div className="h-2.5 w-20 bg-panel-2" />
                <div className="h-2.5 w-6 bg-panel-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
