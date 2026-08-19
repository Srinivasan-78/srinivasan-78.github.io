/* The gate for the site's lighter mobile build.

   Touch devices get the same content and the same layout, but without the
   effects that cost a frame budget they do not have: no JS-driven smooth
   scroll, no scroll-linked transforms, no full-viewport overlay, no
   backdrop blur. Visitors on phones reported the page as slow and busy;
   every one of those effects was written for a pointer and a desktop GPU.

   `(pointer: coarse)` rather than a width breakpoint, because that is what
   the question actually is — a narrow desktop window is still a desktop.
   The same query drives the CSS half of this in globals.css, and the
   WebGL scene and cursor lens already bail on it. */
export function isLite() {
  return window.matchMedia("(pointer: coarse)").matches;
}
