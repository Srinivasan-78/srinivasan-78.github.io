/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​​‌​​‌‌​‌​​​‌‌‌​‌‌‌​‌‌‌​‌‌‌​‌​‌​​‌‌​‌​​‌‌​​​‌‌​‌‌​​​‌‌​‌​​​​​‌‌​​‌‌​​‌‌‌​​‌​​‌‌​‌​‌​‌​​​‌‌​​‌​‌‌​​​​​‌‌​​‌​​‌​​‌‌‌​​​‌‌​‌‌‌​‌​​​​​‌​‌​​​​​‌​‌​​‌​​​​​‌‌‌​​‌​‌​‌‌‌‌‌​‌​‌‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.A4wwSLlh395FX2N7AAH9__
 */
import SplitReveal from "./SplitReveal";

/* Section opener: one quiet label, one headline.

   It used to pin to the top of the viewport with a rule under it and a
   chapter number beside it ("02 / 05"). Three separate signals for one
   piece of information, one of which followed you down the page. The
   numbering also implied the sections were a sequence to be read in
   order, which they are not.

   Whitespace does the separating now — see the section padding in
   globals.css — so this no longer draws a border either. */
export default function SectionHead({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <div className="sec-head">
      <span className="eyebrow">{label}</span>
      <SplitReveal as="h2" text={title} className="display display-lg" />
    </div>
  );
}
