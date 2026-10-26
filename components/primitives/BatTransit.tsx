/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌​​​‌‌‌​​​​​‌​​​‌‌​​‌​‌​‌‌‌​‌​​​‌‌‌​‌​‌‌​​​​‌​​​​‌​​‌‌​‌‌​​​‌​‌‌​​‌​‌​‌​‌‌​​‌‌‌​​‌​​‌​​‌‌​‌​​‌‌​​​‌​‌​​​​‌​​‌‌‌​​​‌​‌‌​​‌‌​​​‌‌​‌​‌​‌​‌‌​​‌​‌​‌‌​‌​​‌​​‌‌​​​‌​​‌‌​​​‌‌‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.LpFWGXBlYVrM1Bqf5YZLLs
 */
"use client";

import { useEffect, useState } from "react";
import BatGlyph from "./BatGlyph";
import { readTier } from "@/lib/usePerfTier";
import type { Mark } from "@/lib/batGround";

/* The route transition: a swarm crossing the screen.
 *
 * Mounted from app/template.tsx, which React remounts on every
 * navigation — so the whole thing needs no router events, no exit
 * phase and no state machine. It appears, it plays once, it removes
 * itself.
 *
 * WHY IT IS BUILT THIS WAY, in the order the decisions matter.
 *
 * It is an OVERLAY, never content. The earlier CSS route transition
 * animated the page itself, which meant the page had to start at
 * `opacity: 0` and could in principle be left invisible. Nothing here
 * touches the document: it is a `fixed` layer above it that is
 * `aria-hidden` and `pointer-events-none` throughout, so at absolutely
 * no point can it hide, block or delay what someone came to read. The
 * page underneath is complete and interactive the entire time.
 *
 * It REMOVES ITSELF. A fixed full-viewport layer that outlives its
 * animation is a trap, so a timer unmounts it once the last bat has
 * left. `pointer-events-none` means it was never catching clicks even
 * while present, but an element that is merely harmless is not the same
 * as an element that is gone.
 *
 * It does NOT run on first load. A module-level flag survives the
 * template's remounts, so the swarm plays on navigation only. Arriving
 * at the site should show the site, not an animation — and a transition
 * is by definition a thing between two places.
 *
 * It is CSS, not `motion`. Twenty-two elements each needing their own
 * delay, duration, scale and drift is exactly what custom properties
 * plus one keyframe set are for; driving it from JS would mean
 * twenty-two animation instances for no gain.
 *
 * Reduced motion gets NOTHING. Not a shorter swarm — no swarm. A
 * screenful of moving silhouettes is the single most motion-heavy thing
 * on this site, and the setting exists precisely to refuse it.
 *
 * The composition, rather than just "some bats": the swarm is built in
 * three depth tiers, because a flock all at one size and speed reads as
 * a sprite sheet rather than as distance. Far bats are small, slow,
 * faint and blurred; near bats are large, fast, opaque and cross in
 * under a second. Three of the twenty-two fly the opposite way, which
 * is what stops the whole thing looking like a conveyor belt. Every
 * value below is derived from the index rather than random, so the
 * swarm is identical on every navigation — a transition that differs
 * each time reads as a glitch, not as a flourish. */

/* Survives the template remount; resets only on a full page load. */
let navigated = false;

type Bat = {
  /** Vertical start, in vh. */
  top: number;
  /** Size multiplier. */
  scale: number;
  /** Seconds to cross. */
  dur: number;
  /** Seconds before launch. */
  delay: number;
  /** Vertical drift over the crossing, in vh. */
  drift: number;
  /** Wing-beat period in seconds. Smaller bats beat faster. */
  flap: number;
  /** Right-to-left instead of left-to-right. */
  reverse: boolean;
  opacity: number;
  blur: number;
  /** Degrees of body tilt. */
  tilt: number;
};

/* Twenty-two bats over three tiers. Deterministic: a cheap hash on the
   index gives the scatter, so there is variation without randomness. */
