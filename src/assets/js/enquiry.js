// Enquiry form: validates, then posts to the configured endpoint, or opens a
// pre-filled email if no endpoint is set in site.config.json.
(function () {
  var form = document.getElementById('enquiry');
  var cfgEl = document.getElementById('form-config');
  if (!form || !cfgEl) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var status = document.getElementById('form-status');

  var route = new URLSearchParams(location.search).get('route');
  if (route) form.message.value = 'Rail route from the planner:\n' + route.slice(0, 1500) + '\n\n';

  function setError(input, msg) {
    var id = input.id + '-error';
    var old = document.getElementById(id);
    if (old) old.remove();
    input.removeAttribute('aria-invalid');
    input.setAttribute('aria-describedby', (input.getAttribute('aria-describedby') || '').replace(id, '').trim());
    if (!msg) return;
    input.setAttribute('aria-invalid', 'true');
    var p = document.createElement('p');
    p.className = 'form-error'; p.id = id; p.textContent = msg;
    input.insertAdjacentElement('afterend', p);
    input.setAttribute('aria-describedby', ((input.getAttribute('aria-describedby') || '') + ' ' + id).trim());
  }

  function validate() {
    var ok = true;
    if (!form.name.value.trim()) { setError(form.name, 'Please tell us your name.'); ok = false; } else setError(form.name);
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(form.email, 'Please enter a valid email address, like name@example.com.'); ok = false; } else setError(form.email);
    return ok;
  }

  function summary() {
    var fd = new FormData(form);
    var lines = [];
    ['name', 'email', 'phone', 'when', 'nights', 'people', 'pace'].forEach(function (k) { if (fd.get(k)) lines.push(k[0].toUpperCase() + k.slice(1) + ': ' + fd.get(k)); });
    if (fd.getAll('regions').length) lines.push('Regions: ' + fd.getAll('regions').join(', '));
    if (fd.getAll('interests').length) lines.push('Interests: ' + fd.getAll('interests').join(', '));
    if (fd.get('message')) lines.push('', fd.get('message'));
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    if (cfg.endpoint) {
      status.innerHTML = '<p class="notice">Sending…</p>';
      fetch(cfg.endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); location.href = '/enquire/thanks/'; })
        .catch(function () {
          status.innerHTML = '<p class="notice">Sorry, something went wrong. Please email us at <a href="mailto:' + cfg.email + '">' + cfg.email + '</a>.</p>';
        });
      return;
    }
    var subject = 'Trip enquiry from ' + form.name.value.trim();
    location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(summary());
    status.innerHTML = '<p class="notice notice--ok">Your email app should open with your enquiry ready to send. If it doesn’t, email us at <a href="mailto:' + cfg.email + '">' + cfg.email + '</a>.</p>';
    status.querySelector('p').setAttribute('tabindex', '-1');
    status.querySelector('p').focus();
  });
})();
