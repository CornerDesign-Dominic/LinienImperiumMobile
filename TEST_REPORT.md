# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand

Geprüfter Spielcode: `12729dbf25ab76f3b9ed75432105e0c4a59c845f`, 03.11.2026.
Nachweis: [Mobile preview – Lauf 41728496322](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41728496322).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript (`npm run typecheck`) | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests (`npm test`) | 290 bestanden, 0 Fehler, 0 übersprungen (Workflow-Log) |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte API (`scripts/smoke-backend.cjs`) | Erfolgreicher Workflow-Schritt |
| Android-OTA, Kanal `preview` | Erfolgreicher Workflow-Schritt |
| Neue APK / physischer Gerätetest / iOS | Durch diesen Lauf nicht belegt; APK-Job übersprungen |

Veröffentlicht am 03.11.2026. Das freigegebene Sammelpaket enthält stille Expeditionsabschlüsse, Regionskopf/Ortsschilder, Botenstation und ganzzahlige Ertragsanzeige, Großauftragstitel/Reiter/Sortierung/gemeinsame Laufend-Liste, 15 Stammkundenwarenbilder, Punkteverteiler und die 30-stufige Season-Vorschau. Season-Fortschritt, Abholung und Premiumkauf bleiben bis zur Festlegung der Regeln deaktiviert.

Die Releaseprüfung erkannte eine beschädigt zusammengeführte Großauftragsdatei, zwei veraltete Testerwartungen und drei beschädigte PNG-Dateien. Diese wurden vor dem Rollout korrigiert. Alle 15 neuen PNGs wurden gegen die mit Pillow vollständig geprüften Originaldateien anhand ihrer Git-Blob-Hashes abgeglichen. Der erfolgreiche Endlauf prüft den korrigierten Gesamtstand.

Dies ist ein datierter Nachweis für den genannten Spielcode, kein pauschales Testversprechen für spätere Änderungen. Ein physischer Gerätetest wird durch CI/Export nicht ersetzt.

## Teststrategie und Wiederholung

[Testübersicht](tests/README.md) beschreibt die Gruppen, Abdeckung und gezielte Prüfauswahl. Die [README](README.md) enthält die lokalen Befehle. Die ursprüngliche Web-Baseline und ihre Tests sind von der aktuellen mobilen Runtime zu unterscheiden.

Bei künftigen Änderungen Ergebnisse mit Commit, Befehl/Workflow, Ergebnis und Grenzen festhalten. Gezielte Tests reichen für eng begrenzte Änderungen; vollständige Releaseprüfungen bleiben Aufgabe des Veröffentlichungsworkflows. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Vorheriges veröffentlichtes Paket: `ca6f08d621f6f11aee0f57078dced1434fc6ffab`, [Lauf 41715219750](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41715219750), 273 Tests.

Vorheriger belegter Stand: `22aa4dad756df65e71dd89dde98afdc6558f4b61`, [Lauf 41690415508](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41690415508).

Die bisherigen ausführlichen Zwischenberichte bleiben unter [Mobile-Testhistorie](docs/archive/mobile-test-history.md) erhalten. Sie beschreiben frühere Stände und sind weder aktuelle Spielregeln noch offene Aufgaben.
