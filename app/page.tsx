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
  { href: "/projects", title: "Projects", body: `${PROJECTS.length} builds and counting: live tools, a Terraform multi-cloud platform, and plenty of automation.`, go: "View projects" },
  { href: "/certifications", title: "Certifications", body: "22 credentials in cloud, automation and infrastructure. Every one comes with a verification link.", go: "View certifications" },
  { href: "/contact", title: "Get in touch", body: "Always glad to talk about DevOps, cloud infrastructure and automation work.", go: "Say hello" },
];

const WORK_POSTS: Post[] = [
  {
    tag: "Thomson Reuters",
    title: "Parallelized migration framework",
    body: "I built a migration framework on Azure Storage with custom runners, delta detection and AzCopy. Transfers that used to take a whole weekend finished in a fraction of the time, and the team got their weekends back. Proudest thing I shipped there.",
    stack: ["Azure Storage", "AzCopy", "Custom runners", "Delta detection"],
  },
  {
    tag: "Thomson Reuters",
    title: "Self-service DR & CI/CD suite",
    body: "I moved provisioning, config promotion, multi-instance operations and DR failover into GitHub Actions workflows that anyone on the team can run for themselves. What used to need a specialist and a runbook is now a button, available to everyone.",
    stack: ["GitHub Actions", "DR automation", "Self-service"],
  },
  {
    tag: "Thomson Reuters",
    title: "Fail-fast validation framework",
    body: "An Apache validation layer that confirms service state, HTTP 200s, NLB convergence and healthchecks before a deploy moves on. Every build that reaches a user has already proved it is healthy.",
    stack: ["Apache", "NLB", "Healthchecks", "Datadog"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "Project MATTER — CSA protocol",
    body: "Deployment pipelines for Project MATTER, the Connectivity Standards Alliance's smart-home interoperability standard. I also wrote the Zigbee automation that the device interoperability tests still run on.",
    stack: ["Matter / CSA", "Zigbee", "Embedded CI"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "One-click Docker release pipeline",
    body: "Docker image tagging, pushing and deployment for frontend and backend, automated end to end, and I built it solo. Releases went from a long checklist to a single click.",
    stack: ["Docker", "Release automation", "Solo build"],
  },
  {
    tag: "GraniteRiverLabs",
    title: "Wireshark THREAD installer",
    body: "A custom Windows Wireshark installer for THREAD protocol analysis, shipped through GitLab CI and refined over several rounds. It is public as a merge request, and the team adopted it for their own work.",
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
  { label: "Gate", note: "backup, then health checks" },
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
              text="I make releases calm and predictable."
              className="display display-xl"
            />

            <p className="hero-bio">
              Five years building the release, upgrade and disaster-recovery automation behind a
              multi-tenant Azure platform. Pipelines, health gates, rehearsed rollback paths. And
              at 2am, I&rsquo;m the one you want on the call.
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
          <SectionHead label="Availability" title="Where I can work" />
          <div className="regions">
            {REGIONS.map(([region, note]) => (
              <div className="region" key={region}>
                <span className="region-code">{region}</span>
                <span className="region-note">{note}</span>
              </div>
            ))}
          </div>
          <p className="region-foot eyebrow">
            Ready to start without sponsorship · based in Bangalore
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
            returnPath="Rollback runs the same pipeline, rehearsed and ready"
            caption="How a release moves through the Azure platform I work on. Each stage earns its way to the next, and the path back is just as automated."
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
          <SectionHead label="Selected work" title="Things I shipped and stand behind" />
          <p className="sec-lede">
            Six of them, across CI/CD, disaster recovery, large migrations and embedded protocol
            work. Each card carries the stack it was built on.
          </p>
          <WorkGrid posts={WORK_POSTS} />
        </div>
      </section>

      <Capabilities />

      <section className="section">
        <div className="wrap">
          <SectionHead label="Explore" title="Plenty more to see" />
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
