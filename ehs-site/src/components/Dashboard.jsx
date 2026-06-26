import { useState, useMemo } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { allPlanets, factorDefinitions } from '../data/planets';
import './Dashboard.css';

const DEFAULT_SELECTION = ['earth', 'venus', 'mars', 'kepler-1649c'];
const PALETTE = ['#3ef0ff', '#ffd866', '#ff6b4a', '#7d3cff', '#4aff9e'];

export default function Dashboard() {
  const ref = useScrollReveal({ selector: '.dashboard__panel', y: 30 });
  const [selected, setSelected] = useState(DEFAULT_SELECTION);

  const toggle = (id) => {
    setSelected((curr) => {
      if (curr.includes(id)) return curr.filter((x) => x !== id);
      if (curr.length >= 5) return curr;
      return [...curr, id];
    });
  };

  const selectedPlanets = useMemo(
    () => selected.map((id) => allPlanets.find((p) => p.id === id)).filter(Boolean),
    [selected]
  );

  const radarData = useMemo(() => {
    return factorDefinitions.map((f) => {
      const point = { factor: f.label };
      selectedPlanets.forEach((p) => {
        point[p.name] = Math.round((p.factors?.[f.key] ?? 0) * 100);
      });
      return point;
    });
  }, [selectedPlanets]);

  const barData = useMemo(
    () =>
      selectedPlanets
        .map((p) => ({ name: p.name, EHS: Math.round(p.EHS * 1000) / 10, color: p.color || '#5b6fff' }))
        .sort((a, b) => b.EHS - a.EHS),
    [selectedPlanets]
  );

  return (
    <section className="dashboard" id="dashboard" ref={ref}>
      <div className="dashboard__inner">
        <div className="eyebrow">Comparison</div>
        <h2 className="dashboard__title">Earth, Venus, Mars &mdash; and the candidates</h2>
        <p className="dashboard__sub">
          Choose up to five planets to compare factor-by-factor. Reference worlds
          (Earth, Venus, Mars, 51 Pegasi b) anchor the scale; the rest are real
          confirmed exoplanets surfaced by the critique analysis.
        </p>

        <div className="dashboard__picker">
          {allPlanets.map((p) => (
            <button
              key={p.id}
              className={`dashboard__chip ${selected.includes(p.id) ? 'is-active' : ''}`}
              onClick={() => toggle(p.id)}
              aria-pressed={selected.includes(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="dashboard__grid">
          <div className="dashboard__panel glass-panel">
            <h3>Factor breakdown</h3>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(154,163,196,0.2)" />
                <PolarAngleAxis dataKey="factor" tick={{ fill: '#9aa3c4', fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fill: '#9aa3c4', fontSize: 9 }} domain={[0, 100]} />
                {selectedPlanets.map((p, i) => (
                  <Radar
                    key={p.id}
                    name={p.name}
                    dataKey={p.name}
                    stroke={PALETTE[i % PALETTE.length]}
                    fill={PALETTE[i % PALETTE.length]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip
                  contentStyle={{ background: '#0d1224', border: '1px solid #5b6fff55', borderRadius: 8 }}
                  labelStyle={{ color: '#e8ecff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard__panel glass-panel">
            <h3>Final EHS score</h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(154,163,196,0.12)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9aa3c4', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#e8ecff', fontSize: 12 }} width={110} />
                <Tooltip
                  contentStyle={{ background: '#0d1224', border: '1px solid #5b6fff55', borderRadius: 8 }}
                  labelStyle={{ color: '#e8ecff' }}
                />
                <Bar dataKey="EHS" radius={[0, 6, 6, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard__blurbs">
          {selectedPlanets.map((p) => (
            <div className="dashboard__blurb" key={p.id}>
              <span className="dashboard__blurb-name mono">{p.name}</span>
              <p>{p.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
