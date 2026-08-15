"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SectionHead from "./SectionHead";

gsap.registerPlugin(ScrollTrigger);

/* A pinned section: the viewport holds still while the panels move
   horizontally, driven entirely by vertical scroll. This is the pattern
   that makes a page feel like it has chapters rather than one long
   column, and it's the main thing the reference site does that a plain
   reveal-on-scroll page doesn't. */

const PANELS = [
  { n: "01", title: "Commit", body: "A push opens the pipeline. Linting, tests, and PR gates decide whether it goes further." },
  { n: "02", title: "Build", body: "Images built, tagged, and promoted across environments — no artifact assembled by hand." },
  { n: "03", title: "Gate", body: "Backup integrity verified, health checks armed. The deploy proves itself before traffic sees it." },
  { n: "04", title: "Release", body: "Rolling restart behind the load balancer, telemetry streaming to Datadog and Teams." },
  { n: "05", title: "Recover", body: "If any of it fails: rescue blocks, tested restore, and a rollback path that's been rehearsed." },
];

export default function Pipeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Pinning hijacks the scroll, which is disorienting on a phone and
    // leaves no room for five panels — fall back to a normal swipeable
    // row on small screens and under reduced motion.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // Scroll length maps 1:1 to horizontal distance, so the pace
          // feels linear rather than the panels racing at the end.
          end: () => "+=" + distance,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="pipeline" ref={sectionRef}>
      <div className="pipeline-inner">
        <div className="wrap pipeline-head">
          <SectionHead
            index="03 / 07"
            label="The path a release takes"
            accent="slate"
            title="Commit to recovery."
          />
        </div>

        <div className="pipeline-track" ref={trackRef}>
          {PANELS.map((p) => (
            <article className="pipeline-panel" key={p.n}>
              <span className="pipeline-num">({p.n})</span>
              <h3 className="pipeline-title">{p.title}</h3>
              <p className="pipeline-body">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
