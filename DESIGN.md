# Gestaltung: Handel und Entdeckung

Verbindliche gestalterische Grundlage für die nächste mobile Spieloberfläche:
**Eine glaubwürdige Welt voller ungewöhnlicher Entdeckungen.**

## Welt und Bildsprache

Eine eigenständige Parallelwelt mit Transport, Handel und Expeditionen. Die Darstellung ist erwachsen, ruhig und atmosphärisch. Bilder verwenden einen leicht malerischen, reduzierten Realismus: natürliche Proportionen, nachvollziehbare Materialien, weiches Licht, vereinfachte Details und dezente Gebrauchsspuren. Die Motive müssen im kleinen mobilen Format erkennbar bleiben.

Fantasievolle Inhalte erhalten dieselbe sorgfältige Darstellung wie gewöhnliche Fahrzeuge. Eine würdevoll ausgestattete Karawane oder ein Elefant mit konstruierter Lastplattform können später neben motorisierten Fahrzeugen stehen. Ungewöhnliche Kombinationen dürfen subtilen Humor erzeugen. Alberne Gesichter, verzerrte Proportionen, grelle Farben und Slapstick gehören nicht zur Bildsprache.

Karawanen, Elefantentransporte, neue Regionen, deren Werte und Gruppenboni sind **künftige Inhaltsideen**. Dieses Designpaket führt sie nicht in Katalog, Spielstand oder Wirtschaft ein.

## Oberfläche

Die Oberfläche erinnert an einen Reiseatlas mit Sammelkarten. Dunkles Tintenpetrol rahmt helle Pergamentflächen ein. Schmale Messingkanten, nummerierte Regionssiegel, Kompassmotive und verbundene Wegpunkte tragen die Atmosphäre. Klare Systemschrift bleibt für Werte, Timer und Aktionen erhalten; eine System-Serifenschrift setzt Überschriften und Kartenakzente. Keine zusätzlichen Schriftdateien oder Laufzeitabhängigkeiten.

Bedienelemente bleiben deutlich erkennbar. Hauptaktionen verwenden Petrol mit heller Schrift, ergänzende Aktionen eine helle Materialfläche. Sperren, Seltenheiten und Zustände besitzen Textbeschriftungen zusätzlich zur Farbe. Gesperrte Regionen bleiben lesbar. Verzierungen werden von der Screenreader-Ausgabe ausgeschlossen.

Die Farbwerte stehen zentral in `src/palette.json`; `src/theme.ts` ergänzt Schriften und regionale Akzente. Helle Materialfarben sind von kontrastreicheren Schriftfarben getrennt. Zum Beispiel ist Messing als Material `#B69352`, Goldschrift auf Pergament dagegen `#79591F`.

| Rolle | Farbton |
| --- | --- |
| Tinte, Navigation | `#243D40` |
| Pergamentfläche | `#F2E8D3` |
| Hintergrund | `#DCD0B8` |
| Hauptaktionen | `#315F59` |
| Messingdetails | `#B69352` |
| Helle Schrift auf Tinte | `#F4EBD8` |

Regionen ergänzen die gemeinsame Gestaltung mit zurückhaltenden eigenen Akzentfarben. Individuelle Landschafts- und Fahrzeugbilder müssen die gemeinsame Perspektive, Lichtführung und Detailtiefe beibehalten. In der Sammlung kennzeichnet ein neutrales Fahrzeugsymbol die Bildfläche bis zur Erstellung individueller Fahrzeugillustrationen.

## Erstes umgesetztes Paket

- Start mit eingebetteter Hafenillustration, Firmenschild und direktem Zugang zum Reiseatlas.
- Gemeinsame Gestaltung für Karten, Aktionen, Fortschrittsbalken, Dialoge, Aufträge, Events, Vorräte und weitere bestehende Ansichten.
- Expedition mit Regionssiegeln und verbundenen Ortskarten; Reihenfolge, automatische Fokussierung und sämtliche bestehenden Aktionen bleiben erhalten.
- Sammelkarten mit einheitlichem Rahmen, lesbaren Seltenheitsfarben und neutralem Fahrzeugsymbol.
- Vorhandene Spiellogik, Spielstände, Wirtschaftsparameter und Fahrzeugwerte bleiben unverändert.


## Icons und kleine Ortsbilder

34 eigens gezeichnete Bildsymbole bilden ein gemeinsames Set. Fünf davon kennzeichnen die feste Navigation: Hauptsitz, Flotte, Garage, Einzelaufträge und Großaufträge. Zurück, Hilfe, Öffnen, Schließen, Plus-/Minus-Steuerungen, Event- und Auswahlpfeile verwenden ebenfalls dieses Set. Jeder Stadtpunkt besitzt neben dem Ortsbild ein eigenes semantisches Icon. Die Navigation zeigt den aktiven Bereich zusätzlich durch Textfarbe, Fläche und Markierung an.

