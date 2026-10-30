// The Spanish clock. Times are typical patterns, not rules, and vary by
// region, city size and season. Listed in FACTS-TO-VERIFY.md.
// Times are "HH:MM"; hours past midnight are written as 24:30, 25:00 etc.

export const lanes = [
  { id: 'eat', label: 'Eating & drinking' },
  { id: 'kitchens', label: 'Restaurant kitchens' },
  { id: 'shops', label: 'Shops & markets' },
  { id: 'life', label: 'Street life' },
];

// Three versions of the day. Each block: lane, from, to, title, text.
export const days = {
  weekday: {
    label: 'Weekday',
    blocks: [
      { lane: 'eat', from: '07:30', to: '09:30', title: 'Desayuno', text: 'A quick first breakfast: coffee, and maybe toast or a pastry, often standing at a bar.' },
      { lane: 'eat', from: '10:30', to: '12:00', title: 'Almuerzo / second breakfast', text: 'A mid-morning break: toast with tomato, a slice of tortilla or a small sandwich. Bars are busy with office workers.' },
      { lane: 'eat', from: '13:00', to: '14:00', title: 'Caña or vermut', text: 'A small beer or a vermouth before lunch, usually with olives or a small free tapa.' },
      { lane: 'eat', from: '14:00', to: '16:00', title: 'Comida (lunch)', text: 'The main meal of the day. Look for the menú del día: two or three courses with bread and a drink at a fixed price.' },
      { lane: 'eat', from: '17:30', to: '19:00', title: 'Merienda', text: 'An afternoon snack, such as coffee and cake, churros, or a sandwich for children after school.' },
      { lane: 'eat', from: '20:00', to: '22:00', title: 'Tapas and cañas', text: 'Out for a drink and a few tapas, often moving between two or three bars.' },
      { lane: 'eat', from: '21:30', to: '23:30', title: 'Cena (dinner)', text: 'Dinner is usually lighter than lunch, and late. Restaurants fill up from about 21:30.' },
      { lane: 'kitchens', from: '13:30', to: '16:00', title: 'Lunch service', text: 'Most restaurant kitchens open for lunch from around 13:30 to 16:00.' },
      { lane: 'kitchens', from: '20:30', to: '23:30', title: 'Dinner service', text: 'Kitchens reopen around 20:30 to 21:00. Before that, many serve only drinks and cold tapas.' },
      { lane: 'shops', from: '09:00', to: '14:00', title: 'Food markets', text: 'Municipal markets are at their best in the morning. Many close by early afternoon.' },
      { lane: 'shops', from: '10:00', to: '14:00', title: 'Small shops (morning)', text: 'Independent shops open in the morning, then close for lunch.' },
      { lane: 'shops', from: '17:00', to: '20:30', title: 'Small shops (evening)', text: 'Independent shops reopen in the late afternoon and stay open into the evening.' },
      { lane: 'shops', from: '10:00', to: '21:30', title: 'Chains & department stores', text: 'Big stores and chains usually stay open all day.' },
      { lane: 'life', from: '15:30', to: '17:30', title: 'Sobremesa and siesta', text: 'Long conversations over coffee after lunch, or a rest. Small towns go very quiet. Not everyone sleeps, but few people hurry.' },
      { lane: 'life', from: '19:00', to: '21:30', title: 'The paseo', text: 'The evening stroll. Families, couples and friends walk the main street or the seafront, meeting people they know.' },
      { lane: 'life', from: '23:30', to: '26:00', title: 'Copas', text: 'A drink after dinner in a bar or on a terrace. In big cities on weekends, clubs fill up after 01:00.' },
    ],
  },
  sunday: {
    label: 'Sunday',
    blocks: [
      { lane: 'eat', from: '09:30', to: '11:30', title: 'Slow breakfast', text: 'Churros and chocolate, or a long coffee with the newspapers.' },
      { lane: 'eat', from: '12:30', to: '14:30', title: 'The vermut hour', text: 'Sunday\'s big ritual: vermouth on tap, crisps, olives and cockles, standing in a crowded bar or on a terrace.' },
      { lane: 'eat', from: '14:30', to: '17:30', title: 'Family lunch', text: 'The longest meal of the week. Restaurants are full of three generations. Book ahead.' },
      { lane: 'eat', from: '20:30', to: '22:30', title: 'A light supper', text: 'Many people eat something small at home. Some restaurants close on Sunday evening.' },
      { lane: 'kitchens', from: '13:30', to: '16:30', title: 'Lunch service', text: 'Restaurants are busy and often fully booked for Sunday lunch.' },
      { lane: 'kitchens', from: '20:30', to: '22:30', title: 'Limited dinner', text: 'Many restaurants close on Sunday nights (and often on Mondays). Check ahead.' },
      { lane: 'shops', from: '10:00', to: '14:00', title: 'Rastro and flea markets', text: 'Some cities have Sunday morning flea markets. Most other shops are closed, except in designated tourist areas.' },
      { lane: 'life', from: '11:00', to: '14:00', title: 'Morning paseo', text: 'People walk to mass, the market or the vermut bar in their Sunday clothes.' },
      { lane: 'life', from: '17:30', to: '19:30', title: 'Sobremesa', text: 'Lunch turns into coffee, then a digestif, then conversation.' },
      { lane: 'life', from: '19:30', to: '21:30', title: 'Evening paseo', text: 'A slower, family paseo before the working week.' },
    ],
  },
  summer: {
    label: 'Summer, inland',
    blocks: [
      { lane: 'eat', from: '08:00', to: '10:00', title: 'Desayuno', text: 'Coffee and toast while it is still cool.' },
      { lane: 'eat', from: '13:30', to: '14:30', title: 'Caña in the shade', text: 'A cold beer or tinto de verano under an awning.' },
      { lane: 'eat', from: '14:30', to: '16:30', title: 'Comida', text: 'Lunch in the coolest room in the house. Gazpacho or salmorejo to start.' },
      { lane: 'eat', from: '22:00', to: '24:30', title: 'Cena on a terrace', text: 'Dinner outdoors once the heat breaks. In the south, 22:30 is not late.' },
      { lane: 'kitchens', from: '13:30', to: '16:30', title: 'Lunch service', text: 'Some restaurants close in August for holidays. Look for a sign saying "cerrado por vacaciones".' },
      { lane: 'kitchens', from: '21:00', to: '24:00', title: 'Dinner service', text: 'Terraces stay busy past midnight.' },
      { lane: 'shops', from: '09:00', to: '14:00', title: 'Summer hours', text: 'Many small shops and offices work a "jornada intensiva" in summer: mornings only.' },
      { lane: 'shops', from: '18:00', to: '21:30', title: 'Evening opening', text: 'Some shops reopen when it cools down.' },
      { lane: 'life', from: '15:00', to: '19:00', title: 'Siesta hours', text: 'Inland streets are empty and shutters are down. This is the time to rest, swim or visit a cool museum.' },
      { lane: 'life', from: '20:30', to: '23:00', title: 'The paseo', text: 'Once it cools down, everyone comes out. Children play in the squares late into the night.' },
      { lane: 'life', from: '24:00', to: '27:00', title: 'Verbenas and late nights', text: 'Summer is fiesta season, with outdoor dances, music in the squares and terraces open late.' },
    ],
  },
};

