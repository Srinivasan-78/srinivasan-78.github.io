/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​​​‌‌‌​‌‌​​‌‌​​​​‌​‌​‌​​‌​​‌​‌​​​​​​‌‌​‌‌​​‌​​​‌​‌​‌‌‌​​​​​‌​‌​​‌‌​‌‌​‌‌‌​​‌​​​‌​​​‌​​‌‌​​​​‌‌​‌​​​‌‌‌‌​​​​‌‌‌​‌​​​‌​​​​​‌​‌‌‌‌​​‌​‌​​‌‌​‌​‌​​‌‌‌​​‌​‌​​‌‌​‌​‌​​​​​‌‌​‌​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.hvaRP6EpSnDL4xtAyMNSPj
 */

/* The decorative layers, as components so they are always applied the
   same way: absolutely positioned, pointer-events off, and hidden from
   the accessibility tree.
 *
 * That last part is why these exist at all rather than being a utility
 * class on the panel itself. `.halftone` and the beam gradients carry
 * their own opacity, and opacity applies to a whole subtree — put the
 * class on a container and every label inside it fades too. A sibling
 * layer is the only arrangement that keeps the texture behind the text
 * instead of over it. */

type LayerProps = {
  className?: string;
};

/* Ben-Day dots — the halftone screen comics are physically printed
   through. The most honest comic reference available, because it is an
   artifact of the medium rather than a picture of it. */
export function Halftone({ className = "" }: LayerProps) {
  return (
    <div
      aria-hidden="true"
      className={`halftone pointer-events-none absolute inset-0 ${className}`}
    />
  );
}


/* The signal: a cone of light thrown up from the lower left, where a
   searchlight would be. A gradient and not a shape — the moment it has
   an outline it becomes a logo. */
export function SignalBeam({ className = "" }: LayerProps) {
  return (
    <div
      aria-hidden="true"
      className={`signal-beam pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

/* Chiaroscuro — corners in shade so the middle sits forward. The one
   formal device the Batman visual tradition is actually built on. */
export function Chiaroscuro({ className = "" }: LayerProps) {
  return (
    <div
      aria-hidden="true"
      className={`chiaro pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

/* `HalftoneBold` and `DetectGrid` used to live here. The first was
   never rendered; the second was the static field behind each page
   head until FxBackdrop took that job and started drawing its own
   `.detect-grid` layer directly. Both are gone rather than kept
   "in case" — an exported component with no caller is a component
   nobody maintains. */
