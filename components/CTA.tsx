import SplitReveal from "./SplitReveal";

export default function CTA() {
  return (
    <section
      className="section"
      style={{ textAlign: "center", paddingBottom: "6rem" }}
    >
      <SplitReveal
        as="h2"
        text="Start with one attribute. Grow from there."
        className="display"
        stagger={0.02}
      />
      <p style={{ color: "var(--fg-dim)", marginTop: "1rem" }}>
        Every module here is generic on purpose — swap the palette, the
        type, the copy, and it stops being this demo page.
      </p>
    </section>
  );
}
