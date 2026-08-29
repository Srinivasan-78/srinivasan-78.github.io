/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​‌​​​‌‌​​‌​​​​‌‌​‌‌‌​‌‌​​​​‌​‌‌‌‌​​‌​‌‌​‌‌​‌​​‌‌​​‌​​‌​​​‌‌‌​​‌‌​‌​​​‌​​​‌​​​‌‌​​​​‌​‌​​​‌​​​‌‌​‌​‌​​‌​‌‌​​​​‌​‌​‌‌‌​​‌‌​​‌‌​‌​​​‌‌‌​‌​​​‌‌‌​‌‌​​‌‌‌​‌​‌‌​​‌​‌​‌​​‌‌​​‌‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.td7aym2G4DaDjXW3GGgYS6
 */
import type { CSSProperties, ReactNode } from "react";
import BorderGlow from "./BorderGlow";
import WindowChrome from "./WindowChrome";

/* One place that decides what a card looks like on this site.

   Every content surface — explore tiles, work tiles, capability tiles,
   the method notes, the contact links, the work lightbox — renders
   through this, so the radius, the glow reach, its intensity and its
   colours are set once instead of being repeated at eight call sites.

   Two deliberate departures from the values in the brief:

   * `backgroundColor` is the palette token rather than the literal
     #121214 the brief specifies. Tokens are what the rest of the site
     paints with, and a hard-coded near-black card on white paper would
     be a black rectangle in the middle of the page.

   * `glowColor` is a blue rather than the component's default amber, so
     the proximity glow belongs to the same palette as the rest of the
     site instead of introducing a fourth hue. Its lightness is set for
     the page it lands on: the 72% the component ships is tuned to glow
     on a black page and simply disappears into #f5f5f7, so it drops to
     52% — dark enough to register against paper, still unmistakably the
     site's blue. */

export type GlowCardProps = {
  children: ReactNode;
  /** Extra classes on the wrapper, after the shared `glow-card`. */
  className?: string;
  /** Corner radius in px. The system value is 20. */
  radius?: number;
  /** Play the intro sweep once on mount. Reserved for hero surfaces. */
  animated?: boolean;
  /* The macOS titlebar. It is on by default because the frame is the
     card system now — a surface without it reads as an unfinished one
     next to a grid of surfaces that have it — but any call site that
     is not a window (a bare list row, a surface nested in another
     card) turns it off rather than working around it. */
  chrome?: boolean;
  /** Ornamental label on the bar's trailing edge. No bar, no title. */
  windowTitle?: string;
  style?: CSSProperties;
};

export default function GlowCard({
  children,
  className = "",
  radius = 20,
  animated = false,
  chrome = true,
  windowTitle,
  style,
}: GlowCardProps) {
  return (
    <BorderGlow
      className={`glow-card ${className}`.trim()}
      backgroundColor="var(--paper-raised)"
      borderRadius={radius}
      glowRadius={30}
      glowIntensity={0.6}
      edgeSensitivity={25}
      coneSpread={25}
      glowColor="205 90 52"
      colors={["#38bdf8", "#c084fc", "#f472b6"]}
      animated={animated}
      style={style}
    >
      {chrome ? <WindowChrome title={windowTitle} /> : null}
      {children}
    </BorderGlow>
  );
}
