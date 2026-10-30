#!/usr/bin/env node
/**
 * Build-time localisation for this static site. No dependencies, no client-side JS.
 *
 * English pages are built as usual into the output folder. This script then writes
 * a French, German and Spanish copy of every page under /fr/, /de/ and /es/:
 *
 *   - visible text, <title>, meta descriptions, alt/aria-label/title/placeholder
 *     and the data in <script type="application/json|ld+json"> are looked up in
 *     i18n/<locale>.json, a flat map from the English source string to its
 *     translation. A sentence with inline markup (<em>, <a>, <b>…) is one entry,
 *     so word order can change freely; the markup is part of the string.
 *   - internal links point to the same locale; <html lang>, canonical and hreflang
 *     alternates (en, fr, de, es, x-default) are set on every page, English included.
 *   - JavaScript files listed in `jsFiles` get a per-locale copy with their UI
 *     strings translated (exact string literals only).
 *   - English dates such as "30 October 2026" are reformatted per locale.
 *   - the sitemap lists every locale.
 *
 *   node scripts/i18n.mjs            build the locales (after the normal build)
 *   node scripts/i18n.mjs extract    write i18n/source.json (every English string) and
 *                                     report what is missing from each locale file
 *   node scripts/i18n.mjs check      exit 1 if any locale is missing a translation
 *
 * The language selector itself is rendered by the site's own templates (links marked
 * `data-lang-link` inside an element with `data-i18n-skip`).
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/config.json'), 'utf8'));
const OUT = path.join(ROOT, CONFIG.outDir);
const LOCALES = CONFIG.locales; // e.g. ["fr","de","es"]
const ALL = ['en', ...LOCALES];
const SITE = CONFIG.siteUrl.replace(/\/$/, '');
const SKIP_LINK = CONFIG.skipLinkPrefixes || ['/assets/', '/_astro/', '/_next/'];
const DATE_LOCALE = { en: 'en-GB', fr: 'fr-FR', de: 'de-DE', es: 'es-ES' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* ------------------------------------------------------------------ */
/* tiny HTML parser (for our own generated, well-formed HTML)          */
/* ------------------------------------------------------------------ */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const RAW = new Set(['script', 'style', 'textarea', 'title']);
const INLINE = new Set(['a', 'abbr', 'b', 'br', 'cite', 'code', 'em', 'i', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'wbr', 'del', 'ins']);
const SKIP = new Set(['script', 'style', 'svg', 'template', 'noscript']);
const TEXT_ATTRS = new Set(['alt', 'title', 'aria-label', 'placeholder', 'data-error', 'aria-roledescription', 'data-label']);
const META_TEXT = /^(description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)$/;

function parseAttrs(raw) {
  const attrs = [];
  const re = /([^\s=\/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(raw))) attrs.push([m[1], m[2] ?? m[3] ?? m[4] ?? null, m[2] !== undefined ? '"' : m[3] !== undefined ? "'" : '']);
  return attrs;
}

