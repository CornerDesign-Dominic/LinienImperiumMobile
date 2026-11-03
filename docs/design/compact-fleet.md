# Kompakte Flotte und Fahrzeugauswahl

Aktueller Implementierungsbezug: `src/Fleet.tsx`, `src/VehicleCards.tsx`, `src/VehicleCardDetail.tsx` (Quellstand 03.11.2026).

- Drei Flottenvorlagen, jeweils fünf schmale Platzzeilen. Platznummer, kleines Facettenbild, Name und Bonus sind direkt sichtbar.
- Freier Platz öffnet die Auswahl; belegter Platz öffnet die gemeinsame kompakte Fahrzeugdetailansicht mit Wechseln und Entfernen.
- Der gemeinsame Picker zeigt eigene Karten in drei Spalten mit Seltenheitsfilter, römischer Kartenstufe, Bild, Namen und drei Iconwerten.
- Bereits in der gewählten Flotte belegte Karten stehen abgedunkelt und gesperrt am Ende. Sie werden durch Antippen nicht mehr innerhalb der Flotte verschoben. Andere Flottenvorlagen und die Garage sperren die Karte hier nicht.
- Speichern schließt erst nach bestätigter Zuweisung. Fehler lassen Wiederholung zu; Abbrechen verändert die Flotte nicht. Details: [gemeinsame Auswahl](../ui/shared-card-pickers.md), [Kontextdetails](../ui/unified-context-card-details.md).

## Historische Prüfung bei Einführung

Der ursprüngliche kompakte Entwurf wurde mit TypeScript, Android-Export, damals 70 Tests und React-Native-Web bei 320/360/390/430 px geprüft. Diese Prüfung enthielt noch die später ersetzte Verschieberegel belegter Karten und ist kein aktueller Gesamt- oder Gerätetest. Maßgeblich für heutige Prüfergebnisse ist [TEST_REPORT.md](../../TEST_REPORT.md).
