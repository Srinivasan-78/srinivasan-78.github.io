/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌‌​‌​‌‌​​‌​​​‌‌​‌​​‌​‌​​​‌‌‌​‌‌​​‌​​​‌‌‌‌​​​​‌‌‌​​‌‌​‌​‌​​‌​​‌‌​‌​​‌​‌​​​​‌‌​​‌‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌‌‌​‌​​​​​‌​‌‌‌​‌‌‌​​‌‌​​​‌​‌‌‌​​​​​​‌‌​‌‌​​​‌‌​‌‌‌​‌‌​‌​‌​​‌​​‌‌​‌​‌‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.mdiGdxsRiC7eWAw1p67jMp
 */
"use client";

import { useEffect, useRef, useState } from "react";

/* A figure that counts up once when it first comes into view.
 *
 * Three things make this safe to ship on a page that otherwise refuses
 * to animate unprompted.
 *
 * One: the final value is rendered on the server and is what sits in
 * the HTML. The count is an enhancement applied after mount, so a
 * visitor with scripting off, or a crawler, or a reader whose observer
 * never fires, sees the real number — never a zero that failed to
 * animate. A stat that can render as "0" is a lie waiting for a bad
 * network.
 *
 * Two: it respects prefers-reduced-motion in JavaScript rather than in
 * CSS. A CSS override cannot stop a number from changing — the
 * animation here is the content, not a transform — so the media query
 * has to be read before the loop starts.
 *
 * Three: it runs once. No replay on scroll back.
 *
 * The easing is a cubic ease-out, so the number decelerates into its
 * final value instead of ticking linearly and stopping dead. */
type CountUpProps = {
  value: number;
  suffix?: string;
  /** Rendered before the number — for a "+" or a currency mark. */
  prefix?: string;
  durationMs?: number;
  className?: string;
};

export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  durationMs = 1100,
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      done.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || done.current) continue;
          done.current = true;
          io.disconnect();

          /* Only now is the displayed value dropped to zero. Doing it
             during render would mean the server-rendered number was
             briefly replaced by a 0 on every hydration, which is a
             flash of wrong data. */
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            setShown(Math.round(value * eased));
            if (t < 1) requestAnimationFrame(tick);
            else setShown(value);
          };
          setShown(0);
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
