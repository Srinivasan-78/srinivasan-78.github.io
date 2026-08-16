"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SplitReveal({
  text,
  as: Tag = "span",
  className,
  stagger = 0.03,
}: {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const words = el.querySelectorAll(".split-word > span");
    if (reduced) return; // CSS fallback already shows them fully opaque

    gsap.set(words, { yPercent: 110, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger,
        });
      },
    });

    return () => trigger.kill();
  }, [stagger]);

  const words = text.split(" ");

  return (
    // @ts-expect-error dynamic tag ref typing
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span className="split-word" key={i}>
          <span>{w}</span>
          {/* null, NOT "". React's server renderer omits an empty string
              entirely, but the client reconciler still reserves a text
              node for it — the two trees disagree and hydration fails
              with "text content does not match" (#425), after which
              React discards the whole server render and repaints from
              scratch. null is skipped identically on both sides. */}
          {i < words.length - 1 ? "\u00A0" : null}
        </span>
      ))}
    </Tag>
  );
}