# Beschaffung: Fahrzeugauswahl

Aktuelle Referenz zu `src/Procurement.tsx` (Quellstand 03.11.2026). Die frühere dreispaltige Auswahl nur freier Fahrzeuge ist ersetzt.

Das Planungsmodal zeigt Garagentransporte direkt in zwei Spalten. Jede Karte enthält das vorhandene Fahrzeugbild, den vollständigen Namen und die vom Server berechnete Dauer je Tour. Mehrere freie Fahrzeuge sind auswählbar; erneut antippen entfernt die Auswahl. Haken und Status kennzeichnen gewählte Fahrzeuge. Belegte Fahrzeuge bleiben sichtbar, ausgegraut und deaktiviert. Höchstens zehn Fahrzeuge dürfen gewählt werden.

Kapazität und Rohgeschwindigkeit werden nicht zusätzlich wiederholt. Die Dauer verwendet dieselbe Berechnung wie die Beschaffung; der Client erfindet keine eigene Laufzeit. Tourenzahl beziehungsweise Reserve und Startvalidierung bleiben serverseitig. Auswahldaten werden bei neuen Serverantworten mit dem Frei-Status abgeglichen.

Details zum gemeinsamen Tourenvorrat: [Beschaffungsgruppen](procurement-groups.md). Übersicht und Ablaufdialog: [Beschaffungsübersicht](procurement-overview.md). Frühere Testberichte zur alten Dreispaltenauswahl sind keine Layoutprüfung dieser Fassung; aktuelle Prüfbezüge stehen in [tests/README.md](../../tests/README.md).
