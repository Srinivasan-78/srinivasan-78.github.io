"use client";

import { useEffect } from "react";
import { useInView } from "@/lib/useInView";

/* Wraps a group and brings its children in together when the group
   scrolls into view.

   The motion itself is one CSS transition defined once in globals.css
   (.reveal-group / .is-in) — this component only decides when the class
   flips and how far apart the children are spaced. */
export default function Reveal({
  children,
  className,
  style,
  /** Seconds between each child arriving. */
  stagger = 0.06,
  /** Scale the children up as they arrive, rather than only sliding
      them. For cards and tiles — objects with a surface. Plain text
      blocks should not use it: type scaling up reads as a zoom, not as
      an arrival, and it resamples the glyphs on the way. */
  pop = false,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  stagger?: number;
  pop?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Delay is written per child rather than expressed in CSS, because
       the child count is whatever the caller passed and nth-child rules
       would have to guess at it. Capped so a long grid does not leave
       its last tile waiting seconds after the first. */
    Array.from(el.children).forEach((kid, i) => {
      (kid as HTMLElement).style.transitionDelay = `${Math.min(i * stagger, 0.45)}s`;
    });
  }, [ref, stagger, children]);

  return (
    <div
      ref={ref}
      className={[className, "reveal-group", pop && "reveal-pop", inView && "is-in"]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
