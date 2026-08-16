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
  ];

  return routes.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
