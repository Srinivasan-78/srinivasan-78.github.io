"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TILES = [
  { label: "Scroll progress, exposed to JS", height: 220 },
  { label: "Word-safe text splitting", height: 320 },
  { label: "Cursor follow, any shape", height: 180 },
  { label: "Sticky positioning, built in", height: 260 },
  { label: "Custom easing per element", height: 300 },
  { label: "Trimmed for low overhead", height: 200 },
];

export default function Masonry() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const tiles = el.querySelectorAll(".masonry-tile");
    if (reduced) return;

    gsap.set(tiles, { opacity: 0, y: 24 });
    ScrollTrigger.batch(tiles, {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
        }),
    });
  }, []);

  return (
    <section id="gallery" className="section">
      <span className="eyebrow">Modules</span>
      <div
        ref={ref}
        style={{
          columns: "3 220px",
          columnGap: "var(--gap)",
          marginTop: "2rem",
        }}
      >
        {TILES.map((t) => (
          <div
            key={t.label}
            className="masonry-tile"
            style={{
              breakInside: "avoid",
              marginBottom: "var(--gap)",
              height: t.height,
              background: "var(--bg-raised)",
              border: "1px solid var(--line)",
              display: "flex",
              alignItems: "flex-end",
              padding: "1rem",
            }}
          >
            <span className="eyebrow">{t.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
