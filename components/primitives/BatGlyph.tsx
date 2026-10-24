/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌​​​‌‌​‌‌‌​​‌‌​‌‌‌​​‌‌​‌​​​‌‌‌​​‌‌​‌‌‌​​‌‌​‌​‌​‌​‌​‌​​​‌​​​‌​‌​​‌‌​‌‌‌‌​​‌​‌‌​​​‌‌​‌‌‌​‌​‌​‌‌‌​​‌‌​​‌‌​​​​​‌‌‌​‌​​​‌​‌‌​​​​​‌‌​​‌‌​‌​‌​‌​​​‌‌​‌​​​​‌​​‌‌‌​​‌‌​​‌​​​‌​​​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.N774ssUDSycus0tX3ThNdF
 */

/* The bat, drawn once.
 *
 * Shared by the route-transition swarm and the skills ticker, so the
 * divider between ticker marks is the same creature that crosses the
 * screen on navigation. Two hand-drawn bats on one site would be two
 * slightly different animals.
 *
 * Drawn rather than borrowed, and deliberately not a roundel. The
 * brief forbids a badge — a bat-in-an-oval is costume — so this is an
 * animal in flight: a tapered body, two ears, and wings with a
 * scalloped trailing edge.
 *
 * TWO RENDER MODES, and the reason is payload rather than style.
 *
 * The ticker draws this divider seventy-eight times per page, in the
 * sticky header, on all thirty-six routes. Emitting three long path
 * strings each time put roughly 86 KiB of duplicate geometry into
 * every page and again into the RSC flight payload. So the default is
 * now a <use> pointing at a single <symbol> defined by BatSprite —
 * about forty bytes a copy.
 *
 * `wings` keeps the full inline form, because the swarm animates each
 * wing about its shoulder and a <use> has no addressable interior.
 * That is the one place the geometry genuinely has to be repeated,
 * and it is twenty-two elements on a transient overlay rather than
 * seventy-eight on every page.
 */

/* One path, mirrored, rather than two drawn by hand — so the
   silhouette is exactly symmetric and only one curve is maintained. */
const WING =
  "M62 22c9-6 20-11 33-12 7-.6 14 .2 21 2.4-5 .4-9 1.8-12 4 3.6.7 6 2.2 7.4 4.4-4-.7-7.6-.4-10.6.8 2.8 1.6 4.4 3.6 5 6-3.4-1.6-6.8-2-10-1.4 2 2 3 4.2 2.8 6.6-2.8-2.4-6-3.6-9.4-3.6 1.2 2.4 1.4 4.8.6 7.2-2-3-4.8-5-8.2-6.2-4.6-1.6-9-3.4-13-5.6-3-1.6-5.2-3-6.6-4.2z";

const BODY =
  "M60 14c2.4 0 3.6 1.6 3.9 3.5l1.9-3.9.9 4.3 2-2.6c.4 2.2-.5 4-1.7 5.2 1.6 1.6 2.4 4 2.4 7 0 6-2.9 13-9.4 19.2C53.5 40.5 50.6 33.5 50.6 27.5c0-3 .8-5.4 2.4-7-1.2-1.2-2.1-3-1.7-5.2l2 2.6.9-4.3 1.9 3.9c.3-1.9 1.5-3.5 3.9-3.5z";

const BAT_SYMBOL_ID = "bat-glyph";

/** The <symbol> the <use> copies point at. Mounted once, in Nav. */
export function BatSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <symbol id={BAT_SYMBOL_ID} viewBox="0 0 120 56">
        <path d={BODY} />
        <path d={WING} />
        <path d={WING} transform="translate(120 0) scale(-1 1)" />
      </symbol>
    </svg>
  );
}

export default function BatGlyph({
  className = "",
  wings = false,
}: {
  className?: string;
  /** Inline the geometry and wrap each wing in its own animatable
      group. Only the swarm needs this; everything else uses the
      sprite reference. */
  wings?: boolean;
}) {
  if (!wings) {
    return (
      <svg
        viewBox="0 0 120 56"
        className={className}
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <use href={`#${BAT_SYMBOL_ID}`} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 120 56"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={BODY} />
      <g className="bat-wing bat-wing-r">
        <path d={WING} />
      </g>
      <g className="bat-wing bat-wing-l">
        <path d={WING} transform="translate(120 0) scale(-1 1)" />
      </g>
    </svg>
  );
}
