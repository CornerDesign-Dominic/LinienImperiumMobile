# Kompakte Flotte und Fahrzeugauswahl – noch nicht veröffentlicht

- Fünf volle, schmale Platzkarten statt der bisherigen hohen Karten mit permanenten Entfernen-/Auswahlbuttons. Platznummer, Fahrzeugicon, Name und Bonus bleiben direkt sichtbar.
- Antippen eines freien Platzes öffnet direkt die Fahrzeugauswahl. Antippen eines belegten Platzes öffnet ein Modal mit Fahrzeugdaten, Bonus/Geltungsbereich sowie Wechseln und Entfernen. Wechseln öffnet im selben Modal das Raster.
- Auswahl mit drei festen Spalten und beliebig vielen scrollbaren Zeilen, gemeinsam mit der Sammlung gerendert. Nur eigene Fahrzeugkarten stehen zur Wahl. Stufe, Geschwindigkeitsrang, tatsächliche Kapazität und Seltenheitsfarbe werden angezeigt.
- Bereits in der gewählten Flotte enthaltene Fahrzeuge sind mit Haken und Platznummer markiert. Das Fahrzeug des bearbeiteten Platzes ist zusätzlich hervorgehoben. Die Auswahl eines anderen bereits eingesetzten Fahrzeugs verschiebt es gemäß der bestehenden Serverregel; keine Duplikate. Dasselbe Fahrzeug darf weiterhin in anderen Flottenvorlagen stehen.
- Bestätigtes Speichern schließt das Modal; bei Fehler bleibt es mit einem Hinweis zur Wiederholung geöffnet. Abbrechen verändert die Flotte nicht. Laufende Touren und bestehende Serverregeln unverändert.
- Gemeinsames Kartenraster verhindert bei einer unvollständigen letzten Zeile verbreiterte Kacheln und hält die Namen auf schmalen Displays innerhalb des Bildbereichs.
- Deutsche und englische Texte ergänzt.

Geprüft: TypeScript und Androidexport erfolgreich, 70 bestehende Tests bestanden. Offline-Browserprüfung der tatsächlichen React-Native-Komponenten mit kontrollierten Serverantworten bei 320/360/390/430 px: fünf Platzkarten mit jeweils höchstens 70 px Höhe, keine permanenten Entfernen-/Auswahlbuttons, Hinzufügen und Wechseln als Raster mit exakt drei Spalten, vollständige/unvollständige Zeilen, korrektes Ziel für jede Auswahl, Markierungen nur für die gewählte Flotte, Auswahl des unveränderten Fahrzeugs ohne Schreibaufruf, Entfernen, Fehler beim Zuweisen und Entfernen mit anschließend erfolgreicher Wiederholung sowie englische Anzeige. Keine JavaScript-Fehler. Kein Deployment ausgelöst.
