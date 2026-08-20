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

  return (
    <main id="content">
      <div className="wrap pd-top">
        <Link href="/projects" className="eyebrow lnk">
          ← Back to the gallery
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
            caption={`${p.title} — how the pieces fit together.`}
          />
        </div>
      </section>

      <div className="wrap">
        <section className="section pd-section">
          <span className="eyebrow">Overview</span>
          <p className="pd-prose">{p.overview}</p>
        </section>

        <section className="section pd-section">
          <span className="eyebrow">How it works</span>
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
          <span className="eyebrow">What makes it worth reading</span>
          <ul className="pd-list">
            {p.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>

        <section className="section pd-section">
          <span className="eyebrow">Stack</span>
          <div className="pd-stack">
            {p.stack.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </section>

        <Reveal className="hero-actions">
          {p.links.map((l, i) => (
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
      </div>

      <div className="wrap">
        <section className="section pd-section">
          <span className="eyebrow">Next</span>
          <Reveal className="proj-list" pop>
            {PROJECTS.filter((o) => o.slug !== p.slug)
              .slice(0, 3)
              .map((o) => (
                <GlowCard key={o.slug}>
                  <Link href={`/projects/${o.slug}`} className="card">
                    <span className="eyebrow">{o.client}</span>
                    <h2 className="card-title">{o.title}</h2>
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
