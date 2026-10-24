/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​​‌​‌‌​‌​​​​‌​​​​‌​​‌​‌‌‌‌‌​​‌‌​‌‌‌​‌​​‌​​​​​‌‌​​‌​​‌​​​​‌​​‌‌​‌‌​​​‌‌​‌‌‌‌​‌​​​​‌​​‌​‌​‌​‌​‌‌‌​​‌​​‌​‌‌‌‌‌​‌​​‌​‌​​‌​​‌‌​​​‌​​​‌‌‌​‌​‌​​​‌​‌‌​‌​​‌​​‌‌​​‌‌​‌‌‌​‌​‌​‌‌​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.QhB_7H2BloBUr_JLGQi3un
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/* The bat artwork on disk, read at BUILD time.
 *
 * This site is a static export, so the directory listing happens once
 * during `next build` and the result is baked into the HTML. That is
 * why these are server helpers rather than a fetch: the page never
 * requests an image that is not there, so there is no 404, no
 * broken-image box and no layout shift.
 *
 * TWO SETS, two jobs:
 *
 *   ground.png   one large mark, fixed behind every page. Reduced
 *                from the owner's wallpaper — see
 *                scratchpad/make-bg.py for how the render was
 *                separated from its backdrop. It replaced an earlier
 *                four-quadrant arrangement on instruction: one image,
 *                high resolution, centred.
 *
 *   flock/*.png  individual bat silhouettes for the route-transition
 *                swarm, cut out of the flock image the owner pasted.
 *                Several poses, which is what lets the swarm use
 *                "various sizes and orientations" of a real drawing
 *                rather than one shape repeated.
 *
 * ASSUME BLACK ON TRANSPARENT for both. The layers invert the art on
 * the dark palette, because a black silhouette on a near-black ground
 * is invisible. Art supplied already-white comes out inverted — still
 * legible, but the wrong way round. Silhouette, transparent, one
 * colour.
 */


/* Intrinsic size of an asset, read off the file at build time.
 *
 * Lighthouse flags images without explicit width and height, and it is
 * right to: without them the browser cannot reserve the box before the
 * bytes arrive, so the layout shifts when they do. These are
 * background decoration and would shift nothing visible — but the
 * attributes cost nothing and the audit should pass on its merits
 * rather than on an argument about why this case is special.
 *
 * Two formats, two one-line parsers. An SVG carries its ratio in the
 * viewBox; a PNG carries width and height as big-endian 32-bit
 * integers at a fixed offset in the IHDR chunk, which is the first
 * chunk and always at byte 16. */
function sizeOf(absPath: string): { width: number; height: number } | null {
  try {
    if (absPath.endsWith(".svg")) {
      const text = readFileSync(absPath, "utf8");
      const vb = /viewBox="\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/.exec(text);
      if (!vb) return null;
      return { width: Math.round(+vb[1]), height: Math.round(+vb[2]) };
    }
    const buf = readFileSync(absPath);
    if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

export type Mark = {
  src: string;
  width: number;
  height: number;
};

const DIR = "bat";
const USABLE = /\.(svg|png|webp)$/i;

/** The single background mark, or null if none has been supplied.
 *
 * SVG first, deliberately. The owner asked for the background in 4K;
 * for a flat two-colour silhouette a bigger raster is the wrong unit,
 * because it still has a ceiling and this mark is drawn at 128vw where
 * any ceiling shows. The traced vector has no resolution at all — it
 * is exact on a 4K display, on an 8K one, and under browser zoom — and
 * it is 10 KB rather than a megabyte. The PNG stays as the fallback
 * for a mark that has not been traced. */
export function groundMark(): Mark | null {
  for (const name of ["ground.svg", "ground.png"]) {
    const rel = `${DIR}/${name}`;
    const abs = join(process.cwd(), "public", rel);
    if (!existsSync(abs)) continue;
    const size = sizeOf(abs);
    return size ? { src: `/${rel}`, ...size } : null;
  }
  return null;
}

/** Every bat available to the transition swarm, in filename order. */
export function flockMarks(): Mark[] {
  try {
    const dir = join(process.cwd(), "public", DIR, "flock");
    return readdirSync(dir)
      .filter((f) => USABLE.test(f))
      .sort((a, b) => a.localeCompare(b))
      .map((f) => {
        const size = sizeOf(join(dir, f));
        return size ? { src: `/${DIR}/flock/${f}`, ...size } : null;
      })
      .filter((m): m is Mark => m !== null);
  } catch {
    /* Nothing supplied: BatTransit falls back to its drawn glyph. */
    return [];
  }
}
