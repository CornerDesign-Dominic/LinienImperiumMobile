# Stadthub-Bilder

Die vier ursprünglichen transparenten Abschnittsillustrationen für Erträge, Fundkisten, Vertrieb und Fahrzeuge werden von `src/HubArt.tsx` gebündelt. Sie nutzen die warme Holz-, Leder- und Messingpalette des Startmenüs. Die benachbarte Beschriftung liefert den zugänglichen Namen; dekorative Bilder erzeugen keine zusätzlichen Touch-Ziele.

Erzeugt mit dem integrierten Bildgenerator anhand des Beschaffungswagens und der damaligen Hermes-Münze als Stilreferenzen. Produktions-PNGs wurden auf sichtbaren Alphainhalt zugeschnitten und in 256 × 256 Pixel eingepasst, mit maximal 232 Pixel großem Motiv. Originalprompts: `prompts.json`.

Der aktuelle Stadthub verwendet zusätzlich eigenständige Szenen und Motive für Erträge, Fundkisten, Vertrieb und Lastwombat-Boten. Diese werden in den jeweiligen Komponenten `HubEarnings`, `HubCrateCard`, `HubSales`, `HubCourierArt` und `HubVehicleDetail` eingebunden. Die dazugehörigen Promptdateien liegen neben den Bildern. Die vier ursprünglichen Abschnittsicons beschreiben daher nicht mehr allein den gesamten Bildumfang.

Fachliche Regeln: [Spielregeln](../../../SPIELREGELN.md). Die Bilddateien selbst ändern weder Wirtschaft noch Interaktionen.
