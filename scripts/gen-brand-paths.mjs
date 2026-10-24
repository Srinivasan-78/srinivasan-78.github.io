/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​​​‌‌​‌‌‌‌​‌‌‌​​‌​​​‌‌​​​​​‌‌‌‌​​​​‌​​​‌​‌​‌​​​‌​​​​‌‌​​‌​​‌‌‌​‌‌‌​‌‌‌‌​​‌​​‌‌‌​​‌​‌‌​‌​‌​​‌​​‌‌​​​‌​​‌​‌‌​‌​​‌​‌​​‌‌‌​‌‌​​‌‌​‌‌‌‌​‌​‌‌​​​​​‌‌​‌‌​​‌‌​​‌​​​‌‌​​‌​​​‌​‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.8or0xED2wy9jLKJvoX6ddS
 */
/* Generate lib/data/brandPaths.ts — the ticker's glyph geometry.
 *
 * WHY A GENERATOR RATHER THAN RUNTIME EXTRACTION. react-icons exposes
 * its glyphs only as components, with no accessor for the underlying
 * path data, so the only way to read the geometry is to render one.
 * Rendering needs `react-dom/server`, and Next refuses to bundle that
 * — "You're importing a component that imports react-dom/server" — on
 * either side of the client boundary.
 *
 * So the render happens HERE, in a plain Node script, and the result
 * is committed as data. The site then ships markup it can emit
 * directly: no renderer, no react-dom/server, nothing at request time.
 *
 * Re-run this if the mark list in lib/data/skills.ts changes:
 *   node scripts/gen-brand-paths.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as Si from "react-icons/si";

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* Resolved from this file so the script works from any cwd. */
const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(REPO, "lib", "data", "brandPaths.ts");

/* The same mapping BrandMark holds, read straight out of it so the two
   cannot drift. A mark added there and forgotten here would silently
   render an empty <use>. */
const src = readFileSync(join(REPO, "components", "primitives", "BrandMark.tsx"), "utf8");
const block = src.slice(src.indexOf("const MARKS"), src.indexOf("/** Every id"));
const pairs = [...block.matchAll(/"?([a-z0-9-]+)"?\s*:\s*(Si[A-Za-z0-9]+)\s*,/g)];

if (!pairs.length) throw new Error("no marks parsed from BrandMark.tsx");

const entries = [];
const missing = [];
for (const [, id, comp] of pairs) {
  const Icon = Si[comp];
  if (!Icon) {
    missing.push(`${id} (${comp})`);
    continue;
  }
  const markup = renderToStaticMarkup(createElement(Icon));
  const viewBox = /viewBox="([^"]+)"/.exec(markup)?.[1];
  const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(markup)?.[1];
  if (!viewBox || !inner) {
    missing.push(`${id} (unparseable)`);
    continue;
  }
  entries.push({ id, viewBox, inner });
}

if (missing.length) {
  console.error("COULD NOT RESOLVE:", missing.join(", "));
  process.exitCode = 1;
}

const header = readFileSync(join(REPO, "components", "primitives", "Reveal.tsx"), "utf8")
  .split("\n")
  .slice(0, 7)
  .join("\n");

const body = `${header}

/* GENERATED FILE — do not edit by hand.
 *
 * Produced by scratchpad/gen-brand-paths.mjs, which renders each
 * react-icons glyph once and harvests its geometry. It exists because
 * react-icons has no public accessor for path data and Next refuses to
 * bundle \`react-dom/server\` on either side of the client boundary, so
 * the extraction cannot happen at build time inside the app.
 *
 * Consumed by components/primitives/BrandSprite.tsx, which emits one
 * <symbol> per entry. Every visible mark is then a ~40-byte <use> —
 * the ticker draws thirty-nine marks twice on every one of
 * thirty-six routes, and inlining the geometry each time cost about
 * 185 KiB per page.
 *
 * Re-run the generator if the MARKS map in BrandMark.tsx changes. */

export type BrandPath = {
  id: string;
  viewBox: string;
  /** Inner markup of the glyph — paths only, no <svg> wrapper. */
  inner: string;
};

export const BRAND_PATHS: BrandPath[] = [
${entries
  .map(
    (e) =>
      `  { id: ${JSON.stringify(e.id)}, viewBox: ${JSON.stringify(
        e.viewBox
      )}, inner: ${JSON.stringify(e.inner)} },`
  )
  .join("\n")}
];
`;

writeFileSync(OUT, body);
console.log(
  `wrote ${OUT}\n  ${entries.length} glyphs, ${(body.length / 1024).toFixed(0)} KiB`
);
