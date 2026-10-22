# Horizontale Expeditionskarten

## Ergebnis

Die geöffnete Region ist eine zusammenhängende, horizontal scrollbar gemalte Landschaft. Auf Hochkant-Handys umfasst sie etwa vier bis fünf Bildschirmbreiten. Gebäude und Schauplätze sind in die Landschaft integriert; kompakte Ortsmarkierungen in Dunkelgrün und Messing darunter kennzeichnen die antippbaren Orte. Die Markierungen zeigen Ortsnummer, Namen und gegebenenfalls den Auftragsstatus. Großzügige unsichtbare Tippflächen umfassen Ortsbild und Markierung. Titel und Regionspfeile schweben über der Karte. Die Pfeile wechseln ausschließlich zwischen benachbarten freigeschalteten Expeditionsregionen; Grenzen und gesperrte Regionen deaktivieren den jeweiligen Pfeil.

Jede Region verwendet die bestehenden sieben Ortsindizes und einen achten Stammkunden-/Endlosort. Ihre Reihenfolge und die am fertigen Bild gemessenen Koordinaten stehen in `src/regionRoutes.ts`.

| Region | Zielort | Landschaft |
| --- | --- | --- |
| Kronenlande | Kronenhafen | Europäische Handelsstraße um 1800; Dörfer, Mühle, Brücke und Stadt führen zum steinernen Flusshafen. |
| Weite Ebenen | Weidenhafen | Überwiegend trockene Prärie; zum Ende Weiden, Felder und ein hölzerner Flusshandelsposten. |
| Safranstraße | Karawanserei der sieben Bögen | Salzterrassen, Safranhöfe, Gebirgspass, Werkstätten und Basar entlang einer Karawanenstraße. |
| Jadetal | Handelshof am Jadetor | Reisterrassen und Wasserwege steigen über Teeberge und Lastenwinde zur Mauer hinauf. |
| Nordmark | Handelsfeste am Eisstrom | Verschneite Wälder, gefrorene Wasserwege und warme Handelssiedlungen; dezente Polarlichter und unterschiedliche Schlittengespanne. |

## Freischaltung und Bedienung

- Der nächste nach bestehender Spielregel erkundbare Ort ist sichtbar. Weiter entfernte Orte werden nicht als Bedienelemente oder Namen gerendert. Ein vollständig deckender Kartennebel verdeckt ihre Bildbereiche einschließlich der Gebäude. Der Rand ist unregelmäßig und weich. Mit jeder Entdeckung öffnet sich der nächste Abschnitt. Die scrollbare Strecke endet kurz hinter dem sichtbaren Bereich, damit man nicht durch leere Kilometer wischt.
- Beim ersten Besuch wird eine ausstehende Bonuslieferung fokussiert, ansonsten der nächste Erkundungsort beziehungsweise das Endziel. Die zuletzt betrachtete Position wird je Konto und Region lokal gespeichert, bei Regionswechsel und erneutem Öffnen wiederhergestellt sowie nach Größenänderungen oder zurückgesetztem Spielfortschritt begrenzt.
- Die Karte füllt den Raum zwischen Seitenkopf und Menü. Sie liegt nicht mehr in der vertikalen Inhaltsliste. Bildmaße werden ausdrücklich gesetzt, damit Androids ursprüngliche lokale Bildmaße die Darstellung nicht beeinflussen.
- Die bisherigen Ortsmodale behalten Erkundung, Bonuslieferung, Fahrzeugwahl, Belohnungsabholung, Kundenfreischaltung, Fundchancen und Expedition bei. Sie verwenden nun die richtigen Orts- und Regionsnamen. Neue Nahansichten und Ortsgeschichten sind der vereinbarte spätere Arbeitsschritt.
- Serverindizes, Kunden-IDs, Freischaltungsregeln, Kosten, Zeiten, Belohnungen und Spielstände werden nicht verändert.

## Bilddateien

Fünf fertige Panoramen unter `assets/art/journeys/`, je 2172 × 724 Pixel im Seitenverhältnis 3:1, gemeinsam rund 3,3 MB als optimierte JPEG-Dateien. Erstellung mit dem eingebauten ImageGen-Werkzeug; das vollständige Promptset liegt in `docs/ui/expedition-journey-prompts.json`. Die bisherigen Bilder der Regionsauswahl bleiben erhalten.

## Validierung

- Typprüfung erfolgreich.
- 117 Tests erfolgreich, davon vier neue Tests für Ortszuordnung, alle Freischaltungsstände, native Bildgrößen, responsive Tippflächen, Regionsgrenzen und gespeicherte Positionen.
- Browserprüfung der tatsächlichen React-Native-Web-App: 320 × 568, 360 × 740, 390 × 844 und 430 × 932. Alle 40 Orte je Größe geöffnet; Bilder und Namen, originale Aktionen, Abstand zu Titel/Pfeilen, Regionswechsel und Grenzen geprüft.
- Zusätzlich neuer Spielstand mit Kartennebel und gesperrter Folgeregion, dreimal Erkundung bis zur Freischaltung des zweiten Ortes, ausstehende Bonuslieferung samt Fahrzeugauswahl, horizontale Scrollgeste, Positionswiederherstellung nach Regionswechsel und Neuladen sowie Englisch geprüft. Keine JavaScript-Fehler.
- Android-Export erfolgreich. Kein Android-Geräte- oder Emulatortest durchgeführt.

Dieser Stand ist zur Prüfung vorbereitet und noch nicht veröffentlicht.
