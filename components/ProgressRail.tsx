"use client";

import { useEffect, useRef } from "react";

export default function ProgressRail() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current!;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? scrollTop / max : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 70,
        background: "var(--line)",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          width: "100%",
          background: "var(--accent)",
          transformOrigin: "left",
          transform: "scaleX(0)",
        }}
      />
    </div>
  );
}
