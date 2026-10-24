/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌‌​‌‌​​‌‌‌​​‌‌​‌​​​‌​‌​‌‌​​‌‌​‌​‌​​‌‌​‌‌‌‌​​‌‌​‌‌‌​‌​‌‌​​‌​‌​‌​‌‌​​‌‌‌​​‌‌​‌‌​‌‌​​​​‌‌​​‌‌​‌‌​​​​‌​​‌‌​‌‌​​‌‌‌​‌​​​​‌​‌‌​‌​‌​​​‌​​​‌​​​‌​‌​‌​‌‌​​​​‌‌‌​‌​​​‌​​​‌‌‌​​‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Og4Vjo7YVsl3a6t-DEXtG0
 */
"use client";

import { useEffect } from "react";
import { floorTier, readTier, type FxTier } from "@/lib/usePerfTier";

/* The half of the effects budget that is measured rather than guessed.
 *
 * components/BootScript.tsx picks a starting tier from platform hints —
 * core count, memory, Save-Data, pointer type. Every one of those is a
 * proxy, and proxies get this wrong in both directions: a sixteen-core
 * workstation with software rendering reports as fast and is not, a
 * four-core laptop with a real GPU reports as slow and is fine. The
 * only thing that actually answers the question is the framerate the
 * page is getting, so this samples it and demotes if it is bad.
 *
 * IT IS A PROBE, NOT A MONITOR, and that distinction is the whole
 * design. A permanent requestAnimationFrame loop watching for jank is
 * itself a frame tax forever — the exact thing being guarded against,
 * paid continuously to detect a problem that announces itself in the
 * first few seconds. So this runs for a bounded window and then
 * disconnects for the life of the page.
 *
 * WHY IT WAITS. The first second or two after arrival is the worst
 * framerate the page will ever produce and the least representative:
 * document parsing, hydration, font swap and the first shader compile
 * all land there. Sampling that window would demote nearly every
 * visitor. So the probe starts after the page has settled — the same
 * moment FxBackdrop uses to mount a field at all — and measures the
 * steady state, which is the thing a visitor actually experiences while
 * reading and scrolling.
 *
 * WHY IT ONLY GOES DOWN. A page that demotes on a slow window and
 * promotes on a fast one oscillates, and an effect switching on and off
 * is more distracting than one that never appeared. The tier is a
 * floor: once lowered, it stays lowered for the session, and is
 * remembered for a week so the next visit starts where this one ended
 * instead of re-running the stutter to re-learn the same fact.
 *
 * MOUNTED ONCE, in the root layout, and renders nothing. */

/* Two consecutive bad windows, not one. A single slow window is
   ordinary — a garbage collection, a tab switching in, the compositor
   picking up a newly decoded image. A second one in a row is a
   machine that cannot hold the frame rate. */
const WINDOW_MS = 1000;
const WINDOWS = 6;
const SETTLE_MS = 1800;

/* Below 48fps the page is visibly not smooth; below 30 it is a
   slideshow. The gap between them is deliberately wide, because the
   consequence of crossing the lower one is dropping every canvas on
   the site and that should take real evidence. */
const LITE_BELOW = 48;
const OFF_BELOW = 30;

export default function PerfGuard() {
  useEffect(() => {
    let raf = 0;
    let start = 0;
    let frames = 0;
    let windows = 0;
    let slow = 0;
    let verySlow = 0;
    let stopped = false;

    const apply = (demoted: FxTier) => {
      const next = floorTier(readTier(), demoted);
      if (next === readTier()) return;
      document.documentElement.setAttribute("data-fx", next);
      /* Remembered with a timestamp, so BootScript can honour it next
         visit without it becoming permanent — see the read side there. */
      try {
        localStorage.setItem("fx", `${next}:${Date.now()}`);
      } catch {
        /* Private mode. The demotion still holds for this session; it
           just will not be remembered, which is a tolerable loss. */
      }
    };

    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };

    const sample = (now: number) => {
      if (stopped) return;
      raf = requestAnimationFrame(sample);

      if (!start) {
        start = now;
        return;
      }
      frames += 1;

      const elapsed = now - start;
      if (elapsed < WINDOW_MS) return;

      const fps = (frames * 1000) / elapsed;
      frames = 0;
      start = now;
      windows += 1;

      if (fps < OFF_BELOW) {
        verySlow += 1;
        slow += 1;
      } else if (fps < LITE_BELOW) {
        verySlow = 0;
        slow += 1;
      } else {
        /* A good window clears the count rather than decrementing it.
           Two bad windows means two in a ROW. */
        slow = 0;
        verySlow = 0;
      }

      if (verySlow >= 2) {
        apply("off");
        stop();
        return;
      }
      if (slow >= 2) {
        apply("lite");
        /* Keep sampling: `lite` is a real reduction in work, and the
           remaining windows are what decide whether it was enough. */
        slow = 0;
      }

      if (windows >= WINDOWS) stop();
    };

    /* requestAnimationFrame does not fire in a background tab, so a
       visitor who opens the site in one and reads it later would
       otherwise be measured across the gap — the frame deltas there are
       enormous and would read as a catastrophically slow machine. The
       clean fix is to abandon the probe entirely the moment the tab is
       hidden rather than to try to correct for it: the tier it would
       have produced is not worth the chance of being wrong. */
    const onHidden = () => {
      if (document.hidden) stop();
    };
    if (document.hidden) return undefined;

    document.addEventListener("visibilitychange", onHidden);
    const settle = window.setTimeout(() => {
      raf = requestAnimationFrame(sample);
    }, SETTLE_MS);

    return () => {
      stop();
      window.clearTimeout(settle);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  return null;
}
