import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";

export const dynamic = "force-static";

const BASE = "https://www.srinidevops.com";

/* Generated at build time so routes can never drift from the app
   directory the way the hand-maintained sitemap.xml did. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, number][] = [
    ["", 1.0],
    ["/projects", 0.9],
    ["/certifications", 0.7],
    ["/hobby", 0.5],
    ["/contact", 0.6],
    ...PROJECTS.map((p) => [`/projects/${p.slug}`, 0.6] as [string, number]),
    // /thank-you is deliberately absent — it is noindex and only reachable
    // after a submit, so listing it would invite crawlers to a dead end.
    ["/privacy", 0.3],
    ["/terms", 0.3],
  ];

  return routes.map(([path, priority]) => ({
    url: path === "" ? `${BASE}/` : `${BASE}${path}`,
    lastModified: new Date(),
    priority,
  }));
}
