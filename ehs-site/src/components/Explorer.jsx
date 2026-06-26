import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { allPlanets } from '../data/planets';
import './Explorer.css';

const SORT_OPTIONS = [
  { key: 'EHS', label: 'EHS score' },
  { key: 'distanceLy', label: 'Distance' },
  { key: 'discoveryYear', label: 'Discovery year' },
  { key: 'name', label: 'Name' },
];

export default function Explorer() {
  const ref = useScrollReveal({ y: 30 });
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('EHS');
  const [sortDir, setSortDir] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  const results = useMemo(() => {
    let list = allPlanets.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    if (filterType !== 'all') {
      list = list.filter((p) => p.type === filterType);
    }
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [query, sortKey, sortDir, filterType]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <section className="explorer" id="explorer" ref={ref}>
      <div className="explorer__inner">
        <div className="eyebrow">Explorer</div>
        <h2 className="explorer__title">Browse the candidates</h2>
        <p className="explorer__sub">
          Search, filter, and sort every planet in this dataset &mdash; reference
          worlds and confirmed exoplanets alike.
        </p>

        <div className="explorer__controls">
          <input
            className="explorer__search mono"
            placeholder="Search by name&hellip;"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search planets"
          />
          <div className="explorer__filters">
            <button
              className={`explorer__filter ${filterType === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              className={`explorer__filter ${filterType === 'reference' ? 'is-active' : ''}`}
              onClick={() => setFilterType('reference')}
            >
              Reference
            </button>
            <button
              className={`explorer__filter ${filterType === 'exoplanet' ? 'is-active' : ''}`}
              onClick={() => setFilterType('exoplanet')}
            >
              Exoplanets
            </button>
          </div>
          <div className="explorer__sorts">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                className={`explorer__sort ${sortKey === opt.key ? 'is-active' : ''}`}
                onClick={() => toggleSort(opt.key)}
              >
                {opt.label} {sortKey === opt.key ? (sortDir === 'asc' ? '\u2191' : '\u2193') : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="explorer__grid">
          <AnimatePresence>
            {results.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                className="explorer__card glass-panel"
              >
                <div className="explorer__card-top">
                  <span className="explorer__card-name">{p.name}</span>
                  <span className={`explorer__card-tag ${p.type}`}>
                    {p.type === 'reference' ? 'reference' : 'exoplanet'}
                  </span>
                </div>
                <div className="explorer__card-ehs">
                  <svg viewBox="0 0 36 36" className="explorer__ring">
                    <circle cx="18" cy="18" r="15.5" className="explorer__ring-bg" />
                    <circle
                      cx="18" cy="18" r="15.5"
                      className="explorer__ring-fill"
                      strokeDasharray={`${p.EHS * 97.4} 97.4`}
                    />
                  </svg>
                  <span className="explorer__ehs-value mono">{(p.EHS * 100).toFixed(0)}</span>
                </div>
                <div className="explorer__card-meta mono">
                  <span>R {p.radius.toFixed(2)} R\u2295</span>
                  <span>{p.distanceLy > 0 ? `${p.distanceLy} ly` : 'local'}</span>
                </div>
                <p className="explorer__card-blurb">{p.blurb}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {results.length === 0 && (
          <p className="explorer__empty">No planets match that search.</p>
        )}
      </div>
    </section>
  );
}
