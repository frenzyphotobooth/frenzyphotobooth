# Frontend Architecture

```text
js/core/main.js (entry point — top-level init calls after DOM ready)
├── js/lib/config-utils.js
├── js/lib/youtube-utils.js
├── js/features/home-video.js
│   └── assets/data/home-video.json
├── js/features/ui.js
│   └── js/features/ui/
│       ├── theme.js
│       ├── navbar-scroll.js
│       └── mobile-menu.js
├── js/features/animations.js
│   └── js/features/animations/
│       ├── counters.js
│       ├── scroll-reveal.js
│       ├── particles.js
│       └── smooth-scroll.js
├── js/features/testimonials.js
│   └── js/lib/slider.js
├── js/features/video-showcase.js
│   ├── assets/data/videos.json
│   └── js/lib/slider.js
└── js/features/booking-form.js
    └── js/features/contact/
        ├── form-validation.js (validation rules only)
        ├── form-ui.js (status, button, field UI state)
        └── form-submission.js (payload mapping + network call)
            └── assets/data/contact-form.json
```

## Module Boundaries

- `js/core/main.js`: bootstrap only, no feature logic.
- `js/lib/slider.js`: reusable slider behavior (dots/arrows/autoplay/media-pause + off-screen media stop).
- `js/lib/config-utils.js`: shared config validators (strings, source lists, field maps).
- `js/lib/youtube-utils.js`: shared YouTube embed URL + iframe creation helpers.
- `js/features/*`: one feature per module; each owns its own DOM selectors and events.
- `assets/data/*.json`: content/config inputs for video and form integrations.
- `assets/videos/` and `assets/posters/`: preferred locations for local media assets referenced by JSON configs.

## Script Load Order

1. `js/lib/slider.js`
2. `js/lib/config-utils.js`
3. `js/lib/youtube-utils.js`
4. `js/features/home-video.js`
5. `js/features/ui/theme.js`
6. `js/features/ui/navbar-scroll.js`
7. `js/features/ui/mobile-menu.js`
8. `js/features/ui.js`
9. `js/features/animations/counters.js`
10. `js/features/animations/scroll-reveal.js`
11. `js/features/animations/particles.js`
12. `js/features/animations/smooth-scroll.js`
13. `js/features/animations.js`
14. `js/features/testimonials.js`
15. `js/features/video-showcase.js`
16. `js/features/contact/form-validation.js`
17. `js/features/contact/form-ui.js`
18. `js/features/contact/form-submission.js`
19. `js/features/booking-form.js`
20. `js/core/main.js`

## Notes

- Form endpoint/mappings are configurable in `assets/data/contact-form.json`.
- Replace `YOUR_FORM_ID` and `entry.XXXXX*` in that config to route submissions to your real Google Form.
- `js/core/main.js` now uses guarded init calls, so missing modules do not crash app bootstrap.
- Feature init methods are idempotent (safe against duplicate listener registration).
- `js/lib/slider.js` supports safe re-init by destroying previous instance on the same track.
- Home hero media supports two config modes in `assets/data/home-video.json`:
  - YouTube mode: `{ "youtubeId": "VIDEO_ID" }`
  - File mode: `{ "poster": "...", "sources": [{ "src": "...", "type": "video/mp4" }] }`
- Video showcase cards in `assets/data/videos.json` support:
  - YouTube card: `{ "title": "...", "description": "...", "youtubeId": "VIDEO_ID" }`
  - File card: `{ "title": "...", "description": "...", "poster": "...", "sources": [...] }`
- Showcase YouTube embeds use `enablejsapi=1`; slider calls `pauseVideo`/`stopVideo` on hidden cards to prevent background audio after slide change.
