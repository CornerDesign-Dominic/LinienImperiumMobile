# Season – Free- und Premium-Vorschau

Der neue Startmenüpunkt **Season** öffnet eine eigene Seite mit zentraler vertikaler Timeline. Stufe 1 steht oben, Stufe 30 unten; links liegen die Free-Belohnungen, rechts die Premium-Belohnungen. Alle 30 Stufen befinden sich im vorhandenen Seitenscrollbereich. Die schmale mittlere Achse bleibt unabhängig von Textlängen mittig. Itemnamen dürfen umbrechen; Mengen sind lokalisiert. Vorhandene Itemillustrationen und das bestehende Event-Menümotiv werden wiederverwendet.

Die Seite ist ausdrücklich eine Vorschau. Startfortschritt ist 0. Premium ist zunächst gesperrt und kann als Platzhalter freigeschaltet werden; es gibt weiterhin keine Fortschritts- oder Abholaktion. Das vorhandene Pyramiden-Event und sein Pass bleiben unverändert. Die gemeinsame Statusableitung kann für ein späteres autoritatives Modell gesperrt, erreicht und abgeholt darstellen; sie verändert keine Spieldaten.

## Vorläufige Belohnungen

[`src/seasonRewards.js`](../../src/seasonRewards.js) ist der zentrale, leicht austauschbare Katalog mit genau 30 Free-/Premium-Paaren. Er verwendet ausschließlich bestehende Ressourcen: Imperium-Taler, Common-/Uncommon-/einige Rare-Zahnräder, Abholhinweise, Werkzeugkästen, Auffüller, Firmenausbau-Items und Kapazitätsmodule. Die Premium-Spalte ist im Entwurf wertiger. Diese Staffel ist keine abschließend beschlossene Balance.

## Vor Freischaltung zu beschließen

- Aktivitäten, Season-Fortschritt und Stufenschwellen.
- Laufzeit, Start/Ende und Behandlung beim Seasonwechsel.
- Produktiver Kaufweg und Übernahme des Testzugangs bei Aktivierung einer echten Season.
- Endgültiger Loot sowie serverseitige Abholung und Wiederholungsbehandlung.

Die UI zeigt diese technischen Entscheidungspunkte nicht als Spielerworkflow, sondern nur den Vorschau-/Nicht-verfügbar-Status. Echtgeldkäufe bleiben deaktiviert. Der Platzhalter zeigt 500 Hermes-Siegel, bestätigt ausdrücklich den vorübergehenden Kauf für 1.000 Imperium-Taler und belastet ausschließlich Taler.

## Prüfung

Drei gezielte Node-Tests prüfen die 30 geordneten Stufen, gültige vorhandene Ressourcen, positiven Ganzzahlloot, den leeren Vorschauzustand und getrennte Free-/Premium-/Abholzustände ohne Mutation. JavaScript-Syntax und DE-/EN-JSON werden separat geprüft. Veröffentlicht mit dem Sammelpaket vom 03.11.2026. Release- und Prüfnachweis: [Prüfstand](../../TEST_REPORT.md). Ein physischer Gerätetest ist nicht belegt.

## Premium-Platzhalter (gesammelt, nicht veröffentlicht)

`seasonPassBuy` prüft die aktuelle serverseitige Season-ID `season-preview-1` und zieht einmalig exakt 1.000 Imperium-Taler ab. Manipulierte Preis-/Währungsfelder werden ignoriert; unzureichendes Guthaben und fremde/veraltete IDs werden abgewiesen. Wiederholungen ziehen nichts erneut ab. Die Freischaltung wird in `premiumShop.ownedSeasonPasses` gespeichert und bleibt wie die bestehende Premium-Wallet bei Neuladen und Test-Reset erhalten. Künftige Seasons benötigen eine eigene ID; der Platzhalter erteilt keinen Dauerzugang zu allen Seasons.

Die Oberfläche zeigt den Referenzpreis mit Hermes-Siegel-Illustration, den tatsächlichen Testpreis sowie eine Kaufbestätigung. Nach dem Kauf erscheint „Premium freigeschaltet“; die Hinweise auf fehlenden Fortschritt und fehlende Abholung bleiben sichtbar. Belohnungen und Laufzeit werden nicht aktiviert. Der Pyramiden-Eventpass bleibt getrennt.

Zur späteren Veröffentlichung sind das Backend (Functions) und die App/OTA gemeinsam auszurollen; keine neuen Firestore-Regeln oder Store-Produkte erforderlich. Die Umsetzung selbst führt keinen Release aus.
