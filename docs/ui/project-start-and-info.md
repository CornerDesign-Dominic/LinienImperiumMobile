# Großaufträge: Informationen und Start

Jede Kategorienkarte hat eine eigene 44-dp-Fragezeichenaktion. Sie öffnet eine kompakte Information mit den tatsächlichen Beutearten/-chancen sowie der tatsächlichen Herkunft aus dem Serverkatalog. Ein Tippen auf eine leere Kategorie öffnet ebenfalls diese Information statt einer langen leeren Auftragsseite.

Bei einem vorhandenen Auftrag öffnet die Karte eine Startbestätigung. Umfang, Strecke und Frist stammen vom konkreten Auftrag. Der Spieler muss eine nicht leere Flotte wählen und anschließend „Auftrag starten“ bestätigen. X/Android-Zurück verwirft den Dialog ohne Command. Eine lokale Sperre verhindert doppelte Startanforderungen; Fehler bleiben im Dialog sichtbar. Erst ein vom Server als aktiv bestätigter Auftrag öffnet seine laufende Detailansicht.

Der abgeschlossene Kategorienverlauf entfällt. Laufende Aufträge und noch abzuholende Abschlussprämien liegen im Reiter Laufende der Großauftragsseite; die Zahl am Reiter zählt nur aktive Transporte. Die Statistikaggregation erfolgt separat auf dem Server und verändert diesen Startablauf nicht.

Kategorie-, Hilfe-, Start- und Detailansichten verwenden dieselben kundenbezogenen [Sonderauftragstitel](project-category-overview.md), auch bei Altaufträgen. Die aktuellen Edelwarenbilder und die schlichte Regionsbeschriftung bleiben erhalten. Das Fragezeichen startet keinen Auftrag und konsumiert keinen Vorrat.

Prüfung: zwei Kategorie-/Startablauftests sowie TypeScript. Die vorhandene Android-Exportprüfung des parallel erstellten Edelwarenpakets lief mit diesem lokalen Projects-Code erfolgreich. Keine native Geräte- oder visuelle Touchprüfung verfügbar.

## Laufende Detailansicht (gesammelt, nicht veröffentlicht)

Alle regionalen Sonderaufträge und der Empfehlungsauftrag verwenden die gemeinsame Detaildarstellung. Der reine Auftragsname steht als petrolfarbener Titelbalken mit Messingkontur oberhalb des bestehenden Szenenbilds. Direkt unter dem Bild folgen die gelieferte/gesamte Tonnenmenge und ein daraus berechneter Fortschrittsbalken; Auftragstyp und Name werden dort nicht wiederholt. Frist und verbleibende Flottenzeit bleiben darunter sichtbar.

Die eingesetzte Flotte erscheint als petrolfarbenes, messingumrandetes Flottenabzeichen. Jede Fahrzeug-/Tourzeile beginnt mit dem passenden Fahrzeugbild aus dem Kartenkatalog, danach folgen Name, Tourzeit, Ankunftsmenge und gegebenenfalls der bereits vorhandene Wechselhinweis. Fehlende historische Kartenreferenzen erhalten die vorhandene neutrale Fahrzeugdarstellung.

In der ausführlichen Information entfällt der Start-/Mindestkartenhinweis. Die zweite Karte heißt **Möglicher Fund** und zeigt ausschließlich die möglichen Gegenstände als Bilder: Zahnräder der angebotenen Seltenheiten, Kapazitätsmodul und Hermes-Siegel, sofern im Katalog vorgesehen. Es stehen maximal fünf Bilder pro Zeile. Mengen und Fundchancen sind dort nicht sichtbar; die Symbole besitzen für Screenreader Namen. Die Herkunftsangaben bleiben erhalten, die Weiterleitungsbuttons zu Expedition und Stammkunden entfallen.

Die Kategorie-Kurzinfo, Startbestätigung, Spielregeln, Fahrzeugzuordnung und Belohnungsauszahlung werden dadurch nicht verändert. Die separate Bereinigung der abgeschlossenen Lieferscheine aus PR #17 bleibt enthalten. Zwei zusätzliche Darstellungstests prüfen alle sechs Katalogvarianten auf Fundraster, Titel, Fortschrittsverhältnis und passende Fahrzeugbilder. Keine physische Gerätedarstellung geprüft.
