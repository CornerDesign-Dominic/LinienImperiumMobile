# Gemeinsames Belohnungsmodal

Aktuelle Implementierung: `src/ClaimRewards.tsx`, eingebunden durch `src/App.tsx` (03.11.2026).

Das mittige Modal zeigt nur tatsächlich erhaltene positive Mengen aus der serverseitigen Zusammenfassung. Jede Art erhält eine eigene Zeile mit 52-dp-Bild, ausgeschriebenem Namen und rechts ausgerichteter Menge. Enthalten sind Imperium-Taler, Spieler-XP, Kundenbeziehungspunkte und gefundene Sonderaufträge sowie Zahnräder und Splitter je Seltenheit, Kapazitätsmodule, Firmenausbau-Items, Lieferantenkontakte, Abholhinweise und Werkzeugkästen, soweit im konkreten Ergebnis vorhanden.

Bei Einzelaufträgen erscheinen diese Mengen erst nach dem ausdrücklichen Abholen. Die Talerzeile enthält die Brutto-Frachtvergütung einschließlich Bonus; Transportkosten wurden bereits bei der Lieferung abgerechnet. [Abrechnungsregeln und Altspielstände](../gameplay/single-order-rewards.md).

Herkunft und gegebenenfalls Zahl der Abschlüsse stehen im Kopf. Viele Items scrollen im Inhalt; Schließen bleibt außerhalb der Liste. Lange Namen und große Zahlen haben getrennte flexible Breiten. Die frühere Kacheldarstellung ist ersetzt. Keine zusätzliche schwebende Erfolgsmeldung beim Einsammeln; Vergabe, Wiederholschutz und Vorrang von Levelmeldungen bleiben server-/ablaufseitig erhalten.

Prüfbezug: bestehende Belohnungs-/Modaltests und [tests/README.md](../../tests/README.md). Diese Dokumentationspflege enthält keinen neuen Layout- oder Gerätetest.
