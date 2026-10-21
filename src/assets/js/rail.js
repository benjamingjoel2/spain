// Rail journey planner: pick cities, get an efficient order, the trains between
// them (via the shortest path on the network) and suggested nights.
(function () {
  var dataEl = document.getElementById('rail-data');
  var form = document.getElementById('planner-form');
  if (!dataEl || !form) return;
  var data = JSON.parse(dataEl.textContent);
  var cities = data.cities;
  var out = document.getElementById('route-out');
  var svg = document.getElementById('rail-map');
  var picked = [];        // in the order ticked; first is the start
  var nights = {};        // user overrides

  // ----- graph -----
  var adj = {};
  Object.keys(cities).forEach(function (k) { adj[k] = []; });
  data.links.forEach(function (l) {
    adj[l[0]].push({ to: l[1], min: l[2], type: l[3] });
    adj[l[1]].push({ to: l[0], min: l[2], type: l[3] });
  });
  var pathCache = {};
  function shortest(a, b) {
    var key = a + '>' + b;
    if (pathCache[key]) return pathCache[key];
    var dist = {}, prev = {}, done = {};
    Object.keys(adj).forEach(function (k) { dist[k] = Infinity; });
    dist[a] = 0;
    while (true) {
      var u = null;
      Object.keys(dist).forEach(function (k) { if (!done[k] && dist[k] < Infinity && (u === null || dist[k] < dist[u])) u = k; });
      if (u === null || u === b) break;
      done[u] = true;
      adj[u].forEach(function (e) {
        var d = dist[u] + e.min + 15; // small penalty per leg for changing trains
        if (d < dist[e.to]) { dist[e.to] = d; prev[e.to] = { from: u, edge: e }; }
      });
    }
    var legs = [], cur = b;
    while (prev[cur]) { legs.unshift({ from: prev[cur].from, to: cur, min: prev[cur].edge.min, type: prev[cur].edge.type }); cur = prev[cur].from; }
    var res = { legs: legs, min: legs.reduce(function (s, l) { return s + l.min; }, 0) };
    pathCache[key] = res;
    return res;
  }

  function permutations(arr) {
    if (arr.length <= 1) return [arr];
    var res = [];
    arr.forEach(function (x, i) {
      permutations(arr.slice(0, i).concat(arr.slice(i + 1))).forEach(function (p) { res.push([x].concat(p)); });
    });
    return res;
  }
  function bestOrder(list) {
    if (list.length < 3) return list.slice();
    var start = list[0], rest = list.slice(1), best = null, bestCost = Infinity;
    permutations(rest).forEach(function (p) {
      var order = [start].concat(p), cost = 0;
      for (var i = 0; i < order.length - 1; i++) cost += shortest(order[i], order[i + 1]).min;
      if (cost < bestCost) { bestCost = cost; best = order; }
    });
    return best;
  }

  // ----- formatting -----
  function hm(min) {
    var h = Math.floor(min / 60), m = Math.round((min % 60) / 5) * 5;
    if (m === 60) { h++; m = 0; }
    return (h ? h + 'h' : '') + (h && m ? ' ' : '') + (m ? m + 'm' : (h ? '' : '0m'));
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nightsFor(k) { return nights[k] != null ? nights[k] : cities[k].nights; }

  // ----- map -----
  var NS = 'http://www.w3.org/2000/svg';
  function proj(c) {
    var s = 47.5;
    return { x: 63 + (c.lon + 9.5) * 0.766 * s, y: 18 + (44 - c.lat) * s };
  }
  var always = ['madrid', 'barcelona', 'seville', 'valencia', 'bilbao', 'santiago', 'malaga'];
  function drawMap(order, legs) {
    while (svg.childNodes.length > 1) svg.removeChild(svg.lastChild);
    var onEdge = {};
    legs.forEach(function (l) { onEdge[[l.from, l.to].sort().join('|')] = true; });
    data.links.forEach(function (l) {
      var a = proj(cities[l[0]]), b = proj(cities[l[1]]);
      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y); line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('class', 'edge' + (l[3] === 'high-speed' ? ' hs' : '') + (onEdge[[l[0], l[1]].sort().join('|')] ? ' on' : ''));
      svg.appendChild(line);
    });
    Object.keys(cities).forEach(function (k) {
      var p = proj(cities[k]), sel = order.indexOf(k) !== -1;
      var c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', p.x); c.setAttribute('cy', p.y); c.setAttribute('r', sel ? 6 : 3.5);
      if (sel) c.setAttribute('class', 'on');
      svg.appendChild(c);
      if (sel || always.indexOf(k) !== -1) {
        var t = document.createElementNS(NS, 'text');
        var left = p.x > 470;
        var dy = { cadiz: 14, ronda: 14, sansebastian: -6, vitoria: 12, pontevedra: 10, vigo: 14, coruna: -6, toledo: 12, xativa: 12 }[k] || 4;
        t.setAttribute('x', p.x + (left ? -9 : 9)); t.setAttribute('y', p.y + dy);
        if (left) t.setAttribute('text-anchor', 'end');
        t.textContent = (sel ? (order.indexOf(k) + 1) + '. ' : '') + cities[k].name.replace('Santiago de Compostela', 'Santiago');
        svg.appendChild(t);
      }
    });
  }

  // ----- render -----
  function render() {
    var order = bestOrder(picked);
    var allLegs = [];
    var html = '';
    if (picked.length < 2) {
      html = '<p class="muted">' + (picked.length ? 'Now tick at least one more city.' : 'Tick two or more cities to see a route.') + '</p>';
      out.innerHTML = html;
      drawMap(order, []);
      updateUrl();
      return;
    }
    var totalMin = 0, totalNights = 0;
    order.forEach(function (k) { totalNights += nightsFor(k); });
    var stopsHtml = order.map(function (k, i) {
      var c = cities[k];
      var s = '<li class="route-stop"><span class="route-dot" aria-hidden="true">' + (i + 1) + '</span><div>' +
        '<h3>' + esc(c.name) + '</h3><p class="small muted" style="margin:0">' + esc(c.note) + '</p>' +
        '<div class="nights"><button type="button" data-n="-1" data-city="' + k + '" aria-label="One night fewer in ' + esc(c.name) + '">−</button>' +
        '<span><strong>' + nightsFor(k) + '</strong> night' + (nightsFor(k) === 1 ? '' : 's') + '</span>' +
        '<button type="button" data-n="1" data-city="' + k + '" aria-label="One night more in ' + esc(c.name) + '">+</button></div></div></li>';
      if (i < order.length - 1) {
        var p = shortest(k, order[i + 1]);
        totalMin += p.min;
        allLegs = allLegs.concat(p.legs);
        var via = p.legs.slice(0, -1).map(function (l) { return cities[l.to].name; });
        s += '<li class="route-leg"><strong>By train, about ' + hm(p.min) + '</strong>' +
          (via.length ? ', changing at ' + esc(via.join(', ')) : ', direct') + '<br>' +
          p.legs.map(function (l) { return esc(cities[l.from].name) + ' → ' + esc(cities[l.to].name) + ': ' + (l.type === 'high-speed' ? 'high-speed' : 'regional') + ', ~' + hm(l.min); }).join('<br>') +
          '</li>';
      }
      return s;
    }).join('');
    html += '<div class="route-summary"><div><strong>' + order.length + '</strong>stops</div><div><strong>' + totalNights + '</strong>nights</div><div><strong>~' + hm(totalMin) + '</strong>on trains</div></div>';
    html += '<ol class="route">' + stopsHtml + '</ol>';
    html += '<p class="small muted" style="margin-top:1rem">Times are rough fastest journeys and exclude waiting at connections. Not every service runs daily. Check Renfe, Iryo or Ouigo for current timetables.</p>';
    html += '<div class="btn-row"><a class="btn btn--primary" id="send-route" href="#">Send this route with an enquiry</a></div>';
    out.innerHTML = html;
    var text = order.map(function (k) { return cities[k].name + ' (' + nightsFor(k) + ' night' + (nightsFor(k) === 1 ? '' : 's') + ')'; }).join(' → ');
    document.getElementById('send-route').href = '/enquire/?route=' + encodeURIComponent(text);
    drawMap(order, allLegs);
    updateUrl();
  }

  function updateUrl() {
    var q = picked.length ? '?cities=' + picked.join(',') : '';
    history.replaceState(null, '', location.pathname + q + location.hash);
  }

  out.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-city]');
    if (!b) return;
    var k = b.dataset.city;
    nights[k] = Math.max(1, Math.min(14, nightsFor(k) + Number(b.dataset.n)));
    render();
    var again = out.querySelector('button[data-city="' + k + '"][data-n="' + b.dataset.n + '"]');
    if (again) again.focus();
  });

  form.addEventListener('change', function (e) {
    if (e.target.name !== 'city') return;
    var k = e.target.value;
    if (e.target.checked) {
      if (picked.length >= 7) { e.target.checked = false; alert('Up to seven cities at a time, please. Slow travel!'); return; }
      picked.push(k);
    } else picked = picked.filter(function (x) { return x !== k; });
    render();
  });
  document.getElementById('planner-clear').addEventListener('click', function () {
    picked = []; nights = {};
    form.querySelectorAll('input[name=city]').forEach(function (i) { i.checked = false; });
    render();
  });

  var initial = (new URLSearchParams(location.search).get('cities') || '').split(',').filter(function (k) { return cities[k]; }).slice(0, 7);
  initial.forEach(function (k) {
    if (picked.indexOf(k) !== -1) return;
    picked.push(k);
    var box = form.querySelector('input[value="' + k + '"]');
    if (box) box.checked = true;
  });
  render();
})();
