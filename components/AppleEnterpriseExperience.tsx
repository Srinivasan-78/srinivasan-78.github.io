/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌​​‌​‌​​​‌​​‌‌​​‌​​‌‌​​‌​‌​‌​‌​​​​​‌‌​‌​‌‌​‌‌‌‌​​‌​‌‌‌‌​‌​​​‌‌​‌​​​​‌‌​​​​​‌​‌​‌​​​‌‌​​‌​‌​‌‌‌​​​​​‌‌​‌​​​​‌​​‌‌‌‌​‌‌‌​​‌‌​‌​‌‌​​​​‌‌​‌‌​​​‌​​‌​​​​‌​‌​​​​​‌‌‌​​​​​‌​​‌​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.NQ2ePkyz40TephOsXlHPpI
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import GlowCard from "./ui/GlowCard";
import { useCappedList, ShowMoreButton } from "./ui/RevealMore";
import { PROJECTS } from "@/lib/projects";
import {
  FiArrowUpRight,
  FiExternalLink,
  FiCheckCircle,
  FiLayers,
  FiServer,
  FiShield,
  FiActivity,
  FiCpu,
  FiZap,
  FiDatabase,
  FiGitMerge,
  FiGlobe,
  FiLock,
  FiKey,
  FiBarChart2,
  FiHardDrive,
  FiTrendingUp,
  FiPackage,
  FiCode,
  FiAward,
  FiCloud,
} from "react-icons/fi";

export type ExperienceItem = {
  id: string;
  company: "Thomson Reuters" | "Granite River Labs";
  role: string;
  title: string;
  category: string;
  metrics: string;
  summary: string;
  problem: string;
  solution: string;
  stack: string[];
  link?: { url: string; label: string };
  icon: React.ComponentType<{ className?: string }>;
};

