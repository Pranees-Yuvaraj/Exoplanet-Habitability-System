# EHS - Exoplanet Habitability Score (Interactive Site)

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

Output goes to `dist/` - deploy that folder to Vercel, Netlify, GitHub Pages, or any
static host.

## Restoring web fonts

This build ships with system-font fallbacks (`Space Grotesk` -> `Segoe UI`/system-ui,
etc.) because the sandbox this was built in couldn't reach Google Fonts' CDN. For the
full intended typography once you deploy somewhere with internet access, add this line
to the very top of `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..600&display=swap');
```

## Dataset

The site now uses the real project dataset from `../data/scored_exoplanets.csv`.
`src/data/planets.js` was generated from that CSV and contains:
- 5,757 scored confirmed exoplanets
- 4 reference validation planets from Session 6
- Derived critique statistics, dashboard candidates, and discovery timeline entries

If the CSV changes, regenerate `src/data/planets.js` from the updated scored dataset
before rebuilding the site.

## Project structure

```
src/
├── components/        - one file + matching .css per section
├── data/planets.js    - generated planet data, factor definitions, critique stats
├── hooks/useScrollReveal.js - shared GSAP ScrollTrigger reveal hook
├── App.jsx            - section order
└── index.css          - design tokens (colors, type, glass panels)
```

## Sections included

Hero (3D rotating planet) -> Motivation -> Formula (animated term assembly) ->
Parameter Cards (flip-to-reveal) -> Comparison Dashboard (radar + bar charts) ->
Critique (scatter chart, the headline finding) -> Explorer (search/sort/filter) ->
Discovery Timeline -> Known Limitations -> Future Work roadmap -> Footer

## Notes on scope

The "interactive solar system neighborhood visualization" from the original brief is
represented here through the Dashboard's radar comparison and the Hero's orbiting
satellites, rather than a full N-body orbital simulation - that's a substantial
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
