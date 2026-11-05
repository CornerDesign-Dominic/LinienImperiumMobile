# Offene Arbeiten und Veröffentlichungsstand

Stand: 05.11.2026. Veröffentlichtes Sammelpaket: `c029782e864e94958250a0e8728ef7a737961b68`.

## Letzte Veröffentlichung

[Mobile-preview-Lauf 42094829858](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42094829858) bestätigt Typprüfung, 323 bestandene Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA im Kanal preview. Keine neue APK und kein physischer Gerätetest.

Alle seit der vorherigen Freigabe gesammelten Änderungen sind veröffentlicht:

- Flottenwahl für Großaufträge mit fünf Fahrzeugbildern pro Reihe, serverseitiger Dauer-/Vergütungsprognose und übersichtlichen Angaben zu Fracht, Strecke und Frist.
- Vereinfachtes Botenmodal ohne technische Nummer, individuellen Kilometerstand und doppelten Ausbauhinweis; kumulative Botenstrecke in der Statistik.
- Fünf neu verzierte regionale Übergabescheine mit Schleife, Wachssiegel, Tischdekoration und passender sepiafarbener Serifenschrift.
- Ausbaupunkte nur im Verteilbutton der Handelsimperiumkarte; Levelaufstieg zeigt die Punkte mit ihrem Bild.
- Neues illustriertes XP-Gildenbuch und feste größere Belohnungszahlen; Taler-Belohnungen und Einnahmenvorschauen ohne Nachkommastellen.

Die vorherigen Veröffentlichungen bleiben enthalten. Nachweise: [Prüfstand](TEST_REPORT.md), [Modulnotizen](docs/README.md). Neue Wünsche werden bis zur nächsten ausdrücklichen Veröffentlichungsfreigabe gesammelt.

## Gesammelt, noch nicht veröffentlicht

Keine weiteren Änderungen aus diesem Arbeitsauftrag offen. Das aktive Seasonpaket einschließlich der vorherigen UI-Anpassungen wurde veröffentlicht: [Mobile preview – Lauf 42125289468](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/42125289468), Spielcode `b10dca11fe5edb4ffbde3ad17e9ac4024d9e81ed`.

## Noch offene Punkte

| Bereich | Tatsächlicher Stand / nächster Schritt |
| --- | --- |
| Expeditionszeiten | `EXPEDITION_TEST_DURATION_MS = 15000` in `functions/src/engine.cjs` ist weiterhin aktiv. Vor einem regulären Spielbetrieb Testverkürzung bewusst aufheben und normale Laufzeiten prüfen. Dies ist hier nur dokumentiert. |
| Regionale Geschenke | Weiterhin Testpreis 10 Taler und je 20 % auf die fünf Gebietskarten (`functions/src/gifts-runtime.js`). Vor regulärer Balance bewusst festlegen; nicht mit Expeditions-Fundchancen verwechseln. |
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

In den Einstellungen vergibt das Testwerkzeug `testHermes` jeweils 1.000 Hermes-Siegel. Der Betrag ist serverseitig festgelegt; Echtgeldkäufe bleiben deaktiviert.
