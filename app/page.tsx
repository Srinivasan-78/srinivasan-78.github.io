import Link from "next/link";
import WorkGrid, { type Post } from "@/components/WorkGrid";
import SplitReveal from "@/components/SplitReveal";
import Highlights from "@/components/Highlights";
import HowIWork from "@/components/HowIWork";
import Capabilities from "@/components/Capabilities";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import SystemDiagram from "@/components/SystemDiagram";
import { CountUp } from "@/components/Bits";
import HeroShowcase from "@/components/HeroShowcase";
import GlowCard from "@/components/ui/GlowCard";
/* Counted, not typed: this line said "11 builds" while lib/projects.ts held 12. */
import { PROJECTS } from "@/lib/projects";

const EXPLORE = [
  { href: "/projects", title: "Projects", body: `Live tools, a Terraform multi-cloud platform, and automation pipelines — ${PROJECTS.length} builds.`, go: "View projects" },
  { href: "/certifications", title: "Certifications", body: "22 credentials in cloud, automation, and infrastructure — all verifiable.", go: "View certifications" },
  { href: "/contact", title: "Get in touch", body: "Open to DevOps, cloud infrastructure, and automation conversations.", go: "Say hello" },
];

const WORK_POSTS: Post[] = [
  {
    tag: "Thomson Reuters",
    title: "Parallelized migration framework",
    body: "Built a large-scale data migration framework using Azure Storage, custom runners, delta detection, and AzCopy — speeding up large transfers and cutting migration downtime. My standout project on this team.",
    stack: ["Azure Storage", "AzCopy", "Custom runners", "Delta detection"],
  },
  {
    tag: "Thomson Reuters",
    title: "Self-service DR & CI/CD suite",
    body: "Designed a full GitHub Actions automation suite covering provisioning, config promotion, multi-instance operations, and DR failover/failback — replacing manual runbooks entirely with self-service workflows.",
    stack: ["GitHub Actions", "DR automation", "Self-service"],
  },
  {
    tag: "Thomson Reuters",
    title: "Fail-fast validation framework",
    body: "Built an Apache validation framework checking service state, HTTP 200 responses, NLB convergence, and healthchecks — stopping bad deployments before they ever reached users.",
    stack: ["Apache", "NLB", "Healthchecks", "Datadog"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "Project MATTER — CSA protocol",
    body: "Implemented deployment pipelines for Project MATTER, the Connectivity Standards Alliance's smart-home interoperability protocol, including Zigbee-related automation for device interoperability testing.",
    stack: ["Matter / CSA", "Zigbee", "Embedded CI"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "One-click Docker release pipeline",
    body: "Automated Docker image tagging, pushing, and deployment for frontend and backend environments end to end, solo — turning a manual release process into a single click.",
    stack: ["Docker", "Release automation", "Solo build"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "Wireshark THREAD installer",
    body: "Built a custom Windows Wireshark installer for THREAD protocol analysis, with ongoing enhancements shipped through GitLab CI. Publicly available as a merge request, later adopted by the team.",
    stack: ["Wireshark", "THREAD", "GitLab CI", "WiX"],
    link: {
      url: "https://gitlab.com/wireshark/wireshark/-/merge_requests/11008#note_1684405826",
      label: "View the merge request",
    },
  },
];

const STATS: { value: number; suffix?: string; label: string }[] = [
  { value: 5, label: "years shipping" },
  { value: 15, suffix: "+", label: "microservices owned" },
  { value: 22, label: "certifications" },
  { value: 2, label: "clouds in production" },
];

/* The stages a release actually moves through on the platform this site
   is about, plus the path back. This is the home page's hero visual. */
const RELEASE_FLOW = [
  { label: "Commit", note: "PR opened" },
  { label: "Build", note: "image tagged, pushed" },
  { label: "Gate", note: "backup + health checks" },
  { label: "Promote", note: "config, one region first" },
  { label: "Verify", note: "HTTP 200, NLB converged" },
];

const REGIONS: [string, string][] = [
  ["us-east", "US citizen"],
  ["ap-south", "OCI — indefinite right to work in India"],
];

export default function Page() {
  return (
    <main id="content" tabIndex={-1}>
      {/* The hero used to carry eight things at once: a status pill, a
          location, a scrambling headline, an avatar, a word that cycled
          forever, a bio paragraph, four counters and two buttons. The
          counters have moved down to a section of their own; the avatar
          and the rotating word are gone. What is left is the sentence,
          who is saying it, and one thing to do about it. */}
      <header className="hero">
        <div className="wrap">
          <HeroShowcase>
            <p className="eyebrow hero-status">
              Srinivasan Vijayaraghavan · DevOps / SRE · Bangalore, IN
            </p>

            <SplitReveal
              as="h1"
              text="I automate the release nobody wants to do by hand."
              className="display display-xl"
            />

            <p className="hero-bio">
              Five years owning release, upgrade, and disaster-recovery automation for a
              multi-tenant Azure platform. I build the pipelines, health gates, and rollback
              paths that decide whether a release ships — and own the recovery when it doesn&rsquo;t.
            </p>

            <div className="hero-actions">
              <Link href="/contact" className="btn primary">
                Get in touch
              </Link>
              <a href="/resume.pdf" className="btn" download>
                Download résumé
              </a>
            </div>
          </HeroShowcase>
        </div>
      </header>

      {/* Skills and availability lead the page. They are the two things a
          reader is here to check first — what this person works with,
          and whether they can be hired where the reader is — so they sit
          directly under the hero rather than four sections down. */}
      <Highlights />

      <section className="section">
        <div className="wrap">
          <SectionHead label="Availability" title="Where I can work." />
          <div className="regions">
            {REGIONS.map(([region, note]) => (
              <div className="region" key={region}>
                <span className="region-code">{region}</span>
                <span className="region-note">{note}</span>
              </div>
            ))}
          </div>
          <p className="region-foot eyebrow">
            No sponsorship required · based in Bangalore
          </p>
        </div>
      </section>

      {/* Full-bleed: the one visual on the page gets the whole width, and
          the change of width is what separates it from the column above
          rather than a rule. */}
      <section className="section section-bleed">
        <div className="wrap">
          <SystemDiagram
            stages={RELEASE_FLOW}
            returnPath="Rollback — rehearsed, same pipeline, no manual steps"
            caption="The release path on a multi-tenant Azure platform. Every stage gates the next; the return path is automated too."
          />
        </div>
      </section>

      {/* Standard width, not the prose column: four counters squeezed into
          692px leave each label about 140px, which wraps every one of
          them onto two lines. */}
      <section className="section">
        <div className="wrap">
          <Reveal className="stats" stagger={0.08}>
            {STATS.map((st) => (
              <div key={st.label}>
                <CountUp
                  value={st.value}
                  suffix={st.suffix}
                  className="stat-num"
                  style={{ display: "block" }}
                />
                <div className="eyebrow">{st.label}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <HowIWork />

      <section className="section">
        <div className="wrap">
          <SectionHead label="Selected work" title="Work that shipped." />
          <p className="sec-lede">
            Six projects spanning CI/CD, disaster recovery, large-scale migration, and embedded
            protocol tooling. Open any one for the full story and the stack behind it.
          </p>
          <WorkGrid posts={WORK_POSTS} />
        </div>
      </section>

      <Capabilities />

      <section className="section">
        <div className="wrap">
          <SectionHead label="Explore" title="Where to next." />
          <Reveal className="explore-grid" pop>
            {EXPLORE.map((e) => (
              <GlowCard key={e.href}>
                <Link href={e.href} className="card">
                  <h3 className="card-title">{e.title}</h3>
                  <p className="card-body">{e.body}</p>
                  <span className="go">{e.go}</span>
                </Link>
              </GlowCard>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
