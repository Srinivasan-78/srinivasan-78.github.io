/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌‌​​​‌‌​‌​​‌​‌​​‌‌‌​​‌‌‌​​​​​‌‌​‌‌​​​‌‌​​‌‌​​‌​‌​​‌​​‌‌​​‌‌‌​‌‌‌​​‌‌​‌​‌‌​‌​​‌​​‌​‌​​‌‌​‌‌‌‌​​‌‌​​​​​‌‌‌​​‌​​‌‌​‌‌‌​​‌‌​‌​​‌​​‌‌​‌​‌​‌​​​​‌‌​‌​​​‌‌‌​‌‌‌​​‌‌​‌‌​​‌‌​​‌​​‌‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.liNplfRgsZJo0rni5CGsfL
 */
import { pageMetadata } from "@/lib/seo";
import CertIndex from "@/components/CertIndex";
import { CERTS } from "@/lib/certs";

export const metadata = pageMetadata({
  title: "Certifications",
  description: `${CERTS.length} verified credentials across cloud platforms, automation, infrastructure as code and observability.`,
  path: "/certifications",
});

export default function Certifications() {
  return <CertIndex />;
}
