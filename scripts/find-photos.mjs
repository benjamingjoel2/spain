// Finds Unsplash candidates for each image slot and keeps ONLY photos whose
// Unsplash location metadata matches the place the slot is about.
// Usage: UNSPLASH_ACCESS_KEY=... node scripts/find-photos.mjs [slotKey...]
// Writes candidates to scripts/photo-candidates.json for a human to choose from.
import fs from 'node:fs';

const KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!KEY) { console.error('Set UNSPLASH_ACCESS_KEY'); process.exit(1); }

// slot -> search query + words that must appear in the photo's location
export const SLOTS = {
  home: { q: 'Andalusia white village', match: ['andaluc', 'andalus', 'zahara', 'arcos', 'grazalema', 'frigiliana', 'ronda', 'vejer', 'setenil', 'mojácar', 'mojacar', 'casares', 'olvera'] },
  andalusia: { q: 'Seville', match: ['sevill', 'sévill'] },
  basque: { q: 'San Sebastian', match: ['san sebasti', 'donostia'] },
  galicia: { q: 'Galicia coast', match: ['galicia', 'coruña', 'coruna', 'vigo', 'pontevedra', 'lugo', 'ourense', 'santiago de compostela', 'finisterre', 'fisterra', 'cíes', 'cies', 'ribeira sacra', 'cambados', 'combarro'] },
  catalonia: { q: 'Girona', match: ['girona', 'gerona'] },
  castile: { q: 'Salamanca Spain', match: ['salamanca'] },
  extremadura: { q: 'Trujillo Spain', match: ['cáceres', 'caceres', 'trujillo', 'mérida', 'merida', 'extremadura'] },
  valencia: { q: 'Valencia Spain', match: ['valencia', 'valència'] },
  balearics: { q: 'Mallorca', match: ['mallorca', 'majorca', 'menorca', 'ibiza', 'eivissa', 'formentera', 'balear'] },
  canaries: { q: 'La Palma Canary Islands', match: ['la palma', 'tenerife', 'gran canaria', 'lanzarote', 'fuerteventura', 'la gomera', 'el hierro', 'canary', 'canarias'] },
  food: { q: 'pintxos San Sebastian', match: ['san sebasti', 'donostia', 'bilbao', 'basque', 'euskadi', 'país vasco', 'pais vasco'] },
  wine: { q: 'Jerez de la Frontera', match: ['jerez'] },
  rail: { q: 'Renfe train', match: ['spain', 'españa', 'espana', 'espagne', 'spanien', 'madrid', 'barcelona', 'sevill', 'valencia', 'atocha'] },
  festivals: { q: 'Fallas Valencia', match: ['valencia', 'valència'] },
  whentogo: { q: 'Granada Alhambra', match: ['granada'] },
  stays: { q: 'Ronda Spain', match: ['ronda'] },
  about: { q: 'Cadiz Spain', match: ['cádiz', 'cadiz'] },
  clock: { q: 'Madrid street evening', match: ['madrid'] },
  ourense: { q: 'Ourense', match: ['ourense', 'orense'] },
  jerte: { q: 'Valle del Jerte cherry', match: ['jerte', 'cáceres', 'caceres', 'extremadura', 'plasencia', 'cabezuela', 'navaconcejo', 'tornavacas'] },
  journal: { q: 'Cordoba Spain', match: ['córdoba', 'cordoba'] },
};

const out = fs.existsSync('scripts/photo-candidates.json') ? JSON.parse(fs.readFileSync('scripts/photo-candidates.json', 'utf8')) : {};
const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SLOTS).filter(k => !out[k]);

for (const k of keys) {
  const { q, match } = SLOTS[k];
  const url = `https://api.unsplash.com/photos/random?count=30&orientation=landscape&content_filter=high&query=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${KEY}` } });
  console.error(k, res.status, 'remaining', res.headers.get('x-ratelimit-remaining'));
  if (!res.ok) break;
  const photos = await res.json();
  out[k] = photos
    .filter(p => {
      const loc = [p.location?.name, p.location?.city, p.location?.country].filter(Boolean).join(' | ').toLowerCase();
      return match.some(m => loc.includes(m));
    })
    .map(p => ({
      id: p.id, alt: p.alt_description, description: p.description,
      location: p.location?.name || [p.location?.city, p.location?.country].filter(Boolean).join(', '),
      w: p.width, h: p.height, color: p.color,
      raw: p.urls.raw, page: p.links.html, download: p.links.download_location,
      author: p.user.name, authorUrl: p.user.links.html,
    }));
  fs.writeFileSync('scripts/photo-candidates.json', JSON.stringify(out, null, 2));
}
