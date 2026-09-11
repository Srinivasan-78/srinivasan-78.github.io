/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​‌‌‌​‌‌​​‌​‌​‌‌‌‌​‌​​​‌‌​​‌‌​‌​‌​‌​‌​‌​​‌‌‌​​‌‌​‌‌​‌​‌‌​‌‌​‌​‌‌​‌​​​​‌‌​‌‌‌‌​‌​​‌‌‌​​‌​​​‌​​​‌​‌‌‌‌‌​‌​​‌‌​​​​‌‌​​‌‌​‌‌​​‌‌​​‌‌​​​​‌​‌‌​‌​​​​‌​‌​‌​‌​‌​​​‌​‌​‌‌​‌​‌‌​‌‌​‌​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.Gez3UNmmhoND_L3fahUEkk
 */
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-12 px-6 bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Copyright & Location */}
        <div className="text-xs text-[#5a5a5f] dark:text-[#9b9ba1] font-mono text-center md:text-left">
          <span>© {currentYear} Srinivasan Vijayaraghavan · Bangalore, IN</span>
        </div>

        {/* Links Navigation */}
        <div className="flex items-center gap-6 flex-wrap justify-center text-xs font-mono text-[#5a5a5f] dark:text-[#9b9ba1]">
          <Link className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors" href="/projects">
            Projects
          </Link>
          <Link className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors" href="/certifications">
            Certifications
          </Link>
          <Link className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors" href="/contact">
            Contact
          </Link>
          <Link className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors" href="/terms">
            Terms
          </Link>
          <a
            className="hover:text-[#0066cc] dark:hover:text-[#2997ff] transition-colors"
            href="https://www.linkedin.com/in/srini-solution-architect/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            href="https://github.com/Srinivasan-78"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
