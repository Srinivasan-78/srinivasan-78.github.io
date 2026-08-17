"use client";

import { useEffect, useRef, useState } from "react";

/* Small animated UI primitives, written for this project.
   These are originals in the same spirit as react-bits — that library is
   copy-into-your-repo rather than an npm dependency, so run
   `npx jsrepo add` to pull its real components when you want them, and
   these can be swapped out or kept alongside. */

/** Counts up to `value` once it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  duration = 1400,
  className,
  style,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }

    // Tracked so teardown can stop it. Disconnecting the observer alone
    // leaves an in-flight rAF loop running against an unmounted node.
    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || done.current) return;
          done.current = true;
          io.unobserve(e.target);

          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            // easeOutExpo — fast start, long settle
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            setN(Math.round(eased * value));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {n}
      {suffix}
    </span>
  );
}

/** Cycles a word through a list, one at a time, in place. */
export function RotatingWord({
  words,
  interval = 2200,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The nested swap timeout needs its own handle: clearing only the
    // interval still leaves a pending swap that fires up to 260ms after
    // the component is gone.
    let swap: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setOut(true);
      swap = setTimeout(() => {
        setI((v) => (v + 1) % words.length);
        setOut(false);
      }, 260);
    }, interval);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, [words.length, interval]);

  return (
    <span className={"rot-word " + (className ?? "")}>
      <span className={"rot-word-inner" + (out ? " out" : "")}>{words[i]}</span>
    </span>
  );
}

/** Tilts toward the pointer, with a soft spring back on leave. */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = "transform 0.08s linear";
    el.style.transform = `perspective(700px) rotateY(${px * max * 2}deg) rotateX(${
      -py * max * 2
    }deg) translateZ(0)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1)";
    el.style.transform = "perspective(700px) rotateY(0) rotateX(0)";
  };

  return (
    <div ref={ref} className={className} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}
