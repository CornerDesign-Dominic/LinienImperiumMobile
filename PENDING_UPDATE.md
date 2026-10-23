## Erfolgreich veröffentlicht am 23.10.2026

Das gesamte seit der letzten Veröffentlichung gesammelte Garage-/Flotten-/Sammlungspaket wurde veröffentlicht. GitHub Actions Mobile preview, Lauf 39939509041, erfolgreich abgeschlossen: Typprüfung, 177 Tests, Android-Export, Firebase-Server und Regeln, Live-API-Smoke-Test und Android-OTA im Kanal preview. Release-Commit: e5f026dc94399708876290e1aee506215be895ca. OTA-Veröffentlichung am 23.10.2026 um 09:35 Uhr (Atlantic/Cape_Verde). Keine neue APK erforderlich. Die folgenden Sammelvermerke beschreiben den historischen Stand vor dieser Veröffentlichung.

Workflow: https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39939509041

---

## Gemeinsame Kartenauswahl in Garage und Flotte – neu gesammelt, nicht veröffentlicht

- Auswahlmodale verwenden den Seltenheits-Dropdown und das Dreispaltenraster der Sammlung.
- Jede Karte zeigt römische Stufe, Bild, Name und die drei Iconwerte Kapazität, Durchschnittsgeschwindigkeit und Betriebskosten.
- Nur freigeschaltete Karten; verfügbare zuerst, bereits belegte danach abgedunkelt und gesperrt mit Schloss und Kontextangabe.
- Garage sperrt dort verwendete Karten; Flotte sperrt nur die Karten der aktuell ausgewählten Flotte. Auch beim Wechseln gilt diese Auswahlregel.
- Typprüfung, alle 177 Tests und Browserbedienung bei 320/390/430 px erfolgreich; Deutsch/Englisch geprüft.
- Details: `docs/ui/shared-card-pickers.md`. Kein physischer Gerätetest.
- Nur Sammelbranch, keine Veröffentlichung.

---

## Gemeinsame Fahrzeugdetails in Garage und Flotte – neu gesammelt, nicht veröffentlicht

- Gemeinsamer Aufbau mit Sammlung: römische Stufe, Bild/Name, Bonussatz mit Hilfe, Geschwindigkeit, Kapazität und Betriebskosten.
- In Garage/Flotte kompakte Abschnitte mit Trennlinien statt einzelner Cards; unten Wechseln/Entfernen, kein Verbessern.
- Sammlung mit ihren Cards und Verbesserungsmodal beibehalten; Garagenstatus und Betriebsstatistik weiter sichtbar.
- Garagenwechsel über einen einzigen Servervorgang, auch bei voller Garage, mit Positionserhalt und weiter wirksamen Einsatz-/Reservierungssperren.
- Typprüfung, alle 177 Tests, Browserbedienung bei 320/390/430 px und Android-Export erfolgreich. Deutsch/Englisch geprüft.
- Details: `docs/ui/unified-context-card-details.md`. Kein physischer Gerätetest.
- Gemeinsam mit den übrigen neuen Anpassungen im Sammelbranch; keine Veröffentlichung vor erneutem Go.

---

## Kartendetails: Betriebskosten und „Erweitert“ – neu gesammelt, nicht veröffentlicht

- Fahrzeugdaten-Card in Betriebskosten umbenannt und auf den Kostenwert in M/km reduziert.
- Einsatzangabe zu Regional-/Fernverkehr entfernt.
- Kapazitätscard: „Module“ heißt nun „Erweitert“, Wert bleibt unverändert.
- Deutsch/Englisch, Typprüfung und vier Übersetzungstests erfolgreich.
- Gemeinsam mit den neuen Garage-/Sammlungskarten sammeln; keine Veröffentlichung.

---

## Neues Sammelpaket: einheitliche Garage-/Sammlungskarten – nicht veröffentlicht

Nach der erfolgreichen Veröffentlichung des vorherigen Pakets neu gesammelt am 22.10.2026:

- Geschwindigkeitsrang aus den Sammlungskarten entfernt. Nur Kapazität, Durchschnittstempo und Betriebskosten mit Icons bleiben.
- Garage nutzt dieselbe Kartenkomponente, römische Stufen und das enge Dreispaltenraster wie die Sammlung.
- Zehn Garagenplätze, Fahrzeugauswahl, Detailöffnung und Herausnehmen unverändert funktionsfähig. Flottenauswahl behält ihre bisherige Kurzansicht.
- Typprüfung, alle 174 Tests, Browserbedienung bei 320/390/430 px und Android-Export erfolgreich; Deutsch/Englisch geprüft.
- Details: `docs/ui/shared-garage-collection-cards.md`. Kein physischer Gerätetest.
- Nur im Sammelbranch `batch/company-improvements`; erst nach erneutem ausdrücklichem Go veröffentlichen.

---

## Gesamtpaket Firma und Fahrzeugkarten – veröffentlicht am 22.10.2026

Release: `d4ed991e73f4718deb243f39527c18700f0ccab9` · [Erfolgreicher Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39844041479).

Der gesamte Sammelstand `batch/company-improvements` ist auf ausdrücklichen Wunsch veröffentlicht. Mit dem aktuellen Hauptstand einschließlich der Expeditionsschilder konfliktfrei zusammengeführt. Die nachfolgenden Abschnitte „gesammelt/nicht veröffentlicht“ beschreiben historische Vorbereitungsschritte dieses Pakets; maßgeblich ist dieser oberste Releaseeintrag.

Enthalten:
- Kompakte Firmenverbesserungen mit Regional-/Fernverkehr-Reitern, Vorher/Nachher und Kaufmodal.
- Sammlung ohne Zusatzüberschrift, mit Seltenheitsdropdown, klappbaren Gruppen, römischer Kartenstufe sowie kompakten Iconwerten für Kapazität, Geschwindigkeitsrang, Durchschnittstempo und Betriebskosten.
- Engere Kartenabstände und halbierter allgemeiner seitlicher Seitenrand; Expeditionslayouts bleiben erhalten.
- Vereinfachte Kartendetails: Bonus als Satz mit Stufenmodal, eigene Geschwindigkeits- und Kapazitätscard, zentrale Verbesserung unten mit Kosten, Bestand und Ergebnisvorschau.
- Technische Bildskalierungsanpassung für die große Fahrzeugansicht; unveränderte 1024-Pixel-Originale. Android-Schärfe nach Veröffentlichung am Gerät prüfen.
- Aktuelle Event-Erweiterung und Expeditionsschilder vollständig erhalten.

Gesamtprüfung vor Veröffentlichung: TypeScript, alle 174 Tests und Android-Export erfolgreich. Mobile Browserprüfungen der geänderten Oberflächen sind in den UI-Notizen dokumentiert. Kein physischer Gerätetest. Backend-Deployment, Live-API-Prüfung und Android-OTA sind erfolgreich abgeschlossen. EAS meldet „Published“. Keine neue APK erforderlich. Physischer Gerätetest durch den Nutzer steht aus.

---

## Fahrzeugbilder: große Anzeige geprüft und Skalierung angepasst – gesammelt

- Alle 25 Fahrzeugbilder besitzen 1024 × 1024 Pixel. Original visuell geprüft; für die bestehende Detailansicht voraussichtlich ausreichend. Keine Bilder neu erstellt oder verändert.
- Bildmontage erst nach echter Layoutmessung; große Android-Ansicht mit explizitem Skalierungsmodus statt automatischer Softwareverkleinerung.
- Typprüfung, 13 relevante Tests, Browserdarstellung mit dreifacher Pixeldichte und Android-Export erfolgreich.
- Ursache auf dem tatsächlichen Android-Gerät nicht abschließend gemessen; native Schärfe nach Veröffentlichung am Handy prüfen.
- Details: `docs/ui/vehicle-art-sharpness.md`. Nicht veröffentlicht.

---

## Kartendetails: gemeinsames Verbesserungsmodal – gesammelt, nicht veröffentlicht

- Ein Button „Verbessern“ ganz unten öffnet die gemeinsame Verbesserung für Kartenstufe, Kapazität und Geschwindigkeitsrang.
- Je Bereich Vorher/Nachher, Materialkosten, eigener Bestand, Fehlmenge und bewusste Upgrade-Aktion; aktuelle Höchststufen und unzureichende Vorräte sperren den jeweiligen Ausbau.
- Splitterfortschritt wird angerechnet. Werte/Bestände aktualisieren sich nach Erfolg im geöffneten Modal. Fehlerhinweis und Schutz vor Doppelbetätigung enthalten.
- Servervorschauen für Kapazität und Tempo verwenden die tatsächlichen Spielfunktionen; vorhandene Befehle und Kosten unverändert.
- Deutsch/Englisch. Typprüfung, alle 174 Tests, Browserbedienung bei 320/390/430 px und Android-Export erfolgreich.
- Details: `docs/ui/vehicle-upgrade-modal.md`. Kein physischer Gerätetest.
- Sammelbranch `batch/company-improvements`; keine Veröffentlichung vor ausdrücklichem Go.

