"use client";

import { useState } from "react";

export type Cert = {
  name: string; date: string; year: string;
  cat: string[]; skills: string[]; url: string;
};

const FILTERS = [
  { id: "all", label: "All 22" },
  { id: "cloud", label: "Cloud" },
  { id: "automation", label: "Automation & IaC" },
  { id: "systems", label: "Systems & Networking" },
];

export default function CertList({ certs }: { certs: Cert[] }) {
  const [filter, setFilter] = useState("all");

  const shown = filter === "all" ? certs : certs.filter((c) => c.cat.includes(filter));

  let lastYear: string | null = null;

  return (
    <>
      <div className="cert-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={"filter-btn" + (filter === f.id ? " active" : "")}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="cert-count">
        {shown.length} {shown.length === 1 ? "certification" : "certifications"}
        {filter === "all" ? " · issued by LinkedIn Learning" : ""}
      </div>

      <div>
        {shown.map((c) => {
          const newYear = c.year !== lastYear;
          lastYear = c.year;
          return (
            <div key={c.name}>
              {newYear && <div className="cert-year">{c.year}</div>}
              <div className="cert-item">
                <div>
                  <span className="cert-name">{c.name}</span>
                  <div style={{ marginTop: "0.3rem" }}>
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="tag"
                        style={{
                          color: "var(--plum)",
                          borderColor: "var(--plum-line)",
                          background: "var(--plum-wash)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="cert-right">
                  <span className="cert-date">{c.date}</span>
                  <a className="cert-link" href={c.url} target="_blank" rel="noopener">
                    Show credential ↗
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}