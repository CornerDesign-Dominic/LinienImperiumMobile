# Monatsseason

Die Season ist im Testbetrieb aktivierbar. Unten im Startmenü führt **Testwerkzeug** auf die eigene Testseite. Dort liegen sämtliche zuvor in Einstellungen angebotenen Testguthaben, Testaufträge, XP-/Punktevergaben und der Spielstand-Reset. Zusätzlich gibt es Season starten, Season zurücksetzen und tägliche Aufgaben zurücksetzen/rotieren. Einstellungen enthält Sprache und Konto.

## Laufzeit und Fortschritt

Eine gestartete Season gilt für den aktuellen Kalendermonat in Europe/Berlin, einschließlich Sommer-/Winterzeit. Ende ist Mitternacht am ersten Tag des Folgemonats. Datum, Zeitzone und Countdown stehen im Kopf der Season. Eine aktivierte Season wechselt beim Monatswechsel in einen neuen Durchlauf. Noch nicht abgeholte alte Aufgaben- und Wegbelohnungen verfallen dabei; bereits erhaltene Gegenstände und Guthaben bleiben erhalten. Der Test-Reset der Season setzt den Saisonfortschritt einschließlich Premiumzugang zurück, zieht erhaltene Beute aber nicht wieder ab. Normales Spielstand-Reset erhält Season und Premium-Wallet.

Es gibt 30 Stufen mit je 1.000 Saisonpunkten. Tatsächlich ausgegebene Expeditions- und Überstundenpunkte bringen je 1 Saisonpunkt. Testvergaben und Auffüller allein zählen nicht als Ausgabe. Jede abgeschlossene und abgeholte tägliche Aufgabe bringt 100 Saisonpunkte. Täglich stehen vier serverseitig ausgewählte Aufgaben aus elf Varianten bereit; Tageswechsel erfolgt in Berliner Zeit. Über das Testwerkzeug können sie zusätzlich zurückgesetzt und rotiert werden. Versionsprüfung verhindert Abholung alter Tagesaufgaben nach Rotation.

## Monatliche Großaufgaben

Die Wochenideen sind durch sieben Aufgaben für den gesamten Monat ersetzt, jeweils mit 100 Saisonpunkten und eigenem Loot:

| Ziel | Loot |
| --- | --- |
| 600 Einzelaufträge | 20 Uncommon-Zahnräder |
| 20 Großauftragsbelohnungen abholen | 2 Kapazitätsmodule |
| 40 verlorene Zustellungen einsammeln | 60 Werkzeugkästen |
| 160 Nahverkehrsaufträge | 10 Firmenausbau-Items |
| 160 Fernverkehrsaufträge | 10 Lieferantenkontakte |
| 20 Stammkundenaufträge | 10 Rare-Zahnräder |
| 80 Beschaffungstouren | 4 Expeditionsauffüller |

Die Tagesaufgabe mit Talerverdienst verwendet vorläufig 10.000 Taler. Die Mengen sind Testbalance. Bei Stammkunden zählen im Monat Aufträge statt 20 unterschiedlicher Kunden, da nur fünf reguläre Kunden existieren.

## Belohnungen und Premium

Der Serverkatalog `functions/src/season-rewards.json` ist für die aktive Auszahlung maßgeblich. Die Seite zeigt seine 30 Free-/Premium-Paare. Einzelne erreichte Felder können abgeholt werden. **Alles abholen** sammelt verfügbare Aufgaben, danach neu erreichte Wegbelohnungen und zuletzt Unendlichkeitsbelohnungen in einer Aktion. Jede erfolgreiche Einzel-/Sammelabholung öffnet das gemeinsame Lootmodal.

Premium kostet **1.000 Hermes-Siegel** je Season. Preis und Abzug werden serverseitig bestimmt. Ein späterer Kauf schaltet sämtliche bereits erreichten Premiumfelder zur Abholung frei; wiederholter Kauf zieht nichts erneut ab. Nach Stufe 30 bringen je weitere 1.000 Saisonpunkte einen Sonderauftrag. Die Sonderaufträge sind echte Aufträge im Spiel.

Sonderaufträge geben mit 25 % Chance 1–3 Hermes-Siegel, Empfehlungsaufträge mit 50 % Chance 5–10. Die Menge wird einmalig festgelegt und beim Abholen gutgeschrieben; mehrfaches Abholen würfelt und zahlt nicht erneut. Das Lootmodal zeigt Siegel getrennt an.

## Test und Veröffentlichung

Das bestehende Pyramiden-Event bleibt ein eigener Bereich. Echtgeldkauf im Großhändler bleibt deaktiviert. Neue Logik läuft im Backend; für das Gesamtpaket sind Functions und Android-OTA auf dem Preview-Kanal gemeinsam zu veröffentlichen. Es werden keine neuen nativen Abhängigkeiten benötigt. Die Testwerkzeuge sind für den gegenwärtigen Testbetrieb gedacht.
