# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand

Geprüfter Spielcode: `22aa4dad756df65e71dd89dde98afdc6558f4b61`, 03.11.2026.
Nachweis: [Mobile preview – Lauf 41690415508](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41690415508).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript (`npm run typecheck`) | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests (`npm test`) | Erfolgreicher Workflow-Schritt; hier keine unbestätigte Fallzahl |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte API (`scripts/smoke-backend.cjs`) | Erfolgreicher Workflow-Schritt |
| Android-OTA, Kanal `preview` | Erfolgreicher Workflow-Schritt |
| Neue APK / physischer Gerätetest / iOS | Durch diesen Lauf nicht belegt; APK-Job übersprungen |

Dies ist ein datierter Nachweis für den genannten Spielcode, kein pauschales Testversprechen für spätere Änderungen. Die Dokumentationsbereinigung hat keine Spiellogik geändert; ihre Prüfung umfasst Quellenabgleich, relative Markdown-Links und den Dateidiff. Ein neuer kompletter App-Testlauf wird hier nicht behauptet.

## Teststrategie und Wiederholung

[Testübersicht](tests/README.md) beschreibt die Gruppen, Abdeckung und gezielte Prüfauswahl. Die [README](README.md) enthält die lokalen Befehle. Die ursprüngliche Web-Baseline und ihre Tests sind von der aktuellen mobilen Runtime zu unterscheiden.

Bei künftigen Änderungen Ergebnisse mit Commit, Befehl/Workflow, Ergebnis und Grenzen festhalten. Gezielte Tests reichen für eng begrenzte Änderungen; vollständige Releaseprüfungen bleiben Aufgabe des Veröffentlichungsworkflows. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Die bisherigen ausführlichen Zwischenberichte bleiben unter [Mobile-Testhistorie](docs/archive/mobile-test-history.md) erhalten. Sie beschreiben frühere Stände und sind weder aktuelle Spielregeln noch offene Aufgaben.
