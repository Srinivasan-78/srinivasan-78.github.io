/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​​‌‌‌​​‌‌​‌​​​‌‌​​​‌‌​‌‌​​​​‌​‌‌​​‌‌​​‌​​‌​​‌​​‌‌​​​‌​​‌‌​​​​​‌‌​​‌​​​​‌‌​‌​​​‌‌‌​​‌​​​‌​‌‌​‌​​‌‌​​‌‌​‌‌​‌‌​‌​‌‌‌‌​‌​​‌‌​‌‌‌‌​‌​‌​​‌​​​‌‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌‌​​​​‌​‌‌​​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.g4cafI10d4r-3mzoR2cdaf
 */
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import GlowCard from "@/components/ui/GlowCard";
import { notFound } from "next/navigation";
import SplitReveal from "@/components/SplitReveal";
import Reveal from "@/components/Reveal";
import SystemDiagram from "@/components/SystemDiagram";
import { PROJECTS, projectBySlug } from "@/lib/projects";
import { FiArrowUpRight, FiArrowLeft, FiExternalLink } from "react-icons/fi";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) return {};
  return pageMetadata({
    title: p.title,
    description: p.teaser,
    path: `/projects/${p.slug}`,
  });
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const p = projectBySlug(params.slug);
  if (!p) notFound();

  const actions =
    p.demo && !p.links.some((l) => l.url === p.demo)
      ? [{ url: p.demo, label: "Open live build ↗" }, ...p.links]
      : p.links;

  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300">
      <div className="wrap pd-top py-12 px-6 max-w-5xl mx-auto">
        <Link href="/projects" className="inline-flex items-center gap-2 text-xs font-mono text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors mb-8">
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="pd-hero mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b] mb-4 backdrop-blur-md">
            <span>{p.client} · {p.category}</span>
          </div>
          <SplitReveal as="h1" text={p.title} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tightest leading-[1.15] mb-4 text-[#1d1d1f] dark:text-white" />
          <p className="text-base sm:text-xl text-[#6e6e73] dark:text-[#86868b] leading-relaxed mb-6 max-w-3xl">
            {p.teaser}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#34c759]" />
              Status: {p.status}
            </span>
            <span>·</span>
            <span>{p.stack.length} technologies in stack</span>
          </div>
        </div>
      </div>

      {/* Architecture System Diagram */}
      <section className="section section-bleed py-12 border-y border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-[#09090c]/50">
        <div className="wrap max-w-5xl mx-auto px-6">
          <SystemDiagram
            stages={p.architecture.map((a) => ({ label: a.label }))}
            caption={`System Architecture: How ${p.title} functions.`}
          />
        </div>
      </section>

      <div className="wrap max-w-5xl mx-auto px-6 py-12 space-y-12">
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
            <span>Overview</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
            Architecture Overview
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
            {p.overview}
          </p>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
              <span>Architecture Breakdown</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
              How it works
            </h2>
            <p className="text-sm sm:text-base text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
              Core mechanics, failure recovery paths, and system design decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {p.architecture.map((a, index) => (
              <div
                key={a.label}
                className="p-6 sm:p-7 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-amber-600 dark:text-[#e5a93b]">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#34c759]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-2.5 leading-snug">
                    {a.label}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-[#424245] dark:text-[#a1a1a6]">
                    {a.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
              <span>Key Takeaways</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
              Engineering Highlights
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base text-[#424245] dark:text-[#a1a1a6]">
            {p.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-emerald-600 dark:text-[#34c759] font-bold mt-0.5">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
              <span>Stack & Tools</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
              Technologies Used
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.stack.map((t) => (
              <span key={t} className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-[#f5f5f7] dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#a1a1a6]">
                {t}
              </span>
            ))}
          </div>
        </section>

        {actions.length > 0 ? (
          <Reveal className="hero-actions flex flex-wrap items-center gap-4 pt-6 border-t border-black/10 dark:border-white/10">
            {actions.map((l, i) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                  i === 0
                    ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-lg"
                    : "bg-black/5 hover:bg-black/10 text-[#1d1d1f] border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white dark:border-white/15"
                }`}
              >
                <span>{l.label}</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </a>
            ))}
          </Reveal>
        ) : (
          <Reveal className="hero-actions flex flex-wrap items-center gap-4 pt-6 border-t border-black/10 dark:border-white/10">
            <Link href="/contact" className="px-6 py-3 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg">
              Ask me about this project
            </Link>
            <span className="text-xs text-[#6e6e73] dark:text-[#86868b] font-mono">Internal enterprise or private repository</span>
          </Reveal>
        )}
      </div>

      {/* Sequential Project Pagination */}
      {(() => {
        const currentIndex = PROJECTS.findIndex((o) => o.slug === p.slug);
        const prevProject = currentIndex > 0 ? PROJECTS[currentIndex - 1] : PROJECTS[PROJECTS.length - 1];
        const nextProject = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : PROJECTS[0];

        return (
          <div className="wrap max-w-5xl mx-auto px-6 py-8 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href={`/projects/${prevProject.slug}`}
                className="w-full sm:w-auto p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex items-center gap-3 text-left group"
              >
                <FiArrowLeft className="w-4 h-4 text-amber-600 dark:text-[#e5a93b] group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#86868b] uppercase block">Previous Build</span>
                  <span className="text-xs font-bold text-[#1d1d1f] dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">{prevProject.title}</span>
                </div>
              </Link>

              <Link
                href="/projects"
                className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-colors py-2 px-4 rounded-full bg-black/5 dark:bg-white/5"
              >
                Directory ({currentIndex + 1}/{PROJECTS.length})
              </Link>

              <Link
                href={`/projects/${nextProject.slug}`}
                className="w-full sm:w-auto p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex items-center justify-between sm:justify-end gap-3 text-right group"
              >
                <div>
                  <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#86868b] uppercase block">Next Build</span>
                  <span className="text-xs font-bold text-[#1d1d1f] dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">{nextProject.title}</span>
                </div>
                <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        );
      })()}

      {/* Explore Other Projects */}
      <div className="wrap max-w-5xl mx-auto px-6 pt-12 border-t border-black/10 dark:border-white/10">
        <section className="pd-section space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Explore More Projects</h2>
            <Link href="/projects" className="text-xs font-semibold text-amber-600 dark:text-[#e5a93b] hover:underline flex items-center gap-1">
              <span>All {PROJECTS.length} builds</span>
              <FiArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Reveal className="grid grid-cols-1 sm:grid-cols-3 gap-4" pop>
            {PROJECTS.filter((o) => o.slug !== p.slug)
              .slice(0, 3)
              .map((o) => (
                <GlowCard key={o.slug}>
                  <Link href={`/projects/${o.slug}`} className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-all flex flex-col justify-between h-full group block">
                    <div>
                      <span className="text-[11px] font-mono text-amber-600 dark:text-[#e5a93b] uppercase tracking-wider block mb-2">{o.client}</span>
                      <h3 className="text-base font-bold text-[#1d1d1f] dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors">{o.title}</h3>
                      <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed mb-4 line-clamp-2">{o.teaser}</p>
                    </div>
                    <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1d1d1f] dark:text-white">
                      <span>Overview</span>
                      <FiArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
                    </div>
                  </Link>
                </GlowCard>
              ))}
          </Reveal>
        </section>
      </div>
    </main>
  );
}
