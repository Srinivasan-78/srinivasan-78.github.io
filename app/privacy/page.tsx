/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌‌​​‌​‌​​​‌​‌‌​​‌‌‌​​‌‌​‌‌​​​‌‌‌​​​​‌​​​​‌‌​‌​​​​‌‌​‌‌​​‌‌​​‌‌‌​​​‌​‌​‌‌​‌​​‌​​‌‌​​​‌​‌​‌​​​‌​​‌​​​​‌​​​‌​‌​‌‌‌​‌‌‌​‌​​‌‌‌​​‌‌‌‌​​‌​‌‌​​​‌‌​‌​​‌​‌​​‌‌‌​​‌​​‌​‌​​‌​​‌‌​​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.FQg68CCfqZLTHEwNycJrRa
 */
import Link from "next/link";
import LegalSections from "@/components/legal/LegalSections";
import SectionHead from "@/components/primitives/SectionHead";
import { PRIVACY_COPY } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PRIVACY_COPY.metaTitle,
  description: PRIVACY_COPY.metaDescription,
  path: "/privacy",
});

/* The privacy policy.

   Read by the small number of people who care about exactly this, so it
   is typeset as a document rather than hidden in a 12px grey column: the
   seven sections are numbered, the headings sit out in their own margin,
   and the prose keeps a 68ch measure. The whole thing is prose from the
   data — including the links, which are stored as records and spliced
   back into the sentences by LegalSections.

   The last-updated date is the aside rather than a line under the title.
   On a legal page it is the second thing a reader looks for, and it is a
   date, so it belongs in the metric register next to the head. */
export default function Privacy() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SectionHead
          index="01"
          kicker={PRIVACY_COPY.eyebrow}
          title={PRIVACY_COPY.heading}
          titleAs="h1"
          lede={PRIVACY_COPY.lead}
          aside={
            <div className="text-left md:text-right">
              <div className="t-anno-sm text-mute">
                {PRIVACY_COPY.updatedPrefix}
              </div>
              <div className="t-metric mt-1.5 text-[0.8125rem] text-body">
                {PRIVACY_COPY.updated}
              </div>
            </div>
          }
        />

        <LegalSections sections={PRIVACY_COPY.sections} />

        <Link href={PRIVACY_COPY.crossLink.href} className="btn mt-10">
          {PRIVACY_COPY.crossLink.label}
        </Link>
      </section>
    </main>
  );
}
