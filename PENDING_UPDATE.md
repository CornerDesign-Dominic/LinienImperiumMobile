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

## Gesammelt: stille Expeditionsabschlüsse

Noch nicht veröffentlicht; Veröffentlichung erst nach neuer Freigabe. Orts- und Regionsabschluss laufen ohne automatischen Dialog ab. Freie Ausbaupunkte stehen sofort im Handelsimperium zur manuellen Verteilung bereit. Alte reine Informationsmeldungen werden still entfernt; wiederholbare Expeditionsaufträge behalten ihre gemeinsame Lootabholung unter Einzelaufträge. Acht gezielte Backendtests erfolgreich; kein vollständiger App-/Gerätetest behauptet.

## Expeditionskopf und Ortsschilder – gesammelt, nicht veröffentlicht

- In der geöffneten Region ersetzt deren Name den allgemeinen Seitenkopf; der schwebende Doppeltitel entfällt.
- Fertige Orte ohne Haken; Kreisplus nur bei verfügbarer Bonusfahrt, Timer bei laufender Fahrt. Der volle Ortsname bleibt zugänglich und bricht sichtbar an Wortgrenzen um.
- Vier reine Statusprüfungen erfolgreich. Karten-Komponententest erweitert, lokal wegen fehlendem TypeScript-/React-Paket nicht ausführbar; noch kein neuer Export/Gerätetest. Details: [Reisekarten](docs/ui/expedition-journeys.md).
- Teil desselben Sammelstands wie stille Abschlüsse; keine Veröffentlichung vor erneuter Nutzerfreigabe.

## Botenstation und laufende Erträge – gesammelt, nicht veröffentlicht

- Bisheriger Stadthub heißt global Botenstation (Englisch Courier Station): Menüs, Überschriften, Hilfen, Zugänglichkeit, Belohnungsquellen und aktuelle Referenzen. Alte gespeicherte Meldungen werden nur bei der Ausgabe normalisiert; interne `hub`-Kennungen, Beträge und Eigennamen bleiben erhalten. Historische Archive unverändert.
- Die laufende Ertragsanzeige rundet kaufmännisch auf ganze Taler und nutzt die Sprachformatierung. Berechnung, Speicherung und Auszahlung bleiben unverändert präzise.
- 23 betroffene Runtime-Prüfungen erfolgreich; danach erweiterte Alttext-/Eigennamenprüfung und genaue Auszahlungsprüfung erneut erfolgreich. JSON, Übersetzungsplatzhalter, Syntax, Rundungsbeispiele und relative Links geprüft. UI-Harness lokal mangels React/TypeScript nicht ausführbar; vollständige UI-/Releaseprüfung bleibt vor Veröffentlichung erforderlich. Keine Veröffentlichung vor erneuter Nutzerfreigabe.