Jeder der zehn Menüpunkte auf der Start-/Stadtansicht erhält ein eigenes Motiv: Expeditionslager, Kartenarchiv, Firmenkontor, Verteilerdepot, Lagerhaus, Werkstatt, Händlergilde, Markt, Zählhaus und Ausrüstungsschrank. Zwei weitere Motive zeigen Garage und Fahrzeugflotte. Die Ortsbilder verwenden dieselbe reduzierte malerische Bildsprache wie die Hafenillustration.

- `src/Icon.tsx`: gemeinsame Icons und Zuordnung der Vorratsarten.
- `assets/icons/source/`: originale SVG-Zeichnungen auf einem 32er-Raster.
- `assets/icons/`: vorgerenderte transparente PNGs mit 96 Pixeln für scharfe kleine Symbole. Farbe wird passend zum Hintergrund gesetzt.
- `scripts/build-icons.cjs`: optionaler Entwicklungsrenderer; benötigt `sharp` im Tooling-Umfeld. `ICON_RENDERER_NODE_MODULES` kann auf dessen Modulverzeichnis verweisen. Die App benötigt weder `sharp` noch ein natives SVG-Modul.
- `src/LocationArt.tsx`: zeigt jeweils genau eine der zwölf quadratischen Zellen des unveränderten 4×3-Bildlayouts. Keine benachbarten Motive werden absichtlich angeschnitten oder wiederverwendet.
- `assets/art/town-atlas.png`: transparentes, verlustfrei komprimiertes Bildlayout (1448×1086 Pixel). Mit dem integrierten Bildgenerierungswerkzeug erstellt; der vollständige Prompt steht in `assets/art/town-atlas.prompt.txt`.

Vorräte und Herstellung zeigen semantisch passende Icons für Kisten, Zahnräder, Shards, Kapazitätsmodule, Aufträge und Kontakte. Der Stadthub, sein Händler und der Großhändler verwenden ebenfalls passende Ortsbilder. Ein laufender Großauftrag erhält ein illustratives Flottenmotiv. Alle Bilder sind im App-Bundle enthalten. Es gibt keine neue native Abhängigkeit und keinen Bildabruf zur Laufzeit.

![Stadtpunkte](docs/design/town.jpg)
![Weitere Stadtpunkte](docs/design/town-services.jpg)
![Vorratssymbole](docs/design/inventory.jpg)
![Herstellung](docs/design/crafting.jpg)

## Illustrationsquelle

Die Originalillustration wurde mit dem integrierten Bildgenerierungswerkzeug erstellt und als JPEG für das App-Bundle übernommen. Projektdatei: `assets/art/harbor.jpg`. Sie benötigt zur Laufzeit keine Bild-API oder externe Bild-URL.

Verwendeter Prompt:

> Use case: stylized-concept. Asset type: landscape illustration to be integrated into the home screen of an adult mobile transport and exploration strategy game, not a UI mockup. Create a wide 3:2 painting of a fictional working harbor at dawn, seen from an elevated traveler's viewpoint: warm sandstone warehouses along a curving waterfront, a cargo ship, small believable unbranded cargo trucks by the quay, distant mountains and roads fading into haze. An alternate contemporary world with a sense of discovery and long journeys. Restrained painterly realism, naturally proportioned architecture and vehicles, simplified readable forms, soft brushwork, tactile materials, atmospheric light, mature and quietly adventurous. Palette: deep ink petrol #243D40, warm parchment #E6D8BA, sandstone #B79A73, aged brass #B69352, touches of terracotta #A75F46. Warm dawn highlights balanced against cool teal water and shadows. Detailed but readable at small mobile sizes. Fill entire frame with landscape; no border, no text, no typography, no symbols, no UI, no logos, no watermark. Avoid cartoons, caricatures, cute forms, glossy 3D, photorealism, steampunk, medieval castles, exaggerated proportions, exaggerated saturation. This image is a project asset; return local output path metadata if available.

## Prüfung

TypeScript-Prüfung, alle 70 vorhandenen Tests und der Android-Export mit eingebettetem Bild sind erfolgreich. Die Screenshots unter `docs/design/` zeigen die tatsächlichen React-Native-Komponenten über React Native Web mit einem lokalen Testspielstand. Die Testansicht ersetzt ausschließlich die Firebase-Verbindung; sie wird nicht in die App übernommen. Start, Atlas, Ortsdialog und Sammlung wurden in der lokalen Testansicht bedient. Zusätzlich wurden alle zehn Stadtpunkte und alle fünf Navigationstasten bei 320 und 430 Pixel Breite geöffnet. Bei 320, 360, 390 und 430 Pixel Breite gab es keinen horizontalen Überlauf und keine JavaScript-Laufzeitfehler. Die Sprachwahl Deutsch/Englisch wurde mit dem aktuellen Hauptstand zusammengeführt. Eine Namenskollision zwischen der Übersetzungsfunktion und lokalen Fahrzeugvariablen wurde durch den eindeutigen Namen `translate` beseitigt. Ein Test auf einem physischen Android-Gerät ist damit nicht ersetzt.

![Startbildschirm](docs/design/home.jpg)
![Reiseatlas](docs/design/atlas.jpg)
![Sammlung](docs/design/collection.jpg)
