import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { factorDefinitions } from '../data/planets';
import './ParameterCards.css';

function ParameterCard({ factor }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      className={`param-card glass-panel ${flipped ? 'is-flipped' : ''}`}
      style={{ '--card-color': factor.color }}
      onClick={() => setFlipped((f) => !f)}
      aria-expanded={flipped}
    >
      <div className="param-card__inner">
        <div className="param-card__face param-card__front">
          <span className="param-card__symbol mono">{factor.symbol}</span>
          <h3 className="param-card__label">{factor.label}</h3>
          <div className="param-card__weight-bar">
            <div
              className="param-card__weight-fill"
              style={{ width: `${factor.weight * 100}%` }}
            />
          </div>
          <span className="param-card__weight-text mono">
            {(factor.weight * 100).toFixed(0)}% weight
          </span>
          <span className="param-card__hint">tap for detail</span>
        </div>
        <div className="param-card__face param-card__back">
          <span className="param-card__ideal-label">Ideal value</span>
          <span className="param-card__ideal mono">{factor.ideal}</span>
          <p className="param-card__desc">{factor.description}</p>
          <span className="param-card__unit mono">{factor.unit}</span>
        </div>
      </div>
    </button>
  );
}

export default function ParameterCards() {
  const ref = useScrollReveal({ selector: '.param-card', stagger: 0.07, y: 30 });

  return (
    <section className="parameters" id="parameters" ref={ref}>
      <div className="parameters__inner">
        <div className="eyebrow">Six factors</div>
        <h2 className="parameters__title">The parameters, explained</h2>
        <p className="parameters__sub">
          Each factor is normalized to a 0\u20131 score before weighting. Tap any card
          to see how it's defined.
        </p>
        <div className="parameters__grid">
          {factorDefinitions.map((f) => (
            <ParameterCard factor={f} key={f.key} />
          ))}
        </div>
      </div>
    </section>
  );
}
