import { useScrollReveal } from '../hooks/useScrollReveal';
import './Limitations.css';

const LIMITATIONS = [
  {
    title: 'No atmospheric factor',
    body: "Venus scores 0.97 - Earth-sized, Earth-density, near-circular orbit - yet is uninhabitable due to a runaway greenhouse atmosphere. EHS has no factor measuring atmospheric composition, since this data is sparse-to-absent for the vast majority of confirmed exoplanets.",
  },
  {
    title: 'Eccentricity defaults inflate scores',
    body: '533 of 5,757 planets (9.3%) have missing eccentricity data, defaulted to 0 (circular) following astronomical convention. This contributes a flat scoring floor that can mask otherwise weak candidates.',
  },
  {
    title: 'Radius tolerance may be too permissive',
    body: "76% of the disagreement set with NASA's binary cutoff fails on radius. Above ~1.6 Earth radii, planets increasingly tend toward mini-Neptune composition - EHS's asymmetric scoring may award more credit than the underlying geology justifies.",
  },
  {
    title: 'A relative ranking, not a calibrated probability',
    body: 'EHS orders planets reliably (Earth > Venus > Mars > hot Jupiter, validated in Session 6) but absolute scores for near-miss planets should not be read as literal habitability percentages.',
  },
];

export default function Limitations() {
  const ref = useScrollReveal({ selector: '.limitations__item', stagger: 0.1, y: 24 });

  return (
    <section className="limitations" id="limitations" ref={ref}>
      <div className="limitations__inner">
        <div className="eyebrow">Known limitations</div>
        <h2 className="limitations__title">Where this model is honest about its edges</h2>
        <p className="limitations__sub">
          A transparent model means naming its own boundaries, not just its results.
        </p>
        <div className="limitations__list">
          {LIMITATIONS.map((l, i) => (
            <div className="limitations__item glass-panel" key={l.title}>
              <span className="limitations__index mono">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{l.title}</h3>
                <p>{l.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
