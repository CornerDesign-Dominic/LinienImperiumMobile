# Fahrzeugkarten: unnötige Aktualisierungen vermeiden

## Befund

`Game` aktualisiert `clock` jede Sekunde für die sichtbaren Countdown-Anzeigen. Die Fahrzeugkartensammlung hat keinen eigenen Countdown, wurde vorher aber bei jedem dieser Durchläufe vollständig erneut ausgewertet: `VehicleCards` war nicht memoisiert und `onOpen` war eine neue Inline-Funktion. Die Sammlung erzeugt je offener Gruppe alle Karten mit Bildfacetten, Namensfeldern, Stufenschild, Rangsegmenten und Werten. Bei 25 sichtbaren Karten bedeuteten zehn reine Uhraktualisierungen 250 unnötige erneute Tile-Auswertungen zusätzlich zur ersten Darstellung. Das ist eine aus dem React-Aufrufpfad belegbare JS-Arbeitslast; daraus wird keine gemessene Android-Bildrate abgeleitet.

Die Sammlungsbilder sind weiterhin 25 lokale JPEGs mit jeweils 1024 × 1024 Pixeln. Initiales Decodieren und das native Zeichnen der facettierten Bilder können zusätzlich belasten. Ohne Geräteprofiling lässt sich deren Anteil nicht zuverlässig beziffern; deshalb wurden weder Bilder noch der bewährte Facettenaufbau vorsorglich verändert.

## Änderung

Die Sammlung ist mit `React.memo` gegen unveränderte Props abgeschirmt. Die Navigation und der Handler zum Öffnen einer Karte verwenden stabile `useCallback`-Referenzen. Reine Uhr-, Busy- und Meldungsänderungen in `Game` aktualisieren dadurch nur die tatsächlich davon abhängigen Bereiche statt nochmals alle Sammlungskarten.

Eine neue Serverantwort erneuert `data` weiterhin und aktualisiert die Sammlung. Filter- und Gruppenwechsel behalten ihre lokalen Zustandsänderungen. Die Sammlung abonniert den Sprachkontext ausdrücklich, damit auch Beschriftungen und Accessibility-Texte bei Sprachwechsel neu entstehen. Die Handler-Abhängigkeit von `screen` verhindert einen veralteten Navigationsverlauf beim Öffnen der Details.

Der parallele Material-Rollout memoisiert die statischen Materialbilder und erzeugt keine dekorativen Ebenen für ungefärbte Layout-Views. Bilder und Seltenheitsfacetten bleiben ausgespart.

## Prüfgrenze

TypeScript sowie die gemeinsamen Tests und der Android-Export prüfen Integration und Verhalten. Die tatsächliche Scroll-Bildrate und der native Bildspeicher müssen auf dem Android-Gerät beurteilt werden; in dieser Umgebung steht kein ausführbarer Browser oder Android-Emulator bereit. Es wird kein gemessener FPS-Gewinn behauptet.
