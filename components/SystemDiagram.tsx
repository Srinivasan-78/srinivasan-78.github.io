"use client";

import { useInView } from "@/lib/useInView";

export type Stage = { label: string; note?: string };

/* Project data labels some stages "Stage 3 — voiceover". The diagram
   already numbers them, so the prefix would be said twice. */
const stripOrdinal = (label: string) => label.replace(/^Stage\s+\d+\s*[—–-]\s*/i, "");

/* The page's one piece of real artwork.

   Every visual on this site used to be a stock photograph — a server
   rack, a circuit board, a sky — chosen because it was vaguely
   technical and cropped to a banner. None of them said anything about
   the work. This draws the actual system instead: the stages a release
   moves through, in order, with the return path that makes it safe.

   Built from HTML and CSS rather than SVG on purpose. The flow has to
   reflow from a horizontal row on a wide screen to a vertical column on
   a phone, the labels have to be selectable text a screen reader can
   read in order, and the whole thing has to recolour with the theme.
   An SVG would need a second hand-authored copy for each of those. */
export default function SystemDiagram({
  stages,
  returnPath,
  caption,
}: {
  stages: Stage[];
  /** Label for the line that runs back from the end to the start. */
  returnPath?: string;
  caption?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <figure
      ref={ref}
      className={"diagram reveal-group reveal-pop" + (inView ? " is-in" : "")}
    >
      <ol className="diagram-flow">
        {stages.map((s, i) => (
          <li
            className="diagram-node"
            key={s.label}
            style={{ transitionDelay: `${Math.min(i * 0.07, 0.42)}s` }}
          >
            <span className="diagram-index">{String(i + 1).padStart(2, "0")}</span>
            <span className="diagram-label">{stripOrdinal(s.label)}</span>
            {s.note && <span className="diagram-note">{s.note}</span>}
          </li>
        ))}
      </ol>

      {returnPath && (
        <div className="diagram-return" aria-label={`Return path: ${returnPath}`}>
          <span>{returnPath}</span>
        </div>
      )}

      {caption && <figcaption className="diagram-caption">{caption}</figcaption>}
    </figure>
  );
}