const SWARM: Bat[] = Array.from({ length: 22 }, (_, i) => {
  /* Two incommensurate multipliers spread the values without ever
     lining up into a visible pattern. */
  const a = (i * 7919) % 100 / 100;
  const b = (i * 6151) % 100 / 100;

  const tier = i < 9 ? "far" : i < 17 ? "mid" : "near";
  const base =
    tier === "far"
      ? { scale: 0.34, dur: 1.5, opacity: 0.3, blur: 1.6 }
      : tier === "mid"
        ? { scale: 0.62, dur: 1.15, opacity: 0.6, blur: 0.5 }
        : { scale: 1.05, dur: 0.85, opacity: 0.92, blur: 0 };

  return {
    top: 4 + a * 86,
    scale: base.scale * (0.8 + b * 0.45),
    dur: base.dur * (0.85 + a * 0.3),
    /* Launches are packed into the first 420ms so the swarm arrives as
       a burst and thins out, rather than trickling for a second. */
    delay: b * 0.42,
    drift: (b - 0.5) * 26,
    flap: (tier === "far" ? 0.34 : tier === "mid" ? 0.26 : 0.2) * (0.85 + a * 0.3),
    /* Three of them, spaced apart in the list. */
    reverse: i === 4 || i === 12 || i === 19,
    opacity: base.opacity,
    blur: base.blur,
    tilt: (a - 0.5) * 24,
  };
});

/* Long enough for the slowest bat to clear: max(delay) + max(dur),
   plus the shroud's own tail, plus a frame of margin. */
const TOTAL_MS = 1900;

export default function BatTransit({ bats = [] }: { bats?: Mark[] }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    /* First mount of the session: record it and show nothing. */
    if (!navigated) {
      navigated = true;
      return;
    }

    if (
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    /* And nothing on the `off` tier either. The swarm is the heaviest
       thing on the site and that tier means no continuous motion at
       all — but the reason this is a MOUNT check rather than a CSS one
       is specific: `off` is also reached without the motion preference
       (Save-Data, or a remembered demotion from the framerate
       watchdog, which outlives the visit that caused it by a week). In
       those cases the reduced-motion rule that hides this layer does
       not apply, so the swarm mounted with its animations switched off
       by §5f's tier block — and a bat at rest is `left: 0` with no
       transform, which stacked all twenty-two against the left edge of
       the viewport for the life of the overlay. */
    if (readTier() === "off") return;

    setPlaying(true);
    const t = window.setTimeout(() => setPlaying(false), TOTAL_MS);
    return () => window.clearTimeout(t);
  }, []);

  if (!playing) return null;

  return (
    <div className="bat-transit" aria-hidden="true">
      {/* The shroud. A soft darkening that crosses with the swarm, so
          the bats read as passing in front of something rather than as
          stickers on the page. It carries the amber signal at its
          leading edge — the one frame per navigation where the
          searchlight actually sweeps. */}
      <span className="bat-shroud" />

      {SWARM.map((b, i) => (
        <span
          key={i}
          className={`bat-fly${b.reverse ? " bat-rev" : ""}`}
          style={
            {
              "--bat-top": `${b.top}vh`,
              "--bat-scale": b.scale,
              "--bat-dur": `${b.dur}s`,
              "--bat-delay": `${b.delay}s`,
              "--bat-drift": `${b.drift}vh`,
              "--bat-flap": `${b.flap}s`,
              "--bat-opacity": b.opacity,
              "--bat-blur": `${b.blur}px`,
              "--bat-tilt": `${b.tilt}deg`,
            } as React.CSSProperties
          }
        >
          <span className="bat-bob">
            {bats.length ? (
              /* One of the poses cut out of the flock image the owner
                 supplied. A bitmap cannot beat its own wings, so the
                 flap is a scaleY pulse on the whole silhouette — which
                 at this size and speed reads as a wingbeat and costs
                 one transform. */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bats[i % bats.length].src}
                alt=""
                width={bats[i % bats.length].width}
                height={bats[i % bats.length].height}
                className="bat-svg bat-img"
              />
            ) : (
              <BatGlyph className="bat-svg" wings />
            )}
          </span>
        </span>
      ))}
    </div>
  );
}
