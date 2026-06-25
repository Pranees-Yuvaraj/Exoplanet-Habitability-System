# Day 1 - NASA Exoplanet Dataset Exploration

## Objective

Collected and explored NASA's **Planetary Systems Composite Parameters (PSCompPars)** exoplanet dataset.

---

## Dataset Information

- **Source:** NASA Exoplanet Archive (PSCompPars)
- Imported the dataset into Python.

### Dataset Shape

```text
Shape: (6298, 14)
```

- **6298 rows** → Planets
- **14 columns** → Features

---

## Dataset Attributes

| Column        | Meaning                             | Example            |
| ------------- | ----------------------------------- | ------------------ |
| `pl_name`     | Planet name                         | Kepler-22 b        |
| `hostname`    | Star the planet orbits              | Kepler-22          |
| `pl_rade`     | Planet radius (Earth radii)         | 2                  |
| `pl_bmasse`   | Planet mass (Earth masses)          | 10                 |
| `pl_orbsmax`  | Distance from star (AU)             | Earth = 1 AU       |
| `pl_orbeccen` | Orbital eccentricity                | 0 (perfect circle) |
| `pl_eqt`      | Equilibrium temperature (Kelvin)    | 255 K              |
| `pl_insol`    | Stellar energy received (Earth = 1) | Earth = 1          |
| `st_teff`     | Star effective temperature (Kelvin) | Sun ≈ 5778 K       |
| `st_rad`      | Star radius (Sun = 1)               | 1                  |
| `st_mass`     | Star mass (Sun = 1)                 | 1                  |
| `st_age`      | Star age (Billion years)            | Sun ≈ 4.6          |
| `st_spectype` | Stellar spectral type               | G2V, M, K          |
| `disc_year`   | Discovery year                      | 2015               |

---

## Missing Values Analysis

No columns are completely missing.

| Column        | Missing Values |
| ------------- | -------------: |
| `pl_rade`     |             50 |
| `pl_bmasse`   |             31 |
| `pl_orbsmax`  |            425 |
| `pl_orbeccen` |           1051 |
| `pl_eqt`      |            521 |
| `pl_insol`    |            576 |
| `st_teff`     |            294 |
| `st_rad`      |            318 |
| `st_mass`     |              4 |
| `st_age`      |           1430 |
| `st_spectype` |           3969 |
| `disc_year`   |              1 |

---

## Descriptive Statistics

Calculated the following statistics using the `describe()` function for:

- `pl_rade`
- `pl_bmasse`
- `pl_eqt`
- `pl_insol`
- `pl_orbeccen`

Statistics obtained:

- Mean
- Standard Deviation
- Minimum
- 25th Percentile
- Median (50%)
- 75th Percentile
- Maximum

---

## GitHub Progress

- Updated all project files to GitHub.
