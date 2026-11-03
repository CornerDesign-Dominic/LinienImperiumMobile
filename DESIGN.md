# Gestaltung: Handel und Entdeckung

Gestaltungsreferenz der mobilen App. Mit dem Quellstand `ca6f08d621f6f11aee0f57078dced1434fc6ffab` vom 03.11.2026 abgeglichen. Moduldetails stehen unter [docs/ui](docs/ui); Spielregeln unter [SPIELREGELN.md](SPIELREGELN.md). Frühere Entwurfsbilder und Testzahlen belegen ihren damaligen Stand, nicht automatisch die heutige Darstellung.

## Welt und Bildsprache

Eine eigenständige Parallelwelt mit Transport, Handel und Expeditionen. Die Darstellung bleibt erwachsen, ruhig und atmosphärisch: leicht malerischer Realismus, natürliche Proportionen, nachvollziehbare Materialien, weiches Licht, vereinfachte Details und dezente Gebrauchsspuren. Motive müssen auch auf kleinen Handyflächen erkennbar bleiben. Keine grellen Farben, albernen Gesichter oder verzerrten Proportionen.

Die aktuelle Fahrzeugwelt enthält bereits Wagen, Tiergespanne, Karawanen und Schlitten in fünf Regionen. Individuelle Fahrzeugillustrationen sind vorhanden; neutrale Fahrzeugicons sind nur Rückfälle bei fehlender Assetzuordnung. Neue Regionen und Fahrzeuge werden durch eine Gestaltungsänderung nicht automatisch Teil des Spiels.

## Material und Farben

Reiseatlas mit Sammelkarten: dunkles Tintenpetrol, helle Pergamentflächen und zurückhaltende Messingdetails. Klare Systemschrift trägt Werte, Timer und Aktionen; eine System-Serifenschrift setzt Überschriften und Kartenakzente. Farben stehen in [src/palette.json](src/palette.json), Schriften und Akzente in [src/theme.ts](src/theme.ts).

| Rolle | Farbton |
| --- | --- |
| Tinte und Navigation | `#243D40` |
| Pergament | `#F2E8D3` |
| Hintergrund | `#DCD0B8` |
| Hauptaktionen | `#315F59` |
| Messingmaterial | `#B69352` |
| Goldschrift auf Pergament | `#79591F` |
| Helle Schrift auf Tinte | `#F4EBD8` |

[MaterialView und MaterialPressable](src/Material.tsx) legen die bestätigten Papier-/Petroltexturen dekorativ unter den Inhalt. Die Ebene fängt keine Berührungen ab und wird nicht vorgelesen; der Host erhält kein zusätzliches Clipping. Bildflächen, Fahrzeugfacetten und semantische Farben bleiben erhalten. Details: [Gealterte Materialien](docs/ui/aged-materials.md).

## Navigation und Dialoge

- Kompakte Startzeilen mit farbigen Miniaturen; die Firmenkarte öffnet Handelsimperium. Kein großes Hafenbild auf der aktuellen Startseite.
- Fünf feste untere Ziele: Home, Flotte, Garage, Einzelaufträge, Großaufträge. Die Leiste zeigt Bildmotive; zugängliche Beschriftungen und Auswahlstatus bleiben erhalten.
- Gemeinsamer Seitenkopf mit symmetrischen Aktionsflächen; Zurück, Hilfe und Schließen bleiben erkennbare Bedienelemente.
- Schließaktionen verwenden das gemeinsame X. Lange Dialoginhalte scrollen; feste Köpfe und Schließflächen bleiben erreichbar, wo die jeweilige Dialogkomponente sie vorsieht.
- Dekoration wird nicht vorgelesen. Zustände dürfen nicht ausschließlich über eine Farbe vermittelt werden; Namen, Zahlen und zugängliche Beschriftungen liefern Kontext.

Komponenten: [MenuArt](src/MenuArt.tsx), [PageHeader](src/PageHeader.tsx), [ModalCloseButton](src/ModalCloseButton.tsx), [AppModal](src/AppModal.tsx). Einzelheiten: [Menübilder](docs/ui/menu-art.md), [Modal-Schließen](docs/ui/modal-close-consistency.md).

## Fahrzeugkarten

[VehicleArt](src/VehicleArt.tsx) ist die gemeinsame Bilddarstellung: quadratisches Fahrzeugmotiv mit abgeschnittenen Facettenecken und deutlich sichtbarer technischer Fassung in Seltenheitsfarbe. Rahmen und Maskierung entstehen aus nativen Ansichten und Farben, nicht aus Rahmenbildern. Kein zusätzliches Seltenheitsicon. Die Fassung skaliert mit der Bildbreite; kleine Bilder erhalten keinen schweren schwarzen Außenstrich.

Kartenstufe, Seltenheit und Geschwindigkeitsrang sind unabhängige Merkmale:

