# Projektdokumentation

Diese Dokumentation beschreibt **Linien Imperium Online / Projekt 117**, die native Mobile-App. Die frühere Webversion ist eine technische Grundlage und kein unverändert gültiges Regelwerk.

## Einstieg und Zuständigkeit

| Dokument | Zweck |
| --- | --- |
| [README](../README.md) | Projektstart, Architektur, Entwicklung und Veröffentlichung |
| [Spielregeln](../SPIELREGELN.md) | Aktuell implementierte mobile Regeln und ausdrücklich markierte Testwerte |
| [Tourregeln](../TOUR_RULES.md) | Zeitpunkt von Lieferung, Abrechnung, Snapshots und Fahrzeugwechseln |
| [Gestaltung](../DESIGN.md) | Gemeinsame Bildsprache, Farben, Karten und Bedienelemente |
| [Item-Audit](../ITEM_AUDIT.md) | Itemarten, Verwendung und Bezugswege |
| [Lokalisierung](../LOCALIZATION.md) | Deutsche/englische Darstellung und Übersetzungsgrenzen |
| [Offene Arbeiten](../PENDING_UPDATE.md) | Belegte Restpunkte und noch auszurollende Pakete |
| [Prüfstand](../TEST_REPORT.md) | Datierte Prüfergebnisse mit Commit und Workflow |
| [Testübersicht](../tests/README.md) | Testgruppen, Abdeckung und gezielte Prüfauswahl |

## Spielmechaniken im Detail

- [Regionale Transportkarten](gameplay/regional-transport-cards.md) und [Kartenboni](ui/card-bonus-steps.md)
- [Firmen-Transportausbau](transport-upgrades.md) und [Entwicklungspunkte](ui/company-development-points.md)
- [Einzelauftragsnavigation](single-orders-flow.md), [Reiter und Zuweisung](ui/single-order-tabs-and-assignment.md)
- [Großauftragsstart und Hilfe](ui/project-start-and-info.md), [Abschlussstatistik](ui/project-statistics.md)
- [Ausbaupunkte und Motiv](ui/ausbaupunkte.md), [Expeditionsabschlüsse](ui/expedition-completions.md), [Ortsmodale](ui/expedition-place-modals.md)
- [Beschaffungsgruppen](ui/procurement-groups.md), [Beschaffungsübersicht](ui/procurement-overview.md)
- [Stadthub-Boten und Werkzeugkästen](ui/hub-vehicle-parts.md), [Erträge](ui/hub-earnings.md), [Vertrieb](ui/hub-sales.md)
- [Pyramiden-Event](events/pyramid.md), [Premiumshop und Kaufgrenzen](ui/premium-shop.md)

Weitere Implementierungsnotizen liegen unter [ui](ui), gestalterische Kontextnotizen unter [design](design). Diese Dateien erläutern ihren jeweiligen Bereich; sie sind keine eigenständigen Release- oder Freigabelisten. Assetbezogene README-Dateien unter `assets/art` beschreiben Quellen und Zuordnungen.

## So werden die Dateien gepflegt

1. **Istzustand und Vorschlag trennen.** Aktuelle Regeln anhand der mobilen Runtime, Kataloge und Komponenten prüfen. Die eingebundene Webquelle kann durch mobile Module ersetzt werden.
2. **Eine Information an ihrem Hauptort pflegen.** Moduldetails verlinken, statt komplette Regeln in README, Änderungsnotizen und Testberichte zu kopieren. Bei Regeländerungen betroffene Haupt- und Detailreferenzen gemeinsam aktualisieren.
3. **Status belegen.** „Im Code“, „geprüft“ und „veröffentlicht“ getrennt behandeln. Prüfungen nennen Commit und Nachweis; eine Veröffentlichung benötigt einen erfolgreichen Deployment-/OTA-Lauf, nicht nur einen Branch oder Commit.
4. **Offenes abschließen.** Erledigte Sammelnotizen gehören in die Historie. Historische Testzahlen oder zeitweilige Freigabehinweise sind keine aktuellen Regeln. Bekannte aktive Testwerte ausdrücklich sichtbar halten.
5. **Dokumentation allein rollt kein Spielupdate aus.** Keine manuellen Release-Workflows und keinen Veröffentlichungsmarker ohne passenden Auftrag verwenden. Ein normaler Commit kann dennoch die automatische Validierung auslösen.
6. **Gezielt ergänzen und aufräumen.** Neue Dateien nur für eigenständige dauerhaft nützliche Inhalte. Beim Zusammenführen oder Verschieben Links und wertvolle Nachweise erhalten; kein paralleles zweites Regelwerk anlegen.

Bei einem Widerspruch gilt der tatsächlich ausgeführte mobile Code für das heutige Verhalten. Beschlossene, aber noch nicht umgesetzte Wünsche werden als solche in den offenen Arbeiten festgehalten; die Dokumentation erklärt sie nicht vorzeitig zur vorhandenen Funktion.

## Historisches Archiv

| Datei | Einordnung |
| --- | --- |
| [Web-Spielregeln](archive/web-game-rules.md) | Ursprüngliche Web-Baseline, keine heutige Mobile-Regelreferenz |
| [Mobile-Änderungshistorie](archive/mobile-update-history.md) | Frühere Sammel- und Veröffentlichungsnotizen mit damaligen Zwischenständen |
| [Mobile-Testhistorie](archive/mobile-test-history.md) | Frühere Prüfberichte; Ergebnisse gelten nur für den jeweiligen damaligen Stand |

Stand der ersten Bereinigung: 03.11.2026, mobile Grundlage `22aa4dad756df65e71dd89dde98afdc6558f4b61`. Spätere Codeänderungen müssen die betroffenen Referenzen mitführen.
