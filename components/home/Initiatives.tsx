/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​‌​​‌‌‌​​​‌​‌‌‌‌​​​​‌‌​​‌‌​​‌​‌​‌​​​‌‌​​‌​‌​‌​‌‌‌‌‌​​‌‌‌​​​​‌​​​‌‌‌​‌‌​‌​​​​‌‌‌‌​​‌​‌‌‌​​‌​​‌‌‌‌​​​​‌‌‌​‌‌‌​‌​​‌‌​​​‌​​‌‌​​​‌‌​‌‌​​​​‌​‌‌​‌​​‌‌​‌‌​​‌‌‌​​​‌​‌​​‌​‌​​​‌‌‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.rqxfTe_8GhyrxwLLl-6qJ8
 */
import Link from "next/link";
import CaseHead from "./CaseHead";
import InitiativeDeck from "./InitiativeDeck";
import Tally from "./Tally";
import { EXPERIENCE_COPY, INITIATIVES } from "@/lib/data/experience";
import { PROJECTS } from "@/lib/projects";

/* Case 04 — the enterprise record. The head is static; the filter and
   the cap are the only stateful parts and they live in the deck.

   The initiative count is set as a scoreboard figure rather than as a
   mono metric: it is the headline number of this section, and a figure
   meant to be read across the room belongs in the poster register. */
export default function Initiatives() {
  return (
    <section id="initiatives" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <CaseHead
          index="04"
          total="05"
          kicker={EXPERIENCE_COPY.eyebrow}
          title={EXPERIENCE_COPY.heading}
          lede={EXPERIENCE_COPY.body}
          aside={
            <div>
              {/* A structural label, not `showMoreNoun` — that string
                  is written to sit inside the deck's show-all sentence,
                  and borrowing it here would print it twice. */}
              <Tally value={INITIATIVES.length} label="Initiatives" counted />
              <Link
                href="/projects"
                className="t-anno-sm mt-2 block text-right text-mute transition-colors duration-150 hover:text-detect"
              >
                {EXPERIENCE_COPY.viewAllLinkPrefix} {PROJECTS.length}{" "}
                {EXPERIENCE_COPY.viewAllLinkSuffix}
              </Link>
            </div>
          }
        />

        <InitiativeDeck />
      </div>
    </section>
  );
}
