// Static site generator. No dependencies: `node build.mjs` writes ./dist.
import fs from 'node:fs';
import path from 'node:path';
import { regions } from './src/data/regions.mjs';
import { festivals, monthNames } from './src/data/festivals.mjs';
import { cities, links, journeys } from './src/data/rail.mjs';
import * as clock from './src/data/clock.mjs';
import { food, months, seasonGrid, stays, journal } from './src/data/content.mjs';

const config = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
const photos = JSON.parse(fs.readFileSync('src/data/photos.json', 'utf8'));
const { brand, contact, site, palette } = config;
const OUT = 'dist';

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kebab = s => s.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
const regionBySlug = Object.fromEntries(regions.map(r => [r.slug, r]));
const regionName = slug => slug === 'nationwide' ? 'Nationwide' : regionBySlug[slug]?.name ?? slug;
const utm = `utm_source=${encodeURIComponent(site.unsplashUtmSource)}&utm_medium=referral`;
const json = data => JSON.stringify(data).replace(/</g, '\\u003c');
const clockTime = t => { const [h, m] = t.split(':').map(Number); return `${String(h % 24).padStart(2, '0')}:${String(m).padStart(2, '0')}`; };
const fmtDate = iso => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const imgUrl = (p, w, ratio) => `${p.src}&w=${w}${ratio ? `&h=${Math.round(w * ratio[1] / ratio[0])}&fit=crop` : ''}&auto=format&q=68`;
function img(key, { ratio = [3, 2], sizes = '100vw', eager = false, cls = '' } = {}) {
  const p = photos[key];
  if (!p) throw new Error(`Unknown photo: ${key}`);
  const widths = [480, 800, 1200, 1600, 2000];
  const srcset = widths.map(w => `${esc(imgUrl(p, w, ratio))} ${w}w`).join(', ');
  return `<img src="${esc(imgUrl(p, 1200, ratio))}" srcset="${srcset}" sizes="${sizes}" width="1200" height="${Math.round(1200 * ratio[1] / ratio[0])}" alt="${esc(p.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${cls ? ` class="${cls}"` : ''} style="background:${p.color}">`;
}
function credit(key, { place = true } = {}) {
  const p = photos[key];
  return `<span class="credit">${place ? `${esc(p.place)}. ` : ''}Photo: <a href="${esc(p.authorUrl)}?${utm}">${esc(p.author)}</a> on <a href="https://unsplash.com/?${utm}">Unsplash</a></span>`;
}
function figure(key, opts = {}) {
  return `<figure class="feature-img">${img(key, { ratio: [16, 8], sizes: '(min-width: 74rem) 72rem, 100vw', ...opts })}<figcaption>${credit(key)}</figcaption></figure>`;
}

const nav = [
  ['/regions/', 'Regions'],
  ['/food-and-wine/', 'Food & wine'],
  ['/rail-journeys/', 'Rail'],
  ['/festivals/', 'Festivals'],
  ['/when-to-go/', 'When to go'],
  ['/spanish-clock/', 'Spanish clock'],
  ['/stays/', 'Stays'],
  ['/journal/', 'Journal'],
  ['/about/', 'About'],
];

