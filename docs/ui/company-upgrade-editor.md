# Transportverbesserungen: Übersicht und Einzel-Ausbau

Vorbereitet am 22.10.2026. Nicht veröffentlicht.

Sammelbranch: `batch/company-improvements`. Ausgangspunkt ist main nach der Event-Erweiterung (`f1aab045b3baa5850e8ddf662ca22ec74ce77182`).

- Kleine Materialzeile mit vorhandenem Bestand und Vorratslink statt großer Infokarte.
- Reiter für Regionalverkehr und Fernverkehr, drei kompakte Verbesserungszeilen je Bereich.
- Zeilen zeigen Icon, aktuellen Effekt, Stufe/Limit und einen erklärten Verfügbarkeitspunkt. Ein Tippen öffnet die Details, ohne einen Kauf auszulösen.
- Modal vergleicht aktuellen Effekt und Effekt nach Ausbau. Stufenzahl beginnt bei eins; Plus/Minus ändern nur die Vorschau.
- Gesamtkosten für Münzen und Firmenausbau-Items, Materialbedarf/Bestand und eindeutiger Kaufbutton.
- Kaufen erst nach expliziter Betätigung. Bestehender Serverbefehl transportBatch mit Stufenprüfung bleibt unverändert. Keine Wirtschafts-, Preis- oder Spielstandänderung.
- Erneutes Öffnen beginnt mit einer Stufe. Bei geänderter Serverstufe wird neu kalkuliert. Fehler lassen das Modal offen; Erfolg aktualisiert die Übersicht und schließt es. Doppelte Betätigung während einer Anfrage wird abgefangen.
- Fehlender Bestand, volle Ausbaustufen und laufende Anfragen deaktivieren den Kauf. Schließen ist während der Anfrage gesperrt.
- Deutsch und Englisch.

Prüfung: TypeScript erfolgreich; alle 169 bestehenden Tests erfolgreich. React-Native-Web-Prüfung bei 320/360/390/430 px: Reiter, mehrstufige Gesamtkosten, Materialgrenze, bestätigter Kauf, fehlgeschlagener Kauf, fehlender Bestand und maximale Stufe erfolgreich; keine Laufzeitfehler oder seitlicher Überlauf. Englische Modalbeschriftung und Kaufaktion geprüft. Lokaler Android-Export erfolgreich. Physischer Android-Gerätetest steht aus.

Nicht veröffentlicht: kein Deployment, kein EAS Update, kein Merge nach main. Die laufende Event-Veröffentlichung wurde nicht verändert.
