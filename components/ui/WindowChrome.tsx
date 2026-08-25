import "./WindowChrome.css";

/* The macOS titlebar strip: three lights on the left, an optional title
   on the right.

   It renders as the first child of a card's clipping box, so it sits
   flush in the top two corners and takes its radius from the surface
   rather than declaring one.

   `aria-hidden` is deliberate and covers the title too. The bar is a
   frame around content that already carries its own heading, so
   everything in here is a second, decorative copy of information the
   page states properly elsewhere. */

export type WindowChromeProps = {
  /** Ornamental label on the trailing edge. Omitted, the bar is lights only. */
  title?: string;
};

export default function WindowChrome({ title }: WindowChromeProps) {
  return (
    <div className="win-bar" aria-hidden="true">
      <span className="win-light win-light-close" />
      <span className="win-light win-light-min" />
      <span className="win-light win-light-zoom" />
      {title ? <span className="win-title">{title}</span> : null}
    </div>
  );
}
