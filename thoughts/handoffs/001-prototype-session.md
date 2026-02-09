# Handoff: Website Prototype Session 001

**Date**: 2026-02-08
**Branch**: `ai_revamp`
**Working directory**: `/Users/richpauloo/Documents/GitHub/rp_apero/prototypes/`

---

## What We Built

Three standalone HTML/CSS/JS prototypes for richpauloo.com, each representing a distinct visual direction for Rich's personal site. The site is a Hugo Apéro blog that Rich wants to transform from a grayscale academic site into a "digital garden" that communicates he's a builder and tinkerer.

All prototypes are self-contained in `prototypes/` and served via `python3 -m http.server` — no Hugo integration yet.

### File Inventory

| File | Lines | Role |
|------|-------|------|
| `shared.js` | 456 | Content data (16 blogs, 11 projects, 5 publications), SimplexNoise class, color interpolation (`lerpColor`, `colorToRgba`, `colorToHex`), growth stage config, content helpers |
| `shared.css` | ~480 | CSS custom properties, Google Font imports (Outfit, Inter, JetBrains Mono, Newsreader), dark/light theme variables, hero/card/badge/nav/filter/footer styles, control panel styles, responsive breakpoints |
| `a-voronoi.html` | 513 | Voronoi tessellation hero — **light theme** |
| `b-flowfield.html` | 579 | Perlin noise flow field hero — **dark theme** |
| `c-terrain.html` | 711 | SVG topographic contour hero — **light theme** |
| `index.html` | 182 | Landing page linking all three prototypes |

### CDN Dependencies

- `d3-delaunay@6` — used only by Prototype A (Voronoi)
- Google Fonts — Outfit, Inter, JetBrains Mono, Newsreader

---

## Decisions Made

### 1. Terrain color palette is the winner (so far)
Rich explicitly said the terrain contour colors "feel inviting." This palette — deep blue (`#1e3a5f`) → teal (`#2d8a7a`) → sage (`#8fbc8f`) → warm tan → cream (`#d4c5a9`) — was applied to the Voronoi prototype too. The weather-map palette (purple→red spectrum) is still available as an option.

### 2. Voronoi switched to light theme
Originally dark (`#0a0a1a`). Rich asked for a light color scheme. Now uses cream background (`#FAFAF5`) matching Prototype C. White seed-point dots were removed — Rich found them unnecessary.

### 3. Flow field needs coherent, slower motion
The original flow field was too chaotic. Changes made:
- **Noise scale**: `0.004` → `0.0015` (broader, more coherent patterns)
- **Angle multiplier**: removed `* 2` (was doubling angle range, causing chaos)
- **Particle speed**: `1-2 px/frame` → `0.4-0.8 px/frame`
- **Time evolution**: `0.002` → `0.0008` per frame
- **Trail alpha**: `0.04` → `0.03` (longer-lasting trails)

Rich wants the flow to feel like smooth wind/water currents, not turbulence.

### 4. Interactive control panels on all prototypes
Rich wants to understand how parameters affect aesthetics before committing to a direction. Every prototype now has a gear-icon toggle (top-right) that opens a glassmorphism panel with real-time sliders.

---

## Control Panel Parameters by Prototype

### A — Voronoi
- Point count (10-200), speed (0.05-2.0)
- Fill opacity, stroke opacity, stroke width
- Color oscillation speed multiplier
- Palette picker: Terrain, Weather, Ocean, Sunset, Forest
- Background color picker: Cream, Warm paper, Parchment, Dark navy, Deep navy, Midnight

### B — Flow Field
- Particle count (200-5000), speed, size, opacity, max age
- **Trail fade rate** (0.005-0.2) — the critical parameter. Lower = trails accumulate and saturate; higher = trails fade quickly. "Clear canvas" button resets.
- Noise scale (flow geometry), evolution speed, turbulence multiplier
- Mouse repulsion radius and force
- Palette picker: Weather, Terrain, Ocean, Fire, Mono

### C — Terrain Contours
- Animation speed (0 = static) + Pause/Resume + Reset time
- Noise scale (coarse blobs vs fine detail)
- Number of contour levels (3-30)
- Line width, grid resolution (Coarse 40x30 → Ultra 160x120)
- Second noise octave strength
- Mouse peak strength and radius
- Line opacity min/max range

