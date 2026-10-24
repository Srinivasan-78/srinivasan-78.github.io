/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​​‌‌​​‌​​‌‌​​‌​​​‌​‌​​​​​‌‌​​‌‌​​‌‌​‌​‌‌​‌​‌‌​​​​‌‌‌‌​‌​​‌‌‌​​‌‌​‌​​​​‌‌​‌​​‌‌‌​​‌‌‌​‌‌​​‌‌‌​‌​​​‌​​‌‌‌​​‌​‌​‌‌​​‌‌​‌‌‌‌​‌‌​‌​​‌​​‌‌​‌‌​​‌‌​​​‌‌​‌‌​‌‌‌‌​​‌‌​​‌​​​‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.z2dPfkXzsCNvtNVoi6co2-
 */
import Link from "next/link";
import Icon from "@/components/primitives/Icon";
import SectionHead from "@/components/primitives/SectionHead";
import { NOT_FOUND_COPY, NOT_FOUND_ROUTES } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

/* `path: null` is preserved deliberately and the reason is in lib/seo:
   this page answers every wrong address on the site, so a canonical tag
   here would nominate one of them as the real page. */
export const metadata = pageMetadata({
  title: NOT_FOUND_COPY.metaTitle,
  description: NOT_FOUND_COPY.metaDescription,
  path: null,
});

/* 404.

   A missing page is a failure mode, and this site's whole argument is
   that failure modes get typeset rather than hidden. So the admission
   uses the same `contingency` line every panel on the site uses — the
   author's own sentence, in the alarm colour, labelled with the word
   rather than relying on the colour to carry it. It sits directly above
   the routes because it is the sentence that introduces them.

   Dry, not jokey. Nobody arrives here on purpose, and a 404 making
   jokes is a site enjoying its own breakage. */
export default function NotFound() {
  return (
    <main id="content" tabIndex={-1}>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <SectionHead
          index="404"
          kicker={NOT_FOUND_COPY.eyebrow}
          title={NOT_FOUND_COPY.heading}
          titleAs="h1"
        />

        <p className="contingency mb-10 max-w-2xl">
          <span>Contingency</span>
          <span>{NOT_FOUND_COPY.body}</span>
        </p>

        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {NOT_FOUND_ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="flex h-full flex-col justify-between bg-ground p-5 transition-colors duration-150 hover:text-detect sm:p-6"
            >
              <div>
                <div className="flex items-center gap-2.5 text-mute">
                  <Icon name={route.icon} className="h-4 w-4" />
                  <h2 className="t-anno">{route.title}</h2>
                </div>

                <p className="mt-4 text-[0.875rem] leading-relaxed text-mute">
                  {route.body}
                </p>
              </div>

              <span className="t-anno-sm mt-6 flex items-center justify-between gap-3 border-t border-rule pt-4 text-body">
                {route.go}
                <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
