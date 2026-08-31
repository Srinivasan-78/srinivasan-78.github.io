/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​‌‌​​‌‌​​‌‌‌​‌‌​​‌​‌​‌​‌​​‌​​​‌‌​‌‌​​‌‌‌​‌‌‌​‌​​​‌​​​‌​​​‌‌​​‌‌‌‌​​​​​‌‌​‌​​​‌​​​‌​​​‌‌‌​​​​​‌‌‌​​​​​‌‌‌​​​‌​‌​​​‌‌​​‌​‌​‌​‌​​‌‌‌​​​​​‌‌‌​​‌​‌​​‌​‌​​‌​​‌‌‌‌​‌​‌​​‌​​‌‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.VgeR6wDFx4DppqFU89JORp
 */
/* The Cloudflare Worker that fronts the Gemini API. Read at build time and
   inlined into the bundle, because a static export has no runtime in which to
   look it up. The pipeline sets it from the worker deploy that just ran and
   fails the build if that produced nothing; unset here — a local `next dev`
   without the variable — renders no widget at all, rather than a button that
   fails on click. */
export const CHAT_SUGGESTIONS = [
  "What does Srinivasan do?",
  "Is he authorized to work in the US?",
  "What's his experience with Azure & Thomson Reuters?",
  "Tell me about the Master Bot project.",
  "What is his core tech stack?",
];

