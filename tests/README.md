# Tests: Abdeckung und effizienter Einsatz

## Zweck und aktueller Umfang

`npm test` führt 192 benannte Prüfungen aus. Ein Fall enthält häufig mehrere Grenzwerte oder alle Karten/Regionen; die Fallzahl ist deshalb kein Maß für die Zahl der Assertions. Ein Fall führt zusätzlich die 23 ursprünglichen Web-Prüfskripte aus.

| Bereich | Was abgesichert wird | Wichtige Dateien |
| --- | --- | --- |
| Server, Aufträge, Flotten | Eingabevalidierung, Geld/XP/Kosten, echte Zuteilung, Reservierungen, Überstunden, Fristen, laufende Touren bei Verbesserungen, Offline-Abrechnung, keine Doppelbelohnung | mobile-engine, tour-updates, order-selection, fleet-details |
| Karten, Geschenke, Entwicklung | Alle 25 Karten, Boni, Ausbauten, Garagenwechsel, Drop-Pools, Duplikate/Shards, sichere Kaufwiederholung über Receipts, gesammelte Punkte, Basis/Boni-Trennung, Migration alter Speicherstände | transport-cards, gifts, development, collection-stats |
| Beschaffung und Stadthub | Freischaltung, Einzel-/Gruppenfahrten, Reserven/Vorauszahlungen/Erstattungen, Abbruch, Offline-Zeitlinie, tägliche Kisten, 30-Minuten-Grenzen, Teile und Fahrzeuglimits | procurement, procurement-groups, hub-vehicles, hub-ui |
| Events und Fortschritt | Eventzustände, Pass, Gemeinschaftsfortschritt/Ränge, Fristen, Transaktionswiederholung ohne Doppelgutschrift, Levelkurve und alte Speicherstände | events, pyramid, pyramid-store, linear-progression |
| Darstellung und Bedienentscheidungen | Kartenwerte, Inventar, Regions-/Ortszuordnung, ausgewählte Bildgrößen, Texte/Platzhalter, Eventreiter, Geschenkmodal-Timer/Rückkehr/Wiederholung, Staging/Bestätigung der Punkteverteilung | modal-flows, journey-map, place-modals, region-image-layout, item-catalog, i18n, pyramid-ui |
| Eingebundener Web-Unterbau | Unveränderte ursprüngliche Regeln des gepinnten Vendor-Codes, auf dem die Mobile-Erweiterungen aufsetzen | web-regression und web/*.test.cjs |

Die Vendor-Prüfungen sind bewusst eine **Legacy-Baseline**. Ihre ursprünglichen Preise, Kurven oder Grenzen beschreiben nicht automatisch das heutige Mobile-Spiel. Die aktuellen Regeln werden gegen `functions/src/engine.cjs` und die Mobile-Runtimes geprüft. Deshalb bleibt die Baseline erhalten, wird aber klar benannt.

## Änderungen bei dieser Prüfung

- Alle vorhandenen Fälle sind grün und den aktuellen Regeln bzw. der bewusst erhaltenen Vendor-Baseline zugeordnet. Keine fachliche Testgruppe pauschal entfernt.
- Der große Fahrzeugtest richtet jede Karte nur einmal ein und bereitet beide Verkehrsarten gemeinsam vor. Alle 50 tatsächlichen Starts (25 Karten × 2 Kategorien) bleiben geprüft. Wiederholte Belegungsversuche pro Karte entfallen; Belegungssperren sind weiterhin für beide Kategorien und detailliert in eigenständigen Transporttests abgesichert. 98 redundante Engine-Aufrufe weniger in diesem Fall.
- Der Offline-Gruppentest synchronisiert vor und genau auf echten Rückkehrzeitpunkten, statt 100 beliebige Ticks und zahlreiche Abfragen nach vollständigem Ende auszuführen. Der Vergleich mit einem einzigen Offline-Sprung sowie alle 20 abgerechneten Fahrten bleiben erhalten.
- Vier zusätzliche Verhaltenstests schließen die Lücke bei den zuletzt überarbeiteten Modalen: verzögerter Geschenkgewinn/Rückkehr/Wiederholung/Duplikat, Fehler/Überspringen/Timerbereinigung, reduzierte Bewegung/fehlendes Guthaben sowie gesammelte Punkte/Abbrechen/Begrenzung/einmalige Bestätigung.
- Die neuen Tests verwenden kleine Fixtures und kontrollierte Timer ohne reale Wartezeiten. Sie brauchen einzeln zusammen etwa 0,4 Sekunden inklusive Runnerstart.
- Als Wirksamkeitsprobe wurden zwei Fehler vorübergehend eingebaut: sofortige Geschenkanzeige ohne Pause und ein Drei-Punkte-Payload statt aller gesammelten Punkte. Die neuen Tests erkennen beide. Die Anwendung wurde danach unverändert wiederhergestellt.

## Laufzeit

Auf derselben Arbeitsumgebung: vorher 188 erfolgreiche Fälle in 16,39 s; danach 192 erfolgreiche Fälle in 14,03 s. Der größte Fahrzeugfall sank von etwa 5,72 auf 2,86 s, der Offline-Gruppenfall von etwa 3,84 auf 1,80 s. Das sind lokale Richtwerte, keine zugesicherte CI-Laufzeit.

Eine Begrenzung auf vier Worker brachte hier keinen Vorteil (17,90 s vor der Straffung). Die bestehende Standardparallelität bleibt erhalten. Alle bisherigen Prüfgruppen bleiben im normalen CI-Lauf; es gibt keinen separaten versteckten Volltest, der leicht vergessen werden könnte.

## Arbeitsweise

- Während der Entwicklung nur die betroffenen Dateien ausführen, z. B. `node --test tests/development.test.cjs tests/modal-flows.test.cjs`.
- Nach fachlichen Änderungen einmal `npm test`; nach einem Fehler zunächst den betroffenen Fall korrigieren und prüfen. Den gesamten Lauf nicht ohne neuen Grund mehrfach wiederholen.
- `npm run typecheck` prüft TypeScript separat. Android-Export und Sicht-/Bedienprüfung bei UI-/Assetänderungen; reine Testpflege benötigt keinen neuen App-Export.
- Neue Tests an Regeln, Fehlerfolgen oder Nutzerabläufen ausrichten. Keine zusätzlichen Snapshots für reine Abstände/Texte und keine Kopie der Implementierung als erwartetes Ergebnis.
- Feste Uhren und kontrollierte Zufallswerte verwenden. Keine großen Zufallssimulationen oder echten Timerpausen im normalen Lauf.

## Grenzen

Die Tests prüfen lokale Logik, ausgewählte Komponentenentscheidungen und simulierte Firestore-Transaktionen. Die kleinen Hook-/Timerprüfungen in `helpers/component-harness.cjs` ersetzen weder React Native noch einen Browser oder ein echtes Gerät: Layout, Gesten, Animationseindruck, Accessibility und native Modalübergänge bleiben Teil der separaten Sicht-/Bedienprüfung. Echte Firebase-Berechtigungen, Netzwerkausfälle und der veröffentlichte Server werden damit ebenfalls nicht vollständig geprüft; dafür gibt es den Live-API-Smoke-Test im Veröffentlichungsworkflow. Ein grüner Testlauf allein belegt keine erfolgte Veröffentlichung und keine vollständige Sicherheit des Spiels.

`hub-ui` prüft drei zusätzliche Abläufe: Mehrfachtipps/Fehler und Reiter, Fahrzeugplatz-/Ressourcen-Grenzen mit Ausbaupayload sowie Fundkisten-Cooldown und Ergebnisdialog. Die vorhandenen Hub-Regeltests decken Preise, tägliche Limits, Offline-Zeit und Migration ab.
