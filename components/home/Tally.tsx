/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌​​‌‌‌​‌​​​‌​​‌‌​​​‌‌​‌‌​‌​‌‌‌‌​​‌​‌‌​‌‌‌‌​‌​​‌‌‌​​‌​‌​​‌​​‌​​‌‌​​​‌‌​​​‌​​‌​‌​​‌‌​​‌‌​​‌‌​‌‌​‌​​​​‌​​‌​‌​​‌‌‌‌​​‌​‌‌‌​​‌​​​‌‌​‌​​​‌​‌​‌‌​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌​‌​‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.NtLmyoNRLbS3hJyr4VP01S
 */
import CountUp from "@/components/primitives/CountUp";

/* A figure set as a scoreboard rather than as a metric.

   The poster register — Oswald, condensed and tall — next to the wide
   heavy Archivo of a headline is how poster and comic-cover lettering
   has always put a number beside a title: narrow-heavy against
   wide-heavy. A mono metric is the right register for a tenure or a
   provider name, and the wrong one for a count that is meant to be
   read across the room.

   `counted` is opt-in rather than automatic because a count-up is only
   honest on a tally. A figure that is a cap, a ratio or an identifier
   is not something that climbed to its value, and animating it as if
   it had implies a history the data does not claim. */
type TallyProps = {
  value: number;
  label: string;
  suffix?: string;
  /** Animate once on first view. See the note above. */
  counted?: boolean;
  className?: string;
};

export default function Tally({
  value,
  label,
  suffix,
  counted = false,
  className = "",
}: TallyProps) {
  return (
    <div className={`text-right ${className}`}>
      <div className="t-poster text-[2.25rem] text-body sm:text-[2.75rem]">
        {counted ? <CountUp value={value} /> : value}
        {suffix && <span className="text-[0.4em] text-mute">{suffix}</span>}
      </div>
      <div className="t-anno-sm mt-1.5 text-mute">{label}</div>
    </div>
  );
}
