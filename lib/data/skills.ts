/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​​​​‌​‌​​‌​​‌​​​‌​‌​‌‌‌‌​​​​‌​‌​​​​​​‌‌​​‌‌​‌​‌​​‌‌​‌​​​‌‌​​‌‌​‌‌​‌​‌‌‌​​‌‌​‌​‌​‌​​​​‌‌‌​​​​​‌‌‌​​‌​‌​​​​​‌​‌​​‌​‌​​​‌‌​‌​‌​​‌​‌‌​‌​‌​​​​​‌​‌‌​​‌​​​‌‌​​‌​‌​‌​​‌​‌​​‌​‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.0RExP3SFmsT89AJ5-AdeJP
 */

/* The skills loadout, as data. Domain icons are tokens, not components. */

export type SkillDomainIconToken =
  | "cpu"
  | "git-branch"
  | "cloud"
  | "server"
  | "activity"
  | "terminal"
  | "shield";

export type SkillDetail = {
  name: string;
  category: string;
  role: string;
  productionContext: string;
  highlight: string;
  tenure: string;
  /* The build that demonstrates this skill, when one of the open-source
     projects does. The inspector card turns it into a link, so a claim in the
     workbench can be checked against real code rather than taken on trust. */
  project?: { slug: string; title: string };
};

export type DomainCluster = {
  id: string;
  label: string;
  icon: SkillDomainIconToken;
  description: string;
  primarySkills: SkillDetail[];
};

