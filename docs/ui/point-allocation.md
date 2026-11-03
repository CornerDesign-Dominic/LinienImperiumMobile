# Entwicklung und Punkteverteiler

Gesammelt, nicht veröffentlicht. Maßgeblich sind `src/LevelUp.tsx`, `src/ExpansionPoints.tsx` und die gemeinsame Darstellung `src/PointAllocation.tsx`.

## Darstellung

Ein Entwicklungsbereich mit permanentem Überstunden- und Expeditionsbasiswert. Keine Gesamtsumme mit Kartenboni und keine zusätzliche Mini-Gleichung. Der globale Ressourcenheader zeigt weiterhin echte Maxima mit allen Boni.

Levelpunkte und Ausbaupunkte haben getrennte, benannte Einstiege und Bestände. Die Dialoge verwenden denselben kompakten Zeilenaufbau: Basiswert → Basiswert plus Entwurf, Minus/Plus, Rest/Gesamt und Bestätigung. Kein Hinweisabsatz. Die Verteilung startet ausschließlich manuell.

Punkteanzeigen einschließlich oberem Verfügbarkeitsbadge verwenden helle Materialfläche, dünne Petrolkontur und Petroltext nach dem Muster der Boten-Ausbauvorschau. Derselbe Stil ersetzt die dekorativen grünen Nach-Ausbau-Flächen im Imperiumsausbau-Detail und Verteilnetz. Semantische Statusflächen, aktive Tabs und Auswahlkennzeichnung bleiben unverändert; keine globale Palettenänderung.

In der Imperiumsausbau-Übersicht bleibt genau ein goldener Hinweis am Titel, sofern irgendein Ausbau nach echten Serverkosten und Vorräten bezahlbar ist. Untergruppen und einzelne Werte erhalten keine Punkte. Der Detaileditor behält seine gezielten Verfügbarkeitshinweise und Aktionen.

## Unveränderte Regeln

Die Basiswerte kommen direkt aus `view.development.{expedition,overtime}.base`, nicht aus einer geschätzten Rückrechnung. `levelBatch` verbraucht weiterhin vollständige Levelpunkt-Batches, `expansionAllocate` kann weiterhin einen Teil seines eigenen Bestands verteilen. Es gibt keine neue Poolzusammenlegung, Migration oder automatische Ausgabe. Entwürfe bleiben bei neu eintreffenden Punkten erhalten und werden nur bei unzureichendem Bestand zurückgesetzt. Serverbestätigung, Fehleranzeige und Doppeltippschutz bleiben erhalten.

## Prüfung

13 Backendtests in `tests/development.test.cjs` und `tests/expedition-completion.test.cjs` erfolgreich (darunter Pooltrennung, keine Energieauffüllung und Basiswerte ohne Boni). Komponententests für Basiswertvorschau trotz Boni, getrennte Bestände, Entwurfserhalt, unvollständige Level-Batches, Fehlerrückmeldung und parallele Bestätigung ergänzt bzw. angepasst. Lokal wegen fehlendem React/TypeScript nicht ausführbar. Kein neuer App-Export oder Gerätetest; vor Veröffentlichung visuell auf schmalem Gerät und in beiden Sprachen prüfen.
