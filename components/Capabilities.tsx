"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionHead from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

/* CSS multi-column masonry of capability tiles. Artwork is original
   SVG rather than stock photography: no licensing questions, no
   external requests, and it stays crisp at any tile size. */

type Tile = {
  title: string;
  body: string;
  accent: "sage" | "slate" | "plum" | "brass";
  art: React.ReactNode;
};

const stroke = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TILES: Tile[] = [
  {
    title: "Pipelines that gate themselves",
    body: "Provisioning, promotion, DR failover and failback — self-service workflows instead of runbooks nobody wants to open at 2am.",
    accent: "sage",
    art: (
      <svg viewBox="0 0 300 160" role="img" aria-label="A pipeline branching through validation gates">
        <path d="M20 80 H90" stroke="currentColor" strokeWidth="3" {...stroke} />
        <circle cx="100" cy="80" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M110 80 H160 M160 80 L200 40 M160 80 L200 120" stroke="currentColor" strokeWidth="3" {...stroke} />
        <rect x="200" y="26" width="56" height="28" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
        <rect x="200" y="106" width="56" height="28" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M212 40 l7 7 14 -14" stroke="currentColor" strokeWidth="3" {...stroke} opacity="0.9" />
        <path d="M214 114 l16 16 M230 114 l-16 16" stroke="currentColor" strokeWidth="3" {...stroke} opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Disaster recovery, rehearsed",
    body: "Region-to-region migration with zero data loss, HA mirroring, and a restore path that's been run — not just written down.",
    accent: "slate",
    art: (
      <svg viewBox="0 0 300 200" role="img" aria-label="Two regions mirroring data with a failover arc">
        <rect x="24" y="70" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="3" fill="none" />
        <rect x="196" y="70" width="80" height="60" rx="8" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M104 92 C 150 92, 150 92, 196 92" stroke="currentColor" strokeWidth="3" {...stroke} />
        <path d="M188 84 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...stroke} />
        <path d="M196 116 C 150 116, 150 116, 104 116" stroke="currentColor" strokeWidth="3" {...stroke} opacity="0.45" />
        <path d="M112 108 l-10 8 10 8" stroke="currentColor" strokeWidth="3" {...stroke} opacity="0.45" />
        <circle cx="64" cy="100" r="6" fill="currentColor" />
        <circle cx="236" cy="100" r="6" fill="currentColor" opacity="0.5" />
        <path d="M150 40 a60 60 0 0 1 0 120" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" fill="none" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Config without drift",
    body: "Centralized vars and vault, environment-agnostic inventories, Jinja2 templating — one source of truth across fifteen-plus services.",
    accent: "plum",
    art: (
      <svg viewBox="0 0 300 150" role="img" aria-label="Configuration layers stacking into one source">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={40 + i * 14}
            y={26 + i * 30}
            width="180"
            height="24"
            rx="5"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity={1 - i * 0.25}
          />
        ))}
        <path d="M245 38 C 285 38, 285 128, 245 128" stroke="currentColor" strokeWidth="3" {...stroke} opacity="0.6" />
        <circle cx="245" cy="83" r="9" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Observability wired into the deploy",
    body: "Datadog dashboards, HTTP/TCP/JMX synthetics, and run summaries pushed to Teams — failures announce themselves.",
    accent: "brass",
    art: (
      <svg viewBox="0 0 300 150" role="img" aria-label="A monitoring waveform with an alert spike">
        <path
          d="M14 96 H70 L86 58 L106 122 L124 72 L142 100 L162 88 H286"
          stroke="currentColor"
          strokeWidth="3.5"
          {...stroke}
        />
        {[40, 80, 120].map((r, i) => (
          <circle key={r} cx="106" cy="96" r={r} stroke="currentColor" strokeWidth="2" fill="none" opacity={0.28 - i * 0.07} />
        ))}
        <circle cx="106" cy="122" r="6" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Secrets held properly",
    body: "BYOK through Key Vault and App Configuration, RBAC gates in CI, commit signing — least privilege as a default, not a cleanup task.",
    accent: "sage",
    art: (
      <svg viewBox="0 0 300 170" role="img" aria-label="A key passing through a permission gate into a vault">
        <rect x="150" y="46" width="110" height="80" rx="10" stroke="currentColor" strokeWidth="3" fill="none" />
        <circle cx="205" cy="82" r="14" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M205 96 V110" stroke="currentColor" strokeWidth="3" {...stroke} />
        <circle cx="52" cy="86" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M68 86 H124 M108 86 V100 M120 86 V96" stroke="currentColor" strokeWidth="3" {...stroke} />
        <path d="M136 30 V142" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Migration at scale",
    body: "Parallelized transfer with delta detection and AzCopy, cutting the window where a cutover can hurt anyone.",
    accent: "slate",
    art: (
      <svg viewBox="0 0 300 130" role="img" aria-label="Parallel transfer lanes moving between two stores">
        {[34, 65, 96].map((y, i) => (
          <g key={y} opacity={1 - i * 0.22}>
            <path d={`M30 ${y} H240`} stroke="currentColor" strokeWidth="3" {...stroke} />
            <path d={`M232 ${y - 8} l10 8 -10 8`} stroke="currentColor" strokeWidth="3" {...stroke} />
            <rect x={54 + i * 40} y={y - 7} width="26" height="14" rx="3" fill="currentColor" />
          </g>
        ))}
      </svg>
    ),
  },
];

export default function Capabilities() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tiles = el.querySelectorAll(".cap-tile");
    gsap.set(tiles, { opacity: 0, y: 30 });
    const triggers = ScrollTrigger.batch(tiles, {
      start: "top 93%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 }),
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          index="04 / 05"
          label="What I actually build"
          accent="plum"
          title="Six things I get called in for."
        />

        <div className="masonry" ref={ref} data-skew>
          {TILES.map((t) => (
            <article className={"cap-tile accent-" + t.accent} key={t.title}>
              <div className="cap-body-wrap">
                <h3 className="cap-title">{t.title}</h3>
                <p className="cap-body">{t.body}</p>
              </div>
              <div className="cap-art">{t.art}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
