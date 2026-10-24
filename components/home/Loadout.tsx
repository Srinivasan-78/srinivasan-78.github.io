/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​​‌‌​​​​​‌‌​‌‌‌​​​‌‌​‌‌​​‌​​‌​‌‌​‌‌​‌​​‌​‌​​‌​​​​‌‌​‌​‌​​​‌‌​​‌​​‌‌​‌‌‌‌​‌‌​‌​​​​‌​​‌​​‌​‌‌‌​‌‌​​​‌‌​​‌‌​‌​‌​​​‌​​‌‌‌​​​​‌​‌​​‌​​‌​​‌​​​​‌​​​‌​​​‌​​‌‌‌‌​​‌‌​​​​​‌​​‌‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.90n6KiHj2ohIv3Q8RHDO0L
 */
import CaseHead from "./CaseHead";
import LoadoutSelect from "./LoadoutSelect";
import Tally from "./Tally";
import { SKILLS_COPY, SKILL_DOMAINS } from "@/lib/data/skills";

/* Case 03 — the loadout.

   The head, the lede and the count are static, so they stay on the
   server; only the domain selection needs state, and that lives in the
   leaf. The figure beside the heading is the number of domains, derived
   from the data rather than written down, so it cannot drift from the
   number of chips below it.

   It counts the domains and not the skills on purpose. The selected
   domain's own skill count is stated inside the leaf, against the
   domain it belongs to, and a total beside the heading plus a subtotal
   forty pixels below it is two numbers for one fact. */
export default function Loadout() {
  return (
    <section id="loadout" className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <CaseHead
          index="03"
          total="05"
          kicker={SKILLS_COPY.eyebrow}
          title={SKILLS_COPY.heading}
          lede={SKILLS_COPY.body}
          aside={
            <Tally value={SKILL_DOMAINS.length} label="Domains" counted />
          }
        />

        <LoadoutSelect />
      </div>
    </section>
  );
}
