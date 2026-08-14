export default function Footer() {
  return (
    <footer
      className="section"
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <span className="eyebrow">LOOMLINE — attribute-driven motion</span>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <a className="eyebrow" href="#">Docs</a>
        <a className="eyebrow" href="#">Source</a>
        <a className="eyebrow" href="#">Back to top</a>
      </div>
    </footer>
  );
}
