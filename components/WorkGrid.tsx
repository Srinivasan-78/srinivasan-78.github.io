"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "./ScrollProvider";
import { useInView } from "@/lib/useInView";
import GlowCard from "./ui/GlowCard";

export type Post = {
  tag: string;
  title: string;
  body: string;
  stack: string[];
  link?: { url: string; label: string };
};

const s = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* Cover art lives here rather than in the server page so the whole tile
   stays inside one client component — no element trees crossing the
   server/client boundary. Keyed by title. */
const ART: Record<string, React.ReactNode> = {
  "Parallelized migration framework": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {[26, 55, 84].map((y, i) => (
        <g key={y} opacity={1 - i * 0.22}>
          <path d={`M24 ${y} H244`} stroke="currentColor" strokeWidth="3" {...s} />
          <path d={`M236 ${y - 8} l10 8 -10 8`} stroke="currentColor" strokeWidth="3" {...s} />
          <rect x={50 + i * 44} y={y - 7} width="26" height="14" rx="3" fill="currentColor" />
        </g>
      ))}
    </svg>
  ),
  "Self-service DR & CI/CD suite": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <path d="M24 55 H92" stroke="currentColor" strokeWidth="3" {...s} />
      <circle cx="104" cy="55" r="11" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M116 55 H164 M164 55 L206 26 M164 55 L206 84" stroke="currentColor" strokeWidth="3" {...s} />
      <rect x="206" y="12" width="54" height="26" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      <rect x="206" y="72" width="54" height="26" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
    </svg>
  ),
  "Fail-fast validation framework": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={24 + i * 68}
            y="38"
            width="46"
            height="34"
            rx="5"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            opacity={i === 3 ? 0.4 : 1}
          />
          {i < 3 && (
            <path d={`M${70 + i * 68} 55 H${92 + i * 68}`} stroke="currentColor" strokeWidth="3" {...s} />
          )}
          {i < 3 && (
            <path d={`M${36 + i * 68} 55 l6 6 12 -13`} stroke="currentColor" strokeWidth="3" {...s} />
          )}
        </g>
      ))}
    </svg>
  ),
  "Project MATTER — CSA protocol": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <circle cx="150" cy="55" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r = (a * Math.PI) / 180;
        /* Rounded, not raw. Math.sin and Math.cos are allowed to differ
           in their last bit between implementations, and they do:
           Node renders 37.67949192431123 into the server HTML where the
           browser computes 37.679491924311236, and React reports the
           attribute as a hydration mismatch on every load. Two decimals
           is finer than a pixel in a 300-unit viewBox. */
        const at = (radius: number, axis: "x" | "y") =>
          ((axis === "x" ? 150 + Math.cos(r) * radius : 55 + Math.sin(r) * radius)).toFixed(2);
        return (
          <g key={a}>
            <path
              d={`M${at(20, "x")} ${at(20, "y")} L${at(42, "x")} ${at(42, "y")}`}
              stroke="currentColor"
              strokeWidth="2.5"
              {...s}
              opacity="0.6"
            />
            <circle cx={at(50, "x")} cy={at(50, "y")} r="7" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  ),
  "One-click Docker release pipeline": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={70 + i * 28}
          y={70 - i * 22}
          width="24"
          height="20"
          rx="3"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      ))}
      <path d="M160 60 H228" stroke="currentColor" strokeWidth="3" {...s} />
      <path d="M220 52 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
      <circle cx="248" cy="60" r="12" fill="currentColor" opacity="0.85" />
    </svg>
  ),
  "Wireshark THREAD installer": (
    <svg viewBox="0 0 300 110" aria-hidden="true">
      <path
        d="M14 60 H62 L78 26 L98 92 L116 44 L134 74 L152 60 H286"
        stroke="currentColor"
        strokeWidth="3.5"
        {...s}
      />
      <circle cx="98" cy="92" r="6" fill="currentColor" />
    </svg>
  ),
};

export default function WorkGrid({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const active = open === null ? null : posts[open];
  const { lock, unlock } = useScrollLock();
  /* Not wrapped in <Reveal> because the tiles are this component's own
     children, not a caller's — the group class goes straight on the grid
     and the stagger is a static nth-child step in globals.css. */
  const { ref: gridRef, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (open === null) return;

    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    lock();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      unlock();
      lastFocus.current?.focus();
    };
  }, [open, lock, unlock]);

  return (
    <>
      <div
        ref={gridRef}
        className={"work-grid reveal-group reveal-pop" + (inView ? " is-in" : "")}
      >
        {posts.map((p, i) => (
          <GlowCard key={p.title}>
            <button
              type="button"
              className="post"
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
            >
              <div className="post-body">
                <span className="tag tag-client">{p.tag}</span>
                <h3 className="post-title">
                  {p.title}
                </h3>
                <span className="post-open">{p.link ? "public work ↗" : "open ↗"}</span>
              </div>
              <div className="post-cover">{ART[p.title]}</div>
            </button>
          </GlowCard>
        ))}
      </div>

      {active && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          <GlowCard className="lb-glow" radius={22} animated>
            <div className="lb-card">
              <button ref={closeRef} type="button" className="lb-close" onClick={() => setOpen(null)}>
                close
              </button>
              <div className="lb-cover">{ART[active.title]}</div>
              <span className="tag tag-client">{active.tag}</span>
              <h2 className="lb-title">
                {active.title}
              </h2>
              <p className="lb-body">{active.body}</p>
              <div style={{ marginTop: "0.75rem" }}>
                {active.stack.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              {active.link && (
                <a
                  href={active.link.url}
                  target="_blank"
                  rel="noopener"
                  className="go lb-link"
                >
                  {active.link.label}
                </a>
              )}
            </div>
          </GlowCard>
        </div>
      )}
    </>
  );
}
