# Fahrzeugkarten – gesammelter Entwurf

Unveröffentlicht im Branch `collect/transport-upgrades`. Die Sammlung übernimmt den freigegebenen Entwurf; ihre drei Spalten bleiben erhalten. Garage, Fahrzeugauswahl und bestehende Detailansicht verwenden weiterhin ihre bisherigen Layouts.

- Fahrzeugbild bildet den oberen Kartenabschluss: bündig links/rechts/oben, vollständige Facette in Seltenheitsfarbe.
- Helle Pergamentfläche und dünner schwarzer Außenrand unter dem Bild. Keine zusätzlichen Eckverzierungen.
- Kleine Stufenplakette mittig oben, halb überstehend. Römische Zahl aus der tatsächlichen Kartenstufe. Einheitlicher dezenter Kontrastrand im Materialton, sanfte Schattierung, keine abgesetzte Oberkante oder Aktivitätsleiste.
- Material nach Stufe, unabhängig von Seltenheit: I–III Eisen, IV–VI Silber, VII–IX Gold, ausschließlich X Obsidian.
- Name in leicht hinterlegter Fläche; darunter Raute und beidseitig spitz auslaufende Linien in Seltenheitsfarbe.
- Bestehende dynamische Kapazität, Durchschnittsgeschwindigkeit und Betriebskosten mit Symbolen bleiben erhalten. Keine Änderungen an Fahrzeugwerten, Besitz, Wirtschaft oder Navigation.
- Gesperrte Karten bleiben als nicht entdeckt gekennzeichnet, mit Gedankenstrich statt erfundener Stufe. Leere Plätze der letzten Reihe behalten dieselbe Spaltenbreite.

Rahmen, Schild und Trennlinie werden nativ aus Ansichten und Farben aufgebaut; keine neuen Bilder oder nativen Abhängigkeiten. `CardLevelShield` kapselt die Stufenplakette, `cardLevelMaterial` deren unabhängige Materialstaffel. Kleine Fahrzeugbilder an anderen Einsatzstellen bleiben unverändert.

## Validierung

207 Tests erfolgreich, einschließlich sämtlicher Materialstufen und ungültiger/fehlender Stufen. TypeScript und Android-Export erfolgreich. Tatsächliche App im Browser bei 320/360/390/430 dp: drei gleich breite Spalten einschließlich letzter Teilreihe, vier Schildmaterialien sichtbar, alle Bilder geladen, kein horizontaler Überlauf und keine JavaScript-Fehler. Karten-Detailaufruf und gesperrte Gruppe geprüft. Physischer Android-Test nicht Bestandteil dieser lokalen Prüfung.

![Sammlung mit den neuen Stufenplaketten](vehicle-collection-cards.jpg)
