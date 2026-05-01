# Frenzy Photobooth

Marketing website for Frenzy Photobooth.

## Project Setup

This is a static HTML/CSS/JS project with no build step.

### Prerequisites

- `python3`

### Run Locally

```bash
python3 -m http.server 4173
```

Open:

- [http://127.0.0.1:4173](http://127.0.0.1:4173)

### Stop Server

Press `Ctrl + C` in the terminal.

## Where To Edit Videos

Both video areas are config-driven:

- Home video config: `assets/data/home-video.json`
- Event Energy slider config: `assets/data/videos.json`

Use local repo paths in JSON (recommended), for example:

- `assets/videos/home-loop.mp4`
- `assets/posters/home-loop.jpg`

## Documentation

Detailed architecture and module docs:

- [documentation/architecture.md](documentation/architecture.md)
- [documentation/README.md](documentation/README.md)
