import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { PROJECTS, projectBySlug } from "@/lib/projects";
import { PROJECT_DETAIL_COPY } from "@/lib/data/profile";
import TagRow from "@/components/primitives/TagRow";
import Reveal from "@/components/primitives/Reveal";

/* The dossier.

   This is the page the whole design is built to serve. The writing here
   is genuinely good — six to eleven architecture notes per project, each
   one explaining a decision and the failure it was guarding against —
   and the previous design's chief sin was burying it under card chrome.
   So there is almost no chrome: a rule, a number, and the prose at a
   measure you can actually read.

   The architecture list is set as a measured drawing's callout
   schedule: numbered down the left, the label in the annotation
   register, the body in prose. That is a real convention for annotating
   a mechanism, which is exactly what each of these entries is.

   Nothing here is a client component. */

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title,
    description: p.teaser,
    path: `/projects/${p.slug}`,
  });
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  /* The demo is promoted to the front of the action row when it is not
     already one of the links. Several projects list the same URL twice
     — once as `demo` and once as a labelled link — and showing it twice
     would read as two different destinations. */
  const actions =
    p.demo && !p.links.some((l) => l.url === p.demo)
      ? [{ url: p.demo, label: PROJECT_DETAIL_COPY.demoActionLabel }, ...p.links]
      : p.links;

  /* The author's own admission, lifted out of the highlights list.
     Burying "Honest about the limit: an origin check stops casual abuse"
     as bullet six is the opposite of what writing it was for. */
  const honest = p.highlights.find((h) => /^Honest about/i.test(h));
  const highlights = p.highlights.filter((h) => h !== honest);

  const position = PROJECTS.findIndex((x) => x.slug === p.slug);
  const prev = position > 0 ? PROJECTS[position - 1] : undefined;
  const next =
    position < PROJECTS.length - 1 ? PROJECTS[position + 1] : undefined;

  return (
    <main id="content" tabIndex={-1}>
      <article className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-10">
        <Link
          href="/projects"
          className="t-anno-sm text-mute transition-colors duration-150 hover:text-detect"
        >
          ← {PROJECT_DETAIL_COPY.back}
        </Link>

        {/* Cover.
            One shout, then prose: the display register is spent on the
            title alone and the standfirst goes up a size in the same
            face.

            The three sibling texture layers that used to sit behind
            this — a chiaroscuro vignette, a searchlight gradient and a
            WebGL scan field — are replaced by the ambient wash the rest
            of the site uses. It is three gradients painted once, so
            there is no shader to compile and nothing to reduce. */}
        <header className="relative mt-10 border-b border-rule pb-12">
          <div
            aria-hidden="true"
            className="head-wash pointer-events-none absolute -inset-x-8 -top-28 -z-10 h-[40rem]"
          />

          <div className="relative">
            <div className="t-anno mb-4 text-signal">
              {p.client} · {p.category}
            </div>

            <Reveal as="h1" effect="wipe" className="t-display-xl t-h1 max-w-[22ch]">
              {p.title}
            </Reveal>

            <p className="t-lead mt-6 max-w-3xl text-mute">{p.teaser}</p>

            {/* The title block's three figures. The label is the term;
                the cell is the figure. Three cards on a grid rather than
                three cells sharing hairlines — the gap IS the divider
                now, which is what lets them read as objects. */}
            <dl className="mt-9 grid gap-3 sm:grid-cols-3">
              <div className="panel p-5">
                <dt className="t-anno-sm mb-1.5 text-mute">
                  {PROJECT_DETAIL_COPY.statusPrefix}
                </dt>
                <dd className="t-poster text-[1.375rem] text-body">{p.status}</dd>
              </div>
              <div className="panel p-5">
                <dt className="t-anno-sm mb-1.5 text-mute">Stack</dt>
                <dd className="t-poster text-[1.375rem] text-body">
                  {p.stack.length}
                </dd>
              </div>
              <div className="panel p-5">
                <dt className="t-anno-sm mb-1.5 text-mute">Architecture notes</dt>
                <dd className="t-poster text-[1.375rem] text-body">
                  {p.architecture.length}
                </dd>
              </div>
            </dl>

            {actions.length > 0 ? (
              <div className="mt-9 flex flex-wrap gap-3">
                {actions.map((link, i) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    /* Exactly one filled control per page. The live build
                       is the thing a visitor most wants, so it gets it. */
                    className={i === 0 ? "btn btn-signal" : "btn"}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              /* No links is a deliberate state, not a gap: the repository
                 is private or internal. The data file's rule is that a
                 button going nowhere is worse than no button, so this
                 says why and offers the one route that does work. */
              <div className="glass glass-card glass-spec mt-9 p-6">
                <p className="t-anno-sm text-mute">
                  {PROJECT_DETAIL_COPY.noLinksNote}
                </p>
                <Link href="/contact" className="btn mt-4">
                  {PROJECT_DETAIL_COPY.noLinksCta}
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Overview */}
        <section className="py-12">
          <h2 className="t-anno mb-5 text-signal">
            {PROJECT_DETAIL_COPY.overviewEyebrow}
          </h2>
          <p className="t-prose text-[1.0625rem] leading-relaxed">{p.overview}</p>
        </section>

        {/* The callout schedule. */}
        <section className="border-t border-rule py-12">
          <header className="mb-10">
            <h2 className="t-anno mb-3 text-signal">
              {PROJECT_DETAIL_COPY.breakdownEyebrow}
            </h2>
            <Reveal as="p" effect="wipe" className="t-display-xl t-h2">
              {PROJECT_DETAIL_COPY.breakdownHeading}
            </Reveal>
            <p className="t-prose mt-3 text-mute">
              {PROJECT_DETAIL_COPY.breakdownBody}
            </p>
          </header>

          {/* The schedule. An SVG leader line used to ink itself down
              the gutter; it was the measured-drawing identity and it is
              gone. The number still sits in its own column so the prose
              keeps one left edge all the way down — that part was never
              decoration, it is what makes eleven entries readable. */}
          <ol className="divide-y divide-rule border-y border-rule">
            {p.architecture.map((entry, i) => (
              <li
                key={entry.label}
                className="grid gap-x-6 gap-y-2 py-6 sm:grid-cols-[4rem_1fr]"
              >
                <div className="t-anno-sm pt-1 text-mute">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0">
                  <h3 className="t-anno mb-2 text-body">{entry.label}</h3>
                  <p className="max-w-[62ch] leading-relaxed text-mute">
                    {entry.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Highlights, with the admission given its own weight. */}
        <section className="border-t border-rule py-12">
          <h2 className="t-anno mb-3 text-signal">
            {PROJECT_DETAIL_COPY.highlightsEyebrow}
          </h2>
          <Reveal as="p" effect="wipe" className="t-display-xl t-h2 mb-8">
            {PROJECT_DETAIL_COPY.highlightsHeading}
          </Reveal>

          <ul className="divide-y divide-rule border-y border-rule">
            {highlights.map((h) => (
              <li key={h} className="flex gap-4 py-4">
                {/* A decorative dash, so it is coloured as furniture.
                    In the accent family it repeated up to eleven times
                    down a single list, which is the accent budget spent
                    entirely on punctuation. */}
                <span aria-hidden="true" className="t-anno-sm mt-1 text-mute">
                  —
                </span>
                <span className="max-w-[64ch] leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>

          {honest && (
            /* The contingency, at full size rather than as a footnote.
               The whole design is named after this sentence existing. */
            <p className="contingency mt-8 border-t-0 pt-0 text-[0.8125rem]">
              <span>Honest about</span>
              <span className="max-w-[64ch]">
                {honest.replace(/^Honest about\s*/i, "")}
              </span>
            </p>
          )}
        </section>

        {/* Stack */}
        <section className="border-t border-rule py-12">
          <h2 className="t-anno mb-5 text-signal">
            {PROJECT_DETAIL_COPY.stackEyebrow}
          </h2>
          <TagRow items={p.stack} wrap />
        </section>

        {/* Prev / next, so the set reads as a set. Two cards on a gap
            rather than two cells sharing a hairline grid, so a missing
            neighbour is simply absent instead of being an empty cell
            holding its half of the frame open. */}
        <nav aria-label="Other projects" className="grid gap-3 sm:grid-cols-2">
          {prev && (
            <Link
              href={`/projects/${prev.slug}`}
              className="group panel p-6 transition-colors duration-150"
            >
              <span className="t-anno-sm block text-mute">
                ← {PROJECT_DETAIL_COPY.prevLabel}
              </span>
              <span className="t-display mt-2 block text-lg transition-colors duration-150 group-hover:text-detect">
                {prev.title}
              </span>
            </Link>
          )}

          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group panel p-6 transition-colors duration-150 sm:col-start-2 sm:text-right"
            >
              <span className="t-anno-sm block text-mute">
                {PROJECT_DETAIL_COPY.nextLabel} →
              </span>
              <span className="t-display mt-2 block text-lg transition-colors duration-150 group-hover:text-detect">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </article>
    </main>
  );
}
