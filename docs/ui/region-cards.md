# Regionskarten im Reiseatlas

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

Nur die fünf Karten der Regionsübersicht wurden überarbeitet. Neue Darstellungsnamen und regionale Stammkundentitel:

| Region | Stammkunde | Bild |
| --- | --- | --- |
| Kronenlande | Königliches Handelskontor | Handelsstraße, Gutshaus, Pferdewagen |
| Weite Ebenen | Prärie-Handelsgesellschaft | Prärie, Holzstation, Planwagen |
| Safranstraße | Bund der Karawanenhändler | Karawanserei, Lehmstadt, Kamele |
| Jadetal | Handelshaus der Jadebrücke | Fluss, Brücke, Terrassen und Berge |
| Nordmark | Nordlicht-Kontor | Verschneiter Handelsposten, Tannen, Lastschlitten |

Regionen und Stammkunden verwenden inzwischen die gemeinsame Anzeigeidentität aus `functions/src/customer-identities.json`, siehe [Regionale Stammkunden](customer-regions.md). Stabile Regionindizes und Kundenkennungen bleiben erhalten. Prozentberechnung und Freischaltungen werden durch die Bilddarstellung nicht verändert.

Die bisherige Karte ist bei 320/360/390/430 px jeweils 200 px hoch. Diese Höhe und die bisherige Breite bleiben exakt erhalten; Abstand weiterhin 12 px. Der Bildteil nutzt die vorhandene Höhe. Regionsname auf einem dunklen Bildstreifen; darunter ein 46 px hoher bildfreier Streifen mit Stammkundentitel links und Prozentzahl rechts. Nummernsiegel, Expeditionsgebiet/Erkundung, Fortschrittsbalken und Orts-/Bonizähler entfallen nur in dieser Regionsübersicht. Gesperrte Karten behalten ein lesbares Schlossschild und ihren gesperrten Zustand.

Fünf eigene Bilder mit dem eingebauten Imagegen-Werkzeug erzeugt; fertige Appbilder als optimierte JPEGs mit 768×512 px in assets/art/regions/. Die vollständigen Prompts stehen dort in prompts.json. Dateien zusammen rund 426 KiB. Ursprüngliche Bildausgaben bleiben erhalten; Spielassets benötigen keine neue native Abhängigkeit.

Historische Validierung bei Einführung: Typprüfung, alle 105 vorhandenen Tests und Androidexport erfolgreich. Offline-Browserprüfung der tatsächlichen Appkomponenten bei 320/360/390/430 px: alle fünf Namen/Stammkunden, Bildladung, unveränderte Kartenmaße, Prozentanzeige, kein Fortschrittsbalken auf den Regionskarten, gesperrte Zustände, Einstieg in Region 1, erhaltene innere Erkundungs-/Bonuslieferungsanzeigen und englische Texte. Keine JavaScript-Fehler.
