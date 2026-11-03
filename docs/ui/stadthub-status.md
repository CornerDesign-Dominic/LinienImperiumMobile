# Stadthub-Status auf der Startseite

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Füllstand direkt rechts in der vorhandenen Stadthub-Kachel: 0/6 bis 5/6, ab sechs gesammelten Zyklen „Voll“ in Gold.
- Vor Eröffnung des Stadthubs keine Füllstandsanzeige. Englische Anzeige verwendet die vorhandene Übersetzung „Full“.
- Zusätzliche Stadthub-Hinweiskarte auf der Startseite entfernt; Detailseite und genauer Countdown unverändert.
- Status hat eine feste Mindestbreite, schrumpft nicht und erhöht die Kachelhöhe nicht; Beschreibung bleibt einzeilig. Bedienungshilfen lesen den Status mit.
- Reine Anzeigeänderung auf aktuellem main; Beschaffung, Flotten und übrige Funktionen erhalten. Codeänderung geprüft; kein vollständiger App-Build oder Gerätetest für diesen vorbereiteten Stand.
