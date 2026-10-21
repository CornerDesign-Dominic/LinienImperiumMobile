# Regionsbilder: Android-Skalierung und dezente Titel

Fehlerursache: React Native Image.android.js stellt bei lokalen Bildern die ursprüngliche Breite/Höhe vor die Benutzerstyles. Der bisherige absoluteFill-Style setzte nur die Randpositionen und überschrieb diese Maße nicht. Yoga behielt deshalb ein 768×512 großes Bild in einer wesentlich kleineren Bildfläche; sichtbar war vor allem dessen obere linke Ecke. Die Browserdarstellung bildete diesen nativen Unterschied nicht ab.

Korrektur: Die Bildfläche wird per onLayout gemessen. Eine gemeinsame Berechnung erzeugt für jedes der fünf Bilder einen deckenden, proportionalen Bildrahmen mit expliziter Breite/Höhe und Position. Die ursprünglichen Bildmaße werden damit auch unter Android überschrieben. Regionsbezogene vertikale Schwerpunkte halten Gutshaus/Handelsstraße, Prärie/Planwagen, Karawanserei/Kamele, Jadebrücke/Schiff und Winterhandelsposten/Schlitten im Ausschnitt. Keine neuen Bilddateien, kein natives Modul.

Der Titel sitzt nun am oberen Kartenrand, mit Schriftgröße 17 statt 21 und Gewicht 600 statt 700. Der Hintergrund hat 40 % statt 72 % Deckkraft; eine leichte Textschattierung erhält die Lesbarkeit. Sperrhinweise stehen im selben Streifen. Kartenhöhe 200 px, bisherige Breite, Kunden-/Prozentfußbereich und sämtliche Spielregeln bleiben erhalten.

Validierung: Typprüfung, 107 Tests und Androidexport erfolgreich. Neue Regressionstests laden die tatsächliche Kartenkomponente und prüfen die von ihr erzeugten Bildstyles nach Androids Quellmaß-Vorgaben, deckende/proportionale Ausschnitte und fehlende Layoutmaße. Zusätzlich wurde React Natives mitgelieferte native Yoga-C++-Engine kompiliert: Der bisherige Zoom ließ sich reproduzieren, die 20 neuen Bildrahmen (5 Regionen × 320/360/390/430 px) wurden erfolgreich geprüft. Keine Geräte-/Emulatorprüfung; die native Kontrolle betrifft die Layout-Engine. Visuelle Browserprüfung derselben Bildschirmbreiten: passende Landschaftsausschnitte, Titelposition, unveränderte Kartenmaße, Sperren, Navigation und Englisch, ohne JavaScript-Fehler.

Vorbereitet, noch nicht veröffentlicht.
