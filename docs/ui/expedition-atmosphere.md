# Leichtere Kartenelemente und weicher Nebel

Die bisherigen rechteckigen Pfeiltasten und die kräftige Titelplakette lagen optisch schwer auf der Landschaft. Die neue Fassung reduziert den Regionstitel von 21 auf 18, verwendet eine ruhigere Schriftstärke und ersetzt Rahmen und Kartenhintergrund durch einen transparenten Pergamentschimmer mit weich auslaufendem Lichtsaum.

Die Regionspfeile liegen auf kleinen runden Flächen mit 54 % Deckkraft. Die sichtbare Fläche misst 34 × 34, die antippbare Fläche weiterhin 48 × 48. Nicht verfügbare Richtungen werden vollständig ausgeblendet; unsichtbare Platzhalter halten die jeweils andere Richtung am richtigen Rand und lassen Gesten zur Karte durch.

Der neue Kartennebel nutzt eine echte transparente RGBA-Wolkentextur statt der wiederkehrenden runden Ausbuchtungen. Ein breiter Alpha-Verlauf reicht in den bekannten Landschaftsteil hinein. Hinter der sicheren Freischaltungsgrenze bleibt eine vollständig deckende Fläche erhalten; gesperrte Gebäude werden dadurch auch bei transparenten Texturstellen nicht sichtbar. Ihre Namen und Tippflächen werden weiterhin nicht gerendert. Bereits sichtbare Ortsnamenschilder liegen über dem Nebel und bleiben lesbar.

Die Grundtöne sind regional abgestimmt: gedecktes Elfenbein in den Kronenlanden, warme Sandtöne in Prärie und Safranstraße, ein kühler grünlicher Ton im Jadetal und frostiges Blaugrau in der Nordmark. Eine zusätzliche dezente Texturlage belebt die unbekannte Fläche.

## Bilddatei

`assets/art/atmosphere/fog-edge.png`, 887 × 1774, RGBA. Mit dem eingebauten ImageGen-Werkzeug erstellt. Das vollständige Promptset steht in `docs/ui/expedition-atmosphere-prompt.json`. Der Alphakanal wurde geprüft: links transparent, über einen breiten Bereich abgestuft, rechts fast vollständig deckend. Die deckende Sicherung liegt unabhängig davon in der nativen Ansicht. Die Panoramen bleiben unverändert.

## Validierung

- Typprüfung und alle 117 Tests erfolgreich. Die bestehenden Kartenregressionen prüfen die ausgeblendeten Navigationsrichtungen statt deaktivierter Tasten.
- Tatsächliche App bei 320 × 568, 360 × 740, 390 × 844 und 430 × 932 geprüft: alle 40 Orte je Größe geöffnet, Regionswechsel, Freischaltung, Fahrzeugauswahl, Positionsspeicherung und Englisch. Keine JavaScript-Fehler.
- Zusätzlich alle fünf Regionen mit teilweise erkundeter Karte geprüft: vollständig deckender Hintergrund, geladene Alpha-Textur, sichtbare Namensschilder, weiterhin antippbare Orte und mindestens 44 große Navigationstippflächen.
- Android-Export erfolgreich; fertiges Hermes-Bundle und eingebundene Nebel-PNG im Export geprüft. Keine Geräte-/Emulatorprüfung durchgeführt.
- Neue Vorschauen: `docs/ui/previews/expedition-mist-jade.png` und `docs/ui/previews/expedition-mist-north.png`.

Zur Prüfung vorbereitet, noch nicht veröffentlicht.
