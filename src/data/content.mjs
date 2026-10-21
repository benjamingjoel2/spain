// Editorial content: food & wine, when to go, stays, journal.

export const food = {
  rules: [
    { title: 'Make lunch the main meal', text: 'Midweek, the menú del día (two or three courses, bread, a drink, often coffee) is the best value in Spanish eating. Locals have it between 14:00 and 16:00.' },
    { title: 'Tapas, raciones, pintxos', text: 'A tapa is a small plate, sometimes free with a drink in Granada, León and parts of Castile. A media ración is half a sharing plate, and a ración a full one. In the Basque Country, pintxos are small bites, often on bread.' },
    { title: 'Order in rounds', text: 'Don\'t order everything at once. Ask for two or three plates, share them, then order more. It is how the table is meant to work.' },
    { title: 'Ask for the bill', text: 'Nobody will bring it until you ask. "La cuenta, por favor" is all you need. Lingering is expected.' },
    { title: 'Tipping', text: 'Service is not usually added. Locals leave small change or round up. Five to ten percent is generous for a good meal.' },
    { title: 'Sobremesa', text: 'The talk after a meal, over coffee, a digestif or nothing at all. Nobody will rush you. It is the best part of eating in Spain.' },
  ],
  dishes: [
    { region: 'andalusia', name: 'Salmorejo and pescaíto frito', text: 'A thick, cold tomato and bread cream from Córdoba, and small fish fried crisp in olive oil on the coast.' },
    { region: 'basque-country', name: 'Pintxos and bacalao', text: 'Small bites at the bar, and salt cod cooked a dozen ways, including al pil-pil.' },
    { region: 'galicia', name: 'Pulpo á feira', text: 'Octopus boiled in copper pots, cut with scissors and finished with paprika, oil and salt.' },
    { region: 'catalonia', name: 'Calçots and romesco', text: 'Charred spring onions dipped in a sauce of nuts, peppers and garlic, in season from roughly January to March.' },
    { region: 'castile-and-leon', name: 'Lechazo asado', text: 'Milk-fed lamb roasted in a wood-fired oven, with just water and salt.' },
    { region: 'extremadura', name: 'Jamón ibérico de bellota', text: 'Ham from Iberian pigs that fattened on acorns in the dehesa.' },
    { region: 'valencia', name: 'Paella valenciana', text: 'Rice with chicken, rabbit and beans, cooked over a wood fire. A lunch dish.' },
    { region: 'balearics', name: 'Sobrassada and ensaïmada', text: 'A soft paprika sausage, and a spiral pastry for breakfast.' },
    { region: 'canaries', name: 'Papas arrugadas con mojo', text: 'Small potatoes boiled in salty water, with red and green sauces.' },
  ],
  wines: [
    { name: 'Sherry (Jerez)', region: 'andalusia', text: 'From bone-dry fino and salty manzanilla to nutty amontillado, rich oloroso and sticky Pedro Ximénez. It goes with almost everything.' },
    { name: 'Rías Baixas', region: 'galicia', text: 'Fresh, aromatic Albariño from the Atlantic coast, made for shellfish.' },
    { name: 'Ribeira Sacra', region: 'galicia', text: 'Light, bright reds (mostly Mencía) from terraces above the river canyons.' },
    { name: 'Txakoli', region: 'basque-country', text: 'Sharp, low-alcohol white from the Basque coast, poured from a height.' },
    { name: 'Ribera del Duero and Toro', region: 'castile-and-leon', text: 'Powerful Tempranillo reds from the high plateau. Rueda, nearby, makes crisp Verdejo whites.' },
    { name: 'Priorat and Penedès', region: 'catalonia', text: 'Dense reds from steep slate slopes, and cava from the hills near Barcelona.' },
    { name: 'Lanzarote Malvasía', region: 'canaries', text: 'Volcanic white wine from vines planted in pits of black ash.' },
  ],
};

