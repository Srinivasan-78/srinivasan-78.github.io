/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌‌‌​‌‌​​​​‌​‌​‌​​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌‌‌​​‌​‌‌‌​​​​​‌​​​​​‌​‌​​​​​‌​‌‌‌​​‌‌​​‌‌‌​​‌​‌​​‌​‌‌​‌‌‌​‌‌​​‌‌​​‌​​​‌‌​‌​​‌​‌‌​‌‌‌‌​‌​​‌​‌​​‌‌​‌‌​‌​‌​‌​​​‌​‌‌​‌​​​​‌‌​‌​‌​​‌​​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.GaQRcypAAs9KvdioJmQhjM
 */
import BatTransit from "@/components/primitives/BatTransit";
import { flockMarks } from "@/lib/batGround";

/* The route transition.
 *
 * `template.tsx` rather than a wrapper in `layout.tsx` because a
 * template is remounted on every navigation while a layout is not —
 * which is the whole mechanism here. The element is new on each route,
 * so a plain CSS entry animation runs again without any state, any
 * route key, or any exit coordination.
 *
 * WHY THIS IS CSS AND THE NAV MARKER IS NOT.
 *
 * `motion` is installed and used in components/Nav.tsx, so the obvious
 * move was to animate the route change with it too. That would have
 * been a real regression, and the reason is specific rather than
 * stylistic: motion renders its `initial` styles into the server
 * output. A page transition starting at `opacity: 0` therefore ships
 * `opacity: 0` in the static HTML, and a visitor with scripting off or
 * broken — or a crawler that does not run it — gets a blank page
 * instead of a document. This site is a static export whose entire
 * reveal system is gated behind `html.js` precisely so that failure
 * mode cannot happen; see the note in components/primitives/Reveal.tsx.
 *
 * So the rule that falls out of it: motion earns its place where it
 * animates something that is already on screen (the nav marker moving
 * between two destinations). Anything that animates content IN stays in
 * CSS behind `html.js`, where the no-script path is visible content
 * rather than an empty frame.
 *
 * The animation itself is deliberately smaller than the per-section
 * entrances beneath it. Every page head already has its own arrival —
 * the x-ray heading, the detective grid, the panel sweeps — and a
 * route transition loud enough to notice would land on top of all of
 * them at once. This is a 6px rise and a fade over 420ms: enough to
 * read as one sheet being replaced by another, short enough to be over
 * before the section reveals begin. */
/* REVISION 5 — the swarm joins it.
 *
 * `BatTransit` is the requested bat transition, and it is a SIBLING of
 * the page rather than a wrapper around it. That is the whole reason
 * the two can coexist: the swarm is a fixed overlay that cannot touch
 * the document, while the rise below still belongs to the page. If the
 * bats wrapped the content, every argument in the paragraphs above
 * about never shipping hidden content would apply to them too.
 *
 * The rise is kept short and is deliberately NOT lengthened to match
 * the swarm. They are doing different jobs: the bats are the event,
 * the rise is the page settling underneath them, and a page that waits
 * for the animation to finish before becoming readable is a page that
 * has been made slower for decoration. The content is legible from the
 * first frame; the swarm is something passing over it. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* The flock is read off disk here rather than inside the
          component, because this file is a server component and that
          one is a client component — a client component cannot touch
          the filesystem. The paths are baked into the HTML at build
          time, which is also what stops the swarm requesting an image
          that does not exist. */}
      <BatTransit bats={flockMarks()} />
      <div className="route-enter">{children}</div>
    </>
  );
}
