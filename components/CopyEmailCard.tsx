/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌​‌​‌‌​​‌​‌​‌‌‌​‌​​‌‌‌‌​‌‌​​‌​​​‌‌‌‌​‌​​‌‌​​‌​‌​‌​​​‌​‌​​‌‌​‌‌​​‌​‌‌​​‌​‌‌‌​‌‌​​‌​‌​‌​‌​‌​​​​‌​​‌​‌‌​‌​​​‌‌​​‌‌​‌‌‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​​‌​​​‌​‌​​​​​​‌‌​​​​​​‌‌​​​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 */
"use client";

import { useState } from "react";
import { FiMail, FiCheck, FiCopy } from "react-icons/fi";
import GlowCard from "./ui/GlowCard";

export default function CopyEmailCard() {
  const [copied, setCopied] = useState(false);
  const email = "srinivasan.shyam2000@gmail.com";

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlowCard>
      <div className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 flex items-center justify-between transition-all">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3.5 group flex-grow min-w-0"
          title="Open mail client"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-amber-600 dark:text-[#e5a93b] shadow-sm dark:shadow-none flex-shrink-0 group-hover:scale-105 transition-transform">
            <FiMail className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] uppercase">
              Email Directly
            </div>
            <div className="text-sm font-semibold text-[#1d1d1f] dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#e5a93b] transition-colors truncate">
              {email}
            </div>
          </div>
        </a>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white transition-all flex items-center gap-1.5"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34c759]" />
                <span className="text-emerald-600 dark:text-[#34c759] text-[11px] font-semibold">Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="w-3.5 h-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </GlowCard>
  );
}

