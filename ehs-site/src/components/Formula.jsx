import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../hooks/useScrollReveal';
import { factorDefinitions } from '../data/planets';
import './Formula.css';

export default function Formula() {
  const sectionRef = useRef(null);
  const termRefs = useRef([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const terms = termRefs.current.filter(Boolean);
    gsap.set(terms, { opacity: 0, scale: 0.4, y: 50 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 65%',
      onEnter: () => {
        gsap.to(terms, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'back.out(1.4)',
        });
      },
      onLeaveBack: () => {
        gsap.set(terms, { opacity: 0, scale: 0.4, y: 50 });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section className="formula" id="formula" ref={sectionRef}>
      <div className="formula__inner">
        <div className="eyebrow">The metric</div>
        <h2 className="formula__title">How EHS is computed</h2>
        <p className="formula__sub">
          Six normalized factors, each scored 0-1, combined by weight. Missing
          factors are skipped per-planet, with remaining weights re-normalized to
          still sum to one.
        </p>

        <div className="formula__equation mono" aria-label="EHS equation">
          <span className="formula__lhs">EHS&nbsp;=</span>
          <div className="formula__terms">
            {factorDefinitions.map((f, i) => (
              <span
                key={f.key}
                className="formula__term"
                ref={(node) => (termRefs.current[i] = node)}
                style={{ '--term-color': f.color }}
              >
                <span className="formula__weight">{f.weight.toFixed(2)}</span>
                <span className="formula__times">&times;</span>
                <span className="formula__symbol">{f.symbol}</span>
                {i < factorDefinitions.length - 1 && <span className="formula__plus">+</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="formula__legend">
          {factorDefinitions.map((f) => (
            <div className="formula__legend-item" key={f.key}>
              <span className="formula__legend-dot" style={{ background: f.color }} />
              <span className="formula__legend-symbol mono">{f.symbol}</span>
              <span className="formula__legend-label">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="formula__note glass-panel">
          <strong>Hard physical disqualifier:</strong> if radius score falls below
          0.01 (i.e. the planet's size is wildly inconsistent with a rocky world),
          EHS is capped at 0.10 regardless of the weighted average. Orbital stability
          and stellar conditions cannot compensate for simply being a gas giant.
        </div>
      </div>
    </section>
  );
}
