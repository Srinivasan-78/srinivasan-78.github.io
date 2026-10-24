/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​‌‌​‌​​​‌‌​​‌‌​‌‌​​​‌​‌​​​​​‌‌‌​‌​​​‌​​​​‌​​​‌​‌‌​‌​‌‌​​‌‌‌​‌‌‌‌​​‌​‌​​‌​​​​‌​‌‌​‌​​‌​‌​‌​​​‌‌​‌‌​‌​‌​‌​‌‌‌​‌​​​‌​‌​‌​‌​​‌‌​‌​​​‌​​​‌‌​‌​​‌​‌‌‌​‌‌​​‌​‌​​‌‌​‌​​‌​​‌​‌​​‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.kFlPtB-gyHZTmWESDivSIH
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
   nobody reads a divider as a claim.

   THIS MUST STAY A SERVER COMPONENT, which is why it is mounted from
   app/layout.tsx and passed into Nav as a slot rather than imported by
   Nav directly. Nav carries "use client", so importing it there pulls
   this file — and lib/data/skills.ts with it — into the client graph.

   Measured, both ways, on the home page, gzipped:

     imported by Nav     114 KB HTML + 270 KB JS = 384 KB
     slot from layout    117 KB HTML + 243 KB JS = 360 KB

   The 24 KB is the thirty-nine marks' data and this file's JSX moving
   out of the JavaScript bundle. It is a bigger win than the byte count
   suggests, because the two sides are not equivalent: bytes in the
   bundle have to be parsed and executed as JavaScript on the main
   thread during arrival, while bytes in the HTML are markup the parser
   streams. Shipping a static list of thirty-nine logos as a program
   that builds it was the wrong shape.

   It also stops the reconciliation. Nav re-renders on every `pathname`
   change, and as a direct import this rebuilt all 156 SVG elements for
   React to diff on every navigation — for a component with no props
   and no state, which can never produce a different tree. */
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
