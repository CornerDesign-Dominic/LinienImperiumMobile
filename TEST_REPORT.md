# Testbericht – gesammeltes Mobile-Update

## Geprüfter Umfang

- Regionsübersicht: fünf Karten mit zugehörigem Kunden, Entdeckungs- und Lieferfortschritt; gesperrte Regionen sind deaktiviert und optisch markiert.
- Region: sieben Ortskarten, danach die Endloskarte; Entdecken, Liefermissionen, Belohnungen und verbleibende Zeit.
- Testwerkzeuge: Münzen, +100 Expeditionspunkte, +100 Überstundenpunkte, +100 / +1.000 XP. XP löst normale Levelbelohnungen aus.
- Vorheriges Paket: höhere Kontraste der Angebotskarten, passende Hinweise zur Fahrzeugverfügbarkeit, Wiederholung bei Firebase-Transportfehler `internal [0]`.

## Ergebnisse vor Veröffentlichung

- TypeScript-Prüfung: bestanden.
- Spieltests: bestanden; acht mobile Adaptertests und 23 übernommene Web-Regressionsdateien.
- UI-Prüfung mit React Native Web bei 393 × 852 und 320 × 740: bestanden. Getestet wurden ein simulierter Verbindungsabbruch mit erfolgreicher Wiederholung, Navigation, Kartenansichten, Shard-Aufwertung, Testpunkte/XP, Regionssperren, alle sieben Orte, Freischaltung der nächsten Region, Endlosexpedition und Zurück-Navigation. Keine JavaScript-Laufzeitfehler.
- Automatischer Angebotswechsel: Zeitgrenze, angeheftete Angebote, laufende Transporte und Offline-Nachholung geprüft.

Die UI-Prüfung verwendet den echten Firebase-Client mit simulierten Netzwerkantworten und die echte Spiel-Engine. Sie ersetzt keinen Test auf einem physischen Android-Gerät.

## Veröffentlichung und Live-Prüfung

Erfolgreich veröffentlicht am 17.10.2026.

- [GitHub Actions: gesamter Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39048114385)
- Spielcode: `064d24a34cb4b28e2cea854764711f28427ec814`
- Android-Export: bestanden.
- Firebase-Deployment: erfolgreich.
- Live-Prüfung: echte Gastanmeldung, Speicherung, Anfrage-Deduplizierung, Regionsdaten, Testpunkte, XP-Levelbelohnung und Zugriffssperre ohne Anmeldung bestanden.
- EAS Update: erfolgreich für die bestehende Android-Runtime 0.1.0 veröffentlicht.
- Keine neue APK erstellt; die installierte Testversion erhält das Update beim Neustart.

## Weiter offen

Neue Größen/Entfernungen und Freigaberegeln für Startangebote sind noch nicht beschlossen und wurden nicht geändert. `internal [0]` bedeutet eine fehlende HTTP-Antwort; die Wiederholung fängt vorübergehende Ausfälle ab, garantiert jedoch keine dauerhafte Verbindung.

## Vorbereitetes Folgepaket (noch nicht auf Handy/Firebase veröffentlicht)

- Typprüfung und 11 Mobile-Engine-Tests sowie alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Neue Tests decken Fundtypen und exakte Ziel-IDs, gesperrte Auslosung, Duplikat-Shards, 15-Sekunden-Transporte inklusive Touren, einmalige Verkürzung laufender Missionen und alle vier gültigen 3-Punkte-Verteilungen ab. Unvollständige/zu große Verteilungen und doppelte Vergabe werden abgewehrt.
- Ursprüngliche Web-Engine bleibt unverändert. Keine Spielstände zurückgesetzt.
- Kein Firebase-Deployment, kein EAS-Update und kein neuer APK-Build für dieses Folgepaket gestartet.
- Android-Export und Web-Export erfolgreich; 3-Punkte-Auswahl bei 393 px im Browser mit lokaler Engine geprüft (Maximalwerte 50 → 52 und 100 → 101, vierter Punkt gesperrt). Kein physischer Gerätetest für dieses vorbereitete Paket.
- Browserprüfung des Fundablaufs bestanden: Materialauftrag → freies Garagenfahrzeug → zurück zur Expedition; Sonderauftrag → Flottenauswahl → laufender Großauftrag; Karten-/Shardfund ohne Zuweisungsbutton. Expeditionsseite ohne Fundlisten, Zurück-Navigation intakt, keine JavaScript-Seitenfehler. Firebase im Browser simuliert; keine Veröffentlichung.

### Vorbereiteter Firmenausbau

- Typprüfung, Web-Export und alle 12 Mobile-Engine-Tests plus 23 ursprüngliche Web-Regressionsdateien bestanden.
- Batchtest: drei regionale Prämienstufen plus zwei Fernverkehr-Reichweitenstufen kosten zusammen 640 M und 10 Items. Server berechnet jede Folgestufe, verarbeitet beide Segmente gemeinsam und lehnt zu wenig Items/Münzen, veraltete Stufen, doppelte Einträge, Nullauswahl und Überschreiten der Maximalstufe ab. Eingabespielstand bleibt unverändert.
- Kein Deployment oder App-Update für diese Änderungen gestartet.
- Android-Export erfolgreich. Browserprüfung bei 393 und 320 px mit lokal simulierter Firebase-Anbindung bestanden: Reihenfolge, gemeinsame Karte, unveränderte Ressourcen vor Speichern, Gesamtkosten 150 M / 6 Items für zwei Prämienstufen plus eine Reichweitenstufe, Link zu Herstellen, erhaltene Auswahl nach Zurück und geleerte Auswahl nach erfolgreichem Speichern. Keine JavaScript-Seitenfehler.

