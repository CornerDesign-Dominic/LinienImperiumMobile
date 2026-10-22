# Sammlung: kompakter Filter und klappbare Gruppen

Vorbereitet am 22.10.2026 im Sammelbranch `batch/company-improvements`. Nicht veröffentlicht.

- Zusätzliche Atlasüberschrift „Deine Sammlung“ samt Kartensymbol entfernt. Die Seitennavigation „Fahrzeugkarten“ bleibt bestehen.
- Eine kompakte Seltenheitsauswahl ersetzt die sechs verteilten Filterbuttons. Antippen öffnet eine Liste mit Alle/Common/Uncommon/Rare/Epic/Legendär; die Auswahl schließt die Liste wieder.
- Gewählte Seltenheit bleibt am geschlossenen Steuerelement sichtbar. Farbkennzeichnung, Auswahlhäkchen und Splitterbestände bleiben in der Liste erhalten; die Bestände erhalten ein Splittericon und eine zugängliche Beschriftung.
- „Freigeschaltet · Anzahl“ und „Gesperrt · Anzahl“ sind unabhängig klappbare Abschnitte mit Pfeilen. Freigeschaltet startet offen, Gesperrt geschlossen. Beim Wechsel der Seltenheit bleiben die gewählten Klappzustände erhalten; die Anzahl bezieht sich immer auf den aktuellen Filter.
- Leere Gruppen und ein Filter ohne Karten besitzen kurze Leerzustände. Beide Gruppen bleiben bei passenden Karten sichtbar, auch wenn eine Gruppe null Karten enthält.
- Kartenstufe als römische Zahl I–X zentriert über dem Bild; bisherige Stufenzeile unter dem Namen entfernt. Gesperrte Karten zeigen dort einen Gedankenstrich. Gilt einheitlich im gemeinsamen Kartenraster der Sammlung und Flottenauswahl; die zugängliche Beschriftung nennt weiterhin die numerische Stufe. Kein zusätzliches Stufenbadge im Bild. Typprüfung erfolgreich.
- Detailnavigation, Eigentum, Splitterbestände und Fahrzeugwerte unverändert.
- Deutsche und englische Beschriftung.

Prüfung: TypeScript und 15 vorhandene Übersetzungs-/Transportkartentests erfolgreich. React-Native-Web bei 320/390/430 px geprüft: Dropdownwechsel, automatische Schließung, passende Gruppenzahlen, beide Klappsteuerungen, Zustandserhalt beim Filtern, leerer Legendärfilter und Öffnen einer Karte. Kein horizontaler Überlauf und keine Laufzeitfehler. Englische Filter- und Gruppenanzeige geprüft. Kein physischer Android-Gerätetest und keine Veröffentlichung.

## Kompakte Kartenwerte

- In der Sammlung bleiben unten genau drei Werte: Kistenicon mit Kapazität in t, farbiger Stern mit römischer Geschwindigkeitsrangstufe sowie Stoppuhr mit Durchschnittstempo in km/s.
- Rangfarbe und Rangstufe stammen aus dem Geschwindigkeitsausbau, unabhängig von der Seltenheit der Fahrzeugkarte. Rangstufe null wird als Gedankenstrich gezeigt, I–X als römische Zahl.
- Durchschnitt = (beladenes Tempo + leeres Tempo) / 2. `averageCardSpeed` liefert einen numerischen Wert mit drei Nachkommastellen. Erst die Anzeige formatiert ihn lokalisiert mit maximal zwei Nachkommastellen. Fehlende Werte ergeben einen Gedankenstrich.
- Freie Module, numerischer Gesamtrang und getrennte Tempozeilen entfallen in der Sammlung. Garage und Fahrzeugdetails behalten ihre bisherigen Werte; bestehende Tourberechnungen bleiben erhalten.
- Zugängliche Beschriftungen benennen alle drei Werte weiterhin ausdrücklich. Deutsch/Englisch ergänzt.
- Prüfung: TypeScript, sieben Mathe-/Rang-/Übersetzungstests und React-Native-Web bei 320/390/430 px erfolgreich. Drei Werte und römische Rangstufen sichtbar; keine entfernten Detailtexte, kein seitlicher Überlauf, keine Laufzeitfehler. Kein physischer Gerätetest und keine Veröffentlichung.

## Betriebskosten ergänzt

Auf Wunsch zusätzlich eine vierte kompakte Zeile: Münzicon mit Betriebskosten in M/km (maximal zwei Nachkommastellen). Quelle ist der bestehende serverseitige Fahrzeugwert `costPerKm`, einschließlich der dort berücksichtigten Boni. Kein eigener Pauschalwert und keine Änderung der Kostenberechnung. Fehlende Werte zeigen einen Gedankenstrich; null wird als 0 M/km angezeigt. Deutsche/englische zugängliche Beschriftung verwendet den vorhandenen Begriff Betriebskosten/Operating costs. Typprüfung erfolgreich. Nicht veröffentlicht.

## Engeres Sammlungsraster

