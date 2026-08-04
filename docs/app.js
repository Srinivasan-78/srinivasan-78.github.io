/* Shared behaviour for every page: sticky nav shadow, mobile nav
   toggle, and scroll-reveal animations. */

document.addEventListener('DOMContentLoaded', function () {

  /* sticky nav shadow */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('stuck', window.scrollY > 20);
    });
  }

  /* mobile nav toggle */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'close' : 'menu';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'menu';
      }
    });
  }

  /* scroll reveal */
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
});

/* ---------- THEME TOGGLE ----------
   The initial theme is applied by a small inline script in each
   page's <head> so there is no flash of the wrong theme before this
   file loads. This part only handles the button. Storage is wrapped
   in try/catch because some embedded/preview contexts block it —
   the toggle still works for the session if storage is unavailable. */
(function () {
  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var root = document.documentElement;

    function paint(theme){
      var dark = theme === 'dark';
      btn.querySelector('.tt-icon').textContent = dark ? '☀' : '☾';
      btn.querySelector('.tt-text').textContent = dark ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }

    paint(root.getAttribute('data-theme') || 'light');

    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      paint(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });
})();
