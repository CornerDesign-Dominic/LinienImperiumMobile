# Regionale Transporterkarten mit vollständigen Bildern

25 Landtransporter ersetzen die bisherigen generischen LKW-Namen. Keine Flug- oder Wasserfahrzeuge, Elefanten bleiben für spätere legendäre Karten reserviert. Die 25 Besitz-IDs bleiben stabil. Kronenlande erhält nun ebenfalls eine Epic-Karte; die bisherige ID `r1_uncommon_2` wird dafür weiterverwendet. Vorhandener Kartenbesitz und Kartenlevel bleiben erhalten, vorhandene Shards bleiben in ihren bisherigen Seltenheitspools.

## Werte und Ausbau

Tempo 100 entspricht 1 km/s leer, vor Rang- und Kartenboni. Kapazitätsmodule geben je 5 % der individuellen Grundkapazität, zehn Stufen. Geschwindigkeitsränge bleiben bei +0,5 % des individuellen Basistempos pro Rang. Bestehende Modullevel, ausgegebene Module, Ränge und Fahrstatistiken bleiben erhalten; Kapazität wird einmalig auf die neue Grundkapazität mit dem vorhandenen Modullevel umgerechnet. Bereits gestartete Tour-Snapshots werden nicht verändert, neue Touren nutzen die neuen Werte. Alte Modullevel über zehn bleiben bestehen; weitere Kapazitätskäufe sind dann gesperrt.

Jede Karte besitzt genau einen Bonus. Eigenboni gelten für das Fahrzeug, Flottenboni einschließlich des Gebers für die eingesetzte Flotte, Garagenboni einschließlich des Gebers für alle Garagenfahrzeuge (auch Stadttransporter). Verschiedene Transportboni addieren sich. Bestehende Einsatzregeln der drei Flottenvorlagen bleiben erhalten. Beschaffung behält ihre festen Preise und Beutemengen; individuelles Tempo beeinflusst die nächste Beschaffungstour.

## Punkte und Timer

* Königliche Postkutsche: Überstundenmaximum, Oasenkarawane: Expeditionsmaximum. Level 1–10: +5/10/15/20/25/30/40/50/60/70 Punkte, getrennt voneinander.
* Jade-Kundschaftergespann: Expeditionsintervall −10/20/30/40/50/60/75/90/105/120 Sekunden. Basis zehn Minuten, auf Level 10 acht Minuten. Überstundenintervall bleibt zehn Minuten.
* Diese drei Boni wirken nur, wenn die Karte in `game.trucks` zur Garage gehört, auch während Einzelaufträgen oder Beschaffung. Besitz, Sammlung und alleinige Flottenvorlage aktivieren sie nicht. Ausbauten geparkter Karten belegen keinen aktiven Garagenplatz.
* Ausrüstung erhöht nur das Maximum, niemals den Punktestand. Grundmaximum und Ausrüstungsbonus werden getrennt gehalten, damit Neuladen den Bonus nicht aufaddiert.
* Entfernen erhält alle vorhandenen Punkte, auch über dem Maximum. Bei Gleichstand und Übermaximum ist die Regeneration pausiert. Beim Unterschreiten oder erneutem Erhöhen des Maximums wird der gespeicherte anteilige Timer fortgesetzt. Wiederholtes Wechseln erzeugt keine Punkte.
* Ändert sich das Intervall, bleibt der prozentuale Fortschritt bestehen. Auffüller dürfen weiterhin über das Maximum auffüllen. Auffüller unter dem erhöhten Maximum setzen den laufenden Timer nicht zurück.

## Karten

| Region | ID | Name | Seltenheit | Grundkapazität t | Tempo | Bereich | Bonus | Level 1 → 10 |
|---|---|---|---|---:|---:|---|---|---|
| Kronenlande | `navigator` | Eselkarren | common | 2 | 75 | self | cost | 3.0 → 6.0 |
| Kronenlande | `r1_common_2` | Marktgespann | common | 5 | 90 | self | pay | 3.0 → 6.0 |
| Kronenlande | `r1_uncommon` | Königliche Postkutsche | uncommon | 3 | 125 | garage | overtimeCapacity | 5 → 70 |
| Kronenlande | `r1_rare` | Silberhirsch-Gespann | rare | 7 | 110 | garage | speed | 4.0 → 8.0 |
| Kronenlande | `r1_uncommon_2` | Königliches Löwengespann | epic | 2 | 155 | fleet | speed | 8.0 → 16.0 |
| Weite Ebenen | `r2_common` | Siedlerwagen | common | 6 | 85 | self | cost | 3.0 → 6.0 |
| Weite Ebenen | `r2_common_2` | Ochsenfuhrwerk | common | 12 | 60 | self | pay | 3.0 → 6.0 |
| Weite Ebenen | `disponent` | Prärie-Lastenzug | uncommon | 16 | 70 | self | cost | 6.0 → 12.0 |
| Weite Ebenen | `r2_rare` | Leitwagen der Pioniere | rare | 10 | 95 | fleet | cost | 4.0 → 8.0 |
| Weite Ebenen | `r2_epic` | Donnerbison-Gespann | epic | 24 | 75 | fleet | pay | 8.0 → 16.0 |
| Safranstraße | `r3_common` | Lasteselzug | common | 3 | 80 | self | cost | 3.0 → 6.0 |
| Safranstraße | `r3_common_2` | Wüstenkamel | common | 4 | 95 | self | pay | 3.0 → 6.0 |
| Safranstraße | `r3_uncommon` | Oasenkarawane | uncommon | 9 | 90 | garage | expeditionCapacity | 5 → 70 |
| Safranstraße | `forscherin` | Silberkarawane | rare | 13 | 100 | fleet | pay | 4.0 → 8.0 |
| Safranstraße | `r3_epic` | Dünenläufer-Karawane | epic | 8 | 140 | garage | cost | 8.0 → 16.0 |
| Jadetal | `r4_common` | Bambuskarren | common | 1.5 | 85 | self | cost | 3.0 → 6.0 |
| Jadetal | `r4_common_2` | Tee-Maultiergespann | common | 4 | 100 | self | pay | 3.0 → 6.0 |
| Jadetal | `r4_uncommon` | Terrassen-Ochsenwagen | uncommon | 11 | 65 | self | cost | 6.0 → 12.0 |
| Jadetal | `logistiker` | Jade-Kundschaftergespann | rare | 8 | 100 | garage | expeditionRegen | 10 → 120 |
| Jadetal | `r4_epic` | Kaiserliches Pandagespann | epic | 12 | 50 | fleet | cost | 10.0 → 20.0 |
| Nordmark | `r5_common` | Fischer-Hundeschlitten | common | 2 | 115 | self | pay | 3.0 → 6.0 |
| Nordmark | `r5_common_2` | Rentier-Lastschlitten | common | 5 | 95 | self | cost | 3.0 → 6.0 |
| Nordmark | `r5_uncommon` | Nordland-Lastengespann | uncommon | 9 | 80 | garage | cost | 2.0 → 4.0 |
| Nordmark | `pionierin` | Weißhirsch-Schlitten | rare | 6 | 120 | fleet | speed | 4.0 → 8.0 |
| Nordmark | `r5_epic` | Schneeleoparden-Express | epic | 3 | 150 | garage | speed | 8.0 → 16.0 |

