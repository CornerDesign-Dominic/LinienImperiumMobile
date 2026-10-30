# Kompaktere Kartenabstände

Die Anpassung reduziert ausschließlich Abstände und Zeilenhöhe: gemeinsame Karten haben 14 statt 16 dp Innenabstand und 10 statt 12 dp Abstand zur nächsten Karte. Gemeinsame Textzeilen verwenden 20 statt 21 dp; Zeilen- und Abschnittsabstände sind entsprechend kürzer. Startmenüzeilen, Auftragskarten sowie Kunden- und Transportverbesserungsabschnitte sind vertikal kompakter. Bereits kleinere Seitenränder (9 dp) und dichte Fahrzeug-/Itemraster bleiben erhalten; der abweichende Expeditionsseitenrand sinkt von 18 auf 12 dp.

Rahmenfarben, Rahmenstärken, Rundungen, Schatten, Schriften, Schriftgrößen, Bildgrößen und Seitenverhältnisse wurden nicht verändert. Der Seitentitel bleibt bei 44 dp Mindesthöhe; Mindesttouchflächen und Bottomnavigation bleiben erhalten. Die Firmenkarte erhält kein neues Design. Bildlastige Raster werden nicht pauschal in ihrer Höhe skaliert.

Echte React-Native-Web-App bei 320, 360, 390 und 430 dp vor/nach geprüft: Start, Einzelaufträge, Vorräte, Fahrzeugkarten, Stadthub und Kundendetails. Beispiel bei 390 dp: Startmenüzeile 70 → 64 dp (−8,6 %), Auftragskarte 106 → 95 dp (−10,4 %); die Kartenbreite bleibt unverändert. Vier Vorratsspalten und drei Fahrzeugspalten bleiben lesbar, ohne horizontalen Überlauf. TypeScript und vollständige Testsuite erfolgreich.
