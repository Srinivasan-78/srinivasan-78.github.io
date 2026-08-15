"use client";

import { useEffect, useRef, useState } from "react";

/* Vanta ships as UMD bundles that reach for `window` and a global THREE
   at import time, so both the effect and three are imported dynamically
   inside an effect — never at module scope, or the static export build
   breaks trying to evaluate them on the server. */

type VantaEffect = { destroy: () => void; setOptions: (o: Record<string, unknown>) => void };

function readAccent() {
  const css = getComputedStyle(document.documentElement);
  const hex = (name: string, fallback: number) => {
    const v = css.getPropertyValue(name).trim();
    const n = parseInt(v.replace("#", ""), 16);
    return Number.isNaN(n) ? fallback : n;
  };
  return {
    color: hex("--sage", 0x0095f6),
    backgroundColor: hex("--paper", 0x000000),
  };
}

export default function VantaBackground() {
  const hostRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Respect reduced motion and skip the whole WebGL cost on touch
    // devices, where it's mostly battery drain for a background.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

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
        points: 9,
        maxDistance: 22,
        spacing: 18,
        showDots: true,
        ...readAccent(),
      }) as VantaEffect;

      setReady(true);
    })();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  // Recolor in place when the theme flips, rather than tearing down and
  // rebuilding the whole WebGL context.
  useEffect(() => {
    if (!ready) return;
    const obs = new MutationObserver(() => {
      effectRef.current?.setOptions(readAccent());
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => obs.disconnect();
  }, [ready]);

  return <div className="vanta-bg" ref={hostRef} aria-hidden="true" />;
}
