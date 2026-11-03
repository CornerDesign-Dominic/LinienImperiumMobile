# Großauftrag-Testwerkzeug

Im vorhandenen Testwerkzeuge-Bereich der Einstellungen fügt „Testaufträge hinzufügen“ über `testProjects` mit leerem Payload ein Exemplar jeder Großauftragsorte hinzu: fünf Stammkunden-Sonderaufträge und einen Empfehlungsauftrag. Die UI nutzt denselben Request-/Fehlerpfad wie die übrigen Testwerkzeuge und ist während einer laufenden Anfrage deaktiviert. Gutschrift, Freischaltregeln und Wiederholungsbehandlung liegen vollständig auf dem Server. Der Button startet keinen Auftrag und erzeugt keine lokalen Bestände.

Die Sichtbarkeit entspricht den bereits vorhandenen Testwerkzeugen; es wird kein zusätzliches Admin-System eingeführt.