### Vorbereitetes Vorräte-Raster

- Typprüfung sowie Web- und Android-Export bestanden; Spielmechanik und Backend unverändert.
- Browserprüfung mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: alle 13 vorhandenen Itemarten, Drei-Spalten-Raster, Herkunft/Rezept im Detail, Link zur Herstellung und zur Garage geprüft. Letztes Refill gibt exakt +100 Tokens, Bestand fällt auf 0, Benutzen wird gesperrt und die Karte verschwindet nach Schließen aus dem Raster. Garagennavigation verbraucht kein Modul. Keine JavaScript-Seitenfehler.
- Kein Deployment, kein OTA-Update oder APK-Build gestartet.

### Vorbereitete Herstellungsseite

- Typprüfung, Web-Export und Android-Export bestanden. Keine Änderung der Spielmechanik oder des Backends.
- Browserprüfung bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung: vier Prozesszeilen mit kräftigem Pfeil, Mengen und je einem Herstellungsbutton; Kundenrezept ohne freigeschalteten Stammkunden gesperrt. Privatabholung kostet genau 100 Hinweise und erzeugt einen Auftrag. Beide Shard-Rezepte verbrauchen je 10 und geben genau 1 höhere Seltenheit. Nach Verbrauch wird die Verfügbarkeit aktualisiert; fehlende Ressourcen sperren die Herstellung. Keine JavaScript-Seitenfehler.
- Kein Firebase-Deployment, OTA-Update oder APK-Build gestartet.

### Vorbereitete Stammkunden-Seiten

- Typprüfung, Web-Export und Android-Export bestanden. Bestehende Freischaltung und Fähigkeitspunkte-Mechanik unverändert.
- Browserprüfung bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung: fünf freigeschaltete Kundenkarten ohne Aufwertungsbuttons, eigene Kundendetailseite mit Beziehung/Branche/Ware und Fähigkeiten, zwei verschiedene Fähigkeitspunkte korrekt ausgegeben, danach alle Verbesserungen gesperrt. Zurück zur Übersicht und Wechsel zu anderem Kunden mit eigenem Punktestand geprüft. Keine JavaScript-Seitenfehler.
- Kein Deployment, OTA-Update oder APK-Build gestartet.

### Vorbereitete Statistik und Startseite

- Statistik als kompakte gemeinsame Liste: Werte und Einheiten rechtsbündig, Bezeichnungen links. Ereignisprotokoll aus Statistik und letzte Ereignisse von der Startseite entfernt; gespeicherte Ereignisse bleiben erhalten.
- Typprüfung bestanden. Web-Export und Browserprüfung der Statistik bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung bestanden: Zahlenformat, Einheiten, identische rechte Zahlenkante, kein Ereignisprotokoll und keine JavaScript-Seitenfehler.
- Anschließende Entfernung des Startseitenblocks im Quelltext und durch erneute Typprüfung geprüft. Keine Mechanikänderung oder Veröffentlichung.

### Vorbereitete Einzelaufträge und Vorratsaufträge

- Typprüfung, Web- und Android-Export bestanden. 13 Mobile-Engine-Tests und alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Neuer Adaptertest: Dual-Way-Transport liefert prognostizierte 16 XP und den berechneten Münzgewinn inklusive Abschlussprämie. Verfügbarkeit unterscheidet freien/belegten/fehlenden LKW. Aktuelle Tour und vollständige Restzeit stimmen. Wiederholte Prognoseansichten ziehen keine Zufallszahlen und würfeln keine Beute. Kurzer Starttoast separat nachgeprüft.
- Browserprüfung mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px bestanden: kompakte Karten, kein Börsenplätze-/Haltbar-Hinweis, Countdown und Wechselbutton in einer Zeile, Hinweis bei fehlendem/belegtem LKW, Fahrzeugwahl/Start aus Details, automatische Navigation zur laufenden Liste, Zählkarte und Fortschritt/Restzeit/LKW. Detailansicht mit Prognose und möglicher Beute, Abschluss und echte Prämienabholung geprüft.
- Vorratsaufträge: eigene Zählkarte und Liste; Privatabholung dort geöffnet und gestartet. Danach nur in gemeinsamer laufender Liste, Vorratsseite leer und Zählung auf 0. Keine JavaScript-Seitenfehler.
- Keine Änderung der Transportlaufzeiten oder Belohnungsmechanik, kein Deployment/OTA-Update/APK-Build gestartet.

### Vorbereitete Großaufträge, Einzelprämien und Großhändler

- Typprüfung, Web- und Android-Export bestanden. 15 Mobile-Engine-Tests plus alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Katalogtest: zehn Varianten bereits ohne Fund vorhanden; reale Auslosungen stimmen mit Namen/Volumen/Distanz des Katalogs überein. Fund-, Material- und Zahnradchancen sowie Fristen aus dem vorhandenen Balancing. Laufende ETA und Fahrzeugwerte bleiben nach späterem Umbau unverändert.
- Bulk-Claim-Test: zwei Einzelprämien mit 17,34 M sowie gemeinsamen Zahnrädern/Items werden exakt einmal gutgeschrieben. Eine gleichzeitig fertige Großauftragsprämie bleibt offen. Eingabespielstand wird nicht in-place verändert; zweite Abholung zahlt nichts aus.
- Browserprüfung bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung bestanden: dauerhaft sichtbarer Katalog, gesperrter Fundort, echte Auftragsauswahl und Flottenstart, Navigation zur laufenden Liste und zurück, Frist links/Flotten-ETA rechts, Bild → Überstundenbutton → Flotte. Abschluss per Überstunden und echte Prämienansicht geprüft. Dabei gefundener Zugriff auf eine noch nicht vorhandene Frist beim ungeöffneten Überstunden-Popup behoben und der Ablauf vollständig erneut geprüft.
- Einzelprämienbutton öffnet Popup mit tatsächlicher gemeinsamer Lootliste, entfernt abgeholte Prämien und lässt Großauftragsprämie offen. Großhändler zeigt beide Preisideen (2,99 € bis 10×; 3,99 € bis 4×), ohne Kaufaktion. Keine JavaScript-Seitenfehler im abschließenden Browserlauf.
- Keine Kaufabwicklung, kein Firebase-Deployment/OTA-Update/APK-Build gestartet. Änderungen bleiben im Sammelbranch.

