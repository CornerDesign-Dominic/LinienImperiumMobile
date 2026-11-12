# Offene Arbeiten und Veröffentlichungsstand

Stand: 11.11.2026. Letzte Server-/App-Veröffentlichung (OTA): `f8594517cfb3a0169620c8c53dfb5d3f3eb8b8f8`; letzte neue APK: `ab10d0185f3bc296247a5953f261336952ef1193`.

## Letzte Veröffentlichung

Sammelpaket PR #29 erfolgreich veröffentlicht: [Mobile-preview-Lauf 43109508779](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/43109508779), Spielcode `f8594517cfb3a0169620c8c53dfb5d3f3eb8b8f8`. TypeScript, 422/422 Tests, Android-Export, Backend und Firestore-Regeln, Live-API-Prüfung und Android-OTA im Kanal preview erfolgreich. Keine neue APK und kein physischer Gerätetest.

- Handelsimperium: Hauptsitzbild vollständig eingepasst; gemalte Münztruhe, Warenkiste und Karte/Kompass im Imperiumsausbau.
- Startseite: grüne Aktionspunkte für volle Botenstation und verfügbare Stammkundenverbesserungen.
- Großauftrag: Überstundenwerte 1/5/10/20 und direkt auswählbarer Teilbetrag mit verfügbar/benötigt bei ungenügenden Punkten; Warnhinweis bleibt erhalten.
- Expeditionsorte: sichtbarer Haken im hellgrünen Kreis, Paket für offene Abschlusslieferungen, Lupe beim aktuellen Erkundungsort und Stoppuhr für laufende Lieferungen.

## Vorherige Veröffentlichung – UI-Sammelpaket

Das Sammelpaket aus PR #28 ist über [Mobile-preview-Lauf 42721205734](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42721205734) erfolgreich veröffentlicht: TypeScript, alle 418 Tests, Android-Export, Firebase-Backend und Regeln, Live-API-Prüfung und Android-OTA im Kanal preview. Veröffentlichter Spielcode: `60ef661a5eb826930f958fb0e889b7a08a7b94b2`. Keine neue APK und kein physischer Gerätetest.

- Transportmittelauswahl: Dauer und Ertrag mit Stoppuhr/Taler, ohne wiederholten Fahrzeugnamen über dem Startbutton.
- Expeditionsorte: Erkundung → Abschlusslieferung → Ort erschlossen; passende Symbole, Texte, Lieferdauer und beschriftete Belohnungsitems. Automatische Auszahlung und Freischaltungen bleiben erhalten.
- Globale Titelleiste rund 27 % flacher, Zierlinien vertikal mittig und symmetrische Seitenabstände erhalten.
- Auffüller und Zahnräder aller Seltenheiten ohne Hintergrundkachel und Rahmen; transparente Bilddateien bestätigt.

## Vorherige Veröffentlichung – Transportkarten

Alle 25 Transportkarten haben ihre freigegebenen Eigennamen, Titel und neuen Bilder. Packesel **Pepe**, Lian ohne Horn, Eira mit kleineren Pfoten und Niva mit schlankerem Schweif sind enthalten. Karten-IDs, Besitz, Ausbauten und Spielwerte bleiben erhalten; bestehende und geparkte Fahrzeuge erhalten die neuen Namen. [Mobile-preview-Lauf 42524779921](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42524779921): TypeScript, 418 Tests, Android-Export, Server-Deployment, Live-API-Prüfung und Android-OTA erfolgreich. Alle 25 Identitäten zusätzlich live geprüft. Die installierte APK wird per OTA aktualisiert; keine neue APK und kein physischer Gerätetest.

## Vorherige Veröffentlichung – Spielrahmen

Der vereinheitlichte Spielrahmen ist als Android-OTA veröffentlicht: ruhiges Petrol für Header und Navigation, gleichmäßige Header-Abstände, schlanker XP-Balken, kompakter Seitenkopf und kontinuierlich verblassende Goldlinien. [OTA und Release-Prüfungen](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42418929844) erfolgreich. Der dortige erste APK-Versuch ist durch den [erfolgreichen separaten APK-Build](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42420006604) ersetzt. Für die passende Farbe der Android-Drei-Tasten-Leiste ist die neue signierte APK (VersionCode 2) erforderlich; die bestehende Signierung bleibt erhalten. Kein physischer Gerätetest. Details: [Prüfstand](TEST_REPORT.md).

