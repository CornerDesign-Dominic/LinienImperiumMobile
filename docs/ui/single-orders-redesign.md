# Einzelaufträge: Angebote, Laufende und Aufträge

Die drei Reiter verwenden eine kompakte gemeinsame Zeile mit Anzahl neben dem Titel, aktivem Petrol und einem kleinen goldenen Hinweis auf abholbereite Belohnungen. Die globale Kopfzeile und untere Navigation bleiben unverändert.

Angebote zeigen rahmenlose, transparente Warenillustrationen für Holz, Stein, Getreide, Erz und Wolle. Menge und Strecke stehen in einer Zeile; die vorhandenen Nah/Fern-, Dauer- und Single/Dual-Merkmale bleiben zusammen darunter. Die Halten-Aktion bleibt ein eigener 44-dp-Trefferbereich, einschließlich belegter Halteplätze, Freigeben und Busy-Sperre. Andere und historische Warennamen verwenden eine neutrale Frachtkiste statt eines falschen Basiswarenbilds. Der nächste automatische Wechsel und der kostenpflichtige Wechsel stehen in einer kompakten gemeinsamen Zeile.

Laufende Aufträge und aktive Expeditionsaufträge zeigen die zugewiesene Transportkarte. Waren-/Auftragsname und Restzeit stehen oben, darunter Gespannname und Merkmale bzw. Region. Liefermenge und Fortschritt bleiben zusammen. Die statischen Art-Unterbäume sind memoisiert; Sekundenupdates verändern weiterhin Restzeit und Fortschritt. Abgeschlossene Einzel-/Expeditionsaufträge erscheinen ausschließlich in der gemeinsamen Belohnungsabholung, ohne zusätzliche fertige Karten.

Gespeicherte Aufträge verwenden illustrierte Kategorien mit rechter Anzahl und Chevron. Material zeigt Zahnräder und Rolle, Transportkarten einen Kartenfächer mit Pferdemotiv und Rolle. Beide Illustrationen haben echte Transparenz und keinen Bildrahmen. Die vorhandenen Ranggruppen erscheinen aufsteigend und behalten die gespeicherte Reihenfolge innerhalb desselben Rangs. Keine Aufträge werden beim Anzeigen/Sortieren verändert oder verbraucht.

Die sieben Bilder wurden mit eingebautem ImageGen erstellt; vollständige Prompts liegen unter `assets/art/orders/prompts.json`. Für die App sind sie auf 256 px (Waren) bzw. 320 px (Kategorien) verkleinert und verlustfrei als PNG mit Alpha gespeichert, zusammen rund 700 KiB. Vorhandene Gespannbilder werden wiederverwendet.

Validierung: bestehende Tests für getrennte Halten-/Öffnen-Aktionen, Busy-/Slot-Sperren, Traits und gemeinsame Belohnungen; zusätzlich Kategorienzählung, Öffnungsziel, aufsteigende Ränge und unveränderte gespeicherte Daten. Typecheck, vollständige Tests und Android-Export. Asset-Silhouetten und Transparenz visuell geprüft. Native Layout-/Scrollmessungen auf Android waren in dieser Umgebung nicht verfügbar; Export und Komponententests ersetzen keinen Gerätetest.
