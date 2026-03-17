import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EMPTY_PAPER = {
  title: '', abstract: '', keywords: '',
  volume: '', issue: '', publicationDate: '',
  pdfFileId: '', pdfFileName: '', pdfFileSize: 0, // Changed from pdfUrl
  authors: [{ name: '', affiliation: '', email: '' }],
  published: false,
};

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // list | form
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_PAPER);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/papers/admin/all', { withCredentials: true });
      setPapers(res.data);
    } catch {
      setPapers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPapers(); }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/x7k-admin/login');
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_PAPER);
    setView('form');
    setMsg('');
  };

  const openEdit = (paper) => {
    setEditing(paper._id);
    setForm({
      ...paper,
      keywords: Array.isArray(paper.keywords) ? paper.keywords.join(', ') : paper.keywords || '',
      publicationDate: paper.publicationDate ? new Date(paper.publicationDate).toISOString().split('T')[0] : '',
      authors: paper.authors?.length ? paper.authors : [{ name: '', affiliation: '', email: '' }],
      pdfFileId: paper.pdfFile?.fileId || '',
      pdfFileName: paper.pdfFile?.filename || '',
      pdfFileSize: paper.pdfFile?.size || 0,
    });
    setView('form');
    setMsg('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this paper?')) return;
    await axios.delete(`/api/papers/admin/${id}`, { withCredentials: true });
    fetchPapers();
  };

  const handleTogglePublish = async (id) => {
    await axios.patch(`/api/papers/admin/${id}/publish`, {}, { withCredentials: true });
    fetchPapers();
  };

  const handleFormChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleAuthorChange = (index, field, value) => {
    const authors = [...form.authors];
    authors[index] = { ...authors[index], [field]: value };
    setForm(f => ({ ...f, authors }));
  };

  const addAuthor = () => setForm(f => ({ ...f, authors: [...f.authors, { name: '', affiliation: '', email: '' }] }));
  const removeAuthor = (i) => setForm(f => ({ ...f, authors: f.authors.filter((_, idx) => idx !== i) }));

  // NEW: Handle PDF file upload
  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.type !== 'application/pdf') {
      setMsg('Error: Only PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMsg('Error: File exceeds 10MB limit');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await axios.post('/api/papers/admin/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      setForm(f => ({
        ...f,
        pdfFileId: res.data.fileId,
        pdfFileName: res.data.filename,
        pdfFileSize: res.data.size
      }));

      setMsg(`✓ PDF uploaded successfully (${(res.data.size / 1024 / 1024).toFixed(2)}MB)`);
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'Failed to upload PDF'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      // Validate PDF is uploaded
      if (!form.pdfFileId) {
        setMsg('Error: PDF file is required');
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        keywords: typeof form.keywords === 'string' ? form.keywords.split(',').map(k => k.trim()).filter(Boolean) : form.keywords,
      };

      if (editing) {
        await axios.put(`/api/papers/admin/${editing}`, payload, { withCredentials: true });
        setMsg('Paper updated successfully.');
      } else {
        await axios.post('/api/papers/admin/create', payload, { withCredentials: true });
        setMsg('Paper created successfully.');
      }

      fetchPapers();
      setTimeout(() => { setView('list'); setMsg(''); }, 1500);
    } catch (err) {
      setMsg('Error: ' + (err?.response?.data?.message || 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const inp = (extra = {}) => ({
    width: '100%', padding: '10px 12px',
    border: '1px solid #333', background: '#1a1a1a',
    color: '#fff', fontSize: 14, outline: 'none',
    marginBottom: 14, ...extra,
  });

  const label = { color: '#aaa', fontSize: 12, display: 'block', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', color: '#fff' }}>
      {/* Top bar */}
      <div style={{ background: '#111', borderBottom: '2px solid #F5C400', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", color: '#F5C400', fontSize: 20, fontWeight: 700 }}>IJARST</span>
          <span style={{ color: '#555', fontSize: 13 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>{admin?.email}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>
            Log Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {view === 'list' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>All Papers</h1>
              <button onClick={openNew} className="btn btn-yellow" style={{ fontSize: 13 }}>+ Add Paper</button>
            </div>

            {loading ? <div className="spinner" /> : papers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, color: '#555' }}>No papers yet. Click "Add Paper" to get started.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {papers.map(p => (
                  <div key={p._id} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderLeft: `4px solid ${p.published ? '#4CAF50' : '#555'}`, padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        {p.authors?.map(a => a.name).join(', ')} · Vol. {p.volume}, Issue {p.issue}
                      </div>
                      {p.doi && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>DOI: {p.doi}</div>}
                      {p.pdfFile && <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>📄 {(p.pdfFile.size / 1024 / 1024).toFixed(2)}MB</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, padding: '3px 8px', background: p.published ? '#1B5E20' : '#333', color: p.published ? '#afffaf' : '#aaa' }}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                      <button onClick={() => handleTogglePublish(p._id)} style={{ background: '#F5C400', color: '#000', border: 'none', padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        {p.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button onClick={() => openEdit(p)} style={{ background: '#222', color: '#fff', border: '1px solid #444', padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p._id)} style={{ background: '#2a0a0a', color: '#f88', border: '1px solid #600', padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
              <button onClick={() => setView('list')} style={{ background: 'transparent', border: 'none', color: '#F5C400', fontSize: 13, cursor: 'pointer' }}>← Back</button>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26 }}>{editing ? 'Edit Paper' : 'Add New Paper'}</h1>
            </div>

            {msg && (
              <div style={{ background: msg.startsWith('Error') ? '#2a0a0a' : '#0a2a0a', border: `1px solid ${msg.startsWith('Error') ? '#c00' : '#0a0'}`, color: msg.startsWith('Error') ? '#f88' : '#8f8', padding: '10px 14px', fontSize: 13, marginBottom: 20 }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ maxWidth: 740 }}>
              <label style={label}>Title *</label>
              <input required value={form.title} onChange={e => handleFormChange('title', e.target.value)} style={inp()} placeholder="Full paper title" />

              <label style={label}>Abstract *</label>
              <textarea required value={form.abstract} onChange={e => handleFormChange('abstract', e.target.value)} rows={6} style={inp({ resize: 'vertical' })} placeholder="Paper abstract…" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={label}>Volume</label>
                  <input value={form.volume} onChange={e => handleFormChange('volume', e.target.value)} style={inp()} placeholder="e.g. 1" />
                </div>
                <div>
                  <label style={label}>Issue</label>
                  <input value={form.issue} onChange={e => handleFormChange('issue', e.target.value)} style={inp()} placeholder="e.g. 1" />
                </div>
              </div>

              <label style={label}>Publication Date</label>
              <input type="date" value={form.publicationDate} onChange={e => handleFormChange('publicationDate', e.target.value)} style={inp()} />

              {/* NEW: PDF File Upload (replacing PDF URL) */}
              <label style={label}>PDF File * (Max 10MB)</label>
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  disabled={uploading}
                  style={{
                    display: 'none',
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #333',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: 14,
                    cursor: 'pointer'
                  }}
                  id="pdf-input"
                />
                <label
                  htmlFor="pdf-input"
                  style={{
                    display: 'block',
                    padding: '10px 12px',
                    border: '2px dashed #444',
                    background: '#111',
                    color: '#aaa',
                    fontSize: 14,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    opacity: uploading ? 0.6 : 1,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => { if (!uploading) e.target.style.borderColor = '#F5C400'; }}
                  onMouseLeave={e => { e.target.style.borderColor = '#444'; }}
                >
                  {uploading ? `Uploading... ${uploadProgress}%` : form.pdfFileName ? `✓ ${form.pdfFileName}` : '📁 Click to upload PDF or drag & drop'}
                </label>
              </div>

              <label style={label}>DOI (auto-generated if left blank)</label>
              <input value={form.doi} onChange={e => handleFormChange('doi', e.target.value)} style={inp()} placeholder="10.5678/ijarst.v…" />

              <label style={label}>Keywords (comma-separated)</label>
              <input value={form.keywords} onChange={e => handleFormChange('keywords', e.target.value)} style={inp()} placeholder="machine learning, neural networks, deep learning" />

              {/* Authors */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={label}>Authors</span>
                  <button type="button" onClick={addAuthor} style={{ background: '#1B5E20', color: '#fff', border: 'none', padding: '5px 12px', fontSize: 12, cursor: 'pointer' }}>+ Add Author</button>
                </div>
                {form.authors.map((a, i) => (
                  <div key={i} style={{ background: '#111', border: '1px solid #2a2a2a', padding: '14px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#888', fontSize: 12 }}>Author {i + 1}</span>
                      {form.authors.length > 1 && (
                        <button type="button" onClick={() => removeAuthor(i)} style={{ background: 'transparent', border: 'none', color: '#f88', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                      )}
                    </div>
                    <input value={a.name} onChange={e => handleAuthorChange(i, 'name', e.target.value)} style={inp({ marginBottom: 8 })} placeholder="Full name *" />
                    <input value={a.affiliation} onChange={e => handleAuthorChange(i, 'affiliation', e.target.value)} style={inp({ marginBottom: 8 })} placeholder="Institution / Affiliation" />
                    <input value={a.email} onChange={e => handleAuthorChange(i, 'email', e.target.value)} style={inp({ marginBottom: 0 })} placeholder="Email address" />
                  </div>
                ))}
              </div>

              <label style={{ ...label, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.published} onChange={e => handleFormChange('published', e.target.checked)} />
                <span>Publish immediately</span>
              </label>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button type="submit" disabled={saving || uploading} className="btn btn-yellow" style={{ fontSize: 14, padding: '12px 28px', opacity: saving || uploading ? 0.6 : 1 }}>
                  {saving ? 'Saving…' : editing ? 'Update Paper' : 'Create Paper'}
                </button>
                <button type="button" onClick={() => setView('list')} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '12px 20px', fontSize: 14, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
