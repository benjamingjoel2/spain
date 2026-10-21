# Facts to verify

Everything on the site that a reader might rely on, and that could be wrong or out of date, is listed here. Nothing below has been checked against an official source yet. Tick each item once it has been verified, and note the source and date.

Sources to use: official festival and town-hall websites, regional tourism boards, Renfe (renfe.com), Iryo (iryo.eu), Ouigo (ouigo.com/es), Adif, AEMET for climate.

## 1. Festival dates and descriptions

Data: `src/data/festivals.mjs`. Many dates move each year (Easter, Carnival, Corpus Christi, "nearest weekend" rules). Check the date wording, the place and the description.

| ✓ | Festival | Place | Date as written on the site |
|---|---|---|---|
| [ ] | Cabalgata de Reyes | Towns and cities everywhere | Evening of 5 January |
| [ ] | Sant Antoni | Mallorca (Sa Pobla and other towns) | Around 16–17 January |
| [ ] | Tamborrada | San Sebastián | 24 hours from midnight on 19–20 January |
| [ ] | Calçotades | Valls and across Catalonia | Season roughly January to March; Valls holds its big festa in late January |
| [ ] | Cider house season (txotx) | Hills around Astigarraga and Hernani | Roughly mid-January to April |
| [ ] | Carnaval de Cádiz | Cádiz | February, before Lent (moves each year) |
| [ ] | Carnaval de Santa Cruz de Tenerife | Santa Cruz de Tenerife | February, before Lent (moves each year) |
| [ ] | Entroido | Laza, Verín and Xinzo de Limia | The days before Lent |
| [ ] | Festival de Jerez | Jerez de la Frontera | About two weeks in late February and early March |
| [ ] | Las Fallas | Valencia | 15–19 March, with events building from 1 March |
| [ ] | Semana Santa | Seville, Málaga, Granada and across Andalusia | Holy Week, the week before Easter (moves each year) |
| [ ] | Semana Santa | Zamora and Valladolid | Holy Week (moves each year) |
| [ ] | Cherry blossom (Cerezo en Flor) | Valle del Jerte | Usually late March to mid-April, depending on the weather |
| [ ] | Feria de Abril | Seville | A week in spring, usually two weeks after Easter |
| [ ] | Sant Jordi | Barcelona and all of Catalonia | 23 April |
| [ ] | Moros y Cristianos | Alcoi | Around 22–24 April |
| [ ] | Feria del Queso | Trujillo | Late April or early May |
| [ ] | Patios de Córdoba | Córdoba | About two weeks in early to mid May |
| [ ] | Feria del Caballo | Jerez de la Frontera | A week in May |
| [ ] | Corpus Christi | Granada | The week of Corpus Christi (moves with Easter) |
| [ ] | Hogueras de San Juan | Alicante | 20–24 June |
| [ ] | Noche de San Juan | A Coruña and the Galician coast | Night of 23 June |
| [ ] | Festes de Sant Joan | Ciutadella, Menorca | 23–24 June |
| [ ] | Fiestas de San Juan y de la Madre de Dios | Soria | Late June to early July |
| [ ] | Rapa das Bestas | Sabucedo | Usually the first weekend of July |
| [ ] | Festival de Teatro Clásico | Mérida | July and August |
| [ ] | Festa do Albariño | Cambados | Early August |
| [ ] | Festa do Polbo | O Carballiño | The second Sunday of August |
| [ ] | Semana Grande (Aste Nagusia) | Bilbao and San Sebastián | August, a week each (dates differ by city) |
| [ ] | Festa Major de Gràcia | Barcelona | About a week in mid-August |
| [ ] | La Tomatina | Buñol | The last Wednesday of August |
| [ ] | Fiestas de la Vendimia | Jerez de la Frontera | September |
| [ ] | Fiesta del Charco | La Aldea de San Nicolás, Gran Canaria | 11 September |
| [ ] | La Mercè | Barcelona | Several days around 24 September |
| [ ] | Concurs de Castells | Tarragona | Early October in even-numbered years |
| [ ] | Festa do Marisco | O Grove | Early to mid October |
| [ ] | Magosto | Villages across Galicia | Around 11 November (San Martiño) |
| [ ] | Montanera and matanza season | The dehesa | Roughly October to February |
| [ ] | Fira de Santa Llúcia | Barcelona | Late November to 23 December |
| [ ] | Nochevieja | Everywhere | 31 December |
| [ ] | Festa de l'Estendard | Palma, Mallorca | 31 December |

Also check these specific claims in the festival notes:

