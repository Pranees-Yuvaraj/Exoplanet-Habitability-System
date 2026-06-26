import { useEffect, useState } from 'react';
import './Nav.css';

const LINKS = [
  { href: '#motivation', label: 'Motivation' },
  { href: '#formula', label: 'Formula' },
  { href: '#parameters', label: 'Parameters' },
  { href: '#dashboard', label: 'Compare' },
  { href: '#critique', label: 'Critique' },
  { href: '#explorer', label: 'Explorer' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#hero" className="nav__brand mono">EHS</a>
      <div className="nav__links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="nav__link">
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
