# Großaufträge: regionale Bildergeschichten

Fünf Regionen erhalten je sechs neue, zusammenhängende Illustrationen. Die ersten fünf Szenen erzählen Herstellung, Verpackung/Aufbruch, Reise, Ankunft und letzte Meter zum Übergabeort. Das sechste Motiv ist ausschließlich ein regional gestalteter Übergabeschein.

| Region | Individuelle Reise |
| --- | --- |
| Kronenlande | Goldschmiede → Schmuckschatulle und bewachte Kutsche → bewaldetes Flusstal/Steinbrücke → Stadttor → bewachter Weg zum Handelshaus → königlicher Pergamentbeleg |
| Weite Ebenen | Weberei → Teppichrollen auf Ochsenwagen → Flussfurt → hölzerner Handelsposten → Webwaren zum Kontor → rustikaler Beleg mit Webmustern |
| Safranstraße | Essenzenwerkstatt → gepolsterte Flakons auf Kamelkarawane → Gebirgspass → Karawanserei → Händlerhof → sandfarbener Beleg mit geometrischen Ornamenten |
| Jadetal | Jadeschnitzerei → geschützte Kiste auf Frachtschiff → Wasserwege/Reisfelder → Handelsstadt → Handelshof → Faserpapier mit Tuscheornamenten und rotem Siegel |
| Nordmark | Bernsteinschnitzerei → Rentierschlitten mit geschützter Truhe → Winterwald/Eisbrücke → Handelsfeste → warmes Kontor → Pergament mit Flechtmustern |

## Fortschritt und Zuordnung

Die Darstellung verwendet ausschließlich tatsächlich gelieferte Tonnen, keine Prognose oder vergangene Zeit. Stufenwechsel bei 0/20/40/60/80 Prozent. Das Belegmotiv erscheint erst bei serverseitigem Status completed und vollständig gelieferter Menge. Ungültige Werte werden defensiv behandelt; abgelaufene Aufträge erhalten keinen bestätigten Beleg.

Die stabile Kunden-ID bestimmt die Region, auch bei Empfehlungsaufträgen. Nur Altaufträge ohne Kunden-ID dürfen auf einen gültigen regionalen Index zurückfallen. Unbekannte Kunden oder Eventtypen erhalten keine erfundene regionale Geschichte.

Kein farbiger Restweg, keine Kartenüberlagerung und kein zusätzlicher Fortschrittsbalken im Detail. Tonnen und Frist/Restzeit bleiben außerhalb der Illustration. Schriftrollen enthalten keine eingebrannten Texte: Bestätigung und Kundenname werden lokalisiert darübergelegt.

Der Button zum Flottenwechsel und die Prognosekarte entfallen. Flottenänderungen über die normale Flottenverwaltung wirken weiterhin ab der nächsten Tour; laufende Touren und serverseitige Neuberechnung bleiben unverändert.

## Dateien und Prüfung

30 neue JPEGs unter assets/art/project-stories; regionale prompts.json halten die exakten Erzeugungsanweisungen fest. src/projectStory.js bestimmt die Stufe, ProjectStory.tsx bindet lokale Bilder statisch ein. Vier gezielte Tests prüfen Grenzen, bestätigten Abschluss, Kundenidentität und defensive Fälle. JPEGs wurden vollständig dekodiert und Repository-Blobs gegen lokale SHA-1 geprüft. Veröffentlicht am 04.11.2026. Typprüfung, vollständige Tests und Android-Export sind im [aktuellen Prüfnachweis](../../TEST_REPORT.md) belegt; kein physischer Gerätetest.
