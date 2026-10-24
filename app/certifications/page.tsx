/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌​‌​​‌‌‌​​‌​‌‌​‌​​​​‌‌‌​​​‌​​‌‌​‌‌‌​‌‌‌​​‌‌​‌‌​​​‌​​‌​‌‌​​​​‌​​​‌‌‌​‌​​‌​‌​​‌‌‌​‌‌​​‌​​‌‌‌‌​​‌‌‌​​​​‌​​‌​​‌​‌‌‌​​‌‌​‌‌‌​​​​​‌​​‌​‌‌​‌​‌​​​​​‌‌‌‌​​​​‌​​​‌‌‌​‌‌​​‌​‌​‌‌‌‌​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.U9hq7sbXGJvO8IspKPxGez
 */
import CertIndex from "@/components/CertIndex";
import { CERTIFICATIONS_COPY } from "@/lib/data/profile";
import { pageMetadata } from "@/lib/seo";

/* The metadata strings now come from the same record the page body
   reads, so the description and the lede can no longer disagree about
   how many credentials there are. */
export const metadata = pageMetadata({
  title: CERTIFICATIONS_COPY.metaTitle,
  description: CERTIFICATIONS_COPY.metaDescription,
  path: "/certifications",
});

export default function Certifications() {
  return <CertIndex />;
}
