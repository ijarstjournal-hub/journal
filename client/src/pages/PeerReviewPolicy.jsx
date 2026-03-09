import React from 'react';
import { Link } from 'react-router-dom';

export default function PeerReviewPolicy() {
  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Peer Review Policy</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Peer Review Policy
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            All submitted manuscripts undergo a peer review process.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Experts in relevant fields evaluate submissions for originality, quality, and academic contribution before publication.
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            Peer review helps ensure the reliability and rigor of published research.
          </p>
        </div>
      </section>
    </div>
  );
}
