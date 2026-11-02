# Gealterte Materialien

Die gewählte Stärke liegt zwischen den Vorschauen „Dezent“ und „Mittel“. Feine Papierfasern und weiche Alterung sind erkennbar, ohne den Inhalt zu überlagern. Petrolflächen wirken matt und leicht patiniert. Es gibt keine starken Flecken, Risse, zusätzlichen Zierränder oder Layoutänderungen.

## Gemeinsame Umsetzung

`MaterialView` und `MaterialPressable` sind native Hosts mit unveränderten Props, Events, Ref und Layout. `MaterialLayer` liegt absolut **vor dem Inhalt in der Zeichenreihenfolge**, bleibt unter Text und Bildern, fängt keine Berührungen ab und ist vollständig aus der Accessibility-Lesereihenfolge ausgeschlossen. Nur die Dekoration wird auf den vorhandenen Radius beschnitten; der Host selbst erhält kein neues Clipping, damit schwebende Schilder und andere Inhalte erhalten bleiben. Sichere Bereiche und die scrollende Seitenfläche erhalten dieselbe Ebene explizit, ohne neue umschließende Layout-Views.

Zwei gemeinsam gebündelte JPEGs mit 512 × 512 Pixeln (zusammen 42.169 Byte) werden wiederholt statt auf verschieden große Flächen verzerrt. Alle Instanzen teilen dieselben Quellen; es werden keine Bilder zur Laufzeit erzeugt oder geladen. Die Ebenen beeinflussen keine Maße und führen keine Animationen oder zusätzlichen Timer ein.

- Seiten-Pergament: sehr schwach, damit große Flächen ruhig bleiben.
- Cards/Modale: Papier mit 44 % Deckkraft über dem unveränderten Farbton.
- Erhöhte Papierflächen: 24 %.
- Petrol-Aktionsflächen: 48 %, dunkle Kopf-/Navigationsflächen zurückhaltender (18 %).
- Kleine Statuspunkte und Fortschrittsspuren werden nicht texturiert.

Die Hosts sind in den gemeinsamen UI-Bausteinen sowie in den bestehenden Custom-Modals, Tabellen-/Kartenflächen, Hauptmenüzeilen und Tabs angebunden. Vollflächige Illustrationen überdecken die darunter liegende Dekoration; ihre Kunstwerke und die technischen Item-/Fahrzeugrahmen werden nicht verändert. Seltenheitsfarben und semantische grüne, blaue, rote oder goldene Waschfarben bleiben exakt erhalten. Vorhandene Linien, Radien, Textfarben, Fonts und Abstände bleiben unverändert.

## Validierung

TypeScript und Android-Export; Gesamttests inklusive Material-Farbregeln, kleinem Offline-Assetbudget sowie Weiterleitung von Events, Ref, Pressed-Styles und Render-Children an die nativen Hosts. Bestehende UI-Tests behandeln die neuen Hosts weiterhin als native Views/Pressables und behalten ihre Verhaltensprüfungen. Visuelle Browserprüfung ist in dieser Umgebung nicht verfügbar (kein ausführbares Chromium; vorheriger Download ungültig). Die Stärke kann zentral über `materialOpacity` justiert werden, ohne einzelne Screens anzufassen.

Die vollständigen Prompts und Quellangaben stehen in `assets/art/materials/prompts.json`. Die Originaltexturen wurden mit dem eingebauten ImageGen erzeugt und ausschließlich verkleinert und JPEG-komprimiert.
