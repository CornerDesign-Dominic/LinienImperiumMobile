# Linien Imperium Online – aktuelle Mobile-Spielregeln

Stand: 03.11.2026, abgeglichen mit Mobile-Quellstand `ca6f08d621f6f11aee0f57078dced1434fc6ffab`. Beschrieben ist der implementierte Mobile-Stand, einschließlich ausdrücklich gekennzeichneter Testwerte; daraus folgt keine Freigabe für echte Spieler. Veröffentlichung und Prüfstand werden getrennt dokumentiert.

Maßgeblich ist die vom Server ausgeführte Kombination aus [Engine](functions/src/engine.cjs), deren Runtime-Modulen und Katalogen. Die [archivierten Web-Spielregeln](docs/archive/web-game-rules.md) erklären die alte Basis; Werte daraus gelten nur, soweit sie mobil nicht ersetzt wurden. Produktbegriffe und interne IDs dürfen sich unterscheiden: Nahverkehr heißt intern weiterhin `national`, Imperium-Taler weiterhin `coins`.

## 1. Start, Spielstand und Ablauf

- Firmengründung mit Firmen- und Fantasiestadtnamen. Die Namen sind Anzeigenamen; sie verändern weder Streckenprofil noch Vergütung.
- Start: Spielerlevel 1, 1.000 Imperium-Taler, Eselkarren auf Kartenstufe I mit 2 t in der Garage, fünf Angebote, 50 Expeditions- und 100 Überstundenpunkte. Die Botenstation ist ab Level 5 verfügbar.
- Die App verwendet Firebase-Konten: zunächst anonym, optional mit E-Mail/Passwort gesichert. Der serverseitige Spielstand und die Serverzeit bestimmen Fortschritt, Besitz und Auszahlungen. Der lokale Browser-Spielstand ist keine Beschreibung der mobilen Speicherung.
- Fällige Transporte werden bei Synchronisierung und vor Änderungen nachberechnet. Offline-Zeit ist keine zusätzliche Aktion und erzeugt keine wiederholten Abholungen.

## 2. Spielerlevel und Punkte

| Regel | Aktueller Wert |
| --- | --- |
| XP bis zum nächsten Level bei aktuellem Level L | `100 × L` |
| Gesamt-XP zum Erreichen von Level L | `50 × L × (L − 1)` |
| Belohnung je Levelaufstieg | 1 Expeditionsauffüller, 1 Überstundenauffüller, 3 Entwicklungspunkte |
| Wirkung beider Auffüller | Je +50 aktuelle Punkte der zugehörigen Art; Übermaximum erlaubt |
| Startmaximum Expedition / Überstunden | 50 / 100 |
| Grundregeneration | Je 1 Punkt alle 10 Minuten, nur unter dem jeweiligen Maximum |

Entwicklungspunkte werden unter **Handelsimperium → Entwicklung** auf die beiden Grundmaxima verteilt. Die gemeinsame Bestätigung verteilt alle derzeit offenen Levelpunkte; sie erhöht auch den jeweiligen aktuellen Punktestand um die zugeteilte Menge. Ausrüstungsboni kommen separat dazu.

**Ausbaupunkte** sind ein anderer Bestand: Jede neue einmalige Ortslieferung gibt einen freien Punkt. Dieser erhöht wahlweise das Expeditions- oder Überstundenmaximum dauerhaft um 1, **ohne** aktuelle Energie aufzufüllen. Eine bestätigte Verteilung ist nicht rückgängig zu machen; unvergebene Punkte bleiben gespeichert. Alte bereits gutgeschriebene Ortsboni bleiben durch Migration erhalten.

Garagenkarten können Maxima oder Expeditionsintervall verändern. Das Einsetzen einer solchen Karte füllt keine Energie auf. Beim Entfernen bleibt Überschuss bestehen, die Regeneration pausiert bis unter das Maximum. Änderungen erhalten den anteiligen Timerfortschritt.

Quellen: [Levelkurve](functions/src/progression-runtime.js), [Levelbelohnung und Auffüller](functions/src/engine.cjs), [Punkteboni](functions/src/transport-runtime.js), [Expeditionsabschlüsse](functions/src/expedition-completion-runtime.js); Details: [Entwicklung](docs/ui/company-development-points.md), [Ausbaupunkte](docs/ui/expedition-completions.md).

## 3. Transportkarten, Garage und Flotte

