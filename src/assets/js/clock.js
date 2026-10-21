// The Spanish clock: an interactive day.
(function () {
  var root = document.getElementById('clock');
  var dataEl = document.getElementById('clock-data');
  if (!root || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var START = 6 * 60, END = 28 * 60; // 06:00 to 04:00 next day
  var state = { day: 'weekday', t: 19 * 60 };

  function toMin(s) { var p = s.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function fmt(m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function pct(m) { return ((m - START) / (END - START)) * 100; }
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  root.innerHTML = '';
  var top = el('div', { class: 'clock-top' });
  var timeOut = el('p', { class: 'clock-time', 'aria-hidden': 'true' });
  var seg = el('div', { class: 'seg', role: 'group', 'aria-label': 'Choose a day' });
  Object.keys(data.days).forEach(function (key) {
    var b = el('button', { type: 'button', 'data-day': key, 'aria-pressed': String(key === state.day) }, escapeHtml(data.days[key].label));
    b.addEventListener('click', function () { state.day = key; render(); });
    seg.appendChild(b);
  });
  var nowBtn = el('button', { type: 'button', class: 'btn btn--light' }, '<span>Now in Spain</span><span class="btn-icon"><svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/></svg></span>');
  nowBtn.addEventListener('click', function () {
    var n = window.spainNow();
    var m = n.minutes < START ? n.minutes + 1440 : n.minutes;
    if (n.weekday === 'Sun') state.day = 'sunday';
    else if (n.month === 7 || n.month === 8) state.day = 'summer';
    state.t = Math.min(m, END);
    render();
  });
  var mid = el('div');
  mid.appendChild(seg);
  top.appendChild(timeOut); top.appendChild(mid); top.appendChild(nowBtn);

  var timeWrap = el('div');
  var timeLabel = el('label', { for: 'clock-range', class: 'visually-hidden' }, 'Time of day in Spain');
  var range = el('input', { type: 'range', id: 'clock-range', class: 'clock-slider', min: START, max: END, step: 15 });
  var scale = el('div', { class: 'clock-scale', 'aria-hidden': 'true' }, ['06', '09', '12', '15', '18', '21', '00', '03'].map(function (h) { return '<span>' + h + ':00</span>'; }).join(''));
  range.addEventListener('input', function () { state.t = Number(range.value); update(); });
  timeWrap.appendChild(timeLabel); timeWrap.appendChild(range); timeWrap.appendChild(scale);

  var timeline = el('div', { class: 'timeline' });
  var readout = el('div', { class: 'clock-readout' });
  var doing = el('div', { class: 'readout-box', 'aria-live': 'polite' });
  var tip = el('div', { class: 'readout-box readout-tip', 'aria-live': 'polite' });
  readout.appendChild(doing); readout.appendChild(tip);

  root.appendChild(top); root.appendChild(timeWrap); root.appendChild(timeline); root.appendChild(readout);

  // Pack overlapping blocks within a lane into rows.
  function packRows(blocks) {
    var rows = [];
    blocks.slice().sort(function (a, b) { return toMin(a.from) - toMin(b.from); }).forEach(function (b) {
      var s = toMin(b.from), e = toMin(b.to);
      for (var i = 0; i < rows.length; i++) { if (rows[i].end <= s) { rows[i].end = e; rows[i].items.push(b); return; } }
      rows.push({ end: e, items: [b] });
    });
    return rows;
  }

  var blockEls = [];
  function render() {
    seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.day === state.day)); });
    timeline.innerHTML = '';
    blockEls = [];
    var day = data.days[state.day];
    data.lanes.forEach(function (lane) {
      var blocks = day.blocks.filter(function (b) { return b.lane === lane.id; });
      if (!blocks.length) return;
      var rows = packRows(blocks);
      var laneEl = el('div', { class: 'lane' });
      laneEl.appendChild(el('div', { class: 'lane-label' }, escapeHtml(lane.label)));
      var trackWrap = el('div');
      rows.forEach(function (row) {
        var track = el('div', { class: 'lane-track' });
        row.items.forEach(function (b) {
          var s = toMin(b.from), e = toMin(b.to);
          var btn = el('button', { type: 'button', class: 'block', 'data-lane': lane.id, style: 'left:' + pct(s) + '%;width:' + (pct(e) - pct(s)) + '%', 'aria-label': b.title + ', ' + fmt(s) + ' to ' + fmt(e) }, escapeHtml(b.title));
          btn.addEventListener('click', function () { state.t = s + Math.min(30, (e - s) / 2); update(); });
          btn._b = b; btn._s = s; btn._e = e;
          blockEls.push(btn);
          track.appendChild(btn);
        });
        track.appendChild(el('span', { class: 'now-line', 'aria-hidden': 'true' }));
        trackWrap.appendChild(track);
      });
      laneEl.appendChild(trackWrap);
      timeline.appendChild(laneEl);
    });
    update();
  }

  function update() {
    var t = state.t;
    range.value = t;
    range.setAttribute('aria-valuetext', fmt(t));
    timeOut.textContent = fmt(t);
    timeline.querySelectorAll('.now-line').forEach(function (l) { l.style.left = pct(t) + '%'; });
    var active = [];
    blockEls.forEach(function (b) {
      var on = t >= b._s && t < b._e;
      b.classList.toggle('is-active', on);
      if (on) active.push(b._b);
    });
    var kitchens = active.some(function (b) { return b.lane === 'kitchens'; });
    var html = '<p class="label"><b>(' + fmt(t) + ')</b>What Spain is doing</p>';
    var people = active.filter(function (b) { return b.lane !== 'kitchens'; });
    html += people.length
      ? '<ul>' + people.map(function (b) { return '<li><strong style="font-weight:500">' + escapeHtml(b.title) + '.</strong> <span class="muted">' + escapeHtml(b.text) + '</span></li>'; }).join('') + '</ul>'
      : '<p>Most of Spain is asleep or at home.</p>';
    html += '<p class="small"><strong style="font-weight:500;color:var(--sherry-gold-soft)">Restaurant kitchens:</strong> ' + (kitchens ? 'mostly open.' : 'mostly closed. Bars may serve drinks and cold tapas.') + '</p>';
    doing.innerHTML = html;
    var tipText = '';
    data.tips.forEach(function (tp) { if (t >= toMin(tp.from) && t < toMin(tp.to)) tipText = tp.text; });
    tip.innerHTML = '<p class="label">What you should do</p><p>' + escapeHtml(tipText || 'Rest up. Tomorrow starts late.') + '</p>';
  }

  render();
})();
