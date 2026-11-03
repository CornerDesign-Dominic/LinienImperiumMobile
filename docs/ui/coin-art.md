# Währungsbilder

Aktuelle Zuordnung aus `src/Icon.tsx` und `src/Wholesaler.tsx` (Quellstand 03.11.2026):

| Währung | Motiv | Datei |
| --- | --- | --- |
| Imperium-Taler | Goldmünze, Lorbeerkranz, leere Mitte | `assets/art/currency/imperium-taler.png` |
| Hermes-Siegel | Geflügelte Sandale, Smaragdring, vier grüne Steine | `assets/art/currency/hermes-siegel.png` |

Beide Produktionsicons sind transparent, 256 px groß, statisch gebündelt und werden nicht eingefärbt. Die umgebende Anzeige liefert Menge und zugängliche Beschriftung. `Icon('coin')` ist die gemeinsame Quelle für normale Münzanzeigen; `Icon('hermes')` zeigt die Premiumwährung. Sichtbare mobile Währungsbezeichnungen verwenden Imperium-Taler beziehungsweise Hermes-Siegel; interne Bestandsfelder bleiben unverändert.

Das frühere kombinierte Sandalen-/Lorbeermotiv unter `assets/art/currency/coin.png` ist als frühere Quelle erhalten, wird aber nicht mehr von `Icon('coin')` verwendet. Die damaligen 204 Tests und Screenshots betrafen dieses ersetzte Motiv und belegen nicht die aktuellen Währungsbilder.

Prompts der aktuellen Icons: `assets/art/currency/currencies.prompts.json`. Die sechs Hermes-Siegel-Paketmotive und deaktivierten Echtgeldvorschauen stehen in [Premium-Shop](premium-shop.md). Eine neue Echtgeldkauffunktion wird durch die Bildzuordnung nicht eingeführt.
