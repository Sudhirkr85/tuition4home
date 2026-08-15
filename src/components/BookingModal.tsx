'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, Home, Video, Building2, User, ChevronRight } from 'lucide-react';
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
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');
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

  const modeOptions = [
    { key: 'HOME', icon: <Home size={16} />, label: 'Home Visit' },
    { key: 'ONLINE', icon: <Video size={16} />, label: 'Online 1-on-1' },
    { key: 'CENTER', icon: <Building2 size={16} />, label: 'Center Visit' },
  ] as const;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem 1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '28px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 32px 64px rgba(0,0,0,0.22)',
        position: 'relative',
        maxHeight: 'min(90vh, 850px)',
        overflowY: 'auto',
      }}>


        {/* Top accent bar */}
        <div style={{
          height: '5px',
          background: 'linear-gradient(90deg, #0F6E56 0%, #2DD4BF 50%, #0891B2 100%)',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1.25rem', right: '1.25rem',
            width: '34px', height: '34px', borderRadius: '50%',
            border: 'none', backgroundColor: '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 10,
          }}
        >
          <X size={16} color="#64748B" />
        </button>

        {!submitted ? (
          <div style={{ padding: '1.75rem 2rem 2rem' }}>

            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.85rem', borderRadius: '999px',
                backgroundColor: '#E8F5E9', marginBottom: '0.75rem',
              }}>
                <ShieldCheck size={13} color="#0F6E56" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F6E56', letterSpacing: '0.04em' }}>
                  SSSAM ACADEMY · VERIFIED MATCHING
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1D1D1F', lineHeight: 1.25, marginBottom: '0.35rem' }}>
                {initialData?.tutorName
                  ? `Book a Session with ${initialData.tutorName}`
                  : 'Book Your Tutor — Counselor Will Call Back'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#515154', lineHeight: 1.55 }}>
                Fill in 5 quick details. Our academic counselor will call you within <strong>30 minutes</strong> to match a verified tutor near your sector.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Mode Selection */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                  Preferred Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {modeOptions.map(({ key, icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMode(key)}
                      style={{
                        padding: '0.6rem 0.4rem',
                        borderRadius: '12px',
                        border: `2px solid ${mode === key ? '#0F6E56' : '#E8E8ED'}`,
                        backgroundColor: mode === key ? '#E8F5E9' : '#FFFFFF',
                        color: mode === key ? '#0F6E56' : '#515154',
                        fontWeight: 700, fontSize: '0.8rem',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem',
                        cursor: 'pointer', transition: 'all 0.18s ease',
                      }}
                    >
                      {icon}
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector or Interactive Map selection */}
              {mode === 'HOME' ? (
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    Select Your Sector on the Map
                  </label>
                  <div style={{ marginBottom: '0.5rem', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #E8E8ED' }}>
                    <RapidoStyleMap
                      isCompact
                      onLocationSelected={(data) => {
                        setLocality(data.address);
                      }}
                    />

                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0F6E56', fontWeight: 700 }}>
                    Selected Location: {locality}
                  </div>
                </div>
              ) : (
                mode !== 'CENTER' && (
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                      Your Gurgaon Sector / Area
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="form-control"
                      required
                    >
                      {GURGAON_LOCALITIES.map((l) => (
                        <option key={l.name} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                )
              )}


              {/* Class + Subject */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    Class / Grade
                  </label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="form-control">
                    {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    Subject
                  </label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)} className="form-control">
                    {SUBJECT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Name + Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    Parent Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="text"
                      placeholder="e.g. Ritu Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="form-control"
                      style={{ paddingLeft: '2.2rem' }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#515154', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="form-control"
                      style={{ paddingLeft: '2.2rem' }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Guarantee strip */}
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '0.65rem 0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                fontSize: '0.78rem',
                color: '#047857',
                fontWeight: 600,
              }}>
                <ShieldCheck size={15} />
                <span>100% free. Zero advance payment. Counselor calls within 30 min.</span>
              </div>

              {phoneError && (
                <div style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                  ⚠️ {phoneError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
                  padding: '0.95rem 1.5rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0F6E56 0%, #0891B2 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800, fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(15,110,86,0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{loading ? 'Booking...' : 'Book Tutor — Get Counselor Callback'}</span>
                {!loading && <ChevronRight size={18} />}
              </button>

            </form>
          </div>
        ) : (
          /* Success Screen */
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F6E56, #2DD4BF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}>
              <CheckCircle2 size={36} color="white" />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '0.5rem' }}>
              Request Received! 🎉
            </h3>
            <p style={{ color: '#515154', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Our counselor will call <strong>+91 {phone}</strong> within <strong>30 minutes</strong> to match the best verified tutor for <strong>{grade} · {subject}</strong> in <strong>{mode === 'CENTER' ? 'Sector 14 Center' : locality}</strong>.
            </p>

            <div style={{
              backgroundColor: '#F8FAFC', border: '1px solid #E8E8ED',
              borderRadius: '14px', padding: '1rem 1.25rem',
              textAlign: 'left', marginBottom: '1.5rem',
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '4px' }}>
                📞 Need urgent help?
              </div>
              <div style={{ fontSize: '0.88rem', color: '#515154' }}>
                Call directly: <strong style={{ color: '#0F6E56' }}>{SSSAM_OFFICE_DETAILS.phones[0]}</strong>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '0.85rem',
                borderRadius: '999px', border: '1.5px solid #E8E8ED',
                backgroundColor: '#FFFFFF', color: '#1D1D1F',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
              }}
            >
              Back to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