---

## Kartendetails: Kartenstufen-Erweiterungscard entfernt – gesammelt

- Alte separate Card zum Erweitern der Kartenstufe inklusive Fortschritt, Shardbestand und Button entfernt.
- Stufe über dem Bild und Bonus-Stufenübersicht bleiben erhalten.
- Typprüfung erfolgreich. Nicht veröffentlicht.

---

## Kartendetails: separate Geschwindigkeitsrang-Card entfernt – gesammelt

- Alte Geschwindigkeitsrang-Card mit Ausbauanzeige entfernt.
- Rang bleibt rechts oben in der Geschwindigkeitscard sichtbar.
- Typprüfung erfolgreich. Nicht veröffentlicht.

---

## Kartendetails: Kapazität verschoben und vereinfacht – gesammelt, nicht veröffentlicht

- Kapazitätscard direkt unter der Geschwindigkeit.
- Aktuelle Kapazität und eingesetzte Module/Limit bleiben sichtbar.
- Erweiterungsbutton, verfügbarer Modulbestand und Erklärung der Modulwirkung entfernt.
- Typprüfung erfolgreich; weiterhin nur im Sammelbranch.

---

## Kartendetails: eigene Geschwindigkeitscard – gesammelt, nicht veröffentlicht

- Direkt unter der Bonus-Card: Geschwindigkeit mit Leer, Beladen und Durchschnitt.
- Rechts oben farbiger Stern mit römischem Geschwindigkeitsrang.
- Durchschnitt intern drei, Anzeige maximal zwei Nachkommastellen; keine doppelten Tempo-/Rangzeilen in Fahrzeugdaten.
- Typprüfung und sieben relevante Tests erfolgreich. Weiterhin nur im Sammelbranch.

---

## Kartendetails: Bonussatz und Stufenmodal – gesammelt, nicht veröffentlicht

- Bonus-Card mit kurzem Satz für aktuellen Bonus und Wirkungsbereich.
- Fragezeichen oben rechts öffnet Stufe-1-bis-10-Übersicht mit exakten Bonuswerten und markierter aktueller Stufe.
- Garagenaktivität sichtbar; Vorschauhinweis bei nicht besessenen Karten. Deutsch/Englisch.
- Typprüfung, sieben relevante Tests und mobile Browserprüfung bei 320/390/430 px erfolgreich.
- Im Sammelbranch `batch/company-improvements`, keine Veröffentlichung.

---

## Kartendetails: Kopfbereich vereinfacht – gesammelt, nicht veröffentlicht

- Seltenheitsname und Herkunft über dem Bild entfernt; mittig steht nur die römische Kartenstufe.
- Stufenbadge im Bild und Stufen-/Kapazitäts-/Rangzeile unter dem Namen entfernt.
- Nachfolgende Bonus-, Daten- und Ausbauabschnitte unverändert. Typprüfung erfolgreich.
- Weiterhin im Sammelbranch, keine Veröffentlichung.

---

## Sammlung: engere Kartenabstände – gesammelt, nicht veröffentlicht

- Abstand zwischen Sammlungskarten horizontal von 9 auf 4,5 und vertikal von 10 auf 5 Einheiten halbiert.
- Drei Spalten bleiben erhalten; Karten und quadratische Bilder werden automatisch breiter.
- Flottenauswahl unverändert. Typprüfung erfolgreich. Weiterhin nur im Sammelbranch.

---

## Seitenabstand halbiert – gesammelt, nicht veröffentlicht

- Gemeinsamer seitlicher Seitenrand im Inhaltsbereich von 18 auf 9 Einheiten halbiert.
- Expeditionsübersicht und bildschirmfüllende Expeditionskarte behalten ihre bisherigen Abstände. Andere Sonderlayouts und Innenabstände bleiben erhalten.
- Typprüfung erfolgreich. Details: `docs/ui/page-side-spacing.md`.
- Sammelbranch `batch/company-improvements`; keine Veröffentlichung vor ausdrücklichem Go.

---

## Kartensammlung: Betriebskosten ergänzt – gesammelt, nicht veröffentlicht

- Vierte kompakte Angabe unter den bisherigen drei Werten: Münzicon und Betriebskosten in M/km.
- Bestehender serverseitiger Fahrzeugwert, Anzeige mit maximal zwei Nachkommastellen; keine Änderung der Kostenberechnung.
- Typprüfung erfolgreich. Sammelbranch `batch/company-improvements`, keine Veröffentlichung.

---

## Kartensammlung: drei kompakte Iconwerte – gesammelt, nicht veröffentlicht

- Nur Kapazität (Kiste), Geschwindigkeitsrang (Stern und farbige römische Rangstufe) und Durchschnittstempo (Stoppuhr) unter dem Kartennamen.
- Durchschnitt = (beladen + leer) / 2, numerisch auf drei Nachkommastellen; Anzeige mit maximal zwei Nachkommastellen in km/s.
- Freie Module und getrennte Tempoangaben aus der Sammlung entfernt; Garage, Details und Tourberechnungen unverändert.
- Typprüfung, sieben relevante Tests und mobile Browserprüfung bei 320/390/430 px erfolgreich.
- Sammelbranch `batch/company-improvements`; weiterhin keine Veröffentlichung vor ausdrücklichem Go.

---

## Kartensammlung: Dropdown und klappbare Abschnitte – gesammelt, nicht veröffentlicht

Sammelbranch: `batch/company-improvements` · vorbereitet am 22.10.2026.

- „Deine Sammlung“ samt Icon entfernt; vorhandener Seitentitel bleibt.
- Kartenstufe als römische Zahl I–X über dem Bild; bisherige Stufenzeile darunter entfernt. Gesperrte Karten zeigen einen Gedankenstrich. Gemeinsame Darstellung in Sammlung und Flottenauswahl.
- Kompaktes Seltenheitsdropdown mit allen Seltenheiten und Splitterbeständen.
- Freigeschaltete und gesperrte Karten unabhängig auf-/zuklappbar, jeweils mit gefilterter Anzahl; freigeschaltet zunächst offen, gesperrt geschlossen.
- Deutsch/Englisch, bestehende Kartenansichten und Werte beibehalten.
- Typprüfung und 15 relevante Tests erfolgreich; Bedienung und responsive Darstellung bei 320/390/430 px geprüft. Kein physischer Gerätetest.
- Gemeinsam mit den Firmenverbesserungen sammeln. Keine Veröffentlichung vor ausdrücklichem Go.
- Details: `docs/ui/collection-filters.md`.

---

## Transportverbesserungen: kompakte Übersicht und Ausbau-Modal – gesammelt, nicht veröffentlicht

Sammelbranch: `batch/company-improvements` · vorbereitet am 22.10.2026.

- Regional-/Fernverkehr-Reiter und kompakte Verbesserungszeilen mit aktuellem Effekt, Stufe und Verfügbarkeitsanzeige.
- Kleine Materialzeile statt großer Infokarte.
- Je Verbesserung ein Modal mit Vorher/Nachher, Stufenauswahl, Gesamtkosten und ausdrücklicher Kaufaktion.
- Bestehende Serverprüfung und Preise beibehalten, Deutsch/Englisch ergänzt.
- Typprüfung und alle 169 Tests erfolgreich; Bedienung bei 320/360/390/430 px einschließlich Fehler-/Mangel-/Maximalzuständen geprüft; Android-Export erfolgreich. Kein physischer Gerätetest.
- Keine Veröffentlichung. Erst nach ausdrücklichem Go veröffentlichen.
- Details: `docs/ui/company-upgrade-editor.md`.

---

## Stadthub-Fahrzeuge, Fahrzeugteile und Fundkisten – veröffentlicht am 22.10.2026

Release: `6823306861d2dc217f0c52408d4a3bb970f0ba3e` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39786609414).

