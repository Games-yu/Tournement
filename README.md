# Tournement

> A fast, visual tournament and team-scoring hub for events, friendly gatherings, and competitions.

## What is Tournement?

Tournement is a browser-based event interface for fair bracket generation, manual winner selection, and live team scoring. Everything runs directly in the browser—no frameworks, no build steps required.

## Features

### Tournament Bracket

- Random draw for each new round
- True 1-on-1 matchups (subject to player count)
- Byes for odd or incompatible player counts
- Select winners with a single click
- Champion display showing the title and winner's name
- Remove players before or during the tournament
- Zoom using the mouse wheel or buttons
- Pan the bracket horizontally and vertically
- Dynamic connecting lines that stay anchored to match boxes
- Cleanly end the tournament and return to the main hub at any time

### Team Scoring

- 2 or 4 teams
- Add and remove players before starting
- Players distributed evenly upon startup
- Reassign players to different teams at any time
- Edit team names
- Adjust scores by `-1`, `+1`, or `+5`
- End the team round and reset all data
- Dedicated scroll area for large player rosters

## Quick Start

1. Download or clone the repository.
2. Open `index.html` in your browser.
3. Select a mode.
4. Add players.
5. Start the tournament bracket or team mode.

Alternatively, the project works directly with any local static server.

## GitHub Pages

To host a public version on GitHub:

1. Open the repository.
2. Go to `Settings` → `Pages`.
3. Select `Deploy from a branch`.
4. Set the branch to `main` and the folder to `/root`. 5. Save and open the generated Pages URL.

## Project Structure

```text
index.html   Main interface and views
script.js    Tournament, team, and interaction logic
style.css    Layout, animations, and responsive design
```

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- SVG for dynamic tournament brackets
- No build tools or dependencies

## License

This project is intended for private and non-commercial event use.