const pages = [];
function page(urlPath, { title, description = brand.description, body, scripts = [], image = 'home', bodyClass = '' }) {
  pages.push(urlPath);
  const fullTitle = urlPath === '/' ? `${brand.name}: ${brand.tagline}` : `${title} | ${brand.name}`;
  const isCurrent = href => urlPath === href || (href !== '/' && urlPath.startsWith(href));
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
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_ID}">
<script>document.documentElement.classList.remove('no-js')</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="${esc(brand.name)}, home"><span class="brand-mark" aria-hidden="true">${esc(brand.logoMark)}</span>${esc(brand.name)}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav class="site-nav" id="site-nav" aria-label="Main">
      <ul>
        ${nav.map(([href, label]) => `<li><a href="${href}"${isCurrent(href) ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n        ')}
        <li class="nav-cta"><a href="/enquire/"${isCurrent('/enquire/') ? ' aria-current="page"' : ''}>Plan a trip</a></li>
      </ul>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="grid">
      <div>
        <p class="brand" style="color:inherit"><span class="brand-mark" aria-hidden="true">${esc(brand.logoMark)}</span>${esc(brand.name)}</p>
        <p>${esc(brand.meaning)}</p>
      </div>
      <div>
        <h2>Explore</h2>
        <ul class="list-plain">
          ${regions.map(r => `<li><a href="/regions/${r.slug}/">${esc(r.name)}</a></li>`).join('')}
        </ul>
      </div>
      <div>
        <h2>Plan</h2>
        <ul class="list-plain">
          ${nav.filter(([h]) => h !== '/regions/').map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}
          <li><a href="/enquire/">Plan a trip</a></li>
        </ul>
      </div>
      <div>
        <h2>Contact</h2>
        <ul class="list-plain">
          <li><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>
          <li><a href="tel:${esc(contact.phoneHref)}">${esc(contact.phone)}</a></li>
          <li>${esc(contact.address)}</li>
          <li>${esc(contact.hours)}</li>
        </ul>
      </div>
    </div>
    <div class="footer-meta">
      <p>© ${new Date().getFullYear()} ${esc(brand.name)}. Photographs from <a href="https://unsplash.com/?${utm}">Unsplash</a>, credited on each page and on our <a href="/credits/">photo credits</a> page. Times, dates and prices on this site are a guide only. Always check before you travel.</p>
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

const pageHead = ({ kicker, title, dek, extra = '' }) => `
<div class="page-head"><div class="wrap">
  ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
  <h1>${title}</h1>
  ${dek ? `<p class="dek">${dek}</p>` : ''}
  ${extra}
</div></div>`;

const ctaBand = (text = 'Tell us how you like to travel, and we will suggest a slow route through the Spain you want to see.') => `
<section class="section section--olive">
  <div class="wrap split">
    <div>
      <p class="kicker">Plan with us</p>
      <h2>Travel at the pace of a long lunch</h2>
      <p>${text}</p>
    </div>
    <div class="btn-row"><a class="btn btn--gold" href="/enquire/">Start an enquiry</a><a class="btn btn--ghost" href="/rail-journeys/">Try the rail planner</a></div>
  </div>
</section>`;

const regionCard = r => `
<article class="card">
  ${img(r.photo, { ratio: [4, 3], sizes: '(min-width: 60rem) 23rem, (min-width: 40rem) 50vw, 100vw' })}
  <div class="card-body">
    <p class="kicker">${esc(r.local)}</p>
    <h3><a href="/regions/${r.slug}/">${esc(r.name)}</a></h3>
    <p>${esc(r.summary)}</p>
  </div>
  ${credit(r.photo)}
</article>`;

const journalCard = j => `
<article class="card">
  ${img(j.photo, { ratio: [4, 3], sizes: '(min-width: 60rem) 23rem, (min-width: 40rem) 50vw, 100vw' })}
  <div class="card-body">
    <p class="kicker">${esc(regionName(j.region))} · <time datetime="${j.date}">${fmtDate(j.date)}</time></p>
    <h3><a href="/journal/${j.slug}/">${esc(j.title)}</a></h3>
    <p>${esc(j.dek)}</p>
  </div>
  ${credit(j.photo)}
</article>`;

const festItem = f => `
<li class="fest" data-region="${f.region}" data-months="${f.months.join(',')}">
  <span class="pill${f.region === 'nationwide' ? ' pill--blue' : ''}">${esc(regionName(f.region))}</span>
  <h3>${esc(f.name)}</h3>
  <p class="meta"><strong>${esc(f.place)}</strong> · ${esc(f.when)}</p>
  <p>${esc(f.expect)}</p>
  ${f.tip ? `<p class="tip"><strong>Tip:</strong> ${esc(f.tip)}</p>` : ''}
</li>`;

const BUILD_ID = Date.now().toString(36);

// ---------- clean & assets ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets/js'), { recursive: true });
const tokens = `:root {\n${Object.entries(palette).map(([k, v]) => `  --${kebab(k)}: ${v};`).join('\n')}\n}\n`;
fs.writeFileSync(path.join(OUT, 'assets/site.css'), tokens + fs.readFileSync('src/assets/css/site.css', 'utf8'));
for (const f of fs.readdirSync('src/assets/js')) fs.copyFileSync(path.join('src/assets/js', f), path.join(OUT, 'assets/js', f));
fs.writeFileSync(path.join(OUT, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="${palette.terracotta}"/><text x="32" y="44" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="36" fill="${palette.whitewash}">${esc(brand.logoMark)}</text></svg>`);

// Shared client data
const clockData = `<script type="application/json" id="clock-data">${json({ lanes: clock.lanes, days: clock.days, tips: clock.tips })}</script>`;
const festData = `<script type="application/json" id="fest-data">${json({ festivals: festivals.map(f => ({ ...f, regionName: regionName(f.region) })), monthNames })}</script>`;
const railData = `<script type="application/json" id="rail-data">${json({ cities, links, regionNames: Object.fromEntries(regions.map(r => [r.slug, r.name])) })}</script>`;

// ---------- home ----------
page('/', {
  image: 'home',
  scripts: [clockData, festData, 'home.js'],
  body: `
<section class="hero">
  ${img('home', { ratio: [16, 9], eager: true })}
  ${credit('home')}
  <div class="hero-body"><div class="wrap">
    <p class="kicker">${esc(brand.tagline)}</p>
    <h1>Travel Spain at the pace of a long lunch</h1>
    <p class="dek">Food, small towns, rail journeys and festivals, planned for curious adults who would rather stay three nights than three hours.</p>
    <div class="btn-row"><a class="btn btn--gold" href="/enquire/">Plan a trip</a><a class="btn btn--ghost" href="/regions/">Explore the regions</a></div>
  </div></div>
</section>

<section class="section">
  <div class="wrap split">
    <div class="prose">
      <p class="kicker">Why ${esc(brand.name)}</p>
      <h2>Spain beyond the city break</h2>
      <p>${esc(brand.meaning)}</p>
      <p>Most trips to Spain are fast: Barcelona, Madrid, Seville, a few days each, a list of sights. We plan the other kind. Fewer bases and longer stays. Trains instead of motorways. Lunch at two, dinner at ten, and a town festival you didn't know existed.</p>
      <p><a href="/about/">How we plan</a></p>
    </div>
    <div class="aside-box">
      <h3>What we're good at</h3>
      <ul class="list-plain table-list">
        <li><strong>Food and wine</strong>: markets, bodegas, cider houses and the right bar for the right hour.</li>
        <li><strong>Small towns</strong>: places with a main square, a market day and no coach park.</li>
        <li><strong>Rail journeys</strong>: high-speed lines between regions, slow trains within them.</li>
        <li><strong>Festivals</strong>: when to go, where to stand and what to expect.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--blue">
  <div class="wrap">
    <div class="section-head"><div><p class="kicker">Three tools for slow travel</p><h2>Plan like a local</h2></div></div>
    <div class="grid grid--3">
      <div class="feature-card"><span class="num">1</span><h3>The Spanish clock</h3><p>When Spain eats, rests and goes out, hour by hour, so you stop arriving at empty restaurants at 7pm.</p><p id="now-spain" class="small" aria-live="polite"></p><p><a href="/spanish-clock/">Open the clock</a></p></div>
      <div class="feature-card"><span class="num">2</span><h3>Rail journey planner</h3><p>Pick a few cities. We'll suggest a route on high-speed and regional trains, with rough journey times and nights in each place.</p><p><a href="/rail-journeys/">Plan a rail route</a></p></div>
      <div class="feature-card"><span class="num">3</span><h3>Festivals calendar</h3><p>Fiestas by month and region, with a short note on what to expect at each one.</p><p id="fest-now" class="small"></p><p><a href="/festivals/">See the calendar</a></p></div>
    </div>
  </div>
</section>

<section class="section section--sand">
  <div class="wrap">
    <div class="section-head"><div><p class="kicker">Nine regions</p><h2>Where to go slowly</h2></div><a href="/regions/">All regions</a></div>
    <div class="grid grid--3">${regions.map(regionCard).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head"><div><p class="kicker">Journal</p><h2>Notes from the table</h2></div><a href="/journal/">All stories</a></div>
    <div class="grid grid--3">${journal.slice(0, 3).map(journalCard).join('')}</div>
  </div>
</section>
${ctaBand()}`,
});

// ---------- regions ----------
page('/regions/', {
  title: 'Regions',
  description: 'Nine regions of Spain for slow travel: Andalusia, the Basque Country, Galicia, Catalonia, Castile and León, Extremadura, Valencia, the Balearics and the Canaries.',
  image: 'castile',
  body: `
${pageHead({ kicker: 'Regions', title: 'Nine regions, taken slowly', dek: 'Spain is less a single country to "do" than a set of regions with their own food, language, festivals and pace. Pick one or two and give them time.' })}
<section class="section" style="padding-top:0"><div class="wrap"><div class="grid grid--3">${regions.map(regionCard).join('')}</div></div></section>
${ctaBand()}`,
});

for (const r of regions) {
  const fests = festivals.filter(f => f.region === r.slug).sort((a, b) => a.months[0] - b.months[0]);
  const regionCities = Object.entries(cities).filter(([, c]) => c.region === r.slug).map(([k]) => k);
  const posts = journal.filter(j => j.region === r.slug);
  const stay = stays.find(s => s.region === r.slug);
  page(`/regions/${r.slug}/`, {
    title: r.name,
    description: r.summary,
    image: r.photo,
    body: `
${pageHead({ kicker: `${esc(r.local)} · ${esc(r.kicker)}`, title: esc(r.name), dek: esc(r.summary) })}
<div class="wrap">${figure(r.photo, { eager: true })}</div>
<section class="section">
  <div class="wrap split">
    <div class="prose">${r.intro.map(p => `<p>${esc(p)}</p>`).join('')}</div>
    <div>
      <div class="aside-box"><h3>Getting around by rail</h3><p>${esc(r.rail)}</p>${regionCities.length ? `<p><a href="/rail-journeys/?cities=${regionCities.slice(0, 4).join(',')}">Try these stops in the rail planner</a></p>` : ''}</div>
      <div class="aside-box"><h3>When to go</h3><p>${esc(r.season)}</p><p><a href="/when-to-go/">Month by month</a></p></div>
    </div>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap">
    <p class="kicker">Ways to slow down</p>
    <h2>${esc(r.name)}, slowly</h2>
    <div class="grid grid--2" style="margin-top:1.5rem">${r.slow.map(s => `<div class="feature-card"><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap split split--even">
    <div><p class="kicker">Small towns</p><h2>Where to stay a while</h2><ul class="list-plain towns">${r.towns.map(t => `<li><strong>${esc(t.name)}</strong>${esc(t.note)}</li>`).join('')}</ul></div>
    <div><p class="kicker">At the table</p><h2>What to eat and drink</h2><ul class="list-plain table-list">${r.table.map(t => `<li>${esc(t)}</li>`).join('')}</ul><p><a href="/food-and-wine/">More on food and wine</a></p></div>
  </div>
</section>
${fests.length ? `<section class="section section--sand"><div class="wrap"><div class="section-head"><div><p class="kicker">Festivals</p><h2>Fiestas in ${esc(r.name)}</h2></div><a href="/festivals/?region=${r.slug}">Full calendar</a></div><ul class="fest-list">${fests.map(festItem).join('')}</ul></div></section>` : ''}
${posts.length || stay ? `<section class="section"><div class="wrap grid grid--2">
  ${posts.map(j => `<div><p class="kicker">From the journal</p><h3><a href="/journal/${j.slug}/">${esc(j.title)}</a></h3><p>${esc(j.dek)}</p></div>`).join('')}
  ${stay ? `<div><p class="kicker">Where we'd stay</p><h3>${esc(stay.kind)}</h3><p>${esc(stay.why)}</p><p><a href="/stays/">See our kinds of stays</a></p></div>` : ''}
</div></section>` : ''}
${ctaBand(`Want to see ${esc(r.name)} slowly? Tell us when you can travel and what you love to eat, and we will suggest a route.`)}`,
  });
}

// ---------- food & wine ----------
page('/food-and-wine/', {
  title: 'Food and wine',
  description: 'How to eat in Spain like a local: meal times, tapas etiquette, regional dishes and the wines to look for in each region.',
  image: 'food',
  body: `
${pageHead({ kicker: 'Food and wine', title: 'Eat late, eat regionally, and leave room for the sobremesa', dek: 'Spanish food is regional first and national second. The best meals are often the plainest: what grows nearby, cooked the way it always has been.' })}
<div class="wrap">${figure('food', { eager: true })}</div>
<section class="section">
  <div class="wrap">
    <p class="kicker">How Spain eats</p>
    <h2>Six things worth knowing</h2>
    <div class="grid grid--3" style="margin-top:1.5rem">${food.rules.map(r => `<div class="feature-card"><h3>${esc(r.title)}</h3><p>${esc(r.text)}</p></div>`).join('')}</div>
    <p style="margin-top:2rem"><a class="btn btn--primary" href="/spanish-clock/">See the Spanish clock</a></p>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap">
    <p class="kicker">Region by region</p>
    <h2>One dish to travel for in each region</h2>
    <div class="grid grid--3" style="margin-top:1.5rem">${food.dishes.map(d => `<div class="card"><div class="card-body"><p class="kicker">${esc(regionName(d.region))}</p><h3><a href="/regions/${d.region}/">${esc(d.name)}</a></h3><p>${esc(d.text)}</p></div></div>`).join('')}</div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div>
      <p class="kicker">In the glass</p>
      <h2>Wines to look for</h2>
      <ul class="list-plain towns">${food.wines.map(w => `<li><strong>${esc(w.name)}</strong>${esc(w.text)} <a href="/regions/${w.region}/" class="small">${esc(regionName(w.region))}</a></li>`).join('')}</ul>
      <p><a href="/journal/three-glasses-of-sherry/">Read: Three glasses of sherry</a></p>
    </div>
    <figure class="figure" style="margin:0">${img('wine', { ratio: [4, 5], sizes: '(min-width: 56rem) 32rem, 100vw' })}<figcaption>${credit('wine')}</figcaption></figure>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap split split--even">
    <figure class="figure" style="margin:0">${img('pintxobar', { ratio: [4, 3], sizes: '(min-width: 56rem) 34rem, 100vw' })}<figcaption>${credit('pintxobar')}</figcaption></figure>
    <div class="prose">
      <p class="kicker">Markets and bars</p>
      <h2>Where to eat well without a reservation</h2>
      <p>The best introduction to any Spanish town is its municipal market in the morning, followed by the bars around it at midday. Stallholders will tell you what's in season, and nearby bars often cook what the market sells.</p>
      <p>In the evening, follow the crowd. A bar with paper napkins on the floor and people standing three deep at the counter is usually a good sign.</p>
    </div>
  </div>
</section>
${ctaBand('We plan trips around markets, bodegas, cider houses and long lunches. Tell us what you love to eat.')}`,
});

// ---------- rail ----------
page('/rail-journeys/', {
  title: 'Rail journeys',
  description: 'Plan a slow rail journey through Spain: pick a few cities and get a suggested route on high-speed and regional trains, with rough journey times and nights in each place.',
  image: 'rail',
  scripts: [railData, 'rail.js'],
  body: `
${pageHead({ kicker: 'Rail journeys', title: 'Spain by train, at a sensible pace', dek: 'Spain has one of the largest high-speed rail networks in the world, and some slow, beautiful regional lines. Use both.' })}
<div class="wrap">${figure('rail', { eager: true })}</div>
<section class="section section--sand" id="planner">
  <div class="wrap">
    <div class="section-head"><div><p class="kicker">Journey planner</p><h2>Pick your cities</h2></div></div>
    <p class="prose">Choose two to seven places. The first city you tick is where you start. We'll find the most efficient order, show you where you change trains, and suggest how many nights to spend in each place. You can adjust the nights. Times are rough guides, so always check the current timetable before you book.</p>
    <div class="planner" data-planner>
      <form class="planner-panel" id="planner-form" aria-labelledby="pick-heading">
        <h3 id="pick-heading" style="font-family:var(--sans);font-size:1rem">Cities</h3>
        <div id="city-picks">
          ${[...new Set(Object.values(cities).map(c => c.region))].map(reg => `
          <fieldset class="region-group"><legend><h3>${reg ? esc(regionName(reg)) : 'Madrid and elsewhere'}</h3></legend>
            <div class="city-picks">${Object.entries(cities).filter(([, c]) => c.region === reg).map(([k, c]) => `<label><input type="checkbox" name="city" value="${k}"> ${esc(c.name)}</label>`).join('')}</div>
          </fieldset>`).join('')}
        </div>
        <div class="btn-row"><button type="button" class="btn btn--ghost" id="planner-clear">Clear</button></div>
        <noscript><p class="notice">The planner needs JavaScript. The suggested journeys below work without it.</p></noscript>
      </form>
      <div class="planner-panel" aria-live="polite">
        <svg class="rail-map" id="rail-map" viewBox="0 0 600 420" role="img" aria-labelledby="map-title"><title id="map-title">Schematic map of the rail network in mainland Spain, with your route highlighted</title></svg>
        <div class="legend"><span class="l-hs">High-speed</span><span class="l-reg">Regional</span><span class="l-on">Your route</span></div>
        <div id="route-out" style="margin-top:1.25rem"><p class="muted">Tick two or more cities to see a route.</p></div>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="kicker">Ready-made routes</p>
    <h2>Four journeys we love</h2>
    <div class="grid grid--2" style="margin-top:1.5rem">${journeys.map(j => `<div class="feature-card"><h3>${esc(j.title)}</h3><p class="small muted">${j.stops.map(s => esc(cities[s].name)).join(' → ')}</p><p>${esc(j.text)}</p><p><a href="/rail-journeys/?cities=${j.stops.join(',')}#planner">Load into the planner</a></p></div>`).join('')}</div>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap split">
    <div class="prose">
      <p class="kicker">Practicalities</p>
      <h2>Booking and riding</h2>
      <p><strong>Operators.</strong> Renfe runs most services, including AVE, Avlo, Alvia, Media Distancia and local trains. On the busiest high-speed routes, Iryo and Ouigo also compete, often at lower prices.</p>
      <p><strong>Book ahead for fast trains.</strong> Long-distance and high-speed trains need a reserved seat, and prices usually rise as the date approaches. Regional trains are cheaper and more flexible.</p>
      <p><strong>Allow time at the station.</strong> High-speed services often have a bag scan before boarding, and the gates can close a few minutes before departure.</p>
      <p><strong>Mix fast and slow.</strong> Use high-speed trains to cross the country between regions, then slow down: regional trains, a driver for a day, or your own feet.</p>
      <h2>Slow lines worth the time</h2>
      <p><strong>The Sóller train, Mallorca.</strong> A historic wooden train from Palma through the mountains. <strong>Ronda line.</strong> The single-track line from Ronda towards Algeciras through the cork-oak hills. <strong>Euskotren.</strong> The narrow-gauge line between Bilbao and San Sebastián, through Basque valleys.</p>
    </div>
    <figure class="figure" style="margin:0">${img('ave', { ratio: [4, 5], sizes: '(min-width: 56rem) 32rem, 100vw' })}<figcaption>${credit('ave')}</figcaption></figure>
  </div>
</section>
${ctaBand('Want us to put the tickets, the bases and the long lunches together? Send us your rough route.')}`,
});

// ---------- festivals ----------
const festByMonth = monthNames.map((m, i) => ({ m, i: i + 1, items: festivals.filter(f => f.months.includes(i + 1)) }));
page('/festivals/', {
  title: 'Festivals calendar',
  description: 'A calendar of Spanish festivals by month and region, from the Fallas and Feria de Abril to Galician octopus fairs, with what to expect at each one.',
  image: 'festivals',
  scripts: [festData, 'festivals.js'],
  body: `
${pageHead({ kicker: 'Festivals', title: 'A year of fiestas', dek: 'Almost every town in Spain has at least one fiesta a year. Here are the ones worth planning a trip around, by month and region.' })}
<div class="wrap">${figure('festivals', { eager: true })}</div>
<section class="section section--sand">
  <div class="wrap">
    <div class="notice" role="note"><strong>Dates move.</strong> Many fiestas follow Easter or fall on the nearest weekend, and some change from year to year. Always check the official dates for your year before you book.</div>
    <div class="fest-filters" style="margin-top:1.5rem">
      <div class="field" style="margin:0"><label for="fest-region">Region</label>
        <select id="fest-region"><option value="">All regions</option><option value="nationwide">Nationwide</option>${regions.map(r => `<option value="${r.slug}">${esc(r.name)}</option>`).join('')}</select>
      </div>
      <p class="small muted" id="fest-count" aria-live="polite" style="margin:0"></p>
    </div>
    <div class="month-strip" role="group" aria-label="Filter by month" id="month-strip" hidden>
      <button type="button" data-month="" aria-pressed="true">All months</button>
      ${monthNames.map((m, i) => `<button type="button" data-month="${i + 1}" aria-pressed="false">${m.slice(0, 3)}<span class="visually-hidden">${m.slice(3)}</span></button>`).join('')}
    </div>
    <div id="fest-results">
      ${festByMonth.map(({ m, i, items }) => `<section class="fest-month" data-month="${i}"><h2 id="m-${i}">${m}</h2><ul class="fest-list">${items.map(festItem).join('')}</ul></section>`).join('')}
    </div>
    <p class="fest-empty" id="fest-empty" hidden>No festivals match. Try another month or region.</p>
  </div>
</section>
${ctaBand('Want to build a trip around a fiesta, or avoid one? We can help with timing, rooms and where to stand.')}`,
});

// ---------- when to go ----------
page('/when-to-go/', {
  title: 'When to go',
  description: 'When to visit Spain, month by month and region by region: weather, crowds, festivals and seasonal food.',
  image: 'whentogo',
  body: `
${pageHead({ kicker: 'When to go', title: 'Every month is a good month somewhere', dek: 'The best time to visit Spain depends on where you are going. The south bakes in August while Galicia is at its best. In January the Canaries are warm and the plateau is frozen.' })}
<div class="wrap">${figure('whentogo', { eager: true })}</div>
<section class="section">
  <div class="wrap">
    <p class="kicker">At a glance</p>
    <h2>Region by month</h2>
    <p class="prose">Our own view of each region's best months for slow travel, considering heat, rain, crowds and what's in season. <span class="s3" style="padding:0 .3rem;border-radius:3px">3</span> best, <span class="s2" style="padding:0 .3rem;border-radius:3px">2</span> good, <span class="s1" style="padding:0 .3rem;border-radius:3px">1</span> possible, with caveats.</p>
    <div class="season-wrap">
      <table class="season">
        <caption class="visually-hidden">Best months to visit each region, rated 1 to 3</caption>
        <thead><tr><th scope="col">Region</th>${monthNames.map(m => `<th scope="col"><abbr title="${m}">${m.slice(0, 3)}</abbr></th>`).join('')}</tr></thead>
        <tbody>${regions.map(r => `<tr><th scope="row"><a href="/regions/${r.slug}/">${esc(r.name)}</a></th>${seasonGrid[r.slug].map((v, i) => `<td><span class="s${v}" aria-label="${monthNames[i]}: ${['', 'possible', 'good', 'best'][v]}">${v}</span></td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap">
    <p class="kicker">Month by month</p>
    <h2>What each month is good for</h2>
    <table class="month-table">
      <thead><tr><th scope="col">Month</th><th scope="col">Good for</th><th scope="col">Watch out for</th></tr></thead>
      <tbody>${months.map((m, i) => `<tr><th scope="row"><a href="/festivals/?month=${i + 1}">${m.m}</a></th><td data-label="Good for">${esc(m.good)}</td><td data-label="Watch out for">${esc(m.watch)}</td></tr>`).join('')}</tbody>
    </table>
  </div>
</section>
<section class="section">
  <div class="wrap grid grid--3">
    <div class="feature-card"><h3>Public holidays</h3><p>National holidays, plus regional and local ones, close shops and fill trains. Holy Week, early August and the "puentes" (long weekends) are the busiest times.</p></div>
    <div class="feature-card"><h3>The August question</h3><p>Much of Spain goes on holiday in August. Cities are quieter and some restaurants close. Coasts and villages are full. Head north or into the mountains.</p></div>
    <div class="feature-card"><h3>Days shape the plan</h3><p>Spain uses Central European Time, so summer evenings are very long, while winter mornings are dark until late, especially in Galicia. See the <a href="/spanish-clock/">Spanish clock</a>.</p></div>
  </div>
</section>
${ctaBand()}`,
});

// ---------- Spanish clock ----------
page('/spanish-clock/', {
  title: 'The Spanish clock',
  description: 'An interactive day in Spain: when people eat, rest, shop and go out, so you never again arrive at an empty restaurant at 7pm.',
  image: 'clock',
  scripts: [clockData, 'clock.js'],
  body: `
${pageHead({ kicker: 'The Spanish clock', title: 'What time does Spain eat?', dek: 'Lunch at two, dinner at ten, and the paseo in between. Move the slider through a Spanish day to see what is open, what locals are doing and where you should be.' })}
<section class="section section--sand" style="padding-top:2rem">
  <div class="wrap">
    <div class="clock" id="clock">
      <noscript><p class="notice">The interactive clock needs JavaScript. The full day is written out below.</p></noscript>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <p class="kicker">Why so late?</p>
      <h2>A day built around lunch</h2>
      <p>Spain's day is organised around a long lunch rather than a big dinner. The country also uses Central European Time, although geographically it sits closer to London, so the sun rises and sets late by the clock. Put those together and you get late, light dinners and long evenings outside.</p>
      <h2>It varies</h2>
      <p>Catalonia and the north generally eat a little earlier than Madrid and Andalusia. Big cities run later than villages. Summer pushes everything later, especially inland in the south, where the afternoon heat empties the streets.</p>
      <h2>Five habits to adopt</h2>
      <ol>
        <li>Make lunch your main meal, and try the menú del día on weekdays.</li>
        <li>Have a merienda around six so you are not starving at eight.</li>
        <li>Join the paseo. It's the best free show in town.</li>
        <li>Book dinner for 21:30 or later in the south and in Madrid.</li>
        <li>On Sundays, book lunch and expect quieter evenings.</li>
      </ol>
    </div>
    <figure class="figure" style="margin:0">${img('clock', { ratio: [4, 5], sizes: '(min-width: 56rem) 32rem, 100vw' })}<figcaption>${credit('clock')}</figcaption></figure>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap">
    <h2>The whole day, written out</h2>
    <div class="grid grid--3">${Object.values(clock.days).map(d => `<div><h3>${esc(d.label)}</h3><ul class="list-plain towns">${[...d.blocks].sort((a, b) => a.from.localeCompare(b.from)).map(b => `<li><strong>${clockTime(b.from)}–${clockTime(b.to)} · ${esc(b.title)}</strong>${esc(b.text)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>
${ctaBand()}`,
});

// ---------- stays ----------
page('/stays/', {
  title: 'Stays',
  description: 'The kinds of small, characterful places we choose to stay in across Spain.',
  image: 'stays',
  body: `
${pageHead({ kicker: 'Stays', title: 'Small places, long stays', dek: 'We choose bases, not stopovers: small hotels, village houses and country estates where staying three nights feels natural.' })}
<div class="wrap">${figure('stays', { eager: true })}</div>
<section class="section">
  <div class="wrap">
    <div class="notice" role="note"><strong>Placeholders.</strong> The names below are placeholders, used to show the kind of place we choose in each region. They are not real properties. We will add real partners once they are confirmed.</div>
    <div class="grid grid--3" style="margin-top:2rem">${stays.map(s => `<article class="card" style="background:var(--sand)"><div class="card-body"><p><span class="pill pill--placeholder">Placeholder</span> <span class="pill">${esc(regionName(s.region))}</span></p><h3>${esc(s.name)}</h3><p><strong>${esc(s.kind)}.</strong> ${esc(s.why)}</p></div></article>`).join('')}</div>
  </div>
</section>
<section class="section section--sand">
  <div class="wrap prose">
    <p class="kicker">What we look for</p>
    <h2>Our rules for a good stay</h2>
    <ul class="list-plain table-list">
      <li>Small enough that the owners know your name.</li>
      <li>Walking distance to a bar, a bakery or a market, or so far out that it doesn't matter.</li>
      <li>Breakfast made with local produce.</li>
      <li>A reason to stay at least two nights: a view, a garden, a good kitchen, a walk from the door.</li>
      <li>Rooms that are quiet at midnight, which in Spain matters.</li>
    </ul>
  </div>
</section>
${ctaBand()}`,
});

// ---------- about ----------
page('/about/', {
  title: 'About',
  description: `About ${brand.name}: how we plan slow, regional trips in Spain.`,
  image: 'about',
  body: `
${pageHead({ kicker: 'About', title: `About ${esc(brand.name)}`, dek: esc(brand.meaning) })}
<div class="wrap">${figure('about', { eager: true })}</div>
<section class="section">
  <div class="wrap split">
    <div class="prose">
      <h2>What we believe</h2>
      <p>The best of Spain is regional, seasonal and slow. It's in a market at eleven in the morning, a two-hour lunch, a slow train through olive country, and a village fiesta that wasn't in any guidebook.</p>
      <p>We plan journeys for curious adults who want to travel the way Spaniards do: fewer places, longer stays, local hours and local food. We don't run group tours, and we don't sell the same trip to everyone.</p>
      <h2>How we plan</h2>
      <ol>
        <li><strong>We talk first.</strong> Tell us when you can travel, what you like to eat and how you like to move.</li>
        <li><strong>We suggest a route.</strong> Usually two to four bases, connected by train where we can.</li>
        <li><strong>We refine it together</strong> until it fits your pace.</li>
        <li><strong>We book and brief you</strong> with notes on meal times, markets, festivals and the bars we would go to.</li>
      </ol>
    </div>
    <div>
      <div class="aside-box">
        <h3>What you won't find here</h3>
        <ul class="list-plain table-list">
          <li>Invented reviews or testimonials.</li>
          <li>Press logos or awards we haven't won.</li>
          <li>Photos of one place passed off as another. Every photo on this site is tagged on Unsplash with the location we describe, and is credited.</li>
        </ul>
      </div>
      <div class="aside-box">
        <h3>Contact</h3>
        <p><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a><br><a href="tel:${esc(contact.phoneHref)}">${esc(contact.phone)}</a><br>${esc(contact.address)}<br><span class="small muted">${esc(contact.hours)}</span></p>
      </div>
    </div>
  </div>
</section>
${ctaBand()}`,
});

// ---------- journal ----------
page('/journal/', {
  title: 'Journal',
  description: 'Stories and practical guides for slow travel in Spain: food, wine, rail and the regions.',
  image: 'cordoba',
  body: `
${pageHead({ kicker: 'Journal', title: 'Notes from the table', dek: 'Short, practical stories about eating, drinking and moving slowly through Spain.' })}
<section class="section" style="padding-top:0"><div class="wrap"><div class="grid grid--3">${journal.map(journalCard).join('')}</div></div></section>
${ctaBand()}`,
});
for (const j of journal) {
  page(`/journal/${j.slug}/`, {
    title: j.title,
    description: j.dek,
    image: j.photo,
    body: `
<article>
${pageHead({ kicker: `Journal · <a href="/regions/${j.region}/">${esc(regionName(j.region))}</a>`, title: esc(j.title), dek: esc(j.dek), extra: `<p class="journal-meta">By the ${esc(brand.name)} team · <time datetime="${j.date}">${fmtDate(j.date)}</time></p>` })}
<div class="wrap">${figure(j.photo, { eager: true })}</div>
<div class="section"><div class="wrap"><div class="prose dropcap">${j.body}</div></div></div>
</article>
<section class="section section--sand"><div class="wrap"><h2>More from the journal</h2><div class="grid grid--3">${journal.filter(o => o !== j).slice(0, 3).map(journalCard).join('')}</div></div></section>
${ctaBand()}`,
  });
}

// ---------- enquiry ----------
page('/enquire/', {
  title: 'Plan a trip',
  description: `Tell ${brand.name} about the trip you have in mind and we will suggest a slow route through Spain.`,
  image: 'home',
  scripts: [`<script type="application/json" id="form-config">${json({ endpoint: contact.formEndpoint, email: contact.email, brand: brand.name })}</script>`, 'enquiry.js'],
  body: `
${pageHead({ kicker: 'Plan a trip', title: 'Tell us about your trip', dek: 'A few details help us suggest a route that fits you. There is no obligation, and we reply personally.' })}
<section class="section" style="padding-top:0">
  <div class="wrap split">
    <form id="enquiry" class="prose" method="post" action="${contact.formEndpoint ? esc(contact.formEndpoint) : `mailto:${esc(contact.email)}`}"${contact.formEndpoint ? '' : ' enctype="text/plain"'} novalidate>
      <div id="form-status" role="status" aria-live="polite"></div>
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-phone">Phone (optional)</label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="grid grid--2" style="gap:1rem">
        <div class="field"><label for="f-when">Roughly when?</label><input id="f-when" name="when" type="month"></div>
        <div class="field"><label for="f-nights">How many nights?</label><input id="f-nights" name="nights" type="number" min="2" max="60" inputmode="numeric"></div>
      </div>
      <div class="field"><label for="f-people">Who's travelling?</label><select id="f-people" name="people"><option value="">Choose…</option><option>Just me</option><option>Two of us</option><option>A family</option><option>A group of friends</option></select></div>
      <fieldset class="field"><legend>Regions you're curious about</legend>
        <div class="checks">${regions.map(r => `<label><input type="checkbox" name="regions" value="${esc(r.name)}"> ${esc(r.name)}</label>`).join('')}<label><input type="checkbox" name="regions" value="Not sure yet"> Not sure yet</label></div>
      </fieldset>
      <fieldset class="field"><legend>What matters most?</legend>
        <div class="checks">${['Food and markets', 'Wine and bodegas', 'Small towns', 'Rail journeys', 'Festivals', 'Walking', 'Art and history', 'Coast and islands'].map(i => `<label><input type="checkbox" name="interests" value="${i}"> ${i}</label>`).join('')}</div>
      </fieldset>
      <div class="field"><label for="f-pace">Pace</label><select id="f-pace" name="pace"><option value="">Choose…</option><option>Very slow: two or three bases</option><option>Slow: four or five bases</option><option>A bit more ground covered</option></select></div>
      <div class="field"><label for="f-message">Anything else?</label><p class="hint" id="f-message-hint">Places you've loved, things you don't enjoy, dietary needs, mobility, budget.</p><textarea id="f-message" name="message" aria-describedby="f-message-hint"></textarea></div>
      <button class="btn btn--primary" type="submit">Send enquiry</button>
      <p class="small muted" style="margin-top:1rem">We use your details only to reply to your enquiry.</p>
    </form>
    <div>
      <div class="aside-box"><h3>Prefer email or phone?</h3><p><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a><br><a href="tel:${esc(contact.phoneHref)}">${esc(contact.phone)}</a><br><span class="small muted">${esc(contact.hours)}</span></p></div>
      <div class="aside-box"><h3>Before you write</h3><p>Try the <a href="/rail-journeys/">rail planner</a> to sketch a route, and check the <a href="/festivals/">festivals calendar</a> for your dates. You can paste the route into your message.</p></div>
    </div>
  </div>
</section>`,
});
page('/enquire/thanks/', {
  title: 'Thank you',
  body: `${pageHead({ kicker: 'Thank you', title: 'Your enquiry is on its way', dek: 'We will reply personally, usually within two working days (Spanish ones, so allow for a long lunch).' })}
<section class="section" style="padding-top:0"><div class="wrap btn-row"><a class="btn btn--primary" href="/journal/">Read the journal</a><a class="btn btn--ghost" href="/">Back to home</a></div></section>`,
});

// ---------- credits, 404 ----------
page('/credits/', {
  title: 'Photo credits',
  description: 'Credits for the photographs used on this site.',
  body: `
${pageHead({ kicker: 'Credits', title: 'Photo credits', dek: 'All photographs come from Unsplash under the Unsplash License. We only use a photo when its Unsplash location tag matches the place we use it for.' })}
<section class="section" style="padding-top:0"><div class="wrap prose"><ul class="list-plain credits-list">
${Object.values(photos).map(p => `<li><strong>${esc(p.place)}</strong>: <a href="${esc(p.page)}?${utm}">photo</a> by <a href="${esc(p.authorUrl)}?${utm}">${esc(p.author)}</a> on Unsplash. Tagged location: “${esc(p.unsplashLocation)}”.</li>`).join('\n')}
</ul></div></section>`,
});
page('/404', {
  title: 'Page not found',
  body: `${pageHead({ kicker: '404', title: 'This street is closed for the siesta', dek: 'We couldn\'t find that page. Try the regions, or start an enquiry.' })}
<section class="section" style="padding-top:0"><div class="wrap btn-row"><a class="btn btn--primary" href="/regions/">Explore the regions</a><a class="btn btn--ghost" href="/">Home</a></div></section>`,
});

// ---------- sitemap, robots ----------
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.filter(p => p !== '/404' && p !== '/enquire/thanks/').map(p => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages into ./${OUT}`);
