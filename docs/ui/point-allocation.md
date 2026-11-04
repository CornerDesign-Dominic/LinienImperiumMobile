# Entwicklung und gemeinsame Ausbaupunkte

Gesammelt am 04.11.2026, noch nicht veröffentlicht. Diese Nutzerentscheidung ersetzt die frühere Trennung von Levelpunkten und Ausbaupunkten.

Alle dauerhaft verteilbaren Punkte heißen Ausbaupunkte. Levelaufstiege geben weiterhin 3, einmalige Ortslieferungen weiterhin 1. Beide Quellen zahlen in denselben Vorrat ein: 6 bisherige Levelpunkte plus 1 Expeditions-Ausbaupunkt ergeben 7 Ausbaupunkte. Entwicklung zeigt einen Bestand und einen Button „Ausbaupunkte verteilen“; Home verwendet denselben Bestand. Ein manueller Verteildialog zeigt Rest/Gesamt und Basiswert → Basiswert plus Entwurf. Auch Teilmengen können bestätigt werden; kein Hinweisabsatz und kein automatisches Öffnen.

Übersicht und Vorschau zeigen permanente Basismaxima ohne Karten-/Entdeckungsboni; der globale Ressourcenheader behält echte Gesamtmaxima. Punkteanzeigen verwenden helle Materialfläche mit dünner Petrolkontur. Nur am Titel Imperiumsausbau steht in der Übersicht ein bezahlbarkeitsabhängiger goldener Hinweis; gezielte Detailaktionen bleiben erhalten.

## Autorität, Übernahme und Kompatibilität

`game.expansion.available` ist der einzige gespeicherte freie Punktestand. Die alte unzugeteilte Liste `pendingLevelUps` wird serverseitig mit 3 Punkten je Eintrag in diesen Bestand übernommen und geleert. Neue Levelgutschriften nutzen denselben Weg; bereits zugeteilte Kapazitäten und frühere Expeditionsgutschriften bleiben erhalten. Wiederholte Synchronisierung zählt keine Punkte erneut. `view.development.points` ist ausschließlich ein Anzeigespiegel, kein zweiter Vorrat.

`expansionAllocate` speichert eine positive Teilmenge gegen den erwarteten aktuellen Gesamtbestand. Alte Befehle `levelBatch` und `level` verwenden denselben Vorrat. Veraltete erwartete Bestände werden abgewiesen; der alte Einzel-Level-Befehl kann weiterhin genau 3 Punkte zuteilen. Zuteilungen erhöhen nur Maxima, füllen aktuelle Energie nicht auf und erhalten Regenerationsfortschritt. Request-Belege verhindern erneute Ausgabe bei wiederholten Cloud-Anfragen. Server vor dem neuen Client ausrollen.

Entwürfe bleiben bei neu eintreffenden Punkten erhalten und werden nur bei unzureichendem Bestand zurückgesetzt. Bestätigung, sichtbare Fehler und Doppeltippschutz bleiben erhalten.

## Prüfung

Gezielte Backendtests decken 6+1=7, wiederholte Übernahme ohne Doppelgutschrift, erhaltene alte Maxima, gemeinsame neue Level-/Ortsgutschriften, Teilverteilung, alte Befehle, unveränderte Energie und Regeneration sowie Cloud-Wiederholungen ab. Angepasste Komponentenprüfungen decken einen einzigen Einstieg, Basisvorschau, Entwurf und Bestätigung ab. Ein neuer vollständiger App-Export oder physischer Gerätetest ist noch nicht belegt.
