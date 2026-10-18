## Folgepaket vom 18.10.2026 – noch nicht veröffentlicht

- Großauftragskarten zeigen immer „Aufträge X“: nur startbereiter Vorrat, keine laufenden oder abgeschlossenen Instanzen.
- Sonderaufträge blau (Rare), Empfehlungsaufträge violett (Epic), auch in Einzelkarten der Listen.
- Katalog: fünf kundenspezifische Sonderaufträge und ein gemeinsamer Empfehlungsauftrag „Großprojekt Hafenverbund“. Neue und noch nicht gestartete Empfehlungen: 1.100 t, 240 km, 3 Stunden, Regionalverkehr. Herkunft/Kunde und Fundchancen bleiben erhalten; alle Vorräte laufen unter einem Typ zusammen. Laufende/abgeschlossene Altaufträge behalten ihre bisherigen Werte und Belohnungen.
- Fund-Popup als mittiges Modal mit Außenabstand, begrenzter Breite und direktem Zuweisungsbutton. Fahrzeug-/Flottenauswahl bleibt erreichbar. Lange Titel teilen sich den Kopfbereich mit dem Schließenbutton ohne Überlauf.
- Nur Sammelbranch; kein Server-Deployment oder Handy-Update.

---

> Das hier dokumentierte Sammelpaket wurde am 17.10.2026 veröffentlicht.
> Release: da32f0701ef91f4aed77297f15e67ceda816263a · Actions 39066168191.
> Frühere Hinweise „nur vorbereitet“ beschreiben den Stand vor dieser Veröffentlichung.

# Gesammeltes Mobile-Update

Branch: `batch/mobile-adjustments`. Das Gesamtpaket wurde am 17.10.2026 gemeinsam veröffentlicht; Status siehe `TEST_REPORT.md`.
Änderungen werden gesammelt und erst nach ausdrücklicher Freigabe gemeinsam veröffentlicht.

## Umgesetzt und lokal geprüft

- Firebase-Transportfehler `functions/internal` mit HTTP-Status `[0]`: einmalige Wiederholung nach 400 ms unter Beibehaltung der Anfragekennung. Bei anhaltendem Fehler verständliche Verbindungsmeldung; echte Serverfehler werden nicht als Verbindungsfehler umgedeutet.
- Angebotskarten mit hellerem Hintergrund, stärkerem Rahmen/Farbrand, abgetrennten Metadaten und eigenem Mengen-/Streckenbereich.
- Bei fehlender Auswahl unterscheidet die Anzeige zwischen fehlendem passendem Fahrzeug und einem bereits eingesetzten passenden Fahrzeug.
- Regressionstest für automatischen Angebotswechsel inklusive Fristgrenze, angeheftetem Angebot, laufendem Transport und Offline-Nachholung.

- Expeditionsübersicht mit fünf Regionskarten, Kunden und Fortschritt, gesperrte Karten ohne Zugriff.
- Pro Region sieben Ortskarten und unten die Endloskarte, jeweils mit Fortschritt und kontextabhängiger Aktion.
- Testwerkzeuge: +100 Expeditionspunkte, +100 Überstundenpunkte, +100 / +1.000 XP inklusive regulärer Levelbelohnungen.

## Diagnose und Verifikation

Im installierten Firebase-SDK liefert ein fehlgeschlagener Fetch Status 0 und `internal [0]`. Zum gemeldeten Zeitpunkt wurde kein passender Functions-/Cloud-Run-Serverfehler gefunden. Der ursprüngliche Verbindungsabbruch selbst ist damit nicht als dauerhaft beseitigt bewiesen. Im UI-Test wird ein solcher Fehler injiziert und die automatische Wiederholung geprüft.

`npm run typecheck` und alle Spieltests bestehen. Der bestehende automatische Angebotswechsel ließ sich lokal ohne Ausnahme ausführen. Keine neuen Balancingwerte wurden gesetzt.

## Noch zu besprechen: Startangebote

