import React from 'react';
import { Link } from 'react-router-dom';

export default function Indexing() {
  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Indexing</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Indexing
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            The journal works to ensure that published articles are discoverable through academic indexing platforms.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Indexing improves research visibility, accessibility, and citation potential for authors.
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            Currently, our journal is not yet indexed in major databases.
          </p>
        </div>
      </section>
    </div>
  );
}
