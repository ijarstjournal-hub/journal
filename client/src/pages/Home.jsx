import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PaperCard from '../components/PaperCard';

export default function Home() {
  const [latestPapers, setLatestPapers] = useState([]);

  useEffect(() => {
    axios.get('/api/papers').then(res => setLatestPapers(res.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* INFO BANNER */}
      <section style={{
        background: '#4169E1',
        padding: '12px 0',
        color: '#fff',
        fontSize: 14,
      }}>
        <div className="marquee-banner">
          <div className="marquee-content">
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>📞 Call Us/WhatsApp:</strong> <a href="tel:+447479811823" style={{ color: '#fff', textDecoration: 'underline' }}>04407344596</a></span>
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>✉️ Email Your Paper To:</strong> <a href="mailto:ijetrm@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>ijetrm@gmail.com, editor@ijetrm.com</a></span>
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>⚡ Fast Publication</strong> International Journal With Highest Impact Factor</span>
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>📞 Call Us/WhatsApp:</strong> <a href="tel:+447479811823" style={{ color: '#fff', textDecoration: 'underline' }}>04407344596</a></span>
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>✉️ Email Your Paper To:</strong> <a href="mailto:ijetrm@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>ijetrm@gmail.com, editor@ijetrm.com</a></span>
            <span style={{ marginRight: '60px', display: 'inline-block' }}><strong>⚡ Fast Publication</strong> International Journal With Highest Impact Factor</span>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section style={{
        background: '#0D0D0D',
        color: '#fff',
        padding: '96px 0 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(245,196,0,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -1, left: 0, right: 0,
          height: 4, background: '#F5C400',
        }} />

        <div className="container">
          <span className="badge badge-yellow" style={{ marginBottom: 20 }}>Open Access · Peer Reviewed</span>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(64px, 10vw, 120px)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: 30,
            color: '#F5C400',
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
          }}>
            IJARST
          </h1>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 680,
            marginBottom: 20,
            letterSpacing: '0.02em',
          }}>
            International Journal of Advanced Research in Science & Technology
          </h2>
          <p style={{ fontSize: 16, color: '#F5C400', marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
            🇬🇧
          </p>
          <p style={{ fontSize: 18, color: '#bbb', maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
            IJARST is an open-access academic journal dedicated to publishing quality research across science, engineering, and technology disciplines.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/papers" className="btn btn-yellow">Browse Publications</Link>
            <Link to="/submit" className="btn btn-outline-white">Submit Your Paper</Link>
          </div>

          {/* APC notice */}
          <div style={{
            marginTop: 48,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(245,196,0,0.1)',
            border: '1px solid rgba(245,196,0,0.3)',
            padding: '10px 18px',
          }}>
            <span style={{ color: '#F5C400', fontSize: 18 }}>ℹ</span>
            <span style={{ fontSize: 13, color: '#ddd' }}>
              <strong style={{ color: '#F5C400' }}>APC Notice:</strong> A $33 Article Processing Charge applies — payable only after acceptance.
            </span>
          </div>
        </div>
      </section>

      {/* SCOPE & AIM */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ maxWidth: 780 }}>
            <span className="badge badge-green" style={{ marginBottom: 16 }}>Scope & Aims</span>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', marginBottom: 20 }}>What We Publish</h2>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
              IJARST welcomes original research articles, review papers, and short communications in all areas of science and technology. We are committed to timely peer review and open dissemination of knowledge.
            </p>
            <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
              Subject areas include — but are not limited to — computer science, applied physics, environmental science, biomedical engineering, mathematics, electrical engineering, materials science, and related interdisciplinary fields.
            </p>
          </div>
        </div>
      </section>

      {/* LATEST PUBLICATIONS */}
      {latestPapers.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <span className="badge badge-black" style={{ marginBottom: 12 }}>Recent</span>
                <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>Latest Publications</h2>
              </div>
              <Link to="/papers" className="btn btn-outline" style={{ fontSize: 12, padding: '8px 18px' }}>View All →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {latestPapers.map(p => <PaperCard key={p._id} paper={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL POLICY */}
      <section className="section section-alt">
        <div className="container">
          <span className="badge badge-yellow" style={{ marginBottom: 16 }}>Policies</span>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', marginBottom: 32 }}>Editorial Policy</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { title: 'Peer Review', desc: 'All manuscripts undergo double-blind peer review by qualified experts in the relevant field.' },
              { title: 'Originality', desc: 'Submitted work must be original and not under consideration elsewhere. Plagiarism is strictly checked.' },
              { title: 'Open Access', desc: 'All published papers are freely available to the public with no subscription required.' },
              { title: 'Ethics', desc: 'Authors are expected to follow standard research and publication ethics guidelines.' },
            ].map(item => (
              <div key={item.title} style={{
                background: '#fff',
                padding: '24px',
                borderTop: '3px solid #F5C400',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 10, color: '#1B5E20' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#1B5E20', padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 3vw, 36px)', color: '#fff', marginBottom: 16 }}>
            Ready to Submit Your Research?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 28 }}>
            Send your paper via email. $33 APC payable only after acceptance.
          </p>
          <Link to="/submit" className="btn btn-yellow">Submit a Paper</Link>
        </div>
      </section>
    </div>
  );
}
