# Sprachen

Deutsch ist unabhängig von der Gerätesprache die Voreinstellung. Die Auswahl unter Einstellungen → Sprache wird lokal mit AsyncStorage gespeichert (`linienimperium.language`). Ein Gerätewechsel übernimmt sie nicht automatisch. Sie gehört nicht zum Spielstand; ein Spielreset oder Kontowechsel verändert sie nicht.

## Aufbau

- `src/i18n.ts`: Sprachregister, Zahlen-Locale, deutsche Rückfalltexte, Übersetzung vorhandener Anzeigetexte und vollständiger dynamischer Nachrichten.
- `src/locales/en.json`: englische Übersetzungen mit deutschen Quelltexten als stabilen Nachrichtenschlüsseln (gettext-Prinzip). Platzhalter `{0}`, `{1}` usw. müssen erhalten bleiben. Englische Labels und englische Spielhilfe sind reine Darstellungsdaten.
- `src/locales/en-help.json`: englische Hilfe nach bestehenden Bereichskennungen.
- `src/Language.tsx`: gespeicherte Auswahl, React-Kontext und lokalisierte Textdarstellung. `Text` bzw. `Txt` übersetzen Textkinder; `literal` bewahrt Namen/Eingaben unverändert. Native Platzhalter, Bedienungshilfen und native Bestätigungsdialoge verwenden explizit `t(...)`.
- `n(...)` nutzt die aktive Locale, z. B. 1.234,5 auf Deutsch und 1,234.5 auf Englisch. Timer und technische Einheiten bleiben unverändert.

Serverzustand, Auftrags-/Karten-IDs, Command-Namen und Firebase-Dokumente bleiben sprachneutral beziehungsweise unverändert. Vorhandene deutsche Serverbeschriftungen werden erst bei der Anzeige über den Katalog aufgelöst. Keine Änderungen an Spielregeln oder gespeicherten Objekten.

## Weitere Sprache ergänzen

1. `en.json` und `en-help.json` als Ausgangspunkt für die neue Sprache kopieren, Werte übersetzen; deutsche Schlüssel und Platzhalter beibehalten.
2. Beide Dateien in `src/i18n.ts` importieren und in `catalogs` bzw. `helpCatalogs` registrieren.
3. In `LANGUAGES` Kennung, Eigenname und Zahlen-Locale ergänzen. Die Einstellungsauswahl entsteht automatisch. TypeScript fordert für jede registrierte Sprache einen Textkatalog.
4. Neue Spieltexte in alle Kataloge eintragen. Firmen-/Stadtnamen, E-Mail-Adressen und andere Nutzereingaben immer mit `literal` anzeigen. Unbekannte Texte bleiben als deutsche Quelle sichtbar statt zu verschwinden.
5. Typprüfung, Übersetzungstests und UI-Prüfung auf schmalen Displays ausführen. Neue dynamische Nachrichten mit Testfall ergänzen.

## Aktuelle Anzeigebegriffe

Die mobile Präsentationsschicht normalisiert historische Webbegriffe: unter anderem Stadthub → Botenstation (englisch Courier Station), Erweiterungspunkt → Ausbaupunkt, Münzen → Imperium-Taler, Premium-Münzen → Hermes-Siegel, Regionalverkehr → Nahverkehr, Fahrzeugkarte → Transportkarte sowie Stadttransporter → Lastwombat-Boten. Die Zuordnung liegt im Serveradapter und in `functions/src/currency-names.cjs` bzw. `hub-courier.js`. Persistierte IDs und Nutzerprofile werden dabei nicht umbenannt. Übersetzungen müssen die tatsächlich ausgegebenen mobilen Begriffe abdecken; veraltete Quellschlüssel können für alte Servermeldungen weiterhin benötigt werden.

`src/i18n.ts` übersetzt auch zusammengesetzte Beschriftungen und dynamische Nachrichten. Unbekannte Texte bleiben als deutsche Rückfalltexte sichtbar; dies ist kein Nachweis vollständiger englischer Abdeckung. Bei neuen UI-Texten deshalb Katalog, Platzhalter und tatsächliche Darstellung gemeinsam prüfen.

## Historischer Einführungsnachweis

Die Sprachauswahl wurde am 19.10.2026 mit Release `0ba088d8`, Workflow `39307392702` eingeführt. Dieser Vermerk belegt nur diesen damaligen Stand. Aktuelle Prüfnachweise stehen in [TEST_REPORT.md](TEST_REPORT.md).

