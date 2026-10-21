// Festivals calendar. `months` are 1–12. `region` is a region slug or 'nationwide'.
// Dates move: many follow Easter, the lunar calendar or a saint's day falling
// on a weekend. Every entry is listed in FACTS-TO-VERIFY.md. Confirm each year.

export const festivals = [
  {
    name: 'Cabalgata de Reyes', place: 'Towns and cities everywhere', region: 'nationwide', months: [1],
    when: 'Evening of 5 January',
    expect: 'The Three Kings parade through every town, throwing sweets to children. The next day is a family holiday, with roscón de reyes (a ring-shaped cake) for breakfast.',
    tip: 'Shops and many restaurants close on 6 January. Plan your meals ahead.',
  },
  {
    name: 'Sant Antoni', place: 'Mallorca (Sa Pobla and other towns)', region: 'balearics', months: [1],
    when: 'Around 16–17 January',
    expect: 'Bonfires in village squares, devils dancing to local music, and grilled sobrassada and botifarró sausages shared around the fires.',
  },
  {
    name: 'Tamborrada', place: 'San Sebastián', region: 'basque-country', months: [1],
    when: '24 hours from midnight on 19–20 January',
    expect: 'The whole city drums for a day. Companies dressed as cooks and soldiers march through the streets, and children\'s drum groups take over at midday.',
    tip: 'The opening at midnight in the Plaza de la Constitución is packed. Arrive early or watch from a side street.',
  },
  {
    name: 'Calçotades', place: 'Valls and across Catalonia', region: 'catalonia', months: [1, 2, 3],
    when: 'Season roughly January to March; Valls holds its big festa in late January',
    expect: 'Long lunches of sweet spring onions charred over vine cuttings, peeled by hand and dipped in romesco, followed by grilled meats.',
  },
  {
    name: 'Cider house season (txotx)', place: 'Hills around Astigarraga and Hernani', region: 'basque-country', months: [1, 2, 3, 4],
    when: 'Roughly mid-January to April',
    expect: 'When someone shouts "txotx!", everyone gets up to catch cider straight from the barrel. The set menu is cod omelette, salt cod, steak, then cheese with quince and walnuts.',
  },
  {
    name: 'Carnaval de Cádiz', place: 'Cádiz', region: 'andalusia', months: [2],
    when: 'February, before Lent (moves each year)',
    expect: 'Spain\'s wittiest carnival. Costumed groups sing sharp, satirical songs about politics and daily life in the streets and in a long-running competition.',
    tip: 'The street performances (the "ilegales") are free and often the funniest.',
  },
  {
    name: 'Carnaval de Santa Cruz de Tenerife', place: 'Santa Cruz de Tenerife', region: 'canaries', months: [2],
    when: 'February, before Lent (moves each year)',
    expect: 'One of the largest carnivals in the world, with costume galas, a vast parade and street parties that go on all night.',
  },
  {
    name: 'Entroido', place: 'Laza, Verín and Xinzo de Limia', region: 'galicia', months: [2],
    when: 'The days before Lent',
    expect: 'An ancient carnival in the villages of Ourense, with masked figures (peliqueiros, cigarróns) who run through the streets with cowbells. It is earthy, loud and very local.',
  },
  {
    name: 'Festival de Jerez', place: 'Jerez de la Frontera', region: 'andalusia', months: [2, 3],
    when: 'About two weeks in late February and early March',
    expect: 'A major flamenco festival with performances in the Villamarta theatre and smaller venues, plus classes for all levels.',
  },
  {
    name: 'Las Fallas', place: 'Valencia', region: 'valencia', months: [3],
    when: '15–19 March, with events building from 1 March',
    expect: 'Hundreds of huge satirical sculptures fill the streets, firecrackers go off at 2pm every day, and on the last night almost all of them are burned.',
    tip: 'Very loud and very busy. Book a room far in advance, and bring earplugs.',
  },
  {
    name: 'Semana Santa', place: 'Seville, Málaga, Granada and across Andalusia', region: 'andalusia', months: [3, 4],
    when: 'Holy Week, the week before Easter (moves each year)',
    expect: 'Brotherhoods carry huge floats through the streets day and night, with brass bands, incense and long silences. Moving and crowded.',
    tip: 'Hotel prices peak and some streets close. Check the procession routes and timings published locally.',
  },
  {
    name: 'Semana Santa', place: 'Zamora and Valladolid', region: 'castile-and-leon', months: [3, 4],
    when: 'Holy Week (moves each year)',
    expect: 'More austere than in the south. Silent night processions and carved wooden floats, some centuries old, through Romanesque streets.',
  },
  {
    name: 'Cherry blossom (Cerezo en Flor)', place: 'Valle del Jerte', region: 'extremadura', months: [3, 4],
    when: 'Usually late March to mid-April, depending on the weather',
    expect: 'Over a million cherry trees bloom up the valley sides, with local events in the villages.',
  },
  {
    name: 'Feria de Abril', place: 'Seville', region: 'andalusia', months: [4, 5],
    when: 'A week in spring, usually two weeks after Easter',
    expect: 'A temporary town of striped marquees (casetas), horses, flamenco dresses and sevillanas dancing until dawn. Many casetas are private.',
    tip: 'Go to the public casetas, or arrange an invitation through local friends or your hotel.',
  },
  {
    name: 'Sant Jordi', place: 'Barcelona and all of Catalonia', region: 'catalonia', months: [4],
    when: '23 April',
    expect: 'Catalonia\'s day of books and roses. Stalls cover Barcelona\'s streets, and people give each other books and roses.',
  },
  {
    name: 'Moros y Cristianos', place: 'Alcoi', region: 'valencia', months: [4],
    when: 'Around 22–24 April',
    expect: 'Three days of costumed "armies" re-enacting medieval battles, with spectacular entrance parades and gunpowder.',
  },
  {
    name: 'Feria del Queso', place: 'Trujillo', region: 'extremadura', months: [4, 5],
    when: 'Late April or early May',
    expect: 'Cheesemakers from across Spain fill Trujillo\'s Plaza Mayor for tastings.',
  },
  {
    name: 'Patios de Córdoba', place: 'Córdoba', region: 'andalusia', months: [5],
    when: 'About two weeks in early to mid May',
    expect: 'Families open flower-filled courtyards to visitors for free. Expect queues at the best-known patios.',
    tip: 'Go early in the morning or after 8pm, and walk the San Basilio and Santa Marina neighbourhoods.',
  },
  {
    name: 'Feria del Caballo', place: 'Jerez de la Frontera', region: 'andalusia', months: [5],
    when: 'A week in May',
    expect: 'A horse fair with carriages and riders through the day, fino in the casetas and dancing at night. More open to visitors than the Seville feria.',
  },
  {
    name: 'Corpus Christi', place: 'Granada', region: 'andalusia', months: [5, 6],
    when: 'The week of Corpus Christi (moves with Easter)',
    expect: 'Granada\'s main feria, with a procession, a fairground and casetas.',
  },
  {
    name: 'Hogueras de San Juan', place: 'Alicante', region: 'valencia', months: [6],
    when: '20–24 June',
    expect: 'Like Valencia\'s Fallas in summer: sculptures, daily firecracker displays and bonfires on the night of 24 June.',
  },
  {
    name: 'Noche de San Juan', place: 'A Coruña and the Galician coast', region: 'galicia', months: [6],
    when: 'Night of 23 June',
    expect: 'Bonfires on the beaches, grilled sardines and jumping over the flames at midnight for luck.',
  },
  {
    name: 'Festes de Sant Joan', place: 'Ciutadella, Menorca', region: 'balearics', months: [6],
    when: '23–24 June',
    expect: 'Riders rear their horses up through the crowds in the old town. Exciting and crowded, so stand well back.',
  },
  {
    name: 'Fiestas de San Juan y de la Madre de Dios', place: 'Soria', region: 'castile-and-leon', months: [6],
    when: 'Late June to early July',
    expect: 'One of the oldest town festivals in Castile, with neighbourhood groups, bull-related events and a lot of shared food.',
  },
  {
    name: 'Rapa das Bestas', place: 'Sabucedo', region: 'galicia', months: [7],
    when: 'Usually the first weekend of July',
    expect: 'Wild horses are brought down from the hills, and their manes are cut and cleaned by hand in a village enclosure.',
  },
  {
    name: 'Festival de Teatro Clásico', place: 'Mérida', region: 'extremadura', months: [7, 8],
    when: 'July and August',
    expect: 'Greek and Roman plays performed at night in the 2,000-year-old Roman theatre.',
    tip: 'Bring a cushion. The stone seats are hard and still warm from the day.',
  },
  {
    name: 'Festa do Albariño', place: 'Cambados', region: 'galicia', months: [8],
    when: 'Early August',
    expect: 'A wine festival in the Rías Baixas, with tastings from local producers, music and seafood.',
  },
  {
    name: 'Festa do Polbo', place: 'O Carballiño', region: 'galicia', months: [8],
    when: 'The second Sunday of August',
    expect: 'Thousands of people eat octopus prepared by pulpeiras in a park among the oak trees. A local favourite.',
  },
  {
    name: 'Semana Grande (Aste Nagusia)', place: 'Bilbao and San Sebastián', region: 'basque-country', months: [8],
    when: 'August, a week each (dates differ by city)',
    expect: 'Concerts, Basque rural sports and an international fireworks contest over La Concha bay in San Sebastián.',
  },
  {
    name: 'Festa Major de Gràcia', place: 'Barcelona', region: 'catalonia', months: [8],
    when: 'About a week in mid-August',
    expect: 'Neighbours decorate their streets with handmade themes and hold concerts and long tables in the street.',
  },
  {
    name: 'La Tomatina', place: 'Buñol', region: 'valencia', months: [8],
    when: 'The last Wednesday of August',
    expect: 'A huge tomato fight lasting about an hour. It is now ticketed. Fun if you want it, but not slow travel.',
  },
  {
    name: 'Fiestas de la Vendimia', place: 'Jerez de la Frontera', region: 'andalusia', months: [9],
    when: 'September',
    expect: 'The grape harvest festival, with treading of the first grapes, open bodegas and flamenco.',
  },
  {
    name: 'Fiesta del Charco', place: 'La Aldea de San Nicolás, Gran Canaria', region: 'canaries', months: [9],
    when: '11 September',
    expect: 'At a signal, the whole town jumps into a coastal lagoon to "fish" with their hands, a tradition that goes back centuries.',
  },
  {
    name: 'La Mercè', place: 'Barcelona', region: 'catalonia', months: [9],
    when: 'Several days around 24 September',
    expect: 'Barcelona\'s main festival: human towers in Plaça Sant Jaume, giants parades and the correfoc, where devils run through the crowds with fireworks.',
    tip: 'For the correfoc, wear old cotton clothes with long sleeves and a hat.',
  },
  {
    name: 'Concurs de Castells', place: 'Tarragona', region: 'catalonia', months: [10],
    when: 'Early October in even-numbered years',
    expect: 'The biennial championship of human towers, held in a bullring. Teams build towers up to ten levels high.',
  },
  {
    name: 'Festa do Marisco', place: 'O Grove', region: 'galicia', months: [10],
    when: 'Early to mid October',
    expect: 'A seafood festival in the Rías Baixas, with stalls of percebes, scallops, oysters and crab.',
  },
  {
    name: 'Magosto', place: 'Villages across Galicia', region: 'galicia', months: [11],
    when: 'Around 11 November (San Martiño)',
    expect: 'Chestnuts roasted over bonfires, young wine and seasonal sausages. A small, village celebration of autumn.',
  },
  {
    name: 'Montanera and matanza season', place: 'The dehesa', region: 'extremadura', months: [11, 12],
    when: 'Roughly October to February',
    expect: 'Not a single festival, but the season when Iberian pigs feed on acorns, and some villages hold food days around the traditional matanza.',
  },
  {
    name: 'Fira de Santa Llúcia', place: 'Barcelona', region: 'catalonia', months: [11, 12],
    when: 'Late November to 23 December',
    expect: 'Barcelona\'s Christmas market by the cathedral, selling nativity figures, moss, and the caganer, a Catalan figure who is hidden in every nativity scene.',
  },
  {
    name: 'Nochevieja', place: 'Everywhere', region: 'nationwide', months: [12],
    when: '31 December',
    expect: 'At midnight, everyone eats twelve grapes, one at each chime of the clock, then goes out. Dinner is at home with family. Restaurants that open charge a lot.',
  },
  {
    name: 'Festa de l\'Estendard', place: 'Palma, Mallorca', region: 'balearics', months: [12],
    when: '31 December',
    expect: 'One of Europe\'s oldest civic festivals, marking the 1229 Christian conquest of the city, with a procession through the centre.',
  },
];

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
