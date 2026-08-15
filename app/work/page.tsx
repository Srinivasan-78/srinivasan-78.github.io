import SplitReveal from "@/components/SplitReveal";
import WorkGrid, { type Post } from "@/components/WorkGrid";

export const metadata = {
  title: "Work — Srinivasan Vijayaraghavan",
  description: "Selected DevOps work: CI/CD suites, disaster recovery, large-scale Azure migration, and embedded protocol tooling.",
  alternates: { canonical: "/work" },
  openGraph: { title: "Work — Srinivasan Vijayaraghavan", description: "Selected DevOps work: CI/CD suites, disaster recovery, large-scale Azure migration, and embedded protocol tooling.", url: "/work" },
};

const POSTS: Post[] = [
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

export default function Work() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <span className="eyebrow c-sage">01 — Work</span>
      <SplitReveal as="h1" text="Selected work" className="display display-lg" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Six projects spanning CI/CD, disaster recovery, large-scale migration, and embedded
        protocol tooling. Tap any tile for the full story and the stack behind it.
      </p>
      <WorkGrid posts={POSTS} />
    </main>
  );
}
