# Session_03.md

# Session 03 - Data Cleaning & Feature Engineering

## Objective

Prepare the filtered exoplanet dataset for machine learning by creating new features, handling missing values, and saving a cleaned dataset.

---

## Step 1: Load the Filtered Dataset

Imported the required libraries and loaded the cleaned dataset from Session 2.

```python
import pandas as pd
import numpy as np

df = pd.read_csv("../data/filtered_exoplanets.csv")
```

### Dataset Shape

```text
(5757, 14)
```

The dataset contains **5,757 exoplanets** and **14 features** after the missing-value filtering performed in Session 2.

---

## Step 2: Create a Density Proxy

A new feature called **`density_proxy`** was engineered to estimate the relative bulk density of a planet.

### Formula

```python
density_proxy = pl_bmasse / (pl_rade ** 3)
```

This is **not the actual density (g/cm³)** but serves as a comparative indicator of planetary composition.

### Statistics

| Statistic |   Value |
| --------- | ------: |
| Count     |    5701 |
| Mean      |    2.53 |
| Median    |    0.47 |
| Minimum   |   0.005 |
| Maximum   | 2517.40 |

---

## Step 3: Extract Stellar Spectral Class

The original **`st_spectype`** column contains detailed spectral classifications.

A new feature called **`spectral_class`** was created by extracting only the first letter of the stellar spectral type.

Example:

| Original | Spectral Class |
| -------- | -------------- |
| G2V      | G              |
| K5       | K              |
| M3       | M              |

### Distribution

| Class   | Count |
| ------- | ----: |
| G       |   755 |
| K       |   638 |
| M       |   531 |
| F       |   288 |
| A       |    23 |
| Others  |   Few |
| Missing |  3504 |

This simplifies the feature for later machine learning models.

---

## Step 4: Handle Missing Orbital Eccentricity

Many planets had missing values in the **`pl_orbeccen`** column.

Missing values were replaced with **0**.

```python
df['pl_orbeccen_filled'] = df['pl_orbeccen'].fillna(0)
```

### Result

```text
Eccentricity nulls filled: 533
```

This assumes that planets with unknown eccentricity have approximately circular orbits.

---

## Step 5: Validate Engineered Features

Checked the engineered columns for remaining missing values.

| Feature            | Missing Values |
| ------------------ | -------------: |
| density_proxy      |             56 |
| spectral_class     |           3504 |
| pl_orbeccen_filled |              0 |

Also verified a few known planets to ensure the calculations were correct.

---

## Step 6: Save the Clean Dataset

The processed dataset containing the new engineered features was saved.

```python
df.to_csv("../data/clean_exoplanets.csv", index=False)
```

### Final Dataset

```text
Shape: (5757, 17)
```

The dataset now contains **17 features**, including the newly engineered columns.

---

## New Features Added

| Feature              | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `density_proxy`      | Relative estimate of planetary bulk density            |
| `spectral_class`     | Simplified stellar spectral type                       |
| `pl_orbeccen_filled` | Orbital eccentricity with missing values replaced by 0 |

---

## Key Takeaways

- Loaded the filtered dataset from Session 2.
- Engineered a **density proxy** feature using planetary mass and radius.
- Extracted simplified **stellar spectral classes**.
- Filled missing orbital eccentricity values with zero.
- Validated engineered features for consistency.
- Saved the cleaned dataset as **`clean_exoplanets.csv`**, ready for feature selection and machine learning.