| Merkmal | Darstellung |
| --- | --- |
| Seltenheit | Gemeinsame farbige Facettenfassung: Common, Uncommon, Rare, Epic, Legendary |
| Kartenstufe I–X | In der Sammlung Material-Schild: I–III Eisen, IV–VI Silber, VII–IX Gold, X Obsidian |
| Geschwindigkeitsrang | Sammlung: farbige römische Zehnersegmente; Detail: Rangstern mit Teilstufe |

Die Sammlung verwendet die verzierte Variante von `VehicleCardTile`: Schild, Bild, Namensband, Trennlinie, Rangsegmente und drei Iconwerte. Garage und allgemeine Fahrzeugauswahl verwenden die kompaktere Variante derselben Komponente mit römischer Stufe und drei Werten. Einzelauftragsauswahl zeigt stattdessen Touren, Dauer und Gewinn. Diese Kontexte teilen Bildsprache und Datenquellen, haben aber bewusst unterschiedliche Informationsdichte.

Fahrzeugdetails verwenden [VehicleCardDetail](src/VehicleCardDetail.tsx): Stufe, Bild/Name, Bonus mit Stufentabelle, Geschwindigkeit, Kapazität und Betriebskosten. Garage/Flotte nutzen den kompakten Modus mit Kontextaktionen; Verbesserungen erfolgen aus der Sammlung. Details: [Sammlungskarten](docs/ui/vehicle-collection-cards.md), [Filter](docs/ui/collection-filters.md), [gemeinsame Auswahl](docs/ui/shared-card-pickers.md).

## Expedition und Stadthub

Fünf Regionskarten führen in horizontal erkundbare Landschaften: Kronenlande, Weite Ebenen, Safranstraße, Jadetal und Nordmark. Je Region gibt es sieben Orte und einen Endlos-/Handelsort, insgesamt 40 eigene Nahansichten. Leichte Regionstitel, dezente Pfeile und weich auslaufender Nebel lassen die Landschaft wirken. Gesperrte Gebäude, Namen und Aktionen bleiben verdeckt. Details: [Reisekarten](docs/ui/expedition-journeys.md), [Atmosphäre](docs/ui/expedition-atmosphere.md), [Ortsmodale](docs/ui/expedition-place-modals.md).

Stadthub: Übersicht und Boten, kompakte Ertrags-/Fundkisten-/Vertriebsbereiche und Dreispaltenraster für Lastwombat-Boten. Bilder für Erträge und Vertrieb ergänzen die tatsächlichen Werte; sie ersetzen keine Anzeigen. Der aktuell verfügbare Lastwombat ist zugleich die freie Standardgestaltung. Weitere bezahlte Skins benötigen eigene freigegebene Motive und technische Einbindung; Platzhalter werden nicht verkauft.

## Items, Währungen und Assets

- [ItemArt](src/ItemArt.tsx) zeigt transparente Illustrationen mit technisch erzeugter Seltenheitsfläche/Fassung und gegebenenfalls römischer Stufe. Die Menge steht separat.
- Auftragsrollen tragen ihre Art oben links: Materialauftrag mit illustriertem Zahnrad, Transportkartenauftrag mit Pferdekopf; beide ohne zusätzliche Plakette oder Fassung. Andere Arten verwenden die vorhandenen hellen Symbole.
- Ausbaupunkte: freigestellter Bauplan mit bronzener Säule, ohne eingefärbte Plusgrafik. Das Motiv wird in Belohnungen und Verteilung gemeinsam verwendet; Mengen stehen separat. [Referenz](docs/ui/ausbaupunkte.md).
- Imperium-Taler: Goldmünze mit Lorbeerkranz und leerer Mitte. Hermes-Siegel: geflügelte Sandale, schmaler Smaragdring und vier grüne Steine. Das alte kombinierte Münzmotiv ist keine aktuelle Iconquelle.
- Hermes-Siegel-Pakete haben sechs eigene, steigende Motive von der Einzelmünze bis zur geöffneten Truhe. Echtgeldpreise bleiben ausdrücklich Vorschauen, Kaufbuttons sind deaktiviert.

Illustrationen werden lokal gebündelt; es gibt keine Bildgenerierung oder externe Bild-API zur Laufzeit. Prompts und Herkunft liegen neben den Assets. Funktionale Icons dürfen eingefärbt werden; gemalte Menü-, Item-, Währungs- und Fahrzeugmotive behalten ihre Materialfarben. Siehe [Itembilder](docs/ui/item-art.md), [Auftragssymbole](docs/ui/order-item-symbols.md), [Währungen](docs/ui/coin-art.md) und [Shop](docs/ui/premium-shop.md).

## Gestalterisch prüfen

Bei Änderungen die betroffenen realen Komponenten bei kleinen Displaybreiten, langen deutschen/englischen Namen, gesperrten und belegten Zuständen sowie großen Mengen prüfen. Export und Verhaltenstests belegen keine native Bildschärfe, Scrollrate oder Touchqualität. Aktuelle Prüfberichte gehören in [TEST_REPORT.md](TEST_REPORT.md); historische Prüfungen in Modulnotizen bleiben als solche gekennzeichnet.
