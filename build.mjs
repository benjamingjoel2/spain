// Static site generator. No dependencies: `node build.mjs` writes ./dist.
import fs from 'node:fs';
import path from 'node:path';
import { regions } from './src/data/regions.mjs';
import { festivals, monthNames } from './src/data/festivals.mjs';
import { cities, links, journeys } from './src/data/rail.mjs';
import * as clock from './src/data/clock.mjs';
import { food, months, seasonGrid, stays, journal } from './src/data/content.mjs';
import { legal } from './src/data/legal.mjs';

const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const photos = JSON.parse(fs.readFileSync('src/data/photos.json', 'utf8'));
const { brand, contact, site, palette, fonts } = config;
const OUT = 'dist';
const LEGAL = legal({ brand: brand.name, email: contact.email, address: contact.address });
// Business details for search engines (home page only). No phone by design.
const orgJsonLd = {
  '@context': 'https://schema.org', '@type': 'TravelAgency', name: brand.name, description: brand.description,
  url: site.url + '/', email: contact.email,
  address: { '@type': 'PostalAddress', ...contact.postalAddress },
};
const BUILD_ID = Date.now().toString(36);

// ───────── helpers ─────────
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
const pad2 = n => String(n).padStart(2, '0');
const regionBySlug = Object.fromEntries(regions.map(r => [r.slug, r]));
const regionName = slug => slug === 'nationwide' ? 'Nationwide' : regionBySlug[slug]?.name ?? slug;
const json = data => JSON.stringify(data).replace(/</g, '\\u003c');
const clockTime = t => { const [h, m] = t.split(':').map(Number); return `${pad2(h % 24)}:${pad2(m)}`; };
const fmtDate = iso => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const arrow = '<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';
const label = (n, text) => `<p class="label">${n ? `<b>(${pad2(n)})</b>` : ''}${text}</p>`;
const btn = (href, text, v = 'solid') => `<a class="btn btn--${v}" href="${href}"><span>${text}</span><span class="btn-icon">${arrow}</span></a>`;
const linkArrow = (href, text) => `<a class="link-arrow" href="${href}">${text}${arrow}</a>`;

const imgUrl = (p, w, ratio) => `${p.src}&w=${w}${ratio ? `&h=${Math.round(w * ratio[1] / ratio[0])}&fit=crop` : ''}&auto=format&q=70`;
function img(key, { ratio, sizes = '100vw', eager = false, widths = [480, 800, 1200, 1600, 2200] } = {}) {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo: ${key}`);
  const r = ratio || [p.w, p.h];
  const srcset = widths.map(w => `${esc(imgUrl(p, w, ratio))} ${w}w`).join(', ');
  return `<img src="${esc(imgUrl(p, 1200, ratio))}" srcset="${srcset}" sizes="${sizes}" width="1200" height="${Math.round(1200 * r[1] / r[0])}" alt="${esc(p.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'} style="background:${p.color}">`;
}
// Self-hosted fonts (src/assets/fonts, from Google Fonts): @font-face rules are
// inlined in <head> so text never waits on a third-party stylesheet.
const fontFaceCss = fs.readFileSync('src/assets/css/fonts.css', 'utf8').replace(/\/\*[^*]*\*\/\n?/g, '').replace(/\s*\n\s*/g, '');
// Preload the page's hero photo (the eager, fetchpriority=high image) with its srcset.
const heroPreload = body => {
  const m = body.match(/<img src="[^"]+" srcset="([^"]+)" sizes="([^"]+)"[^>]*fetchpriority="high"/);
  return m ? `<link rel="preload" as="image" imagesrcset="${m[1]}" imagesizes="${m[2]}" fetchpriority="high">` : '';
};
const media = (key, ratioClass, sizes, ratio) => `<div class="media ${ratioClass}">${img(key, { ratio, sizes })}</div>`;
const figure = (key, ratioClass = 'ratio-45', sizes = '(min-width: 56rem) 45vw, 100vw', ratio) => `<figure class="reveal" style="margin:0">${media(key, ratioClass, sizes, ratio)}</figure>`;

// ───────── layout ─────────
const navLeft = [['/regions/', 'Regions'], ['/food-and-wine/', 'Food & wine'], ['/rail-journeys/', 'Rail'], ['/festivals/', 'Festivals'], ['/when-to-go/', 'When to go']];
const navRight = [['/spanish-clock/', 'Spanish clock'], ['/stays/', 'Stays'], ['/journal/', 'Journal'], ['/about/', 'About']];
const allNav = [...navLeft, ...navRight, ['/enquire/', 'Plan a trip']];

