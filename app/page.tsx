import Link from "next/link";
import WorkGrid, { type Post } from "@/components/WorkGrid";
import SplitReveal from "@/components/SplitReveal";
import Highlights from "@/components/Highlights";
import HowIWork from "@/components/HowIWork";
import Capabilities from "@/components/Capabilities";
import Statement from "@/components/Statement";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import SectionHead from "@/components/SectionHead";
import { CountUp, RotatingWord, TiltCard } from "@/components/Bits";
import DecryptedText from "@/components/DecryptedText";
import GlassHero from "@/components/GlassHero";

const EXPLORE = [
  { href: "/projects", title: "Projects", body: "Live tools, a Terraform multi-cloud platform, and automation pipelines — 11 builds.", go: "View projects →" },
  { href: "/certifications", title: "Certifications", body: "22 credentials in cloud, automation, and infrastructure — all verifiable.", go: "View certifications →" },
  { href: "/contact", title: "Get in touch", body: "Open to DevOps, cloud infrastructure, and automation conversations.", go: "Say hello →" },
];

const WORK_POSTS: Post[] = [
  {
    tag: "Thomson Reuters",
    accent: "sage",
    title: "Parallelized migration framework",
    body: "Built a large-scale data migration framework using Azure Storage, custom runners, delta detection, and AzCopy — speeding up large transfers and cutting migration downtime. My standout project on this team.",
    stack: ["Azure Storage", "AzCopy", "Custom runners", "Delta detection"],
  },
  {
    tag: "Thomson Reuters",
    accent: "sage",
    title: "Self-service DR & CI/CD suite",
    body: "Designed a full GitHub Actions automation suite covering provisioning, config promotion, multi-instance operations, and DR failover/failback — replacing manual runbooks entirely with self-service workflows.",
    stack: ["GitHub Actions", "DR automation", "Self-service"],
  },
  {
    tag: "Thomson Reuters",
    accent: "sage",
    title: "Fail-fast validation framework",
    body: "Built an Apache validation framework checking service state, HTTP 200 responses, NLB convergence, and healthchecks — stopping bad deployments before they ever reached users.",
    stack: ["Apache", "NLB", "Healthchecks", "Datadog"],
  },
  {
    tag: "GraniteRiverLabs",
    accent: "slate",
    title: "Project MATTER — CSA protocol",
    body: "Implemented deployment pipelines for Project MATTER, the Connectivity Standards Alliance's smart-home interoperability protocol, including Zigbee-related automation for device interoperability testing.",
    stack: ["Matter / CSA", "Zigbee", "Embedded CI"],
  },
  {
    tag: "GraniteRiverLabs",
    accent: "slate",
    title: "One-click Docker release pipeline",
    body: "Automated Docker image tagging, pushing, and deployment for frontend and backend environments end to end, solo — turning a manual release process into a single click.",
    stack: ["Docker", "Release automation", "Solo build"],
  },
  {
    tag: "GraniteRiverLabs",
    accent: "slate",
    title: "Wireshark THREAD installer",
    body: "Built a custom Windows Wireshark installer for THREAD protocol analysis, with ongoing enhancements shipped through GitLab CI. Publicly available as a merge request, later adopted by the team.",
    stack: ["Wireshark", "THREAD", "GitLab CI", "WiX"],
    link: {
      url: "https://gitlab.com/wireshark/wireshark/-/merge_requests/11008#note_1684405826",
      label: "View the merge request ↗",
    },
  },
];

const STATS: { value: number; suffix?: string; label: string; color: string }[] = [
  { value: 5, label: "years shipping", color: "var(--sage)" },
  { value: 15, suffix: "+", label: "microservices owned", color: "var(--slate)" },
  { value: 22, label: "certifications", color: "var(--plum)" },
  { value: 2, label: "clouds in production", color: "var(--brass)" },
];

export default function Page() {
  return (
    <main id="content">
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
          </div>
        </div>
      </header>

      <GlassHero />

      <Highlights />

      <HowIWork />

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="02 / 05"
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
                <DecryptedText
                  text={region}
                  parentClassName="region-code"
                  encryptedClassName="region-code-encrypted"
                  animateOn="view"
                  speed={38}
                />
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
            index="03 / 05"
            label="Selected work"
            accent="sage"
            title="Work that shipped."
          />
          <p style={{ color: "var(--ink-70)", maxWidth: "58ch", marginTop: "0.75rem" }}>
            Six projects spanning CI/CD, disaster recovery, large-scale migration, and embedded
            protocol tooling. Tap any tile for the full story and the stack behind it.
          </p>
          <div style={{ marginTop: "2rem" }}>
            <WorkGrid posts={WORK_POSTS} />
          </div>
        </div>
      </section>

      <Statement />

      <section className="section">
        <div className="wrap">
          <Parallax
            src="/images/banner-datacenter.webp"
            alt="Rows of server racks in a datacenter"
          >
            <span className="eyebrow">Production, somewhere</span>
            <h2 className="px-title">
              <DecryptedText text="Someone has to own the 3am page." animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
            </h2>
          </Parallax>
        </div>
      </section>

      <Capabilities />

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="05 / 05"
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
                  <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.4rem" }}>
                    <DecryptedText text={e.title} animateOn="view" sequential useOriginalCharsOnly encryptedClassName="text-encrypted" />
                  </h3>
                  <p style={{ color: "var(--ink-45)", fontSize: "0.84rem", margin: 0 }}>{e.body}</p>
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