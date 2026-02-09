# Handoff: Prototype → Hugo Migration

**Date:** 2025-02-09
**Branch:** `ai_revamp`
**Build status:** Passing (79 pages, ~4.4s)

## What Was Done

Migrated the interactive prototype (`prototypes/prototype.html`) into the production Hugo site. The hugo-apero theme is fully bypassed — all rendering comes from custom layouts.

### Structure

```
/                → Homepage (hero visualization + garden cards)
/research/       → Publications (rich markdown with images)
/about/          → Bio, avatar, CV download, social links
/project/{slug}/ → Individual project pages
/mta/            → Standalone HTML app (served from static/)
/mtanb/          → Standalone HTML app (served from static/)
```

### Key files created
- `static/css/site.css` — All styles
- `static/js/` — simplex-noise, color-utils, flow-field, voronoi, mode-toggle, garden-cards
- `layouts/` — baseof, index, partials (head, nav, footer, hero, controls, card, scripts), about/list, research/list+single, project/single
- `data/publications.yaml` — 13 publications for garden cards
- `layouts/shortcodes/` — tweet, gist, here (compatibility stubs)

### Key files modified
- `config.toml` — Menu (Garden/Research/About), theme disabled, pagination fix, description updated
- `netlify.toml` — Hugo version → 0.139.4
- `content/blog/_index.md` — Archived (`build: render: never`)
- `content/collection/_index.md` — Archived (cascaded)
- `content/archive/`, `elements/`, `form/` — Suppressed via `_index.md`

### Content changes
- Removed: lcsn (low-cost sensor networks), tulare-tds
- Added: wsb (Water System Boundaries → GitHub)
- Edited: rf (interpretable random forests) — rewrote narrative for clarity
- textme: now links directly to GitHub via `external_link`
- Standalone HTML apps (mta, mtanb, cawdc-2018, landslide) moved from `content/` to `static/` to avoid Hugo processing 100MB+ of bundled HTML

### How the garden works
Hugo renders project cards at build time from `content/project/` and `data/publications.yaml`, sorted by date desc. JS only handles filter button clicks (All / Project / Publication). Projects with `external_link` or a `globe`/`Website`/`Dashboard` link open externally; others go to their Hugo page.

## What's Next

### Must do before merge
- [ ] **Test Netlify deploy preview** — push `ai_revamp`, verify preview URL builds
- [ ] **Favicon** — `static/img/lim.png` is referenced but missing. Create a 林 favicon or swap to `avatar.jpg`
- [ ] **Mobile nav** — nav links are hidden at 768px but there's no hamburger menu. Add one or accept the minimal mobile nav (brand + toggle + gear)
- [ ] **404 page** — currently renders with default layout, could use a styled template

### Should do
- [ ] **Research page images** — verify all `content/research/img/*` render correctly on the new layout
- [ ] **About page avatar** — 6.6MB PNG is huge. Compress or convert to WebP
- [ ] **Card external link indicators** — no visual cue that a card opens in a new tab. Consider adding an arrow icon
- [ ] **Theme persistence edge case** — on first visit to an inner page (no localStorage), defaults to dark. Fine for flow field fans, but consider if light should be default
- [ ] **CV link** — currently only on About page. Was previously a top-level nav item. Decide if that's intentional

### Nice to have
- [ ] **Blog revival** — blog content is archived, not deleted. Can bring it back as a section if desired
- [ ] **SEO** — Open Graph tags, canonical URLs, structured data are not in the custom `head.html`
- [ ] **Analytics** — `googleAnalytics` is empty in config. Re-enable if needed
- [ ] **Performance** — flow field runs 3100 particles on page load. Consider lazy-starting after hero is visible, or reducing particle count on mobile
- [ ] **Netlify redirects** — old URLs like `/blog/*` and `/contact/` will 404. Add `_redirects` file if traffic matters
