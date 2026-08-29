/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​​​​‌​‌‌​‌​‌‌​‌​‌‌​‌​‌‌‌‌‌​‌‌​‌​​​​‌​​​‌‌​​‌​​‌‌​​​‌​​‌​‌​​‌​‌​‌​​​‌‌‌‌​‌​​‌​​‌​‌​​‌​‌‌​​​​​‌‌​​‌‌​‌‌‌​​‌‌​‌​‌​​‌​​‌‌​​‌‌‌​​‌‌‌​​​​‌​​​​‌‌​‌​​‌‌​‌​‌‌‌​‌​​​‌‌‌​‌​​​​‌‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.h-k_hFLJTzJX3sRg8CMtt9
 */
import type { Metadata } from "next";

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Srinivasan Vijayaraghavan, DevOps Engineer",
};

/* Next replaces the parent `openGraph` object wholesale rather than merging
   into it, so a page that declares its own title and url silently drops the
   layout's image and siteName. Every page therefore builds its metadata
   through here, and the social card can never go missing again. */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  title: string;
  description: string;
  /* Root-relative, with a leading slash — "" for the home page, and null
     for a page that is not a URL anyone should be sent to. The 404 is the
     only one of those: it answers every wrong address on the site, so a
     canonical tag there would nominate one of them as the real page, and
     an og:url would hand social cards a link into a dead end. */
  path: string | null;
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} — Srinivasan Vijayaraghavan`;

  return {
    title: fullTitle,
    description,
    /* An explicit null rather than an omission: leaving it out lets the
       root layout's canonical fall through, which would have the 404
       page nominating the home page as its canonical URL. */
    alternates: { canonical: path === null ? null : path || "/" },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      siteName: "Srinivasan Vijayaraghavan",
      title: fullTitle,
      description,
      ...(path === null ? {} : { url: path || "/" }),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
