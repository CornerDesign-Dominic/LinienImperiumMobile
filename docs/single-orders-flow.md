# Einzelaufträge – Navigation und Abschluss

Aktuelle mobile Navigation in [`src/App.tsx`](../src/App.tsx) und [`src/Orders.tsx`](../src/Orders.tsx). Detaillierter Aufbau: [Reiter und Fahrzeugzuweisung](ui/single-order-tabs-and-assignment.md). Veröffentlichung und Prüfstand werden [zentral](../TEST_REPORT.md) geführt.

Ein Tipp auf ein verfügbares oder gespeichertes Angebot öffnet unmittelbar das bestehende Fahrzeugwahlmodal. Die Einzelauftrags-Detailseite entfällt vollständig. Schließen verwirft nur die Auswahl und verändert weder Auftrag noch Navigation. Nach erfolgreicher Fahrzeugzuweisung wird das Modal geschlossen. Der ursprüngliche Reiter „Angebote“ beziehungsweise „Aufträge“ und die ausgewählte Vorratsgruppe bleiben erhalten. Dasselbe gilt beim Start von Material- oder Transportkartenaufträgen aus den Vorräten. Direkt aus einer Expedition gestartete Aufträge behalten ihren bisherigen Wechsel zu „Laufende“.

„Laufende“ zeigt aktive Transporte und aktive Material-/Transportkartenaufträge. Abgeschlossene Einzelaufträge erscheinen nicht mehr als einzelne Karten. Der Sammelbutton, die Anzahl abholbarer Abschlüsse und die gemeinsame Prämienabrechnung bleiben bestehen; diese Änderung verbraucht keine Belohnungen.

Laufende Einzelauftragskarten öffnen beim Antippen direkt die bereits vorhandene Auswahl für einen Fahrzeugwechsel ab der nächsten Tour. Der Sammelabschluss bleibt ausschließlich über den vorhandenen Sammelbutton erreichbar.

Prüfung der direkten Auswahl: Typprüfung und 18 gezielte Tests erfolgreich (vier neue Controllerfälle sowie Angebots-, Halte-, Laufend- und Sortierregressionen). Kein neuer App-Export oder Gerätetest; noch nicht veröffentlicht.

Historische Prüfung bei Einführung: TypeScript, gezielte Komponententests für aktive/abgeschlossene Karten und Sammelbutton; Browserprüfung der tatsächlichen App mit echtem lokalem Spielkern für Angebote, Privatabholungen und Materialaufträge. Alle drei Starts kehren in den ursprünglichen Reiter zurück, Vorratsgruppen bleiben erhalten; keine JavaScript-Fehler.

