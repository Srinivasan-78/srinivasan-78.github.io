/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​​​‌​​‌‌​​​​‌‌​‌​‌​‌​‌​‌​‌​‌‌‌​​‌​​‌​‌​‌​‌​​‌‌​​‌​​‌​‌​​​‌​‌‌‌​‌‌‌​‌​‌​​‌‌​‌​​​‌‌‌​‌‌‌‌​​‌​‌‌​‌​​​​‌​​​​‌​​‌‌​‌‌​‌​‌​‌​​​​​‌​​​​‌​​‌​​‌​​‌​‌​​‌‌​​​‌​​‌‌‌​​‌​​‌‌‌‌​‌​‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.4L5UrU2QwSGyhBmPBILNOY
 */
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import SplitReveal from "@/components/SplitReveal";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What this site stores, and how the contact form and analytics look after your data.",
  path: "/privacy",
});

const UPDATED = "18 August 2026";

export default function Privacy() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="wrap legal py-16 px-6 max-w-4xl mx-auto space-y-8">
        <div className="page-head mb-8">
          <span className="eyebrow text-amber-600 dark:text-[#e5a93b]">Legal</span>
          <SplitReveal as="h1" text="Privacy Policy" className="display display-lg" />
          <p className="eyebrow text-[#6e6e73] dark:text-[#86868b]">Last updated: {UPDATED}</p>
        </div>

        <p className="text-base leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
          This is a personal portfolio, and your visit stays refreshingly simple. It&rsquo;s a
          static site with no application server, no user accounts and no database behind it. Below
          is exactly what happens to your data when you visit.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Who runs this site</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Srinivasan Vijayaraghavan, an individual based in Bangalore, India. For any privacy
            question or request, email{" "}
            <a className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline" href="mailto:srinivasan.shyam2000@gmail.com">
              srinivasan.shyam2000@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">What the site stores in your browser</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The site sets no tracking cookies and no advertising cookies. It uses one entry of
            browser <code>localStorage</code>:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-[#424245] dark:text-[#a1a1a6]">
            <li>
              <b>Notice dismissal</b> — remembers that you closed the privacy notice, so it is not
              shown on every page.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Your browser keeps it locally, and you can clear it any time through its site-data
            settings. It stays on your own device.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Analytics</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Site traffic is measured with <b>Plausible Analytics</b>, a privacy-focused, cookieless
            analytics service. Plausible does not set cookies, does not collect personal data, and
            does not track visitors across sites or over time. It records aggregate counts only:
            page URL, referrer, country, and the general browser and device type. Every visitor stays
            anonymous, and the numbers serve one purpose: telling me which pages are useful.
          </p>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Plausible processes this data in the EU. Their privacy policy is at{" "}
            <a className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline" href="https://plausible.io/privacy" target="_blank" rel="noopener noreferrer">
              plausible.io/privacy ↗
            </a>
            . If you run a content blocker the analytics script just doesn&rsquo;t load, and the site
            works exactly the same.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">The contact form</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The contact form is handled by <b>Formspree</b>, a third-party form service. When you
            submit it, the name, email address, and message you typed are sent to Formspree, which
            forwards them to my email inbox and retains a copy in its own dashboard.
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1 text-[#424245] dark:text-[#a1a1a6]">
            <li>
              <b>What I do with it:</b> read it and reply. That is the only purpose.
            </li>
            <li>
              <b>Who else sees it:</b> nobody. It is not added to a mailing list, not sold, and not
              shared with third parties.
            </li>
            <li>
              <b>How long it is kept:</b> as long as the conversation is useful. Ask me to delete a
              submission and I will remove it from both my inbox and the Formspree dashboard.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Formspree&rsquo;s own privacy policy is at{" "}
            <a className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline" href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
              formspree.io/legal/privacy-policy ↗
            </a>
            . If you would rather not use a third-party form at all, email me directly instead.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Hosting and server logs</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The site is hosted on GitHub Pages. Like any web host, GitHub receives the requests
            your browser makes and may log IP addresses for security and abuse prevention. I have
            no access to those logs. See{" "}
            <a
              className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline"
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub&rsquo;s privacy statement ↗
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Files you download</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            The résumé PDF is a plain static file. Downloading it is an ordinary file request.
            Nothing is gated, nothing is tracked per person, and you don&rsquo;t have to give me
            anything for it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Your rights</h2>
          <p className="text-sm leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            Because the site holds no account data, the only personal data that can exist is a
            contact-form message you chose to send, and you stay in control of it. Ask me at any time
            to tell you what I hold, correct it, or delete it. Email{" "}
            <a className="lnk text-[#0066cc] dark:text-[#2997ff] hover:underline" href="mailto:srinivasan.shyam2000@gmail.com">
              srinivasan.shyam2000@gmail.com
            </a>{" "}
            and I will action it.
          </p>
        </section>

        <div className="pt-6 border-t border-black/10 dark:border-white/10">
          <Link className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0066cc] dark:text-[#2997ff] hover:underline" href="/terms">
            <span>Read Terms of Use →</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
