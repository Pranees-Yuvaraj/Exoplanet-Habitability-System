# Exoplanet Habitability Score (EHS)

A 6-factor weighted habitability scoring model for exoplanets — built to critique the
limitations of NASA/PHL's standard binary "potentially habitable" classification, which
relies almost entirely on two factors: stellar flux and equilibrium temperature.

This project scores every confirmed exoplanet across **six factors** (flux, temperature,
size, stellar stability, orbital eccentricity, and density), then directly compares those
scores against the standard binary flag to surface planets the simpler method likely
misclassifies — in either direction.

---

## Why this project exists

Most public habitability checks reduce a planet to "is it the right size, at the right
temperature?" That ignores real, measurable risk factors: a planet can sit in the
"habitable zone" by flux alone and still be a poor candidate if its orbit is wildly
eccentric, its star is an unstable flare-prone M-dwarf, or its bulk density suggests a
gas envelope rather than a rocky surface.

EHS doesn't try to be a definitive habitability classifier — it's a more honest, more
transparent alternative to a two-factor cutoff, with every weight and scoring choice
documented and justified rather than hidden inside a model.

---

## Dataset

- **Source:** [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) —
  Planetary Systems Composite Parameters (PSCompPars) table
- **Pulled via:** direct TAP query (see `notebooks/01_Data_Acquisition.ipynb`)
- **Current size:** 6,298 confirmed exoplanets, 14 raw fields per planet
- **Note:** Earth is correctly absent from results — this is a confirmed-_exoplanet_
  archive, not a planetary catalog including the solar system

---

## Project status

- [x] Data acquisition (NASA Exoplanet Archive, TAP query)
- [x] Data verification (shape, missingness, value-range sanity checks)
- [x] Missingness analysis & inclusion criteria
- [ ] Data cleaning & feature engineering (density proxy, stellar stability tiers)
- [ ] Scoring model — 6 weighted, normalized factors
- [ ] Model validation against reference cases (Earth, Mars, Venus, known hot Jupiters)
- [ ] Critique: EHS vs. NASA/PHL binary classification — find and visualize disagreements
- [ ] Interactive Streamlit app (live weight-adjustment "sandbox", radar charts)
- [ ] Deployment (Streamlit Community Cloud)

---

## The six factors

| Factor                    | What it captures                                       |
| ------------------------- | ------------------------------------------------------ |
| Stellar flux (insolation) | Whether liquid water is physically possible at all     |
| Equilibrium temperature   | Refines flux with a more direct temperature estimate   |
| Planet size (radius)      | Rocky vs. gas giant — a hard physical distinction      |
| Stellar stability         | Flare activity and tidal-locking risk by spectral type |
| Orbital eccentricity      | Climate volatility from elliptical orbits              |
| Density proxy             | Rough signal for whether an atmosphere is plausible    |

Each factor is normalized to a 0–1 score (using non-linear, "peaks at ideal" functions
rather than simple min-max scaling — the raw data has extreme outliers that would
otherwise distort the scale). Weights are assigned with documented justification, not
arbitrarily — see the scoring notebook once Phase 2 is complete.

---

## Tech stack

- **Data:** Pandas, NumPy, astroquery (NASA Exoplanet Archive TAP queries)
- **Modeling:** Hand-built weighted scoring functions — deliberately not a black-box ML
  model, since interpretability is core to the project's pitch
- **Visualization:** Plotly
- **App:** Streamlit
- **Dev environment:** Google Antigravity

---

## Repository structure

```
EHS/
├── data/
│   ├── raw_exoplanets.csv
│   └── cleaned_exoplanets.csv
├── notebooks/
│   ├── 01_Data_Acquisition.ipynb
│   └── 02_Data_Wrangling.ipynb
├── notes/
│   ├── Session_01.md
│   └── Session_02.md
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```

---

## Running locally

```bash
git clone https://github.com/Pranees-Yuvaraj/Exoplanet-Habitability-System.git
cd Exoplanet-Habitability-System
pip install -r requirements.txt
jupyter notebook notebooks/01_Data_Acquisition.ipynb
jupyter notebook notebooks/02_Data_Wrangling.ipynb
```

---

## License

MIT
