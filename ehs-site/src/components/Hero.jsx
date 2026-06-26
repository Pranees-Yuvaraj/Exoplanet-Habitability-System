import { critiqueStats } from '../data/planets';
import HeroPlanet from './HeroPlanet';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <HeroPlanet />
      <div className="hero__content">
        <div className="eyebrow hero__eyebrow">Exoplanet Habitability Score &middot; EHS</div>
        <h1 className="hero__title">
          A multi-parameter metric for
          <br />
          assessing planetary habitability
        </h1>
        <p className="hero__sub">
          NASA's standard classification asks two questions: how hot, how big.
          EHS asks six - and finds {critiqueStats.disagreements.toLocaleString()} plausible worlds the binary method misses.
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-value mono">{critiqueStats.totalScored.toLocaleString()}</span>
            <span className="hero__stat-label">planets scored</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value mono">6</span>
            <span className="hero__stat-label">weighted factors</span>
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value mono">{critiqueStats.disagreementPct}%</span>
            <span className="hero__stat-label">disagreement rate</span>
          </div>
        </div>
      </div>
      <div className="hero__scroll-cue" aria-hidden="true">
        <span>scroll to explore</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
