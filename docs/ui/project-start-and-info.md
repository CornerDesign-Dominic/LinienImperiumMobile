# Großaufträge: Informationen und Start

Jede Kategorienkarte hat eine eigene 44-dp-Fragezeichenaktion. Sie öffnet eine kompakte Information mit den tatsächlichen Beutearten/-chancen sowie der tatsächlichen Herkunft aus dem Serverkatalog. Ein Tippen auf eine leere Kategorie öffnet ebenfalls diese Information statt einer langen leeren Auftragsseite.

Bei einem vorhandenen Auftrag öffnet die Karte eine Startbestätigung. Umfang, Strecke und Frist stammen vom konkreten Auftrag. Der Spieler muss eine nicht leere Flotte wählen und anschließend „Auftrag starten“ bestätigen. X/Android-Zurück verwirft den Dialog ohne Command. Eine lokale Sperre verhindert doppelte Startanforderungen; Fehler bleiben im Dialog sichtbar. Erst ein vom Server als aktiv bestätigter Auftrag öffnet seine laufende Detailansicht.

Der abgeschlossene Kategorienverlauf entfällt. Laufende Aufträge und noch abzuholende Abschlussprämien bleiben unverändert zugänglich. Die Statistikaggregation erfolgt separat auf dem Server und verändert diesen Startablauf nicht.

Die aktuellen Edelwarenbilder und die schlichte Regionsbeschriftung bleiben erhalten. Das Fragezeichen startet keinen Auftrag und konsumiert keinen Vorrat.

Prüfung: zwei Kategorie-/Startablauftests sowie TypeScript. Die vorhandene Android-Exportprüfung des parallel erstellten Edelwarenpakets lief mit diesem lokalen Projects-Code erfolgreich. Keine native Geräte- oder visuelle Touchprüfung verfügbar.