- Vorbereiteter Sammelstand veröffentlicht: Stadttransporter für 25.000 Münzen direkt im Stadthub, 2 t, maximal 20 Fahrzeuge bis Level 100.
- Eigener Laderaum-/Antriebsausbau mit Fahrzeugteilen, je zehn Stufen. Vorhandene Fahrzeuge und Ausbauten werden übernommen.
- Drei Fundkisten pro UTC-Tag, mindestens 30 Minuten Abstand; jeweils 10–20 Teile.
- Stündlicher Einkauf: einmal 50 % Teilechance; keine Funde bei voller Kasse. Teile mit Hub-Erträgen abholen.
- Fahrzeugteile in Vorräten sichtbar, deutsche und englische Oberfläche/Spielhilfe aktualisiert.
- Kompaktere Auftragsprognosen mit Bezeichnung und Wert nebeneinander enthalten; aktuelle main-Kartenansichten erhalten.
- Typprüfung, alle 127 Tests (0 Fehler), Android-Export, Firebase-Deployment und Live-API-Prüfung erfolgreich.
- EAS Android-OTA im Kanal preview erfolgreich veröffentlicht (Published). Keine neue APK erforderlich.
- Physischer Gerätetest durch den Nutzer steht aus. Frühere Vorbereitungshinweise in diesem Dokument und docs/ui/hub-vehicle-parts.md sind mit diesem Release erledigt.

---

## Stadthub-Fahrzeuge und Fahrzeugteile – vorbereitet, noch nicht veröffentlicht

- Ein Stadttransporter-Modell, direkter Kauf im Stadthub: 25.000 Münzen, 2 t, bisheriges Grundtempo. Alte Händlerlinks führen zum Stadthub; alter Kaufbefehl gesperrt.
- Alle fünf Spielerlevel ein Platz, maximal 20 bei Level 100. Bestehende Fahrzeuge über dem neuen Limit bleiben erhalten, weitere Käufe sind gesperrt.
- Laderaum/Antrieb: je zehn Stufen. Laderaum +0,2 t je Stufe bis 4 t; Antrieb +2,5 % Grundtempo je Stufe bis +25 %. Stufe N kostet 14 × N Fahrzeugteile und 2.500 × N Münzen. Aktueller Stundenzyklus behält seine Einkommenswerte.
- Neue Stadttransporter verwenden keine Zahnrad-Ränge oder Kapazitätsmodule. Kartenfahrzeuge unverändert.
- Bestehende Fahrzeuge bleiben mit IDs/Statistik/Kaufpreis erhalten. Modell vereinheitlicht; erreichte Kapazität/Tempo bleiben mindestens erhalten, Module einmalig zurückgegeben, Ränge in Antriebstufen überführt. Migration wiederholbar ohne doppelte Rückgabe.
- Drei Fundkisten je UTC-Tag, 30 Minuten zwischen tatsächlichen Öffnungen auch über Mitternacht. Je Kiste 10–20 Teile, Mittelwert 15. Keine angesammelten Öffnungen. Verfügbarkeit ab Level 5.
- Beim stündlichen Einkauf ein 50-%-Versuch für genau ein Fahrzeugteil, unabhängig von Fahrzeugzahl. Maximal ein Versuch je Stunde und 24 je UTC-Tag; keine neuen Versuche bei voller Hub-Kasse oder ohne eingesetzte Fahrzeuge. Teile in Kasse mit Erträgen abholen.
- Serverzustand und Transaktionsbelege verhindern doppelte Kistenbelohnungen bei wiederholter Anfrage. Offline-Funde stoppen beim sechsten Kassenzyklus; keine nachträgliche Beute aus vollen Stunden.
- Fahrzeugteile sichtbar in Vorräten, mit kanonischem Namen, Symbol und Verlinkung zum Stadthub.
- Deutsche/englische Oberfläche und Spielhilfe angepasst.
- Neuere main-Kartenansichten übernommen; kompaktere Fahrzeug-Auftragswerte aus dem bisherigen Sammelbranch erhalten.
- Lokal 113 Backend-/Mathe-/Regressionstests bestanden (10 neue Stadthub-/Belegtests). TypeScript-Gesamtprüfung, Android-Export und Gerätetest erst bei Veröffentlichung.

---

## Sammelpaket Level, Stadthub und kompakte Oberflächen – veröffentlicht am 21.10.2026

Release: `ec894f2a4e41985144476137301eea4d89d9baa5` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39654991142).

- Der gesamte vorbereitete Stand ist veröffentlicht.
- Spielerlevel linear: 100 × aktuelles Level XP. Einmalige Übernahme erhält Level und anteiligen Fortschritt ohne zusätzliche Level-Belohnungen.
- Stadthub ab Level 5; alle fünf Level ein weiterer Fahrzeug-Kaufplatz und „+1 Stadthub Fahrzeug“ im Glückwunsch-Modal. Vorhandener Stadthub und Fahrzeuge bleiben erhalten.
- Verlinkungs-Card zur Materialbeschaffung aus einzelnen Expeditionsregionen entfernt.
- Abhol-Buch ohne Zahl auf der Menü-Card; Modal mit Gesamtzahl und Zahlen je Gebiet, ohne einzelne Durchgänge.
- Ortsauswahl: Titel „Ort wählen“, mögliche Beute als kleine Item-Cards.
- Garage und Sammlung mit gemeinsamer Darstellung von Kapazität, abgesetzter Rang-/Geschwindigkeitsgruppe und km/s an den Werten; Sammlung zusätzlich freie Modulplätze.
- Alle Modal-Schließen-Buttons zeigen nur X mit zugänglicher Beschriftung.
- Einzelauftragsdetails: Fahrzeugprognosen mit Touren, Dauer, XP und Gewinn, aufklappbare Ertrags-/Kostendetails; mögliche Belohnungen oben mit Icons. Separate Prognose-Card entfernt.
- Beim Verschwinden eines geöffneten Angebots nach Aktualisierung automatische Rückkehr zur Übersicht; überlappende Rückfallanzeige korrigiert.
- Typprüfung, alle 113 Tests (0 Fehler), Android-Export, Firebase-Deployment und Live-API-Test erfolgreich.
- Android-OTA im Kanal preview erfolgreich veröffentlicht. Keine neue APK erforderlich.
- Physischer Gerätetest durch den Nutzer steht aus. Frühere Vorbereitungshinweise in diesem Dokument und UI-Notizen sind mit diesem Release erledigt.

---

## Lineare Spielerlevel und Stadthub-Plätze – vorbereitet, noch nicht veröffentlicht

- Nächstes Spielerlevel: immer 100 × aktuelles Level XP; keine quadratische Steigerung ab Level 25.
- Einmalige Mobile-Migration erhält aktuelles Level und prozentualen XP-Fortschritt (auf 0,01 XP gerundet), rechnet die gespeicherte XP-Zahl auf die neue Kurve um und entfernt alte Level-Floors. Keine nachträglichen Level-Belohnungen; vorhandene Auffüller und offene Punkte bleiben bestehen.
- Stadthub ab Level 5; ein Kaufplatz pro fünf Spielerlevel. Server prüft Freischaltung und Fahrzeuglimit. Kauf kostet weiterhin Münzen.
- Bereits vorhandener Stadthub und gekaufte Fahrzeuge bleiben erhalten. Bestandsschutz erlaubt keine zusätzlichen Käufe über das neue Level-Limit.
- Nächster Fahrzeugplatz wird in Stadthub und Händler angezeigt.
- Glückwunsch-Modal zeigt bei Level 5, 10, 15 usw. zusätzlich „+1 Stadthub Fahrzeug“. Kein kostenloses Fahrzeug wird vergeben.
- Bestehende Level-Belohnungen bleiben 1 Expeditionsauffüller, 1 Überstundenauffüller und 3 verteilbare Punkte.
- Deutsche und englische UI sowie Spielhilfe angepasst; neuere main-Änderungen enthalten.
- 103 lokale Backend-, Mathe- und Regressionstests bestanden, darunter 6 neue Progressionstests. Nach abschließender Hilfeänderung 6 Progressionstests erneut bestanden. Kein vollständiger TypeScript-/Android-Build und kein Gerätetest in diesem Vorbereitungsschritt.

---

## Garagenfilter und kompakte Beschaffung – veröffentlicht

Release: `ee77464ad9b3ac087c66cd56b0b928f5249b4948` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39524521835).

- Der gesamte vorbereitete Stand von `batch/mobile-adjustments` ist veröffentlicht; einschließlich der aktuellen Änderungen von main.
- Startseite: doppelte obere Materialbeschaffungs-Card entfernt; Zahl und Belohnungssymbol auf der verbleibenden Menü-Card.
- Gesperrte Beschaffungsorte im Auswahlmodal kompakter, mit weiter erreichbaren Expeditionen und Belohnungen.
- Garage: Seltenheitsfilter Alle/Common/Uncommon/Rare/Epic/Legendär; kompakte Fahrzeugzeilen mit Kapazität, Stufe, Geschwindigkeitsrang und Tempo beladen/leer; Deutsch und Englisch.
- Typprüfung, alle 105 Tests (0 Fehler) und Android-Export bestanden.
- Firebase-Deployment und Live-API-Prüfung erfolgreich.
- Android-OTA auf Kanal `preview` erfolgreich veröffentlicht (Published).
- Keine neue APK erforderlich. Physischer Gerätetest durch den Nutzer steht aus.
- Frühere Hinweise „vorbereitet/nicht veröffentlicht“, auch in den einzelnen UI-Notizen, sind historische Beschreibungen und mit diesem Release erledigt.

