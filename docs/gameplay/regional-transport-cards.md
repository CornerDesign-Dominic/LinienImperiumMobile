# Regionale Transporterkarten mit vollständigen Bildern

Aktuelle Mobile-Referenz, abgeglichen am 03.11.2026. Wertequelle: [transport-cards.json](../../functions/src/transport-cards.json), Wirkung: [transport-runtime.js](../../functions/src/transport-runtime.js). Die [Kartenbonus-Staffeln](../ui/card-bonus-steps.md) beschreiben die aktuellen einfachen Schritte. Veröffentlichungs- und Testangaben am Ende sind historische Nachweise.

25 Landtransporter ersetzen die bisherigen generischen LKW-Namen. Keine Flug- oder Wasserfahrzeuge, Elefanten bleiben für spätere legendäre Karten reserviert. Die 25 Besitz-IDs bleiben stabil. Kronenlande erhält nun ebenfalls eine Epic-Karte; die bisherige ID `r1_uncommon_2` wird dafür weiterverwendet. Vorhandener Kartenbesitz und Kartenlevel bleiben erhalten, vorhandene Shards bleiben in ihren bisherigen Seltenheitspools.

## Werte und Ausbau

Tempo 100 entspricht 1 km/s leer, vor Rang- und Kartenboni. Kapazitätsmodule geben je 5 % der individuellen Grundkapazität, zehn Stufen. Geschwindigkeitsränge bleiben bei +0,5 % des individuellen Basistempos pro Rang. Bestehende Modullevel, ausgegebene Module, Ränge und Fahrstatistiken bleiben erhalten; Kapazität wird einmalig auf die neue Grundkapazität mit dem vorhandenen Modullevel umgerechnet. Bereits gestartete Tour-Snapshots werden nicht verändert, neue Touren nutzen die neuen Werte. Alte Modullevel über zehn bleiben bestehen; weitere Kapazitätskäufe sind dann gesperrt.

Jede Karte besitzt genau einen Bonus. Eigenboni gelten für das Fahrzeug, Flottenboni einschließlich des Gebers für die eingesetzte Flotte, Garagenboni einschließlich des Gebers für alle Garagenfahrzeuge (auch Stadttransporter). Verschiedene Transportboni addieren sich. Bestehende Einsatzregeln der drei Flottenvorlagen bleiben erhalten. Beschaffung behält ihre festen Preise und Beutemengen; individuelles Tempo beeinflusst die nächste Beschaffungstour.

## Punkte und Timer

* Rufus – der Postbote: Überstundenmaximum, Nuri – der Wasserträger: Expeditionsmaximum. Level 1–10: +5/10/15/20/25/30/40/50/60/70 Punkte, getrennt voneinander.
* Lian – der Jadewächter: Expeditionsintervall −10/20/30/40/50/60/75/90/105/120 Sekunden. Basis zehn Minuten, auf Level 10 acht Minuten. Überstundenintervall bleibt zehn Minuten.
* Diese drei Boni wirken nur, wenn die Karte in `game.trucks` zur Garage gehört, auch während Einzelaufträgen oder Beschaffung. Besitz, Sammlung und alleinige Flottenvorlage aktivieren sie nicht. Ausbauten geparkter Karten belegen keinen aktiven Garagenplatz.
* Ausrüstung erhöht nur das Maximum, niemals den Punktestand. Grundmaximum und Ausrüstungsbonus werden getrennt gehalten, damit Neuladen den Bonus nicht aufaddiert.
* Entfernen erhält alle vorhandenen Punkte, auch über dem Maximum. Bei Gleichstand und Übermaximum ist die Regeneration pausiert. Beim Unterschreiten oder erneutem Erhöhen des Maximums wird der gespeicherte anteilige Timer fortgesetzt. Wiederholtes Wechseln erzeugt keine Punkte.
* Ändert sich das Intervall, bleibt der prozentuale Fortschritt bestehen. Auffüller dürfen weiterhin über das Maximum auffüllen. Auffüller unter dem erhöhten Maximum setzen den laufenden Timer nicht zurück.

## Karten

