# Regionale Geschenke und Fahrzeugpools

Aktuelle Quellen: `functions/src/gifts-runtime.js`, `functions/src/transport-cards.json`, `src/Gifts.tsx` (03.11.2026).

## Ablauf

Großhändler → Geschenke zeigt ein Geschenk je Region. Alle fünf sind testweise unabhängig vom Erkundungsfortschritt zu öffnen. Öffnen kostet serverseitig 10 Imperium-Taler und vergibt genau eine der fünf tatsächlichen regionalen Karten. Neue Karten beginnen auf Stufe 1; eine doppelte Karte gibt einen Splitter ihrer Seltenheit. Animation und Ergebnisdarstellung ändern weder Auslosung noch Vergabe.

Der aktuelle Katalog hat 25 Karten, fünf je Region: jeweils zwei Common, eine Uncommon, eine Rare und eine Epic. Namen, Bilder, Boni und Stufenwerte stehen zentral im [regionalen Kartenkatalog](../gameplay/regional-transport-cards.md); die früheren motorisierten Karten- und vorläufigen Bonuslisten gelten nicht mehr.

## Getrennte Chancen

| Quelle | Verteilung |
| --- | --- |
| Geschenk, aktuelle Testchancen | Jede der fünf Karten exakt 20 % |
| Expedition, innerhalb eines Kartenfunds | Common insgesamt 60 %, Uncommon 30 %, Rare 9 %, Epic 1 % |
| Expedition, absolute Kartenchance | 10 % insgesamt: je Common-Karte 3 %, Uncommon 3 %, Rare 0,9 %, Epic 0,1 % |

`regionGiftPool` ist die gemeinsame Quelle für Geschenkziehung und sichtbare Einzelchancen. `regionVehiclePool` bleibt für die gewichteten Expeditionsfunde zuständig. Preis, Guthaben, Vergabe, Duplikate und wiederholte Anfragen werden serverseitig behandelt.

Nach dem echten Ergebnis stoppt die Markierung; nach 350 ms öffnet ein separates Gewinnmodal. Schließen führt zur geöffneten Kiste zurück, siehe [Geschenk-Ergebnis](gift-result-modal.md). Keine reale Zahlung oder lokale Neuverlosung.

## Historischer Prüfbezug

Die ursprüngliche Erweiterung wurde mit damals 83 Backendtests einschließlich Besitz, Preisgrenzen, Duplikaten und transaktionaler Wiederholung geprüft. Der damalige Nachweis identischer Geschenk-/Expeditionspools ist durch die ausdrücklich getrennten Testchancen ersetzt. Aktuelle Tests und Grenzen: [tests/README.md](../../tests/README.md).
