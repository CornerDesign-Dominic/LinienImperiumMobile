# Offene Arbeiten und Veröffentlichungsstand

Stand: 03.11.2026. Veröffentlichtes Sammelpaket: `12729dbf25ab76f3b9ed75432105e0c4a59c845f`.

## Letzte Veröffentlichung

[Mobile-preview-Lauf 41728496322](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41728496322) hat Typprüfung, 290 Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA erfolgreich abgeschlossen. Keine neue APK; kein physischer Gerätetest.

Das freigegebene Paket enthält:

- Stille Expeditionsabschlüsse mit automatischer Ausbaupunkt-Gutschrift, Regionskopf, Bonus-Kreisplus und Umbrüche an Wortgrenzen.
- Globale Botenstation-Bezeichnung und auf ganze Taler gerundete laufende Ertragsanzeige.
- Regionale Großauftragstitel, Reiter mit echten Anzahlen, feste Seltenheits-/Regionssortierung und Seltenheitsstreifen.
- Gemeinsame Liste laufender und fertiger Großaufträge mit ERLEDIGT-Stempel und direkter, abgesicherter Prämienabholung.
- Eigene Bilder aller 15 Stammkundenwaren und kompakte Angebotskarten.
- Gemeinsame Punkteverteiler mit Basiswerten, getrennten Punktebeständen und hellen Petrol-Infoflächen; ein Verfügbarkeitshinweis am Imperiumsausbau.
- Season-Einstieg mit 30 Stufen, Free links und Premium rechts als vorläufige Vorschau.

Details und genaue Grenzen stehen in den jeweiligen [Modulnotizen](docs/README.md); der aktuelle Prüfnachweis steht in [TEST_REPORT.md](TEST_REPORT.md). Ausbaupunkte-Name und Bauplan-/Säulenmotiv waren bereits im vorherigen Paket `ca6f08d621f6f11aee0f57078dced1434fc6ffab` veröffentlicht.

Neue Wünsche werden ab jetzt wieder gesammelt; die nächste Spielveröffentlichung benötigt eine neue ausdrückliche Freigabe.

## Noch offene Punkte

| Bereich | Tatsächlicher Stand / nächster Schritt |
| --- | --- |
| Expeditionszeiten | `EXPEDITION_TEST_DURATION_MS = 15000` in `functions/src/engine.cjs` ist weiterhin aktiv. Vor einem regulären Spielbetrieb Testverkürzung bewusst aufheben und normale Laufzeiten prüfen. Dies ist hier nur dokumentiert. |
| Regionale Geschenke | Weiterhin Testpreis 10 Taler und je 20 % auf die fünf Gebietskarten (`functions/src/gifts-runtime.js`). Vor regulärer Balance bewusst festlegen; nicht mit Expeditions-Fundchancen verwechseln. |
| Echtgeldkäufe | Großhändler zeigt Vorschaupakete; echte Kaufbuttons sind deaktiviert. Store-Produkte, Billing und serverseitige Kaufprüfung fehlen. Einzelheiten: [Premium-Shop](docs/ui/premium-shop.md). |
| Pyramiden-Event | Legendäre Passkarte bleibt Platzhalter; wiederkehrende Gemeinschaftsrunden und produktive Skalierung sind noch nicht abgeschlossen. [Eventregeln und Grenzen](docs/events/pyramid.md). |
| iOS | Gemeinsame App vorbereitet; signierter iPhone-Build und Gerätetest sind gesonderte Arbeit. |
| Season | Veröffentlichte 30-Stufen-Vorschau ohne Fortschritt, Abholen oder Premiumkauf. Vor Aktivierung Fortschrittsregeln, Laufzeit/Reset, Premiumzugang und endgültigen Loot festlegen. [Season](docs/ui/season.md). |
| Expeditionsbilder | Audit: fünf Panoramen mit je 2172 × 724 Pixeln werden auf mehrere Bildschirmbreiten vergrößert; kein globaler Unschärfefilter, keine höher aufgelöste Originaldatei nachgewiesen. Kein Bildtausch beauftragt. |
| Startangebote | Früherer Vorschlag für kleinere Einstiegsangebote bleibt unbeschlossen. Nicht als aktuelle Regel übernehmen; bei Wiederaufnahme gegen die heutigen, für beide Verkehrsarten nutzbaren Transportkarten prüfen. |

Die Tabelle hält belegte Restpunkte fest; sie beauftragt keine neue Spielfunktion. Neue Wünsche erst mit klarem Umfang und Status aufnehmen.

## Pflege und Freigabe

- Einträge beschreiben nur offene Entscheidungen, bekannte Grenzen oder ein konkretes noch auszurollendes Paket.
- Code in `main`, geprüfter Build und tatsächlich ausgerolltes Backend/OTA sind unterschiedliche Zustände. Bei einer Veröffentlichung Commit und erfolgreichen Workflow verlinken.
- Nach Abschluss den Eintrag entfernen oder mit Nachweis in die Historie übernehmen; keine vollständigen Modulbeschreibungen hier duplizieren.
- Spielveröffentlichungen erfolgen weiterhin auf ausdrücklichen Wunsch über den dokumentierten Workflow. Dokumentationspflege startet keinen manuellen Release und setzt keinen Veröffentlichungsmarker.