const INITIATIVES: ExperienceItem[] = [
  {
    id: "tr-migration",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "High-Throughput Migration",
    title: "Parallelized Azure Storage Migration Framework",
    metrics: "48h migration reduced to 4h · 0% data loss",
    summary:
      "Engineered an automated data synchronization engine across Azure Storage using custom runners, chunked delta detection, and parallel AzCopy orchestration.",
    problem:
      "Large enterprise asset migrations previously spanned full weekend maintenance windows, creating deployment bottlenecks and operational risk.",
    solution:
      "Built custom delta-detection workers with automated checksum verification and throttling controls that stream terabytes of data concurrently without downtime.",
    stack: ["Azure Storage", "AzCopy", "Custom Runners", "Delta Detection", "Python"],
    icon: FiServer,
  },
  {
    id: "tr-dr",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Disaster Recovery",
    title: "Self-Service Disaster Recovery & CI/CD Automation",
    metrics: "RTO < 5 mins · Single-click self-service",
    summary:
      "Transformed manual multi-page recovery runbooks into automated, self-service GitHub Actions workflows for environment provisioning and regional failover.",
    problem:
      "Disaster recovery tests and environment provisioning required multiple engineers coordinating manual steps over several hours.",
    solution:
      "Standardized configuration promotion and regional failover into parameterized GitHub Actions with pre-flight health validations and automated Azure NLB cutovers.",
    stack: ["GitHub Actions", "Azure NLB", "DR Automation", "Self-Service", "Bash"],
    icon: FiShield,
  },
  {
    id: "tr-validation",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "SRE & Health Gates",
    title: "Fail-Fast Synthetic Deployment Validation Gate",
    metrics: "100% pre-routing health gate · Zero regressions",
    summary:
      "Designed an automated pre-routing validation layer testing HTTP 200 responses, SSL certs, and latency budgets before routing live user traffic.",
    problem:
      "Uncaught downstream service dependencies and latency spikes could silently degrade user experience during active traffic cutovers.",
    solution:
      "Automated multi-point synthetic probes and Datadog health checks that immediately halt releases and revert load balancers if response times exceed 15ms.",
    stack: ["Datadog", "Azure NLB", "Synthetic Probes", "Apache", "Tomcat"],
    icon: FiActivity,
  },
  {
    id: "grl-matter",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "IoT & Embedded CI",
    title: "Project MATTER — CSA Protocol Test Harness",
    metrics: "CSA standard compliant · Multi-device CI/CD",
    summary:
      "Developed automated deployment pipelines and hardware-in-the-loop test harnesses for Project MATTER (Connectivity Standards Alliance) and Zigbee smart-home devices.",
    problem:
      "Testing smart home firmware compatibility across heterogeneous device fleets was manual and prone to environmental inconsistencies.",
    solution:
      "Architected GitLab CI automation to compile, flash, and validate IoT firmware across physical test rigs with automated packet capture diagnostics.",
    stack: ["Matter / CSA", "Zigbee", "GitLab CI", "Embedded Linux", "Python"],
    icon: FiCpu,
  },
  {
    id: "grl-docker",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "Container Orchestration",
    title: "One-Click Multi-Registry Docker Release Pipeline",
    metrics: "100% automated build-to-deploy · Solo architect",
    summary:
      "Architected end-to-end multi-architecture container pipelines, registry synchronization, and automated zero-downtime deployment for microservices backends.",
    problem:
      "Manual container builds caused version mismatches between development environments, test harnesses, and staging registries.",
    solution:
      "Created an automated release pipeline with semantic versioning, vulnerability scanning, and multi-registry push orchestration.",
    stack: ["Docker", "Multi-Arch Buildx", "GitLab CI", "Registry Sync", "Microservices"],
    icon: FiLayers,
  },
  {
    id: "grl-wireshark",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "Open Source / Network Diagnostics",
    title: "Wireshark THREAD Protocol Windows Installer",
    metrics: "Contributed upstream & merged into Wireshark",
    summary:
      "Authored a custom Windows installer for THREAD protocol packet inspection, packaged through automated CI pipelines and merged upstream into the official Wireshark project.",
    problem:
      "Engineers lacked an integrated Windows distribution for analyzing THREAD low-power mesh networking packets alongside standard Wireshark disectors.",
    solution:
      "Authored WiX toolset configuration and automated build scripts, packaging the drivers into a clean installer accepted by the Wireshark core team.",
    stack: ["Wireshark", "THREAD Protocol", "WiX Toolset", "GitLab CI", "C/C++"],
    link: {
      url: "https://gitlab.com/wireshark/wireshark/-/merge_requests/11008#note_1684405826",
      label: "View Upstream Merge Request",
    },
    icon: FiZap,
  },
  {
    id: "tr-ansible",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Upgrade Orchestration",
    title: "Unattended Ansible Upgrade Orchestration",
    metrics: "15+ microservices · Manual runbooks eliminated",
    summary:
      "Replaced manual upgrade runbooks across 15+ microservices with unattended Ansible orchestration — feature-flag loops, rescue blocks and automatic rollback.",
    problem:
      "Every upgrade meant an engineer walking a multi-page runbook per service, with the failure mode being a half-upgraded estate and no clean way back.",
    solution:
      "Built feature-flag-driven playbook loops with rescue blocks and automatic rollback, and refactored fragmented per-environment inventories into a single environment-agnostic model.",
    stack: ["Ansible", "Jinja2", "Rescue Blocks", "Feature Flags", "YAML"],
    icon: FiGitMerge,
  },
  {
    id: "tr-backup-gate",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Release Safety",
    title: "Backup-Gated Releases with RESTORE Rollback",
    metrics: "No release without a verified backup",
    summary:
      "Gated releases on T-SQL-verified backups with a RESTORE-based rollback path and Datadog failure hooks, plus a safe-skip flow that polls active SQL Server tasks before verification.",
    problem:
      "Releases were proceeding on backups nobody had proven restorable, and backup verification itself could block indefinitely behind a live SQL Server job.",
    solution:
      "Wrote T-SQL verification into the release gate with RESTORE-based rollback staged ahead of time, Datadog failure hooks on the gate itself, and an active-task poll so a live job causes a safe skip rather than a stall.",
    stack: ["SQL Server", "T-SQL", "Datadog", "GitHub Actions", "RESTORE Rollback"],
    icon: FiDatabase,
  },
  {
    id: "tr-rollback",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Recovery Automation",
    title: "DNS & MX Cutover Automation via Akamai API",
    metrics: "Full recovery path automated end to end",
    summary:
      "Built rollback and recovery pipelines handling database restoration, service resets, checkpoint cleanup and external system synchronisation, including DNS and MX cutovers automated in Python against the Akamai API.",
    problem:
      "Recovery involved manual DNS and MX record changes and monitoring updates under time pressure — exactly the conditions in which a typo becomes an outage.",
    solution:
      "Automated the cutover in Python against the Akamai API with Pingdom check updates following it, so the recovery path is executed by code that has been run before rather than typed during an incident.",
    stack: ["Python", "Akamai API", "Pingdom", "DNS / MX", "GitHub Actions"],
    icon: FiGlobe,
  },
  {
    id: "tr-servicebus-dr",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Disaster Recovery",
    title: "Service Bus Failover & Failback Orchestration",
    metrics: "Zero data loss · Same-region & cross-region",
    summary:
      "Orchestrated disaster-recovery failover and failback through Azure Service Bus with structured Datadog logging, holding zero data loss across same-region and cross-region Azure migrations.",
    problem:
      "Failover and failback were separate manual exercises, and without structured telemetry there was no way to prove afterwards that nothing had been lost.",
    solution:
      "Drove both directions through Azure Service Bus with structured Datadog logging at each step, so the run is observable while it happens and auditable once it is done.",
    stack: ["Azure Service Bus", "Datadog", "DR Failover/Failback", "Python"],
    icon: FiShield,
  },
  {
    id: "tr-bicep",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Infrastructure as Code",
    title: "Estate-Wide ARM to Bicep Conversion",
    metrics: "Conversion path automated end to end",
    summary:
      "Converted the estate's ARM templates to Bicep and automated the conversion path itself, standardising infrastructure definitions across every environment.",
    problem:
      "ARM JSON had drifted per environment and was hard to review, making infrastructure changes slower and riskier than the code changes they supported.",
    solution:
      "Automated the ARM-to-Bicep conversion rather than hand-porting it, so the result is reproducible and the same standard lands in every environment.",
    stack: ["Bicep", "ARM Templates", "Azure CLI", "GitHub Actions"],
    icon: FiCode,
  },
  {
    id: "tr-config",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Config & Secret Management",
    title: "Centralised Variable & Secret Management",
    metrics: "Single source of truth across environments",
    summary:
      "Centralised variable and secret management (vars.yml / vault.yml) across environments and automated cross-environment config syncing, with conditional BYOK driven through Jinja2 templating and Azure App Config.",
    problem:
      "Configuration lived in several places per environment, so duplicate keys, stale lifecycle values and mismatched IDs were a routine source of deployment surprises.",
    solution:
      "Consolidated onto vars.yml / vault.yml and automated the sync — duplicate-key cleanup, lifecycle updates and ID normalisation — with conditional BYOK configuration templated through Jinja2 and Azure App Config.",
    stack: ["Ansible Vault", "Jinja2", "Azure App Config", "Key Vault", "YAML"],
    icon: FiKey,
  },
  {
    id: "tr-monitoring",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Observability Coverage",
    title: "HTTP, TCP & JMX Monitoring Across Every Service",
    metrics: "Full-estate coverage · Dependency-aware restarts",
    summary:
      "Extended HTTP, TCP and JMX monitoring to every microservice with dynamic templates and standardised tagging, wiring Datadog dashboards and Teams alerting directly into deployment pipelines.",
    problem:
      "Monitoring coverage was uneven per service and tagged inconsistently, so dashboards could not be trusted to show the whole estate and restarts ignored dependency order.",
    solution:
      "Templated the checks dynamically with one tagging standard, made restarts dependency-aware, and wired dashboards and Teams alerting into the pipelines themselves rather than bolting them on after.",
    stack: ["Datadog", "JMX", "TCP / HTTP Checks", "Teams Alerting", "Jinja2"],
    icon: FiBarChart2,
  },
  {
    id: "tr-acr-rbac",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Security & Supply Chain",
    title: "RBAC-Gated Image Promotion with BYOK",
    metrics: "Security gap closed · Two gated workflows",
    summary:
      "Automated container image promotion in GitHub Actions with real-time Azure DevOps, ACR and AKS log polling, and closed a security gap with two RBAC-gated workflows plus BYOK encryption through Key Vault.",
    problem:
      "Image promotion was both opaque while it ran and open to anyone with pipeline access — a security gap in a path that reaches production directly.",
    solution:
      "Added real-time log polling across Azure DevOps, ACR and AKS for visibility, then split promotion behind two RBAC-gated workflows with BYOK encryption through Key Vault.",
    stack: ["GitHub Actions", "Azure DevOps REST API", "ACR", "AKS", "Key Vault (BYOK)", "RBAC"],
    icon: FiLock,
  },
  {
    id: "tr-onprem",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "On-Premises Platform",
    title: "On-Premises Deployment from Zero Tooling",
    metrics: "Zero tooling to repeatable installs",
    summary:
      "Stood up on-premises deployment from nothing using Jinja2 templates, idempotent SQL Server initialisation and version-gated JVM provisioning for Spring Boot migrations.",
    problem:
      "The on-premises footprint had no deployment tooling at all, which meant every install was a bespoke exercise and no two environments matched.",
    solution:
      "Built Jinja2-templated configuration, idempotent SQL Server initialisation and version-gated JVM provisioning, plus shared-resource synchronisation frameworks for Solr and the application servers.",
    stack: ["Jinja2", "SQL Server", "JVM / Spring Boot", "Solr", "WinRM", "Windows Server"],
    icon: FiHardDrive,
  },
  {
    id: "tr-sku",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "Change Management",
    title: "Jumpbox Fleet SKU & Family Upgrade",
    metrics: "Better-value instance types · Formal ITSM path",
    summary:
      "Led a jumpbox VM SKU and family upgrade through formal ITSM change management, moving the fleet to better-value instance types.",
    problem:
      "The jumpbox fleet was running an older VM family at a worse price-performance point, and it sits on the access path for everything else — so it could not simply be swapped.",
    solution:
      "Took the upgrade through formal ITSM change management with a reviewed plan and rollback, moving the fleet across families without interrupting engineer access.",
    stack: ["Azure VM SKUs", "ITSM Change Management", "Azure CLI"],
    icon: FiTrendingUp,
  },
  {
    id: "tr-azcopy-inventory",
    company: "Thomson Reuters",
    role: "DevOps & Cloud Architecture",
    category: "High-Throughput Migration",
    title: "SAS-Authenticated Migration Inventory & Reporting",
    metrics: "Inventory generation & summary reporting automated",
    summary:
      "Drove migration inventory generation and migration-summary reporting from SAS-authenticated Azure Table Storage, so every large-scale transfer is accounted for rather than assumed complete.",
    problem:
      "A terabyte-scale transfer that reports only success tells you nothing about what it actually moved, and reconciling it by hand afterwards is not realistic.",
    solution:
      "Backed the migration framework with SAS-authenticated Azure Table Storage driving both inventory generation and the migration-summary report, making completeness a checkable fact.",
    stack: ["Azure Table Storage", "SAS Auth", "AzCopy", "Python", "Delta Detection"],
    icon: FiServer,
  },
  {
    id: "grl-wix-signing",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "Packaging & Code Signing",
    title: "Signed WiX Installers & dpkg Packaging in CI",
    metrics: "Release-ready signed artifacts · Linux & Windows",
    summary:
      "Automated WiX installer builds and code signing in GitHub Actions to produce release-ready signed applications, and ran dpkg packaging in CI for Linux builds.",
    problem:
      "Windows installers were built and signed by hand, and Linux packaging was a separate manual step — so a release depended on one person's machine being set up correctly.",
    solution:
      "Moved both into GitHub Actions: WiX installer builds with code signing on the Windows side, dpkg packaging on the Linux side, producing signed release-ready artifacts from CI alone.",
    stack: ["WiX Toolset", "Code Signing", "dpkg", "GitHub Actions", "Windows / Linux"],
    icon: FiPackage,
  },
  {
    id: "grl-quality",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "Engineering Standards",
    title: "Repository Quality Gates & PR Standards",
    metrics: "Promoted at six months · Recognised twice",
    summary:
      "Restructured GitHub repositories to enforce linting, unit tests, code formatting and PR quality gates, raising review consistency across the team — as the sole engineer for build and release tooling across Linux, Windows and cloud.",
    problem:
      "Review quality varied by reviewer and repository, with formatting and test discipline left to individual habit across both embedded and enterprise product teams.",
    solution:
      "Put the standards into the repositories themselves — linting, unit tests, formatting and PR gates — so consistency stopped depending on who happened to review. Promoted at six months and recognised twice: for Zigbee/Matter team support and on-call effort, and for product build and automation ownership.",
    stack: ["GitHub", "Linting", "Unit Tests", "PR Gates", "C#/.NET", "C/C++"],
    icon: FiAward,
  },
  {
    id: "grl-aws",
    company: "Granite River Labs",
    role: "Firmware & Embedded CI",
    category: "Cloud Hosting & Least Privilege",
    title: "Least-Privilege AWS EC2 Hosting for .NET",
    metrics: "Scoped to least privilege · ARM images tuned",
    summary:
      "Scoped AWS EC2 hosting for .NET applications to least privilege through security group rules and key-pair management, and automated ARM-based machine image builds with tuned configurations.",
    problem:
      "Application hosting had broader network and key access than it needed, and machine images were built by hand with configuration that drifted between builds.",
    solution:
      "Tightened security group rules and key-pair management to least privilege, automated ARM-based image builds with tuned configurations, and wrote Bash tooling for system performance monitoring.",
    stack: ["AWS EC2", "Security Groups", "Key Pairs", "ARM Images", "Bash", ".NET"],
    icon: FiCloud,
  },
];

