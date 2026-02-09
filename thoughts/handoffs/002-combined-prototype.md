# Handoff: Combined Prototype Session 002

**Date**: 2026-02-09
**Branch**: `ai_revamp`
**Working directory**: `/Users/richpauloo/Documents/GitHub/rp_apero/prototypes/`

---

## What Changed Since Session 001

Rich explored the three standalone prototypes (Voronoi, Flow Field, Terrain Contours) and made decisions:

1. **Terrain contours dropped** — not working out visually
2. **Flow field + Voronoi combined** into a single page with a toggle
3. **林 kanji** restored as the nav brand (replacing "Rich Pauloo")
4. **Subtitle rewritten**: "Thinker, tea drinker, tinkerer." / Meta: "WATER · DATA · CODE"
5. **Settings gear** moved into the nav bar with a dedicated separator, not floating

---

## File Inventory

| File | Role | Status |
|------|------|--------|
| `prototype.html` | **Active prototype** — combined flow field + voronoi with toggle | New |
| `shared.js` | Content data, SimplexNoise, color utilities | Unchanged |
| `shared.css` | Shared styles, themes, control panel styles | Unchanged |
| `index.html` | Landing page — updated to feature combined prototype | Updated |
| `a-voronoi.html` | Original standalone voronoi | Kept for reference |
| `b-flowfield.html` | Original standalone flow field | Kept for reference |
| `c-terrain.html` | Terrain contours | Deprecated (can delete) |

---

## Architecture: prototype.html

### Two-Canvas Toggle

- Two `<canvas>` elements in the hero section, one hidden at a time
- `activeMode` variable tracks `'flow'` or `'voronoi'`
- Animation loops check `flowAnimating` / `voronoiAnimating` flags — only one runs at a time
- Voronoi is **lazily initialized** on first switch (canvas needs `display:block` for `clientWidth`)
- Resize flags (`flowNeedsResize`, `voronoiNeedsResize`) handle window resize while the other mode is active

### Nav Layout (three-part flex)

```
[林]          [Flow Field | Voronoi]          [Garden] [About] | [⚙]
```

