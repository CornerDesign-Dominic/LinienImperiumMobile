# Kompakte globale Abstände

Gemeinsame Card-Abstände in `src/ui.tsx`: Außenabstand 10 → 5, Innenabstände 14 → 11; Zeilen 8 → 6, Abschnittsabstand 12. Die Startnavigation halbiert ihre Lücken von 8 auf 4. Der tatsächliche bisherige Seitenrand von 9 wird auf 7 reduziert (rund 25 %), statt einen bereits kleinen Rand auf 12 zu vergrößern. Individuelle Listenüberschreibungen in Einzel-/Großaufträgen, Kunden und Botenstation folgen diesem Rhythmus. Bereits kompakte Dreispaltenkarten behalten ihre horizontalen Lücken und Bildgrößen.

Schriftgrößen, Illustrationen, Mindesthöhen und 44-Pixel-Tippflächen unverändert. Modale, Safe Areas, Ressourcenheader, Bottom-Navigation und Expeditionslandschaften werden nicht pauschal skaliert; Modale behalten ihre bestehenden Ränder. Abschnittstrennung bleibt sichtbar. Keine Änderung an Spielwerten oder Aktionen.

Gezielte Quellprüfung der geänderten Layoutwerte und unveränderten Tippflächen; vollständige Typ-/Komponentenprüfung und Android-Export im Veröffentlichungsworkflow erforderlich. Physische Geräteprüfung nicht belegt.
