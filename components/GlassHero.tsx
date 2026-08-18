"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { GlassImage } from "@/components/FluidGlass";

const FluidGlass = dynamic(() => import("@/components/FluidGlass"), { ssr: false });

const BACKDROP: GlassImage[] = [
  { url: "/images/racks-corridor.webp", position: [-2.1, 0.2, 2], scale: [2.6, 3.4, 1] },
  { url: "/images/terraform-plan.webp", position: [2.2, -0.3, 3], scale: [2.4, 2.4, 1] },
  { url: "/images/multicloud-sky.webp", position: [0, 1.6, 1], scale: [3.2, 1.4, 1] },
];

export default function GlassHero({
  eyebrow = "Srinivasan Vijayaraghavan · DevOps / SRE",
  text = "SHIP IT",
  caption = "Release, upgrade, and disaster-recovery automation for a multi-tenant Azure platform.",
}: {
  eyebrow?: string;
  text?: string;
  caption?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A coarse pointer can never move the lens, and reduced-motion asks
    // for no continuous animation — both keep the static poster instead.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={hostRef} className="glass-stage" data-live={live} aria-label={text}>
      <div className="glass-stage-canvas" aria-hidden>
        {live && (
          <FluidGlass
            mode="lens"
            text={text}
            images={BACKDROP}
            background="#1c0a3d"
            lensProps={{
              scale: 0.25,
              ior: 1.15,
              thickness: 5,
              chromaticAberration: 0.1,
              anisotropy: 0.01,
            }}
          />
        )}
      </div>

      <div className="glass-stage-overlay">
        <span className="eyebrow glass-stage-eyebrow">{eyebrow}</span>
        <h2 className="glass-stage-title display">{text}</h2>
        <p className="glass-stage-caption">{caption}</p>
      </div>

      <span className="glass-stage-hint eyebrow" aria-hidden>
        move the cursor
      </span>
    </section>
  );
}
