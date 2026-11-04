# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand

Geprüfter und veröffentlichter Spielcode: `5e8010fc7cd47e337c5af62d5498b2841b85257d`, 04.11.2026.
Nachweis: [Mobile preview – Lauf 41854923005](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41854923005).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests | 302 bestanden, 0 Fehler, 0 übersprungen |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte Spiel-API | Smoke-Test erfolgreich |
| Android-OTA, Kanal preview | Erfolgreich veröffentlicht |
| Neue APK / physischer Gerätetest / iOS | Nicht durch diesen Lauf belegt |

Das Paket enthält gemeinsame Ausbaupunkte, kompakte Großauftragskarten, 30 regionale Geschichtsbilder, ein neues Überstundenmodal, Beschaffungsmodale, globale Abstände und die Angebotsbutton-Beschriftung.

Die Übernahme bestehender Punkte, unveränderte gekaufte Maxima, gemeinsame neue Gutschriften und Wiederholungsbelege sind automatisch geprüft. Bei der Vorprüfung wurde die unsichere Überstundenbestätigung per Vorratsvergleich durch eine serverseitige, im Befehlsbeleg wiederholbar abrufbare Bestätigung ersetzt. Regressionstests decken erfolgreiche Ausgaben trotz gleichzeitig regeneriertem Vorrat und erneut übertragene Anfragen ab. Veraltete UI-Testerwartungen und die Komponenteneinbindung wurden vor dem erfolgreichen Endlauf aktualisiert.

Alle 30 neuen JPEGs sind 1200 × 800 Pixel, vollständig dekodiert und ihre Repository-Blob-Hashes stimmen mit den geprüften Originaldateien überein. Gesamter Assetumfang rund 9 MB. Die regionale Bildserie wurde visuell kontrolliert; kein physischer Layout-/Gerätetest behauptet.

## Teststrategie

[Testübersicht](tests/README.md) beschreibt Gruppen und Grenzen. Hook-/Timerprüfungen ersetzen keine native Geräteprüfung. Gezielte Tests dienen einzelnen Änderungen; die vollständige Veröffentlichung verwendet den dokumentierten Workflow. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Vorheriger veröffentlichter Stand: `12729dbf25ab76f3b9ed75432105e0c4a59c845f`, [Lauf 41728496322](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41728496322), 290 Tests.

Frühere Berichte: [Mobile-Testhistorie](docs/archive/mobile-test-history.md). Sie beschreiben frühere Stände und keine offenen Freigaben.
