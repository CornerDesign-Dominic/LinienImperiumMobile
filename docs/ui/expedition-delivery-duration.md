# Bonuslieferung: Dauer und Restzeit

Aktueller Implementierungsbezug: `src/ExpeditionPlaceDetails.tsx` (03.11.2026).

Laufende Orts- und erste Endloslieferungen zeigen ihre tatsächliche Restzeit aus `endsAt` und der gemeinsamen Anzeigeuhr. Normale Ortsmodale wiederholen nach Abschluss weder Zeit noch Belohnungsdetails. Vor dem Start enthalten sie keinen zusätzlichen Dauerblock.

Am Endlos-/Handelsort steht die Dauer der Bonuslieferung unter dem aufklappbaren Bereich Details. Die Daten stammen bei vorhandener Mission aus `endsAt − startedAt`, andernfalls aus `finalDurationMs`; es wird keine Testdauer im UI fest codiert. Frühere Berichte über einen Dauertext direkt unter jedem Balken beschreiben die ersetzte Fassung. Weitere Zustände: [Ortsmodale](expedition-place-modals.md).
