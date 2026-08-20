const THEME_SCRIPT = `
(function(){
  // Marks that scripting is live. The scroll-reveal transition in
  // globals.css starts its elements at opacity 0 and relies on an
  // IntersectionObserver to turn them on, so without this flag a visitor
  // with JS blocked or broken would get a page of invisible headings.
  // Scoped to html.js, set here before paint, so no-JS simply skips the
  // animation and shows the content.
  document.documentElement.classList.add('js');
  try {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.setAttribute('data-theme','light');
    }
  } catch(e) {}
})();
`;

/* Two jobs, both of which have to happen before the first paint.

   The <html> element already ships with data-theme="dark" from the
   server, so dark is correct with JS disabled, blocked, or still
   loading. The theme half of this script handles the one exception: a
   visitor who previously chose light. The other half sets html.js, which
   is what gates the scroll-reveal transition.

   Note it renders inside <body>, not <head> — App Router does not
   reliably execute a raw inline <script> placed in <head>, which is why
   the theme attribute was ending up unset. */
export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
