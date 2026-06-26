import { useScrollReveal } from '../hooks/useScrollReveal';
import './Motivation.css';

export default function Motivation() {
  const ref = useScrollReveal({ selector: '.reveal', stagger: 0.12 });

  return (
    <section className="motivation" id="motivation" ref={ref}>
      <div className="motivation__inner">
        <div className="eyebrow reveal">The problem</div>
        <h2 className="motivation__title reveal">
          Most habitability checks ask two questions.
          <br />
          <span className="motivation__accent">That isn't enough.</span>
        </h2>
        <div className="motivation__grid">
          <div className="motivation__card glass-panel reveal">
            <span className="motivation__card-number mono">01</span>
            <h3>The standard approach</h3>
            <p>
              NASA and PHL's commonly cited binary classification reduces a planet to
              a yes/no answer based on stellar flux and radius alone. Pass both
              thresholds, and a planet is flagged "potentially habitable." Miss either,
              and it's discarded - regardless of everything else about it.
            </p>
          </div>
          <div className="motivation__card glass-panel reveal glow-cyan">
            <span className="motivation__card-number mono">02</span>
            <h3>What gets missed</h3>
            <p>
              A planet can sit inside the habitable flux window and still be a poor
              candidate - if its orbit is wildly eccentric, its star is an unstable
              flare-prone red dwarf, or its density suggests a gas envelope rather than
              a rocky surface. None of that is visible to a two-factor cutoff.
            </p>
          </div>
        </div>
        <p className="motivation__statement reveal">
          EHS scores every confirmed exoplanet across <strong>six</strong> factors
          instead of two - transparently weighted, individually justified, and
          validated against known worlds before being trusted on unknown ones.
        </p>
      </div>
    </section>
  );
}
