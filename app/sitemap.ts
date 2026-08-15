import type { MetadataRoute } from "next";

const BASE = "https://www.srinidevops.com";

/* Generated at build time so routes can never drift from the app
   directory the way the hand-maintained sitemap.xml did. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["", 1.0],
    ["/projects", 0.9],
    ["/work", 0.9],
    ["/experience", 0.8],
    ["/certifications", 0.7],
    ["/contact", 0.6],
  ];

  return routes.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
