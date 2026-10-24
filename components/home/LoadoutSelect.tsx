/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌​‌​​‌‌​‌​​​​‌​‌‌​​‌​‌‌​‌​​​​‌‌​‌​​‌​​‌‌​‌​‌​‌​​​​‌​​‌​‌​​‌​​‌​​‌​​​​​‌‌​‌​​​‌​‌​‌​​​​‌‌​‌​‌​‌‌‌​‌‌‌​‌‌​​‌​‌​​‌‌​‌‌​​‌​​‌​‌​​‌‌​‌​‌​​‌​​‌​‌‌​‌‌​‌​‌‌​‌​​‌​​​​‌‌‌‌​‌​​‌‌​​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.JhYhi5BRH4T5we6JjKkHzb
 */
"use client";

import Link from "next/link";
import { useState } from "react";
import Disclose from "@/components/primitives/Disclose";
import Icon from "@/components/primitives/Icon";
import { SKILLS_COPY, SKILL_DOMAINS } from "@/lib/data/skills";
import { iconToken } from "./icon-token";

/* The loadout — the games register handled as systems legibility rather
   than as arcade dressing. Seven domains, forty-seven skills, each one
   carrying a role, a tenure, a production context and an outcome.

   The whole set rendered flat is forty-seven open panels, which is the
   mistake the previous design made. So: one domain selected at a time,
   and inside it one skill open at a time by the visitor's choice. The
   chips are `aria-pressed` buttons rather than tabs because the panel
   below is a region of content, not a tab panel with a roving focus
   contract, and claiming the wrong pattern in ARIA is worse than
   claiming none.

   Revision 1 argued that a spec block of every skill name on the left
   and the same names again as disclosures on the right were "two
   resolutions" of one set, the way a character sheet and an item
   tooltip are. The review disagreed and the review was right: a
   character sheet and a tooltip are never in the same viewport. Every
   one of those names was on screen twice, three inches apart, and the
   left column added only a tenure — which belongs on the row the name
   is already on.

   So the two columns now carry different things. Left: which domain is
   selected, what it covers, how much of it there is, and how much of it
   can be checked against public code. Right: the skills themselves,
   each with its tenure on its own row.

   The domain name does appear on the pressed chip as well as on the
   heading below it, and that is not the same fault. One is the label of
   a control and the other names the region the control switched to —
   a select screen and the thing selected. Removing the heading would
   leave the region with no accessible name at all.

   The two long section labels the inspector used to print — the
   production-context and key-impact headings — are gone from the rows.
   They were two forty-character strings repeated once per skill, seven
   times down a single column, and they told a reader nothing the order
   of the paragraphs does not. The context is the long read, set in the
   secondary colour; the deliverable follows it above a rule, set in
   body colour. Position and weight, which is what a printed page uses. */
export default function LoadoutSelect() {
  const [domainId, setDomainId] = useState(SKILL_DOMAINS[0].id);
  const domain =
    SKILL_DOMAINS.find((d) => d.id === domainId) ?? SKILL_DOMAINS[0];

  /* How much of this domain's claim can be opened in a browser. The
     count is derived here rather than stated in the data because it is
     a property of which skills happen to carry a project, and a number
     typed next to a list is a number that goes stale. */
  const provenCount = domain.primarySkills.filter((s) => s.project).length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {SKILL_DOMAINS.map((d) => (
          <button
            key={d.id}
            type="button"
            className="chip"
            aria-pressed={d.id === domain.id}
            onClick={() => setDomainId(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-8">
        {/* The selected domain, at domain resolution. */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2.5 text-mute">
            <Icon name={iconToken(domain.icon)} className="h-4 w-4" />
            <span className="t-anno-sm text-mute">
              {String(SKILL_DOMAINS.indexOf(domain) + 1).padStart(2, "0")} /{" "}
              {String(SKILL_DOMAINS.length).padStart(2, "0")}
            </span>
          </div>

          <h3 className="t-display mt-3 text-2xl sm:text-[1.75rem]">
            {domain.label}
          </h3>

          <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-mute">
            {domain.description}
          </p>

          {/* Two figures about the domain rather than a list of the
              things in it. The second one is the honest half: a count of
              the skills in this domain whose claim points at code a
              reader can open. */}
          <dl className="mt-8 grid grid-cols-2 gap-px border border-rule bg-rule">
            <div className="bg-ground p-4">
              {/* "In domain" rather than "Skills": the section kicker is
                  already the word Skills, and two inches is not far
                  enough apart for the same label twice. */}
              <dt className="t-anno-sm text-mute">In domain</dt>
              <dd className="t-poster mt-2 text-[2.25rem] text-body">
                {domain.primarySkills.length}
              </dd>
            </div>
            <div className="bg-ground p-4">
              <dt className="t-anno-sm text-mute">
                {SKILLS_COPY.proofOfWorkLabel}
              </dt>
              <dd className="t-poster mt-2 text-[2.25rem] text-body">
                {provenCount}
              </dd>
            </div>
          </dl>
        </div>

        {/* The skills themselves. */}
        <div className="lg:col-span-6 lg:col-start-7">
          {/* The two column headers for the rows below, stated once.
              The tenure label used to caption a spec block on the left;
              it now labels the column the tenures actually sit in. */}
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <div className="t-anno-sm text-mute">{SKILLS_COPY.statusLabel}</div>
            <div className="t-anno-sm text-mute">{SKILLS_COPY.tenureLabel}</div>
          </div>

          <ul className="divide-y divide-rule border-y border-rule">
            {domain.primarySkills.map((skill) => (
              /* Keyed on the domain as well as the name so switching
                 domain remounts the row rather than reusing the
                 previous one's open state against new content. */
              <li key={`${domain.id}-${skill.name}`} className="py-4">
                <Disclose
                  openLabel="Inspect"
                  closeLabel="Close"
                  summary={
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="min-w-0">
                        <span className="t-display block text-base text-body">
                          {skill.name}
                        </span>
                        <span className="t-anno-sm mt-1 block text-mute">
                          {skill.role}
                        </span>
                      </span>

                      {/* The tenure, on the row the name is already on —
                          which is the whole fix for this section. */}
                      <span className="t-metric shrink-0 text-right text-[0.8125rem] text-mute">
                        {skill.tenure}
                      </span>
                    </span>
                  }
                >
                  <div className="pt-4">
                    <p className="text-[0.875rem] leading-relaxed text-mute">
                      {skill.productionContext}
                    </p>

                    <p className="mt-4 border-t border-rule pt-4 text-[0.9375rem] leading-relaxed text-body">
                      {skill.highlight}
                    </p>

                    {/* A claim in the loadout that can be checked
                        against real code rather than taken on trust.
                        The label for this is the figure on the left; the
                        row itself is just the build. */}
                    {skill.project && (
                      <p className="mt-4">
                        <Link
                          href={`/projects/${skill.project.slug}`}
                          className="link text-[0.875rem]"
                        >
                          {skill.project.title}
                        </Link>
                      </p>
                    )}
                  </div>
                </Disclose>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
