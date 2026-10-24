/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​‌​‌​‌​​‌‌​‌​​‌‌‌​​‌​​​‌​​​‌‌​​‌​​​‌‌‌​​​‌​‌​‌​​‌​​​‌‌‌​​‌​‌​‌​​​​​‌​‌​‌‌‌​‌​​‌​​‌​‌‌​‌​‌‌​‌‌​​​‌​​‌‌​‌‌​‌​‌‌​​​‌​​‌‌​​​‌​​‌‌‌​‌​​​​‌‌​​‌​​‌​‌​​‌​​‌‌‌​​​​​‌‌‌​‌‌‌​‌​​​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.1SNDdqR9PWIkbmbbt2RpwD
 */

/* One translation, kept in one place.

   The data modules spell their icon tokens in kebab-case — "git-merge",
   "bar-chart", "hard-drive" — because that is how the records were
   written and the records are not the design layer's to edit. The Icon
   primitive's map is keyed in camelCase. Unknown tokens fall back to a
   neutral glyph rather than throwing, which means a mismatch here does
   not break a page; it quietly renders the wrong mark on eleven of the
   twenty initiatives, which is exactly the kind of thing that survives
   review. So the conversion is explicit, named, and shared. */
export function iconToken(token: string): string {
  return token.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}
