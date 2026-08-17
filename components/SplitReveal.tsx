"use client";

import type { ElementType } from "react";
import DecryptedText from "./DecryptedText";

/* Heading text decrypts (scrambled glyphs resolving to real characters)
   the first time it scrolls into view, instead of the old GSAP word
   slide-up — this is the shared component behind nearly every heading
   on the site (SectionHead titles, page h1s). */
export default function SplitReveal({
  text,
  as: Tag = "span",
  className,
  stagger = 0.03,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
}) {
  return (
    <Tag className={className}>
      <DecryptedText
        text={text}
        animateOn="view"
        sequential
        useOriginalCharsOnly
        revealDirection="start"
        speed={Math.max(18, Math.round(stagger * 900))}
        encryptedClassName="text-encrypted"
      />
    </Tag>
  );
}
