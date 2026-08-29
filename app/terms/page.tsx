/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​​​‌‌‌​‌​​​‌​‌​​‌‌​‌​​​‌‌‌​‌‌​​‌​‌​‌​‌​‌​‌​​‌‌​​​​​‌​‌‌‌‌‌​‌‌‌‌​​​​‌​‌​​​​​‌​​‌​‌‌​​‌‌​​​‌​‌‌​​‌​​​‌‌‌‌​‌​​‌​​‌‌​​​‌‌​​​​‌​‌‌‌​​‌​​‌​​​‌​​​‌​​‌​​‌​‌​​‌‌‌‌​‌​​‌‌​​​‌‌​​‌‌​⁠
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
    <main id="content" tabIndex={-1} className="wrap legal" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
        <span className="eyebrow">Legal</span>
        <SplitReveal as="h1" text="Terms of Use" className="display display-lg" />
        <p className="eyebrow">Last updated: {UPDATED}</p>
      </div>

      <p>
        This is the personal portfolio of Srinivasan Vijayaraghavan. By using the site you
        accept the terms below. They&rsquo;re short because the site is simple: it publishes
        information about my work and gives you a way to contact me. Nothing is sold here.
      </p>

      <h2>What the site is</h2>
      <p>
        An informational portfolio. It isn&rsquo;t a product or a service, and there&rsquo;s no
        uptime commitment. Pages, projects and the résumé may change or disappear at any time
        without notice.
      </p>

      <h2>Content and copyright</h2>
      <p>
        The written content, page designs and the résumé on this site are my own work and stay
        my copyright. You&rsquo;re welcome to read it, quote it with attribution, share the links,
        and pass the résumé to colleagues while you&rsquo;re considering me for a role.
      </p>
      <p>A few things need my written permission first:</p>
      <ul>
        <li>Republish the content as your own, in whole or in part.</li>
        <li>
          Use the résumé, my name, or my likeness in job listings, candidate databases, or
          marketing material.
        </li>
        <li>
          Submit me as a candidate to any employer or client. Recruiters must have my explicit
          agreement first — publishing a résumé is not consent to be represented.
        </li>
        <li>Scrape the site to train a commercial model or to build a mailing list.</li>
      </ul>

      <h2>Third-party names and logos</h2>
      <p>
        Names such as AWS, Azure, Terraform, Kubernetes, Datadog, Wireshark, and the employers
        listed in my history belong to their respective owners. They appear here to describe
        the technologies I have worked with and the work I have done. Their appearance is not a
        claim of endorsement, affiliation, or sponsorship in either direction.
      </p>

      <h2>Projects and demos</h2>
      <p>
        The projects section links to demos, repositories, and merge requests. Those are shown
        as work samples. They are provided as is, may go offline, and come with no warranty and
        no support. Where work was done for an employer, only what is public or
        non-confidential is described here, and no proprietary code or client data is
        published.
      </p>

      <h2>Contacting me</h2>
      <p>
        The contact form and the email address are open for genuine professional enquiries, and
        I&rsquo;m glad to hear from you. Please keep them clear of unsolicited sales pitches, bulk
        mail, and anything unlawful, and keep confidential material out of the form, since it
        passes through a third-party service. See the{" "}
        <Link className="lnk" href="/privacy">
          Privacy Policy
        </Link>{" "}
        for how messages are handled.
      </p>
      <p>
        Sending a message does not create any professional, employment, or contractual
        relationship. I may not reply to every message.
      </p>

      <h2>Accuracy</h2>
      <p>
        I keep the site accurate and current as best I can, but it&rsquo;s a portfolio rather
        than a formal record. Nothing on it is professional or technical advice, and it
        doesn&rsquo;t replace a proper reference or background check. Check the certifications
        through the issuers&rsquo; own verification links before relying on them.
      </p>

      <h2>Liability</h2>
      <p>
        The site is provided as is. To the extent the law allows, I accept no liability for any
        loss arising from use of the site, from reliance on its content, or from any linked
        third-party site or demo being unavailable or incorrect. Nothing here limits liability
        that cannot lawfully be limited.
      </p>

      <h2>Changes</h2>
      <p>
        These terms may be updated. The current version is always the one on this page, with
        the date at the top.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India, and the courts of Bangalore, Karnataka
        have jurisdiction over any dispute arising from them.
      </p>

      <h2>Questions</h2>
      <p>
        Email{" "}
        <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
          srinivasan.shyam2000@gmail.com
        </a>
        .
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        <Link className="lnk" href="/privacy">
          Privacy Policy →
        </Link>
      </p>
    </main>
  );
}
