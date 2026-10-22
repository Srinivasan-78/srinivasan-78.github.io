/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​‌​​‌​​‌​‌‌​​​​‌‌​‌‌​‌​‌​​​​‌‌​‌‌​‌​‌‌​‌​​‌‌​‌​‌​​‌​‌‌​‌‌‌​‌​‌​‌​​‌​‌‌​​‌‌​​‌​​‌​​​‌​‌​‌​​​‌​‌​‌​‌​‌‌​​‌‌​‌​‌‌​‌​​‌​​‌​‌‌​‌​​‌​‌​​​​‌​​‌​‌​‌‌‌​‌‌​‌​​‌​‌​‌​‌​​​‌​​​‌‌‌​‌​​​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.RXmCkMKuK2EEVkIiBWiTGA
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import GlowCard from "./ui/GlowCard";
import {
  FiGitBranch,
  FiCloud,
  FiServer,
  FiActivity,
  FiTerminal,
  FiCheckCircle,
  FiLayers,
  FiCpu,
  FiBox,
  FiArrowUpRight,
  FiShield,
} from "react-icons/fi";

type SkillDetail = {
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

type DomainCluster = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  primarySkills: SkillDetail[];
};

const SKILL_DOMAINS: DomainCluster[] = [
  {
    id: "ai",
    label: "AI, LLM & MCP",
    icon: FiCpu,
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
    icon: FiGitBranch,
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
    icon: FiCloud,
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
    icon: FiServer,
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
    icon: FiActivity,
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
    icon: FiTerminal,
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
    icon: FiShield,
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

export default function AppleSkillsExperience() {
  const [activeDomainId, setActiveDomainId] = useState<string>(
    SKILL_DOMAINS[0].id
  );
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail>(
    SKILL_DOMAINS[0].primarySkills[0]
  );

  const currentDomain =
    SKILL_DOMAINS.find((d) => d.id === activeDomainId) || SKILL_DOMAINS[0];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b] mb-4">
          <FiCpu className="w-3.5 h-3.5" />
          <span>Skills</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight pb-1 text-[#1d1d1f] dark:text-white mb-4">
          What I love working with.
        </h2>

        <p className="text-[#5a5a5f] dark:text-[#9b9ba1] text-base sm:text-lg leading-relaxed">
          Five years of hands-on enterprise infrastructure across Azure and AWS — release, upgrade and disaster-recovery automation, reliability engineering, and security inside the pipeline — plus the AI, LLM and MCP tooling built on top of it. Select any discipline to inspect real-world production use cases, architectures, and capabilities.
        </p>
      </div>

      {/* Interactive Domain Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {SKILL_DOMAINS.map((domain) => {
          const isSelected = domain.id === activeDomainId;
          const Icon = domain.icon;
          return (
            <button
              key={domain.id}
              onClick={() => {
                setActiveDomainId(domain.id);
                setSelectedSkill(domain.primarySkills[0]);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]"
                  : "bg-[#f5f5f7] text-[#5a5a5f] hover:text-[#1d1d1f] hover:bg-black/5 dark:bg-[#09090c] dark:text-[#9b9ba1] dark:hover:text-white dark:hover:bg-white/5 border border-black/10 dark:border-white/10"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{domain.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Workbench: Left List + Right Inspector Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Skill Buttons in Current Domain */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 mb-4">
            <p className="text-xs text-[#5a5a5f] dark:text-[#9b9ba1] leading-relaxed">
              {currentDomain.description}
            </p>
          </div>

          {currentDomain.primarySkills.map((skill) => {
            const isActive = selectedSkill.name === skill.name;
            return (
              <GlowCard key={skill.name} chrome={false}>
                <button
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`w-full p-5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isActive
                      ? "bg-white dark:bg-white/10 border-black/25 dark:border-white/30 shadow-lg scale-[1.01]"
                      : "bg-[#f5f5f7] dark:bg-[#09090c] border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1d1d1f] dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">
                        {skill.name}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                      )}
                    </div>
                    <div className="text-xs text-[#5a5a5f] dark:text-[#9b9ba1] font-mono">
                      {skill.role}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#5a5a5f] dark:text-[#a1a1a6]">
                    {skill.tenure}
                  </span>
                </button>
              </GlowCard>
            );
          })}
        </div>

        {/* Right Column: Deep Production Inspector Card */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c] border border-black/10 dark:border-white/10 relative overflow-hidden shadow-xl transition-all">

            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-black/10 dark:border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-[#e5a93b] block mb-1">
                  {selectedSkill.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight">
                  {selectedSkill.name}
                </h3>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#1d1d1f] dark:text-white">
                <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34c759]" />
                <span>{selectedSkill.role}</span>
              </div>
            </div>

            {/* Production Context */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#5a5a5f] dark:text-[#9b9ba1] mb-2">
                  Production Application & Engineering Role
                </h4>
                <p className="text-base sm:text-lg text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
                  {selectedSkill.productionContext}
                </p>
              </div>

              {/* Key Architecture Impact / Highlight */}
              <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-[#e5a93b]">
                  <FiLayers className="w-4 h-4" />
                  <span>Key Impact & Architecture Deliverable</span>
                </div>
                <p className="text-xs sm:text-sm text-[#424245] dark:text-[#a1a1a6] leading-relaxed">
                  {selectedSkill.highlight}
                </p>
              </div>

              {/* Matching build, when one of the projects demonstrates it */}
              {selectedSkill.project && (
                <Link
                  href={`/projects/${selectedSkill.project.slug}`}
                  className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/30 transition-all group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-[#e5a93b]">
                      <FiBox className="w-4 h-4" />
                      <span>Proof of work</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#424245] dark:text-[#a1a1a6]">
                      See it running in{" "}
                      <span className="font-bold text-[#1d1d1f] dark:text-white">
                        {selectedSkill.project.title}
                      </span>
                    </p>
                  </div>
                  <FiArrowUpRight className="w-5 h-5 flex-shrink-0 text-[#5a5a5f] dark:text-[#9b9ba1] group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors" />
                </Link>
              )}

              {/* Quick Status Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#5a5a5f] dark:text-[#9b9ba1]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                  <span>Enterprise Battle-Tested</span>
                </div>
                <div>Tenure: {selectedSkill.tenure}</div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

