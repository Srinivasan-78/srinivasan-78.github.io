/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​‌‌​‌​‌‌​‌‌​‌​​​​‌​‌​‌‌‌​‌​​‌​​​​‌​​​‌‌‌​‌‌‌​​‌​​‌​‌‌‌‌‌​‌​​​​‌​​‌​​‌‌​‌​‌‌‌​​‌​​‌​​​​​‌​‌​‌​‌​​​‌​‌​‌‌​​‌​‌​​​​​‌‌​‌​‌‌​‌‌‌​‌‌​​​‌‌​‌‌‌​‌​​​‌‌​​‌‌​‌​‌​​‌​‌​‌‌‌​‌‌‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.9khWHGr_BMrATVPkv7FjWv
 */
import Link from "next/link";
import Reveal from "@/components/primitives/Reveal";
import TagRow from "@/components/primitives/TagRow";
import CaseHead from "./CaseHead";
import Clocks from "./Clocks";
import {
  AUTHORIZATION_COPY,
  CLEARANCE_DATA,
} from "@/lib/data/authorization";

/* Case 06 — work authorization.

   The previous design drew this as a fake terminal: a boot sequence, a
   blinking cursor and a "clearance protocol" pass that a recruiter had
   to decode. The information is the least ambiguous content on the
   whole site — two citizenships and a set of regions — and dressing it
   as a security system made a plain fact look like a claim.

   So it is ruled cells. Three regions across a shared hairline grid,
   each one stating its badge, its headline, what it means, where it
   deploys and how it can be engaged. Nothing is hidden behind an
   interaction, because nothing here benefits from being revealed.

   Two long labels used to be printed inside every one of those cells:
   the target-regions label and the contracting-models label, three
   times each. They are now stated once, as a legend above the grid, and
   each cell marks its two lists `01` and `02` against it. A label that
   would repeat per row belongs in a column header; a digit is not a
   label, so repeating it costs nothing.

   The section head has no aside any more. It carried the same
   immediate-hire string the hero's status line carries, which put one
   sentence on the page twice — and replacing it with a bare coloured
   tick would have been status by colour alone. The hero owns that line.

   The cells arrive on a wipe with a short stagger but they do not get
   `.scan`: nothing in them is clickable, and a hover affordance on a
   surface that cannot be used is a promise the page does not keep.

   The flag emoji come from the data and stay: they are content a
   visitor reads, and they are already labelled by the region title next
   to them, so they are hidden from the accessibility tree rather than
   read out as decoration. */
/* Which highlights say something the badge and the status line have not
   already said.

   Matched on the vocabulary of the claim rather than on an index, so
   reordering or adding a highlight in the data cannot silently
   reintroduce the repetition. A bullet whose whole content is
   "no sponsorship required" is dropped; one about tax compliance or
   local availability is kept. */
const RESTATES_AUTHORIZATION =
  /\b(h-1b|opt|sponsorship|visa|work permit|employment authorization|onboarding)\b/i;

function newFactsFor(region: { highlights: string[] }): string[] {
  return region.highlights.filter((h) => !RESTATES_AUTHORIZATION.test(h));
}

