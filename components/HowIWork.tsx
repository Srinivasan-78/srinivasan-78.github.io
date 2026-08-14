"use client";

import Reveal from "./Reveal";

/* Numbered because the order is real: this is the sequence a release
   actually moves through, not decoration. */
const NOTES = [
  {
    n: "01",
    accent: "sage",
    head: "Gate it before it ships",
    body: "Backup integrity verified in T-SQL, four-condition health checks on restart, validation that fails fast rather than half-deploying.",
  },
  {
    n: "02",
    accent: "slate",
    head: "Make the rollback boring",
    body: "Every upgrade path has a rescue block and a tested restore. Recovery shouldn't be the part nobody has rehearsed.",
  },
  {
    n: "03",
    accent: "plum",
    head: "One inventory, every environment",
    body: "Environment-agnostic Ansible instead of a three-place edit. Drift is a design flaw, not a fact of life.",
  },
  {
    n: "04",
    accent: "brass",
    head: "Instrument the deploy itself",
    body: "Deployment telemetry, run summaries, and Teams alerting — so a failed release announces itself instead of waiting to be found.",
  },
];

export default function HowIWork() {
  return (
    <section className="section">
      <div className="wrap">
        <span className="eyebrow c-sage">How I work</span>
        <h2 className="display display-lg" style={{ margin: "0.4rem 0 0" }}>
          Built to survive the
          <br />
          release that goes wrong.
        </h2>

        <Reveal className="notes" stagger={0.09}>
          {NOTES.map((note) => (
            <div className="note" key={note.n}>
              <span className={"note-num c-" + note.accent}>({note.n})</span>
              <div>
                <h3 className="note-head">{note.head}</h3>
                <p className="note-body">{note.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
