// Festivals calendar filters (month + region). The full list is rendered in HTML;
// this script only hides and shows it.
(function () {
  var strip = document.getElementById('month-strip');
  var regionSel = document.getElementById('fest-region');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.fest-month'));
  var countEl = document.getElementById('fest-count');
  var empty = document.getElementById('fest-empty');
  if (!strip || !regionSel) return;
  strip.hidden = false;

  var params = new URLSearchParams(location.search);
  var state = { month: params.get('month') || '', region: params.get('region') || '' };
  if (state.region && !regionSel.querySelector('option[value="' + CSS.escape(state.region) + '"]')) state.region = '';
  regionSel.value = state.region;

  function apply() {
    strip.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.month === state.month)); });
    var shown = 0, seen = {};
    sections.forEach(function (sec) {
      var monthOk = !state.month || sec.dataset.month === state.month;
      var visible = 0;
      sec.querySelectorAll('.fest').forEach(function (f) {
        var ok = monthOk && (!state.region || f.dataset.region === state.region);
        f.hidden = !ok;
        if (ok) { visible++; seen[f.querySelector('h3').textContent + f.dataset.region] = 1; }
      });
      sec.hidden = visible === 0;
      shown += visible;
    });
    var unique = Object.keys(seen).length;
    empty.hidden = shown > 0;
    countEl.textContent = unique === 1 ? '1 festival' : unique + ' festivals';
    var q = new URLSearchParams();
    if (state.month) q.set('month', state.month);
    if (state.region) q.set('region', state.region);
    history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
  }

  strip.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    state.month = b.dataset.month;
    apply();
  });
  regionSel.addEventListener('change', function () { state.region = regionSel.value; apply(); });
  apply();
})();