- 25 Landtransportkarten: je Region zwei Common, eine Uncommon, eine Rare und eine Epic. Die Seltenheit einer Karte bleibt fest. Der [Serverkatalog](functions/src/transport-cards.json) enthält Namen, individuelle Kapazitäten, Basistempo und alle zehn Bonusstufen.
- Kartenstufen I–X erhöhen den Kartenbonus. Duplikate geben je 1 gemeinsamen Shard derselben Seltenheit. Die neun Stufenaufstiege kosten 1/2/4/8/16/32/64/128/256 Shards. Herstellung kombiniert 10 Common zu 1 Uncommon bzw. 10 Uncommon zu 1 Rare.
- Geschwindigkeitsrang und Kapazitätsmodule sind getrennte Fahrzeugausbauten. Rang 0–50 gibt je +0,5 % des individuellen Basistempos und kostet Zahnräder gemäß `RANK_GEAR_COSTS` in der Web-Basis. Ein Kapazitätsmodul gibt +5 % der individuellen Grundkapazität; zehn Stufen ergeben +50 %. Das ist kein pauschaler Ausbau um 0,5 t.
- Die Garage hat zehn Kartenplätze. Jede Karte ist dort höchstens einmal eingesetzt. Freie Karten lassen sich entfernen oder ersetzen; Besitz, Ausbauten und Fahrstatistik bleiben erhalten. Aktive Einzelaufträge, Expeditionen, Beschaffung oder eine Ersatzfahrzeugreservierung sperren das Herausnehmen.
- Alle gefundenen Karten können Nah- und Fernverkehr bedienen. Die alten LKW-Klassenbeschränkungen gelten für die Mobile-Karten nicht.
- Drei Flottenvorlagen mit je fünf Plätzen dienen Großaufträgen und Events. Innerhalb einer Flotte keine doppelte Karte. Dieselbe Karte darf parallel in der Garage und in mehreren Flottenprojekten eingesetzt sein. Parallele Großaufträge sind nicht auf einen Auftrag begrenzt.
- Eigenboni gelten für das Fahrzeug, Flottenboni für die jeweilige Flotte einschließlich Geber, Garagenboni für eingesetzte Garagenfahrzeuge einschließlich Boten. Verschiedene Transportboni addieren sich. Besitz allein aktiviert keinen Garagenbonus.

Aktuelle Bonusstaffeln: [einfache Kartenboni](docs/ui/card-bonus-steps.md). Vollständiger Kartenkatalog und Einsatzdetails: [regionale Transportkarten](docs/gameplay/regional-transport-cards.md).

## 4. Einzelaufträge und Transportabrechnung

Die Reiter **Laufende / Angebote / Aufträge** trennen aktive Transporte, Börsenangebote und gespeicherte Aufträge. Fahrzeugwahl mit zwei direkten Sortierbuttons **Gewinn / Geschwindigkeit**, standardmäßig Gewinn. Auswahl und Start sind getrennte Schritte; belegte Fahrzeuge bleiben gesperrt sichtbar.

Die Börse startet mit fünf Angeboten, grundsätzlich 80 % Nah- und 20 % Fernverkehr. Disposition erweitert sie auf bis zu 15. Angebote werden alle 15 Minuten kostenlos erneuert; gehaltene Aufträge bleiben erhalten. Manuelles Erneuern kostet `250 × max(1, Fahrzeugzahl) × (1 + manuelle Wechsel seit dem letzten automatischen Wechsel)` Taler. Ein Halteplatz besteht ab Beginn; Vertrieb kann weitere freischalten. Eine Zuweisung füllt den Angebotsplatz sofort nach.

Basis-Angebotswerte: Nahverkehr 10–40 t und 30–100 km, Fernverkehr 10–50 t und 100–200 km. Die vorhandene Routenliste entscheidet über tatsächliche Strecken; existiert keine passende Route, kann eine hinterlegte Strecke abweichen. Firmenausbauten verändern die Angebotsgrenzen. Kundengebundene Angebote setzen die Freischaltung des Stammkunden voraus.

| Fahrart | Fahrt je Tour | Vergütung und XP |
| --- | --- | --- |
| Single Way (90 % der normalen Angebote) | Beladen hin, leer zurück | Hinfracht |
| Dual Way (10 %) | Beladen hin und zurück | Beide Frachtrichtungen |

Die letzte Tour nimmt nur die tatsächliche Restmenge mit. Grundtempo in km/s:

`individuelles Basistempo × (1 + 0,005 × Rang) × (1 + Tempoboni / 100) × (1 − 0,01 × geladene Tonnen)`.

