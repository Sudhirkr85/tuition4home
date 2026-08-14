'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sudhir@gmail.com');
  const [password, setPassword] = useState('1234567890');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        // Save session locally
        if (typeof window !== 'undefined') {
          localStorage.setItem('tfh_admin_user', JSON.stringify(data.user));
        }
        setTimeout(() => {
          router.push('/admin');
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0B1120', color: '#F8FAFC' }}>
      {/* Top Brand Bar */}
      <header style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={20} color="#22C55E" />
          <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em', color: '#F8FAFC' }}>
            TuitionForHome <span style={{ color: '#22C55E' }}>Admin</span>
          </span>
        </div>
        <a href="/" style={{ color: '#94A3B8', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to Website
        </a>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div
          className="apple-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: '#1E293B',
            color: '#F8FAFC',
            padding: '2.5rem',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid #334155',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22C55E',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC', margin: 0 }}>
              Super Admin Gateway
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
              SSSAM Academy Command Center Authentication
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#E2E8F0' }}>
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sudhir@gmail.com"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFFFFF' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', color: '#E2E8F0' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="form-control"
                  style={{ paddingLeft: '2.5rem', backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFFFFF' }}
                  required
                />
              </div>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
                <CheckCircle2 size={16} />
                <span>Access Granted! Redirecting to Command Center...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', backgroundColor: '#22C55E', fontWeight: 800, border: 'none', color: '#FFFFFF' }}
            >
              <span>{loading ? 'Authenticating...' : 'Access Command Center'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Quick Helper Credentials Card */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#0F172A',
              border: '1px solid #334155',
              fontSize: '0.78rem',
              color: '#94A3B8',
              textAlign: 'center',
            }}
          >
            <div>🔑 <strong>Master Admin Credentials:</strong></div>
            <div style={{ marginTop: '2px' }}>Email: <code style={{ color: '#38BDF8', fontWeight: 700 }}>sudhir@gmail.com</code></div>
            <div>Password: <code style={{ color: '#38BDF8', fontWeight: 700 }}>1234567890</code></div>
          </div>
        </div>
      </main>
    </div>
  );
}
