# Gemeinsame Fahrzeugdetails in Sammlung, Garage und Flotte

Neu im Sammelbranch `batch/company-improvements`, nicht veröffentlicht.

Garage und Flotte verwenden jetzt dieselbe `VehicleCardDetail`-Komponente wie die Sammlung. Der kompakte Kontextmodus zeigt die Bereiche als zusammenhängende Ansicht mit Trennlinien statt separater Cards. Die Reihenfolge bleibt: römische Kartenstufe, Facettenbild, Fahrzeugname, Bonussatz mit Stufenhilfe, Geschwindigkeit (Leer/Beladen/Durchschnitt und Rang oben rechts), Kapazität mit Erweitert/Limit, Betriebskosten. Das Bild ist im Kontextmodal auf maximal 200 Layout-Einheiten begrenzt. Die Sammlung behält separate Cards und ihren Button Verbessern.

- Garage: ergänzende Betriebsdaten Gefahren/Aufträge/Status und laufender Fortschritt bleiben erhalten. Unten Wechseln und Entfernen, kein Verbesserungsbutton. Beide Aktionen sind bei einem nicht freien Fahrzeug gesperrt.
- Flotte: unten Wechseln und Entfernen statt Verbessern. Die vorhandene Flottenauswahl und Zuordnungslogik bleiben bestehen; Plätze und bereits verwendete Fahrzeuge werden weiterhin markiert.
- Die Bonus-Stufenhilfe ist in beiden Kontextansichten erreichbar. Sie wird bei einem übergeordneten blockierenden Modal ausgeblendet.
- Eine nicht bestätigte Änderung zeigt den vorhandenen Fehlerhinweis. Der Garagenwechsel hat eine Zurück-Aktion zur ursprünglichen Fahrzeugansicht.

## Sicherer Garagenwechsel

Neuer Serverbefehl `garageReplace` nimmt ursprüngliche Karten-ID und Ersatzkarten-ID entgegen. Zielkarte muss bekannt, im Besitz und außerhalb der Garage sein. Die Entfernung nutzt weiterhin die bestehenden Prüfungen für laufende Einzelaufträge, Expeditionen, Materialbeschaffung und reservierte Ersatzfahrzeuge. Entfernen und Hinzufügen erfolgen im selben Servervorgang, auch bei voller Garage. Die Zielkarte übernimmt die Position des bisherigen Fahrzeugs. Geparkte Fahrzeuge behalten Kapazitätsausbauten, Rang und Statistiken. Bestände, Münzen und Einsatzregeln werden nicht verändert. Ein unerwartet fehlschlagendes Hinzufügen wirft einen Fehler, damit die serverseitige Transaktion keinen halben Wechsel speichert.

## Prüfung

- Typprüfung und alle 177 Tests erfolgreich.
- Neue Tests: volle Garage mit Positionserhalt und wiederhergestellten Ausbauten/Statistiken; unzulässige, doppelte, unbekannte oder nicht besessene Ersatzkarten; keine Entfernung eines laufenden Fahrzeugs.
- Mobile Browserprüfung bei 320/390/430 px: gemeinsame Bereiche, kein Verbesserungsbutton in Garage/Flotte, beide Wechsel-/Entfernen-Aktionen, Bonus-Stufenhilfe, Zurück in der Garagenauswahl, gesperrte Aktionen bei laufendem Auftrag und erhaltenes Verbesserungsmodal der Sammlung.
- Deutsch/Englisch geprüft, keine Laufzeitfehler oder seitlicher Überlauf. Screenshots der kompakten Kontextdetails visuell geprüft.
- Android-Export erfolgreich. Kein physischer Gerätetest.

Keine Veröffentlichung: zunächst zusammen mit den bereits gesammelten Garage-/Sammlungskarten und den angepassten Detailbeschriftungen bereitgestellt. Der Serverbefehl muss bei einer späteren Veröffentlichung vor dem neuen Client ausgerollt werden.
