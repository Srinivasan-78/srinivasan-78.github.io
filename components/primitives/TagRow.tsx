/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌‌​​​​​‌‌​‌​‌​​‌​‌‌​‌​​‌‌​‌‌‌​‌​​‌​​​​​‌‌​​​‌​‌‌‌​‌‌‌​‌‌​​​‌‌​‌‌​​‌​‌​‌‌​‌​​​​‌​‌‌​​​​‌‌‌​‌‌‌​‌​‌‌​‌​​‌​​‌‌‌‌​‌​‌‌‌‌‌​​‌‌​​​‌​‌‌​​‌​​​‌‌​‌​​​​​‌‌​​​‌​‌​​​‌​​​‌‌​‌​​‌​‌​‌‌​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.85-7H1wcehXwZO_1dh1DiX
 */
/* Stack and tag lists, as annotation rather than as pills.

   The previous design drew every one of these as a rounded chip with a
   fill, which meant a project with a ten-item stack rendered as ten
   competing buttons — and none of them were buttons. Here they are what
   they actually are: a list of names, set in the annotation register,
   separated by a drawn divider. Nothing is clickable, so nothing looks
   clickable.

   `scroll-x` on the wrapper keeps a long stack inside its own box: the
   page body must never scroll sideways, and repo2graph's stack is ten
   entries long on a 360px screen. */

type TagRowProps = {
  items: string[];
  /** Mono caption before the row. */
  label?: string;
  /** Wrap onto multiple lines instead of scrolling. Use inside a panel
      with room; use the scrolling default in a dense grid cell. */
  wrap?: boolean;
  className?: string;
};

export default function TagRow({
  items,
  label,
  wrap = false,
  className = "",
}: TagRowProps) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {label && <div className="t-anno-sm mb-2 text-mute">{label}</div>}

      <ul
        className={
          wrap
            ? "flex flex-wrap items-center gap-x-3 gap-y-1.5"
            : "scroll-x flex items-center gap-x-3 pb-1"
        }
      >
        {items.map((item, i) => (
          <li
            key={item}
            className="t-anno-sm flex shrink-0 items-center gap-3 text-mute"
          >
            {/* The divider belongs to the item that follows it, so the
                row never ends on a dangling separator. */}
            {i > 0 && (
              <span aria-hidden="true" className="h-2.5 w-px bg-rule" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