### Kompakter Start und Belohnungshinweise

- Typprüfung und Web-Export bestanden. Browserprüfung mit lokaler Engine und simulierter Firebase-Anbindung bei 393 und 320 px bestanden.
- Garage-/Flottenkacheln fehlen auf Start; untere Navigation bleibt bestehen. Beide Auftragskacheln sind mit/ohne Hinweis 116 px hoch. Belohnung erscheint, führt zum Einzelauftragsbereich und verschwindet nach Abholung, ohne die Kachelmaße zu verändern.
- Popup zeigt „Einzelaufträge“, Abschlusszahl und tatsächlichen Loot. Keine JavaScript-Seitenfehler. Kein Deployment oder OTA-Update.

### Zurückbutton in Seitenzeile

- Typprüfung und Web-Export bestanden. Browserprüfung bei 393 und 320 px: Zurückbutton, Seitenname und Hilfe liegen gemeinsam in der Seitenzeile, Touchfläche mindestens 44 × 44 px. Hilfe öffnen und per Zurück zum Start geprüft; keine JavaScript-Seitenfehler. Kein Deployment.

## Veröffentlichung des Sammelpakets am 17.10.2026

- Release-Commit: `da32f0701ef91f4aed77297f15e67ceda816263a`.
- [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39066168191): Validierung, Firebase-Deployment mit Live-Smoke-Test und Android-EAS-Update erfolgreich.
- Typprüfung, alle 15 Adaptertests und 23 ursprünglichen Web-Regressionsdateien sowie Android-Export bestanden. Live-Gastanmeldung, Speicherung, Deduplizierung, Testpunkte und XP-Levelbelohnungen erfolgreich geprüft.
- Update im Kanal `preview` für installierte Runtime 0.1.0. Keine neue APK und keine Spielstände zurückgesetzt. Die temporären Expeditionslieferzeiten von 15 Sekunden bleiben für diese Testrunde aktiv.
- Bisherige Abschnitte „vorbereitet“ dokumentieren die Prüfung vor Veröffentlichung. Physischer Android-Gerätetest durch den Nutzer steht aus.

## Vorbereitetes Folgepaket vom 18.10.2026

- Typprüfung und Web-Export bestanden; 16 Adaptertests sowie alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Einheitliche Empfehlungsfunde aus Regionen 1 und 5 geprüft: gleiche Basiswerte, erhaltene Herkunft, gemeinsamer Katalogschlüssel. Vorhandene wartende Empfehlungen werden vereinheitlicht, laufende Werte und gespeicherte Flotte bleiben erhalten. Eingabespielstand unverändert.
- Browser mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: sechs Typkarten, Rare-/Epic-Farben, Vorrat 2 aus zwei Regionen und nach Start 1. Fund-Modal mittig, mindestens 20 px Rand; lange Überschrift und Schließenbutton ohne Überlauf; Zuweisungsbutton vorhanden. Keine JavaScript-Seitenfehler.
- Kein Deployment, OTA-Update oder APK-Build für dieses Folgepaket. Physischer Gerätetest nach späterer Veröffentlichung.

### Expeditionsaufträge in Vorräten

- Typprüfung und Web-Export bestanden. Browserprüfung mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: Material-/Fahrzeugkartenauftrag sichtbar, gemeinsamer Vorrat 2, Auswahl eines freien Garagenfahrzeugs, Start und automatische Navigation zur laufenden Liste. Vorrat sinkt auf 1, gestarteter Auftrag fehlt im Vorrat; laufende Zählung, Fortschritt, LKW, Restzeit und Detail-Modal vorhanden. Belegtes Fahrzeug wird nicht erneut angeboten. Keine JavaScript-Seitenfehler.
- Spielengine und Belohnungsmechanik unverändert. Keine Veröffentlichung.

### Gestapelte Vorratsaufträge

- Typprüfung und Web-Export bestanden. Browser bei 393 und 320 px mit simulierter Firebase-Anbindung: genau eine Materialkarte „Anzahl 13“ und eine Fahrzeugkartenkarte „Anzahl 1“; leere Arten fehlen. Kein Menüpunkt/Screen „Expeditionsaufträge“ mehr.
- Materialgruppe öffnen, konkreten Auftrag starten und in laufender Liste verfolgen; danach Materialanzahl 12, gemeinsame Vorratszahl 13. Wechsel zur Fahrzeugkartengruppe und Ausschluss des belegten LKW geprüft. Keine JavaScript-Seitenfehler. Keine Veröffentlichung.

### Einzelne Erkundungspunkte und Bonuslieferungen

