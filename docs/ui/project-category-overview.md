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

Komplette frühere Sonderauftragstitel in Nachrichten werden nur bei der Ausgabe normalisiert; frei gewählte Firmennamen und generische Transportbegriffe bleiben erhalten. Bilder werden weiterverwendet. Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.

Historische Prüfung der Übersicht: Verhaltenstest für reale Anzahlen, stabile Priorisierung, unveränderte Spieldaten und korrekte Kategorie-/Laufendnavigation; TypeScript und Android-Export. Das Bild wurde visuell geprüft. Native Geräte- und Layoutprüfung ist in dieser Umgebung nicht verfügbar.


## Laufende und Aufträge

Zwei gleich breite Reiter verwenden Gestaltung und Auswahlzustand der Einzelaufträge. **Laufende** zählt nur aktive Großaufträge, **Aufträge** alle gespeicherten bereiten Großaufträge über sämtliche Kategorien. Mehrere Aufträge einer Kategorie zählen einzeln; Einzelaufträge, erledigte und abgelaufene Aufträge zählen nicht in diese beiden Zahlen. Der normale Einstieg öffnet Aufträge. Ein Startseiten-Einstieg für offene Großauftragsprämien öffnet Laufende; dort bleiben diese Prämien erreichbar, ohne als aktive Transporte zu zählen. Ein kleiner Hinweis am Reiter und die zugängliche Beschriftung zeigen offene Belohnungen an.

Beide Reiter bleiben unter dem Seitenkopf Großaufträge. Tabwechsel setzt die Scrollposition zurück; Zurück aus einer Auftragsdetailansicht erhält den zuvor gewählten Reiter. Die Kategorien behalten Bilder, feste Regionssortierung, Fragezeichen und ausdrückliche Startbestätigung. `projectSections` ist die gemeinsame Statusklassifikation für Zähler und Laufend-/Prämienansicht.

Prüfung dieses Sammelstands: gezielte Klassifikations- und Sortierprüfungen für Mehrfachaufträge, Statuswechsel, Prämien und leere Bestände erfolgreich. Bestehende Kategorien-/Start-Komponententests sind um Reiterwahl, Zahlen und Prämienzugang erweitert; Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.


## Gemeinsame Laufend-Liste

Aktive Transporte stehen vor abgeschlossenen Aufträgen mit noch abholbarer Prämie in einer gemeinsamen Liste ohne zusätzliche Prämienüberschrift. Beide Gruppen nutzen dieselben kompakten hellen Pergamentkarten mit schmalem Seltenheitsstreifen, vorhandener Kundenwarenillustration, Typ, aktuellem Titel, Kunde sowie tatsächlicher Menge und Strecke. Innerhalb jeder Gruppe gilt feste Seltenheits-/Regionspriorität; gleichartige Aufträge behalten ihre gespeicherte Reihenfolge. Sekündliche Timer beeinflussen diese Ordnung nicht.

Aktive Karten zeigen gelieferte/Gesamttonnen, Fortschrittsbalken, Frist und Fertig-in-Zeit aus der bestehenden Serverprognose und der serverkorrigierten App-Uhr. Fehlende, nicht erreichbare oder bereits überschrittene Prognosen werden ehrlich gekennzeichnet; die Anzeige erteilt keine zusätzliche Abschlusszusage. Fertige Karten zeigen keine Timer. Ein leicht gedrehter grüner ERLEDIGT-Stempel entsteht aus nativen Views/Text/Rand, ohne neues Bild.

Belohnung abholen sendet die bestehende autoritative `claim`-Aktion über den App-Commandguard. Ein zusätzlicher synchroner Kartenschutz verhindert Doppeltipps. Fehler bleiben auf der Karte sichtbar und ermöglichen einen erneuten Versuch. Nur ein bestätigter Abholstatus öffnet die vorhandene Belohnungsausgabe mit den echten gespeicherten Beträgen. Nach dem erfolgreichen Snapshot verschwindet die Karte aus der Liste; historische Auftragsdaten und Statistiken bleiben erhalten. Der getrennte Kopfbereich öffnet weiter die Details; die Abholtaste ist kein Kind dieser Detail-Schaltfläche. Fehlgeschlagene/abgelaufene Aufträge erhalten weder Stempel noch erfundene Prämie; ihre bestehende Detaildarstellung bleibt erhalten.

Vier gezielte Status-/Sortier-/Backend-Abholprüfungen erfolgreich (einschließlich einmaliger Auszahlung und erhaltener Historie). Komponentenprüfungen für Abholen/Fehler/Doppeltipp, Kartenzeiten und Tabnavigation ergänzt; Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.


## Kompaktere Laufend-Karten – gesammelt, nicht veröffentlicht

Der am 04.11.2026 angenommene Entwurf verkleinert ausschließlich konkrete laufende und fertige Großauftragskarten. Vorhandenes Warenbild links (58 × 66 dp), kleine Typzeile, Titel und Kunde rechts. Ein Häuschen (`home`) steht vor dem Kundennamen, das vorhandene Kistenicon (`orders`, wie bei Einzelaufträgen) vor der Tonnenzahl. Laufende Karten verbinden gelieferte/Gesamttonnen und Strecke in einer Zeile, danach folgen der schmale Fortschrittsbalken und eine gemeinsame Frist-/Fertig-in-Zeile. Fertige zeigen Gesamtmenge/Strecke und eine kompakte gemeinsame Aktionszeile mit kleinem ERLEDIGT-Stempel und „Abholen“. Die bisherige hohe Stempelfläche entfällt; die Abholtaste behält mindestens 44 dp Höhe.

Titel und Kundennamen werden nicht abgeschnitten; Zeiten und Aktionen dürfen auf schmalen Ansichten umbrechen. Keine festgesetzte Kartenhöhe, keine neuen Motive, Kundennamen oder Seltenheiten aus dem rein illustrativen Beispiel. Vorhandene Sortierung, Status-/Zählerregeln, Detailnavigation, Serverprognosen, Fehlerrückmeldung und Doppeltippschutz bleiben bestehen.

Prüfung: bestehende Claim-/Zeit-Komponententests um kurze Abholbeschriftung, beide Icons und gemeinsame Zeitzeile angepasst. Vier reine Status-/Sortier-/Backend-Abholtests lokal erfolgreich. Komponenten-/Typprüfung und native Layoutkontrolle lokal mangels React/TypeScript nicht ausführbar; vor Veröffentlichung im regulären Workflow prüfen. Kein Release ausgelöst.

## Detail: regionale Bildergeschichten – gesammelt

Die bisherigen generischen Transportbilder und der getrennte Detail-Fortschrittsbalken werden durch sechs kundenspezifische regionale Szenen ersetzt. Die letzte Szene zeigt ausschließlich den Übergabeschein. Keine farbige Wegmarkierung. Flottenwechsel-Schaltfläche und Prognosekarte entfallen; laufende Touren und Berechnung nach Flottenwechsel behalten ihre Regeln. [Finale Gestaltung und Prüfumfang](project-stories.md).
