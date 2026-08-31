/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌​​‌​‌‌​‌​​‌​‌‌‌​‌​‌​‌‌‌​​​​​‌​​​​​‌​‌‌‌​‌​​​‌​‌‌​​​​​‌‌​‌‌‌​​‌‌​​​‌​‌​​​​​‌​‌‌​‌‌​​​‌‌​​‌‌​​‌​​‌​‌​​‌‌‌​​‌​​​‌‌​‌‌​​‌‌​‌‌‌‌​‌‌‌​​​​​‌​​​​‌​​‌​​‌‌​‌​‌‌​‌‌​​​‌‌‌​​​‌​‌​‌‌‌‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.iiupAtX71AlfJr6opBMlq_
 */
import { pageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import CopyEmailCard from "@/components/CopyEmailCard";
import GlowCard from "@/components/ui/GlowCard";
import { FiMail, FiLinkedin, FiGithub, FiCheckCircle, FiClock, FiMapPin } from "react-icons/fi";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch about DevOps, cloud infrastructure and automation roles.",
  path: "/contact",
});

export default function Contact() {
  return (
    <main id="content" tabIndex={-1} className="min-h-screen bg-white dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] pb-24 transition-colors duration-300 selection:bg-[#e5a93b]/30 selection:text-black dark:selection:text-white">
      
      {/* 1. Human Hero Section */}
      <header className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[#6e6e73] dark:text-[#a1a1a6] mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#34c759]" />
          <span>Direct Contact · Bangalore, IN</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tightest leading-[1.18] pb-1 max-w-4xl mx-auto mb-6 text-[#1d1d1f] dark:text-white">
          Let&rsquo;s work together.
        </h1>

        <p className="text-base sm:text-xl font-normal text-[#6e6e73] dark:text-[#86868b] max-w-2xl mx-auto leading-relaxed">
          Whether you&rsquo;re hiring for a senior DevOps or Cloud Architecture role, or want to talk through an infrastructure challenge, feel free to reach out.
        </p>
      </header>

      {/* 2. Main Contact Grid */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white tracking-tight mb-2">
              Send a Message
            </h2>
            <p className="text-sm text-[#6e6e73] dark:text-[#86868b] mb-8 leading-relaxed">
              Fill in your details below. Messages go straight to my primary inbox.
            </p>

            <ContactForm />
          </div>

          {/* Right Column: Direct Channels & Status */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Quick Availability Card */}
            <div className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2.5 mb-2">
                <FiClock className="w-4 h-4 text-emerald-600 dark:text-[#34c759]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#a1a1a6]">
                  Response Time
                </span>
              </div>
              <div className="text-base font-bold text-[#1d1d1f] dark:text-white mb-1">
                Typically responds within 24 hours
              </div>
              <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                Available for interviews, technical consultations, and architecture discussions.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3">
              
              {/* Email with copy-to-clipboard feedback */}
              <CopyEmailCard />

              {/* LinkedIn */}
              <GlowCard>
                <a
                  href="https://www.linkedin.com/in/srini-solution-architect/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#0066cc] dark:text-[#2997ff] shadow-sm dark:shadow-none flex-shrink-0">
                      <FiLinkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] uppercase">LinkedIn</div>
                      <div className="text-sm font-semibold text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
                        srini-solution-architect
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#6e6e73] dark:text-[#86868b] font-mono flex-shrink-0 ml-2">Connect ↗</span>
                </a>
              </GlowCard>

              {/* GitHub */}
              <GlowCard>
                <a
                  href="https://github.com/Srinivasan-78"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 transition-all flex items-center justify-between group block"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#1d1d1f] dark:text-white shadow-sm dark:shadow-none flex-shrink-0">
                      <FiGithub className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-[#6e6e73] dark:text-[#86868b] uppercase">GitHub</div>
                      <div className="text-sm font-semibold text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#f5f5f7] transition-colors">
                        github.com/Srinivasan-78
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[#6e6e73] dark:text-[#86868b] font-mono flex-shrink-0 ml-2">Source ↗</span>
                </a>
              </GlowCard>

            </div>

            {/* Work Authorization Notice */}
            <div className="p-6 rounded-3xl bg-[#f5f5f7] dark:bg-[#09090c]/80 border border-black/10 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1d1d1f] dark:text-white mb-2">
                <FiCheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#34c759]" />
                <span>Work Authorization Status</span>
              </div>
              <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed mb-2">
                <strong>United States:</strong> US Citizen (Immediate hire, zero visa sponsorship required).
              </p>
              <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
                <strong>India:</strong> OCI Cardholder (Indefinite right to live and work in India).
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
