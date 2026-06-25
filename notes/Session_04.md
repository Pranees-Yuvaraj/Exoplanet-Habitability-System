# Session_04.md

# Session 04 - Planet Habitability Scoring Model

## Objective

Develop a scoring system to evaluate how closely each exoplanet resembles Earth based on key planetary and stellar characteristics. These scores will be used later to rank potentially habitable exoplanets.

---

## Step 1: Load the Clean Dataset

Imported the required libraries and loaded the cleaned dataset from Session 3.

```python
import pandas as pd
import numpy as np

df = pd.read_csv("../data/clean_exoplanets.csv")
```

### Dataset Shape

```text
(5757, 17)
```

The dataset contains **5,757 exoplanets** with engineered features ready for scoring.

---

## Step 2: Gaussian Scoring Function

A Gaussian scoring function was implemented to assign a similarity score between **0 and 1**.

```python
def score_gaussian(value, ideal, tolerance):
    if pd.isna(value):
        return np.nan
    return np.exp(-((value - ideal) ** 2) / (2 * tolerance ** 2))
```

### Purpose

- Score = **1** → Very close to Earth's value.
- Score approaches **0** as the feature moves away from the ideal.

---

## Step 3: Flux and Temperature Scores

Two important habitability indicators were scored.

### Flux Score

Based on stellar energy received.

Ideal value:

```text
Earth = 1 Solar Flux
```

A wider tolerance was used because exoplanet flux values span several orders of magnitude.

---

### Temperature Score

Based on equilibrium temperature.

Ideal value:

```text
255 K
```

A wider Gaussian tolerance was also applied to accommodate realistic planetary temperature ranges.

Histograms were generated to inspect both score distributions.

---

## Step 4: Radius and Density Scores

### Radius Score

A custom asymmetric Gaussian function was created.

```python
score_asymmetric(...)
```

Reason:

Small rocky planets are generally preferred over extremely large gas giants.

Ideal radius:

```text
1 Earth Radius
```

---

### Density Score

Used the previously engineered **density_proxy** feature.

Higher scores were assigned to planets with densities closer to Earth's estimated density.

Summary statistics were generated to verify the distribution.

---

## Step 5: Orbital Eccentricity Score

Planets with nearly circular orbits are generally considered more suitable for stable climates.

A Gaussian scoring function centered at:

```text
Ideal Eccentricity = 0
```

was used.

```python
eccentricity_score
```

Results showed that most planets have relatively high eccentricity scores after missing values were replaced with zero.

---

## Step 6: Stellar Stability Score

Each stellar spectral class was assigned a stability score.

| Spectral Class | Score |
| -------------- | ----: |
| G              |  1.00 |
| K              |  0.90 |
| F              |  0.75 |
| M              |  0.50 |
| A              |  0.40 |
| B              |  0.10 |
| O              |  0.05 |

Stars similar to the Sun (G-type) received the highest score because they provide stable conditions for long-term habitability.

---

## Step 7: Score Distribution Analysis

Histograms were generated for all scoring features.

Scored Features:

- Flux Score
- Temperature Score
- Radius Score
- Density Score
- Eccentricity Score
- Stellar Score

These visualizations helped verify that the scoring functions produced reasonable distributions before combining them into a final habitability index.

---

## Step 8: Analyze Feature Distributions

The distribution of important planetary features was examined using descriptive statistics.

Features analyzed:

- Stellar Insolation (`pl_insol`)
- Equilibrium Temperature (`pl_eqt`)

This analysis helped determine appropriate scoring tolerances.

---

## Step 9: Save the Scored Dataset

The dataset containing all calculated habitability scores was exported.

```python
df.to_csv("../data/scored_exoplanets_partial.csv", index=False)
```

### Output File

```text
data/scored_exoplanets_partial.csv
```

---

## New Scoring Features Added

| Feature              | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `flux_score`         | Similarity of stellar energy received compared to Earth |
| `temp_score`         | Similarity of equilibrium temperature to Earth          |
| `radius_score`       | Similarity of planetary radius to Earth                 |
| `density_score`      | Similarity of density proxy to Earth                    |
| `eccentricity_score` | Preference for circular planetary orbits                |
| `stellar_score`      | Habitability score based on host star spectral class    |

---

## Key Takeaways

- Developed Gaussian-based scoring functions for multiple planetary properties.
- Applied Earth-like reference values for habitability assessment.
- Created specialized scoring methods for radius, density, eccentricity, and stellar type.
- Validated score distributions using histograms and descriptive statistics.
- Generated a partially scored exoplanet dataset for use in the final habitability ranking model.
