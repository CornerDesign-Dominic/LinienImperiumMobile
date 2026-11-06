# Globale Seitentitelleiste

Die gemeinsame native `PageHeader`-Komponente füllt die gesamte Breite direkt unter dem dunklen Statusheader. Sie gilt auch für die Expedition und ihre Regionsansicht, weil sie oberhalb beider Inhaltslayouts eingebunden ist. Safearea und Ressourcenheader bleiben im bestehenden App-Layout.

Das Titelband verwendet die vorhandene Pergamenttextur, dunkles Petrol und die vorhandene Serifenschrift. Der Titel steht direkt auf Pergament in seiner normalen Schreibweise. Keine Plakette, Nieten, Titelschatten oder Titelfassung. Eine dezente Messingkante grenzt den Inhalt ab.

Beide Seiten reservieren identische 44-Pixel-Tippflächen. Auf Start ersetzt ein nicht interaktiver Platzhalter die Zurück-Taste. Der Titel bleibt deshalb auch bei fehlenden Aktionen geometrisch mittig. Lange Titel umbrechen bei gleichbleibender Schriftgröße; native Textmessung lässt die nach außen dünneren Messinglinien nur erscheinen, wenn ausreichend freier Platz neben einem einzeiligen Titel bleibt. Dekoration belegt keinen Titelplatz und ist für Screenreader verborgen.
