'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        if (typeof window !== 'undefined') {
          const session = {
            ...data.user,
            loginAt: Date.now(),
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          };
          localStorage.setItem('tfh_admin_user', JSON.stringify(session));
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(circle at 50% 20%, #0F172A 0%, #020617 100%)',
      color: '#F8FAFC',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Top Header Navigation */}
      <header style={{
        padding: '1.25rem 2.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(15, 23, 42, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'rgba(13, 148, 136, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(13, 148, 136, 0.4)'
          }}>
            <ShieldCheck size={20} color="#0D9488" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', color: '#F8FAFC' }}>
              TuitionForHome <span style={{ color: '#0D9488' }}>Admin Portal</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#94A3B8' }}>SSSAM Academy Gurgaon</span>
          </div>
        </div>

        <a
          href="/"
          style={{
            color: '#94A3B8',
            fontSize: '0.82rem',
            textDecoration: 'none',
            fontWeight: 600,
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back to Main Site
        </a>
      </header>

      {/* Main Authentication Card Area */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(20px)',
            color: '#F8FAFC',
            padding: '2.5rem 2.25rem',
            borderRadius: '24px',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Gateway Header Badge */}
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '18px',
                backgroundColor: 'rgba(13, 148, 136, 0.15)',
                color: '#0D9488',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1.5px solid rgba(13, 148, 136, 0.3)'
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#F8FAFC', margin: 0, letterSpacing: '-0.02em' }}>
              Super Admin Gateway
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginTop: '6px', lineHeight: 1.4 }}>
              SSSAM Academy Command Center Authentication
            </p>
          </div>

          {/* Login Form (Auto-Fill Disabled) */}
          <form onSubmit={handleLogin} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
            {/* Hidden dummy inputs to prevent browser auto-fill algorithms */}
            <input type="text" style={{ display: 'none' }} tabIndex={-1} />
            <input type="password" style={{ display: 'none' }} tabIndex={-1} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.84rem', color: '#CBD5E1' }}>
                Admin Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                />
                <input
                  type="email"
                  name="admin_login_email_field"
                  id="admin_login_email_field"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.65rem',
                    backgroundColor: '#020617',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.84rem', color: '#CBD5E1' }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                />
                <input
                  type="password"
                  name="admin_login_pass_field"
                  id="admin_login_pass_field"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem 0.8rem 2.65rem',
                    backgroundColor: '#020617',
                    border: '1.5px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  required
                />
              </div>
            </div>

            {error && (
              <div style={{
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                fontSize: '0.83rem',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div style={{
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(13, 148, 136, 0.15)',
                color: '#2DD4BF',
                fontSize: '0.83rem',
                fontWeight: 650,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1px solid rgba(13, 148, 136, 0.3)'
              }}>
                <CheckCircle2 size={18} />
                <span>Access Granted! Redirecting to Command Center...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.85rem 1.5rem',
                marginTop: '0.5rem',
                backgroundColor: '#0D9488',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(13, 148, 136, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{loading ? 'Authenticating Credentials...' : 'Access Command Center'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
