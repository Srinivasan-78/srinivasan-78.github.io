import SplitReveal from "./SplitReveal";

const ROWS = [
  { who: "Designers", need: "Tune behavior through attributes and see it live — no build step in the way." },
  { who: "New to this", need: "Start from markup alone. Reach for JavaScript only when a pattern truly needs it." },
  { who: "Building for scale", need: "Drop into the module internals, override defaults, compose your own effects on top." },
];

export default function Audience() {
  return (
    <section id="audience" className="section">
      <span className="eyebrow">Who it's for</span>
      <div style={{ marginTop: "2rem" }}>
        {ROWS.map((r) => (
          <div
            key={r.who}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "var(--gap)",
              padding: "1.25rem 0",
              borderTop: "1px solid var(--line)",
              flexWrap: "wrap",
            }}
          >
            <SplitReveal as="h4" text={r.who} className="display" />
            <p style={{ color: "var(--fg-dim)", maxWidth: 420 }}>{r.need}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