- Typprüfung und Web-Export bestanden; 17 Adaptertests und alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Je Klick genau 1 Punkt, Teilfortschritt nach Sync, vollständige Entdeckung erst beim letzten benötigten Punkt, kein Fortschritt ohne Vorrat/in gesperrter Region. Bereits entdeckte Altorte bleiben vollständig; Eingabespielstand wird nicht verändert.
- Region erreicht vor Bonuslieferungen 100 %, nächste Region wird freigegeben. Lieferbonus verändert Erkundungsprozente nicht; Kapazitätsmodul bei Freilegung wird exakt einmal vergeben.
- Browserprüfung mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: Prozent oben rechts, drei Klicks auf Ort 1 zeigen 33/67/100 %, Bonus liefern und separat abholen, danach weiterhin 100 %. Keine JavaScript-Seitenfehler. Kein Deployment/OTA-Update.

### Stadthub Händler wiederhergestellt

- Ursache: Navigation zu `dealer` vorhanden, Renderfall fehlte. Kaufkarten für die zwei bestehenden Stadtfahrzeuge ergänzt und Seitentitel/Zugänge umbenannt. Backend unverändert.
- Typprüfung und Web-Export bestanden. Browser bei 393 und 320 px mit lokaler Engine / simulierter Firebase-Anbindung: kein Hauptmenüeintrag, Navigation Stadthub → Händler, zwei Fahrzeuge sichtbar, Kauf vor Hub-Eröffnung gesperrt. Hub eröffnet, beide Modelle gekauft: Abzug exakt 4.000 + 20.000 M und Fahrzeuge automatisch im Hub eingesetzt. Kauf am bestehenden Stellplatzlimit gesperrt, Zurück zum Hub funktioniert. Keine JavaScript-Seitenfehler.
- Kein Deployment/OTA-Update; Korrektur bleibt im Sammelpaket.

### Garage exklusiv, Flotten parallel

- 18 Adaptertests und alle 23 ursprünglichen Web-Regressionsdateien bestanden.
- Neuer Regressionstest: gleiche Karte kann nicht doppelt in Garage aufgenommen oder während Fahrt entfernt werden; zweiter Einzelauftrag und Expeditionslieferung mit belegtem Garagenfahrzeug werden abgewiesen. Umgekehrt blockiert eine Expeditionslieferung die Einzelzuweisung.
- Parallel zum laufenden Garagenauftrag dieselbe Karte in zwei Flottenvorlagen sowie drei Großaufträgen (davon zwei mit gleicher Vorlage) erfolgreich eingesetzt. Garage bleibt genau ein Fahrzeug/ein aktiver Garagentransport. Laufende Flottenwerte sind unabhängig.
- Regel war bereits implementiert. Nur Tests/Dokumentation ergänzt; kein Deployment.

### Überstundenmenge und direkter Verbrauch

- Typprüfung und Web-Export bestanden; 19 Adaptertests plus 23 ursprüngliche Web-Regressionsdateien bestanden.
- Neue Mechanikprüfung: 7 Punkte = 7.000 tkm; übergroße Menge verbraucht am Ende nur noch nötige Punkte, Abschluss wird erreicht. Bei 3 verfügbaren/7 angeforderten Punkten werden genau 3 verbraucht, bei 0 bleibt Fortschritt unverändert. Negative, gebrochene, Text- und zu große Mengen abgewiesen, 0 schreibt nichts gut.
- Browser mit lokaler Engine / simulierter Firebase-Anbindung bei 393 und 320 px: Mengenbutton links ungefähr ein Drittel, direkter Einsatz rechts, zentrierter Editor; ungültige 0-Eingabe gesperrt. Auswahl 10 verändert Vorrat nicht; Einsetzen mit Vorrat 3 verbraucht 3 ohne Popup. Bei 0 nur Refill-Option, direkter +100-Refill verbraucht genau ein Paket und zeigt danach Mengeneditor. Anschließend 7 Punkte direkt eingesetzt, kein Popup. Keine JavaScript-Seitenfehler.
- Kein Deployment/OTA-Update. Änderungen bleiben im Sammelbranch.

## Veröffentlichung des Folgepakets am 18.10.2026

- Release: `2bdd72e8c26746831512b9635d16671d7cde2290`.
- [GitHub Actions](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39131547974): Validierung, Firebase-Deployment, Live-Smoke-Test und EAS-Update erfolgreich.
- 19 mobile Adaptertests plus alle 23 ursprünglichen Web-Regressionsdateien, Typprüfung und Android-Export bestanden. Live-Gastanmeldung, Speicherung/Deduplizierung, Regionsdaten, Testressourcen, XP-Levelbelohnung und Auth-Sperre geprüft.
- Android-OTA im Kanal `preview`, Runtime 0.1.0. Keine neue APK, kein Spielstand zurückgesetzt. Bestehende wartende Empfehlungen werden beim nächsten Serverkontakt vereinheitlicht; laufende Aufträge behalten gespeicherte Werte. Temporäre 15-Sekunden-Expeditionslieferungen bleiben aktiv.
- Physischer Gerätetest durch den Nutzer nach Update steht aus. Die Abschnitte „vorbereitet“ beschreiben die vorangegangenen Prüfungen.

## Neues vorbereitetes Sammelpaket: Level Up und feste Überstundenwahl

