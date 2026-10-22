/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌​‌​​‌‌​‌‌‌​​‌‌​‌‌‌​‌‌‌‌​​‌​‌‌​​‌​‌​​‌‌​​‌‌​‌​‌​​​‌​‌​​​‌‌‌​​‌‌‌​​‌​‌‌‌​​‌‌​​‌‌​​​​​​‌‌​‌​‌​​‌‌​‌‌​​‌‌​‌‌​‌​‌‌​‌‌‌‌​‌​​​​​‌​‌​​‌​​‌​‌‌​‌‌​‌​‌​​‌‌​‌​‌​‌​‌‌​​​‌‌​‌​​​‌‌​‌​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.M77ye3QG9s056moAImMV4k
 */
import { PROJECTS } from "./projects";
import { CERTS } from "./certs";

/* The assistant quotes a build count in several answers. Reading it off
   PROJECTS means adding a project cannot leave the chat widget claiming a
   number that stopped being true. The certification count is read off
   CERTS for exactly the same reason — it was hard-coded as 24 and would
   have gone stale the next time a credential was added. */
const PROJECT_COUNT = PROJECTS.length;
const CERT_COUNT = CERTS.length;

export interface KnowledgeEntry {
  id: string;
  category: "identity" | "experience" | "projects" | "skills" | "authorization" | "certifications" | "contact" | "general";
  keywords: string[];
  patterns?: RegExp[];
  answer: string;
  followUps?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // 1. Identity & Overview
  {
    id: "overview",
    category: "identity",
    keywords: ["who", "about", "srinivasan", "background", "summary", "profile", "bio", "experience", "role", "what does he do", "intro"],
    patterns: [
      /who\s+is\s+srinivasan/i,
      /what\s+does\s+(he|srinivasan)\s+do/i,
      /tell\s+me\s+about\s+(him|srinivasan)/i,
      /give\s+me\s+(an\s+)?overview/i,
    ],
    answer:
      "Srinivasan Vijayaraghavan is a DevOps / Site Reliability Engineer with 5 years of hands-on experience building resilient cloud infrastructure across Azure and AWS. At Thomson Reuters he owns release, upgrade and disaster-recovery automation for a multitenant Azure platform of 15+ microservices, built on GitHub Actions, Ansible and Datadog. Before that he set up build, packaging and release pipelines from scratch for embedded and enterprise products on Linux and Windows at Granite River Labs. He also maintains repo2graph, an open-source MCP server that helps AI coding agents understand codebases. Based in Bangalore, India; a U.S. Citizen and OCI holder, authorized to work in both the United States and India.",
    followUps: [
      "What is his enterprise experience?",
      "Is he authorized to work in the US?",
      "Tell me about repo2graph",
      "What are his key projects?",
    ],
    actionLink: {
      label: "Download Résumé (PDF)",
      url: "/resume.pdf",
    },
  },

  // 2. Work Authorization & US Status
  {
    id: "work_authorization",
    category: "authorization",
    keywords: [
      "visa", "authorization", "work authorization", "authorized", "us", "usa", "united states",
      "sponsorship", "sponsor", "green card", "ead", "tn", "citizen", "eligibility", "india",
      "remote", "hire", "relocation", "mobility", "legal"
    ],
    patterns: [
      /work\s+authoriz/i,
      /authorized\s+to\s+work/i,
      /need\s+(visa\s+)?sponsorship/i,
      /eligible\s+to\s+work/i,
      /us\s+citizen/i,
      /us\s+work/i,
    ],
    answer:
      "Srinivasan is a U.S. Citizen and an OCI (Overseas Citizen of India) holder, so he is fully authorized to work in both the United States and India with ZERO employer visa sponsorship required. He is available for immediate hire across US and India roles (remote or on-site) with no immigration overhead or visa waiting periods.",
    followUps: [
      "What is his current location?",
      "How do I get in touch with him?",
      "What are his strongest technical skills?",
    ],
    actionLink: {
      label: "Discuss a Role",
      url: "/contact",
    },
  },

