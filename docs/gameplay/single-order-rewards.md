# Einzelaufträge: Belohnungen beim Abholen

Die serverseitige Abrechnung trennt die Lieferung von der Belohnungsvergabe. Nach der Ankunft ist der Einzelauftrag abgeschlossen und seine Belohnung abholbar. Erst das ausdrückliche Abholen, einzeln oder gesammelt, schreibt die ausstehenden Belohnungen gut.

| Zeitpunkt | Wirkung |
| --- | --- |
| Lieferung | Die Transportkosten werden abgerechnet. Der Auftrag kann als abgeschlossen für Season-Aufgaben zählen. Noch keine Vergütung, Spieler-XP oder Kundenbeziehungspunkte. |
| Abholen | Ausstehende Brutto-Frachtvergütung einschließlich Vergütungsbonus, Spieler-XP, Beute, Kundenbeziehungspunkte und gefundene Sonderaufträge werden einmalig vergeben. |
| Belohnungsmodal | Zeigt die tatsächlich gutgeschriebenen positiven Mengen der gemeinsamen serverseitigen Zusammenfassung. |

Die Transportkosten werden beim Abholen nicht erneut abgezogen. Deshalb zeigt das Belohnungsmodal die ausgezahlte Frachtvergütung einschließlich Bonus und nicht den bereits um Transportkosten verminderten Nettoertrag.

Ein noch nicht abgeholter Abschluss erhöht weder Spielerlevel noch Kundenbeziehung. Entsprechende Levelmeldungen entstehen erst durch das Abholen. Gefundene Sonderaufträge sind vorher ebenfalls noch nicht als Vorrat verfügbar. Wiederholtes Abholen vergibt keine zweite Belohnung.

Für die Season bleibt die Unterscheidung erhalten: Abschlussaufgaben schreiten beim Abschluss fort; Aufgaben zum Verdienen von Talern zählen erst die beim Abholen tatsächlich erhaltenen Taler. Season-Fortschritt durch den Einsatz von Expeditionspunkten oder Überstunden bleibt an deren tatsächlichen Verbrauch gebunden.

Die Umstellung gilt für neu in der ausstehenden Tourabrechnung erfasste, noch unbezahlte Lieferungen. Bei einem bereits laufenden Altauftrag werden nur die nach der Umstellung abgeschlossenen Touren in dieser Abrechnung vorgemerkt. Historische Buchungswerte bereits bezahlter Touren sind keine Grundlage für eine neue Auszahlung. Ein bereits abgeschlossener Altauftrag ohne ausstehende Tourabrechnung behält seine bisherige Bonus- und Beuteabholung. Bereits nach den alten Regeln ausgezahlte Touren werden nicht nachträglich erneut vergütet. Bestehende Spielstände und alte Aufträge bleiben nutzbar; bereits gewährte XP oder Beziehungsfortschritte werden nicht zurückgenommen. Der serverseitige Abholmarker verhindert eine erneute Vergabe.

Die gemeinsame Anzeige in `src/ClaimRewards.tsx` unterstützt dafür neben Talern, XP und Beute auch optionale `customerTrust`- und `specialOrders`-Mengen. Beziehungspunkte verwenden das bestehende Kundenicon; gefundene Sonderaufträge verwenden ihr vorhandenes Itembild. Fehlende und nicht positive Mengen erzeugen keine Zeile.
