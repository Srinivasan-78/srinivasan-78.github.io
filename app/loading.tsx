/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 max-w-5xl mx-auto w-full"
    >
      {/* Header Skeleton */}
      <div className="w-full flex flex-col items-center text-center space-y-4 mb-12 animate-pulse">
        <div className="h-6 w-48 rounded-full bg-black/5 dark:bg-white/10" />
        <div className="h-12 sm:h-16 w-3/4 max-w-2xl rounded-2xl bg-black/5 dark:bg-white/10" />
        <div className="h-4 w-1/2 max-w-md rounded-lg bg-black/5 dark:bg-white/10" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="p-6 sm:p-7 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 flex flex-col justify-between h-56"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 rounded bg-black/5 dark:bg-white/10" />
                <div className="h-4 w-12 rounded-full bg-black/5 dark:bg-white/10" />
              </div>
              <div className="h-6 w-4/5 rounded bg-black/5 dark:bg-white/10" />
              <div className="h-4 w-full rounded bg-black/5 dark:bg-white/10" />
            </div>
            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-between items-center">
              <div className="h-4 w-24 rounded bg-black/5 dark:bg-white/10" />
              <div className="h-4 w-16 rounded bg-black/5 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

