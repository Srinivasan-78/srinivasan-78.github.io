/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​​​‌‌‌​‌​​​‌​‌​​‌‌​‌​​​‌‌‌​‌‌​​‌​‌​‌​‌​‌​‌​​‌‌​​​​​‌​‌‌‌‌‌​‌‌‌‌​​​​‌​‌​​​​​‌​​‌​‌‌​​‌‌​​​‌​‌‌​​‌​​​‌‌‌‌​‌​​‌​​‌‌​​​‌‌​​​​‌​‌‌‌​​‌​​‌​​​‌​​​‌​​‌​​‌​‌​​‌‌‌‌​‌​​‌‌​​​‌‌​​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.0tSGeU0_xPK1dzLarDIOLf
 */
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import SplitReveal from "@/components/SplitReveal";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "The terms covering use of this portfolio site, its content, the résumé and the linked project demos.",
  path: "/terms",
});

const UPDATED = "18 August 2026";

export default function Terms() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="wrap legal py-16 px-6 max-w-4xl mx-auto space-y-8">
        <div className="page-head mb-8">
          <span className="eyebrow text-amber-600 dark:text-[#e5a93b]">Legal</span>
          <SplitReveal as="h1" text="Terms of Use" className="display display-lg" />
          <p className="eyebrow text-[#6e6e73] dark:text-[#86868b]">Last updated: {UPDATED}</p>
        </div>

        <p className="text-base leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
          This is the personal portfolio of Srinivasan Vijayaraghavan. By using the site you
          accept the terms below. They&rsquo;re short because the site is simple: it publishes
          information about my work and gives you a way to contact me. Nothing is sold here.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">What the site is</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            An informational portfolio. It isn&rsquo;t a product or a service, and there&rsquo;s no
            uptime commitment. Pages, projects and the résumé may change or disappear at any time
            without notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Content and copyright</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The written content, page designs and the résumé on this site are my own work and stay
            my copyright. You&rsquo;re welcome to read it, quote it with attribution, share the links,
            and pass the résumé to colleagues while you&rsquo;re considering me for a role.
          </p>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">A few things need my written permission first:</p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-[#424245] dark:text-[#a1a1a6]">
            <li>Republish the content as your own, in whole or in part.</li>
            <li>
              Use the résumé, my name, or my likeness in job listings, candidate databases, or
              marketing material.
            </li>
            <li>
              Submit me as a candidate to any employer or client without my explicit prior agreement.
            </li>
            <li>Scrape the site to train commercial models or to build mailing lists.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Third-party names and logos</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Names such as AWS, Azure, Terraform, Kubernetes, Datadog, Wireshark, and the employers
            listed in my history belong to their respective owners. They appear here to describe
            the technologies I have worked with and the work I have done. Their appearance is not a
            claim of endorsement, affiliation, or sponsorship.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Projects and demos</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The projects section links to demos, repositories, and merge requests. Those are shown
            as work samples. They are provided as is, may go offline, and come with no warranty and
            no support. Where work was done for an employer, only what is public or
            non-confidential is described here.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Contacting me</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The contact form and the email address are open for genuine professional enquiries.
            Please keep them clear of unsolicited sales pitches, bulk mail, and unlawful content.
            See the{" "}
            <Link className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline" href="/privacy">
              Privacy Policy
            </Link>{" "}
            for how messages are handled.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Liability</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The site is provided as is. To the extent the law allows, I accept no liability for any
            loss arising from use of the site or from reliance on its content.
          </p>
        </section>

        <div className="pt-6 border-t border-black/10 dark:border-white/10">
          <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0066cc] dark:text-[#2997ff] hover:underline" href="/privacy">
            <span>Read Privacy Policy →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