- Typprüfung, Functions-Syntaxprüfung und Web-Export bestanden. 21 Adaptertests plus 23 ursprüngliche Web-Regressionsdateien bestanden.
- Neue Level-Prüfung: Meldung pro neuem Aufstieg, mehrere Level in einer Aktion, passive Offline-Nachholung, keine Wiederholung bei gewöhnlichem Sync oder Verteilung bestehender Punkte. Command-Belege speichern die Meldungsdaten.
- Max-Prüfung mit einfacher und gemischter Flotte, teilweise schon gefahrenen Touren: berechnete Punktzahl macht ETA ≤ Frist, ein Punkt weniger lässt ETA > Frist. Projekt bleibt aktiv und hat passive Restfahrt. Weiterer Max-Einsatz verbraucht nichts; zu wenig Vorrat wird bis 0 verbraucht. Quellspielstand bleibt unverändert. Bestehende Tonnenkilometer-/Vergütungsregeln unverändert.
- Browser bei 393 und 320 px mit lokaler Engine/simulierter Firebase-Anbindung: Level-Up-Modal aus Einstellungen, tatsächliche Belohnungen, Rückkehr zur gleichen Seite, kein altes Popup nach Reload, nacheinander Level 3/4/5. Verteilung aktuell links/Bedienung Mitte/Ergebnis rechts, vierter Punkt gesperrt, 2+1 gespeichert, kein Refill-Hinweis in Karte.
- Überstunden-Browserprüfung: genau vier Optionen 1/5/10/Max, keine freie Eingabe/Übernehmen. Auswahl verbraucht nichts. Restvorrat bei Auswahl 10 korrekt verbraucht; bei 0 nur Refill. Max nach Refill lässt Flotten-ETA innerhalb der Frist, wiederholter Max-Einsatz gesperrt. Normale Einsätze ohne Popup; echte Levelaufstiege zeigen das gewünschte neue Level-Modal. Keine JavaScript-Seitenfehler.
- Keine Veröffentlichung. Physische Android-/iOS-Prüfung steht für dieses neue Paket aus.

### Vorratsstapel nach Rang und Seltenheitsfarbe

- Typprüfung und Web-Export bestanden. Backend und Belohnungslogik unverändert.
- Browser bei 393 und 320 px mit lokaler Engine/simulierter Firebase-Anbindung: Materialrang 1 mit 13 Aufträgen aus zwei Regionen als eine Karte; Rang 2 mit 2 und Rang 3 mit 1 jeweils separat. Drei unterschiedliche passende Rand-/Hintergrundfarben, keine Regions-Einzelzeilen. Fahrzeugkartenrang 2 aus zwei Regionen ebenfalls ein Stapel mit Anzahl 3.
- Zuweisung eines Rang-1-Stapelauftrags erhält die tatsächliche Herkunft und Rang; genau die gewählte vorhandene Instanz wird entfernt, Stapel sinkt 13 → 12 und Art-/Gesamtzählung entsprechend. Rücknavigation und Wechsel der Auftragsart geprüft. Keine JavaScript-Seitenfehler.
- Kein Deployment/OTA-Update; Ergänzung im Sammelpaket.

### Typ direkt im Großauftragstitel

- Typprüfung und Web-Export bestanden. Browser bei 393 und 320 px: alle sechs Katalogtitel mit Sonder-/Empfehlungsauftrag, keine separate Typzeile, Vorratszahlen vorhanden. Typdetail und vorhandene Empfehlungsinstanz zeigen denselben Namen. Keine JavaScript-Seitenfehler.
- Bestehende Namen werden nur für die Anzeige formatiert; keine Änderung von Auftragserzeugung, Fristen oder Vergütung. Fundtitel ebenfalls angepasst und abschließend typgeprüft. Keine Veröffentlichung.

### Regenerationscountdowns und schwebende Hinweise

- Typprüfung und Web-Export bestanden. 22 Adaptertests plus 23 ursprüngliche Web-Regressionsdateien bestanden.
- Neuer Regenerationstest: tatsächliche nächste Serverfristen, Gutschrift exakt an der Grenze, nächste 20-/10-Minuten-Frist, Stoppen am Maximum und über Maximum ohne Kürzung von Test-/Belohnungsvorräten.
- Browser bei 393 und 320 px mit lokaler Engine/simulierter Firebase-Anbindung: beide Countdowns sichtbar ohne Überlauf, automatischer Sync schreibt beide Token gut und startet Timer neu. Bei vollem und überfülltem Vorrat „Voll“.
- Erfolgshinweis nach Kapazitätsupgrade geprüft: vor/nach identische Position des Spielinhalts, CSS absolut positioniert, keine Pointer-Ereignisse, Menü weiter bedienbar, Hinweis verschwindet automatisch. Keine JavaScript-Seitenfehler.
- Kein Deployment/OTA-Update; beide Änderungen bleiben im Sammelpaket.

## Garage als 5×2-Raster – 18.10.2026, vorbereitet

- Zehn Kartenplätze in fünf Zeilen/zwei Spalten; freie Plätze gestrichelt mit Plus und Auswahl vorhandener, nicht eingesetzter Karten. Stadttransporter separat, bisheriger Händlerzugang und Hub-/Verkaufsaktionen erhalten.
- Belegte Rasterkarten enthalten nur Name, Kapazität, Kartenstufe und Geschwindigkeitsrang. Mittiges Detailmodal mit Fahrzeugdaten, Status/Restzeit und Entfernen, ohne Kapazitäts-/Rang-/Shard-Upgrades.
- Kapazität und Geschwindigkeitsrang im Sammlungsmodal verfügbar, auch bei geparkten Karten außerhalb der Garage. Adapter verwendet bestehende Upgrade-Funktionen und Ressourcen-/Maximalprüfungen; keine Preis- oder Bonusänderungen. Persistierter Garagenbestand wird dabei nicht erhöht.
- `npm run typecheck`: bestanden. Expo-Webexport: bestanden.
- `npm test`: 24 Node-Testeinträge bestanden (23 Adaptertests und Wrapper mit 23 ursprünglichen Web-Regressionsdateien). Neuer Test prüft geparkte/eingesetzte Upgrades, Ressourcenverbrauch, fehlenden Vorrat, ungültige/unentdeckte Karten und Wiedereinsetzen.
- Browser-QA mit echter lokaler Engine und simuliertem Firebase-Transport auf 393/320 px bestanden: 5×2-Geometrie, gestrichelte Plätze, keine Rasterüberläufe, Detailinformationen ohne Upgrade-Aktionen, Entfernen/Auswahl, Kapazitäts-/Rang-Upgrades in der Sammlung und erhaltene Werte beim Wiedereinsetzen. Screenshots von Raster und Detailmodal visuell geprüft. Keine Browserfehler.
- Nur Sammelbranch; kein Firebase-Deployment, OTA-Update oder APK-Build. Kein physischer Gerätetest.