export const months = [
  { m: 'January', good: 'Canaries sunshine, city breaks, Basque cider houses, calçots in Catalonia.', watch: 'Cold on the plateau. Short days. Shops close on 6 January.' },
  { m: 'February', good: 'Carnival in Cádiz and the Canaries, almond blossom in the south, flamenco in Jerez.', watch: 'Cool evenings everywhere. Mountain villages can be very quiet.' },
  { m: 'March', good: 'Fallas in Valencia, early spring in Andalusia, cherry blossom in the Jerte (late March, if the weather allows).', watch: 'Holy Week may fall here. Hotel prices rise and some streets close.' },
  { m: 'April', good: 'Andalusia in bloom, Sant Jordi in Catalonia, green dehesa in Extremadura.', watch: 'Easter crowds and prices. Seville\'s feria fills the city.' },
  { m: 'May', good: 'One of the best months almost everywhere. Córdoba\'s patios, Jerez horse fair, long evenings.', watch: 'Late May can already be hot in the Guadalquivir valley.' },
  { m: 'June', good: 'Galicia, the Basque coast, Castile. San Juan bonfires on 23 June.', watch: 'Heat building in Seville and Córdoba. Schools break up late in the month.' },
  { m: 'July', good: 'The north coast, the Galician rías, theatre in Mérida, mountain villages.', watch: 'Very hot inland in the south. Coasts are busy.' },
  { m: 'August', good: 'Village fiestas everywhere, Galician food festivals, the Basque Semana Grande.', watch: 'Peak crowds and prices on the coasts. Some city restaurants close for holidays.' },
  { m: 'September', good: 'Harvest in Jerez and the wine regions, warm sea, La Mercè in Barcelona.', watch: 'Early September is still very hot in the south.' },
  { m: 'October', good: 'One of the best months almost everywhere. Mushrooms, seafood festivals, soft light.', watch: 'More rain in the north, especially later in the month.' },
  { m: 'November', good: 'Andalusia and Extremadura without crowds, magosto chestnuts in Galicia, the montanera in the dehesa.', watch: 'Shorter days. Some coastal hotels close for winter.' },
  { m: 'December', good: 'Christmas markets, city lights, the Canaries, cosy dinners in Castile.', watch: 'Christmas Eve and New Year\'s Eve are family nights. Many restaurants close or charge a lot.' },
];

// Season guide per region: rating per month (3 = best, 2 = good, 1 = possible but with caveats).
// Qualitative and our own opinion. See FACTS-TO-VERIFY.md.
export const seasonGrid = {
  'andalusia':        [2, 2, 3, 3, 3, 2, 1, 1, 2, 3, 3, 2],
  'basque-country':   [1, 1, 2, 2, 3, 3, 3, 2, 3, 3, 2, 1],
  'galicia':          [1, 1, 1, 2, 2, 3, 3, 3, 3, 2, 1, 1],
  'catalonia':        [2, 2, 2, 3, 3, 3, 2, 1, 3, 3, 2, 2],
  'castile-and-leon': [1, 1, 2, 2, 3, 3, 2, 2, 3, 3, 2, 1],
  'extremadura':      [2, 2, 3, 3, 3, 2, 1, 1, 2, 3, 3, 2],
  'valencia':         [2, 2, 3, 3, 3, 2, 1, 1, 2, 3, 3, 2],
  'balearics':        [1, 1, 2, 3, 3, 3, 1, 1, 3, 3, 2, 1],
  'canaries':         [3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3],
};

