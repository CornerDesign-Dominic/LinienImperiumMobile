# Waren der Handelspartner

Neue normale Einzelaufträge verwenden Holz, Stein, Getreide, Erz oder Wolle. Kundenaufträge und Kunden-Großaufträge wählen aus drei regionalen Produkten; Empfehlungen transportieren die Edelware des vermittelnden Kunden. Der gemeinsame Serverkatalog `customer-cargo.json` wird auch in den Kundenansichten ausgegeben. Bestehende Aufträge laufen mit ihrer ursprünglichen Ware und unveränderten Konditionen aus. Funktionale Material-, Karten- und Privatabholungsaufträge behalten ihre bisherigen Bezeichnungen. Es gibt keine neue Herstellungskette und keine frachtnamenabhängigen Spieleffekte.

| Kunde | Produkte | Empfehlung |
|---|---|---|
| Königliches Handelskontor | Mehl, Werkzeuge, Möbel | Goldschmuck |
| Prärie-Handelsgesellschaft | Leder, Tuche, Käse | Feine Wandteppiche |
| Bund der Karawanenhändler | Gewürzmischungen, Farbstoffe, Räucherwerk | Kostbare Essenzen |
| Handelshaus der Jadebrücke | Papier, Teemischungen, Porzellangeschirr | Jadekunstwerke |
| Nordlicht-Kontor | Trockenfisch, Pelzkleidung, Schmiedewaren | Bernsteinschnitzereien |

Kundendetails zeigen alle drei Produkte und nennen den Ausbauabschnitt „Verbesserungen“.


## Warenbilder und kompakte Angebote

Alle 15 normalen Stammkundenwaren haben eigene transparente Illustrationen. Die fünf bestehenden Grundwaren und fünf vorhandenen Edelwarenmotive bleiben erhalten. `OrderArtwork` liefert die gemeinsame Zuordnung für Angebote, Auftragsdetails und Warenzeilen der Kundendetails. Nur unbekannte Alt-/Zukunftswaren verwenden die neutrale Frachtkiste. Die Bilder verändern keine Warennamen, Auftragswerte oder Auszahlung.

Angebote behalten die kompakte Papierkarte: Menge und Strecke als ausgerichtete Fakten, Transportmerkmale darunter, Kundenname mit dezentem Stammkunde-Hinweis. Die Halte-Pinnadel erhält eine runde Materialfläche innerhalb ihrer unveränderten 44-dp-Berührungsfläche; ihre Aktion bleibt vom Öffnen der Karte getrennt. Lange Texte dürfen umbrechen.

Die neuen Produktionsdateien liegen unter `assets/art/orders/customers/`; Prompts und Herkunft stehen in `prompts.json`. Es werden keine Bilder zur Laufzeit generiert oder geladen. Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.
