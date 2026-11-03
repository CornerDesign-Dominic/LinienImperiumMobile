# Expeditionsorte: Nahansichten und Zustände

Aktuelle Implementierung: `src/ExpeditionPlaceModal.tsx`, `src/ExpeditionPlaceDetails.tsx`, `src/placePortraits.ts` (Quellstand 03.11.2026).

## Aufbau

Alle 40 Orte haben eine eigene Nahansicht: sieben Haltepunkte und ein Endlos-/Handelsort je Region. Malerischer Stil, Architektur und Landschaft passen zu den fünf Panoramen. Region und Ortsname stehen in einem festen Papierkopf; das 44-dp-X bleibt außerhalb des Scrollinhalts. Bild und Aktionsbereich scrollen zusammen auf kleinen Displays. Explizite gemessene Bildmaße vermeiden ungewollte Android-Quellgrößen.

## Normale Orte

| Zustand | Darstellung und Aktion |
| --- | --- |
| Erkundbar | Erkundung, genaue investierte/benötigte Punkte und Prozentbalken, Erkunden |
| Erkundet | Gebiet erkundet, kurze Einladung zur Bonuslieferung und Erweiterungspunkt als Belohnung |
| Bonuslieferung unterwegs | Restzeit, Fortschritt und tatsächliche Belohnung |
| Automatisch abgeschlossen | Bild, Identität und kleines Entdeckt; keine redundanten 100-%- oder Belohnungsblöcke |

Normale Orte besitzen keinen Details-Expander mehr. Fahrzeugwahl und vorhandene Frei-/Busy-Prüfungen bleiben erhalten. Die Bonuslieferung vergibt ihren Erweiterungspunkt automatisch; die einmalige Abschlussübersicht und Verteilung sind unter [Expeditionsabschlüsse](expedition-completions.md) beschrieben. Kein erneutes manuelles Abholen am Ort.

## Endlos-/Handelsort

Hier bleiben Kundenfreischaltung, wiederholbare Expedition, Fundchancen und Details mit Lieferdauer erhalten. Die erste Endloslieferung schaltet den Stammkunden frei und vergibt das einmalige Kapazitätsmodul, sofern noch nicht erhalten. Altspielstände erhalten das Modul nicht doppelt. Wiederholbare Auftragsbeute wird zusammen mit Einzelaufträgen eingesammelt. Ortsgeschichten sind nicht implementiert.

## Assets

- 40 individuelle JPEGs unter [assets/art/places](../../assets/art/places), 1536 × 1024 px.
- Genaue Prompts und Panorama-Referenzen: [expedition-place-prompts.json](expedition-place-prompts.json).
- Die ursprüngliche Lieferung hatte rund 21,11 MB bei JPEG-Qualität 84; lokale Assets, keine Bild-API zur Laufzeit.

## Historische Prüfungen und Grenze

Die erste Nahansichten-Fassung wurde mit TypeScript, damals 143 Tests, Android-Export und React-Native-Web für alle 40 Orte bei 320/360/390/430 px geprüft. Die damals getesteten zusätzlichen Details-/Belohnungsblöcke sind teilweise durch die oben beschriebene kompakte Zustandsdarstellung ersetzt.

Für die kompakte Revision wurden bestehende Real-Engine-Ortsmodaltests, Titel-/Schließposition, Typprüfung und Android-Export protokolliert. Für diese Revision lag kein nativer Geräte- oder visueller Browsertest vor. Diese Dokumentationspflege führt keinen neuen solchen Test aus. Aktuelle Prüfung: [TEST_REPORT.md](../../TEST_REPORT.md).