- [ ] Tamborrada: drumming runs for 24 hours from midnight, opening in Plaza de la Constitución.
- [ ] Las Fallas: daily firecracker display (mascletà) at 14:00, events from 1 March.
- [ ] La Tomatina is ticketed and lasts about an hour.
- [ ] Valle del Jerte: "over a million cherry trees".
- [ ] Concurs de Castells is held in even-numbered years, in a bullring, towers up to ten levels.
- [ ] Festa de l'Estendard marks the 1229 conquest of Palma.
- [ ] Ciutadella Sant Joan horse events take place on 23–24 June.
- [ ] Festa do Polbo is on the second Sunday of August.
- [ ] Fiesta del Charco is on 11 September.
- [ ] Mérida Classical Theatre Festival runs in July and August.

## 2. Train journey times

Data: `src/data/rail.mjs`. Times are rough fastest typical journey times. The planner adds them up and does not include waits at connections. Check each one against current timetables, and check that the service type is right (high-speed vs. regional) and that a direct service exists.

| ✓ | From | To | Time on site | Type |
|---|---|---|---|---|
| [ ] | Madrid | Toledo | 0h 35m | high-speed |
| [ ] | Madrid | Segovia | 0h 30m | high-speed |
| [ ] | Segovia | Valladolid | 0h 35m | high-speed |
| [ ] | Valladolid | León | 0h 40m | high-speed |
| [ ] | Valladolid | Burgos | 0h 45m | high-speed |
| [ ] | León | Oviedo | 1h 05m | high-speed |
| [ ] | Madrid | Salamanca | 1h 35m | high-speed |
| [ ] | Madrid | Zamora | 1h 10m | high-speed |
| [ ] | Zamora | Ourense | 1h 10m | high-speed |
| [ ] | Ourense | Santiago de Compostela | 0h 40m | high-speed |
| [ ] | Santiago de Compostela | A Coruña | 0h 30m | high-speed |
| [ ] | Santiago de Compostela | Pontevedra | 0h 35m | high-speed |
| [ ] | Pontevedra | Vigo | 0h 20m | high-speed |
| [ ] | Burgos | Vitoria-Gasteiz | 1h 20m | regional |
| [ ] | Vitoria-Gasteiz | San Sebastián | 1h 40m | regional |
| [ ] | Bilbao | San Sebastián | 2h 40m | regional |
| [ ] | Madrid | Zaragoza | 1h 20m | high-speed |
| [ ] | Zaragoza | Barcelona | 1h 30m | high-speed |
| [ ] | Barcelona | Girona | 0h 40m | high-speed |
| [ ] | Barcelona | Tarragona | 0h 35m | high-speed |
| [ ] | Tarragona | Valencia | 2h 30m | regional |
| [ ] | Madrid | Cuenca | 0h 55m | high-speed |
| [ ] | Cuenca | Valencia | 1h 00m | high-speed |
| [ ] | Valencia | Xàtiva | 0h 45m | regional |
| [ ] | Madrid | Alicante | 2h 20m | high-speed |
| [ ] | Valencia | Alicante | 1h 55m | regional |
| [ ] | Madrid | Córdoba | 1h 45m | high-speed |
| [ ] | Córdoba | Seville | 0h 45m | high-speed |
| [ ] | Córdoba | Málaga | 1h 00m | high-speed |
| [ ] | Córdoba | Granada | 1h 30m | high-speed |
| [ ] | Seville | Jerez de la Frontera | 1h 05m | regional |
| [ ] | Jerez de la Frontera | Cádiz | 0h 40m | regional |
| [ ] | Málaga | Ronda | 2h 00m | regional |
| [ ] | Madrid | Plasencia | 2h 30m | regional |
| [ ] | Plasencia | Cáceres | 0h 45m | regional |
| [ ] | Cáceres | Mérida | 0h 55m | regional |
| [ ] | Mérida | Seville | 3h 45m | regional |

Suggested nights per city (35 cities) are our editorial opinion, not facts.

Rail claims made in the text:

- [ ] Spain has "one of the largest high-speed rail networks in the world".
- [ ] Madrid–Ourense high-speed line: "under two and a half hours"; it used to take most of a day.
- [ ] The Basque Y high-speed link is still under construction.
- [ ] Extremadura: newer line links Plasencia, Cáceres, Mérida and Badajoz.
- [ ] Iryo and Ouigo compete on the busiest high-speed routes.
- [ ] High-speed trains have a bag scan and the gates close a few minutes before departure.
- [ ] Seville to Jerez is about an hour by regional train.
- [ ] The Sóller train is a historic wooden train (with a tram from Sóller to the port).
- [ ] Euskotren between Bilbao and San Sebastián is slower than the bus.
- [ ] Tenerife has a tram in the Santa Cruz–La Laguna area. There are no trains between islands.
- [ ] Balearic ferries depart from Barcelona, Valencia and Dénia.

