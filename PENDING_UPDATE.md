# Offene Arbeiten und Veröffentlichungsstand

Stand: 06.11.2026. Veröffentlichtes Sammelpaket: `0c92e343874107085fbff6a64bd5732c5b21f497`.

## Letzte Veröffentlichung

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

Keine weiteren Änderungen aus diesem Arbeitsauftrag offen.

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
