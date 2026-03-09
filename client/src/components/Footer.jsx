import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0D0D0D', color: '#aaa', padding: '48px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#F5C400', fontWeight: 700, marginBottom: 8 }}>
              IJARST
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              International Journal of Advanced Research in Science & Technology. Open-access, peer-reviewed.
            </p>
          </div>
          <div>
            <div style={{ color: '#F5C400', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Navigation</div>
            {[['/', 'Home'], ['/papers', 'Browse Papers'], ['/submit', 'Submit Paper']].map(([to, label]) => (
              <div key={to} style={{ marginBottom: 8 }}>
                <Link to={to} style={{ color: '#bbb', fontSize: 14, textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
            <div style={{ marginBottom: 8, marginTop: 12 }}>
              <Link to="/x7k-admin/login" style={{ color: '#bbb', fontSize: 14, textDecoration: 'none' }}>Are you an admin?</Link>
            </div>
          </div>
          <div>
            <div style={{ color: '#F5C400', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Contact</div>
            <p style={{ fontSize: 13, lineHeight: 1.8 }}>
              For submissions and inquiries:<br />
              <a href="mailto:ijarstjournal@gmail.com" style={{ color: '#F5C400' }}>ijarstjournal@gmail.com</a>
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
              WhatsApp: <a href="https://wa.me/447479811823" style={{ color: '#F5C400' }} target="_blank" rel="noopener noreferrer">+44 7479 811823</a>
            </p>
            <p style={{ fontSize: 12, marginTop: 12, color: '#666' }}>
              APC: $33 (payable after acceptance only)
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #222', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#555' }}>
          <span>© {new Date().getFullYear()} IJARST. All rights reserved.</span>
          <span>ISSN: NULL</span>          <span><Link to="/x7k-admin/login" style={{ color: '#bbb', fontSize: 12, textDecoration: 'underline' }}>Are you an admin?</Link></span>        </div>
      </div>
    </footer>
  );
}
