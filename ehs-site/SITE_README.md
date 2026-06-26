# EHS — Exoplanet Habitability Score (Interactive Site)

A cinematic, scroll-driven research showcase for the Exoplanet Habitability Score
project, built with React, React Three Fiber, GSAP, and Recharts.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Building for production

```bash
npm run build
npm run preview   # serve the production build locally to verify
```

Output goes to `dist/` — deploy that folder to Vercel, Netlify, GitHub Pages, or any
static host.

## Restoring web fonts

This build ships with system-font fallbacks (`Space Grotesk` → `Segoe UI`/system-ui,
etc.) because the sandbox this was built in couldn't reach Google Fonts' CDN. For the
full intended typography once you deploy somewhere with internet access, add this line
to the very top of `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..600&display=swap');
```

## Replacing sample data with your real dataset

All planet data lives in `src/data/planets.js`. It currently contains:
- 4 reference planets (Earth, Mars, Venus, 51 Pegasi b) with hand-verified values
  matching Session 6 of the EHS project notebooks
- 8 real, named confirmed exoplanets matching the planets surfaced in Session 8's
  critique analysis (Kepler-438 b, Kepler-442 b, Kepler-1649 c, TRAPPIST-1 c,
  Gliese 12 b, Kepler-452 b, K2-72 e, Teegarden's Star b)

To wire in your full `scored_exoplanets.csv` (5,757 planets):
1. Export a trimmed JSON from the notebook: `pl_name`, `pl_rade`, `pl_bmasse`,
   `pl_insol`, `pl_eqt`, `pl_orbeccen`, `density_proxy`, `spectral_class`, `EHS`,
   and the six `*_score` columns.
2. Replace the `exoplanets` array in `src/data/planets.js` with the parsed JSON, or
   fetch it at runtime from a static `/public/data.json` file for a smaller bundle.
3. The Explorer, Dashboard, and Critique sections all read from `allPlanets` /
   `exoplanets`, so no component code needs to change — only the data source.

## Project structure

```
src/
├── components/        — one file + matching .css per section
├── data/planets.js     — all planet data, factor definitions, critique stats
├── hooks/useScrollReveal.js  — shared GSAP ScrollTrigger reveal hook
├── App.jsx             — section order
└── index.css           — design tokens (colors, type, glass panels)
```

## Sections included

Hero (3D rotating planet) → Motivation → Formula (animated term assembly) →
Parameter Cards (flip-to-reveal) → Comparison Dashboard (radar + bar charts) →
Critique (scatter chart, the headline finding) → Explorer (search/sort/filter) →
Discovery Timeline → Known Limitations → Future Work roadmap → Footer

## Notes on scope

The "interactive solar system neighborhood visualization" from the original brief is
represented here through the Dashboard's radar comparison and the Hero's orbiting
satellites, rather than a full N-body orbital simulation — that's a substantial
project on its own and was out of scope for this build. Asteroid belts, constellations,
and shooting stars are represented through the ambient starfield and nebula glow
rather than individually choreographed scenes.

## Performance

The production build code-splits Three.js, Recharts, and the animation libraries into
separate chunks (see `vite.config.js`) so the initial page load doesn't pull in all
~950KB of Three.js before the user sees anything.

## Accessibility

- Reduced motion is respected globally (`prefers-reduced-motion`)
- Visible focus rings on all interactive elements
- All decorative 3D/canvas elements are marked `aria-hidden`