  // 3. Enterprise Experience - Thomson Reuters
  {
    id: "thomson_reuters",
    category: "experience",
    keywords: [
      "thomson", "reuters", "thomson reuters", "azure migration", "unmanaged disk", "blob storage",
      "storage cost", "managed disks", "dr", "disaster recovery"
    ],
    patterns: [
      /thomson\s+reuters/i,
      /azure\s+storage\s+migration/i,
      /cost\s+reduction/i,
    ],
    answer:
      "At Thomson Reuters (DevOps Engineer, 3 yrs 3 mos, Bangalore), Srinivasan owns release, upgrade and disaster-recovery automation for a multitenant Azure platform of 15+ microservices. Highlights:\n• Built the parallelized Azure Storage migration framework the platform's large-scale transfers run on — custom runners, chunked delta detection, parallel AzCopy orchestration, with SAS-authenticated Azure Table Storage driving inventory generation and migration-summary reporting.\n• Orchestrated DR failover and failback through Azure Service Bus with structured Datadog logging, holding zero data loss across same-region and cross-region Azure migrations.\n• Replaced manual multi-page runbooks with a self-service GitHub Actions suite, and eliminated manual upgrades across 15+ microservices with unattended Ansible orchestration (feature-flag loops, rescue blocks, automatic rollback).\n• Designed a fail-fast Apache health gate validating four conditions before traffic is routed, with retry/backoff at 5 attempts on a 2-second delay to stop false restarts.\n• Gated releases on T-SQL-verified backups with RESTORE-based rollback, automated DNS and MX cutovers in Python against the Akamai API, converted the estate's ARM templates to Bicep, and closed a container-promotion security gap with two RBAC-gated workflows plus BYOK encryption through Key Vault.\nHe also spearheaded earlier storage migration work to Azure Managed Disks and tiered Blob Storage, cutting monthly cloud storage spend by 40% with zero production downtime.",
    followUps: [
      "Tell me about his work at Granite River Labs",
      "What tools does he use for CI/CD?",
      "How does he handle disaster recovery?",
      `Explore all ${PROJECT_COUNT} platform builds`,
    ],
    actionLink: {
      label: "Explore Selected Experience",
      url: "/#experience",
    },
  },

  // 4. Enterprise Experience - Granite River Labs (GRL)
  {
    id: "granite_river_labs",
    category: "experience",
    keywords: [
      "granite", "river", "labs", "grl", "matter", "smart home", "test harness", "iot", "firmware", "image builder"
    ],
    patterns: [
      /granite\s+river/i,
      /grl/i,
      /matter\s+test/i,
      /smart\s+home/i,
    ],
    answer:
      "At Granite River Labs (DevOps Engineer, 1 yr 9 mos, Bangalore) Srinivasan was the sole engineer for build and release tooling across Linux, Windows and cloud, serving both embedded and enterprise product teams — and was promoted at six months. He engineered an automated test harness image pipeline for Matter Smart Home compliance certification, containerizing test runners with Docker and orchestrating suites with Python and Ansible to cut test setup and execution cycle times by 60%. He also standardised release delivery with Docker build/tag/push/deploy pipelines, automated WiX installer builds with code signing in GitHub Actions plus dpkg packaging in CI, authored a custom Windows Wireshark installer for THREAD protocol analysis that was later merged into the upstream Wireshark project, delivered hardware-in-the-loop test automation for Project MATTER (CSA) and Zigbee interoperability, contributed C#/.NET and C/C++ production code to the company's product line, automated ARM-based machine image builds, restructured repositories to enforce linting, unit tests, formatting and PR quality gates, and scoped AWS EC2 hosting for .NET applications to least privilege. Recognised twice — for Zigbee/Matter team support and on-call effort, and for product build and automation ownership.",
    followUps: [
      "What is his experience at Thomson Reuters?",
      "What is his Python experience?",
      "Tell me about the Wireshark contribution",
      "What certifications does he hold?",
    ],
    actionLink: {
      label: "View Matter Image Builder Project",
      url: "/projects/matter-test-harness-image-builder",
    },
  },

