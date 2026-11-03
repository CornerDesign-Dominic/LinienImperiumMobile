# Sammlung: Filter, Gruppen und Details

Mit `src/VehicleCards.tsx`, `src/VehicleCardDetail.tsx` und `src/VehicleFacts.tsx` im Quellstand vom 03.11.2026 abgeglichen. Diese Referenz ersetzt die früher hier fortgeschriebene Entwurfsfolge.

## Filter und Gruppen

- Ein kompakter Seltenheitsfilter bietet Alle/Common/Uncommon/Rare/Epic/Legendär. Auswahl schließt die Liste; Farbe, Häkchen, Splittericon und tatsächlicher Splitterbestand bleiben zugeordnet.
- Freigeschaltet und Gesperrt sind unabhängig klappbar, mit Anzahl für den aktuellen Filter. Anfangs ist Freigeschaltet offen und Gesperrt geschlossen. Filterwechsel bewahrt die Klappzustände.
- Leere Gruppen und Filter besitzen kurze Leeranzeigen. Detailnavigation, Besitz und Spielwerte stammen weiter vom Server.
- Das Raster hat drei feste Spalten; leere Schlusszellen verhindern verbreiterte Einzelkarten. Die Sammlung nutzt die verzierte Kartenvariante einschließlich Material-Schild und Rangsegmenten, siehe [Sammlungskarten](vehicle-collection-cards.md).

## Werte und Details

Unter den Rangsegmenten stehen drei kompakte Iconwerte: Kapazität, Durchschnittstempo und Betriebskosten. Durchschnitt ist `(beladen + leer) / 2`, intern auf drei Nachkommastellen gerundet und mit maximal zwei angezeigt. Fehlende Tempo-/Kostenwerte werden nicht erfunden.

`VehicleCardDetail` zeigt Kartenstufe, Facettenbild/Name, Bonussatz mit Fragezeichen, Geschwindigkeit, Kapazität und Betriebskosten. Das Bonusmodal enthält alle zehn tatsächlichen `bonusLevels`-Werte mit aktueller Stufe und passenden Einheiten. Nicht besessene Karten zeigen eine Stufe-1-Vorschau.

In der Geschwindigkeitscard stehen Leer/Beladen/Durchschnitt und rechts der farbige Rangstern mit römischer Teilstufe. Kapazität zeigt Erweitert/Limit, Betriebskosten nur den tatsächlichen Kostenwert. Ausbauten sind im separaten [Verbesserungsmodal](vehicle-upgrade-modal.md), nicht in mehreren verstreuten Detailcards. Garage und Flotte verwenden den [kompakten Kontextmodus](unified-context-card-details.md).

## Prüfbezug

Die früheren Prüfungen betrafen einzelne Zwischenstände mit drei, später vier Werten und inzwischen ersetzten Rang-/Ausbauzeilen. Diese Entwürfe gelten nicht mehr als aktuelle Vorgabe. Verhaltenstests der Sammlung, Wertepräzision und Übersetzungen sind in [tests/README.md](../../tests/README.md) beschrieben; ein physischer Gerätetest wird hier nicht behauptet.
