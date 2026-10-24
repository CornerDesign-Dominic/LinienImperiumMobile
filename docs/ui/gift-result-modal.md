Veröffentlicht am 24.10.2026 mit Release `bd678df7b4e82278b18dba33447b7ece0c5bf390` (Mobile preview, Lauf 40088588867). Frühere Sammelvermerke im folgenden Text sind historisch.

# Geschenke: separates Gewinnmodal und wiederholtes Öffnen

Die Ziehung und ihre serverseitigen Wahrscheinlichkeiten bleiben unverändert. Der Client lässt die bestehende Markierung auf der tatsächlich erhaltenen Karte stehen und wartet anschließend 350 Millisekunden. Dann erscheint ein separates Gewinnmodal mit Regionsname, größerem Fahrzeugbild, Kartenname und Seltenheit sowie Neue Fahrzeugkarte oder dem tatsächlich erhaltenen Duplikat-Shard.

Schließen oder Weiter führt ausschließlich zur bereits geöffneten Kiste zurück. Dort bleibt die Gewinnerkarte markiert, die Chancenliste sichtbar und Nochmal öffnen mit dem aktuellen Preis unterhalb der scrollbaren Liste erreichbar. Der bisherige inline angezeigte Gewinn entfällt. Während einer Ziehung bzw. der kurzen Pause ist ein erneuter Kauf gesperrt. Fehlende Münzen deaktivieren den weiterhin sichtbaren Button. Fehler lassen einen erneuten Versuch zu.

Das Gewinnmodal und das Kistenmodal werden abwechselnd angezeigt, damit nicht mehrere native Modale übereinander bedient werden müssen. Übergeordnete blockierende Modale blenden beide aus, ohne den Ergebniszustand zu verlieren. Beim Verlassen werden Timer abgebrochen. Überspringen beendet die Animation auf dem echten Serverergebnis und nutzt denselben verzögerten Gewinnablauf. Reduzierte Bewegung überspringt die Animation, erhält aber die kurze Ergebnispause.

Die Namen der Geschenkregionen kommen aus regionIdentities – derselben zentralen Darstellung wie bei Expeditionen. Katalogname und regionNames dienen nur als Rückfall. Insbesondere heißt Region 3 nun Safranstraße. Das Label 1 Fahrzeugkarte oben rechts ist entfernt. Kaufpreis, Bestand und Shards werden weiterhin ausschließlich vom Server geändert.

## Prüfung

- Typprüfung und alle 188 vorhandenen Tests erfolgreich, einschließlich Geschenk-, Ziehungs- und Receipt-Prüfungen.
- Android-Export und vier Übersetzungstests erfolgreich.
- App mit lokalem Testserver bei 320/390/430 px: gemessene Pause nach Stillstand, getrennte Anzeige, neue Karte, Duplikat-Shard, Rückkehr, erneutes Öffnen, Überspringen, Schutz vor Doppelkauf, fehlende Münzen und kein horizontaler Überlauf.
- Zusätzlich fehlgeschlagener Kauf mit anschließendem Erfolg, reduzierte Bewegung und Englisch geprüft. Screenshots von Gewinn und geöffneter Kiste visuell geprüft. Kein physischer Gerätetest.

Zusammen mit der Entwicklungscard im Sammelbranch gespeichert. Nicht veröffentlicht.