  // 5. Projects - Master Bot / Repository Supervisor
  {
    id: "master_bot",
    category: "projects",
    keywords: [
      "master bot", "supervisor", "authormark", "watermark", "secret scanner", "hygiene", "pr tag", "bot", "triage"
    ],
    patterns: [
      /master\s+bot/i,
      /authormark/i,
      /repository\s+supervisor/i,
      /secret\s+scann/i,
    ],
    answer:
      "The Master Bot & Repository Supervisor is an autonomous platform supervisor that continuously audits, secures, and maintains every repository in Srinivasan's GitHub account. It enforces @authormark cryptographic watermarks, automatically opens ready-to-merge fix PRs with keyed HMAC signatures, scans for leaked PATs/API keys, lints code hygiene, tags PR sizes (size/XS to size/XL), and consolidates findings into a single daily dashboard issue to eliminate alert fatigue.",
    followUps: [
      "Tell me about his open-source contributions",
      "Tell me about his Self-Healing Deployment pipeline",
      "Explore all projects",
    ],
    actionLink: {
      label: "View Master Bot Breakdown",
      url: "/projects/authormark-watch",
    },
  },

  // 6. Open-Source Contributions - upstream pull requests
  {
    id: "open_source_contributions",
    category: "projects",
    keywords: [
      "open source", "contribution", "contributions", "pull request", "pr", "upstream", "fork", "forked",
      "pumpkin", "minecraft server", "rust", "aitrading", "patch"
    ],
    patterns: [
      /open[-\s]?source\s+contribut/i,
      /pull\s+request/i,
      /contribut(e|ing|ions?)\s+(to|upstream)/i,
      /forked?\s+projects?/i,
      /pumpkin/i,
    ],
    answer:
      "Beyond his own repositories, Srinivasan sends fixes upstream to projects he doesn't own. For Pumpkin — a Minecraft server written from scratch in Rust — he opened PR #3145, which makes the server honor the per-player movement lock during vehicle movement, so a player held still for a dialogue or cutscene can no longer drive a boat, minecart or horse away. He also contributes to AITrading, a private algorithmic-trading toolkit, where his PR #15 reworked the market-data cache to use a live-price feed and a shorter TTL so scanners act on fresher quotes.",
    followUps: [
      "Tell me about the Master Bot project",
      "What is his Rust experience?",
      "View all projects",
    ],
    actionLink: {
      label: "View Open-Source Contributions",
      url: "/projects",
    },
  },

  // 7. Projects - Self-Healing Deployment Pipeline
  {
    id: "self_healing",
    category: "projects",
    keywords: [
      "self healing", "deployment", "blue green", "zero downtime", "rollback", "chaos", "pipeline", "release", "flags"
    ],
    patterns: [
      /self\s*healing/i,
      /zero\s*downtime/i,
      /blue\s*green/i,
      /automated\s*rollback/i,
    ],
    answer:
      "The Self-Healing Deployment Pipeline is Srinivasan's flagship release architecture. It features dual-slot blue/green swapping on port 8080, automated health gates (verifying HTTP 200, latency budgets, and dependency responses), exponential backoff retries, instant automated rollback if verification fails, on-demand chaos fault injection, and automated GitHub Pages deployment timelines.",
    followUps: [
      "How does the rollback mechanism work?",
      "What tools are in his DevOps stack?",
      `Explore all ${PROJECT_COUNT} projects`,
    ],
    actionLink: {
      label: "View Architecture Deep Dive",
      url: "/projects/self-healing-deployment",
    },
  },

