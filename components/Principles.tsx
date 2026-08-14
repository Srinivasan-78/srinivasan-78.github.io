import SplitReveal from "./SplitReveal";

const PRINCIPLES = [
  {
    title: "Take only what you need",
    body: "Each interaction ships as its own module — pull in a reveal without dragging in a cursor tracker you'll never use.",
  },
  {
    title: "Markup does the wiring",
    body: "Data attributes turn any element into an animated one. No config file, no manual bindings.",
  },
  {
    title: "One import, running",
    body: "A single init call reads the page and starts everything it finds. Nothing to register by hand.",
  },
  {
    title: "Room for the whole range",
    body: "Reveals, parallax, sticky states, cursor follow, progress bars — one consistent attribute syntax covers all of it.",
  },
  {
    title: "Built to stay light",
    body: "No layout thrashing, small runtime footprint, and nothing that fights the browser's own scrolling.",
  },
];

export default function Principles() {
  return (
    <section id="principles" className="section">
      <span className="eyebrow">How it works</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--gap)",
          marginTop: "2rem",
        }}
      >
        {PRINCIPLES.map((p) => (
          <div key={p.title} style={{ borderTop: "1px solid var(--line)", paddingTop: "1.25rem" }}>
            <SplitReveal as="h3" text={p.title} className="display" />
            <p style={{ color: "var(--fg-dim)", marginTop: "0.75rem" }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
