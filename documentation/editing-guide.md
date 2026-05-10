# Editing Guide

Quick map of common tasks to files.

## Build + Templates

- Eleventy build config: `.eleventy.js`
- Homepage template: `src/index.njk`
- Category page template: `src/gallery/category.njk`
- Base layout: `src/_includes/layouts/base.njk`
- Shared site data: `src/_data/`

## Photo Categories (Homepage Cards + Category Pages)

- Category definitions (title/slug/local cover/Drive folder id): `assets/data/photo-categories.json`
- Homepage categories rendering + mobile carousel: `js/features/gallery.js`
- Category page runtime (Drive fetch/cache/lazy-load/lightbox): `js/features/category-gallery.js`
- Gallery styles: `styles/sections.css`
- Gallery mobile/responsive overrides: `styles/responsive.css`

## Videos + Mixed Gallery

- Home gallery media config: `assets/data/gallery.json`
- Shared media card helpers: `js/features/gallery/shared.js`
- Desktop video layout: `js/features/gallery/desktop.js`
- Mobile video/photo carousel behavior: `js/features/gallery/mobile.js`

## Home + UI + Animations

- App bootstrap: `js/core/main.js`
- Home video feature: `js/features/home-video.js`
- Theme + navbar + mobile nav: `js/features/ui/*.js`
- Animation modules: `js/features/animations/*.js`

## Drive Integration

- Env key wiring source: `src/_data/env.js`
- Required env var: `GALLERY_WEBAPP_URL`
- Folder IDs used per category from: `assets/data/photo-categories.json`
- Runtime fetch/cache/lazy logic: `js/features/category-gallery.js`

## Styling

- Base tokens + typography: `styles/base.css`
- Nav: `styles/nav.css`
- Hero: `styles/hero.css`
- Sections/components: `styles/sections.css`
- Footer: `styles/footer.css`
- Motion styles: `styles/animations.css`
- Responsive overrides: `styles/responsive.css`
- CSS manifest/import order: `styles.css`