Der Kurierwagen fährt 4 t je Tour und kann Regionalverkehr bedienen. Größere Gesamtmengen sind über mehrere Touren möglich. Fernverkehr braucht eine passende Fahrzeugkarte. Ein Fahrzeug kann außerdem für eine Expeditionsmission belegt sein, auch wenn keine Einzelaufträge laufen.

Vorschlag, noch nicht beschlossen: zunächst fünf Regionalangebote, davon drei kurze (4–8 t, 10–25 km) und zwei längere (8–16 t, 25–50 km). Fernverkehr erst bei Besitz einer dafür passenden Karte. Freigaben nach verfügbaren Fahrzeugklassen, nicht nach momentanem Frei-/Belegtstatus.

## Veröffentlichungssperre

`main` enthält eine Sicherung im Workflow: Firebase-Deployment und EAS Update laufen nur bei `workflow_dispatch` oder einem Commit mit `[publish-preview]`. Die Diagnose-Workflows lesen ausschließlich Protokolle. Beim Sammeln weder einen Veröffentlichungsmarker verwenden noch die manuellen Update-Workflows starten.

## Neues Paket – vorbereitet, noch nicht veröffentlicht

- Endlosexpedition: Fund-Popup für Karte/Shard oder Auftrag, direkte Zuweisung. Garagenauftrag bleibt in der Expedition; gestarteter Großauftrag öffnet seine Detailseite.
- Gefundene, laufende und abgeschlossene Karten-/Materialaufträge liegen unter Home → Expeditionsaufträge, nicht mehr auf der Regionsseite. Großaufträge bleiben unter Großaufträge.
- Wiederholte Draw-Anfrage liefert denselben Fund aus dem Command-Beleg, ohne erneut Punkte auszugeben.
- Vorübergehend alle Expeditionslieferungen (Orte, Kunde, Karten/Material) 15 Sekunden. Bestehende aktive Missionen werden einmalig verkürzt; danach kein Timer-Neustart. Rückstellung: `EXPEDITION_TEST_DURATION_MS` in `functions/src/engine.cjs` auf `null` setzen. Originalwerte im unveränderten Vendor bleiben erhalten. Bereits im Test gestartete Missionen behalten ihre Testdauer.
- Levelaufstieg: 3 statt 5 dauerhafte Kapazitätspunkte, getrennte Plus-/Minus-Auswahl mit Vorschau des neuen Maximums. Bestätigung erst bei vollständiger Verteilung. Bereits bestätigte Punkte bleiben erhalten; noch offene Level erhalten 3 Punkte. 100-Token-Refill und sonstige Levelbelohnungen unverändert.

### Firmenseite und Transportausbau

- Gemeinsame Karte für Regional-/Fernverkehr oben, Abteilungen darunter. Doppelter Münz-/Itembestand auf der Übersicht entfernt.
- Eigene Seite „Transport verbessern“ mit Itembestand und Verlinkung auf „Herstellen“. Die Bezugswege der Firmenausbau-Items stehen im Vorräte-Detail; ein neues Herstellrezept wurde nicht eingeführt.
- Mehrere Stufen in beiden Segmenten per +/− vormerken, Effekt und Gesamtkosten sehen, mit einem Speichern übernehmen. Auswahl bleibt beim Besuch von „Herstellen“ erhalten.
- Ein serverseitiger Batch validiert Stufen, Grenzen und gemeinsame Gesamtkosten, bevor Ressourcen abgezogen werden. Veraltete Auswahl, doppelte Einträge und fehlende Ressourcen brechen vollständig ab. Bestehende Einzelupgrade-Aktion bleibt für die installierte App verfügbar.
- Keine Veröffentlichung; nur Sammelbranch.

### Vorräte als Inventar

