/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌‌‌‌​‌‌​‌​‌‌​‌​‌‌​​​​​‌​‌‌​‌​‌​‌​‌‌​​‌‌‌​​​‌​​‌‌​‌​​​‌​​​​‌​​​‌‌‌​​‌​‌​‌‌​​​​‌‌​‌​​​​‌‌​‌​​‌​‌​‌​​‌​​​‌‌​‌‌​​​‌‌​‌‌​​‌‌​​‌‌‌​‌‌‌‌​‌​​‌‌‌​​​​​‌​‌​​‌​​​‌‌​‌​‌​​‌‌​​‌​​‌​​‌​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1._kX-Vq4B9XhiR66gzpR52J
 */
/* Schematic art only. The card component that used to live here was
   unreferenced — ProjectIndex renders the rows and pulls just these two
   exports, so the dead component and its duplicate Project/Accent types
   (which shadowed the real ones in lib/projects.ts) are gone. */

import type { ReactNode } from "react";

const s = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* One small schematic per project, keyed by title. Kept deliberately
   simple line-art (currentColor) so it inherits the group accent and
   works in light/dark without separate art. */
export const DIAGRAM: Record<string, ReactNode> = {
  "Self-Healing Deployment": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="24" y="40" width="60" height="30" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M100 45 l14 20 -14 20" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M120 30 L136 55 L120 80" stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.6" />
      <path d="M150 55 H198" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M190 47 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M216 40 a20 20 0 1 1 -0.1 0" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M228 32 l8 -6 2 10" stroke="currentColor" strokeWidth="3" {...s} />
    </svg>
  ),
  "PDF Tools": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="110" y="20" width="80" height="70" rx="6" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M128 45 H172 M128 60 H172 M128 75 H155" stroke="currentColor" strokeWidth="2.5" {...s} />
      <path d="M60 55 H104" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M96 47 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M196 55 H240" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M232 47 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M30 30 L46 46 M46 30 L30 46" stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.6" />
    </svg>
  ),
  "vFactor Solutions": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="30" y="18" width="240" height="74" rx="6" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M30 38 H270" stroke="currentColor" strokeWidth="2" {...s} />
      <circle cx="44" cy="28" r="3" fill="currentColor" />
      <circle cx="56" cy="28" r="3" fill="currentColor" />
      <rect x="50" y="50" width="60" height="30" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="120" y="50" width="60" height="30" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="190" y="50" width="60" height="30" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  "Multi-Cloud Free-Tier Platform": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <circle cx="150" cy="55" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
      {[[54, 30], [246, 30], [54, 84], [246, 84]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M${x < 150 ? x + 24 : x - 24} ${y} L${x < 150 ? 134 : 166} 55`} stroke="currentColor" strokeWidth="2" {...s} opacity="0.55" />
          <rect x={x - 24} y={y - 12} width="48" height="24" rx="5" stroke="currentColor" strokeWidth="2.5" fill="none" />
        </g>
      ))}
    </svg>
  ),
  "repo2graph": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <path d="M78 55 L150 26 M78 55 L150 84 M150 26 L222 40 M150 84 L222 74 M150 26 L150 84 M222 40 L222 74" stroke="currentColor" strokeWidth="2" {...s} opacity="0.55" />
      <circle cx="78" cy="55" r="13" stroke="currentColor" strokeWidth="3" fill="none" />
      <circle cx="150" cy="26" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="150" cy="84" r="9" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="222" cy="40" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="222" cy="74" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  /* The pile that grows with every turn, funnelled down to one small
     result — which is the whole argument tokenmiser makes. */
  tokenmiser: (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {[3, 5, 7].map((n, i) => (
        <g key={i}>
          {Array.from({ length: n }, (_, k) => (
            <rect key={k} x={24 + i * 30} y={82 - k * 11} width="22" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none" opacity={0.5 + i * 0.25} />
          ))}
        </g>
      ))}
      <path d="M126 55 H158" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M150 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M168 26 H236 L208 58 V84 L196 76 V58 Z" stroke="currentColor" strokeWidth="3" {...s} />
      <rect x="252" y="48" width="24" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  "doc2md-action": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="34" y="22" width="56" height="66" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M46 42 H78 M46 54 H78 M46 66 H66" stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.6" />
      <rect x="46" y="34" width="32" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M104 55 H140" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M132 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <circle cx="164" cy="55" r="17" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M156 55 h16 M164 47 v16" stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.7" />
      <path d="M190 55 H226" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M218 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <rect x="240" y="30" width="30" height="50" rx="4" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M248 44 H262 M248 54 H262 M248 64 H256" stroke="currentColor" strokeWidth="2" {...s} />
    </svg>
  ),
  "Zim Assistant": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect key={i} x={90} y={20 + i * 14} width="120" height="10" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none" opacity={1 - i * 0.15} />
      ))}
      <circle cx="150" cy="78" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M161 89 L176 100" stroke="currentColor" strokeWidth="3" {...s} />
    </svg>
  ),
  "Multi-AI Toolkit": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="118" y="38" width="64" height="34" rx="6" stroke="currentColor" strokeWidth="3" fill="none" />
      {[[30, 20], [30, 90], [270, 20], [270, 90]].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M${x < 150 ? x + 34 : x - 34} ${y} L${x < 150 ? 118 : 182} 55`} stroke="currentColor" strokeWidth="2" {...s} opacity="0.6" />
          <circle cx={x} cy={y} r="12" stroke="currentColor" strokeWidth="2.5" fill="none" />
        </g>
      ))}
    </svg>
  ),
  "Simple-Actions": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {["Build", "Sign", "Release", "Purge"].map((_, i) => (
        <g key={i}>
          <rect x={20 + i * 68} y="38" width="46" height="34" rx="5" stroke="currentColor" strokeWidth="3" fill="none" opacity={i === 1 ? 1 : 0.85} />
          {i < 3 && <path d={`M${66 + i * 68} 55 H${88 + i * 68}`} stroke="currentColor" strokeWidth="3" {...s} />}
          {i < 3 && <path d={`M${80 + i * 68} 47 l8 8 -8 8`} stroke="currentColor" strokeWidth="3" {...s} />}
        </g>
      ))}
    </svg>
  ),
  "WiX Installer Template": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="30" y="42" width="70" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M104 55 L140 55" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M120 30 L150 55 L120 80 Z" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M160 55 H200" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M192 47 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
      <rect x="216" y="34" width="54" height="42" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M232 50 H254 M232 60 H254" stroke="currentColor" strokeWidth="2" {...s} />
    </svg>
  ),
  "Brainrot Study — automated video pipeline": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {["Research", "Script", "TTS", "Render"].map((_, i) => (
        <g key={i}>
          <circle cx={38 + i * 76} cy="55" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
          {i < 3 && <path d={`M${54 + i * 76} 55 H${98 + i * 76}`} stroke="currentColor" strokeWidth="2.5" {...s} />}
          {i < 3 && <path d={`M${90 + i * 76} 47 l8 8 -8 8`} stroke="currentColor" strokeWidth="2.5" {...s} />}
        </g>
      ))}
    </svg>
  ),
  "Minecraft Server Setup": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="20" y="38" width="52" height="34" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M32 50 H60 M32 60 H50" stroke="currentColor" strokeWidth="2" {...s} />
      <path d="M80 55 H118" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M110 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <circle cx="146" cy="55" r="18" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M146 41 V33 M146 77 V69 M132 55 H124 M168 55 H160" stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.6" />
      <path d="M176 55 H214" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M206 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <rect x="228" y="30" width="48" height="50" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M228 46 H276 M244 30 V46 M260 46 V80" stroke="currentColor" strokeWidth="2" {...s} />
    </svg>
  ),
  "Matter Test Harness Image Builder": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="30" y="30" width="60" height="50" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="42" cy="42" r="3" fill="currentColor" />
      <path d="M100 55 H140" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M132 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <circle cx="164" cy="55" r="16" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M164 41 V33 M164 77 V69 M150 55 H142 M186 55 H178" stroke="currentColor" strokeWidth="2.5" {...s} />
      <path d="M190 55 H228" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M220 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M240 34 a20 30 0 0 1 20 30 v10 a20 30 0 0 1 -20 -30 z" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  ),
  ImgAutomation: (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <rect x="30" y="30" width="56" height="48" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M100 55 H150" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M142 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M180 30 a25 25 0 1 1 -17 43" stroke="currentColor" strokeWidth="2.5" {...s} />
      <path d="M156 66 l8 12 12 -6" stroke="currentColor" strokeWidth="2.5" {...s} />
      <path d="M228 55 H260" stroke="currentColor" strokeWidth="3" {...s} opacity="0.7" />
      <path d="M252 47 l8 8 -8 8" stroke="currentColor" strokeWidth="3" {...s} opacity="0.7" />
    </svg>
  ),
  SpeedTestDD: (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <path d="M24 90 H276" stroke="currentColor" strokeWidth="2" {...s} opacity="0.5" />
      {[18, 30, 46, 66, 52, 38, 26].map((h, i) => (
        <rect key={i} x={34 + i * 34} y={90 - h} width="18" height={h} rx="2" fill="currentColor" opacity={0.5 + i * 0.07} />
      ))}
    </svg>
  ),
};

export const FALLBACK = (
  <svg viewBox="0 0 300 110" aria-hidden="true">
    <rect x="90" y="35" width="120" height="40" rx="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
  </svg>
);
