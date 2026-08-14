"use client";

import { useEffect, useRef, useState } from "react";

export type Post = {
  tag: string; accent: "sage" | "slate"; title: string;
  body: string; stack: string[];
  link?: { url: string; label: string };
  art: React.ReactNode;
};

export default function WorkGrid({ posts }: { posts: Post[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const active = open === null ? null : posts[open];

  useEffect(() => {
    if (open === null) return;
    lastFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="work-grid">
        {posts.map((p, i) => (
          <button
            key={p.title}
            type="button"
            className={"post " + p.accent}
            onClick={() => setOpen(i)}
            aria-haspopup="dialog"
          >
            <div className="post-cover">{p.art}</div>
            <div className="post-body">
              <span
                className="tag"
                style={{
                  color: `var(--${p.accent})`,
                  borderColor: `var(--${p.accent}-line)`,
                  margin: 0,
                }}
              >
                {p.tag}
              </span>
              <h3 className="post-title">{p.title}</h3>
              <span className="post-open">{p.link ? "public work ↗" : "open ↗"}</span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(null);
          }}
        >
          <div className={"lb-card " + active.accent}>
            <button
              ref={closeRef}
              type="button"
              className="lb-close"
              onClick={() => setOpen(null)}
            >
              close
            </button>
            <div
              className="post-cover"
              style={{ padding: 0, color: `var(--${active.accent})` }}
            >
              {active.art}
            </div>
            <span
              className="tag"
              style={{
                color: `var(--${active.accent})`,
                borderColor: `var(--${active.accent}-line)`,
                margin: "1rem 0 0",
              }}
            >
              {active.tag}
            </span>
            <h2 className="lb-title">{active.title}</h2>
            <p className="lb-body">{active.body}</p>
            <div style={{ marginTop: "0.75rem" }}>
              {active.stack.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
            {active.link && (
              
                href={active.link.url}
                target="_blank"
                rel="noopener"
                className="eyebrow"
                style={{ color: `var(--${active.accent})`, display: "block", marginTop: "1rem" }}
              >
                {active.link.label}
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}