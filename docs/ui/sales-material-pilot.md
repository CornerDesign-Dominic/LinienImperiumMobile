# Materialpilot im Vertriebsmodal

Nur das Modal „Vertrieb verbessern“ verwendet die neuen Materialien. Die Übersichtskarte und alle anderen Oberflächen behalten den veröffentlichten Stand.

Die neue Papierfläche besitzt eine ruhig lesbare Mitte, sichtbare Fasern und weich gealterte Ränder. Der petrolfarbene Kopf und Aktionsknopf erhalten eine matte Patina mit wenigen warmen Abriebspuren. Zwei eigens erzeugte 640-Pixel-JPEGs benötigen zusammen rund 96 KB. Die vorhandenen Texturen werden nicht ersetzt.

Die Dekoration liegt absolut hinter echten Texten und Bedienelementen, ist für Eingaben und Screenreader ausgeblendet und wird einmal über die jeweilige Fläche eingepasst (`stretch`, kein Wiederholungsmuster). Explizite Pilotflächen umgehen die globale Farberkennung und deren niedrige Deckkraft. Papier wird mit 72 %, Petrol mit 88 % eingeblendet. Der Aktionsknopf behält seine vorhandene reduzierte Deckkraft im gesperrten Zustand. Die grüne Vergleichsfläche bleibt unverändert.

Maße, Schriftgrößen, Layout, Bildmotiv, Preise, Zeiten, Ausbaulogik und Sperren sind unverändert. Kopf und Schließen bleiben fest erreichbar, der Inhalt scrollbar.

Die Assets wurden mit dem eingebauten ImageGen erzeugt, anschließend ausschließlich verkleinert und JPEG-komprimiert. Vollständige Prompts stehen in `assets/art/materials/sales-pilot.prompts.json`.

Prüfung: TypeScript, bestehende Vertriebs-/Hubtests, Gesamtsuite und Android-Export. Die generierten Materialien wurden visuell geprüft. Eine echte Android-/Browserdarstellung kann diese Umgebung ohne verfügbaren Browser bzw. Gerät nicht bestätigen; die sichtbare Feinabstimmung erfolgt am veröffentlichten Pilotmodal.
