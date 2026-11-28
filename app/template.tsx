/* The route transition.
 *
 * `template.tsx` rather than a wrapper in `layout.tsx` because a
 * template is remounted on every navigation while a layout is not —
 * which is the whole mechanism here. The element is new on each route,
 * so a plain CSS entry animation runs again without any state, any
 * route key, or any exit coordination.
 *
 * It is CSS and not a library, and the reason is specific rather than
 * stylistic: an animation library renders its `initial` styles into
 * the server output, so a page transition starting at `opacity: 0`
 * ships `opacity: 0` in the static HTML — and a visitor with scripting
 * off, or a crawler that does not run it, gets a blank page instead of
 * a document. This site is a static export whose entire reveal system
 * is gated behind `html.js` precisely so that failure mode cannot
 * happen; see the note in components/primitives/Reveal.tsx.
 *
 * The animation itself is deliberately smaller than the per-section
 * entrances beneath it: a 6px rise and a fade. Enough to read as one
 * sheet replacing another, over before the section reveals begin.
 *
 * The bat swarm that used to cross the viewport on every navigation is
 * gone with the rest of that identity — `BatTransit` and
 * `lib/batGround` are both unmounted now, not deleted. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