## Bilder

Alle 25 Karten haben ein eigenes quadratisches Bild. Die drei ursprünglichen Muster bleiben erhalten; die weiteren 22 Motive folgen derselben malerisch-realistischen Bildsprache mit regionalen Landschaften, natürlichen Materialien und deutlich prestigeträchtigerer Ausstattung für Epic-Karten. Keine Flug- oder Wasserfahrzeuge und keine Elefanten.

Erstellung: eingebautes ImageGen-Werkzeug, je Motiv ein eigener Aufruf. Bei Siedlerwagen und Oasenkarawane wurden kleine generierte Signaturen per gezielter Bildbearbeitung entfernt. Vollständige Prompts: `assets/art/vehicles/prompts.json` und `assets/art/vehicles/regional-prompts.json`. Alle optimierten Appbilder liegen unter `assets/art/vehicles/`, 1024 × 1024 Pixel, RGB-JPEG. Die Übersicht und alle einzelnen Dateilinks stehen in `assets/art/vehicles/README.md`.

Die gemeinsame `VehicleArt`-Komponente zeigt alle Motive in Sammlung, Kartendetail, Garage, Flotte und Geschenkpool. Namen, Werte und Seltenheitsrahmen bleiben außerhalb der Bilddateien. Die Bilder verändern keine Kapazitäten, Geschwindigkeiten, Bonuswerte oder Besitzkennungen.

## Prüfung

* Typprüfung erfolgreich.
* 138 Tests erfolgreich, darunter zehn neue Tests für die individuellen Werte, Bonusstaffeln, Inaktivität in Sammlung/Flotte, Punktetrennung, Übermaximum, Offline-Pause, Timerwechsel, Auffüller und Migration.
* Bestehende Tour-, Flotten-, Event-, Beschaffungs- und Webregressionstests auf die neuen Kartenkonfigurationen angepasst, weiterhin mit Prüfung unveränderter laufender Touren und korrekter Folgefahrten.
* Android-Export erfolgreich. Kein Android-Gerätetest.
* Echte React-Native-Web-Komponenten bei 320/360/390/430 px geprüft (vollständige Bildserie zusätzlich bei 320/390/430 px): Sammlung und alle 25 Bilddetails ohne horizontalen Überlauf, danach Garage und Flotte geöffnet, englische Kartendarstellung geprüft. Keine JavaScript-Laufzeitfehler. Die lokale Prüfansicht verwendet synthetische Testdaten und wird nicht in die App eingebaut.

Vollständiger Stand zur Veröffentlichung über die bestehende Android-Vorschau-Pipeline. Native Abhängigkeiten und Laufzeitversion bleiben unverändert.

### Einheitlicher Seltenheitsrahmen

`VehicleArt` zeichnet den Rahmen mit React-Native-Views und Text direkt in der Oberfläche; es gibt keine Rahmen-Bilddateien. Alle Porträts bleiben quadratisch. Eisen, Grün, Blau/Silber, Violett und Gold kennzeichnen Common bis Legendary. Eine bis fünf Rauten und unterschiedliche Eckfassungen unterscheiden die Stufen zusätzlich zur Farbe. Unter 110 px bleibt die Kennzeichnung kompakt; größere Porträts tragen außerdem Seltenheitsname und optional Kartenstufe. Die Levelangabe auf kleinen Sammlungskarten bleibt außerhalb des Porträts.

Die gemeinsame Darstellung gilt für Garage, Sammlung, Flottenliste und -details, Fahrzeugauswahl, Fundübersicht, Beschaffung und die Fahrzeugangaben in Auftragsdetails. Garagenkarten behalten einen neutralen Hintergrund. `VehicleName` übersetzt vor dem Einfügen bedingter Trennstellen für lange Fahrzeugnamen.
