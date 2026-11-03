# Einzelaufträge – Navigation und Abschluss

Aktuelle mobile Navigation in [`src/App.tsx`](../src/App.tsx) und [`src/Orders.tsx`](../src/Orders.tsx). Detaillierter Aufbau: [Reiter und Fahrzeugzuweisung](ui/single-order-tabs-and-assignment.md). Veröffentlichung und Prüfstand werden [zentral](../TEST_REPORT.md) geführt.

Nach erfolgreicher Fahrzeugzuweisung wird die Detailansicht geschlossen. Der ursprüngliche Reiter „Angebote“ beziehungsweise „Aufträge“ und die ausgewählte Vorratsgruppe bleiben erhalten. Dasselbe gilt beim Start von Material- oder Transportkartenaufträgen aus den Vorräten. Direkt aus einer Expedition gestartete Aufträge behalten ihren bisherigen Wechsel zu „Laufende“.

„Laufende“ zeigt aktive Transporte und aktive Material-/Transportkartenaufträge. Abgeschlossene Einzelaufträge erscheinen nicht mehr als einzelne Karten. Der Sammelbutton, die Anzahl abholbarer Abschlüsse und die gemeinsame Prämienabrechnung bleiben bestehen; diese Änderung verbraucht keine Belohnungen.

Historische Prüfung bei Einführung: TypeScript, gezielte Komponententests für aktive/abgeschlossene Karten und Sammelbutton; Browserprüfung der tatsächlichen App mit echtem lokalem Spielkern für Angebote, Privatabholungen und Materialaufträge. Alle drei Starts kehren in den ursprünglichen Reiter zurück, Vorratsgruppen bleiben erhalten; keine JavaScript-Fehler.

