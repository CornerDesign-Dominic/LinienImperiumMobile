# Linien Imperium Online — Mobile

Transport-, Handels- und Entdeckungsspiel als native React-Native-/Expo-App für Android. Quellcode und Bundle-ID für iOS sind vorbereitet; ein signierter iPhone-Build benötigt Apple-Entwicklerzugang. Die mobile Version entwickelt den ursprünglichen Web-Prototyp eigenständig weiter.

## Einstieg

- [Dokumentationsindex](docs/README.md): Detailreferenzen und Historie.
- [Aktuelle Spielregeln](SPIELREGELN.md) und [Tourregeln](TOUR_RULES.md).
- [Gestaltung](DESIGN.md), [Sprachen](LOCALIZATION.md), [Item-Katalog](ITEM_AUDIT.md).
- [Teststrategie](tests/README.md), [Prüfnachweise](TEST_REPORT.md), [offene Arbeiten](PENDING_UPDATE.md).

## Spielumfang

- Fünf Hauptbereiche: Home, Flotte, Garage, Einzelaufträge und Großaufträge; Firma und Stadt erhalten frei gewählte Anzeigenamen.
- 25 regionale Transportkarten mit Illustrationen, Seltenheiten, Kartenstufen, Geschwindigkeitsrang, Kapazitätsausbau und Einsatzboni. Garage und Flotte haben getrennte Einsatzregeln.
- Einzelaufträge mit Nah-/Fernverkehr, Single/Dual Way, Kunden- und Vorratsaufträgen, Halten, Aktualisieren und gemeinsamer Belohnungsabholung.
- Großaufträge mit Flotteneinsatz, passiven Lieferungen, Überstunden und Abschlussstatistik; Expeditionen mit fünf Regionen, Ortsmissionen, Endlosorten, Kartenfunden und Shards.
- Materialbeschaffung mit Einzel- und Gruppenfahrten, vorausbezahlten Touren oder Kontoreserve, Offline-Abrechnung und getrennten Abbruchmöglichkeiten.
- Ausbaupunkte aus einmaligen Ortslieferungen für dauerhafte Expeditions-/Überstundenmaxima; eigenständiges Bauplan-/Säulenmotiv.
- Handelsimperium mit Ausbauten und Punkteverteilung; gemeinsamer Vorrat von Ausbaupunkten aus Levelaufstiegen (je 3) und Ortslieferungen (je 1) sowie je ein Expeditions- und Überstundenauffüller für 50 Punkte.
- Botenstation mit Lastwombat-Boten, Vertrieb, Erträgen, Fundkisten und eigenem Ausbau über Werkzeugkästen; Vorräte, Herstellung, Stammkunden und Statistik.
- Pyramiden-Event mit Event/Pass/Ränge, Solotest und Gemeinschaftsrunde; [Eventregeln und Grenzen](docs/events/pyramid.md).
- Großhändler mit regionalen Geschenken und vorbereitetem Skin-/Hermes-Siegel-Shop. Echtgeldkäufe sind deaktiviert; aktuell ist nur der kostenlose Standard-Skin vorhanden. [Shopstand](docs/ui/premium-shop.md).

Dies ist eine Testversion mit Testwerkzeugen unter Einstellungen. Temporäre Testwerte sind in den Spielregeln ausdrücklich von regulären Regeln getrennt.

## Konto und Speicherung

Der erste Start legt ein anonymes Firebase-Konto an und speichert dessen Anmeldung auf dem Gerät. Unter **Home → Einstellungen** kann der Spielstand mit E-Mail und Passwort gesichert oder ein bestehendes Konto geladen werden. Eine Neuinstallation kann den Zugang zu einem ungesicherten Gastkonto verlieren.

Spielaktionen benötigen Internet. Der Server berechnet Fortschritt anhand seiner Zeit, auch nach einer Spielpause; eine lokale Uhrzeitänderung oder vom Client übermittelte Guthaben bestimmen den Spielstand nicht. Die Sprachwahl Deutsch/Englisch ist eine lokale Geräteeinstellung, getrennt vom Konto.

## Architektur

