/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.3VWOdzeE6YvUBZ3yRcdP01
 */
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { CERTS } from "@/lib/certs";
import AppleSkillsExperience from "@/components/AppleSkillsExperience";
import AppleEnterpriseExperience from "@/components/AppleEnterpriseExperience";
import AppleWorkAuthorization from "@/components/AppleWorkAuthorization";
import SystemDiagram from "@/components/SystemDiagram";
import { CountUp } from "@/components/Bits";
import AppleHeroPipeline from "@/components/AppleHeroPipeline";
import {
  FiArrowUpRight,
  FiDownload,
  FiGlobe,
  FiZap,
} from "react-icons/fi";

const STATS = [
  { value: 5, suffix: " Years", label: "Keeping production running at scale" },
  { value: 15, suffix: "+", label: "Microservices architected & maintained" },
  { value: CERTS.length, label: "Verified industry credentials earned" },
  { value: 2, suffix: " Clouds", label: "Deep production experience (AWS & Azure)" },
];

const RELEASE_FLOW = [
  { label: "Commit", note: "Automated PR linting & test suite" },
  { label: "Build", note: "Lean immutable container image tagged" },
  { label: "Gate", note: "Synthetic health & latency verified" },
  { label: "Promote", note: "Gradual zero-downtime traffic shift" },
  { label: "Verify", note: "Error rate nominal & Datadog OK" },
];

export default function Page() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-300 selection:bg-[#e5a93b]/30 selection:text-black dark:selection:text-white">
      
      {/* 1. Human-Centered Hero Section */}
      <header className="relative pt-16 pb-16 px-6 max-w-6xl mx-auto flex flex-col items-center text-center overflow-hidden">
        
        {/* Status Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#34c759]" />
          <span>Srinivasan Vijayaraghavan · DevOps & Cloud Architecture · Bangalore, IN</span>
        </div>

        {/* Clear, Human Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.12] pb-1 max-w-5xl mb-6 text-[#1d1d1f] dark:text-white">
          I build infrastructure that makes shipping software feel easy.
        </h1>

        {/* Calm, Grounded Description */}
        <p className="text-lg sm:text-xl font-normal text-[#6e6e73] dark:text-[#86868b] max-w-3xl mx-auto leading-relaxed mb-8">
          Five years automating releases, cloud migrations, and disaster recovery across AWS and Azure. I design resilient systems so engineering teams can focus on building products, not fighting deployments.
        </p>

        {/* Dual Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 z-20">
          <Link
            href="/contact"
            className="px-8 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            Get in touch
          </Link>
          <a
            href="/resume.pdf"
            download
            className="px-7 py-3.5 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 font-semibold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <FiDownload className="w-4 h-4 text-amber-600 dark:text-[#e5a93b]" />
            Download Résumé
          </a>
          <Link
            href="/projects"
            className="px-7 py-3.5 rounded-full bg-transparent text-[#6e6e73] hover:text-[#1d1d1f] dark:text-[#86868b] dark:hover:text-white font-medium text-sm transition-colors flex items-center gap-1.5"
          >
            <span>Explore all {PROJECTS.length} builds</span>
            <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Calm Architecture Blueprint Showcase */}
        <div className="w-full max-w-5xl">
          <AppleHeroPipeline />
        </div>
      </header>

      {/* 2. Key Metrics */}
      <section className="py-14 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((st) => (
            <div
              key={st.label}
              className="p-6 sm:p-7 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl hover:border-black/20 dark:hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] dark:text-white tracking-tight font-mono mb-2">
                <CountUp value={st.value} suffix={st.suffix} />
              </div>
              <div className="text-xs font-medium text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Release Reliability Architecture */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b] mb-4 backdrop-blur-md">
            <span>Reliability by Design</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight text-[#1d1d1f] dark:text-white mb-4">
            How I approach zero-downtime releases.
          </h2>
          <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Every step is automated, measured, and verified before user traffic touches it. If something looks off, traffic reverts immediately.
          </p>
        </div>

        <SystemDiagram
          stages={RELEASE_FLOW}
          returnPath="Rollback executes the exact same pipeline in reverse — verified & automated"
          caption="Production release architecture across Azure & AWS. Automated health gates verify HTTP 200 responses, latency budgets, and service dependencies before routing traffic."
        />
      </section>

      {/* 4. Skills & Disciplines (Interactive Engineering Matrix) - Placed above Selected Experience */}
      <AppleSkillsExperience />

      {/* 5. Enterprise Experience (Apple Case Study Matrix) */}
      <AppleEnterpriseExperience />

      {/* 6. Personal Projects & Tooling (Card-free Showcase Gateway to Projects) */}
      <section className="py-20 px-6 max-w-6xl mx-auto border-t border-black/10 dark:border-white/10">
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left shadow-lg dark:shadow-none">
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
              <span>Side Projects & Tools</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tightest leading-tight text-[#1d1d1f] dark:text-white">
              Things I&rsquo;ve built on the side.
            </h2>

            <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg leading-relaxed">
              Practical tools, deployment orchestrators, and browser utilities I use in my day-to-day workflow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] justify-center md:justify-start">
              <span>• {PROJECTS.length} Production Builds</span>
              <span>• Self-Healing Pipelines</span>
              <span>• Open Source Tools</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 w-full md:w-auto flex-shrink-0">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Explore All {PROJECTS.length} Projects</span>
              <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b]" />
            </Link>
            <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b]">
              Interactive filters, live demos & source code
            </span>
          </div>

        </div>
      </section>

      {/* 7. Creative Work Authorization Terminal */}
      <AppleWorkAuthorization />

      {/* 8. Human Closing Banner */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#f5f5f7] to-white dark:from-[#09090c] dark:to-black border-t border-black/10 dark:border-white/10">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/15 mx-auto flex items-center justify-center mb-6 shadow-sm">
            <FiZap className="w-6 h-6 text-amber-600 dark:text-[#e5a93b]" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white mb-4">
            Let&rsquo;s build something dependable together.
          </h2>
          <p className="text-[#6e6e73] dark:text-[#86868b] text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            I&rsquo;m open to senior DevOps, Site Reliability Engineering, and Cloud Architecture roles. Let&rsquo;s talk about what your team is building.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold text-base transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Start a Conversation
            </Link>
            <a
              href="https://www.linkedin.com/in/srini-solution-architect/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15 font-medium text-base transition-all flex items-center justify-center gap-2"
            >
              <FiGlobe className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              LinkedIn Profile
            </a>
          </div>

          <div className="mt-8 text-xs text-[#6e6e73] dark:text-[#86868b] flex flex-wrap items-center justify-center gap-6">
            <span>✓ US Citizen (No visa sponsorship needed)</span>
            <span>✓ OCI Cardholder (India)</span>
            <span>✓ 5 Years Enterprise Cloud Track Record</span>
          </div>
        </div>
      </section>

    </main>
  );
}