Abstand zwischen den drei Sammlungsspalten von 9 auf 4,5 Einheiten halbiert; Abstand zwischen Kartenreihen von 10 auf 5 Einheiten halbiert. Die Karten behalten flex:1 und nutzen die gewonnene Breite automatisch, einschließlich proportional größerer quadratischer Bilder. Zusammen mit den halbierten Seitenrändern wird das Raster breiter und dichter. Nur das Sammlungsraster mit Detailwerten erhält diese Abstände; die Flottenauswahl behält ihr bisheriges Raster. Typprüfung erfolgreich, keine Veröffentlichung.

## Ruhiger Kopfbereich der Kartendetails

In der aus der Sammlung geöffneten Fahrzeugkarte entfallen Seltenheitsname und Herkunft über dem Bild. Stattdessen steht mittig ausschließlich die Kartenstufe als römische Zahl I–X (gesperrt: Gedankenstrich). Das Stufenbadge im Bild und die bisherige Stufen-/Kapazitäts-/Rangzeile unter dem Namen sind entfernt. Fahrzeugname, Facettenrahmen sowie nachfolgende Bonus-, Daten- und Ausbauabschnitte bleiben erhalten. Typprüfung erfolgreich. Nicht veröffentlicht.

## Bonussatz und Stufentabelle

Die zweite Card der Fahrzeugdetails enthält einen kurzen Satz aus Bonusart, Wirkungsbereich und aktuellem Wert, etwa „Erhöht die Geschwindigkeit aller Fahrzeuge in der Garage um 4 %.“ Ein Fragezeichen oben rechts öffnet ein schließbares Modal mit allen zehn Stufen und deren tatsächlichen `bonusLevels`-Werten. Die eigene aktuelle Stufe ist hervorgehoben. Werte werden mit bis zu zwei Dezimalstellen angezeigt, damit beispielsweise 3,33 % und 3,67 % unterscheidbar sind. Prozent-, Kapazitätspunkt- und Regenerationsboni verwenden passende Einheiten und Formulierungen. Garagenaktivität bleibt sichtbar; nicht besessene Karten erhalten einen Stufe-1-Vorschauhinweis. Zusätzliche Wirkungsregeln für Punktboni stehen im Modal. Keine Änderung der Bonusberechnung.

Deutsch/Englisch ergänzt. TypeScript und sieben Übersetzungs-/Präzisionstests erfolgreich. Mobile Browserprüfung bei 320/390/430 px: kurze Kosten-/Temposätze, Fragezeichen, zehn exakte Stufenwerte, Öffnen/Schließen und englische Darstellung erfolgreich, ohne Laufzeitfehler oder seitlichen Überlauf. Kein physischer Gerätetest, keine Veröffentlichung.

## Eigene Geschwindigkeitscard

Direkt unter der Bonus-Card steht eine Card „Geschwindigkeit“: Leer, Beladen und Durchschnitt in km/s. Rechts oben zeigt ein Stern mit römischer Rangstufe den Geschwindigkeitsrang in dessen Rangfarbe. Zugängliche Beschriftung nennt zusätzlich Rangfarbe/-name, Teilstufe und Gesamtrang. Durchschnitt verwendet die gemeinsame Berechnung mit drei Nachkommastellen; sichtbare Tempowerte haben maximal zwei Nachkommastellen. Die bisherigen Tempo-/Rangzeilen in Fahrzeugdaten entfallen, damit die Werte nicht doppelt stehen. Betriebskosten und Einsatz verbleiben dort; der spätere Geschwindigkeitsausbau bleibt bedienbar. Deutsch/Englisch. Typprüfung und sieben vorhandene Präzisions-/Übersetzungstests erfolgreich. Nicht veröffentlicht.

## Kapazitätscard unter Geschwindigkeit

Kapazität steht direkt unter der Geschwindigkeitscard, vor Fahrzeugdaten und Kartenstufenausbau. Sichtbar bleiben die aktuelle Kapazität in t sowie eingesetzte Module/Modullimit. Entfernt sind der Kapazitätserweiterungsbutton, der verfügbare Modulbestand und der Erklärungstext zur Wirkung der Module. Kapazitätsdaten sind auch als Vorschau für nicht besessene Karten sichtbar. Die tatsächliche Ausbau-/Bestandslogik bleibt unverändert. Typprüfung erfolgreich. Nicht veröffentlicht.

## Separate Rangcard entfernt

Die alte alleinstehende Geschwindigkeitsrang-Card einschließlich Zahnradbedarf und Rang-erhöhen-Button ist aus der Kartendetailansicht entfernt. Der Geschwindigkeitsrang bleibt als farbiger Stern mit römischer Rangstufe rechts oben in der Geschwindigkeitscard sichtbar. Keine Änderung an Rangwerten oder serverseitiger Ausbaulogik. Typprüfung erfolgreich. Nicht veröffentlicht.

## Separate Kartenstufenerweiterung entfernt

Die alte Kartenstufen-Card mit Fortschrittsbalken, Shardbestand und „Shards einsetzen“-Button ist aus den Kartendetails entfernt. Die römische Kartenstufe über dem Bild und das Bonusmodal mit Stufenübersicht bleiben erhalten. Der Entdeckungshinweis bei nicht besessenen Karten bleibt bestehen. Keine Änderung an gespeicherten Stufen, Shards oder serverseitigen Aufwertungen. Typprüfung erfolgreich. Nicht veröffentlicht.
