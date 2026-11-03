# Vorrats- und Auftragsbilder

27 transparente 512 × 512 PNG-Motive für Materialien, Zahnräder, Splitter und Schriftrollen. Erzeugt mit dem integrierten Bildgenerator anhand der freigegebenen Motivauswahl; Produktionsprompts: `prompts.json`. `src/itemAssets.ts` bündelt die statischen Quellen. Zur Laufzeit wird kein Bilddienst benötigt.

`src/ItemArt.tsx` zeichnet Seltenheitsfläche, schwarzen Rand und optionale römische Rangzahl technisch; die Menge steht separat in der jeweiligen Ansicht. Die Auftragsart wird oben links überlagert, nicht auf das Wachssiegel gemalt. Materialaufträge verwenden `seals/material-cog.png`, Transportkartenaufträge `seals/transport-horse.png`: freigestellte Illustrationen mit 32 Prozent der Itemfläche, ohne zusätzliche Tint- oder Schattenkopien. Die übrigen Arten verwenden die vorgerenderten Symbole mit 28 Prozent der Fläche und kontrastierender Kontur.

Die ursprünglichen sechs SVG-Symbole und ihre PNG-Exporte bleiben unter `seals/` als Quellen bzw. für die weiterhin verwendeten Motive erhalten. Der optionale Renderer `scripts/build-item-seals.cjs` benötigt `sharp` nur im Entwicklungsumfeld. Das Vorhandensein eines Assets begründet keine zusätzliche Spielregel oder freigeschaltete Item-Seltenheit.

Aktuelle Darstellung: [Itembilder](../../../docs/ui/item-art.md) und [Auftragssymbole](../../../docs/ui/order-item-symbols.md). Fachliche Bestände und Verwendung: [Item-Katalog](../../../ITEM_AUDIT.md).
