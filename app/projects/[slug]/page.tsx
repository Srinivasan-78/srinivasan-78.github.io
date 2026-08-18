import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/SplitReveal";
import DecryptedText from "@/components/DecryptedText";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
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
    <main id="content" className="wrap" style={{ padding: "1.5rem 24px 3rem" }}>
      <Link href="/projects" className="eyebrow lnk">
        ← Back to the gallery
      </Link>

      <div className="pd-hero">
        <span className={"eyebrow c-" + p.accent}>
          {p.client} · {p.category}
        </span>
        <SplitReveal as="h1" text={p.title} className="display display-xl" stagger={0.02} />
        <p style={{ color: "var(--ink-70)", maxWidth: "58ch", marginTop: "1rem" }}>{p.teaser}</p>

        <div className="micro-row">
          <span className="micro micro-bright">status: {p.status}</span>
          <span className="micro">{p.stack.length} technologies</span>
        </div>
      </div>

      {/* The same parallax frame the home page uses, so the banner reads as
          part of the site rather than a stray photo. Reduced motion holds
          it still; the image itself is lazy. */}
      <Parallax
        src={p.image}
        alt={p.imageAlt}
        height="clamp(200px, 32vw, 380px)"
        className="pd-banner"
      />

      <section className="section" style={{ paddingTop: "1rem" }}>
        <span className="eyebrow">Overview</span>
        <p style={{ color: "var(--ink-70)", maxWidth: "64ch", marginTop: "0.5rem" }}>{p.overview}</p>
      </section>

      <section className="section" style={{ paddingTop: "1.5rem" }}>
        <span className="eyebrow">How it works</span>
        <div className="pd-arch">
          {p.architecture.map((a) => (
            <div key={a.label}>
              <h3>
                <DecryptedText text={a.label} animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
              </h3>
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
                <span className="eyebrow">{o.client}</span>
                <h2 className="post-title">
                  <DecryptedText text={o.title} animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
                </h2>
                <p className="proj-teaser">{o.teaser}</p>
                <span className="go">Read more →</span>
              </Link>
            ))}
        </div>
      </section>
    </main>
  );
}