  // 9. Technical Skills & Tools
  {
    id: "skills_stack",
    category: "skills",
    keywords: [
      "skills", "stack", "technologies", "tools", "aws", "azure", "kubernetes", "k8s", "docker",
      "terraform", "ansible", "python", "bash", "linux", "datadog", "prometheus", "grafana",
      "ci/cd", "github actions", "gitlab", "devops", "cloud"
    ],
    patterns: [
      /what\s+(tech|tools|skills|languages)/i,
      /technical\s+stack/i,
      /technologies\s+used/i,
      /devops\s+skills/i,
    ],
    answer:
      "Srinivasan's primary technical domains include:\n• AI & LLM Engineering: LLM API integration, Model Context Protocol (MCP) servers, RAG (BM25, embeddings), agentic coding workflows, prompt engineering, local LLM hosting\n• AI Tools & Models: Claude Code, Claude API, Cursor, GitHub Copilot, ChatGPT / OpenAI API, Google Gemini, Ollama, Llama, DeepSeek, Groq, OpenRouter, Hugging Face\n• CI/CD & IaC: GitHub Actions, GitLab CI, Azure DevOps (incl. REST API), Terraform, Ansible, Jinja2, Bicep, ARM, Docker, Kubernetes (AKS), WiX Toolset, dpkg\n• Cloud: Azure (Storage, AzCopy, Service Bus, App Config, Key Vault, ACR, AKS, Load Balancer, CLI), AWS (EC2, Security Groups)\n• Reliability & Operations: DR failover/failback, SQL Server HA mirroring, backup/restore verification, health-gated restarts, zero-downtime traffic shifts, ITSM change management\n• Monitoring: Datadog, Pingdom, HTTP/TCP/JMX checks, deployment telemetry, Teams alerting\n• Platforms: Windows Server, RHEL, Ubuntu, Apache, Tomcat, SQL Server (T-SQL), Solr, WinRM, Akamai\n• Languages: Python, Bash/Shell, PowerShell, Batch, SQL, YAML, C/C++, C#\n• Security: RBAC in CI/CD, secret management, BYOK, S/MIME commit signing, vulnerability scanning",
    followUps: [
      "What certifications does he have in AWS/Azure?",
      "What is his experience with Kubernetes?",
      "View interactive skills workbench",
    ],
    actionLink: {
      label: "Explore Skills Workbench",
      url: "/#skills",
    },
  },

  // 9b. AI, LLM & MCP engineering
  {
    id: "ai_llm_mcp",
    category: "skills",
    keywords: [
      "ai", "llm", "llms", "mcp", "model context protocol", "rag", "graphrag", "retrieval",
      "agent", "agents", "agentic", "subagent", "claude", "anthropic", "openai", "gemini",
      "embedding", "embeddings", "vector", "tokens", "token", "context window", "tree-sitter",
      "repo2graph", "tokenmiser", "prompt", "genai"
    ],
    patterns: [
      /\bmcp\b/i,
      /model\s+context\s+protocol/i,
      /\b(ai|llm|genai)\b\s+(skills?|experience|work)/i,
      /graph\s*rag|retrieval\s+augmented/i,
      /token\s+(reduction|cost|budget|usage)/i,
      /agentic/i,
    ],
    answer:
      "Srinivasan builds AI infrastructure, not AI demos. repo2graph is his flagship here: a GraphRAG engine that parses a codebase with tree-sitter into a graph of files, functions, calls and inheritance, then serves retrieval over it to AI agents as an MCP server — five read-only tools over stdio or authenticated HTTP (bearer token or OIDC), installable in Claude Code, Claude Desktop or Cursor with one command, and published to PyPI, the GitHub Marketplace and the MCP Registry. Token budgets are enforced rather than requested: a 12,000-token ceiling re-measured after rendering, capped neighbour rows, and every retrieved block stamped with its file and line range. Alongside it sit tokenmiser (context and token-cost reduction for Claude Code), Agentic App Loop (a seven-phase build loop of bounded subagents), and Multi-AI Toolkit (parallel subtask routing with failover across five LLM providers).",
    followUps: [
      "Tell me about repo2graph",
      "How does he reduce LLM token costs?",
      "What tools are in his DevOps stack?",
    ],
    actionLink: {
      label: "View repo2graph Architecture",
      url: "/projects/repo2graph",
    },
  },

