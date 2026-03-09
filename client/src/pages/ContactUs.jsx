import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Contact Us</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Contact Us
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            For inquiries regarding submissions, issues, or journal information, please contact the editorial office.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Email: <a href="mailto:ijarstjournal@gmail.com" style={{ color: '#F5C400' }}>ijarstjournal@gmail.com</a>
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            WhatsApp: <a href="https://wa.me/447479811823" style={{ color: '#F5C400' }}>+44 7479 811823</a>
          </p>
        </div>
      </section>
    </div>
  );
}