const COMPANIES = ["All Initiatives", "Thomson Reuters", "Granite River Labs"] as const;

/* Tenure as stated on the résumé, shown against the company filter so a
   visitor reading the initiative count also sees the span it covers. */
const TENURE: Record<string, string> = {
  "Thomson Reuters": "3 yrs 3 mos · Bangalore, India",
  "Granite River Labs": "1 yr 9 mos · Bangalore, India",
};

export default function AppleEnterpriseExperience() {
  const [selectedCompany, setSelectedCompany] = useState<string>("All Initiatives");

  const filtered = INITIATIVES.filter(
    (item) => selectedCompany === "All Initiatives" || item.company === selectedCompany
  );

  /* Six, not nine, because this one sits in the middle of the home page
     rather than on a page a visitor chose to open. Twenty initiatives is
     the single densest block on the site -- it was more than four screens
     of cards between the section above it and the section below, which is
     where a first-time reader gives up. Six is two rows: enough to show
     the range of the work and that there is a lot of it, without making
     the rest of the page unreachable by scroll. */
  const caseList = useCappedList(filtered, 6, selectedCompany);

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#9a5200] dark:text-[#e5a93b] mb-3">
            <FiServer className="w-3.5 h-3.5" />
            <span>Selected Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight text-[#1d1d1f] dark:text-white">
            Systems I&rsquo;ve built and scaled.
          </h2>

          <p className="text-[#5a5a5f] dark:text-[#9b9ba1] text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
            {INITIATIVES.length} initiatives across Thomson Reuters ({TENURE["Thomson Reuters"]}) and Granite River Labs ({TENURE["Granite River Labs"]}) — from high-throughput Azure storage migrations and backup-gated releases to signed Windows installers and automated smart-home test harnesses.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:text-[#9a5200] dark:hover:text-[#e5a93b] transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <span>View all {PROJECTS.length} platform builds</span>
          <FiArrowUpRight className="w-4 h-4 text-[#9a5200] dark:text-[#e5a93b]" />
        </Link>
      </div>

      {/* Tenure strip — the span behind the initiative counts */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-xs font-mono text-[#5a5a5f] dark:text-[#9b9ba1]">
        {Object.entries(TENURE).map(([company, span]) => (
          <span key={company} className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="font-semibold text-[#1d1d1f] dark:text-white">{company}</span>
            <span>· DevOps Engineer · {span}</span>
          </span>
        ))}
      </div>

      {/* Company Selector Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {COMPANIES.map((comp) => {
          const isSelected = selectedCompany === comp;
          const count =
            comp === "All Initiatives"
              ? INITIATIVES.length
              : INITIATIVES.filter((i) => i.company === comp).length;

          return (
            <button
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isSelected
                  ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-[1.02]"
                  : "bg-[#f5f5f7] text-[#5a5a5f] hover:text-[#1d1d1f] hover:bg-black/5 dark:bg-[#09090c] dark:text-[#9b9ba1] dark:hover:text-white dark:hover:bg-white/5 border border-black/10 dark:border-white/10"
              }`}
            >
              <span>{comp}</span>
              <span className="text-[10px] font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Modern 2-Column Bento Experience Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {caseList.visible.map((item) => {
          const Icon = item.icon;

          return (
            <GlowCard key={item.id}>
              <article className="p-7 sm:p-8 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c] border border-black/10 dark:border-white/10 flex flex-col justify-between h-full hover:border-black/25 dark:hover:border-white/25 transition-all group relative overflow-hidden">

                <div>
                  {/* Top Bar: Company Badge & Category */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#9a5200] dark:text-[#e5a93b]">
                      {item.company}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-[#9a5200] dark:text-[#e5a93b]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-3 group-hover:text-[#9a5200] dark:group-hover:text-[#e5a93b] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Impact Metric Callout */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#34c759]/10 text-emerald-700 dark:text-[#34c759] text-xs font-mono font-medium mb-4">
                    <FiCheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.metrics}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#5a5a5f] dark:text-[#9b9ba1] leading-relaxed mb-6">
                    {item.summary}
                  </p>

                  {/* Tech Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-[#424245] dark:text-[#a1a1a6]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Link / Action */}
                {/* `gap`, and allowed to wrap. Two labels under
                    `justify-between` with nothing between them collide
                    the moment both are long — "Container Orchestration"
                    sat flush against "Enterprise Production" with no
                    space at all. */}
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-semibold">
                  <span className="text-[11px] font-mono text-[#5a5a5f] dark:text-[#9b9ba1]">
                    {item.category}
                  </span>

                  {item.link ? (
                    <a
                      href={item.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#0066cc] dark:text-[#2997ff] hover:underline"
                    >
                      <span>Merge Request</span>
                      <FiExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-mono text-[#5a5a5f] dark:text-[#9b9ba1] flex items-center gap-1">
                      <span>Enterprise Production</span>
                    </span>
                  )}
                </div>

              </article>
            </GlowCard>
          );
        })}
      </div>

      {caseList.showControl && (
        <ShowMoreButton
          expanded={caseList.expanded}
          hiddenCount={caseList.hiddenCount}
          noun="initiatives"
          onClick={caseList.toggle}
        />
      )}

    </section>
  );
}

