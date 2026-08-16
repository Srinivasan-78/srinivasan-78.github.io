import SplitReveal from "@/components/SplitReveal";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";

export const metadata = {
  title: "Experience — Srinivasan Vijayaraghavan",
  description:
    "Five years of DevOps and SRE work across Thomson Reuters and GraniteRiverLabs — release automation, disaster recovery, and CI/CD.",
  alternates: { canonical: "/experience" },
  openGraph: {
    title: "Experience — Srinivasan Vijayaraghavan",
    description:
      "Five years of DevOps and SRE work across Thomson Reuters and GraniteRiverLabs — release automation, disaster recovery, and CI/CD.",
    url: "/experience",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience — Srinivasan Vijayaraghavan",
    description:
      "Five years of DevOps and SRE work across Thomson Reuters and GraniteRiverLabs — release automation, disaster recovery, and CI/CD.",
  },
};

/* Content is lifted verbatim in substance from public/resume.pdf so the
   two can't drift. If a role changes, change it in both places. */

type Role = {
  company: string;
  title: string;
  dates: string;
  location: string;
  accent: "sage" | "slate";
  summary: string;
  groups: { label: string; points: string[] }[];
};

const ROLES: Role[] = [
  {
    company: "Thomson Reuters",
    title: "DevOps Engineer",
    dates: "Jun 2023 — Present",
    location: "Bangalore, India",
    accent: "sage",
    summary:
      "Own release, upgrade, and disaster-recovery automation for a multi-tenant legal platform across multiple Azure regions and environments.",
    groups: [
      {
        label: "Release engineering & upgrade automation",
        points: [
          "Replaced manual upgrade runbooks with unattended Ansible orchestration for 15+ microservices, with per-service rescue blocks and automatic rollback.",
          "Gated deployments on backup integrity — T-SQL-verified transaction-log backups, RESTORE-based rollback, and Datadog failure hooks.",
          "Automated container image promotion across environments in GitHub Actions, streaming Azure DevOps build logs into the GitHub console.",
          "Built on-premises deployment automation from scratch: Jinja2 config templates, idempotent SQL Server initialization, and pre-flight input validation.",
          "Built a parallelized migration framework — Azure Storage, custom runners, delta detection, and AzCopy — cutting the window in which a large transfer can hurt anyone.",
        ],
      },
      {
        label: "Reliability, disaster recovery & observability",
        points: [
          "Extended DR failover and failback to modernized microservices, driving maintenance and active state transitions through Azure Service Bus.",
          "Migrated databases and application servers across Azure regions with zero data loss, covering restore, HA mirroring, and rollback.",
          "Hardened Apache restarts with a four-condition health gate: service state, HTTP 200, load-balancer convergence, and healthcheck file.",
          "Eliminated transient-fault pipeline failures with retry backoff and defensive checks for WinRM connectivity loss.",
          "Extended HTTP, TCP, and JMX health monitoring to every microservice, with dynamic template generation and dependency-aware agent restarts.",
          "Cut failed-deployment detection time by instrumenting release playbooks with deployment telemetry, run summaries, and Teams alerting.",
          "Automated DNS cutovers with Python and the Akamai API, including MX and record updates.",
        ],
      },
      {
        label: "Platform engineering, security & cost",
        points: [
          "Refactored multi-environment Ansible inventories into an environment-agnostic model across 15+ microservices, removing a recurring three-place edit.",
          "Architected centralized variable and secret management (vars.yml / vault.yml) standardizing config across every environment.",
          "Closed an unrestricted-execution gap with two RBAC gate workflows, and integrated BYOK via Key Vault and Azure App Configuration.",
          "Led a jumpbox VM family upgrade through ITSM change management to reduce compute spend across the estate.",
        ],
      },
    ],
  },
  {
    company: "GraniteRiverLabs",
    title: "DevOps Engineer",
    dates: "Sep 2021 — Jun 2023",
    location: "Bangalore, India",
    accent: "slate",
    summary:
      "Built CI/CD pipelines and deployment tooling from scratch across Linux, Windows, and cloud, for embedded and enterprise applications — largely as a one-person team.",
    groups: [
      {
        label: "Pipelines & packaging",
        points: [
          "Built Docker build, tag, push, and deploy pipelines for frontend and backend, turning a manual release process into a single click.",
          "Designed an automated testing and signing pipeline for WiX-based installers in GitHub Actions, producing release-ready applications with no manual packaging.",
          "Managed CI for Linux applications using dpkg, standardizing build and deployment automation across the team.",
          "Restructured GitHub repositories to enforce linting, unit testing, code formatting, and PR quality gates.",
        ],
      },
      {
        label: "Cloud & systems",
        points: [
          "Deployed and maintained static .NET applications on AWS EC2, scoping security groups, inbound/outbound rules, and key-pair management to least privilege.",
          "Built automated ARM-based machine images with optimized configuration, plus Bash tooling for system performance monitoring.",
        ],
      },
      {
        label: "Protocol & embedded tooling",
        points: [
          "Implemented deployment pipelines for Project MATTER (Connectivity Standards Alliance), including Zigbee automation for smart-device interoperability testing.",
          "Built a custom Windows Wireshark installer for THREAD protocol analysis, shipped through GitLab CI and contributed publicly as a merge request.",
        ],
      },
    ],
  },
];

