import SplitReveal from "@/components/SplitReveal";
import Parallax from "@/components/Parallax";
import ParallaxLayer from "@/components/ParallaxLayer";
import ProjectGrid, { type Project } from "@/components/ProjectGrid";

export const metadata = {
  title: "Projects — Srinivasan Vijayaraghavan",
  description: "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects — Srinivasan Vijayaraghavan", description: "Platform engineering experiments, homelab automation, and small tools — live demos and public repos.", url: "/projects" },
};

type Accent = "sage" | "slate" | "plum" | "brass";
type Group = { heading: string; sub: string; accent: Accent; items: Project[] };

const GROUPS: Group[] = [
  {
    heading: "Live & deployed",
    accent: "sage",
    sub: "Running right now, hosted on GitHub Pages.",
    items: [
      { title: "Self-Healing Deployment", status: "Live",
        teaser: "Break a demo service on purpose, then watch the pipeline detect and recover on its own.",
        body: "A deployment-history dashboard for a self-healing pipeline. Tracks every deploy of a demo service, lets you run chaos tests against it, and shows the service detecting failure and recovering without human intervention. The idea is to make auto-recovery observable rather than theoretical — you break it on purpose, then watch the pipeline put it back.",
        stack: ["CI/CD", "Chaos testing", "Auto-recovery", "Deployment logging"],
        links: [{ url: "https://www.srinidevops.com/Self-Healing-Deployment/", label: "Open demo ↗" }, { url: "https://github.com/Srinivasan-78/Self-Healing-Deployment", label: "Source ↗" }] },
      { title: "PDF Tools", status: "Live",
        teaser: "Drag-and-drop PDF processing that never leaves the browser — nothing uploaded, nothing stored.",
        body: "A drag-and-drop PDF utility that runs entirely in the browser. Drop one or more files, process, download — nothing is uploaded and nothing is stored on a server. Client-side processing means it works offline and handles sensitive documents without them ever leaving the machine.",
        stack: ["Client-side", "Zero upload", "Static hosting"],
        links: [{ url: "https://www.srinidevops.com/pdf/", label: "Open tool ↗" }] },
      { title: "vFactor Solutions", status: "Live",
        teaser: "A full recruitment-consultancy site — services, reviews, and contact — on its own domain.",
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
        teaser: "One dashboard provisions free-tier compute across four clouds via Terraform, with an hourly auto-destroy sweep.",
        body: "A single dashboard that provisions compute across AWS, GCP, Azure and Oracle Cloud — strictly inside each provider's free tier — using Terraform, with a unified status view and cost comparison. Next.js → FastAPI → Celery → Terraform, with Postgres holding users, resources and encrypted credentials. Every request is checked against a hardcoded free-tier allowlist server-side before Terraform runs, and mirrored again as Terraform variable validation. Per-tenant Terraform workspaces keep state isolated, an hourly auto-destroy sweep tears down anything past its 24-hour safety window, and credentials are Fernet-encrypted at rest.",
        stack: ["Terraform", "FastAPI", "Celery", "Next.js", "Postgres", "Docker Compose", "Multi-tenant"],
        links: [{ url: "https://github.com/Srinivasan-78/Multicloud", label: "View repo ↗" }] },
      { title: "Multi-AI Toolkit", status: "Active",
        teaser: "Claude plans, free-tier APIs do the legwork — stretching a single request across five providers.",
        body: "Claude leads: it decomposes a task and synthesizes the final answer, while free-tier APIs — Groq, Gemini, OpenRouter, Mistral, Cerebras — run the subtasks in parallel underneath it. A CLI entrypoint takes a task, a planner breaks it down and writes the synthesis prompts, and an orchestrator dispatches each subtask to whichever provider config.yaml routes it to, falling back to another provider automatically if one fails. The goal is squeezing more usable output from a token budget by letting the free-tier models absorb the grunt work.",
        stack: ["Python", "Claude API", "Groq", "Gemini", "OpenRouter", "Task orchestration"],
        links: [{ url: "https://github.com/Srinivasan-78/Multi_AI", label: "View repo ↗" }] },
      { title: "Zim Assistant", status: "Active",
        teaser: "A homelab chatbot that searches offline Wikipedia snapshots through a local LLM.",
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
        teaser: "Reusable GitHub Actions templates that build, sign, and release Windows/Linux installers end to end.",
        body: "A library of GitHub Actions workflow templates for building, signing, packaging and cleaning up release artifacts across Windows and Linux runners. Composite pipeline: build on a Windows runner (NuGet restore, MSBuild, installer) → sign on a self-hosted runner → publish a GitHub release → purge artifacts. Code signing is isolated to a self-hosted runner so keys never touch a shared runner.",
        stack: ["GitHub Actions", "Self-hosted runners", "MSBuild", "Code signing", "dpkg", "Batch"],
        links: [{ url: "https://github.com/Srinivasan-78/Simple-Actions", label: "View repo ↗" }] },
      { title: "WiX Installer Template", status: "Reference",
        teaser: "A WiX scaffold that turns a build output into a signed MSI, shortcuts and all.",
        body: "A reusable WiX Toolset scaffold that turns a desktop app build into a Windows MSI — directory layout, shortcuts, localization, and upgrade handling already wired up. Uses Heat to harvest published build output into components automatically rather than hand-listing files.",
        stack: ["WiX Toolset v3", "MSBuild", "Heat harvesting", "MSI", "XML"],
        links: [{ url: "https://github.com/Srinivasan-78/WixTemplate", label: "View repo ↗" }] },
      { title: "Brainrot Study — automated video pipeline", status: "In progress",
        teaser: "Type a topic, get back a finished short-form study video — script to voiceover to render.",
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
        teaser: "Turns a bare Pi into a certified Matter test harness, then images the finished SD card.",
        body: "Bash automation that provisions a Raspberry Pi running Ubuntu 22.04 into a complete Matter (CHIP) Test Harness — then produces a compressed, distributable SD-card image of the finished environment. Installs Docker, Poetry and system dependencies, clones and builds the chip-certification-tool harness, and images the live SD card with dcfldd, shrunk via PiShrink.",
        stack: ["Bash", "Raspberry Pi", "Ubuntu 22.04", "Docker", "Matter / CHIP", "PiShrink"],
        links: [{ url: "https://github.com/Srinivasan-78/ImgCreation", label: "View repo ↗" }] },
      { title: "ImgAutomation", status: "Active",
        teaser: "The unattended bootstrap half of the imaging pipeline — resumes itself after every reboot.",
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
        teaser: "Sweeps dd block sizes from 512B to 64MB to find the fastest one for this disk.",
        body: "Benchmarks the optimal dd block size for a given machine by sweeping sizes from 512 B to 64 MB and reporting throughput for each. Clears the kernel page cache between runs so results reflect real disk I/O rather than memory — useful before imaging or cloning drives.",
        stack: ["Bash", "dd", "I/O benchmarking", "Cache-aware"],
        links: [{ url: "https://github.com/Srinivasan-78/SpeedTestDD", label: "View repo ↗" }] },
    ],
  },
];

