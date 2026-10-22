# Seitlicher Seitenabstand

Vorbereitet am 22.10.2026 im Sammelbranch `batch/company-improvements`. Nicht veröffentlicht.

- Gemeinsamen horizontalen Außenabstand des Seiteninhalts von 18 auf 9 React-Native-Einheiten halbiert. Gilt für sämtliche Ansichten im gemeinsamen Scrollcontainer, einschließlich Start, Firma, Sammlung, Garage, Flotte, Aufträgen, Vorräten und Einstellungen.
- Expeditionsübersicht behält ausdrücklich 18 Einheiten. Die bildschirmfüllende Expeditionskarte verwendet weiterhin ihren bisherigen separaten Container ohne den allgemeinen Seitenabstand.
- Abweichende Layoutabstände in Navigation, Kopfzeile, Modalen und innerhalb der Karten bleiben unverändert. Vertikale Abstände bleiben unverändert.
- Typprüfung erfolgreich. Kein physischer Gerätetest und keine Veröffentlichung.