const pages = [];
function page(urlPath, { title, description = brand.description, body, scripts = [], image = 'home', hero = false }) {
  pages.push(urlPath);
  const fullTitle = urlPath === '/' ? `${brand.name} · ${brand.tagline}` : `${title} · ${brand.name}`;
  const cur = href => urlPath === href || (href !== '/' && urlPath.startsWith(href));
  const navItem = ([href, text]) => `<li><a href="${href}"${cur(href) ? ' aria-current="page"' : ''}>${text}</a></li>`;
  const ogImage = imgUrl(photos[image], 1200, [1200, 630]);
  const html = `<!doctype html>
<html lang="${site.language}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${site.url}${urlPath}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${site.url}${urlPath}">
<meta property="og:image" content="${esc(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="${palette.whitewash}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${urlPath === '/' ? `<script type="application/ld+json">${json(orgJsonLd)}</script>` : ''}
<link rel="preconnect" href="https://images.unsplash.com">
${heroPreload(body)}
${fonts.preload.map(f => `<link rel="preload" href="/assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('')}
<style>${fontFaceCss}</style>
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_ID}">
<script>document.documentElement.className='js'</script>
</head>
<body${hero ? ' class="has-hero"' : ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="site-header">
  <div class="container header-inner">
    <a class="wordmark" href="/" aria-label="${esc(brand.name)}, home">${esc(brand.name)}</a>
    <ul class="nav-group nav-left">${navLeft.map(navItem).join('')}</ul>
    <ul class="nav-group nav-right">${navRight.map(navItem).join('')}<li class="nav-cta"><a class="btn" href="/enquire/"${cur('/enquire/') ? ' aria-current="page"' : ''}><span>Plan a trip</span><span class="btn-icon">${arrow}</span></a></li></ul>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="bars" aria-hidden="true"></span><span class="menu-label">Menu</span></button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Main">
  <ol>${allNav.map(navItem).join('')}</ol>
  <p class="menu-contact"><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></p>
</nav>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>${label(0, 'The name')}<p class="lead">${esc(brand.meaning)}</p>${btn('/enquire/', 'Plan a trip', 'light')}</div>
      <div>${label(0, 'Regions')}<ul>${regions.map(r => `<li><a href="/regions/${r.slug}/">${esc(r.name)}</a></li>`).join('')}</ul></div>
      <div>${label(0, 'Plan')}<ul>${allNav.filter(([h]) => h !== '/regions/').map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div>${label(0, 'Contact')}<ul><li><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li><li>${contact.address.map(esc).join('<br>')}</li><li class="small" style="opacity:.8">${esc(contact.hours)}</li></ul></div>
    </div>
    <p class="footer-word" aria-hidden="true">${esc(brand.name)}</p>
    <div class="footer-meta">
      <p>© ${new Date().getFullYear()} ${esc(brand.name)}. Dates, times and opening hours are a guide only. Please check them before you travel.</p>
      <p>${LEGAL.map(l => `<a href="/${l.slug}/">${esc(l.title)}</a>`).join(' · ')}</p>
      <p><a href="#main">Back to top ↑</a></p>
    </div>
  </div>
</footer>
<script src="/assets/js/site.js?v=${BUILD_ID}" defer></script>
${scripts.map(s => s.startsWith('<') ? s : `<script src="/assets/js/${s}?v=${BUILD_ID}" defer></script>`).join('\n')}
</body>
</html>
`;
  const file = path.join(OUT, urlPath === '/404' ? '404.html' : path.join(urlPath, 'index.html'));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// Full-bleed photo header for inner pages.
const pageHero = ({ photo, kicker, title, dek }) => `
<section class="phero on-image">
  <div class="hero-media">${img(photo, { eager: true, sizes: '100vw' })}</div>
  <div class="container phero-inner">
    ${label(0, kicker)}
    <h1 class="display">${title}</h1>
    ${dek ? `<p class="phero-dek">${dek}</p>` : ''}
  </div>
</section>`;
const plainHead = ({ kicker, title, dek, extra = '' }) => `
<header class="plain-head"><div class="container">
  ${label(0, kicker)}
  <h1 class="display">${title}</h1>
  ${dek ? `<p class="phero-dek">${dek}</p>` : ''}
  ${extra}
</div></header>`;

const cta = (title = 'Pull up a chair.', text = 'Tell us how you like to travel, and we will suggest a slow route through the Spain you want to see. No obligation; we reply personally.', photo = 'about') => `
<section class="cta on-image">
  <div class="hero-media">${img(photo, { sizes: '100vw' })}</div>
  <div class="container cta-inner reveal">
    ${label(0, 'Plan with us')}
    <h2 class="display">${title}</h2>
    <p>${text}</p>
    <div class="btn-row">${btn('/enquire/', 'Start an enquiry', 'gold')}${btn('/rail-journeys/', 'Sketch a rail route', 'line')}</div>
  </div>
</section>`;

const regionCard = (r, i) => `
<article class="card reveal">
  <div class="card-head"><span>${pad2(i + 1)} / ${esc(r.local)}</span><span>${r.towns.length} towns</span></div>
  ${media(r.photo, 'ratio-45', '(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw', [4, 5])}
  <h3 class="h3"><a href="/regions/${r.slug}/">${esc(r.name)}</a></h3>
  <p>${esc(r.summary)}</p>
</article>`;

const journalCard = j => `
<article class="card reveal">
  <div class="card-head"><span>${esc(regionName(j.region))}</span><time datetime="${j.date}">${fmtDate(j.date)}</time></div>
  ${media(j.photo, 'ratio-43', '(min-width: 64rem) 30vw, (min-width: 40rem) 50vw, 100vw', [4, 3])}
  <h3 class="h3"><a href="/journal/${j.slug}/">${esc(j.title)}</a></h3>
  <p>${esc(j.dek)}</p>
</article>`;

const festItem = f => `
<li class="fest" data-region="${f.region}" data-months="${f.months.join(',')}">
  <div>
    <span class="tag">${esc(regionName(f.region))}</span>
    <h3>${esc(f.name)}</h3>
    <p class="meta"><strong>${esc(f.place)}</strong><br>${esc(f.when)}</p>
  </div>
  <div class="body">
    <p>${esc(f.expect)}</p>
    ${f.tip ? `<p class="tip"><strong>Tip:</strong> ${esc(f.tip)}</p>` : ''}
  </div>
</li>`;

// ───────── clean & assets ─────────
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/js'), { recursive: true });
const tokens = `:root {\n${Object.entries(palette).map(([k, v]) => `  --${kebab(k)}: ${v};`).join('\n')}\n  --font-display: ${fonts.display};\n  --font-text: ${fonts.text};\n  --font-mono: ${fonts.mono};\n}\n`;
fs.writeFileSync(path.join(OUT, 'assets/site.css'), tokens + fs.readFileSync('src/assets/css/site.css', 'utf8'));
fs.cpSync('src/assets/fonts', path.join(OUT, 'assets/fonts'), { recursive: true });
for (const f of fs.readdirSync('src/assets/js')) fs.copyFileSync(path.join('src/assets/js', f), path.join(OUT, 'assets/js', f));
fs.writeFileSync(path.join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${palette.terracotta}"/><text x="32" y="46" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="40" fill="${palette.whitewash}">${esc(brand.logoMark)}</text></svg>`);

const clockData = `<script type="application/json" id="clock-data">${json({ lanes: clock.lanes, days: clock.days, tips: clock.tips })}</script>`;
const festData = `<script type="application/json" id="fest-data">${json({ festivals: festivals.map(f => ({ ...f, regionName: regionName(f.region) })), monthNames })}</script>`;
const railData = `<script type="application/json" id="rail-data">${json({ cities, links })}</script>`;

// ───────── home ─────────
const monthHighlights = monthNames.map((m, i) => {
  const list = festivals.filter(f => f.months.includes(i + 1));
  return { m, i: i + 1, count: list.length, hl: list.find(f => f.months[0] === i + 1) || list[0] };
});
page('/', {
  hero: true,
  image: 'home',
  scripts: [clockData, festData, 'home.js'],
  body: `
<section class="hero on-image">
  <div class="hero-media">${img('home', { eager: true, sizes: '100vw' })}</div>
  <div class="container hero-inner">
    <div class="hero-top">
      <h1 class="hero-title">Travel Spain at the pace of a long lunch.</h1>
      <div>
        <p class="hero-dek">Food, small towns, rail journeys and festivals across nine regions, planned for curious adults who would rather stay three nights than three hours.</p>
        <div class="btn-row">${btn('/enquire/', 'Plan a trip', 'light')}${btn('/regions/', 'The regions', 'line')}</div>
      </div>
    </div>
    <p class="hero-wordmark" aria-hidden="true">${esc(brand.name)}</p>
    <nav class="hero-index" aria-label="Start here"><ul>
      <li><a href="/regions/"><span class="num">(01)</span><strong>Nine regions</strong><span class="d">From Galicia to the Canaries</span></a></li>
      <li><a href="/spanish-clock/"><span class="num">(02)</span><strong>The Spanish clock</strong><span class="d">When Spain eats, rests and goes out</span></a></li>
      <li><a href="/rail-journeys/"><span class="num">(03)</span><strong>Rail planner</strong><span class="d">Fast trains between, slow ones within</span></a></li>
      <li><a href="/festivals/"><span class="num">(04)</span><strong>Festivals</strong><span class="d">A year of fiestas, month by month</span></a></li>
    </ul></nav>
  </div>
</section>

<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'The idea')}</div>
    <div class="reveal">
      <p class="statement">Spain is best taken slowly. <em>Fewer bases, longer lunches,</em> <span class="soft">trains instead of motorways, dinner at ten and a village fiesta you didn't know existed.</span></p>
      <div class="grid g2" style="margin-top:clamp(2.5rem,5vw,4rem)">
        <p class="muted">${esc(brand.meaning)} Most trips to Spain are fast: Barcelona, Madrid, Seville, a few days each and a list of sights. We plan the other kind.</p>
        <div class="facts" style="grid-template-columns:1fr 1fr;border-top:0">
          <div style="padding-top:0"><p class="h2" style="font-size:3.5rem">9</p><p class="muted small">regions, each with its own food, language and pace</p></div>
          <div style="padding-top:0"><p class="h2" style="font-size:3.5rem">${festivals.length}</p><p class="muted small">festivals in our calendar, with what to expect</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section sand">
  <div class="container">
    <div class="row" style="margin-bottom:2.5rem">
      <div class="row-label">${label(2, 'Where')}</div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem"><h2 class="h2 reveal">Nine regions, <em>taken slowly</em></h2>${linkArrow('/regions/', 'All regions')}</div>
    </div>
    <ul class="index">
      ${regions.map((r, i) => `<li><a href="/regions/${r.slug}/"><span class="num">${pad2(i + 1)}</span><span class="name">${esc(r.name)}</span><span class="meta"><span class="local">${esc(r.local)}</span>${esc(r.summary)}</span><span class="thumb">${img(r.photo, { ratio: [4, 3], sizes: '9rem', widths: [200, 400] })}</span></a></li>`).join('')}
    </ul>
  </div>
</section>

<section class="section dark">
  <div class="container">
    <div class="row" style="margin-bottom:3rem">
      <div class="row-label">${label(3, 'Plan like a local')}</div>
      <h2 class="h2 reveal">Three tools for <em>travelling at Spanish speed</em></h2>
    </div>
    <div class="grid g3">
      <div class="panel reveal">
        <div class="clock-live"><span class="big" id="home-time">--:--</span><span class="mono" style="opacity:.75">in Spain now</span></div>
        <h3 class="h3" style="margin-top:1.25rem">The Spanish clock</h3>
        <p id="now-spain" aria-live="polite">When Spain eats, rests and goes out, hour by hour, so you stop arriving at empty restaurants at 7pm.</p>
        ${linkArrow('/spanish-clock/', 'Open the clock')}
      </div>
      <div class="panel reveal">
        <span class="num">${Object.keys(cities).length}<span class="mono" style="font-size:.75rem;margin-left:.75rem;opacity:.8">cities on the network</span></span>
        <h3 class="h3">Rail journey planner</h3>
        <p>Pick a few cities and get a route on high-speed and regional trains, with rough journey times and nights in each place.</p>
        ${linkArrow('/rail-journeys/', 'Plan a rail route')}
      </div>
      <div class="panel reveal">
        <span class="num">${festivals.length}<span class="mono" style="font-size:.75rem;margin-left:.75rem;opacity:.8">fiestas, 12 months</span></span>
        <h3 class="h3">Festivals calendar</h3>
        <p id="fest-now">Fiestas by month and region, with a short note on what to expect at each one.</p>
        ${linkArrow('/festivals/', 'See the calendar')}
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split split--wide">
    ${figure('food', 'ratio-43', '(min-width: 56rem) 55vw, 100vw', [4, 3])}
    <div class="reveal">
      ${label(4, 'At the table')}
      <h2 class="h2">Eat late, eat regionally, <em>and linger.</em></h2>
      <p class="lead muted" style="margin-top:1.5rem">Spanish food is regional first and national second. We plan around markets at eleven, lunch at two and the right bar for the right hour. And the sobremesa afterwards, when nobody is in a hurry to leave.</p>
      <div class="btn-row" style="margin-top:2rem">${btn('/food-and-wine/', 'Food and wine', 'solid')}</div>
    </div>
  </div>
</section>

<section class="section sand">
  <div class="container">
    <div class="row" style="margin-bottom:2.5rem">
      <div class="row-label">${label(5, 'When')}</div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem"><h2 class="h2 reveal">A year of <em>fiestas</em></h2>${linkArrow('/festivals/', 'Full calendar')}</div>
    </div>
    <div class="months reveal" id="home-months">
      ${monthHighlights.map(x => `<a href="/festivals/?month=${x.i}" data-month="${x.i}"><span class="mono">${pad2(x.i)} · ${x.count} festivals</span><span class="m">${x.m}</span><span class="hl">${x.hl ? `${esc(x.hl.name)}, ${esc(x.hl.place.split(',')[0])}` : ''}</span></a>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="row" style="margin-bottom:2.5rem">
      <div class="row-label">${label(6, 'Journal')}</div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem"><h2 class="h2 reveal">Notes from <em>the table</em></h2>${linkArrow('/journal/', 'All stories')}</div>
    </div>
    <div class="grid g3">${journal.slice(0, 3).map(journalCard).join('')}</div>
  </div>
</section>
${cta()}`,
});

// ───────── regions ─────────
page('/regions/', {
  hero: true,
  title: 'Regions',
  description: 'Nine regions of Spain for slow travel: Andalusia, the Basque Country, Galicia, Catalonia, Castile and León, Extremadura, Valencia, the Balearics and the Canaries.',
  image: 'castile',
  body: `
${pageHero({ photo: 'castile', kicker: 'Regions', title: 'Nine regions, <em>taken slowly</em>', dek: 'Spain is less a country to "do" than a set of regions with their own food, language, festivals and pace. Pick one or two and give them time.' })}
<section class="section">
  <div class="container">
    <ul class="index" style="margin-bottom:clamp(4rem,8vw,6rem)">
      ${regions.map((r, i) => `<li><a href="/regions/${r.slug}/"><span class="num">${pad2(i + 1)}</span><span class="name">${esc(r.name)}</span><span class="meta"><span class="local">${esc(r.local)}</span>${esc(r.summary)}</span><span class="thumb">${img(r.photo, { ratio: [4, 3], sizes: '9rem', widths: [200, 400] })}</span></a></li>`).join('')}
    </ul>
    <div class="grid g3" style="row-gap:3.5rem">${regions.map(regionCard).join('')}</div>
  </div>
</section>
${cta()}`,
});

regions.forEach((r, idx) => {
  const fests = festivals.filter(f => f.region === r.slug).sort((a, b) => a.months[0] - b.months[0]);
  const regionCities = Object.entries(cities).filter(([, c]) => c.region === r.slug).map(([k]) => k);
  const posts = journal.filter(j => j.region === r.slug);
  const stay = stays.find(s => s.region === r.slug);
  const next = regions[(idx + 1) % regions.length];
  let n = 0;
  page(`/regions/${r.slug}/`, {
    hero: true,
    title: r.name,
    description: r.summary,
    image: r.photo,
    body: `
${pageHero({ photo: r.photo, kicker: `${pad2(idx + 1)} / ${esc(r.local)} · ${esc(r.kicker)}`, title: esc(r.name), dek: esc(r.summary) })}
<section class="section">
  <div class="container row">
    <div class="row-label">${label(++n, 'Overview')}</div>
    <div class="reveal">
      <p class="statement statement--long">${esc(r.intro[0])}</p>
      <p class="lead muted" style="margin:2rem 0 3rem;max-width:44rem">${esc(r.intro[1])}</p>
      <div class="facts">
        <div>${label(0, 'When to go')}<p>${esc(r.season)}</p></div>
        <div>${label(0, 'By rail')}<p>${esc(r.rail)}</p>${regionCities.length ? `<p style="margin-top:1rem">${linkArrow(`/rail-journeys/?cities=${regionCities.slice(0, 4).join(',')}#planner`, 'Try it in the planner')}</p>` : ''}</div>
        <div>${label(0, "Where we'd stay")}<p>${stay ? `${esc(stay.kind)}. ${esc(stay.why)}` : 'Small, characterful places, chosen for a long stay.'}</p><p style="margin-top:1rem">${linkArrow('/stays/', 'Our kinds of stays')}</p></div>
      </div>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container row">
    <div class="row-label">${label(++n, 'Ways to slow down')}</div>
    <div>
      <h2 class="h2 reveal" style="margin-bottom:2rem">${esc(r.name)}, <em>slowly</em></h2>
      <ol class="numbered grid g2" style="gap:0 3rem">${r.slow.map(s => `<li class="reveal"><div><h3 class="h4">${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ol>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="row" style="margin-bottom:2rem"><div class="row-label">${label(++n, 'Small towns')}</div><h2 class="h2 reveal">Where to stay <em>a while</em></h2></div>
    <div class="towns">${r.towns.map((t, i) => `<div class="reveal"><span class="mono">${pad2(i + 1)}</span><h3 class="h3">${esc(t.name)}</h3><p>${esc(t.note)}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section olive">
  <div class="container row">
    <div class="row-label">${label(++n, 'At the table')}</div>
    <div class="split" style="align-items:start">
      <h2 class="h2 reveal">What to eat <em>and drink</em></h2>
      <div><ol class="numbered">${r.table.map(t => `<li><p style="color:inherit">${esc(t)}</p></li>`).join('')}</ol><p style="margin-top:1.5rem">${linkArrow('/food-and-wine/', 'More on food and wine')}</p></div>
    </div>
  </div>
</section>
${fests.length ? `<section class="section">
  <div class="container row">
    <div class="row-label">${label(++n, 'Fiestas')}</div>
    <div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:2rem"><h2 class="h2 reveal">Fiestas in ${esc(r.name)}</h2>${linkArrow(`/festivals/?region=${r.slug}`, 'Full calendar')}</div>
      <ul class="fest-list">${fests.map(festItem).join('')}</ul>
    </div>
  </div>
</section>` : ''}
${posts.length ? `<section class="section sand"><div class="container row"><div class="row-label">${label(++n, 'From the journal')}</div><div class="grid g2">${posts.map(journalCard).join('')}</div></div></section>` : ''}
<div class="container"><a class="next" href="/regions/${next.slug}/">${label(0, 'Next region')}<span class="display">${esc(next.name)} ${arrow}</span></a></div>
${cta(`See ${esc(r.name)} <em>slowly.</em>`, `Tell us when you can travel and what you love to eat, and we will suggest a route through ${esc(r.name)}.`)}`,
  });
});

// ───────── food & wine ─────────
page('/food-and-wine/', {
  hero: true,
  title: 'Food and wine',
  description: 'How to eat in Spain like a local: meal times, tapas etiquette, regional dishes and the wines to look for in each region.',
  image: 'food',
  body: `
${pageHero({ photo: 'food', kicker: 'Food and wine', title: 'Eat late, eat regionally, <em>linger</em>', dek: 'Spanish food is regional first and national second. The best meals are often the plainest: what grows nearby, cooked the way it always has been.' })}
<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'How Spain eats')}</div>
    <div>
      <p class="statement reveal" style="margin-bottom:3rem">Lunch is the main event. <em>Dinner is late and light.</em> <span class="soft">Everything else is a snack, a drink or a conversation.</span></p>
      <ol class="numbered grid g2" style="gap:0 3rem">${food.rules.map(r => `<li class="reveal"><div><h3 class="h4">${esc(r.title)}</h3><p>${esc(r.text)}</p></div></li>`).join('')}</ol>
      <div class="btn-row" style="margin-top:2.5rem">${btn('/spanish-clock/', 'See the Spanish clock')}</div>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container">
    <div class="row" style="margin-bottom:2rem"><div class="row-label">${label(2, 'Region by region')}</div><h2 class="h2 reveal">One dish to <em>travel for</em></h2></div>
    <ul class="index">${food.dishes.map((d, i) => `<li><a href="/regions/${d.region}/"><span class="num">${pad2(i + 1)}</span><span class="name">${esc(d.name)}</span><span class="meta"><span class="local">${esc(regionName(d.region))}</span>${esc(d.text)}</span><span class="thumb">${img(regionBySlug[d.region].photo, { ratio: [4, 3], sizes: '9rem', widths: [200, 400] })}</span></a></li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="container split">
    ${figure('wine', 'ratio-45', '(min-width: 56rem) 45vw, 100vw', [4, 5])}
    <div>
      ${label(3, 'In the glass')}
      <h2 class="h2 reveal" style="margin-bottom:2rem">Wines <em>to look for</em></h2>
      <ol class="numbered">${food.wines.map(w => `<li><div><h3 class="h4">${esc(w.name)} <span class="mono muted">· ${esc(regionName(w.region))}</span></h3><p>${esc(w.text)}</p></div></li>`).join('')}</ol>
      <p style="margin-top:1.5rem">${linkArrow('/journal/three-glasses-of-sherry/', 'Read: Three glasses of sherry')}</p>
    </div>
  </div>
</section>
<section class="section dark">
  <div class="container split split--wide">
    <div class="reveal">
      ${label(4, 'Markets and bars')}
      <p class="quote">"A bar with napkins on the floor and people three deep at the counter is usually a good sign."</p>
      <p class="muted" style="margin-top:2rem;max-width:34rem">The best introduction to any Spanish town is its municipal market in the morning, followed by the bars around it at midday. Stallholders will tell you what's in season, and nearby bars often cook what the market sells.</p>
    </div>
    ${figure('pintxobar', 'ratio-45', '(min-width: 56rem) 40vw, 100vw', [4, 5])}
  </div>
</section>
${cta('Plan a trip <em>around lunch.</em>', 'Markets, bodegas, cider houses and long lunches. Tell us what you love to eat.', 'valencia')}`,
});

// ───────── rail ─────────
page('/rail-journeys/', {
  hero: true,
  title: 'Rail journeys',
  description: 'Plan a slow rail journey through Spain: pick a few cities and get a suggested route on high-speed and regional trains, with rough journey times and nights in each place.',
  image: 'rail',
  scripts: [railData, 'rail.js'],
  body: `
${pageHero({ photo: 'rail', kicker: 'Rail journeys', title: 'Spain by train, <em>at a sensible pace</em>', dek: 'Spain has one of the largest high-speed rail networks in the world, and some slow, beautiful regional lines. Use both.' })}
<section class="section" id="planner">
  <div class="container">
    <div class="row" style="margin-bottom:2.5rem">
      <div class="row-label">${label(1, 'Journey planner')}</div>
      <div><h2 class="h2 reveal">Pick your <em>cities</em></h2><p class="lead muted" style="margin-top:1.25rem;max-width:42rem">Choose two to seven places. The first city you tick is where you start. We'll find the most efficient order, show where you change trains and suggest how many nights to spend in each place. Times are rough guides; check the current timetable before you book.</p></div>
    </div>
    <div class="planner">
      <form id="planner-form" aria-labelledby="pick-heading">
        <h3 id="pick-heading" class="visually-hidden">Cities</h3>
        ${[...new Set(Object.values(cities).map(c => c.region))].map(reg => `
        <fieldset class="region-group field"><legend>${reg ? esc(regionName(reg)) : 'Madrid and elsewhere'}</legend>
          <div class="chips">${Object.entries(cities).filter(([, c]) => c.region === reg).map(([k, c]) => `<label><input type="checkbox" name="city" value="${k}">${esc(c.name)}</label>`).join('')}</div>
        </fieldset>`).join('')}
        <button type="button" class="btn btn--line btn--plain" id="planner-clear">Clear all</button>
        <noscript><p class="notice" style="margin-top:1rem">The planner needs JavaScript. The ready-made journeys below work without it.</p></noscript>
      </form>
      <div aria-live="polite">
        <svg class="rail-map" id="rail-map" viewBox="40 0 520 420" role="img" aria-labelledby="map-title"><title id="map-title">Schematic map of the rail network in mainland Spain, with your route highlighted</title></svg>
        <div class="legend"><span class="l-hs">High-speed</span><span class="l-reg">Regional</span><span class="l-on">Your route</span></div>
        <div id="route-out" style="margin-top:1.5rem"><p class="muted">Tick two or more cities to see a route.</p></div>
      </div>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container">
    <div class="row" style="margin-bottom:2rem"><div class="row-label">${label(2, 'Ready-made routes')}</div><h2 class="h2 reveal">Four journeys <em>we love</em></h2></div>
    <div class="grid g2" style="gap:0 3rem">${journeys.map((j, i) => `<div class="panel reveal" style="padding-bottom:2rem"><span class="mono muted">${pad2(i + 1)} · ${j.stops.length} stops</span><h3 class="h3" style="margin:1rem 0 .5rem">${esc(j.title)}</h3><p class="mono" style="color:var(--terracotta-deep)">${j.stops.map(s => esc(cities[s].name)).join(' → ')}</p><p>${esc(j.text)}</p>${linkArrow(`/rail-journeys/?cities=${j.stops.join(',')}#planner`, 'Load into the planner')}</div>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="container split">
    ${figure('ave', 'ratio-45', '(min-width: 56rem) 45vw, 100vw', [4, 5])}
    <div>
      ${label(3, 'Practicalities')}
      <h2 class="h2 reveal" style="margin-bottom:2rem">Booking <em>and riding</em></h2>
      <ol class="numbered">
        <li><div><h3 class="h4">Operators</h3><p>Renfe runs most services, including AVE, Avlo, Alvia, Media Distancia and local trains. On the busiest high-speed routes, Iryo and Ouigo also compete, often at lower prices.</p></div></li>
        <li><div><h3 class="h4">Book ahead for fast trains</h3><p>Long-distance and high-speed trains need a reserved seat, and prices usually rise as the date approaches. Regional trains are cheaper and more flexible.</p></div></li>
        <li><div><h3 class="h4">Allow time at the station</h3><p>High-speed services often have a bag scan before boarding, and the gates can close a few minutes before departure.</p></div></li>
        <li><div><h3 class="h4">Slow lines worth the time</h3><p>The historic wooden train from Palma to Sóller in Mallorca; the single-track line from Ronda through the cork-oak hills; and Euskotren's narrow-gauge line through the Basque valleys.</p></div></li>
      </ol>
    </div>
  </div>
</section>
${cta('Let us do <em>the timetables.</em>', 'Send us your rough route and we will put the tickets, the bases and the long lunches together.', 'ave')}`,
});

// ───────── festivals ─────────
page('/festivals/', {
  hero: true,
  title: 'Festivals calendar',
  description: 'A calendar of Spanish festivals by month and region, from the Fallas and Feria de Abril to Galician octopus fairs, with what to expect at each one.',
  image: 'festivals',
  scripts: [festData, 'festivals.js'],
  body: `
${pageHero({ photo: 'festivals', kicker: 'Festivals', title: 'A year <em>of fiestas</em>', dek: 'Almost every town in Spain has at least one fiesta a year. These are the ones worth planning a trip around, by month and region.' })}
<div class="fest-bar">
  <div class="container">
    <div class="month-strip" role="group" aria-label="Filter by month" id="month-strip" hidden>
      <button type="button" data-month="" aria-pressed="true">All months</button>
      ${monthNames.map((m, i) => `<button type="button" data-month="${i + 1}" aria-pressed="false">${m.slice(0, 3)}<span class="visually-hidden">${m.slice(3)}</span></button>`).join('')}
    </div>
    <div class="field" style="margin:0"><label for="fest-region" class="visually-hidden">Region</label>
      <select id="fest-region"><option value="">All regions</option><option value="nationwide">Nationwide</option>${regions.map(r => `<option value="${r.slug}">${esc(r.name)}</option>`).join('')}</select>
    </div>
    <p class="mono muted" id="fest-count" aria-live="polite" style="margin:0"></p>
  </div>
</div>
<section class="section--tight">
  <div class="container">
    <p class="notice" role="note"><strong>Dates move.</strong> Many fiestas follow Easter or fall on the nearest weekend, and some change from year to year. Check the official dates for your year before you book.</p>
    <div id="fest-results">
      ${monthNames.map((m, i) => `<section class="fest-month" data-month="${i + 1}"><h2 id="m-${i + 1}">${m}</h2><ul class="fest-list">${festivals.filter(f => f.months.includes(i + 1)).map(festItem).join('')}</ul></section>`).join('')}
    </div>
    <p id="fest-empty" class="lead" hidden style="padding-block:3rem">No festivals match. Try another month or region.</p>
  </div>
</section>
${cta('Build a trip <em>around a fiesta.</em>', 'Or avoid one. We can help with timing, rooms and where to stand.', 'festivals')}`,
});

// ───────── when to go ─────────
page('/when-to-go/', {
  hero: true,
  title: 'When to go',
  description: 'When to visit Spain, month by month and region by region: weather, crowds, festivals and seasonal food.',
  image: 'whentogo',
  body: `
${pageHero({ photo: 'whentogo', kicker: 'When to go', title: 'Every month is good <em>somewhere</em>', dek: 'The south bakes in August while Galicia is at its best. In January the Canaries are warm and the plateau is frozen.' })}
<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'At a glance')}</div>
    <div>
      <h2 class="h2 reveal">Region <em>by month</em></h2>
      <p class="lead muted" style="margin:1.25rem 0 1.5rem;max-width:42rem">Our own view of each region's best months for slow travel, weighing heat, rain, crowds and what's in season.</p>
      <p class="key" style="margin-bottom:1.5rem"><span><span class="s3">3</span>best</span><span><span class="s2">2</span>good</span><span><span class="s1">1</span>possible, with caveats</span></p>
      <div class="table-wrap">
        <table class="season">
          <caption class="visually-hidden">Best months to visit each region, rated 1 to 3</caption>
          <thead><tr><th scope="col">Region</th>${monthNames.map(m => `<th scope="col"><abbr title="${m}">${m.slice(0, 3)}</abbr></th>`).join('')}</tr></thead>
          <tbody>${regions.map(r => `<tr><th scope="row"><a href="/regions/${r.slug}/">${esc(r.name)}</a></th>${seasonGrid[r.slug].map((v, i) => `<td><span class="s${v}" aria-label="${monthNames[i]}: ${['', 'possible', 'good', 'best'][v]}">${v}</span></td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container row">
    <div class="row-label">${label(2, 'Month by month')}</div>
    <div>
      <h2 class="h2 reveal" style="margin-bottom:2rem">What each month <em>is good for</em></h2>
      <table class="month-table">
        <thead><tr><th scope="col">Month</th><th scope="col">Good for</th><th scope="col">Watch out for</th></tr></thead>
        <tbody>${months.map((m, i) => `<tr><th scope="row"><a href="/festivals/?month=${i + 1}">${m.m}</a></th><td data-label="Good for">${esc(m.good)}</td><td data-label="Watch out for" class="muted">${esc(m.watch)}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section">
  <div class="container row">
    <div class="row-label">${label(3, 'Good to know')}</div>
    <div class="grid g3">
      <div class="panel reveal"><h3 class="h3">Public holidays</h3><p>National, regional and local holidays close shops and fill trains. Holy Week, early August and the "puentes" (long weekends) are the busiest times.</p></div>
      <div class="panel reveal"><h3 class="h3">The August question</h3><p>Much of Spain is on holiday in August. Cities are quieter and some restaurants close, while coasts and villages are full. Head north or into the mountains.</p></div>
      <div class="panel reveal"><h3 class="h3">Long evenings</h3><p>Spain uses Central European Time, so summer evenings are very long and winter mornings are dark until late. See the <a href="/spanish-clock/">Spanish clock</a>.</p></div>
    </div>
  </div>
</section>
${cta()}`,
});

// ───────── Spanish clock ─────────
page('/spanish-clock/', {
  hero: true,
  title: 'The Spanish clock',
  description: 'An interactive day in Spain: when people eat, rest, shop and go out, so you never again arrive at an empty restaurant at 7pm.',
  image: 'clock',
  scripts: [clockData, 'clock.js'],
  body: `
${pageHero({ photo: 'clock', kicker: 'The Spanish clock', title: 'What time <em>does Spain eat?</em>', dek: 'Lunch at two, dinner at ten, and the paseo in between. Move through a Spanish day to see what is open, what locals are doing and where you should be.' })}
<section class="section dark">
  <div class="container">
    <div class="clock" id="clock">
      <noscript><p class="notice" style="color:var(--ink)">The interactive clock needs JavaScript. The full day is written out below.</p></noscript>
    </div>
  </div>
</section>
<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'Why so late?')}</div>
    <div class="split" style="align-items:start">
      <div class="reveal">
        <h2 class="h2" style="margin-bottom:1.5rem">A day built <em>around lunch</em></h2>
        <p class="lead">Spain's day is organised around a long lunch rather than a big dinner. The country also uses Central European Time, although geographically it sits closer to London, so the sun rises and sets late by the clock.</p>
        <p class="muted">Catalonia and the north generally eat a little earlier than Madrid and Andalusia. Big cities run later than villages. Summer pushes everything later, especially inland in the south, where the afternoon heat empties the streets.</p>
        ${label(0, 'Five habits to adopt')}
        <ol class="numbered">
          <li><p>Make lunch your main meal, and try the menú del día on weekdays.</p></li>
          <li><p>Have a merienda around six so you are not starving at eight.</p></li>
          <li><p>Join the paseo. It's the best free show in town.</p></li>
          <li><p>Book dinner for 21:30 or later in the south and in Madrid.</p></li>
          <li><p>On Sundays, book lunch and expect quieter evenings.</p></li>
        </ol>
      </div>
      ${figure('clock', 'ratio-45', '(min-width: 56rem) 35vw, 100vw', [4, 5])}
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container row">
    <div class="row-label">${label(2, 'Written out')}</div>
    <div class="grid g3">${Object.values(clock.days).map(d => `<div><h3 class="h3" style="margin-bottom:1rem">${esc(d.label)}</h3><ol class="numbered" style="counter-reset:none">${[...d.blocks].sort((a, b) => a.from.localeCompare(b.from)).map(b => `<li style="grid-template-columns:1fr;gap:.25rem"><span class="mono" style="color:var(--terracotta-deep)">${clockTime(b.from)}–${clockTime(b.to)}</span><div><h4 class="h4">${esc(b.title)}</h4><p>${esc(b.text)}</p></div></li>`).join('')}</ol></div>`).join('')}</div>
  </div>
</section>
${cta()}`,
});

// ───────── stays ─────────
page('/stays/', {
  hero: true,
  title: 'Stays',
  description: 'The kinds of small, characterful places we choose to stay in across Spain.',
  image: 'stays',
  body: `
${pageHero({ photo: 'stays', kicker: 'Stays', title: 'Small places, <em>long stays</em>', dek: 'We choose bases, not stopovers: small hotels, village houses and country estates where staying three nights feels natural.' })}
<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'The kinds of places')}</div>
    <div>
      <p class="notice" role="note" style="margin-bottom:2.5rem"><strong>Placeholders.</strong> The names below are placeholders that show the kind of place we choose in each region. They are not real properties. We'll add real partners once they are confirmed.</p>
      <ul class="index">${stays.map((s, i) => `<li><a href="/regions/${s.region}/"><span class="num">${pad2(i + 1)}</span><span class="name">${esc(s.name)}</span><span class="meta"><span class="local">${esc(regionName(s.region))} · placeholder</span><strong style="font-weight:500;color:var(--ink)">${esc(s.kind)}.</strong> ${esc(s.why)}</span><span class="thumb">${img(regionBySlug[s.region].photo, { ratio: [4, 3], sizes: '9rem', widths: [200, 400] })}</span></a></li>`).join('')}</ul>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container row">
    <div class="row-label">${label(2, 'What we look for')}</div>
    <div class="split" style="align-items:start">
      <h2 class="h2 reveal">Our rules for <em>a good stay</em></h2>
      <ol class="numbered">
        <li><p>Small enough that the owners know your name.</p></li>
        <li><p>Walking distance to a bar, a bakery or a market, or so far out that it doesn't matter.</p></li>
        <li><p>Breakfast made with local produce.</p></li>
        <li><p>A reason to stay at least two nights: a view, a garden, a good kitchen, a walk from the door.</p></li>
        <li><p>Rooms that are quiet at midnight, which in Spain matters.</p></li>
      </ol>
    </div>
  </div>
</section>
${cta()}`,
});

// ───────── about ─────────
page('/about/', {
  hero: true,
  title: 'About',
  description: `About ${brand.name}: how we plan slow, regional trips in Spain.`,
  image: 'about',
  body: `
${pageHero({ photo: 'about', kicker: 'About', title: `About <em>${esc(brand.name)}</em>`, dek: esc(brand.meaning) })}
<section class="section">
  <div class="container row">
    <div class="row-label">${label(1, 'What we believe')}</div>
    <div class="reveal">
      <p class="statement">The best of Spain is regional, seasonal and slow. <em>It's a market at eleven, a two-hour lunch,</em> <span class="soft">a slow train through olive country and a village fiesta that wasn't in any guidebook.</span></p>
      <p class="lead muted" style="margin-top:2.5rem;max-width:44rem">We plan journeys for curious adults who want to travel the way Spaniards do: fewer places, longer stays, local hours and local food. We don't run group tours, and we don't sell the same trip to everyone.</p>
    </div>
  </div>
</section>
<section class="section sand">
  <div class="container row">
    <div class="row-label">${label(2, 'How we plan')}</div>
    <div class="grid g4">
      ${[['We talk first', 'Tell us when you can travel, what you like to eat and how you like to move.'], ['We suggest a route', 'Usually two to four bases, connected by train where we can.'], ['We refine it together', 'Until it fits your pace, not ours.'], ['We book and brief you', 'With notes on meal times, markets, festivals and the bars we would go to.']].map(([t, d], i) => `<div class="panel reveal"><span class="num">${pad2(i + 1)}</span><h3 class="h4">${t}</h3><p>${d}</p></div>`).join('')}
    </div>
  </div>
</section>
<section class="section">
  <div class="container row">
    <div class="row-label">${label(3, 'Honesty')}</div>
    <div class="split" style="align-items:start">
      <h2 class="h2 reveal">What you <em>won't</em> find here</h2>
      <ol class="numbered">
        <li><p>Invented reviews or testimonials.</p></li>
        <li><p>Press logos or awards we haven't won.</p></li>
        <li><p>Photos of one place passed off as another. Every photo on this site is tagged on Unsplash with the place we describe.</p></li>
      </ol>
    </div>
  </div>
</section>
<section class="section dark">
  <div class="container row">
    <div class="row-label">${label(4, 'Contact')}</div>
    <div class="facts">
      <div>${label(0, 'Email')}<p class="h3"><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></p></div>
      <div>${label(0, 'Hours')}<p>${esc(contact.hours)}<br><span class="muted">${contact.address.map(esc).join(', ')}</span></p></div>
    </div>
  </div>
</section>
${cta()}`,
});

// ───────── journal ─────────
page('/journal/', {
  hero: true,
  title: 'Journal',
  description: 'Stories and practical guides for slow travel in Spain: food, wine, rail and the regions.',
  image: 'cordoba',
  body: `
${pageHero({ photo: 'cordoba', kicker: 'Journal', title: 'Notes <em>from the table</em>', dek: 'Short, practical stories about eating, drinking and moving slowly through Spain.' })}
<section class="section"><div class="container"><div class="grid g2" style="row-gap:4rem">${journal.map(journalCard).join('')}</div></div></section>
${cta()}`,
});
for (const j of journal) {
  page(`/journal/${j.slug}/`, {
    hero: true,
    title: j.title,
    description: j.dek,
    image: j.photo,
    body: `
<article>
${pageHero({ photo: j.photo, kicker: `Journal · ${esc(regionName(j.region))} · ${fmtDate(j.date)}`, title: esc(j.title), dek: esc(j.dek) })}
<div class="section"><div class="container row">
  <div class="row-label"><p class="label">By the ${esc(brand.name)} team</p><p>${linkArrow(`/regions/${j.region}/`, `${esc(regionName(j.region))} guide`)}</p></div>
  <div class="prose">${j.body}</div>
</div></div>
</article>
<section class="section sand"><div class="container"><div class="row" style="margin-bottom:2rem"><div class="row-label">${label(0, 'Keep reading')}</div><h2 class="h2">More from <em>the journal</em></h2></div><div class="grid g3">${journal.filter(o => o !== j).slice(0, 3).map(journalCard).join('')}</div></div></section>
${cta()}`,
  });
}

// ───────── enquiry ─────────
const chip = (name, v) => `<label><input type="checkbox" name="${name}" value="${esc(v)}">${esc(v)}</label>`;
page('/enquire/', {
  title: 'Plan a trip',
  description: `Tell ${brand.name} about the trip you have in mind and we will suggest a slow route through Spain.`,
  image: 'home',
  scripts: [`<script type="application/json" id="form-config">${json({ endpoint: contact.formEndpoint, email: contact.email, brand: brand.name })}</script>`, 'enquiry.js'],
  body: `
${plainHead({ kicker: 'Plan a trip', title: 'Tell us about <em>your trip</em>', dek: 'A few details help us suggest a route that fits you. There is no obligation, and we reply personally.' })}
<section class="section">
  <div class="container row">
    <div class="row-label">
      <div class="aside">${label(0, 'Prefer to write?')}<p><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a><br><span class="small muted">${esc(contact.hours)}</span></p></div>
      <div class="aside">${label(0, 'Before you write')}<p class="small">Sketch a route in the <a href="/rail-journeys/">rail planner</a> and check the <a href="/festivals/">festivals calendar</a> for your dates.</p></div>
    </div>
    <form id="enquiry" class="form" method="post" action="${contact.formEndpoint ? esc(contact.formEndpoint) : `mailto:${esc(contact.email)}`}"${contact.formEndpoint ? '' : ' enctype="text/plain"'} novalidate style="max-width:46rem">
      <div id="form-status" role="status" aria-live="polite"></div>
      <div class="grid g2" style="gap:1.5rem 2rem">
        <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="f-phone">Phone (optional)</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        <div class="field"><label for="f-people">Who's travelling?</label><select id="f-people" name="people"><option value="">Choose…</option><option>Just me</option><option>Two of us</option><option>A family</option><option>A group of friends</option></select></div>
        <div class="field"><label for="f-when">Roughly when?</label><input id="f-when" name="when" type="month"></div>
        <div class="field"><label for="f-nights">How many nights?</label><input id="f-nights" name="nights" type="number" min="2" max="60" inputmode="numeric"></div>
      </div>
      <fieldset class="field"><legend>Regions you're curious about</legend><div class="chips">${regions.map(r => chip('regions', r.name)).join('')}${chip('regions', 'Not sure yet')}</div></fieldset>
      <fieldset class="field"><legend>What matters most?</legend><div class="chips">${['Food and markets', 'Wine and bodegas', 'Small towns', 'Rail journeys', 'Festivals', 'Walking', 'Art and history', 'Coast and islands'].map(i => chip('interests', i)).join('')}</div></fieldset>
      <div class="field"><label for="f-pace">Pace</label><select id="f-pace" name="pace"><option value="">Choose…</option><option>Very slow: two or three bases</option><option>Slow: four or five bases</option><option>A bit more ground covered</option></select></div>
      <div class="field"><label for="f-message">Anything else?</label><p class="hint" id="f-message-hint">Places you've loved, things you don't enjoy, dietary needs, mobility, budget.</p><textarea id="f-message" name="message" aria-describedby="f-message-hint"></textarea></div>
      <div><button class="btn btn--solid" type="submit"><span>Send enquiry</span><span class="btn-icon">${arrow}</span></button><p class="small muted" style="margin-top:1rem">We use your details only to reply to your enquiry.</p></div>
    </form>
  </div>
</section>`,
});
page('/enquire/thanks/', {
  title: 'Thank you',
  body: `${plainHead({ kicker: 'Thank you', title: 'Your enquiry <em>is on its way</em>', dek: 'We will reply personally, usually within two working days (Spanish ones, so allow for a long lunch).', extra: `<div class="btn-row" style="margin-top:2rem">${btn('/journal/', 'Read the journal')}${btn('/', 'Back to home', 'line')}</div>` })}<div class="section"></div>`,
});

// ───────── legal pages (src/data/legal.mjs), 404 ─────────
for (const l of LEGAL) {
  page(`/${l.slug}/`, {
    title: l.title,
    description: l.lede,
    body: `
${plainHead({ kicker: 'Legal', title: esc(l.title), dek: `${esc(l.lede)}<br><span class="small muted">Last updated <time datetime="${l.updated}">${fmtDate(l.updated)}</time>.</span>` })}
<section class="section"><div class="container"><div class="prose legal" style="max-width:46rem">
${l.sections.map(x => `<h2 class="h4" style="margin:2.5rem 0 .75rem">${esc(x.h)}</h2>${x.p.map(t => (t.includes('<ul>') ? `<div style="margin:0 0 1em">${t}</div>` : `<p>${t}</p>`)).join('')}`).join('\n')}
</div></div></section>`,
  });
}
page('/404', {
  title: 'Page not found',
  body: `${plainHead({ kicker: '404', title: 'Closed <em>for the siesta</em>', dek: "We couldn't find that page. Try the regions, or start an enquiry.", extra: `<div class="btn-row" style="margin-top:2rem">${btn('/regions/', 'Explore the regions')}${btn('/', 'Home', 'line')}</div>` })}<div class="section"></div>`,
});

// ───────── sitemap, robots ─────────
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => p !== '/404' && p !== '/enquire/thanks/').map(p => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages into ./${OUT}`);
