import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { allPlanets, critiqueStats } from '../data/planets';
import './Explorer.css';

const SORT_OPTIONS = [
  { key: 'EHS', label: 'EHS score' },
  { key: 'radius', label: 'Radius' },
  { key: 'insolation', label: 'Flux' },
  { key: 'discoveryYear', label: 'Discovery year' },
  { key: 'name', label: 'Name' },
];

const PAGE_SIZE = 120;

function formatNumber(value, digits = 2, fallback = 'n/a') {
  return Number.isFinite(value) ? value.toFixed(digits) : fallback;
}

export default function Explorer() {
  const ref = useScrollReveal({ y: 30 });
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState('EHS');
  const [sortDir, setSortDir] = useState('desc');
  const [filterType, setFilterType] = useState('all');

  const results = useMemo(() => {
    let list = allPlanets.filter((p) =>
      `${p.name} ${p.host ?? ''}`.toLowerCase().includes(query.toLowerCase())
    );
    if (filterType !== 'all') {
      list = list.filter((p) => p.type === filterType);
    }
    list = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv ?? '') : (bv ?? '').localeCompare(av);
      }
      const safeA = Number.isFinite(av) ? av : sortDir === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      const safeB = Number.isFinite(bv) ? bv : sortDir === 'asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
      return sortDir === 'asc' ? safeA - safeB : safeB - safeA;
    });
    return list;
  }, [query, sortKey, sortDir, filterType]);

  const visibleResults = results.slice(0, PAGE_SIZE);

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
          Search, filter, and sort every planet in this dataset - reference
          worlds and confirmed exoplanets alike.
        </p>

        <div className="explorer__controls">
          <input
            className="explorer__search mono"
            placeholder="Search by name..."
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
                {opt.label} {sortKey === opt.key ? (sortDir === 'asc' ? 'up' : 'down') : ''}
              </button>
            ))}
          </div>
        </div>

        <p className="explorer__result-count mono">
          Showing {Math.min(visibleResults.length, PAGE_SIZE).toLocaleString()} of{' '}
          {results.length.toLocaleString()} matches from {critiqueStats.totalScored.toLocaleString()} scored exoplanets.
        </p>

        <div className="explorer__grid">
          <AnimatePresence>
            {visibleResults.map((p) => (
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
                  <span>R {formatNumber(p.radius)} Earth</span>
                  <span>Flux {formatNumber(p.insolation)}</span>
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
