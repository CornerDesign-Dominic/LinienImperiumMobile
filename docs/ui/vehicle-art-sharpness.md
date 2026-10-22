# Fahrzeugbilder: Auflösung und große Anzeige

Prüfung am 22.10.2026. Sammelbranch `batch/company-improvements`, nicht veröffentlicht.

## Befund

Alle 25 eingebundenen Fahrzeug-JPEGs haben 1024 × 1024 Pixel (ca. 299–405 KB). Das Original des Eselkarrens wurde visuell geprüft und enthält deutlich mehr Details als der gezeigte Handy-Screenshot. Die Dateien müssen für die bestehende große Detailansicht voraussichtlich nicht neu erzeugt werden. Beispiel bei dreifacher Pixeldichte: 308 Layout-Einheiten Bildbreite entsprechen 924 Gerätepixeln und liegen innerhalb der 1024 Pixel der Quelle. Sehr große Ansichten oder zusätzliche Vergrößerung können diese Grenze überschreiten.

Die große und kleine Anzeige verwenden dieselbe statisch eingebundene Originaldatei; es gibt keine separate kleine Thumbnaildatei, keinen serverseitigen Thumbnaildienst und keinen neuen Bilddownload im Code.

Mögliche zusätzliche Unschärfe entsteht im nativen Bild-/Skalierungspfad. Der bisherige Code montierte das Bild zunächst bei einer angenommenen Breite von 80, bevor onLayout die eigentliche Breite lieferte. Zudem kann React Native auf Android im Standardmodus auto lokale Dateien vorab verkleinern. Die lokale React-Native-Implementierung ReactImageView.kt bestätigt diese Auswahl für lokale Datei-/Content-URIs. Der Umfang dieses Effekts auf dem Nutzergerät wurde nicht direkt gemessen; auch die verschachtelte Facettenmaskierung kann die native Darstellung beeinflussen. Deshalb ist dies keine abschließend nachgewiesene Ursache.

## Kleine Darstellungsanpassung

- Bild erst nach der tatsächlichen Layoutmessung montieren; kein erster Bildrequest in angenommener Thumbnailgröße.
- In großen Ansichten explizit resizeMethod=scale verwenden, um automatisches Software-Resizing für lokale Bilder zu vermeiden.
- Bei Größenwechseln die Bildinstanz mit der neuen Zielgröße neu montieren.
- Bestehende Bilddateien, Auflösung, Bildausschnitt, Facettenrahmen und Spielwerte beibehalten. Keine Bildgenerierung und kein künstliches Hochskalieren der Quelldateien.

## Prüfung und Grenze

Typprüfung und 13 Transportkartentests erfolgreich. Kleine und große Bildansicht im Browser bei dreifacher Pixeldichte geprüft: beide laden das 1024-Pixel-Original, große Bildfläche 924 Gerätepixel, keine Laufzeitfehler oder seitlicher Überlauf. Screenshot visuell geprüft. Android-Export erfolgreich.

Die Browserprüfung beweist keine native Android-Schärfe. Die endgültige Wirkung muss nach der gemeinsamen Veröffentlichung auf dem tatsächlichen Handy geprüft werden. Die Änderung ist ausschließlich gesammelt, ohne Deployment/EAS Update.
