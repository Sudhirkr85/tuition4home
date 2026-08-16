'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff, Phone } from 'lucide-react';

export default function CounselorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/counselor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        if (typeof window !== 'undefined') {
          // Store with 30-day expiry timestamp
          const session = {
            ...data.user,
            loginAt: Date.now(),
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
          };
          localStorage.setItem('tfh_counselor_user', JSON.stringify(session));
        }
        setTimeout(() => {
          router.push('/counselor');
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch {
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
      {/* Top Header */}
      <header style={{
        padding: '1.25rem 2.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(15,23,42,0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'rgba(13,148,136,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(13,148,136,0.4)'
          }}>
            <Phone size={18} color="#0D9488" />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em', color: '#F8FAFC' }}>
              TuitionForHome <span style={{ color: '#0D9488' }}>Counselor Portal</span>
            </span>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '1px' }}>SSSAM Academy, Gurugram</div>
          </div>
        </div>
        <a href="/" style={{ fontSize: '0.8rem', color: '#94A3B8', textDecoration: 'none' }}>← Back to Website</a>
      </header>

      {/* Main Login Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(15,23,42,0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              backgroundColor: 'rgba(13,148,136,0.15)',
              border: '1.5px solid rgba(13,148,136,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <ShieldCheck size={30} color="#0D9488" />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
              Counselor Login
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: '0.5rem 0 0 0', lineHeight: 1.5 }}>
              Login with your SSSAM Counselor credentials to access the Lead & Tutor Allocation Portal.
            </p>
          </div>

          {success ? (
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(5,150,105,0.1)',
              border: '1px solid rgba(5,150,105,0.3)',
              borderRadius: '14px'
            }}>
              <CheckCircle2 size={36} color="#10B981" style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 700, color: '#10B981', fontSize: '1rem' }}>Login Successful!</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.3rem' }}>Redirecting to Counselor Dashboard...</div>
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 0.9rem 0.8rem 2.5rem',
                      backgroundColor: 'rgba(15,23,42,0.8)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', marginBottom: '0.4rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 2.8rem 0.8rem 2.5rem',
                      backgroundColor: 'rgba(15,23,42,0.8)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      color: '#F8FAFC',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.9rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '0.7rem 1rem',
                  backgroundColor: 'rgba(220,38,38,0.1)',
                  border: '1px solid rgba(220,38,38,0.3)',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#FCA5A5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  backgroundColor: loading ? '#0F766E' : '#0D9488',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  opacity: loading ? 0.8 : 1,
                }}
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login to Counselor Portal</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Note */}
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#475569', margin: 0 }}>
                Counselor accounts are created by the Super Admin only.
              </p>
            </form>
          )}
        </div>
      </div>

      <footer style={{ padding: '1.25rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', color: '#334155' }}>
        © 2026 TuitionForHome · SSSAM Academy, Sector 14, Gurugram · +91 92170 31899
      </footer>
    </div>
  );
}
