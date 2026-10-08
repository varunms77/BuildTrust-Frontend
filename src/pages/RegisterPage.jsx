import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roles = [
  { value: 'customer', label: 'Customer', icon: '🛒', desc: 'Browse & order materials' },
  { value: 'owner', label: 'Construction Owner', icon: '🏗️', desc: 'Sell & manage materials' },
  { value: 'admin', label: 'Admin', icon: '⚙️', desc: 'Platform administration' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', phone: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(form);
      const path = user.role === 'admin' ? '/admin' : user.role === 'owner' ? '/owner' : '/customer';
      navigate(path);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">B</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the BuildTrust network</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="auth-roles">
            {roles.map((r) => (
              <div key={r.value}
                className={`auth-role-card ${form.role === r.value ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: r.value })}>
                <span className="auth-role-icon">{r.icon}</span>
                <span className="auth-role-label">{r.label}</span>
                <span className="auth-role-desc">{r.desc}</span>
              </div>
            ))}
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          <div className="auth-row">
            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div className="auth-field">
              <label>Phone (optional)</label>
              <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          {form.role === 'owner' && (
            <div className="auth-field">
              <label>Company Name</label>
              <input type="text" placeholder="Your Construction Company" value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'} {!loading && <span className="hud-btn-arrow">→</span>}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </motion.div>
  );
}
