import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/SplitReveal";
import Reveal from "@/components/Reveal";
import SystemDiagram from "@/components/SystemDiagram";
import { PROJECTS, projectBySlug } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title,
    description: p.teaser,
    path: `/projects/${p.slug}`,
  });
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) notFound();

  /* The running build leads, when there is one. Some projects already list
     their demo among `links`; matching on URL keeps that from becoming two
     buttons to the same place. */
  const actions =
    p.demo && !p.links.some((l) => l.url === p.demo)
      ? [{ url: p.demo, label: "Open live build ↗" }, ...p.links]
      : p.links;

  return (
    <main id="content" tabIndex={-1}>
      <div className="wrap pd-top">
        <Link href="/projects" className="eyebrow lnk">
          ← Back to projects
        </Link>

        <div className="pd-hero">
          <span className="eyebrow">
            {p.client} · {p.category}
          </span>
          <SplitReveal as="h1" text={p.title} className="display display-xl" />
          <p className="pd-teaser">{p.teaser}</p>

          <div className="micro-row">
            <span className="micro micro-bright">status: {p.status}</span>
            <span className="micro">{p.stack.length} technologies</span>
          </div>
        </div>
      </div>

      {/* The banner here used to be a stock photograph — a sky, a server
          corridor, a circuit board — with no relationship to the project
          it sat above. This draws the project's own stages instead, from
          the same `architecture` data the section below reads. */}
      <section className="section section-bleed">
        <div className="wrap">
          <SystemDiagram
            stages={p.architecture.map((a) => ({ label: a.label }))}
            caption={`How ${p.title} fits together.`}
          />
        </div>
      </section>

      <div className="wrap">
        <section className="section pd-section">
          {/* The section labels are the page's real subsections, so they are
              headings rather than styled spans — without them the document
              went straight from its <h1> to the <h3>s inside "How it
              works". `.eyebrow` sets its own size and zeroes the margin, so
              the element change is invisible. */}
          <h2 className="eyebrow">Overview</h2>
          <p className="pd-prose">{p.overview}</p>
        </section>

        <section className="section pd-section">
          <h2 className="eyebrow">How it works</h2>
          <div className="pd-arch">
            {p.architecture.map((a) => (
              <div key={a.label}>
                <h3>{a.label}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section pd-section">
          <h2 className="eyebrow">Highlights</h2>
          <ul className="pd-list">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>

        <section className="section pd-section">
          <h2 className="eyebrow">Stack</h2>
          <div className="pd-stack">
            {p.stack.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Some of these projects have no public repository, and a page
            with no way to act on it is a dead end. When there is nothing to
            link out to, the page says so and offers the one route that is
            always open. */}
        {actions.length > 0 ? (
          <Reveal className="hero-actions">
            {actions.map((l, i) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener"
                className={"btn" + (i === 0 ? " primary" : "")}
              >
                {l.label}
              </a>
            ))}
          </Reveal>
        ) : (
          <Reveal className="hero-actions">
            <Link href="/contact" className="btn primary">
              Ask me about this project
            </Link>
            <span className="micro">this one lives in a private repository</span>
          </Reveal>
        )}
      </div>

      <div className="wrap">
        <section className="section pd-section">
          <h2 className="eyebrow">Next</h2>
          <Reveal className="proj-list" pop>
            {PROJECTS.filter((o) => o.slug !== p.slug)
              .slice(0, 3)
              .map((o) => (
                <GlowCard key={o.slug}>
                  <Link href={`/projects/${o.slug}`} className="card">
                    <span className="eyebrow">{o.client}</span>
                    <h3 className="card-title">{o.title}</h3>
                    <p className="card-body">{o.teaser}</p>
                    <span className="go">Read more</span>
                  </Link>
                </GlowCard>
              ))}
          </Reveal>
        </section>
      </div>
    </main>
  );
}
