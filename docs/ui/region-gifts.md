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

## Vorläufige Chancen
Geschenke: Region 1 Common 60 %, Uncommon 30 %, Rare 10 %. Region 2–5 Common 60 %, Uncommon 30 %, Rare 9 %, Epic 1 %. Gleichverteilung innerhalb einer Seltenheit.
Expeditionen verwenden exakt denselben Pool, bei unverändert insgesamt 10 % Fahrzeugchance. Daher pro Auslosung Region 1 6/3/1 %, Region 2–5 6/3/0,9/0,1 %. Bestehende Auftragswahrscheinlichkeiten unverändert.
Diese Werte sind ein offener Balancevorschlag, keine finalen Echtgeldwahrscheinlichkeiten.

## Implementierung
Gemeinsamer Fahrzeugpool und Vergabepfad in gifts-runtime.js, serverseitiger Preis und geprüfter Regionsindex. Neue Kommandos nutzen bestehende Firestore-Transaktionen und Anfragebelege; das Geschenkresultat wird für Wiederholungen gespeichert.
Deutsche und englische Texte sowie Fundchancenhilfe ergänzt.

## Validierung
83 Backendtests bestanden:
node --test --test-reporter=dot tests/gifts.test.cjs tests/mobile-engine.test.cjs tests/events.test.cjs tests/tour-updates.test.cjs tests/procurement.test.cjs

Sechs neue Tests prüfen alle 25 erreichbaren Karten, Poolverteilungen, gleiche Geschenk-/Expeditionspools, Kosten bei ausreichendem/exaktem/fehlendem Guthaben, unveränderte Eingabespielstände, Duplikate, Epic-Shards und Upgrades, Speicherrunden sowie echte Callable-Anfragewiederholung ohne doppelten Abzug oder doppelte Vergabe. Bestehende Katalogerwartungen auf 25 Karten und fünf Funde je Region aktualisiert. Zusätzlicher Epic-Inventartest vorbereitet.
node --check für index.cjs und gifts-runtime.js bestanden.
Kein vollständiger TypeScript-/Expo-Build oder Gerätetest ausgeführt. Der zusätzliche TypeScript-basierte Inventartest wurde hier mangels lokal installierter App-Abhängigkeiten noch nicht ausgeführt.
