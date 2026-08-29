/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​​​‌‌‌‌​‌​​‌‌​​‌‌​​‌‌‌​‌‌‌​​‌‌​​​‌​‌​​‌​‌​​‌​​‌​‌‌​​‌‌​‌‌​​‌​​​​‌‌​‌​‌‌​‌​​‌‌​​​​‌​​‌‌​‌​‌​‌​‌​‌​​​‌‌​‌​​‌​‌‌‌​​‌‌​‌‌‌‌​​​​‌‌‌​‌‌‌​‌​​‌‌‌​​‌‌​​‌​‌​‌‌‌​‌​‌​‌​‌​‌​​​‌‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.4zfw1JK6CZa5TisxwNeuTt
 */
import Script from "next/script";

/* Plausible: cookieless and aggregate-only, so it needs no consent gate —
   see CookieNotice. The `file-downloads` and `outbound-links` extensions are
   in the bundle because the two things worth measuring on a portfolio are
   résumé downloads and clicks through to LinkedIn, GitHub, and the demos.

   Requires srinidevops.com to be added as a site in the Plausible dashboard;
   until it is, the script 404s and the page is otherwise unaffected. */
const DOMAIN = "srinidevops.com";

export default function Analytics() {
  return (
    <Script
      defer
      data-domain={DOMAIN}
      src="https://plausible.io/js/script.file-downloads.outbound-links.js"
      strategy="afterInteractive"
    />
  );
}
