/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​‌​‌​‌‌​​‌‌​​‌‌‌‌​‌​​‌​‌​​‌‌​‌‌​​‌​​​‌​‌​‌‌‌​​‌‌‌​​‌​‌‌​​​‌‌​‌​​‌‌‌​​‌‌‌‌​‌​​‌​‌​​‌​​‌​​‌‌‌‌​‌​​‌​​‌​‌‌‌​‌‌​​‌‌‌​​‌‌​‌​​​​‌‌​‌​‌‌‌‌‌​‌​​​‌​‌​‌‌​​‌​‌​‌​​‌‌‌‌​‌​​‌‌​​​‌​‌‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.5fzSdW9cNzROIvsC_EeOLY
 */
import { BRAND_PATHS } from "@/lib/data/brandPaths";

/* One copy of every glyph the ticker uses, as <symbol> definitions.
 *
 * WHY THIS EXISTS. The skills ticker renders thirty-nine marks twice —
 * the duplicate run is what makes the loop seamless — and each mark
 * was a complete inline <svg> carrying its own path data. A Lighthouse
 * run put numbers on it: the <header> block was 197 KiB of a 531 KiB
 * page, 146 inline SVGs totalling 185 KiB, and because the ticker
 * lives in the sticky header that cost was paid on all thirty-six
 * routes — then paid again inside the RSC flight payload, which
 * serialises the same markup a second time.
 *
 * A sprite fixes it at the root: each distinct glyph is defined once
 * here, and every place that draws it emits a <use> of about forty
 * bytes instead of a kilobyte of path data.
 *
 * WHY THE GEOMETRY IS A GENERATED DATA FILE. The obvious approach —
 * render each react-icons component with `renderToStaticMarkup` and
 * harvest the result — cannot be done inside this app at all: Next
 * rejects the import outright with "You're importing a component that
 * imports react-dom/server", on both sides of the client boundary.
 *
 * An earlier attempt to do it from Nav was worse than rejected: it
 * SUCCEEDED. Nav carries "use client", so the renderer was quietly
 * shipped to the browser and the bundle grew 108 KB for a function
 * that only ever needed to run once, at build time. That is the
 * sharper lesson — the failure mode was silent and only showed up as
 * a bundle measurement.
 *
 * So the extraction lives in scripts/gen-brand-paths.mjs and its
 * output is committed. This component only reads data. Re-run that
 * script if the MARKS map in BrandMark.tsx changes.
 *
 * The sprite is aria-hidden, zero-sized, and mounted once in
 * app/layout.tsx — a server component, so none of this reaches the
 * client bundle.
 */
export default function BrandSprite() {
  const symbols = BRAND_PATHS.map(
    (g) => `<symbol id="bm-${g.id}" viewBox="${g.viewBox}">${g.inner}</symbol>`
  ).join("");

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
      dangerouslySetInnerHTML={{ __html: symbols }}
    />
  );
}
