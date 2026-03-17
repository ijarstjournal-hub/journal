import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function PaperDetails() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citationCopied, setCitationCopied] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`/api/papers/${id}`)
      .then(res => setPaper(res.data))
      .catch(() => setPaper(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Inject Google Scholar meta tags
  useEffect(() => {
    if (!paper) return;
    const metas = [
      { name: 'citation_title', content: paper.title },
      ...( paper.authors?.map(a => ({ name: 'citation_author', content: a.name })) || []),
      { name: 'citation_journal_title', content: 'International Journal of Applied Research in Science & Technology' },
      { name: 'citation_volume', content: paper.volume },
      { name: 'citation_issue', content: paper.issue },
      { name: 'citation_publication_date', content: paper.publicationDate ? new Date(paper.publicationDate).toISOString().split('T')[0] : '' },
      { name: 'citation_doi', content: paper.doi },
      { name: 'citation_issn', content: '2456-9348' },
    ].filter(m => m.content);

    const added = metas.map(m => {
      const tag = document.createElement('meta');
      tag.name = m.name;
      tag.content = m.content;
      document.head.appendChild(tag);
      return tag;
    });

    return () => added.forEach(tag => document.head.removeChild(tag));
  }, [paper]);

  const copyAPA = () => {
    if (!paper) return;
    const authors = paper.authors?.map(a => a.name).join(', ') || '';
    const year = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : 'n.d.';
    const apa = `${authors} (${year}). ${paper.title}. International Journal of Applied Research in Science & Technology, ${paper.volume}(${paper.issue}). https://doi.org/${paper.doi}`;
    navigator.clipboard.writeText(apa);
    setCitationCopied('apa');
    setTimeout(() => setCitationCopied(''), 2000);
  };

  const copyBibtex = () => {
    if (!paper) return;
    const key = `ijarst${paper.volume || ''}${paper.issue || ''}`;
    const year = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : '';
    const authors = paper.authors?.map(a => a.name).join(' and ') || '';
    const bib = `@article{${key},\n  title={${paper.title}},\n  author={${authors}},\n  journal={International Journal of Applied Research in Science & Technology},\n  volume={${paper.volume || ''}},\n  number={${paper.issue || ''}},\n  year={${year}},\n  doi={${paper.doi || ''}}\n}`;
    navigator.clipboard.writeText(bib);
    setCitationCopied('bibtex');
    setTimeout(() => setCitationCopied(''), 2000);
  };

  // NEW: Handle PDF download from GridFS
  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(`/api/papers/${id}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${paper.title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading PDF: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="spinner" style={{ marginTop: 120 }} />;
  if (!paper) return (
    <div style={{ textAlign: 'center', padding: '120px 24px' }}>
      <h2>Paper not found</h2>
      <Link to="/papers" className="btn btn-green" style={{ marginTop: 20, display: 'inline-block' }}>← Back to Papers</Link>
    </div>
  );

  const date = paper.publicationDate ? new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div>
      {/* Professional Journal Header - IJETRM Style */}
      <section style={{ background: '#fff', padding: '40px 0 30px', borderBottom: '2px solid #333' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: '1px', marginBottom: 4, color: '#333' }}>IJARST</div>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>International Journal of Applied Research in Science & Technology</div>
            <div style={{ fontSize: 11, color: '#999', marginBottom: 12 }}>https://ijarst.uk</div>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 2 }}>Volume-{paper.volume || 'XX'} Issue {paper.issue || 'XX'}, {new Date(paper.publicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</div>
            <div style={{ fontSize: 11, color: '#555' }}>ISSN: 2456-9348 | Impact Factor: 8.45</div>
          </div>
        </div>
      </section>

      {/* Regular Header with Title */}
      <section style={{ background: '#0D0D0D', padding: '56px 0 40px', borderBottom: '3px solid #F5C400' }}>
        <div className="container">
          <Link to="/papers" style={{ color: '#F5C400', fontSize: 13, letterSpacing: '0.05em', marginBottom: 20, display: 'inline-block' }}>
            ← Back to Papers
          </Link>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {paper.volume && <span className="badge badge-yellow">Vol. {paper.volume}</span>}
            {paper.issue && <span className="badge" style={{ background: '#333', color: '#fff' }}>Issue {paper.issue}</span>}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px, 3.5vw, 36px)', color: '#fff', maxWidth: 800, lineHeight: 1.25 }}>
            {paper.title}
          </h1>
          {/* View & Download Stats */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 12, color: '#aaa' }}>
            <span>👁 {paper.views || 0} views</span>
            <span>📥 {paper.downloads || 0} downloads</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr min(300px, 30%)', gap: 40, alignItems: 'start' }}>
          {/* Main content */}
          <div>
            {/* Authors */}
            <div style={{ background: '#f9f9f2', border: '1px solid #e8e8d8', padding: '20px 24px', marginBottom: 28 }}>
              <h3 style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>Authors</h3>
              {paper.authors?.map((a, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#1B5E20', fontSize: 15 }}>{a.name}</strong>
                  {a.affiliation && <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{a.affiliation}</div>}
                  {a.email && <div style={{ fontSize: 12, color: '#888' }}>{a.email}</div>}
                </div>
              ))}
            </div>

            {/* Abstract */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 16, color: '#0D0D0D' }}>Abstract</h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#333', borderLeft: '3px solid #F5C400', paddingLeft: 20 }}>
                {paper.abstract}
              </p>
            </div>

            {/* Keywords */}
            {paper.keywords?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: 12 }}>Keywords</h3>
                <div>
                  {paper.keywords.map(kw => (
                    <span key={kw} style={{
                      display: 'inline-block', background: '#f0f0e8', border: '1px solid #d8d8c8',
                      fontSize: 12, padding: '4px 10px', marginRight: 8, marginBottom: 6, color: '#444'
                    }}>{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Citation */}
            <div style={{ background: '#f9f9f2', border: '1px solid #e8e8d8', padding: '20px 24px' }}>
              <h3 style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: 14 }}>Cite This Paper</h3>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={copyAPA} className="btn btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
                  {citationCopied === 'apa' ? '✓ Copied!' : 'Copy APA'}
                </button>
                <button onClick={copyBibtex} className="btn btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}>
                  {citationCopied === 'bibtex' ? '✓ Copied!' : 'Copy BibTeX'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: '#0D0D0D', padding: '24px', marginBottom: 16 }}>
              {/* NEW: Download PDF from GridFS */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="btn btn-yellow"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: 12,
                  fontSize: 13,
                  opacity: downloading ? 0.6 : 1,
                  cursor: downloading ? 'not-allowed' : 'pointer'
                }}
              >
                {downloading ? '📥 Downloading...' : '📥 Download PDF'}
              </button>
              
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.9 }}>
                <div><span style={{ color: '#aaa' }}>Published:</span> <span style={{ color: '#fff' }}>{date}</span></div>
                {paper.doi && <div><span style={{ color: '#aaa' }}>DOI:</span> <span style={{ color: '#F5C400', wordBreak: 'break-all' }}>{paper.doi}</span></div>}
                {paper.volume && <div><span style={{ color: '#aaa' }}>Volume:</span> <span style={{ color: '#fff' }}>{paper.volume}</span></div>}
                {paper.issue && <div><span style={{ color: '#aaa' }}>Issue:</span> <span style={{ color: '#fff' }}>{paper.issue}</span></div>}
                {paper.pdfFile && <div><span style={{ color: '#aaa' }}>File Size:</span> <span style={{ color: '#fff' }}>{(paper.pdfFile.size / 1024 / 1024).toFixed(2)} MB</span></div>}
              </div>
            </div>

            <div style={{ background: '#1B5E20', padding: '20px 24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
                Want to submit your own research?
              </p>
              <Link to="/submit" className="btn btn-yellow" style={{ display: 'block', textAlign: 'center', fontSize: 12 }}>
                Submit Paper
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
