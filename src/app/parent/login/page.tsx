'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Mail, ArrowRight, CheckCircle2, Lock, Sparkles, Star, UserCheck } from 'lucide-react';

export default function ParentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // If already logged in, redirect to parent dashboard
  useEffect(() => {
    const saved = localStorage.getItem('parent_session');
    if (saved) {
      router.push('/parent/dashboard');
    }
  }, [router]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/parent/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_OTP',
          email,
          parentName,
          phone
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('OTP');
        setSuccessMsg(data.message || 'OTP sent successfully!');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/parent/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_OTP',
          email,
          otpCode,
          parentName,
          phone
        }),
      });
      const data = await res.json();
      if (data.success && data.parent) {
        localStorage.setItem('parent_session', JSON.stringify(data.parent));
        // Also fire custom event so navbar updates
        window.dispatchEvent(new Event('storage'));
        router.push('/parent/dashboard');
      } else {
        setErrorMsg(data.error || 'Invalid OTP code.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google 1-Click Login Simulation
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const googleEmail = email || 'parent.user@gmail.com';
      const googleName = parentName || 'Verified Parent';

      const res = await fetch('/api/auth/parent/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GOOGLE_LOGIN',
          email: googleEmail,
          parentName: googleName
        }),
      });
      const data = await res.json();
      if (data.success && data.parent) {
        localStorage.setItem('parent_session', JSON.stringify(data.parent));
        window.dispatchEvent(new Event('storage'));
        router.push('/parent/dashboard');
      } else {
        setErrorMsg(data.error || 'Google login failed.');
      }
    } catch {
      setErrorMsg('Google login connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2.5rem',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(13, 148, 136, 0.06)',
          border: '1.5px solid var(--border-hairline)',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.25rem 0.75rem',
              borderRadius: '999px',
              border: '1px solid #A7F3D0',
              marginBottom: '0.85rem'
            }}>
              <ShieldCheck size={14} />
              <span>PARENT PORTAL • SSSAM ACADEMY</span>
            </div>

            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Parent Sign In
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Manage demo classes, view matched home tutors &amp; post verified reviews.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              borderRadius: '10px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              border: '1px solid #FECACA'
            }}>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              borderRadius: '10px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              border: '1px solid #A7F3D0'
            }}>
              {successMsg}
            </div>
          )}

          {/* Google 1-Click Login Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.8rem 1rem',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
              marginBottom: '1.25rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>OR EMAIL OTP</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-hairline)' }} />
          </div>

          {step === 'INPUT' ? (
            <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Parent / Guardian Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Sunita Goel"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label className="form-label">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.35rem', backgroundColor: 'var(--brand-teal)' }}
              >
                <span>{loading ? 'Sending OTP...' : 'Send 6-Digit OTP'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Enter the 6-digit OTP code sent to <strong>{email}</strong>
                </span>
                <div style={{ marginTop: '0.3rem' }}>
                  <button
                    type="button"
                    onClick={() => { setStep('INPUT'); setErrorMsg(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-teal)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Change Email Address
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="form-control"
                  style={{ fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', letterSpacing: '0.35em' }}
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', textAlign: 'center', marginTop: '0.35rem' }}>
                  Instant Test Code: <strong>123456</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
              >
                <span>{loading ? 'Verifying...' : 'Verify OTP & Sign In'}</span>
                <CheckCircle2 size={16} />
              </button>
            </form>
          )}

          {/* SSSAM Academy Trust Guarantee Footer */}
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-hairline)',
            textAlign: 'center',
            fontSize: '0.74rem',
            color: 'var(--text-light)'
          }}>
            <span>🔒 Supervised by SSSAM Academy • Sector 14, Gurugram</span>
            <div style={{ marginTop: '0.3rem' }}>
              <Link href="/tutor/register" style={{ color: 'var(--brand-teal)', fontWeight: 700, textDecoration: 'none' }}>
                Are you a tutor? Sign in here →
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
