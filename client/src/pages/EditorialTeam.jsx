import React from 'react';
import { Link } from 'react-router-dom';

export default function EditorialTeam() {
  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Editorial Team</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Editorial Team
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            The Editorial Team consists of qualified researchers and academics responsible for maintaining the journal’s scholarly standards.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Our team oversees manuscript evaluation, peer review, and editorial decisions to ensure the highest quality of published research.
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            We welcome collaboration with experts from across science and technology disciplines.
          </p>
        </div>
      </section>
    </div>
  );
}
