# Session_06.md

# Session 06 - Reference Case Validation and Model Refinement

## Objective

Validate the EHS scoring pipeline against known reference planets — Earth, Mars,
Venus, and a known hot Jupiter — to confirm the model behaves sensibly on cases with
well-understood, real-world habitability outcomes.

---

## Step 1: Construct Reference Planets

Earth, Mars, and Venus are solar system bodies and do not appear in the NASA
Exoplanet Archive (which catalogs _exoplanets_ only). Reference rows were constructed
manually using known physical values, alongside 51 Pegasi b as a known hot Jupiter.

```python
reference_planets = pd.DataFrame([
    {'pl_name': 'Earth', 'pl_rade': 1.0, 'pl_bmasse': 1.0, 'pl_insol': 1.0,
     'pl_eqt': 255, 'pl_orbeccen': 0.017, 'spectral_class': 'G'},
    {'pl_name': 'Mars', 'pl_rade': 0.532, 'pl_bmasse': 0.107, 'pl_insol': 0.431,
     'pl_eqt': 210, 'pl_orbeccen': 0.094, 'spectral_class': 'G'},
    {'pl_name': 'Venus', 'pl_rade': 0.949, 'pl_bmasse': 0.815, 'pl_insol': 1.91,
     'pl_eqt': 232, 'pl_orbeccen': 0.007, 'spectral_class': 'G'},
    {'pl_name': '51 Pegasi b (hot Jupiter)', 'pl_rade': 14.0, 'pl_bmasse': 146.0,
     'pl_insol': 1700, 'pl_eqt': 1260, 'pl_orbeccen': 0.0, 'spectral_class': 'G'},
])
```

Each reference planet was passed through the same scoring functions defined in
Session 4, ensuring the validation uses the identical pipeline applied to the main
dataset rather than a separate calculation.

---

## Step 2: Initial Validation Result

```text
Earth   0.9998
Venus   0.9710
Mars    0.8539
51 Peg b (hot Jupiter)   0.2561
```

Earth correctly anchored at the top, and the hot Jupiter scored lowest — directionally
correct. However, 0.2561 for a hot Jupiter was higher than expected for a planet that
should score near zero on almost every physical measure.

---

## Step 3: Diagnose the Discrepancy

Per-factor scores were inspected directly:

| Planet   | flux_score | temp_score | radius_score | density_score | eccentricity_score | stellar_score |
| -------- | ---------: | ---------: | -----------: | ------------: | -----------------: | ------------: |
| Earth    |      1.000 |      1.000 |        1.000 |         1.000 |              0.998 |           1.0 |
| Mars     |      0.831 |      0.975 |        0.645 |         0.770 |              0.952 |           1.0 |
| Venus    |      0.896 |      0.993 |        0.995 |         0.993 |              1.000 |           1.0 |
| 51 Peg b |    5.1e-07 |    3.0e-06 |     1.2e-102 |         0.061 |              1.000 |           1.0 |

**Finding:** 51 Pegasi b correctly scored near-zero on flux, temperature, and radius —
the model identified it as wildly non-habitable on every physically meaningful axis.
However, `eccentricity_score` and `stellar_score` both defaulted to 1.0, since the
reference case used a circular orbit and a Sun-like star. Together these two factors
carry 25% of total weight, and a flat 1.0 contribution from each acted as a floor that
prevented the final EHS from approaching zero — even though the planet is, physically,
nothing like a habitable world.

This is an inherent property of additive weighted-sum scoring: a factor scoring ~1.0
uniformly across very different planets dilutes the contrast produced by factors that
are genuinely discriminating.

---

## Step 4: Add a Hard Physical Disqualifier

Rather than relying solely on the weighted average, a hard cutoff was added: if
`radius_score` falls below a near-zero threshold (indicating the planet's size is
wildly inconsistent with a rocky world), the final EHS is capped at a low value
regardless of other factors.

```python
def compute_ehs(row, weights, hard_cutoff_factor='radius_score',
                 hard_cutoff_threshold=0.01, hard_cutoff_cap=0.1):
    available = {k: v for k, v in weights.items() if not pd.isna(row[k])}
    if not available:
        return np.nan

    total_weight = sum(available.values())
    score = sum(row[k] * (w / total_weight) for k, w in available.items())

    if (hard_cutoff_factor in row and not pd.isna(row[hard_cutoff_factor])
            and row[hard_cutoff_factor] < hard_cutoff_threshold):
        return min(score, hard_cutoff_cap)

    return score
```

### Rationale

Orbital stability and stellar conditions cannot compensate for a planet simply being
a gas giant — physical size is treated as a hard constraint rather than one input
among six equally negotiable ones.

---

## Step 5: Re-Validate

```text
Earth   0.9998
Venus   0.9710
Mars    0.8539
51 Peg b (hot Jupiter)   0.1000
```

The hot Jupiter case dropped from 0.2561 to 0.1000 (the cap), correctly reflecting its
status as a non-habitable world. Earth, Mars, and Venus were unaffected, since none of
their `radius_score` values fall below the cutoff threshold.

---

## Step 6: Known Limitation

Mars (0.854) and Venus (0.971) still score higher than a strict habitability
assessment might suggest, for the same underlying reason diagnosed in Step 3 — neither
triggers the radius cutoff, so their eccentricity/stellar floor effect remains. This is
documented as a known limitation rather than further corrected, to avoid overfitting
the model to a small set of reference cases.

**EHS is treated as a relative ranking tool rather than a calibrated absolute
probability.** The ordering — Earth > Venus > Mars > hot Jupiter — is the validated
result; the absolute numbers for near-miss planets (Venus, Mars) should not be read
as precise habitability percentages.

---

## Key Takeaways

- Validated the scoring pipeline against four real reference planets with known,
  well-understood habitability outcomes.
- Identified and diagnosed a real flaw: additive weighted scoring allowed a hot
  Jupiter to score higher than physically reasonable, due to a flat floor contributed
  by eccentricity and stellar-stability scores.
- Implemented a hard physical disqualifier on radius, correcting the hot-Jupiter case
  without disturbing the other reference planets.
- Documented a remaining known limitation (Mars/Venus scoring higher than ideal) as an
  explicit modeling tradeoff rather than an unexamined gap.
