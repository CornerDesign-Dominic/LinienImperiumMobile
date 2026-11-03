# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand

Geprüfter Spielcode: `ca6f08d621f6f11aee0f57078dced1434fc6ffab`, 03.11.2026.
Nachweis: [Mobile preview – Lauf 41715219750](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41715219750).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript (`npm run typecheck`) | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests (`npm test`) | 273 bestanden, 0 Fehler, 0 übersprungen (Workflow-Log) |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte API (`scripts/smoke-backend.cjs`) | Erfolgreicher Workflow-Schritt |
| Android-OTA, Kanal `preview` | Erfolgreicher Workflow-Schritt |
| Neue APK / physischer Gerätetest / iOS | Durch diesen Lauf nicht belegt; APK-Job übersprungen |

Veröffentlicht am 03.11.2026 um 21:51 Uhr Europe/Berlin. Das Paket enthält die globale Bezeichnung Ausbaupunkte, das transparente Bauplan-/Säulenmotiv und die vorherige Dokumentationsbereinigung. Die acht lokalen Expeditionsabschlussprüfungen einschließlich Alttext-/Profilnamenkompatibilität waren ebenfalls erfolgreich. JSON, JavaScript-Syntax und 276 relative Markdown-Links wurden lokal geprüft.

Dies ist ein datierter Nachweis für den genannten Spielcode, kein pauschales Testversprechen für spätere Änderungen. Namen/Bild verändern keine Spielwerte oder gespeicherten Punkte-IDs. Ein physischer Gerätetest wird durch CI/Export nicht ersetzt.

## Teststrategie und Wiederholung

[Testübersicht](tests/README.md) beschreibt die Gruppen, Abdeckung und gezielte Prüfauswahl. Die [README](README.md) enthält die lokalen Befehle. Die ursprüngliche Web-Baseline und ihre Tests sind von der aktuellen mobilen Runtime zu unterscheiden.

Bei künftigen Änderungen Ergebnisse mit Commit, Befehl/Workflow, Ergebnis und Grenzen festhalten. Gezielte Tests reichen für eng begrenzte Änderungen; vollständige Releaseprüfungen bleiben Aufgabe des Veröffentlichungsworkflows. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Vorheriger belegter Stand: `22aa4dad756df65e71dd89dde98afdc6558f4b61`, [Lauf 41690415508](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41690415508).

Die bisherigen ausführlichen Zwischenberichte bleiben unter [Mobile-Testhistorie](docs/archive/mobile-test-history.md) erhalten. Sie beschreiben frühere Stände und sind weder aktuelle Spielregeln noch offene Aufgaben.
