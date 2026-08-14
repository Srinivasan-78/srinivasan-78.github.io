import SplitReveal from "./SplitReveal";

export default function Hero() {
  return (
    <section
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "8rem var(--gap) 4rem",
      }}
    >
      <span className="eyebrow" style={{ marginBottom: "1.5rem" }}>
        Markup-first motion · zero required JS
      </span>
      <SplitReveal
        as="h1"
        text="Wire your motion straight into the HTML."
        className="display"
        stagger={0.02}
      />
      <p
        style={{
          maxWidth: 480,
          marginTop: "2rem",
          color: "var(--fg-dim)",
        }}
      >
        Loomline is a small toolkit for scroll reveals, cursor tracking,
        and progress state — configured with plain attributes, imported a
        piece at a time.
      </p>
    </section>
  );
}