- `src/App.tsx` und die übrigen Komponenten unter `src/` rendern die native Oberfläche, keine WebView.
- `functions/vendor/web-game.js` ist die gepinnte Web-Baseline (`CornerDesign-Dominic/LinienImperium`, Commit `3ffe8a3ba7956119359b8c16a4df0e4423acc6e7`). Deren ursprüngliche Regeln beschreiben nicht automatisch das heutige Mobile-Spiel.
- `functions/src/engine.cjs` bindet die Baseline und die Mobile-Runtimes ein und stellt erlaubte Befehle und Ansichtsmodelle bereit. Touren, Karten, Fortschritt, Beschaffung und Botenstation werden dort für Mobile erweitert.
- Die authentifizierte callable Function `game` in `europe-west3` verarbeitet Aktionen serverseitig. Komprimierte Spielstände liegen in Firestore; Transaktionen und Anfragekennungen verhindern doppelte Mutationen bei Wiederholungen. Direkte Firestore-Clientzugriffe sind gesperrt.
- Firebase-Projekt: `linienimperium`. Deployment verwendet Workload Identity Federation; Expo-Token und Android-Signierung werden über Secret-Verwaltung bereitgestellt, nicht über Repository-Dateien.

## Lokal prüfen

```sh
npm ci
npm ci --prefix functions
npm run typecheck
npm test
npx expo export --platform android
```

Die Tests sichern Mobile-Regeln, ausgewählte Komponentenabläufe und die bewusst erhaltene Web-Baseline getrennt ab. Umfang und Grenzen stehen in [tests/README.md](tests/README.md). Ein grüner lokaler Lauf belegt weder Veröffentlichung noch einen physischen Gerätetest.

## Android-Testversion und Veröffentlichung

Die installierte APK benötigt keinen laufenden PC oder Expo Go. Aktuelle Build- und Update-Ergebnisse stehen in [GitHub Actions](https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions) und im [EAS-Projekt](https://expo.dev/accounts/cornerdesign/projects/linien-imperium-online). Der APK-Link wird bei einem erfolgreichen neuen Build in dessen Workflow-Zusammenfassung ausgegeben.

| Weg | Wirkung |
| --- | --- |
| Normaler Push auf `main` | Startet gemäß Workflow-Pfadfilter die Validierung; veröffentlicht allein weder Server noch OTA. |
| **Mobile preview** manuell oder `main`-Commit mit `[publish-preview]` | Validierung → Firebase-Backend und Regeln → Live-API-Smoke-Test → kompatibles Android-OTA im Kanal `preview`. |
| **Mobile preview** manuell mit `build_apk` | Validierung und Backend-Deployment, anschließend neue installierbare APK statt OTA. Erforderlich bei nativen Änderungen oder neuer Runtime. |
| Zusätzlich `publish_ota` beim manuellen APK-Build | Veröffentlicht parallel ein OTA für bereits installierte Apps. Nur wählen, wenn der JavaScript-Stand weiterhin mit deren nativer Runtime kompatibel ist (beispielsweise bei einer reinen Android-Theme-Anpassung). |
| **Update installed preview** manuell | Typprüfung und Tests, dann ausschließlich kompatibles Android-OTA; kein Backend-Deployment. Nur verwenden, wenn der veröffentlichte Server bereits passt. |

Die APK lädt kompatible OTA-Updates beim Start; sie werden nach einem Neustart verwendet. Maßgeblich für eine Veröffentlichung ist der erfolgreiche Workflow mit passendem Commit, nicht ein historischer Vermerk in einer Moduldatei. Die Workflow-Definitionen unter `.github/workflows/` sind die technische Referenz.

## Erstmalige Cloud-Einrichtung

Nur für eine neue bzw. wiederherzustellende Umgebung: `scripts/setup-firebase-access.sh`, anschließend durch den Projektinhaber `scripts/finish-firebase-access.sh` in Google Cloud Shell ausführen. Die Skripte richten den Deployment-Zugang, benötigte APIs und Zugriff auf die Android-Testsignatur ein. Danach **Mobile preview** manuell starten. Die vorhandene Umgebung benötigt diese Einrichtung nicht für jedes Update.

