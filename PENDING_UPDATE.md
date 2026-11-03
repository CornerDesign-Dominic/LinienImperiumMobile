# Offene Arbeiten und Veröffentlichungsstand

Stand der Bestandsaufnahme: 03.11.2026, Mobile-Commit `22aa4dad756df65e71dd89dde98afdc6558f4b61`.

## Veröffentlichte Grundlage

Der [Mobile-preview-Lauf 41690415508](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41690415508) hat für diesen Commit Prüfung, Firebase-Deployment, Live-API-Prüfung und Android-OTA erfolgreich abgeschlossen. Eine neue APK wurde in diesem Lauf nicht gebaut.

Die bis dahin vorhandenen Sammelnotizen sind [archiviert](docs/archive/mobile-update-history.md). Alte Branch- oder „noch nicht veröffentlicht“-Vermerke darin sind keine offenen Freigaben. Bestehende Entwicklungsbranches bleiben erhalten; aus ihrem Namen allein wird kein offenes Paket abgeleitet.

## Zur Veröffentlichung freigegeben: Ausbaupunkte

Die globale Umbenennung und das Bauplan-/Säulenmotiv werden mit der bereits bereinigten Dokumentation veröffentlicht. Interne Speicherfelder und Spielwerte bleiben erhalten. Nach diesem Paket werden neue Änderungen wieder gesammelt, bis eine weitere ausdrückliche Veröffentlichung freigegeben wird. Status und Nachweis werden nach erfolgreichem Workflow ergänzt.

## Noch offene Punkte

| Bereich | Tatsächlicher Stand / nächster Schritt |
| --- | --- |
| Expeditionszeiten | `EXPEDITION_TEST_DURATION_MS = 15000` in `functions/src/engine.cjs` ist weiterhin aktiv. Vor einem regulären Spielbetrieb Testverkürzung bewusst aufheben und normale Laufzeiten prüfen. Dies ist hier nur dokumentiert. |
| Regionale Geschenke | Weiterhin Testpreis 10 Taler und je 20 % auf die fünf Gebietskarten (`functions/src/gifts-runtime.js`). Vor regulärer Balance bewusst festlegen; nicht mit Expeditions-Fundchancen verwechseln. |
| Echtgeldkäufe | Großhändler zeigt Vorschaupakete; echte Kaufbuttons sind deaktiviert. Store-Produkte, Billing und serverseitige Kaufprüfung fehlen. Einzelheiten: [Premium-Shop](docs/ui/premium-shop.md). |
| Pyramiden-Event | Legendäre Passkarte bleibt Platzhalter; wiederkehrende Gemeinschaftsrunden und produktive Skalierung sind noch nicht abgeschlossen. [Eventregeln und Grenzen](docs/events/pyramid.md). |
| iOS | Gemeinsame App vorbereitet; signierter iPhone-Build und Gerätetest sind gesonderte Arbeit. |
| Startangebote | Früherer Vorschlag für kleinere Einstiegsangebote bleibt unbeschlossen. Nicht als aktuelle Regel übernehmen; bei Wiederaufnahme gegen die heutigen, für beide Verkehrsarten nutzbaren Transportkarten prüfen. |

Die Tabelle hält belegte Restpunkte fest; sie beauftragt keine neue Spielfunktion. Neue Wünsche erst mit klarem Umfang und Status aufnehmen.

## Pflege und Freigabe

- Einträge beschreiben nur offene Entscheidungen, bekannte Grenzen oder ein konkretes noch auszurollendes Paket.
- Code in `main`, geprüfter Build und tatsächlich ausgerolltes Backend/OTA sind unterschiedliche Zustände. Bei einer Veröffentlichung Commit und erfolgreichen Workflow verlinken.
- Nach Abschluss den Eintrag entfernen oder mit Nachweis in die Historie übernehmen; keine vollständigen Modulbeschreibungen hier duplizieren.
- Spielveröffentlichungen erfolgen weiterhin auf ausdrücklichen Wunsch über den dokumentierten Workflow. Dokumentationspflege startet keinen manuellen Release und setzt keinen Veröffentlichungsmarker.
