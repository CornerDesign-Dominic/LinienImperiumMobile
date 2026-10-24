# Einzelaufträge: Reiter und Fahrzeugwahl

## Übersicht

Drei Reiter: Laufende, Angebote, Aufträge. Angebote ist die erste Auswahl; bei einer Rückkehr aus den Details bleibt der Reiter erhalten. Alte Einstiege aus Vorräten navigieren zum Reiter Aufträge. Dort bleiben die bisherigen Auftragsgruppen und gestapelten Expeditionsaufträge verfügbar. Zurück geht innerhalb einer Gruppe zuerst zur Gruppenübersicht.

Laufende enthält aktive Einzelaufträge und aktive Endlos-Expeditionsaufträge. Fertige, noch nicht abgeholte Einzelaufträge und der gemeinsame Button Belohnungen abholen stehen oben. Ein Belohnungssymbol mit Anzahl am Reiter bleibt auch von den anderen Reitern aus sichtbar. Angebotswechsel und Countdown befinden sich ausschließlich bei Angebote.

## Fahrzeugwahl

Die Auftragsdetails enthalten einen Button Fahrzeug wählen und kompakte Belohnungsicons mit Erklärung beim Antippen. Ein Modal zeigt geeignete Garagenfahrzeuge als Dreispalten-Kartenraster mit römischer Kartenstufe, Bild und Namen. Die normalen Fahrzeugwerte sind durch Touren, Gesamtdauer und Gesamtgewinn dieses Auftrags ersetzt.

Keine Vorauswahl. Antippen markiert nur die Karte. Erst danach erscheint am unteren Modalrand ein schwebender Startbereich mit ausgewähltem Fahrzeug, Dauer, Gewinn und Auftrag starten. Der Bereich bleibt beim Scrollen sichtbar; die Liste erhält entsprechenden unteren Abstand. Auswahl und Sortierung bleiben vor dem Start änderbar. Ein Seltenheitswechsel entfernt die Auswahl, damit kein unsichtbares Fahrzeug gestartet wird. Schließen und erneutes Öffnen beginnt ohne Auswahl.

Die Sortierung hat zwei dauerhaft sichtbare Buttons nebeneinander: Gewinn und Geschwindigkeit. Genau einer ist aktiv und farbig gefüllt, beim Öffnen ist es Gewinn. Ein Tipp wechselt unmittelbar, ohne Dropdown oder weitere Auswahl; erneutes Antippen des aktiven Buttons deaktiviert ihn nicht. Die gewählte Fahrzeugkarte bleibt beim Sortieren erhalten. Standard: Gewinn absteigend; alternativ Geschwindigkeit nach kürzester Gesamtdauer inklusive aller benötigten Touren. Belegte Fahrzeuge stehen bei beiden Sortierungen zuletzt, sichtbar abgedunkelt und tatsächlich deaktiviert. Frei in zeigt den sekündlich aktualisierten Countdown. Nach Ablauf bleibt das Fahrzeug gesperrt, bis der Server es als frei bestätigt. Bei fortlaufender bzw. gruppierter Beschaffung ohne eindeutige individuelle Endzeit steht In Beschaffung statt eines irreführenden Countdowns zur nächsten Tour. Reservierte Ersatzfahrzeuge bleiben bis zum Ende ihrer geplanten Zuteilung gesperrt; das bisherige Fahrzeug wird nach seiner laufenden Tour frei.

Die Serveransicht liefert vehicleChoices inklusive geeigneter belegter Fahrzeuge; die bisherigen choices enthalten für ältere Clients weiterhin nur freie Fahrzeuge. Sämtliche normalen Auftragszahlen stammen aus denselben Dauer-/Ertragsfunktionen wie der tatsächliche Start. jobChoices liefert dieselben Werte für gespeicherte Expeditionsaufträge einschließlich der vorhandenen 15-Sekunden-Testbegrenzung und des dort geltenden Münzertrags. Es werden keine Preise oder Zeiten vom Client an den Server übergeben.

Auftrag starten sendet den bestehenden passenden Befehl assign, assignPrivate, assignCrafted oder mission. Ein lokaler Sperrverweis und deaktivierte Bedienelemente verhindern Doppelstarts. Nur bestätigte Starts schließen das Modal und wechseln zu Laufende; bei Fehlern bleibt eine erneute Auswahl bzw. ein erneuter Versuch möglich. Die Zuweisungsprüfung auf dem Server bleibt maßgeblich.

## Verifikation

- Typprüfung und alle 183 Tests erfolgreich. Sechs neue Tests prüfen Sortierung, Kompatibilität der freien choices, Anzeige belegter Fahrzeuge, reale Dauer-/Gewinnübereinstimmung beim Start, gespeicherte Missionen, Reservierungen und Beschaffungszeiten.
- Android-Export erfolgreich.
- Reale App mit lokalem Testserver: 320/390/430 px, alle Reiter, Sammelabholung, Angebote, Fahrzeugwahl ohne Start, Auswahlwechsel, schwebender Start, Sortierungen, Filter, Live-Countdown, Fehler und erneuter Versuch, Doppelklickschutz und Materialaufträge.
- Privatabholungen, hergestellte Kundenaufträge, leere Garage, ausschließlich belegte Fahrzeuge und englische Oberfläche zusätzlich geprüft. Keine Browserlaufzeitfehler. Screenshots von Übersicht, Details und Auswahl visuell geprüft.
- Kein physischer Gerätetest. Veröffentlichung ausdrücklich beauftragt.

Nachträgliche Anpassung der Sortierbuttons: Typprüfung, zehn betroffene Sortier-/Server-/Übersetzungsprüfungen und Android-Export erfolgreich. Browser bei 320/390/430 px sowie Englisch geprüft: beide Buttons nebeneinander, exklusive Auswahl, echte Kartenreihenfolge, erhaltene Fahrzeugauswahl und Standard beim erneuten Öffnen. Diese Änderung ist zunächst nur gesammelt.
