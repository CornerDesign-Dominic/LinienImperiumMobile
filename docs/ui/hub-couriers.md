# Stadthub-Boten

Alle Stadthub-Boten verwenden das freigegebene Lastwombat-Motiv: ein einzelnes kräftiges Fabelwesen mit Fellkamm, beladenen Ledertaschen und petrolfarbener Decke im Kontorhof. Das optimierte quadratische JPEG wird über `HubCourierArt` in der dreispaltigen Übersicht, dem Detailfenster und dem Anwerbefenster gemeinsam angezeigt. Das bisherige LKW-Piktogramm entfällt dort. Es gibt keine Seltenheitskennzeichnung. Das inzwischen vorbereitete [Skinsystem](premium-shop.md) führt den Lastwombat als kostenlose eigene Standardgestaltung; weitere kaufbare Motive sind noch nicht verfügbar.

Sichtbare Bezeichnungen lauten Boten, Bote 01 usw.; die Art heißt Lastwombat. Hilfe, Anwerbetexte, Werkzeugkastenbeschreibung und englische Texte sind angepasst. Der Server liefert zusätzlich displayName/displayModel. Der Client hat dieselben kanonischen Ausweichregeln für bereits geladene Spielstände. Bekannte Hub-IDs werden in Mitteilungen und Historien nur bei der Anzeige übersetzt; eigene Namen und Firmen-/Stadtnamen bleiben erhalten.

Persistente LKW-IDs, Modelle, gespeicherte Ereignisse und Commands bleiben unverändert. Kaufpreis, Plätze, Werte, Ausbaukosten, Zuweisungen und Erträge ändern sich nicht. Andere Kartenfahrzeuge behalten ihre Namen und Bilder.

Geprüft: TypeScript, 233 Tests, Android-Export. Browser bei 320/360/390/430 dp mit fünf Boten und unvollständiger letzter Rasterreihe; Detail mit Ausbau/Zuweisung/Verkauf sowie Anwerbefenster. Keine Bildladefehler oder horizontalen Überläufe.

## Kompakte Botenübersicht

Drei Spalten bleiben erhalten. Das quadratische Bild reicht bis an den einfachen Kartenrand; Namen erscheinen ausschließlich in der Detailansicht (und bleiben als Identifikation für Screenreader verfügbar). Oben rechts am Bild zeigt ein kleiner grüner beziehungsweise grauer Punkt den Einsatzstatus. Unter dem Bild stehen Kapazität, Tempo und zwei kompakte Ausbaustufen mit Icons ohne Fortschrittsbalken. Ein dezenter goldener Punkt kennzeichnet bezahlbare Ausbauten unterhalb des Maximums; dafür gelten dieselben Werkzeugkasten- und Münzanforderungen wie im Detail. Der Kopf zeigt Botenanzahl und Werkzeugkästen ohne zusätzliches Wombat-Bild.

Wenn alle derzeitigen Plätze belegt sind und ein weiterer Platz durch Levelaufstieg erreichbar ist, erscheint eine gleich hohe gesperrte Karte mit Schloss und Freischaltlevel. Bei freiem Platz bleibt stattdessen die Anwerben-Karte bedienbar. Am absoluten Maximum wird kein weiterer Platz vorgetäuscht. Karten öffnen weiterhin den bestehenden Detaildialog; Kauf-, Ausbau- und Einsatzlogik bleiben unverändert.
