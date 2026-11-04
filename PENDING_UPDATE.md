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

## Gesammelt: Safranstraßen-Karawane korrigiert

Das dritte Geschichtsbild (40–59 %) ist ersetzt: Der führende Kamelkörper samt Kopf und die folgende Karawane bewegen sich eindeutig in derselben Richtung wie der Führer. Landschaft, Licht und charakteristische Ladung bleiben erhalten. Einzelmotiv mit eingebauter Bildbearbeitung korrigiert, visuell geprüft, JPEG 1200 × 800 vollständig dekodiert und Upload-Blobintegrität geprüft. Noch nicht veröffentlicht.

## Gesammelt: Großauftragsabschluss nur im Detail abholen

Erledigte Listenkarten zeigen nur den Stempel; Antippen öffnet den Auftrag. Im abgeschlossenen Detail bleiben Übergabeschein und direkt darunter „Belohnung entgegennehmen“. Zusätzlicher Vertragskopf, Abschlussprämienvorschau und untere Umfang-/Belohnungs-/Herkunftskarten entfallen. Erst eine bestätigte Abholung öffnet die echte Belohnungsausgabe; synchroner Doppeltippschutz und sichtbare Fehler bleiben im Detail. Neun gezielte Listen-/Detail-/Status-/Abholtests und TSX-Syntaxprüfung erfolgreich; voller Typ-/Export-/Gerätetest nicht belegt. Noch nicht veröffentlicht. [Details](docs/ui/project-category-overview.md).

## Gesammelt: Großauftragseinnahmen erst beim Abholen

Sonder- und Empfehlungsaufträge sammeln neu verdiente Fracht-Taler und Transport-XP bis zum erfolgreichen Abschluss; erst „Belohnung entgegennehmen“ schreibt sie gemeinsam mit der Abschlussprämie gut. Das gilt für passive Lieferungen und Überstunden. Betriebskosten bleiben bei Lieferung fällig, Transportstatistik zählt weiterhin reale Mengen und Touren. Aktive Altaufträge behalten bereits gezahlte Anteile; fertige Altaufträge ohne neues Guthaben erhalten nur ihre noch offene Prämie. Fehlgeschlagene/abgelaufene Aufträge können das neue Guthaben nicht abholen. Ein serverseitiger Claim-Beleg und die bestehende Transaktion schützen Auszahlung und Levelaufstiege vor Wiederholung. Das Belohnungsmodal zeigt die echten Gesamt-Taler und XP.

Sieben neue Backend-/Cloud-Belegtests, eine neue XP-Modalprüfung und die bestehenden Mobile-/Tourtests erfolgreich. Erweiterter Lauf inklusive Kartenprüfungen: 81/82 erfolgreich; der einzige Fehler ist die im lokalen Textcheckout fehlende vorhandene Fahrzeugbilddatei navigator. TypeScript-Prüfung mit vorhandenem Abhängigkeitensatz erfolgreich. Kein neuer App-Export oder physischer Gerätetest; die vollständige Releaseprüfung folgt vor Veröffentlichung. Details: [Tourabrechnung](TOUR_RULES.md). Noch nicht veröffentlicht.

## Gesammelt: Einzelaufträge direkt zuweisen

Angebote und gespeicherte Einzelaufträge öffnen direkt das unveränderte Fahrzeugwahlmodal; die bisherige Detailseite samt Route entfällt. Schließen ohne Start erhält Reiter/Gruppe/Scrollposition und verbraucht nichts. Verschwundene oder inzwischen gestartete Angebote schließen die Auswahl sicher. Laufende Karten öffnen direkt die vorhandene Ersatzfahrzeugauswahl für Folgetouren. Pinnadel ohne Kreis/Rand/Hintergrund bei erhaltener 44-Pixel-Tippfläche und getrennter Halteaktion. Keine weiteren Inhalte in Liste oder Modal. Typprüfung und 18 gezielte Tests erfolgreich, kein neuer Export/Gerätetest. Noch nicht veröffentlicht.

## Gesammelt: Kundenwaren und Herkunft

Kundendetails zeigen drei normale Produkte plus Edelware nebeneinander mit bestehenden Bildern und vollständigen Namen. Verkehr und kanonische Herkunft stehen darunter in zwei kompakten Feldern mit Transport-/Expeditionsicon. Drei Komponentenprüfungen und TSX-Syntax erfolgreich, native Layoutprüfung offen. Noch nicht veröffentlicht. [Details](docs/ui/customer-cargo.md).

## Gesammelt: Handelssitz im Handelsimperium

Neue obere Karte mit prächtigem Säulenbau und einheitlichen Kisten-Lorbeer-Siegeln auf burgunderroten Bannern; Bild und kompakter Punkteteil verbunden. Titel „Entwicklung“ entfernt. Tatsächlicher gemeinsamer Ausbaupunktestand, permanente Basismaxima und bestehende manuelle Verteilung bleiben maßgeblich; null Punkte erzeugen keinen Verteilbutton. Hero maximal 210 logische Pixel, unterer Imperiumsausbau unverändert. Typprüfung und zwölf gezielte Komponententests erfolgreich; Produktions-JPEG visuell/dekodiert und Upload-SHA geprüft. Kein neuer Geräte-/Exporttest. Noch nicht veröffentlicht. [Details](docs/ui/point-allocation.md).

## Gesammelt: Safranstraßen-Tragekiste korrigiert

Das fünfte Geschichtsbild (80–99 %) ist ersetzt: Die geschlossene, verzierte Kiste hängt mit erkennbarem Abstand unter einer durchgehenden Schulterstange. Zwei kräftige Seilschlingen um und unter der Kiste tragen die Last; Holzstangen durchdringen weder Kistenkörper noch Beschläge. Gewürzhof, Essenzflaschen und empfangender Händler bleiben erhalten. Motiv und Tragemechanik visuell geprüft, Produktions-JPEG 1200 × 800 vollständig dekodiert und Git-Blob-SHA beim Upload abgeglichen. Kein neuer App-Export oder Gerätetest. Noch nicht veröffentlicht.
