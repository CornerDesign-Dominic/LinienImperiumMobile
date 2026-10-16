# LinienImperium Mobile

Vorbereitung der mobilen Version von LinienImperium. Diese Datei bestätigt den Schreibzugriff auf das Repository; die App-Umsetzung wurde noch nicht begonnen.

## Vereinbarter Umfang

- Android zuerst als einfach installierbare Testversion ohne laufenden PC; iOS im gleichen Projekt vorbereiten.
- React Native mit Expo und EAS als geplanter technischer Aufbau.
- Alle zum Beginn der Umsetzung vorhandenen Webmechaniken übernehmen. Besprochene, noch nicht implementierte Ideen sind nicht Teil der Übernahme.
- Hochformat, ausschließlich dunkles und sachliches Theme; zunächst keine Bilder oder Animationen.
- Startseite nach der Nutzerskizze: feste Kopfzeile, scrollbarer Inhalt und feste untere Navigation.
- Untere Navigation in dieser Reihenfolge: Home, Flotte, Garage, Einzelaufträge, Großaufträge.
- Firebase für Benutzerzuordnung und Datenhaltung, mit Internetanbindung.

## Bekannte Angaben

- Webquelle: CornerDesign-Dominic/LinienImperium
- Mobile-Ziel: CornerDesign-Dominic/LinienImperiumMobile
- Expo-Konto laut bereitgestelltem Screenshot: cornerdesign
- Firebase-Projekt-ID laut bereitgestelltem Screenshot: linienimperium

## Noch einzurichten oder zu bestätigen

- Firebase-App-Konfiguration und Datenbank.
- Authentifizierung: anonymer Gaststart vorgeschlagen, E-Mail/Passwort für dauerhafte Konten; keine weiteren Anbieter vorerst.
- Autorisierter Zugriff für Firebase-Deployments und Expo-Builds/Updates. Repository-Zugriff und App-Konfiguration allein ersetzen diese Zugänge nicht.
- Eigenes Expo/EAS-Projekt für das Spiel und Android-Testbuild.

Keine Passwörter, Zugriffstokens oder privaten Dienstkontoschlüssel in diesem Repository ablegen.
