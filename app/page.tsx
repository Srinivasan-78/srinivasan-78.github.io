import Link from "next/link";
import SplitReveal from "@/components/SplitReveal";
import Highlights from "@/components/Highlights";
import Marquee from "@/components/Marquee";
import HowIWork from "@/components/HowIWork";
import Capabilities from "@/components/Capabilities";
import Statement from "@/components/Statement";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import SectionHead from "@/components/SectionHead";
import { CountUp, RotatingWord, DecryptText, TiltCard } from "@/components/Bits";

const EXPLORE = [
  { href: "/projects", title: "Projects", body: "Live tools, a Terraform multi-cloud platform, and automation pipelines — 11 builds.", go: "View projects →" },
  { href: "/work", title: "Selected work", body: "Six projects across two companies, including public upstream contribution.", go: "View work →" },
  { href: "/experience", title: "Experience", body: "Full role breakdowns at Thomson Reuters and GraniteRiverLabs, plus education.", go: "View experience →" },
  { href: "/certifications", title: "Certifications", body: "22 credentials in cloud, automation, and infrastructure — all verifiable.", go: "View certifications →" },
  { href: "/contact", title: "Get in touch", body: "Open to DevOps, cloud infrastructure, and automation conversations.", go: "Say hello →" },
];

const STATS: { value: number; suffix?: string; label: string; color: string }[] = [
  { value: 5, label: "years shipping", color: "var(--sage)" },
  { value: 15, suffix: "+", label: "microservices owned", color: "var(--slate)" },
  { value: 22, label: "certifications", color: "var(--plum)" },
  { value: 2, label: "clouds in production", color: "var(--brass)" },
];

export default function Page() {
  return (
    <main>
      <header className="hero">
        <div className="wrap">
          <div className="hero-meta">
            <span className="hero-status eyebrow">
              <i className="pulse" />
              Open to opportunities
            </span>
            <span className="eyebrow">Bangalore, IN · US citizen + OCI</span>
          </div>

          <SplitReveal
            as="h1"
            text="I automate the release nobody wants to do by hand."
            className="display display-xl"
            stagger={0.018}
          />

          <div className="hero-lower">
            <div className="hero-avatar">
              <div className="hero-avatar-inner">SV</div>
            </div>
            <div>
              <div className="display" style={{ fontSize: "1.25rem" }}>
                Srinivasan Vijayaraghavan
              </div>
              <p className="eyebrow" style={{ marginTop: 2 }}>
                DevOps / SRE ·{" "}
                <RotatingWord
                  words={["Release automation", "Disaster recovery", "Cloud infrastructure", "Observability"]}
                />
              </p>
            </div>
          </div>

          <p className="hero-bio">
            Five years owning release, upgrade, and disaster-recovery automation for a
            multi-tenant Azure platform. I build the pipelines, health gates, and rollback
            paths that decide whether a release ships — and own the recovery when it doesn&rsquo;t.
          </p>

          <Reveal className="stats" stagger={0.08} y={16}>
            {STATS.map((st) => (
              <div key={st.label}>
                <CountUp
                  value={st.value}
                  suffix={st.suffix}
                  className="stat-num"
                  style={{ color: st.color, display: "block" }}
                />
                <div className="eyebrow">{st.label}</div>
              </div>
            ))}
          </Reveal>

          <div className="hero-actions">
            <a href="/resume.pdf" className="btn primary" download>
              Download résumé
            </a>
            <Link href="/contact" className="btn ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </header>

      <Marquee />

      <Highlights />

      <HowIWork />

      <Statement />

      <section className="section">
        <div className="wrap">
          <Parallax
            src="/images/banner-datacenter.webp"
            alt="Rows of server racks in a datacenter"
          >
            <span className="eyebrow">Production, somewhere</span>
            <h2 className="px-title">Someone has to own the 3am page.</h2>
          </Parallax>
        </div>
      </section>

      <Capabilities />

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="03 / 04"
            label="Availability"
            accent="slate"
            title="Deployment regions."
          />
          <div className="card" style={{ marginTop: "2rem", borderLeft: "3px solid var(--slate)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span className="eyebrow">work authorization — health check</span>
              <span className="eyebrow" style={{ color: "var(--sage)" }}>2/2 regions healthy</span>
            </div>
            {[
              ["us-east", "AUTHORIZED", "US citizen"],
              ["ap-south", "AUTHORIZED", "OCI — indefinite right to work in India"],
            ].map(([region, status, note]) => (
              <div
                key={region}
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.6rem 0",
                  borderTop: "1px solid var(--ink-15)",
                  flexWrap: "wrap",
                }}
              >
                <DecryptText text={region} className="region-code" />
                <span className="tag" style={{ color: "var(--sage)", borderColor: "var(--sage-line)", background: "var(--sage-wash)", margin: 0 }}>
                  {status}
                </span>
                <span style={{ color: "var(--ink-45)", fontSize: "0.85rem" }}>{note}</span>
              </div>
            ))}
            <div className="eyebrow" style={{ marginTop: "1rem" }}>
              sponsorship_required: <b>false</b> · failover: <b>instant</b> · based in Bangalore
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="04 / 04"
            label="Explore"
            accent="brass"
            title="Where to next."
          />
          <Reveal
            className="accent-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            {EXPLORE.map((e) => (
              <TiltCard key={e.href}>
                <Link href={e.href} className="card" data-cursor-hover>
                  <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>{e.title}</h3>
                  <p style={{ color: "var(--ink-45)", fontSize: "0.9rem", margin: 0 }}>{e.body}</p>
                  <span className="go">{e.go}</span>
                </Link>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
