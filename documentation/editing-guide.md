# Editing Guide

Quick map of common tasks to the files you should edit.

## Core Entry + Bootstrap

- App bootstrap/init sequence: `js/core/main.js`
- Script include order: `index.html` (bottom script tags)

## Theme + Header

- Theme toggle behavior/localStorage/default theme: `js/features/ui/theme.js`
- Navbar scroll behavior (`.navbar.scrolled`): `js/features/ui/navbar-scroll.js`
- Mobile menu open/close behavior: `js/features/ui/mobile-menu.js`
- Navbar and header visuals: `styles/nav.css`
- Light-mode navbar readability overrides: `styles/responsive.css`

## Hero Section

- Hero markup/content: `index.html` (`#home` section)
- Home background video logic (YouTube vs local): `js/features/home-video.js`
- Home video data source: `assets/data/home-video.json`
- Hero visual styling (video tint/overlay/spacing): `styles/hero.css`

## Event Energy On Camera (Video Showcase)

- Section markup: `index.html` (`#video-showcase`)
- Card rendering + YouTube embed params: `js/features/video-showcase.js`
- Showcase data/config: `assets/data/videos.json`
- Slider/controls behavior (shared): `js/lib/slider.js`
- Showcase styles: `styles/sections.css`

## Testimonials Slider

- Section markup/cards: `index.html` (`#testimonials`)
- Testimonials feature init: `js/features/testimonials.js`
- Shared slider behavior: `js/lib/slider.js`
- Testimonials styles: `styles/sections.css`

## Booking + Contact Form

- Booking layout/content: `index.html` (`#booking`)
- Booking orchestration module: `js/features/booking-form.js`
- Validation rules: `js/features/contact/form-validation.js`
- Form UI state/messages: `js/features/contact/form-ui.js`
- Submission mapping/network call: `js/features/contact/form-submission.js`
- External form endpoint/field IDs: `assets/data/contact-form.json`
- Booking/form styles: `styles/sections.css`

## Animations

- Animation feature aggregator: `js/features/animations.js`
- Counters: `js/features/animations/counters.js`
- Scroll reveal: `js/features/animations/scroll-reveal.js`
- Particles: `js/features/animations/particles.js`
- Smooth anchor scroll: `js/features/animations/smooth-scroll.js`
- Animation CSS: `styles/animations.css`

## Global Styling

- Design tokens/reset/base text styles: `styles/base.css`
- Section and component styles: `styles/sections.css`
- Footer styles: `styles/footer.css`
- Responsive breakpoints and final overrides: `styles/responsive.css`
- CSS import manifest (load order): `styles.css`

## Media and Assets

- JSON content/config files: `assets/data/`
- Local video files (recommended): `assets/videos/`
- Poster/thumbnail images (recommended): `assets/posters/`
- Brand logo image: `logo.png`

## Documentation

- Architecture docs: `documentation/architecture.md`
- Contributor map (this file): `documentation/editing-guide.md`
