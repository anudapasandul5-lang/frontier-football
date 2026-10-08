# Frontier Football: promo mockups

Assets for the Envato Elements "Creative Website Promo" template (or any video edit).
Everything is 1920x1080 or larger, and the plates are 3840x2160.

## Plates (Pitch Cartography series)

These follow the design philosophy in `design-philosophy-pitch-cartography.md`: a teal survey field, bone hairlines, and yellow used once.

| File | What it shows |
| --- | --- |
| `plates/plate-01.jpg` | MacBook and iPhone with the home page, plus dimension callouts |
| `plates/plate-02.jpg` | 3D stack of browser windows: Events, Gallery, Community |
| `plates/plate-03.jpg` | Three iPhones: Who We Are, Events, Collaborate |
| `plates/plate-0X-transparent.png` | Devices only, on a transparent background, for layering over footage |
| `title-plate-pitch-cartography.png` | Title or end card: a 4 × 4 grid of pitch observations with SZN 5 in yellow |

## Raw screens (for the template's screen placeholders)

- `home-scroll-1080p.mp4`: a 1920x1080, 30fps recording of the home page scrolling top to bottom. Use it in the laptop or browser screen slot.
- `desktop-16x10/*.jpg`: 1440x900 @2x, the above-the-fold view of every page. Use these for laptop slots.
- `desktop-1080p/*-hero.jpg`: 1920x1080 views of every page. Use these for 16:9 monitor or browser slots.
- `phone/*-hero.jpg`: 390x844 @3x views of every page. Use these for phone slots.
- `full-page/*.jpg`: full-length captures for scroll-animation slots.

## Regenerating

Run `npm run build && npm run serve`, then run the scripts in `source/` from a folder that holds an `out/` directory of captures:

- `cap1610.mjs` captures the screens.
- `render.mjs` renders the plates from `plates.html`.
- `make-title-plate.py` draws the title card.
