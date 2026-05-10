# Frontend Architecture

## Build + Templating

- Static generation: **Eleventy (11ty)**
- Template source: `src/`
- Generated output: `_site/`
- Build config: `.eleventy.js`
- Shared site data: `src/_data/`

## Key Runtime Entry Points

- Global bootstrap: `js/core/main.js`
- Home/gallery tab behavior: `js/features/gallery.js`
- Category page gallery runtime: `js/features/category-gallery.js`
- Home video: `js/features/home-video.js`
- UI features: `js/features/ui/*.js`
- Animations: `js/features/animations/*.js`

## Gallery Architecture

### Homepage gallery (`/#gallery`)

- Template: `src/index.njk`
- Data source: `assets/data/photo-categories.json`
- Photo tab:
  - Desktop: category cards grid
  - Mobile: one-card carousel with autoplay/swipe
- Video tab:
  - Uses existing video gallery modules and `assets/data/gallery.json`

### Category pages (`/gallery/<slug>/`)

- Template: `src/gallery/category.njk`
- Runtime module: `js/features/category-gallery.js`
- Data source:
  - category folder id from `assets/data/photo-categories.json`
  - primary source: Apps Script Web App (`GALLERY_WEBAPP_URL`)
  - no frontend secret required in current mode
- Behavior:
  - fetches file metadata from Apps Script endpoint for the current category
  - renders small thumbnails first, lazy-loads the rest via `IntersectionObserver`
  - retries failed thumbnail loads with jittered backoff
  - opens full-size image in modal/lightbox
  - caches file metadata in `localStorage` for 30 minutes

## Module Boundaries

- `js/core/main.js`: app bootstrap and guarded feature init calls.
- `js/features/gallery.js`: homepage media tabs and photo-category rendering.
- `js/features/category-gallery.js`: category-page Drive fetch/cache/lazy-load/lightbox/back-nav.
- `js/features/gallery/shared.js`: shared media card and helper utilities.
- `js/features/gallery/desktop.js`: desktop video gallery layouts.
- `js/features/gallery/mobile.js`: mobile photo/video carousel behavior.
- `assets/data/photo-categories.json`: category metadata + Drive folder mapping.
- `assets/data/gallery.json`: mixed home gallery media (photos/videos).

## Operational Notes

- If endpoint returns permission errors, verify:
  - Apps Script deployment executes as owner account
  - Drive permissions were granted in Apps Script auth flow
  - each category folder and files are shared to `Anyone with the link`
- If thumbnail CDN returns `429`, reduce parallel thumbnail loads (already partially mitigated with lazy/deferred loading).
