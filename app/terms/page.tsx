/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌‌‌​‌‌​‌​‌‌​​‌‌​‌​​​‌​‌​​‌​​‌​​​‌‌​​​‌‌​​​​​‌‌​‌​‌​​​‌‌​‌​​​​‌‌​​‌​​‌‌‌​​​​​‌​​​‌​‌​‌‌​​‌​​​​‌‌‌​​​​​‌‌​‌​‌​‌‌​​‌​‌​​‌‌​​​‌​‌‌​​​‌‌​​‌‌​‌‌‌​‌‌​​​​‌​​‌‌‌​​‌​‌​​​​‌‌​‌​​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Wk4RF0j42pEd85e1c7a9CN
 */
import Link from "next/link";
import LegalSections from "@/components/legal/LegalSections";
import SectionHead from "@/components/primitives/SectionHead";
import { TERMS_COPY } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: TERMS_COPY.metaTitle,
  description: TERMS_COPY.metaDescription,
  path: "/terms",
});

/* The terms of use.

   Deliberately the same construction as the privacy policy, down to the
   numbered margin headings and the dated aside — the two are one
   document in two parts and a reader who has just read the other should
   not have to relearn where anything is. Both render their sections
   through LegalSections, so the shared shape is shared code rather than
   a resemblance that drifts. */
export default function Terms() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SectionHead
          index="01"
          kicker={TERMS_COPY.eyebrow}
          title={TERMS_COPY.heading}
          titleAs="h1"
          lede={TERMS_COPY.lead}
          aside={
            <div className="text-left md:text-right">
              <div className="t-anno-sm text-mute">
                {TERMS_COPY.updatedPrefix}
              </div>
              <div className="t-metric mt-1.5 text-[0.8125rem] text-body">
                {TERMS_COPY.updated}
              </div>
            </div>
          }
        />

        <LegalSections sections={TERMS_COPY.sections} />

        <Link href={TERMS_COPY.crossLink.href} className="btn mt-10">
          {TERMS_COPY.crossLink.label}
        </Link>
      </section>
    </main>
  );
}
