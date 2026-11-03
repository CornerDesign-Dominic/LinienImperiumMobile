# Einheitliche Modal-Schließaktion

Alle 17 konkreten Modal-Hosts in `src` geprüft (App, Company, ExpeditionPlaceModal, ExpansionPoints, Fleet, FleetDetails, Garage, Gifts, HubSales, HubVehicleDetail, Inventory, LevelUp, OfferRefreshModal, OrderVehiclePicker, Procurement, ProcurementRun und Projects). ExpeditionPlaceModal deckt zusätzlich Ortsdetails/Fundchancen, Transportkartenboni/-ausbau, Punktverteilung, Geschenkgewinn und Fundkisten ab.

- `ModalCloseButton` stellt überall dieselbe quadratische Papierfläche (44 × 44 dp, Papiertextur, dezente Messingkontur und dunkles X) bereit. `Btn` mit `iconOnly`/`close` delegiert an diese Komponente. Bestehende Header bleiben außerhalb ihrer Inhalts-ScrollViews.
- Die bisher runde Orts-Schließaktion und der unverkleidete Vertriebs-X verwenden ebenfalls die gemeinsame Komponente. Das Level-Up-X steht nun oben rechts.
- Reines unteres Abbrechen im Angebotsdialog entfällt. Geschenk- und Fundkistengewinne schließen über das Header-X; ihre reinen Weiter-Schließknöpfe entfallen.
- Konto-/Reset-Bestätigungen verwenden auf Android und Web denselben vorhandenen Spiel-Dialog anstelle nativer Alerts. Das X verwirft den Dialog, nur Bestätigen führt die Aktion aus.
- Während der Geschenköffnung bleibt das X sichtbar und gesperrt. Die gesonderte Überspringen-Aktion stoppt weiterhin nur die Animation auf dem schon erhaltenen Serverergebnis; Back/X kann das bezahlte Ergebnis nicht verwerfen.
- Vorhandene Speicher-/Transaktionssperren und Android-Back-Handler bleiben erhalten. Reine Schließaktionen verursachen keine Commands.

Nicht betroffen: Seiten-Zurück-Pfeile, echte Aktionen zum Beenden/Abbrechen laufender Beschaffungen, sowie die Inline-Skinkauf-Auswahl außerhalb eines Modals. Dort bedeutet Abbrechen die Rückkehr von der Kaufbestätigung zur Produktkarte.

Validierung: bestehende Angebots-/Geschenk-/Verteilungs-/Botenstation-Modalprüfungen angepasst; zusätzlich überprüft, dass das gemeinsame X lokalisiert ist und im deaktivierten Zustand keine Schließaktion auslöst. Gesamtsuite (266 Tests), TypeScript und Diffprüfung erfolgreich. Der Android-Export wurde von der automatischen Freigabeprüfung wegen möglicher Projektmetadaten-Übertragung an Expo blockiert und deshalb nicht als erfolgreich bestätigt. Die Quellprüfung und Tests ersetzen keine native Layout-/Touch-Prüfung auf einem Gerät.

