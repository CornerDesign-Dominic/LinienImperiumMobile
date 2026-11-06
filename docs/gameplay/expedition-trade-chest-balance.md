# Expeditionen, Handelstruhen und Auffüller

Arbeitsstand für Spieltests. Keine Echtgeldabrechnung aktiviert.

## Neue Endlosexpeditionen

| Fund pro Auslosung | Ohne Ausbau | Maximaler Ausbau |
| --- | ---: | ---: |
| Common-Karte | 15 % | 15 % |
| Uncommon-Karte | 10 % | 10 % |
| Rare-Karte | 5 % | 5 % |
| Normaler regionaler Kundenauftrag | 20 % | 20 % |
| Sonderauftrag | 0,9 % | 2,25 % |
| Empfehlungsauftrag | 0,1 % | 0,25 % |
| Direkte Zahnräder und Shards | 49 % | 47,5 % |

Karten gleicher Seltenheit werden gleichmäßig unter den Karten der aktuellen Region ausgewählt. Epic und Legendary werden nicht direkt gefunden. Doppelte Karten geben einen Shard derselben Seltenheit. Neue Material- und Transportkartenaufträge entfallen; bestehende bleiben spielbar.

Ein Kundenfund wird als normaler Einzelauftrag des regionalen Stammkunden gespeichert. Jeder neu erzeugte normale Kundenauftrag würfelt unabhängig 50 % Nahverkehr und 50 % Fernverkehr. Das gilt auch für die unveränderte 5-%-Kundenchance bei neuen Einzelauftragsangeboten; alle freigeschalteten Kunden sind unabhängig von ihrer bisherigen Verkehrsart auswählbar. Route und Wirtschaftswerte folgen der tatsächlich gewürfelten Verkehrsart. Gespeicherte und laufende Aufträge bleiben erhalten. Folgeaufträge erben die tatsächliche Verkehrsart des Quellauftrags. Die Sonderauftragschance nach normalen Kundenaufträgen bleibt 20 % im Nahverkehr bzw. 40 % im Fernverkehr zuzüglich Kundenbonus.

| Region | Punktkosten | Common-Zahnräder | Uncommon-Zahnräder | Rare-Zahnräder | Garantierte Shards |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1 | 5 | 20–30 | — | — | 1 |
| 2 | 6 | 30–45 | 2–4 | — | 1 |
| 3 | 7 | 40–60 | 5–8 | — | 2 |
| 4 | 8 | 50–75 | 8–12 | 1–2 | 2 |
| 5 | 10 | 60–90 | 12–18 | 2–4 | 3 |

Mengen gelten bei einem Zahnradfund. Shards verwenden die bestehenden Seltenheitspools der Ränge 1/2/2/3/3 (höchstens Rare). Zusätzliche unabhängige Chancen je Zahnradfund: 6 % auf Firmenausbau-Items (1/1/2/2/3 nach Region), 0,3 % auf ein Kapazitätsmodul. Kein zusätzlicher Kleinstbetrag Taler.

Der neue Ausbau **Expeditionsfunde** im Handelsimperium hat 15 Stufen. Jede erhöht die gemeinsame Sonder-/Empfehlungschance um 0,1 Prozentpunkte; das Verhältnis bleibt 90:10, der Zuwachs ersetzt Zahnradfunde. Zielstufe N kostet 10.000 × N Taler und 1 + floor((N−1)/5) Firmenausbau-Items. Vollausbau: 1.200.000 Taler und 30 Items. Normale Kunden- und Kartenfunde bleiben unverändert.

## Handelstruhen

Eine universelle Vorratsart, kein regionaler Truhenstapel. Kaufpreis: **200 Hermes-Siegel**. Beim Öffnen wird eine Truhe verbraucht und eine freigeschaltete Region gewählt. Gekaufte und verdiente Truhen nutzen denselben Pool und enthalten garantiert eine Karte.

Der bisherige Testpool bleibt bestehen: jede der fünf regionalen Karten 20 %, damit aktuell 40 % Common, 20 % Uncommon, 20 % Rare und 20 % Epic. Es existiert noch keine Legendary-Karte. Die endgültige Truhenverteilung ist noch keine neue Balanceentscheidung.

Jeder vollständige Regionsabschluss (einschließlich erster Endloslieferung) gibt einmal eine Truhe. Bestehende vollständig abgeschlossene Regionen erhalten diese einmal nachträglich. Persistente Regionsmarker verhindern erneute Vergabe bei Synchronisierung oder Test-Reset. Der Test-Reset bewahrt bereits vorhandene Truhen ebenso wie Hermes-Siegel.

## Auffüller

Expeditions- und Überstundenauffüller füllen auf das aktuell wirksame persönliche Maximum einschließlich aktiver Kartenboni auf. Beispiel: Maximum 800, Vorrat 150 → +650. Bei vollem oder übervollem Vorrat bleibt das Item erhalten und der Vorrat unverändert. Die Vorschau zeigt die tatsächliche Auffüllmenge. Auffüllen selbst gibt keine Seasonpunkte; tatsächliches Ausgeben weiterhin einen Seasonpunkt je Punkt.
