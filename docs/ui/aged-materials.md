# Gealterte Materialien

Die gewählte Stärke liegt zwischen den Vorschauen „Dezent“ und „Mittel“. Feine Papierfasern und weiche Alterung sind erkennbar, ohne den Inhalt zu überlagern. Petrolflächen wirken matt und leicht patiniert. Es gibt keine starken Flecken, Risse, zusätzlichen Zierränder oder Layoutänderungen.

## Gemeinsame Umsetzung

`MaterialView` und `MaterialPressable` sind native Hosts mit unveränderten Props, Events, Ref und Layout. `MaterialLayer` liegt absolut **vor dem Inhalt in der Zeichenreihenfolge**, bleibt unter Text und Bildern, fängt keine Berührungen ab und ist vollständig aus der Accessibility-Lesereihenfolge ausgeschlossen. Nur die Dekoration wird auf den vorhandenen Radius beschnitten; der Host selbst erhält kein neues Clipping, damit schwebende Schilder und andere Inhalte erhalten bleiben. Sichere Bereiche und die scrollende Seitenfläche erhalten dieselbe Ebene explizit, ohne neue umschließende Layout-Views.

Die im Vertrieb auf Android bestätigten zwei JPEGs (`sales-parchment.jpg` und `sales-petrol.jpg`, zusammen etwa 96 KB) sind jetzt die gemeinsame Quelle. Eine einzelne passend aufgezogene Bildfläche statt wiederholter Kacheln erhält die weiche Randalterung. Die Mitte bleibt ruhig. Es gibt keine Generierung, Downloads, Timer oder Animationen zur Laufzeit.

- Seiten-Pergament: 24 %, damit große Hintergrundflächen ruhig bleiben.
- Cards/Modale: Papier mit der bestätigten 72-%-Deckkraft.
- Erhöhte Papierflächen: 55 %.
- Petrol-Buttons, aktive Tabs und dunkle Kopf-/Navigationsflächen: bestätigte 88 %.
- Kleine Statuspunkte und Fortschrittsspuren bleiben untexturiert.

Der statische Bild-Unterbaum ist memoisiert und erhält nur einfache Farb-/Radiuswerte. Neue Style-Arrays oder sekündliche Uhraktualisierungen erzeugen dadurch keine erneute Texturbild-Renderarbeit. Ungefärbte Layout-Views bekommen gar keine dekorative Ebene. Mit `material={false}` können opaque Bildflächen explizit ausgespart werden. Pro qualifizierter Fläche wird genau ein Bild und ein beschnittener Layer verwendet; die zusätzliche dekorative Rahmenebene entfällt. Der native Host selbst wird weiterhin nicht beschnitten.

Die Hosts sind in den gemeinsamen UI-Bausteinen sowie in den bestehenden Custom-Modals, Tabellen-/Kartenflächen, Hauptmenüzeilen und Tabs angebunden. Vollflächige Illustrationen überdecken die darunter liegende Dekoration; ihre Kunstwerke und die technischen Item-/Fahrzeugrahmen werden nicht verändert. Seltenheitsfarben und semantische grüne, blaue, rote oder goldene Waschfarben bleiben exakt erhalten. Vorhandene Linien, Radien, Textfarben, Fonts und Abstände bleiben unverändert.

## Validierung

TypeScript und Android-Export; Gesamttests inklusive Material-Farbregeln, Offline-Assetbudget der bestätigten Pilotbilder sowie Weiterleitung von Events, Ref, Pressed-Styles und Render-Children an die nativen Hosts. Bestehende UI-Tests behandeln die neuen Hosts weiterhin als native Views/Pressables und behalten ihre Verhaltensprüfungen. Visuelle Browserprüfung ist in dieser Umgebung nicht verfügbar (kein ausführbares Chromium; vorheriger Download ungültig). Die Stärke kann zentral über `materialOpacity` justiert werden, ohne einzelne Screens anzufassen.

Die vollständigen Prompts der jetzt verwendeten, vom Spieler bestätigten Quellen stehen in `assets/art/materials/sales-pilot.prompts.json`. Die ursprünglichen schwachen Texturen und deren Prompt bleiben als frühere Quelle erhalten, werden vom Materialsystem aber nicht mehr gebündelt. Die Originaltexturen wurden mit dem eingebauten ImageGen erzeugt und ausschließlich verkleinert und JPEG-komprimiert.
