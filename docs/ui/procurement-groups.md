# Beschaffung mit gemeinsamem Tourenvorrat

Status: vorbereitet, noch nicht veröffentlicht.

## Oberfläche
Startmodal: Fahrzeugkacheln mit Kapazität und effektivem Tempo, gestrichelte Plus-Kachel gleicher Größe, nur freie Fahrzeuge zur Auswahl. Mehrere Fahrzeuge auswählbar, vor Start per Antippen wieder entfernbar.
Kleineres Eingabefeld mit Max für feste Tourenzahl bzw. +10.000 für Reserve. Manuelle Eingabe bleibt erhalten. Max gilt für den gesamten Tourenvorrat, nicht je Fahrzeug; Obergrenze weiterhin 100.000 Touren. Reserve-Schnellbutton erhöht um 10.000 bis zur bestehenden Grenze von 1 Milliarde.
Nur der Münzbestand bleibt als Zusammenfassung im Startmodal. Erläuterungen auf der Seite unter Hinweise, keine Kosten-/Maximalzahl-/Dauer-Textblöcke mehr im Dialog.
Laufende Gruppen zeigen gemeinsamen Fortschritt und pro noch aktivem Fahrzeug einen eigenen Balken und Countdown. Bereits ausgeschiedene Fahrzeuge verschwinden aus dieser aktiven Gruppe und sind unabhängig von den übrigen Mitgliedern wieder frei.

## Gemeinsame Disposition
Neue Aktionen procurementGroupStart und procurementGroupStop; alte Einzelaktionen und bestehende Spielstände bleiben kompatibel.
Alle gewählten Fahrzeuge ziehen aus einem gemeinsamen Pool. Feste Zahl: genau N Touren für die gesamte Gruppe, einmal N × Regionspreis hinterlegt. Fahrzeuge bekommen beim Start je eine verfügbare Tour; schnellere Rückkehrer übernehmen weitere. Mehr gewählte Fahrzeuge als Touren erzeugen keine zusätzlichen Fahrten.
Reserve: gemeinsamer Kontostand und eine Reservegrenze. Jede neue Fahrzeugtour wird einmal bei Abfahrt bezahlt. Bei fehlendem Budget verlässt dieses Fahrzeug die Gruppe dauerhaft, wird frei und startet auch bei späterem Einkommen nicht automatisch wieder. Noch aktive Mitglieder können bei ihrer eigenen Rückkehr weiterhin starten, wenn dann genug Geld vorhanden ist.
Zeitgleiche Ankünfte werden seriell auf dem Server verbucht, Einkommen wie bisher vor neuen Abfahrten. Kein Unterschreiten der Reserve durch parallele Starts.
Nach laufenden Touren beenden: alle bereits gestarteten Fahrten liefern ab; nur ungestartetes Guthaben wird nach der letzten Rückkehr erstattet. Sofort abbrechen: aktuelle Fahrten ohne Belohnung beendet, ungestartetes Gruppenguthaben einmal erstattet. Bestehende Anfragebelege verhindern doppelte Verarbeitung.
Garagenexklusivität bleibt pro Fahrzeug, Flotteneinsätze parallel erlaubt. Individuelle Touren frieren ihre Laufzeit weiterhin ein; neue Touren lesen aktuelle Werte.
Alle abgeschlossenen Touren nutzen dieselben bisherigen Lootchancen und permanenten Gesamt-/Regionszähler. Neu: Gruppenhistorie hält aktive und die letzten 20 abgeschlossenen Gruppen; Zähler und Belohnungen werden dadurch nicht gelöscht.

## Prüfungen
96 Rechen-/Backendtests bestanden:
node --test --test-reporter=dot tests/fleet-details.test.cjs tests/gifts.test.cjs tests/mobile-engine.test.cjs tests/events.test.cjs tests/tour-updates.test.cjs tests/procurement.test.cjs tests/procurement-groups.test.cjs

Neun neue Gruppentests: exakt zehn gemeinsame Touren und einmaliger Einsatz; frühe Einzelfreigabe; mehr Fahrzeuge als Touren; schnellere Fahrzeuge; gemeinsames Reservebudget und kein Wiederbeitritt; Sofortabbruch und Erstattung; Ende nach allen aktuellen Fahrten; konkurrierende Gruppen/gleichzeitige Ankünfte; invalidierte Auswahl, Exklusivität und parallele Flotten; Offline-Abgleich mit häufigem Sync sowie alte Einzelaufträge.
Kein vollständiger TypeScript-/Expo-Build, keine visuelle Browserprüfung und kein Gerätetest in dieser Vorbereitung.