export const SKILL_DOMAINS: DomainCluster[] = [
  {
    id: "ai",
    label: "AI, LLM & MCP",
    icon: "cpu",
    description:
      "Model Context Protocol servers, graph-backed retrieval, and the context engineering that keeps an agent's token bill bounded.",
    primarySkills: [
      {
        name: "Model Context Protocol (MCP)",
        category: "AI, LLM & MCP",
        role: "Agent Tooling Protocol",
        productionContext:
          "Authored and published an MCP server exposing five read-only, annotated tools over both stdio and JSON-RPC HTTP, with bearer-token and OIDC authentication, stdlib-only JWT verification, and a refusal to bind past loopback unauthenticated.",
        highlight:
          "Listed on the MCP Registry and added to Claude Code, Claude Desktop or Cursor with a single command.",
        tenure: "Active focus",
        project: { slug: "repo2graph", title: "repo2graph" },
      },
      {
        name: "Context & Token Engineering",
        category: "AI, LLM & MCP",
        role: "LLM Cost Control",
        productionContext:
          "Built enforced token ceilings into retrieval — budgets re-measured after rendering rather than trusted, capped neighbour rows, bounded fan-out — and a skill set plus PreToolUse hook that strips noisy tool output before it ever enters a model's context.",
        highlight:
          "Attacks the re-sent context pile rather than reply length, which is where the overwhelming majority of tokens actually live.",
        tenure: "Active focus",
        project: { slug: "tokenmiser", title: "tokenmiser" },
      },
      {
        name: "GraphRAG & Retrieval",
        category: "AI, LLM & MCP",
        role: "Retrieval Architecture",
        productionContext:
          "Designed a retrieval layer combining BM25 lexical scoring, optional dense MiniLM fusion, and a one-hop walk across a tree-sitter code graph, chunked so every block arrives with its callers and callees in the header.",
        highlight:
          "Every retrieved block is stamped with its file and line range and the edge that pulled it in, so a model's claim can be checked rather than trusted.",
        tenure: "Active focus",
        project: { slug: "repo2graph", title: "repo2graph" },
      },
      {
        name: "Agentic Workflows & Subagents",
        category: "AI, LLM & MCP",
        role: "Multi-Agent Orchestration",
        productionContext:
          "Built a seven-phase build loop — plan, test, implement, review, verify, remember, improve — where each phase is its own bounded subagent with a written contract, communicating only through a single shared state file.",
        highlight:
          "Hard gates between phases: a run cannot skip its own tests, and four iterations without a clean verify hands back to the operator.",
        tenure: "Active focus",
        project: { slug: "agentic-app-loop", title: "Agentic App Loop" },
      },
      {
        name: "Multi-Provider LLM Routing",
        category: "AI, LLM & MCP",
        role: "Model Routing & Failover",
        productionContext:
          "Routed subtasks across Groq, Gemini, Mistral, Cerebras and OpenRouter by task type from a single config file, executing in parallel with automatic failover, while a frontier model handled only planning and synthesis.",
        highlight:
          "A rate-limited provider hands its subtask on rather than killing the run, and swapping the crew is a config edit, not a code change.",
        tenure: "Active focus",
        project: { slug: "multi-ai-toolkit", title: "Multi-AI Toolkit" },
      },
      {
        name: "Local LLM Hosting & Offline RAG",
        category: "AI, LLM & MCP",
        role: "Self-Hosted Inference",
        productionContext:
          "Runs a homelab chatbot over offline Wikipedia and Arch Wiki snapshots using FastAPI, Ollama with Llama 3.2, and Streamlit — retrieval and generation both local, with the internet unplugged.",
        highlight:
          "No API key, no per-token bill and no data leaving the box: the whole retrieval and inference path is self-hosted.",
        tenure: "Active focus",
        project: { slug: "zim-assistant", title: "Zim Assistant" },
      },
      {
        name: "AI Coding Tools & Model APIs",
        category: "AI, LLM & MCP",
        role: "Agentic Developer Tooling",
        productionContext:
          "Works daily across Claude Code, the Claude API, Cursor, GitHub Copilot, ChatGPT / OpenAI API, Google Gemini, Ollama, Llama, DeepSeek, Groq, OpenRouter and Hugging Face — and builds the tooling those agents consume rather than only consuming it.",
        highlight:
          "Prompt engineering and LLM API integration treated as an engineering surface with budgets and gates, not a chat window.",
        tenure: "Active focus",
        project: { slug: "repo2graph", title: "repo2graph" },
      },
    ],
  },
  {
    id: "cicd",
    label: "CI/CD & Automation",
    icon: "git-branch",
    description: "End-to-end automated pipelines with pre-merge gates, artifact signing, and automated rollback triggers.",
    primarySkills: [
      {
        name: "GitHub Actions",
        category: "CI/CD & Automation",
        role: "Workflow Orchestrator",
        productionContext: "Engineered self-service disaster recovery workflows and automated multi-environment deployment pipelines.",
        highlight: "Reduced release coordination time from hours to single-click execution.",
        tenure: "5+ Years",
      },
      {
        name: "GitLab CI",
        category: "CI/CD & Automation",
        role: "Pipeline Engine",
        productionContext: "Created automated build and test suites for embedded device firmware and Project MATTER protocol validation.",
        highlight: "Automated WiX Windows installer packaging upstreamed to Wireshark.",
        tenure: "3+ Years",
      },
      {
        name: "Azure Pipelines",
        category: "CI/CD & Automation",
        role: "Enterprise CI/CD",
        productionContext: "Configured multi-stage release gates and artifact promotion for microservices across staging and production.",
        highlight: "Integrated automated compliance and vulnerability gate validation.",
        tenure: "4+ Years",
      },
      {
        name: "Automated Rollback",
        category: "CI/CD & Automation",
        role: "Safety Mechanism",
        productionContext: "Built dual-slot container rollbacks that restore the prior healthy state within seconds if synthetic checks fail.",
        highlight: "Guaranteed zero-outage deployments for critical client-facing services.",
        tenure: "5 Years",
      },
      {
        name: "Azure DevOps REST API",
        category: "CI/CD & Automation",
        role: "Pipeline Integration",
        productionContext: "Drove container image promotion from GitHub Actions with real-time Azure DevOps, ACR and AKS log polling, so a promotion is observable while it runs rather than only after it finishes.",
        highlight: "Cross-platform orchestration: GitHub Actions as the control plane, Azure DevOps queried over its REST API.",
        tenure: "3+ Years",
      },
      {
        name: "WiX Toolset & dpkg Packaging",
        category: "CI/CD & Automation",
        role: "Installer & Package Builds",
        productionContext: "Automated WiX installer builds with code signing in GitHub Actions to produce release-ready signed Windows applications, and ran dpkg packaging in CI for Linux builds.",
        highlight: "A custom Windows Wireshark installer for THREAD protocol analysis was adopted after his departure and merged upstream into Wireshark.",
        tenure: "2+ Years",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud Architecture",
    icon: "cloud",
    description: "Multi-cloud infrastructure across Microsoft Azure and AWS with high-availability load balancing and storage.",
    primarySkills: [
      {
        name: "Microsoft Azure",
        category: "Cloud Architecture",
        role: "Primary Cloud Platform",
        productionContext: "Architected network load balancing (NLB), Azure Storage high-throughput data migrations, and ACR container registries.",
        highlight: "Migrated terabytes of enterprise assets in hours with delta detection and AzCopy.",
        tenure: "5 Years",
      },
      {
        name: "Amazon Web Services (AWS)",
        category: "Cloud Architecture",
        role: "Compute & Storage",
        productionContext: "Managed EC2 clusters, VPC networking, Security Groups, S3 buckets, and IAM role architectures.",
        highlight: "Optimized multi-region cloud workloads with tight cost guardrails.",
        tenure: "4 Years",
      },
      {
        name: "Terraform & Bicep",
        category: "Cloud Architecture",
        role: "Infrastructure as Code",
        productionContext: "Defined repeatable, immutable cloud infrastructure environments with parameterized modular templates.",
        highlight: "Eliminated configuration drift across staging and production subscriptions.",
        tenure: "4 Years",
      },
      {
        name: "Azure Network Load Balancers",
        category: "Cloud Architecture",
        role: "Traffic Distribution",
        productionContext: "Configured zero-downtime blue/green traffic shifts and backend health probe pools.",
        highlight: "Seamless live cutovers with zero dropped user sessions.",
        tenure: "5 Years",
      },
      {
        name: "Azure Service Bus & App Config",
        category: "Cloud Architecture",
        role: "Messaging & Configuration",
        productionContext: "Orchestrated disaster-recovery failover and failback through Azure Service Bus with structured Datadog logging, and drove conditional BYOK configuration through Azure App Config and Jinja2 templating.",
        highlight: "Zero data loss held across both same-region and cross-region Azure migrations.",
        tenure: "3+ Years",
      },
      {
        name: "Azure Storage & AzCopy at Scale",
        category: "Cloud Architecture",
        role: "Bulk Data Movement",
        productionContext: "Built the parallelized migration framework the platform's large-scale transfers run on: custom runners, chunked delta detection and parallel AzCopy orchestration, with SAS-authenticated Azure Table Storage driving inventory generation and migration-summary reporting.",
        highlight: "Terabyte-scale transfers moved from a weekend maintenance window into a few hours, with completeness reported rather than assumed.",
        tenure: "3+ Years",
      },
      {
        name: "Akamai & DNS/MX Automation",
        category: "Cloud Architecture",
        role: "Edge & Traffic Cutover",
        productionContext: "Automated DNS and MX cutovers in Python against the Akamai API as part of the recovery path, with Pingdom check updates following the cutover automatically.",
        highlight: "The riskiest manual step in a recovery — hand-editing DNS under time pressure — became code that had already been run.",
        tenure: "2+ Years",
      },
    ],
  },
  {
    id: "iac",
    label: "Config & Containers",
    icon: "server",
    description: "Configuration management, immutable container packaging, and declarative system orchestration.",
    primarySkills: [
      {
        name: "Docker & Multi-Arch Buildx",
        category: "Config & Containers",
        role: "Container Packaging",
        productionContext: "Built lightweight, multi-architecture Linux & ARM container images optimized for rapid deployment startup.",
        highlight: "Standardized microservices runtimes across diverse developer and production fleets.",
        tenure: "5 Years",
      },
      {
        name: "Ansible",
        category: "Config & Containers",
        role: "Configuration Management",
        productionContext: "Structured modular roles, vars/vault hierarchies, and Jinja2 templates for multi-node server configuration.",
        highlight: "Automated full environment provisioning with 100% idempotent playbooks.",
        tenure: "4+ Years",
      },
      {
        name: "Chef & Puppet",
        category: "Config & Containers",
        role: "Infrastructure State",
        productionContext: "Certified in Chef and Puppet configuration management for declarative system convergence and policy compliance.",
        highlight: "Maintained baseline security policies across enterprise server fleets.",
        tenure: "Certified (LinkedIn Learning)",
      },
      {
        name: "Linux (RHEL / Ubuntu)",
        category: "Config & Containers",
        role: "Operating System Layer",
        productionContext: "Kernel tuning, systemd service management, network stack debugging, and automated patch baselines.",
        highlight: "Hardened OS instances to CIS security benchmarks.",
        tenure: "5+ Years",
      },
      {
        name: "Jinja2 Templating",
        category: "Config & Containers",
        role: "Config Generation",
        productionContext: "Templated monitoring checks, conditional BYOK configuration and on-premises deployment config through Jinja2, so one definition renders correctly for every environment instead of being copied per environment.",
        highlight: "Environment-agnostic by construction: the difference between environments is data, not a forked template.",
        tenure: "4+ Years",
      },
      {
        name: "Bicep & ARM Templates",
        category: "Config & Containers",
        role: "Azure-Native IaC",
        productionContext: "Converted the estate's ARM templates to Bicep and automated the conversion path end to end, standardising infrastructure definitions across environments.",
        highlight: "The migration itself was automated rather than hand-ported, so the result is reproducible and reviewable.",
        tenure: "3+ Years",
      },
      {
        name: "Windows Server & WinRM",
        category: "Config & Containers",
        role: "Windows Fleet Automation",
        productionContext: "Automated Windows Server configuration and remote execution over WinRM alongside the Linux estate, including on-premises installs with idempotent SQL Server initialisation and version-gated JVM provisioning.",
        highlight: "One automation model covering both halves of a mixed Windows and Linux estate.",
        tenure: "5 Years",
      },
    ],
  },
  {
    id: "sre",
    label: "Observability & SRE",
    icon: "activity",
    description: "Synthetic health probing, real-time telemetry, automated alerting, and incident prevention.",
    primarySkills: [
      {
        name: "Datadog",
        category: "Observability & SRE",
        role: "APM & Telemetry",
        productionContext: "Designed synthetic HTTP/API test probes, latency threshold alerts, and centralized service health dashboards.",
        highlight: "Detected downstream dependency degradation before client-impacting outages occurred.",
        tenure: "4+ Years",
      },
      {
        name: "Synthetic Health Gates",
        category: "Observability & SRE",
        role: "Validation Gate",
        productionContext: "Created automated Python and Postman verification scripts testing response latency, status codes, and DB connectivity.",
        highlight: "Prevented misconfigured builds from receiving production traffic.",
        tenure: "5 Years",
      },
      {
        name: "Disaster Recovery Automation",
        category: "Observability & SRE",
        role: "Resilience Engineering",
        productionContext: "Engineered single-click failover and automated failback procedures across paired cloud regions.",
        highlight: "Reduced Recovery Time Objective (RTO) from hours to minutes.",
        tenure: "5 Years",
      },
      {
        name: "Network & Packet Analysis",
        category: "Observability & SRE",
        role: "Protocol Diagnostics",
        productionContext: "Diagnosed low-level TCP/IP, DNS, and TLS handshake bottlenecks using Wireshark and synthetic packet captures.",
        highlight: "Resolved tricky cross-region latency spikes in enterprise microservice meshes.",
        tenure: "4+ Years",
      },
      {
        name: "SQL Server HA & Backup Verification",
        category: "Observability & SRE",
        role: "Data Reliability",
        productionContext: "Gated releases on T-SQL-verified backups with RESTORE-based rollback and Datadog failure hooks, ran SQL Server HA mirroring, and built a safe-skip flow that polls active SQL Server tasks before verification so a deployment never blocks on a live job.",
        highlight: "A backup nobody has proven restorable is not a backup — so the release gate proves it, every time.",
        tenure: "3+ Years",
      },
      {
        name: "Health-Gated Restarts",
        category: "Observability & SRE",
        role: "Fail-Fast Validation",
        productionContext: "Designed a fail-fast Apache health gate validating four conditions before traffic is routed — service state, HTTP 200, load-balancer convergence and the health-check file — with drain timeouts and retry/backoff at 5 attempts on a 2-second delay.",
        highlight: "Retry/backoff is what stopped false restarts: a slow start is no longer read as a failed one.",
        tenure: "3+ Years",
      },
      {
        name: "ITSM Change Management",
        category: "Observability & SRE",
        role: "Governed Change",
        productionContext: "Led a jumpbox VM SKU and family upgrade through formal ITSM change management, moving the fleet to better-value instance types without interrupting engineer access.",
        highlight: "Comfortable taking infrastructure change through a formal review and approval path, not around it.",
        tenure: "3+ Years",
      },
    ],
  },
  {
    id: "dev",
    label: "Scripting & Core Stack",
    icon: "terminal",
    description: "Clean automation scripting, command-line utilities, web servers, and database integration.",
    primarySkills: [
      {
        name: "Python",
        category: "Scripting & Core Stack",
        role: "Automation Language",
        productionContext: "Wrote custom deployment health validators, CLI automation utilities, API integrations, and data processing tools.",
        highlight: "Authored robust tooling with complete error handling and zero third-party dependencies.",
        tenure: "5+ Years",
      },
      {
        name: "Bash & Shell Scripting",
        category: "Scripting & Core Stack",
        role: "OS Automation",
        productionContext: "Crafted POSIX-compliant deployment scripts, CI pipeline helpers, and container entrypoint hooks.",
        highlight: "Built self-contained, defensive shell utilities with strict error traps.",
        tenure: "5+ Years",
      },
      {
        name: "Apache & Tomcat",
        category: "Scripting & Core Stack",
        role: "Web & App Servers",
        productionContext: "Administered high-concurrency Apache reverse proxies, virtual hosts, SSL termination, and Tomcat servlet clusters.",
        highlight: "Tuned connection pools and keepalive timeouts for zero-drop traffic surges.",
        tenure: "5 Years",
      },
      {
        name: "MySQL & Database Scripting",
        category: "Scripting & Core Stack",
        role: "Data Layer",
        productionContext: "Automated schema migration scripts, backup verification routines, and connection pool health validation.",
        highlight: "Maintained data integrity during live schema upgrades and storage migrations.",
        tenure: "4+ Years",
      },
      {
        name: "SQL Server & T-SQL",
        category: "Scripting & Core Stack",
        role: "Primary Data Platform",
        productionContext: "Wrote the T-SQL that verifies release backups and the RESTORE path that rolls them back, plus idempotent SQL Server initialisation for on-premises installs and active-task polling so verification never blocks on a live job.",
        highlight: "The release gate's hardest guarantee — a provably restorable backup — is T-SQL he wrote and owns.",
        tenure: "3+ Years",
      },
      {
        name: "PowerShell & Batch",
        category: "Scripting & Core Stack",
        role: "Windows Automation",
        productionContext: "Automated Windows Server tasks, installer and signing steps, and remote execution over WinRM with PowerShell and Batch alongside the Bash side of the estate.",
        highlight: "Both halves of a mixed estate scripted to the same standard, rather than Windows being the manual one.",
        tenure: "5 Years",
      },
      {
        name: "C# / .NET & C/C++",
        category: "Scripting & Core Stack",
        role: "Product Code",
        productionContext: "Contributed C#/.NET and C/C++ production code to Granite River Labs' own product line alongside owning the release tooling, including the THREAD protocol installer work that reached upstream Wireshark.",
        highlight: "Release engineering informed by writing the product code it ships, not only the pipeline around it.",
        tenure: "2+ Years",
      },
      {
        name: "Solr & Shared-Resource Sync",
        category: "Scripting & Core Stack",
        role: "Search & Coordination",
        productionContext: "Built shared-resource synchronisation frameworks for Solr and the application servers as part of standing up on-premises deployment from zero tooling.",
        highlight: "Multiple nodes sharing search and application state without a bespoke manual step per install.",
        tenure: "2+ Years",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Compliance",
    icon: "shield",
    description:
      "RBAC inside CI/CD, secret and key custody, signed commits, and the vulnerability gates that run before anything is promoted.",
    primarySkills: [
      {
        name: "RBAC in CI/CD",
        category: "Security & Compliance",
        role: "Pipeline Authorization",
        productionContext: "Closed a security gap in container image promotion by splitting it behind two RBAC-gated workflows, so reaching production takes an authorization rather than just pipeline access.",
        highlight: "Treats the pipeline itself as a privileged system, because it is the one with production credentials.",
        tenure: "4+ Years",
      },
      {
        name: "Secret Management & Vault",
        category: "Security & Compliance",
        role: "Credential Custody",
        productionContext: "Centralised variable and secret management across environments on vars.yml / vault.yml with automated cross-environment syncing — duplicate-key cleanup, lifecycle updates and ID normalisation.",
        highlight: "One source of truth per environment, so a rotated secret is rotated everywhere it is used.",
        tenure: "4+ Years",
      },
      {
        name: "BYOK & Key Vault Encryption",
        category: "Security & Compliance",
        role: "Customer-Managed Keys",
        productionContext: "Drove conditional BYOK configuration through Jinja2 templating and Azure App Config, with BYOK encryption via Key Vault applied to container image promotion.",
        highlight: "Customer-managed keys as a templated, per-environment condition rather than a manual one-off.",
        tenure: "2+ Years",
      },
      {
        name: "S/MIME Commit Signing",
        category: "Security & Compliance",
        role: "Provenance",
        productionContext: "Signs commits with S/MIME so authorship is verifiable at the repository level, alongside keyed authorship watermarking enforced in CI across his own repositories.",
        highlight: "Provenance that holds up to inspection rather than resting on a username.",
        tenure: "Active practice",
        project: { slug: "authormark-watch", title: "Master Bot & Repository Supervisor" },
      },
      {
        name: "Vulnerability Scanning",
        category: "Security & Compliance",
        role: "Supply-Chain Gates",
        productionContext: "Runs dependency review and image vulnerability scanning as pre-promotion gates, so a known-vulnerable artifact fails the pipeline instead of reaching a registry.",
        highlight: "Scanning placed before promotion, where it can still stop something, rather than as a report afterwards.",
        tenure: "4+ Years",
      },
    ],
  },
];

export const SKILLS_COPY = {
  eyebrow: "Skills",
  heading: "What I love working with.",
  body: "Five years of hands-on enterprise infrastructure across Azure and AWS — release, upgrade and disaster-recovery automation, reliability engineering, and security inside the pipeline — plus the AI, LLM and MCP tooling built on top of it. Select any discipline to inspect real-world production use cases, architectures, and capabilities.",
  /* The inspector card's own section labels. */
  productionContextLabel: "Production Application & Engineering Role",
  highlightLabel: "Key Impact & Architecture Deliverable",
  proofOfWorkLabel: "Proof of work",
  proofOfWorkPrefix: "See it running in",
  statusLabel: "Enterprise Battle-Tested",
  tenureLabel: "Tenure",
} as const;

/* The tooling strip under the header.

   Two decisions worth writing down.

   First, the items are not links. A logo loop of anchors puts a dozen
   focus stops between the skip link and the navigation, all of them
   leaving the site, and every one of them moving under the pointer
   while it tries to land.

   SUPERSEDED, revision 7. The strip IS a marquee now — it is the
   ticker in the sticky header, on the owner's instruction. The second
   half of the old argument was the real one and it is answered rather
   than discarded: nothing in the ticker is a target, so there is
   nothing for a pointer to chase, and it pauses on hover and on focus.
   See the header of components/SkillTicker.tsx. The marks below are
   also drawn trademarks now rather than type — 35 of the 39 have a
   real glyph in react-icons, which is the opposite of the ratio this
   comment assumed. See components/primitives/BrandMark.tsx.

   These are a statement of what the work is
   built with, not a set of destinations, so they are inert nodes with
   titles and the strip carries one accessible name for the region.

   Second, Amazon and Microsoft withdrew their marks from Simple Icons,
   which is what react-icons ships. Rather than redraw two trademarks
   from memory, those are set as wordmarks in the site's mono face at
   the same optical height as the glyphs — which is what `wordmark: true`
   records here, as a fact about the mark rather than a style. */

export type ToolingMark = {
  /** Stable token the design layer maps to a drawn mark. */
  id: string;
  title: string;
  ariaLabel: string;
  /** No usable trademark glyph exists — set the title in type instead. */
  wordmark?: boolean;
  /** The text to set when `wordmark` is true. */
  word?: string;
};

export const TOOLING_STRIP: ToolingMark[] = [
  { id: "aws", title: "Amazon Web Services", ariaLabel: "Amazon Web Services", wordmark: true, word: "AWS" },
  { id: "azure", title: "Microsoft Azure", ariaLabel: "Microsoft Azure", wordmark: true, word: "Azure" },
  { id: "terraform", title: "Terraform", ariaLabel: "Terraform" },
  { id: "ansible", title: "Ansible", ariaLabel: "Ansible" },
  { id: "chef", title: "Chef", ariaLabel: "Chef" },
  { id: "puppet", title: "Puppet", ariaLabel: "Puppet" },
  { id: "docker", title: "Docker", ariaLabel: "Docker" },
  { id: "kubernetes", title: "Kubernetes", ariaLabel: "Kubernetes" },
  { id: "github-actions", title: "GitHub Actions", ariaLabel: "GitHub Actions" },
  { id: "gitlab", title: "GitLab CI", ariaLabel: "GitLab CI" },
  { id: "python", title: "Python", ariaLabel: "Python" },
  { id: "bash", title: "Bash", ariaLabel: "Bash" },
  { id: "linux", title: "Linux", ariaLabel: "Linux" },
  { id: "datadog", title: "Datadog", ariaLabel: "Datadog" },
  { id: "grafana", title: "Grafana", ariaLabel: "Grafana" },
  { id: "prometheus", title: "Prometheus", ariaLabel: "Prometheus" },

  /* The AI and LLM half of the same toolchain — MCP servers, agentic
     coding tools and local inference — and the platform layer the
     enterprise work actually runs on. Microsoft marks are wordmarks for
     the same reason AWS and Azure are, above. */
  { id: "mcp", title: "Model Context Protocol", ariaLabel: "Model Context Protocol", wordmark: true, word: "MCP" },
  { id: "claude", title: "Claude / Claude Code", ariaLabel: "Claude and Claude Code" },
  { id: "cursor", title: "Cursor", ariaLabel: "Cursor" },
  { id: "github-copilot", title: "GitHub Copilot", ariaLabel: "GitHub Copilot" },
  { id: "google-gemini", title: "Google Gemini", ariaLabel: "Google Gemini" },
  { id: "openrouter", title: "OpenRouter", ariaLabel: "OpenRouter" },
  { id: "huggingface", title: "Hugging Face", ariaLabel: "Hugging Face" },
  { id: "ollama", title: "Ollama", ariaLabel: "Ollama" },
  { id: "fastapi", title: "FastAPI", ariaLabel: "FastAPI" },
  { id: "streamlit", title: "Streamlit", ariaLabel: "Streamlit" },
  { id: "pypi", title: "PyPI", ariaLabel: "PyPI" },
  { id: "bicep", title: "Azure Bicep", ariaLabel: "Azure Bicep", wordmark: true, word: "Bicep" },
  { id: "jinja", title: "Jinja2", ariaLabel: "Jinja2" },
  { id: "apache", title: "Apache HTTP Server", ariaLabel: "Apache HTTP Server" },
  { id: "apache-tomcat", title: "Apache Tomcat", ariaLabel: "Apache Tomcat" },
  { id: "apache-solr", title: "Apache Solr", ariaLabel: "Apache Solr" },
  { id: "sql-server", title: "Microsoft SQL Server (T-SQL)", ariaLabel: "Microsoft SQL Server", wordmark: true, word: "SQL Server" },
  { id: "powershell", title: "PowerShell", ariaLabel: "PowerShell", wordmark: true, word: "PowerShell" },
  { id: "dotnet", title: "C# / .NET", ariaLabel: "C sharp and dot NET" },
  { id: "cplusplus", title: "C / C++", ariaLabel: "C and C plus plus" },
  { id: "redhat", title: "RHEL", ariaLabel: "Red Hat Enterprise Linux" },
  { id: "ubuntu", title: "Ubuntu", ariaLabel: "Ubuntu" },
  { id: "akamai", title: "Akamai", ariaLabel: "Akamai" },
  { id: "wix", title: "WiX Toolset", ariaLabel: "WiX Toolset", wordmark: true, word: "WiX" },
];

/** The accessible name for the whole tooling strip region. */
export const TOOLING_STRIP_LABEL = "Tooling I work with day to day";
