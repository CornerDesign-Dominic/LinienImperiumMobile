# Einheitliche Itembilder

Aktuelle Referenz zu `src/ItemArt.tsx`, `src/itemAssets.ts` und `src/itemVisual.js` (03.11.2026).

## Motive

- Zahnräder mit drei Speichen und Splitter als abgebrochene Facettenecke, jeweils Holz/Eisen/Silber/Gold/Obsidian.
- Kapazitätsmodul: beschlagene Versandholzkiste mit weißem Plus.
- Firmenausbau: teilweise ausgerollte technische Blaupause mit Gebäudeanbau.
- Abholhinweis: gefaltetes Papier mit Hausmotiv.
- Auffüller: Stofftasche mit Kompass beziehungsweise Taschenuhr.
- Werkzeugkasten: offene Holzkiste mit Werkzeugen; interner Bestandsschlüssel weiterhin `hubVehicleParts`.
- Lieferantenkontakt: cremefarbene Visitenkarte mit Personensilhouette und Halle.
- Aufträge: Pergamentrollen, einfache oder prächtige Schleife; Seltenheitsfarbe und Auftragsart bleiben getrennt.

## Technischer Aufbau

Transparente lokale PNGs werden mit `contain` gezeigt. Seltenheitsfläche/-fassung und römische Stufe entstehen technisch; Mengen stehen separat in der jeweiligen Ansicht. Keine Bild-API oder zusätzliche native Bibliothek zur Laufzeit.

Die Auftragsart liegt oben links frei über der Rolle, nicht im roten Wachssiegel und nicht auf einer zusätzlichen dunklen Plakette. Materialauftrag und Transportkartenauftrag nutzen die farbig illustrierten Zahnrad-/Pferdesymbole mit 32 % der Itemfläche ohne Tint- oder Schattenkopien. Andere Arten verwenden die hellen vorgerenderten Symbole mit 28 % und einem feinen Kontrastschatten. Genauere Motivbeschreibung: [Auftragssymbole](order-item-symbols.md).

`itemVisual.js` trennt Item-ID, Art, Seltenheit und Rang. Der Rang eines Material-/Transportkartenauftrags steht römisch unten rechts; er erfindet keine Seltenheit. Projektgruppen übergeben ihre tatsächliche Art ausdrücklich. Reine Navigation, Fahrzeugwerte und Punktanzeigen verwenden ihre Funktionssymbole.

Einsatz: Vorräte, Herstellung, Beschaffungsbeute, Auftragslisten und Prämien, Kartenverbesserungen/Splitter, Geschenkduplikate, Expeditionen, Level-/Eventbelohnungen und Stadthub. Prompts liegen neben den Assets, Quellen der kleineren Auftragssymbole unter `assets/art/items/seals`.

## Historische Prüfung bei Einführung

Die ursprüngliche Bildintegration wurde mit TypeScript, damals 198 Tests, Android-Export und React-Native-Web geprüft. Diese Prüfung betraf noch frühere Siegel-/Plakettenvarianten. Die heutigen Zahnrad-/Pferde-Produktionsbilder wurden mit Transparenz und kleiner Darstellung visuell geprüft; ein nativer Gerätetest ist dafür nicht belegt. Aktuelle Teststrategie: [tests/README.md](../../tests/README.md).
