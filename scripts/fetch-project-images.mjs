#!/usr/bin/env node
/* Pulls one square stock photo per project from Pexels into
   public/images/projects/<slug>.jpg.

   Downloaded rather than hotlinked, deliberately. The gallery draws
   each photo onto a 2D canvas and hands that canvas to WebGL as a
   texture — a cross-origin image would taint the canvas and the
   texture upload would throw. Serving the files from our own origin
   sidesteps CORS entirely, and it also means the gallery keeps working
   if Pexels changes a CDN path.

   Usage:
     PEXELS_API_KEY=xxxxx npm run images
     PEXELS_API_KEY=xxxxx npm run images -- --force   (re-download all)

   Get a free key at https://www.pexels.com/api/ — it is issued
   instantly. Existing files are skipped unless --force is passed, so
   re-running is cheap and won't burn your rate limit.

   Photographer credits are written to
   public/images/projects/credits.json. The Pexels licence does not
   require attribution, but crediting is the decent thing to do — the
   projects page reads this file if it exists. */

import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = resolve(ROOT, "public/images/projects");
const KEY = process.env.PEXELS_API_KEY;
const FORCE = process.argv.includes("--force");

if (!KEY) {
  console.error(
    "\nPEXELS_API_KEY is not set.\n" +
      "Get a free key at https://www.pexels.com/api/ then run:\n" +
      "  PEXELS_API_KEY=your_key npm run images\n"
  );
  process.exit(1);
}

const exists = (p) =>
  access(p).then(
    () => true,
    () => false
  );

async function search(query) {
  const url =
    "https://api.pexels.com/v1/search?per_page=1&orientation=square&size=medium&query=" +
    encodeURIComponent(query);
  const res = await fetch(url, {
    headers: { Authorization: KEY, Accept: "application/json" },
  });
  if (res.status === 429) throw new Error("rate limited — wait and retry");
  if (!res.ok) throw new Error(`Pexels returned ${res.status}`);
  const json = await res.json();
  return json.photos?.[0] ?? null;
}

async function main() {
  const queries = JSON.parse(await readFile(resolve(ROOT, "lib/photo-queries.json"), "utf8"));
  await mkdir(OUT_DIR, { recursive: true });

  const creditsPath = resolve(OUT_DIR, "credits.json");
  const credits = (await exists(creditsPath))
    ? JSON.parse(await readFile(creditsPath, "utf8"))
    : {};

  for (const [slug, query] of Object.entries(queries)) {
    const dest = resolve(OUT_DIR, `${slug}.jpg`);
    if (!FORCE && (await exists(dest))) {
      console.log(`· ${slug} — already present, skipping`);
      continue;
    }
    try {
      const photo = await search(query);
      if (!photo) {
        console.warn(`! ${slug} — no result for "${query}"`);
        continue;
      }
      // `large` is ~940px on the long edge: plenty for a card that
      // renders into a 640px texture, and a fraction of `original`.
      const src = photo.src.large || photo.src.medium || photo.src.original;
      const bin = await fetch(src);
      if (!bin.ok) throw new Error(`image download returned ${bin.status}`);
      await writeFile(dest, Buffer.from(await bin.arrayBuffer()));
      credits[slug] = {
        photographer: photo.photographer,
        photographer_url: photo.photographer_url,
        source: photo.url,
        query,
      };
      console.log(`✓ ${slug} — ${photo.photographer}`);
    } catch (err) {
      console.warn(`! ${slug} — ${err.message}`);
    }
  }

  await writeFile(creditsPath, JSON.stringify(credits, null, 2) + "\n");
  console.log(`\nDone. Credits written to ${creditsPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
