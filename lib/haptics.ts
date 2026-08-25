"use client";

/* The site's haptic vocabulary, in one place.

   Three patterns, and deliberately only three. Haptics work the way
   punctuation works: a small set of marks, each always meaning the same
   thing, is read without effort — and a device that buzzes at everything
   trains the hand to stop noticing that it buzzed at all. So these are
   reserved for the moments that actually commit something.

     detent   one option clicks into place under a finger
     commit   something the visitor asked for succeeded
     reject   something they asked for did not

   The character of each matches the character of the event: a detent is
   a single short tick because a physical one is; a rejection is two
   short pulses, because a doubled pattern is what reads as "no" without
   needing to be stronger, and a stronger buzz for an error is the device
   telling someone off.

   Every one of these has to fire on the same frame as the visual it
   belongs to. A haptic that lags its animation is worse than no haptic:
   the two stop reading as one event and start reading as two.

   The Vibration API is unsupported on iOS Safari entirely, and gated
   behind a user-activation requirement elsewhere. Both cases simply
   return false, and neither is a problem worth reporting — a haptic is
   an enhancement to feedback that is already carried visually. */

type Pattern = "detent" | "commit" | "reject";

const PATTERNS: Record<Pattern, number | number[]> = {
  detent: 8,
  commit: 14,
  reject: [10, 60, 10],
};

export function haptic(pattern: Pattern) {
  try {
    navigator.vibrate?.(PATTERNS[pattern]);
  } catch {
    /* A browser that throws rather than returning false. Nothing to do
       about it, and nothing lost. */
  }
}
