import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/x7k-admin/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '12px 14px',
    border: '2px solid #333', background: '#111',
    color: '#fff', fontSize: 14, outline: 'none',
    marginBottom: 16,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#F5C400', fontWeight: 700 }}>IJARST</div>
          <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Admin Access</div>
        </div>

        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '36px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 22, marginBottom: 24 }}>Sign In</h2>

          {error && (
            <div style={{ background: '#2a0a0a', border: '1px solid #c00', color: '#f88', padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={{ color: '#aaa', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} placeholder="admin@example.com" />

            <label style={{ color: '#aaa', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ ...inp, marginBottom: 24 }} placeholder="••••••••" />

            <button type="submit" disabled={loading} className="btn btn-yellow" style={{ width: '100%', padding: '13px', fontSize: 14 }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#444', fontSize: 12, marginTop: 20 }}>
          This page is not publicly linked.
        </p>
      </div>
    </div>
  );
}
