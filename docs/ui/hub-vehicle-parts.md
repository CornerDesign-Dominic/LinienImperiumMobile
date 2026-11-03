## Stadthub-Boten und Werkzeugkästen

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Ein Boten-Grundmodell (Lastwombat), direkt im Stadthub anwerben: 25.000 Imperium-Taler, 2 t, bisheriges Grundtempo. Alte Händlerlinks führen zum Stadthub; alter Kaufbefehl gesperrt. Die historischen Fahrzeug-/Teil-IDs bleiben erhalten; sichtbare Materialien heißen Werkzeugkästen.
- Alle fünf Spielerlevel ein Platz, maximal 20 bei Level 100. Bestehende Fahrzeuge über dem neuen Limit bleiben erhalten, weitere Käufe sind gesperrt.
- Laderaum/Antrieb: je zehn Stufen. Laderaum +0,2 t je Stufe bis 4 t; Antrieb +2,5 % Grundtempo je Stufe bis +25 %. Stufe N kostet 14 × N Werkzeugkästen und 2.500 × N Imperium-Taler. Aktueller Stundenzyklus behält seine Einkommenswerte.
- Neue Stadttransporter verwenden keine Zahnrad-Ränge oder Kapazitätsmodule. Kartenfahrzeuge unverändert.
- Bestehende Fahrzeuge bleiben mit IDs/Statistik/Kaufpreis erhalten. Modell vereinheitlicht; erreichte Kapazität/Tempo bleiben mindestens erhalten, Module einmalig zurückgegeben, Ränge in Antriebstufen überführt. Migration wiederholbar ohne doppelte Rückgabe.
- Drei Fundkisten je UTC-Tag, 30 Minuten zwischen tatsächlichen Öffnungen auch über Mitternacht. Je Kiste 10–20 Werkzeugkästen, Mittelwert 15. Keine angesammelten Öffnungen. Verfügbarkeit ab Level 5.
- Beim stündlichen Einkauf ein 50-%-Versuch für genau einen Werkzeugkasten, unabhängig von Fahrzeugzahl. Maximal ein Versuch je Stunde und 24 je UTC-Tag; keine neuen Versuche bei voller Hub-Kasse oder ohne eingesetzte Fahrzeuge. Teile in Kasse mit Erträgen abholen.
- Serverzustand und Transaktionsbelege verhindern doppelte Kistenbelohnungen bei wiederholter Anfrage. Offline-Funde stoppen beim sechsten Kassenzyklus; keine nachträgliche Beute aus vollen Stunden.
- Werkzeugkästen sind mit kanonischem Namen, Bild und Stadthub-Link in den Vorräten sichtbar.
- Deutsche/englische Oberfläche und Spielhilfe angepasst.
- Bild- und Oberflächenreferenz: [Boten](hub-couriers.md) und [Botendetails](hub-vehicle-detail.md).
- Historische Prüfung bei Einführung: damals 113 Backend-/Mathe-/Regressionstests bestanden (10 neue Stadthub-/Belegtests). Damals wurden Gesamt-Typprüfung und Android-Export nicht ausgeführt; ein Gerätetest ist damit nicht belegt.

---
