"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ENDPOINT = "https://formspree.io/f/xrpzzlaz";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "error";

/* Mirrors what Formspree itself will reject, so the common mistakes are
   caught before a round trip rather than after one. Deliberately loose on
   email — the only reliable test of an address is sending to it. */
function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = "Your name, please.";
  else if (values.name.trim().length < 2) errors.name = "A little more of your name, please.";

  const email = values.email.trim();
  if (!email) errors.email = "Your email, so I can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Please check that email address.";

  const message = values.message.trim();
  if (!message) errors.message = "A message, please.";
  else if (message.length < 10) errors.message = "A bit more detail would help. Ten characters or more.";

  return errors;
}

export default function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  // Errors appear only after the first submit attempt, so the form does not
  // scold someone who is still filling in the first field.
  const [submitted, setSubmitted] = useState(false);

  const readValues = (form: HTMLFormElement): Record<Field, string> => {
    const data = new FormData(form);
    return {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };
  };

  // Live-clears a field's error once it becomes valid, so the message goes
  // away as the problem is fixed rather than only on the next submit.
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
        form.reset();
        router.push("/thank-you");
        return;
      }

      // Formspree returns field-level problems in an `errors` array; anything
      // else is a service-side failure we can only describe generically.
      const body = await res.json().catch(() => null);
      const detail: string | undefined = body?.errors?.map((x: { message: string }) => x.message).join(" ");
      setStatus("error");
      setFormError(
        detail ||
          "That one needs another go. Try again, or email me directly at srinivasan.shyam2000@gmail.com."
      );
    } catch {
      setStatus("error");
      setFormError(
        "The form service is out of reach for a moment. Check your connection and try again, or email me directly at srinivasan.shyam2000@gmail.com."
      );
    }
  }

  const sending = status === "sending";

  return (
    <form
      ref={formRef}
      // action/method are kept so the form still submits the ordinary way if
      // JavaScript never loads; onSubmit intercepts whenever it does.
      action={ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      noValidate
      className="contact-form"
    >
      <fieldset disabled={sending} className="cf-fields">
        <Field
          id="name"
          label="Name"
          error={errors.name}
          onInput={revalidate}
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email"
          type="email"
          error={errors.email}
          onInput={revalidate}
          autoComplete="email"
        />
        <Field
          id="message"
          label="Message"
          error={errors.message}
          onInput={revalidate}
          textarea
        />

        {/* Honeypot — real people never see it, bots fill everything in. */}
        <input
          type="text"
          name="_gotcha"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="cf-honeypot"
        />

        <button type="submit" className="btn primary cf-submit">
          {sending ? (
            <>
              <span className="cf-spinner" aria-hidden="true" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </button>
      </fieldset>

      {/* One polite live region for both states: screen readers announce the
          in-flight status and the failure without a second announcement
          fighting it. */}
      <p className="cf-status" role="status" aria-live="polite">
        {sending ? "Sending your message…" : ""}
      </p>

      {formError && (
        <div className="cf-error-banner" role="alert">
          <span className="eyebrow">submit — try again</span>
          <p>{formError}</p>
        </div>
      )}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  textarea,
  type = "text",
  onInput,
  autoComplete,
}: {
  id: Field;
  label: string;
  error?: string;
  textarea?: boolean;
  type?: string;
  onInput: () => void;
  autoComplete?: string;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const shared = {
    id,
    name: id,
    onInput,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `cf-input${error ? " cf-input-error" : ""}`,
  } as const;

  return (
    <div className="cf-field">
      <label htmlFor={id} className="eyebrow cf-label">
        {label}
      </label>
      {textarea ? <textarea {...shared} rows={5} /> : <input {...shared} type={type} />}
      {error && (
        <p id={`${id}-error`} className="cf-error">
          {error}
        </p>
      )}
    </div>
  );
}
