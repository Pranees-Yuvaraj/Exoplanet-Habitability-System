import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { critiqueStats, exoplanets, referencePlanets } from '../data/planets';
import './Critique.css';

function buildScatterData() {
  const all = [...referencePlanets, ...exoplanets];
  return all.map((p) => ({
    name: p.name,
    insolation: p.insolation,
    EHS: Math.round(p.EHS * 100),
    binary: p.binaryHabitable ?? (p.insolation >= 0.25 && p.insolation <= 1.5 && p.radius <= 1.6),
  }));
}

export default function Critique() {
  const ref = useScrollReveal({ selector: '.critique__stat, .critique__chart', y: 24 });
  const data = buildScatterData();
  const agree = data.filter((d) => d.binary);
  const disagree = data.filter((d) => !d.binary);

  return (
    <section className="critique" id="critique" ref={ref}>
      <div className="critique__inner">
        <div className="eyebrow">The critique</div>
        <h2 className="critique__title">Where the binary method breaks down</h2>
        <p className="critique__sub">
          Across {critiqueStats.totalScored.toLocaleString()} confirmed exoplanets,
          every planet passing NASA's binary criteria also scores highly on EHS
          &mdash; zero false positives. But the binary method has a different
          problem.
        </p>

        <div className="critique__stats">
          <div className="critique__stat">
            <span className="critique__stat-value mono">{critiqueStats.binaryFlagged}</span>
            <span className="critique__stat-label">planets pass NASA's binary cutoff</span>
          </div>
          <div className="critique__stat critique__stat--highlight">
            <span className="critique__stat-value mono">{critiqueStats.disagreements}</span>
            <span className="critique__stat-label">
              score highly on EHS despite failing it ({critiqueStats.disagreementPct}%)
            </span>
          </div>
          <div className="critique__stat">
            <span className="critique__stat-value mono">{critiqueStats.falsePositives}</span>
            <span className="critique__stat-label">false positives relative to EHS</span>
          </div>
        </div>

        <div className="critique__chart glass-panel">
          <h3>EHS score vs. insolation flux</h3>
          <ResponsiveContainer width="100%" height={380}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid stroke="rgba(154,163,196,0.12)" />
              <XAxis
                type="number"
                dataKey="insolation"
                name="Insolation Flux"
                scale="log"
                domain={['auto', 'auto']}
                tick={{ fill: '#9aa3c4', fontSize: 11 }}
                label={{ value: 'Insolation Flux (Earth units, log scale)', position: 'bottom', fill: '#9aa3c4', fontSize: 11, dy: 10 }}
              />
              <YAxis
                type="number"
                dataKey="EHS"
                name="EHS"
                domain={[0, 100]}
                tick={{ fill: '#9aa3c4', fontSize: 11 }}
                label={{ value: 'EHS Score', angle: -90, position: 'left', fill: '#9aa3c4', fontSize: 11 }}
              />
              <ZAxis range={[60, 60]} />
              <ReferenceArea x1={0.25} x2={1.5} fill="#4aff9e" fillOpacity={0.06} />
              <ReferenceLine y={50} stroke="#9aa3c4" strokeDasharray="4 4" />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ background: '#0d1224', border: '1px solid #5b6fff55', borderRadius: 8 }}
                labelStyle={{ color: '#e8ecff' }}
                formatter={(value, name) => [value, name]}
                labelFormatter={() => ''}
              />
              <Scatter name="Binary: agrees with EHS" data={agree} fill="#4aff9e" />
              <Scatter name="Binary: disagrees with EHS" data={disagree} fill="#ff9e3e" />
            </ScatterChart>
          </ResponsiveContainer>
          <p className="critique__chart-caption">
            Green band marks NASA's accepted flux window. Orange points score
            &ge;50 on EHS while falling outside the binary criteria &mdash; the
            disagreement cluster sits right at the window's edge.
          </p>
        </div>

        <div className="critique__breakdown">
          <h3>Why the disagreement happens</h3>
          <div className="critique__breakdown-grid">
            <div className="critique__breakdown-item">
              <span className="critique__breakdown-pct mono">{Math.round((critiqueStats.fluxOnly / critiqueStats.disagreements) * 100)}%</span>
              <span>Fail on flux alone &mdash; size is plausible, flux is just outside NASA's narrow band</span>
            </div>
            <div className="critique__breakdown-item">
              <span className="critique__breakdown-pct mono">{Math.round((critiqueStats.radiusOnly / critiqueStats.disagreements) * 100)}%</span>
              <span>Fail on radius alone &mdash; should be read cautiously, see limitations</span>
            </div>
            <div className="critique__breakdown-item">
              <span className="critique__breakdown-pct mono">{Math.round((critiqueStats.both / critiqueStats.disagreements) * 100)}%</span>
              <span>Fail on both &mdash; EHS compensates via other strong factors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
