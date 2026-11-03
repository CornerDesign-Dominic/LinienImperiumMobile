# Seitlicher Seitenabstand

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Gemeinsamen horizontalen Außenabstand des Seiteninhalts von 18 auf 9 React-Native-Einheiten halbiert. Gilt für sämtliche Ansichten im gemeinsamen Scrollcontainer, einschließlich Start, Firma, Sammlung, Garage, Flotte, Aufträgen, Vorräten und Einstellungen.
- Expeditionsübersicht verwendet separat 12 Einheiten. Die bildschirmfüllende Expeditionskarte verwendet weiterhin ihren bisherigen separaten Container ohne den allgemeinen Seitenabstand.
- Abweichende Layoutabstände in Navigation, Kopfzeile, Modalen und innerhalb der Karten bleiben unverändert. Vertikale Abstände bleiben unverändert.
- Typprüfung erfolgreich. Kein physischer Gerätetest.