## 3. The Spanish clock

Data: `src/data/clock.mjs`. Meal, kitchen, shop and siesta times are typical patterns, not rules. Check them against current local practice, especially:

- [ ] Restaurant kitchens: lunch about 13:30–16:00, dinner from about 20:30–21:00 to 23:30.
- [ ] Small shops: 10:00–14:00 and 17:00–20:30. Chains and department stores open all day until about 21:30–22:00.
- [ ] Most shops are closed on Sundays outside designated tourist areas.
- [ ] Summer "jornada intensiva" (mornings only) for many small shops and offices.
- [ ] Catalonia and the north eat earlier than Madrid and Andalusia.
- [ ] Free tapas with drinks in Granada, León and parts of Castile.
- [ ] Spain uses Central European Time (CET/CEST) on the peninsula. The Canaries are one hour behind (the clock widget uses Europe/Madrid).

## 4. Region guides

Data: `src/data/regions.mjs`, `src/data/content.mjs`. Check:

- [ ] Seville and Córdoba "often pass 40°C" in July and August.
- [ ] Cider house (txotx) season, roughly January to April.
- [ ] Calçot season, roughly January to March, and the Valls festa in late January.
- [ ] Santiago's Abastos market is open every morning except Sunday.
- [ ] Zamora has "more than twenty Romanesque churches".
- [ ] Montanera season, roughly October to February.
- [ ] Jerte cherry blossom, usually late March to mid-April.
- [ ] Mérida has "some of the finest Roman remains outside Italy" (editorial, but check it is fair).
- [ ] Monfragüe: vultures, eagles and black storks nest there.
- [ ] La Gomera's whistled language (Silbo Gomero), and Garajonay's laurel forest.
- [ ] Lanzarote: vines planted in pits in volcanic ash at La Geria; Malvasía.
- [ ] Garachico was rebuilt after a volcanic eruption and has natural rock pools.
- [ ] Pedraza's candlelit concerts in summer.
- [ ] Zafra is sometimes called "little Seville".
- [ ] Hervás has a well-preserved old Jewish quarter.
- [ ] Guadalupe has a parador in a former hospital.
- [ ] Sineu market is one of the oldest on Mallorca.
- [ ] Ourense has public outdoor hot-spring pools along the Miño.
- [ ] Manzanilla comes only from Sanlúcar de Barrameda; the descriptions of fino, amontillado and oloroso ageing.
- [ ] Tipping guidance (small change, 5–10% generous).
- [ ] "When to go" month notes and the region-by-month ratings are our opinion, but check the weather claims behind them.

## 5. Photos

Every photo was accepted only because its **Unsplash location tag** matches the place we use it for. A location tag is set by the photographer and can be wrong. Check each picture really shows the place in its caption.

