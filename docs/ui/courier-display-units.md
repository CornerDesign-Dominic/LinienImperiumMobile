# Anzeigeeinheiten der Boten

Nur die Darstellung von Boten verwendet die vereinbarte Skalierung:

| Interner Wert | Sichtbare Anzeige |
| --- | --- |
| Geschwindigkeit 1,3 km/s | 1,3 m/s |
| Strecke 100 km | 100 m |
| Tragkraft 3 t | 30 kg |
| Starttragkraft 2 t | 20 kg |

`src/courierDisplay.ts` formatiert ausschließlich diese Anzeigen. Botenkarte und zugänglicher Name, Anwerben, Detail, Laderaum-/Antriebsausbau und Vorschau, Vertriebsmengen und Botenstrecke in der Statistik verwenden denselben Helfer. Zahlenformatierung folgt weiterhin der gewählten Sprache. Die deutschen und englischen Boten-Hilfetexte nennen 20 kg Starttragkraft.

Interne Kapazitäten, Geschwindigkeiten, Kilometer, Zustandsfelder, Einkäufe, Zykluszeiten, Warenmengen, Ausbaustufen, Kosten, Erträge und XP bleiben unverändert. Es gibt keine Migration. Normale Fahrzeugkarten, Garage, Flotte, Aufträge, Expedition sowie allgemeine Fracht-/Streckenstatistik verwenden weiterhin t, km und km/s.

Regressionstests prüfen die vier Beispiele, zugängliche Botenwerte, beide Ausbauvorschauen, Anwerben, Botenstrecke mit älterem Statistik-Fallback, reguläre Statistik-Einheiten und unveränderte Zustände, Wirtschaft und Zykluswerte für fünf Boten nach dem Rendern. Ein vorhandener Vertriebs-Test prüft nun die zehnfach dargestellte Kilogrammmenge; seine Ausbaukosten- und Sperrprüfungen bleiben bestehen.
