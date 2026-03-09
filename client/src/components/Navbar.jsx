import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  nav: {
    background: '#0D0D0D',
    borderBottom: '3px solid #F5C400',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1,
  },
  logoTop: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: '#F5C400',
    letterSpacing: '0.05em',
  },
  logoSub: {
    fontSize: 10,
    color: '#aaa',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  links: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  link: (active) => ({
    color: active ? '#F5C400' : '#ccc',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '6px 12px',
    borderBottom: active ? '2px solid #F5C400' : '2px solid transparent',
    transition: 'color 0.2s',
    textDecoration: 'none',
  }),
  submitBtn: {
    background: '#1B5E20',
    color: '#fff',
    padding: '8px 18px',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: 5,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 4,
  },
  bar: {
    width: 24,
    height: 2,
    background: '#F5C400',
    display: 'block',
  },
};

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  useEffect(() => setOpen(false), [location]);

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoTop}>IJARST</span>
          <span style={styles.logoSub}>Int'l Journal of Advanced Research</span>
        </Link>

        <div style={{ ...styles.links, display: open ? 'flex' : undefined }}
          className="nav-links">
          <Link to="/" style={styles.link(isActive('/'))}>Home</Link>
          <Link to="/issues" style={styles.link(isActive('/issues'))}>Issues</Link>
          <Link to="/indexing" style={styles.link(isActive('/indexing'))}>Indexing</Link>
          <Link to="/editorial-team" style={styles.link(isActive('/editorial-team'))}>Editorial Team</Link>
          <Link to="/publication-ethics" style={styles.link(isActive('/publication-ethics'))}>Publication Ethics</Link>
          <Link to="/open-access-policy" style={styles.link(isActive('/open-access-policy'))}>Open Access Policy</Link>
          <Link to="/peer-review-policy" style={styles.link(isActive('/peer-review-policy'))}>Peer Review Policy</Link>
          <Link to="/plagiarism-policy" style={styles.link(isActive('/plagiarism-policy'))}>Plagiarism Policy</Link>
          <Link to="/authors-guide" style={styles.link(isActive('/authors-guide'))}>Authors Guide</Link>
          <Link to="/aims-scope" style={styles.link(isActive('/aims-scope'))}>Aims & Scope</Link>
          <Link to="/contact" style={styles.link(isActive('/contact'))}>Contact Us</Link>
          <Link to="/submit" style={styles.submitBtn}>Submit Paper</Link>
        </div>

        <button style={{ ...styles.hamburger, display: 'none' }}
          className="hamburger" onClick={() => setOpen(!open)}
          aria-label="Toggle menu">
          <span style={styles.bar} />
          <span style={styles.bar} />
          <span style={styles.bar} />
        </button>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .nav-links {
            display: ${open ? 'flex' : 'none'} !important;
            flex-direction: column;
            position: absolute;
            top: 68px;
            left: 0; right: 0;
            background: #0D0D0D;
            padding: 16px 24px;
            border-top: 1px solid #333;
            gap: 12px !important;
          }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
