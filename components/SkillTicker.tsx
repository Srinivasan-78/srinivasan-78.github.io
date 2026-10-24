/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌​‌​‌‌​​‌‌​​‌‌​​‌​‌​‌​​‌‌‌​​‌‌​‌‌‌​​‌‌​​‌​‌​‌‌‌‌​​‌​‌​‌‌​‌​​‌​​​​‌​​‌‌‌​‌‌‌​‌‌‌​​‌​​​‌‌‌​​‌​‌‌​​​‌​​‌​‌​‌​​​‌‌​‌‌​‌​​‌‌‌​​​​​‌‌‌​​‌​‌​​‌​​‌​‌‌​​​​‌​‌​‌​‌​‌​‌‌​​​‌​​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.EfeNneyZBwr9bTm89IaUbO
 */
import BatGlyph from "@/components/primitives/BatGlyph";
import BrandMark from "@/components/primitives/BrandMark";
import { TOOLING_STRIP, TOOLING_STRIP_LABEL } from "@/lib/data/skills";

/* The skills ticker — thirty-nine marks in continuous rotation,
   directly under the sticky header.

   THIS OVERRULES AN EARLIER DECISION, ON INSTRUCTION, AND THE OLD
   REASONING IS WORTH KEEPING. components/home/Tooling.tsx opened with
   "Not a marquee", and gave two arguments: an auto-scrolling strip is
   motion without input, and it moves the thing the pointer is trying
   to land on. The first is a genuine trade the owner has now made
   deliberately — the brief for this revision is explicitly for more
   motion, and a ticker is the one place on the site where continuous
   movement is the convention rather than a violation of it.

   The second argument was the real one, and it is answered rather than
   discarded: NOTHING IN HERE IS A TARGET. Every mark is an inert node
   with no link, no button and no hover state, so there is nothing for
   a pointer to chase. The strip also pauses on hover and on focus
   within, so even the act of looking closely stops it. That is the
   difference between this and the logo loop that was deleted from this
   site in an earlier pass: that one was a row of links that moved.

   HOW THE LOOP WORKS. The list is rendered twice and the track is
   translated by exactly -50%, so the second copy arrives in the first
   copy's starting position at the moment the animation resets — there
   is no seam and no jump. The duplicate is `aria-hidden` so the
   accessibility tree sees the marks once; the region carries one name
   for the whole strip, because these are a statement of what the work
   is built with rather than thirty-nine destinations.

   Reduced motion stops the animation and lets the strip scroll
   horizontally instead, so the content stays reachable rather than
   being frozen at whichever thirteen marks happened to be visible.

   The bat between each mark is the divider, and it is the same
   silhouette that crosses the screen on navigation — see
   components/primitives/BatGlyph.tsx. A separator is the one place a
   motif can repeat thirty-nine times without becoming a logo, because
   nobody reads a divider as a claim. */
export default function SkillTicker() {
  /* One pass of the marks. Rendered twice below. */
  const run = (duplicate: boolean) => (
    <ul
      className="ticker-run"
      aria-hidden={duplicate ? "true" : undefined}
    >
      {TOOLING_STRIP.map((mark) => (
        <li key={mark.id} className="ticker-item">
          <BrandMark mark={mark} className="ticker-glyph" />
          <span className="t-anno-sm whitespace-nowrap text-mute">
            {mark.title}
          </span>
          <BatGlyph className="ticker-bat" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      role="group"
      aria-label={TOOLING_STRIP_LABEL}
      className="ticker"
    >
      <div className="ticker-track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
