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

Wird nach dem erfolgreichen Workflow ergänzt. Der Workflow prüft Android-Export, Firebase-Deployment und echte Gastanmeldung mit Speicherung, Anfrage-Deduplizierung, Regionsdaten, Testpunkten, XP-Levelbelohnung sowie Zugriffssperre ohne Anmeldung. Danach folgt EAS Update für die vorhandene Android-Runtime 0.1.0.

## Weiter offen

Neue Größen/Entfernungen und Freigaberegeln für Startangebote sind noch nicht beschlossen und wurden nicht geändert. `internal [0]` bedeutet eine fehlende HTTP-Antwort; die Wiederholung fängt vorübergehende Ausfälle ab, garantiert jedoch keine dauerhafte Verbindung.
