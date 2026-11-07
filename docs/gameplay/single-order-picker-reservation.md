# Temporäre Haltezeit der Fahrzeugauswahl

Beim Öffnen eines regulären Einzelauftragsangebots reserviert der Server das Angebot für 30 Sekunden. Die Fahrzeugauswahl zeigt die verbleibende Haltezeit anhand der Serveruhr. Syncs, erneute Requests und Render verlängern die feste Frist nicht. Diese Reservierung verbraucht keinen dauerhaften Halteplatz.

Automatische und manuelle Angebotswechsel erzeugen weiterhin einen vollständigen neuen Angebotssatz. Ein noch reserviertes altes Angebot bleibt zusätzlich bis zu seinem Ablauf startbar. Beim Schließen wird es freigegeben; wurde es bereits durch einen Angebotswechsel verdrängt, verschwindet es dabei. Alte Release-Anfragen können eine inzwischen neu eröffnete Reservierung mit anderem Token nicht beenden.

Ohne Angebotswechsel verschwindet ein reguläres Angebot nach 30 Sekunden nicht: Es bleibt bis zum regulären Angebotswechsel verfügbar. Bereits verdrängte, abgelaufene Angebote können nicht erneut reserviert oder gestartet werden. Die Fahrzeugauswahl erklärt den Ablauf, statt nur einen allgemeinen Startfehler zu zeigen.

Dauerhaft gehaltene Angebote, laufende Aufträge und gespeicherte beziehungsweise wartende Kundenaufträge behalten ihre bisherigen Regeln. Auswahl und Start anderer Auftragsarten erhalten keine temporäre Haltezeit.