## Vorherige Veröffentlichung

Das Sammelpaket aus PRs #22–#27 ist über [Mobile-preview-Lauf 42368749943](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42368749943) erfolgreich veröffentlicht: TypeScript, 417 Tests, Android-Export, Firebase-Deployment mit Live-API-Prüfung und Android-OTA im Kanal preview. Keine neue APK, kein neuer physischer Gerätetest.

- Direkte Endlosfunde enthalten nur Zahnräder, ohne zusätzliche Splitter, Kapazitätsmodule oder Firmenausbau-Items. Doppelkarten geben weiterhin Splitter.
- Einheitliche Auftragsseltenheiten: frei Common, Kunde Uncommon, Sonder Rare, Empfehlung Epic. Kundenaufträge bleiben unabhängig von ihrer Herkunft wirtschaftlich gleich.
- Der falsch eingeführte Imperiumausbau entfällt samt einmaliger Rückerstattung gültiger Altinvestitionen. Vorhandene Kundenverbesserungen steuern regionale Sonder-/Empfehlungsfunde; normale Kundenaufträge bleiben nach ausdrücklicher Klärung bei 5 % Börse und 20 % Expedition.
- 30 Sekunden serverseitige Reservierung mit Countdown während der Fahrzeugauswahl, Schutz über den Refresh und Freigabe beim Schließen.
- Materialbeschaffungsbeute erst bei Abholung im Modal; Materialien suchen, neu platzierter Einsammeln-Button und illustriertes Abholbuch mit Statistik.
- Boten zeigen m/s und m bei gleichem Zahlenwert sowie kg bei zehnfachem Tonnenwert; Wirtschaft und Laufzeiten bleiben gleich. Einsatzlämpchen entfernt, Skin-Auswahl erhalten.
- Randfüllende Pergament-Titelleiste ohne Plakette; zentriertes Hauptsitzbild mit mehr Abstand; verfügbare Kartenverbesserungen ohne Fehlmengen-/Erfolgsbanner; glatte Kartentrenner und neues Beziehungsbuch.

## Vorherige Veröffentlichung – Wombat-Paket

Das Paket **Wombat-Boten** ist über [Mobile-preview-Lauf 42288523886](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42288523886) erfolgreich veröffentlicht: TypeScript, 377 Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA im Kanal preview. Es enthält Waldwombat, Steinwombat, Postwombat, Kronenbote und Küstenwombat beim Großhändler unter Skins für **insgesamt 250 Hermes-Siegel**. Der Standard bleibt kostenlos; Auswahl gilt für alle Boten. Live geprüft: unzureichendes Guthaben, autoritativer Gesamtpreis, alle fünf Freischaltungen, doppelte Anfrage/erneuter Kauf ohne Doppelabbuchung, Auswahl aller Skins und Erhalt nach erneutem Laden/Reset. Browserdarstellung bei 320/360/390/430px geprüft. Keine neue APK und kein physischer Gerätetest.

## Vorheriges Sammelpaket

[Mobile-preview-Lauf 42235427062](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42235427062) bestätigt TypeScript, 370 bestandene Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA im Kanal preview. Keine neue APK und kein physischer Gerätetest.

Veröffentlicht sind alle bis zu dieser Freigabe gesammelten Änderungen aus PRs #16–#21:

- Season-Reiter oben, vereinfachter Belohnungsweg, Premiumkauf beim Großhändler für 1.000 Hermes-Siegel und normale Kundenaufträge für je 500 zusätzliche Punkte nach dem regulären Weg.
- Endlosexpeditionen mit regionalen Punktkosten, direkten Karten-/Zahnradfunden und Kundenaufträgen; selteneren Sonder-/Empfehlungsaufträgen, ausbaubarer Fundchance und 50/50-Verkehrsart bei neuen Kundenaufträgen.
- Universelle Handelstruhe für 200 Hermes-Siegel, freie Truhe je Regionsabschluss sowie Auffüller bis zum persönlichen Maximum.
- Einzelaufträge zahlen vollständige Vergütung, XP, Beute und Kundenfortschritt erst beim Einsammeln aus; alte bereits ausgezahlte Fahrten werden nicht doppelt bezahlt.
- Durchgehender Seitenhintergrund, halbierte äußere Seitenabstände, Stammkunden-Aufwärtspfeil und grüner Materialbeschaffungspunkt, bereinigte Imperiumsausbau-Anzeigen.
- Überarbeitete Großauftragsdarstellung, vereinfachtes Überstundenmodal und einheitliche Belohnungsüberschriften ohne Abschlusszähler; offenes Schloss für neue Botenplätze.