---

## Sammelpaket Flotte und Mehrfahrzeug-Beschaffung – veröffentlicht am 20.10.2026

Release: `77c8e000ba4e35239b48e9c5b9aef9784741a668` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39442746187).

- Typprüfung, alle 105 Tests und Android-Export bestanden.
- Firebase-Deployment und Live-API-Prüfung erfolgreich; Android-OTA im bestehenden Kanal `preview` erfolgreich veröffentlicht.
- Flottendetails mit freier Tourkilometer-Eingabe, individueller und gesamter Stundenleistung, tatsächlichen Flottenboni und Kosten.
- Geschenköffnung mit durchlaufender Markierung, Verlangsamung bis zum tatsächlichen Servergewinn, Überspringen und reduzierter Bewegung.
- Garagenkarten in Seltenheitsfarben mit Kapazität, Stufe, Rang und Tempo beladen/leer.
- Sammlung mit richtigem Kartensymbol, ohne Zusatztext, Freigeschaltet/Gesperrt und Seltenheitsfiltern einschließlich Alle und Legendär.
- Beschaffungsauswahl nur mit freien Fahrzeugen, Kapazität und effektivem Tempo.
- Mehrfahrzeug-Beschaffung: gemeinsamer Tourenvorrat bzw. gemeinsame Reserve, individuelle automatische Freigabe, beide Abbrucharten und alte Einzelaufträge kompatibel.
- Kompakter Startdialog mit gestrichelter Plus-Kachel, Max bei Touren und +10.000 bei Reserve. Erläuterungen unter Hinweise.
- Keine neue APK erstellt, keine Spielstände zurückgesetzt. Physischer Gerätetest durch den Nutzer steht aus.
- Frühere Vorbereitungshinweise beschreiben den Stand vor diesem Release.

---

## Mehrfahrzeug-Beschaffung – vorbereitet, noch nicht veröffentlicht

- Gemeinsamer Tourenvorrat bzw. Reserve für mehrere ausgewählte Garagenfahrzeuge, individuelle automatische Freigabe.
- Kompakter Startdialog mit Max / +10.000, gestrichelter Plus-Kachel; Erklärungen unter Hinweise.
- Nur freie Fahrzeuge, Kapazität und effektives Tempo in der Auswahl.
- 96 Rechen-/Backendtests bestanden; vollständiger App-Build und Gerätetest stehen aus.
- Details: docs/ui/procurement-groups.md. Die zuvor vorbereiteten Flotten-, Geschenk- und Garagenänderungen bleiben im Paket.

---

## Neues Sammelpaket – vorbereitet, noch nicht veröffentlicht

- Flottendetails statt Hinweis „5 Plätze“: Kilometer frei wählbar, scrollbares Modal mit Fahrzeug-/Flottenleistung, Kosten und wirksamen Boni.
- Geschenköffnung mit durchlaufender, langsamer werdender Markierung bis zum echten Serverergebnis; Überspringen und reduzierte Bewegung berücksichtigt.
- Garagenkarten in Seltenheitsfarben mit klareren Stufen, Rängen, Kapazitäten und Tempo leer/beladen.
- 87 Backend-/Berechnungstests bestanden. Vollständiger App-Build und visuelle/physische Prüfung stehen aus.
- Details: docs/ui/fleet-gift-garage.md.

---

## Sammelpaket vom 20.10.2026 – veröffentlicht

Release: `ed597368074794f1535b8ce2a6d716f6519de0e1` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39419503174).

- Typprüfung, alle 92 Tests und Android-Export bestanden.
- Firebase-Deployment und Live-API-Prüfung erfolgreich.
- Android-Update erfolgreich im bestehenden Kanal `preview` veröffentlicht; keine neue APK erforderlich.
- Enthalten: Stadthubstatus in der bestehenden Kachel, doppelten Firmenzugang entfernt, Events als Legendär, mittiges Einzelprämienmodal mit Itemkacheln, kompaktere Herstellung mit Beständen und Materialfarben, Kundenbonus je Punkt, Angebotscountdown auf Start, kürzere Auftragskacheltexte, getrennte Expeditionsprozente und Bonuslieferdauer.
- Großhändler → Geschenke: fünf regionale Geschenke, je 10 normale Münzen für eine Karte, je fünf Fahrzeuge im gemeinsamen Geschenk-/Expeditionspool, insgesamt 25 Karten. Doppelte Karten geben passende Shards; Epic-Shards in Vorräten und Sammlung sichtbar.
- Region 1: 2 Common / 2 Uncommon / 1 Rare; Region 2–5: 2 Common / 1 Uncommon / 1 Rare / 1 Epic. Vorläufige Chancen und Boni in docs/ui/region-gifts.md dokumentiert.
- Keine echte Kaufabwicklung, keine Geschenkfunde oder Geschenkherstellung aktiviert. Expeditionslieferungen bleiben vorläufig bei 15 Sekunden.
- Die vorherigen Vorbereitungshinweise dokumentieren den Stand vor diesem Release. Physischer Gerätetest durch den Nutzer steht aus.

---

## Sprach- und Vorratspaket – veröffentlicht am 19.10.2026

- Erfolgreich veröffentlicht: Release `0ba088d8fba9f4cb8e3dd1c28bbbb9b6dce8265e`, Workflow 39307392702. Typprüfung, 70 Tests, Androidexport, Firebase-Deployment/Live-Test und Android-OTA erfolgreich.
- Mit dem aktuellen Hauptbranch zusammengeführt: Eventprojekt und Tourwechsel einschließlich Reservierungen bleiben erhalten. Neue Texte ebenfalls auf Englisch.
- Sprache: Einstellungen mit Deutsch/English-Auswahl; Deutsch bleibt unabhängig von der Gerätesprache Standard. Auswahl wird lokal gespeichert und nach Neustart geladen, auch bei Kontowechsel/Spielreset erhalten. Sofortige Umschaltung von Texten, Zahlen-Locale, Eingabeplatzhaltern und Bedienungshilfen.
- Zentraler Quelltext-/Übersetzungskatalog mit Platzhaltern für dynamische Anzeigen, englische Spielhilfe und gemeinsames Sprachregister. Weitere Sprachen durch Kataloge und Registrierung ergänzbar; Anleitung in LOCALIZATION.md. Firmen-/Stadtnamen bleiben wörtlich; Serverzustand, IDs und Spielregeln unverändert.
- Fahrzeugkarten aus Vorräten entfernt. Sammlung und Eigentum unverändert; Shards und Fahrzeugkartenaufträge bleiben als nutzbare Gegenstände sichtbar.

---

## Sammelpaket vom 19.10.2026 – veröffentlicht