## Gesammelt: Angebotsmodal – Aktualisieren

Der Bestätigungsbutton im Modal „Neue Angebote?“ heißt „Aktualisieren“ (Englisch „Refresh“), beim Speichern „Wird aktualisiert …“. Preis bleibt separat sichtbar; Kosten, gehaltene Angebote und Bestätigungslogik bleiben unverändert. Nur Beschriftung und Übersetzung geprüft; kein neuer Release. 

## Gesammelt: kompakte Großauftragskarten

Angenommener Entwurf umgesetzt: kleinere vorhandene Warenbilder, kompakte Titel-/Kunden-/Frachtzeilen mit Häuschen vor dem Kundennamen und Kiste vor der Tonnenzahl. Laufende mit gelieferter/Gesamtmenge, schmalem Balken und gemeinsamer Zeitzeile; fertige mit kleinem ERLEDIGT-Stempel und kompakter „Abholen“-Taste ohne Leerfläche. Namen umbrechen ohne Abschneiden; Sortierung, Prämienlogik und Schutz vor Doppeltipps unverändert. Vier reine Status-/Sortier-/Backendtests erfolgreich; UI-/Typ- und Geräteprüfung lokal nicht belegt. [Details](docs/ui/project-category-overview.md). Noch nicht veröffentlicht.

## Gesammelt: ein gemeinsamer Ausbaupunktevorrat

Nutzerentscheidung vom 04.11.2026 ersetzt die frühere Trennung: Levelaufstiege (je 3) und einmalige Ortslieferungen (je 1) geben dieselben Ausbaupunkte. Ein Bestand, ein Einstieg und ein manueller Verteiler; 6 bisherige Levelpunkte plus 1 Expeditionspunkt ergeben 7 Ausbaupunkte. Auch Teilmengen sind verteilbar. Alte offene Levelgutschriften werden einmalig übernommen; bereits gekaufte Maxima, Boni, Energie und Regeneration bleiben erhalten. Die alten Befehle verwenden denselben autoritativen Vorrat. Details: [Gemeinsame Ausbaupunkte](docs/ui/point-allocation.md).

16 gezielte Backend-/Wiederholungsprüfungen erfolgreich. Erweiterter lokaler Lauf: 203 von 204 Prüfungen erfolgreich; der einzige Fehler betrifft die im lokalen Textcheckout fehlende vorhandene Fahrzeugbilddatei `navigator`, keine geänderte Spiellogik. Komponentenprüfungen angepasst, lokal ohne React/TypeScript nicht ausführbar. JS-Syntax und beide Übersetzungs-JSON geprüft. Vollständige Typprüfung, App-Export und Releaseprüfung vor der nächsten ausdrücklich freigegebenen Veröffentlichung; noch nicht veröffentlicht.

## Gesammelt: Beschaffungsmodale

Ortsauswahl mit kleinen Regionsbildern links und Serverpreis je Tour mit Münzbild. Gesperrte Regionen sind ausgegraut und mit Schloss deaktiviert, ohne Expeditionsweiterleitung. Anschließende Fahrzeugauswahl in drei Spalten mit erhaltener Mehrfachauswahl und echter Tourdauer. Tourenzahl/Reserve und Startregeln unverändert. Drei gezielte Komponentenprüfungen erfolgreich; kein Gerätetest oder neuer Export. Noch nicht veröffentlicht. [Details](docs/ui/procurement-picker.md).

## Gesammelt: regionale Großauftragsgeschichten

Fünf individuelle Bildergeschichten mit je sechs neuen Motiven: Herstellung bis Ankunft/letzte Meter, danach ausschließlich ein regionaler Übergabeschein bei bestätigtem Abschluss. Szenen wechseln nach tatsächlich gelieferter Tonnage bei 0/20/40/60/80 Prozent; der Beleg erst bei 100 Prozent und Serverstatus completed. Keine farbige Wegmarkierung, kein separater Fortschrittsbalken im Detail. Tonnen und Zeiten bleiben außerhalb des Bildes. Flottenwechsel-Button und Prognosekarte entfernt; Neuberechnung ab nächster Tour unverändert. 30 JPEGs visuell/dekodiert geprüft und Blobintegrität verifiziert, vier Stufen-/Zuordnungstests erfolgreich. Vollständiger App-/Typ-/Gerätetest vor Release offen. [Bildergeschichten](docs/ui/project-stories.md). Nicht veröffentlicht.

## Gesammelt: Überstundenmodal

Ein Dialog mit 1/5/10, tatsächlicher Tonnage-/Restvorratsvorschau und direkter Bestätigung. „Frist sichern · X Punkte“ nennt den Serverbedarf, bei 0 deaktiviert; fehlende Prognose und unzureichender Vorrat gesondert behandelt. Überstundenauffüller vollständig aus diesem Dialog entfernt. Zwei reine Berechnungstests erfolgreich; UI-/Typprüfung vor Veröffentlichung offen. [Details](docs/ui/project-overtime.md).
