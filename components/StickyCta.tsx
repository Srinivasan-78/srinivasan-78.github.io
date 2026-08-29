/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​‌​‌‌‌​​‌‌​‌​‌​‌‌‌​‌‌​‌‌‌‌​‌‌‌​‌‌‌​‌‌‌‌​‌​​‌‌​​​‌‌​‌‌‌​‌‌‌​‌‌​‌‌‌‌​​‌‌​​​‌​‌‌‌​‌‌​​​‌‌​​​​​‌‌​‌​‌‌​‌‌​‌‌​​​‌‌‌​​‌​​​‌‌​‌‌‌​‌​‌‌​​​​‌‌‌‌​​‌​‌​​‌​​​​‌​​‌​​‌​‌​‌​‌​​​‌‌​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.1sWowzcwo1v0klr7XyHITm
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* Routes where the bar would be pointing at the page you are already on. */
const SUPPRESSED = ["/contact", "/thank-you"];

/* A phone visitor scrolls a long portfolio with the nav collapsed behind a
   menu button — without this the only way to act on the page is to reach the
   footer. Hidden above 720px, where the nav is always on screen. */
export default function StickyCta() {
  const pathname = usePathname();
  if (SUPPRESSED.includes(pathname ?? "")) return null;

  return (
    <div className="sticky-cta" role="complementary" aria-label="Quick actions">
      <a href="/resume.pdf" download className="btn sticky-cta-secondary">
        Résumé
      </a>
      <Link href="/contact" className="btn primary sticky-cta-primary">
        Get in touch
      </Link>
    </div>
  );
}
