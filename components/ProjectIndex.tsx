/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​‌​​‌‌​‌​​​​‌​​‌​‌‌​‌​‌‌​​​​‌‌​‌​‌​​​‌‌​​​​​‌​​‌‌​​​‌‌​‌‌​‌​‌​‌‌​‌​​‌‌​​​‌‌​‌​​‌‌‌‌​‌​‌​​​​​‌​​​​​‌​‌​‌‌​‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌​​​​‌​​‌​​​​​‌​‌‌​‌​‌​​‌​​‌‌‌‌​‌‌‌​‌‌​​‌​‌​‌‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.jhKXj0LmZcOPAZWOBAjOvV
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import GlowCard from "./ui/GlowCard";
import { PROJECTS } from "@/lib/projects";
import {
  FiArrowUpRight,
  FiExternalLink,
  FiGithub,
  FiLayers,
  FiSearch,
  FiCheckCircle,
  FiTerminal,
  FiZap,
} from "react-icons/fi";

const CATEGORIES = [
  "All",
  "Platform",
  "Infrastructure",
  "Developer tooling",
  "Utility",
  "Actions",
  "Client build",
];

export default function ProjectIndex() {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const liveDemosCount = useMemo(
    () => PROJECTS.filter((p) => !!p.demo).length,
    []
  );

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((p) => {
      const matchesCat =
        selectedCat === "All" ||
        p.category.toLowerCase() === selectedCat.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.teaser.toLowerCase().includes(q) ||
        p.stack.some((tech) => tech.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCat, searchQuery]);

  const featuredProject = PROJECTS.find(
    (p) => p.slug === "self-healing-deployment"
  );

  return (
    <main
      id="content"
      tabIndex={-1}
      className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300 selection:bg-[#e5a93b]/30 selection:text-black dark:selection:text-white"
    >
      {/* 1. Hero Section */}
      <header className="pt-20 pb-12 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-6 backdrop-blur-md">
          <FiLayers className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
          <span>Platform Engineering & Open Source</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.18] pb-1 max-w-4xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Things I build for the craft of it.
        </h1>

        <p className="text-base sm:text-xl font-normal text-[#6e6e73] dark:text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-8">
          {PROJECTS.length} platform orchestrators, deployment tools, and cloud utilities. Designed to solve real infrastructure problems and tested in production.
        </p>

        {/* Quick Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#6e6e73] dark:text-[#86868b] mb-10 pb-8 border-b border-black/10 dark:border-white/10 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34c759]" />
            <span>{PROJECTS.length} Total Builds</span>
          </div>
          <div>•</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066cc] dark:bg-[#2997ff]" />
            <span>{liveDemosCount} Live Hosted Deployments</span>
          </div>
          <div>•</div>
          <div>100% Tested Architecture</div>
        </div>

        {/* Search Input & Category Filters */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, technology (e.g. Docker, Ansible, Python, Azure)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 text-sm text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? PROJECTS.length
                  : PROJECTS.filter(
                      (p) => p.category.toLowerCase() === cat.toLowerCase()
                    ).length;
              const isSelected = selectedCat === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-md scale-105"
                      : "bg-[#f5f5f7] hover:bg-black/5 dark:bg-[#09090c]/80 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? "opacity-75" : "text-[#86868b] dark:text-[#a1a1a6]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 2. Flagship Featured Highlight (Shown when filter is "All" and no search) */}
      {selectedCat === "All" && !searchQuery && featuredProject && (
        <section className="px-6 max-w-6xl mx-auto mb-12">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/15 dark:border-white/15 backdrop-blur-xl shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-[#e5a93b] text-xs font-mono font-medium">
                  <FiZap className="w-3.5 h-3.5" />
                  <span>Featured Flagship Build</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1d1d1f] dark:text-white">
                  {featuredProject.title}
                </h2>

                <p className="text-sm sm:text-base text-[#424245] dark:text-[#a1a1a6] leading-relaxed">
                  {featuredProject.overview}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {featuredProject.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#1d1d1f] dark:text-[#a1a1a6]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0 pt-2 lg:pt-0">
                {featuredProject.demo && (
                  <a
                    href={featuredProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-7 py-3.5 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Launch Live Demo</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/projects/${featuredProject.slug}`}
                  className="px-7 py-3.5 rounded-full bg-white dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/10 font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>System Architecture</span>
                  <FiArrowUpRight className="w-4 h-4 text-amber-600 dark:text-[#e5a93b]" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Bento Project Matrix */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 text-xs text-[#6e6e73] dark:text-[#86868b] font-mono px-2">
          <span>Showing {filteredProjects.length} builds</span>
          <span>Filter: {selectedCat}</span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10">
            <FiTerminal className="w-8 h-8 mx-auto text-[#86868b] mb-3" />
            <h3 className="text-lg font-bold text-[#1d1d1f] dark:text-white mb-1">
              No projects found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs text-[#6e6e73] dark:text-[#86868b] mb-4">
              Try searching for &ldquo;Docker&rdquo;, &ldquo;Ansible&rdquo;, &ldquo;Azure&rdquo;, or &ldquo;Python&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCat("All");
              }}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-black text-white dark:bg-white dark:text-black"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => {
              const hasDemo = !!proj.demo;
              const sourceLink = proj.links.find(
                (l) => l.label.includes("Source") || l.label.includes("repo")
              );

              return (
                <GlowCard key={proj.slug}>
                  <article className="p-6 sm:p-7 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 flex flex-col justify-between h-full hover:border-black/25 dark:hover:border-white/25 transition-all group">
                    <div>
                      {/* Header: Category & Status */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-mono text-amber-600 dark:text-[#e5a93b] uppercase tracking-wider">
                          {proj.category}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#6e6e73] dark:text-[#a1a1a6]">
                          {proj.status === "Live" || proj.status === "Active" ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#34c759]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-[#e5a93b]" />
                          )}
                          <span>{proj.status}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-2.5 group-hover:text-[#0066cc] dark:group-hover:text-[#f5f5f7] transition-colors leading-snug">
                        {proj.title}
                      </h2>

                      {/* Teaser */}
                      <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#86868b] leading-relaxed mb-6">
                        {proj.teaser}
                      </p>

                      {/* Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {proj.stack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white dark:bg-white/[0.03] border border-black/10 dark:border-white/10 text-[#424245] dark:text-[#a1a1a6]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                      <Link
                        href={`/projects/${proj.slug}`}
                        className="inline-flex items-center gap-1 text-[#1d1d1f] dark:text-white hover:text-amber-600 dark:hover:text-[#e5a93b] transition-colors"
                      >
                        <span>Read Overview</span>
                        <FiArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
                      </Link>

                      <div className="flex items-center gap-3">
                        {hasDemo && (
                          <a
                            href={proj.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0066cc] dark:text-[#2997ff] hover:underline"
                            title="Open live hosted demo"
                          >
                            <span>Live App</span>
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {sourceLink && (
                          <a
                            href={sourceLink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#6e6e73] hover:text-[#1d1d1f] dark:text-[#86868b] dark:hover:text-white transition-colors"
                            title="View source code on GitHub"
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </GlowCard>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Footer Note */}
      <footer className="mt-20 px-6 max-w-4xl mx-auto text-center text-xs text-[#6e6e73] dark:text-[#86868b] space-y-2 border-t border-black/10 dark:border-white/10 pt-10">
        <p>Built with care by Srinivasan Vijayaraghavan.</p>
        <p>
          Explore all repositories on{" "}
          <a
            href="https://github.com/Srinivasan-78"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d1d1f] dark:text-white hover:underline"
          >
            GitHub ↗
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