## Einzelaufträge: Verkehrsart und Dauer – 19.10.2026, vorbereitet

- Ortsrelation in allen normalen Einzelauftragskarten und Details entfernt. Verkehrsart aus bestehender Kategorie, Dauer aus tatsächlicher Gesamtfahrzeit; Kurz ≤ 300 Sekunden, Mittel ≤ 900 Sekunden, Lang > 900 Sekunden. Ohne passendes Fahrzeug Schätzung mit Basisfahrzeug der Kategorie. In der Fahrzeugwahl wird die ausgewählte Prognose verwendet. Kilometer- und Wirtschaftsdaten unverändert.
- Typprüfung und Expo-Webexport bestanden. `npm test`: 25 Einträge bestanden (24 Adaptertests und Wrapper für 23 ursprüngliche Web-Regressionsdateien). Neuer Test prüft Dauergrenzen, Regional-/Fernverkehr und Schätzung ohne Fahrzeug.
- Browserprüfung mit lokaler Engine/simuliertem Firebase auf 393/320 px bestanden: alle drei Klassen, beide Verkehrsarten, keine Ortsrelation in Angeboten/Details/laufender Liste, funktionierender Start. Screenshot auf 320 px visuell geprüft, keine Browserfehler/Überbreite.
- Nur Sammelbranch; kein Deployment, OTA-Update oder APK-Build.


## Gekaufte Fahrzeuge ausschließlich im Stadthub – 19.10.2026, vorbereitet

- Garagenraster filtert auf Kartenfahrzeuge; Stadttransporter und Händlerlink aus der Garage entfernt. Im Stadthub öffnen gekaufte Fahrzeuge ein mittiges Detailmodal mit Daten, Kapazität/Rang verbessern, Hub zuweisen/entfernen und bestätigtem Verkauf. Bestehende Serveraktionen und Kosten unverändert. Hubeinsatz blockiert den Entfernenbutton nicht mehr selbst über `free=false`.
- Typprüfung und Expo-Webexport bestanden. Browser-QA mit lokaler Engine/simuliertem Firebase auf 393/320 px bestanden: gekauftes Fahrzeug fehlt in der zehnteiligen Garage, erscheint im Stadthub, beide Upgradearten mit Ressourcenverbrauch, Einsatz entfernen/wiederherstellen, bestätigter Verkauf und Händlernavigation. Keine Browserfehler; Detailmodal visuell geprüft. Keine neue Serverlogik, daher bestehende Servertests nicht erneut ausgeführt.
- Im Sammelbranch gespeichert, nicht veröffentlicht.


## Vollständigkeit und Namen der Items – 19.10.2026, vorbereitet

- Engine-Abgleich von Inventarfeldern, Zahnrad-/Shard-Pools, Expeditionsfunden, wartenden Transporten, Großaufträgen, Fahrzeugkarten und allen vier Herstellungsfunktionen. Ergebnis und Herkunft/Nutzung je Art: `ITEM_AUDIT.md`.
- Vorräte um alle wartenden Auftragsarten und eigene Karten ergänzt; Rangstapel und Mengen bleiben aus dem Serverzustand abgeleitet. Neue Rezeptmetadaten verwenden dieselben Kostenkonstanten wie die tatsächlichen Herstellungsfunktionen. Gemeinsame Namensdatei für App und Katalog. Verwendungspfade und irreführender Firmenausbau-Herstellen-Link korrigiert.
- `npm run typecheck` und Expo-Webexport bestanden. `npm test`: 28 Einträge bestanden (24 Adaptertests, 3 neue Item-Katalogtests sowie Wrapper mit 23 ursprünglichen Web-Regressionsdateien). Neue Prüfungen: alle nutzbaren Inventarschlüssel/Seltenheiten, Namen, alle vier Rezepte mit tatsächlichem Verbrauch und sichtbaren Ergebnissen, Jobstapel und queued Großaufträge, Entfernung gestarteter Jobs aus dem Vorrat.
- Browser-QA mit lokaler Engine und simuliertem Firebase auf 393/320 px bestanden: sämtliche 13 Materialarten und repräsentative Karten/alle wartenden Auftragsarten sichtbar; keine Überbreite. Modul-Links zur Sammlung/Stadthub, Rezeptlink aus einem hergestellten Item, alle vier Herstellungsaktionen und anschließende Bestandszahlen geprüft. Firmenausbau-Item nicht fälschlich als herstellbar markiert. Vorrats- und Herstellungsansicht visuell geprüft; keine Browserfehler.
- Keine Preise, Verbrauchsmengen, Fundchancen oder Spielmechanik verändert. Nur Sammelbranch; kein Deployment, OTA-Update oder APK-Build und kein physischer Gerätetest.


