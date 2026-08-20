"use client";

import { useEffect, useRef } from "react";
import GlowCard from "./ui/GlowCard";
import Link from "next/link";
import gsap from "gsap";
import { PROJECTS, type Project } from "@/lib/projects";
import { DIAGRAM, FALLBACK } from "./ProjectGrid";

/* A manifest, not a gallery.

   One full-bleed row per project. The right-hand column carries the
   stack tokens at rest and swaps to the project's line-art schematic
   on hover — and the schematic doesn't fade in, it *draws* itself,
   stroke by stroke. That is the one flourish this page gets, and it
   works because the existing art is already pure `currentColor` line
   work: every stroked element has a real arc length, so it can be
   dashed and unrolled. Nothing had to be redrawn.

   Group headings are set vertically down a sticky left rail rather
   than as horizontal bars. Horizontal headings cost a full row of
   vertical space each and break the column of names; a vertical rail
   labels the section continuously while you scroll it, and keeps every
   project name on one unbroken left edge. */

type Group = { name: string; items: Project[] };

/* Contiguous runs in source order, so re-ordering the array in
   lib/projects.ts is the only thing needed to re-order this page. */
function groupProjects(list: Project[]): Group[] {
  const out: Group[] = [];
  for (const p of list) {
    const tail = out[out.length - 1];
    if (tail && tail.name === p.client) tail.items.push(p);
    else out.push({ name: p.client, items: [p] });
  }
  return out;
}

const len = new WeakMap<SVGGeometryElement, number>();

function geometry(art: Element) {
  return Array.from(
    art.querySelectorAll<SVGGeometryElement>("path, rect, circle, ellipse, line, polyline, polygon")
  );
}

/* Filled shapes have no stroke to unroll, so they pop in on a short
   delay instead. Their authored opacity is stashed on the element the
   first time we touch it — several schematics stagger opacity across a
   series of bars, and resetting them all to 1 would flatten that. */
function isFilled(el: SVGGeometryElement) {
  const f = el.getAttribute("fill");
  return !!f && f !== "none";
}

function armRow(art: Element) {
  geometry(art).forEach((el) => {
    if (isFilled(el)) {
      if (!el.dataset.o) el.dataset.o = el.getAttribute("opacity") ?? "1";
      gsap.set(el, { opacity: 0 });
    } else {
      let L = len.get(el);
      if (L == null) {
        try {
          L = el.getTotalLength();
        } catch {
          L = 0;
        }
        len.set(el, L);
      }
      gsap.set(el, { strokeDasharray: L, strokeDashoffset: L });
    }
  });
}

function drawRow(art: Element, on: boolean) {
  geometry(art).forEach((el, i) => {
    gsap.killTweensOf(el);
    if (isFilled(el)) {
      gsap.to(el, {
        opacity: on ? Number(el.dataset.o ?? 1) : 0,
        duration: on ? 0.3 : 0.16,
        delay: on ? 0.18 + i * 0.02 : 0,
        ease: "power2.out",
      });
    } else {
      const L = len.get(el) ?? 0;
      gsap.to(el, {
        strokeDashoffset: on ? 0 : L,
        duration: on ? 0.5 : 0.22,
        delay: on ? i * 0.04 : 0,
        ease: on ? "power2.out" : "power2.in",
      });
    }
  });
}

export default function ProjectIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const groups = groupProjects(PROJECTS);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const arts = Array.from(root.querySelectorAll(".pi-art"));
    if (reduced) {
      // Leave the art fully drawn; CSS handles the swap on hover.
      root.classList.add("pi-static");
      return;
    }
    arts.forEach(armRow);
  }, []);

  let n = 0;

  return (
    <main id="content" className="pi wrap" ref={rootRef}>
      <header className="pi-head">
        <span className="eyebrow">Projects</span>
        <h1 className="display display-lg">
          Things I build outside work
        </h1>
        <p>
          {PROJECTS.length} public repositories — live demos, platform experiments, and
          tooling I actually use. Hover a row for its schematic, open it for the full
          write-up.
        </p>
      </header>

      {/* Each group is a panel now, on the same surface, radius and
          proximity glow as every other card on the site — so the index
          reads as the same material as the home page rather than as a
          bare table that happens to live on the same domain. The rows
          inside keep their own behaviour. */}
      {groups.map((g) => (
        <GlowCard key={g.name} className="pi-glow">
          <section className="pi-group">
            <div className="pi-rail">
              <span className="pi-rail-inner">
                <span className="pi-rail-label">{g.name}</span>
                <span className="pi-rail-count">{String(g.items.length).padStart(2, "0")}</span>
              </span>
            </div>

            <div className="pi-rows">
              {g.items.map((p) => {
                n += 1;
                const art = DIAGRAM[p.schematic ?? p.title] ?? FALLBACK;
                return (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="pi-row"
                 
                    onMouseEnter={(e) => {
                      const a = e.currentTarget.querySelector(".pi-art");
                      if (a) drawRow(a, true);
                    }}
                    onMouseLeave={(e) => {
                      const a = e.currentTarget.querySelector(".pi-art");
                      if (a) drawRow(a, false);
                    }}
                  >
                    <span className="pi-num">{String(n).padStart(2, "0")}</span>

                    <span className="pi-name">
                      {p.title}
                      <span className="pi-status">
                        {p.status === "Live" || p.status === "Active" ? (
                          <i className="pi-dot" />
                        ) : null}
                        {p.status}
                      </span>
                    </span>

                    <span className="pi-teaser">{p.teaser}</span>

                    {/* The swap zone: tokens at rest, schematic on hover. */}
                    <span className="pi-right">
                      <span className="pi-stack">
                        {p.stack.slice(0, 4).map((t) => (
                          <em key={t}>{t}</em>
                        ))}
                        {p.stack.length > 4 && <em className="pi-more">+{p.stack.length - 4}</em>}
                      </span>
                      <span className="pi-art">{art}</span>
                    </span>

                    <span className="pi-sweep" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        </GlowCard>
      ))}

      <footer className="pi-foot">
        <span className="micro">(hover for schematic · click for the write-up)</span>
        <span className="micro">(all public on github.com/Srinivasan-78)</span>
      </footer>
    </main>
  );
}
