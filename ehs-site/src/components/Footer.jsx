import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand mono">EHS</span>
        <p>
          Exoplanet Habitability Score - a multi-parameter metric for assessing
          planetary habitability. Built on data from the NASA Exoplanet Archive.
        </p>
        <div className="footer__meta mono">
          <span>5,757 planets scored</span>
          <span>&middot;</span>
          <span>6 weighted factors</span>
          <span>&middot;</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