## Kundenpunkte als Vorschau mit gemeinsamem Speichern – 19.10.2026, vorbereitet

- Plus/Minus verändern nur den lokalen Entwurf; freie Punkte, Bonus und Fähigkeitenstufe zeigen die geplante Verteilung. Speichern übernimmt alle Bereiche gemeinsam. Bereits gespeicherte Punkte sind nicht rückerstattbar. Verlassen verwirft den Entwurf; spätere Syncs mit gleichen Ausgangswerten erhalten ihn während der Bearbeitung.
- Neue `customerBatch`-Aktion validiert vollständige ganzzahlige Auswahl, verfügbaren Vorrat, individuelle Limits, freigeschalteten Kunden und unveränderte Ausgangswerte vor dem ersten Verbrauch. Bestehende Vergabe-/Bonusmechanik verwendet. Erfolgsflag wird im Command-Beleg gespeichert und bei Wiederholung wiedergegeben.
- Nächstes-Level-Text aus Kundenkarten entfernt; aktuelles Level und Beziehungsfortschritt bleiben.
- Typprüfung und Expo-Webexport bestanden. 29 Node-Testeinträge bestanden (25 Adaptertests, 3 Item-Katalogtests und Wrapper für 23 ursprüngliche Web-Regressionsdateien). Neuer Test: gemeinsame Vergabe, Restpunkte, negative/gebrochene/zu viele Punkte, Fähigkeitslimit, leere/falsche Payload, gesperrter Kunde, veralteter Entwurf; Fehler verändern keinen Spielstand.
- Browser-QA mit lokaler Engine und simuliertem Firebase auf 393/320 px bestanden: Plus/Minus ohne Serveraufruf, Vorratsgrenze, eine Speicheraktion mit korrekten Werten, Beständigkeit nach Neuladen, deaktiviertes Minus nach Speichern, verworfene ungespeicherte Navigation, kein nächstes Level. Keine Überbreite/Browserfehler; 320-px-Ansicht visuell geprüft.
- Nur Sammelbranch, nicht veröffentlicht; kein physischer Gerätetest.


## Veröffentlichung des gesamten Sammelpakets – 19.10.2026

- Release: `c76d08d9795bd20eb45cc01f13e152b1d58bf4bd` · [GitHub Actions](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39243835875). Gesamtstatus erfolgreich.
- CI: Abhängigkeiten, Typprüfung, alle 29 Testeinträge und Android-Export erfolgreich.
- Firebase: Spielserver und Firestore-Regeln erfolgreich deployed, anschließender Test der tatsächlich veröffentlichten Spiel-API erfolgreich.
- Expo: Android-OTA im Kanal `preview` erfolgreich veröffentlicht. Installierte Test-App erhält das Update beim erneuten Öffnen; kein APK-Build und keine Neuinstallation für dieses Paket erforderlich.
- Enthält alle seit dem letzten Release gesammelten Anpassungen: Level-Up, Überstunden-Max, Vorratsstapel, Auftragsnamen, Token-Countdowns, schwebende Hinweise, Garage, Stadthub-Fahrzeuge, Verkehrsart/Dauer, Item-Audit und Kundenzuteilung.
- Lokale Browserprüfungen und Regressionstests sind in den vorherigen Abschnitten dokumentiert. Kein physischer Gerätetest. Temporäre 15-Sekunden-Expeditionslieferungen bleiben für die Testphase aktiv.


## Bedarfsabhängige Kunden-Verteilbuttons – 19.10.2026, vorbereitet

- Rein visuelle Anpassung: Verteilung nur bei freien Punkten oder lokalem Entwurf; Minus/Mengenanzeige nur pro vorgemerkt verbessertem Bereich; Speichern nur mit Entwurf. Fähigkeiten und dauerhafte Boni bleiben bei 0 Punkten sichtbar.
- Typprüfung und Expo-Webexport bestanden. Browser-QA mit lokaler Engine und simuliertem Firebase auf 393/320 px bestanden: 0 Punkte ohne Verteilcontrols, frischer Punkt nur mit Plus, vorgemerkter letzter Punkt weiterhin rücknehmbar/speicherbar, vollständiges Zurücknehmen blendet Minus/Speichern aus, Speichern blendet bei 0 Punkten sämtliche Controls aus. Genau eine Servermutation; Bonus weiterhin sichtbar. Keine Browserfehler, 320-px-Ansicht visuell geprüft.
- Keine Serveränderungen, daher Serverregressionen nicht erneut ausgeführt. Neues Sammelpaket, nicht veröffentlicht.


## Durchlaufende Regenerationszyklen – 19.10.2026, vorbereitet

- Ursache: die ursprüngliche `spendExpeditionPoints`-Funktion setzte nach jedem Verbrauch `lastRegenAt` neu. Mobile-Adapter erhält nun die vorhandene Phase; Regeneration vor dem Abzug und Kapazitätsgrenzen bleiben unverändert. Volle/überfüllte Vorräte pausieren weiterhin und starten beim Unterschreiten einen vollständigen Zyklus. Überstundenverbrauch verhielt sich bereits so und ist nun ausdrücklich abgesichert.
- Testgutschriften setzen die Phase nur beim Erreichen des Limits zurück. Überstunden-Refill unterhalb eines erhöhten Limits erhält die Phase. Keine Änderung von Regenerationsraten (20/10 Minuten), Punktkosten oder Bonusmengen. Gepinnte Vendor-Datei unverändert.
- `npm test`: 31 Einträge bestanden (27 Adaptertests, 3 Item-Katalogtests, Wrapper mit 23 ursprünglichen Web-Regressionsdateien). Neue Tests prüfen wiederholten Expeditions-/Überstundenverbrauch ohne Friständerung, tatsächliche Gutschrift am bestehenden Fristende, mehrere Offline-Zyklen mit Restphase, natürliches Erreichen des Limits, Pause ohne weitere Gutschrift, vollständigen Neustart nach Ausgeben aus vollem Bestand und Refill/Testgutschrift unterhalb des Limits.
- Reine Serverlogik, keine geänderte Oberfläche. Neues Sammelpaket, nicht veröffentlicht.


