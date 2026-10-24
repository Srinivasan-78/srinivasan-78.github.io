/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​‌​‌​​‌​‌​​​‌‌​​​‌​​‌‌‌​​‌​‌‌​​​‌​​‌​​​‌‌​​‌​​​​‌‌​‌​​​‌‌​​‌‌​‌​​‌​‌‌​‌​‌​​​‌‌‌​​​​​‌‌​‌‌‌​​‌‌​‌​​​‌​​​‌​​​‌​‌​‌​‌​‌‌​‌‌​​​‌​‌​​‌​​‌​​‌​‌​​‌‌​​‌​​​‌​‌‌​‌​​‌​​​​‌​​​‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.9J19bFCFij874DUlRJdZB4
 */
/* Tailwind 4 moved the PostCSS plugin into its own package, so
   `autoprefixer` is gone from this list rather than merely reordered.

   CORRECTION, revision 9. This note used to add that Tailwind had
   "folded vendor prefixing into the engine", and that was taken on
   trust. It is not true of the CSS written by hand in app/globals.css:
   a build emitted 114 `mask-image` declarations and exactly two
   `-webkit-mask-image` ones, and both of those came from a vendored
   component that had typed the prefix itself. Tailwind prefixes the
   utilities it generates; it left this stylesheet's own rules alone.

   That mattered because unprefixed `mask-image` only shipped in
   Chrome 120 and the browserslist floor here is 111 — so on Chrome and
   Edge 111-119 every feathered texture in §5b, §5e and §5h lost its
   mask and rendered as a hard-edged rectangle. The prefixes are now
   written explicitly next to each `mask-image` in globals.css, which
   is the honest fix for a stylesheet that is authored rather than
   generated. */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

