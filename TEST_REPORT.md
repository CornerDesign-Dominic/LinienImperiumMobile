# Prüfstand und Nachweise

## Letzter belegter App-Prüfstand

Geprüfter und veröffentlichter Spielcode: `cf8038e133c46d5e5ab82fa832cf6898010b7843`, 04.11.2026.
Nachweis: [Mobile preview – Lauf 41907917201](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41907917201).

| Prüfung | Belegtes Ergebnis |
| --- | --- |
| TypeScript | Erfolgreicher Workflow-Schritt |
| Automatisierte Tests | 320 bestanden, 0 Fehler, 0 übersprungen |
| Android-Export | Erfolgreicher Workflow-Schritt |
| Firebase-Server und Firestore-Regeln | Deployment erfolgreich |
| Echte Spiel-API | Smoke-Test erfolgreich |
| Android-OTA, Kanal preview | Erfolgreich veröffentlicht |
| Neue APK / physischer Gerätetest / iOS | Nicht durch diesen Lauf belegt |

- Großauftragseinnahmen und XP werden bis zur bestätigten Abholung gesammelt; Überstunden folgen derselben Abrechnung. Altgutschriften werden nicht erneut ausgezahlt.
- Erledigte Großaufträge öffnen das Detail mit Übergabeschein und „Belohnung entgegennehmen“. Zusätzliche Prämien-/Informationskarten und direkter Abholbutton in der Liste entfallen.
- Einzelaufträge öffnen direkt die unveränderte Fahrzeugwahl; Auftragsdetailseite entfernt, Pinnadel ohne Kreis.
- Kundendetails zeigen vier Waren nebeneinander sowie kompakte Angaben zu Verkehr und Herkunft.
- Handelsimperium mit neuem Säulenbau und Kisten-Lorbeer-Bannern; kompakte Ausbaupunktedarstellung ohne Titel „Entwicklung“.
- Bildkorrekturen: Safran-Karawane und Tragekiste, sichere Kronenlande-Kutsche und zeremonielle Ankunft.
- Botenstation ohne normalen Lauftext „Verteilung läuft“; kompakte Beschaffungsdauer direkt neben der Stoppuhr.
- Garage regulär neun Plätze (3 × 3), bestehender Überhang bleibt bis zur manuellen Entfernung erhalten.

Die neuen Prüfungen decken unter anderem aufgeschobene Großauftragseinnahmen und XP, Überstunden, Altbestände ohne Doppelzahlung, fehlgeschlagene Aufträge, Cloud-Wiederholungsbelege, direkte Einzelauftragszuweisung sowie die Neuner-Garagengrenze und erhaltene Altüberhänge ab. Der erste Veröffentlichungslauf wurde vor Deployment durch eine veraltete Erwartung „je Tour“ gestoppt. Nach Anpassung und zusätzlicher Prüfung der gemeinsamen Stoppuhr-/Zeitzeile ist der vollständige Lauf erfolgreich. Die im lokalen Textcheckout fehlende bestehende Fahrzeugbilddatei liegt im Repository korrekt vor; die Bilddateiprüfung besteht im vollständigen Workflow.

Vier korrigierte regionale Produktionsbilder sind 1200 × 800 Pixel; das neue Handelsimperiumbild ist 1200 × 675 Pixel. Die Bildarbeiter haben Motive visuell kontrolliert, die JPEGs vollständig dekodiert und Upload-Blob-SHAs abgeglichen. Kein physischer Layout-/Gerätetest behauptet.

## Teststrategie

[Testübersicht](tests/README.md) beschreibt Gruppen und Grenzen. Hook-/Timerprüfungen ersetzen keine native Geräteprüfung. Gezielte Tests dienen einzelnen Änderungen; die vollständige Veröffentlichung verwendet den dokumentierten Workflow. Historische Fallzahlen sind keine Zielvorgabe.

## Historie

Vorheriger veröffentlichter Stand: `12729dbf25ab76f3b9ed75432105e0c4a59c845f`, [Lauf 41728496322](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41728496322), 290 Tests.

Frühere Berichte: [Mobile-Testhistorie](docs/archive/mobile-test-history.md). Sie beschreiben frühere Stände und keine offenen Freigaben.
