# Transportverbesserungen: Übersicht und Einzel-Ausbau

Implementierungsnotiz zum mobilen Quellstand. Frühere Testzahlen und Layoutprüfungen unten sind historische Nachweise, kein neuer Gesamttest. Aktuelle Veröffentlichungen: [PENDING_UPDATE.md](../../PENDING_UPDATE.md); Prüfstatus: [TEST_REPORT.md](../../TEST_REPORT.md).

- Kleine Materialzeile mit vorhandenem Bestand und Vorratslink statt großer Infokarte.
- Reiter für Regionalverkehr und Fernverkehr, drei kompakte Verbesserungszeilen je Bereich.
- Zeilen zeigen Icon, aktuellen Effekt, Stufe/Limit und einen erklärten Verfügbarkeitspunkt. Ein Tippen öffnet die Details, ohne einen Kauf auszulösen.
- Modal vergleicht aktuellen Effekt und Effekt nach Ausbau. Stufenzahl beginnt bei eins; Plus/Minus ändern nur die Vorschau.
- Gesamtkosten für Münzen und Firmenausbau-Items, Materialbedarf/Bestand und eindeutiger Kaufbutton.
- Kaufen erst nach expliziter Betätigung. Bestehender Serverbefehl transportBatch mit Stufenprüfung bleibt unverändert. Keine Wirtschafts-, Preis- oder Spielstandänderung.
- Erneutes Öffnen beginnt mit einer Stufe. Bei geänderter Serverstufe wird neu kalkuliert. Fehler lassen das Modal offen; Erfolg aktualisiert die Übersicht und schließt es. Doppelte Betätigung während einer Anfrage wird abgefangen.
- Fehlender Bestand, volle Ausbaustufen und laufende Anfragen deaktivieren den Kauf. Schließen ist während der Anfrage gesperrt.
- Deutsch und Englisch.

Historische Prüfung bei Einführung: TypeScript erfolgreich; alle 169 bestehenden Tests erfolgreich. React-Native-Web-Prüfung bei 320/360/390/430 px: Reiter, mehrstufige Gesamtkosten, Materialgrenze, bestätigter Kauf, fehlgeschlagener Kauf, fehlender Bestand und maximale Stufe erfolgreich; keine Laufzeitfehler oder seitlicher Überlauf. Englische Modalbeschriftung und Kaufaktion geprüft. Lokaler Android-Export erfolgreich. Physischer Android-Gerätetest steht aus.
