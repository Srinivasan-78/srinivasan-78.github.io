import Reveal from "@/components/primitives/Reveal";
import SectionHead from "@/components/primitives/SectionHead";
import { HOME_COPY } from "@/lib/data/profile";
import {
  RELEASE_FLOW,
  RELEASE_FLOW_CAPTION,
  RELEASE_FLOW_RETURN_PATH,
} from "@/lib/data/pipeline";

/* How a release reaches production. Replaces `ReleasePath`.

   What that drew: a six-stage rail as one continuous SVG polyline that
   inked itself on scroll, dipping at every stage division, over a
   graph-paper ground, with a second drawn polyline and an arrowhead
   beneath it for the rollback — a measured engineering drawing, laid
   on drafting paper, in a horizontally scrolling box 56rem wide.

   What it draws now: six numbered cards. The sequence is carried by
   the numbers and the reading order rather than by a drawn rail, which
   is what lets it reflow to one, two or three columns instead of
   scrolling sideways on a phone. Every stage label and note survives,
   so does the caption, and so does the rollback paragraph — the
   rollback is still the recovery path and still not in `alarm`,
   because alarm means one thing on this site or it means nothing.

   The copy is the lede here. `HOME_COPY.reliability` carried the
   section's own eyebrow, heading and body and the previous home page
   never rendered any of it — it used the pipeline module's strings
   instead. Both sets exist in the data; this uses the one written for
   this section. */
export default function Reliability() {
  return (
    <section
      id="release"
      className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <SectionHead
        size="lg"
        kicker={HOME_COPY.reliability.eyebrow}
        title={HOME_COPY.reliability.heading}
        lede={HOME_COPY.reliability.body}
        titleReveal
      />

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {RELEASE_FLOW.map((stage, i) => (
          <li key={stage.label}>
            <Reveal delay={i * 30}>
              <div className="panel h-full p-6">
                <div className="flex items-baseline gap-3">
                  <span className="t-metric text-[0.8125rem] text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="t-display text-[1.0625rem] text-body">
                    {stage.label}
                  </h3>
                </div>
                {stage.note && (
                  <p className="mt-2.5 text-[0.875rem] leading-relaxed text-mute">
                    {stage.note}
                  </p>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal delay={60} className="mt-3">
        <div className="glass glass-spec overflow-hidden p-6 sm:p-7">
          <div className="relative">
            <h3 className="t-anno-sm text-mute">Rollback</h3>
            <p className="t-prose mt-2.5 text-[0.9375rem] leading-relaxed text-body">
              {RELEASE_FLOW_RETURN_PATH}
            </p>
          </div>
        </div>
      </Reveal>

      <p className="mt-6 max-w-3xl text-[0.875rem] leading-relaxed text-mute">
        {RELEASE_FLOW_CAPTION}
      </p>
    </section>
  );
}
