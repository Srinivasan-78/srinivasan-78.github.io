import SplitReveal from "@/components/SplitReveal";

export const metadata = { title: "Work — Srinivasan Vijayaraghavan" };

const POSTS = [
  { tag: "Thomson Reuters", accent: "sage", title: "Parallelized migration framework",
    body: "Built a large-scale data migration framework using Azure Storage, custom runners, delta detection, and AzCopy — speeding up large transfers and cutting migration downtime. My standout project on this team.",
    stack: ["Azure Storage", "AzCopy", "Custom runners", "Delta detection"] },
  { tag: "Thomson Reuters", accent: "sage", title: "Self-service DR & CI/CD suite",
    body: "Designed a full GitHub Actions automation suite covering provisioning, config promotion, multi-instance operations, and DR failover/failback — replacing manual runbooks entirely with self-service workflows.",
    stack: ["GitHub Actions", "DR automation", "Self-service"] },
  { tag: "Thomson Reuters", accent: "sage", title: "Fail-fast validation framework",
    body: "Built an Apache validation framework checking service state, HTTP 200 responses, NLB convergence, and healthchecks — stopping bad deployments before they ever reached users.",
    stack: ["Apache", "NLB", "Healthchecks", "Datadog"] },
  { tag: "GraniteRiverLabs", accent: "slate", title: "Project MATTER — CSA protocol",
    body: "Implemented deployment pipelines for Project MATTER, the Connectivity Standards Alliance's smart-home interoperability protocol, including Zigbee-related automation for device interoperability testing.",
    stack: ["Matter / CSA", "Zigbee", "Embedded CI"] },
  { tag: "GraniteRiverLabs", accent: "slate", title: "One-click Docker release pipeline",
    body: "Automated Docker image tagging, pushing, and deployment for frontend and backend environments end to end, solo — turning a manual release process into a single click.",
    stack: ["Docker", "Release automation", "Solo build"] },
  { tag: "GraniteRiverLabs", accent: "slate", title: "Wireshark THREAD installer",
    body: "Built a custom Windows Wireshark installer for THREAD protocol analysis, with ongoing enhancements shipped through GitLab CI. Publicly available as a merge request, later adopted by the team.",
    stack: ["Wireshark", "THREAD", "GitLab CI", "WiX"],
    link: "https://gitlab.com/wireshark/wireshark/-/merge_requests/11008#note_1684405826" },
];

export default function Work() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow">01 — Work</span>
      <SplitReveal as="h1" text="Selected work" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Six projects spanning CI/CD, disaster recovery, large-scale migration, and embedded
        protocol tooling.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {POSTS.map((p) => {
          const accent = p.accent === "sage" ? "var(--sage)" : "var(--slate)";
          const line = p.accent === "sage" ? "var(--sage-line)" : "var(--slate-line)";
          return (
            <div key={p.title} className="card" style={{ borderColor: line }}>
              <span className="tag" style={{ color: accent, borderColor: line }}>{p.tag}</span>
              <h3 style={{ fontFamily: "var(--font-display)", margin: "0.6rem 0 0.4rem" }}>{p.title}</h3>
              <p style={{ color: "var(--ink-70)", fontSize: "0.9rem" }}>{p.body}</p>
              <div style={{ marginTop: "0.5rem" }}>
                {p.stack.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener" className="eyebrow" style={{ color: accent }}>
                  View the merge request ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
