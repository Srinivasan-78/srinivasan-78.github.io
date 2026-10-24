/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌​​‌​‌​​‌​​‌‌​​‌​‌​‌​‌​‌​​​‌‌​​​‌‌​‌‌‌‌​​​​‌​​​​‌‌​‌‌‌​​‌​​‌‌​​​‌​​‌​​‌‌‌​​‌‌‌‌​​​​‌​‌​​​‌​‌​​‌‌‌‌​‌‌‌‌​​‌​​‌‌​‌​‌​‌​‌​‌​​​‌‌​​‌​​​​‌‌​‌​‌​‌‌​‌​​‌​‌​​​​​‌​‌‌‌‌​‌​​‌‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.BReTcxCrbNxQOy5Td5iAzp
 */
import type { ReactElement } from "react";
import type { LegalLink, LegalSection } from "@/lib/data/profile";

/* The privacy policy and the terms are the same document twice: a lead,
   then a numbered run of sections, each with prose, sometimes bullets
   and sometimes links. Both pages render through here so the two cannot
   drift apart, which on a legal page is the failure mode that matters.

   Layout is a 4/8 sheet rather than a single centred column: the index
   and the heading sit out to the left and the prose keeps its own
   measure on the right. Long-form text in a 68ch column with the
   headings beside it is the difference between a document and a wall.

   The inline links are the interesting part. The data holds them as
   records — a label and an href — rather than as markup inside the
   paragraph string, because the author's sentence should survive
   whatever element ends up wrapping part of it. So the label is found in
   the paragraph and swapped for a real anchor at render. A label that
   does not appear in the prose simply does not render, which is the
   right failure: the sentence is still complete and still true, it just
   is not clickable. Nothing is ever dropped from the text. */

/* A paragraph after splicing: runs of the author's text with anchors
   between them. Narrower than ReactNode on purpose — the only two
   things this ever produces are strings and <a> elements. */
type Piece = string | ReactElement;

function anchor(link: LegalLink) {
  return (
    <a
      key={link.href}
      href={link.href}
      className="link"
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

/* One pass per link, splitting on the first occurrence of its label.
   First occurrence only: a term that appears three times does not want
   three identical links in one paragraph. */
function withLinks(text: string, links: LegalLink[]): Piece[] {
  let parts: Piece[] = [text];

  for (const link of links) {
    parts = parts.flatMap((part): Piece[] => {
      if (typeof part !== "string") return [part];
      const at = part.indexOf(link.label);
      if (at === -1) return [part];
      return [
        part.slice(0, at),
        anchor(link),
        part.slice(at + link.label.length),
      ].filter((piece) => piece !== "");
    });
  }

  return parts;
}

type LegalSectionsProps = {
  sections: LegalSection[];
};

export default function LegalSections({ sections }: LegalSectionsProps) {
  const total = String(sections.length).padStart(2, "0");

  return (
    <div className="divide-y divide-rule border-t border-rule">
      {sections.map((section, i) => {
        const links = section.links ?? [];

        return (
          <section
            key={section.heading}
            className="grid gap-5 py-10 lg:grid-cols-12 lg:gap-8"
          >
            <div className="lg:col-span-4">
              <div className="t-anno-sm text-mute">
                {String(i + 1).padStart(2, "0")} / {total}
              </div>
              <h2 className="t-display mt-2 text-[1.375rem] sm:text-[1.5rem]">
                {section.heading}
              </h2>
            </div>

            <div className="t-prose lg:col-span-8">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[0.9375rem] leading-relaxed">
                  {withLinks(paragraph, links)}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-5 space-y-2.5 border-t border-rule pt-5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.text}
                      className="flex gap-3 text-[0.9375rem] leading-relaxed text-mute"
                    >
                      {/* A drawn dash rather than a list-style bullet,
                          to match the rules the rest of the site is
                          built from. */}
                      <span
                        aria-hidden="true"
                        className="mt-3 h-px w-3 shrink-0 bg-rule-strong"
                      />
                      <span>
                        {bullet.label && (
                          <span className="text-body">{bullet.label} </span>
                        )}
                        {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
