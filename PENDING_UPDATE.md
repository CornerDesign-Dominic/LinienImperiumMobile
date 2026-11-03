# Offene Arbeiten und Veröffentlichungsstand

Stand nach Veröffentlichung: 03.11.2026, Mobile-Commit `ca6f08d621f6f11aee0f57078dced1434fc6ffab`.

## Veröffentlichte Grundlage

Der [Mobile-preview-Lauf 41715219750](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41715219750) hat für diesen Commit Prüfung, Firebase-Deployment, Live-API-Prüfung und Android-OTA erfolgreich abgeschlossen. Eine neue APK wurde in diesem Lauf nicht gebaut.

Die bis dahin vorhandenen Sammelnotizen sind [archiviert](docs/archive/mobile-update-history.md). Alte Branch- oder „noch nicht veröffentlicht“-Vermerke darin sind keine offenen Freigaben. Bestehende Entwicklungsbranches bleiben erhalten; aus ihrem Namen allein wird kein offenes Paket abgeleitet.

## Veröffentlicht: Ausbaupunkte

Die globale Umbenennung zu Ausbaupunkte (englisch Upgrade points) und das Bauplan-/Säulenmotiv sind mit der bereits bereinigten Dokumentation veröffentlicht. Abschluss: 03.11.2026, 21:51 Uhr Europe/Berlin. Der obige Lauf bestätigt 273 Tests, Typprüfung, Android-Export, Firebase/Regeln, Live-API-Test und Android-OTA. Interne Speicherfelder und Spielwerte bleiben erhalten. Details: [Name und Bild](docs/ui/ausbaupunkte.md).

Weitere Änderungen werden wieder gesammelt. Eine neue Spielveröffentlichung erfolgt erst nach der nächsten ausdrücklichen Freigabe; dieser Nachweis startet keinen weiteren Release.

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
