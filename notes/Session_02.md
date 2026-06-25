# Session_02.md

# Session 02 - Exploratory Data Analysis (EDA): Missingness Analysis

## Objective

Analyze missing values in the NASA Exoplanet dataset to determine data quality and decide which planets should be retained for further analysis.

---

## Step 1: Load the Dataset

Imported the required libraries:

```python
import pandas as pd
import numpy as np
```

Loaded the dataset:

```python
df = pd.read_csv("../data/raw_exoplanets.csv")
```

---

## Step 2: Calculate Missing Values

Calculated the percentage of missing values for every column.

```python
missing_pct = (df.isna().sum() / len(df) * 100).sort_values(ascending=False)
```

This helps identify columns with incomplete information.

---

## Step 3: Visualize Missingness

A horizontal bar chart was created to visualize the percentage of missing values across all columns.

### Missingness Histogram

![Missingness by Column](missingness_histogram.png)

### Observation

- `st_spectype` has the highest percentage of missing values.
- `st_age` also contains a large number of missing entries.
- Core planetary measurements such as radius, mass, and equilibrium temperature have relatively fewer missing values.

---

## Step 4: Evaluate Core Features

The following six features were selected as the core inputs:

- `pl_insol`
- `pl_eqt`
- `pl_rade`
- `pl_orbeccen`
- `pl_bmasse`
- `st_spectype`

For each planet, the number of available (non-null) core features was calculated.

---

## Step 5: Inclusion Rule

### Decision

A planet is retained if it has at least **4 out of the 6** core features available.

This rule balances:

- Data quality
- Dataset size
- Model reliability

---

## Results

- **Total planets:** 6,298
- **Retained:** 5,757 planets
- **Dropped:** 541 planets
- **Retention Rate:** 91.4%
- **Removed:** 8.6%

---

## Final Dataset

The filtered dataset was saved as:

```text
data/filtered_exoplanets.csv
```

This cleaned dataset will be used in the next stages of preprocessing and machine learning.

---

## Key Takeaways

- Explored missing values in the dataset.
- Visualized missingness using a histogram.
- Selected six important features for quality assessment.
- Retained planets with at least four available core features.
- Created a cleaner dataset for future analysis.
