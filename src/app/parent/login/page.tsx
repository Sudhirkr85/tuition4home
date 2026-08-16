'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Star,
  UserCheck,
  Phone,
  ChevronRight,
  Building2,
  BookOpen,
  Award,
  Clock,
  User,
  HeartHandshake,
} from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

export default function ParentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'INPUT' | 'OTP' | 'PHONE'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [verifiedParent, setVerifiedParent] = useState<any>(null);

  // If already logged in, redirect to parent dashboard
  useEffect(() => {
    const saved = localStorage.getItem('parent_session');
    if (saved) {
      router.push('/parent/dashboard');
    }
  }, [router]);

  // Step 1: Send OTP to Email
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('OTP');
        setSuccessMsg(data.message || 'Verification code sent to your email.');
      } else {
        setErrorMsg(data.error || 'Failed to send verification code.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Email OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter the complete 6-digit code.');
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
        }),
      });
      const data = await res.json();
      if (data.success && data.parent) {
        setVerifiedParent(data.parent);
        localStorage.setItem('parent_session', JSON.stringify(data.parent));
        window.dispatchEvent(new Event('storage'));

        // If parent has no phone number, prompt phone step
        if (!data.parent.phone) {
          setStep('PHONE');
          setSuccessMsg('Email verified! Enter your mobile number for WhatsApp alerts.');
        } else {
          router.push('/parent/dashboard');
        }
      } else {
        setErrorMsg(data.error || 'Invalid or expired verification code.');
      }
    } catch {
      setErrorMsg('Network connection error.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Save Mobile Number Post-Verification
  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/parent/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PHONE',
          email,
          phone: cleanPhone,
        }),
      });
      const data = await res.json();
      if (data.success && data.parent) {
        localStorage.setItem('parent_session', JSON.stringify(data.parent));
        window.dispatchEvent(new Event('storage'));
        router.push('/parent/dashboard');
      } else {
        setErrorMsg(data.error || 'Failed to update mobile number.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPhone = () => {
    router.push('/parent/dashboard');
  };

  // Handle Real Google 1-Click Login via NextAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { signIn } = await import('next-auth/react');
      await signIn('google', { callbackUrl: '/parent/dashboard' });
    } catch {
      setErrorMsg('Google login connection error.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex' }}>
        {/* =========================================================================
            SPLIT SCREEN: BRAND TRUST (LEFT) VS PARENT AUTH FORM (RIGHT)
            ========================================================================= */}
        <div className="parent-split-container" style={{
          display: 'flex',
          width: '100%',
          minHeight: 'calc(100vh - 110px)',
        }}>
          {/* Responsive CSS */}
          <style jsx global>{`
            .parent-split-container {
              flex-direction: row;
            }
            .parent-brand-panel {
              display: flex;
              flex: 1.1;
              background: radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.15) 0%, transparent 60%), linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
              color: #FFFFFF;
              flex-direction: column;
              justify-content: center;
              padding: 4rem 3.5rem;
              position: relative;
              overflow: hidden;
            }
            .parent-auth-panel {
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: center;
              padding: 4rem 3.5rem;
              background-color: #FFFFFF;
            }
            @media (max-width: 960px) {
              .parent-split-container {
                flex-direction: column !important;
              }
              .parent-brand-panel {
                display: none !important;
              }
              .parent-auth-panel {
                padding: 3rem 1.5rem !important;
              }
            }
          `}</style>

          {/* LEFT PANEL: BRAND TRUST & PARENT PRIVILEGES */}
          <div className="parent-brand-panel">
            {/* Background Watermark */}
            <div style={{ position: 'absolute', top: '10%', right: '8%', opacity: 0.04, fontSize: '10rem', fontWeight: 900, userSelect: 'none' }}>
              TFH
            </div>

            {/* SSSAM Academy Trust Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#38BDF8',
              width: 'fit-content',
              marginBottom: '1.75rem',
            }}>
              <ShieldCheck size={16} />
              <span>OPERATED BY SSSAM ACADEMY • SECTOR 14 GURUGRAM</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 3vw, 2.75rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}>
              Your Child&apos;s Academic Growth, <span style={{ color: '#38BDF8' }}>Managed with Excellence.</span>
            </h1>

            <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '520px', marginBottom: '2.5rem' }}>
              Access verified educator assignments, track monthly class logs, view test reports, and experience seamless home tuition coordination.
            </p>

            {/* Key Benefits Pillars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '480px', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  flexShrink: 0,
                }}>
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    100% Background-Verified Educators
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Every tutor undergoes government ID verification, subject knowledge testing &amp; demo screening.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(52, 211, 153, 0.12)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  flexShrink: 0,
                }}>
                  <HeartHandshake size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Free Tutor Replacement Guarantee
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Unsatisfied at any point? Our academic counselors assign an alternate top-tier mentor at zero extra charge.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FBBF24',
                  flexShrink: 0,
                }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                    Dedicated Academic Helpline
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    Physical Center at Sector 14 Gurgaon. Direct counselor support at {SSSAM_OFFICE_DETAILS.phones[0]}.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
              maxWidth: '480px',
            }}>
              <div style={{ display: 'flex', gap: '0.25rem', color: '#FBBF24', marginBottom: '0.45rem' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="#FBBF24" />
                ))}
              </div>
              <p style={{ fontSize: '0.84rem', color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                &ldquo;TuitionForHome matched an exceptional IB Chemistry teacher for my daughter in DLF Phase 5 within 3 hours. The coordination from SSSAM Academy is unmatched.&rdquo;
              </p>
              <div style={{ fontSize: '0.76rem', color: '#38BDF8', fontWeight: 700, marginTop: '0.5rem' }}>
                — Sunita M., The Aralias, Sector 42 Gurgaon
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: AUTHENTICATION FORM */}
          <div className="parent-auth-panel">
            <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
              {/* Header Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '0.3rem 0.8rem',
                borderRadius: '999px',
                border: '1px solid #BFDBFE',
                marginBottom: '1rem',
              }}>
                <ShieldCheck size={14} />
                <span>SECURE PARENT PORTAL</span>
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>
                {step === 'PHONE' ? 'Complete Profile' : 'Parent Sign In'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem', marginBottom: '1.75rem' }}>
                {step === 'PHONE'
                  ? 'Add your mobile number for WhatsApp tutor slips and schedule notifications.'
                  : 'Sign in to access your child’s assigned home tutors and bookings.'}
              </p>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span>✓</span>
                  <span>{successMsg}</span>
                </div>
              )}

              {/* STEP 1: INITIAL LOGIN / EMAIL INPUT */}
              {step === 'INPUT' && (
                <>
                  {/* Google 1-Click Login */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      padding: '0.85rem 1.25rem',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '14px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#1E293B',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.2s ease',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      OR SECURE EMAIL OTP
                    </span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
                  </div>

                  <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                        Parent / Guardian Name <span style={{ color: '#94A3B8', fontWeight: 500 }}>(Optional)</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          placeholder="e.g. Sunita Goel"
                          value={parentName}
                          onChange={(e) => setParentName(e.target.value)}
                          className="form-control"
                          style={{ paddingLeft: '2.5rem', height: '48px' }}
                        />
                        <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                        Email Address <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          required
                          placeholder="parent@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="form-control"
                          style={{ paddingLeft: '2.5rem', height: '48px' }}
                        />
                        <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                      <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.35rem', display: 'block' }}>
                        We will send a 6-digit verification code to this email.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{
                        height: '48px',
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '0.5rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        backgroundColor: '#2563EB',
                      }}
                    >
                      <span>{loading ? 'Sending Code...' : 'Send Verification OTP'}</span>
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: VERIFY CODE */}
              {step === 'OTP' && (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Enter 6-Digit Email Code
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="form-control"
                      style={{
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        letterSpacing: '0.4rem',
                        fontWeight: 800,
                        height: '52px',
                      }}
                    />
                    <span style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.4rem', display: 'block', textAlign: 'center' }}>
                      Code sent to <strong>{email}</strong>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="btn btn-primary"
                    style={{
                      height: '48px',
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      backgroundColor: '#2563EB',
                    }}
                  >
                    <span>{loading ? 'Verifying...' : 'Verify & Sign In'}</span>
                    <CheckCircle2 size={18} />
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => { setStep('INPUT'); setOtpCode(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Change Email
                    </button>

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: POST-VERIFICATION PHONE */}
              {step === 'PHONE' && (
                <form onSubmit={handleSavePhone} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      WhatsApp / Mobile Number <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        required
                        autoFocus
                        placeholder="10-digit mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        className="form-control"
                        style={{ paddingLeft: '2.5rem', height: '48px' }}
                      />
                      <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.35rem', display: 'block' }}>
                      Our counselors will share matched tutor demo confirmations on this number.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      height: '48px',
                      width: '100%',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      backgroundColor: '#2563EB',
                    }}
                  >
                    <span>{loading ? 'Saving...' : 'Save & Open Dashboard'}</span>
                    <ChevronRight size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleSkipPhone}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    Skip for now →
                  </button>
                </form>
              )}

              {/* Bottom Quick Help Links */}
              <div style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#64748B',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <span>Looking for a tutor?</span>
                <Link href="/request-tutor" style={{ color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}>
                  Request Home Tutor →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
