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
    <main id="content" tabIndex={-1} className="wrap legal" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
        <span className="eyebrow">Legal</span>
        <SplitReveal as="h1" text="Privacy Policy" className="display display-lg" />
        <p className="eyebrow">Last updated: {UPDATED}</p>
      </div>

      <p>
        This is a personal portfolio, and your visit stays refreshingly simple. It&rsquo;s a
        static site with no application server, no user accounts and no database behind it. Below
        is exactly what happens to your data when you visit.
      </p>

      <h2>Who runs this site</h2>
      <p>
        Srinivasan Vijayaraghavan, an individual based in Bangalore, India. For any privacy
        question or request, email{" "}
        <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
          srinivasan.shyam2000@gmail.com
        </a>
        .
      </p>

      <h2>What the site stores in your browser</h2>
      <p>
        The site sets no tracking cookies and no advertising cookies. It uses one entry of
        browser <code>localStorage</code>:
      </p>
      <ul>
        <li>
          <b>Notice dismissal</b> — remembers that you closed the privacy notice, so it is not
          shown on every page.
        </li>
      </ul>
      <p>
        Your browser keeps it locally, and you can clear it any time through its site-data
        settings. It stays on your own device.
      </p>

      <h2>Analytics</h2>
      <p>
        Site traffic is measured with <b>Plausible Analytics</b>, a privacy-focused, cookieless
        analytics service. Plausible does not set cookies, does not collect personal data, and
        does not track visitors across sites or over time. It records aggregate counts only:
        page URL, referrer, country, and the general browser and device type. Every visitor stays
        anonymous, and the numbers serve one purpose: telling me which pages are useful.
      </p>
      <p>
        Plausible processes this data in the EU. Their privacy policy is at{" "}
        <a className="lnk" href="https://plausible.io/privacy" target="_blank" rel="noopener">
          plausible.io/privacy ↗
        </a>
        . If you run a content blocker the analytics script just doesn&rsquo;t load, and the site
        works exactly the same.
      </p>

      <h2>The contact form</h2>
      <p>
        The contact form is handled by <b>Formspree</b>, a third-party form service. When you
        submit it, the name, email address, and message you typed are sent to Formspree, which
        forwards them to my email inbox and retains a copy in its own dashboard.
      </p>
      <ul>
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
      <p>
        Formspree&rsquo;s own privacy policy is at{" "}
        <a className="lnk" href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener">
          formspree.io/legal/privacy-policy ↗
        </a>
        . If you would rather not use a third-party form at all, email me directly instead.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The site is hosted on GitHub Pages. Like any web host, GitHub receives the requests
        your browser makes and may log IP addresses for security and abuse prevention. I have
        no access to those logs. See{" "}
        <a
          className="lnk"
          href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
          target="_blank"
          rel="noopener"
        >
          GitHub&rsquo;s privacy statement ↗
        </a>
        .
      </p>

      <h2>Files you download</h2>
      <p>
        The résumé PDF is a plain static file. Downloading it is an ordinary file request.
        Nothing is gated, nothing is tracked per person, and you don&rsquo;t have to give me
        anything for it.
      </p>

      <h2>Links to other sites</h2>
      <p>
        This site links out to LinkedIn, GitHub, GitLab, and project demos. Once you follow one
        of those links you are on someone else&rsquo;s site, under their privacy policy, not
        this one.
      </p>

      <h2>Your rights</h2>
      <p>
        Because the site holds no account data, the only personal data that can exist is a
        contact-form message you chose to send, and you stay in control of it. Ask me at any time
        to tell you what I hold, correct it, or delete it. Email{" "}
        <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
          srinivasan.shyam2000@gmail.com
        </a>{" "}
        and I will action it. There is no charge and no form to fill in.
      </p>

      <h2>Children</h2>
      <p>
        This site is a professional portfolio aimed at an adult audience. It is not directed at
        children and does not knowingly collect data from them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the site ever starts doing something materially different with data, this page
        changes first and the date at the top moves. There&rsquo;s no version history to dig
        through; this page always describes what happens now.
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        <Link className="lnk" href="/terms">
          Terms of Use →
        </Link>
      </p>
    </main>
  );
}
