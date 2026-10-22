# Einheitliche Garage- und Sammlungskarten

Vorbereitet nach der Veröffentlichung des ersten Sammelpakets am 22.10.2026. Sammelbranch `batch/company-improvements`, noch nicht veröffentlicht.

- Geschwindigkeitsrang und Rangstern aus den Karten der Sammlung entfernt. Es bleiben genau drei kompakte Iconwerte: Kapazität (Kiste, t), Durchschnittstempo (Stoppuhr, km/s) und Betriebskosten (Münze, M/km).
- Römische Kartenstufe über dem Bild, Facettenrahmen, Fahrzeugname und bestehende Seltenheitsfarben bleiben erhalten.
- Garage und Sammlung verwenden dieselbe `VehicleCardTile`-Komponente. Garage zeigt nun ebenfalls drei Spalten mit 4,5 Einheiten Zwischenraum und 5 Einheiten Reihenabstand.
- Die Garage behält genau zehn nutzbare Plätze; nicht belegte Plätze öffnen die bisherige Fahrzeugauswahl. Die beiden übrigen Zellen der vierten Reihe sind reine Platzhalter. Belegte Karten öffnen weiterhin das bestehende Garagendetail mit Status, Statistiken und Herausnehmen-Aktion.
- Durchschnitt verwendet weiterhin (beladen + leer) / 2 mit drei Nachkommastellen intern und maximal zwei in der Anzeige. Die Kartenwerte sind die bestehenden serverseitigen Fahrzeugwerte.
- Screenreader-Beschriftungen der Sammlung/Garage nennen die drei Werte ohne den entfernten Geschwindigkeitsrang.
- Flottenauswahl verwendet dieselbe Karte mit ihrer bisherigen kompakten Rang-/Kapazitätsanzeige und Auswahlmarkierung; ihre Darstellung wurde nicht auf die drei Garagenwerte umgestellt.
- Keine Änderung an Besitz, Fahrzeugen, Garagenplätzen, Einsätzen, Flottenzuweisungen oder Spielberechnungen.

Prüfung: TypeScript und alle 174 bestehenden Tests erfolgreich. Mobile Browserprüfung bei 320/390/430 px bestätigt identische Kartenbreiten/-höhen in Garage und Sammlung, drei Spalten, korrekten Zwischenraum, zehn nutzbare Plätze, drei Iconwerte ohne Rang, Hinzufügen/Herausnehmen und erhaltene Flottenauswahl. Deutsch/Englisch geprüft, keine Laufzeitfehler oder seitlicher Überlauf. Android-Export erfolgreich. Kein physischer Gerätetest. Nicht veröffentlicht.
