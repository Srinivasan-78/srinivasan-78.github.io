/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌​​​‌​‌‌‌​​​​​‌​‌​‌​‌​‌‌​​‌​‌​‌‌​​​​‌​‌‌‌‌​‌​​‌​​​‌‌​​‌‌​‌​‌​​​‌‌​‌‌‌​‌‌‌​‌‌‌​‌​​​‌​‌​​‌‌​‌​‌​‌​​‌‌​​​‌​​‌​​‌​​‌‌‌​​‌​‌​​‌​‌​​‌‌​​‌​​​‌​​‌‌​​​‌‌​​‌​​​‌​​​​‌‌​​‌‌​​‌​​​‌‌​​​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.qpUeazFj7wE5LI9JdLdC20
 */

/* The release pipeline, in two resolutions.

   RELEASE_FLOW is the six-stage summary the system diagram draws: a
   label and a one-line note per stage, plus the return path that makes
   the whole thing safe. PIPELINE_STEPS is the same six stages at full
   depth — what each one does, what it runs on, and the guarantee it
   holds — for the panel a visitor opens. They are deliberately separate:
   the diagram has to stay readable at a glance, and collapsing the long
   form into it is what made the old banner unreadable. */

export type PipelineIconToken =
  | "git-branch"
  | "package"
  | "database"
  | "check-circle"
  | "activity"
  | "shield";

/** One stage of the summary flow the diagram draws. */
export type ReleaseStage = {
  label: string;
  note?: string;
};

export const RELEASE_FLOW: ReleaseStage[] = [
  { label: "Commit", note: "Automated PR linting & test suite" },
  { label: "Build", note: "Lean immutable container image tagged" },
  { label: "Backup", note: "T-SQL-verified backup, safe-skip on live SQL jobs" },
  { label: "Gate", note: "Synthetic health & latency verified" },
  { label: "Promote", note: "Gradual zero-downtime traffic shift" },
  { label: "Verify", note: "Error rate nominal & Datadog OK" },
];

/** The line that runs back from the end of the flow to its start. */
export const RELEASE_FLOW_RETURN_PATH =
  "Rollback executes the exact same pipeline in reverse — RESTORE-based database rollback, service resets, checkpoint cleanup & external system resync, all automated";

export const RELEASE_FLOW_CAPTION =
  "Production release architecture across Azure & AWS. Automated health gates verify four conditions before traffic is routed — service state, HTTP 200, load-balancer convergence and the health-check file — with drain timeouts and retry/backoff at 5 attempts on a 2-second delay so a slow start is never mistaken for a failure.";

/** One stage of the pipeline at full depth. */
export type PipelineStep = {
  id: string;
  stepNumber: string;
  title: string;
  shortSummary: string;
  icon: PipelineIconToken;
  description: string;
  tools: string[];
  safetyCheck: string;
};

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: "commit",
    stepNumber: "01",
    title: "Code & Branch Gate",
    shortSummary: "Automated pre-merge verification",
    icon: "git-branch",
    description: "Every pull request runs automated linters, static code analysis, and dependency security scans. Fast-forward merges ensure the commit history remains clean and traceable.",
    tools: ["GitHub Actions", "Git", "SonarQube", "Branch Rules"],
    safetyCheck: "Branch protection prevents unreviewed or failing commits from reaching the main branch.",
  },
  {
    id: "build",
    stepNumber: "02",
    title: "Immutable Containers",
    shortSummary: "Lean multi-arch build & tag",
    icon: "package",
    description: "Multi-arch Docker images are built and tagged with unique commit SHAs. Configurations are injected at runtime via environment variables to guarantee identical container behavior across staging and production. Promotion into ACR and AKS runs in GitHub Actions with real-time Azure DevOps, ACR and AKS log polling, behind two RBAC-gated workflows and BYOK encryption through Key Vault.",
    tools: ["Docker", "Azure ACR", "AKS", "AWS ECR", "Key Vault (BYOK)", "Multi-arch Buildx"],
    safetyCheck: "Images are scanned for vulnerabilities before being pushed, and promotion is RBAC-gated rather than open to anyone with pipeline access.",
  },
  {
    id: "backup",
    stepNumber: "03",
    title: "Backup-Verified Release Gate",
    shortSummary: "T-SQL proof before anything moves",
    icon: "database",
    description: "No release proceeds on a backup nobody checked. A T-SQL verification step proves the backup exists and is restorable, with a RESTORE-based rollback path staged and Datadog failure hooks wired in. A safe-skip flow polls for active SQL Server tasks first, so a live job never blocks the deployment and the deployment never corrupts a live job.",
    tools: ["SQL Server", "T-SQL", "RESTORE Rollback", "Datadog Hooks"],
    safetyCheck: "A release cannot pass this gate without a verified, restorable backup behind it.",
  },
  {
    id: "gate",
    stepNumber: "04",
    title: "Automated Health Gates",
    shortSummary: "HTTP 200 & latency verification",
    icon: "check-circle",
    description: "Before routing any live user traffic to a new build, a fail-fast Apache health gate validates four conditions: service state, an HTTP 200 response, load-balancer convergence, and the presence of the health-check file. Drain timeouts and retry/backoff at 5 attempts on a 2-second delay keep a slow start from being misread as a failure, so false restarts stop happening.",
    tools: ["Python", "Apache", "Tomcat", "Synthetic Probes", "JMX / TCP Checks"],
    safetyCheck: "Deployments halt unless all four conditions pass — service state, HTTP 200, LB convergence and health-check file.",
  },
  {
    id: "shift",
    stepNumber: "05",
    title: "Zero-Downtime Traffic Shift",
    shortSummary: "Blue/Green & NLB convergence",
    icon: "activity",
    description: "Traffic is gradually shifted to the new container cluster using Azure Network Load Balancers or AWS Application Load Balancers. Active user sessions are preserved without connection drops.",
    tools: ["Azure NLB", "AWS ALB", "Nginx", "Traffic Routing"],
    safetyCheck: "Old container instances remain warm and standby until the new cluster proves stable.",
  },
  {
    id: "guard",
    stepNumber: "06",
    title: "Continuous Observability & Auto-Rollback",
    shortSummary: "Real-time telemetry safety net",
    icon: "shield",
    description: "Datadog monitors error rates, CPU/memory saturation, and database connection pools across every microservice through dynamic HTTP, TCP and JMX templates with standardised tagging and dependency-aware restarts. If anomalies are detected, automated workflows revert load balancer targets to the prior build in seconds, with Teams alerting wired straight into the deployment pipeline.",
    tools: ["Datadog", "Pingdom", "JMX / TCP / HTTP Checks", "Teams Alerting", "Automated Rollback"],
    safetyCheck: "One-click and fully automated rollbacks restore the last known good state with zero manual panic.",
  },
];

/** The step the blueprint panel opens on. */
export const PIPELINE_DEFAULT_STEP_ID = "gate";

export const PIPELINE_COPY = {
  eyebrow: "Deployment Architecture Blueprint",
  heading: "How I Keep Releases Calm, Fast & Predictable",
  hint: "Click any step to explore how it works",
  stepLabelPrefix: "Step",
  stageLabelPrefix: "Stage",
  safetyLabel: "Safety Guarantee:",
  toolingLabel: "Tooling Stack",
} as const;
