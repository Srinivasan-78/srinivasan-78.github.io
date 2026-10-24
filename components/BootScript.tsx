/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​​‌​‌‌‌​​​​​‌‌​‌​‌​​‌‌‌​​​​​‌​‌​‌‌​​‌​​‌‌​‌​‌​​​​‌​​‌​​​​‌​​‌‌‌‌​‌​​‌‌‌‌​‌​​‌‌‌​‌‌​​​‌‌​​‌‌​​‌​‌‌​‌​‌​‌​​​​​‌‌‌​​​‌​‌​‌​‌​​​​‌‌​​‌‌​‌‌‌​​‌​​‌‌​​‌​​​‌‌​‌​‌‌​‌​‌‌​‌​​‌​​‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.ApjpVMBBzzv3-PqT3rdkZI
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

  // Decide the effects budget before the first paint, so the stylesheet
  // and the first client render both see it rather than correcting
  // towards it a frame later. See lib/usePerfTier.ts for what the three
  // tiers mean and why the decision is split between here and the
  // framerate watchdog.
  //
  // Every input below is a HINT, not a measurement — none of them can
  // tell you a machine is slow, only that it is likely to be. They pick
  // the tier the page STARTS at; PerfGuard corrects it from real frames.
  try {
    var mq = window.matchMedia;
    var n = navigator;
    var tier = null;

    // A remembered demotion outranks the hints: if this machine has
    // already been measured dropping frames, it should not have to
    // prove it again on every visit. Seven days, because a laptop that
    // stuttered while a build was running is not a slow laptop.
    try {
      var saved = (localStorage.getItem('fx') || '').split(':');
      if (saved.length === 2 && Date.now() - Number(saved[1]) < 6048e5) {
        if (saved[0] === 'lite' || saved[0] === 'off') tier = saved[0];
      }
    } catch (e) {}

    if (!tier) {
      // Reduced motion and Save-Data are explicit requests, not guesses.
      // Both already meant "no canvas" elsewhere on the site; this is
      // the same answer stated in one place.
      if ((mq && mq('(prefers-reduced-motion: reduce)').matches) ||
          (n.connection && n.connection.saveData)) {
        tier = 'off';
      } else if (
        // Four cores or less, four gigabytes or less, or a touch
        // primary pointer. The pointer test is not about input: a phone
        // is the most common slow GPU on the web, and the effects that
        // cost the most are the ones that react to a pointer it does
        // not have.
        (n.hardwareConcurrency > 0 && n.hardwareConcurrency <= 4) ||
        (n.deviceMemory > 0 && n.deviceMemory <= 4) ||
        (mq && mq('(pointer: coarse)').matches)
      ) {
        tier = 'lite';
      } else {
        tier = 'full';
      }
    }

    document.documentElement.setAttribute('data-fx', tier);
  } catch (e) {
    // Anything unexpected lands on the middle tier rather than the top
    // one. A visitor who gets a slightly quieter page because a feature
    // probe threw has lost nothing they can name; the reverse is a
    // machine being handed five shaders it cannot draw.
    document.documentElement.setAttribute('data-fx', 'lite');
  }
})();
`;

/* Three jobs, all of which have to happen before the first paint.

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

   Three: set data-fx, the effects budget. It belongs here and not in a
   client component for the same reason the theme does — the stylesheet
   keys off it, so it has to be on <html> before anything is painted or
   the page visibly sheds decoration a frame after arriving, which looks
   exactly like the stutter it exists to prevent. lib/usePerfTier.ts
   documents the tiers; components/primitives/PerfGuard.tsx corrects the
   guess from measured frames.

   Note it renders inside <body>, not <head> — App Router does not
   reliably execute a raw inline <script> placed in <head>. */
export default function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}