  // 9c. repo2graph specifically
  {
    id: "repo2graph",
    category: "projects",
    keywords: [
      "repo2graph", "code graph", "codegraph", "blast radius", "tree sitter", "treesitter",
      "bm25", "pypi", "npm", "docker", "github marketplace", "mcp registry", "17 languages",
      "mit", "open source maintainer", "code intelligence",
    ],
    patterns: [
      /repo2?graph/i,
      /blast\s*radius/i,
      /tree[-\s]?sitter/i,
      /code\s+graph/i,
    ],
    answer:
      "repo2graph is Srinivasan's open-source (MIT) code-graph engine and MCP server — he is its creator and maintainer. It gives AI coding agents like Claude Code and Cursor cited, token-bounded answers about any codebase, with no LLM and no API key needed. It parses source with tree-sitter across 17 languages, retrieves over the resulting graph with BM25 plus a one-hop graph walk, and ships a GitHub Action for PR blast-radius analysis. Distributed on PyPI, npm, Docker, the GitHub Marketplace and the MCP Registry. Token budgets are enforced rather than requested — a 12,000-token ceiling re-measured after rendering — and every retrieved block carries its file and line range plus the edge that pulled it in, so an agent's claim about the code can be checked instead of trusted.",
    followUps: [
      "How does he reduce LLM token costs?",
      "What other AI projects has he built?",
      "What is an MCP server?",
    ],
    actionLink: {
      label: "View repo2graph Architecture",
      url: "/projects/repo2graph",
    },
  },

  // 9d. Offline RAG knowledge assistant — the homelab AI build
  {
    id: "offline_rag",
    category: "projects",
    keywords: [
      "offline rag", "rag assistant", "knowledge assistant", "homelab", "ollama", "llama",
      "llama 3.2", "streamlit", "fastapi", "arch wiki", "wikipedia", "offline wikipedia",
      "local llm", "self hosted llm", "local chatbot", "zim",
    ],
    patterns: [
      /offline\s+(rag|wiki|chatbot|assistant)/i,
      /local\s+(llm|model|inference)/i,
      /ollama|streamlit|fastapi/i,
      /arch\s+wiki/i,
    ],
    answer:
      "The Offline RAG Knowledge Assistant is Srinivasan's homelab AI build: a local chatbot answering over offline Wikipedia and Arch Wiki snapshots, running entirely on his own hardware with FastAPI, Ollama (Llama 3.2) and Streamlit. Retrieval and generation are both local, so it keeps working with the internet unplugged — no API key, no per-token bill, and nothing leaving the box. It sits alongside repo2graph as the self-hosted end of the same interest: making retrieval good enough that the model does not need to guess.",
    followUps: [
      "Tell me about repo2graph",
      "What is his experience with local LLM hosting?",
      `Explore all ${PROJECT_COUNT} projects`,
    ],
    actionLink: {
      label: "View the Homelab Build",
      url: "/projects/zim-assistant",
    },
  },

  // 9e. Disaster recovery & reliability engineering
  {
    id: "reliability_dr",
    category: "skills",
    keywords: [
      "disaster recovery", "dr", "failover", "failback", "rto", "rpo", "ha", "mirroring",
      "backup", "restore", "t-sql", "tsql", "sql server", "health gate", "apache",
      "zero downtime", "traffic shift", "itsm", "change management", "resilience", "sre",
      "reliability", "service bus",
    ],
    patterns: [
      /disaster\s+recovery|failover|failback/i,
      /backup\s+(and\s+)?(restore|verification)/i,
      /health\s+gate/i,
      /zero[-\s]?downtime/i,
      /\bsre\b|site\s+reliability/i,
    ],
    answer:
      "Reliability is the centre of Srinivasan's work rather than a side concern:\n• DR failover and failback orchestrated through Azure Service Bus with structured Datadog logging — zero data loss across both same-region and cross-region Azure migrations.\n• A fail-fast Apache health gate validating four conditions before traffic is routed: service state, HTTP 200, load-balancer convergence and the health-check file — with drain timeouts and retry/backoff at 5 attempts on a 2-second delay to stop false restarts.\n• Releases gated on T-SQL-verified backups with RESTORE-based rollback and Datadog failure hooks, plus a safe-skip flow that polls active SQL Server tasks first so a deployment never blocks on a live job.\n• Rollback and recovery pipelines covering database restoration, service resets, checkpoint cleanup and external system synchronisation — including DNS and MX cutovers automated in Python against the Akamai API, with Pingdom check updates.\n• SQL Server HA mirroring, zero-downtime traffic shifts, and infrastructure change taken through formal ITSM change management.",
    followUps: [
      "How does his release pipeline work?",
      "What monitoring does he use?",
      "What is his experience at Thomson Reuters?",
    ],
    actionLink: {
      label: "View Release Flow Diagram",
      url: "/#reliability",
    },
  },

