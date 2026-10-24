/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​‌​​​‌‌​‌​​​‌‌‌​​‌​​‌‌‌‌​‌​​​‌‌​‌‌​​‌​‌​‌‌​​‌​​‌​‌​​‌​‌​​‌‌​‌​‌​​‌​​‌‌‌​​‌​​‌​​​‌‌​​‌‌​‌‌‌‌​​‌‌​‌‌‌​‌‌​‌‌‌‌​‌​​‌​‌​​‌​​​‌​​​‌​‌​​​‌​‌​​​​‌‌​‌‌​​‌‌‌​‌​‌‌​‌​​​‌​‌‌​‌​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.r4rz6VJSRrFo7oJDQCgZ-O
 */
import Link from "next/link";
import Icon from "@/components/primitives/Icon";
import SectionHead from "@/components/primitives/SectionHead";
import { THANK_YOU_COPY, THANK_YOU_NEXT } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

/* `noindex` is preserved from the previous build and is not cosmetic:
   this page is the form's confirmation and means nothing to anyone who
   arrives at it from a search result. `follow` stays on, so the links
   out of it still count. */
export const metadata = pageMetadata({
  title: THANK_YOU_COPY.metaTitle,
  description: THANK_YOU_COPY.metaDescription,
  path: "/thank-you",
  noindex: true,
});

/* The confirmation page.

   Two jobs, in order: say plainly that the message arrived and when a
   reply can be expected, then offer somewhere to go. Nothing here
   celebrates — a tick the size of a dinner plate is the page enjoying
   itself at the visitor's expense when all they wanted was to know the
   form worked.

   The three destinations are ruled cells on a shared hairline grid, the
   same construction as the 404's four. The résumé is a plain <a download>
   rather than a <Link>, because it is a file rather than a route. */
export default function ThankYou() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SectionHead
          index="01"
          kicker={THANK_YOU_COPY.eyebrow}
          title={THANK_YOU_COPY.heading}
          titleAs="h1"
          lede={THANK_YOU_COPY.body}
        />

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
          {THANK_YOU_NEXT.map((card) => {
            const inner = (
              <>
                <div>
                  <div className="flex items-center gap-2.5 text-mute">
                    <Icon name={card.icon} className="h-4 w-4" />
                    <h2 className="t-anno">{card.title}</h2>
                  </div>

                  <p className="mt-4 text-[0.875rem] leading-relaxed text-mute">
                    {card.body}
                  </p>
                </div>

                <span className="t-anno-sm mt-6 flex items-center justify-between gap-3 border-t border-rule pt-4 text-body">
                  {card.go}
                  <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                </span>
              </>
            );

            const cellClass =
              "flex h-full flex-col justify-between bg-ground p-5 transition-colors duration-150 hover:text-detect sm:p-6";

            /* A file rather than a route, so a plain anchor: <Link>
               would have the router try to navigate to a PDF. */
            return card.download ? (
              <a key={card.href} href={card.href} download className={cellClass}>
                {inner}
              </a>
            ) : (
              <Link key={card.href} href={card.href} className={cellClass}>
                {inner}
              </Link>
            );
          })}
        </div>

        <Link href="/" className="btn mt-10">
          {THANK_YOU_COPY.home}
        </Link>
      </section>
    </main>
  );
}
