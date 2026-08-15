"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/* A single persistent WebGL field behind the whole page, driven by
   scroll so the site reads as one continuous space rather than a
   sequence of unrelated sections.

   Two things move, and they're deliberately split by cost:

   - Position/scale: a CSS transform on the container. Free — the GPU
     composites it, the WebGL scene never re-renders for it. This is
     what produces the sense of travelling through the field.
   - Colour: Vanta's setOptions, which updates a material uniform.
     Cheap, but only fired when the active section actually changes —
     never per frame.

   What's deliberately NOT driven by scroll: points, spacing, and
   maxDistance. Changing those makes Vanta rebuild its geometry, which
   would stutter badly if done continuously. */

type VantaEffect = {
  destroy: () => void;
  setOptions: (o: Record<string, unknown>) => void;
};

/** Accent each stage of the page tints toward, in scroll order. */
const STOPS = ["--sage", "--slate", "--plum", "--brass"] as const;

function cssHex(name: string, fallback: number) {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const n = parseInt(v.replace("#", ""), 16);
  return Number.isNaN(n) ? fallback : n;
}

export default function VantaBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);
  const stopRef = useRef(-1);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let cleanupScroll: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — vanta ships no bundled types
      const NET = (await import("vanta/dist/vanta.net.min")).default;

      if (cancelled || !hostRef.current) return;

      effectRef.current = NET({
        el: hostRef.current,
        THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        points: 10,
        maxDistance: 24,
        spacing: 17,
        showDots: true,
        color: cssHex("--sage", 0x0095f6),
        backgroundColor: cssHex("--paper", 0x050505),
      }) as VantaEffect;

      const inner = innerRef.current;
      if (!inner) return;

      // quickTo keeps its own interpolation, so the field eases toward
      // the scroll position instead of snapping frame to frame.
      const moveY = gsap.quickTo(inner, "yPercent", { duration: 1.1, ease: "power2.out" });
      const zoom = gsap.quickTo(inner, "scale", { duration: 1.1, ease: "power2.out" });
      const spin = gsap.quickTo(inner, "rotate", { duration: 1.4, ease: "power2.out" });

      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

        // Drift up and push in as the page advances — reads as moving
        // forward through the field.
        moveY(-p * 14);
        zoom(1 + p * 0.32);
        spin(p * 5);

        // Discrete colour stages, not a per-frame tween.
        const stop = Math.min(STOPS.length - 1, Math.floor(p * STOPS.length));
        if (stop !== stopRef.current) {
          stopRef.current = stop;
          effectRef.current?.setOptions({
            color: cssHex(STOPS[stop], 0x0095f6),
          });
        }
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanupScroll = () => window.removeEventListener("scroll", onScroll);
    })();

    return () => {
      cancelled = true;
      cleanupScroll?.();
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  // Repaint background/accent when the theme flips, without tearing
  // down and rebuilding the WebGL context.
  useEffect(() => {
    const obs = new MutationObserver(() => {
      const stop = stopRef.current < 0 ? 0 : stopRef.current;
      effectRef.current?.setOptions({
        color: cssHex(STOPS[stop], 0x0095f6),
        backgroundColor: cssHex("--paper", 0x050505),
      });
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, []);

  // Each route is a different length, so the scroll mapping has to reset.
  useEffect(() => {
    stopRef.current = -1;
  }, [pathname]);

  return (
    <div className="vanta-stage" aria-hidden="true">
      <div className="vanta-inner" ref={innerRef}>
        <div className="vanta-bg" ref={hostRef} />
      </div>
    </div>
  );
}
