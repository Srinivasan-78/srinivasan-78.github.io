import SplitReveal from "./SplitReveal";

/* Sticky chapter header. The index and label pin to the top while the
   section's content scrolls beneath, so the page reads as numbered
   chapters rather than one continuous column. */
export default function SectionHead({
  index,
  label,
  title,
  accent = "sage",
}: {
  index: string;
  label: string;
  title: string;
  accent?: "sage" | "slate" | "plum" | "brass";
}) {
  return (
    <>
      <div className="sec-head">
        <span className={"eyebrow c-" + accent}>{label}</span>
        <span className="sec-index">{index}</span>
      </div>
      <SplitReveal as="h2" text={title} className="display display-lg" stagger={0.02} />
    </>
  );
}