- Laufende Großaufträge: unter der eingesetzten Flotte je Fahrzeug eigener Tour-Countdown und tatsächliche Restladung „X t bei Ankunft“. Fahrzeuge ohne weitere Fracht zeigen „Keine weitere Tour“. Automatischer Serverabgleich an jeder einzelnen Tourankunft, damit Folgetour und Gesamtfortschritt zeitnah aktualisieren.
- Großhändler: zwei zusätzliche Preisideen „Echtgeld-Münzen“ (Menge X, Preis offen) und „Fahrzeugkartenkiste“ (X Echtgeld-Münzen). Platzhalter ohne Kaufaktion.
- Stammkunden: ohne freie Punkte und ohne Entwurf keine Verteilbuttons, keine Punkteanzeige und kein Speichern. Bestehende Fähigkeiten/Bonusse bleiben lesbar.
- Bei freien Punkten zunächst nur Plus je Bereich, ohne „+0“ oder Minus. Minus und vorgemerkte Menge erscheinen nur bei tatsächlich vorgemerkten Punkten im jeweiligen Bereich. Speichern erscheint erst bei einem Entwurf.
- Nach Vormerken des letzten freien Punktes bleiben Rücknahme und Speichern erreichbar. Nach vollständigem Zurücknehmen verschwindet Minus/Speichern, nach dem Speichern aller Punkte verschwindet die Verteilung wieder. Bestehende Server- und Punktelogik unverändert.
- Regeneration läuft unterhalb des Limits unabhängig von Ausgaben weiter. Expeditionsverbrauch setzt den Takt nicht mehr zurück; Überstundenverhalten bestätigt. Volle/überfüllte Vorräte pausieren; beim erneuten Unterschreiten startet ein voller Zyklus. Offline-Nachholung und verbleibender Zyklusanteil bleiben erhalten. Testgutschriften unterhalb des Limits erhalten ebenfalls die Phase. Beide Intervalle: 10 Minuten pro Punkt.
- Kompakte Einzelauftragskarten zeigen neben Verkehrsart und Dauerklasse auch „Single Way“ bzw. „Dual Way“ aus dem tatsächlichen Auftragstyp. Gilt für Angebote, Vorräte und laufende Einzelaufträge.
- Levelaufstieg gibt jetzt je einen Expeditionsauffüller und Überstundenauffüller sowie weiterhin drei verteilbare Punkte. Die bisherigen sofortigen +50 Expeditionspunkte entfallen zugunsten des speicherbaren Expeditionsauffüllers. Beide Auffüller geben beim manuellen Einlösen je 50 Punkte, auch über das Limit hinaus. Level-Up-Modal zeigt nur die beiden Gegenstände und drei Punkte, keine Füllmenge.
- Neuer Expeditionsauffüller in Vorräten mit Herkunft und Benutzen. Gemeinsame Namen vereinheitlicht: Expeditionsauffüller/Überstundenauffüller. Vorhandene Punkte und vorhandene Auffüllerbestände bleiben erhalten; der Überstundenauffüller gibt künftig ebenfalls 50. Alte Spielstände erhalten für das neue Feld 0, keine rückwirkenden Vergaben. Hilfe, Item-Prüfmatrix und künftiger Live-Test aktualisiert. Regenerationsphase bleibt unterhalb des Limits erhalten.
- Fahrzeugkarten öffnen aus der Sammlung eine eigene Detailseite statt eines Modals. Fester, zentrierter 180×180-Bildplatzhalter (1:1), Name/Stufe/Kapazität/Rang kompakt zusammengefasst. Bonus und Geltungsbereich separat hervorgehoben, Fahrzeugdaten als klare links/rechts ausgerichtete Werte. Kartenstufe, Kapazität und Rang haben eigene Verbesserungsbereiche mit Fortschritt, Bestand/Kosten und passenden Maximum-/Sperrzuständen.
- Nicht entdeckte Karten haben ebenfalls eine Detailseite, ohne Upgrade-Aktionen. Keine Auftragszuweisungen in der Sammlung. Rücknavigation führt ins Kartenraster; vorhandene Upgradeaktionen unverändert. Optionale spätere Beschreibung wird am Seitenende unterstützt, ohne erfundene Texte. Seltenheitsfarben mit übrigem Inventar vereinheitlicht.
- Expeditions- und Überstundenpunkte regenerieren nun beide genau 1 Punkt je 10 Minuten. Countdown, Offline-Nachholung und Spielhilfe verwenden denselben Engine-Takt. Verbrauch unterhalb des Limits setzt den Zyklus weiterhin nicht zurück; Pause bei vollem Vorrat bleibt bestehen.
- Startseite: schmale, einzeilige Stadthub-Karte nur im letzten aktiven Stundenzyklus (5 von 6 Stunden) oder bei voller Kasse. Anzeige „Letzte Stunde“ bzw. hervorgehoben „Kasse voll“, Antippen öffnet direkt den Stadthub. Nach Abholen wieder ausgeblendet. Kein Hinweis ohne Hub, in früheren Zyklen oder bei pausiertem Hub vor der Füllgrenze.
- Alle über Expeditionen erhältlichen Fahrzeugkarten können Regionalverkehr und Fernverkehr fahren, unabhängig von Modell und Seltenheit. Serverseitige Eignung, Auswahl und Verfügbarkeitsstatus nutzen dieselbe Regel; gekaufte Stadttransporter bleiben beim Stadthub. Garagen-Exklusivität unverändert. Detailseite nennt beide Verkehrsarten, Spielhilfe entsprechend berichtigt.
- Expedition: Ortskarten öffnen mittige Modals. Erkundung mit je einem Punkt/Klick, danach eigener Bonuslieferungsbalken unter dem Erkundungsbalken. Fahrzeugwahl, laufende Restzeit und Bonusabholung im Ablauf; nach vollständiger Bonusabholung nur noch Schließen. Gesperrte Orte zeigen Informationen ohne Aktionen. Listen enthalten keine direkten Erkundungs-/Lieferbuttons mehr.
- Regionsliste rückwärts: Endlosort zuerst, anschließend Ort 7 bis Ort 1. Beim Eintritt in eine unfertige Region automatische Positionierung auf die unterste noch nicht vollständig erledigte Ortskarte (inklusive Bonuslieferung); bei erledigten Orten auf den noch offenen Endlosbonus. Fertige Regionen bleiben oben. Einmalige Positionierung, kein Springen bei Fortschritts-/Timeraktualisierungen.
- Endlosort mit Fragezeichen für die regionsbezogene Fundtabelle: konkrete Fahrzeugkarten, tatsächliche absolute Fundchancen, Auftragstypen samt konkreten Sonder-/Empfehlungsnamen und Seltenheiten sowie bedingte Auftragsrang-Verteilung. Quelle sind die tatsächlich verwendeten Engine-Konstanten je Region; keine Änderung der Chancen. Eigene Modals werden während Fahrzeugwahl/Fundmeldung/Level-Up ausgeblendet und danach fortgesetzt.
- Veröffentlicht mit Commit `887c3f40ef46ad9c0158319bbf00b8a28045734c`, Workflow 39285637912. Serverdeployment und Live-Smoke-Test bestanden; Android-OTA auf Kanal preview laut Ausführungsprotokoll erfolgreich veröffentlicht. Alle 35 Tests und Androidexport bestanden.

---

## Sammelpaket vom 18./19.10.2026 – veröffentlicht

Release: `c76d08d9795bd20eb45cc01f13e152b1d58bf4bd` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39243835875). Am 19.10.2026 erfolgreich veröffentlicht: Validierung, Firebase-Deployment, Live-API-Test und Android-Update im Preview-Kanal. Die nachfolgenden früheren Hinweise „nur vorbereitet“ dokumentieren den Stand vor diesem Release.

