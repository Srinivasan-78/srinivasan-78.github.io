import Link from "next/link";
import Reveal from "@/components/primitives/Reveal";
import { HOME_COPY, PROFILE, TRUST_MARKS } from "@/lib/data/profile";

/* The closing call to action.

   Also unrendered since revision 6, which cut it because the nav had
   just become sticky and the hero already carried a Contact control —
   so a terminal CTA was the third copy of one destination on one page.

   It is back because the two things that argument rested on both
   changed. The nav is a compact floating capsule now rather than a
   full bar with five labelled destinations, so "Contact" is no longer
   legible from every scroll position; and the page it closes is longer
   than the one that argument was written about. A visitor who has read
   to the bottom of five sections should not have to go looking for the
   next step.

   `TRUST_MARKS` is rendered here and nowhere else. The two claims it
   holds are the two the work-authorisation section does not make — the
   track record and the open-source maintainership — which is exactly
   why the other six entries were removed from it. */
export default function Closing() {
  return (
    <section
      id="contact-cta"
      className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28"
    >
      <Reveal>
        <div className="glass glass-card glass-spec overflow-hidden px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="relative mx-auto max-w-2xl">
            <h2 className="t-display-xl t-h2 text-body">
              {HOME_COPY.closing.heading}
            </h2>
            <p className="t-lead mt-5 text-mute">{HOME_COPY.closing.body}</p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="btn btn-signal">
                {HOME_COPY.closing.ctaPrimary}
              </Link>
              <a
                href={PROFILE.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                {HOME_COPY.closing.ctaSecondary}
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {TRUST_MARKS.map((mark) => (
                <li key={mark} className="text-[0.8125rem] text-mute">
                  {mark}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
