# Testbericht – gesammeltes Mobile-Update

## Geprüfter Umfang

- Regionsübersicht: fünf Karten mit zugehörigem Kunden, Entdeckungs- und Lieferfortschritt; gesperrte Regionen sind deaktiviert und optisch markiert.
- Region: sieben Ortskarten, danach die Endloskarte; Entdecken, Liefermissionen, Belohnungen und verbleibende Zeit.
- Testwerkzeuge: Münzen, +100 Expeditionspunkte, +100 Überstundenpunkte, +100 / +1.000 XP. XP löst normale Levelbelohnungen aus.
- Vorheriges Paket: höhere Kontraste der Angebotskarten, passende Hinweise zur Fahrzeugverfügbarkeit, Wiederholung bei Firebase-Transportfehler `internal [0]`.

## Ergebnisse vor Veröffentlichung

- TypeScript-Prüfung: bestanden.
- Spieltests: bestanden; acht mobile Adaptertests und 23 übernommene Web-Regressionsdateien.
- UI-Prüfung mit React Native Web bei 393 × 852 und 320 × 740: bestanden. Getestet wurden ein simulierter Verbindungsabbruch mit erfolgreicher Wiederholung, Navigation, Kartenansichten, Shard-Aufwertung, Testpunkte/XP, Regionssperren, alle sieben Orte, Freischaltung der nächsten Region, Endlosexpedition und Zurück-Navigation. Keine JavaScript-Laufzeitfehler.
- Automatischer Angebotswechsel: Zeitgrenze, angeheftete Angebote, laufende Transporte und Offline-Nachholung geprüft.

Die UI-Prüfung verwendet den echten Firebase-Client mit simulierten Netzwerkantworten und die echte Spiel-Engine. Sie ersetzt keinen Test auf einem physischen Android-Gerät.

## Veröffentlichung und Live-Prüfung

Erfolgreich veröffentlicht am 17.10.2026.

- [GitHub Actions: gesamter Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39048114385)
- Spielcode: `064d24a34cb4b28e2cea854764711f28427ec814`
- Android-Export: bestanden.
- Firebase-Deployment: erfolgreich.
- Live-Prüfung: echte Gastanmeldung, Speicherung, Anfrage-Deduplizierung, Regionsdaten, Testpunkte, XP-Levelbelohnung und Zugriffssperre ohne Anmeldung bestanden.
- EAS Update: erfolgreich für die bestehende Android-Runtime 0.1.0 veröffentlicht.
- Keine neue APK erstellt; die installierte Testversion erhält das Update beim Neustart.

## Weiter offen

Neue Größen/Entfernungen und Freigaberegeln für Startangebote sind noch nicht beschlossen und wurden nicht geändert. `internal [0]` bedeutet eine fehlende HTTP-Antwort; die Wiederholung fängt vorübergehende Ausfälle ab, garantiert jedoch keine dauerhafte Verbindung.
