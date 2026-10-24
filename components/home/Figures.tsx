/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌‌‌‌​‌​‌​​​‌​‌​‌​‌‌‌​‌​‌​​‌‌​‌​​​‌​‌​‌‌​​​‌‌​‌​‌​‌​​​‌‌​​‌‌​​‌​‌‌‌‌‌​​‌‌​‌​‌​‌​‌‌​​​​‌​‌​​‌​​‌​​‌‌​‌​‌​​​‌​​​‌‌​‌​​‌​‌‌‌​​​‌​‌‌​‌​‌‌​‌‌‌​‌​​​‌​​‌​​‌​​‌‌​​‌​​‌‌‌​‌‌‌​‌‌‌‌​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1._QWSEcTf_5XRMDiqktI2wz
 */
import CountUp from "@/components/primitives/CountUp";
import Reveal from "@/components/primitives/Reveal";
import Spotlight from "@/components/primitives/Spotlight";
import CaseHead from "./CaseHead";
import { STATS } from "@/lib/data/profile";

/* Case 01 — the six figures, as a scoreboard.

   Six equal tiles would say that all six numbers matter equally, which
   is not true and is also the single most templated shape on the web.
   So the grid is a twelve-column sheet filled unevenly: the leading
   figure takes five columns and two rows, the rest take four, three,
   three, four and seven. The last row stops at seven of twelve and the
   remaining five columns stay empty, because a figure set is allowed to
   end before the edge of the page.

   The lead cell carries a `notch` — a single cut corner, which is what
   makes a panel read as a plate rather than a box. One corner, because
   four would be a badge. It sits on the inner cell rather than on the
   `Reveal` wrapper because both the notch and the wipe are `clip-path`,
   and the second one to be applied simply replaces the first.

   What shows through while a cell is still clipped is the `bg-rule`
   sheet the grid is drawn on, not the page ground — which is the right
   way round here: the plate is ruled first and the figures print onto
   it, in the order they are read.

   The figures are set in the poster register and counted up once on
   first sight. Revision 1 refused the count-up on the grounds that the
   numbers should be legible the instant the page paints — which is
   still true, and is why `CountUp` renders the real value on the server
   and only drops to zero after mount. A failed observer, a reader with
   reduced motion and a crawler all read the true number.

   Revision 1 also set the lead figure twice: once as the big number and
   again inside a dimension line underneath, with its caption repeated
   alongside. The dimension line is gone rather than relabelled — a
   measurement of a figure that is already three inches tall measures
   nothing.

   The cells are drawn as a single ruled block: `gap-px` over a `bg-rule`
   ground means every hairline between two cells is one shared rule
   rather than two adjacent borders, which is the difference between a
   drawing and a stack of boxes.

   The sheet is spotlit. One pointer listener on the wrapper writes two
   custom properties and every cell lights the part of itself nearest
   the cursor, so a six-cell plate behaves like one surface under a lamp
   rather than six independent hover states. The wrapper is `relative`
   on purpose: each cell corrects the grid's pointer offset using its
   own `offsetLeft`, and that is only measured against the host while
   the host is the cells' offset parent.

   `.t-stroke` was tried on the lead figure and rejected. The class
   strokes in `rule-strong`, which is 1.7:1 against the dark ground and
   2.0:1 against the light one — it is a texture-grade colour, correctly,
   because the class exists for a word meant to read as a graphic rather
   than as language. A figure is the most load-bearing content on this
   page; outlining the largest one in a tone you cannot read is the
   legibility bug the last review already caught once. So the lead
   figure gets `.t-depth` instead: the fill stays body-coloured at
   11.6:1 and the second plate prints 2px off-register behind it, which
   is the same comic-lettering idea with none of the cost. */

/* The per-cell spans, in data order. Written out rather than computed
   so the shape of the sheet is readable here instead of inferred. */
const SPANS = [
  "lg:col-span-5 lg:row-span-2",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-7",
];

export default function Figures() {
  const [lead, ...rest] = STATS;

  return (
    <section id="figures" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* The one head on this page with no heading in the data to draw
            on: STATS is a list of figures and carries no prose of its
            own, so the title is a structural label rather than the
            author's words. Everything inside the grid is his. */}
        <CaseHead
          index="01"
          total="05"
          kicker="Figures"
          title="The record, in figures."
        />

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-12">
          {/* The leading figure, given room and the cut corner. */}
          <Reveal effect="wipe" className={SPANS[0]}>
            <div className="notch flex h-full flex-col justify-between bg-ground p-6 sm:p-8">
              <div>
                <span className="t-anno-sm text-mute">01</span>
                <div className="t-poster mt-5 text-[4.5rem] text-body sm:text-[5.5rem]">
                  <CountUp value={lead.value} />
                  {lead.suffix && (
                    <span className="text-[0.32em] text-mute">
                      {lead.suffix}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-8 max-w-xs text-[0.9375rem] leading-relaxed text-mute">
                {lead.label}
              </p>
            </div>
          </Reveal>

          {rest.map((stat, i) => (
            <Reveal
              key={stat.label}
              effect="wipe"
              /* Kept well under the 120ms the primitive warns about:
                 a stagger long enough to notice is a stagger that
                 delays the number it is introducing. */
              delay={(i + 1) * 20}
              className={SPANS[i + 1]}
            >
              <div className="h-full bg-ground p-5 sm:p-6">
                <span className="t-anno-sm text-mute">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <div className="t-poster mt-4 text-[2.5rem] text-body sm:text-[3rem]">
                  <CountUp value={stat.value} />
                  {stat.suffix && (
                    <span className="text-[0.36em] text-mute">
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-mute">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
