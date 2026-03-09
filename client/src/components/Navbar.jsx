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
    flexWrap: 'wrap',
    gap: 12,
    minHeight: 68,
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
    flexWrap: 'wrap',
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
  const [moreOpen, setMoreOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth <= 720);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) setOpen(true);
    setMoreOpen(false);
  }, [location, isMobile]);

  const moreLinks = [
    { to: '/open-access-policy', label: 'Open Access Policy' },
    { to: '/peer-review-policy', label: 'Peer Review Policy' },
    { to: '/plagiarism-policy', label: 'Plagiarism Policy' },
    { to: '/authors-guide', label: 'Authors Guide' },
    { to: '/aims-scope', label: 'Aims & Scope' },
    { to: '/contact', label: 'Contact Us' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoTop}>IJARST</span>
          <span style={styles.logoSub}>Int'l Journal of Advanced Research</span>
        </Link>

        <div style={{ ...styles.links, display: isMobile && !open ? 'none' : 'flex' }} className="nav-links">
          <Link to="/" style={styles.link(isActive('/'))}>Home</Link>
          <Link to="/issues" style={styles.link(isActive('/issues'))}>Issues</Link>
          <Link to="/indexing" style={styles.link(isActive('/indexing'))}>Indexing</Link>
          <Link to="/editorial-team" style={styles.link(isActive('/editorial-team'))}>Editorial Team</Link>
          <Link to="/publication-ethics" style={styles.link(isActive('/publication-ethics'))}>Publication Ethics</Link>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setMoreOpen(v => !v)}
              style={{
                ...styles.link(false),
                padding: '6px 12px',
                borderBottom: moreOpen ? '2px solid #F5C400' : '2px solid transparent',
                background: 'none',
              }}
            >
              More ▾
            </button>
            {moreOpen && (
              <div style={{
                position: 'absolute',
                top: 40,
                right: 0,
                minWidth: 210,
                background: '#0D0D0D',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6,
                padding: 8,
                boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                zIndex: 200,
              }}>
                {moreLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    style={{
                      ...styles.link(isActive(link.to)),
                      display: 'block',
                      padding: '8px 12px',
                    }}
                    onClick={() => setMoreOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

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
        @media (max-width: 900px) {
          .nav-links a,
          .nav-links button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 720px) {
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
