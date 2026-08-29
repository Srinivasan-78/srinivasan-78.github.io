/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌​​‌​​​​‌‌​‌​​​‌​​​‌​‌​​‌​​‌‌‌​​​​​‌‌​‌​‌​​‌‌‌​​​​​‌‌​‌​‌​​‌​‌​‌​‌​‌‌‌​​​‌​‌‌‌​‌​‌​‌​‌‌​​​​‌​​‌​​‌​‌‌​‌‌‌​​‌‌​​‌​​​‌​​​​​‌​‌​‌​‌‌‌​​‌‌‌​​‌​‌​‌​​​​​​‌‌​​‌‌​​‌‌‌​​​​‌‌​‌​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.bCDRpjpjUquXIndAW9P38k
 */
import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";

const BASE = "https://www.srinidevops.com";

/* Generated at build time so routes can never drift from the app
   directory the way the hand-maintained sitemap.xml did. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["", 1.0],
    ["/projects", 0.9],
    ["/certifications", 0.7],
    ["/contact", 0.6],
    ...PROJECTS.map((p) => [`/projects/${p.slug}`, 0.6] as [string, number]),
    // /thank-you is deliberately absent — it is noindex and only reachable
    // after a submit, so listing it would invite crawlers to a dead end.
    ["/privacy", 0.3],
    ["/terms", 0.3],
  ];

  return routes.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
