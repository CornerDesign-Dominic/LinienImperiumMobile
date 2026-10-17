# Gesammeltes Mobile-Update

Branch: `batch/mobile-adjustments`. Noch nicht auf Handy oder Backend veröffentlicht.
Der Nutzer sammelt Änderungen nacheinander. Erst bei ausdrücklichem Abschluss veröffentlichen.

## Umgesetzt und lokal geprüft

- Firebase-Transportfehler `functions/internal` mit HTTP-Status `[0]`: einmalige Wiederholung nach 400 ms unter Beibehaltung der Anfragekennung. Bei anhaltendem Fehler verständliche Verbindungsmeldung; echte Serverfehler werden nicht als Verbindungsfehler umgedeutet.
- Angebotskarten mit hellerem Hintergrund, stärkerem Rahmen/Farbrand, abgetrennten Metadaten und eigenem Mengen-/Streckenbereich.
- Bei fehlender Auswahl unterscheidet die Anzeige zwischen fehlendem passendem Fahrzeug und einem bereits eingesetzten passenden Fahrzeug.
- Regressionstest für automatischen Angebotswechsel inklusive Fristgrenze, angeheftetem Angebot, laufendem Transport und Offline-Nachholung.

## Diagnose und Verifikation

Im installierten Firebase-SDK liefert ein fehlgeschlagener Fetch Status 0 und `internal [0]`. Zum gemeldeten Zeitpunkt wurde kein passender Functions-/Cloud-Run-Serverfehler gefunden. Der ursprüngliche Verbindungsabbruch selbst ist damit nicht als dauerhaft beseitigt bewiesen. Im UI-Test wird ein solcher Fehler injiziert und die automatische Wiederholung geprüft.

`npm run typecheck` und alle Spieltests bestehen. Der bestehende automatische Angebotswechsel ließ sich lokal ohne Ausnahme ausführen. Keine neuen Balancingwerte wurden gesetzt.

## Noch zu besprechen: Startangebote

Der Kurierwagen fährt 4 t je Tour und kann Regionalverkehr bedienen. Größere Gesamtmengen sind über mehrere Touren möglich. Fernverkehr braucht eine passende Fahrzeugkarte. Ein Fahrzeug kann außerdem für eine Expeditionsmission belegt sein, auch wenn keine Einzelaufträge laufen.

Vorschlag, noch nicht beschlossen: zunächst fünf Regionalangebote, davon drei kurze (4–8 t, 10–25 km) und zwei längere (8–16 t, 25–50 km). Fernverkehr erst bei Besitz einer dafür passenden Karte. Freigaben nach verfügbaren Fahrzeugklassen, nicht nach momentanem Frei-/Belegtstatus.

## Veröffentlichungssperre

`main` enthält eine Sicherung im Workflow: Firebase-Deployment und EAS Update laufen nur bei `workflow_dispatch` oder einem Commit mit `[publish-preview]`. Die Diagnose-Workflows lesen ausschließlich Protokolle. Beim Sammeln weder einen Veröffentlichungsmarker verwenden noch die manuellen Update-Workflows starten.
