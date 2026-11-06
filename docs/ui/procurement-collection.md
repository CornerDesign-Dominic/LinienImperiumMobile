# Materialbeschaffung: Abholen und Abhol-Buch

Die Seite zeigt vor dem Abholen keine bereits angesammelten Beutearten oder Mengen. Der grüne Bereitschaftspunkt bleibt sichtbar, sobald der zentrale `procurement.pending`-Vorrat Beute enthält. Der Einsammeln-Button steht direkt unter „Materialien suchen“; ohne Beute ist er deaktiviert. Laufende Beschaffungen und Ortsauswahl bleiben erhalten.

`procurementClaim` überträgt weiterhin genau denselben Vorrat in das Inventar. Der Server gibt zusätzlich einen Snapshot der tatsächlich übertragenen Zahnräder und Firmenausbau-Items als `claimSummary` mit Quelle „Materialbeschaffung“ zurück. Die App zeigt diese Übersicht im bestehenden Modal „Belohnung“. Ein zweiter Aufruf ohne neue Beute zahlt nichts aus und liefert keine weitere Übersicht. Schnelle Doppeltipps sind zusätzlich im Client gesperrt; fehlgeschlagene Anfragen lassen sich erneut versuchen.

Das Abhol-Buch verwendet eine neue Illustration eines petrolfarbenen Handelsjournals mit Messingbeschlägen und Zahnrad-/Paket-Prägung. Die größere Einstiegskarte zeigt die Gesamtzahl erfolgreicher Abholungen. Im geöffneten Buch steht das große Bild über Gesamtzahl und Regionalstatistik.

Die Einsatzlampe auf den Botenbildern entfällt. Einsatzstatus als Text für Barrierefreiheit und Detailanzeige sowie Ausbauhinweise bleiben erhalten.

## Prüfung

- TypeScript-Prüfung bestanden.
- Vollständige Testsuite: 374 Tests bestanden; zusätzlich nach Ergänzung des Belohnungslisten-Checks alle 15 Beschaffungs-Engine-Tests bestanden.
- Android-Produktionsbundle erfolgreich exportiert.
- Neue bzw. angepasste Tests prüfen genaue Auszahlung und Modalquelle, keine Auflistung vor dem Abholen, Buttonposition, Doppeltipps, leere/fehlerhafte Antworten, erneuten Versuch, Abholbuchbild und Statistik sowie entfernte Botenlampe bei erhaltenen Ausbauhinweisen.
- Illustration visuell geprüft. Kein nativer Gerätetest und keine Browser-Screenshots: Chromium ist nicht installiert; der Installationsversuch lieferte ein unvollständiges ZIP-Archiv. Die Komponenten-Tests ersetzen keine native Layoutprüfung.

![Abholjournal](../../assets/art/procurement/collection-ledger.png)
