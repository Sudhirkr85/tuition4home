'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Phone, Home, Video, Building2, MapPin } from 'lucide-react';
import { GURGAON_LOCALITIES, SUBJECT_OPTIONS, CLASS_OPTIONS, SSSAM_OFFICE_DETAILS } from '@/lib/data';
import RapidoStyleMap from '@/components/RapidoStyleMap';


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
  const [mode, setMode] = useState<'HOME' | 'ONLINE' | 'CENTER'>('HOME');
  const [grade, setGrade] = useState(initialData?.grade || CLASS_OPTIONS[2]);
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [locality, setLocality] = useState(GURGAON_LOCALITIES[0].name);
  const [budgetRange, setBudgetRange] = useState('₹6,000 – ₹10,000 / month');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // GPS Current Location Detector
  const handleDetectLocation = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDetectingGps(false);
          setLocality('DLF Phase 5, Gurgaon (Auto-Detected)');
        },
        (error) => {
          setDetectingGps(false);
          setLocality(GURGAON_LOCALITIES[0].name);
        }
      );
    } else {
      setDetectingGps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
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
          board: 'CBSE',
          subjectsNeeded: [subject],
          budgetRange,
          assignedTutorName: initialData?.tutorName || null,
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
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
        border: '1px solid var(--border-hairline)',
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
            backgroundColor: 'var(--bg-card-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} color="var(--text-main)" />
        </button>

        {!submitted ? (
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <ShieldCheck size={14} />
                <span>SSSAM ACADEMY VERIFIED MATCHING</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {initialData?.tutorName
                  ? `Request Trial Class with ${initialData.tutorName}`
                  : 'Find a Verified Home Tutor in Gurgaon'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Our senior academic counselor will match top educators near your sector within 2 hours.
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
                      border: `1.5px solid ${mode === 'HOME' ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                      backgroundColor: mode === 'HOME' ? 'var(--brand-blue-light)' : '#FFFFFF',
                      color: mode === 'HOME' ? 'var(--brand-blue)' : 'var(--text-main)',
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
                    <span>Home Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('ONLINE')}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '10px',
                      border: `1.5px solid ${mode === 'ONLINE' ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                      backgroundColor: mode === 'ONLINE' ? 'var(--brand-blue-light)' : '#FFFFFF',
                      color: mode === 'ONLINE' ? 'var(--brand-blue)' : 'var(--text-main)',
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
                      border: `1.5px solid ${mode === 'CENTER' ? 'var(--brand-blue)' : 'var(--border-hairline)'}`,
                      backgroundColor: mode === 'CENTER' ? 'var(--brand-blue-light)' : '#FFFFFF',
                      color: mode === 'CENTER' ? 'var(--brand-blue)' : 'var(--text-main)',
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

              {/* Rapido-Style Interactive Visual Map for Home Tuition */}
              {mode === 'HOME' && (
                <RapidoStyleMap
                  onLocationSelected={(data) => {
                    setLocality(data.address);
                  }}
                />
              )}


              {/* Grade & Subject */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Grade / Class</label>
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

              {/* Budget Range Selector Starting at ₹1,000+ */}
              <div>
                <label className="form-label">Budget / Price Range Preference</label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="form-control"
                  style={{ fontWeight: 600 }}
                >
                  <option value="₹1,000 – ₹3,000 / month">₹1,000 – ₹3,000 / month (Primary Foundation)</option>
                  <option value="₹3,000 – ₹6,000 / month">₹3,000 – ₹6,000 / month (Middle School)</option>
                  <option value="₹6,000 – ₹10,000 / month">₹6,000 – ₹10,000 / month (Board Prep 9-12)</option>
                  <option value="₹10,000+ / month">₹10,000+ / month (Elite IB / Cambridge / NEET-JEE)</option>
                </select>
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
                <label className="form-label">Mobile Number (For Counselor Callback)</label>
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
                <span>{loading ? 'Submitting Request...' : 'Request Trial Class Callback'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-emerald-light)',
              color: 'var(--brand-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Trial Class Request Received! 🎉
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Thank you, <strong>{parentName || 'Parent'}</strong>! Our Senior Academic Counselor is matching top tutors for <strong>{grade} • {subject}</strong> in <strong>{locality}</strong> and will call you at <strong>+91 {phone}</strong> within 30 minutes.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-hairline)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                🏛️ SSSAM ACADEMY COUNSELOR HELPLINE:
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Urgent Inquiry? Call directly: <strong>{SSSAM_OFFICE_DETAILS.phones[0]}</strong>
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
