import { useScrollReveal } from '../hooks/useScrollReveal';
import './FutureWork.css';

const ROADMAP = [
  {
    phase: 'Next',
    title: 'Atmospheric proxy factor',
    body: 'A derived greenhouse-amplification signal from flux x distance x expected atmospheric retention, as a stand-in for sparse real atmospheric data.',
  },
  {
    phase: 'Next',
    title: 'Live weight sandbox',
    body: 'Drag sliders to reweight all six factors in real time and watch the explorer rankings shift - the interactive feature this dashboard is built to support.',
  },
  {
    phase: 'Planned',
    title: 'Public deployment',
    body: 'Ship the full interactive build to a public URL, with the underlying notebooks and session logs linked for anyone who wants to audit the methodology.',
  },
  {
    phase: 'Exploring',
    title: 'Confidence-weighted scoring',
    body: 'Factor in measurement uncertainty from the archive itself, so planets with well-constrained parameters are distinguished from those built on rough estimates.',
  },
];

export default function FutureWork() {
  const ref = useScrollReveal({ selector: '.future__node', stagger: 0.1, y: 24 });

  return (
    <section className="future" id="future" ref={ref}>
      <div className="future__inner">
        <div className="eyebrow">Future work</div>
        <h2 className="future__title">The roadmap ahead</h2>
        <div className="future__path">
          {ROADMAP.map((r) => (
            <div className="future__node glass-panel" key={r.title}>
              <span className={`future__phase future__phase--${r.phase.toLowerCase()}`}>
                {r.phase}
              </span>
              <h3>{r.title}</h3>
              <p>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