- Brand (林) on the left
- Mode toggle (segmented pill control) centered
- Nav links + gear icon on the right, gear separated by a subtle vertical border
- Gear icon is `position: static` inside nav (overrides shared.css's `position: fixed`)
- Nav z-index raised to 200 so it layers above the control panel (z-index 199)

### Control Panel

- Single `<div class="ctrl-panel">` with two inner divs (`#flowControls`, `#voronoiControls`)
- Only one inner div visible at a time, toggled with mode switch
- Panel open/close state persists across mode switches

### Theme Switching

- Flow field: `body.theme-dark` with custom overrides (`--bg-primary: #050816`)
- Voronoi: `body.theme-light` (cream `#FAFAF5`)
- Hero background set via inline style on mode switch
- All CSS variables (text, cards, borders) swap automatically via theme classes

---

## Locked-In Parameter Defaults

### Flow Field

Rich tuned these values interactively and confirmed them:

```json
{
  "particleCount": 3100,
  "speed": 1.05,
  "size": 1.0,
  "opacity": 0.8,
  "maxLife": 2000,
  "trailAlpha": 0.08,
  "noiseScale": 0.0038,
  "timeSpeed": 0.0004,
  "turbulence": 0.5,
  "noiseDetail": 0.5,
  "windStrength": 2.0,
  "windDirection": 0,
  "mouseRadius": 120,
  "mouseForce": 4,
  "palette": "weather",
  "colorBy": "position"
}
```

Key characteristics of this configuration:
- **High particle count** (3100) with **long max age** (2000) creates dense, flowing streams
- **Wind at 2.0** pushes everything rightward, creating a strong directional current
- **Low turbulence** (0.5) with **moderate detail** (0.5) = smooth macro flow with fine-scale eddies
- **Fade rate 0.08** = trails visible but not overwhelming
- **Dots only** — line mode was removed (looked the same at these settings)

### Voronoi

```json
{
  "count": 72,
  "speed": 0.6,
  "fillOpacity": 0.4,
  "strokeOpacity": 0.9,
  "strokeWidth": 1.2,
  "colorSpeedMul": 1.4,
  "palette": "terrain"
}
```

Key characteristics:
- **Strong strokes** (opacity 0.9, width 1.2) with **subtle fills** (0.4) — wireframe-forward look
- **Terrain palette** — blues, teals, greens, tans
- **Background hardcoded to cream** (`#FAFAF5`) — bg color control removed
- **Faster color cycling** (1.4x) for more lively color shifts

---

## Controls Available

### Flow Field Controls

| Group | Control | Range | Default |
|-------|---------|-------|---------|
| Particles | Count | 200–5000 | 3100 |
| | Speed | 0.1–3 | 1.05 |
| | Size | 0.3–4 | 1.0 |
| | Opacity | 0.1–1 | 0.8 |
| | Max age | 100–2000 | 2000 |
| Trails | Fade rate | 0.005–0.2 | 0.08 |
| | Clear canvas | button | — |
| Flow geometry | Scale | 0.0003–0.008 | 0.0038 |
| | Evolution | 0–0.005 | 0.0004 |
| | Turbulence | 0.5–4 | 0.5 |
| | Detail | 0–1 | 0.5 |
| | Wind | 0–2 | 2.0 |
| | Wind dir | 0–360° | 0° |
| Mouse | Radius | 20–400 | 120 |
| | Force | 0–20 | 4.0 |
| Color | Palette | Weather/Terrain/Ocean/Fire/Mono | Weather |
| | Color by | Position/Flow angle/Speed/Age | Position |

### Voronoi Controls

| Group | Control | Range | Default |
|-------|---------|-------|---------|
| Points | Count | 10–200 | 72 |
| | Speed | 0.05–2 | 0.6 |
| Appearance | Fill opacity | 0–1 | 0.4 |
| | Stroke opacity | 0–1 | 0.9 |
| | Stroke width | 0–4 | 1.2 |
| | Color speed | 0.1–5x | 1.4x |
| | Cell inset | 0–15 | 0 |
| | Shadow | 0–20 | 0 |
| | Opacity var | 0–0.8 | 0 |
| Palette | Colors | Terrain/Weather/Ocean/Sunset/Forest | Terrain |

### Removed Controls (vs session 001)

- **Flow field trail mode** (dots/lines) — removed, dots only
- **Flow field line width** — removed with line mode
- **Voronoi background color** — hardcoded to cream

### New Voronoi Controls (added this session)

- **Cell inset** — shrinks each polygon toward its centroid, creating visible gaps between cells
- **Shadow** — canvas `shadowBlur` on cell fills, creates depth illusion
- **Opacity variation** — per-cell random opacity multiplier, creates layered depth

---

## Design Decisions Made

1. **林 as brand** — the kanji "forest/grove" (two trees) replaces "Rich Pauloo" in the nav
2. **"Thinker, tea drinker, tinkerer."** — the hero subtitle. Alternatives considered:
   - "Water, data, code, and too much tea."
   - "Thinker · builder · tea enthusiast"
   - "Thinking slowly about water, data, and what to build next."
3. **"WATER · DATA · CODE"** — the hero meta line (was "BUILDER // TINKERER // DATA SCIENTIST")
4. **Card grid layout** (not timeline) for the garden section
5. **Two nav links only**: Garden, About (simplified from Garden/Projects/Publications/About)

---

## What Rich Hasn't Decided Yet

1. **Final subtitle wording** — "Thinker, tea drinker, tinkerer." is the current draft but may evolve
2. **Voronoi polygon styling** — new controls (inset, shadow, opacity variation) haven't been explored yet
3. **Color by mode** for flow field — Position is default, but Angle/Speed/Age offer different aesthetics
4. **Typography** — no explicit font preference stated (currently Outfit headings, Inter body, JetBrains Mono mono)
5. **Garden section design** — card grid is functional but unstyled beyond basics
6. **Hugo integration** — when to begin moving from prototype to actual site
7. **Whether both modes ship** or if one is chosen as the final hero

---

## Lessons Learned

1. **Dots and lines look identical** at high fade rates and moderate speeds — the line segment from previous to current position is so short it's indistinguishable from a dot. Not worth the UI complexity.

2. **Wind is a powerful parameter.** At strength 2.0, it dominates the flow direction and creates a strong rightward current that feels like atmospheric wind. This was a great addition.

3. **Noise detail (second octave)** at 0.5 adds subtle complexity without chaos. It creates visible eddies within the larger flow streams — the "detail within detail" effect Rich wanted.

4. **Voronoi stroke-forward styling** (high stroke opacity + moderate fill) looks more sophisticated than fill-heavy styles. The wireframe aesthetic on cream feels like a quality data visualization.

5. **Background color control was unnecessary** for Voronoi — cream is clearly the right choice. Removing it simplified the UI.

6. **Lazy initialization** for the voronoi canvas is essential — `clientWidth` returns 0 when `display: none`, so you can't set up the canvas until it's actually visible.

---

## How to Run

```bash
cd /Users/richpauloo/Documents/GitHub/rp_apero/prototypes
python3 -m http.server
# Open http://localhost:{port}/prototype.html
```

Or find a free port:
```bash
python3 -c "import socket; s=socket.socket(); s.bind(('',0)); print(s.getsockname()[1]); s.close()"
```

---

## Next Steps

1. **Rich explores** the new Voronoi appearance controls (cell inset, shadow, opacity variation)
2. **Finalize subtitle** wording
3. **Decide: both modes or one?** — does the site ship with a toggle, or does Rich pick one hero?
4. **Garden section polish** — card styling, hover effects, layout refinements
5. **Mobile responsiveness** — test and refine the toggle/nav on small screens
6. **Begin Hugo integration** — override `layouts/index.html`, move JS/CSS to `assets/`, wire up content from Hugo templates
