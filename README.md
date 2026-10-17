# Linien Imperium Online — Mobile

Native React-Native-/Expo-App für Android, mit vorbereitetem iOS-Projekt. Dunkles Hochformat-Layout ohne Spielgrafiken oder Animationen.

## Einmalige Cloud-Einrichtung

Nach `scripts/setup-firebase-access.sh` muss der Projektinhaber zusätzlich `scripts/finish-firebase-access.sh` in Google Cloud Shell ausführen. Das aktiviert die beim ersten Deployment benötigten Zusatz-APIs, legt ein Serverkonto mit Firestore-Zugriff an und gibt dem Deployment-Konto nur Lese- und Hinzufügerechte auf das einzelne Android-Signatur-Secret. Anschließend **Actions → Mobile preview → Run workflow** starten. Diese administrativen Rechte hat der GitHub-Dienst selbst nicht.

## Android testen — ohne laufenden PC

**Testversion 0.1.0:** [APK direkt herunterladen](https://expo.dev/artifacts/eas/giLzWrQVv-S37lNWNLg15Sz9HosyPsfEqGtl_-geOfQ.apk) · [Erfolgreicher Build](https://expo.dev/accounts/cornerdesign/projects/linien-imperium-online/builds/d43d1b43-e06a-42b3-9204-a815bff724af)

Firebase-Deployment und Live-Tests sind erfolgreich abgeschlossen. Diese APK basiert auf Commit `8f8c5768a8891d6cd53a00b07155798d396c61c6`. Ein Start auf einem physischen Android-Gerät steht noch aus.

Der Workflow **Mobile preview** prüft den Code, veröffentlicht das Firebase-Backend und liefert kompatible Änderungen nach ausdrücklicher Veröffentlichung per EAS Update an installierte Android-Testversionen. Pushes allein veröffentlichen nichts; dafür ist ein manueller Workflow-Start oder ein Commit mit `[publish-preview]` erforderlich. Für eine neue APK den Workflow manuell mit **build_apk** starten. Der Downloadlink erscheint in der Zusammenfassung des erfolgreichen GitHub-Actions-Laufs. Auf Android die APK herunterladen, die Installation aus dem Browser erlauben und die installierte App öffnen. Expo Go und ein lokaler Entwicklungsserver sind dafür nicht erforderlich.

EAS-Projekt: https://expo.dev/accounts/cornerdesign/projects/linien-imperium-online
GitHub-Builds: https://github.com/CornerDesign-Dominic/LinienImperiumMobile/actions

Der erste Start erstellt ein dauerhaft auf dem Gerät gespeichertes anonymes Firebase-Konto. Unter **Home → Einstellungen** lässt sich der Spielstand mit E-Mail und Passwort sichern oder ein bestehendes Konto laden. Eine Neuinstallation kann ein ungesichertes Gastkonto verlieren. Internet ist für Spielaktionen nötig. Serverzeit berechnet Fortschritt nach geschlossener App; lokale Uhrzeit oder vom Client gesendete Münzen werden nicht übernommen.

## Umfang und Quelle

Übernommen ist der Webstand `CornerDesign-Dominic/LinienImperium` bei Commit `3ffe8a3ba7956119359b8c16a4df0e4423acc6e7`. Kundenprofile, neue Events und andere nur besprochene Erweiterungen sind nicht enthalten. Vorhandene noch nicht aktive Webabteilungen bleiben als solche gekennzeichnet.

- Kompakte Kopfzeile mit Level/XP, Münzen, Expeditions- und Überstundenpunkten; nur ein dezenter Seitenname je Ansicht.
- Fünf feste Navigationstasten: Home, Flotte, Garage, Einzelaufträge, Großaufträge.
- Firmengründung mit frei gewähltem Firmen- und Fantasiestadtnamen; drei Flottenvorlagen, Kartensammlung im Raster mit drei Spalten und Detailansicht, Garage mit zehn Kartenplätzen und Fahrzeugausbau.
- Frachtbörse, Single/Dual Way, Kunden- und hergestellte Aufträge, Halten/Aktualisieren, Prämien.
- Großprojekte, gespeicherte Flottenwerte, passive Transporte, 1.000 tkm je Token und Vergütung für Tokenlieferungen.
- Expeditionen mit fünf Regionen und sieben Orten, Missionen, Endlosorte, Kartenfunde und Shards.
- Firma und Transportausbauten, Stadthub und Händler, Vorräte, Herstellung, Kundenfähigkeiten und Statistik.
- 100-Token-Refill pro Level, fünf frei verteilbare Kapazitätspunkte.
- Bestehende Testwerkzeuge (+50.000 Münzen / Zurücksetzen) unter Einstellungen. Diese Test-App ist keine Veröffentlichung für echte Spieler.

## Architektur

`functions/vendor/web-game.js` enthält die unveränderte Webquelle. `functions/src/engine.cjs` bindet deren Spiellogik auf dem Server ein und stellt ausschließlich eine feste Liste erlaubter Befehle und mobile Ansichtsmodelle bereit. Die Weboberfläche wird nicht in einer WebView ausgeführt; `src/App.tsx` rendert native React-Native-Komponenten.

Die authentifizierte callable Function `game` in `europe-west3` berechnet alle Aktionen und prüft Besitz/Vorräte. Spielstände werden komprimiert in Firestore gespeichert. Transaktionen und Anfragekennungen verhindern doppelte Mutationen bei Wiederholungen; direkte Clientzugriffe auf Firestore sind gesperrt. `EXPO_TOKEN` bleibt ein GitHub-Secret. Firebase-Deployments authentifizieren sich per Workload Identity Federation. Die Android-Testsignatur bleibt in Google Secret Manager, nicht im Repository.

Firebase-Projekt: `linienimperium`. Datenbankregion bleibt wie angelegt; Functions verwenden Frankfurt. Deployment-Identität: `github-mobile-deploy@linienimperium.iam.gserviceaccount.com`.

## Lokal prüfen

```sh
npm ci
npm ci --prefix functions
npm run typecheck
npm test
npx expo export --platform android
```

Die Tests umfassen 23 übernommene Web-Regressionsdateien und zusätzliche Tests für den mobilen Serveradapter. `scripts/smoke-backend.cjs` prüft nach Deployment die echte Gastanmeldung, Speicherung, Deduplizierung und Zugriffssperre ohne Authentifizierung.

## Updates und iOS

**Mobile preview** veröffentlicht nach explizitem Start eine kompatible Android-Aktualisierung über EAS Update; **Update installed preview** kann dies zusätzlich manuell auslösen. Die vorhandene APK lädt diese Updates beim Start und verwendet sie beim nächsten Neustart. Bei Änderungen an nativen Abhängigkeiten oder der Runtime-Version ist eine neue APK erforderlich. Für iOS sind Bundle-ID und gemeinsamer Quellcode vorbereitet; ein iPhone-Build braucht noch Apple-Entwicklerzugang und Signierung.

`SPIELREGELN.md` dokumentiert die übernommenen Werte. Die aktuelle mobile Testversion bleibt getrennt vom ursprünglichen Webrepository.

## Mobile-Anpassungen nach dem ersten Build

Firmen- und Stadtname sind reine Anzeigenamen. Neue Firmen verwenden ein einheitliches Streckenprofil; die Namenswahl beeinflusst weder Entfernungen noch Vergütung. Bestehende Spielstände erhalten das Namensformular ohne Zurücksetzen. Bereits laufende Transporte behalten ihre Werte.

Die Kartensammlung zeigt Kartenstufe, Geschwindigkeitsrang und aktuelle Kapazität, mit quadratischer Fläche für spätere Bilder. Detailansichten enthalten Werte, Boni und Shard-Aufwertung, aber keine Einsatz- oder Auftragszustände. Fahrzeuge werden unter **Garage → Fahrzeug hinzufügen** eingesetzt.

## Gesammeltes Update: Expeditionen und Testwerkzeuge

Fünf Regionskarten führen zu je sieben Ortskarten und einer Endloskarte. Kunde, Fortschritt und Sperren stehen direkt auf den Karten. Unter **Einstellungen → Testwerkzeuge** lassen sich zusätzlich Expeditionspunkte, Überstundenpunkte und XP hinzufügen. Test-XP verwendet die normalen Levelbelohnungen. Dieses Paket enthält auch die vorbereitete Wiederholung von Verbindungsfehlern und die kontrastreicheren Angebotskarten. Die Vorschläge für neue Startangebote bleiben unverändert offen. Details zur Prüfung stehen in [TEST_REPORT.md](TEST_REPORT.md).
