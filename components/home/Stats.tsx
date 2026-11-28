import CountUp from "@/components/primitives/CountUp";
import Reveal from "@/components/primitives/Reveal";
import { STATS } from "@/lib/data/profile";

/* The record, in figures. Replaces `Figures`, which drew the same six
   numbers as an unevenly filled twelve-column ruled plate with a cut
   corner on the lead cell and hairlines shared between neighbours.

   This is six cards on a plain three-up grid, and the evenness is the
   decision rather than a default: the previous layout spent a lot of
   craft saying that the six numbers differ in importance, and they do
   not. They are six facts about the same five years. What varies is
   the lead card, which takes the full width of the first row on a
   desktop because the first number a visitor reads should be the one
   that frames the rest.

   `CountUp` renders the real value on the server and only drops to
   zero after mount, so a failed observer, a reader with reduced motion
   and a crawler all read the true figure. That behaviour is why it is
   reused rather than rewritten.

   No section head: the numbers are the heading. STATS carries no prose
   of its own, so a title here would be a label this file invented. */
export default function Stats() {
  const [lead, ...rest] = STATS;

  return (
    <section id="figures" className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* The lead figure is the section's headline, so it is set like
            one: centred, on its own line, at roughly twice the register
            of the five that follow, with its label underneath as the
            subhead. It used to sit in a flex row opposite its own label
            at the same size as a paragraph of lede, which made the
            biggest fact on the page read as a table row. */}
        <Reveal className="sm:col-span-2 lg:col-span-3">
          <div className="panel flex h-full flex-col items-center gap-5 px-7 py-14 text-center sm:px-9 sm:py-20">
            <div className="t-poster text-[clamp(4.5rem,2.2rem+9.5vw,10rem)] text-body">
              <CountUp value={lead.value} />
              {lead.suffix && (
                <span className="text-[0.28em] text-mute">{lead.suffix}</span>
              )}
            </div>
            <p className="t-lead max-w-md text-mute">{lead.label}</p>
          </div>
        </Reveal>

        {rest.map((stat, i) => (
          <Reveal
            key={stat.label}
            /* A stagger long enough to notice is a stagger that delays
               the number it is introducing. */
            delay={(i + 1) * 40}
          >
            <div className="panel h-full p-6">
              <div className="t-poster text-[2.5rem] text-body">
                <CountUp value={stat.value} />
                {stat.suffix && (
                  <span className="text-[0.36em] text-mute">{stat.suffix}</span>
                )}
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-mute">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
