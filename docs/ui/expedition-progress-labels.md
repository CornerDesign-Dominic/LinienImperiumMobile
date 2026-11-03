# Expedition: Fortschrittsanzeigen

Aktueller Implementierungsbezug: `src/ExpeditionJourney.tsx` und `src/ExpeditionPlaceDetails.tsx` (03.11.2026). Die frühere separate Ortskartenansicht mit zwei permanenten Prozentbalken ist ersetzt.

Die Reisekarte zeigt kompakte Ortsnamensschilder und Zustandssymbole. Im normalen Ortsmodal steht während der Erkundung genau ein Balken mit investierten/benötigten Punkten und Prozentzahl. Nach Entdeckung folgt die Einladung zur Bonuslieferung; während ihrer Fahrt stehen Restzeit und Fortschritt. Nach automatischem Abschluss bleibt nur ein dezentes Entdeckt am Ort. Keine doppelte 100-%-Anzeige und kein manueller Abholschritt für diese Ortslieferung.

Endlos-/Handelsorte behalten ihre Kundenfreischaltung, wiederholbaren Expeditionen und eigene Laufanzeige. Der genaue aktuelle Ablauf steht in [Ortsmodale](expedition-place-modals.md), die automatische Verarbeitung in [Expeditionsabschlüsse](expedition-completions.md).
