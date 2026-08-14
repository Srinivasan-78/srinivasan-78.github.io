import SplitReveal from "@/components/SplitReveal";
import WorkGrid, { type Post } from "@/components/WorkGrid";

export const metadata = { title: "Work — Srinivasan Vijayaraghavan" };

const s = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

const POSTS: Post[] = [
  {
    tag: "Thomson Reuters", accent: "sage", title: "Parallelized migration framework",
    body: "Built a large-scale data migration framework using Azure Storage, custom runners, delta detection, and AzCopy — speeding up large transfers and cutting migration downtime. My standout project on this team.",
    stack: ["Azure Storage", "AzCopy", "Custom runners", "Delta detection"],
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        {[26, 55, 84].map((y, i) => (
          <g key={y} opacity={1 - i * 0.22}>
            <path d={`M24 ${y} H244`} stroke="currentColor" strokeWidth="3" {...s} />
            <path d={`M236 ${y - 8} l10 8 -10 8`} stroke="currentColor" strokeWidth="3" {...s} />
            <rect x={50 + i * 44} y={y - 7} width="26" height="14" rx="3" fill="currentColor" />
          </g>
        ))}
      </svg>
    ),
  },
  {
    tag: "Thomson Reuters", accent: "sage", title: "Self-service DR & CI/CD suite",
    body: "Designed a full GitHub Actions automation suite covering provisioning, config promotion, multi-instance operations, and DR failover/failback — replacing manual runbooks entirely with self-service workflows.",
    stack: ["GitHub Actions", "DR automation", "Self-service"],
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        <path d="M24 55 H92" stroke="currentColor" strokeWidth="3" {...s} />
        <circle cx="104" cy="55" r="11" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M116 55 H164 M164 55 L206 26 M164 55 L206 84" stroke="currentColor" strokeWidth="3" {...s} />
        <rect x="206" y="12" width="54" height="26" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
        <rect x="206" y="72" width="54" height="26" rx="5" stroke="currentColor" strokeWidth="3" fill="none" />
      </svg>
    ),
  },
  {
    tag: "Thomson Reuters", accent: "sage", title: "Fail-fast validation framework",
    body: "Built an Apache validation framework checking service state, HTTP 200 responses, NLB convergence, and healthchecks — stopping bad deployments before they ever reached users.",
    stack: ["Apache", "NLB", "Healthchecks", "Datadog"],
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={24 + i * 68} y="38" width="46" height="34" rx="5" stroke="currentColor" strokeWidth="3" fill="none" opacity={i === 3 ? 0.4 : 1} />
            {i < 3 && <path d={`M${70 + i * 68} 55 H${92 + i * 68}`} stroke="currentColor" strokeWidth="3" {...s} />}
            {i < 3 && <path d={`M${36 + i * 68} 55 l6 6 12 -13`} stroke="currentColor" strokeWidth="3" {...s} />}
          </g>
        ))}
      </svg>
    ),
  },
  {
    tag: "GraniteRiverLabs", accent: "slate", title: "Project MATTER — CSA protocol",
    body: "Implemented deployment pipelines for Project MATTER, the Connectivity Standards Alliance's smart-home interoperability protocol, including Zigbee-related automation for device interoperability testing.",
    stack: ["Matter / CSA", "Zigbee", "Embedded CI"],
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        <circle cx="150" cy="55" r="16" stroke="currentColor" strokeWidth="3" fill="none" />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = (a * Math.PI) / 180;
          return (
            <g key={a}>
              <path d={`M${150 + Math.cos(r) * 20} ${55 + Math.sin(r) * 20} L${150 + Math.cos(r) * 42} ${55 + Math.sin(r) * 42}`} stroke="currentColor" strokeWidth="2.5" {...s} opacity="0.6" />
              <circle cx={150 + Math.cos(r) * 50} cy={55 + Math.sin(r) * 50} r="7" fill="currentColor" />
            </g>
          );
        })}
      </svg>
    ),
  },
  {
    tag: "GraniteRiverLabs", accent: "slate", title: "One-click Docker release pipeline",
    body: "Automated Docker image tagging, pushing, and deployment for frontend and backend environments end to end, solo — turning a manual release process into a single click.",
    stack: ["Docker", "Release automation", "Solo build"],
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={70 + i * 28} y={70 - i * 22} width="24" height="20" rx="3" stroke="currentColor" strokeWidth="3" fill="none" />
        ))}
        <path d="M160 60 H228" stroke="currentColor" strokeWidth="3" {...s} />
        <path d="M220 52 l10 8 -10 8" stroke="currentColor" strokeWidth="3" {...s} />
        <circle cx="248" cy="60" r="12" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
  {
    tag: "GraniteRiverLabs", accent: "slate", title: "Wireshark THREAD installer",
    body: "Built a custom Windows Wireshark installer for THREAD protocol analysis, with ongoing enhancements shipped through GitLab CI. Publicly available as a merge request, later adopted by the team.",
    stack: ["Wireshark", "THREAD", "GitLab CI", "WiX"],
    link: { url: "https://gitlab.com/wireshark/wireshark/-/merge_requests/11008#note_1684405826", label: "View the merge request ↗" },
    art: (
      <svg viewBox="0 0 300 110" aria-hidden="true">
        <path d="M14 60 H62 L78 26 L98 92 L116 44 L134 74 L152 60 H286" stroke="currentColor" strokeWidth="3.5" {...s} />
        <circle cx="98" cy="92" r="6" fill="currentColor" />
      </svg>
    ),
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