# Frenzy Photobooth

Marketing website for Frenzy Photobooth.

## Project Setup

This project uses **Eleventy (11ty)** to build static pages from templates and data.

### Prerequisites

- `node` + `npm`

### Run Locally

```bash
npm install
export GALLERY_WEBAPP_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
npm run dev
```

Open:

- [http://localhost:8081](http://localhost:8081)

### Stop Server

Press `Ctrl + C` in the terminal.

## Build

```bash
npm run build
```

Output is generated in `_site/`.
This build runs with `ELEVENTY_ENV=production` so internal URLs are generated for the GitHub Pages project path.

### Build targets

- GitHub Pages project URL (`...github.io/frenzy-photobooth`):
  ```bash
  npm run build:gh-pages
  ```
- Custom domain (`www.frenzyphotobooth.com`):
  ```bash
  npm run build:domain
  ```

## Drive-Powered Photo Gallery

Photo categories are configured in:

- `assets/data/photo-categories.json`

Each category has:

- local thumbnail (`coverImage`) for homepage cards
- Drive subfolder ID (`driveFolderId`) for dynamic gallery images

Category pages:

- `/gallery/birthday/`
- `/gallery/corporate/`
- `/gallery/graduation/`
- `/gallery/marriage/`

Apps Script / Drive requirements:

- Apps Script Web App deployed with:
  - Execute as: `Me`
  - Access: `Anyone`
- Script account must authorize Drive access (`DriveApp`) once via test run.
- Shared folders/files must be accessible to `Anyone with the link` (Viewer).

Runtime behavior:

- category pages fetch image metadata from Apps Script Web App when configured
- thumbnail images are lazy loaded with retry backoff
- file metadata is cached in browser `localStorage` for 30 minutes

## Documentation

Detailed architecture and module docs:

- [documentation/setup-guide.md](documentation/setup-guide.md)
- [documentation/architecture.md](documentation/architecture.md)
- [documentation/README.md](documentation/README.md)
- [documentation/apps-script-gallery-api.md](documentation/apps-script-gallery-api.md)
- [documentation/apps-script-email-workflow.md](documentation/apps-script-email-workflow.md)