export default function Clearance() {
  return (
    <section id="clearance" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        {/* No lede. `AUTHORIZATION_COPY.body` reads "Immediate hire
            eligibility across two primary tech hubs with zero employer
            visa sponsorship overhead" — which is the section heading
            and the two badges restated in one sentence, sitting between
            them. It is the third of the three repetitions described in
            the cell comment below, and it is the one with no content of
            its own at all: the heading states the authorisation, the
            badges state the credentials, and the grid states the
            regions. There is nothing left for a lede to add here, so
            there is no lede. Left in the data rather than deleted,
            alongside `headline`, `summary` and `statusText`, which are
            unrendered for the same reason. */}
        <CaseHead
          index="05"
          total="05"
          kicker={AUTHORIZATION_COPY.eyebrow}
          title={AUTHORIZATION_COPY.heading}
        />

        {/* The legend for the two lists every cell ends with. */}
        <div className="mb-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <div className="t-anno-sm text-mute">
            <span className="text-mute">01</span>{" "}
            {AUTHORIZATION_COPY.regionsLabel}
          </div>
          <div className="t-anno-sm text-mute">
            <span className="text-mute">02</span>{" "}
            {AUTHORIZATION_COPY.engagementLabel}
          </div>
        </div>

        <div className="grid gap-px border border-rule bg-rule lg:grid-cols-3">
          {CLEARANCE_DATA.map((region, i) => (
            <Reveal key={region.id} effect="wipe" delay={i * 25}>
              <div className="h-full bg-ground p-5 sm:p-6">
                <div className="flex items-baseline gap-2.5">
                  <span aria-hidden="true" className="text-base leading-none">
                    {region.flag}
                  </span>
                  <h3 className="t-anno text-body">{region.title}</h3>
                </div>

                {/* Two lines per region, not six.

                    Review: the citizenship is "mentioned multiple
                    times". It was — thirty-two keyword hits on this page
                    — and the cause is that the data states the same two
                    facts six different ways per region. For the US
                    cell: the badge says "US Citizen", the headline says
                    "Full US Employment Authorization", the status says
                    "No Visa Sponsorship Needed", the summary says
                    "A U.S. Citizen … zero visa dependencies, no H-1B
                    transfer overhead", and then highlight one says
                    "No H-1B, OPT, or employer sponsorship required".
                    That is one fact told five times, and repetition
                    reads as insecurity rather than as emphasis.

                    So: the badge is the credential, the status is the
                    consequence, and everything that restated them is
                    gone — `headline` and `summary` are no longer
                    rendered. Nothing is lost that a visitor had not
                    already read one line earlier.

                    The highlights are filtered rather than dropped:
                    each region has exactly one that adds a genuinely
                    new fact — US tax and background-check compliance,
                    Bangalore local availability — and those survive.
                    The ones that only re-say "no sponsorship" do not. */}
                {/* REVISION 4 — `statusText` is no longer rendered
                    either.

                    The comment above removed `headline` and `summary`
                    on the grounds that one fact was being told five
                    times. It did not go far enough. What shipped still
                    said, on one screen: "Authorized to work in the US
                    and India" (the section heading), "zero employer
                    visa sponsorship overhead" (the lede), "US Citizen"
                    (badge), "Ready for Immediate Hire (No Visa
                    Sponsorship Needed)" (status), "OCI Cardholder"
                    (badge), "Indefinite Right to Live & Work in India"
                    (status) — plus "Immediate Hire Ready" in the hero
                    two screens up. Sponsorship three times, immediate
                    hire three times, and the owner's reading of it was
                    that the citizenship is proved, then proved again
                    further down.

                    The badge IS the credential and it is sufficient:
                    "US Citizen" already entails no sponsorship, and
                    "OCI Cardholder" already entails an indefinite
                    right to work. A gloss that spells out what a
                    credential means is for a reader who does not know
                    the credential, and this page is read by recruiters
                    who do. */}
                <div className="t-poster mt-4 text-xl text-body">
                  {region.badge}
                </div>

                {newFactsFor(region).length > 0 && (
                  <ul className="mt-5 space-y-2 border-t border-rule pt-4">
                    {newFactsFor(region).map((h) => (
                      <li
                        key={h}
                        className="flex gap-2.5 text-[0.8125rem] leading-relaxed text-mute"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-px w-2.5 shrink-0 bg-rule-strong"
                        />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                <TagRow
                  className="mt-5"
                  label="01"
                  items={region.deploymentRegions}
                />
                <TagRow
                  className="mt-4"
                  label="02"
                  items={region.engagementModels}
                />
              </div>
            </Reveal>
          ))}
        </div>

        {/* AUTHORIZATION_NOTICE used to be rendered here: a title, a
            two-row definition list and a summary line, all restating
            the cells directly above them for a third time. Its own data
            comment describes it as "the same two facts as they appear
            on the contact page" — which is precisely the reason it does
            not belong on this one as well.

            It is dropped from the render, not deleted from the data:
            the contact page is where a prose statement of work
            authorisation earns its place, next to the form where
            somebody is about to ask.

            CORRECTION, revision 4: that last sentence described an
            intention, not the code. It was never added to the contact
            page — a scan of the built output finds zero citizenship
            strings in contact.html — so `AUTHORIZATION_NOTICE` is
            rendered nowhere on the site and its own data comment
            ("the same two facts as they appear on the contact page")
            describes a page that does not state them.

            Deliberately NOT fixed by adding it there. The brief this
            revision is working to is to remove the duplication, and
            the home page now states the authorisation exactly once:
            heading, two badges, done. Putting a prose restatement on
            the contact page would reintroduce on a second page the
            thing just removed from the first. The notice stays dead
            data; if it is ever wanted, it is the only copy of that
            prose and it is correct. */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Link href="/contact" className="btn">
              {AUTHORIZATION_COPY.cta}
            </Link>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <Clocks />
          </div>
        </div>
      </div>
    </section>
  );
}
