# Ausbaupunkte: Name und Bild

Ausbaupunkt (Mehrzahl Ausbaupunkte) ist die globale deutsche Bezeichnung für die dauerhaft verteilbaren Punkte aus einmaligen Expeditions-Ortslieferungen. Englisch: Upgrade point / Upgrade points. Die Entwicklungspunkte aus Spielerleveln bleiben ein getrennter Bestand.

## Darstellung

Das freigestellte Motiv zeigt den gewählten Ausbaupunkt-Entwurf: aufgerollter Bauplan mit bronzener Säule. Die 256-px-RGBA-Datei `assets/art/points/ausbaupunkt.png` wird über `Icon` mit dem internen Namen `expansion` eingebunden und behält ihre gemalten Farben. Referenz und vollständiger Generierungsprompt stehen in `assets/art/points/ausbaupunkt.prompt.json`.

Das Motiv ersetzt das bisherige Plus als Belohnung im Ortsmodal. Es erscheint außerdem in der Ausbaupunktekarte, im Verteiler und am Einstieg unter Handelsimperium → Entwicklung. Die Plus-/Minus-Bedienelemente zum Verteilen bleiben funktionale Symbole. Mengen bleiben separate Zahlen und gehören nicht zur Bilddatei.

## Kompatibilität

Gespeicherte Schlüssel wie `expansion`, `expansionPoints` und der Befehl `expansionAllocate` bleiben unverändert. Besitz, verfügbare Punkte, bereits verteilte Boni und Regeneration werden nicht umgerechnet. Neue Meldungen und Hilfe verwenden den neuen Namen. Alte gespeicherte Belohnungstexte werden bei der Ausgabe normalisiert; Profilnamen und historische Speichertexte bleiben erhalten. Historische Markdown-Archive bleiben unverändert.

Die Namens-/Bildänderung selbst änderte weder automatische Gutschrift noch Abschluss- oder Verteilungsverhalten. Die danach gesammelte Folgeänderung entfernt die Abschlussinformation: Abschlüsse laufen still, Punkte werden ausschließlich auf Wunsch verteilt. Ausführliche Regeln: [Expeditionsabschlüsse](expedition-completions.md).

## Prüfung

Die vorhandenen Ortsmodal-, Verteilungs- und Übersetzungsprüfungen kontrollieren den neuen Namen, die Iconzuordnung und englische dynamische Beschriftungen. Ein zusätzlicher Kompatibilitätsfall prüft Altbelohnungstexte, erhaltene Speichertexte und geschützte Profilnamen. Die acht lokalen Expeditionsabschlussprüfungen sind erfolgreich. Der [Veröffentlichungslauf 41715219750](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions/runs/41715219750) für `ca6f08d621f6f11aee0f57078dced1434fc6ffab` hat am 03.11.2026 Typprüfung, alle 273 Tests, Android-Export, Firebase/Regeln, Live-API-Test und Android-OTA erfolgreich abgeschlossen. Maßgeblicher Releasebeleg: [TEST_REPORT.md](../../TEST_REPORT.md).