  // 9f. Security inside the pipeline
  {
    id: "security_practices",
    category: "skills",
    keywords: [
      "security", "rbac", "secrets", "secret management", "vault", "byok", "key vault",
      "encryption", "signing", "s/mime", "smime", "commit signing", "vulnerability",
      "scanning", "least privilege", "compliance",
    ],
    patterns: [
      /\brbac\b/i,
      /secret\s+manage/i,
      /\bbyok\b|customer[-\s]managed\s+key/i,
      /commit\s+signing|s\/?mime/i,
      /vulnerability\s+scan/i,
      /least\s+privilege/i,
    ],
    answer:
      "Srinivasan treats the pipeline as a privileged system, because it is the one holding production credentials:\n• RBAC in CI/CD: container image promotion split behind two RBAC-gated workflows, closing a gap where pipeline access alone could reach production.\n• Secret management: variables and secrets centralised on vars.yml / vault.yml across environments, with automated cross-environment syncing — duplicate-key cleanup, lifecycle updates and ID normalisation.\n• BYOK: customer-managed key encryption through Azure Key Vault, driven as a templated per-environment condition via Jinja2 and Azure App Config.\n• Provenance: S/MIME commit signing, plus keyed authorship watermarking enforced in CI across his own repositories.\n• Supply chain: dependency review and image vulnerability scanning run as pre-promotion gates, where they can still stop something.\n• Least privilege: AWS EC2 hosting scoped down through security group rules and key-pair management.",
    followUps: [
      "What is his experience with Azure Key Vault?",
      "Tell me about the Master Bot project",
      "How does his release pipeline work?",
    ],
    actionLink: {
      label: "Explore Skills Workbench",
      url: "/#skills",
    },
  },

  // 9g. Monitoring & observability coverage
  {
    id: "monitoring_coverage",
    category: "skills",
    keywords: [
      "monitoring", "observability", "datadog", "pingdom", "jmx", "tcp check", "http check",
      "dashboard", "alerting", "teams", "telemetry", "tagging",
    ],
    patterns: [
      /monitor(ing)?\s+(stack|tools|setup)/i,
      /\bjmx\b/i,
      /datadog|pingdom/i,
      /alert(ing|s)?\b/i,
    ],
    answer:
      "Srinivasan extended HTTP, TCP and JMX monitoring to every microservice on the platform using dynamic templates and one standardised tagging scheme, with dependency-aware restarts, and wired Datadog dashboards and Teams alerting directly into the deployment pipelines rather than bolting them on afterwards. Pingdom checks are updated automatically as part of DNS and MX cutovers, and Datadog failure hooks sit on the backup-verification gate itself — so a gate that fails is visible rather than silent. Deployment telemetry is treated as part of the release, not a separate reporting exercise.",
    followUps: [
      "How does he handle disaster recovery?",
      "How does his release pipeline work?",
      "What certifications does he hold?",
    ],
    actionLink: {
      label: "Explore Skills Workbench",
      url: "/#skills",
    },
  },

