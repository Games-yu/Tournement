# Tournement

> Eine schnelle, visuelle Turnier- und Team-Punkte-Zentrale fuer Events, Freundesrunden und Wettbewerbe.

## Was ist Tournement?

Tournement ist eine browserbasierte Event-Oberflaeche fuer faire Auslosungen, manuelle Gewinnerauswahl und Live-Teamwertung. Alles laeuft direkt im Browser, ohne Framework und ohne Build-Schritt.

## Features

### Turnierbaum

- Zufallsauslosung fuer jede neue Runde
- Echte 1-gegen-1-Paarungen, soweit die Spielerzahl es erlaubt
- Freilose bei ungeraden oder unpassenden Spielerzahlen
- Gewinner per Klick auswaehlen
- Champion-Anzeige mit dauerhaftem Titel und Siegername
- Spieler vor und waehrend des Turniers entfernen
- Zoom per Mausrad und Buttons
- Baum horizontal und vertikal verschieben
- Dynamische Verbindungslinien, die an den Matchboxen bleiben
- Turnier jederzeit sauber beenden und zur Zentrale zurueckkehren

### Team-Punkte

- 2 oder 4 Teams
- Spieler vor dem Start hinzufuegen und entfernen
- Spieler werden beim Start gleichmaessig verteilt
- Spieler jederzeit anderen Teams zuweisen
- Teamnamen bearbeiten
- Punkte mit `-1`, `+1` und `+5` veraendern
- Teamrunde beenden und alle Daten zuruecksetzen
- Eigener Scrollbereich fuer grosse Spielerkader

## Schnellstart

1. Repository herunterladen oder klonen.
2. `index.html` im Browser oeffnen.
3. Einen Bereich auswaehlen.
4. Spieler hinzufuegen.
5. Turnierbaum oder Teams starten.

Alternativ funktioniert das Projekt direkt mit einem beliebigen lokalen Static-Server.

## GitHub Pages

Fuer eine oeffentliche Version auf GitHub:

1. Repository oeffnen.
2. `Settings` → `Pages` aufrufen.
3. `Deploy from a branch` auswaehlen.
4. Branch `main` und Ordner `/root` setzen.
5. Speichern und die erzeugte Pages-Adresse oeffnen.

## Projektstruktur

```text
index.html   Hauptoberflaeche und Ansichten
script.js    Turnier-, Team- und Interaktionslogik
style.css    Layout, Animationen und responsive Darstellung
```

## Technik

- HTML5
- CSS3
- Vanilla JavaScript
- SVG fuer dynamische Turnierlinien
- Keine Build-Tools oder Abhaengigkeiten

## Lizenz

Dieses Projekt ist fuer private und nichtkommerzielle Event-Nutzung gedacht.
