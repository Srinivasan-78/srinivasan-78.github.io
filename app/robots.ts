/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌​​​​‌​‌​‌​​​‌​​‌​​‌​‌‌​‌​‌​​​‌‌​​‌‌​‌​​‌​​​​‌‌​‌​‌​​‌‌​‌​‌‌​‌​​​‌​‌​‌​‌​‌‌​​‌​​​​‌​​‌​‌​​‌‌​‌​​​‌‌‌​​‌‌​​​‌​‌​​‌​​​​​‌‌‌​​​​‌‌‌​​​​​‌​​​​‌​​‌‌​​​​‌​‌‌‌‌​​​​‌​‌​‌‌​​‌​​‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.HTIj3HjkEVBSG1H8pBaxVO
 */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.srinidevops.com/sitemap.xml",
  };
}