Grundvergütung: 1 Taler je beladenem tkm, Lastkosten: 0,10 Taler je beladenem tkm; zusätzlich Fahrzeugkosten für die tatsächlich gefahrenen Kilometer. Kundenvergütung und Kartenboni verändern die entsprechenden Anteile. Die Abschlussprämie beträgt grundsätzlich 1 Taler je vergüteter Tonne zuzüglich des Firmen-Prämienbonus; Privatabholungen haben keine solche Prämie. Transport-XP entsprechen den vergüteten Tonnen, gegebenenfalls mit XP-Boni. Botenstation und Expeditionsmissionen geben keine Spieler-XP.

Touren buchen Transportertrag; Abschlussbeute und Prämien werden anschließend abgeholt. Der Sammelbutton der Einzelaufträge zahlt auch fertige wiederholbare Expeditionsaufträge aus. Beute wird einmal ermittelt und bis zum Einsammeln gespeichert.

**Laufende Touren frieren Fahrzeugwerte und Abrechnung ein.** Ausbauten, Boni und Fahrzeugwechsel wirken auf Folgetouren. Ein geplanter Ersatz muss frei sein und wird reserviert. Maßgebliche Einzelheiten, Flottenwechsel und Prognosen: [TOUR_RULES.md](TOUR_RULES.md), implementiert in [tour-runtime.js](functions/src/tour-runtime.js).

## 5. Expeditionen und Stammkunden

| Gebiet | Stammkunde | Endlosort |
| --- | --- | --- |
| Kronenlande | Königliches Handelskontor | Kronenhafen |
| Weite Ebenen | Prärie-Handelsgesellschaft | Weidenhafen |
| Safranstraße | Bund der Karawanenhändler | Karawanserei der sieben Bögen |
| Jadetal | Handelshaus der Jadebrücke | Handelshof am Jadetor |
| Nordmark | Nordlicht-Kontor | Handelsfeste am Eisstrom |

Jede Region hat sieben Orte und einen Endlosort. Erkundung investiert je Klick 1 Expeditionspunkt. Die Kosten pro Ort sind `3 + 9 × Regionsindex + floor(Ortsindex / 2)` bei nullbasierten Indizes. Nach Entdeckung aller sieben Orte wird der Endlosort sichtbar und die nächste Region zugänglich; die Bonuslieferungen sind keine Voraussetzung für diesen Zugang.

Jeder entdeckte Ort bietet eine einmalige optionale Lieferung mit Garagenfahrzeug. Sie vergibt automatisch 1 Ausbaupunkt. Die erste Endlosort-Lieferung schaltet den regionalen Stammkunden frei und gibt einmalig 1 Kapazitätsmodul. Abschlüsse geschehen still im Hintergrund, ohne Popup. Der freie Ausbaupunkt steht automatisch im Handelsimperium zur manuellen Verteilung bereit. Für die Beschaffungsfreischaltung müssen zusätzlich alle Ortslieferungen und der Endlosort-Abschluss erledigt sein.

Eine Auslosung am Endlosort kostet 5 Expeditionspunkte. 10 % geben direkt eine regionale Karte; innerhalb dieser Kartenchance gelten insgesamt 60 % Common, 30 % Uncommon, 9 % Rare und 1 % Epic. Die übrigen 90 % verteilen sich auf Transportkartenaufträge (20 %), Materialaufträge (75 %), Sonderaufträge (4,5 %) und Empfehlungsaufträge (0,5 %). Diese vier Anteile sind bedingt auf den Nicht-Kartenfund. Wiederholbare Transportaufträge verwenden freie Garagenfahrzeuge; ihre Beute wird bei Ankunft einmal ausgewürfelt und gemeinsam unter Einzelaufträge abgeholt.

Stammkunden erhalten Beziehungspunkte und verteilbare Kundenverbesserungen für Vergütung sowie Sonder-/Empfehlungsauftragschancen. Sonderaufträge werden pro Kunde gezählt, Empfehlungsaufträge gemeinsam und unabhängig vom Ursprungskunden. Die Zähler steigen bei erfolgreichem Abschluss, nicht erneut beim Synchronisieren oder Abholen.

Quellen: [Identitäten](functions/src/customer-identities.json), [Auslosungen](functions/src/gifts-runtime.js), [automatische Abschlüsse](functions/src/expedition-completion-runtime.js), [Statistik](functions/src/project-statistics-runtime.js).

## 6. Großaufträge und Überstunden

Sonder- und Empfehlungsaufträge werden mit einer gewählten Flottenvorlage gestartet. Kategorie-Fragezeichen erklären Herkunft und tatsächliche Beutechancen; vorhandene Aufträge verlangen eine ausdrückliche Startbestätigung. Abgeschlossene Kategorienverläufe entfallen aus der Ansicht, ausstehende Prämien und kumulative Statistiken bleiben erhalten.

