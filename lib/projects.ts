export type Accent = "sage" | "slate" | "plum" | "brass";
export type ProjectLink = { url: string; label: string };

export type Project = {
  slug: string;
  title: string;
  /* Shown top-left on the card, the way the reference shows a client name. */
  client: string;
  category: string;
  status: string;
  accent: Accent;
  image: string;
  teaser: string;
  /* Short pills on the card face — kept to 3 so the texture never overflows. */
  tags: string[];
  stack: string[];
  overview: string;
  architecture: { label: string; body: string }[];
  highlights: string[];
  links: ProjectLink[];
};

export const PROJECTS: Project[] = [
  {
    slug: "self-healing-deployment",
    title: "Self-Healing Deployment",
    client: "Live & deployed",
    category: "Platform",
    status: "Live",
    accent: "sage",
    image: "/images/observability-ui.webp",
    teaser:
      "Break a demo service on purpose, then watch the pipeline detect and recover on its own.",
    tags: ["CI/CD", "Chaos", "Recovery"],
    stack: ["CI/CD", "Chaos testing", "Auto-recovery", "Deployment logging"],
    overview:
      "A deployment-history dashboard for a self-healing pipeline. It tracks every deploy of a demo service, lets you run chaos tests against it, and shows the service detecting failure and recovering without human intervention. The point is to make auto-recovery observable rather than theoretical — you break it on purpose, then watch the pipeline put it back.",
    architecture: [
      {
        label: "Deployment log",
        body: "Every deploy of the demo service is recorded and surfaced as history, so the dashboard shows a timeline rather than a single current state.",
      },
      {
        label: "Chaos trigger",
        body: "The UI exposes a control to deliberately break the running service — failure is induced on demand instead of waited for.",
      },
      {
        label: "Detection and recovery",
        body: "The pipeline notices the broken state and redeploys to a healthy one on its own. No manual step sits between the failure and the fix.",
      },
      {
        label: "Static hosting",
        body: "The dashboard itself is served from GitHub Pages, so the demo has no backend of its own to keep alive.",
      },
    ],
    highlights: [
      "Auto-recovery you can watch happen rather than read about",
      "Chaos testing exposed as a button, not a runbook",
      "Full deploy history rather than a single health badge",
    ],
    links: [
      { url: "https://www.srinidevops.com/Self-Healing-Deployment/", label: "Open demo ↗" },
      { url: "https://github.com/Srinivasan-78/Self-Healing-Deployment", label: "Source ↗" },
    ],
  },
  {
    slug: "pdf-tools",
    title: "PDF Tools",
    client: "Live & deployed",
    category: "Utility",
    status: "Live",
    accent: "sage",
    image: "/images/banner-code.webp",
    teaser:
      "Drag-and-drop PDF processing that never leaves the browser — nothing uploaded, nothing stored.",
    tags: ["Client-side", "Zero upload", "Static"],
    stack: ["Client-side", "Zero upload", "Static hosting"],
    overview:
      "A drag-and-drop PDF utility that runs entirely in the browser. Drop one or more files, process, download — nothing is uploaded and nothing is stored on a server. Client-side processing means it works offline and handles sensitive documents without them ever leaving the machine.",
    architecture: [
      {
        label: "In-browser processing",
        body: "All file handling happens in the page itself. There is no upload step, so there is no server-side copy to secure, expire or delete.",
      },
      {
        label: "Drag-and-drop intake",
        body: "Files are accepted by dropping them onto the page, one or many at a time, then processed and handed straight back as a download.",
      },
      {
        label: "Static deployment",
        body: "Served as a static site, which is what makes offline use possible — once loaded, the tool keeps working without a network round trip.",
      },
    ],
    highlights: [
      "Sensitive documents never leave the machine",
      "Works offline after first load",
      "No backend, no storage, no retention policy to trust",
    ],
    links: [{ url: "https://www.srinidevops.com/pdf/", label: "Open tool ↗" }],
  },
  {
    slug: "vfactor-solutions",
    title: "vFactor Solutions",
    client: "Live & deployed",
    category: "Client build",
    status: "Live",
    accent: "sage",
    image: "/images/globe-network.webp",
    teaser:
      "A full recruitment-consultancy site — services, reviews, and contact — on its own domain.",
    tags: ["Static site", "DNS", "HTTPS"],
    stack: ["Static site", "Custom domain", "DNS + HTTPS", "Client build"],
    overview:
      "A complete marketing site for a recruitment, RPO and lead-generation consultancy — services, career timeline, client reviews with a submission flow, and contact routing, running on its own custom domain. Built and deployed end to end: static site, custom domain with DNS and HTTPS, no CMS or backend to maintain.",
    architecture: [
      {
        label: "Content sections",
        body: "Services, a career timeline, and client reviews with a submission flow, plus contact routing for inbound enquiries.",
      },
      {
        label: "Domain and certificates",
        body: "Runs on its own custom domain with DNS and HTTPS configured as part of the delivery, not left to the client.",
      },
      {
        label: "No CMS",
        body: "Deliberately static. Nothing to patch, no admin login to compromise, and hosting cost stays effectively zero.",
      },
    ],
    highlights: [
      "Delivered end to end — build, domain, DNS, TLS",
      "Review submission flow without a backend",
      "Zero ongoing maintenance surface",
    ],
    links: [{ url: "https://vfactorsolutions.com/", label: "Visit site ↗" }],
  },
  {
    slug: "multi-cloud-free-tier-platform",
    title: "Multi-Cloud Free-Tier Platform",
    client: "Platform engineering",
    category: "Infrastructure",
    status: "Work in progress",
    accent: "slate",
    image: "/images/multicloud-sky.webp",
    teaser:
      "One dashboard provisions free-tier compute across four clouds via Terraform, with an hourly auto-destroy sweep.",
    tags: ["Terraform", "FastAPI", "Multi-tenant"],
    stack: ["Terraform", "FastAPI", "Celery", "Next.js", "Postgres", "Docker Compose", "Multi-tenant"],
    overview:
      "A single dashboard that provisions compute across AWS, GCP, Azure and Oracle Cloud — strictly inside each provider's free tier — using Terraform, with a unified status view and cost comparison. The hard part is not provisioning; it is guaranteeing a user cannot accidentally spend money.",
    architecture: [
      {
        label: "Request path",
        body: "Next.js frontend → FastAPI → Celery → Terraform. Provisioning is queued rather than run inline, so a slow cloud API never blocks the request.",
      },
      {
        label: "Free-tier enforcement",
        body: "Every request is checked against a hardcoded free-tier allowlist server-side before Terraform runs, then mirrored again as Terraform variable validation. Two independent gates, so bypassing the API alone is not enough.",
      },
      {
        label: "Tenant isolation",
        body: "Per-tenant Terraform workspaces keep state isolated. One user's plan or destroy can never touch another user's resources.",
      },
      {
        label: "Auto-destroy sweep",
        body: "An hourly job tears down anything past its 24-hour safety window — the backstop for resources a user forgets about.",
      },
      {
        label: "Credential storage",
        body: "Postgres holds users, resources and credentials, with cloud credentials Fernet-encrypted at rest.",
      },
    ],
    highlights: [
      "Free-tier allowlist enforced twice, in two different layers",
      "Hourly sweep caps blast radius at 24 hours",
      "Per-tenant Terraform state isolation",
      "Encrypted credential storage at rest",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Multicloud", label: "View repo ↗" }],
  },
  {
    slug: "multi-ai-toolkit",
    title: "Multi-AI Toolkit",
    client: "Platform engineering",
    category: "Orchestration",
    status: "Active",
    accent: "slate",
    image: "/images/circuit-macro.webp",
    teaser:
      "Claude plans, free-tier APIs do the legwork — stretching a single request across five providers.",
    tags: ["Python", "LLM routing", "Failover"],
    stack: ["Python", "Claude API", "Groq", "Gemini", "OpenRouter", "Task orchestration"],
    overview:
      "Claude leads: it decomposes a task and synthesizes the final answer, while free-tier APIs — Groq, Gemini, OpenRouter, Mistral, Cerebras — run the subtasks in parallel underneath it. The goal is squeezing more usable output from a token budget by letting the free-tier models absorb the grunt work.",
    architecture: [
      {
        label: "CLI entrypoint",
        body: "A task goes in at the command line. Everything downstream is driven from that single input.",
      },
      {
        label: "Planner",
        body: "Breaks the task into subtasks and writes the synthesis prompts that will later recombine the results.",
      },
      {
        label: "Orchestrator",
        body: "Dispatches each subtask to whichever provider config.yaml routes it to, running them in parallel rather than in sequence.",
      },
      {
        label: "Provider failover",
        body: "If a provider fails or rate-limits, the subtask falls through to another provider automatically instead of failing the run.",
      },
      {
        label: "Synthesis",
        body: "Claude recombines the subtask outputs into the final answer, so the expensive model is spent on planning and judgement rather than bulk generation.",
      },
    ],
    highlights: [
      "Expensive model used for planning and synthesis only",
      "Provider routing driven by config.yaml, not code changes",
      "Automatic fallback across five free-tier providers",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Multi_AI", label: "View repo ↗" }],
  },
  {
    slug: "zim-assistant",
    title: "Zim Assistant",
    client: "Platform engineering",
    category: "Homelab",
    status: "Active",
    accent: "slate",
    image: "/images/racks-corridor.webp",
    teaser: "A homelab chatbot that searches offline Wikipedia snapshots through a local LLM.",
    tags: ["Python", "Kiwix", "Self-hosted"],
    stack: ["Python", "Kiwix", ".zim archives", "Batch", "Self-hosted"],
    overview:
      "Tooling for running a homelab around .zim archives — offline snapshots of Wikipedia and similar knowledge bases, served locally through Kiwix. The result is a knowledge assistant that keeps working with the internet unplugged.",
    architecture: [
      {
        label: "Archive layer",
        body: "Kiwix serves .zim files locally, turning offline encyclopedia snapshots into a searchable local source.",
      },
      {
        label: "Application layer",
        body: "A Python app sits over the archives with a UI layer for querying them conversationally.",
      },
      {
        label: "Launcher",
        body: "A Windows batch launcher brings the whole stack up in one step rather than starting each piece by hand.",
      },
    ],
    highlights: [
      "Fully offline — no external API in the query path",
      "Runs on ordinary homelab hardware",
      "Single-command startup for the whole stack",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Homelabbing", label: "View repo ↗" }],
  },
  {
    slug: "simple-actions",
    title: "Simple-Actions",
    client: "CI/CD & packaging",
    category: "Pipelines",
    status: "Reference",
    accent: "plum",
    image: "/images/terraform-plan.webp",
    teaser:
      "Reusable GitHub Actions templates that build, sign, and release Windows/Linux installers end to end.",
    tags: ["Actions", "Signing", "Release"],
    stack: ["GitHub Actions", "Self-hosted runners", "MSBuild", "Code signing", "dpkg", "Batch"],
    overview:
      "A library of GitHub Actions workflow templates for building, signing, packaging and cleaning up release artifacts across Windows and Linux runners — the scaffolding a desktop project needs before it can ship a release at all.",
    architecture: [
      {
        label: "Build stage",
        body: "Runs on a Windows runner: NuGet restore, MSBuild, then installer construction.",
      },
      {
        label: "Signing stage",
        body: "Isolated to a self-hosted runner so signing keys never touch a shared GitHub-hosted runner. This split is the reason the pipeline is composite rather than a single job.",
      },
      {
        label: "Publish stage",
        body: "Pushes the signed output as a GitHub release.",
      },
      {
        label: "Cleanup stage",
        body: "Purges intermediate artifacts once the release exists, so storage does not grow with every build.",
      },
    ],
    highlights: [
      "Signing keys confined to self-hosted infrastructure",
      "Windows and Linux packaging in one template set",
      "Artifact cleanup built into the pipeline, not bolted on",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Simple-Actions", label: "View repo ↗" }],
  },
  {
    slug: "wix-installer-template",
    title: "WiX Installer Template",
    client: "CI/CD & packaging",
    category: "Packaging",
    status: "Reference",
    accent: "plum",
    image: "/images/motherboard-epyc.webp",
    teaser: "A WiX scaffold that turns a build output into a signed MSI, shortcuts and all.",
    tags: ["WiX", "MSI", "MSBuild"],
    stack: ["WiX Toolset v3", "MSBuild", "Heat harvesting", "MSI", "XML"],
    overview:
      "A reusable WiX Toolset scaffold that turns a desktop app build into a Windows MSI — directory layout, shortcuts, localization and upgrade handling already wired up, so a new project does not restart from an empty .wxs file.",
    architecture: [
      {
        label: "Component harvesting",
        body: "Uses Heat to harvest published build output into components automatically rather than hand-listing every file — the part of WiX that otherwise rots fastest as a project grows.",
      },
      {
        label: "Install layout",
        body: "Directory structure, shortcuts and localization are defined up front as reusable scaffolding.",
      },
      {
        label: "Upgrade handling",
        body: "Upgrade logic is wired in from the start so successive versions replace cleanly instead of installing side by side.",
      },
    ],
    highlights: [
      "No hand-maintained file manifests",
      "Upgrade path correct from the first release",
      "Drop-in starting point for any MSBuild desktop project",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/WixTemplate", label: "View repo ↗" }],
  },
  {
    slug: "brainrot-study",
    title: "Brainrot Study",
    client: "CI/CD & packaging",
    category: "Automation",
    status: "In progress",
    accent: "plum",
    image: "/images/banner-code.webp",
    teaser: "Type a topic, get back a finished short-form study video — script to voiceover to render.",
    tags: ["Actions", "FFmpeg", "TTS"],
    stack: ["GitHub Actions", "Python", "FFmpeg", "Edge-TTS", "LLM APIs", "Failover logic"],
    overview:
      "Type a study topic into a workflow input, get back a finished short-form educational video. GitHub Actions is the entire runtime — no servers, no frontend, no backend to maintain.",
    architecture: [
      {
        label: "Stage 1 — research",
        body: "Gathers the source material for the requested topic.",
      },
      {
        label: "Stage 2 — script generation",
        body: "Produces the script under a strict-JSON contract, so downstream stages parse a known shape rather than guessing at free text.",
      },
      {
        label: "Stage 3 — voiceover",
        body: "Edge-TTS turns the script into narration audio.",
      },
      {
        label: "Stage 4 — assembly",
        body: "FFmpeg combines audio, captions and footage into the finished short.",
      },
      {
        label: "LLM failover",
        body: "Rate limits are expected rather than exceptional — the pipeline fails over to another model automatically instead of aborting the run.",
      },
    ],
    highlights: [
      "Entire runtime is GitHub Actions — zero hosting cost",
      "Strict-JSON contract between stages",
      "Automatic model failover on rate limits",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Brainrot_Study", label: "View repo ↗" }],
  },
  {
    slug: "matter-test-harness-image-builder",
    title: "Matter Test Harness Image Builder",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    accent: "brass",
    image: "/images/cabling-blue.webp",
    teaser: "Turns a bare Pi into a certified Matter test harness, then images the finished SD card.",
    tags: ["Bash", "Matter", "Raspberry Pi"],
    stack: ["Bash", "Raspberry Pi", "Ubuntu 22.04", "Docker", "Matter / CHIP", "PiShrink"],
    overview:
      "Bash automation that provisions a Raspberry Pi running Ubuntu 22.04 into a complete Matter (CHIP) Test Harness — then produces a compressed, distributable SD-card image of the finished environment, so the next machine is a flash rather than a rebuild.",
    architecture: [
      {
        label: "Dependency install",
        body: "Installs Docker, Poetry and the system dependencies the harness needs on a clean Ubuntu 22.04 Pi.",
      },
      {
        label: "Harness build",
        body: "Clones and builds the chip-certification-tool harness on the device itself.",
      },
      {
        label: "Imaging",
        body: "Images the live SD card with dcfldd, capturing the fully provisioned environment rather than a fresh install.",
      },
      {
        label: "Shrink",
        body: "PiShrink compresses the result so the image is distributable instead of card-sized.",
      },
    ],
    highlights: [
      "Certification environment reduced to a single flash",
      "Captures the built state, not a bootstrap script",
      "Distributable image size via PiShrink",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/ImgCreation", label: "View repo ↗" }],
  },
  {
    slug: "imgautomation",
    title: "ImgAutomation",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    accent: "brass",
    image: "/images/htop-terminal.webp",
    teaser: "The unattended bootstrap half of the imaging pipeline — resumes itself after every reboot.",
    tags: ["Bash", "Bootstrap", "Unattended"],
    stack: ["Bash", "Raspberry Pi", "Auto-start hooks", "Git automation"],
    overview:
      "The bootstrap half of the imaging pipeline. It takes a vanilla Ubuntu Pi and gets it to the point where the image builder can take over, unattended — which is the awkward part, because the process spans reboots.",
    architecture: [
      {
        label: "Repo staging",
        body: "Clones the build repo onto an attached external disk rather than the SD card, keeping the card clean for imaging.",
      },
      {
        label: "Reboot survival",
        body: "Installs a login hook so the build resumes automatically after reboot — the mechanism that makes the run genuinely unattended.",
      },
      {
        label: "Handoff",
        body: "Hands control to the main image-builder orchestrator once the machine is in a known state.",
      },
    ],
    highlights: [
      "Survives the reboots a Pi provisioning run requires",
      "Build artifacts kept off the card being imaged",
      "Clean handoff boundary with the image builder",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/ImgAutomation", label: "View repo ↗" }],
  },
  {
    slug: "speedtestdd",
    title: "SpeedTestDD",
    client: "Utilities",
    category: "Benchmark",
    status: "Complete",
    accent: "sage",
    image: "/images/banner-datacenter.webp",
    teaser: "Sweeps dd block sizes from 512B to 64MB to find the fastest one for this disk.",
    tags: ["Bash", "dd", "I/O"],
    stack: ["Bash", "dd", "I/O benchmarking", "Cache-aware"],
    overview:
      "Benchmarks the optimal dd block size for a given machine by sweeping sizes from 512 B to 64 MB and reporting throughput for each — useful before imaging or cloning drives, where the wrong block size costs hours.",
    architecture: [
      {
        label: "Sweep",
        body: "Runs dd across the full block-size range and records throughput at each step.",
      },
      {
        label: "Cache handling",
        body: "Clears the kernel page cache between runs so the numbers reflect real disk I/O rather than memory speed — without this the sweep measures RAM and every size looks fast.",
      },
      {
        label: "Report",
        body: "Reports throughput per block size so the best value for that specific machine and disk is obvious.",
      },
    ],
    highlights: [
      "Cache-aware, so results are not fiction",
      "Answers one narrow question properly",
      "Run it once before a long imaging job",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/SpeedTestDD", label: "View repo ↗" }],
  },
];

export const CATEGORIES = Array.from(new Set(PROJECTS.map((p) => p.client)));

export function projectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