| Region | ID | Name | Seltenheit | Grundkapazität t | Tempo | Bereich | Bonus | Level 1 → 10 |
|---|---|---|---|---:|---:|---|---|---|
| Kronenlande | `navigator` | Pepe – der Packesel | common | 2 | 75 | self | cost | 3 → 5.7 |
| Kronenlande | `r1_common_2` | Bruno – das Marktpferd | common | 5 | 90 | self | pay | 3 → 5.7 |
| Kronenlande | `r1_uncommon` | Rufus – der Postbote | uncommon | 3 | 125 | garage | overtimeCapacity | 5 → 70 |
| Kronenlande | `r1_rare` | Silvan – das Silbergeweih | rare | 7 | 110 | garage | speed | 4 → 8.5 |
| Kronenlande | `r1_uncommon_2` | Aurel – der Kronenlöwe | epic | 2 | 155 | fleet | speed | 8 → 17 |
| Weite Ebenen | `r2_common` | Milo – das Lastlama | common | 6 | 85 | self | cost | 3 → 5.7 |
| Weite Ebenen | `r2_common_2` | Otto – der Lastochse | common | 12 | 60 | self | pay | 3 → 5.7 |
| Weite Ebenen | `disponent` | Tara – die Fassziege | uncommon | 16 | 70 | self | cost | 6 → 10.5 |
| Weite Ebenen | `r2_rare` | Arvid – der Wegfinder | rare | 10 | 95 | fleet | cost | 4 → 8.5 |
| Weite Ebenen | `r2_epic` | Boran – der Donnerbison | epic | 24 | 75 | fleet | pay | 8 → 17 |
| Safranstraße | `r3_common` | Paco – der Wüstenkeiler | common | 3 | 80 | self | cost | 3 → 5.7 |
| Safranstraße | `r3_common_2` | Samir – der Sandträger | common | 4 | 95 | self | pay | 3 → 5.7 |
| Safranstraße | `r3_uncommon` | Nuri – der Wasserträger | uncommon | 9 | 90 | garage | expeditionCapacity | 5 → 70 |
| Safranstraße | `forscherin` | Zafir – der Seidenfuchs | rare | 13 | 100 | fleet | pay | 4 → 8.5 |
| Safranstraße | `r3_epic` | Siro – der Dünenläufer | epic | 8 | 140 | garage | cost | 8 → 17 |
| Jadetal | `r4_common` | Tiko – der Bambusträger | common | 1.5 | 85 | self | cost | 3 → 5.7 |
| Jadetal | `r4_common_2` | Mei – die Teeträgerin | common | 4 | 100 | self | pay | 3 → 5.7 |
| Jadetal | `r4_uncommon` | Daro – der Reisbüffel | uncommon | 11 | 65 | self | cost | 6 → 10.5 |
| Jadetal | `logistiker` | Lian – der Jadewächter | rare | 8 | 100 | garage | expeditionRegen | 10 → 120 |
| Jadetal | `r4_epic` | Bao – der Schatzträger | epic | 12 | 50 | fleet | cost | 10 → 19 |
| Nordmark | `r5_common` | Husk – der Schlittenzieher | common | 2 | 115 | self | pay | 3 → 5.7 |
| Nordmark | `r5_common_2` | Runi – der Winterträger | common | 5 | 95 | self | cost | 3 → 5.7 |
| Nordmark | `r5_uncommon` | Grumm – der Moschusochse | uncommon | 9 | 80 | garage | cost | 2 → 4.25 |
| Nordmark | `pionierin` | Eira – die Frostläuferin | rare | 6 | 120 | fleet | speed | 4 → 8.5 |
| Nordmark | `r5_epic` | Niva – die Schneekönigin | epic | 3 | 150 | garage | speed | 8 → 17 |

## Bilder

Alle 25 Karten haben ein eigenes quadratisches Bild. Seit der Identitätsüberarbeitung liegen die aktuellen Appbilder unter assets/art/vehicles/identities/: 1024 × 1024 Pixel, RGB-JPEG, ohne eingebrannte Namen oder Rahmen. Eigenname und Titel sind getrennte Katalogfelder; bestehende Karten-IDs und Werte bleiben erhalten. Die freigegebenen Korrekturen für Lian (ohne Horn), Eira (kleinere Pfoten) und Niva (schlankerer Schweif) sind enthalten. Alle 25 freigegebenen Identitätsmotive folgen derselben malerisch-realistischen Bildsprache mit regionalen Landschaften, natürlichen Materialien und deutlich prestigeträchtigerer Ausstattung für Epic-Karten. Keine Flug- oder Wasserfahrzeuge und keine Elefanten.

