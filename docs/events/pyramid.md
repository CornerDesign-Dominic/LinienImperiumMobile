# Die Pyramide – erster spielbarer Stand

## Einstieg und Oberfläche

Das vorhandene Event `large-project-own-overtime` bleibt erhalten und heißt nun
„Die Pyramide“. Reiter: Event, Pass, Ränge. Keine neue Region, Kiste, Bilder oder
spielbare legendäre Fahrzeugkarte. Die Passkarte ist ein ausdrücklich benannter
Platzhalter; der einmalige Anspruch wird als `eventCards.pyramidLegendary`
gespeichert. Keine Eventshards und keine Ranglistenpreise.

## Solotest

Start mit Bestätigung, Ziel 100–1.000.000 Steine, einfache Strecke 180/240/360 km,
Laufzeit 2/24/120 Stunden. Standard: 1.000 Steine, 240 km, fünf Tage. Manuelles
Beenden benötigt weiterhin Bestätigung. Neustart löscht den alten Testfortschritt.
Ein bestehender alter Test wird übernommen, auf fünf Tage ab ursprünglichem Start
begrenzt und erhält die neuen Passdaten. Bereits gelieferte Mengen bleiben erhalten.

Testbelohnungen landen ausschließlich im Testledger; sie erhöhen keine normalen
Vorräte und verschwinden beim Neustart. Der Überstundeneinsatz verbraucht normale
Überstunden; Hauptspielaktivitäten behalten ihre normale Wirkung. Keine zusätzliche
Beschleunigung des Fahrzeugs. Für einen schnellen Test 100 Steine / zwei Stunden
wählen und bei Bedarf Überstunden einsetzen.

## Gemeinsamer Termin

Die erste Anmeldung eröffnet einmalig das 48-Stunden-Fenster. Alle sehen denselben
Beginn und dasselbe Ende fünf Tage später. Anmeldungen werden pro authentifiziertem
Account gezählt, auch bei erneutem Tippen, Request-Wiederholung oder Spielreset.
Zum Beginn werden Ziel und Strecke eingefroren. Danach ist Beitritt auch ohne
Anmeldung möglich und verändert die Skalierung nicht. Flotteneinsatz ist manuell;
eine Anmeldung startet keine Flotte. Das Beenden im eigenen Konto stoppt nur den
eigenen Einsatz. Dieselbe Gemeinschaftsrunde kann nicht neu gestartet werden.

Der aktuelle erste Termin wird nicht automatisch wiederholt. Eine spätere
Verwaltung für weitere Gemeinschaftsrunden ist noch nicht Teil dieses Standes.

## Skalierung

`node scripts/balance-pyramid.cjs` berechnet Fahrzeugbeispiele und die Staffel.
Referenz: fünf unverbesserte Common-Karten, 18 Stunden Einsatz am Tag über 3,5 Tage,
100 eingesetzte Überstunden, 240 km. Der aktuelle Bestand ergibt etwa 9.827 Steine.
Planungswert auf 10.000 Steine pro angemeldetem Spieler aufgerundet.

Für N Anmeldungen gilt:

- Referenzarbeit = N × 10.000 × 240 tkm.
- Gesamtziel = mindestens eine Million; auf die nächste Million aufrunden, die
  diese Arbeit mit höchstens 360 km aufnehmen kann.
- Strecke = Referenzarbeit / Gesamtziel, auf volle 10 km aufrunden, 180–360 km.
- 100 gleich große Baustufen. Kein Produktionslimit nach Stufe 100.

Die Staffel verlangt mit steigender Spielerzahl nie weniger gesamte tkm. Sie ist
vorläufig: echte Flottenverteilung, Einsatzdauer, Ausfälle und Überstundenvorräte
müssen später gemessen werden. Unter etwa 75 Anmeldungen lässt sich das Mindestziel
von einer Million mit dieser Referenz nicht in 3,5 Tagen ausgleichen; dafür ist
aktuell der getrennte Solotest vorgesehen. Starke Flotten können früher fertig
werden. Es gibt keine nachträgliche Erhöhung laufender Ziele.

## Transporte und Überstunden

Eine Tonne = ein Stein. Bruchteile bleiben erhalten, keine Rundung je Lieferung.
Jedes Fahrzeug liefert beim Ende seiner beladenen Hinfahrt. Dann fährt es leer
zurück. Der nächste Tourstart übernimmt Änderungen an Karte, Kapazität, Tempo und
Boni; die laufende Hin- und Rückfahrt bleibt eingefroren. Der Tourzähler und die
volle Rundstrecke werden nach abgeschlossener Rückfahrt gebucht.

