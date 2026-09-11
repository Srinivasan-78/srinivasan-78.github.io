/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌​​​‌‌‌​‌​​​‌‌​​‌​‌​​‌​‌‌​‌​‌​​​​‌​​‌​​​​‌‌​‌‌‌‌​​‌​​‌‌​‌‌​​‌​‌​​‌​​‌‌‌‌​​‌​​‌‌‌​​​​‌​‌‌​​​​‌‌​‌​​​​‌​​‌‌‌‌​‌​​‌‌‌‌​‌​​​​‌‌​‌‌​‌‌​​​‌‌​​​‌​​​‌‌​‌‌​​‌‌​‌​‌​​‌​‌​​‌​​‌​​​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Lte-BCy6Ry8XhOOClb6jRC
 */
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.srinidevops.com/sitemap.xml",
  };
}