Ein Überstundenpunkt entspricht 1.000 tkm. Passive Lieferung und Überstunden verwenden dieselbe zugrunde liegende Transportabrechnung. Bei endlichen Aufträgen werden nur noch lieferbare Teilmengen gebucht. Sonderaufträge haben grundsätzlich eine Stunde, Empfehlungen drei Stunden Frist; maßgeblich sind die gespeicherten Werte des konkreten Auftrags. Bereits gestartete Touren behalten ihre Snapshots.

Details: [Start und Information](docs/ui/project-start-and-info.md), [Abschlussstatistik](docs/ui/project-statistics.md), [Tourregeln](TOUR_RULES.md).

## 7. Materialbeschaffung

Die Beschaffungsstelle einer vollständig abgeschlossenen Region nutzt freie Kartenfahrzeuge aus der Garage, bei unverändert möglichem parallelem Flotteneinsatz. Bis zu zehn ausgewählte Fahrzeuge ziehen aus einem gemeinsamen Tourenvorrat oder verwenden dieselbe Kontoreserve.

| Gebiet 1–5 | Preis je gestarteter Fahrzeugtour |
| --- | ---: |
| Kronenlande | 8.000 Taler |
| Weite Ebenen | 12.000 Taler |
| Safranstraße | 16.000 Taler |
| Jadetal | 20.000 Taler |
| Nordmark | 24.000 Taler |

Dauer einer neuen Tour: `ceil(600.000 ms / aktuelle Leergeschwindigkeit in km/s)`. Angefangene Touren ändern ihre Dauer nicht. Feste Tourenzahl wird einmal im Voraus bezahlt; N bedeutet N Touren für die gesamte Gruppe. Reservefahrten bezahlen bei Abfahrt und verlassen den Einsatz dauerhaft, wenn die nächste Tour die Reserve unterschreiten würde.

Jede vollständige Tour gibt aktuell 5 Common-Zahnräder, unabhängig zusätzlich 20 % auf 1 Uncommon-Zahnrad, 0,3 % auf 1 Rare-Zahnrad und 0,1 % auf 1 Firmenausbau-Item. Alle Regionen nutzen denselben Beutepool. Preise und Beutemengen werden nicht durch Kapazität oder Vergütungsboni verändert.

„Nach laufender Tour beenden“ lässt gestartete Touren abschließen; „sofort abbrechen“ verwirft deren Belohnung. Nur ungestartetes vorausbezahltes Guthaben wird zurückerstattet. Erträge warten auf gemeinsame Abholung; keine automatische Einsammlung. Gesamt- und Regionszähler bleiben erhalten.

Quelle: [procurement-runtime.js](functions/src/procurement-runtime.js); Details: [Gruppenregeln](docs/ui/procurement-groups.md), [aktuelle Übersicht](docs/ui/procurement-overview.md).

## 8. Botenstation und Boten

- Ab Level 5 ein Botenplatz, danach alle fünf Level ein weiterer; maximal 20 bei Level 100. Bestehende Fahrzeuge über dem neuen Limit bleiben erhalten.
- Ein Lastwombat-Bote kostet 25.000 Taler und startet mit 2 t. Es gibt ein Stadtmodell, keinen zweiten Händlerkauf. Kapazität und Antrieb haben jeweils zehn Stufen: +0,2 t bzw. +2,5 % Grundtempo je Stufe. Zielstufe N kostet `14 × N` Werkzeugkästen und `2.500 × N` Taler. Neue Boten verwenden keine Karten-Shards, Zahnradränge oder Kapazitätsmodule.
- Ein Einkaufszyklus dauert 60 Minuten. Vertrieb Stufe 0 verwendet davon 40 Minuten, jede der 20 Stufen zusätzlich 30 Sekunden, maximal 50 Minuten. Laufende Zyklen behalten ihre eingefrorenen Werte.
- Die Kasse fasst sechs abgeschlossene Einkaufszyklen; volle Kasse pausiert den Botenstation. Vollständige Kasse abholen startet einen neuen Zyklus bei Minute 0, Teilabholung verschiebt den Zyklus nicht.
- Vertriebsausbau kostet Lieferantenkontakte und Firmenausbau-Items, keine zusätzlichen Taler; Dauer `12 Stunden × Zielstufe`. Die zusätzliche Warenmenge gilt für den nächsten Einkauf nach Fertigstellung.
- Drei Fundkisten je UTC-Tag, mindestens 30 Minuten zwischen tatsächlichen Öffnungen, je 10–20 Werkzeugkästen. Keine angesammelten Tagesöffnungen.
- Bei stündlichem Einkauf ein 50-%-Versuch auf 1 Werkzeugkasten, maximal 24 Versuche pro UTC-Tag, nicht je Fahrzeug. Keine neuen Versuche bei voller Kasse oder ohne eingesetzte Boten. Diese Funde werden mit den Erträgen abgeholt.