// Plain-language advice for a given hour (applies to weekday and summer; Sunday has its own notes in the blocks).
export const tips = [
  { from: '06:00', to: '09:00', text: 'Early starts are quiet. Hotel breakfast or a bar counter is your best bet.' },
  { from: '09:00', to: '12:30', text: 'Best time for markets and sightseeing. Have a second breakfast like the locals.' },
  { from: '12:30', to: '13:30', text: 'Too early for lunch. Have a vermut or a caña and order a tapa.' },
  { from: '13:30', to: '15:30', text: 'Lunch time. This is the best-value meal of the day, so make it your main one.' },
  { from: '15:30', to: '17:30', text: 'Things slow down. Linger over coffee, rest, or visit a museum. Small-town shops are shut.' },
  { from: '17:30', to: '19:30', text: 'Shops reopen. Merienda time: coffee and something sweet will keep you going until dinner.' },
  { from: '19:30', to: '20:30', text: 'Arriving at a restaurant now? The kitchen is probably not open yet. Join the paseo, then order a drink and a tapa.' },
  { from: '20:30', to: '21:30', text: 'Tapas bars are busy. Restaurants are just opening and still mostly empty.' },
  { from: '21:30', to: '23:30', text: 'Dinner time. Restaurants are full and lively. This is when you want to be sitting down.' },
  { from: '23:30', to: '28:00', text: 'Kitchens are closing. Time for a copa on a terrace, or bed if you are sensible.' },
];
