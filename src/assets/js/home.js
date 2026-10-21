// Home page: live "now in Spain" line and festivals this month.
(function () {
  var now = window.spainNow();
  var clockEl = document.getElementById('clock-data');
  var nowEl = document.getElementById('now-spain');
  if (clockEl && nowEl) {
    var tips = JSON.parse(clockEl.textContent).tips;
    var m = now.minutes < 360 ? now.minutes + 1440 : now.minutes;
    var toMin = function (s) { var p = s.split(':'); return Number(p[0]) * 60 + Number(p[1]); };
    var tip = tips.find(function (t) { return m >= toMin(t.from) && m < toMin(t.to); });
    var hhmm = String(Math.floor(now.minutes / 60)).padStart(2, '0') + ':' + String(now.minutes % 60).padStart(2, '0');
    nowEl.innerHTML = '<strong>It’s ' + hhmm + ' in Spain right now.</strong> ' + (tip ? tip.text.replace(/</g, '&lt;') : 'Most of the country is asleep.');
  }
  var festEl = document.getElementById('fest-data');
  var festNow = document.getElementById('fest-now');
  if (festEl && festNow) {
    var d = JSON.parse(festEl.textContent);
    var list = d.festivals.filter(function (f) { return f.months.indexOf(now.month) !== -1; });
    if (list.length) {
      var names = list.slice(0, 3).map(function (f) { return f.name + ' (' + f.place.split(',')[0].split(' and ')[0] + ')'; });
      festNow.innerHTML = '<strong>This ' + d.monthNames[now.month - 1] + ':</strong> ' + names.join('; ').replace(/</g, '&lt;') + (list.length > 3 ? ' and more.' : '.');
    }
  }
})();
