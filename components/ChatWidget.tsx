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
import { FiArrowUpRight, FiCornerDownLeft } from "react-icons/fi";

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
  "Happy to answer anything about Srinivasan's work: his 5+ years of DevOps experience, US & India work authorization, 21 open-source builds, enterprise migrations, or contact details.";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
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
      const chunkSize = Math.max(1, Math.floor(fullText.length / 30));

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
      timerRef.current = setTimeout(typeNextChunk, 40);
    },
    [busy, clearTimer],
  );

  const lastAssistantTurn = turns
    .filter((t) => t.role === "assistant" && !busy)
    .pop();

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="chat-launcher"
        aria-expanded={open}
        aria-controls="site-chat-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true" className="chat-launcher-strands">
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
        <span aria-hidden="true" className="chat-launcher-icon">
          {open ? "✕" : "◍"}
        </span>
        <span className="chat-launcher-label">{open ? "Close" : "Ask about me"}</span>
      </button>

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
            <span className="eyebrow flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-[#e5a93b]">
              <i className="pulse" /> Portfolio Assistant
            </span>
            {turns.length > 0 ? (
              <button
                type="button"
                className="chat-reset text-xs font-mono text-[#6e6e73] hover:text-[#1d1d1f] dark:hover:text-white"
                onClick={() => {
                  clearTimer();
                  setTurns([]);
                  setBusy(false);
                  inputRef.current?.focus();
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
          <p className="text-xs text-[#6e6e73] dark:text-[#86868b] leading-relaxed">
            Instant answers about experience, work authorization, 21 builds & skills.
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
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/10 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <span>{turn.actionLink.label}</span>
                      <FiArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
                    </Link>
                  ) : (
                    <a
                      href={turn.actionLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/10 transition-colors"
                    >
                      <span>{turn.actionLink.label}</span>
                      <FiArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-[#e5a93b]" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Initial starter suggestions */}
          {turns.length === 0 && (
            <div className="chat-suggestions">
              {CHAT_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chat-chip text-xs"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
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
                    className="chat-chip text-xs"
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
