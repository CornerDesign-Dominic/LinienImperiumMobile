# Stadthub-Erträge

Die kompakte Ertragskarte zeigt Münzbild und Münzbetrag. Kassenfüllstand und Einkaufszyklus sind getrennt. Der Sammelknopf holt Münzen, Abholhinweise und Werkzeugkästen gemeinsam ab; der Belohnungsdialog zeigt die tatsächlich gutgeschriebenen Mengen als Zeilen.

## Einkaufsleistung

Die Stundenbasis ist die Summe `3600 / Tourdauer × Fahrzeugkapazität` aller eingesetzten Fahrzeuge. Eine Tour berücksichtigt beladene Hinfahrt und leere Rückfahrt. Die kontinuierliche Rechenleistung vermeidet Rundung auf ganze Touren; Kilometer und abgeschlossene Touren zählen weiterhin nur vollständig gefahrene Touren.

Vertrieb Stufe 0 kauft Ware für 40 Minuten dieser Leistung (66,67 %). Jede der 25 Stufen erhöht die Arbeitszeit um 48 Sekunden, bis Stufe 25 genau 60 Minuten bzw. 100 % erreicht. Eingekaufte Menge, Arbeitszeit und Fahrzeug-Tourdauern werden am Einkauf eingefroren. Ausbauten und neue Fahrzeuge wirken ab dem nächsten Einkauf. Es gibt keine Auslastung über 100 %.

Die Ware wird während der eingefrorenen Arbeitszeit verteilt; danach wird bis zum Ende der Stunde gewartet. Ein bestehender alter Zyklus behält seine zuvor eingekaufte Menge, 45-Minuten-Verteilung und bereits gutgeschriebenen Beträge. Erst der nächste Einkauf verwendet die neue Formel. Der bestehende Kasseninhalt bleibt erhalten.

## Volle Kasse

Nach sechs vollständigen Einkaufszyklen pausiert der Hub. Während der Pause laufen weder die Arbeitsstatistik noch Teileversuche weiter. Volle Kasse abholen startet sofort einen neuen Einkauf bei Minute 0. Teilabholungen ändern Startzeit und bereits bezahlten Zyklusanteil nicht. Teileversuche bleiben auf einmal pro Stunde und 24 pro UTC-Tag begrenzt; ein Neustart umgeht die Sperre nicht.

## Darstellung

Die Achse zeigt nur 0 und 60 Minuten als feste Endpunkte. Der aktuelle Minutenstand steht separat über der Achse. Der Warenende-Marker nennt seine tatsächliche Minute (beispielsweise „Ware leer · 40 Min.“). Es gibt keine gelbe gestrichelte Leerlaufspur; der verbleibende Balken bleibt schlicht. Bei voller Kasse oder ohne eingekaufte Ware wird kein Warenende vorhergesagt. Am Maximum stehen Warenende und Einkauf am selben Zeitpunkt; die Beschriftungen sind versetzt.

Validierung: gezielte Serverprüfungen für 40/48/60 Minuten, Fahrzeugleistung und eingefrorene Werte, volle und teilweise Abholung, Offline-Nachlauf, Teilelimits sowie kompatible Altzyklen; TypeScript, vollständige Tests und mobile Browseransichten.
