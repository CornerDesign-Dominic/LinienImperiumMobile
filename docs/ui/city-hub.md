Veröffentlicht am 24.10.2026 mit Release `bd678df7b4e82278b18dba33447b7ece0c5bf390` (Mobile preview, Lauf 40088588867). Frühere Sammelvermerke im folgenden Text sind historisch.

# Stadthub: Übersicht und Fahrzeuge

Gesammelt im Branch `batch/company-improvements`, noch nicht veröffentlicht.

- Hub-Bild entfernt. Zwei Reiter: Übersicht und Fahrzeuge.
- Erträge stehen zuerst: Münzen, Abholhinweise und Fahrzeugteile als drei kompakte Werte mit Icons. Sechs-Stunden-Speicher, Fortschritt, nächster Einkauf und Abholen bleiben sichtbar. Bei voller Kasse oder ohne eingesetzte Transporter gibt es einen passenden Hinweis.
- Fundkisten zeigen die verbleibende Tagesanzahl, Öffnen oder Wartezeit. Die Regeln stehen hinter dem Fragezeichen. Das Ergebnis öffnet ein eigenes Modal.
- Vertrieb zeigt Stufe, Einkaufsquote und Verteilkapazität. Das Ausbau-Modal zeigt aktuelle/nächste Quote, Dauer sowie vorhandene/benötigte Münzen, Kontakte und Firmenausbau-Items. Laufender Ausbau und Maximum haben eigene Zustände.
- Fahrzeuge stehen im Dreierspaltenraster: Kennung, Kapazität, Geschwindigkeit, zwei Ausbauanzeigen und Einsatzstatus. Der Teilebestand steht einmal über dem Raster. Ein freier Platz öffnet den Kaufdialog; bei voller Belegung wird das nächste Freischaltlevel angezeigt.
- Fahrzeugdetails enthalten kompakte Werte und zwei Ausbauabschnitte mit Trennlinien. Effekt und Ressourcenvergleich stehen direkt beim jeweiligen Button. Kilometer und Einsatzstatus sind unter Weitere Details einklappbar; Herausnehmen, Wiedereinsetzen und der bestehende bestätigte Verkauf unter Weitere Aktionen.
- Serverregeln, Preise, Teile-Chancen, Ausbaustufen und Bestandsfahrzeuge bleiben erhalten. Eingehende Serverdaten aktualisieren offene Dialoge; Mehrfachtipps lösen keinen zweiten gleichzeitigen Befehl aus. Fehlgeschlagene Aktionen können erneut versucht werden.
- Zeitbasierte Aktualisierung berücksichtigt jetzt auch den nächsten Hubzyklus und das Ende eines Vertriebsausbaus.

Prüfung: drei gezielte UI-Verhaltenstests ergänzen die vorhandenen neun Hub-Regeltests. Der Gesamtlauf umfasst 195 erfolgreiche Fälle. Typprüfung, Android-Export und Browserprüfung bei 320/390/430 px, Modale und Englisch. Kein physischer Android-Gerätetest.
