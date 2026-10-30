// Rail network for the journey planner. Times are ROUGH fastest typical
// journey times in minutes, rounded. They change with timetables, and every
// edge is listed in FACTS-TO-VERIFY.md. Check renfe.com, iryo.eu or ouigo.com before booking.
//
// type: 'high-speed' (AVE, Avlo, Alvia on high-speed track, Iryo, Ouigo)
//       'regional'   (Media Distancia, Rodalies, Euskotren, Intercity)

export const cities = {
  madrid:      { name: 'Madrid', lat: 40.41, lon: -3.70, nights: 3, region: null, note: 'Hub of the high-speed network. Atocha and Chamartín stations.' },
  toledo:      { name: 'Toledo', lat: 39.86, lon: -4.02, nights: 1, region: null, note: 'Better overnight than as a day trip, when the crowds have gone.' },
  segovia:     { name: 'Segovia', lat: 40.95, lon: -4.12, nights: 2, region: 'castile-and-leon', note: 'Aqueduct, roast suckling pig and nearby walled villages.' },
  valladolid:  { name: 'Valladolid', lat: 41.65, lon: -4.72, nights: 1, region: 'castile-and-leon', note: 'Gateway to Ribera del Duero and Rueda wine country.' },
  burgos:      { name: 'Burgos', lat: 42.34, lon: -3.70, nights: 1, region: 'castile-and-leon', note: 'Gothic cathedral and morcilla.' },
  leon:        { name: 'León', lat: 42.60, lon: -5.57, nights: 2, region: 'castile-and-leon', note: 'Stained glass and free tapas with every drink in the Barrio Húmedo.' },
  salamanca:   { name: 'Salamanca', lat: 40.97, lon: -5.66, nights: 2, region: 'castile-and-leon', note: 'Golden stone, students and the Plaza Mayor at night.' },
  zamora:      { name: 'Zamora', lat: 41.50, lon: -5.75, nights: 1, region: 'castile-and-leon', note: 'Quiet Romanesque city on the Duero.' },
  ourense:     { name: 'Ourense', lat: 42.34, lon: -7.86, nights: 2, region: 'galicia', note: 'Hot springs and the Ribeira Sacra nearby.' },
  santiago:    { name: 'Santiago de Compostela', lat: 42.88, lon: -8.54, nights: 2, region: 'galicia', note: 'Cathedral city, and the Abastos market.' },
  coruna:      { name: 'A Coruña', lat: 43.36, lon: -8.41, nights: 2, region: 'galicia', note: 'Glazed galleries, a long seafront and excellent seafood.' },
  vigo:        { name: 'Vigo', lat: 42.24, lon: -8.72, nights: 1, region: 'galicia', note: 'Oysters on the Rúa da Pescadería and boats to the Cíes islands in summer.' },
  pontevedra:  { name: 'Pontevedra', lat: 42.43, lon: -8.64, nights: 2, region: 'galicia', note: 'A car-free old town, close to the Rías Baixas wineries.' },
  oviedo:      { name: 'Oviedo', lat: 43.36, lon: -5.85, nights: 2, region: null, note: 'Asturian cider houses and pre-Romanesque churches.' },
  vitoria:     { name: 'Vitoria-Gasteiz', lat: 42.85, lon: -2.67, nights: 1, region: 'basque-country', note: 'Green Basque capital, near Rioja Alavesa.' },
  sansebastian:{ name: 'San Sebastián', lat: 43.32, lon: -1.98, nights: 3, region: 'basque-country', note: 'Pintxos, La Concha bay and the fishing coast.' },
  bilbao:      { name: 'Bilbao', lat: 43.26, lon: -2.93, nights: 2, region: 'basque-country', note: 'The Guggenheim, the old town and the Ribera market.' },
  zaragoza:    { name: 'Zaragoza', lat: 41.65, lon: -0.88, nights: 1, region: null, note: 'Mudéjar towers and El Tubo\'s tapas bars.' },
  barcelona:   { name: 'Barcelona', lat: 41.39, lon: 2.17, nights: 3, region: 'catalonia', note: 'Where most journeys start or end. Sants station.' },
  girona:      { name: 'Girona', lat: 41.98, lon: 2.82, nights: 2, region: 'catalonia', note: 'Medieval old town, a base for the Empordà.' },
  tarragona:   { name: 'Tarragona', lat: 41.12, lon: 1.25, nights: 1, region: 'catalonia', note: 'Roman ruins by the sea, close to Priorat.' },
  valencia:    { name: 'Valencia', lat: 39.47, lon: -0.38, nights: 3, region: 'valencia', note: 'Rice at lunchtime, the Central Market and the Albufera.' },
  xativa:      { name: 'Xàtiva', lat: 38.99, lon: -0.52, nights: 1, region: 'valencia', note: 'A castle town, a short regional train ride south.' },
  alicante:    { name: 'Alicante', lat: 38.35, lon: -0.48, nights: 2, region: 'valencia', note: 'Seafront city, rice dishes and the old Santa Cruz quarter.' },
  cuenca:      { name: 'Cuenca', lat: 40.07, lon: -2.13, nights: 1, region: null, note: 'Hanging houses above a gorge.' },
  cordoba:     { name: 'Córdoba', lat: 37.89, lon: -4.78, nights: 2, region: 'andalusia', note: 'The Mezquita, patios and salmorejo.' },
  seville:     { name: 'Seville', lat: 37.39, lon: -5.98, nights: 3, region: 'andalusia', note: 'The great Andalusian city. Give it time.' },
  granada:     { name: 'Granada', lat: 37.18, lon: -3.60, nights: 2, region: 'andalusia', note: 'The Alhambra, the Albaicín and free tapas.' },
  malaga:      { name: 'Málaga', lat: 36.72, lon: -4.42, nights: 2, region: 'andalusia', note: 'Museums, the Atarazanas market and fried fish.' },
  jerez:       { name: 'Jerez de la Frontera', lat: 36.69, lon: -6.13, nights: 2, region: 'andalusia', note: 'Sherry bodegas, horses and flamenco.' },
  cadiz:       { name: 'Cádiz', lat: 36.53, lon: -6.29, nights: 2, region: 'andalusia', note: 'An ancient port city almost surrounded by sea.' },
  ronda:       { name: 'Ronda', lat: 36.74, lon: -5.17, nights: 2, region: 'andalusia', note: 'Gorge-top town on the scenic Algeciras line.' },
  caceres:     { name: 'Cáceres', lat: 39.47, lon: -6.37, nights: 2, region: 'extremadura', note: 'Walled old town, a base for Trujillo and the dehesa.' },
  merida:      { name: 'Mérida', lat: 38.92, lon: -6.34, nights: 1, region: 'extremadura', note: 'Roman theatre, bridge and amphitheatre.' },
  plasencia:   { name: 'Plasencia', lat: 40.03, lon: -6.09, nights: 1, region: 'extremadura', note: 'Close to the Valle del Jerte and Monfragüe.' },
};

