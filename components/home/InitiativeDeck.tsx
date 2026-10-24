/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​‌​‌​​‌​​​​​‌‌‌​​‌​‌‌​‌‌‌‌​‌‌​​​‌​​‌​‌‌​​​​‌‌​‌​​‌​‌​‌‌‌‌‌​​‌‌​​​​​‌‌‌​​‌​​‌‌​​‌​​​‌‌​​​​‌​‌​​‌​‌​​‌‌​​​‌​​‌​‌​‌​‌​‌​‌​​​​​‌‌​​‌​‌​‌‌‌​‌​‌​‌​‌​‌​​​‌​​‌‌​​​‌​​​​‌​​‌‌‌‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.iH9obXi_0rdaJbUPeuTLBx
 */
"use client";

import { useState } from "react";
import Disclose from "@/components/primitives/Disclose";
import Icon from "@/components/primitives/Icon";
import Panel from "@/components/primitives/Panel";
import Reveal from "@/components/primitives/Reveal";
import TagRow from "@/components/primitives/TagRow";
import {
  COMPANIES,
  EXPERIENCE_COPY,
  INITIATIVES,
  type CompanyFilter,
} from "@/lib/data/experience";
import { iconToken } from "./icon-token";

/* The dossier core: twenty initiatives, filtered by employer.

   Two caps, both deliberate. Six panels show at once, because twenty at
   full height is a scroll nobody finishes and a "show all" the visitor
   never asked to be spared. And the problem/solution pair sits behind a
   disclosure, because the summary and the metric are what a reader
   skims and the pair is what they read when one of them catches.

   `problem` is passed as the panel's contingency line rather than being
   buried in the disclosure. Every one of these records states what was
   broken before the work — a weekend maintenance window, a manual
   runbook, hand-edited DNS under time pressure — which is exactly the
   failure mode the brief requires a panel to admit. The solution then
   lives inside, where it belongs: the fix is the long read, the failure
   is the headline.

   The case index is the initiative's position in INITIATIVES, not its
   position in the filtered view, so case 14 is case 14 whichever chip
   is pressed. A case number that renumbers itself is not a case number.

   The tenure strip that used to sit above the grid is gone. It printed
   both employers' tenure strings and the job title under each — and the
   section's own lede already states the initiative count and both
   tenures in the author's sentence, two inches higher. The strip was
   the same four facts set a second time as a table, and the job title
   is in the hero's front matter besides.

   The panels carry `.scan`: one bright edge and a faint diagonal sheen
   under the pointer, which is the Arkham convention of a surface
   resolving under scrutiny. It is behind `@media (hover: hover)` in CSS
   and it is on panels that are already interactive — every one of these
   opens — so it is an affordance rather than the only signal that a
   thing can be used. */

const VISIBLE_CAP = 6;

export default function InitiativeDeck() {
  const [company, setCompany] = useState<CompanyFilter>(COMPANIES[0]);
  const [showAll, setShowAll] = useState(false);

  /* COMPANIES[0] is the unfiltered state rather than an employer — see
     the note on the constant. */
  const filtered = INITIATIVES.map((item, i) => ({ item, caseIndex: i + 1 })).filter(
    ({ item }) => company === COMPANIES[0] || item.company === company
  );

  const visible = showAll ? filtered : filtered.slice(0, VISIBLE_CAP);
  const hidden = filtered.length - visible.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {COMPANIES.map((name) => (
          <button
            key={name}
            type="button"
            className="chip"
            aria-pressed={name === company}
            onClick={() => {
              setCompany(name);
              /* Collapsing on a filter change keeps the cap honest:
                 otherwise pressing "show all" once silently disables it
                 for every later selection. */
              setShowAll(false);
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* The leading initiative of whatever is selected takes the full
          width; the rest sit two up. An even grid of twenty identical
          cells says every initiative weighs the same. */}
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        {visible.map(({ item, caseIndex }, i) => (
          <Reveal
            key={item.id}
            effect="wipe"
            /* A short stagger down the grid, capped so the last cell is
               never waiting on the first. */
            delay={Math.min(i, 4) * 25}
            className={i === 0 ? "lg:col-span-12" : "lg:col-span-6"}
          >
            <Panel
              className="scan hud h-full"
              index={String(caseIndex).padStart(2, "0")}
              total={String(INITIATIVES.length)}
              kicker={item.category}
              title={item.title}
              contingency={item.problem}
            >
              <div className="flex items-center gap-2.5 text-mute">
                <Icon name={iconToken(item.icon)} className="h-4 w-4" />
                <span className="t-anno-sm">{item.role}</span>
              </div>

              <p className="t-metric mt-4 text-[0.8125rem] text-body">
                {item.metrics}
              </p>

              <p className="mt-3 text-[0.875rem] leading-relaxed text-mute">
                {item.summary}
              </p>

              <TagRow className="mt-5" items={item.stack} wrap />

              <Disclose
                className="mt-5 border-t border-rule pt-4"
                openLabel="Read the fix"
                closeLabel="Close"
                summary={
                  <span className="t-anno-sm block text-mute">
                    {item.link
                      ? EXPERIENCE_COPY.linkedLabel
                      : EXPERIENCE_COPY.noLinkLabel}
                  </span>
                }
              >
                <div className="pt-4">
                  <p className="text-[0.875rem] leading-relaxed text-mute">
                    {item.solution}
                  </p>

                  {item.link && (
                    <p className="mt-4">
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link text-[0.875rem]"
                      >
                        {item.link.label}
                      </a>
                    </p>
                  )}
                </div>
              </Disclose>
            </Panel>
          </Reveal>
        ))}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          className="btn mt-8"
          onClick={() => setShowAll(true)}
        >
          Show all {filtered.length} {EXPERIENCE_COPY.showMoreNoun}
        </button>
      )}
    </div>
  );
}
