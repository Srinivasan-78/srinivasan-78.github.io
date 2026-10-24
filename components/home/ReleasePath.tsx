/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌‌​‌​‌​​‌‌​‌​​‌‌​​​‌‌​​​‌‌​​‌‌‌​​​​‌‌​​‌​​​‌​​‌​​‌​‌‌‌‌​‌​​‌‌​‌‌​‌​‌‌​​​‌‌​‌​‌​​​‌​‌‌​​‌​‌​‌​‌​​‌‌​‌​​​​‌‌​‌‌​​‌‌​​‌​​​​‌​​​‌‌‌​​‌​‌‌​‌‌‌​​‌​‌​​‌​​‌​‌‌​‌​​​‌‌‌​​​​‌‌‌​‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.SSLc8dIzmcQeSCfB9nRZ8u
 */
import Reveal from "@/components/primitives/Reveal";
import CaseHead from "./CaseHead";
import {
  PIPELINE_COPY,
  RELEASE_FLOW,
  RELEASE_FLOW_CAPTION,
  RELEASE_FLOW_RETURN_PATH,
} from "@/lib/data/pipeline";

/* Case 02 — the release path, drawn.

   This is the one surface on the page that gets `grid-paper`. A
   schematic layer everywhere is wallpaper; a schematic layer on the one
   section that is genuinely a schematic is a register, and the register
   is the whole argument of the design. It is laid in as an absolutely
   positioned sibling rather than as a class on the panel, because
   `.grid-paper` carries `opacity: .4` and opacity applies to a subtree —
   put it on the container and every stage label fades with it.

   The flow needs about 56rem to read at six stages, which is wider than
   a phone. Rather than shrink the type until it is annotation about
   annotation, the row keeps its width and scrolls inside its own box.
   The stages stack vertically below `md`, where a single column is the
   honest shape for a sequence anyway.

   Revision 2 turns the connectors into real geometry. They were six
   hairline `span`s before — a box with a background, which cannot be
   drawn because there is nothing to draw. They are now one continuous
   SVG polyline that runs the length of the rail and dips at every stage
   division, wrapped in `Reveal effect="draw"` so the pipeline inks
   itself once when it is scrolled to, the way a blueprint is inked.

   One stroke rather than a rail plus six ticks, deliberately. A stroke
   is animated by its `stroke-dashoffset`, so a short tick and a long
   rail sharing one dash length would see every tick snap in during the
   first one per cent of the animation. Doubling back over the rail at
   each division makes the whole figure one path, and a single path inks
   from end to end in reading order.

   `vector-effect="non-scaling-stroke"` is what makes the rest of it
   legal: the viewBox is stretched with `preserveAspectRatio="none"` so
   the divisions land on the flex bands whatever width the box ends up,
   and without the non-scaling stroke that same stretch would give the
   horizontal run and the vertical dips different weights.

   The rollback line is drawn beneath, pointing the other way, and it is
   not in `alarm`: a rollback is the recovery path, not the failure, and
   alarm means one thing on this site or it means nothing. */

/* Rail geometry in viewBox units. The divisions are derived from the
   data rather than written out, so adding a seventh stage moves the
   marks instead of silently leaving six. */
const RAIL_W = 1200;
const RAIL_Y = 10;
const TICK_Y = 26;

function railPoints(stages: number): string {
  const band = RAIL_W / stages;
  const points: string[] = [];

  for (let i = 0; i < stages; i++) {
    const x = Math.round(i * band);
    /* Down the division mark and back up, so the figure stays one
       continuous stroke. */
    points.push(`${x},${RAIL_Y}`, `${x},${TICK_Y}`, `${x},${RAIL_Y}`);
  }
  points.push(`${RAIL_W},${RAIL_Y}`);

  return points.join(" ");
}

/* The rail's true length: the horizontal run plus a there-and-back dip
   at every division. The dash length only has to be at least this, and
   an overshoot is invisible — it just starts the line further
   off-stage — so it is rounded up. */
const DRAW_LENGTH = Math.ceil(
  (RAIL_W + RELEASE_FLOW.length * (TICK_Y - RAIL_Y) * 2) / 100
) * 100;

export default function ReleasePath() {
  return (
    <section id="release" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <CaseHead
          index="02"
          total="05"
          kicker={PIPELINE_COPY.eyebrow}
          title={PIPELINE_COPY.heading}
        />

        <figure className="relative border border-rule bg-panel">
          {/* The drawing ground. Decorative, so it is hidden from the
              accessibility tree and cannot be clicked through to. */}
          <div
            aria-hidden="true"
            className="grid-paper pointer-events-none absolute inset-0"
          />

          {/* One `Reveal` for both figures: `.drawn` styles every stroked
              child, so the rail and its return path ink together rather
              than needing an observer each. */}
          <Reveal
            effect="draw"
            drawLength={DRAW_LENGTH}
            className="relative scroll-x p-5 sm:p-8"
          >
            {/* The rail only exists where the stages sit side by side.
                Stacked on a phone, a horizontal rail would be a line
                pointing away from the sequence it describes. */}
            <svg
              aria-hidden="true"
              viewBox={`0 0 ${RAIL_W} ${TICK_Y + 2}`}
              preserveAspectRatio="none"
              className="hidden h-7 w-full md:block md:min-w-[56rem]"
            >
              <polyline
                points={railPoints(RELEASE_FLOW.length)}
                fill="none"
                stroke="var(--c-rule-strong)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <ol className="flex min-w-full flex-col md:min-w-[56rem] md:flex-row md:items-stretch">
              {RELEASE_FLOW.map((stage, i) => (
                <li key={stage.label} className="flex items-stretch md:flex-1">
                  {/* The stacked connector belongs to the stage that
                      follows it, so the column never ends on a dangling
                      rule. Above `md` the drawn rail replaces it. */}
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="my-1 ml-[1.0625rem] w-px shrink-0 bg-rule-strong md:hidden"
                    />
                  )}

                  <div className="flex-1 pt-1 pb-5 pl-4 md:px-4 md:pt-0 md:pb-0 md:pl-0">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 bg-rule-strong"
                      />
                      <span className="t-anno-sm text-mute">
                        {PIPELINE_COPY.stageLabelPrefix}{" "}
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="t-display mt-2 text-lg text-body">
                      {stage.label}
                    </div>

                    {stage.note && (
                      <p className="mt-1.5 max-w-[22ch] text-[0.8125rem] leading-relaxed text-mute">
                        {stage.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            {/* The return path, flowing back the way it came — and drawn
                the same way, with the arrowhead as a second stroke on
                the same figure. */}
            <div className="mt-8 md:min-w-[56rem]">
              <svg
                aria-hidden="true"
                viewBox="0 0 1200 22"
                preserveAspectRatio="none"
                className="h-5 w-full"
              >
                <polyline
                  points="1200,2 1200,12 30,12"
                  fill="none"
                  stroke="var(--c-rule-strong)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <polyline
                  points="46,4 26,12 46,20"
                  fill="none"
                  stroke="var(--c-rule-strong)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <div className="mt-2">
                <div className="t-anno-sm text-mute">Rollback</div>
                <p className="mt-1.5 max-w-prose text-[0.8125rem] leading-relaxed text-mute">
                  {RELEASE_FLOW_RETURN_PATH}
                </p>
              </div>
            </div>
          </Reveal>

          <figcaption className="relative border-t border-rule px-5 py-4 text-[0.8125rem] leading-relaxed text-mute sm:px-8">
            {RELEASE_FLOW_CAPTION}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
