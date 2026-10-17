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

## Vorbereitetes Folgepaket (noch nicht auf Handy/Firebase veröffentlicht)

- Typprüfung und 11 Mobile-Engine-Tests sowie alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Neue Tests decken Fundtypen und exakte Ziel-IDs, gesperrte Auslosung, Duplikat-Shards, 15-Sekunden-Transporte inklusive Touren, einmalige Verkürzung laufender Missionen und alle vier gültigen 3-Punkte-Verteilungen ab. Unvollständige/zu große Verteilungen und doppelte Vergabe werden abgewehrt.
- Ursprüngliche Web-Engine bleibt unverändert. Keine Spielstände zurückgesetzt.
- Kein Firebase-Deployment, kein EAS-Update und kein neuer APK-Build für dieses Folgepaket gestartet.
- Android-Export und Web-Export erfolgreich; 3-Punkte-Auswahl bei 393 px im Browser mit lokaler Engine geprüft (Maximalwerte 50 → 52 und 100 → 101, vierter Punkt gesperrt). Kein physischer Gerätetest für dieses vorbereitete Paket.
- Browserprüfung des Fundablaufs bestanden: Materialauftrag → freies Garagenfahrzeug → zurück zur Expedition; Sonderauftrag → Flottenauswahl → laufender Großauftrag; Karten-/Shardfund ohne Zuweisungsbutton. Expeditionsseite ohne Fundlisten, Zurück-Navigation intakt, keine JavaScript-Seitenfehler. Firebase im Browser simuliert; keine Veröffentlichung.

### Vorbereiteter Firmenausbau

- Typprüfung, Web-Export und alle 12 Mobile-Engine-Tests plus 23 ursprüngliche Web-Regressionsdateien bestanden.
- Batchtest: drei regionale Prämienstufen plus zwei Fernverkehr-Reichweitenstufen kosten zusammen 640 M und 10 Items. Server berechnet jede Folgestufe, verarbeitet beide Segmente gemeinsam und lehnt zu wenig Items/Münzen, veraltete Stufen, doppelte Einträge, Nullauswahl und Überschreiten der Maximalstufe ab. Eingabespielstand bleibt unverändert.
- Kein Deployment oder App-Update für diese Änderungen gestartet.
- Android-Export erfolgreich. Browserprüfung bei 393 und 320 px mit lokal simulierter Firebase-Anbindung bestanden: Reihenfolge, gemeinsame Karte, unveränderte Ressourcen vor Speichern, Gesamtkosten 150 M / 6 Items für zwei Prämienstufen plus eine Reichweitenstufe, Link zu Herstellen, erhaltene Auswahl nach Zurück und geleerte Auswahl nach erfolgreichem Speichern. Keine JavaScript-Seitenfehler.

### Vorbereitetes Vorräte-Raster

- Typprüfung sowie Web- und Android-Export bestanden; Spielmechanik und Backend unverändert.
- Browserprüfung mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: alle 13 vorhandenen Itemarten, Drei-Spalten-Raster, Herkunft/Rezept im Detail, Link zur Herstellung und zur Garage geprüft. Letztes Refill gibt exakt +100 Tokens, Bestand fällt auf 0, Benutzen wird gesperrt und die Karte verschwindet nach Schließen aus dem Raster. Garagennavigation verbraucht kein Modul. Keine JavaScript-Seitenfehler.
- Kein Deployment, kein OTA-Update oder APK-Build gestartet.

### Vorbereitete Herstellungsseite

- Typprüfung, Web-Export und Android-Export bestanden. Keine Änderung der Spielmechanik oder des Backends.
- Browserprüfung bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung: vier Prozesszeilen mit kräftigem Pfeil, Mengen und je einem Herstellungsbutton; Kundenrezept ohne freigeschalteten Stammkunden gesperrt. Privatabholung kostet genau 100 Hinweise und erzeugt einen Auftrag. Beide Shard-Rezepte verbrauchen je 10 und geben genau 1 höhere Seltenheit. Nach Verbrauch wird die Verfügbarkeit aktualisiert; fehlende Ressourcen sperren die Herstellung. Keine JavaScript-Seitenfehler.
- Kein Firebase-Deployment, OTA-Update oder APK-Build gestartet.

### Vorbereitete Stammkunden-Seiten

- Typprüfung, Web-Export und Android-Export bestanden. Bestehende Freischaltung und Fähigkeitspunkte-Mechanik unverändert.
- Browserprüfung bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung: fünf freigeschaltete Kundenkarten ohne Aufwertungsbuttons, eigene Kundendetailseite mit Beziehung/Branche/Ware und Fähigkeiten, zwei verschiedene Fähigkeitspunkte korrekt ausgegeben, danach alle Verbesserungen gesperrt. Zurück zur Übersicht und Wechsel zu anderem Kunden mit eigenem Punktestand geprüft. Keine JavaScript-Seitenfehler.
- Kein Deployment, OTA-Update oder APK-Build gestartet.
