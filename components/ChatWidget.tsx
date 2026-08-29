/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌​​​​‌​​‌‌​​​‌‌​‌​‌​​​‌​‌​​​‌‌​​​‌‌​​​‌​‌‌​​‌​​​‌​​‌‌‌‌​‌‌‌​‌‌​​‌‌​​‌​​​​‌‌​‌‌‌​‌‌​​​​‌​‌​​‌‌‌​​‌‌​‌‌​‌​‌​​​​‌​​‌​​​‌‌‌​‌‌‌‌​​​​‌​​‌‌‌‌​‌​​‌​​​​‌‌​​​​‌​‌‌​‌‌​‌​‌​​‌‌​‌​​‌‌​‌​​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.BcQF1dOvd7aNmBGxOHamM4
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT_ENDPOINT, CHAT_SUGGESTIONS } from "@/lib/chat";
import { CHAT_LIMITS, OFF_TOPIC_REFUSAL } from "@/lib/assistant";
import Strands from "./ui/Strands";

type Turn = { role: "user" | "assistant"; content: string };

const GREETING =
  "Happy to answer anything about Srinivasan's work: his experience, projects, certifications, or the best way to reach him.";

/* One assistant reply is streamed at a time, so a single ref is enough to
   cancel an in-flight request when the panel closes or the widget unmounts. */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    /* Closing the panel drops the answer nobody is going to read, rather than
       leaving the worker streaming tokens into a hidden div. */
    abortRef.current?.abort();
  }, [open]);

  /* Pinned to the newest line as tokens arrive. `turns` changes on every
     delta, which is exactly the cadence the scroll needs. */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, busy]);

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
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      /* The worker rejects a conversation that is past either of its caps, so
         the oldest turns are dropped here rather than letting a long
         conversation dead-end on a 400 the visitor can only escape by
         resetting.

         Both caps, not just the turn count: sixteen turns at the 1500-char
         message limit is 24000 characters, which clears the turn check and
         fails the character one. Newest first, keeping whatever fits, then
         reversed back into order — and the result has to start on a user
         turn, which the API requires. */
      const all = [...turns, { role: "user" as const, content: question }];
      const kept: Turn[] = [];
      let budget = CHAT_LIMITS.maxTotalChars;
      for (let i = all.length - 1; i >= 0 && kept.length < CHAT_LIMITS.maxTurns; i--) {
        const turn = all[i];
        if (turn.content.length > budget) break;
        budget -= turn.content.length;
        kept.push(turn);
      }
      kept.reverse();
      while (kept.length > 1 && kept[0].role !== "user") kept.shift();
      const history: Turn[] = kept;
      /* The visible log keeps everything; only what goes to the model is
         trimmed. */
      setTurns([...turns, { role: "user", content: question }, { role: "assistant", content: "" }]);
      setDraft("");
      setError(null);
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;

      /* Appends into the placeholder assistant turn the send just pushed —
         always the last entry, so no id bookkeeping is needed. */
      const append = (chunk: string) =>
        setTurns((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });

      try {
        const res = await fetch(CHAT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const detail = await res.json().catch(() => null);
          throw new Error(
            (detail as { error?: string } | null)?.error ?? "The assistant is taking a short break. Please try again in a moment.",
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        /* Handles one complete SSE frame. Throws to end the reply with a
           message the visitor sees. */
        const handleFrame = (frame: string) => {
          const line = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!line) return;
          /* A frame that is not JSON is skipped, not thrown on — one
             malformed line should not discard a reply that is otherwise
             arriving correctly. */
          let event:
            | { type: "delta"; text: string }
            | { type: "notice"; message: string }
            | { type: "done" }
            | { type: "error"; message: string };
          try {
            event = JSON.parse(line.slice(5).trim());
          } catch {
            return;
          }
          if (event.type === "delta") append(event.text);
          /* A notice keeps the partial answer and explains why it stops —
             a truncated reply that says nothing reads as a broken widget. */
          else if (event.type === "notice") setError(event.message);
          else if (event.type === "error") throw new Error(event.message);
        };

        /* SSE frames are separated by a blank line and can be split across
           network chunks, so the tail of the buffer is kept until it is. */
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const frames = buffer.split("\n\n");
          buffer = frames.pop() ?? "";
          for (const frame of frames) handleFrame(frame);
        }
        /* A stream cut short leaves a final frame with no trailing blank line
           after it. Dropping that lost the end of the answer with no sign
           anything had gone wrong. */
        buffer += decoder.decode();
        if (buffer.trim()) handleFrame(buffer);
      } catch (err) {
        const aborted = (err as Error).name === "AbortError";
        if (!aborted) setError(err instanceof Error ? err.message : "That one didn't come through. Please try again.");
        /* Drops the empty placeholder so the log does not keep a blank
           assistant bubble under the error — or, when the panel was closed
           before a single token arrived, no bubble at all. */
        setTurns((prev) => {
          const last = prev[prev.length - 1];
          return last?.role === "assistant" && last.content === "" ? prev.slice(0, -1) : prev;
        });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, turns],
  );

  if (!CHAT_ENDPOINT) return null;

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
          {/* The palette is the site accent and its two neighbours, not
              the component's default orange/violet/cyan — three unrelated
              hues on a page that spends one would be the confetti the
              palette comment warns about. Slow, low-amplitude and barely
              saturated: it is a light behind a control, not a demo. */}
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
            /* At rest it is a still frame. Continuous motion in the
               corner of every page has no purpose beyond decoration and
               competes with whatever the visitor is reading; answering
               the pointer gives it one, and stops a WebGL loop that
               otherwise runs for as long as the tab is open. */
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
            <span className="eyebrow">
              <i className="pulse" /> Site assistant
            </span>
            {turns.length > 0 ? (
              <button
                type="button"
                className="chat-reset"
                onClick={() => {
                  abortRef.current?.abort();
                  setTurns([]);
                  setError(null);
                  inputRef.current?.focus();
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
          <p>Answers come from this site and his résumé. Do double-check anything important.</p>
        </header>

        <div className="chat-log" ref={logRef}>
          <p className="chat-greeting">{GREETING}</p>

          {turns.map((turn, i) => {
            /* The model is instructed to refuse off-topic questions with this
               exact sentence, so an exact match is a reliable signal to label
               the reply as blocked rather than styling it as a real answer. */
            const blocked = turn.role === "assistant" && turn.content.trim() === OFF_TOPIC_REFUSAL;
            return (
              <div
                key={i}
                className={"chat-msg chat-msg-" + turn.role + (blocked ? " chat-msg-blocked" : "")}
              >
                <span className="eyebrow">
                  {turn.role === "user" ? "You" : blocked ? "Out of scope" : "Assistant"}
                </span>
                <p aria-live={turn.role === "assistant" ? "polite" : undefined}>
                  {turn.content || (busy ? "…" : "")}
                </p>
              </div>
            );
          })}

          {error ? (
            <p className="chat-error" role="alert">
              {error}
            </p>
          ) : null}

          {turns.length === 0 ? (
            <div className="chat-suggestions">
              {CHAT_SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="chat-chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          ) : null}
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
            maxLength={CHAT_LIMITS.maxMessageChars}
            placeholder="Ask about his experience, projects, or availability…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              /* Enter sends, Shift+Enter breaks the line — the convention
                 every other chat box on the web uses. */
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          <button type="submit" className="btn primary chat-send" disabled={busy || !draft.trim()}>
            {busy ? "…" : "Send"}
          </button>
        </form>
      </div>
    </>
  );
}
