"use client";

import { useEffect, useRef, useState } from "react";

export type Project = {
  title: string;
  status?: string;
  teaser: string;
  body: string;
  stack: string[];
  links?: { url: string; label: string }[];
};

type Accent = "sage" | "slate" | "plum" | "brass";

const s = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* One small schematic per project, keyed by title. Kept deliberately
   simple line-art (currentColor) so it inherits the group accent and
   works in light/dark without separate art. */
export const DIAGRAM: Record<string, React.ReactNode> = {
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

export default function ProjectGrid({ accent, items }: { accent: Accent; items: Project[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = open === null ? null : items[open];

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="proj-grid">
        {items.map((p, i) => (
          <button
            key={p.title}
            type="button"
            className={"post proj-card " + accent}
            onClick={() => setOpen(i)}
            aria-haspopup="dialog"
          >
            <div className="proj-diagram">{DIAGRAM[p.title] ?? FALLBACK}</div>
            <div className="proj-face">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <h3 className="post-title" style={{ margin: 0 }}>{p.title}</h3>
                {p.status && <span className="proj-status">{p.status}</span>}
              </div>
              <p className="proj-teaser">{p.teaser}</p>
              <div>{p.stack.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}</div>
            </div>
            <span className="proj-hint">hover: diagram · tap: details ↗</span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}
        >
          <div className={"lb-card " + accent}>
            <button ref={closeRef} type="button" className="lb-close" onClick={() => setOpen(null)}>
              close
            </button>
            <div className="post-cover" style={{ padding: 0, color: `var(--${accent})` }}>
              {DIAGRAM[active.title] ?? FALLBACK}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginTop: "1rem" }}>
              <h2 className="lb-title" style={{ margin: 0 }}>{active.title}</h2>
              {active.status && <span className="tag" style={{ margin: 0 }}>{active.status}</span>}
            </div>
            <p className="lb-body">{active.body}</p>
            <div style={{ marginTop: "0.75rem" }}>
              {active.stack.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
            {active.links && (
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                {active.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener" className="eyebrow" style={{ color: `var(--${accent})` }}>
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
