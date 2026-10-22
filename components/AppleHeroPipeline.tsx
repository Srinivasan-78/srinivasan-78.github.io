/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​‌‌‌​​‌‌‌​​​​​‌‌​‌‌​‌​‌‌‌​​​‌​​‌‌​​​​​​‌‌​‌​​​‌‌​​​​‌​‌​​‌​‌‌​​‌​‌‌​‌​‌‌​‌​‌‌​‌​‌‌‌‌‌​‌​‌​​​​​​‌‌​​‌‌​‌‌‌​‌​​​‌‌​‌​​​​​‌‌​​‌‌​‌​​‌​‌​​‌‌‌​​​​​​‌‌​‌‌‌​‌​​​‌​​​​‌‌​‌‌‌​‌​‌‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Npmq04aK-k_P3th3Jp7D7_
 */
"use client";

import React, { useState } from "react";
import { FiCheckCircle, FiShield, FiGitBranch, FiPackage, FiActivity, FiDatabase } from "react-icons/fi";

type Step = {
  id: string;
  stepNumber: string;
  title: string;
  shortSummary: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  tools: string[];
  safetyCheck: string;
};

const PIPELINE_STEPS: Step[] = [
  {
    id: "commit",
    stepNumber: "01",
    title: "Code & Branch Gate",
    shortSummary: "Automated pre-merge verification",
    icon: FiGitBranch,
    description: "Every pull request runs automated linters, static code analysis, and dependency security scans. Fast-forward merges ensure the commit history remains clean and traceable.",
    tools: ["GitHub Actions", "Git", "SonarQube", "Branch Rules"],
    safetyCheck: "Branch protection prevents unreviewed or failing commits from reaching the main branch.",
  },
  {
    id: "build",
    stepNumber: "02",
    title: "Immutable Containers",
    shortSummary: "Lean multi-arch build & tag",
    icon: FiPackage,
    description: "Multi-arch Docker images are built and tagged with unique commit SHAs. Configurations are injected at runtime via environment variables to guarantee identical container behavior across staging and production. Promotion into ACR and AKS runs in GitHub Actions with real-time Azure DevOps, ACR and AKS log polling, behind two RBAC-gated workflows and BYOK encryption through Key Vault.",
    tools: ["Docker", "Azure ACR", "AKS", "AWS ECR", "Key Vault (BYOK)", "Multi-arch Buildx"],
    safetyCheck: "Images are scanned for vulnerabilities before being pushed, and promotion is RBAC-gated rather than open to anyone with pipeline access.",
  },
  {
    id: "backup",
    stepNumber: "03",
    title: "Backup-Verified Release Gate",
    shortSummary: "T-SQL proof before anything moves",
    icon: FiDatabase,
    description: "No release proceeds on a backup nobody checked. A T-SQL verification step proves the backup exists and is restorable, with a RESTORE-based rollback path staged and Datadog failure hooks wired in. A safe-skip flow polls for active SQL Server tasks first, so a live job never blocks the deployment and the deployment never corrupts a live job.",
    tools: ["SQL Server", "T-SQL", "RESTORE Rollback", "Datadog Hooks"],
    safetyCheck: "A release cannot pass this gate without a verified, restorable backup behind it.",
  },
  {
    id: "gate",
    stepNumber: "04",
    title: "Automated Health Gates",
    shortSummary: "HTTP 200 & latency verification",
    icon: FiCheckCircle,
    description: "Before routing any live user traffic to a new build, a fail-fast Apache health gate validates four conditions: service state, an HTTP 200 response, load-balancer convergence, and the presence of the health-check file. Drain timeouts and retry/backoff at 5 attempts on a 2-second delay keep a slow start from being misread as a failure, so false restarts stop happening.",
    tools: ["Python", "Apache", "Tomcat", "Synthetic Probes", "JMX / TCP Checks"],
    safetyCheck: "Deployments halt unless all four conditions pass — service state, HTTP 200, LB convergence and health-check file.",
  },
  {
    id: "shift",
    stepNumber: "05",
    title: "Zero-Downtime Traffic Shift",
    shortSummary: "Blue/Green & NLB convergence",
    icon: FiActivity,
    description: "Traffic is gradually shifted to the new container cluster using Azure Network Load Balancers or AWS Application Load Balancers. Active user sessions are preserved without connection drops.",
    tools: ["Azure NLB", "AWS ALB", "Nginx", "Traffic Routing"],
    safetyCheck: "Old container instances remain warm and standby until the new cluster proves stable.",
  },
  {
    id: "guard",
    stepNumber: "06",
    title: "Continuous Observability & Auto-Rollback",
    shortSummary: "Real-time telemetry safety net",
    icon: FiShield,
    description: "Datadog monitors error rates, CPU/memory saturation, and database connection pools across every microservice through dynamic HTTP, TCP and JMX templates with standardised tagging and dependency-aware restarts. If anomalies are detected, automated workflows revert load balancer targets to the prior build in seconds, with Teams alerting wired straight into the deployment pipeline.",
    tools: ["Datadog", "Pingdom", "JMX / TCP / HTTP Checks", "Teams Alerting", "Automated Rollback"],
    safetyCheck: "One-click and fully automated rollbacks restore the last known good state with zero manual panic.",
  },
];

export default function AppleHeroPipeline() {
  const [activeStepId, setActiveStepId] = useState<string>("gate");
  const activeStep = PIPELINE_STEPS.find((s) => s.id === activeStepId) || PIPELINE_STEPS[3];

  return (
    <div className="w-full rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c] border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden text-left my-8 transition-colors duration-300">

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34c759]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#5a5a5f] dark:text-[#a1a1a6]">
              Deployment Architecture Blueprint
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            How I Keep Releases Calm, Fast & Predictable
          </h2>
        </div>

        <span className="text-xs text-[#5a5a5f] dark:text-[#9b9ba1] font-medium hidden sm:inline">
          Click any step to explore how it works
        </span>
      </div>

      {/* 6-Step Interactive Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 my-6">
        {PIPELINE_STEPS.map((step) => {
          const isSelected = activeStepId === step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStepId(step.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-white dark:bg-white/10 border-black/25 dark:border-white/30 shadow-md scale-[1.02]"
                  : "bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#5a5a5f] dark:text-[#9b9ba1]">
                  Step {step.stepNumber}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? "text-amber-600 dark:text-[#e5a93b]" : "text-[#5a5a5f] dark:text-[#9b9ba1]"}`} />
              </div>

              <div className="font-bold text-sm text-[#1d1d1f] dark:text-white mb-1">
                {step.title}
              </div>
              <div className="text-[11px] text-[#5a5a5f] dark:text-[#9b9ba1] leading-snug">
                {step.shortSummary}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Blueprint Focus Card */}
      <div className="rounded-2xl bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 shadow-xs dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-[#e5a93b] text-xs font-mono font-medium">
              <span>Stage {activeStep.stepNumber}: {activeStep.title}</span>
            </div>

            <p className="text-sm sm:text-base text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
              {activeStep.description}
            </p>

            <div className="flex items-start gap-2 pt-2 text-xs text-[#5a5a5f] dark:text-[#9b9ba1]">
              <span className="font-semibold text-emerald-600 dark:text-[#34c759] whitespace-nowrap">
                Safety Guarantee:
              </span>
              <span>{activeStep.safetyCheck}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px] pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 md:pl-6">
            <span className="text-[11px] font-mono text-[#5a5a5f] dark:text-[#9b9ba1] uppercase tracking-wider">
              Tooling Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeStep.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#a1a1a6]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
