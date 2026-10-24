/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌​‌‌​‌​‌‌​‌‌‌​​‌​​‌​‌​​​‌‌​​​‌​‌‌​​​‌‌​‌​​‌​​​​‌​​‌‌‌​​‌​‌‌​​‌​‌​‌​​‌​​‌‌​​​‌‌​‌‌​‌‌‌‌​‌‌‌‌​​‌​‌​‌‌​​‌​‌​​‌‌​​​‌​‌​​​‌​‌​​‌​​​​‌​​‌‌‌‌​‌‌‌​​‌​​‌‌​​​‌‌​‌​‌​‌‌​​‌​​‌​‌‌​‌​​‌‌​‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.mnJ1cHNYRcoyYLQHOrcVKM
 */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONTACT_FORM_COPY,
  CONTACT_FORM_FIELDS,
  type ContactFormField,
} from "@/lib/data/profile";
import { haptic } from "@/lib/haptics";

/* The contact form.

   Two things about this component are load-bearing and were preserved
   exactly from the previous build rather than redesigned.

   One: `action` and `method` are real. The site is a static export with
   no server runtime, so the form posts straight to Formspree. With
   JavaScript enabled the submit handler intercepts it and posts the same
   FormData over fetch so the visitor lands on this site's own thank-you
   page; with JavaScript off the browser performs the ordinary POST and
   Formspree answers with its confirmation. Removing either attribute
   would silently turn this into a form that only works for people
   running scripts.

   Two: the `_gotcha` field is Formspree's honeypot. It is named exactly
   that, it is kept out of the tab order and out of autofill, and it has
   to stay in the markup — a renamed or dropped honeypot does not fail
   loudly, it just starts letting spam through.

   `noValidate` is also inherited behaviour: the field messages below are
   the author's own words, and letting the browser's validation bubbles
   fire first would replace them with the UA's. The `required` and
   `minLength` attributes are still declared, because they are what tells
   a screen reader the field is mandatory — with `noValidate` present
   they annotate without intercepting. */

type Field = ContactFormField["id"];
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "error";

/* Deliberately not a strict RFC 5322 implementation. The only question
   worth asking in the browser is whether the visitor can plausibly be
   replied to; the authority on that is the mail server, and a regex
   strict enough to be correct is strict enough to reject real
   addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};

  for (const field of CONTACT_FORM_FIELDS) {
    const value = values[field.id].trim();

    if (field.required && !value) {
      errors[field.id] = field.errors.missing;
      continue;
    }
    if (field.type === "email" && value && !EMAIL.test(value)) {
      errors[field.id] = field.errors.invalid;
      continue;
    }
    if (field.minLength && value.length < field.minLength) {
      errors[field.id] = field.errors.invalid;
    }
  }

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

  /* Nothing is marked invalid until the visitor has tried to send once.
     Turning a field red while someone is still typing their name into it
     is the form telling them off for not having finished. */
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
      /* Focus the first field that failed. A list of messages the
         visitor has to go hunting for is not an error state. */
      const first = (Object.keys(found) as Field[])[0];
      form.querySelector<HTMLElement>(`#${first}`)?.focus();
      haptic("reject");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(CONTACT_FORM_COPY.endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        haptic("commit");
        form.reset();
        router.push(CONTACT_FORM_COPY.successPath);
        return;
      }

      /* Formspree answers a rejected submission with its own reasons.
         Those are more use to the visitor than a generic failure, so
         they are shown when present and the author's own line is the
         fallback. */
      const body = await res.json().catch(() => null);
      const detail: string | undefined = body?.errors
        ?.map((x: { message: string }) => x.message)
        .join(" ");
      setStatus("error");
      haptic("reject");
      setFormError(detail || CONTACT_FORM_COPY.submitFailed);
    } catch {
      setStatus("error");
      haptic("reject");
      setFormError(CONTACT_FORM_COPY.networkFailed);
    }
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      action={CONTACT_FORM_COPY.endpoint}
      method="POST"
      onSubmit={onSubmit}
      noValidate
    >
      <fieldset disabled={sending} className="space-y-6 border-0 p-0">
        {CONTACT_FORM_FIELDS.map((field) => {
          const error = errors[field.id];
          const errorId = `${field.id}-error`;
          const counterId = `${field.id}-counter`;
          const isMessage = field.type === "textarea";

          return (
            <div key={field.id}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <label htmlFor={field.id} className="t-anno text-mute">
                  {field.label}
                </label>

                {/* The character counter is advice, not a limit, so it
                    describes the field rather than labelling it. */}
                {isMessage && (
                  <span id={counterId} className="t-anno-sm text-mute">
                    {messageLength > 0
                      ? `${messageLength} ${CONTACT_FORM_COPY.counterSuffix}`
                      : CONTACT_FORM_COPY.counterEmpty}
                  </span>
                )}
              </div>

              {isMessage ? (
                <textarea
                  id={field.id}
                  name={field.id}
                  rows={field.rows}
                  required={field.required}
                  minLength={field.minLength}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={
                    [error ? errorId : null, counterId].filter(Boolean).join(" ") ||
                    undefined
                  }
                  onInput={(e) => {
                    setMessageLength(e.currentTarget.value.length);
                    revalidate();
                  }}
                  className="field resize-y"
                />
              ) : (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  required={field.required}
                  minLength={field.minLength}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? errorId : undefined}
                  onInput={revalidate}
                  className="field"
                />
              )}

              {/* The invalid state is carried by the sentence, not by
                  the border colour. The border is the glance; this is
                  the fact, and it says what to do about it. */}
              {error && (
                <p id={errorId} role="alert" className="contingency">
                  {/* The field's own label is the prefix, so the line
                      names what failed without a word being invented
                      for it. */}
                  <span>{field.label}</span>
                  <span>{error}</span>
                </p>
              )}
            </div>
          );
        })}

        {/* Formspree's honeypot — see the note at the top of the file.
            Hidden from sight, from the tab order and from autofill, but
            present in the markup. */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {/* The one filled control on the page. */}
        <button type="submit" className="btn btn-signal w-full justify-center">
          {sending ? CONTACT_FORM_COPY.submitting : CONTACT_FORM_COPY.submit}
        </button>
      </fieldset>

      {formError && (
        <p role="alert" className="contingency mt-6">
          <span>Contingency</span>
          <span>{formError}</span>
        </p>
      )}
    </form>
  );
}
