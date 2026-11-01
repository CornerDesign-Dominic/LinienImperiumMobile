# Stadthub-Boten

Alle Stadthub-Boten verwenden das freigegebene Lastwombat-Motiv: ein einzelnes kräftiges Fabelwesen mit Fellkamm, beladenen Ledertaschen und petrolfarbener Decke im Kontorhof. Das optimierte quadratische JPEG wird über `HubCourierArt` in der dreispaltigen Übersicht, dem Detailfenster und dem Anwerbefenster gemeinsam angezeigt. Das bisherige LKW-Piktogramm entfällt dort. Es gibt keine Seltenheitskennzeichnung und kein neues Skinsystem.

Sichtbare Bezeichnungen lauten Boten, Bote 01 usw.; die Art heißt Lastwombat. Hilfe, Anwerbetexte, Werkzeugkastenbeschreibung und englische Texte sind angepasst. Der Server liefert zusätzlich displayName/displayModel. Der Client hat dieselben kanonischen Ausweichregeln für bereits geladene Spielstände. Bekannte Hub-IDs werden in Mitteilungen und Historien nur bei der Anzeige übersetzt; eigene Namen und Firmen-/Stadtnamen bleiben erhalten.

Persistente LKW-IDs, Modelle, gespeicherte Ereignisse und Commands bleiben unverändert. Kaufpreis, Plätze, Werte, Ausbaukosten, Zuweisungen und Erträge ändern sich nicht. Andere Kartenfahrzeuge behalten ihre Namen und Bilder.

Geprüft: TypeScript, 233 Tests, Android-Export. Browser bei 320/360/390/430 dp mit fünf Boten und unvollständiger letzter Rasterreihe; Detail mit Ausbau/Zuweisung/Verkauf sowie Anwerbefenster. Keine Bildladefehler oder horizontalen Überläufe.