  // 9h. On-premises and mixed Windows/Linux estates
  {
    id: "on_premises",
    category: "skills",
    keywords: [
      "on premises", "on-prem", "onprem", "windows server", "winrm", "solr", "tomcat",
      "spring boot", "jvm", "jinja2", "idempotent", "bare metal", "hybrid",
    ],
    patterns: [
      /on[-\s]?prem(ises|ise)?/i,
      /windows\s+server|winrm/i,
      /spring\s+boot|jvm/i,
      /\bsolr\b/i,
    ],
    answer:
      "Srinivasan stood up on-premises deployment from zero tooling: Jinja2-templated configuration, idempotent SQL Server initialisation and version-gated JVM provisioning for Spring Boot migrations, plus shared-resource synchronisation frameworks for Solr and the application servers. That sits alongside the Azure work, so the same automation discipline covers both halves of a mixed estate — Windows Server and WinRM on one side, RHEL and Ubuntu on the other — rather than Windows and on-prem being the manual exceptions.",
    followUps: [
      "What is his experience at Thomson Reuters?",
      "What platforms does he work with?",
      "What is his Ansible experience?",
    ],
    actionLink: {
      label: "Explore Selected Experience",
      url: "/#experience",
    },
  },

  // 10. Certifications
  {
    id: "certifications",
    category: "certifications",
    keywords: [
      "certifications", "certs", "certified", "credentials", "badges", "aws cert", "azure cert", "rhce", "verification"
    ],
    patterns: [
      /certification/i,
      /certified/i,
      /credentials/i,
    ],
    answer:
      `Srinivasan holds ${CERT_COUNT} verified industry certifications across cloud engineering, Linux systems, infrastructure automation, and observability—including credentials covering Microsoft Azure, Azure Bicep, Chef, Puppet, GitLab, GitHub Actions, Apache Tomcat, networking foundations, software architecture, and Datadog observability. Every credential is 100% issuer-verified with permanent verification IDs.`,
    followUps: [
      `Explore all ${CERT_COUNT} certifications`,
      "What is his work experience?",
      "Download his résumé",
    ],
    actionLink: {
      label: "View Verified Certifications",
      url: "/certifications",
    },
  },

  // 11. Contact, Location & Availability
  {
    id: "contact_info",
    category: "contact",
    keywords: [
      "contact", "email", "reach", "hire", "touch", "location", "bangalore", "timezone", "linkedin", "github", "phone", "message"
    ],
    patterns: [
      /how\s+to\s+contact/i,
      /get\s+in\s+touch/i,
      /what\s+is\s+his\s+email/i,
      /where\s+is\s+he\s+based/i,
      /how\s+can\s+i\s+reach/i,
    ],
    answer:
      "Srinivasan is based in Bangalore, India (IST / UTC+5:30) and is open to full-time remote or hybrid opportunities globally.\n• Email: srinivasan.shyam2000@gmail.com\n• Phone: +91 97910 25934\n• Website: srinidevops.com\n• LinkedIn: linkedin.com/in/srini-solution-architect\n• GitHub: github.com/Srinivasan-78\n• Direct Contact Form: Available on the contact page",
    followUps: [
      "Download Résumé (PDF)",
      "Is he authorized to work in the US?",
      "Explore his projects",
    ],
    actionLink: {
      label: "Send a Message",
      url: "/contact",
    },
  },

  // 12. Philosophy & Engineering Standards
  {
    id: "philosophy",
    category: "general",
    keywords: [
      "philosophy", "approach", "culture", "reliability", "best practices", "how he works", "process"
    ],
    patterns: [
      /how\s+does\s+he\s+work/i,
      /engineering\s+philosophy/i,
      /approach\s+to\s+devops/i,
    ],
    answer:
      "Srinivasan's engineering philosophy is anchored in three rules:\n1. Zero-Downtime by Default: Every release must have automated health checks and instant reversible rollback.\n2. Infrastructure as Code: If it's not codified in Terraform/Ansible and checked into Git, it doesn't exist in production.\n3. Calm Observability: Meaningful alerts that trigger only when user SLOs are at risk, with zero notification spam.",
    followUps: [
      "See the Release Reliability Architecture",
      "Check his work authorization",
      "Download his résumé",
    ],
    actionLink: {
      label: "View Release Flow Diagram",
      url: "/#reliability",
    },
  },
];

