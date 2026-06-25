# Session_05.md

# Session 05 - Weight Assignment and EHS Computation

## Objective

Assign justified weights to each of the six scoring factors and combine them into a
single Exoplanet Habitability Score (EHS) per planet, handling missing factor scores
through per-planet weight re-normalization.

---

## Step 1: Define Factor Weights

Each factor was assigned a weight based on its relative importance to habitability,
with the six weights summing to 1.0.

```python
weights = {
    'flux_score': 0.25,
    'temp_score': 0.20,
    'radius_score': 0.20,
    'stellar_score': 0.15,
    'density_score': 0.10,
    'eccentricity_score': 0.10
}
```

### Weight Justification

| Factor            | Weight | Reasoning                                                                                                                     |
| ----------------- | -----: | ----------------------------------------------------------------------------------------------------------------------------- |
| Flux              |   0.25 | Determines whether liquid water is physically possible at all                                                                 |
| Temperature       |   0.20 | Refines flux with a more direct thermal estimate                                                                              |
| Radius            |   0.20 | Rocky vs. gas giant is a hard physical distinction, not a spectrum                                                            |
| Stellar stability |   0.15 | Flare activity and tidal locking are existential risks                                                                        |
| Density           |   0.10 | Useful signal, but noisier due to measurement uncertainty                                                                     |
| Eccentricity      |   0.10 | Matters, but found to be inflated toward 1.0 in this dataset (see Session 4 missingness handling), so weighted conservatively |

---

## Step 2: Combine Factors into EHS

A weighted-average function was implemented to compute the final score per planet.

```python
def compute_ehs(row, weights):
    available = {k: v for k, v in weights.items() if not pd.isna(row[k])}
    if not available:
        return np.nan
    total_weight = sum(available.values())
    return sum(row[k] * (w / total_weight) for k, w in available.items())

df['EHS'] = df.apply(lambda row: compute_ehs(row, weights), axis=1)
```

### Handling Missing Factor Scores

Rather than dropping planets with any missing factor (which would discard a large
share of the dataset, since `stellar_score` alone is missing for ~63% of rows), weights
are re-normalized across only the factors available for a given planet. A planet
missing `stellar_score` has its remaining five weights scaled up proportionally so
they still sum to 1.0.

---

## Step 3: Distribution Check

The combined EHS distribution was plotted to confirm the blended score behaves
differently from any single input factor.

```text
EHS roughly unimodal, peaking around 0.25-0.45, with a long right tail toward 1.0
```

Unlike the individual factor scores from Session 4 (several of which were bimodal,
spiking at both 0 and 1), the blended EHS smoothed into a single peak — expected
behavior when combining multiple semi-independent signals.

---

## Step 4: Sanity Check — Top and Bottom Ranked Planets

The ten highest- and lowest-scoring planets were inspected without any hardcoded
reference answers, as an informal validation step.

### Top 10 (highest EHS)

Included **Kepler-438 b**, **Kepler-442 b**, and **Kepler-1649 c** — all independently
recognized in the exoplanet science literature as among the most Earth-like candidates
known, alongside **Teegarden's Star b** and **K2-72 e**.

### Bottom 10 (lowest EHS)

Consisted of obscure survey-discovered planets (e.g. HATS-, HD- designations) with no
known habitability relevance — consistent with expectation.

**Finding:** the model's top-ranked planets converged with real scientific consensus
on Earth-like candidates, without that consensus being hardcoded anywhere in the
scoring logic. This is treated as a meaningful validation signal ahead of formal
reference-case testing in Session 6.

---

## Step 5: Save the Scored Dataset

```python
df.to_csv("../data/scored_exoplanets.csv", index=False)
```

### Output File

```text
data/scored_exoplanets.csv
```

---

## New Feature Added

| Feature | Description                                                        |
| ------- | ------------------------------------------------------------------ |
| `EHS`   | Final weighted habitability score, combining all six factor scores |

---

## Key Takeaways

- Assigned and documented justified weights for all six habitability factors.
- Implemented per-planet weight re-normalization to handle missing factor data
  without discarding planets.
- Verified the combined EHS distribution differs meaningfully from individual factor
  distributions.
- Found that top-ranked planets align with real, independently recognized Earth-like
  exoplanet candidates — an early, unplanned validation result.
- Produced the first fully scored exoplanet dataset.