| ✓ | Used for | Caption on site | Unsplash location tag | Photographer | Link |
|---|---|---|---|---|---|
| [ ] | home | Ronda, Andalusia | Ronda, Spain | Alexis Presa | https://unsplash.com/photos/white-buildings-on-a-hillside-with-olive-groves-kJ9n9D2Pkr4 |
| [ ] | andalusia | Plaza de España, Seville | Seville, Spain | Alex Dale | https://unsplash.com/photos/a-large-building-with-columns-and-a-clock-tower-in-the-background-hKPsdcCZ3-Q |
| [ ] | basque | San Sebastián, Basque Country | San Sebastián, Espagne | Pierre Archi | https://unsplash.com/photos/aerial-view-of-city-near-body-of-water-during-daytime-9lWNP1erd6E |
| [ ] | galicia | Malpica de Bergantiños, A Coruña | Malpica de Bergantiños, A Coruña, Spanje | Robert Jan Schokking | https://unsplash.com/photos/a-harbor-filled-with-lots-of-boats-next-to-tall-buildings-54Yc2t_iMzI |
| [ ] | catalonia | Girona, Catalonia | Girona, Spain | Fikri Rasyid | https://unsplash.com/photos/concrete-buildings-beside-body-of-water-iktq1plOejY |
| [ ] | castile | Plaza Mayor, Salamanca | Salamanca, Spain | Beth Macdonald | https://unsplash.com/photos/people-in-front-of-brown-concrete-building-during-daytime-vHzkbvDyGxY |
| [ ] | extremadura | Trujillo, Extremadura | Trujillo, Spain | Steve West | https://unsplash.com/photos/old-buildings-surround-a-fountain-in-a-sunny-plaza-W--BppsKDlE |
| [ ] | valencia | Valencia | Valencia, Spain | Eleni Afiontzi | https://unsplash.com/photos/a-large-group-of-people-inside-a-building-JkGyr3dDXHI |
| [ ] | balearics | Mallorca, Balearic Islands | Mallorca, Spanien | DJ Nick Otronic | https://unsplash.com/photos/green-and-brown-mountain-beside-blue-sea-under-blue-sky-during-daytime-jJT1cnE4SZ8 |
| [ ] | canaries | Santa Cruz de La Palma, Canary Islands | Santa Cruz de La Palma, Spain | Linda Gerbec | https://unsplash.com/photos/a-narrow-street-with-people-walking-down-it-yJUr-U73-58 |
| [ ] | food | San Sebastián, Basque Country | Donostia-San Sebastian, Spain | Andrea Huls Pareja | https://unsplash.com/photos/a-white-plate-topped-with-meat-and-vegetables-zbO0yIqHk0g |
| [ ] | pintxobar | Gandarias, San Sebastián | Gandarias, 31 de Agosto Kalea, Donostia / San Sebastián, Spain | Jason Zeis | https://unsplash.com/photos/lively-spanish-tapas-bar-with-hanging-hams-and-warm-lights-vuzv_X53Fag |
| [ ] | wine | Bodegas Luis Pérez, Jerez de la Frontera | Bodegas Luis Pérez, Jerez de la Frontera, Spain | Thomas Verbruggen | https://unsplash.com/photos/bunch-of-green-fruits-z2-MedUataE |
| [ ] | rail | Near El Caminito del Rey, Málaga | El Caminito del Rey, España | Dani Guitarra | https://unsplash.com/photos/white-and-black-metal-pipe-on-brown-rock-dgjgB-QCt9c |
| [ ] | ave | Sevilla-Santa Justa station | Estación Sevilla - Santa Justa, Calle Joaquin Morales y Torres, Seville, Spain | Marcelo | https://unsplash.com/photos/a-silver-train-traveling-down-train-tracks-next-to-a-loading-platform--tmU_UBtCpE |
| [ ] | festivals | Valencia | Valencia, Spain | Marcelo | https://unsplash.com/photos/a-group-of-people-standing-in-front-of-a-float-KSEFTfoH-ag |
| [ ] | whentogo | Granada, Andalusia | Granada, Spain | Kevin McMahon | https://unsplash.com/photos/brown-concrete-castle-on-top-of-mountain-during-daytime-KrDaqfYWjlw |
| [ ] | stays | Frigiliana, Andalusia | Frigiliana, Spain | Mateo Krossler | https://unsplash.com/photos/traditional-white-spanish-village-buildings-with-a-narrow-sunlit-street-xZy2Sf8XzaI |
| [ ] | about | Cádiz, Andalusia | Cádiz, Spain | Klaus Janowitz | https://unsplash.com/photos/a-city-next-to-a-body-of-water-hjuUJYvtwLk |
| [ ] | clock | Plaza de Santa Ana, Madrid | Plaza de Santa Ana, Madrid, España | Roberto  Arias | https://unsplash.com/photos/a-statue-of-a-man-is-in-the-middle-of-a-plaza-SYfSa_z1TFE |
| [ ] | cordoba | Córdoba, Andalusia | Córdoba, Spain | Saad Chaudhry | https://unsplash.com/photos/beige-castle-during-night-time-uYMyUKL1QSU |
| [ ] | galiciacoast | Playa de Patos, Pontevedra | Playa de Patos, Pontevedra, España | Alejandro Piñero Amerio | https://unsplash.com/photos/the-sun-is-setting-over-the-ocean-with-rocks-in-the-foreground-NbJHh2wJ7aY |
| [ ] | trujillo2 | Santa María la Mayor, Trujillo | Iglesia de Santa María la Mayor, Calle Santa María, Trujillo, Spain | Mario La Pergola | https://unsplash.com/photos/gothic-cathedral-interior-with-stone-arches-Kj1bNZj2CY4 |

Note: the home-page hero is tagged "Ronda, Spain", but houses built under an overhanging rock suggest it may be Setenil de las Bodegas, about 20 km away. Confirm with the photographer or replace it.

## 6. Placeholders to replace before launch

- [ ] Contact email, phone and address in `site.config.json` (currently example.com and +34 000 000 000).
- [ ] `contact.formEndpoint` (empty, so the form opens the visitor's email app).
- [ ] `site.url` (canonical URLs and sitemap).
- [ ] The nine stays on /stays/ are placeholders, not real properties.
- [ ] Journal bylines say "the team". Add real author names if you want them.
