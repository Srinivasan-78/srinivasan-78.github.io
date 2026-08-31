/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌​​‌‌​​​‌‌​‌​‌​​​‌​‌​​​‌‌​​​‌‌​​​‌​‌‌​​‌​​​‌​​‌‌‌‌​‌‌‌​‌‌​​‌‌​​‌​​​​‌‌​‌‌‌​‌‌​​​​‌​‌​​‌‌‌​​‌‌​‌‌​‌​‌​​​​‌​​‌​​​‌‌‌​‌‌‌‌​​​​‌​​‌‌‌‌​‌​​‌​​​​‌‌​​​​‌​‌‌​‌‌​‌​‌​​‌‌​‌​​‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.BcQF1dOvd7aNmBGxOHamM4
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CHAT_SUGGESTIONS } from "@/lib/chat";
import { matchKnowledgeQuery, type KnowledgeMatchResult } from "@/lib/knowledge";
import Strands from "./ui/Strands";
import { FiArrowUpRight, FiCornerDownLeft, FiX } from "react-icons/fi";

interface Turn {
  role: "user" | "assistant";
  content: string;
  followUps?: string[];
  actionLink?: {
    label: string;
    url: string;
  };
}

const GREETING =
  "Happy to answer anything about Srinivasan's work: his 5+ years of DevOps experience, US & India work authorization, 20 open-source builds, enterprise migrations, or contact details.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(true);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    if (open) {
      setShowNudge(false);
      inputRef.current?.focus();
      return;
    }
    clearTimer();
  }, [open, clearTimer]);

  /* Auto-scroll pinned to the newest message */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, busy]);

  /* Keyboard shortcut: Escape to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      clearTimer();
      setDraft("");
      setBusy(true);

      // Match against client-side deterministic knowledge engine
      const match: KnowledgeMatchResult = matchKnowledgeQuery(question);

      // Push user turn and blank assistant turn
      setTurns((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: "" },
      ]);

      const fullText = match.answer;
      let currentIndex = 0;
      const chunkSize = Math.max(1, Math.floor(fullText.length / 28));

      const typeNextChunk = () => {
        currentIndex += chunkSize;
        if (currentIndex >= fullText.length) {
          // Streaming completed
          setTurns((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                role: "assistant",
                content: fullText,
                followUps: match.followUps,
                actionLink: match.actionLink,
              };
            }
            return next;
          });
          setBusy(false);
          timerRef.current = null;
        } else {
          setTurns((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: fullText.slice(0, currentIndex),
              };
            }
            return next;
          });
          timerRef.current = setTimeout(typeNextChunk, 16);
        }
      };

      // Slight initial typing delay for natural conversational feel
      timerRef.current = setTimeout(typeNextChunk, 35);
    },
    [busy, clearTimer],
  );

  const lastAssistantTurn = turns
    .filter((t) => t.role === "assistant" && !busy)
    .pop();

  return (
    <>
      {/* 1. Subtle Callout Nudge (Dismissable first-time hint) */}
      {showNudge && !open && turns.length === 0 && (
        <div
          className="fixed right-5 sm:right-6 bottom-20 z-[89] max-w-[280px] sm:max-w-[320px] p-3.5 rounded-2xl bg-white/95 dark:bg-[#121216]/95 border border-black/10 dark:border-white/15 shadow-2xl backdrop-blur-2xl text-left transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 group"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-semibold text-amber-600 dark:text-[#e5a93b] flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Ask AI Assistant</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowNudge(false);
              }}
              className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white p-1 rounded-md transition-colors"
              aria-label="Dismiss suggestion"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
          <p
            onClick={() => setOpen(true)}
            className="text-xs text-[#424245] dark:text-[#a1a1a6] leading-relaxed cursor-pointer hover:text-black dark:hover:text-white transition-colors"
          >
            Have a question? Ask about US work eligibility, 20 platform projects, or enterprise experience.
          </p>
        </div>
      )}

      {/* 2. Modern Intuitive Floating AI Launcher Pill */}
      <div className="fixed right-5 sm:right-6 bottom-5 sm:bottom-6 z-[90]">
        <button
          ref={launcherRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-chat-panel"
          onClick={() => setOpen((v) => !v)}
          className={`relative group inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] shadow-2xl backdrop-blur-2xl border ${
            open
              ? "bg-[#1d1d1f] text-white dark:bg-white dark:text-black border-black/20 dark:border-white/20"
              : "bg-black/90 text-white dark:bg-[#121216]/95 dark:text-white border-white/20 dark:border-white/15 hover:border-amber-500/50 dark:hover:border-amber-400/50"
          }`}
        >
          {/* Outer Shimmer Glow Aura (Visible when closed on hover) */}
          {!open && (
            <span
              aria-hidden="true"
              className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-600 via-amber-500 to-indigo-600 opacity-30 group-hover:opacity-75 blur-sm transition-opacity duration-300 -z-10"
            />
          )}

          {/* WebGL Strands Lighting Effect */}
          <span aria-hidden="true" className="chat-launcher-strands opacity-60 group-hover:opacity-100">
            <Strands
              colors={["#0066cc", "#4c8dff", "#06B6D4"]}
              count={3}
              speed={0.3}
              amplitude={0.7}
              waviness={0.9}
              thickness={0.5}
              glow={1.8}
              taper={1.4}
              spread={1.2}
              intensity={0.45}
              saturation={1.1}
              opacity={0.7}
              scale={4.5}
              playOnHover
            />
          </span>

          {/* AI Sparkle / Close Icon */}
          <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
            {open ? (
              <FiX className="w-4 h-4" />
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-amber-400 animate-pulse"
                >
                  <path
                    d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                    fill="currentColor"
                  />
                </svg>
                {/* Live green beacon dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </>
            )}
          </span>

          {/* Button Text */}
          <span className="tracking-tight whitespace-nowrap">
            {open ? "Close Chat" : "Ask AI Assistant"}
          </span>

          {/* Subtle "Instant" / Sparkle Tag (Hidden on tiny phones) */}
          {!open && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white/10 dark:bg-white/10 text-amber-300 dark:text-[#e5a93b] border border-white/10">
              Verified
            </span>
          )}
        </button>
      </div>

      {/* 3. Floating Interactive Chat Panel */}
      <div
        id="site-chat-panel"
        className={"chat-panel" + (open ? " is-open" : "")}
        role="dialog"
        aria-label="Ask about Srinivasan"
        aria-modal="false"
        hidden={!open}
      >
        <header className="chat-head">
          <div className="chat-head-row">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="eyebrow text-xs font-mono text-amber-600 dark:text-[#e5a93b] font-bold">
                Portfolio Assistant
              </span>
            </div>
            {turns.length > 0 ? (
              <button
                type="button"
                className="chat-reset text-xs font-mono text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 transition-colors"
                onClick={() => {
                  clearTimer();
                  setTurns([]);
                  setBusy(false);
                  inputRef.current?.focus();
                }}
              >
                Reset
              </button>
            ) : null}
          </div>
          <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed mt-1">
            Instant verified answers about experience, US work status, 20 builds & skills.
          </p>
        </header>

        <div className="chat-log" ref={logRef}>
          <p className="chat-greeting text-xs leading-relaxed">{GREETING}</p>

          {turns.map((turn, i) => (
            <div
              key={i}
              className={"chat-msg chat-msg-" + turn.role}
            >
              <span className="eyebrow text-[11px] font-mono mb-1 block">
                {turn.role === "user" ? "You" : "Assistant"}
              </span>
              <p className="whitespace-pre-line text-sm leading-relaxed" aria-live={turn.role === "assistant" ? "polite" : undefined}>
                {turn.content || (busy ? "…" : "")}
              </p>

              {/* Action Link button inside assistant message if present */}
              {turn.role === "assistant" && turn.actionLink && turn.content && (
                <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10">
                  {turn.actionLink.url.startsWith("/") ? (
                    <Link
                      href={turn.actionLink.url}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all hover:scale-105 shadow-sm"
                      onClick={() => setOpen(false)}
                    >
                      <span>{turn.actionLink.label}</span>
                      <FiArrowUpRight className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                    </Link>
                  ) : (
                    <a
                      href={turn.actionLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all hover:scale-105 shadow-sm"
                    >
                      <span>{turn.actionLink.label}</span>
                      <FiArrowUpRight className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Initial starter suggestions */}
          {turns.length === 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#86868b] uppercase tracking-wider block">
                Popular questions:
              </span>
              <div className="chat-suggestions">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="chat-chip text-xs hover:border-amber-500/40"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up suggestion pills from the most recent assistant turn */}
          {turns.length > 0 && !busy && lastAssistantTurn?.followUps && (
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#6e6e73] dark:text-[#86868b] uppercase tracking-wider block mb-2">
                Suggested follow-ups:
              </span>
              <div className="chat-suggestions">
                {lastAssistantTurn.followUps.map((f) => (
                  <button
                    key={f}
                    type="button"
                    className="chat-chip text-xs hover:border-amber-500/40"
                    onClick={() => send(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
        >
          <label className="sr-only" htmlFor="chat-input">
            Your question
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            className="chat-input"
            rows={2}
            maxLength={1000}
            placeholder="Ask about experience, US work status, projects…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          <button
            type="submit"
            className="btn primary chat-send inline-flex items-center justify-center gap-1 font-semibold text-xs"
            disabled={busy || !draft.trim()}
          >
            {busy ? "…" : <><FiCornerDownLeft className="w-3.5 h-3.5" /><span>Send</span></>}
          </button>
        </form>
      </div>
    </>
  );
}
