# Einheitliche Garage- und Sammlungskarten

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Drei gemeinsame kompakte Iconwerte: Kapazität, Durchschnittstempo und Betriebskosten. Die Garage zeigt keine Rangzeile. Die Sammlung ergänzt inzwischen eine separate farbige Rangsegmentzeile, siehe [Sammlungskarten](vehicle-collection-cards.md).
- Die Garage zeigt eine römische Kartenstufe über dem Facettenbild. Die Sammlung nutzt stattdessen das Material-Schild und die verzierte Namens-/Trennlinienfassung; beide stammen aus `VehicleCardTile`.
- Garage und Sammlung verwenden dieselbe `VehicleCardTile`-Komponente. Garage zeigt nun ebenfalls drei Spalten mit 4,5 Einheiten Zwischenraum und 5 Einheiten Reihenabstand.
- Die Garage behält genau zehn nutzbare Plätze; nicht belegte Plätze öffnen die bisherige Fahrzeugauswahl. Die beiden übrigen Zellen der vierten Reihe sind reine Platzhalter. Belegte Karten öffnen weiterhin das bestehende Garagendetail mit Status, Statistiken und Herausnehmen-Aktion.
- Durchschnitt verwendet weiterhin (beladen + leer) / 2 mit drei Nachkommastellen intern und maximal zwei in der Anzeige. Die Kartenwerte sind die bestehenden serverseitigen Fahrzeugwerte.
- Screenreader-Beschriftungen der Sammlung/Garage nennen die drei Werte ohne den entfernten Geschwindigkeitsrang.
- Die allgemeine Flottenauswahl verwendet ebenfalls den kompakten `VehicleCardTile` mit drei Iconwerten und Belegungsstatus. Gesperrte Karten bleiben sichtbar; Details unter [gemeinsame Auswahl](shared-card-pickers.md).
- Keine Änderung an Besitz, Fahrzeugen, Garagenplätzen, Einsätzen, Flottenzuweisungen oder Spielberechnungen.

Historische Prüfung bei Einführung: TypeScript und alle 174 bestehenden Tests erfolgreich. Mobile Browserprüfung bei 320/390/430 px bestätigt identische Kartenbreiten/-höhen in Garage und Sammlung, drei Spalten, korrekten Zwischenraum, zehn nutzbare Plätze, drei Iconwerte ohne Rang, Hinzufügen/Herausnehmen und erhaltene Flottenauswahl. Deutsch/Englisch geprüft, keine Laufzeitfehler oder seitlicher Überlauf. Android-Export erfolgreich. Kein physischer Gerätetest.
