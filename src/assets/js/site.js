// Mobile navigation toggle.
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      btn.focus();
    }
  });
})();

// Shared helper: current time in Spain (peninsular), as minutes since midnight and month.
window.spainNow = function () {
  var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', month: 'numeric', weekday: 'short', hourCycle: 'h23' }).formatToParts(new Date());
  var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
  return { minutes: Number(get('hour')) * 60 + Number(get('minute')), month: Number(get('month')), weekday: get('weekday') };
};
