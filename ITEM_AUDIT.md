# Item-Abgleich – 19.10.2026

Geprüft wurde die tatsächlich implementierte Mobile-Engine einschließlich Belohnungen, Expeditionsfunden, gespeicherten Aufträgen und Herstellungsfunktionen. Nicht implementierte Event-/Shopideen wurden nicht als vorhandene Items ergänzt.

## Vorräte

Nur vorhandener Bestand wird angezeigt. Mengenänderungen kommen aus dem Serverzustand.

| Bestand | Herkunft | Nutzung | Herstellbar |
| --- | --- | --- | --- |
| Überstunden-Refill | Levelaufstieg | +100 Überstundenpunkte | Nein |
| Kapazitätsmodul | Endlosort, seltene Auftragsbeute | Fahrzeugkapazität in Sammlung oder Stadthub | Nein |
| Firmenausbau-Item | Normale Aufträge, Materialaufträge | Firmenausbau, Kundenauftrag herstellen | Nein |
| Abholhinweis | Stadthub-Kasse | Privatabholung herstellen | Nein |
| Lieferantenkontakt | Privatabholungen | Stadthub-Vertrieb | Nein |
| Common-/Uncommon-/Rare-/Epic-/Legendär-Zahnrad | Auftragsprämien gemäß Belohnungstabelle | Fahrzeugrang in Sammlung oder Stadthub | Nein |
| Common-/Uncommon-/Rare-Shard | Expeditionsaufträge, doppelte Karten | Kartenstufe; Common/Uncommon kombinieren | Nur Uncommon/Rare |
| Materialauftrag / Fahrzeugkartenauftrag je Rang | Endlosexpedition | Einzelaufträge → Aufträge aus Vorräten | Nein |
| Privatabholung | Herstellung | Einzelaufträge → Aufträge aus Vorräten | Ja |
| Kundenauftrag | Herstellung bzw. wartende Kundenaufträge | Einzelaufträge → Aufträge aus Vorräten | Ja |
| Sonderauftrag / Empfehlungsauftrag | Expeditionen und Stammkunden | Großaufträge | Nein |
| Fahrzeugkarte, mit Kartenstufe | Expeditionen | Sammlung | Nein |

Das sind 13 nutzbare Materialarten: fünf Grundmaterialien, fünf Zahnrad-Seltenheiten und drei Shard-Seltenheiten. Aufträge und Fahrzeugkarten werden zusätzlich gezeigt. Münzen, XP, aktuelle Expeditions-/Überstundenpunkte und der tkm-Restzähler sind Ressourcen bzw. Fortschrittszähler und keine zusätzlichen Gegenstände. Laufende Aufträge erscheinen nicht gleichzeitig als startbarer Vorrat; ihre Details liegen bei den laufenden Aufträgen.

## Vollständige Herstellung

| Eingang | Ergebnis | Voraussetzung |
| --- | --- | --- |
| 100 Abholhinweise | 1 Privatabholung | Bestand |
| 10 Firmenausbau-Items | 1 Kundenauftrag | Bestand und freigeschalteter Stammkunde |
| 10 Common-Shards | 1 Uncommon-Shard | Bestand |
| 10 Uncommon-Shards | 1 Rare-Shard | Bestand |

Alle vier bestehenden Funktionen sind auf der Herstellungsseite vertreten. Rezeptmengen werden aus denselben Engine-Konstanten geliefert, die der Verbrauch verwendet. Kein neues Rezept und keine Änderung von Kosten oder Fundchancen.

## Korrigiert

- Fehlende Vorratskarten für wartende Aufträge, Großaufträge und gesammelte Fahrzeugkarten ergänzt.
- Material-/Fahrzeugkartenaufträge werden nach Art und Rang über Regionen hinweg gestapelt; Großaufträge nach Auftragstyp.
- Kapazitätsmodule und Zahnräder führen zur Sammlung bzw. zum Stadthub; die Garage bietet keine Upgrades.
- Gemeinsame Namen für Grundmaterialien und Auftragsarten in `functions/src/item-names.json`, verwendet von App und Rezeptkatalog. Raritätsnamen kommen aus dem bestehenden Engine-Katalog.
- Varianten „Firmen-Item“, „Token-Refill“, alleinstehendes „Refill“ sowie kleingeschriebene Seltenheiten bei Shard-Beute vereinheitlicht. Anzeigen und Meldungen verwenden Firmenausbau-Item, Überstunden-Refill und Common-/Uncommon-/Rare-Shard.
- Schaltflächen unterscheiden das Herstellen eines Gegenstands vom Verwenden eines Materials in der Herstellung. Common-Shards können nur gefunden werden; sie sind Eingang für Uncommon-Shards.
- Der irreführende Herstellen-Verweis beim Firmenausbau wurde durch Vorräte/Herkunft ersetzt, da Firmenausbau-Items nicht herstellbar sind.

Status: Am 19.10.2026 mit Release `c76d08d9795bd20eb45cc01f13e152b1d58bf4bd` veröffentlicht. Tests und Bildschirmprüfung siehe `TEST_REPORT.md`.