Nachweise: [Prüfstand](TEST_REPORT.md), [Expeditions-/Truhenbalance](docs/gameplay/expedition-trade-chest-balance.md), [Einzelauftragsauszahlung](docs/gameplay/single-order-rewards.md). Neue Wünsche werden bis zur nächsten ausdrücklichen Veröffentlichungsfreigabe gesammelt.

## Gesammelt, noch nicht veröffentlicht

Sammelbranch: `batch/november-visual-polish`. Noch nicht veröffentlicht.

- Expeditionskarte: Haken und Kreis verwenden dieselbe goldene Kontur und dezente Hintergrundfläche wie Paket und Lupe; separate grüne Füllung entfernt. Fünf vorhandene Karten-Darstellungstests erfolgreich.

## Noch offene Punkte

| Bereich | Tatsächlicher Stand / nächster Schritt |
| --- | --- |
| Expeditionszeiten | `EXPEDITION_TEST_DURATION_MS = 15000` in `functions/src/engine.cjs` ist weiterhin aktiv. Vor einem regulären Spielbetrieb Testverkürzung bewusst aufheben und normale Laufzeiten prüfen. Dies ist hier nur dokumentiert. |
| Handelstruhen | Universeller Vorrat und Kaufpreis 200 Hermes-Siegel. Der bisherige Testpool mit je 20 % auf die fünf Gebietskarten bleibt bestehen; endgültige Seltenheitsverteilung gesondert festlegen. Nicht mit direkten Expeditions-Fundchancen verwechseln. |
| Echtgeldkäufe | Großhändler zeigt Vorschaupakete; echte Kaufbuttons sind deaktiviert. Store-Produkte, Billing und serverseitige Kaufprüfung fehlen. Einzelheiten: [Premium-Shop](docs/ui/premium-shop.md). |
| Pyramiden-Event | Legendäre Passkarte bleibt Platzhalter; wiederkehrende Gemeinschaftsrunden und produktive Skalierung sind noch nicht abgeschlossen. [Eventregeln und Grenzen](docs/events/pyramid.md). |
| iOS | Gemeinsame App vorbereitet; signierter iPhone-Build und Gerätetest sind gesonderte Arbeit. |
| Season | Aktive Testseason ist veröffentlicht. Produktionsbalance, endgültigen Loot und Entfernung der Testwerkzeuge vor einem regulären Echtgeldbetrieb gesondert festlegen. [Season](docs/ui/season.md). |
| Expeditionsbilder | Audit: fünf Panoramen mit je 2172 × 724 Pixeln werden auf mehrere Bildschirmbreiten vergrößert; kein globaler Unschärfefilter, keine höher aufgelöste Originaldatei nachgewiesen. Kein Bildtausch beauftragt. |
| Startangebote | Früherer Vorschlag für kleinere Einstiegsangebote bleibt unbeschlossen. Nicht als aktuelle Regel übernehmen; bei Wiederaufnahme gegen die heutigen, für beide Verkehrsarten nutzbaren Transportkarten prüfen. |

Die Tabelle hält belegte Restpunkte fest; sie beauftragt keine neue Spielfunktion. Neue Wünsche erst mit klarem Umfang und Status aufnehmen.

## Pflege und Freigabe

- Einträge beschreiben nur offene Entscheidungen, bekannte Grenzen oder ein konkretes noch auszurollendes Paket.
- Code in `main`, geprüfter Build und tatsächlich ausgerolltes Backend/OTA sind unterschiedliche Zustände. Bei einer Veröffentlichung Commit und erfolgreichen Workflow verlinken.
- Nach Abschluss den Eintrag entfernen oder mit Nachweis in die Historie übernehmen; keine vollständigen Modulbeschreibungen hier duplizieren.
- Spielveröffentlichungen erfolgen weiterhin auf ausdrücklichen Wunsch über den dokumentierten Workflow. Dokumentationspflege startet keinen manuellen Release und setzt keinen Veröffentlichungsmarker.

Auf der separaten Testwerkzeug-Seite vergibt `testHermes` jeweils 1.000 Hermes-Siegel. Der Betrag ist serverseitig festgelegt; Echtgeldkäufe bleiben deaktiviert.
