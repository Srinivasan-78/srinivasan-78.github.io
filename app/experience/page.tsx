import SplitReveal from "@/components/SplitReveal";

export const metadata = {
  title: "Experience — Srinivasan Vijayaraghavan",
  description: "DevOps engineering at Thomson Reuters and GraniteRiverLabs — CI/CD, configuration management, and disaster recovery across AWS and Azure.",
  alternates: { canonical: "/experience" },
  openGraph: { title: "Experience — Srinivasan Vijayaraghavan", description: "DevOps engineering at Thomson Reuters and GraniteRiverLabs — CI/CD, configuration management, and disaster recovery across AWS and Azure.", url: "/experience" },
};

export default function Experience() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-sage">02 — Experience</span>
      <SplitReveal as="h1" text="Experience" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Five years of DevOps engineering across embedded systems and enterprise microservices —
        from building an entire CI/CD foundation solo to owning disaster recovery for a
        multi-cloud production fleet.
      </p>

      <div className="card" style={{ marginTop: "2rem", borderLeft: "3px solid var(--sage)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "var(--font-display)", margin: 0 }}>DevOps Engineer, Thomson Reuters</h3>
          <span className="eyebrow">Jun 2023 — Present</span>
        </div>
        <div className="eyebrow" style={{ margin: "0.3rem 0 1rem" }}>Bangalore, India · team of ~7</div>
        <p style={{ color: "var(--ink-70)" }}>
          Own end-to-end CI/CD, configuration management, and disaster-recovery automation for a
          fleet of production microservices spanning AWS and Azure.
        </p>

        {[
          {
            h: "Automation & Workflow Engineering",
            items: [
              "Designed a full GitHub Actions suite covering instance provisioning, configuration promotion, multi-instance service operations, and DR failover/failback — replacing manual runbooks with self-service workflows",
              "Hardened workflow security and observability with dynamic workflow naming, permission-based access controls, real-time logging, and environment-aware validation gates",
              "Built automated rollback and recovery pipelines — DB restoration, service resets, checkpoint cleanup, and external system sync (Akamai, Pingdom)",
              "Built cross-platform automation linking GitHub Actions to Azure Pipelines and Azure Table Storage (SAS-authenticated), with inventory generation and migration-summary reporting",
            ],
          },
          {
            h: "Configuration Management & Ansible",
            items: [
              "Architected a centralized vars.yml / vault.yml variable and secret-management system, eliminating environment drift",
              "Automated cross-environment configuration syncing — duplicate key cleanup, lifecycle updates, and ID normalization",
              "Built conditional BYOK configuration logic using Jinja2 templating with selective property copying and Azure App Config integration",
              "Modularized Apache deployment and restart workflows with enforced validation checks",
            ],
          },
          {
            h: "Monitoring, Validation & Reliability",
            items: [
              "Built a fail-fast Apache validation framework — service state, HTTP 200 checks, NLB convergence, healthcheck verification",
              "Integrated Datadog dashboards, alerting, and Teams notifications directly into deployment pipelines",
              "Engineered robust error handling for DR operations, connectivity failures, DB sync issues, and microservice-specific edge cases",
            ],
          },
          {
            h: "Cloud, Networking & Migration",
            items: [
              "Automated DNS cutovers with Python and the Akamai API for MX and record updates",
              "Built a parallelized migration framework (Azure Storage, custom runners, delta detection, AzCopy) that sped up large-scale transfers and reduced downtime",
              "Designed shared-resource synchronization and migration frameworks for Solr and application servers",
              "Provisioned and upgraded internal microservices end to end — dynamic DB scripts, startup configs, routing rules, validation checks",
            ],
          },
        ].map((g) => (
          <div key={g.h} style={{ marginTop: "1.25rem" }}>
            <h5 className="eyebrow c-sage" style={{ margin: "0 0 0.4rem", fontSize: "0.78rem" }}>{g.h}</h5>
            <ul style={{ color: "var(--ink-70)", paddingLeft: "1.1rem", margin: 0 }}>
              {g.items.map((it) => (
                <li key={it} style={{ marginBottom: "0.35rem" }}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: "1.5rem", borderColor: "var(--slate-line)", borderLeft: "3px solid var(--slate)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "var(--font-display)", margin: 0 }}>DevOps Engineer, GraniteRiverLabs</h3>
          <span className="eyebrow">Sep 2021 — Jun 2023</span>
        </div>
        <div className="eyebrow" style={{ margin: "0.3rem 0 1rem" }}>Bangalore, India · solo</div>
        <p style={{ color: "var(--ink-70)" }}>
          Built CI/CD pipelines and deployment tooling from the ground up across Linux, Windows,
          and cloud environments for embedded and enterprise applications.
        </p>
        <span className="tag" style={{ color: "var(--brass)", borderColor: "var(--brass-line)" }}>
          2 awards · promoted within 6 months
        </span>
        <ul style={{ color: "var(--ink-70)", paddingLeft: "1.1rem", marginTop: "0.75rem" }}>
          <li>Built and automated Docker image pipelines for frontend and backend environments — tagging, pushing, deployment — cutting release steps from manual to one-click</li>
          <li>Deployed and maintained static .NET applications on AWS EC2, configuring Security Groups, inbound/outbound rules, and Key Pair management</li>
          <li>Designed an automated testing pipeline for WiX-based installers in GitHub Actions, producing signed, release-ready applications with no manual packaging</li>
          <li>Managed CI for Linux applications using dpkg, standardizing build and deployment automation across the team</li>
          <li>Restructured GitHub repositories to enforce linting, unit testing, code formatting, and PR quality gates</li>
          <li>Built automated ARM-based machine images with optimized configs, plus Bash/Shell scripts for system performance monitoring</li>
          <li>Implemented deployment pipelines for Project MATTER (CSA), including Zigbee automation for smart-device interoperability testing</li>
          <li>Created and deployed a custom Windows Wireshark installer for THREAD protocol analysis, with enhancements delivered through GitLab CI</li>
        </ul>
      </div>

      <div className="section">
        <span className="eyebrow c-plum">Education</span>
        <h2 className="display" style={{ fontSize: "1.4rem", margin: "0.4rem 0" }}>
          B.E., Electronics and Communication
        </h2>
        <div style={{ color: "var(--ink-70)" }}>MIT, Anna University — Chennai, India</div>
        <div className="eyebrow">Graduated Aug 2021</div>
      </div>
    </main>
  );
}
