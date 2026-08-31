/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​​‌‌​​‌‌​‌‌​‌​‌​​‌‌‌​‌‌‌​​‌‌‌​​​​‌‌​‌‌‌​​​‌‌​‌‌​​‌​‌​‌​​​‌​‌​​​‌​​‌‌​‌​‌​‌‌​‌​‌‌​​‌‌​​‌​​‌​​​​​‌​​‌‌​​​​​‌‌‌‌​‌​​‌‌​‌​‌‌​‌​​​‌​​​‌​​‌‌​‌​‌​​​​‌​​‌‌​‌​​‌​‌‌‌​​​​​‌​​​‌​‌​‌​‌​​‌​⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.3jw8n6TQ5k2A0zkDMBipER
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { haptic } from "@/lib/haptics";
import { FiSend, FiAlertCircle } from "react-icons/fi";

const ENDPOINT = "https://formspree.io/f/xrpzzlaz";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "error";

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Please enter your name.";
  else if (values.name.trim().length < 2) errors.name = "Please provide a valid name.";

  const email = values.email.trim();
  if (!email) errors.email = "Please enter your email so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Please enter a valid email address.";

  const message = values.message.trim();
  if (!message) errors.message = "Please write a brief message.";
  else if (message.length < 10) errors.message = "Please provide a little more detail (10+ characters).";

  return errors;
}

export default function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);

  const readValues = (form: HTMLFormElement): Record<Field, string> => {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
  };

  const revalidate = () => {
    if (!submitted || !formRef.current) return;
    setErrors(validate(readValues(formRef.current)));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitted(true);
    setFormError(null);

    const found = validate(readValues(form));
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (Object.keys(found) as Field[])[0];
      form.querySelector<HTMLElement>(`#${first}`)?.focus();
      haptic("reject");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        haptic("commit");
        form.reset();
        router.push("/thank-you");
        return;
      }

      const body = await res.json().catch(() => null);
      const detail: string | undefined = body?.errors?.map((x: { message: string }) => x.message).join(" ");
      setStatus("error");
      haptic("reject");
      setFormError(
        detail ||
          "Submission failed. Please try again or email me directly at srinivasan.shyam2000@gmail.com."
      );
    } catch {
      setStatus("error");
      haptic("reject");
      setFormError(
        "Network connection error. Please try again or email me directly at srinivasan.shyam2000@gmail.com."
      );
    }
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      action={ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      noValidate
      className="space-y-6"
    >
      <fieldset disabled={sending} className="space-y-5">
        
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#86868b] mb-2">
            Your Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onInput={revalidate}
            autoComplete="name"
            placeholder="Jane Doe"
            className={`w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#09090c] border text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6e6e73] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all ${
              errors.name ? "border-red-500 ring-1 ring-red-500" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-[#ff453a] flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#86868b] mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onInput={revalidate}
            autoComplete="email"
            placeholder="jane@company.com"
            className={`w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#09090c] border text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6e6e73] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all ${
              errors.email ? "border-red-500 ring-1 ring-red-500" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-[#ff453a] flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="message" className="block text-xs font-mono uppercase tracking-wider text-[#6e6e73] dark:text-[#86868b]">
              Message
            </label>
            <span className="text-[11px] font-mono text-[#6e6e73] dark:text-[#86868b]">
              {messageLength > 0 ? `${messageLength} chars (10 min)` : "10 min chars"}
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={5}
            onInput={(e) => {
              setMessageLength(e.currentTarget.value.length);
              revalidate();
            }}
            placeholder="Tell me about the role, project, or infrastructure challenge..."
            className={`w-full px-4 py-3.5 rounded-2xl bg-white dark:bg-[#09090c] border text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#6e6e73] text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all resize-y ${
              errors.message ? "border-red-500 ring-1 ring-red-500" : "border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-[#ff453a] flex items-center gap-1">
              <FiAlertCircle className="w-3 h-3" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot */}
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sending}
          className="w-full py-4 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-xl"
        >
          <FiSend className="w-4 h-4" />
          <span>{sending ? "Sending message..." : "Send Message"}</span>
        </button>
      </fieldset>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-[#ff453a] flex items-center gap-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}
    </form>
  );
}
