# Botenstation-Erträge

Die kompakte Ertragskarte zeigt Münzbild und den laufenden Betrag auf ganze Imperium-Taler gerundet (kaufmännisch: ab 0,50 aufrunden), mit lokaler Tausendertrennung. Beispielsweise wird 11.810,66 als 11.811 angezeigt. Nur die Anzeige in `HubEarnings` ist gerundet; interne Berechnung, Kassenbestand und Auszahlung behalten ihre Präzision. Der zugängliche Text entspricht dem sichtbaren gerundeten Betrag. Kassenfüllstand und Einkaufszyklus sind getrennt. Der Sammelknopf holt Münzen, Abholhinweise und Werkzeugkästen gemeinsam ab; der Belohnungsdialog zeigt die tatsächlich gutgeschriebenen Mengen als Zeilen.

## Einkaufsleistung

Die Stundenbasis ist die Summe `3600 / Tourdauer × Fahrzeugkapazität` aller eingesetzten Fahrzeuge. Eine Tour berücksichtigt beladene Hinfahrt und leere Rückfahrt. Die kontinuierliche Rechenleistung vermeidet Rundung auf ganze Touren; Kilometer und abgeschlossene Touren zählen weiterhin nur vollständig gefahrene Touren.

Vertrieb Stufe 0 kauft Ware für 40 Minuten dieser Leistung. Jede der 20 Stufen erhöht die Arbeitszeit um 30 Sekunden, bis Stufe 20 genau 50 Minuten erreicht. Die Anzeige nennt Minuten und Sekunden statt Prozentwerte. Der Ausbau kostet nur `5 × Zielstufe` Lieferantenkontakte und ein Firmenausbau-Item; Münzen werden weder vorausgesetzt noch abgezogen. Die Dauer bleibt `12 × Zielstufe` Stunden. Eingekaufte Menge, Arbeitszeit und Fahrzeug-Tourdauern werden am Einkauf eingefroren. Ausbauten und neue Fahrzeuge wirken ab dem nächsten Einkauf. Es gibt keine Auslastung über 100 %.

Die Ware wird während der eingefrorenen Arbeitszeit verteilt; danach wird bis zum Ende der Stunde gewartet. Ein bestehender alter Zyklus behält seine zuvor eingekaufte Menge, 45-Minuten-Verteilung und bereits gutgeschriebenen Beträge. Erst der nächste Einkauf verwendet die neue Formel. Der bestehende Kasseninhalt bleibt erhalten.

## Volle Kasse

Nach sechs vollständigen Einkaufszyklen pausiert die Botenstation. Während der Pause laufen weder die Arbeitsstatistik noch Teileversuche weiter. Volle Kasse abholen startet sofort einen neuen Einkauf bei Minute 0. Teilabholungen ändern Startzeit und bereits bezahlten Zyklusanteil nicht. Teileversuche bleiben auf einmal pro Stunde und 24 pro UTC-Tag begrenzt; ein Neustart umgeht die Sperre nicht.

## Darstellung

Die Achse zeigt nur 0 und 60 Minuten als feste Endpunkte. Zusätzliche Countdown-, Zyklusminuten- und Leerlaufzeilen entfallen; die Zeitinformation steht im Zeitstrahl. Der Warenende-Marker nennt seine tatsächliche Minute (beispielsweise „Ware leer · 40 Min.“). Es gibt keine gelbe gestrichelte Leerlaufspur; der verbleibende Balken bleibt schlicht. Bei voller Kasse oder ohne eingekaufte Ware wird kein Warenende vorhergesagt. Am Maximum bleiben zehn Minuten Pause bis zum nächsten Einkauf.

Validierung: gezielte Serverprüfungen für 40/40,5/50 Minuten, Fahrzeugleistung und eingefrorene Werte, volle und teilweise Abholung, Offline-Nachlauf, Teilelimits sowie kompatible Altzyklen; TypeScript, vollständige Tests und mobile Browseransichten.

## Wechsel auf 20 Vertriebsstufen

Vorhandene Stufen oberhalb von 20 werden einmalig auf 20 begrenzt; die dafür bezahlten Lieferantenkontakte und Firmenausbau-Items werden zurückgegeben. Ein noch laufender Ausbau oberhalb des neuen Maximums wird beendet und vollständig einschließlich seiner bisherigen Münzkosten erstattet. Zulässige laufende Ausbauten behalten ihre Restdauer. Abgeschlossene Münzkosten werden nicht rückwirkend erstattet. Eingefrorene Zyklusmengen, Arbeitszeit und bereits gutgeschriebene Beträge bleiben unangetastet bis zum nächsten Einkauf.

## Durchgehende Bildkarte

Die Ertragskarte verwendet den vorhandenen Handelshof als vollflächigen Hintergrund mit dunklen transparenten Textflächen. Kopfzeile, Münzbetrag, Statusbereich und untere Abholfläche behalten feste Positionen. Die gesamte Karte ist in jedem Zustand 350 dp hoch: laufende Verteilung, Wartephase, volle Kasse und fehlende Ware. Der Zeitstrahl reserviert immer denselben Platz; bei Pause bleibt nur die abgedunkelte Achse ohne aktive Zeit- oder Warenmarker sichtbar. Die Hermes-Münze bleibt erhalten und steht mit dem Betrag als horizontal mittige Gruppe; lange Beträge dürfen zur verfügbaren Breite schrumpfen. Die Kopfzeile nennt nur „x / 6 Std.“ beziehungsweise „Kasse voll“. Der Abholstreifen ist ein eigener 46-dp-Button mit unveränderter Sammellogik und Sperre während laufender Anfragen.

