import Link from "next/link";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/SplitReveal";
import Reveal from "@/components/Reveal";
import { PROJECTS, projectBySlug } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) return {};
  const title = `${p.title} — Srinivasan Vijayaraghavan`;
  return {
    title,
    description: p.teaser,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title, description: p.teaser, url: `/projects/${p.slug}` },
    twitter: { card: "summary_large_image", title, description: p.teaser },
  };
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) notFound();

  return (
    <main id="content" className="wrap" style={{ padding: "1.5rem 24px 3rem" }}>
      <Link href="/projects" className="eyebrow lnk">
        ← Back to the gallery
      </Link>

      <div className="pd-hero">
        {/* `group` is a shelf label on the index ("Live & deployed"),
            not a client — printing it here read as "Live & deployed ·
            Utility". The category alone is the useful half. */}
        <span className={"eyebrow c-" + p.accent}>{p.category}</span>
        <SplitReveal as="h1" text={p.title} className="display display-xl" stagger={0.02} />
        <p style={{ color: "var(--ink-70)", maxWidth: "58ch", marginTop: "1rem" }}>{p.teaser}</p>

        <div className="micro-row">
          <span className="micro micro-bright">status: {p.status}</span>
          <span className="micro">{p.stack.length} technologies</span>
        </div>
      </div>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <span className="eyebrow">Overview</span>
        <p style={{ color: "var(--ink-70)", maxWidth: "64ch", marginTop: "0.5rem" }}>{p.overview}</p>
      </section>

      <section className="section" style={{ paddingTop: "1.5rem" }}>
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

      <section className="section" style={{ paddingTop: "1.5rem" }}>
        <span className="eyebrow">What makes it worth reading</span>
        <ul style={{ color: "var(--ink-70)", maxWidth: "60ch", paddingLeft: "1.1rem", fontSize: "0.88rem" }}>
          {p.highlights.map((h) => (
            <li key={h} style={{ marginTop: "0.35rem" }}>
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="section" style={{ paddingTop: "1.5rem" }}>
        <span className="eyebrow">Stack</span>
        <div style={{ marginTop: "0.6rem" }}>
          {p.stack.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </section>

      <Reveal className="hero-actions" style={{ marginTop: "2rem" }}>
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

      <section className="section" style={{ paddingTop: "2.5rem" }}>
        <span className="eyebrow">Next</span>
        <div className="proj-list">
          {PROJECTS.filter((o) => o.slug !== p.slug)
            .slice(0, 3)
            .map((o) => (
              <Link key={o.slug} href={`/projects/${o.slug}`} className="card" data-cursor-hover>
                <span className="eyebrow">{o.category}</span>
                <h2 className="post-title">{o.title}</h2>
                <p className="proj-teaser">{o.teaser}</p>
                <span className="go">Read more →</span>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
