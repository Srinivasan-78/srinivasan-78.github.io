"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* The frame clips; the image inside is deliberately taller than the
   frame, and that overflow is what we translate. Without the extra
   height there is nothing to move and you get empty gaps at the edges. */
export default function Parallax({
  src,
  alt,
  height = "clamp(240px, 42vw, 460px)",
  strength = 14,
  className,
  children,
}: {
  src: string;
  alt: string;
  height?: string;
  /** How far the image drifts, in % of its own height. */
  strength?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      img,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: frame,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [strength]);

  return (
    <div
      className={"px-frame" + (className ? " " + className : "")}
      ref={frameRef}
      style={{ height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} className="px-img" loading="lazy" decoding="async" />
      {children && <div className="px-overlay">{children}</div>}
    </div>
  );
}