---

## Content Data

All garden items are in `shared.js` as the `gardenItems` array. Data was scraped from the actual Hugo `content/` directory:

- **16 blog posts** (2017-2023): R, water science, Docker, automation, data viz
- **11 projects** (2016-2025): calwaterquality.com, r4wrds, sensor networks, MTA accessibility, etc.
- **5 key publications** (2020-2023): groundwater, hydrology, peer-reviewed journals

Each item has: `type`, `title`, `date`, `description`, `tags[]`, `stage` (seedling/budding/evergreen), `slug`.

Growth stages were assigned based on maturity/importance:
- **Seedling** (cyan `#06B6D4`): newest/experimental (e.g., MTA project)
- **Budding** (yellow `#EAB308`): mid-development tutorials and tools
- **Evergreen** (green `#10B981`): established, high-impact work

---

## What Rich Hasn't Decided Yet

1. **Which prototype direction to go with** — he's exploring all three via the control panels. The terrain aesthetic is favored for color, but the flow field and voronoi are still in play as hero animations.

2. **Dark vs. light theme** — Voronoi and Terrain are light; Flow Field is dark. The Voronoi has a background switcher so Rich can toggle between light and dark to compare.

3. **Typography** — Prototype C uses Newsreader (serif) for headings; A and B use Outfit (sans). Rich hasn't commented on font preference.

4. **Garden layout** — Prototype B uses a vertical timeline; A and C use card grids. C has bento-box layout (wide cards for evergreen items) and dual filtering (type + stage). Rich hasn't commented on layout preference.

5. **The 林 kanji element** — only in Prototype B. Rich hasn't confirmed whether he wants it in the final design.

---

## Lessons Learned

1. **Simplex noise scale is the most important flow field parameter.** Too high (0.004+) creates chaotic, turbulent-looking fields. Around 0.001-0.002 produces smooth, coherent currents that feel atmospheric.

2. **Trail fade rate is unintuitive.** Low values (0.01-0.03) create beautiful long trails but eventually saturate the canvas to a muddy color. A "clear canvas" button is essential for experimentation. The ideal production value is probably 0.02-0.04.

3. **The terrain palette works on both dark and light backgrounds** — it's versatile. The weather palette (purple→red) is more dramatic but harder to make work on light backgrounds.

4. **Marching squares for SVG contours is performant enough** at 80x60 grid resolution on every frame. Fine (120x90) is still smooth. Ultra (160x120) can dip below 30fps on some machines.

5. **Control panels are invaluable for design exploration.** Building them added ~30% to each file's size but dramatically accelerates the feedback loop. Consider keeping them in the prototype phase and stripping them for production.

---

## Architecture Notes for Hugo Integration (Future)

When a direction is chosen, the integration path is:

1. Override Hugo homepage: `layouts/index.html`
2. Hero JS → `assets/js/hero.js` (extract from prototype)
3. Shared CSS variables → `assets/theme/` or extend existing Hugo theme
4. Content front matter: add `stage` and `lastTended` fields to blog/project markdown files
5. `config.toml`: update fonts, colors, navigation structure
6. The `gardenItems` array in shared.js would be replaced by Hugo's `.Pages` template data

SimplexNoise can be vendored as a standalone `assets/js/simplex-noise.js`. d3-delaunay (if Voronoi is chosen) can stay as a CDN import or be vendored.

---

## How to Run

```bash
cd /Users/richpauloo/Documents/GitHub/rp_apero/prototypes
python3 -m http.server 8000
# Open http://localhost:8000
```

If port 8000 is in use, try another port or find a free one:
```bash
python3 -c "import socket; s=socket.socket(); s.bind(('',0)); print(s.getsockname()[1]); s.close()"
```

---

## Next Steps

1. **Rich explores** the control panels and reports back on preferred values / direction
2. **Narrow to one prototype** (or a hybrid — e.g., flow field hero with terrain colors and card grid layout)
3. **Lock in parameter values** from the control panel exploration
4. **Strip control panels** and finalize the prototype HTML
5. **Begin Hugo integration** — override layouts, move JS/CSS to assets, wire up content data from Hugo templates