export default function Projects() {
  return (
    <main className="wrap" style={{ padding: "2.5rem 24px" }}>
      <div className="word-stack">
        <SplitReveal as="h1" text="Things I build" className="mega" />
        <SplitReveal as="span" text="outside work" className="mega" />
      </div>

      {/* Opposing speeds: the copy lags, the banner runs ahead. The gap
          opening between them is what reads as depth. */}
      <ParallaxLayer speed={-0.12} fade>
        <p style={{ color: "var(--ink-70)", maxWidth: "48ch", marginTop: "2rem" }}>
          Platform engineering experiments, homelab automation, and small tools I actually use.
          Everything here is public — code, live demos, or both. Hover a card for a quick
          schematic, tap it for the full story.
        </p>
      </ParallaxLayer>

      <ParallaxLayer speed={0.18} style={{ marginTop: "2rem" }}>
        <Parallax
          src="/images/banner-circuit.webp"
          alt="Circuit board lit in blue"
          height="clamp(180px, 30vw, 320px)"
          strength={20}
        />
      </ParallaxLayer>

      {GROUPS.map((g) => (
        <section key={g.heading} className="section">
          <span className={"eyebrow c-" + g.accent}>{g.heading}</span>
          <p style={{ color: "var(--ink-45)", margin: "0.3rem 0 0", fontSize: "0.9rem" }}>{g.sub}</p>
          <ProjectGrid accent={g.accent} items={g.items} />
        </section>
      ))}
    </main>
  );
}
