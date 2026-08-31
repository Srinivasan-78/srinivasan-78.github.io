/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import GlowCard from "./ui/GlowCard";
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
];

const COMPANIES = ["All Initiatives", "Thomson Reuters", "Granite River Labs"] as const;

export default function AppleEnterpriseExperience() {
  const [selectedCompany, setSelectedCompany] = useState<string>("All Initiatives");

  const filtered = INITIATIVES.filter(
    (item) => selectedCompany === "All Initiatives" || item.company === selectedCompany
  );

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b] mb-3 backdrop-blur-md">
            <FiServer className="w-3.5 h-3.5" />
            <span>Selected Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight text-[#1d1d1f] dark:text-white">
            Systems I&rsquo;ve built and scaled.
          </h2>

          <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg mt-2 max-w-2xl leading-relaxed">
            Six key initiatives across Thomson Reuters and Granite River Labs, from high-throughput Azure storage migrations to automated smart home test harnesses.
          </p>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] dark:text-white hover:text-amber-600 dark:hover:text-[#e5a93b] transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <span>View all {PROJECTS.length} platform builds</span>
          <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b]" />
        </Link>
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
                  : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 dark:bg-[#09090c]/80 dark:text-[#86868b] dark:hover:text-white dark:hover:bg-white/5 border border-black/10 dark:border-white/10"
              }`}
            >
              <span>{comp}</span>
              <span className="text-[10px] font-mono opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Modern 2-Column Bento Experience Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          const Icon = item.icon;

          return (
            <GlowCard key={item.id}>
              <article className="p-7 sm:p-8 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 flex flex-col justify-between h-full hover:border-black/25 dark:hover:border-white/25 transition-all group relative overflow-hidden">
                
                <div>
                  {/* Top Bar: Company Badge & Category */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-amber-700 dark:text-[#e5a93b]">
                      {item.company}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-amber-600 dark:text-[#e5a93b]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-3 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Impact Metric Callout */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#34c759]/10 text-emerald-700 dark:text-[#34c759] text-xs font-mono font-medium mb-4">
                    <FiCheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.metrics}</span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed mb-6">
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
                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                  <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b]">
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
                    <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b] flex items-center gap-1">
                      <span>Enterprise Production</span>
                    </span>
                  )}
                </div>

              </article>
            </GlowCard>
          );
        })}
      </div>

    </section>
  );
}