Quelle: [hub-vehicles-runtime.js](functions/src/hub-vehicles-runtime.js); Details: [Boten und Werkzeugkästen](docs/ui/hub-vehicle-parts.md), [Vertrieb](docs/ui/hub-sales.md).

## 9. Handelsimperium, Vorräte und Herstellung

Prämie, Menge und Reichweite werden für Nah- und Fernverkehr getrennt ausgebaut. Prämie hat 1.000 Stufen, Menge und Reichweite jeweils 100. Prämienstufe N kostet `1.000 × N` Taler und `1 + floor((N−1)/25)` Firmenausbau-Items und gibt +1 Prozentpunkt auf die Abschlussprämie. Mehrfachkäufe und Einzelkäufe verwenden dieselben kumulierten Kosten. Endwerte und Budgettabellen: [Transportausbau](docs/transport-upgrades.md); Quelle: [company-transport-runtime.js](functions/src/company-transport-runtime.js).

Firmenausbau-Items entstehen unter anderem über den gemeinsamen Transportfortschritt (750.000 beladene tkm je Item) sowie Material-/Beschaffungsbeute. 100 Abholhinweise ergeben eine Privatabholung. Das frühere Rezept Firmenausbau-Items → Kundenauftrag ist serverseitig deaktiviert; bereits hergestellte Aufträge bleiben nutzbar. Andere Abteilungen sind nur insoweit verfügbar, wie die aktuelle Oberfläche und der Server sie anbieten.

## 10. Event und Großhändler

Das Pyramiden-Event besitzt **Event / Pass / Ränge**. Solotests und gemeinsamer Pyramidenbau haben eigene Regeln; insbesondere zählen Steine bereits nach der beladenen Hinfahrt, während die Tour bis nach der Rückfahrt eingefroren bleibt. Der persönliche Pass verlangt 85 von 100 möglichen Punkten für die letzte Stufe; die legendäre Passkarte ist ein Platzhalter, keine fertige spielbare Transportkarte. Keine Eventshards und keine Ranglistenpreise. Maßgebliche Details und vorläufige Skalierung: [Pyramidenregeln](docs/events/pyramid.md).

Der Großhändler trennt Geschenke, Skins und Aufladen. Imperium-Taler sind normale Spielwährung, Hermes-Siegel die vorbereitete Premiumwährung. Aktuelle Premium-Pakete: 250/500/1.000/2.000/3.000/5.000 Siegel mit Referenzpreisen 2,50/5/10/20/30/50 Euro. Echtgeldkäufe sind deaktiviert; es gibt keine aktive Zahlungsabwicklung. Nur der kostenlose Standard-Lastwombat ist als fertiger Skin verfügbar. Details: [Premiumshop](docs/ui/premium-shop.md), [Serverkatalog](functions/src/premium-shop.cjs).

## 11. Aktive Testwerte und Grenzen

Diese Werte sind im geprüften Quellstand tatsächlich aktiv und dürfen nicht mit endgültiger Balance verwechselt werden:

| Testfunktion | Implementierter Stand |
| --- | --- |
| Expeditions-Missionsdauer | `EXPEDITION_TEST_DURATION_MS = 15.000` in der Engine; verkürzt auch laufende Missionspläne. Endgültige Dauern sind damit nicht repräsentiert. |
| Regionale Geschenke | 10 Taler pro Öffnung; jede der fünf Gebietskarten testweise 20 %. Diese Gleichverteilung gilt nicht für Expeditionen. |
| Testwerkzeuge | Taler, XP, Expeditions-/Überstundenpunkte, Testaufträge und Zurücksetzen sind weiterhin vorhanden. |
| Premium | Referenzpreise und Motive vorhanden, echte Kaufbuttons deaktiviert. |

Historische Preis-, Level-, Refill- und Missionszeitangaben sind keine heutige Spielregel. Änderungen an diesem Dokument sollen mit den betroffenen Runtime-Modulen und Detaildokumenten gemeinsam gepflegt werden; Testberichte belegen nur den jeweils angegebenen Prüflauf.
