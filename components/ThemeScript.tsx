const THEME_SCRIPT = `
(function(){
  try {
    if (localStorage.getItem('theme') === 'light') {
      document.documentElement.setAttribute('data-theme','light');
    }
  } catch(e) {}
})();
`;

/* The <html> element already ships with data-theme="dark" from the
   server, so dark is correct with JS disabled, blocked, or still
   loading. This script's only job is the one exception: a visitor who
   previously chose light. It runs before paint, so there's no flash.

   Note it renders inside <body>, not <head> — App Router does not
   reliably execute a raw inline <script> placed in <head>, which is why
   the theme attribute was ending up unset. */
export default function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
