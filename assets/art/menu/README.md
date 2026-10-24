# Start- und Navigationsbilder

Freigegebene, freigestellte Miniaturillustrationen für das Startmenü und die fünf unteren Navigationseinträge. 256 × 256 Pixel RGBA, ohne Seltenheitsfläche und ohne Rahmen. Home und Firma verwenden denselben Verwaltungssitz; Auftragsrollen werden zwischen Startmenü und Navigation geteilt.

Motive: Verwaltungssitz, fünf Pferde nebeneinander, Scheunengarage, einfache/prächtige Auftragsrolle, rotes Standbanner, Karte mit Kompass, Materialkarren mit Holz-/Eisen-/Silberzahnrädern, Hermes-Karten, Verteilkontor mit Kran und Karren, Vorratskiste, Amboss mit Zahnrad und Hammer, Kundenregister, orientalischer Marktstand, Statistikbuch und Einstellungszahnrad mit Schieber.

Mit dem integrierten Bildgenerator anhand der freigegebenen Musterproben erzeugt. Die Prompts und Referenznamen sind in `prompts.json` dokumentiert. Bilder auf sichtbaren Alphainhalt zugeschnitten, proportional in 232 Pixel eingepasst und mit 12 Pixel transparentem Rand auf 256 Pixel ergänzt. Rohbilder sind keine App-Abhängigkeit.

`src/MenuArt.tsx` bündelt die statischen Quellen. Die umgebenden Schaltflächen liefern ihre zugänglichen Beschriftungen; dekorative Bilder werden nicht zusätzlich vorgelesen. Funktionale Pfeile, Hilfe und Statuszeichen bleiben technische Icons.
