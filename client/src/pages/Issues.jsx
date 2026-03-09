import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PaperCard from '../components/PaperCard';

export default function Issues() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/papers')
      .then(res => setPapers(res.data))
      .catch(() => setPapers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Home
          </Link>
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Issues</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Issues
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>
            The Issues section contains all published volumes and issues of the journal.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 16 }}>
            Each issue includes peer-reviewed research papers from scholars and researchers in various scientific and technological fields.
          </p>
          <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
            Readers can browse, read, and download articles from current and past issues.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            <div>
              <span className="badge badge-black" style={{ marginBottom: 12 }}>All Papers</span>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>All Published Papers</h2>
            </div>
          </div>

          {loading ? (
            <p style={{ fontSize: 15, color: '#555' }}>Loading papers…</p>
          ) : papers.length === 0 ? (
            <p style={{ fontSize: 15, color: '#555' }}>No published papers are available yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              {papers.map(paper => <PaperCard key={paper._id} paper={paper} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
