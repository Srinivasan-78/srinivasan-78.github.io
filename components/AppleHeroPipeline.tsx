/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
"use client";

import React, { useState } from "react";
import { FiCheckCircle, FiShield, FiGitBranch, FiPackage, FiActivity } from "react-icons/fi";

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
    description: "Multi-arch Docker images are built and tagged with unique commit SHAs. Configurations are injected at runtime via environment variables to guarantee identical container behavior across staging and production.",
    tools: ["Docker", "Azure ACR", "AWS ECR", "Multi-arch Buildx"],
    safetyCheck: "Images are scanned for vulnerabilities before being pushed to the container registry.",
  },
  {
    id: "gate",
    stepNumber: "03",
    title: "Automated Health Gates",
    shortSummary: "HTTP 200 & latency verification",
    icon: FiCheckCircle,
    description: "Before routing any live user traffic to a new build, synthetic health checks test endpoints for HTTP 200 responses, SSL certificate validity, and acceptable response times under load.",
    tools: ["Python", "curl", "Synthetic Probes", "Postman/Newman"],
    safetyCheck: "Deployments immediately halt if response times exceed 15ms or non-200 status codes appear.",
  },
  {
    id: "shift",
    stepNumber: "04",
    title: "Zero-Downtime Traffic Shift",
    shortSummary: "Blue/Green & NLB convergence",
    icon: FiActivity,
    description: "Traffic is gradually shifted to the new container cluster using Azure Network Load Balancers or AWS Application Load Balancers. Active user sessions are preserved without connection drops.",
    tools: ["Azure NLB", "AWS ALB", "Nginx", "Traffic Routing"],
    safetyCheck: "Old container instances remain warm and standby until the new cluster proves stable.",
  },
  {
    id: "guard",
    stepNumber: "05",
    title: "Continuous Observability & Auto-Rollback",
    shortSummary: "Real-time telemetry safety net",
    icon: FiShield,
    description: "Datadog monitors error rates, CPU/memory saturation, and database connection pools. If anomalies are detected, automated workflows revert load balancer targets to the prior build in seconds.",
    tools: ["Datadog", "CloudWatch", "Prometheus", "Automated Rollback"],
    safetyCheck: "One-click and fully automated rollbacks restore the last known good state with zero manual panic.",
  },
];

export default function AppleHeroPipeline() {
  const [activeStepId, setActiveStepId] = useState<string>("gate");
  const activeStep = PIPELINE_STEPS.find((s) => s.id === activeStepId) || PIPELINE_STEPS[2];

  return (
    <div className="w-full rounded-3xl bg-[#f5f5f7]/90 dark:bg-[#09090c]/90 border border-black/10 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-xl dark:shadow-2xl relative overflow-hidden text-left my-8 transition-colors duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#34c759]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#6e6e73] dark:text-[#a1a1a6]">
              Deployment Architecture Blueprint
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
            How I Keep Releases Calm, Fast & Predictable
          </h3>
        </div>

        <span className="text-xs text-[#6e6e73] dark:text-[#86868b] font-medium hidden sm:inline">
          Click any step to explore how it works
        </span>
      </div>

      {/* 5-Step Interactive Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 my-6">
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
                  : "bg-black/[0.02] dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/15 dark:hover:border-white/15 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#86868b]">
                  Step {step.stepNumber}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? "text-amber-600 dark:text-[#e5a93b]" : "text-[#86868b]"}`} />
              </div>

              <div className="font-bold text-sm text-[#1d1d1f] dark:text-white mb-1">
                {step.title}
              </div>
              <div className="text-[11px] text-[#6e6e73] dark:text-[#86868b] leading-snug">
                {step.shortSummary}
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Blueprint Focus Card */}
      <div className="rounded-2xl bg-white dark:bg-black/60 border border-black/10 dark:border-white/10 p-6 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-[#e5a93b] text-xs font-mono font-medium">
              <span>Stage {activeStep.stepNumber}: {activeStep.title}</span>
            </div>

            <p className="text-sm sm:text-base text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
              {activeStep.description}
            </p>

            <div className="flex items-start gap-2 pt-2 text-xs text-[#6e6e73] dark:text-[#86868b]">
              <span className="font-semibold text-emerald-600 dark:text-[#34c759] whitespace-nowrap">
                Safety Guarantee:
              </span>
              <span>{activeStep.safetyCheck}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px] pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-black/10 dark:border-white/10 md:pl-6">
            <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b] uppercase tracking-wider">
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