- Punkteverteilung: Titel „Level Up“, freie Punkte rechts oben. Je Bereich aktuelles Kapazitätsmaximum links, −/zugewiesene Punkte/+ mittig, Ergebnis rechts. Weiterhin exakt drei Punkte je Level, kein Refill-Hinweis in der Verteilung.
- Globales mittiges Level-Up-Modal mit Glückwunsch, erreichtem Level und tatsächlichen Belohnungen: 1 Refill à 100 Überstundenpunkte, 3 verteilbare Punkte und die bereits bestehenden 50 Expeditionspunkte. Keine Änderung dieser Belohnungen. Mehrere Aufstiege werden nacheinander angezeigt, vorhandene offene Verteilungen lösen beim normalen Neuladen keine alten Meldungen aus.
- Server liefert neu erreichte Level auch beim Nachholen passiver Transporte. Command-Belege speichern Meldungen für sichere Wiederholung. Andere offene App-Dialoge werden vorübergehend ausgeblendet und danach wieder angezeigt. Kontowechsel/Reset bereinigen die Meldungswarteschlange und offene Verteilungsauswahl.
- Überstunden: feste Auswahl 1, 5, 10, Max statt Zahleneingabe/Stepper. Auswahl ändert nur die Einstellung, rechter Button setzt direkt ein. Refill und Verhalten bei 0/knappem Vorrat bleiben erhalten.
- Max ermittelt serverseitig die kleinste ganze Punktzahl, nach der die gespeicherte Flotte innerhalb der Restfrist fertig wird. Laufende Touren und gemischte Flotten werden berücksichtigt. Ist die Frist bereits machbar, werden keine Punkte verbraucht. Bei zu wenig Vorrat wird nur der Rest eingesetzt; das kann weiterhin unzureichend für die Frist sein. Kein Sofortabschluss, wenn passive Restfahrt möglich ist.
- Vorrats-Auftragsauswahl bündelt Expeditionsaufträge je Art und Rang über alle Regionen hinweg. Pro vorhandenem Rang eine Karte mit „Anzahl X“ und Umfang, keine Einzelinstanz-/Regionszeilen mehr. Rang 1 Common grau, Rang 2 Uncommon grün, Rang 3 Rare blau. Leere Ränge fehlen.
- Beim Antippen startet die bisher erste vorhandene Instanz des Stapels über die freie Fahrzeugwahl. Region/Rang stehen in der Zuweisung; konkrete Herkunft, Belohnungen und Instanz-ID bleiben erhalten. Verbrauch reduziert genau diesen Stapel um 1, laufende Aufträge bleiben außerhalb des Vorrats. Übergeordnete Artübersicht bleibt erhalten.
- Großauftragsnamen enthalten den Typ direkt: „Sonderauftrag …“ bzw. „Empfehlungsauftrag …“. Separate Typzeile in Katalogkarten entfernt; Kunde/Region und „Aufträge X“ stehen gemeinsam darunter. Gleiche Namen in Typansicht, laufenden Karten, Instanzdetails und Fundmeldung. Anzeigeformatierung bewahrt vorhandene Auftragsdaten und Werte.
- Header zeigt neben Expeditions- und Überstundenstand jeweils MM:SS bis zum nächsten Token. Fristen stammen aus der Server-Regenerationslogik (20 bzw. 10 Minuten); bei vollem/überfülltem Vorrat „Voll“. Server-Sync am jeweiligen Fristende aktualisiert Tokenzahl und startet den nächsten Countdown.
- „Gespeichert“ und andere kurze Erfolgshinweise schweben jetzt über dem unteren Menü, mit sicherem Abstand zur Systemleiste. Sie reservieren keinen Platz im Layout, verschieben keine Inhalte und blockieren keine Eingaben. Bestehende automatische Ausblendung bleibt erhalten.
- Garage: festes Raster mit fünf Zeilen und zwei Spalten für zehn Kartenfahrzeuge. Freie Plätze sind gestrichelte Plus-Karten und öffnen die Auswahl verfügbarer, noch nicht eingesetzter Karten. Belegte Karten zeigen ausschließlich Name, Kapazität, Kartenstufe und Geschwindigkeitsrang. Stadttransporter bleiben separat.
- Garagen-Modal zeigt weitere Fahrzeugdaten (Tempo, Betriebskosten, Kilometer, Aufträge, Status/Restzeit) und Entfernen, ohne Verbesserungsbuttons. Kapazitätsmodule und Geschwindigkeitsrang werden ausschließlich im Karten-Sammlungsmodal verbessert. Upgrades funktionieren auch außerhalb der Garage, ohne einen Platz zu belegen, und bleiben beim späteren Einsetzen erhalten.
- Einzelaufträge: Start-/Zielorte in Angebotskarten, Vorratsaufträgen, laufenden Karten und Details durch Verkehrsart und Dauerklasse ersetzt, etwa „Regionalverkehr · Kurz“. Kurz bis 5 Minuten, Mittel bis 15 Minuten, sonst Lang; Gesamtfahrzeit inklusive Menge, Touren und Rückweg. Bei Fahrzeugauswahl wird die Klasse neu berechnet, bei laufenden Aufträgen bleibt die gesamte statt der verbleibenden Fahrzeit maßgeblich. Ohne geeignetes Fahrzeug dient das Basisfahrzeug der Kategorie als Schätzung. Reine Anzeigeänderung: Orte, Kilometer, Kosten und Transportmechanik bleiben gespeichert.
- Gekaufte Fahrzeuge erscheinen ausschließlich im Stadthub, nicht im Garagenraster. Antippen öffnet ein mittiges Fahrzeugmodal mit Daten, Kapazitäts-/Rang-Upgrades, Hubeinsatz und Verkauf mit Bestätigung. Garage und Auswahl enthalten nur Kartenfahrzeuge; Händlerlink dort entfernt, im Stadthub weiterhin vorhanden. Ein im Hub eingesetztes Fahrzeug kann dort auch wieder herausgenommen werden; die bisherige Sperre durch den allgemeinen Frei-Status ist korrigiert. Keine Änderung von Preisen, Ressourcen oder Serverregeln.
- Item-Abgleich: alle 13 nutzbaren Materialarten (5 Grundmaterialien, 5 Zahnrad-, 3 Shard-Seltenheiten), wartende Material-/Fahrzeugkartenaufträge je Rang, Privatabholungen, Kundenaufträge, Großaufträge und gesammelte Fahrzeugkarten im Vorrat sichtbar. Laufende Aufträge bleiben aus dem startbaren Vorrat heraus. Nur positiver Bestand wird angezeigt.
- Alle vier vorhandenen Rezepte im serverseitigen Katalog, mit Mengen aus den tatsächlichen Verbrauchskonstanten: Privatabholung, Kundenauftrag, Uncommon-Shard und Rare-Shard. Vorratsdetails verlinken passend zu Herstellung bzw. Verwendung; Module/Zahnräder zur Sammlung und zum Stadthub. Keine erfundenen Rezepte für Firmenausbau-Items, Module oder Common-Shards; falscher Herstellen-Link beim Firmenausbau korrigiert.
- Gemeinsamer Namenskatalog für Grundmaterialien und Auftragsarten. Firmenausbau-Item und Überstunden-Refill konsistent in Vorräten, Rezepten, Prämien, Level-Up, Firma und Überstundenmodal; Shard-Seltenheiten in Beutemeldungen großgeschrieben. Prüfmatrix in ITEM_AUDIT.md. Keine Änderung der Fundchancen, Kosten oder Belohnungen.
- Kundendetails: Punkte zunächst mit Plus/Minus vormerken und zurücknehmen, Bonus/Stufe als Vorschau. Freie Punkte werden entsprechend reduziert. Erst „Speichern“ sendet die gesamte Verteilung als eine validierte Serveraktion. Minus nimmt nur ungespeicherte Punkte zurück; gespeicherte Fähigkeiten bleiben dauerhaft. Überbelegung, Fähigkeitslimits und veraltete Ausgangswerte werden serverseitig abgewiesen. Wiederholte identische Anfragen bleiben über Command-Belege abgesichert. Ungespeicherte Verteilung wird beim Verlassen verworfen.
- Kundenkarte zeigt nur das aktuelle Level, nicht zusätzlich das nächste Level. Beziehungsfortschritt bleibt sichtbar.
- Am 19.10.2026 für Server und installierte Android-Test-App veröffentlicht. Kein neuer APK-Build erforderlich.

---

## Folgepaket vom 18.10.2026 – veröffentlicht

Release: `2bdd72e8c26746831512b9635d16671d7cde2290` · [Veröffentlichungslauf](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/39131547974). Server, Live-Prüfung und Android-Update erfolgreich. Frühere Hinweise „nur vorbereitet“ dokumentieren den Stand vor der Veröffentlichung.

- Großauftragskarten zeigen immer „Aufträge X“: nur startbereiter Vorrat, keine laufenden oder abgeschlossenen Instanzen.
- Sonderaufträge blau (Rare), Empfehlungsaufträge violett (Epic), auch in Einzelkarten der Listen.
- Katalog: fünf kundenspezifische Sonderaufträge und ein gemeinsamer Empfehlungsauftrag „Großprojekt Hafenverbund“. Neue und noch nicht gestartete Empfehlungen: 1.100 t, 240 km, 3 Stunden, Regionalverkehr. Herkunft/Kunde und Fundchancen bleiben erhalten; alle Vorräte laufen unter einem Typ zusammen. Laufende/abgeschlossene Altaufträge behalten ihre bisherigen Werte und Belohnungen.
- Fund-Popup als mittiges Modal mit Außenabstand, begrenzter Breite und direktem Zuweisungsbutton. Fahrzeug-/Flottenauswahl bleibt erreichbar. Lange Titel teilen sich den Kopfbereich mit dem Schließenbutton ohne Überlauf.
- „Aufträge aus Vorräten“ enthält jetzt auch wartende Material-/Fahrzeugkartenaufträge aus Expeditionen, einschließlich Zählung. Antippen öffnet freie geeignete Garagenfahrzeuge; nach erfolgreichem Start Wechsel zur laufenden Einzelauftragsliste.
- Laufende Expeditionsaufträge zählen im Einzelauftragsbereich und auf Start mit, mit kompakter Karte, Zeitfortschritt, Restzeit und LKW. Detail-Modal erreichbar. Bereits gestartete Aufträge erscheinen nicht erneut im Vorrat. Automatische bestehende Lootgutschrift unverändert.
- Eigene Seite „Expeditionsaufträge“ inklusive Hauptmenülink entfernt. Vorratsübersicht stapelt nach Art: Materialaufträge, Fahrzeugkartenaufträge, Privatabholungen und Kundenaufträge. Nur Arten mit Bestand erscheinen, pro Karte „Anzahl X“. Antippen öffnet die konkreten Instanzen; Stufe, Region und individuelle Kundenwerte bleiben dort erhalten.
- Erkundung setzt je Klick genau 1 Expeditionspunkt ein. Teilfortschritt pro Ort bleibt gespeichert; Gesamtkosten unverändert. Bei voller Punktzahl ist der Ort 100 % erkundet. Regionen/Endlosort zeigen den gewichteten Tokenfortschritt, ohne Lieferungen mitzuzählen.
- Prozentzahl oben rechts in Regions-, Orts- und Endloskarten. Lieferung separat als „Bonus liefern“/„Bonus abholen“; bestehende +1-Kapazitätsbelohnung und Kundenfreischaltung bleiben erhalten. Entdeckte Altorte zählen vollständig, laufende Bonuslieferungen bleiben bestehen. Einmaliges Kapazitätsmodul bei Freilegung unverändert.
- Leere Händleransicht behoben: Sprinter (4.000 M) und 3,5-Tonner (20.000 M) wieder als Kaufkarten verfügbar. Name und Links „Stadthub Händler“. Kein Hauptmenüeintrag; Zugang über Stadthub (bestehender Garagenlink bleibt). Bestehende Hub-Eröffnungs-, Münz- und Stellplatzgrenzen; keine neue Preis-/Kauflogik.
- Mehrfachnutzung ausdrücklich geprüft: pro Karte höchstens ein Garagenplatz und ein gleichzeitiger Garagentransport (Einzelauftrag oder Expeditionslieferung). Währenddessen weder zweiter Garagenplatz noch Entfernen/Neueinsetzen zum Umgehen. Dieselbe Karte darf parallel in mehreren Flottenvorlagen und mehreren laufenden Großaufträgen fahren. Bestehende Engine erfüllt dies bereits; Regressionstest ergänzt, keine Mechanikänderung.
- Großauftragsdetail: links Mengenbutton (33 % Breite), rechts direktes „Überstunden einsetzen“. Linker Button öffnet mittiges Modal mit freier ganzzahliger Menge, +/−, Übernehmen und direktem +100-Refill aus Vorräten. Mengenwahl verbraucht nichts.
- Überstundenverbrauch öffnet kein Popup und keinen Speicherhinweis; Fortschritt/Restzeit werden aktualisiert. Gewählte Menge über Vorrat verbraucht den verfügbaren Rest bis 0; nahe Abschluss weiterhin nur tatsächlich benötigte Punkte. Bei 0 öffnet Einsetzen das Modal ausschließlich mit Refill-Option (und Schließen). Nach Refill ist die Mengenauswahl wieder verfügbar.
- Mobile Servervalidierung erlaubt ganze Mengen 1–100.000; bestehende Tonnenkilometer-/Abrechnungsfunktion bleibt erhalten, wird beim Laden ausschließlich an ihrer Mengenprüfung angepasst. Vendor-Datei unverändert; strukturgesicherter Adapter bricht ab, falls die erwartete Funktionsgrenze sich ändert.
- Am 18.10.2026 für Server und installierte Android-Testversion veröffentlicht.

