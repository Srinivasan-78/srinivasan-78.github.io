/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​‌‌​‌‌​‌​​​​‌‌​‌​‌​​‌​​‌‌​​​​‌‌​​‌‌​​‌‌​​‌​​‌​​‌‌​‌​​‌‌​​​​​‌​‌‌​​​​‌‌‌​​​​​‌​​​​‌​​​‌‌‌​​​​‌‌​‌​​​​‌‌​‌​‌​​‌​‌​‌​​​‌‌​​‌‌‌​​‌‌​‌​​​‌​‌​​​​​‌‌​​‌‌‌​‌‌​‌‌​‌​‌​​‌‌‌​​​‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.shjL32M0XpB8hjTg4PgmN0
 */
import {
  FiActivity,
  FiArrowUpRight,
  FiAward,
  FiBarChart2,
  FiBox,
  FiCheckCircle,
  FiClock,
  FiCloud,
  FiCode,
  FiCpu,
  FiDatabase,
  FiDownload,
  FiExternalLink,
  FiGitBranch,
  FiGitMerge,
  FiGlobe,
  FiHardDrive,
  FiHome,
  FiKey,
  FiLayers,
  FiLock,
  FiMail,
  FiMapPin,
  FiPackage,
  FiPhone,
  FiServer,
  FiShield,
  FiTerminal,
  FiTrendingUp,
  FiGithub,
  FiLinkedin,
  FiZap,
} from "react-icons/fi";

/* The one place in the design layer that knows about an icon library.

   The data modules under lib/data/ carry icon *tokens* — plain strings
   like "server" — rather than imported components, which is what keeps
   them free of React entirely. This maps a token to a glyph, and it is
   the only file that has to change if the icon set is ever swapped.

   Unknown tokens fall back to a neutral glyph rather than throwing or
   rendering nothing. A missing icon must never be able to take a page
   down, and an empty space where a glyph should be is harder to notice
   in review than the wrong glyph is. */

export const ICONS = {
  activity: FiActivity,
  arrowUpRight: FiArrowUpRight,
  award: FiAward,
  barChart: FiBarChart2,
  box: FiBox,
  checkCircle: FiCheckCircle,
  clock: FiClock,
  cloud: FiCloud,
  code: FiCode,
  cpu: FiCpu,
  database: FiDatabase,
  download: FiDownload,
  externalLink: FiExternalLink,
  gitBranch: FiGitBranch,
  github: FiGithub,
  gitMerge: FiGitMerge,
  globe: FiGlobe,
  hardDrive: FiHardDrive,
  home: FiHome,
  key: FiKey,
  layers: FiLayers,
  linkedin: FiLinkedin,
  lock: FiLock,
  mail: FiMail,
  mapPin: FiMapPin,
  package: FiPackage,
  phone: FiPhone,
  server: FiServer,
  shield: FiShield,
  terminal: FiTerminal,
  trendingUp: FiTrendingUp,
  zap: FiZap,
} as const;

export type IconToken = keyof typeof ICONS;

type IconProps = {
  name: string;
  className?: string;
};

export default function Icon({ name, className = "h-4 w-4" }: IconProps) {
  const Glyph = (ICONS as Record<string, typeof FiBox | undefined>)[name] ?? FiBox;
  /* Decorative throughout: every icon on this site sits next to a text
     label that already says the thing. None of them should reach a
     screen reader. */
  return <Glyph className={className} aria-hidden="true" />;
}