export const stays = [
  { name: 'Cortijo Placeholder Uno', region: 'andalusia', kind: 'Farmhouse among olive groves', why: 'A whitewashed cortijo with a handful of rooms, outdoor lunches and a short drive to a sherry town.' },
  { name: 'Casa Placeholder del Puerto', region: 'basque-country', kind: 'Townhouse by a fishing harbour', why: 'Small rooms with harbour views, walking distance to the grills and the coastal path.' },
  { name: 'Pazo Placeholder', region: 'galicia', kind: 'Restored Galician manor', why: 'Granite manor house with its own vines, close to the Rías Baixas.' },
  { name: 'Mas Placeholder', region: 'catalonia', kind: 'Stone farmhouse in the Empordà', why: 'Old stone, a long table and bikes to reach the villages.' },
  { name: 'Posada Placeholder', region: 'castile-and-leon', kind: 'Village inn on the plateau', why: 'Thick walls, a wood-fired oven nearby and a walled village outside the door.' },
  { name: 'Finca Placeholder de la Dehesa', region: 'extremadura', kind: 'Working estate in the dehesa', why: 'Cork oaks, Iberian pigs and very dark skies.' },
  { name: 'Alquería Placeholder', region: 'valencia', kind: 'Farmhouse in the huerta', why: 'Among orange groves and rice fields, a short bike ride from the Albufera.' },
  { name: 'Sa Placeholder', region: 'balearics', kind: 'Mountain village house', why: 'Terraced garden, citrus trees and a walk to the Sóller tram.' },
  { name: 'Casa Placeholder Canaria', region: 'canaries', kind: 'Balconied townhouse', why: 'Wooden balconies, a patio and the old town on your doorstep.' },
];

