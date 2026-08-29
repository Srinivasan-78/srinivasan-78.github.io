/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌​​‌‌‌‌​​‌​‌​​‌​​​​‌​​​‌‌‌​​‌‌​​​​​‌​‌​​‌​​‌‌​‌​​‌​​‌‌​‌‌​​‌​‌​‌‌‌​​‌‌‌​​​​​‌​‌‌​‌​‌​​‌‌​​​‌‌​‌​‌​​‌‌‌‌​​‌​‌‌​‌‌‌​​‌‌​​‌‌‌​​‌‌‌​​​​‌​​​‌​​​‌‌‌​‌​​​‌‌‌​‌​‌​‌​‌‌​​‌​‌​​​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.RyHG0Ri6W8-Ljyng8DtuYB
 */
"use client";

import { useEffect, useRef } from "react";
import GlowCard from "./ui/GlowCard";
import Reveal from "./Reveal";
import SplitReveal from "./SplitReveal";
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
        duration: on ? 0.24 : 0.16,
        delay: on ? 0.14 + i * 0.02 : 0,
        ease: "power2.out",
      });
    } else {
      const L = len.get(el) ?? 0;
      gsap.to(el, {
        strokeDashoffset: on ? 0 : L,
        /* Was 0.5s with a 0.04s step, which ran ~860ms end to end on a
           row the pointer might cross by accident. Hover is not a
           surface that gets to spend that. */
        duration: on ? 0.35 : 0.22,
        delay: on ? i * 0.03 : 0,
        /* `power2.out` both ways. The exit used to be `power2.in`, which
           holds the line still for the first third of the retreat — the
           part the eye is on — and then yanks it. Out-easing on the way
           back reads as the drawing letting go. */
        ease: "power2.out",
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

  /* The schematic draws on mouseenter and undraws on mouseleave, which
     is a mouse contract that a touchscreen does not honour: a tap
     synthesises `mouseenter` and then often never sends `mouseleave`
     until something else is tapped. So on a phone the draw fires on
     every tap and stays armed afterwards.

     The CSS guard added for hover states keeps `.pi-art` itself hidden
     there, so nothing is visibly wrong today — but a stack of GSAP
     tweens is still being started and left running behind an invisible
     element, once per tap, on the device least able to spare it.

     `hover: hover` rather than `pointer: fine`: the question is whether
     the device can hover at all, which is the thing that decides
     whether these two handlers can ever be paired. Read live rather
     than once, so a tablet that gains a mouse mid-session is right. */
  const canHover = useRef(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const apply = () => {
      canHover.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  let n = 0;

  return (
    <main id="content" tabIndex={-1} className="pi wrap" ref={rootRef}>
      <header className="pi-head">
        <span className="eyebrow">Projects</span>
        <SplitReveal
          as="h1"
          text="Things I build for the love of it"
          className="display display-lg"
        />
        <p>
          {PROJECTS.length} builds: live demos, platform experiments, and tooling I happily use
          myself. Hover a row to see its schematic, click through for the full write-up, or
          open a live build straight from its row.
        </p>
      </header>

      {/* Each group is a panel now, on the same surface, radius and
          proximity glow as every other card on the site — so the index
          reads as the same material as the home page rather than as a
          bare table that happens to live on the same domain. The rows
          inside keep their own behaviour. */}
      {/* The panels arrive the way every other group of cards on the site
          does. Plain `.reveal`, not `pop`: the scale variant is for
          tiles, and scaling a full-width panel reads as a zoom rather
          than as the thing arriving. */}
      <Reveal>
        {groups.map((g) => (
          <GlowCard key={g.name} className="pi-glow">
            <section className="pi-group">
              <div className="pi-rail">
                <span className="pi-rail-inner">
                  <h2 className="pi-rail-label">{g.name}</h2>
                  <span className="pi-rail-count">{String(g.items.length).padStart(2, "0")}</span>
                </span>
              </div>

              <div className="pi-rows">
                {g.items.map((p) => {
                  n += 1;
                  const art = DIAGRAM[p.schematic ?? p.title] ?? FALLBACK;
                  return (
                    <div
                      key={p.slug}
                      className="pi-row"
                      onMouseEnter={(e) => {
                        if (!canHover.current) return;
                        const a = e.currentTarget.querySelector(".pi-art");
                        if (a) drawRow(a, true);
                      }}
                      onMouseLeave={(e) => {
                        if (!canHover.current) return;
                        const a = e.currentTarget.querySelector(".pi-art");
                        if (a) drawRow(a, false);
                      }}
                    >
                      {/* The row used to be one big <Link>. A deployed project
                          now offers a second destination — the running build —
                          and an <a> cannot live inside an <a>, so the write-up
                          link became an overlay stretched across the row and
                          the demo link sits above it. Clicking anywhere still
                          opens the write-up; only the demo pill differs. */}
                      <Link href={`/projects/${p.slug}`} className="pi-open">
                        <span className="sr-only">{p.title} — read the write-up</span>
                      </Link>

                      <span className="pi-num">{String(n).padStart(2, "0")}</span>

                      <span className="pi-name">
                        {p.title}
                        <span className="pi-status">
                          {p.status === "Live" || p.status === "Active" ? (
                            <i className="pi-dot" />
                          ) : null}
                          {p.status}
                        </span>
                        {p.demo ? (
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noopener"
                            className="pi-demo"
                          >
                            Open live build ↗
                          </a>
                        ) : null}
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
                    </div>
                  );
                })}
              </div>
            </section>
          </GlowCard>
        ))}
      </Reveal>

      <footer className="pi-foot">
        <span className="micro">
          (hover for schematic · click for the write-up · &ldquo;open live build&rdquo; runs the real
          thing)
        </span>
        <span className="micro">(all public on github.com/Srinivasan-78)</span>
      </footer>
    </main>
  );
}
