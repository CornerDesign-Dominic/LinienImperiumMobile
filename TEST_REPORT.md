# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand – Transportkarten-Identitäten, 08.11.2026

Veröffentlichter Spielcode: `feb3834edf0bbc55935e440a78697d382d8ad93d`. [Mobile-preview-Lauf 42524779921](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42524779921) ist vollständig erfolgreich: Validierung mit 418 Tests, Android-Export, Firebase-Deployment, Live-API-Smokeprüfung und Android-OTA im Kanal preview. Die bestehende APK erhält das kompatible Update; keine neue APK gebaut.

- 25 freigegebene Motive als 1024 × 1024 RGB-JPEGs eingebunden; Eigenname und Titel getrennt, Packesel heißt Pepe. Korrekturversionen von Lian, Eira und Niva verwendet.
- TypeScript und vollständige Suite mit 418 Tests erfolgreich. Nach Ergänzung der Titel in Fundansicht/Screenreader und der Namensnormalisierung in Flottenvorschauen zusätzlich TypeScript und zehn betroffene Modal-/Flottentests erfolgreich.
- Android-Export erfolgreich; alle 25 neuen Bilddateien enthalten. Keine native Runtime-Änderung.
- Reale React-Native-Web-Komponenten mit synthetischen Spielständen: alle fünf Regionen bei 320/390/430 px (15 Ansichten), vier Kartendetails bei 320 px und englische Kronenlande-Ansicht geprüft. Kein horizontaler Überlauf, keine fehlgeschlagenen Assetanfragen oder JavaScript-Laufzeitfehler. Screenshotprüfung der Karten einschließlich Namen/Titeln. Kein physischer Android-Gerätetest.
- Nach Deployment alle 25 Namen, Titel, Karten-IDs und Bildschlüssel zusätzlich direkt gegen den Live-Katalog geprüft; Pepe bestätigt. Prüfzugang war ein getrenntes temporäres Gastkonto, anschließend gelöscht.

## Vorheriger belegter App-Prüfstand – Einheitlicher Spielrahmen und Systemleisten

Android-OTA: `8eec5cfdfe3c0484c5e8ab126e6ac388abf7b6ef`, 07.11.2026, [Release-Lauf 42418929844](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42418929844). Validierung, Deployment, API-Prüfung und OTA sind erfolgreich; dessen erster APK-Versuch ist fehlgeschlagen und durch den folgenden separaten Build ersetzt.

Signierte APK: `ab10d0185f3bc296247a5953f261336952ef1193`, Version 0.1.0 / Android-VersionCode 2, [erfolgreicher APK-Lauf 42420006604](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42420006604), [EAS-Build](https://expo.dev/accounts/cornerdesign/projects/linien-imperium-online/builds/2ee98a37-80a1-45a1-b7fa-449e9119a59d).

- Lokal: TypeScript, drei bestehende Header-Tests und Expo-Introspektion des Android-Themes erfolgreich. Mobile Browseransicht bei 360 × 780 geprüft; kein physischer Android-Gerätetest.
- Die bestehende Release-Pipeline hat die vollständigen 417 Tests einmal ausgeführt (alle bestanden), den Android-Export erstellt und Backend/API/OTA erfolgreich abgeschlossen. Die anschließenden reinen APK-Builds wiederholen keine Spieltest-Suite.
- Rahmen ohne Textur in einheitlichem Petrol, ausgeglichene Header-Abstände, schlanker XP-Balken, kompakter flacher Seitenkopf, kontinuierlich verblassende Goldlinien und ruhiger aktiver Navigationstab. Android-Theme ohne Kontrastabdunklung der Drei-Tasten-Navigation; diese Theme-Änderung wird erst mit der neuen APK wirksam.
- Zwei APK-Versuche deckten einen bestehenden Ausschluss gemeinsam verwendeter Quelldaten im EAS-Archiv auf. Der korrigierte Build prüft das tatsächlich erzeugte EAS-Archiv vor dem Upload und enthält die benötigten gemeinsamen Dateien. Native Kompilierung und Signierung erfolgreich; APK-Download mit HTTP 206 und ZIP/APK-Dateisignatur geprüft.

## Vorheriger belegter App-Prüfstand – Boten, Kundenfunde und UI

Veröffentlichter Spielcode: `81da5d17a178394ee4e15e233a406607275da6b5`, 07.11.2026.
Nachweis: [Mobile preview – Lauf 42368749943](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42368749943).

- TypeScript und alle 417 Tests bestanden, keine Fehler oder übersprungenen Tests. Android-Export erfolgreich.
- Firebase-Functions und Firestore-Regeln veröffentlicht, Live-API-Smokeprüfung erfolgreich. Android-OTA im Kanal preview veröffentlicht; keine neue APK und kein neuer physischer Gerätetest.
- Integriert sind PRs #22–#27 mit Gear-only-Funden, Kundenseltenheiten und -chancen samt einmaliger Erstattung, 30-Sekunden-Reservierung, Beschaffungsabholung, Boten-Anzeigeskalierung und allen beauftragten UI-/Buchgrafikänderungen. Das bereits veröffentlichte Wombat-Paket ist erhalten.
- Bei der Integration wurden Skin-Auswahl und reine Anzeigeskalierung zusammengeführt sowie ein alter Test von Personenicon auf das neue Beziehungsbuch aktualisiert. Nach außen auslaufende Linien sind durchgehend geformt. Die vollständige Suite wurde danach erneut erfolgreich ausgeführt.
- Die bestätigte Zuordnung verändert nur Sonder-/Empfehlungschancen; normale Kundenerscheinung bleibt bei 5 % bzw. 20 %. Keine neue Erscheinungsfähigkeit eingeführt.

## Vorheriger belegter App-Prüfstand – Season, Expeditionen und Auszahlung

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
