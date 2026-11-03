# Kompakte Startseite

Aktueller Implementierungsbezug: `src/App.tsx`, `src/MenuArt.tsx` (Quellstand 03.11.2026).

- Firmenkarte ohne großes Hafenbild; die Karte öffnet Handelsimperium und zeigt offene Levelpunkte an.
- Startbereiche sind volle kompakte Zeilen mit farbiger Miniatur, Titel und einer kurzen Beschreibungszeile. Beschreibungen werden ohne Umbruch gekürzt.
- Einzel-/Großaufträge zeigen laufende Arbeit und Belohnungen; Einzelaufträge zusätzlich den Angebotswechsel-Countdown.
- Transportkarten zeigt den Besitzstand aus dem tatsächlichen Katalog. Stadthub zeigt Kassenfüllstand, Materialbeschaffung ausstehende Belohnungen.
- Die fünf unteren Ziele verwenden nur ihre Bildmotive, gleich breite Tippflächen und zugängliche Namen/ausgewählten Zustand. Funktionale Pfeile und Statussymbole bleiben ergänzend erhalten.
- Die frühere Hafenillustration bleibt im Assetbestand, ist keine aktuelle Startseitenvorgabe. Menü- und Navigationsbilder: [Menübilder](../ui/menu-art.md).

## Historische Prüfung bei Einführung

Die erste kompakte Fassung wurde mit Typprüfung, damals 70 Tests, Android-Export und React-Native-Web bei 320/360/390/430 px geprüft. Ihre alten Höhenmessungen und Screenshots gelten nicht als Messung des später verdichteten aktuellen Layouts. Kein physischer Gerätetest. Aktuelle Prüfungen: [TEST_REPORT.md](../../TEST_REPORT.md).
