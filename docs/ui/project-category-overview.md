# Großaufträge: Kategorieübersicht

Die vorhandenen Kategorien haben kompakte Papierkarten mit einem regionalen Bild links und Auftragsname, Stammkunde und tatsächlicher Anzahl rechts. Der Auftragsname erscheint ohne den doppelten Typpräfix. Sonderaufträge tragen links einen markanten blauen Seltenheitsstreifen, Empfehlungen einen violetten. Der übrige Rahmen bleibt neutral und die Fläche Papier. Dieselbe Markierung gilt für konkrete laufende und fertige Großauftragskarten; legendäre Eventkarten verwenden die goldene Legendary-Farbe der gemeinsamen Palette. Bilder, Typbeschriftungen und Aktionen bleiben erhalten.

Die Reihenfolge bleibt unabhängig vom Vorrat fest: zuerst höhere Seltenheit, innerhalb einer Seltenheit spätere Expeditionsregionen vor früheren. Aktuell steht Empfehlung Hafenverbund vor den Sonderaufträgen aus Nordmark, Jadetal, Safranstraße, Weite Ebenen und Kronenlande. Sollte eine legendäre Kategorie tatsächlich im selben Katalog enthalten sein, steht sie vor Epic und Rare. Keine Sortierung nach Zeitstempel oder kürzlicher Aktivität. Laufende, erledigte und Einzelaufträge zählen nicht als verfügbar. Auch leere Kategorien bleiben für Herkunft und Detailinformationen erreichbar. Die bisherige große Laufend-Schaltfläche ist durch die beiden Reiter unten ersetzt.

Die vorhandenen Edelwarenbilder werden wiederverwendet. Das Empfehlungsmotiv zeigt eine geschlossene, prunkvolle Schatulle: dunkles Edelholz, Goldbeschläge, Schloss und Vertrauenssiegel. Die transparente Illustration steht ohne eigenen Rahmen direkt auf Papier und wird vollständig eingepasst statt angeschnitten. Sie kennzeichnet anvertraute wertvolle Fracht; die Fundkisten behalten ihr eigenes Motiv. Es wurde mit dem eingebauten ImageGen erzeugt; Produktionsdatei und Prompt liegen unter `assets/art/projects/`. Eine memo-isierte dekorative Art-Komponente verhindert unnötige statische Bild-Neuberechnung. Spielwerte, Auftragsstart und Belohnungen bleiben erhalten; die aktuellen Titel liefert das mobile Ansichtsmodell.

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


## Laufende und Aufträge – gesammelt

Zwei gleich breite Reiter verwenden Gestaltung und Auswahlzustand der Einzelaufträge. **Laufende** zählt nur aktive Großaufträge, **Aufträge** alle gespeicherten bereiten Großaufträge über sämtliche Kategorien. Mehrere Aufträge einer Kategorie zählen einzeln; Einzelaufträge, erledigte und abgelaufene Aufträge zählen nicht in diese beiden Zahlen. Der normale Einstieg öffnet Aufträge. Ein Startseiten-Einstieg für offene Großauftragsprämien öffnet Laufende; dort bleiben diese Prämien erreichbar, ohne als aktive Transporte zu zählen. Ein kleiner Hinweis am Reiter und die zugängliche Beschriftung zeigen offene Belohnungen an.

Beide Reiter bleiben unter dem Seitenkopf Großaufträge. Tabwechsel setzt die Scrollposition zurück; Zurück aus einer Auftragsdetailansicht erhält den zuvor gewählten Reiter. Die Kategorien behalten Bilder, feste Regionssortierung, Fragezeichen und ausdrückliche Startbestätigung. `projectSections` ist die gemeinsame Statusklassifikation für Zähler und Laufend-/Prämienansicht.

Prüfung dieses Sammelstands: gezielte Klassifikations- und Sortierprüfungen für Mehrfachaufträge, Statuswechsel, Prämien und leere Bestände erfolgreich. Bestehende Kategorien-/Start-Komponententests sind um Reiterwahl, Zahlen und Prämienzugang erweitert; lokal wegen fehlendem React/TypeScript nicht ausführbar. Kein neuer Android-Export oder Gerätetest. Veröffentlichung erst nach erneuter Freigabe.
