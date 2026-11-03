# Tests: Abdeckung und effizienter Einsatz

## Zweck und Umfang

`npm test` führt mit Nodes Test-Runner die Dateien `tests/*.test.cjs` aus. Ein benannter Fall enthält häufig mehrere Grenzwerte oder alle Karten/Regionen; die Fallzahl ist deshalb kein Maß für die Zahl der Assertions. `web-regression.test.cjs` führt zusätzlich die ursprünglichen Web-Prüfskripte aus `tests/web/` aus.

Aktuelle Prüfergebnisse gehören mit Commit, Datum und Workflow nach [TEST_REPORT.md](../TEST_REPORT.md). Hier stehen die Strategie und die fachliche Zuordnung, keine fortlaufend veraltende Erfolgszahl. Bei dieser Dokumentationspflege wurde kein neuer Anwendungstestlauf behauptet.

| Bereich | Was abgesichert wird | Wichtige Testgruppen |
| --- | --- | --- |
| Server, Aufträge, Flotten | Eingabevalidierung, Taler/XP/Kosten, Zuteilung, Reservierungen, Überstunden, Fristen, laufende Touren bei Verbesserungen, Offline-Abrechnung, keine Doppelbelohnung | mobile-engine, tour-updates, order-selection, fleet-details |
| Karten, Geschenke, Entwicklung | Alle 25 Karten, Boni, Ausbauten, Garagenwechsel, Drop-Pools, Duplikate/Shards, Punkteverteilung, Basis/Boni-Trennung, Migration alter Spielstände | transport-cards, gifts, development, collection-stats, empire-company |
| Beschaffung und Stadthub | Freischaltung, Einzel-/Gruppenfahrten, Reserven/Vorauszahlungen/Erstattungen, Abbruch, Offline-Zeitlinie, tägliche Kisten, 30-Minuten-Grenzen, Werkzeugkästen und Botenlimits | procurement, procurement-groups, procurement-ui, hub-vehicles, hub-ui, hub-sales |
| Events und Fortschritt | Eventzustände, Pass, Gemeinschaftsfortschritt/Ränge, Fristen, Transaktionswiederholung ohne Doppelgutschrift, Levelkurve und alte Spielstände | events, pyramid, pyramid-store, pyramid-ui, linear-progression |
| Großauftragskategorien und Statistik | Kategoriezuordnung, Hilfs-/Startabläufe, Abschlusszähler pro Kunde bzw. global für Empfehlungen, Erhalt bei Migration | project-categories, project-statistics |
| Darstellung und Bedienentscheidungen | Kartenwerte, Inventar, Regions-/Ortszuordnung, ausgewählte Bildgrößen, Texte/Platzhalter, Geschenkmodal-Timer/Rückkehr/Wiederholung, Bestätigung der Punkteverteilung | modal-flows, journey-map, place-modals, region-image-layout, item-catalog, item-art, i18n |
| Verbindung und Shop | Koordination/Wiederholung von Anfragen, Response-Cache, Premiumkatalog, Guthaben-/Skinvalidierung und Besitzrechte | request-coordinator, response-cache, premium-shop |
| Eingebundener Web-Unterbau | Ursprüngliche Regeln des gepinnten Vendor-Codes, auf dem die Mobile-Erweiterungen aufsetzen | web-regression und web/*.test.cjs |

Die Web-Prüfungen sind bewusst eine **historische Baseline**. Ihre ursprünglichen Preise, Kurven oder Grenzen beschreiben nicht automatisch das heutige Mobile-Spiel. Aktuelle Regeln werden gegen `functions/src/engine.cjs` und die Mobile-Runtimes geprüft. Deshalb bleibt diese Baseline erhalten.

## Arbeitsweise

- Während der Entwicklung nur betroffene Dateien ausführen, z. B. `node --test tests/development.test.cjs tests/modal-flows.test.cjs`.
- Nach fachlichen Änderungen einmal `npm test`; nach einem Fehler zunächst den betroffenen Fall korrigieren und prüfen. Den gesamten Lauf nicht ohne neuen Grund mehrfach wiederholen.
- `npm run typecheck` prüft TypeScript separat. Android-Export und Sicht-/Bedienprüfung gehören zu UI-/Assetänderungen; reine Dokumentationspflege benötigt keinen neuen App-Export.
- Neue Tests an Regeln, Fehlerfolgen oder Nutzerabläufen ausrichten. Keine zusätzlichen Snapshots für reine Abstände/Texte und keine Kopie der Implementierung als erwartetes Ergebnis.
- Feste Uhren und kontrollierte Zufallswerte verwenden. Keine großen Zufallssimulationen oder echten Timerpausen im normalen Lauf.
- Bei Testoptimierung die fachliche Abdeckung erhalten: alle 25 Karten in beiden Verkehrsarten, konkrete Zeitgrenzen, Abrechnung und Fehlpfade statt nur weniger Aufrufe.

## Historische Optimierung

Die frühere Prüfung der 188 Fälle reduzierte redundante Engine-Vorbereitungen und Offline-Synchronisationen; die 50 tatsächlichen Kartenstarts und der Vergleich mehrerer Tourabschlüsse mit einem Offline-Sprung blieben erhalten. Vier Modalverhaltenstests wurden ergänzt. Die damaligen 188/192/198 Fallzahlen und Laufzeitmessungen sind historische Zwischenstände, keine Zusage für die heutige Suite. Die normale Runnerparallelität wurde beibehalten. Weitere spätere Ergänzungen sind im Repository und den datierten Prüfnachweisen nachvollziehbar.

## Grenzen

Die Tests prüfen lokale Logik, ausgewählte Komponentenentscheidungen und simulierte Firestore-Transaktionen. Die Hook-/Timerprüfungen in `helpers/component-harness.cjs` ersetzen weder React Native noch einen Browser oder ein echtes Gerät: Layout, Gesten, Animationseindruck, Accessibility und native Modalübergänge bleiben Teil der separaten Sicht-/Bedienprüfung.

Echte Firebase-Berechtigungen, Netzwerkausfälle und der veröffentlichte Server werden lokal nicht vollständig geprüft. `scripts/smoke-backend.cjs` prüft nach Deployment die echte Gastanmeldung, Speicherung, Anfragewiederholung und Zugriffssperre ohne Authentifizierung. Ein grüner Testlauf allein belegt keine erfolgte Veröffentlichung und keine vollständige Sicherheit des Spiels.