---

> Das hier dokumentierte Sammelpaket wurde am 17.10.2026 veröffentlicht.
> Release: da32f0701ef91f4aed77297f15e67ceda816263a · Actions 39066168191.
> Frühere Hinweise „nur vorbereitet“ beschreiben den Stand vor dieser Veröffentlichung.

# Gesammeltes Mobile-Update

Branch: `batch/mobile-adjustments`. Das Gesamtpaket wurde am 17.10.2026 gemeinsam veröffentlicht; Status siehe `TEST_REPORT.md`.
Änderungen werden gesammelt und erst nach ausdrücklicher Freigabe gemeinsam veröffentlicht.

## Umgesetzt und lokal geprüft

- Firebase-Transportfehler `functions/internal` mit HTTP-Status `[0]`: einmalige Wiederholung nach 400 ms unter Beibehaltung der Anfragekennung. Bei anhaltendem Fehler verständliche Verbindungsmeldung; echte Serverfehler werden nicht als Verbindungsfehler umgedeutet.
- Angebotskarten mit hellerem Hintergrund, stärkerem Rahmen/Farbrand, abgetrennten Metadaten und eigenem Mengen-/Streckenbereich.
- Bei fehlender Auswahl unterscheidet die Anzeige zwischen fehlendem passendem Fahrzeug und einem bereits eingesetzten passenden Fahrzeug.
- Regressionstest für automatischen Angebotswechsel inklusive Fristgrenze, angeheftetem Angebot, laufendem Transport und Offline-Nachholung.

- Expeditionsübersicht mit fünf Regionskarten, Kunden und Fortschritt, gesperrte Karten ohne Zugriff.
- Pro Region sieben Ortskarten und unten die Endloskarte, jeweils mit Fortschritt und kontextabhängiger Aktion.
- Testwerkzeuge: +100 Expeditionspunkte, +100 Überstundenpunkte, +100 / +1.000 XP inklusive regulärer Levelbelohnungen.

## Diagnose und Verifikation

Im installierten Firebase-SDK liefert ein fehlgeschlagener Fetch Status 0 und `internal [0]`. Zum gemeldeten Zeitpunkt wurde kein passender Functions-/Cloud-Run-Serverfehler gefunden. Der ursprüngliche Verbindungsabbruch selbst ist damit nicht als dauerhaft beseitigt bewiesen. Im UI-Test wird ein solcher Fehler injiziert und die automatische Wiederholung geprüft.

`npm run typecheck` und alle Spieltests bestehen. Der bestehende automatische Angebotswechsel ließ sich lokal ohne Ausnahme ausführen. Keine neuen Balancingwerte wurden gesetzt.

## Noch zu besprechen: Startangebote

Der Kurierwagen fährt 4 t je Tour und kann Regionalverkehr bedienen. Größere Gesamtmengen sind über mehrere Touren möglich. Fernverkehr braucht eine passende Fahrzeugkarte. Ein Fahrzeug kann außerdem für eine Expeditionsmission belegt sein, auch wenn keine Einzelaufträge laufen.

Vorschlag, noch nicht beschlossen: zunächst fünf Regionalangebote, davon drei kurze (4–8 t, 10–25 km) und zwei längere (8–16 t, 25–50 km). Fernverkehr erst bei Besitz einer dafür passenden Karte. Freigaben nach verfügbaren Fahrzeugklassen, nicht nach momentanem Frei-/Belegtstatus.

## Veröffentlichungssperre

`main` enthält eine Sicherung im Workflow: Firebase-Deployment und EAS Update laufen nur bei `workflow_dispatch` oder einem Commit mit `[publish-preview]`. Die Diagnose-Workflows lesen ausschließlich Protokolle. Beim Sammeln weder einen Veröffentlichungsmarker verwenden noch die manuellen Update-Workflows starten.

## Neues Paket – vorbereitet, noch nicht veröffentlicht

- Endlosexpedition: Fund-Popup für Karte/Shard oder Auftrag, direkte Zuweisung. Garagenauftrag bleibt in der Expedition; gestarteter Großauftrag öffnet seine Detailseite.
- Gefundene, laufende und abgeschlossene Karten-/Materialaufträge liegen unter Home → Expeditionsaufträge, nicht mehr auf der Regionsseite. Großaufträge bleiben unter Großaufträge.
- Wiederholte Draw-Anfrage liefert denselben Fund aus dem Command-Beleg, ohne erneut Punkte auszugeben.
- Vorübergehend alle Expeditionslieferungen (Orte, Kunde, Karten/Material) 15 Sekunden. Bestehende aktive Missionen werden einmalig verkürzt; danach kein Timer-Neustart. Rückstellung: `EXPEDITION_TEST_DURATION_MS` in `functions/src/engine.cjs` auf `null` setzen. Originalwerte im unveränderten Vendor bleiben erhalten. Bereits im Test gestartete Missionen behalten ihre Testdauer.
- Levelaufstieg: 3 statt 5 dauerhafte Kapazitätspunkte, getrennte Plus-/Minus-Auswahl mit Vorschau des neuen Maximums. Bestätigung erst bei vollständiger Verteilung. Bereits bestätigte Punkte bleiben erhalten; noch offene Level erhalten 3 Punkte. 100-Token-Refill und sonstige Levelbelohnungen unverändert.

### Firmenseite und Transportausbau

- Gemeinsame Karte für Regional-/Fernverkehr oben, Abteilungen darunter. Doppelter Münz-/Itembestand auf der Übersicht entfernt.
- Eigene Seite „Transport verbessern“ mit Itembestand und Verlinkung auf „Herstellen“. Die Bezugswege der Firmenausbau-Items stehen im Vorräte-Detail; ein neues Herstellrezept wurde nicht eingeführt.
- Mehrere Stufen in beiden Segmenten per +/− vormerken, Effekt und Gesamtkosten sehen, mit einem Speichern übernehmen. Auswahl bleibt beim Besuch von „Herstellen“ erhalten.
- Ein serverseitiger Batch validiert Stufen, Grenzen und gemeinsame Gesamtkosten, bevor Ressourcen abgezogen werden. Veraltete Auswahl, doppelte Einträge und fehlende Ressourcen brechen vollständig ab. Bestehende Einzelupgrade-Aktion bleibt für die installierte App verfügbar.
- Keine Veröffentlichung; nur Sammelbranch.

