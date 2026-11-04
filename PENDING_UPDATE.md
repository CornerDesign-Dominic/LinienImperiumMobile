# Offene Arbeiten und Veröffentlichungsstand

Stand: 04.11.2026. Veröffentlichtes Sammelpaket: `cf8038e133c46d5e5ab82fa832cf6898010b7843`.

## Letzte Veröffentlichung

[Mobile-preview-Lauf 41907917201](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41907917201) bestätigt Typprüfung, 320 bestandene Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA im Kanal preview. Keine neue APK und kein physischer Gerätetest.

Alle seit der vorherigen Freigabe gesammelten Änderungen sind veröffentlicht:

- Großauftragseinnahmen und XP werden bis zur bestätigten Abholung gesammelt; Überstunden folgen derselben Abrechnung. Altgutschriften werden nicht erneut ausgezahlt.
- Erledigte Großaufträge öffnen das Detail mit Übergabeschein und „Belohnung entgegennehmen“. Zusätzliche Prämien-/Informationskarten und direkter Abholbutton in der Liste entfallen.
- Einzelaufträge öffnen direkt die unveränderte Fahrzeugwahl; Auftragsdetailseite entfernt, Pinnadel ohne Kreis.
- Kundendetails zeigen vier Waren nebeneinander sowie kompakte Angaben zu Verkehr und Herkunft.
- Handelsimperium mit neuem Säulenbau und Kisten-Lorbeer-Bannern; kompakte Ausbaupunktedarstellung ohne Titel „Entwicklung“.
- Bildkorrekturen: Safran-Karawane und Tragekiste, sichere Kronenlande-Kutsche und zeremonielle Ankunft.
- Botenstation ohne normalen Lauftext „Verteilung läuft“; kompakte Beschaffungsdauer direkt neben der Stoppuhr.
- Garage regulär neun Plätze (3 × 3), bestehender Überhang bleibt bis zur manuellen Entfernung erhalten.

Das vorherige Paket `5e8010fc7cd47e337c5af62d5498b2841b85257d` bleibt einschließlich Ausbaupunkten, regionalen Geschichten und Überstundenmodal enthalten; das aktuelle Paket ersetzt die zuvor direkte Großauftragsabholung in der Liste durch den Detailablauf. Nachweise: [Prüfstand](TEST_REPORT.md), [Modulnotizen](docs/README.md). Neue Wünsche werden wieder bis zur nächsten ausdrücklichen Veröffentlichungsfreigabe gesammelt.

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

## Gesammelt: Punktestand nur im Verteilbutton

Separate Anzeige „Verfügbare Punkte“ in der oberen Handelsimperiumkarte inklusive Zeile entfernt, unabhängig vom Guthaben. Bei positiven Punkten bleibt der vorhandene Verteilbutton mit Anzahl; Basismaxima und Verteilmodal unverändert. Fünf gezielte Komponentenprüfungen erfolgreich. Noch nicht veröffentlicht.

## Gesammelt: Regionale Übergabescheine verziert

Alle fünf Abschlussbilder ersetzt: kleinere regional verzierte Pergamente auf sichtbaren Tischen, passende Schleifen und plastisch geprägte Wachssiegel; je zwei dezente regionale Dekostücke. Die echte, übersetzbare Beschriftung bleibt erhalten und wird in zurückhaltender sepiafarbener historischer Serifenschrift in der freien Papiermitte gesetzt. Kundenname bleibt dynamisch, Abschluss-/Abhollogik unverändert. Fünf Produktions-JPEGs 1200 × 800, Motive visuell geprüft, vollständig dekodiert und Upload-Blob-SHAs abgeglichen; Typprüfung erfolgreich. Kein physischer Gerätetest. Neue Prompt-Provenienz: assets/art/project-stories/receipt-redesign-prompts.json. Noch nicht veröffentlicht.

## Gesammelt: Ausbaupunkte im Levelaufstieg mit Bild

Ausbaupunkte werden im Levelaufstiegsmodal wie die Auffüller als Belohnungszeile mit dem vorhandenen Ausbaupunktebild, Bezeichnung und rechts ausgerichteter Anzahl dargestellt. Die bisherige reine Plus-Textzeile entfällt. Mehrere Aufstiege zeigen weiterhin korrekt drei Punkte je Level; Gutschrift und Verteilung unverändert. Fünf vorhandene Punkte-Komponentenprüfungen erfolgreich. Noch nicht veröffentlicht.

## Gesammelt: XP-Bild und feste Belohnungszahlen

Neues illustriertes XP-Gildenbuch mit Stern und Lorbeer ersetzt das Statistikpiktogramm im Belohnungsmodal. XP-Icon behält Originalfarben. Mengen stehen unter ihrer Bezeichnung und nutzen die volle freie Breite neben dem Bild mit fester 17-Pixel-Schrift, ohne automatische Verkleinerung; auch größere Talerbeträge. Auszahlung/Formatierung unverändert. Typprüfung und gezielter Belohnungstest inklusive großem Betrag erfolgreich. PNG 512 × 512 mit Transparenz visuell geprüft, dekodiert und Upload-Blob-SHA abgeglichen. Kein physischer Gerätetest. Noch nicht veröffentlicht.
