# Session_07.md

# Session 07 - Model Limitations and Future Improvements

## Objective

Evaluate the limitations of the Earth Habitability Score (EHS) model and identify potential improvements for future versions. This session focuses on understanding why some planets receive high habitability scores despite being uninhabitable in reality.

---

## Step 1: Evaluate the Highest Ranked Planets

After calculating the Earth Habitability Score (EHS), the highest-ranked planets were examined.

One interesting observation was that **Venus** received an unexpectedly high score.

Example:

| Planet |   EHS |
| ------ | ----: |
| Venus  | 0.971 |

Although Venus appears highly Earth-like in several physical properties, it is well known to be one of the least habitable planets in the Solar System.

---

## Step 2: Analyze Why Venus Scores Highly

The model currently evaluates only measurable planetary and stellar properties available for most confirmed exoplanets.

Venus closely resembles Earth in several characteristics:

- Planetary radius
- Planetary density
- Orbital eccentricity
- Host star environment
- Stellar flux (approximately 1.91× Earth's)

Because these features are similar to Earth's, the Gaussian scoring functions assign Venus a very high Earth Habitability Score.

This demonstrates that the model correctly captures **physical similarity**, but not **true habitability**.

---

## Step 3: Identify the Missing Factor

The primary reason Venus is uninhabitable is its atmosphere.

Venus experiences a **runaway greenhouse effect**, resulting in:

- Extremely high surface temperatures
- Dense carbon dioxide atmosphere
- Crushing atmospheric pressure
- Surface conditions unsuitable for liquid water or life

These atmospheric characteristics are **not included** in the current scoring model.

---

## Step 4: Why Atmospheric Features Were Excluded

Atmospheric composition data is unavailable for the majority of confirmed exoplanets.

Most exoplanet catalogs provide measurements such as:

- Radius
- Mass
- Orbital period
- Stellar flux
- Equilibrium temperature

However, detailed atmospheric properties are only available for a very small number of planets.

Because of this limited data availability, atmospheric factors were intentionally excluded from Version 1 of the Earth Habitability Score.

---

## Step 5: Future Improvements

Several enhancements have been identified for future versions of the model.

Possible improvements include:

- Incorporating atmospheric composition when available.
- Adding greenhouse effect indicators.
- Including atmospheric pressure estimates.
- Using planetary albedo to better estimate surface temperature.
- Incorporating water vapor or biosignature information from future space missions.
- Expanding the scoring model as more exoplanet observations become available.

These additions would improve the model's ability to distinguish between planets that are merely Earth-like and those that are genuinely habitable.

---

## Key Observation

The Earth Habitability Score measures **Earth similarity**, not guaranteed habitability.

A planet may receive a high EHS because its physical characteristics resemble Earth's, while still being uninhabitable due to atmospheric conditions.

Venus is the best example of this limitation.

---

## Key Takeaways

- Evaluated the limitations of the current Earth Habitability Score model.
- Identified atmospheric composition as the most significant missing feature.
- Explained why Venus receives a high habitability score despite being inhospitable.
- Recognized the difference between Earth similarity and true planetary habitability.
- Proposed future enhancements to improve the accuracy of the habitability scoring framework.
