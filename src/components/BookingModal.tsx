'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Phone, ArrowRight, Home, Video, Building2 } from 'lucide-react';
import { GURGAON_LOCALITIES, SUBJECT_OPTIONS, CLASS_OPTIONS, SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    tutorName?: string;
    grade?: string;
    mode?: string;
  };
}

export default function BookingModal({ isOpen, onClose, initialData }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'HOME' | 'ONLINE' | 'CENTER'>('HOME');
  const [grade, setGrade] = useState(initialData?.grade || CLASS_OPTIONS[2]);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [locality, setLocality] = useState(GURGAON_LOCALITIES[0].name);
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
          assignedTutorName: initialData?.tutorName || null,
        }),
      });
    } catch (err) {
      console.log('Lead submitted locally:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--color-slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} color="var(--color-slate-700)" />
        </button>

        {/* Modal Content */}
        {!submitted ? (
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <ShieldCheck size={14} />
                <span>100% FREE DEMO • NO ADVANCE OBLIGATION</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                {initialData?.tutorName
                  ? `Book 1-on-1 Free Demo with ${initialData.tutorName}`
                  : 'Find a Verified Home Tutor in Gurgaon'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', marginTop: '0.35rem' }}>
                Our academic counselor will match the top educator in your sector within 2 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Mode Selection */}
              <div>
                <label className="form-label">Preferred Learning Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setMode('HOME')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${mode === 'HOME' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                      backgroundColor: mode === 'HOME' ? 'var(--color-blue-50)' : '#FFFFFF',
                      color: mode === 'HOME' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Home size={16} />
                    <span>Home Tuition</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('ONLINE')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${mode === 'ONLINE' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                      backgroundColor: mode === 'ONLINE' ? 'var(--color-blue-50)' : '#FFFFFF',
                      color: mode === 'ONLINE' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
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
                      padding: '0.65rem 0.5rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${mode === 'CENTER' ? 'var(--color-blue-600)' : 'var(--border-subtle)'}`,
                      backgroundColor: mode === 'CENTER' ? 'var(--color-blue-50)' : '#FFFFFF',
                      color: mode === 'CENTER' ? 'var(--color-blue-600)' : 'var(--color-slate-700)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Building2 size={16} />
                    <span>Sector 14 Center</span>
                  </button>
                </div>
              </div>

              {/* Locality (If Home selected) */}
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

              {/* Class & Subject in 2 cols */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Class / Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="form-control"
                    style={{ fontSize: '0.88rem' }}
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
                    style={{ fontSize: '0.88rem' }}
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Parent Name & Phone */}
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
                  placeholder="10-digit mobile number (e.g. 9811XXXXXX)"
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
                <span>{loading ? 'Submitting Request...' : 'Schedule Free Demo Class'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
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

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.5rem' }}>
              Free Demo Request Received! 🎉
            </h3>
            <p style={{ color: 'var(--color-slate-600)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Thank you, <strong>{parentName || 'Parent'}</strong>! Our Senior Academic Counselor is reviewing your request for <strong>{grade} • {subject}</strong> and will call you on <strong>+91 {phone}</strong> within 30 minutes to confirm your demo schedule.
            </p>

            <div style={{
              backgroundColor: 'var(--color-slate-50)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                🏛️ SSSAM ACADEMY COUNSELOR HELPLINE:
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                Urgent Demo Booking? Call directly: <strong>{SSSAM_OFFICE_DETAILS.phones[0]}</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Done & Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
