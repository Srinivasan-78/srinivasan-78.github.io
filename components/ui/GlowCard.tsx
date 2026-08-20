import type { CSSProperties, ReactNode } from "react";
import BorderGlow from "./BorderGlow";

/* One place that decides what a card looks like on this site.

   Every content surface — explore tiles, work tiles, capability tiles,
   the method notes, the contact links, the work lightbox — renders
   through this, so the radius, the glow reach, its intensity and its
   colours are set once instead of being repeated at eight call sites.

   Two deliberate departures from the values in the brief:

   * `backgroundColor` is the theme token rather than the literal
     #121214. The site keeps a light theme behind the toggle, and a
     hard-coded near-black card would be unreadable in it. In dark —
     the default — the token resolves to exactly #121214.

   * `glowColor` is a cool blue-white rather than the component's
     default amber, so the proximity glow belongs to the same palette
     as the rest of the site instead of introducing a fourth hue. */

export type GlowCardProps = {
  children: ReactNode;
  /** Extra classes on the wrapper, after the shared `glow-card`. */
  className?: string;
  /** Corner radius in px. The system value is 20. */
  radius?: number;
  /** Play the intro sweep once on mount. Reserved for hero surfaces. */
  animated?: boolean;
  style?: CSSProperties;
};

export default function GlowCard({
  children,
  className = "",
  radius = 20,
  animated = false,
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
      glowColor="205 90 72"
      colors={["#38bdf8", "#c084fc", "#f472b6"]}
      animated={animated}
      style={style}
    >
      {children}
    </BorderGlow>
  );
}
