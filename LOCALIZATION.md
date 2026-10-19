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

Vorbereitet im Sammelbranch; noch nicht veröffentlicht.