### Vorräte als Inventar

- Drei Karten je Zeile, quadratischer Bildplatzhalter, kurzer Itemname und Anzahl. Nur positive Bestände; leeres Inventar erhält einen kurzen Leerzustand.
- Antippen öffnet Details mit aktuellem Bestand, Nutzen, Herkunft und bestehenden Rezepten. Refill direkt benutzen; andere verwendbare Materialien führen zur passenden Garage/Kartensammlung/Firma/Stadthub-Auswahl. Kein Material wird allein beim Navigieren verbraucht.
- Herstellungslink bei Zutaten bzw. kombinierbaren Shards. Keine neuen Rezepte oder Items eingeführt. Kartenbilder bleiben Platzhalter.
- Nach Verbrauch des letzten Refills zeigt das geöffnete Detail 0, sperrt erneutes Benutzen und entfernt die Karte aus dem Raster. Gefundene Aufträge bleiben auf ihren eigenen Seiten.
- Weiterhin nur vorbereitet, keine Veröffentlichung.

### Herstellungsseite

- Vier vorhandene Rezepte als einzelne Prozesszeilen: Zutat mit Platzhalter und benötigter Menge → Ergebnis mit Platzhalter und Ausgabemenge. Jeweils darunter „Herstellung“.
- Rezepte: 100 Abholhinweise → 1 Privatabholung; 10 Firmen-Items → 1 Kundenauftrag; 10 Common-Shards → 1 Uncommon-Shard; 10 Uncommon-Shards → 1 Rare-Shard.
- Bestand klein direkt an der Zutat; bei fehlendem freigeschaltetem Stammkunden kurzer Sperrhinweis. Fehlende Zutaten und laufende Aktionen sperren den Button.
- Kein allgemeiner Erklärblock vor den Rezepten. Herkunft bleibt im Vorräte-Detail. Bestehende Herstellungskosten und Aktionen unverändert.
- Nur vorbereitet, keine Veröffentlichung.

### Stammkunden

- Übersicht bleibt bei einer Card pro freigeschaltetem Kunden. Nur Name, Branche, Level und Beziehungsfortschritt; keine direkten Aufwertungen.
- Antippen öffnet die eigene Kundendetailseite. Dort Beziehung, Fähigkeiten/Bonis und verfügbare Punkte sowie Ware, Verkehr und Expeditionsregion.
- Bestehende Fähigkeitspunkte werden ausschließlich auf der Detailseite verteilt. Keine Änderungen an Freischaltung, Kosten oder Limits.
- Zurück führt zur Übersicht; Kundenwechsel übernimmt jeweils die passenden Daten. Weiterhin nur vorbereitet.

### Händlerzugang

- Händler aus dem Hauptmenü entfernt; bestehende Zugänge (insbesondere Stadthub) unverändert. Umbenennung inzwischen für das Folgepaket vom 18.10. festgelegt: „Stadthub Händler“. Nur vorbereitet.

### Statistik

- Kompakte gemeinsame Liste: kurze Bezeichnung links, Zahlen samt Einheiten rechtsbündig. Dezimalstellen nach Bedarf, feste Ziffernbreiten.
- Bisherige Kennzahlen und CO₂-Schätzung bleiben erhalten; Ereignisprotokoll aus der Statistik entfernt. Die letzten Ereignisse sind auch von der Startseite entfernt. Gespeicherte Ereignisse bleiben erhalten.
- Nur vorbereitet, keine Veröffentlichung.

### Einzelaufträge und gespeicherte Aufträge

- Schmale hervorgehobene Zählkarte für laufende Einzelaufträge, dahinter eigene Liste mit kompakten Karten, LKW, Restzeit und animierungsfrei berechnetem Zeit-/Lieferfortschritt. Antippen öffnet Auftragsdetails.
- Darunter Karte „Aufträge aus Vorräten“ mit Anzahl, noch vor Countdown/Angebotswechsel. Eigene Seite zeigt nur verfügbare gespeicherte Einzelaufträge (Privatabholungen/Kundenaufträge), keine laufenden Aufträge. Nach Start Wechsel zur gemeinsamen laufenden Liste.
- Börsenplätze-/Haltbar-Hinweis entfernt. Countdown und Angebotswechsel nebeneinander. Angebote kompakt und antippbar; Fahrzeugwahl und Start nur in der Detailseite. Fehlende/belegte geeignete LKW als Text statt deaktiviertem Startbutton.
- Details: aktuelle Fahrzeugwerte, Münz-/XP-Prognose, Abschlussprämie, mögliche Beute/Beziehung; abgeschlossene Aufträge zeigen echte ausgewürfelte Prämien zum Abholen. Server berechnet Prognosen ohne Zufallsbeute vorab zu rollen.
- Auto-Sync am erwarteten Ende eines Einzelauftrags ergänzt. Laufzeiten und Auftragsbelohnungen selbst unverändert. Nur vorbereitet, keine Veröffentlichung.

### Großaufträge

- Hauptseite zeigt oben die hervorgehobene Navigation zu laufenden Großaufträgen, darunter dauerhaft alle zehn vorhandenen Varianten (Sonder-/Empfehlungsauftrag je Region). Katalog zeigt bereits gefundene startbereite Aufträge pro Variante; Anzeigen erzeugt keine Aufträge.
- Eigene Typseite mit Umfang, Frist ab Start, Belohnungen/Beutechancen, Fundchancen aus Endlosexpedition bzw. Kunden-/Sonderauftrag und Mindestvoraussetzung der Flotte. Verfügbare echte Aufträge sind dort einzeln auswählbar. Abgeschlossene/gescheiterte Aufträge bleiben über den Typ erreichbar.
- Laufende Großaufträge in eigener Liste. Detail: oben Fortschritt, Frist links und Restdauer der gespeicherten Flotte rechts; darunter Bildplatzhalter, Überstundenbutton und eingesetzte Flotte. Weitere Infos aufklappbar. Überstundenoptionen im Popup; bestehende 1.000-tkm-Regel unverändert.
- Navigation zum gesperrten Expeditions-Fundort führt zur Regionsübersicht. Frist/ETA lösen rechtzeitig Sync aus. Keine Änderung von Auftragserzeugung, Belohnungen, Laufzeiten oder Flottensnapshots.

### Gebündelte Einzelauftragsprämien

- Oberer Button sammelt alle fertigen Einzelaufträge und listet den tatsächlich erhaltenen Loot im Popup. Auch in der laufenden Einzelauftragsliste verfügbar.
- Neue serverseitige Aktion `claimSingles` schließt Großaufträge ausdrücklich aus. Münzen, Zahnräder und weitere Prämien werden aus echten Abschlussbelohnungen zusammengezählt. Command-Beleg speichert die Loot-Zusammenfassung für wiederholte Anfragen ohne zweite Gutschrift.
- Weiterhin nur Sammelbranch, keine Veröffentlichung.

### Großhändler – Monetarisierungsmerkliste

- Neue Seite „Großhändler“ im Hauptmenü mit schmalen Infokarten und dem Hinweis „Preisideen“.
- +1 Standardauftrag in der maximalen Auftragsliste: bis zu 10 Käufe, Gedankepreis 2,99 € je Kauf.
- +1 Auftrag festhalten: bis zu 4 Käufe, Gedankepreis 3,99 € je Kauf.
- Noch keine Kaufabwicklung, keine Shop-SDKs oder bezahlten Spielvorteile aktiviert. Pakete, Mengen, endgültige Preise und Zusammenspiel mit bestehenden Firmenupgrades sind später festzulegen.

### Kompakter Start und Belohnungshinweise

- Garage-/Flottenkacheln von Start entfernt; Zugriff über die untere Navigation.
- Einzel-/Großauftragskacheln bleiben fest 116 px hoch. Reservierte Hinweiszeile zeigt nur bei offenen Abschlussprämien „X Belohnung(en)“. Bei 0 bleibt die Zeile leer.
- Separaten Sammelblock auf Start entfernt. Einzelaufträge führen zum Einzelauftragsbereich; Großaufträge mit offenen Prämien direkt zur laufenden/abgeschlossenen Liste. Abholung erfolgt im jeweiligen Auftragsbereich.
- Loot-Popup der gebündelten Einzelprämien nennt Quelle und Zahl der Abschlüsse. Keine Veröffentlichung.

### Zurückbutton

- Aus dem Werteheader in die Seitenzeile verschoben: Zurück links, Seitenname daneben, Hilfe rechts. Bestehende Zurückfunktion unverändert; Touchfläche mindestens 44 × 44 px. Nur vorbereitet.
