// Quality checks: WCAG AA contrast for every colour pair the CSS uses, and
// internal links that point at pages which don't exist. Run after `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const { palette } = JSON.parse(fs.readFileSync('site.config.json', 'utf8'));
let failed = false;

function lum(hex) {
  const [r, g, b] = hex.replace('#', '').match(/../g).map(h => parseInt(h, 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

// [foreground, background, minimum] – 4.5 for body text, 3 for large text / UI parts.
let pairs = [
  ['ink', 'whitewash', 4.5], ['ink', 'sand', 4.5], ['whitewash', 'olive', 4.5], ['inkSoft', 'oliveSoft', 4.5], ['sherryGoldSoft', 'atlantic', 4.5], ['terracottaDeep', 'sherryGoldSoft', 4.5], ['inkSoft', 'whitewash', 4.5], ['inkSoft', 'sand', 4.5],
  ['terracottaDeep', 'whitewash', 4.5], ['terracottaDeep', 'sand', 4.5],
  ['whitewash', 'terracottaDeep', 4.5], ['whitewash', 'terracotta', 4.5],
  ['whitewash', 'olive', 4.5], ['sherryGoldSoft', 'olive', 4.5],
  ['whitewash', 'atlantic', 4.5], ['sherryGold', 'atlantic', 4.5], ['sherryGoldSoft', 'atlantic', 4.5], ['atlanticSoft', 'atlantic', 4.5],
  ['ink', 'sherryGold', 4.5], ['ink', 'sherryGoldSoft', 4.5], ['ink', 'oliveSoft', 4.5], ['ink', 'atlanticSoft', 4.5],
  ['whitewash', 'ink', 4.5],
  ['atlantic', 'whitewash', 3], ['inkSoft', 'whitewash', 3], ['terracotta', 'whitewash', 3],
];
// Translucent text from site.css: color-mix(in srgb, A p%, transparent) drawn over B.
const mix = (a, p, b) => '#' + [0, 1, 2].map(i => {
  const ca = parseInt(palette[a].slice(1 + i * 2, 3 + i * 2), 16), cb = parseInt(palette[b].slice(1 + i * 2, 3 + i * 2), 16);
  return Math.round(ca * p / 100 + cb * (1 - p / 100)).toString(16).padStart(2, '0');
}).join('');
for (const [a, p, b] of [['whitewash', 70, 'atlantic'], ['whitewash', 70, 'ink'], ['whitewash', 65, 'ink'], ['whitewash', 80, 'olive'], ['whitewash', 85, 'olive']]) {
  palette[`${a}${p}On${b}`] = mix(a, p, b);
  pairs.push([`${a}${p}On${b}`, b, 4.5]);
}
console.log('Contrast (WCAG 2.x):');
for (const [fg, bg, min] of pairs) {
  const r = ratio(palette[fg], palette[bg]);
  const ok = r >= min;
  if (!ok) failed = true;
  console.log(`  ${ok ? 'pass' : 'FAIL'}  ${r.toFixed(2)}:1  ${fg} on ${bg} (needs ${min})`);
}

// Internal links
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); } })('dist');
const broken = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const target = path.join('dist', href, href.endsWith('/') || !path.extname(href) ? 'index.html' : '');
    if (!fs.existsSync(target) && !fs.existsSync(path.join('dist', href))) broken.add(`${f} -> ${href}`);
  }
}
console.log(`\nInternal links: ${files.length} pages checked, ${broken.size} broken`);
for (const b of broken) console.log('  ' + b);
if (broken.size) failed = true;
process.exit(failed ? 1 : 0);
