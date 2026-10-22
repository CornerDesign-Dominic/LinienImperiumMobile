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