export const journal = [
  {
    slug: 'dinner-at-ten',
    title: 'Dinner at ten: a field guide to Spanish hours',
    dek: 'Why the restaurant was empty at seven, and how to change your day so it isn\'t.',
    date: '2026-09-14',
    photo: 'pintxobar',
    region: 'basque-country',
    body: `
<p>Almost every first trip to Spain includes the same evening. You are hungry at seven, you find a restaurant that looks perfect, and it is empty, or the chairs are still on the tables, or a waiter tells you the kitchen opens "a las nueve". You eat a sad sandwich and go to bed, and somewhere around eleven you hear the street outside fill up.</p>
<p>Spain isn't eating late because it is disorganised. Spaniards eat on a different schedule, and once you understand it, it is one of the great pleasures of the country.</p>
<h2>Lunch is the main event</h2>
<p>The big meal of the day is lunch, <em>la comida</em>, eaten between about two and four. On weekdays most restaurants offer a <em>menú del día</em>: a starter, a main, bread, a drink and dessert or coffee, at a fixed price. It is the best value in Spanish eating, and the place to try the regional dishes that dinner menus often skip.</p>
<p>If you eat a proper lunch, a late dinner stops being a problem. You won't be starving at seven.</p>
<h2>The afternoon bridge</h2>
<p>Between lunch and dinner there is the <em>merienda</em>: a coffee and something sweet in the late afternoon. Then comes the <em>paseo</em>, the evening stroll that starts as the heat goes out of the day. It is not a tourist activity. It is simply what people do, and the best way to see a town.</p>
<p>After that, a drink and a tapa or two in a bar. Kitchens open around half past eight or nine. By half past nine the dining rooms are filling up, and by ten they are loud.</p>
<h2>How to adjust in one day</h2>
<p>On your first day, eat breakfast late, have lunch at two, and don't look for dinner before nine. Take a long rest after lunch if you can. By the second evening, eating at ten will feel normal.</p>
<p>Use our <a href="/spanish-clock/">Spanish clock</a> to see what is open at any hour, and remember that the north and Catalonia run a little earlier than Madrid and the south, while summer pushes everything later.</p>
`,
  },
  {
    slug: 'three-glasses-of-sherry',
    title: 'Three glasses of sherry',
    dek: 'Fino, amontillado, oloroso: a short, practical guide to the wine of Jerez.',
    date: '2026-08-02',
    photo: 'wine',
    region: 'andalusia',
    body: `
<p>Sherry has an image problem in much of the world: a sweet bottle at the back of a cupboard, kept for Christmas. In Jerez, El Puerto de Santa María and Sanlúcar de Barrameda, the three towns of the "sherry triangle", it is a cold, dry glass with lunch, poured from a bottle opened that day.</p>
<h2>The first glass: fino (or manzanilla)</h2>
<p>Fino is pale, dry and saline. It is aged under a layer of yeast called <em>flor</em>, which protects it from the air and gives it a taste of bread and almonds. Manzanilla is the same style made in Sanlúcar, by the sea, and is often lighter and saltier. Drink either very cold, with olives, almonds, ham, fried fish or prawns.</p>
<h2>The second glass: amontillado</h2>
<p>Amontillado starts as fino. Then the flor dies away and the wine continues to age in contact with the air. It turns amber and tastes of hazelnuts, while staying dry. It is lovely with soups, mushrooms and white meat.</p>
<h2>The third glass: oloroso</h2>
<p>Oloroso never grows flor. It ages with oxygen from the start and becomes darker, rounder and richer, though it is still dry. Try it with stews, game or a piece of aged cheese. The sweet sherries, such as Pedro Ximénez and cream, are a separate category, best poured over ice cream or drunk with dessert.</p>
<h2>Visiting</h2>
<p>Most large bodegas in Jerez offer tours, but the small ones are often more memorable. Book ahead, avoid the hottest hours in summer, and stay overnight so you are not driving. Jerez is about an hour from Seville by regional train.</p>
`,
  },
  {
    slug: 'galicia-by-fast-train',
    title: 'The fast train to slow Galicia',
    dek: 'How a new rail line changed the way we plan trips to Spain\'s Atlantic corner.',
    date: '2026-06-20',
    photo: 'galiciacoast',
    region: 'galicia',
    body: `
<p>For years, getting from Madrid to Galicia meant a long day on a slow train, a flight, or a drive across the whole plateau. The high-speed line to Ourense changed that. The journey through the mountains of Zamora and Sanabria, with its long tunnels and viaducts, now takes about the length of a long lunch.</p>
<h2>Start in Ourense</h2>
<p>Most people go straight on to Santiago. We suggest getting off at Ourense. It is a working city with a lively old quarter of tapas bars, and hot springs that bubble up in the centre and along the Miño river, where there are public outdoor pools.</p>
<p>Ourense is also the nearest city to the Ribeira Sacra, where vineyards cling to terraces above the Sil and Miño canyons. You will need a car or a driver for a day or two there, but the reward is some of the most dramatic wine country in Europe.</p>
<h2>Then follow the coast</h2>
<p>From Ourense, the fast line continues to Santiago in well under an hour, and the Atlantic Axis line connects A Coruña, Santiago, Pontevedra and Vigo. Pontevedra, with its car-free old town, is a good base for the Rías Baixas, the Albariño wineries and the seafood towns of the coast.</p>
<p>Plan on at least a week. It rains here, and the best days are often the ones you spend sheltering in a bar with a plate of octopus.</p>
`,
  },
  {
    slug: 'spring-in-extremadura',
    title: 'Spring in Extremadura',
    dek: 'Storks on the church towers, green dehesa and Spain\'s quietest great towns.',
    date: '2026-04-11',
    photo: 'extremadura',
    region: 'extremadura',
    body: `
<p>Extremadura gets fewer foreign visitors than almost anywhere else on the Spanish mainland. In spring that seems strange, because this is when the region is at its best.</p>
<h2>The dehesa turns green</h2>
<p>Much of Extremadura is dehesa, open pasture scattered with cork and holm oaks. In late summer it is gold and dry. In spring the grass is green and full of wildflowers, and you can watch storks nesting on almost every church tower in Cáceres, Trujillo and the villages between them.</p>
<h2>Two towns, slowly</h2>
<p>Cáceres has one of the best-preserved old towns in Spain, a walled maze of palaces and towers that is wonderfully quiet at night. Trujillo, less than an hour away, has a castle above a huge main square ringed with arcades. Stay in one and visit the other, and leave time for long lunches.</p>
<h2>North to the blossom</h2>
<p>If you time it right, usually late March to early April, the Valle del Jerte in the north of the region is covered in cherry blossom. The exact dates depend on the weather, so stay flexible and book somewhere with a free cancellation policy.</p>
<p>Come back in autumn for the montanera, when the black Iberian pigs feed on fallen acorns, and the ham that comes from it.</p>
`,
  },
];