function parse(html) {
  const root = { type: 'root', children: [] };
  const stack = [root];
  let i = 0;
  const top = () => stack[stack.length - 1];
  while (i < html.length) {
    if (html.startsWith('<!--', i)) {
      const j = html.indexOf('-->', i);
      top().children.push({ type: 'raw', raw: html.slice(i, j + 3) });
      i = j + 3;
    } else if (html.startsWith('<!', i)) {
      const j = html.indexOf('>', i);
      top().children.push({ type: 'raw', raw: html.slice(i, j + 1) });
      i = j + 1;
    } else if (html.startsWith('</', i)) {
      const j = html.indexOf('>', i);
      const name = html.slice(i + 2, j).trim().toLowerCase();
      // pop to the matching element (tolerates stray closers)
      for (let k = stack.length - 1; k > 0; k--) if (stack[k].name === name) { stack.length = k; break; }
      i = j + 1;
    } else if (html[i] === '<' && /[a-zA-Z]/.test(html[i + 1] || '')) {
      // find end of tag, respecting quotes
      let j = i + 1, q = null;
      for (; j < html.length; j++) {
        const c = html[j];
        if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === '>') break;
      }
      const inner = html.slice(i + 1, j);
      const nm = inner.match(/^[a-zA-Z][\w:-]*/)[0];
      const name = nm.toLowerCase();
      const selfClosing = /\/\s*$/.test(inner);
      const node = { type: 'el', name, rawAttrs: inner.slice(nm.length).replace(/\/\s*$/, ''), selfClosing, children: [] };
      node.attrs = parseAttrs(node.rawAttrs);
      top().children.push(node);
      i = j + 1;
      if (VOID.has(name) || selfClosing) continue;
      if (RAW.has(name)) {
        const close = html.toLowerCase().indexOf(`</${name}`, i);
        node.children.push({ type: name === 'title' || name === 'textarea' ? 'text' : 'rawtext', text: html.slice(i, close) });
        i = html.indexOf('>', close) + 1;
        continue;
      }
      stack.push(node);
    } else {
      const j = html.indexOf('<', i + 1);
      const end = j === -1 ? html.length : j;
      top().children.push({ type: 'text', text: html.slice(i, end) });
      i = end;
    }
  }
  return root;
}

