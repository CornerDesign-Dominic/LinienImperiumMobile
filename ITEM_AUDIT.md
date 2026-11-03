# Item-Katalog und Verwendung

Referenz der aktuellen Mobile-Implementierung, abgeglichen am 03.11.2026. Namen und gespeicherte Schlüssel stehen in `functions/src/item-names.json`; der Server liefert Bestände, Rezepte und Auffüllmengen. Historische Prüf- und Veröffentlichungsnachweise stehen in [TEST_REPORT.md](TEST_REPORT.md), die Spielregeln in [SPIELREGELN.md](SPIELREGELN.md).

## Materialien und Auffüller

Die Vorräte zeigen vorhandenen Bestand, nach Kategorien geordnet. Karten selbst werden in der Sammlung verwaltet; Shards bleiben in den Vorräten. Herkunftsangaben nennen implementierte Quellen, ohne neue Fundchancen zu versprechen.

| Bestand | Herkunft | Nutzung |
| --- | --- | --- |
| Expeditionsauffüller | Levelaufstieg, entsprechende Gemeinschaftsevent-/Passbelohnungen | +50 Expeditionspunkte, auch über das Maximum hinaus |
| Überstundenauffüller | Levelaufstieg, entsprechende Gemeinschaftsevent-/Passbelohnungen | +50 Überstundenpunkte, auch über das Maximum hinaus |
| Kapazitätsmodul | Einmalige Regionsabschlüsse, seltene Auftragsbeute, entsprechende Gemeinschaftsevent-/Passbelohnungen | Kapazitätsausbau von Transportkarten; Zuwachs und Grenze gemäß Karte |
| Firmenausbau-Item | Normale Aufträge, Materialaufträge, seltene Beschaffungsbeute | Imperiumsausbau und Stadthub-Vertrieb; kein aktives Kundenauftragsrezept |
| Abholhinweis | Stadthub-Erträge | Privatabholung herstellen |
| Werkzeugkasten (`hubVehicleParts`) | Tägliche Fundkisten, erfolgreiche Fundversuche bei Stadthub-Einkäufen | Tragkraft und Tempo der Stadthub-Boten; ersetzt dort Module und Zahnräder |
| Lieferantenkontakt | Privatabholungen | Ausbau des Stadthub-Vertriebs |
| Common-/Uncommon-/Rare-/Epic-/Legendär-Zahnrad | Auftragsbelohnungen; Beschaffung für Common/Uncommon/Rare; Gemeinschaftsevent für Common | Geschwindigkeitsrang von Transportkarten |
| Shard der Kartenseltenheit | Material-/Transportkartenaufträge nach deren Lootpool; doppelte Karten geben einen Shard ihrer Seltenheit | Kartenstufen und dadurch Kartenboni; Common und Uncommon zusätzlich kombinierbar |

Der Katalog enthält aktuell Transportkarten von Common bis Epic. Die Vorratsansicht leitet angezeigte Shard-Seltenheiten aus diesem Katalog ab; ein vorhandenes Bild für Legendär führt allein weder eine Karte noch einen neuen Fundpool ein. Solotest-Eventbelohnungen bleiben im getrennten Testledger und erhöhen keine normalen Vorräte.

## Gespeicherte Aufträge

| Auftrag | Herkunft | Verwendung |
| --- | --- | --- |
| Material-/Transportkartenauftrag, Rang I–III | Endlosexpeditionen | Einzelaufträge → Aufträge aus Vorräten; gestapelt nach Art und Rang |
| Privatabholung | Herstellung aus Abholhinweisen | Einzelaufträge → Aufträge aus Vorräten |
| Kundenauftrag | Gespeicherte Kunden-/Expeditionsaufträge | Einzelaufträge → Aufträge aus Vorräten; Herstellung aus Firmenausbau-Items ist deaktiviert |
| Sonderauftrag / Empfehlungsauftrag | Expeditionen und Stammkunden | Mit einer Flotte unter Großaufträge starten; gruppiert nach Projektkategorie |

Laufende Aufträge erscheinen nicht gleichzeitig als startbarer Vorrat. Seltenheit, Auftragsart und römischer Rang sind unabhängige Darstellungsmerkmale; siehe [Itembilder](docs/ui/item-art.md).

## Aktive Herstellung

| Eingang | Ergebnis |
| --- | --- |
| 100 Abholhinweise | 1 Privatabholung |
| 10 Common-Shards | 1 Uncommon-Shard |
| 10 Uncommon-Shards | 1 Rare-Shard |

Dies sind die drei Rezepte im mobilen Serverkatalog. `craftCustomerOrder` wird serverseitig abgewiesen; die frühere Webregel „10 Firmenausbau-Items → Kundenauftrag“ ist keine aktuelle Mobile-Regel. Die Herstellungsoberfläche zeigt ebenfalls kein solches Rezept. Weitere Shard-Kombinationsstufen sind nicht implementiert.

## Getrennte Ressourcen und Rechte

- Imperium-Taler (`coins`) und Hermes-Siegel (`premiumShop.balance`) sind getrennte Währungen; XP und aktuelle Expeditions-/Überstundenpunkte sind Fortschritts- bzw. Aktionsressourcen.
- Entwicklungs- und Erweiterungspunkte werden über ihre Verteiler verwendet, nicht als zusätzliches herstellbares Material.
- Der tkm-Restzähler ist ein Fortschrittszähler zum nächsten Firmenausbau-Item, kein Gegenstand.
- Skinbesitz und die legendäre Pyramiden-Platzhalterbelohnung sind gespeicherte Rechte, keine regulären Materialstapel. Der Platzhalter ist noch keine spielbare legendäre Transportkarte.
- Der Hermes-Siegel-Shop ist eine Vorschau mit deaktivierten Echtgeldkäufen; verfügbare Packbilder begründen keine Kauf- oder Gutschriftfunktion.

## Pflege

Bei Änderungen am Itemkatalog immer Serverquelle, `src/items.ts`, Inventarkategorien, Herstellungsansicht, Bildzuordnung und Übersetzungen gemeinsam abgleichen. Detailregeln und Quellen liegen in `functions/src/engine.cjs` sowie den Runtimes für Karten, Expeditionen, Beschaffung, Stadthub und Events. Neue Prüfergebnisse nur mit Datum und geprüftem Commit dokumentieren.
