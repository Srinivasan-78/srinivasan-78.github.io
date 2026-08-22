"use client";

import Reveal from "./Reveal";
import SectionHead from "./SectionHead";
import GlowCard from "./ui/GlowCard";

/* Numbered because the order is real: this is the sequence a release
   actually moves through, not decoration. */
const NOTES = [
  {
    n: "01",
    head: "Prove it before it ships",
    body: "Backup integrity is verified in T-SQL, and every restart clears four health conditions before the deploy carries on. Whatever reaches production has already earned its place there.",
  },
  {
    n: "02",
    head: "Rehearse the rollback",
    body: "Every upgrade path has a rescue block and a restore that someone has run end to end. Practising recovery in the quiet moments is what keeps it quick and calm on the day it counts.",
  },
  {
    n: "03",
    head: "One inventory for every environment",
    body: "The Ansible is environment-agnostic, so a single change lands everywhere it belongs. Good design is what keeps every environment perfectly in step with the others.",
  },
  {
    n: "04",
    head: "Watch the deploy itself",
    body: "Deployment telemetry, run summaries and Teams alerts. Every release reports its own status the moment it knows it, so the team always has the full picture in front of them.",
  },
];

export default function HowIWork() {
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead
          label="How I work"
          title="Built so every release lands well"
        />

        <Reveal className="notes" stagger={0.09}>
          {NOTES.map((note) => (
            <GlowCard key={note.n}>
              <div className="note">
                <span className="note-num">{note.n}</span>
                <div>
                  <h3 className="note-head">
                    {note.head}
                  </h3>
                  <p className="note-body">{note.body}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
