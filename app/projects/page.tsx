import SplitReveal from "@/components/SplitReveal";

export const metadata = {
  title: "Projects — Srinivasan Vijayaraghavan",
  description: "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects — Srinivasan Vijayaraghavan", description: "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.", url: "/projects" },
};

type Project = { title: string; status?: string; body: string; stack: string[]; links?: { url: string; label: string }[] };
type Group = { heading: string; sub: string; accent: "sage" | "slate" | "plum" | "brass"; items: Project[] };

const GROUPS: Group[] = [
  {
    heading: "Live & deployed",
    accent: "sage",
    sub: "Running right now, hosted on GitHub Pages.",
    items: [
      { title: "Self-Healing Deployment", status: "Live",
        body: "A deployment-history dashboard for a self-healing pipeline. Tracks every deploy of a demo service, lets you run chaos tests against it, and shows the service detecting failure and recovering without human intervention. The idea is to make auto-recovery observable rather than theoretical — you break it on purpose, then watch the pipeline put it back.",
        stack: ["CI/CD", "Chaos testing", "Auto-recovery", "Deployment logging"],
        links: [{ url: "https://www.srinidevops.com/Self-Healing-Deployment/", label: "Open demo ↗" }, { url: "https://github.com/Srinivasan-78/Self-Healing-Deployment", label: "Source ↗" }] },
      { title: "PDF Tools", status: "Live",
        body: "A drag-and-drop PDF utility that runs entirely in the browser. Drop one or more files, process, download — nothing is uploaded and nothing is stored on a server. Client-side processing means it works offline and handles sensitive documents without them ever leaving the machine.",
        stack: ["Client-side", "Zero upload", "Static hosting"],
        links: [{ url: "https://www.srinidevops.com/pdf/", label: "Open tool ↗" }] },
      { title: "vFactor Solutions", status: "Live",
        body: "A complete marketing site for a recruitment, RPO and lead-generation consultancy — services, career timeline, client reviews with a submission flow, and contact routing, running on its own custom domain. Built and deployed end to end: static site, custom domain with DNS and HTTPS, no CMS or backend to maintain.",
        stack: ["Static site", "Custom domain", "DNS + HTTPS", "Client build"],
        links: [{ url: "https://vfactorsolutions.com/", label: "Visit site ↗" }] },
    ],
  },
  {
    heading: "Platform engineering",
    accent: "slate",
    sub: "Larger builds — infrastructure, orchestration, multi-tenancy.",
    items: [
      { title: "Multi-Cloud Free-Tier Platform", status: "Work in progress",
        body: "A single dashboard that provisions compute across AWS, GCP, Azure and Oracle Cloud — strictly inside each provider's free tier — using Terraform, with a unified status view and cost comparison. Next.js → FastAPI → Celery → Terraform, with Postgres holding users, resources and encrypted credentials. Every request is checked against a hardcoded free-tier allowlist server-side before Terraform runs, and mirrored again as Terraform variable validation. Per-tenant Terraform workspaces keep state isolated, an hourly auto-destroy sweep tears down anything past its 24-hour safety window, and credentials are Fernet-encrypted at rest.",
        stack: ["Terraform", "FastAPI", "Celery", "Next.js", "Postgres", "Docker Compose", "Multi-tenant"],
        links: [{ url: "https://github.com/Srinivasan-78/Multicloud", label: "View repo ↗" }] },
      { title: "Zim Assistant", status: "Active",
        body: "Tooling for running a homelab around .zim archives — offline snapshots of Wikipedia and similar knowledge bases served locally through Kiwix. Includes Kiwix tooling, a Python app and UI layer, and a Windows batch launcher to bring the stack up.",
        stack: ["Python", "Kiwix", ".zim archives", "Batch", "Self-hosted"],
        links: [{ url: "https://github.com/Srinivasan-78/Homelabbing", label: "View repo ↗" }] },
    ],
  },
  {
    heading: "CI/CD & packaging",
    accent: "plum",
    sub: "Reusable pipeline and installer scaffolding.",
    items: [
      { title: "Simple-Actions", status: "Reference",
        body: "A library of GitHub Actions workflow templates for building, signing, packaging and cleaning up release artifacts across Windows and Linux runners. Composite pipeline: build on a Windows runner (NuGet restore, MSBuild, installer) → sign on a self-hosted runner → publish a GitHub release → purge artifacts. Code signing is isolated to a self-hosted runner so keys never touch a shared runner.",
        stack: ["GitHub Actions", "Self-hosted runners", "MSBuild", "Code signing", "dpkg", "Batch"],
        links: [{ url: "https://github.com/Srinivasan-78/Simple-Actions", label: "View repo ↗" }] },
      { title: "WiX Installer Template", status: "Reference",
        body: "A reusable WiX Toolset scaffold that turns a desktop app build into a Windows MSI — directory layout, shortcuts, localization, and upgrade handling already wired up. Uses Heat to harvest published build output into components automatically rather than hand-listing files.",
        stack: ["WiX Toolset v3", "MSBuild", "Heat harvesting", "MSI", "XML"],
        links: [{ url: "https://github.com/Srinivasan-78/WixTemplate", label: "View repo ↗" }] },
      { title: "Brainrot Study — automated video pipeline", status: "In progress",
        body: "Type a study topic into a workflow input, get back a finished short-form educational video. GitHub Actions is the entire runtime — no servers, no frontend, no backend to maintain. Four-stage pipeline: research → script generation → TTS voiceover → FFmpeg assembly, with automatic LLM failover on rate limits and strict-JSON script generation so downstream stages parse rather than guess.",
        stack: ["GitHub Actions", "Python", "FFmpeg", "Edge-TTS", "LLM APIs", "Failover logic"],
        links: [{ url: "https://github.com/Srinivasan-78/Brainrot_Study", label: "View repo ↗" }] },
    ],
  },
  {
    heading: "Hardware & image automation",
    accent: "brass",
    sub: "Raspberry Pi provisioning for protocol certification testing.",
    items: [
      { title: "Matter Test Harness Image Builder", status: "Active",
        body: "Bash automation that provisions a Raspberry Pi running Ubuntu 22.04 into a complete Matter (CHIP) Test Harness — then produces a compressed, distributable SD-card image of the finished environment. Installs Docker, Poetry and system dependencies, clones and builds the chip-certification-tool harness, and images the live SD card with dcfldd, shrunk via PiShrink.",
        stack: ["Bash", "Raspberry Pi", "Ubuntu 22.04", "Docker", "Matter / CHIP", "PiShrink"],
        links: [{ url: "https://github.com/Srinivasan-78/ImgCreation", label: "View repo ↗" }] },
      { title: "ImgAutomation", status: "Active",
        body: "The bootstrap half of the imaging pipeline — takes a vanilla Ubuntu Pi and gets it to the point where the image builder can take over, unattended. Clones the build repo onto an attached external disk, installs a login hook so the build resumes automatically after reboot, and hands off to the main orchestrator.",
        stack: ["Bash", "Raspberry Pi", "Auto-start hooks", "Git automation"],
        links: [{ url: "https://github.com/Srinivasan-78/ImgAutomation", label: "View repo ↗" }] },
    ],
  },
  {
    heading: "Utilities",
    accent: "sage",
    sub: "Small tools that answer a specific question.",
    items: [
      { title: "SpeedTestDD", status: "Complete",
        body: "Benchmarks the optimal dd block size for a given machine by sweeping sizes from 512 B to 64 MB and reporting throughput for each. Clears the kernel page cache between runs so results reflect real disk I/O rather than memory — useful before imaging or cloning drives.",
        stack: ["Bash", "dd", "I/O benchmarking", "Cache-aware"],
        links: [{ url: "https://github.com/Srinivasan-78/SpeedTestDD", label: "View repo ↗" }] },
    ],
  },
];

export default function Projects() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <SplitReveal as="h1" text="Things I build outside work" className="display" />
      <p style={{ color: "var(--ink-70)", maxWidth: "58ch" }}>
        Platform engineering experiments, homelab automation, and small tools I actually use.
        Everything here is public — code, live demos, or both.
      </p>

      {GROUPS.map((g) => (
        <section key={g.heading} className="section">
          <span className={"eyebrow c-" + g.accent}>{g.heading}</span>
          <p style={{ color: "var(--ink-45)", margin: "0.3rem 0 1.25rem", fontSize: "0.9rem" }}>{g.sub}</p>
          <div
            className="accent-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {g.items.map((p) => (
              <div key={p.title} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: "1.05rem" }}>{p.title}</h3>
                  {p.status && <span className="tag" style={{ margin: 0 }}>{p.status}</span>}
                </div>
                <p style={{ color: "var(--ink-70)", fontSize: "0.88rem" }}>{p.body}</p>
                <div>{p.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
                {p.links && (
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    {p.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener" className={"eyebrow c-" + g.accent}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