const serAttrs = (n) => (n.attrsDirty ? n.attrs.map(([k, v, q]) => (v === null ? ` ${k}` : ` ${k}=${q || '"'}${v}${q || '"'}`)).join('') : n.rawAttrs);
function serialize(n) {
  if (n.type === 'root') return n.children.map(serialize).join('');
  if (n.type === 'raw') return n.raw;
  if (n.type === 'text' || n.type === 'rawtext') return n.text;
  const open = `<${n.name}${serAttrs(n)}${n.selfClosing ? '/' : ''}>`;
  if (VOID.has(n.name) || n.selfClosing) return open;
  return `${open}${n.children.map(serialize).join('')}</${n.name}>`;
}
const getAttr = (n, k) => (n.attrs.find((a) => a[0] === k) || [])[1];
function setAttr(n, k, v) {
  const a = n.attrs.find((x) => x[0] === k);
  if (a) a[1] = v; else n.attrs.push([k, v, '"']);
  n.attrsDirty = true;
}
const hasLetters = (s) => /\p{L}{2}/u.test(s.replace(/&[a-z#0-9]+;/gi, ''));
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/* dates: "30 October 2026" <-> ⟦D:2026-10-30⟧ */
const DATE_RE = new RegExp(`\\b(\\d{1,2}) (${MONTHS.join('|')}) (\\d{4})\\b`, 'g');
const toKey = (s) => s.replace(DATE_RE, (_, d, m, y) => `⟦D:${y}-${String(MONTHS.indexOf(m) + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}⟧`);
const fromKey = (s, loc) => s.replace(/⟦D:(\d{4})-(\d{2})-(\d{2})⟧/g, (_, y, m, d) => new Date(`${y}-${m}-${d}T12:00:00Z`).toLocaleDateString(DATE_LOCALE[loc], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));

/* is every descendant inline (so the whole element is one translatable unit)? */
function inlineOnly(n) {
  return n.children.every((c) => c.type === 'text' || c.type === 'raw' || (c.type === 'el' && INLINE.has(c.name) && !getAttr(c, 'data-i18n-skip') && inlineOnly(c)));
}
const innerHTML = (n) => n.children.map(serialize).join('');

/* ------------------------------------------------------------------ */
/* walk a page: collect (extract) or translate                         */
/* ------------------------------------------------------------------ */
function walk(node, visit, ctx = { skip: false }) {
  for (const c of node.children) {
    if (c.type !== 'el') {
      if (c.type === 'text' && !ctx.skip && hasLetters(c.text)) visit.text(c, node);
      continue;
    }
    // attributes
    if (!ctx.skip) {
      for (const [k, v] of c.attrs) if (v && TEXT_ATTRS.has(k) && hasLetters(v)) visit.attr(c, k, v);
      if (c.name === 'meta') {
        const key = getAttr(c, 'name') || getAttr(c, 'property') || '';
        const v = getAttr(c, 'content');
        if (META_TEXT.test(key) && v && hasLetters(v)) visit.attr(c, 'content', v);
      }
      if (c.name === 'input' && /^(submit|button)$/.test(getAttr(c, 'type') || '') && getAttr(c, 'value')) visit.attr(c, 'value', getAttr(c, 'value'));
    }
    if (c.name === 'script') {
      const t = getAttr(c, 'type') || '';
      if (/json/.test(t) && !ctx.skip) visit.json(c);
      continue;
    }
    if (SKIP.has(c.name)) continue;
    const skip = ctx.skip || getAttr(c, 'data-i18n-skip') !== undefined;
    // One unit = an element whose content is inline only and that has text of its own
    // (so "<p>Try the <a>regions</a> first</p>" is one string, but "<li><a>…</a><span>…</span></li>" is split).
    if (!skip && c.children.length && inlineOnly(c) && c.children.some((x) => x.type === 'text' && hasLetters(x.text))) {
      visit.unit(c);
      // attributes of inline children (e.g. <abbr title>) are part of the unit's HTML
      continue;
    }
    walk(c, visit, { skip });
  }
}

/* JSON: translate string values that are human text */
// Human text: has a space, or is a capitalised word ("October", "Andalusia"); slugs and ids are lower case.
const isHumanString = (s) => typeof s === 'string' && hasLetters(s) && (/\s/.test(s.trim()) || /^\p{Lu}/u.test(s)) && !/^(https?:|\/|#|mailto:)/.test(s);
function mapJson(v, f) {
  if (typeof v === 'string') return f(v);
  if (Array.isArray(v)) return v.map((x) => mapJson(x, f));
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = /^(@context|@type|url|src|href|slug|id|key|image|logo|sameAs|email|telephone|priceCurrency)$/.test(k) ? x : mapJson(x, f);
    return o;
  }
  return v;
}

/* JS: translate exact string literals (single or double quoted, no escapes inside) */
const JS_STR = /(['"])((?:(?!\1)[^\\\n])*?)\1/g;
// A string literal that builds HTML: its text segments (between tags) are translated one by one.
const isHtmlJs = (s) => /<\/?[a-z][^>]*>/i.test(s) && s.split(/(<[^>]*>)/).some((seg) => !seg.startsWith('<') && hasLetters(seg));
const isHumanJs = (s) => hasLetters(s) && /\s/.test(s) && !/[{}<>;=]|^\.|^#|^\[|^\/|=>|\(\)|^\s*\+|\+\s*$/.test(s);

/* ------------------------------------------------------------------ */
function listPages() {
  const files = [];
  (function rec(d, rel) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f), r = rel ? `${rel}/${f}` : f;
      if (!rel && LOCALES.includes(f)) continue; // generated locale folders
      if (fs.statSync(p).isDirectory()) rec(p, r);
      else if (f.endsWith('.html')) files.push(r);
    }
  })(OUT, '');
  return files.sort();
}
const urlPathOf = (rel) => '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, CONFIG.cleanUrls ? '' : '.html');

function loadDict(loc) {
  const p = path.join(ROOT, `i18n/${loc}.json`);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
}

function collect() {
  const seen = new Map();
  const add = (s, where) => {
    const k = toKey(norm(s));
    if (!k || !hasLetters(k)) return;
    if (!seen.has(k)) seen.set(k, new Set());
    seen.get(k).add(where);
  };
  for (const rel of listPages()) {
    const tree = parse(fs.readFileSync(path.join(OUT, rel), 'utf8'));
    const where = urlPathOf(rel);
    walk(tree, {
      text: (n) => add(n.text, where),
      attr: (n, k, v) => add(v, where),
      unit: (n) => add(innerHTML(n), where),
      json: (n) => {
        try { mapJson(JSON.parse(n.children[0]?.text || 'null'), (s) => { if (isHumanString(s)) add(s, where); return s; }); } catch {}
      },
    });
  }
  for (const f of CONFIG.jsFiles || []) {
    const src = fs.readFileSync(path.join(OUT, f), 'utf8');
    for (const m of src.matchAll(JS_STR)) {
      if (isHtmlJs(m[2])) for (const seg of m[2].split(/(<[^>]*>)/)) { if (!seg.startsWith('<') && hasLetters(seg)) add(seg, `js:${f}`); }
      else if (isHumanJs(m[2])) add(m[2], `js:${f}`);
    }
  }
  for (const s of CONFIG.extraStrings || []) add(s, 'config');
  return seen;
}

function extract() {
  const seen = collect();
  const source = Object.fromEntries([...seen.keys()].sort().map((k) => [k, [...seen.get(k)].slice(0, 3).join(' ')]));
  fs.writeFileSync(path.join(ROOT, 'i18n/source.json'), JSON.stringify(source, null, 1) + '\n');
  let bad = 0;
  for (const loc of LOCALES) {
    const d = loadDict(loc);
    const missing = Object.keys(source).filter((k) => d[k] === undefined);
    const unused = Object.keys(d).filter((k) => !(k in source));
    console.log(`${loc}: ${Object.keys(source).length - missing.length}/${Object.keys(source).length} translated, ${missing.length} missing, ${unused.length} unused`);
    if (missing.length) {
      bad++;
      fs.writeFileSync(path.join(ROOT, `i18n/missing.${loc}.json`), JSON.stringify(Object.fromEntries(missing.map((k) => [k, ''])), null, 1) + '\n');
    } else if (fs.existsSync(path.join(ROOT, `i18n/missing.${loc}.json`))) fs.rmSync(path.join(ROOT, `i18n/missing.${loc}.json`));
  }
  return bad;
}

/* ------------------------------------------------------------------ */
function localiseHref(href, loc) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return href;
  if (SKIP_LINK.some((p) => href.startsWith(p))) return href;
  const [p] = href.split(/[?#]/);
  if (/\.[a-z0-9]{2,5}$/i.test(p) && !p.endsWith('.html')) return href; // files
  if (LOCALES.some((l) => p === `/${l}` || p.startsWith(`/${l}/`))) return href;
  return loc === 'en' ? href : `/${loc}${href === '/' ? '/' : href}`;
}

function alternates(urlPath) {
  const u = (l) => `${SITE}${l === 'en' ? '' : `/${l}`}${urlPath}`;
  return ALL.map((l) => `<link rel="alternate" hreflang="${l}" href="${u(l)}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${u('en')}">`;
}

function build() {
  const dicts = Object.fromEntries(LOCALES.map((l) => [l, loadDict(l)]));
  const missing = Object.fromEntries(LOCALES.map((l) => [l, new Set()]));
  const tr = (loc, s) => {
    const k = toKey(norm(s));
    const v = dicts[loc][k];
    if (v === undefined || v === '') { if (hasLetters(k)) missing[loc].add(k); return s; }
    const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
    return lead + fromKey(v, loc) + trail;
  };

  // per-locale JS copies
  const jsMap = {};
  for (const loc of LOCALES) {
    jsMap[loc] = {};
    for (const f of CONFIG.jsFiles || []) {
      const src = fs.readFileSync(path.join(OUT, f), 'utf8');
      const out = src.replace(JS_STR, (m, q, s) => {
        let v;
        if (isHtmlJs(s)) v = s.split(/(<[^>]*>)/).map((seg) => (!seg.startsWith('<') && hasLetters(seg) ? tr(loc, seg) : seg)).join('');
        else if (isHumanJs(s)) v = tr(loc, s);
        else return m;
        return q + v.replace(new RegExp(q, 'g'), `\\${q}`) + q;
      });
      const name = f.replace(/\.js$/, `.${loc}.js`);
      fs.writeFileSync(path.join(OUT, name), out);
      jsMap[loc]['/' + f] = '/' + name;
    }
  }

  const pages = listPages();
  for (const rel of pages) {
    const file = path.join(OUT, rel);
    const html = fs.readFileSync(file, 'utf8');
    const urlPath = urlPathOf(rel);
    for (const loc of ALL) {
      const tree = parse(html);
      if (loc !== 'en') {
        walk(tree, {
          text: (n) => { n.text = tr(loc, n.text); },
          attr: (n, k, v) => setAttr(n, k, tr(loc, v).replace(/"/g, '&quot;')),
          unit: (n) => {
            const before = innerHTML(n);
            const after = tr(loc, before);
            if (after !== before) n.children = parse(after).children;
          },
          json: (n) => {
            try {
              const data = JSON.parse(n.children[0].text);
              const out = mapJson(data, (s) => (isHumanString(s) ? tr(loc, s) : s));
              n.children[0].text = JSON.stringify(out).replace(/</g, '\\u003c');
            } catch {}
          },
        });
      }
      // links, lang, canonical, hreflang, localized scripts
      (function fix(n) {
        for (const c of n.children || []) {
          if (c.type !== 'el') continue;
          if (c.name === 'html') setAttr(c, 'lang', loc === 'en' ? (getAttr(c, 'lang') || 'en') : loc);
          if (c.name === 'a' && getAttr(c, 'data-lang-link') !== undefined) {
            const isCur = getAttr(c, 'hreflang') === loc;
            c.attrs = c.attrs.filter((a) => a[0] !== 'aria-current');
            if (isCur) c.attrs.push(['aria-current', 'true', '"']);
            c.attrsDirty = true;
          } else if (loc !== 'en') {
            for (const k of ['href', 'action']) {
              const v = getAttr(c, k);
              if (v && (c.name !== 'link' || k !== 'href')) { const nv = localiseHref(v, loc); if (nv !== v) setAttr(c, k, nv); }
            }
            if (c.name === 'script' && jsMap[loc]) {
              const s = getAttr(c, 'src');
              if (s) { const base = s.split('?')[0]; if (jsMap[loc][base]) setAttr(c, 'src', s.replace(base, jsMap[loc][base])); }
            }
          }
          if (c.name === 'link' && getAttr(c, 'rel') === 'canonical') setAttr(c, 'href', `${SITE}${loc === 'en' ? '' : `/${loc}`}${urlPath}`);
          if (c.name === 'meta' && getAttr(c, 'property') === 'og:url') setAttr(c, 'content', `${SITE}${loc === 'en' ? '' : `/${loc}`}${urlPath}`);
          if (c.name === 'meta' && getAttr(c, 'property') === 'og:locale') setAttr(c, 'content', { en: 'en_GB', fr: 'fr_FR', de: 'de_DE', es: 'es_ES' }[loc]);
          if (c.name === 'head') {
            c.children = c.children.filter((x) => !(x.type === 'el' && x.name === 'link' && getAttr(x, 'rel') === 'alternate' && getAttr(x, 'hreflang')));
            c.children.push({ type: 'raw', raw: alternates(urlPath) });
          }
          fix(c);
        }
      })(tree);
      const outFile = loc === 'en' ? file : path.join(OUT, loc, rel);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, serialize(tree));
    }
  }

  // sitemaps: add every locale
  for (const sm of CONFIG.sitemaps || []) {
    const p = path.join(OUT, sm);
    if (!fs.existsSync(p)) continue;
    let xml = fs.readFileSync(p, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE) && !LOCALES.some((l) => u.startsWith(`${SITE}/${l}/`)));
    const extra = locs.flatMap((u) => LOCALES.map((l) => `  <url><loc>${SITE}/${l}${u.slice(SITE.length) || '/'}</loc></url>`)).join('\n');
    xml = xml.replace(/<\/urlset>\s*$/, `${extra}\n</urlset>\n`);
    fs.writeFileSync(p, xml);
  }

  const counts = LOCALES.map((l) => `${l}: ${missing[l].size} missing`).join(', ');
  console.log(`i18n: ${pages.length} pages × ${ALL.length} languages written (${counts}).`);
  if (process.argv.includes('--strict') && LOCALES.some((l) => missing[l].size)) process.exit(1);
}

const mode = process.argv[2] || 'build';
if (mode === 'extract') extract();
else if (mode === 'check') process.exit(extract() ? 1 : 0);
else build();
