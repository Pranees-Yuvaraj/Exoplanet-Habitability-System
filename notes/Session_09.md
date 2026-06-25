# Session_09.md

# Session 09 - Visualizing the Critique

## Objective

Turn the Session 8 critique findings into a clear visual comparison, and finalize the
written headline finding for the README.

---

## Step 1: Categorize Every Planet by Agreement Type

Each planet was tagged based on how its EHS score and binary classification relate to
one another, producing five categories for plotting.

```python
def categorize(row):
    if pd.isna(row['binary_habitable']):
        return 'Insufficient data'
    if row['binary_habitable'] and row['EHS'] >= 0.5:
        return 'Agreement (habitable)'
    if not row['binary_habitable'] and row['EHS'] < 0.5:
        return 'Agreement (not habitable)'
    if not row['binary_habitable'] and row['EHS'] >= 0.5:
        return 'Disagreement: EHS high, binary rejects'
    if row['binary_habitable'] and row['EHS'] < 0.5:
        return 'Disagreement: binary accepts, EHS low'
    return 'Other'

df['category'] = df.apply(categorize, axis=1)
```

---

## Step 2: Interactive Comparison Chart (Plotly)

An interactive scatter plot was built to explore the relationship between insolation
flux and EHS score, colored by agreement category, with the NASA flux window
highlighted for reference.

```python
import plotly.express as px

fig = px.scatter(
    df.dropna(subset=['EHS', 'pl_insol']),
    x='pl_insol', y='EHS', color='category',
    hover_data=['pl_name', 'pl_rade'], log_x=True,
    title='EHS vs. Insolation Flux, colored by agreement with binary classification'
)
fig.add_hline(y=0.5, line_dash='dash', line_color='gray')
fig.add_vrect(x0=0.25, x1=1.5, fillcolor='green', opacity=0.1, line_width=0)
fig.show()
```

### Observation

The disagreement points (EHS high, binary rejects) form a clear band rising out of
the "agreement, not habitable" region right around the NASA flux window, and falling
back into agreement at higher flux values. This visually confirms the Session 8
finding: EHS treats the habitability boundary as a gradient, while the binary method
treats it as a hard cutoff — and most disagreement clusters exactly at that edge.

---

## Step 3: Static Comparison Chart (Matplotlib, for README)

Since Plotly charts do not render natively on GitHub, a static equivalent was
generated and saved for embedding in the project README.

```python
import os
os.makedirs('../assets', exist_ok=True)

fig, ax = plt.subplots(figsize=(8,6))
colors = {
    'Agreement (habitable)': 'green',
    'Agreement (not habitable)': 'lightgray',
    'Disagreement: EHS high, binary rejects': 'orange',
    'Disagreement: binary accepts, EHS low': 'red',
    'Insufficient data': 'lightblue'
}

for cat, color in colors.items():
    subset = df[df['category'] == cat]
    if len(subset) > 0:
        ax.scatter(subset['pl_insol'], subset['EHS'], label=cat, alpha=0.6, s=15, c=color)

ax.set_xscale('log')
ax.axhline(0.5, linestyle='--', color='gray')
ax.set_xlabel('Insolation Flux (Earth units, log scale)')
ax.set_ylabel('EHS Score')
ax.legend(fontsize=8, loc='upper right')
plt.title('EHS vs. NASA Binary Classification: Where They Disagree')
plt.savefig('../assets/critique_scatter.png', dpi=150, bbox_inches='tight')
```

### Output File

```text
assets/critique_scatter.png
```

---

## Step 4: Finalize the Written Finding

```markdown
### Key Finding

Comparing EHS against NASA/PHL's standard binary habitability classification across
5,757 confirmed exoplanets: every planet that passes the binary criteria also scores
highly on EHS (no false positives), but 938 planets (16.3%) score highly on EHS
despite failing the binary cutoff. Of these, 225 fail on insolation flux alone — their
size is plausible, but their flux falls just outside NASA's narrow accepted range.
EHS's gradual scoring treats this as a moderate penalty rather than an automatic
disqualification, suggesting the binary method may be excluding a meaningful number
of plausible candidates.
```

---

## Key Takeaways

- Built both an interactive (Plotly) and static (Matplotlib) version of the central
  critique chart, covering exploration and README embedding respectively.
- Visual evidence supports the Session 8 finding: disagreement is concentrated at the
  boundary of NASA's flux window, consistent with EHS treating habitability as a
  gradient rather than a cutoff.
- Finalized the one-paragraph headline finding for the README and resume.
