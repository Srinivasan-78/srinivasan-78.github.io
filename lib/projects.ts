export type ProjectLink = { url: string; label: string };

/* A project may legitimately have no links: some of these live in
   repositories that are not public. An empty `links` array is that case,
   said out loud — app/projects/[slug]/page.tsx turns it into a contact CTA
   rather than rendering an empty button row. What must never appear here is
   a URL that 404s: a "View repo" button that goes nowhere is worse than no
   button, and every entry below is checked against the live URL. */

export type Project = {
  slug: string;
  title: string;
  /* Shown top-left on the card, the way the reference shows a client name. */
  client: string;
  category: string;
  status: string;
  teaser: string;
  /* Short pills on the card face — kept to 3 so the texture never overflows. */
  tags: string[];
  stack: string[];
  /* Key into the schematic map in ProjectGrid. Defaults to `title`;
     set only where the two have drifted apart. */
  schematic?: string;
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
    teaser:
      "Trigger a fault on purpose, then watch the pipeline spot it and heal itself.",
    tags: ["CI/CD", "Chaos", "Recovery"],
    stack: ["CI/CD", "Chaos testing", "Auto-recovery", "Deployment logging"],
    overview:
      "A deployment-history dashboard sitting on top of a self-healing pipeline. It records every deploy of a demo service, hands you a button that triggers a fault, then shows the service spotting it and restoring itself. Auto-recovery is easy to claim, so this one lets you watch it work.",
    architecture: [
      {
        label: "Deployment log",
        body: "Every deploy gets recorded, so the dashboard gives you the whole timeline alongside the current state.",
      },
      {
        label: "Chaos trigger",
        body: "A control in the UI triggers a fault on demand, so you can prove recovery whenever you like rather than waiting for a real one.",
      },
      {
        label: "Detection and recovery",
        body: "The pipeline spots the unhealthy state and redeploys to a healthy one by itself. The fix follows the fault automatically, every time.",
      },
      {
        label: "Static hosting",
        body: "The dashboard is served from GitHub Pages, which keeps the demo free to run and always available.",
      },
    ],
    highlights: [
      "Auto-recovery you can watch happen for yourself",
      "Chaos testing is a button in the UI",
      "A full deploy history, with every run kept",
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
    teaser:
      "Drag-and-drop PDF processing that stays entirely in your browser. Your files stay yours.",
    tags: ["Client-side", "Zero upload", "Static"],
    stack: ["Client-side", "Zero upload", "Static hosting"],
    overview:
      "A drag-and-drop PDF utility that runs entirely in the browser. Drop a file or several, process, download. Everything stays on your own machine, which is what lets it keep working offline and makes it safe for sensitive documents.",
    architecture: [
      {
        label: "In-browser processing",
        body: "All the file handling happens right in the page, so your files stay on your device from start to finish.",
      },
      {
        label: "Drag-and-drop intake",
        body: "You drop files onto the page, one or many at a time, and they come straight back as a download.",
      },
      {
        label: "Static deployment",
        body: "Served as a static site, which is what makes offline use work. Once the page has loaded, it keeps going happily on its own.",
      },
    ],
    highlights: [
      "Sensitive documents stay on your own machine",
      "Works offline after the first load",
      "Fully local, so you keep complete control of your files",
    ],
    links: [{ url: "https://www.srinidevops.com/pdf/", label: "Open tool ↗" }],
  },
  {
    slug: "vfactor-solutions",
    title: "vFactor Solutions",
    client: "Live & deployed",
    category: "Client build",
    status: "Live",
    teaser:
      "A full recruitment-consultancy site on its own domain: services, reviews, contact.",
    tags: ["Static site", "DNS", "HTTPS"],
    stack: ["Static site", "Custom domain", "DNS + HTTPS", "Client build"],
    overview:
      "A complete marketing site for a recruitment, RPO and lead-generation consultancy. Services, a career timeline, client reviews with a submission flow, contact routing, all on the client's own domain. I built and deployed the whole thing, DNS and HTTPS included, and it has run itself ever since.",
    architecture: [
      {
        label: "Content sections",
        body: "Services, a career timeline, and client reviews with a submission flow, plus routing for enquiries that come in.",
      },
      {
        label: "Domain and certificates",
        body: "Runs on its own custom domain, with DNS and HTTPS set up as part of the delivery rather than handed back to the client to sort out.",
      },
      {
        label: "No CMS",
        body: "Static on purpose, which keeps it fast, secure by default, and effectively free to host.",
      },
    ],
    highlights: [
      "Delivered end to end: build, domain, DNS, TLS",
      "Review submission flow without a backend",
      "Runs itself now that it is live",
    ],
    links: [{ url: "https://vfactorsolutions.com/", label: "Visit site ↗" }],
  },
  {
    slug: "multi-cloud-free-tier-platform",
    title: "Multi-Cloud Free-Tier Platform",
    client: "Platform engineering",
    category: "Infrastructure",
    status: "Work in progress",
    teaser:
      "One dashboard provisions free-tier compute across four clouds with Terraform, and an hourly sweep keeps every account tidy.",
    tags: ["Terraform", "FastAPI", "Multi-tenant"],
    stack: ["Terraform", "FastAPI", "Celery", "Next.js", "Postgres", "Docker Compose", "Multi-tenant"],
    overview:
      "A single dashboard that provisions compute across AWS, GCP, Azure and Oracle Cloud with Terraform, strictly inside each provider's free tier, with one status view and a cost comparison across all four. Provisioning is the straightforward part. The interesting work is guaranteeing every user stays comfortably inside the free tier.",
    architecture: [
      {
        label: "Request path",
        body: "Next.js frontend → FastAPI → Celery → Terraform. Provisioning goes on a queue rather than running inline, so every request stays fast even when a cloud API takes its time.",
      },
      {
        label: "Free-tier enforcement",
        body: "Every request is checked server-side against a hardcoded free-tier allowlist before Terraform runs, then checked again as Terraform variable validation. Two independent gates, so the free-tier promise holds either way.",
      },
      {
        label: "Tenant isolation",
        body: "Each tenant gets its own Terraform workspace, so state stays cleanly separate and every user's resources remain entirely their own.",
      },
      {
        label: "Auto-destroy sweep",
        body: "An hourly job clears anything past its 24-hour window, so accounts stay tidy even when a resource is forgotten.",
      },
      {
        label: "Credential storage",
        body: "Postgres holds users, resources and credentials, with cloud credentials Fernet-encrypted at rest.",
      },
    ],
    highlights: [
      "Free-tier allowlist enforced twice, in two different layers",
      "Every resource is tidied up within 24 hours",
      "Per-tenant Terraform state isolation",
      "Cloud credentials encrypted at rest",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Multicloud", label: "View repo ↗" }],
  },
  {
    slug: "multi-ai-toolkit",
    title: "Multi-AI Toolkit",
    client: "Platform engineering",
    category: "Orchestration",
    status: "Active",
    teaser:
      "Claude does the planning, free-tier APIs do the legwork, and one request gets spread across five providers.",
    tags: ["Python", "LLM routing", "Failover"],
    stack: ["Python", "Claude API", "Groq", "Gemini", "OpenRouter", "Task orchestration"],
    overview:
      "Claude leads. It splits a task into subtasks and writes the final answer, while free-tier APIs (Groq, Gemini, OpenRouter, Mistral, Cerebras) run those subtasks in parallel underneath. The idea is to get far more out of a token budget by letting the free models take on the bulk work.",
    architecture: [
      {
        label: "CLI entrypoint",
        body: "You type a task at the command line. Everything downstream runs off that one input.",
      },
      {
        label: "Planner",
        body: "Splits the task into subtasks and writes the synthesis prompts that will put the results back together later.",
      },
      {
        label: "Orchestrator",
        body: "Sends each subtask to whichever provider config.yaml points it at, and runs them all at once rather than one after another.",
      },
      {
        label: "Provider failover",
        body: "If a provider rate-limits, the subtask moves to another one automatically and the run carries straight on.",
      },
      {
        label: "Synthesis",
        body: "Claude puts the subtask outputs back together into the final answer, so the expensive model only gets spent on planning and judgement.",
      },
    ],
    highlights: [
      "The expensive model only plans and synthesises",
      "Routing lives in config.yaml, so swapping providers is not a code change",
      "Five free-tier providers ready to pick up the work",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Multi_AI", label: "View repo ↗" }],
  },
  {
    slug: "repo2graph",
    title: "repo2graph",
    client: "Platform engineering",
    category: "Code intelligence",
    status: "Active",
    teaser:
      "Point it at a codebase and it draws the map: a queryable graph of who calls what, plus chunks ready for a RAG pipeline.",
    tags: ["Python", "tree-sitter", "RAG"],
    stack: ["Python", "tree-sitter", "Neo4j / Cypher", "GraphML", "GitHub Actions", "JSONL"],
    overview:
      "Reading an unfamiliar repo means drawing a map on a whiteboard: these files sit in these folders, this function calls that one, this class inherits from that one. repo2graph draws that map for you. It parses every source file with tree-sitter, turns files, folders, functions, classes and imports into a graph, and cuts the code into retrieval chunks that each carry their own graph neighbourhood in the header. Plain text search finds files that mention a thing; a graph finds the files that do it, and hands you their neighbours too.",
    architecture: [
      {
        label: "Parsing",
        body: "tree-sitter reads real code structure rather than regexes, so it works on a repo it has never seen with no configuration. Sixteen languages get full symbol and call extraction; everything else still lands on the map as files and directories.",
      },
      {
        label: "Graph model",
        body: "Files, directories, symbols and imported modules become nodes; CONTAINS, DEFINES, IMPORTS, CALLS, INHERITS and CO_CHANGE become edges. Node ids are readable enough to construct by hand, like sym:pkg/mod.py::Class.method.",
      },
      {
        label: "Co-change edges",
        body: "Reading the last N commits adds \u201cthese files keep changing together\u201d links, which are surprisingly good at revealing coupling nothing in the code makes obvious.",
      },
      {
        label: "Chunking for retrieval",
        body: "Roughly one chunk per function or class, each opening with its callers, its callees and its docstring. Embed those and a question like \u201chow does login work?\u201d matches the code that handles login, not whatever shares a few words with the question.",
      },
      {
        label: "Built-in retriever",
        body: "Lexical scoring plus a one-hop walk across the graph, so callers and callees come along with every hit. No embedding model, no vector database, no API key needed to start.",
      },
      {
        label: "Exports and automation",
        body: "Writes JSONL, GraphML and an idempotent Cypher script for Neo4j. A composite Action keeps a graph beside your own code, and a workflow_dispatch job indexes any repo from the Actions tab.",
      },
    ],
    highlights: [
      "Sixteen languages parsed with tree-sitter, zero configuration",
      "Chunks carry their graph neighbourhood, so retrieval lands on the right code",
      "Honest about approximation: call edges carry a confidence score",
      "overview.md is written for a person to read first",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/repo2graph", label: "View repo \u2197" }],
  },
  {
    slug: "zim-assistant",
    title: "Zim Assistant",
    client: "Platform engineering",
    category: "Homelab",
    status: "Active",
    teaser: "A homelab chatbot that searches offline Wikipedia snapshots through a local LLM.",
    tags: ["Python", "Kiwix", "Self-hosted"],
    stack: ["Python", "Kiwix", ".zim archives", "Batch", "Self-hosted"],
    overview:
      "Tooling for running a homelab around .zim archives, which are offline snapshots of Wikipedia and similar knowledge bases, served locally through Kiwix. What you end up with is a knowledge assistant that keeps working happily with the internet unplugged.",
    architecture: [
      {
        label: "Archive layer",
        body: "Kiwix serves the .zim files locally, which turns an offline encyclopedia snapshot into something you can search in full.",
      },
      {
        label: "Application layer",
        body: "A Python app sits over the archives with a UI for querying them conversationally.",
      },
      {
        label: "Launcher",
        body: "A Windows batch launcher brings the whole stack up in one go.",
      },
    ],
    highlights: [
      "Fully offline: every answer comes from your own archives",
      "Runs on ordinary homelab hardware",
      "One command starts the whole stack",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Homelabbing", label: "View repo ↗" }],
  },
  {
    slug: "simple-actions",
    title: "Simple-Actions",
    client: "CI/CD & packaging",
    category: "Pipelines",
    status: "Reference",
    teaser:
      "Reusable GitHub Actions templates that build, sign and release Windows and Linux installers.",
    tags: ["Actions", "Signing", "Release"],
    stack: ["GitHub Actions", "Self-hosted runners", "MSBuild", "Code signing", "dpkg", "Batch"],
    overview:
      "A library of GitHub Actions workflow templates for building, signing, packaging and cleaning up release artifacts on Windows and Linux runners. It is the scaffolding that gets a desktop project shipping proper releases on day one.",
    architecture: [
      {
        label: "Build stage",
        body: "Runs on a Windows runner: NuGet restore, MSBuild, then building the installer.",
      },
      {
        label: "Signing stage",
        body: "Kept on a self-hosted runner so signing keys stay entirely under your own control. That split is the whole reason the pipeline is composite rather than a single job.",
      },
      {
        label: "Publish stage",
        body: "Pushes the signed output out as a GitHub release.",
      },
      {
        label: "Cleanup stage",
        body: "Clears the intermediate artifacts once the release is published, so storage stays lean build after build.",
      },
    ],
    highlights: [
      "Signing keys stay on infrastructure you own",
      "Windows and Linux packaging in one set of templates",
      "Artifact cleanup is part of the pipeline itself",
    ],
    /* No public link. https://github.com/Srinivasan-78/Simple-Actions answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "doc2md-action",
    title: "doc2md-action",
    client: "CI/CD & packaging",
    category: "Actions",
    status: "Active",
    teaser:
      "A GitHub Action that turns PDFs, Office files and scans into Markdown on every push, OCR included.",
    tags: ["Actions", "OCR", "Markdown"],
    stack: ["GitHub Actions", "Python", "Tesseract OCR", "LibreOffice", "Markdown"],
    overview:
      "AI tools and code search cannot read a .pdf or an .xlsx \u2014 they read text. This action does the reading on every push and leaves behind Markdown anyone, or anything, can open. Point it at a folder of documents, get back one .md per file plus an optional single merged file for pasting into a model.",
    architecture: [
      {
        label: "Extraction",
        body: "PDFs give up their text per page; Word, PowerPoint and HTML become headings, paragraphs and lists; Excel and CSV become one Markdown table per sheet. Legacy .doc, .xls and .ppt are converted through LibreOffice first.",
      },
      {
        label: "OCR fallback",
        body: "A PDF page with almost no extractable text is treated as a scan and read with Tesseract. Auto by default, so OCR only costs time on the pages that actually need it.",
      },
      {
        label: "Token trimming",
        body: "Compact mode drops blank lines and the headers and footers repeated on every page, and the run reports total tokens and the percentage saved.",
      },
      {
        label: "Traceability",
        body: "Every output file opens with a header naming the document it came from, and a manifest.json records page counts and whether OCR was needed, so any sentence traces back to its source.",
      },
      {
        label: "Failure handling",
        body: "One unreadable document does not stop the run: it is counted as failed and everything else still converts, unless you ask the job to fail on error.",
      },
    ],
    highlights: [
      "Scanned pages handled by OCR without being asked",
      "Outputs and a run-summary table you can wire into later steps",
      "One merged file when you want to paste a whole doc set into a model",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/doc2md-action", label: "View repo \u2197" }],
  },
  {
    slug: "wix-installer-template",
    title: "WiX Installer Template",
    client: "CI/CD & packaging",
    category: "Packaging",
    status: "Reference",
    teaser: "A WiX scaffold that turns a build output into a signed MSI, shortcuts and all.",
    tags: ["WiX", "MSI", "MSBuild"],
    stack: ["WiX Toolset v3", "MSBuild", "Heat harvesting", "MSI", "XML"],
    overview:
      "A reusable WiX Toolset scaffold that turns a desktop app build into a Windows MSI. Directory layout, shortcuts, localization and upgrade handling are already wired up, so a new project starts from a working scaffold.",
    architecture: [
      {
        label: "Component harvesting",
        body: "Heat harvests the published build output into components automatically, so the manifest stays correct as the project grows.",
      },
      {
        label: "Install layout",
        body: "Directory structure, shortcuts and localization are set up front and reused.",
      },
      {
        label: "Upgrade handling",
        body: "Upgrade logic is in from the start, so every later version replaces the last one cleanly.",
      },
    ],
    highlights: [
      "Manifests stay accurate on their own",
      "Upgrade path is right from the first release",
      "Drops into any MSBuild desktop project",
    ],
    /* No public link. https://github.com/Srinivasan-78/WixTemplate answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "brainrot-study",
    title: "Brainrot Study",
    schematic: "Brainrot Study — automated video pipeline",
    client: "CI/CD & packaging",
    category: "Automation",
    status: "In progress",
    teaser: "Type in a topic and get back a finished short-form study video: script, voiceover, render.",
    tags: ["Actions", "FFmpeg", "TTS"],
    stack: ["GitHub Actions", "Python", "FFmpeg", "Edge-TTS", "LLM APIs", "Failover logic"],
    overview:
      "Put a study topic into a workflow input and a finished short-form educational video comes out. GitHub Actions is the entire runtime, so it costs nothing to run and looks after itself between runs.",
    architecture: [
      {
        label: "Stage 1 — research",
        body: "Gathers the source material for whatever topic was asked for.",
      },
      {
        label: "Stage 2 — script generation",
        body: "Writes the script under a strict-JSON contract, so the later stages always parse a known shape.",
      },
      {
        label: "Stage 3 — voiceover",
        body: "Edge-TTS turns the script into narration.",
      },
      {
        label: "Stage 4 — assembly",
        body: "FFmpeg puts the audio, captions and footage together into the finished short.",
      },
      {
        label: "LLM failover",
        body: "Rate limits are planned for, so the pipeline switches to another model on its own and the run finishes either way.",
      },
    ],
    highlights: [
      "Runs entirely on GitHub Actions, so hosting costs nothing",
      "Strict-JSON contract between stages",
      "Switches models by itself to keep the run moving",
    ],
    links: [{ url: "https://github.com/Srinivasan-78/Brainrot_Study", label: "View repo ↗" }],
  },
  {
    slug: "matter-test-harness-image-builder",
    title: "Matter Test Harness Image Builder",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    teaser: "Turns a bare Pi into a certified Matter test harness, then images the finished SD card.",
    tags: ["Bash", "Matter", "Raspberry Pi"],
    stack: ["Bash", "Raspberry Pi", "Ubuntu 22.04", "Docker", "Matter / CHIP", "PiShrink"],
    overview:
      "Bash automation that takes a Raspberry Pi running Ubuntu 22.04 and turns it into a complete Matter (CHIP) Test Harness. It then makes a compressed, distributable image of the finished SD card, so setting up the next machine is a single flash.",
    architecture: [
      {
        label: "Dependency install",
        body: "Installs Docker, Poetry and the rest of the system dependencies the harness needs on a clean Ubuntu 22.04 Pi.",
      },
      {
        label: "Harness build",
        body: "Clones and builds the chip-certification-tool harness on the device itself.",
      },
      {
        label: "Imaging",
        body: "Images the live SD card with dcfldd, capturing the fully provisioned environment exactly as it stands.",
      },
      {
        label: "Shrink",
        body: "PiShrink compresses the result down to a size you can share easily.",
      },
    ],
    highlights: [
      "A certification environment reduced to one flash",
      "Captures the fully built state, ready to flash",
      "PiShrink keeps the image a sane size",
    ],
    /* No public link. https://github.com/Srinivasan-78/ImgCreation answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "imgautomation",
    title: "ImgAutomation",
    client: "Hardware & imaging",
    category: "Hardware",
    status: "Active",
    teaser: "The unattended bootstrap half of the imaging pipeline. It picks itself back up after every reboot.",
    tags: ["Bash", "Bootstrap", "Unattended"],
    stack: ["Bash", "Raspberry Pi", "Auto-start hooks", "Git automation"],
    overview:
      "The bootstrap half of the imaging pipeline. It takes a plain Ubuntu Pi and gets it to the point where the image builder can take over, entirely on its own. That is the clever part, because the process spans several reboots.",
    architecture: [
      {
        label: "Repo staging",
        body: "Clones the build repo onto an attached external disk rather than the SD card, which keeps the card pristine for imaging.",
      },
      {
        label: "Reboot survival",
        body: "Installs a login hook so the build picks up again after a reboot. That hook is what makes the run genuinely unattended.",
      },
      {
        label: "Handoff",
        body: "Hands over to the main image-builder orchestrator once the machine is in a known state.",
      },
    ],
    highlights: [
      "Carries straight through the reboots a Pi provisioning run needs",
      "Build artifacts stay off the card being imaged",
      "Clean handoff to the image builder",
    ],
    /* No public link. https://github.com/Srinivasan-78/ImgAutomation answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
  {
    slug: "speedtestdd",
    title: "SpeedTestDD",
    client: "Utilities",
    category: "Benchmark",
    status: "Complete",
    teaser: "Sweeps dd block sizes from 512B to 64MB to find the fastest one for this disk.",
    tags: ["Bash", "dd", "I/O"],
    stack: ["Bash", "dd", "I/O benchmarking", "Cache-aware"],
    overview:
      "Works out the best dd block size for a given machine by sweeping from 512 B up to 64 MB and reporting throughput at each step. Worth running before you image or clone a drive: the right block size can save you hours.",
    architecture: [
      {
        label: "Sweep",
        body: "Runs dd across the whole block-size range and records throughput at each step.",
      },
      {
        label: "Cache handling",
        body: "Clears the kernel page cache between runs, so every number reflects real disk I/O and you can trust the winner.",
      },
      {
        label: "Report",
        body: "Prints throughput per block size, so the right value for that particular machine and disk is obvious.",
      },
    ],
    highlights: [
      "Cache-aware, so you can trust every number",
      "Answers one narrow question properly",
      "Run it once before a long imaging job",
    ],
    /* No public link. https://github.com/Srinivasan-78/SpeedTestDD answered 404 to an
       anonymous request, so the button that pointed at it was a dead CTA.
       Restore the entry the moment the repository is public — the detail
       page reads an empty list as "offer the contact route instead". */
    links: [],
  },
];


export function projectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
