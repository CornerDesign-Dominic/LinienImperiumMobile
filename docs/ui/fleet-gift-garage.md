# Flottendetails, Geschenköffnung und Garagenkarten

Status: vorbereitet, noch nicht veröffentlicht.

## Flottendetails
Der Hinweis „5 Plätze …“ wurde durch den Button Flottendetails ersetzt. Mittiges, scrollbar begrenztes Modal mit eigener Kilometer-Eingabe (Startwert 100 km, Dezimalwerte möglich, >0 bis 100.000 km).
Annahme: voll beladene Hinfahrt, leere Rückfahrt, wiederholte Touren über eine Stunde. Alle Fahrzeuge werden separat berechnet, anschließend summiert. Angezeigt: Kapazität, gefahrene Kilometer inklusive angebrochener Tour, abgeschlossene Touren, tatsächlich abgeschlossene Liefermenge, Kosten und Frachtvergütung, XP und wirksame Boni.
Der Server liefert die effektiven Werte aus projectFleetVehicles, truckSpeed und operatingCostPerKm sowie die echten Frachtraten. Werkstatt, Kartenstufen, Kapazität, Geschwindigkeitsrang und Flottenboni sind enthalten; Garage-/Einzelauftragsboni wirken nur wie im echten Flottenmodus. Keine Kundenboni oder Abschlussprämien in der Beispieltour.
Die Eingabe berechnet lokal und verursacht keine zusätzlichen Serverbefehle oder Ressourcenänderungen. Es werden aktuelle Vorlagenwerte simuliert, keine laufenden Touren umgeschrieben.

## Geschenköffnung
Nach Öffnen läuft eine Markierung wiederholt von oben nach unten durch die fünf Fahrzeuge. Während der Serveranfrage bleibt sie in Bewegung; nach Eingang des echten Ergebnisses folgen zwei Runden mit zunehmender Verzögerung bis zum Gewinner. Dieser bleibt markiert; darunter steht neue Fahrzeugkarte oder Duplikat-Shard.
Das Ergebnis wird weiterhin ausschließlich vom bestehenden Serverkommando vergeben, einmal bezahlt und gespeichert. Keine erneute Auslosung durch die Animation. Überspringen ist verfügbar, sobald das Ergebnis vorliegt; es zeigt denselben Gewinner. Timer werden beim Verlassen/Unmount aufgeräumt. Reduzierte Bewegung des Geräts zeigt direkt das echte Ergebnis. Fehler erlauben erneuten Versuch und vergeben lokal nichts.

## Garage
Zwei Spalten und zehn Plätze bleiben erhalten. Karten haben Seltenheitsfarbe in Hintergrund, Rahmen und Symbol. Stufe oben, Name und Kapazität hervorgehoben, Rang separat, Tempo beladen und leer mit gemeinsamer Einheit km/s. Ungefähr 220 logische Pixel Mindesthöhe, auf normalen Handybreiten kürzer als Verhältnis 1:3. Leere Plätze behalten gestrichelte Plus-Karte. Auch Details zeigen beide Geschwindigkeiten, ohne Upgradefunktionen.

## Prüfung
87 Backend-/Berechnungstests bestanden:
node --test --test-reporter=dot tests/fleet-details.test.cjs tests/gifts.test.cjs tests/mobile-engine.test.cjs tests/events.test.cjs tests/tour-updates.test.cjs tests/procurement.test.cjs

Vier neue Tests decken separate Fahrzeugtouren, unterschiedliche Tempi, Summen, Kosten und Boni, lange/angebrochene/exakt stündliche Touren, ungültige Strecken, leere Flotten, reine Servervorschau ohne Zufall oder Zustandsänderung, Flotten-/Garagenbonusabgrenzung, Werkstattkosten und alle Start-/Zielkombinationen der Geschenkmarkierung ab.
Kein vollständiger TypeScript-/Expo-Build, keine visuelle Browserprüfung und kein Gerätetest in dieser Vorbereitung.
