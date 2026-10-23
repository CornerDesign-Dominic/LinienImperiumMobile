# Gemeinsame Fahrzeugkartenauswahl

Garage und Flotte nutzen `VehicleCardPicker` mit dem gemeinsamen `RarityFilter` der Sammlung. Das Dreispaltenraster zeigt die freigeschalteten Karten mit römischer Stufe, Bild, Name und Kapazität, Durchschnittsgeschwindigkeit sowie Betriebskosten als Iconwerte.

Die Liste wird nach dem Seltenheitsfilter stabil aufgeteilt: verfügbare Karten zuerst, belegte Karten danach. Belegte Karten bleiben sichtbar, erhalten einen grauen Hintergrund, abgedunkelte Darstellung, Schloss und „In Garage“ bzw. „In dieser Flotte“. Sie sind tatsächlich deaktiviert und zusätzlich im Auswahlhandler gesperrt. Während eines laufenden Speichervorgangs sind alle Karten deaktiviert.

In der Garage gilt die Belegung durch Garagenfahrzeuge. In der Flotte gilt ausschließlich die aktuell ausgewählte Flottenvorlage. Karten aus einer anderen Flotte oder dem jeweils anderen Bereich bleiben wählbar. Dieselbe Regel gilt beim Wechseln eines bestehenden Fahrzeugs; belegte Karten werden nicht mehr innerhalb einer Flotte verschoben. Entfernen bleibt über die Detailansicht möglich.

Die Sammlung nutzt den extrahierten Dropdown weiterhin mit ihren aufklappbaren Gruppen. Leere Seltenheitsfilter zeigen eine Leeranzeige. Deutsch und Englisch enthalten die Belegungsangaben.

## Prüfung

- Typprüfung erfolgreich; 177 bestehende Tests erfolgreich.
- Browser bei 320, 390 und 430 px: Garage hinzufügen/wechseln, Flotte besetzen/wechseln, Filter, leere Filterauswahl, Sortierung und tatsächliche Sperre, Belegung je Flottenvorlage und Sammlung geprüft.
- Englischer Dropdown und Belegungsstatus geprüft; keine Laufzeitfehler.
- Android-Export geprüft; kein physischer Gerätetest.

Im Sammelbranch gespeichert, nicht veröffentlicht.
