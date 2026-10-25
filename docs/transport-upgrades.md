# Gesammelter Stand: Transportausbau

Branch `collect/transport-upgrades`; noch nicht veröffentlicht. Die gepinnte Web-Grundlage bleibt unverändert, Regeln liegen im mobilen Runtime-Zusatz.

## Abschlussprämie

Regional und Fernverkehr bleiben getrennt. Je 1.000 Stufen, +1 Prozentpunkt pro Stufe auf die Abschlussprämie (nicht auf Frachtumsatz oder Beute). Neue Stufe N kostet `1.000 × N` Münzen und `1 + floor((N−1)/25)` Firmenausbau-Items. Stufe 1–25 je 1 Item, 26–50 je 2; Stufe 1.000 kostet 1 Mio. M und 40 Items. Vollausbau je Kategorie: 500,5 Mio. M und 20.500 Items. Vorhandene Prämienstufen behalten ihren Wert; keine Nachberechnung alter Käufe.

## Menge und Reichweite

Alle vier Ausbauten haben 100 Stufen. Bisherige Endwerte und Gesamtbudgets bleiben erhalten:

| Kategorie | Ausbau | Endwert | Gesamtkosten M | Items |
|---|---|---|---:|---:|
| Regional | Menge | 35–90 t | 2.146.250 | 200 |
| Regional | Reichweite | 30–150 km | 4.292.500 | 200 |
| Fern | Menge | 85–200 t | 56.813.750 | 1.350 |
| Fern | Reichweite | 100–300 km | 33.835.000 | 650 |

Die alten kumulierten Kosten werden proportional interpoliert und auf ganze Ressourcen gerundet; Stufenpreise sind die Differenz aufeinanderfolgender Summen. Dadurch kosten Einzel- und Mehrfachkäufe gleich viel. Mengenmaximum regional +0,5 t/Stufe, Fern +1,5 t/Stufe. Untergrenze weiterhin Basis + floor(äquivalente alte Mengenstufe/2). Bei halben Mengenobergrenzen werden neue normale Angebote in 0,5-t-Schritten erzeugt. Reichweite regional +0,5 km, Fern +1 km je Stufe; vorhandene Routen entscheiden weiterhin, wann ein neues Ziel verfügbar wird.

Bestehende Mengen-/Reichweitenstufen werden einmalig proportional umgerechnet (aufgerundet, damit keine Fähigkeit verloren geht). Prämienstufen, Guthaben, Inventar, Ausgabenstatistik und gespeicherte laufende Aufträge bleiben erhalten. `companyTransportVersion` verhindert erneute Umrechnung.

## Herstellung und Oberfläche

Das Rezept Firmenausbau-Items → Kundenauftrag ist aus dem Katalog und der Oberfläche entfernt und serverseitig gesperrt. Bestehende Kundenaufträge bleiben nutzbar; Abholhinweis- und Splitterrezepte bleiben erhalten. Inventarbeschreibungen und deutsche/englische Hilfe sind angepasst.

Legende „Verbesserung verfügbar“ unter der Übersicht entfernt; Verfügbarkeitspunkte an den Zeilen bleiben. Doppelte Bestandszeile im Modal entfernt; benötigt/vorhanden bleibt sichtbar.

## Prüfung

201 Tests im vollständigen Lauf erfolgreich; eine zusätzliche Prüfung für Halbtonnen-Angebote anschließend ebenfalls erfolgreich (202 Tests im Gesamtbestand), einschließlich Kostenstaffel, Vollbudgets, Migration/Idempotenz und Einzel-/Mehrfachkäufen. TypeScript geprüft. UI-Prüfung der Übersicht, Modal bei 320/390 Pixeln, Mehrfachauswahl und Herstellung; Android-Export erfolgreich.
