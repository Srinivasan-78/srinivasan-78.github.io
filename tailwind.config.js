/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​​‌​​‌‌​​​‌​​‌​‌​‌​​​​‌‌​​‌​​‌​‌​​​​​‌‌‌​​‌‌​‌​‌​​​​​‌‌​​‌​​​‌​‌‌‌‌‌​​‌‌​‌‌​​‌‌‌‌​​‌​‌‌‌​​‌‌​‌​‌‌​‌​​‌​‌​‌​​​‌‌​‌​​​​‌​​​‌‌​​​‌‌​‌​​​‌​‌​‌‌​​‌​‌​​​‌​‌‌​​‌​​​​‌‌​‌‌​​‌​‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.bbT2PsPd_6ysZThF4VQd6Q
 */
/** @type {import('tailwindcss').Config} */

/* Deliberately almost empty.

   The Contingency redesign moved the whole theme into CSS: the palette,
   the three type registers and the single easing all live in a
   `@theme inline` block in app/globals.css. `inline` is the load-bearing
   word — it makes the generated colour utilities reference the custom
   property rather than copy its value, which is what lets `text-body`
   resolve per theme at runtime instead of being baked at build time. A
   `colors` map here could not do that.

   The dark variant is declared there too, with `@custom-variant`, so a
   `darkMode` key here would be a second and competing answer to the same
   question. It is gone rather than merely unused.

   What is left is the content globs. Tailwind 4 detects these itself,
   but stating them keeps the scan boundary an explicit fact rather than
   a heuristic. */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};