// Conversational greetings & conversational fallbacks
const GREETING_RESPONSE = {
  answer:
    `Hello! I am Srinivasan's interactive portfolio assistant. I can answer questions about his 5 years as a DevOps / Site Reliability Engineer, US/India work authorization, enterprise case studies (Thomson Reuters & GRL), his AI and MCP work including repo2graph, ${PROJECT_COUNT} open-source builds, and technical skills.`,
  followUps: [
    "What does Srinivasan do?",
    "Is he authorized to work in the US?",
    "Tell me about repo2graph",
    "What are his key projects?",
    "How can I contact him?",
  ],
};

const THANKS_RESPONSE = {
  answer:
    "You're very welcome! If you have any further questions or would like to discuss a role, feel free to reach out directly to Srinivasan.",
  followUps: [
    "Send a message to Srinivasan",
    "Download his résumé (PDF)",
    "View his GitHub repositories",
  ],
  actionLink: {
    label: "Go to Contact Page",
    url: "/contact",
  },
};

const OFF_TOPIC_RESPONSE = {
  answer:
    `I'm specifically focused on Srinivasan's background, cloud/DevOps and SRE experience, AI and MCP tooling, ${PROJECT_COUNT} project builds, certifications, and work authorization. Here are some topics you might find helpful:`,
  followUps: [
    "What does Srinivasan do?",
    "Is he authorized to work in the US?",
    "What's his experience with Azure & AWS?",
    "Tell me about repo2graph",
    "Tell me about the Master Bot project",
  ],
};

export interface KnowledgeMatchResult {
  answer: string;
  followUps: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

/**
 * Intelligent client-side matcher that finds the most relevant knowledge response
 * using pattern matching, token overlap scoring, and synonym analysis.
 */
export function matchKnowledgeQuery(rawQuery: string): KnowledgeMatchResult {
  const query = rawQuery.trim();
  if (!query) {
    return {
      answer: GREETING_RESPONSE.answer,
      followUps: GREETING_RESPONSE.followUps,
    };
  }

  const lower = query.toLowerCase();

  // 1. Detect pure greetings
  if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|howdy|sup)\b/i.test(lower) && lower.length < 25) {
    return GREETING_RESPONSE;
  }

  // 2. Detect appreciation / farewell
  if (/^(thanks|thank\s*you|cheers|awesome|great|bye|goodbye)\b/i.test(lower) && lower.length < 30) {
    return THANKS_RESPONSE;
  }

  // 3. Score all entries in the knowledge base
  let bestEntry: KnowledgeEntry | null = null;
  let highestScore = 0;

  // Extract query tokens (ignoring short stop-words)
  const stopWords = new Set(["a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "is", "are", "do", "does", "his", "he", "him", "me", "tell", "show", "what", "about", "with"]);
  const tokens = lower
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !stopWords.has(t));

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;

    // Pattern matches get highest weight
    if (entry.patterns) {
      for (const pattern of entry.patterns) {
        if (pattern.test(lower)) {
          score += 15;
        }
      }
    }

    // Direct keyword matches
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (lower.includes(kwLower)) {
        score += kwLower.includes(" ") ? 8 : 4;
      }
    }

    // Token overlap matches
    for (const token of tokens) {
      for (const kw of entry.keywords) {
        const kwLower = kw.toLowerCase();
        if (kwLower === token) {
          score += 3;
        } else if (kwLower.includes(token) || token.includes(kwLower)) {
          score += 1.5;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // If match confidence is sufficient, return the matched entry
  if (bestEntry && highestScore >= 3) {
    return {
      answer: bestEntry.answer,
      followUps: bestEntry.followUps ?? [
        "What are his key projects?",
        "What is his work authorization?",
        "How can I contact him?",
      ],
      actionLink: bestEntry.actionLink,
    };
  }

  // If score is too low or off-topic, return graceful guardrail with recommendations
  return OFF_TOPIC_RESPONSE;
}

