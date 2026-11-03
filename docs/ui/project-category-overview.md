# Großaufträge: Kategorieübersicht

Die vorhandenen Kategorien haben kompakte Papierkarten mit einem regionalen Bild links und Auftragsname, Stammkunde und tatsächlicher Anzahl rechts. Der Auftragsname erscheint ohne den doppelten Typpräfix. Sonderaufträge behalten einen blauen, Empfehlungen einen violetten Rand; die Fläche bleibt Papier.

Kategorien mit mindestens einem gespeicherten, startbereiten Großauftrag stehen zuerst. Innerhalb beider Gruppen bleibt die Katalogreihenfolge erhalten. Laufende, erledigte und Einzelaufträge zählen nicht als verfügbar. Auch leere Kategorien bleiben für Herkunft und Detailinformationen erreichbar. Die bestehende Schaltfläche für laufende Großaufträge bleibt erhalten.

Die vorhandenen Edelwarenbilder werden wiederverwendet. Das Empfehlungsmotiv zeigt eine geschlossene, prunkvolle Schatulle: dunkles Edelholz, Goldbeschläge, Schloss und Vertrauenssiegel. Die transparente Illustration steht ohne eigenen Rahmen direkt auf Papier und wird vollständig eingepasst statt angeschnitten. Sie kennzeichnet anvertraute wertvolle Fracht; die Fundkisten behalten ihr eigenes Motiv. Es wurde mit dem eingebauten ImageGen erzeugt; Produktionsdatei und Prompt liegen unter `assets/art/projects/`. Eine memo-isierte dekorative Art-Komponente verhindert unnötige statische Bild-Neuberechnung. Spielwerte, Navigation, Auftragsstart und Belohnungen bleiben erhalten; die aktuellen Titel liefert das mobile Ansichtsmodell.

## Regionale Sonderauftragstitel

| Region | Titel | Englisch |
| --- | --- | --- |
| Kronenlande | Schmuck der Krone | Jewels of the Crown |
| Weite Ebenen | Edle Webwaren | Fine Textiles |
| Safranstraße | Kostbare Essenzen | Precious Essences |
| Jadetal | Kunst aus Jade | Jade Art |
| Nordmark | Schätze des Nordens | Treasures of the North |

Die Zuordnung steht in `functions/src/customer-identities.json` unter der stabilen Kunden-ID. Der mobile Server verwendet sie für Katalog, Auslosungsinformationen und sämtliche Auftragsansichten. Neue Sonderaufträge erhalten den aktuellen Titel; vorhandene gespeicherte Aufträge zeigen ihn auch bereit, laufend, erledigt oder abgelaufen. Ihre gespeicherten Namen, IDs, Kunden, Mengen, Konditionen, Fortschritte und Belohnungen werden dadurch nicht umgerechnet. Eine alte abweichende Regionsposition überschreibt die Kundenidentität nicht. Empfehlungsaufträge bleiben unverändert.

Komplette frühere Sonderauftragstitel in Nachrichten werden nur bei der Ausgabe normalisiert; frei gewählte Firmennamen und generische Transportbegriffe bleiben erhalten. Bilder werden weiterverwendet. Die Titeländerung ist gesammelt, noch nicht veröffentlicht.

Historische Prüfung der Übersicht: Verhaltenstest für reale Anzahlen, stabile Priorisierung, unveränderte Spieldaten und korrekte Kategorie-/Laufendnavigation; TypeScript und Android-Export. Das Bild wurde visuell geprüft. Native Geräte- und Layoutprüfung ist in dieser Umgebung nicht verfügbar.

