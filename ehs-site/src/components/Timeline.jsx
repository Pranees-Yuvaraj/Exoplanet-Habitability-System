import { useScrollReveal } from '../hooks/useScrollReveal';
import { discoveryTimeline } from '../data/planets';
import './Timeline.css';

export default function Timeline() {
  const ref = useScrollReveal({ selector: '.timeline__item', y: 30, stagger: 0.1 });

  return (
    <section className="timeline" id="timeline" ref={ref}>
      <div className="timeline__inner">
        <div className="eyebrow">History</div>
        <h2 className="timeline__title">From the first detection to EHS</h2>
        <div className="timeline__track">
          <div className="timeline__line" aria-hidden="true" />
          {discoveryTimeline.map((item, i) => (
            <div
              className={`timeline__item ${i % 2 === 0 ? 'is-left' : 'is-right'}`}
              key={item.year}
            >
              <div className="timeline__dot" aria-hidden="true" />
              <div className="timeline__card glass-panel">
                <span className="timeline__year mono">{item.year}</span>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
