/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌​​‌‌​‌​​​​‌​​​‌​​​‌‌​​​‌‌​‌​​​‌​‌​​‌‌​‌​‌​‌​‌‌​‌​​‌​​​​‌​​​‌‌‌​​​​‌‌‌​​‌​​‌‌‌​​​​​‌​‌​‌‌​​‌‌‌‌​‌​​‌‌‌‌​​​​‌​‌‌​‌​​‌​​‌‌​​​‌​​‌​‌​​‌​​‌‌‌‌​‌‌​‌​‌​​‌‌‌​​‌‌​‌‌​‌​‌​​‌​​​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.BhDcE5ZB8rpVzxZLJOjsjE
 */
"use client";

import { useEffect, useState } from "react";

/* How much decoration this machine can afford, as React state.
 *
 * The same shape as lib/useTheme.ts and for the same reason: the
 * stylesheet can read `html[data-fx]` on its own, so anything doable in
 * CSS should not use this hook. It exists for the vendored WebGL fields
 * in components/reactbits, which are configured through props compiled
 * into shader uniforms and cannot read a custom property.
 *
 * WHY A TIER AND NOT A FEATURE FLAG PER EFFECT. "Potato PC" is not a
 * device, it is a frame budget. There is no reliable way to ask a
 * browser how fast it is — no GPU name, no benchmark that is not itself
 * a cost — so the tier is decided twice, from two different kinds of
 * evidence:
 *
 *   BEFORE PAINT, from what the platform will admit to:
 *   `hardwareConcurrency`, `deviceMemory`, Save-Data, a coarse pointer,
 *   and the motion preference. All cheap, all available synchronously
 *   in components/BootScript.tsx, so CSS and the first client render
 *   both see the answer rather than correcting towards it later. All of
 *   them are hints rather than measurements, which is why they only
 *   ever pick the STARTING tier.
 *
 *   AFTER PAINT, from actual measured framerate — see
 *   components/primitives/PerfGuard.tsx. That is the only honest signal,
 *   and it is the one that catches the cases the hints cannot: a
 *   sixteen-core desktop with no GPU driver acceleration, a laptop on a
 *   thermal limit, a machine already busy with something else.
 *
 * Demotion is one-way within a session. A page that drops to `lite`
 * because frames were slow, then climbs back to `full` because the
 * stutter stopped, oscillates — and an effect that switches on and off
 * repeatedly is worse than one that is simply absent.
 *
 * THE THREE TIERS, as a contract the whole site keeps:
 *
 *   full  Everything. Shaders at device pixel ratio, pointer-reactive
 *         fields, the custom cursor.
 *   lite  Shaders still run, at a fraction of the resolution, with
 *         every per-pointer-event input turned off. The composition is
 *         intact; it just costs a fraction of the fragments and stops
 *         waking up when the mouse moves.
 *   off   No canvas is mounted at all. The static CSS fields that sit
 *         behind every live one carry the composition, which is what
 *         reduced motion has always got — see rules three and four in
 *         components/primitives/FxBackdrop.tsx. */

export type FxTier = "full" | "lite" | "off";

const TIERS: readonly FxTier[] = ["off", "lite", "full"] as const;

export function isTier(value: unknown): value is FxTier {
  return value === "full" || value === "lite" || value === "off";
}

/** The lower of two tiers. Used by the watchdog, which only demotes. */
export function floorTier(a: FxTier, b: FxTier): FxTier {
  return TIERS.indexOf(a) <= TIERS.indexOf(b) ? a : b;
}

export function readTier(): FxTier {
  if (typeof document === "undefined") return "lite";
  const value = document.documentElement.dataset.fx;
  /* A missing attribute means BootScript did not run — scripting
     blocked, or an error before it. Nothing live can mount in that
     state anyway, so the value is academic; `lite` is the safe read. */
  return isTier(value) ? value : "lite";
}

export default function usePerfTier(): FxTier {
  /* Initialised to a constant rather than to `readTier()` so the first
     client render matches the server's markup, which carries no
     `data-fx` at all. Corrected in the effect on the same tick — and
     nothing that consumes this hook mounts anything on the first
     render, so the correction is never visible. */
  const [tier, setTier] = useState<FxTier>("lite");

  useEffect(() => {
    setTier(readTier());

    /* Live, because PerfGuard rewrites the attribute when it measures
       a framerate the hints did not predict. */
    const mo = new MutationObserver(() => setTier(readTier()));
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-fx"],
    });
    return () => mo.disconnect();
  }, []);

  return tier;
}
