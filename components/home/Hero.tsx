import Link from "next/link";
import Reveal from "@/components/primitives/Reveal";
import { HOME_COPY, PROFILE } from "@/lib/data/profile";
import { AUTHORIZATION_COPY } from "@/lib/data/authorization";

/* The cover.

   WHAT THIS REPLACED, because the trade is the whole point of the
   rebrand: a full-bleed WebGL CRT field with a mutating glyph grid and
   a click glitch, a plasma wash on a 24-second transform, a Ben-Day
   halftone screen cut on a diagonal, a pointer-tracking spotlight and
   reticle, a headline printed off-register in two plates, and a status
   line that unscrambled itself after mount. All of it is gone. What
   carries the composition now is type, space, one soft wash of light
   (`.hero-wash` in globals.css §4, three static gradients) and one
   floating glass card.

   Everything the old cover stated, this one still states: the eyebrow,
   the availability line, the headline, both bio paragraphs with the
   repo2graph link intact, the three controls, and the role, employer
   and alma mater in the card. Nothing factual was dropped to make it
   quieter.

   The grid is 7/5 rather than the old 7/4-with-a-gap. A deliberately
   empty ninth column is a case-file convention — the mostly-blank
   opening sheet — and the new language fills the measure and lets the
   air sit above and below the block instead.

   The availability line is plain text. It was the one label on the
   page that resolved out of noise, which was the correct detective
   -mode device and is the wrong one here: a product page states what
   is true and trusts the reader to read it. */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative, so it is hidden from the accessibility tree and
          cannot be clicked through to. */}
      <div
        aria-hidden="true"
        className="hero-wash pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Reveal className="t-anno-sm text-mute">{HOME_COPY.eyebrow}</Reveal>

            <Reveal
              delay={60}
              className="mt-4 inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-rule bg-panel px-3 py-1.5"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-probe"
              />
              <span className="text-[0.75rem] font-medium text-mute">
                {AUTHORIZATION_COPY.readyBadge}
              </span>
            </Reveal>

            {/* The page's one h1. Reveal renders the heading element
                itself rather than wrapping it, so nothing non-semantic
                sits between the landmark and the outline. */}
            <Reveal
              as="h1"
              delay={100}
              className="t-display-xl t-h1 mt-7 max-w-[19ch] text-body"
            >
              {HOME_COPY.headline}
            </Reveal>

            <Reveal
              delay={160}
              className="t-prose t-lead mt-7 text-mute"
            >
              <p>{HOME_COPY.bio}</p>
              <p>
                {HOME_COPY.bioSecondary.before}
                <Link href={HOME_COPY.bioSecondary.link.href} className="link">
                  {HOME_COPY.bioSecondary.link.label}
                </Link>
                {HOME_COPY.bioSecondary.after}
              </p>
            </Reveal>

            {/* Two, not three. `ctaProjects` left with the third
                control: "Explore all N builds" is the same sentence and
                the same destination as the side-projects section's own
                CTA further down, so the cover was spending a control on
                a link the page makes again. The remaining pair is one
                filled primary and one text link rather than two equal
                slabs — three filled buttons in a row read as a toolbar,
                and a cover should ask for one thing. */}
            <Reveal
              delay={220}
              className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <Link href="/contact" className="btn btn-signal">
                {HOME_COPY.ctaContact}
              </Link>
              {/* A real file request, not a gated one — see the privacy
                  page: nothing is tracked per person for this. */}
              <a
                href={PROFILE.resumePath}
                download
                className="link text-[0.9375rem] font-medium"
              >
                {HOME_COPY.ctaResume}
              </a>
            </Reveal>
          </div>

          {/* The front matter, as the one piece of glass on the cover.
              It states only what appears nowhere else on the page —
              role, employer, alma mater. The station is already in the
              eyebrow and the availability is already in the badge. */}
          <Reveal
            delay={260}
            className="lg:col-span-5 lg:col-start-8 lg:mt-2"
          >
            <div className="glass glass-card glass-spec overflow-hidden p-6 sm:p-7">
              <dl className="relative space-y-5">
                <div>
                  <dt className="t-anno-sm text-mute">Role</dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-medium text-body">
                    {PROFILE.roleShort}
                  </dd>
                </div>
                <div className="border-t border-rule pt-5">
                  <dt className="t-anno-sm text-mute">Employer</dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-medium text-body">
                    {PROFILE.currentEmployer}
                  </dd>
                </div>
                <div className="border-t border-rule pt-5">
                  <dt className="t-anno-sm text-mute">Alumni</dt>
                  <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-body">
                    {PROFILE.alumniOf}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
