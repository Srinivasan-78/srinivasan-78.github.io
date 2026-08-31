/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌​​​​​‌‌​‌‌​​‌​​​‌‌​​‌‌​​​​‌​‌‌‌‌​‌​​‌‌‌​‌​​​‌​​​‌​‌​‌​​​​‌‌​‌‌‌​‌‌‌​‌​‌​​​​​‌‌​‌​‌​​‌‌‌‌​​​​‌‌​‌​‌​​‌​​‌‌‌‌​‌‌​‌‌​‌​‌‌​‌​​‌​‌​​​‌​‌​‌​​​​‌​​‌‌​‌​​‌​‌​‌‌​​‌​​‌‌​​​‌​​‌‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.X6FaztECwPjxjOmiEBiY13
 */
const BOOT_SCRIPT = `
(function(){
  // Marks that scripting is live. The scroll-reveal transition in
  // globals.css starts its elements at opacity 0 and relies on an
  // IntersectionObserver to turn them on, so without this flag a visitor
  // with JS blocked or broken would get a page of invisible headings.
  // Scoped to html.js, set here before paint, so no-JS simply skips the
  // animation and shows the content.
  document.documentElement.classList.add('js');

  // Resolve the theme before the first paint. An explicit choice, once
  // made, outranks the OS setting for good; until then the OS decides.
  // The attribute is always written, so the CSS never has to duplicate
  // the dark palette behind a prefers-color-scheme query.
  try {
    var stored = localStorage.getItem('theme');
    var theme = (stored === 'light' || stored === 'dark')
      ? stored
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    // Private-mode localStorage throws. Light is the server-rendered
    // default, so leaving the attribute unset lands on the same palette.
  }
})();
`;

/* Two jobs, both of which have to happen before the first paint.

   One: set html.js, which is what gates the scroll-reveal transition.
   Without it a visitor with JS blocked would get a page of invisible
   headings, so the animation is scoped to html.js and no-JS simply
   shows the content.

   Two: set data-theme. <html> ships from the server with no attribute,
   which the stylesheet reads as light — so light is what a no-JS
   visitor gets, unchanged. This script is what upgrades that to the
   visitor's stored choice, or to their OS preference if they have not
   made one, and it runs before anything is painted, so neither shows
   as a flash.

   Note it renders inside <body>, not <head> — App Router does not
   reliably execute a raw inline <script> placed in <head>. */
export default function BootScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}