const EDUCATION = {
  degree: "B.E., Electronics and Communication Engineering",
  school: "Madras Institute of Technology, Anna University",
  location: "Chennai, India",
  dates: "2017 — 2021",
  projects: [
    "Weather monitoring system using IoT with green energy (Nov 2020 — Mar 2021)",
    "Wireless temperature measuring device (Jul 2020 — Oct 2020)",
  ],
};

export default function Experience() {
  return (
    <main id="content">
      <header className="hero">
        <div className="wrap">
          <span className="eyebrow c-sage">Experience</span>
          <SplitReveal
            as="h1"
            text="Five years, two companies, one job."
            className="display display-lg"
            stagger={0.018}
          />
          <p className="hero-bio">
            Keeping releases boring. Below is the same record as the résumé, with the
            detail a PDF has no room for.
          </p>
          <div className="hero-actions">
            <a href="/resume.pdf" className="btn primary" download="Srinivasan-Vijayaraghavan-DevOps.pdf">
              Download résumé
            </a>
          </div>
        </div>
      </header>

      {ROLES.map((role, i) => (
        <section className="section" key={role.company}>
          <div className="wrap">
            <SectionHead
              index={`0${i + 1} / 03`}
              label={role.dates}
              accent={role.accent}
              title={role.company}
            />

            <div
              className="card"
              style={{
                marginTop: "2rem",
                borderLeft: `3px solid var(--${role.accent})`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="tag"
                  style={{
                    color: `var(--${role.accent})`,
                    borderColor: `var(--${role.accent}-line)`,
                    margin: 0,
                  }}
                >
                  {role.title}
                </span>
                <span className="eyebrow">{role.location}</span>
              </div>

              <p style={{ color: "var(--ink-70)", maxWidth: "62ch", marginTop: "1rem" }}>
                {role.summary}
              </p>
            </div>

            <Reveal stagger={0.06} y={18} style={{ marginTop: "1.5rem" }}>
              {role.groups.map((g) => (
                <div
                  key={g.label}
                  className="card"
                  style={{ marginTop: "1rem" }}
                >
                  <span className="eyebrow" style={{ color: `var(--${role.accent})` }}>
                    {g.label}
                  </span>
                  <ul
                    style={{
                      margin: "0.9rem 0 0",
                      paddingLeft: "1.1rem",
                      color: "var(--ink-70)",
                      display: "grid",
                      gap: "0.55rem",
                      maxWidth: "70ch",
                    }}
                  >
                    {g.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <SectionHead
            index="03 / 03"
            label={EDUCATION.dates}
            accent="brass"
            title="Education."
          />
          <div
            className="card"
            style={{ marginTop: "2rem", borderLeft: "3px solid var(--brass)" }}
          >
            <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 0.3rem" }}>
              {EDUCATION.degree}
            </h3>
            <p style={{ color: "var(--ink-70)", margin: 0 }}>
              {EDUCATION.school} · {EDUCATION.location}
            </p>
            <ul
              style={{
                margin: "1rem 0 0",
                paddingLeft: "1.1rem",
                color: "var(--ink-45)",
                display: "grid",
                gap: "0.5rem",
                fontSize: "0.88rem",
              }}
            >
              {EDUCATION.projects.map((pr) => (
                <li key={pr}>{pr}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
