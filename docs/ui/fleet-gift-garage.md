# Flottendetails und verwandte Ansichten

Aktuelle Implementierung der Flottendetails: `src/FleetDetails.tsx`, `src/fleetEstimate.js` und serverseitige effektive Fahrzeugwerte (03.11.2026).

## Flottendetails

Ein mittiger begrenzter Dialog berechnet eine frei eingegebene einfache Strecke (Startwert 100 km, >0 bis 100.000 km) für eine Stunde. Annahme: voll beladene Hinfahrt, leere Rückfahrt, wiederholte Touren. Jedes Fahrzeug wird separat berechnet, danach werden Kapazität, Fahrkilometer einschließlich angebrochener Tour, abgeschlossene Touren/Liefermenge, Kosten, Vergütung und XP summiert.

Kartenstufe, Kapazität, Geschwindigkeitsrang, wirksame Flottenboni und Werkstatt sind enthalten. Garage-/Einzelboni gelten ausschließlich gemäß realem Flottenmodus; keine erfundene Kundenvergütung oder Abschlussprämie. Die lokale Vorschau verändert keine Tour und keinen Vorrat und löst keine zusätzlichen Serverbefehle aus.

## Zuständige Referenzen

Die hier früher ebenfalls beschriebene Geschenk- und Garage-Zwischenfassung ist ersetzt:

- [Geschenk-Ergebnis](gift-result-modal.md): eigenes Gewinnmodal nach kurzer Pause, Rückkehr zur geöffneten Kiste.
- [Garagenkarten](shared-garage-collection-cards.md): drei Spalten, zehn Plätze, gemeinsame kompakte Kartenwerte.
- [Gemeinsame Kartenauswahl](shared-card-pickers.md) und [Kontextdetails](unified-context-card-details.md).

## Historische Prüfung bei Einführung

Damals 87 Backend-/Berechnungstests, darunter separate Fahrzeugtouren, Summen, Kosten, Boni, Teilstunden, ungültige Strecken und reine Vorschau ohne Zustandsänderung. Der damalige Bericht enthielt keinen vollständigen App-Build und keinen Gerätetest. Aktuelle Prüfergebnisse: [TEST_REPORT.md](../../TEST_REPORT.md).
