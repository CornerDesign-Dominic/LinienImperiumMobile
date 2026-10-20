# Mobile Tourwechsel

Jede vollständige Fahrzeugtour umfasst Hin- und gegebenenfalls Rückfahrt. Sie speichert ihre Fahrzeugwerte, Ladung, Endzeit und Abrechnung. Tempo, Nutzlast, Vergütung, Kosten und XP ändern sich für diese Tour auch durch Aufwertungen nicht.

## Wechsel und Boni

- Einzelauftrag: Fahrzeugwechsel im Auftragsdetail planen. Das Ersatzfahrzeug muss frei und geeignet sein und wird bis zum Wechsel reserviert. Die Reservierung lässt sich abbrechen. Ist der Auftrag nach der laufenden Tour fertig, startet kein Ersatzfahrzeug.
- Kunden-Flottenauftrag und Eventflotte: Änderungen der zugehörigen Vorlage gelten in allen damit laufenden Einsätzen. Jeder Platz übernimmt die Änderung nach seiner aktuellen Tour. Neue freie Plätze können sofort starten. Entfernte Plätze laufen aus; eine leere Flotte pausiert, die Auftragsfrist läuft weiter.
- Eine Karte kann innerhalb einer eingesetzten Flotte nicht doppelt fahren. Gegenseitige Platzwechsel warten bei Bedarf auf das Ende beider bisherigen Touren. Die bestehende Erlaubnis zum parallelen Einsatz derselben Karte in verschiedenen Flottenprojekten und in der Garage bleibt bestehen.
- Ein austretender Bonusgeber bleibt bis zum Ende seiner Tour Mitglied. Der Nachfolger wird erst beim tatsächlichen Eintritt Bonusgeber. Beim Start einer Empfängertour werden die zu diesem Zeitpunkt aktiven Mitglieder und aktuellen Kartenlevel ausgewertet. Laufende Empfängertouren behalten ihre Boni.
- Gleichzeitige Ankünfte werden zusammen abgeschlossen, bevor neue Touren beginnen. Die Bonuswirkung hängt damit nicht von der Reihenfolge der Plätze ab.
- Überstunden buchen Teilmengen nach der gespeicherten Tourabrechnung. Eine vollständig dadurch erledigte Tour kann die nächste Tour mit neuen Werten starten. Bei fehlenden Nachfolgefahrzeugen wird nur die noch bewegliche Ladung beschleunigt und entsprechend abgerechnet.

## Prognosen, Speicherung und Zeit

Vor jeder Änderung werden fällige Lieferungen bis zur Serverzeit abgearbeitet. Eine Aufwertung exakt bei Ankunft ändert deshalb nicht die zu diesem Zeitpunkt bereits gestartete Folgetour. Für ETA, Resttouren, Kosten, Vergütung, XP und Überstundenbedarf werden laufende Momentaufnahmen mit den derzeit geplanten Folgetouren kombiniert. Die Simulation verändert keine echten Lieferungen und würfelt keine Belohnungen.

Transportierende Expeditionsmissionen behalten ebenfalls die aktuelle Tour und berechnen den restlichen Transportplan mit den aktuellen Fahrzeugwerten. Ortsmissionen ohne Fahrzeugtour behalten ihre feste Missionsdauer. Der separate Stadthub verwendet weiterhin seine stündliche Verkaufs- und Kassenabrechnung.

Bestehende Flottentouren behalten Ladung, Endzeit und gespeicherte Abrechnung. Bestehende Einzelaufträge ohne Tourmomentaufnahme werden einmalig mit ihrem gespeicherten Start und ihrer gespeicherten Ladung initialisiert; historische Bonuswerte, die früher nicht gespeichert wurden, sind nicht rekonstruierbar. Es werden keine historischen Lieferungen neu vergütet. Stabile endlose Eventflotten werden für lange Offline-Zeiten rechnerisch gebündelt; bei Änderungen werden zunächst die Übergangstouren chronologisch abgearbeitet.

## Validierung

`tests/tour-updates.test.cjs` prüft unter anderem Wechsel vor/exakt/nach Ankunft, Reservierung und Abbruch, unzulässige Fahrzeuge, Kapazität und Tempo, eigene/Flotten-/Garagenboni, Geberwechsel, gleichzeitige Ankünfte, Platztausch, leere und ergänzte Flotten, Überstunden-Teilmengen, Prognose gegen echte Abrechnung, Offline gegen häufigen Sync, Event und Kundenauftrag parallel, Expeditionspläne sowie alte Spielstände und erneutes Laden.

Die ursprünglichen Web-Regressionsprüfungen bleiben unverändert. Die mobilen Tests prüfen die tatsächlich auf dem Server verwendeten Tourregeln.

## Beschaffung

`procurement-runtime.js` hält jede gestartete Runde mit unveränderlicher Startzeit, Dauer, Ankunft und Preis fest. Nur Folgerunden lesen das Fahrzeugtempo erneut. Die Garage bleibt exklusiv; dieselbe Karte darf unabhängig in Flottenprojekten fahren. Vorausbezahltes Guthaben gehört dem Auftrag, nicht dem frei verfügbaren Konto. Reservefahrten bezahlen bei Abfahrt, enden bei Unterschreiten der Reserve dauerhaft und werden nicht von späteren Einnahmen reaktiviert. Offline-Abrechnung verarbeitet Beschaffungsankünfte chronologisch, bucht bis dahin fällige Transporteinnahmen und prüft erst dann Folgeabfahrten. Erfolgszähler und Loot entstehen nur nach vollständiger Runde; Abholung bewegt gespeicherten Loot einmalig in die Vorräte.