// [from, to, minutes, type]
export const links = [
  ['madrid', 'toledo', 35, 'high-speed'],
  ['madrid', 'segovia', 30, 'high-speed'],
  ['segovia', 'valladolid', 35, 'high-speed'],
  ['valladolid', 'leon', 40, 'high-speed'],
  ['valladolid', 'burgos', 45, 'high-speed'],
  ['leon', 'oviedo', 65, 'high-speed'],
  ['madrid', 'salamanca', 95, 'high-speed'],
  ['madrid', 'zamora', 70, 'high-speed'],
  ['zamora', 'ourense', 70, 'high-speed'],
  ['ourense', 'santiago', 40, 'high-speed'],
  ['santiago', 'coruna', 30, 'high-speed'],
  ['santiago', 'pontevedra', 35, 'high-speed'],
  ['pontevedra', 'vigo', 20, 'high-speed'],
  ['burgos', 'vitoria', 80, 'regional'],
  ['vitoria', 'sansebastian', 100, 'regional'],
  ['bilbao', 'sansebastian', 160, 'regional'],
  ['madrid', 'zaragoza', 80, 'high-speed'],
  ['zaragoza', 'barcelona', 90, 'high-speed'],
  ['barcelona', 'girona', 40, 'high-speed'],
  ['barcelona', 'tarragona', 35, 'high-speed'],
  ['tarragona', 'valencia', 150, 'regional'],
  ['madrid', 'cuenca', 55, 'high-speed'],
  ['cuenca', 'valencia', 60, 'high-speed'],
  ['valencia', 'xativa', 45, 'regional'],
  ['madrid', 'alicante', 140, 'high-speed'],
  ['valencia', 'alicante', 115, 'regional'],
  ['madrid', 'cordoba', 105, 'high-speed'],
  ['cordoba', 'seville', 45, 'high-speed'],
  ['cordoba', 'malaga', 60, 'high-speed'],
  ['cordoba', 'granada', 90, 'high-speed'],
  ['seville', 'jerez', 65, 'regional'],
  ['jerez', 'cadiz', 40, 'regional'],
  ['malaga', 'ronda', 120, 'regional'],
  ['madrid', 'plasencia', 150, 'regional'],
  ['plasencia', 'caceres', 45, 'regional'],
  ['caceres', 'merida', 55, 'regional'],
  ['merida', 'seville', 225, 'regional'],
];

// Ready-made journeys shown on the rail page and loadable into the planner.
export const journeys = [
  {
    title: 'Andalusia by rail',
    stops: ['madrid', 'cordoba', 'seville', 'jerez', 'cadiz'],
    text: 'The classic southern line, slowed down. Fast to Córdoba, then shorter hops into sherry country and out to the sea at Cádiz. Ten to twelve nights.',
  },
  {
    title: 'Into green Spain',
    stops: ['madrid', 'ourense', 'santiago', 'coruna'],
    text: 'Madrid to Galicia used to take most of a day. The high-speed line now reaches Ourense in under two and a half hours. Add a driver for the Ribeira Sacra.',
  },
  {
    title: 'Castilian cities',
    stops: ['madrid', 'segovia', 'valladolid', 'leon', 'salamanca'],
    text: 'Golden stone, roast lamb and Ribera del Duero. All the cities are within an hour or two of each other.',
  },
  {
    title: 'The Mediterranean coast',
    stops: ['barcelona', 'girona', 'tarragona', 'valencia', 'xativa'],
    text: 'Medieval Girona and Roman Tarragona, then down the coast to Valencia and the rice fields, with a night in castle-topped Xàtiva.',
  },
];
