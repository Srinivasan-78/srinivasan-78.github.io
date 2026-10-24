/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌‌​​‌‌​​‌‌‌​​‌‌​‌‌‌​‌​​‌‌​‌​​‌‌​​‌‌​‌‌​​‌‌​​‌​​​​‌‌​‌‌​‌​​‌​‌‌​‌​​‌​‌​‌‌​‌​​‌​​​‌​​​‌‌​​​​‌​‌‌‌‌​​​​​‌‌​‌‌‌​‌‌‌‌​​‌​‌‌​​​‌‌​‌​‌‌​‌​​‌‌​‌‌​‌​​‌‌​‌​‌​‌​​‌​‌​​‌​‌​​​​​‌​​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Vg7M3fCiiZDax7ycZm5JPM
 */
"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/* Text that resolves out of noise, once, when it first comes into view.
 *
 * The reactbits "decrypted text" effect, and the one borrowed effect
 * that is genuinely *about* this subject rather than decoration on it:
 * a label resolving under scrutiny is the Arkham detective-mode
 * convention, and the site is a dossier. Used on one or two labels, not
 * on prose.
 *
 * The constraint that shapes the whole implementation: **the real text
 * must be what sits in the HTML.** It is rendered as the initial state
 * and only replaced after mount, so a crawler, a reader with scripting
 * off, and anyone whose observer never fires all get the actual words.
 * An effect that can leave a headline as "X7#@ b2$" on a bad network is
 * not an effect, it is a bug — the same rule CountUp follows for
 * numbers.
 *
 * Reduced motion is read in JavaScript, not CSS, because the animation
 * here *is* the text content. A CSS override cannot stop a string from
 * being scrambled.
 *
 * Spaces are never scrambled, so the word shape and the line breaks
 * hold still while the glyphs settle. Without that the headline reflows
 * on every frame, which is both ugly and a layout thrash. */

/* Deliberately not the full ASCII soup. These are the glyphs that read
   as instrumentation rather than as swearing, which keeps a half-
   resolved headline looking like a readout instead of a mistake. */
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/\\=+*<>";

type DecryptTextProps = {
  text: string;
  as?: ElementType;
  /** Total settle time. Keep it short — this is a label, not a show. */
  durationMs?: number;
  className?: string;
};

export default function DecryptText({
  text,
  as: Tag = "span",
  durationMs = 700,
  className = "",
}: DecryptTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(text);
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

          const start = performance.now();
          const chars = [...text];

          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / durationMs);
            /* Characters lock left to right as t advances, so the line
               reads as resolving rather than as flickering at random. */
            const settled = Math.floor(t * chars.length);

            setShown(
              chars
                .map((ch, i) => {
                  if (i < settled || ch === " ") return ch;
                  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                })
                .join("")
            );

            if (t < 1) requestAnimationFrame(tick);
            else setShown(text);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [text, durationMs]);

  return (
    <Tag ref={ref} className={className}>
      {shown}
    </Tag>
  );
}
