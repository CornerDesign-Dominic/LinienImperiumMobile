# Einfache Kartenboni

Die `bonusLevels` im gemeinsamen Serverkatalog `functions/src/transport-cards.json` sind die tatsächlichen Effekte und zugleich die Werte für Stufentabelle, Ausbauvorschau und Bonusbeschreibung. Die Prozentboni haben zehn strikt steigende Stufen mit einer festen einfachen Schrittweite. Keine bloße Rundung in der Oberfläche.

| Bisher Stufe 1–10 | Neu Stufe 1–10 | Schritt in Prozentpunkten | Karten |
| --- | --- | --- | --- |
| 3–6 % | 3–5,7 % | 0,3 | Alle zehn Common-Karten |
| 6–12 % | 6–10,5 % | 0,5 | Prärie-Lastenzug, Terrassen-Ochsenwagen |
| 4–8 % | 4–8,5 % | 0,5 | Silberhirsch-Gespann, Leitwagen der Pioniere, Silberkarawane, Weißhirsch-Schlitten |
| 8–16 % | 8–17 % | 1 | Königliches Löwengespann, Donnerbison-Gespann, Dünenläufer-Karawane, Schneeleoparden-Express |
| 10–20 % | 10–19 % | 1 | Kaiserliches Pandagespann |
| 2–4 % | 2–4,25 % | 0,25 | Nordland-Lastengespann |

Die ersten Werte und die vorhandenen Bonusarten bleiben erhalten. Das Format zeigt höchstens zwei Nachkommastellen, damit insbesondere Viertelschritte auch in Flottenzeilen nicht auf eine Nachkommastelle verkürzt werden. Kostenersparnis wird weiterhin mit Minus, andere Prozentboni mit Plus angezeigt.

Die bereits einfachen ganzzahligen Punkte- und Sekundenfolgen bleiben erhalten: Postkutsche und Oasenkarawane 5/10/15/20/25/30/40/50/60/70 Punkte; Jade-Kundschaftergespann 10/20/30/40/50/60/75/90/105/120 Sekunden. So entstehen weder halbe Punktemaxima noch ein erheblicher Stärkeverlust durch eine neue lineare Ganzzahlfolge.

Bestehende Kartenstufen, Aufwertungsbestände, Fahrzeuggrundwerte und aktive Fahrtsnapshots werden nicht verändert. Neue Berechnungen verwenden den aktuellen Katalog, laufende Fahrten behalten ihre eingefrorenen Werte.

Validierung: Alle zehn Katalog-/Serverwerte jeder Karte, konstante einfache Prozentabstände und aktive Kostenwirkung; bestehende Tests für Fahrtsnapshots und Bonusspender. Tatsächliche Bonusstufentabelle bei 320/390/430 dp inklusive 2,25-%-Schritten geprüft.
