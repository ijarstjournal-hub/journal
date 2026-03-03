import React from 'react';
import { Link } from 'react-router-dom';

export default function PaperCard({ paper }) {
  const authors = paper.authors?.map(a => a.name).join(', ') || 'Unknown';
  const preview = paper.abstract?.slice(0, 180) + (paper.abstract?.length > 180 ? '…' : '');
  const date = paper.publicationDate ? new Date(paper.publicationDate).getFullYear() : '';

  return (
    <article style={{
      background: '#fff',
      border: '1px solid #e8e8e0',
      borderLeft: '4px solid #F5C400',
      padding: '24px 28px',
      transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {paper.volume && <span className="badge badge-green">Vol. {paper.volume}</span>}
        {paper.issue && <span className="badge badge-black">Issue {paper.issue}</span>}
        {date && <span style={{ fontSize: 12, color: '#888', alignSelf: 'center' }}>{date}</span>}
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 8, color: '#0D0D0D', lineHeight: 1.3 }}>
        <Link to={`/papers/${paper._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {paper.title}
        </Link>
      </h3>

      <p style={{ fontSize: 13, color: '#555', marginBottom: 10 }}>
        <strong style={{ color: '#1B5E20' }}>Authors:</strong> {authors}
      </p>

      <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 14 }}>{preview}</p>

      {paper.keywords?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {paper.keywords.slice(0, 4).map(kw => (
            <span key={kw} style={{
              display: 'inline-block',
              background: '#f5f5ee',
              border: '1px solid #ddd',
              fontSize: 11,
              padding: '2px 8px',
              marginRight: 6,
              marginBottom: 4,
              borderRadius: 2,
              color: '#555',
            }}>{kw}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to={`/papers/${paper._id}`} className="btn btn-outline" style={{ fontSize: 12, padding: '8px 18px' }}>
          View Details
        </Link>
        {paper.pdfUrl && (
          <a href={paper.pdfUrl} target="_blank" rel="noreferrer" className="btn btn-green" style={{ fontSize: 12, padding: '8px 18px' }}>
            ↓ Download PDF
          </a>
        )}
        {paper.doi && (
          <span style={{ fontSize: 12, color: '#888' }}>DOI: {paper.doi}</span>
        )}
      </div>
    </article>
  );
}
