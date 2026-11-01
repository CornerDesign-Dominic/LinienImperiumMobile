# Regionale Geschenke und 25 Fahrzeugkarten

Status: vorbereitet auf batch/mobile-adjustments, noch nicht veröffentlicht.

## Ablauf
Großhändler → Geschenke → Geschenk je Region. Das mittige Detailmodal zeigt alle fünf Fahrzeuge mit Seltenheitsfarben und Einzelchancen. Öffnen kostet aktuell serverseitig 10 normale Münzen und vergibt genau eine Karte. Das Ergebnis erscheint als mittiges Modal mit Fahrzeugsymbol oder Shardsymbol. Doppelte Karten geben einen Shard derselben Seltenheit. Keine echte Zahlung, Geschenkfunde oder Herstellungsrezepte aktiviert; diese Erweiterungen können später denselben Vergabepfad nutzen.

Alle fünf Geschenke sind im Großhändler sichtbar und testweise unabhängig vom Erkundungsfortschritt zu öffnen.

## Fahrzeugpools
Alle 15 bestehenden IDs, Boni und Fahrzeugwerte bleiben erhalten. Zehn neue Karten:
- Region 1: Landkurier (Common), Hafen-Transporter (Uncommon)
- Region 2: Frischekurier (Common), Kühlkonvoi (Epic)
- Region 3: Werkstoffwagen (Common), Schwerlast-Bergung (Epic)
- Region 4: Passkurier (Common), Alpen-Konvoi (Epic)
- Region 5: Marktfrachter (Common), Europa-Express (Epic)

Region 1: 2 Common, 2 Uncommon, 1 Rare.
Region 2–5: 2 Common, 1 Uncommon, 1 Rare, 1 Epic. Die Verteilung für Region 3–5 wurde analog Region 2 gewählt.
Kein Gebiet überschreitet 1 Epic oder 2 Rare.

Epic-Karten verwenden vorläufig 8 % Grundbonus und +2 Prozentpunkte pro Kartenstufe. Epic-Shards aus Duplikaten sind in Vorräten und Sammlung sichtbar und für Kartenstufen verwendbar; kein neuer Shard-Umtausch hinzugefügt.

## Testchancen (November 2026)
Geschenke: Jede der fünf Karten eines Gebietes hat testweise exakt 20 % Chance. Gemeint sind die fünf tatsächlichen Karten, nicht fünf erfundene Seltenheiten. Der aktuelle Fahrzeugkatalog enthält je Gebiet zwei Common-, eine Uncommon-, eine Rare- und eine Epic-Karte.

Expeditionen behalten ihre bisherigen Gewichte: insgesamt 10 % Kartenchance, pro Auslosung je Common-Karte 3 %, Uncommon 3 %, Rare 0,9 % und Epic 0,1 %. Die Auftragswahrscheinlichkeiten bleiben unverändert.

## Implementierung
`regionGiftPool` ist die gemeinsame Quelle für tatsächliche Geschenkziehung und sichtbare Einzelchancen im Geschenkmodal. `regionVehiclePool` bleibt ausschließlich für die bisher gewichteten Expeditionsfunde zuständig. Preis, Vergabe, Duplikate und transaktionale Anfragebelege bleiben unverändert.

## Validierung
83 Backendtests bestanden:
node --test --test-reporter=dot tests/gifts.test.cjs tests/mobile-engine.test.cjs tests/events.test.cjs tests/tour-updates.test.cjs tests/procurement.test.cjs

Sechs neue Tests prüfen alle 25 erreichbaren Karten, Poolverteilungen, gleiche Geschenk-/Expeditionspools, Kosten bei ausreichendem/exaktem/fehlendem Guthaben, unveränderte Eingabespielstände, Duplikate, Epic-Shards und Upgrades, Speicherrunden sowie echte Callable-Anfragewiederholung ohne doppelten Abzug oder doppelte Vergabe. Bestehende Katalogerwartungen auf 25 Karten und fünf Funde je Region aktualisiert. Zusätzlicher Epic-Inventartest vorbereitet.
node --check für index.cjs und gifts-runtime.js bestanden.
Kein vollständiger TypeScript-/Expo-Build oder Gerätetest ausgeführt. Der zusätzliche TypeScript-basierte Inventartest wurde hier mangels lokal installierter App-Abhängigkeiten noch nicht ausgeführt.
