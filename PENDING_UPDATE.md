# Offene Arbeiten und Veröffentlichungsstand

Stand: 04.11.2026. Veröffentlichtes Sammelpaket: `5e8010fc7cd47e337c5af62d5498b2841b85257d`.

## Letzte Veröffentlichung

[Mobile-preview-Lauf 41854923005](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41854923005) bestätigt Typprüfung, 302 bestandene Tests, Android-Export, Firebase-Deployment, Live-API-Prüfung und Android-OTA im Kanal preview. Keine neue APK und kein physischer Gerätetest.

Veröffentlicht sind alle bis zur Freigabe vom 04.11.2026 gesammelten Anpassungen:

- Gemeinsamer Ausbaupunktevorrat aus Levelaufstiegen und Ortslieferungen, einmalige Übernahme alter Guthaben, ein Verteildialog und Teilverteilung.
- Kompakte Großauftragskarten mit Kunden-/Tonnenicons, direkter Prämienabholung und erhaltener Sortierung.
- Fünf regionale Großauftragsgeschichten mit insgesamt 30 neuen Bildern und Übergabeschein erst bei bestätigtem Abschluss; keine farbige Wegmarkierung. Flottenwechsel-Button und Prognosekarte entfernt, Neuberechnung ab nächster Tour erhalten.
- Überstundenmodal mit Punktebedarf zur Fristsicherung, Liefervorschau, direkter Bestätigung und serverseitigem Beleg gegen Mehrfachausgabe; Auffüller aus diesem Modal entfernt.
- Beschaffungsregionen mit kleinen Bildern und Münzpreis, gesperrte Regionen deaktiviert ohne Weiterleitung; Fahrzeug-Mehrfachauswahl in drei Spalten.
- Global kompaktere Karten-, Innen- und Seitenabstände bei erhaltenen Schrift-/Bildgrößen und Tippflächen.
- Bestätigungsbutton im Angebotsmodal „Aktualisieren“.

Die vorherigen veröffentlichten Änderungen bleiben enthalten; Nachweise: [Prüfstand](TEST_REPORT.md), [Modulnotizen](docs/README.md). Neue Wünsche werden ab jetzt bis zur nächsten ausdrücklichen Veröffentlichungsfreigabe gesammelt.

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



## Gesammelt: Ertragskarte ohne Lauftext

In der Botenstation entfällt der sichtbare Text „Verteilung läuft“ einschließlich seiner reservierten Zeile. Die Zeitleiste bleibt erhalten; die frei werdende Fläche kommt dem Hintergrundbild zugute. Abweichende Statushinweise (volle Kasse, fehlende Ware, wartender Einkauf), Zugänglichkeit, Berechnung und Abholen bleiben erhalten. Gezielter Quelldiff geprüft; noch nicht veröffentlicht.