Überstunden liefern sofort exakt 1.000 tkm pro Punkt / einfache Strecke. 1/5/10/MAX.
Keine Abhängigkeit vom Fahrzeug und keine Veränderung seiner laufenden Tour.
Eventtransporte geben keine zusätzlichen normalen Münzen oder XP. Bei Deadline
zählen nur bis einschließlich dieses Zeitpunkts eingetroffene Lieferungen, auch
bei späterem Offline-Abgleich. Nach Ablauf stoppt die Produktion automatisch.

## Gemeinschaftsbelohnungen

Ab jeder positiven eigenen Lieferung sind sämtliche erreichten Stufen abholbar,
auch bereits vor dem Beitritt erreichte. Je Spieler/Stufe einmal. Ohne Beitrag
keine Gemeinschaftsbelohnungen. Abholung nach Ende bleibt möglich, solange dieser
Durchlauf noch im Konto liegt. Ein neuer Solotest ersetzt die vorhandene Ansicht.

- Jede zehnte Stufe: ein Kapazitätsmodul, insgesamt zehn.
- Übrige Fünferstufen: abwechselnd Expeditions- und Überstundenauffüller, je fünf.
- Alle anderen Stufen: zwei Common-Zahnräder, insgesamt 160.

## Persönlicher Pass

100 mögliche Punkte, 85 nötig für zehn Stufen; Schwellen 8,5 / 17 / … / 85.
Aufgaben wachsen anteilig und sind jeweils gedeckelt:

| Aktivität | Ziel über gesamte Laufzeit | Max. Punkte |
|---|---:|---:|
| Anmeldung an verschiedenen Eventtagen | 5 Tage | 20 |
| Normale Überstunden verwenden, auch im Hauptspiel | 100 Punkte | 30 |
| Expeditionspunkte verwenden, auch im Hauptspiel | 50 Punkte | 30 |
| Steine liefern | 1.000 Steine | 20 |

Ein Eventtag ist ein 24-Stunden-Abschnitt ab Eventstart; Serverzeit ist maßgeblich.
Wiederholtes Synchronisieren zählt nicht erneut. Kurze Tests reduzieren die Zahl
der Anmeldetage und gegebenenfalls das Lieferziel. Keine Aktivität vor Start oder
nach Ende; Auffüllen, Testgeschenke, Belohnungen und fehlgeschlagene Aktionen
zählen nicht als Verbrauch. Aufgabenfortschritt wird vom tatsächlichen
Ressourcenverbrauch abgeleitet, nicht vom Client übermittelt.

Stufen 3/6/9: Kapazitätsmodul. Stufen 2/4/8: Expeditionsauffüller.
Stufen 1/5/7: Überstundenauffüller. Stufe 10: einmal legendärer Kartenplatzhalter.
Alle erreichten Belohnungen lassen sich gemeinsam abholen; Wiederholungen zahlen
nicht erneut. Beim Gemeinschaftsevent bleiben Abholmarkierungen serverseitig auch
nach einem Spielreset erhalten.

## Gemeinschaft und Rangliste

Firestore `communityEvents/pyramid` und Unterkollektion `participants` werden nur
über die authentifizierte Callable angesprochen. Spielerstand, Beitragsdifferenz,
Gesamtstand, Abholungen und Request-Receipt werden in einer Transaktion gespeichert.
Ein Wiederholungsrequest führt keinen Kauf oder keine Abholung erneut aus.

Rangliste: gelieferte Steine inkl. Überstunden. Gleiche Mengen haben denselben Rang; Ranglistenwerte werden auf ein Millionstel
Stein vereinheitlicht, damit Gleitkommareste aus verschiedenen Klickfolgen keine
Platzierung entscheiden. Die tatsächliche Abrechnung behält den ungerundeten Wert.
Top 50 plus eigener Beitrag; außerhalb der Top 50 wird kein erfundener exakter Rang
angezeigt. Abfragen erfolgen beim Öffnen des Reiters und dann alle 30 Sekunden,
nicht bei jeder normalen Spielaktion. Ausschließlich Firmenname und Beitrag werden
angezeigt, keine E-Mail oder Auth-Kennung.

Der Gesamtstand enthält die zuletzt mit dem Server synchronisierten Lieferungen.
Offline-Spieler buchen ihre seitdem eingetroffenen Transporte beim nächsten
Abgleich nach, begrenzt durch die Deadline. Es gibt noch keine Hintergrundabrechnung
aller Offline-Konten und keine endgültige Ranglistenabrechnung/Preisvergabe.
Vor einem produktiven Wettbewerb mit Ranglistenpreisen muss diese Finalisierung
ergänzt werden. Dies ist ein funktionaler Gemeinschafts- und Soloteststand.