Erstellung und Bearbeitung: eingebautes ImageGen-Werkzeug, je Motiv ein eigener Aufruf. Aktuelle Prompts und Versionskorrekturen liegen unter `assets/art/vehicles/concepts/`; Originale bleiben lokal erhalten. `prompts.json` und `regional-prompts.json` dokumentieren die ursprüngliche Bildserie vor der Identitätsüberarbeitung. Alle aktuellen Appbilder und die Zuordnung stehen in `assets/art/vehicles/README.md`.

Die gemeinsame `VehicleArt`-Komponente zeigt alle Motive in Sammlung, Kartendetail, Garage, Flotte und Geschenkpool. Namen, Werte und Seltenheitsrahmen bleiben außerhalb der Bilddateien. Die Bilder verändern keine Kapazitäten, Geschwindigkeiten, Bonuswerte oder Besitzkennungen.

## Historische Prüfung des ursprünglichen Kartenpakets

Die folgenden Ergebnisse betreffen die damalige Einführung, nicht einen neuen Gesamtlauf am 03.11.2026. Spätere Bonusstaffeln und Oberflächenänderungen sind zusätzlich zu beachten.

* Typprüfung erfolgreich.
* 138 Tests erfolgreich, darunter zehn neue Tests für die individuellen Werte, Bonusstaffeln, Inaktivität in Sammlung/Flotte, Punktetrennung, Übermaximum, Offline-Pause, Timerwechsel, Auffüller und Migration.
* Bestehende Tour-, Flotten-, Event-, Beschaffungs- und Webregressionstests auf die neuen Kartenkonfigurationen angepasst, weiterhin mit Prüfung unveränderter laufender Touren und korrekter Folgefahrten.
* Android-Export erfolgreich. Kein Android-Gerätetest.
* Echte React-Native-Web-Komponenten bei 320/360/390/430 px geprüft (vollständige Bildserie zusätzlich bei 320/390/430 px): Sammlung und alle 25 Bilddetails ohne horizontalen Überlauf, danach Garage und Flotte geöffnet, englische Kartendarstellung geprüft. Keine JavaScript-Laufzeitfehler. Die lokale Prüfansicht verwendet synthetische Testdaten und wird nicht in die App eingebaut.

Die damalige Vorbereitung verwendete die bestehende Android-Vorschau-Pipeline ohne neue native Abhängigkeiten. Der heutige Veröffentlichungsstand muss am erfolgreichen Workflow des jeweiligen Commits geprüft werden.

### Einheitlicher Seltenheitsrahmen

`VehicleArt` zeichnet die freigegebene Facettenfassung ohne Seltenheitssymbol direkt mit React-Native-Views und einem nativen Farbverlauf; es gibt keine Rahmen-Bilddateien. Alle Porträts bleiben quadratisch, das Bild füllt die Fassung ohne unteren Sockel. Eisen, Grün, Blau/Silber, Violett und Gold kennzeichnen Common bis Legendary. Die umlaufende Fassung hat abgeschrägte Ecken und eine dezente Licht-/Schattenkante, Epic und Legendary eine etwas edlere Fassung im gleichen Stil. Unter 110 px gibt es keine zusätzliche dunkle Außenlinie; die farbige Fassung skaliert auf 2–3 px. Größere Porträts zeigen optional die Kartenstufe. Die Levelangabe auf kleinen Sammlungskarten bleibt außerhalb des Porträts. Rauten, Seltenheitssymbole, Eckornamente und Seltenheitssockel entfallen; die zugängliche Bildbeschreibung nennt weiterhin die Seltenheit.

Die gemeinsame Darstellung gilt für Garage, Sammlung, Flottenliste und -details, Fahrzeugauswahl, Fundübersicht, Beschaffung und die Fahrzeugangaben in Auftragsdetails. Garagenkarten behalten einen neutralen Hintergrund. `VehicleName` übersetzt vor dem Einfügen bedingter Trennstellen für lange Fahrzeugnamen.

