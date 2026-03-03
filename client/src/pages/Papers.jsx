import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PaperCard from '../components/PaperCard';

export default function Papers() {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPapers = async (q = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/papers${q ? `?search=${encodeURIComponent(q)}` : ''}`);
      setPapers(res.data);
    } catch {
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPapers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPapers(search);
  };

  return (
    <div>
      {/* Header */}
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <span className="badge badge-yellow" style={{ marginBottom: 12 }}>Archive</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', marginBottom: 8 }}>
            Published Papers
          </h1>
          <p style={{ color: '#aaa', fontSize: 15 }}>Browse all peer-reviewed articles published in IJARST</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search */}
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 0, marginBottom: 40, maxWidth: 560 }}>
            <input
              type="text"
              placeholder="Search by title, author, or keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #0D0D0D',
                borderRight: 'none',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button type="submit" className="btn btn-yellow" style={{ borderRadius: 0, padding: '12px 24px' }}>
              Search
            </button>
            {search && (
              <button type="button" onClick={() => { setSearch(''); fetchPapers(); }}
                style={{ padding: '12px 16px', background: '#eee', border: '2px solid #0D0D0D', borderLeft: 'none', fontSize: 13, cursor: 'pointer' }}>
                ✕
              </button>
            )}
          </form>

          {loading ? (
            <div className="spinner" />
          ) : papers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <p style={{ fontSize: 18, marginBottom: 8 }}>No papers found.</p>
              {search && <p>Try a different search term.</p>}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{papers.length} paper{papers.length !== 1 ? 's' : ''} found</p>
              {papers.map(p => <PaperCard key={p._id} paper={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
