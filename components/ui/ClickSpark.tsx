/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌​‌‌​‌​‌‌​‌‌​‌​‌​‌​‌​‌​‌​​‌‌​‌​‌​​‌​‌​​‌​‌​​‌​​‌‌​‌‌‌‌​‌‌​‌‌​​​‌‌‌​​​‌​‌​‌​‌‌​​‌​​​‌​​​‌​‌​​​​​‌​​‌​‌‌​‌‌​‌‌​​​​‌‌​​‌​​‌‌​‌​​​​‌‌‌‌​​​​‌​‌​​‌​​‌​‌​‌​​​‌‌‌‌​‌​​‌​​‌‌​‌​‌​​​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.-mUMJRolqVDPKl2hxRTzMA
 */
"use client";

/* React Bits <ClickSpark />, ported to TypeScript and re-hosted on a
   viewport-fixed canvas.

   The spark itself is upstream's: same polar layout, same easing table,
   same `distance`/`lineLength` maths, same props and defaults. Three
   things had to change to make it a whole-app effect rather than a demo
   box:

   1. Canvas geometry. Upstream sizes the canvas to its parent element.
      Wrapping the whole document in that means a canvas as tall as the
      page — on a long route at 1440px wide that is tens of megabytes of
      backing store, reallocated on every resize. This canvas is
      `position: fixed` at viewport size instead, and the click point is
      read straight from clientX/clientY, which are already viewport
      coordinates. Same picture, bounded memory.

   2. The wrapper is `display: contents`, so putting it around the app
      adds no box and cannot disturb layout. Clicks still bubble through
      it, so exactly one handler sees each click — no nesting, no double
      fire.

   3. The frame loop is demand-driven. Upstream schedules a
      requestAnimationFrame forever, drawing nothing between clicks.
      Here the loop starts on the first spark and stops when the last one
      expires, so an idle page costs nothing.

   Reduced motion disables the effect outright.

   `sparkColor` also accepts the name of a CSS custom property. A canvas
   cannot resolve `var()` itself — strokeStyle takes a colour, not a
   cascade — so the property is read off the document element and
   read once at mount. It is a token rather than a literal so the spark
   and the page cannot drift apart: ink on white paper, where the white
   spark the component ships with would be invisible. */

import { useRef, useEffect, useCallback, type ReactNode } from "react";

type Spark = { x: number; y: number; angle: number; startTime: number };

export type ClickSparkProps = {
  /** A colour, or the name of a CSS custom property ("--spark"). */
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: "linear" | "ease-in" | "ease-in-out" | "ease-out";
  extraScale?: number;
  children?: ReactNode;
};

export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1.0,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef<number | null>(null);
  const reducedRef = useRef(false);
  // The colour actually handed to the 2D context. Held in a ref so the
  // frame loop never reads the cascade, which would be a forced style
  // recalc per spark per frame.
  const colorRef = useRef(sparkColor);

  useEffect(() => {
    const isVar = sparkColor.startsWith("--");
    if (!isVar) {
      colorRef.current = sparkColor;
      return;
    }

    const root = document.documentElement;
    const value = getComputedStyle(root).getPropertyValue(sparkColor).trim();
    // An unset property resolves to "", which would paint nothing.
    colorRef.current = value || "#fff";

    /* Read once. This used to re-read behind a MutationObserver on
       <html>'s data-theme, because a theme toggle could change what the
       property resolved to at any moment. The site has one palette now,
       so the value is fixed for the life of the page. */
  }, [sparkColor]);

  // Keep the canvas backing store matched to the viewport and the device
  // pixel ratio, so lines are crisp on a retina display and the context
  // can be addressed in CSS pixels.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        // The CSS box is set from the same numbers rather than from
        // 100vw/100vh: on a platform with classic scrollbars those units
        // are wider than the fixed-position containing block, and the
        // click point would land a scrollbar's width off.
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        const ctx = canvas.getContext("2d");
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    resizeCanvas();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case "linear":
          return t;
        case "ease-in":
          return t * t;
        case "ease-in-out":
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  // Everything the frame loop reads lives in a ref, so changing a prop
  // never tears down a loop mid-flight and never leaves one orphaned.
  const drawRef = useRef<(timestamp: number) => void>(() => {});

  drawRef.current = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime;
      if (elapsed >= duration) return false;

      const progress = elapsed / duration;
      const eased = easeFunc(progress);

      const distance = eased * sparkRadius * extraScale;
      const lineLength = sparkSize * (1 - eased);

      const x1 = spark.x + distance * Math.cos(spark.angle);
      const y1 = spark.y + distance * Math.sin(spark.angle);
      const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
      const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

      ctx.strokeStyle = colorRef.current;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      return true;
    });

    if (sparksRef.current.length > 0) {
      rafRef.current = requestAnimationFrame((t) => drawRef.current(t));
    } else {
      rafRef.current = null;
    }
  };

  // One teardown for the whole component: whatever frame is in flight
  // when it unmounts is cancelled.
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      sparksRef.current = [];
    },
    []
  );

  const handleClick = (e: React.MouseEvent) => {
    if (reducedRef.current) return;
    const now = performance.now();
    const x = e.clientX;
    const y = e.clientY;

    sparksRef.current.push(
      ...Array.from({ length: sparkCount }, (_, i) => ({
        x,
        y,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
      }))
    );

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame((t) => drawRef.current(t));
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="click-spark-canvas" aria-hidden="true" />
      {/* display: contents — no box, no stacking context, no layout
          effect. It exists only to catch the bubbled click. */}
      <div style={{ display: "contents" }} onClick={handleClick}>
        {children}
      </div>
    </>
  );
}
