/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​‌‌‌​‌‌‌​‌‌​​‌‌​​‌‌​​​‌‌​‌​‌​​​​​‌‌‌​‌‌​​‌‌‌​‌​‌​‌‌​‌​‌​​‌‌​‌‌‌​​‌‌​​​‌​​‌​‌​​‌‌​‌​​​‌‌​​‌‌‌​​‌‌​‌​​​​‌​​‌‌‌​‌​​​‌​​‌​​‌​‌​​‌​​​​‌​​‌​‌​​​‌‌​​​‌​‌‌​​​‌‌​‌‌​‌​​‌​‌‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.zwfcPvujnbSFsBtIHJ1ciq
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";

/* The route-level error boundary. Next renders this in place of the page
   when a client component below it throws, keeping the header, the footer
   and the theme — so a broken section costs a section, not the site.
   <GlobalError> in app/global-error.tsx catches the rarer case where the
   layout itself is what failed.

   What it deliberately does not show: the error message, the stack, or the
   component that threw. In a production build the only thing Next gives the
   client is `digest`, a hash it also writes to the server log, and that is
   the right amount — enough to match a report to a log line, not enough to
   describe the internals of the site to whoever hit the fault. */

const ROUTES = [
  { href: "/", title: "Home", body: "Profile, skills, and availability." },
  { href: "/projects", title: "Projects", body: "Live tools and platform engineering builds." },
  { href: "/contact", title: "Contact", body: "Send a message." },
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The browser console is the only sink this site has — there is no
    // error-reporting service wired up, and adding one would be a new
    // third party in the privacy policy.
    console.error(error);
  }, [error]);

  return (
    <main id="content" tabIndex={-1} className="wrap" style={{ padding: "3.5rem 24px 5rem" }}>
      <div className="page-head">
        <span className="eyebrow">Error</span>
        <h1 className="display display-lg">Let&rsquo;s try that again</h1>
        <p>
          The page loaded, and one piece of it just needs another go. Everything you had is
          safe. Give it another try, and if it keeps happening do let me know at{" "}
          <a className="lnk" href="mailto:srinivasan.shyam2000@gmail.com">
            srinivasan.shyam2000@gmail.com
          </a>
          .
        </p>
        {error.digest && (
          <p className="eyebrow" style={{ marginTop: "0.75rem" }}>
            reference: {error.digest}
          </p>
        )}
      </div>

      <div className="hero-actions" style={{ marginTop: "2rem" }}>
        <button type="button" className="btn primary" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn">
          Back home
        </Link>
      </div>

      <div className="explore-grid" style={{ marginTop: "2.5rem" }}>
        {ROUTES.map((r) => (
          <GlowCard key={r.href}>
            <Link href={r.href} className="card">
              <h2 className="card-title">{r.title}</h2>
              <p className="card-body">{r.body}</p>
              <span className="go">Go to {r.title.toLowerCase()}</span>
            </Link>
          </GlowCard>
        ))}
      </div>
    </main>
  );
}
