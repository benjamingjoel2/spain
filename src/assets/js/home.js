// Home page: live Spanish time, what's happening now, and this month's festivals.
(function () {
  var now = window.spainNow();
  var hhmm = String(Math.floor(now.minutes / 60)).padStart(2, '0') + ':' + String(now.minutes % 60).padStart(2, '0');
  var timeEl = document.getElementById('home-time');
  if (timeEl) timeEl.textContent = hhmm;

  var clockEl = document.getElementById('clock-data');
  var nowEl = document.getElementById('now-spain');
  if (clockEl && nowEl) {
    var tips = JSON.parse(clockEl.textContent).tips;
    var m = now.minutes < 360 ? now.minutes + 1440 : now.minutes;
    var toMin = function (s) { var p = s.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
    var tip = tips.find(function (t) { return m >= toMin(t.from) && m < toMin(t.to); });
    if (tip) nowEl.textContent = tip.text;
  }

  var festEl = document.getElementById('fest-data');
  var festNow = document.getElementById('fest-now');
  if (festEl && festNow) {
    var d = JSON.parse(festEl.textContent);
    var list = d.festivals.filter(function (f) { return f.months.indexOf(now.month) !== -1; });
    if (list.length) {
      festNow.textContent = 'This ' + d.monthNames[now.month - 1] + ': ' + list.slice(0, 3).map(function (f) { return f.name; }).join(', ') + (list.length > 3 ? ' and more.' : '.');
    }
  }
  var cell = document.querySelector('#home-months a[data-month="' + now.month + '"]');
  if (cell) { cell.classList.add('is-now'); cell.setAttribute('aria-label', cell.textContent + ' (this month)'); }
})();
