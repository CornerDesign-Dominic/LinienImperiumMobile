Veröffentlicht am 24.10.2026 mit Release `bd678df7b4e82278b18dba33447b7ece0c5bf390` (Mobile preview, Lauf 40088588867). Frühere Sammelvermerke im folgenden Text sind historisch.

# Entwicklungspunkte in der Firma

## Einstieg und Anzeige

Der große Punkteverteiler entfällt auf Home. Die erste Firmen-Card Dein Handelsimperium zeigt ausschließlich bei unverteilten Punkten einen goldenen Hinweis mit Anzahl. Der bestehende Firmen-Einstieg bleibt erhalten.

Ganz oben auf der Firmenseite steht die kompakte Card Entwicklung. Sie zeigt Verfügbare Punkte sowie Überstunden und Expeditionspunkte mit je zwei Zahlen: Basiswert inklusive dauerhaft zugewiesener Punkte und zusätzlich +Boni. Eine Gesamtsumme und die Anzahl bisher vergebener Punkte werden nicht angezeigt. Die Gesamtkapazitäten im Header bleiben erhalten.

Die Basis für Expedition ist 50 plus levelCapacityBonus; erkundete/gelieferte Orte und ausgerüstete Karten zählen zu Boni. Für Überstunden ist die gespeicherte overtimeCapacity die Basis; die Kapazitätsboni der Garage sind zusätzlich. Die neue Serveransicht development liefert diesen Unterschied aus dem unveränderten gespeicherten Zustand, bevor der bestehende Header die wirksamen Gesamtwerte erhält.

Bei offenen Punkten öffnet Punkte verteilen ein kompaktes Modal. Es zeigt alle verfügbaren Punkte, zwei Plus-/Minus-Zeilen und die Vorschau des neuen Basiswerts; Boni bleiben separat. Kein wiederholtes Öffnen für einzelne Level. Die Bestätigung speichert alle Punkte auf einmal. Schließen verwirft nur den Entwurf; offene Punkte bleiben bestehen. Ohne offene Punkte bleibt die Entwicklungscard mit den Basis-/Bonuswerten sichtbar, ohne Verteilungsbutton.

## Server und Bestätigung

levelBatch erhält expedition, overtime und den erwarteten gesamten Punktestand points. Die serverseitige Prüfung verlangt ganze nichtnegative Werte sowie die exakte Summe aller aktuell offenen Punkte (pendingLevelUps.length × 3). Bei einem inzwischen geänderten Punktestand wird keine Teilverteilung gespeichert. Der Vorgang erhöht Basis und Punktestand um die gewählten Werte und entfernt alle verbrauchten pendingLevelUps in einem Schritt. Refills werden nicht erneut vergeben. Das alte level-Kommando bleibt für ältere Clients unverändert verfügbar.

Lokaler Sperrverweis und gesperrte Controls verhindern Doppelsenden. Fehlgeschlagenes Speichern hält das Modal mit einer Fehlermeldung offen. Wenn neu synchronisierte Daten weitere Punkte enthalten, können diese im selben Modal ergänzt werden; ein inzwischen zu großer Entwurf wird zurückgesetzt. Mehrere neu erreichte Level werden auch im Glückwunschhinweis gemeinsam angezeigt; einmaliges Schließen genügt. Es wird kein Verteiler automatisch geöffnet.

## Verifikation

- Typprüfung und alle 188 Tests erfolgreich; fünf neue Serverprüfungen für Mehrlevel-Verteilung, Basis/Bonus-Trennung, ungültige und veraltete Verteilungen, neue Punkte während eines alten Entwurfs und ältere Clients.
- Android-Export erfolgreich.
- App gegen lokalen Testserver bei 320/390/430 px: Home-Hinweis, Firmeneinstieg, Basis plus Boni ohne Summe, Modalvorschau, Abbrechen/erneutes Öffnen, Obergrenze, fehlgeschlagenes Speichern und erneuter Versuch, Doppelklicksperre sowie Zustand ohne offene Punkte geprüft.
- Zusammengefasster Hinweis für vier neue Level, gemeinsame Ansammlung und englische Oberfläche geprüft. Screenshots visuell geprüft. Kein physischer Gerätetest.

Nur im Sammelbranch gespeichert, nicht veröffentlicht. Bei späterer Veröffentlichung den Server vor dem Client ausrollen.
