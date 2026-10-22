/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​‌​​​‌​​​​​‌​‌‌‌​‌‌​​‌‌‌​​​​​‌​​​‌‌‌​​‌‌‌​​​​‌‌​‌​‌‌​‌‌​​​​‌​‌‌‌​​‌​​‌​​​‌​‌​‌​​​‌‌‌​‌​​​‌​‌​‌​​‌‌​​​‌‌‌​‌​​​‌​‌‌​​​​​‌‌​‌​​​‌​‌​‌‌‌​‌​​‌‌​‌​​‌‌​‌​‌​‌​‌​​​‌​‌​​‌​‌‌​‌​‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.tAvpG8karEGELtX4WM5QKQ
 */
"use client";

/* React Bits <BorderGlow />, ported to TypeScript.

   Upstream logic kept intact: the same HSL parse, the same seven mesh
   gradient stops and their colour map, the same edge-proximity and
   cursor-angle maths, and the same mount sweep timings. Pointer moves
   are written straight to CSS custom properties on the element — no
   state, so no React render per pointer event.

   Two additions.

   Teardown: upstream's intro sweep schedules setTimeout/rAF chains that
   keep running after unmount. They are tracked here and cancelled.

   And the pointer handler is coalesced to one frame. Upstream's reads
   `getBoundingClientRect()` three times per event — once in the handler
   and once more inside each of the two helpers, both of which re-derive
   the element's centre — and then writes two custom properties that a
   conic-gradient mask and three opacity expressions depend on. A gaming
   mouse reports at 1000Hz, so that is three forced layouts and a repaint
   of the glow apparatus up to a thousand times a second, which the
   display cannot show more than sixty of.

   Below, the event only records where the pointer is; one frame callback
   measures once and writes once. Same maths, same values, one layout and
   one paint per frame instead of per event.

   The rect is deliberately re-measured on each frame rather than cached
   on enter: `rect.left/top` move when the page scrolls under a hovered
   card, and a cached one would have the glow drift away from the cursor
   mid-scroll. One rect per frame is not a cost worth optimising away. */

import { useRef, useCallback, useEffect, type CSSProperties, type ReactNode } from "react";
import "./BorderGlow.css";

function parseHSL(hslStr: string) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors: string[]) {
  const vars: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars["--gradient-base"] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}
function easeInCubic(x: number) {
  return x * x * x;
}

type AnimateOptions = {
  start?: number;
  end?: number;
  duration?: number;
  delay?: number;
  ease?: (x: number) => number;
  onUpdate: (v: number) => void;
  onEnd?: () => void;
};

/** Returns a cancel function so the caller can stop a sweep on unmount. */
function animateValue({
  start = 0,
  end = 100,
  duration = 1000,
  delay = 0,
  ease = easeOutCubic,
  onUpdate,
  onEnd,
}: AnimateOptions) {
  let raf = 0;
  let cancelled = false;
  const t0 = performance.now() + delay;

  function tick() {
    if (cancelled) return;
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) raf = requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  }

  const timer = setTimeout(() => {
    if (!cancelled) raf = requestAnimationFrame(tick);
  }, delay);

  return () => {
    cancelled = true;
    clearTimeout(timer);
    if (raf) cancelAnimationFrame(raf);
  };
}

export type BorderGlowProps = {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  style?: CSSProperties;
};

const BorderGlow = ({
  children,
  className = "",
  edgeSensitivity = 30,
  glowColor = "40 80 80",
  backgroundColor = "#120F17",
  borderRadius = 28,
  glowRadius = 40,
  glowIntensity = 1.0,
  coneSpread = 25,
  animated = false,
  colors = ["#c084fc", "#f472b6", "#38bdf8"],
  fillOpacity = 0.5,
  style,
}: BorderGlowProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  /* Where the pointer was when the last event fired, in client
     coordinates. Read by the frame callback, never by the event. */
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);

  const paint = useCallback(() => {
    rafRef.current = 0;
    const card = cardRef.current;
    const pointer = pointerRef.current;
    if (!card || !pointer) return;

    const rect = card.getBoundingClientRect();
    /* The centre, in the element's own coordinates — which is also the
       offset of the pointer from that centre once the rect origin is
       taken off both. Upstream computes it from a second and third rect;
       it is the same rect. */
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = pointer.x - rect.left - cx;
    const dy = pointer.y - rect.top - cy;

    // Edge proximity: upstream's maths, unchanged.
    let kx = Infinity;
    let ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

    // Cursor angle: likewise.
    let angle = 0;
    if (dx !== 0 || dy !== 0) {
      angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
    }

    card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
    card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      /* A touch or pen contact is not a hovering cursor, and the
         stylesheet keeps the glow off for those pointer types anyway —
         so there is nothing for this to drive. */
      if (e.pointerType !== "mouse") return;
      pointerRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(paint);
    },
    [paint]
  );

  // An in-flight frame holds a reference to the node it is about to write to.
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  useEffect(() => {
    if (!animated || !cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const card = cardRef.current;
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);

    const cancels = [
      animateValue({
        duration: 500,
        onUpdate: (v) => card.style.setProperty("--edge-proximity", String(v)),
      }),
      animateValue({
        ease: easeInCubic,
        duration: 1500,
        end: 50,
        onUpdate: (v) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeOutCubic,
        delay: 1500,
        duration: 2250,
        start: 50,
        end: 100,
        onUpdate: (v) => {
          card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (v / 100) + angleStart}deg`);
        },
      }),
      animateValue({
        ease: easeInCubic,
        delay: 2500,
        duration: 1500,
        start: 100,
        end: 0,
        onUpdate: (v) => card.style.setProperty("--edge-proximity", String(v)),
        onEnd: () => card.classList.remove("sweep-active"),
      }),
    ];

    return () => {
      cancels.forEach((cancel) => cancel());
      card.classList.remove("sweep-active");
    };
  }, [animated]);

  const glowVars = buildGlowVars(glowColor, glowIntensity);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={`border-glow-card ${className}`.trim()}
      style={
        {
          "--card-bg": backgroundColor,
          "--edge-sensitivity": edgeSensitivity,
          "--border-radius": `${borderRadius}px`,
          "--glow-padding": `${glowRadius}px`,
          "--cone-spread": coneSpread,
          "--fill-opacity": fillOpacity,
          ...glowVars,
          ...buildGradientVars(colors),
          ...style,
        } as CSSProperties
      }
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
};

export default BorderGlow;
