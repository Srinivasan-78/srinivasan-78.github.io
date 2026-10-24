/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​‌‌​​​‌​​​‌‌​‌‌​​‌‌‌​‌​‌​‌‌‌​‌‌​​‌‌​‌‌‌​​‌‌​‌​​​​‌​‌‌​‌​​‌‌‌‌​​​​‌​​​‌​‌​​‌‌‌​​‌​‌​‌‌​‌​​​‌​‌‌​‌​‌​​‌​​​​‌​‌‌‌‌‌​‌‌‌‌​‌​​‌​​‌‌​‌​‌​‌​​‌​​‌​​‌​‌​​‌‌‌​​‌‌​‌‌​‌‌​‌​‌​​​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.5b6uvnhZxE9Z-H_zMRJsmB
 */
"use client";

import { useEffect, useState } from "react";
import { AUTHORIZATION_COPY, OPERATIONS_CLOCKS } from "@/lib/data/authorization";

/* The three operations clocks — resolved once, on mount, and then left
   alone.

   Two things this deliberately is not. It is not server-rendered: the
   site is statically exported, so a time baked at build would be a
   confident lie about what time it is now. And it is not ticking. A
   number that changes on its own is motion without input, which the
   brief rules out everywhere; the useful fact here is the timezone
   offset between the reader and these three zones, and that fact does
   not change while they read.

   Before the first client pass the placeholder from the data renders, so
   the layout does not shift and a visitor with scripting off sees the
   zones and a dash rather than a wrong time. */
export default function Clocks() {
  const [times, setTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    setTimes(
      Object.fromEntries(
        OPERATIONS_CLOCKS.map((clock) => [
          clock.id,
          new Date().toLocaleTimeString(clock.locale, {
            timeZone: clock.timeZone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: clock.hour12,
          }),
        ])
      )
    );
  }, []);

  return (
    <div>
      <div className="t-anno-sm mb-3 text-mute">
        {AUTHORIZATION_COPY.clocksLabel}
      </div>

      <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
        {OPERATIONS_CLOCKS.map((clock) => (
          <div key={clock.id} className="bg-ground p-4">
            <dt className="t-anno-sm text-mute">{clock.label}</dt>
            <dd className="t-metric mt-1.5 text-[0.9375rem] text-body">
              {times[clock.id] ?? AUTHORIZATION_COPY.clockPlaceholder}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
