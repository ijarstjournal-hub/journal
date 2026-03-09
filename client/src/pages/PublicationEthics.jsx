import React from 'react';
import { Link } from 'react-router-dom';

export default function PublicationEthics() {
  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Publication Ethics</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Publication Ethics
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            The journal follows strict publication ethics to ensure integrity in scholarly publishing.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Authors must submit original work and properly acknowledge all sources. Academic misconduct such as plagiarism or data manipulation is not permitted.
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            Any submissions that violate ethical guidelines may be rejected and reported.
          </p>
        </div>
      </section>
    </div>
  );
}