- Drei Karten je Zeile, quadratischer Bildplatzhalter, kurzer Itemname und Anzahl. Nur positive Bestände; leeres Inventar erhält einen kurzen Leerzustand.
- Antippen öffnet Details mit aktuellem Bestand, Nutzen, Herkunft und bestehenden Rezepten. Refill direkt benutzen; andere verwendbare Materialien führen zur passenden Garage/Kartensammlung/Firma/Stadthub-Auswahl. Kein Material wird allein beim Navigieren verbraucht.
- Herstellungslink bei Zutaten bzw. kombinierbaren Shards. Keine neuen Rezepte oder Items eingeführt. Kartenbilder bleiben Platzhalter.
- Nach Verbrauch des letzten Refills zeigt das geöffnete Detail 0, sperrt erneutes Benutzen und entfernt die Karte aus dem Raster. Gefundene Aufträge bleiben auf ihren eigenen Seiten.
- Weiterhin nur vorbereitet, keine Veröffentlichung.

### Herstellungsseite

- Vier vorhandene Rezepte als einzelne Prozesszeilen: Zutat mit Platzhalter und benötigter Menge → Ergebnis mit Platzhalter und Ausgabemenge. Jeweils darunter „Herstellung“.
- Rezepte: 100 Abholhinweise → 1 Privatabholung; 10 Firmen-Items → 1 Kundenauftrag; 10 Common-Shards → 1 Uncommon-Shard; 10 Uncommon-Shards → 1 Rare-Shard.
- Bestand klein direkt an der Zutat; bei fehlendem freigeschaltetem Stammkunden kurzer Sperrhinweis. Fehlende Zutaten und laufende Aktionen sperren den Button.
- Kein allgemeiner Erklärblock vor den Rezepten. Herkunft bleibt im Vorräte-Detail. Bestehende Herstellungskosten und Aktionen unverändert.
- Nur vorbereitet, keine Veröffentlichung.

### Stammkunden

- Übersicht bleibt bei einer Card pro freigeschaltetem Kunden. Nur Name, Branche, Level und Beziehungsfortschritt; keine direkten Aufwertungen.
- Antippen öffnet die eigene Kundendetailseite. Dort Beziehung, Fähigkeiten/Bonis und verfügbare Punkte sowie Ware, Verkehr und Expeditionsregion.
- Bestehende Fähigkeitspunkte werden ausschließlich auf der Detailseite verteilt. Keine Änderungen an Freischaltung, Kosten oder Limits.
- Zurück führt zur Übersicht; Kundenwechsel übernimmt jeweils die passenden Daten. Weiterhin nur vorbereitet.

### Händlerzugang

- Händler aus dem Hauptmenü entfernt; bestehende Zugänge (insbesondere Stadthub) unverändert. Umbenennung wartet auf die gewünschte Bezeichnung und eindeutige Zuordnung (Händler/Stadthub). Nur vorbereitet.

### Statistik

- Kompakte gemeinsame Liste: kurze Bezeichnung links, Zahlen samt Einheiten rechtsbündig. Dezimalstellen nach Bedarf, feste Ziffernbreiten.
- Bisherige Kennzahlen und CO₂-Schätzung bleiben erhalten; Ereignisprotokoll aus der Statistik entfernt. Die letzten Ereignisse sind auch von der Startseite entfernt. Gespeicherte Ereignisse bleiben erhalten.
- Nur vorbereitet, keine Veröffentlichung.

### Einzelaufträge und gespeicherte Aufträge

- Schmale hervorgehobene Zählkarte für laufende Einzelaufträge, dahinter eigene Liste mit kompakten Karten, LKW, Restzeit und animierungsfrei berechnetem Zeit-/Lieferfortschritt. Antippen öffnet Auftragsdetails.
- Darunter Karte „Aufträge aus Vorräten“ mit Anzahl, noch vor Countdown/Angebotswechsel. Eigene Seite zeigt nur verfügbare gespeicherte Einzelaufträge (Privatabholungen/Kundenaufträge), keine laufenden Aufträge. Nach Start Wechsel zur gemeinsamen laufenden Liste.
- Börsenplätze-/Haltbar-Hinweis entfernt. Countdown und Angebotswechsel nebeneinander. Angebote kompakt und antippbar; Fahrzeugwahl und Start nur in der Detailseite. Fehlende/belegte geeignete LKW als Text statt deaktiviertem Startbutton.
- Details: aktuelle Fahrzeugwerte, Münz-/XP-Prognose, Abschlussprämie, mögliche Beute/Beziehung; abgeschlossene Aufträge zeigen echte ausgewürfelte Prämien zum Abholen. Server berechnet Prognosen ohne Zufallsbeute vorab zu rollen.
- Auto-Sync am erwarteten Ende eines Einzelauftrags ergänzt. Laufzeiten und Auftragsbelohnungen selbst unverändert. Nur vorbereitet, keine Veröffentlichung.

