/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌‌​​‌​​‌‌​‌‌‌​‌​‌​​‌​​‌‌​‌‌​‌​‌​‌‌​‌​​​‌‌‌​​‌​‌​​​​‌​​‌‌‌​‌‌​​‌​​‌‌​​​‌​‌​​‌​​‌​​​​‌​​‌​‌​​‌​​‌​​​‌​‌​‌‌‌‌​‌​​​‌​‌‌​‌​‌​​‌‌‌​​​‌‌​‌‌​​‌​​​​‌‌​‌​​‌‌‌‌​‌‌​‌​​​​‌​​​‌‌​​‌​​‌‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Y7RmZ9BvLRBREz-N6COhFN
 */
/* The spec block — the games register, handled properly.

   What a well-designed game actually does is tell you the rules, the
   numbers and the costs without prose: a character sheet, a loadout,
   an item tooltip. None of that is arcade decoration, it is systems
   legibility, and it is the right form for a skills section because
   skills genuinely are label-and-value pairs.

   So: a ruled stat block with a dotted leader between label and value,
   the way a sheet does it. Not a progress bar — a bar claims a
   percentage nobody measured, and an invented number is worse here
   than no number. Every value in this block is a real string from the
   data: a tenure, a count, a provider name. */

export type Spec = {
  label: string;
  value: string;
  /* An optional second line under the value, for the one-sentence
     "why this matters" that several skills in the data carry. */
  note?: string;
  /* Marks the row as the headline figure of the block. At most one per
     block — the accent budget is two per viewport. */
  emphasis?: boolean;
};

type SpecBlockProps = {
  rows: Spec[];
  /** Mono caption above the block. */
  caption?: string;
  className?: string;
};

export default function SpecBlock({ rows, caption, className = "" }: SpecBlockProps) {
  return (
    <div className={className}>
      {caption && <div className="t-anno-sm mb-3 text-mute">{caption}</div>}

      <dl className="divide-y divide-rule">
        {rows.map((row) => (
          <div key={row.label} className="py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-baseline gap-2">
              <dt className="t-anno-sm shrink-0 text-mute">{row.label}</dt>

              {/* The leader. A border-bottom on a flexible spacer rather
                  than a string of periods, so it cannot wrap onto its
                  own line at a narrow width. */}
              <span
                aria-hidden="true"
                className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted border-rule"
              />

              <dd
                className={`t-metric shrink-0 text-right text-[0.8125rem] ${
                  row.emphasis ? "text-signal" : "text-body"
                }`}
              >
                {row.value}
              </dd>
            </div>

            {row.note && (
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-mute">
                {row.note}
              </p>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}
