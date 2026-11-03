# Season – Free- und Premium-Vorschau

Der neue Startmenüpunkt **Season** öffnet eine eigene Seite mit zentraler vertikaler Timeline. Stufe 1 steht oben, Stufe 30 unten; links liegen die Free-Belohnungen, rechts die Premium-Belohnungen. Alle 30 Stufen befinden sich im vorhandenen Seitenscrollbereich. Die schmale mittlere Achse bleibt unabhängig von Textlängen mittig. Itemnamen dürfen umbrechen; Mengen sind lokalisiert. Vorhandene Itemillustrationen und das bestehende Event-Menümotiv werden wiederverwendet.

Die Seite ist ausdrücklich eine Vorschau. Startfortschritt ist 0, Premium gesperrt. Es gibt keine Kauf- oder Abholaktion, keine Guthabengutschrift und keinen neuen Serverbefehl. Das vorhandene Pyramiden-Event und sein Pass bleiben unverändert. Die gemeinsame Statusableitung kann für ein späteres autoritatives Modell gesperrt, erreicht und abgeholt darstellen; sie verändert keine Spieldaten.

## Vorläufige Belohnungen

[`src/seasonRewards.js`](../../src/seasonRewards.js) ist der zentrale, leicht austauschbare Katalog mit genau 30 Free-/Premium-Paaren. Er verwendet ausschließlich bestehende Ressourcen: Imperium-Taler, Common-/Uncommon-/einige Rare-Zahnräder, Abholhinweise, Werkzeugkästen, Auffüller, Firmenausbau-Items und Kapazitätsmodule. Die Premium-Spalte ist im Entwurf wertiger. Diese Staffel ist keine abschließend beschlossene Balance.

## Vor Freischaltung zu beschließen

- Aktivitäten, Season-Fortschritt und Stufenschwellen.
- Laufzeit, Start/Ende und Behandlung beim Seasonwechsel.
- Premiumfreischaltung und gegebenenfalls Preis/Kaufweg.
- Endgültiger Loot sowie serverseitige Abholung und Wiederholungsbehandlung.

Die UI zeigt diese technischen Entscheidungspunkte nicht als Spielerworkflow, sondern nur den Vorschau-/Nicht-verfügbar-Status. Es wurden keine Echtgeldpreise oder automatische Premiumrechte erfunden.

## Prüfung

Drei gezielte Node-Tests prüfen die 30 geordneten Stufen, gültige vorhandene Ressourcen, positiven Ganzzahlloot, den leeren Vorschauzustand und getrennte Free-/Premium-/Abholzustände ohne Mutation. JavaScript-Syntax und DE-/EN-JSON werden separat geprüft. Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.
