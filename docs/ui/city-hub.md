# Stadthub: Übersicht und Fahrzeuge

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Kein großes Hubbild am Seitenanfang. Reiter Übersicht und Boten.
- Übersicht verwendet die aktuellen Komponenten HubEarnings, Fundkisten und HubSales. Erträge, sechs Speicherzyklen, Einkaufspunkt und laufender Vertriebsausbau bleiben echte Werte; einzelne Bereiche besitzen ihre eigenen dekorativen Motive.
- Fundkisten zeigen Verfügbarkeit/Wartezeit und öffnen ein separates Werkzeugkasten-Ergebnis. Regeln und serverseitige Limits bleiben erhalten.
- Boten erscheinen als Lastwombats im Dreispaltenraster mit Statuspunkt, Tragkraft, Tempo und zwei Ausbaustufen. Namen stehen im Detail und in zugänglichen Beschriftungen. Freie Plätze zeigen Anwerben, der nächste gesperrte Platz sein Freischaltlevel.
- Gemeinsame Boten-Details enthalten Ausbauvorschau, Ressourcenvergleich, Einsatz und bestätigten Verkauf. Fehler erlauben Wiederholung; Mehrfachtipps lösen keine parallele zweite Anfrage aus.
- Serverregeln und aktuelle Details sind in [Hub-Erträge](hub-earnings.md), [Vertrieb](hub-sales.md), [Boten](hub-couriers.md), [Botendetails](hub-vehicle-detail.md) und [Werkzeugkästen](hub-vehicle-parts.md) beschrieben.

Historische Prüfung bei Einführung: drei gezielte UI-Verhaltenstests ergänzen die vorhandenen neun Hub-Regeltests. Der Gesamtlauf umfasst 195 erfolgreiche Fälle. Typprüfung, Android-Export und Browserprüfung bei 320/390/430 px, Modale und Englisch. Kein physischer Android-Gerätetest.
