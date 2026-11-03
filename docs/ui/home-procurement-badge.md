# Startseite: ein Materialbeschaffungszugang

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

Separate obere Materialbeschaffungs-/Belohnungskarte entfernt. Der bestehende Menüeintrag bleibt und zeigt bei abholbarem Bestand ein kleines Belohnungssymbol mit der Summe aller tatsächlich wartenden Items (Zahnräder und Firmenausbau-Items). Bei null kein Badge. Der Screenreader nennt die Anzahl ebenfalls. Antippen führt weiterhin zur Beschaffungsseite; Abholung und Belohnungsmechanik bleiben unverändert.

Quelltextprüfung: vorherige Komponente und Import entfernt, Summe aus procurement.pending, keine zweite Kachel oder zusätzliche Abholaktion. Kein vollständiger App-Build oder Gerätetest in dieser Vorbereitung.
