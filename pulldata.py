import pandas as pd

url = (
    "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?"
    "query=select+pl_name,hostname,pl_rade,pl_bmasse,pl_orbsmax,pl_orbeccen,"
    "pl_eqt,pl_insol,st_teff,st_rad,st_mass,st_age,st_spectype,disc_year"
    "+from+pscomppars&format=csv"
)

df = pd.read_csv(url)
print(df.shape)
df.to_csv("raw_exoplanets.csv", index=False)