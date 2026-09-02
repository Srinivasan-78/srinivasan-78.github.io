/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
"use client";

import React, { useState } from "react";
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
} from "react-icons/fi";

type SkillDetail = {
  name: string;
  category: string;
  role: string;
  productionContext: string;
  highlight: string;
  tenure: string;
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
    ],
  },
];

export default function AppleSkillsExperience() {
  const [activeDomainId, setActiveDomainId] = useState<string>("cicd");
  const [selectedSkill, setSelectedSkill] = useState<SkillDetail>(
    SKILL_DOMAINS[0].primarySkills[0]
  );

  const currentDomain =
    SKILL_DOMAINS.find((d) => d.id === activeDomainId) || SKILL_DOMAINS[0];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b] mb-4 backdrop-blur-md">
          <FiCpu className="w-3.5 h-3.5" />
          <span>Skills</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight pb-1 text-[#1d1d1f] dark:text-white mb-4">
          What I love working with.
        </h2>

        <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg leading-relaxed">
          Five years of hands-on enterprise infrastructure experience. Select any discipline to inspect real-world production use cases, architectures, and capabilities.
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
                  : "bg-[#f5f5f7] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 dark:bg-[#09090c]/80 dark:text-[#86868b] dark:hover:text-white dark:hover:bg-white/5 border border-black/10 dark:border-white/10"
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
            <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
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
                      : "bg-[#f5f5f7] dark:bg-[#09090c]/80 border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
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
                    <div className="text-xs text-[#6e6e73] dark:text-[#86868b] font-mono">
                      {skill.role}
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-[#6e6e73] dark:text-[#a1a1a6]">
                    {skill.tenure}
                  </span>
                </button>
              </GlowCard>
            );
          })}
        </div>

        {/* Right Column: Deep Production Inspector Card */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl relative overflow-hidden shadow-xl transition-all">

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
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#86868b] mb-2">
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

              {/* Quick Status Strip */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#6e6e73] dark:text-[#86868b]">
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

