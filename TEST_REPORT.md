# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand – Season, Expeditionen und Auszahlung

Veröffentlichter Spielcode: `0c92e343874107085fbff6a64bd5732c5b21f497`, 06.11.2026.
Nachweis: [Mobile preview – Lauf 42235427062](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42235427062).

- TypeScript, 370 automatisierte Tests und Android-Export erfolgreich; keine übersprungenen Tests.
- Firebase-Functions und Firestore-Regeln veröffentlicht; echte Spiel-API-Smokeprüfung erfolgreich.
- Android-OTA auf Kanal preview veröffentlicht. Keine neue APK erforderlich, kein physischer Gerätetest.
- Zusammengeführte PRs #16–#21: Season-Händlerkauf, 500-Punkte-Kundenbelohnungen mit Migration, Expeditions-/Truhenbalance und Auffüllmaximum, verzögerte vollständige Einzelauftragsauszahlung sowie alle beauftragten UI-Bereinigungen.
- Prüfungen berücksichtigen alte Spielstände, einmalige Auszahlung/Regionsgeschenke, Einzel-/Sammelabholung, Betriebskosten und Season-/Levelzeitpunkte, Kunden-Verkehrsart, Shop-/Season-Interaktionen, Modalüberschriften und Seitenlayout-Verträge. Automatisierte Komponententests ersetzen keine native Geräteansicht.

## Vorheriger belegter App-Prüfstand – Monatsseason

Veröffentlichter Spielcode: `b10dca11fe5edb4ffbde3ad17e9ac4024d9e81ed`, 05.11.2026.
Nachweis: [Mobile preview – Lauf 42125289468](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42125289468).

- TypeScript, 337 automatisierte Tests und Android-Export erfolgreich.
- Firebase-Functions und Firestore-Regeln erfolgreich veröffentlicht.
- Echte Spiel-API einschließlich Seasonstart, vier Dailys, Siegelvergabe und Premiumkauf mit wiederholter Anfragekennung, Dailyrotation und Seasonreset erfolgreich getestet.
- Android-OTA auf Kanal preview erfolgreich veröffentlicht; keine neue APK erforderlich. Kein physischer Gerätetest.
- Enthalten: Monatsseason, Testwerkzeugseite, Aufgaben-/Weg-/Endlosbelohnungen und gemeinsame Lootmodale, 1.000-Siegel-Pass mit nachträglichen Premiumbelohnungen, Siegel-Funde sowie vorherige Reiter-/Refresh-Kartenanpassungen. PRs #13–#15 sind integriert.
- Bekannte Testgrenze: Noch nicht abgeholte Seasonbelohnungen verfallen am Monatswechsel. Mengen und Stufenschwellen sind Testbalance.

## Vorheriger belegter App-Prüfstand

Geprüfter und veröffentlichter Spielcode: `c029782e864e94958250a0e8728ef7a737961b68`, 05.11.2026.
Nachweis: [Mobile preview – Lauf 42094829858](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42094829858).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests | 323 bestanden, 0 Fehler, 0 übersprungen |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte Spiel-API | Smoke-Test erfolgreich |
| Android-OTA, Kanal preview | Erfolgreich veröffentlicht |
| Neue APK / physischer Gerätetest / iOS | Nicht durch diesen Lauf belegt |

- Flottenwahl für Großaufträge mit fünf Fahrzeugbildern pro Reihe, serverseitiger Dauer-/Vergütungsprognose und übersichtlichen Angaben zu Fracht, Strecke und Frist.
- Vereinfachtes Botenmodal ohne technische Nummer, individuellen Kilometerstand und doppelten Ausbauhinweis; kumulative Botenstrecke in der Statistik.
- Fünf neu verzierte regionale Übergabescheine mit Schleife, Wachssiegel, Tischdekoration und passender sepiafarbener Serifenschrift.
- Ausbaupunkte nur im Verteilbutton der Handelsimperiumkarte; Levelaufstieg zeigt die Punkte mit ihrem Bild.
- Neues illustriertes XP-Gildenbuch und feste größere Belohnungszahlen; Taler-Belohnungen und Einnahmenvorschauen ohne Nachkommastellen.

Der erste Gesamtlauf stoppte vor Deployment: Die neue Boten-Kilometerstatistik legte bei Spielständen ohne Boten ein Nullfeld an und veränderte dadurch unverwandte Zustandsvergleiche. Die Initialisierung erfolgt jetzt nur bei vorhandenen Boten. Alle 37 betroffenen Boten-/Event-/Beschaffungstests und anschließend der gesamte Lauf sind erfolgreich. Die Prognose ist gegen eine echte unveränderte Flottenlieferung mit späterer Auszahlung geprüft; Bildreihenfolge, Bestätigung, Rundung und große Belohnungszahlen sind ebenfalls abgedeckt.

Fünf neue Übergabeschein-JPEGs (1200 × 800) und ein XP-PNG (512 × 512, Transparenz) wurden visuell geprüft, vollständig dekodiert und ihre Upload-Blob-SHAs abgeglichen. Kein physischer Layout-/Gerätetest behauptet. Bereits früher entfernte Boten ohne gespeicherte Kilometerdaten werden nicht rückwirkend rekonstruiert.

## Teststrategie

[Testübersicht](tests/README.md) beschreibt Gruppen und Grenzen. Hook-/Timerprüfungen ersetzen keine native Geräteprüfung. Gezielte Tests dienen einzelnen Änderungen; die vollständige Veröffentlichung verwendet den dokumentierten Workflow. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Vorheriger veröffentlichter Stand: `cf8038e133c46d5e5ab82fa832cf6898010b7843`, [Lauf 41907917201](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41907917201), 320 Tests.

Vorheriger veröffentlichter Stand: `12729dbf25ab76f3b9ed75432105e0c4a59c845f`, [Lauf 41728496322](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41728496322), 290 Tests.

Frühere Berichte: [Mobile-Testhistorie](docs/archive/mobile-test-history.md). Sie beschreiben frühere Stände und keine offenen Freigaben.

## Lokaler Prüfstand – aktives Seasonpaket

05.11.2026, vor Veröffentlichung: TypeScript erfolgreich, 337 Tests bestanden (0 Fehler), Android-Export erfolgreich, git diff --check fehlerfrei. Die neuen Tests prüfen Monatsgrenzen inklusive Sommerzeit/Schaltjahr, Dailyrotation und veraltete Versionen, tatsächlichen Punkteverbrauch, echte Einzel-/Großauftrags-/Beschaffungs-/Zustellungsaktionen, Premiumpreis und nachträgliche Abholung, Sammel-/Endlosbelohnungen sowie einmalige Siegel-Funde. Vier UI-Interaktionstests decken Kaufbestätigung, Reiter, Statussperren und Lootzeilen ab. Kein physischer Gerätetest. Der Releaseworkflow prüft zusätzlich die echte API einschließlich Seasonstart, Siegelgutschrift, Premiumkauf und Wiederholungsbehandlung.
