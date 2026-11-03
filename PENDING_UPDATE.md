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

## Regionale Sonderauftragstitel – gesammelt, nicht veröffentlicht

- Kronenlande: Schmuck der Krone; Weite Ebenen: Edle Webwaren; Safranstraße: Kostbare Essenzen; Jadetal: Kunst aus Jade; Nordmark: Schätze des Nordens. Deutsch/Englisch und aktuelle Kategorie-/Startreferenzen sind angepasst.
- Kunden-ID bestimmt den Titel in Kategorie, Herkunft, Start und allen Auftragszuständen. Neue Sonderaufträge erhalten ihn; Altaufträge werden nur zur Anzeige normalisiert. Empfehlungen, Ladungen, Mengen, Fortschritte und Belohnungen bleiben erhalten. Keine neuen Bilder.
- Drei gezielte Backendfälle erfolgreich, einschließlich aller fünf Kunden sowie alter bereiter/laufender/abgeschlossener/abgelaufener Aufträge, Eigennamen und generischer Transporttexte. Übersetzungsprüfungen erweitert; lokaler UI-/TypeScript-Lauf mangels Abhängigkeiten offen. Veröffentlichung erst nach neuer Freigabe.

## Großauftragsreiter und Seltenheitsstreifen – gesammelt, nicht veröffentlicht

- Die große Laufend-Navigationskarte entfällt. Reiter Laufende und Aufträge zeigen tatsächliche aktive bzw. bereitliegende Großaufträge, nicht die Zahl ihrer Kategorien. Fertige Prämien bleiben unter Laufende erreichbar und werden separat markiert. Normaler Einstieg auf Aufträge, Startseiten-Belohnungslink auf Laufende, Rückkehr aus Details erhält den Reiter.
- Gemeinsamer markanter linker Streifen: Sonderauftrag Rare-Blau, Empfehlung Epic-Violett, vorhandene legendäre Eventkarten Legendary-Gold. Restlicher Rahmen neutral, Papierfläche und Bilder bleiben. Keine neuen Spielwerte oder Bilder.
- Feste Kategoriereihenfolge unabhängig von Vorräten: Seltenheit absteigend, bei gleicher Seltenheit Region 5 bis 1. Empfehlung Hafenverbund steht vor den fünf regionalen Sonderaufträgen; keine Sortierung nach Zeitpunkt oder Verfügbarkeit.
- Zwei gezielte Status-/Sortierprüfungen erfolgreich; bestehende Kategorien-/Start-Komponententests erweitert, lokal mangels React/TypeScript nicht ausführbar. JS-Syntax und Diff geprüft; kein neuer App-Export/Gerätetest. Veröffentlichung erst nach erneuter Freigabe. Details: [Großauftragsübersicht](docs/ui/project-category-overview.md).

## Laufende Großaufträge: gemeinsame Warenkarten – gesammelt, nicht veröffentlicht

- Akzeptierter Entwurf umgesetzt: aktive Karten oben, abgeschlossene mit offener Prämie unten in einer gemeinsamen Liste. Ruhige Pergamentfläche, neutraler Rand, schmaler Seltenheitsstreifen und vorhandene Kundenwarenbilder; Titel/Kunde/Menge/Strecke, Fortschritt und echte Serverprognose bei aktiven Karten.
- Fertige ohne Timer, mit technisch erzeugtem grünem ERLEDIGT-Stempel in reserviertem Platz und direkter Abholtaste. Bestehender autoritativer Claim, Doppeltippschutz, sichtbare Fehler, echte Belohnungsausgabe; nach Bestätigung verschwindet nur die Listenkarte, nicht die Historie. Kategorienreihenfolge und Reiterzähler bleiben erhalten.
- Vier gezielte Status-/Sortier-/Abholprüfungen erfolgreich. Komponentenprüfungen für Abholung, Fehler, Doppeltipps und Prognosegrenzen ergänzt, lokal mangels React/TypeScript nicht ausführbar. Kein neuer App-Export oder Gerätetest. Weiterhin Veröffentlichung erst nach erneuter Freigabe. Details: [Großauftragsübersicht](docs/ui/project-category-overview.md).

## Season – gesammelt, nicht veröffentlicht

Neuer Einstieg auf Start mit 30 aufsteigenden Stufen (1 oben, 30 unten), mittiger Timeline, Free links und Premium rechts. Alle Belohnungen sind eine vorläufige Vorschau aus vorhandenen Ressourcen. Kein Live-Fortschritt, Abholen oder Premiumkauf aktiviert. Vor Freischaltung sind Fortschrittsregeln, Laufzeit/Reset und Premiumzugang festzulegen. Details und Prüfumfang: [Season](docs/ui/season.md).

## Kundenwarenbilder und kompakte Angebote – gesammelt

Alle 15 Stammkundenwaren mit eigenen transparenten Motiven, bestehende fünf Grundwaren und fünf Edelwaren weiterverwendet. Gemeinsame Bildzuordnung in Angeboten, Auftragsdetails und Kundendetails. Halte-Pinnadel auf runder Fläche, ausgerichtete Fakten und dezenter Stammkunde-Hinweis. Keine Spielwertänderung. 25 Katalogwaren-Zuordnungen und 15 Alpha-Dateien geprüft, Serie visuell geprüft. Vollständige UI-/TypeScript-Prüfung lokal mangels Abhängigkeiten offen. Nicht veröffentlicht.

## Entwicklung und Punkteverteiler – gesammelt, nicht veröffentlicht

- Ein gemeinsamer Entwicklungsbereich, klar getrennte Einstiege für Levelpunkte und Ausbaupunkte; Bestände und Serveraktionen unverändert getrennt. Beide Dialoge verwenden gemeinsame Zeilen und Punkteanzeige, ohne Hinweisabsatz. Übersicht und Ist-/Vorschauwerte zeigen nur autoritative permanente Basiswerte; der globale Ressourcenheader behält Gesamtmaxima mit Boni.
- Top-Badge und Rest/Gesamt-Punkteanzeigen: helle Materialfläche, dünne Petrolkontur und petrolfarbener Text. Ebenso eindeutig vergleichbare Nach-Ausbau-Flächen im Imperiumsausbau-Detail und Verteilnetz. Aktive Tabs, Auswahlen, Erfolgs-/Warnzustände und Hauptaktionen unverändert; keine globale Grün-Ersetzung.
- Nur ein goldener Hinweis am Titel Imperiumsausbau, wenn tatsächlich ein Ausbau bezahlbar ist; Untergruppen-/Wertpunkte der Übersicht entfernt, Detailaktionen bleiben erreichbar.
- 13 bestehende Backendtests zu Basiswerten, Bonusabgrenzung, getrennten Punktebeständen und atomarer Verteilung erfolgreich. Gezielt erweiterte Komponententests (Basisvorschau, getrennte Pools, Entwurf, Fehler und Doppeltipps) lokal mangels React/TypeScript nicht ausführbar; kein App-Export/Gerätetest. Veröffentlichung erst nach neuer Freigabe. [Details](docs/ui/point-allocation.md).
