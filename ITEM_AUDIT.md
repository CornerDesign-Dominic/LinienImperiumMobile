# Item-Abgleich – 19.10.2026

Geprüft wurde die tatsächlich implementierte Mobile-Engine einschließlich Belohnungen, Expeditionsfunden, gespeicherten Aufträgen und Herstellungsfunktionen. Nicht implementierte Event-/Shopideen wurden nicht als vorhandene Items ergänzt.

## Vorräte

Nur vorhandener Bestand wird angezeigt. Mengenänderungen kommen aus dem Serverzustand.

| Bestand | Herkunft | Nutzung | Herstellbar |
| --- | --- | --- | --- |
| Expeditionsauffüller | Levelaufstieg | +50 Expeditionspunkte beim Benutzen | Nein |
| Überstundenauffüller | Levelaufstieg | +50 Überstundenpunkte beim Benutzen | Nein |
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
Fahrzeugkarten werden ausschließlich in der Sammlung angezeigt, nicht in den Vorräten. Shards bleiben in den Vorräten.

Das sind 14 nutzbare Materialarten: sechs Grundmaterialien, fünf Zahnrad-Seltenheiten und drei Shard-Seltenheiten. Aufträge und Fahrzeugkarten werden zusätzlich gezeigt. Münzen, XP, aktuelle Expeditions-/Überstundenpunkte und der tkm-Restzähler sind Ressourcen bzw. Fortschrittszähler und keine zusätzlichen Gegenstände. Laufende Aufträge erscheinen nicht gleichzeitig als startbarer Vorrat; ihre Details liegen bei den laufenden Aufträgen.

## Vollständige Herstellung

| Eingang | Ergebnis | Voraussetzung |
| --- | --- | --- |
| 100 Abholhinweise | 1 Privatabholung | Bestand |
| 10 Firmenausbau-Items | 1 Kundenauftrag | Bestand und freigeschalteter Stammkunde |
| 10 Common-Shards | 1 Uncommon-Shard | Bestand |
| 10 Uncommon-Shards | 1 Rare-Shard | Bestand |

Alle vier bestehenden Funktionen sind auf der Herstellungsseite vertreten. Rezeptmengen werden aus denselben Engine-Konstanten geliefert, die der Verbrauch verwendet. Kein neues Rezept und keine Änderung von Kosten oder Fundchancen.

## Korrigiert

- Fehlende Vorratskarten für wartende Aufträge und Großaufträge ergänzt. Fahrzeugkarten werden ausschließlich in der Sammlung verwaltet.
- Material-/Fahrzeugkartenaufträge werden nach Art und Rang über Regionen hinweg gestapelt; Großaufträge nach Auftragstyp.
- Kapazitätsmodule und Zahnräder führen zur Sammlung bzw. zum Stadthub; die Garage bietet keine Upgrades.
- Gemeinsame Namen für Grundmaterialien und Auftragsarten in `functions/src/item-names.json`, verwendet von App und Rezeptkatalog. Raritätsnamen kommen aus dem bestehenden Engine-Katalog.
- Varianten „Firmen-Item“, „Token-Refill“, alleinstehendes „Refill“ sowie kleingeschriebene Seltenheiten bei Shard-Beute vereinheitlicht. Anzeigen und Meldungen verwenden Firmenausbau-Item, Expeditionsauffüller, Überstundenauffüller und Common-/Uncommon-/Rare-Shard.
- Schaltflächen unterscheiden das Herstellen eines Gegenstands vom Verwenden eines Materials in der Herstellung. Common-Shards können nur gefunden werden; sie sind Eingang für Uncommon-Shards.
- Der irreführende Herstellen-Verweis beim Firmenausbau wurde durch Vorräte/Herkunft ersetzt, da Firmenausbau-Items nicht herstellbar sind.

Status: Einschließlich beider 50-Punkte-Auffüller am 19.10.2026 veröffentlicht (Commit 887c3f40, Workflow 39285637912). Neuer Live-Smoke-Test erfolgreich. Tests und Bildschirmprüfung siehe `TEST_REPORT.md`.


Vorratsbereinigung am 19.10.2026 mit Release 0ba088d8 veröffentlicht: Fahrzeugkarten ausschließlich in der Sammlung, Shards weiterhin in Vorräten.
