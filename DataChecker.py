import pandas as pd
df = pd.read_csv("raw_exoplanets.csv")
print("Shape:", df.shape)
print("Columns:", list(df.columns))
expected_cols = ['pl_name','hostname','pl_rade','pl_bmasse','pl_orbsmax',
                  'pl_orbeccen','pl_eqt','pl_insol','st_teff','st_rad',
                  'st_mass','st_age','st_spectype','disc_year']
missing_cols = [c for c in expected_cols if c not in df.columns]
print("Missing columns:", missing_cols if missing_cols else "None — good")

print("Row count:", len(df))
print(df.isna().sum())
known = ['Earth', 'Kepler-22 b', '51 Eri b', 'TRAPPIST-1 e']
for name in known:
    match = df[df['pl_name'].str.contains(name, case=False, na=False)]
    print(f"{name}: {'found' if not match.empty else 'NOT FOUND'}")
print(df[['pl_rade','pl_bmasse','pl_eqt','pl_insol','pl_orbeccen']].describe())