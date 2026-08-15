"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Masonry of stack photography. Each tile drifts at a slightly
   different rate so the column doesn't read as one rigid block —
   the depth is the point, otherwise this is just a grid of pictures. */

const TILES: { src: string; alt: string; caption: string; speed: number }[] = [
  { src: "/images/racks-corridor.webp", alt: "Datacenter rack corridor", caption: "Where it actually runs", speed: 8 },
  { src: "/images/terraform-plan.webp", alt: "Terminal showing kubectl and a terraform plan", caption: "Plan before apply", speed: 5 },
  { src: "/images/htop-terminal.webp", alt: "Terminal system monitor showing CPU and interface stats", caption: "Watch the metrics", speed: 10 },
  { src: "/images/cabling-blue.webp", alt: "Structured network cabling in a rack", caption: "Cabling discipline", speed: 6 },
  { src: "/images/globe-network.webp", alt: "Global network links across a night-side earth", caption: "Multi-region by default", speed: 9 },
  { src: "/images/motherboard-epyc.webp", alt: "Server motherboard close-up", caption: "Down to the silicon", speed: 5 },
  { src: "/images/observability-ui.webp", alt: "Deployment health dashboard", caption: "Green means shipped", speed: 8 },
  { src: "/images/multicloud-sky.webp", alt: "Cloud provider diagram above a city skyline", caption: "Two clouds, one pipeline", speed: 6 },
  { src: "/images/circuit-macro.webp", alt: "Macro shot of a circuit board", caption: "Build, automate, repeat", speed: 7 },
];

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const figures = gsap.utils.toArray<HTMLElement>(".gal-item");

      // fade the tiles in as batches
      gsap.set(figures, { opacity: 0, y: 26 });
      ScrollTrigger.batch(figures, {
        start: "top 94%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07 }),
      });

      // per-tile parallax on the image inside each tile
      figures.forEach((fig) => {
        const img = fig.querySelector("img");
        const speed = Number(fig.dataset.speed ?? 7);
        if (!img) return;
        gsap.fromTo(
          img,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: { trigger: fig, start: "top bottom", end: "bottom top", scrub: 0.5 },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow c-brass">The environment</span>
        <h2 className="display display-lg" style={{ margin: "0.4rem 0 0" }}>
          The stack, up close.
        </h2>

        <div className="masonry" ref={ref}>
          {TILES.map((t) => (
            <figure className="gal-item cap-photo" key={t.src} data-speed={t.speed}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt={t.alt} loading="lazy" decoding="async" />
              <figcaption className="gal-cap">{t.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
