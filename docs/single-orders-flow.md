# Gesammelte Folgeänderung: Einzelaufträge

Branch `collect/transport-upgrades`, ohne Veröffentlichung.

Nach erfolgreicher Fahrzeugzuweisung wird die Detailansicht geschlossen. Der ursprüngliche Reiter „Angebote“ beziehungsweise „Aufträge“ und die ausgewählte Vorratsgruppe bleiben erhalten. Dasselbe gilt beim Start von Material- oder Fahrzeugkartenaufträgen aus den Vorräten. Direkt aus einer Expedition gestartete Aufträge behalten ihren bisherigen Wechsel zu „Laufende“.

„Laufende“ zeigt aktive Transporte und aktive Material-/Fahrzeugkartenaufträge. Abgeschlossene Einzelaufträge erscheinen nicht mehr als einzelne Karten. Der Sammelbutton, die Anzahl abholbarer Abschlüsse und die gemeinsame Prämienabrechnung bleiben bestehen; diese Änderung verbraucht keine Belohnungen.

Prüfung: TypeScript, gezielte Komponententests für aktive/abgeschlossene Karten und Sammelbutton; Browserprüfung der tatsächlichen App mit echtem lokalem Spielkern für Angebote, Privatabholungen und Materialaufträge. Alle drei Starts kehren in den ursprünglichen Reiter zurück, Vorratsgruppen bleiben erhalten; keine JavaScript-Fehler.
