# Vertriebskarte und Ausbau-Modal

Die Vertriebskarte zeigt das Kontor mit Einkaufsbuch, Waage und Paketen vollflächig. Titel und Stufe liegen im oberen transparenten Band. Unten stehen Verteilungszeit und der tatsächliche zusätzliche Durchsatz der nächsten Ausbaustufe; der abschließende Aktionsstreifen öffnet das Modal. Das vorhandene Motiv ist dekorativ und alle Werte bleiben native Texte.

Der zusätzliche Durchsatz berechnet sich aus `hourlyCapacity × (nextWorkMinutes − workMinutes) / 60`. Beispielsweise ergeben 1.544,2 t theoretische Stundenleistung und 30 Sekunden zusätzliche Verteilung rund 12,9 t mehr pro Stunde. Am Maximum steht stattdessen der aktuelle Durchsatz `hourlyCapacity × workMinutes / 60`; es wird kein weiterer Bonus angeboten. Die Wirkung beginnt beim nächsten Einkauf nach Ausbauabschluss, bestehende Zyklus-Snapshots bleiben unangetastet.

Das mittige Pergamentmodal hat einen festen Kopf mit 44-dp-Schließfläche und einen festen Aktionsfuß. Nur der Inhalt mit kleinem Motivbanner, Stufen- und Zeitvergleich sowie Kosten scrollt. Vorhandene ItemArt-Bilder zeigen Lieferantenkontakte und Firmenausbau-Items; die Mengen sind rechts ausgerichtet als Vorhanden / Benötigt. Fehlende Materialien und Anfragefehler erscheinen beim Startbutton. Bei laufendem Ausbau werden Countdown und Zielwerte gezeigt, am Maximum keine Kosten oder weitere Kaufaktion.

Kosten, 20 Stufen, je 30 Sekunden Wirkung und 12 Stunden Ausbaudauer je Zielstufe bleiben unverändert. Während einer Anfrage bleibt der Dialog offen und der Schließbutton ist gesperrt. Der bestehende zentrale Command-Guard verhindert doppelte Käufe. Änderungen bleiben im Sammelbranch unveröffentlicht.

Produktionsbild: `assets/art/hub/sales-desk.jpg` (1152 × 768); der vollständige Prompt steht in der benachbarten JSON-Datei. Generiert mit dem eingebauten ImageGen-Werkzeug, anschließend nur für die Auslieferung verkleinert und JPEG-komprimiert.