### Großaufträge

- Hauptseite zeigt oben die hervorgehobene Navigation zu laufenden Großaufträgen, darunter dauerhaft alle zehn vorhandenen Varianten (Sonder-/Empfehlungsauftrag je Region). Katalog zeigt bereits gefundene startbereite Aufträge pro Variante; Anzeigen erzeugt keine Aufträge.
- Eigene Typseite mit Umfang, Frist ab Start, Belohnungen/Beutechancen, Fundchancen aus Endlosexpedition bzw. Kunden-/Sonderauftrag und Mindestvoraussetzung der Flotte. Verfügbare echte Aufträge sind dort einzeln auswählbar. Abgeschlossene/gescheiterte Aufträge bleiben über den Typ erreichbar.
- Laufende Großaufträge in eigener Liste. Detail: oben Fortschritt, Frist links und Restdauer der gespeicherten Flotte rechts; darunter Bildplatzhalter, Überstundenbutton und eingesetzte Flotte. Weitere Infos aufklappbar. Überstundenoptionen im Popup; bestehende 1.000-tkm-Regel unverändert.
- Navigation zum gesperrten Expeditions-Fundort führt zur Regionsübersicht. Frist/ETA lösen rechtzeitig Sync aus. Keine Änderung von Auftragserzeugung, Belohnungen, Laufzeiten oder Flottensnapshots.

### Gebündelte Einzelauftragsprämien

- Oberer Button sammelt alle fertigen Einzelaufträge und listet den tatsächlich erhaltenen Loot im Popup. Auch in der laufenden Einzelauftragsliste verfügbar.
- Neue serverseitige Aktion `claimSingles` schließt Großaufträge ausdrücklich aus. Münzen, Zahnräder und weitere Prämien werden aus echten Abschlussbelohnungen zusammengezählt. Command-Beleg speichert die Loot-Zusammenfassung für wiederholte Anfragen ohne zweite Gutschrift.
- Weiterhin nur Sammelbranch, keine Veröffentlichung.

### Großhändler – Monetarisierungsmerkliste

- Neue Seite „Großhändler“ im Hauptmenü mit schmalen Infokarten und dem Hinweis „Preisideen“.
- +1 Standardauftrag in der maximalen Auftragsliste: bis zu 10 Käufe, Gedankepreis 2,99 € je Kauf.
- +1 Auftrag festhalten: bis zu 4 Käufe, Gedankepreis 3,99 € je Kauf.
- Noch keine Kaufabwicklung, keine Shop-SDKs oder bezahlten Spielvorteile aktiviert. Pakete, Mengen, endgültige Preise und Zusammenspiel mit bestehenden Firmenupgrades sind später festzulegen.

### Kompakter Start und Belohnungshinweise

- Garage-/Flottenkacheln von Start entfernt; Zugriff über die untere Navigation.
- Einzel-/Großauftragskacheln bleiben fest 116 px hoch. Reservierte Hinweiszeile zeigt nur bei offenen Abschlussprämien „X Belohnung(en)“. Bei 0 bleibt die Zeile leer.
- Separaten Sammelblock auf Start entfernt. Einzelaufträge führen zum Einzelauftragsbereich; Großaufträge mit offenen Prämien direkt zur laufenden/abgeschlossenen Liste. Abholung erfolgt im jeweiligen Auftragsbereich.
- Loot-Popup der gebündelten Einzelprämien nennt Quelle und Zahl der Abschlüsse. Keine Veröffentlichung.

### Zurückbutton

- Aus dem Werteheader in die Seitenzeile verschoben: Zurück links, Seitenname daneben, Hilfe rechts. Bestehende Zurückfunktion unverändert; Touchfläche mindestens 44 × 44 px. Nur vorbereitet.