## Single/Dual Way auf kompakten Auftragskarten – 19.10.2026, vorbereitet

- Auftragstyp aus `routeType` in der kompakten Beschreibungszeile ergänzt; geteilter Kartenbaustein für Angebote, wartende und laufende Einzelaufträge. Keine neue Spielmechanik.
- Typprüfung und Expo-Webexport bestanden. Browserprüfung auf 393/320 px mit beiden Auftragstypen bestanden, keine Überbreite/Browserfehler; 320-px-Ansicht visuell geprüft. Server unverändert, keine erneute Serverregression erforderlich.
- Nur Sammelbranch, nicht veröffentlicht.


## Zwei speicherbare 50-Punkte-Auffüller pro Level – 19.10.2026, vorbereitet

- Neue Levelbelohnung: je 1 Expeditionsauffüller und Überstundenauffüller, weiterhin 3 verteilbare Punkte. Kein sofortiges +50 auf Expeditionsvorrat. Mehrfachaufstiege vergeben je Gegenstand pro Level einmal; normale Syncs vergeben nichts erneut.
- Beide Auffüller lösen manuell je 50 Punkte ein, auch über dem Limit. Neues Inventarfeld wird bei alten Spielständen mit 0 ergänzt, Bestände/Punktzahlen bleiben bestehen. Reset setzt beide Gegenstandsbestände zurück. Überstunden-Verbrauchs-/Abrechnungslogik unverändert; gepinnte Vendor-Datei unverändert, Konstante im Mobile-Adapter strukturgesichert auf 50 angepasst.
- Vorräte zeigen jetzt 14 nutzbare Materialarten. Gemeinsame Namen Expeditionsauffüller/Überstundenauffüller, Level-Up-Modal ohne Füllmenge. Herkünfte, Benutzen, Hilfe und Item-Prüfmatrix aktualisiert. Kein neues Herstellungsrezept.
- Typprüfung und Expo-Webexport bestanden. 33 Node-Testeinträge bestanden (29 Adaptertests, 3 Item-Katalogtests und Wrapper mit 23 ursprünglichen Web-Regressionsdateien). Zusätzliche Fälle: beide Gegenstände je Level, Mehrfachaufstieg ohne sofortige Punkte, Wiederholung/Altdaten ohne Nachvergütung, je +50 mit Bestandsverbrauch, leerer Vorrat, Reset und Regeneration bei Einlösen unterhalb eines erhöhten Limits. Bisherige Erwartungen gezielt an neue Belohnungswerte angepasst.
- Browser-QA mit lokaler Engine/simuliertem Firebase auf 393/320 px bestanden: globales Modal mit genau beiden Gegenständen und drei Punkten, keine 50-/100-Werte im Modal; kein automatisches Einlösen; beide Vorratskarten und Beschreibung; manuelle +50-Verwendung und deaktivierte Verwendung bei 0, anschließend kein positiver Bestand mehr. Keine Browserfehler; 320-px-Modal visuell geprüft.
- Live-Smoke-Skript um beide Auffüller und wiederholtes Einlösen mit gleicher Command-ID ergänzt; dieses Skript wird erst beim nächsten Deployment gegen den Server ausgeführt. Neues Sammelpaket, nicht veröffentlicht.


## Eigene Fahrzeugkarten-Detailseiten – 19.10.2026, vorbereitet

- Sammlungsmodal durch eigene Detailseite je Katalogkarte ersetzt. Kopf mit festem 180×180-Bildplatzhalter, Kartenname/Stufe/Kapazität/Rang. Bonus/Geltungsbereich, strukturierte Fahrzeugdaten und getrennte Kartenstufen-/Kapazitäts-/Rangverbesserungen mit Beständen/Kosten. Optionales Beschreibungsfeld am Seitenende vorbereitet. Bestehende Verbesserungskosten und Serveraktionen unverändert.
- Neue Navigation `cardDetail` mit Zurück/Spielhilfe und bestehender globaler Level-Up-Anzeige. Rückweg zum Raster setzt den Scrollbereich zurück. Nicht entdeckte Karten zeigen Daten/Herkunft und keine Upgrade-Aktionen; keinerlei Zuweisungsstatus in der Sammlung.
- Typprüfung und Expo-Webexport bestanden. Browser-QA mit lokaler Engine/simuliertem Firebase auf 393/320 px: alle 15 Karten öffnen eigene Seiten und kehren ins Raster zurück, kein Detailmodal/Schließenbutton mehr; Bild exakt 180×180 auf beiden Breiten, keine Überbreite oder Browserfehler. Fahrzeugstufe, Kapazität und Rang lassen sich verbessern und zeigen erhaltene Werte in Seite und Raster. Nicht entdeckte Karten ohne Upgradecontrols. 320-px-Ansicht visuell geprüft.
- Reine UI-/Navigationsänderung, keine erneute Serverregression erforderlich. Im Sammelbranch gespeichert, nicht veröffentlicht.
