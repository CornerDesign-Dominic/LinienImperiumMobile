# Stadthub: Fahrzeugdetail

Das Fahrzeugdetail hat einen festen Kopf mit Name und Schließen-Schaltfläche. Nur der Inhalt scrollt. Status und Kilometerstand stehen direkt beim vorhandenen Fahrzeugmotiv. Zwei kompakte Zeilen zeigen Laderaum und Antrieb mit aktuellem Wert und Ausbaustufe; ein dezenter Punkt kennzeichnet finanzierbare Ausbauten.

Eine Ausbauzeile wechselt innerhalb desselben nativen Modals in die Ausbauansicht. Diese zeigt Stufe, aktuellen/nächsten Wert, Werkzeugkästen und Münzen als „Benötigt / Vorhanden“ sowie einen Ausbauknopf. Schließen kehrt zum Fahrzeugdetail zurück. Nach erfolgreichem Ausbau erscheint das aktualisierte Detail. Während eines Befehls verhindert eine synchrone Sperre doppelte Eingaben und das Verlassen der Ansicht. Fehlgeschlagene Befehle lassen sich erneut versuchen.

Der Zeitpunkt der Wirksamkeit (nächster Stundenzyklus), alle Kosten, Limits und Serverbefehle bleiben unverändert. Einsetzen/Herausnehmen ist direkt erreichbar; Verkaufen liegt unter eingeklappten weiteren Aktionen und nutzt die bestehende Verkaufsbestätigung.

Prüfung: TypeScript, vollständige Testsuite und tatsächliche React-Native-Web-Darstellung bei 320/360/390/430 dp; Ausbau, Fehlerwiederholung/Doppeltipp-Sperre, Hub-Zuweisung und Verkaufsweiterleitung.
