# Materialbeschaffung: Übersicht und Details

Das Abhol-Buch ist eine schmale 48-dp-Zeile. Die Ortswahl ist eine durchgehende Bildkarte mit einem offenen Beschaffungskarren und Zahnrädern in Holz, Eisen und Silber. Der Erklärungstext entfällt; Antippen öffnet weiterhin die bestehende Ortsauswahl mit Sperren, Freischaltfortschritt und möglichen Belohnungen.

Laufende Beschaffungen zeigen das vorhandene Regionsbild, die Zahl aktiver Fahrzeuge, geteilten Tourenfortschritt und pro aktivem Fahrzeug dessen vorhandenes Kartenmotiv, Name, aktuelle Restzeit und Tourenfortschritt. Fest bezahlte Gruppen zeigen den unverbrauchten hinterlegten Betrag; Reservegruppen die gewünschte Kontoreserve. Der Preis je Tour bleibt sichtbar. Die gesamte Karte öffnet Details; destruktive Aktionen stehen nicht mehr in der Übersicht.

Der zentrierte Detaildialog besitzt einen festen Kopf mit erreichbarem Schließen-Button und einen scrollbareren Inhalt für mehrere Fahrzeuge. Beenden nach laufender Tour sowie Sofortabbruch verwenden weiterhin die vorhandene Bestätigung und denselben Einzel- beziehungsweise Gruppenbefehl. Bereits vorgemerktes Beenden wird angezeigt; sofortiger Abbruch bleibt möglich. Beendet sich die Beschaffung während des offenen Dialogs, entfallen die Stop-Aktionen. Aktive Fahrzeuge aus einer Gruppe sind keine getrennten Aufträge und teilen weiterhin Tourenzahl beziehungsweise Reserve.

Belohnungen werden weder entfernt noch automatisch eingesammelt. Die vorhandenen Itembilder, Mengen und Einsammelaktion bleiben erhalten. Tourkosten, Dauer, Loot, Reserve, Rückerstattung, Offline-Verhalten und Serverlogik sind unverändert.

Validierung: Zwei gezielte UI-Verhaltenstests für Gruppen-/Einzel-Stop-Routing, Busy-/stopAfter-/Abschlusszustände, festen Schließen-Button, Belohnungssammeln und Ortswahl; vorhandene Beschaffungs-Servertests, TypeScript, Gesamtsuite und Android-Export. Eine native Android-/Browseransicht konnte in dieser Umgebung nicht ausgeführt werden.
