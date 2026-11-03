# Entwicklungspunkte in der Firma

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

## Einstieg und Anzeige

Der große Punkteverteiler entfällt auf Home. Die erste Firmen-Card Dein Handelsimperium zeigt ausschließlich bei unverteilten Punkten einen goldenen Hinweis mit Anzahl. Der bestehende Firmen-Einstieg bleibt erhalten.

Die Seite heißt Handelsimperium. Ganz oben steht die kompakte Card Entwicklung. Sie zeigt verfügbare Levelpunkte sowie Überstunden und Expeditionspunkte mit großem Gesamtmaximum und kleiner Basis-plus-Bonus-Rechnung. Der Hinweis „Basiswert + Boni“ entfällt. Die separate Ausbaupunkte-Karte entfällt; bei unvergebenen Ausbaupunkten öffnet ein direkter Einstieg mit Bestand in Entwicklung den bestehenden Verteiler. Im Verteiler bleiben verfügbarer Bestand, Vorschau und Bestätigung erhalten. Die Gesamtkapazitäten im Header bleiben unverändert.

Die Basis für Expedition ist 50 plus levelCapacityBonus; erkundete/gelieferte Orte und ausgerüstete Karten zählen zu Boni. Für Überstunden ist die gespeicherte overtimeCapacity die Basis; die Kapazitätsboni der Garage sind zusätzlich. Die neue Serveransicht development liefert diesen Unterschied aus dem unveränderten gespeicherten Zustand, bevor der bestehende Header die wirksamen Gesamtwerte erhält.

Bei offenen Punkten öffnet Punkte verteilen ein kompaktes Modal. Es zeigt alle verfügbaren Punkte, zwei Plus-/Minus-Zeilen und die Vorschau des neuen Basiswerts; Boni bleiben separat. Kein wiederholtes Öffnen für einzelne Level. Die Bestätigung speichert alle Punkte auf einmal. Schließen verwirft nur den Entwurf; offene Punkte bleiben bestehen. Ohne offene Punkte bleibt die Entwicklungscard mit den Basis-/Bonuswerten sichtbar, ohne Verteilungsbutton.

## Server und Bestätigung

levelBatch erhält expedition, overtime und den erwarteten gesamten Punktestand points. Die serverseitige Prüfung verlangt ganze nichtnegative Werte sowie die exakte Summe aller aktuell offenen Punkte (pendingLevelUps.length × 3). Bei einem inzwischen geänderten Punktestand wird keine Teilverteilung gespeichert. Der Vorgang erhöht Basis und Punktestand um die gewählten Werte und entfernt alle verbrauchten pendingLevelUps in einem Schritt. Refills werden nicht erneut vergeben. Das alte level-Kommando bleibt für ältere Clients unverändert verfügbar.

Lokaler Sperrverweis und gesperrte Controls verhindern Doppelsenden. Fehlgeschlagenes Speichern hält das Modal mit einer Fehlermeldung offen. Wenn neu synchronisierte Daten weitere Punkte enthalten, können diese im selben Modal ergänzt werden; ein inzwischen zu großer Entwurf wird zurückgesetzt. Mehrere neu erreichte Level werden auch im Glückwunschhinweis gemeinsam angezeigt; einmaliges Schließen genügt. Es wird kein Verteiler automatisch geöffnet.

## Historische Verifikation bei Einführung

- Typprüfung und alle 188 Tests erfolgreich; fünf neue Serverprüfungen für Mehrlevel-Verteilung, Basis/Bonus-Trennung, ungültige und veraltete Verteilungen, neue Punkte während eines alten Entwurfs und ältere Clients.
- Android-Export erfolgreich.
- App gegen lokalen Testserver bei 320/390/430 px: Home-Hinweis, Firmeneinstieg, Basis plus Boni ohne Summe, Modalvorschau, Abbrechen/erneutes Öffnen, Obergrenze, fehlgeschlagenes Speichern und erneuter Versuch, Doppelklicksperre sowie Zustand ohne offene Punkte geprüft.
- Zusammengefasster Hinweis für vier neue Level, gemeinsame Ansammlung und englische Oberfläche geprüft. Screenshots visuell geprüft. Kein physischer Gerätetest.

Bei Änderungen an Serverbefehlen muss der kompatible Server vor dem neuen Client ausgerollt werden.

## Handelsimperium und Ausbauhinweise

Die Transportkarte und ihre Detailseite heißen Imperiumsausbau. Ein dezenter goldener Punkt am Titel erscheint nur, wenn mindestens eine nächste Stufe mit dem tatsächlichen Talerbestand und den Firmenausbau-Items bezahlt werden kann. Maximal ausgebaute Optionen oder fehlende Preise erzeugen keinen Punkt. Die Kategorie und die jeweiligen Einträge tragen denselben Hinweis; Zusammenfassung und Editor verwenden dieselbe Prüfung. Diese Transportausbauten sind sofortig und haben im bestehenden Server keine zusätzlichen Freischalt-/Bauzeitbedingungen. Wirtschaft, gespeicherte IDs und Punkteverteilung bleiben unverändert.
