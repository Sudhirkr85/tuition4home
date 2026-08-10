'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GURGAON_LOCALITIES, SUBJECT_OPTIONS, CLASS_OPTIONS, SSSAM_OFFICE_DETAILS } from '@/lib/data';
import { ShieldCheck, Sparkles, CheckCircle2, Home, Video, Building2, Phone } from 'lucide-react';

export default function BookDemoPage() {
  const [mode, setMode] = useState<'HOME' | 'ONLINE' | 'CENTER'>('HOME');
  const [grade, setGrade] = useState(CLASS_OPTIONS[2]);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [locality, setLocality] = useState(GURGAON_LOCALITIES[0].name);
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for demo confirmation.');
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName || 'Parent (Gurgaon)',
          parentPhone: phone,
          preferredMode: mode === 'HOME' ? 'OFFLINE_HOME' : mode === 'ONLINE' ? 'ONLINE_LIVE' : 'BOTH',
          locality: mode === 'CENTER' ? 'SSSAM Academy Sector 14 Center' : locality,
          gradeClass: grade,
          subjectsNeeded: [subject],
        }),
      });
    } catch (err) {
      console.log('Lead submitted:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-slate-50)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '3.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          {!submitted ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid var(--border-subtle)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{ marginBottom: '1.75rem' }}>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <ShieldCheck size={14} />
                  <span>100% FREE DEMO • ZERO ADVANCE RISK</span>
                </div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                  Book a 1-on-1 Free Demo Class
                </h1>
                <p style={{ color: 'var(--color-slate-600)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                  Managed & Verified by SSSAM Academy, Sector 14, Old DLF, Gurugram.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Mode Selector */}
                <div>
                  <label className="form-label">Preferred Learning Mode</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setMode('HOME')}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${mode === 'HOME' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                        backgroundColor: mode === 'HOME' ? 'var(--color-blue-50)' : '#FFFFFF',
                        color: mode === 'HOME' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Home size={16} />
                      <span>Home Visit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('ONLINE')}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${mode === 'ONLINE' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                        backgroundColor: mode === 'ONLINE' ? 'var(--color-blue-50)' : '#FFFFFF',
                        color: mode === 'ONLINE' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Video size={16} />
                      <span>Online 1-on-1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('CENTER')}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${mode === 'CENTER' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                        backgroundColor: mode === 'CENTER' ? 'var(--color-blue-50)' : '#FFFFFF',
                        color: mode === 'CENTER' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.3rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Building2 size={16} />
                      <span>Sector 14 Center</span>
                    </button>
                  </div>
                </div>

                {mode === 'HOME' && (
                  <div>
                    <label className="form-label">Gurgaon Locality / Sector</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="form-control"
                    >
                      {GURGAON_LOCALITIES.map((loc) => (
                        <option key={loc.slug} value={loc.name}>
                          {loc.name} ({loc.pincode})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Grade / Board</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="form-control"
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="form-control"
                    >
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Ritu Sharma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Mobile Number (For Demo Scheduling)</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="form-control"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                >
                  <Sparkles size={18} />
                  <span>{loading ? 'Submitting...' : 'Schedule 1-on-1 Free Demo'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid var(--border-subtle)',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-emerald-50)',
                color: 'var(--color-emerald-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.5rem' }}>
                Demo Class Request Confirmed! 🎉
              </h2>

              <p style={{ color: 'var(--color-slate-600)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                Thank you! Our academic team at <strong>SSSAM Academy Sector 14 Gurugram</strong> will contact you at <strong>+91 {phone}</strong> within 30 minutes to finalize your tutor match and demo timings.
              </p>

              <div style={{ backgroundColor: 'var(--color-slate-50)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'left', marginBottom: '1.75rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                  🏛️ SSSAM ACADEMY COUNSELOR HELPLINE:
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginTop: '2px' }}>
                  Direct Call: <strong>{SSSAM_OFFICE_DETAILS.phones[0]}</strong>
                </div>
              </div>

              <a href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                Return to Homepage
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
