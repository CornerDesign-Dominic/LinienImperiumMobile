# Gemeinsames Verbesserungsmodal für Fahrzeugkarten

Vorbereitet am 22.10.2026 im Sammelbranch `batch/company-improvements`. Nicht veröffentlicht.

Am Ende der Kartendetails führt ein einzelner Button „Verbessern“ in ein gemeinsames, bei Bedarf scrollbareres Modal. Nicht besessene Karten können noch nicht verbessert werden. Die zuvor entfernten separaten Ausbau-Cards bleiben entfernt.

Drei kompakte Bereiche:

- Kartenstufe: aktuelle/nächste römische Stufe, Bonusart sowie genauer Bonus vorher/nachher. Kosten sind die bis zur nächsten Stufe verbleibenden Splitter der Kartenseltenheit. Bereits eingezahlter Fortschritt wird angerechnet. Der Button ist nur bei ausreichend Splittern für die vollständige nächste Stufe aktiv.
- Kapazität: Kapazität vorher/nachher, eingesetzte Module/Limit; Kosten ein Kapazitätsmodul.
- Geschwindigkeit: aktueller/nächster Gesamtrang, Durchschnittstempo vorher/nachher und prozentuale Tempoverbesserung; Kosten die vom bestehenden Server gemeldeten Zahnräder der aktuellen Rangseltenheit.

Jeder Bereich zeigt Materialname mit Icon, Kosten und eigenen Bestand, bei Mangel zusätzlich die fehlende Menge. Das Upgrade ist ausdrücklich pro Bereich auszulösen. Maximalstufen zeigen einen Maximumhinweis ohne Kaufbutton. Alle Aktionen sind während einer Anfrage gesperrt, ein zusätzlicher Ref schützt vor doppelter Betätigung. Erfolg aktualisiert Werte und Bestände im geöffneten Modal; ein nicht bestätigtes/fehlgeschlagenes Upgrade zeigt einen Hinweis und erhält die Auswahl. Schließen während der Anfrage wird verhindert.

Die bestehenden Befehle cardUpgrade/cardCapacity/cardRank, Preise und Mechaniken werden weiterverwendet. Es werden keine Münzkosten erfunden. Der Server liefert zusätzlich `cardVehicles[id].upgradePreview` für Kapazität und Geschwindigkeitsrang. Diese Vorschau verwendet dieselben Kapazitäts-/Tempo-/Rangfunktionen wie das tatsächliche Upgrade und verändert weder Spielstand noch Vorräte. An den Ausbaugrenzen sind die jeweiligen Vorschauen null. Bei einer noch nicht verfügbaren Servervorschau bleiben die betroffenen Upgrade-Aktionen gesperrt.

Deutsch und Englisch. Durchschnitt wie vereinbart numerisch drei, sichtbar maximal zwei Nachkommastellen. Bonuswerte werden mit bis zu zwei Nachkommastellen gezeigt.

Prüfung:
- TypeScript und alle 174 Tests erfolgreich.
- Neue Serverprüfungen gleichen Vorschau mit tatsächlichen Kapazitäts-/Rangupgrades ab, einschließlich verschiedener Fahrzeuge, geparkter Karten, Rang-Seltenheitswechsel und Maximalgrenzen.
- React-Native-Web bei 320/390/430 px: alle drei Upgrade-Arten, Anrechnung von Splitterfortschritt, fehlende Vorräte, alle Maximalstufen und Fehlerfall erfolgreich; keine Laufzeitfehler oder seitlicher Überlauf.
- Englische Anzeige erfolgreich geprüft.
- Android-Export erfolgreich. Kein physischer Android-Gerätetest.

Kein Deployment und kein EAS Update. Zusammen mit dem übrigen Sammelstand erst nach ausdrücklichem Go veröffentlichen.
