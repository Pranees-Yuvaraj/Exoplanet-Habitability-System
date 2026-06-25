# Session_08.md

# Session 08 - Critique: EHS vs. NASA Binary Classification

## Objective

Compare the EHS scoring model against NASA/PHL's standard binary "potentially
habitable" classification, to test the project's core claim — that a 6-factor
weighted model surfaces information a simple two-factor cutoff misses.

---

## Step 1: Load the Scored Dataset

```python
import pandas as pd
import numpy as np

df = pd.read_csv("../data/scored_exoplanets.csv")
```

### Dataset Shape

```text
(5757, ...)
```

---

## Step 2: Implement the Binary Classification Rule

The standard simplified binary habitability flag was implemented using NASA/PHL's
commonly cited thresholds.

```python
def is_binary_habitable(row):
    if pd.isna(row['pl_insol']) or pd.isna(row['pl_rade']):
        return np.nan
    flux_ok = 0.25 <= row['pl_insol'] <= 1.5
    radius_ok = row['pl_rade'] <= 1.6
    return flux_ok and radius_ok

df['binary_habitable'] = df.apply(is_binary_habitable, axis=1)
```

### Binary Classification Results

```text
False    5648
NaN        77
True       32
```

Only 32 of 5,757 planets (0.56%) pass the binary criteria — confirming the binary
method is deliberately conservative.

---

## Step 3: Build the Four-Way Comparison

An EHS threshold of 0.5 was used to define "high-scoring" planets for comparison
purposes.

```python
ehs_threshold = 0.5
df['ehs_high'] = df['EHS'] >= ehs_threshold

comparison = df[df['binary_habitable'].notna()]
crosstab = pd.crosstab(comparison['binary_habitable'], comparison['ehs_high'])
```

---

## Step 4: Check for False Positives (Binary Yes, EHS Low)

```python
binary_yes_ehs_no = df[(df['binary_habitable'] == True) & (df['EHS'] < ehs_threshold)]
```

### Result

```text
Empty DataFrame (0 planets)
```

**Finding:** every planet that passes the binary criteria also scores >=0.5 on EHS.
The binary method produces no false positives relative to EHS on this dataset — its
strictness means it is not over-including weak candidates.

---

## Step 5: Check for False Negatives (Binary No, EHS High)

```python
binary_no_ehs_yes = df[(df['binary_habitable'] == False) & (df['EHS'] >= ehs_threshold)]
```

### Result

```text
938 planets (16.3% of the dataset)
```

Top examples included **Kepler-452 b**, **TRAPPIST-1 c**, **Gliese 12 b**, and
**Kepler-1649 b** — planets independently discussed in exoplanet science literature
as notable near-Earth-size, temperate candidates, despite failing the binary cutoff.

---

## Step 6: Diagnose Why the 938 Planets Fail the Binary Cutoff

Each disagreement planet was checked against the two binary sub-conditions
individually to determine the failure mode.

```python
binary_no_ehs_yes['fails_flux'] = ~((binary_no_ehs_yes['pl_insol'] >= 0.25) &
                                      (binary_no_ehs_yes['pl_insol'] <= 1.5))
binary_no_ehs_yes['fails_radius'] = ~(binary_no_ehs_yes['pl_rade'] <= 1.6)
```

### Breakdown

| Failure Mode         | Count | % of 938 |
| -------------------- | ----: | -------: |
| Flux only            |   225 |      24% |
| Radius only          |   250 |      27% |
| Both flux and radius |   463 |      49% |

---

## Step 7: Interpret the Breakdown

**Flux-only failures (225 planets)** are the most defensible false negatives: radius
is plausible (rocky-consistent), and only insolation falls just outside NASA's narrow
0.25-1.5 band. EHS's smooth Gaussian flux scoring treats this as a moderate penalty
rather than an instant disqualification — arguably a more physically reasonable
treatment than a hard cutoff.

**Radius-involved failures (250 + 463 = 713 planets, 76% of the group)** require a
caveat. NASA's 1.6-Earth-radius threshold reflects a genuine physical transition:
above this size, planets increasingly tend toward mini-Neptune composition (thick
volatile/hydrogen envelopes) rather than rocky surfaces. EHS's asymmetric radius
scoring still awards partial credit above this threshold, which may be more permissive
than the underlying geology justifies. Not all 938 disagreements should be read as
straightforward binary-method failures — some may reflect EHS's radius tolerance
being looser than ideal, rather than the binary cutoff being simply wrong.

---

## Key Findings

- **No false positives:** all 32 binary-flagged planets also score >=0.5 on EHS.
- **938 likely false negatives (16.3% of dataset):** planets scoring >=0.5 on EHS
  despite failing the binary cutoff, including several planets already recognized in
  the literature as notable habitability candidates.
- **Failure mode breakdown:** 24% fail on flux alone (most defensible), 27% on radius
  alone, 49% on both.
- **Caveat:** radius-related disagreements (76% of the group) should be interpreted
  cautiously, since NASA's radius cutoff reflects a real rocky/non-rocky physical
  boundary that EHS's scoring may under-penalize.

---

## Headline Takeaway

A rigid two-factor binary cutoff appears more prone to excluding plausible candidates
(false negatives) than to including poor ones (false positives) on this dataset — but
a meaningful share of the apparent disagreement reflects EHS's radius tolerance being
more permissive than the strict physical rocky/non-rocky boundary, rather than the
binary method being straightforwardly incorrect.
