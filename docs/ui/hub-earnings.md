# Stadthub-Erträge

Die kompakte Ertragskarte zeigt ausschließlich Münzbild und Münzbetrag als gesammelte Beute. Die Kassenkapazität (abgeschlossene Stunden / 6 oder „Kasse voll“) ist von der aktuellen Einkaufsstunde getrennt. Der Sammelknopf holt weiterhin Münzen, Abholhinweise und Werkzeugkästen gemeinsam ab; eine serverseitige Zusammenfassung zeigt danach alle tatsächlich gutgeschriebenen Mengen im gemeinsamen Belohnungs-Zeilendialog.

## Tatsächliche Zeitberechnung

Der Hub besitzt keinen unabhängigen Warenlagerbestand. Die Serverlogik friert am Zyklusbeginn die mögliche Stundenkapazität und Vertriebsstufe ein. Die eingekaufte Menge beträgt diese Kapazität × (75 + eingefrorene Vertriebsstufe) %. Sie wird linear während `HUB_WORK_SECONDS` verteilt, derzeit 45 Minuten; der nächste Einkauf folgt nach `HUB_CYCLE_MS`, derzeit 60 Minuten. Der technische Warenfüllstand ist die verbleibende Fraktion dieser eingefrorenen Menge, kein neu eingeführtes Inventar.

Die Serveransicht liefert diese Konstanten und die eingefrorene Zyklusmenge. Die Anzeige verwendet 0 und 60 Minuten als Endpunkte, den aktuellen Minutenstand, einen mitlaufenden Punkt sowie den tatsächlichen Warenende-Marker bei Minute 45 und einen Einkaufskarren am Zyklusende. Der Leerlauf bis zum Einkauf ist dezent gestrichelt. Es gibt keine festen Viertelstundenmarkierungen. Die aktuelle Zeit steht separat über der Achse, damit Ereignis und aktuelle Zeit auch nahe beieinander lesbar bleiben.

Bei voller Kasse pausiert die Anzeige, ohne Warenende vorauszusagen. Ohne eingekaufte Zyklusmenge erscheint keine erfundene Leerzeit. Fahrzeugänderungen/Ausbauten überschreiben den laufenden eingefrorenen Zyklus nicht. Keine Preise, Erträge oder Zeitschritte wurden geändert.

Validierung: TypeScript, vollständige Testsuite; gezielte Prüfung von eingefrorener Zyklusmenge/45-Minuten-Fenster und vollständiger einmaliger Sammlung. Tatsächliche Browserdarstellung 320/360/390/430 dp, Verteilung, Wartezeit, volle Kasse, leerer Zyklus und vollständiges Sammelmodal.
