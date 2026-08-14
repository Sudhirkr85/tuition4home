'use client';

import React, { useState } from 'react';
import {
  VERIFIED_TUTORS,
  MockTutor,
  GURGAON_LOCALITIES,
} from '@/lib/data';
import {
  MapPin,
  Star,
  ShieldCheck,
  Phone,
  MessageSquare,
  CheckCircle2,
  Filter,
  Navigation,
  Sparkles,
  BookOpen,
  Award,
  Video,
  Home,
  Check,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Mail,
} from 'lucide-react';

interface TutorMatchModalProps {
  lead: {
    id: string;
    parentName: string;
    parentPhone: string;
    locality: string;
    gradeClass: string;
    subjectsNeeded: string;
    preferredMode: 'OFFLINE_HOME' | 'ONLINE_LIVE';
    budgetMonthly?: number;
  };
  currentOperator?: string;
  onClose: () => void;
  onAssignTutor: (tutorName: string, tutorId: string, notes: string) => void;
}

// Distance approximation matrix for Gurgaon sectors (in KM)
const getEstimatedDistance = (parentLocality: string, tutorServiceAreas: string[]): number => {
  const normParent = parentLocality.toLowerCase();

  // If tutor explicitly covers parent's exact locality
  for (const area of tutorServiceAreas) {
    if (normParent.includes(area.toLowerCase()) || area.toLowerCase().includes(normParent)) {
      return 1.2; // ~1.2 km within same locality
    }
  }

  // Adjacent cluster heuristics
  if (
    (normParent.includes('dlf phase 5') || normParent.includes('golf course')) &&
    tutorServiceAreas.some((a) => a.toLowerCase().includes('dlf phase 4') || a.toLowerCase().includes('sector 56') || a.toLowerCase().includes('sushant lok'))
  ) {
    return 2.5;
  }

  if (
    (normParent.includes('dlf phase 1') || normParent.includes('dlf phase 2')) &&
    tutorServiceAreas.some((a) => a.toLowerCase().includes('cyber') || a.toLowerCase().includes('sector 14') || a.toLowerCase().includes('dlf phase 4'))
  ) {
    return 3.1;
  }

  if (
    (normParent.includes('sohna road') || normParent.includes('nirvana') || normParent.includes('sector 50')) &&
    tutorServiceAreas.some((a) => a.toLowerCase().includes('sector 48') || a.toLowerCase().includes('sector 57'))
  ) {
    return 2.8;
  }

  if (
    normParent.includes('sector 14') &&
    tutorServiceAreas.some((a) => a.toLowerCase().includes('palam vihar') || a.toLowerCase().includes('dlf phase 2'))
  ) {
    return 3.5;
  }

  // Default fallback distance
  return 5.4;
};

export default function TutorMatchModal({
  lead,
  currentOperator = 'Counselor Desk',
  onClose,
  onAssignTutor,
}: TutorMatchModalProps) {
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'DISTANCE' | 'RATING' | 'EXPERIENCE'>('DISTANCE');
  const [matchedSuccessTutor, setMatchedSuccessTutor] = useState<string | null>(null);
  const [previewTutor, setPreviewTutor] = useState<(MockTutor & { distanceKm: number }) | null>(null);

  const parsedSubjects = Array.isArray(lead.subjectsNeeded)
    ? lead.subjectsNeeded.join(', ')
    : lead.subjectsNeeded.replace(/[\[\]"]/g, '');

  // Calculate distance for all verified tutors
  const tutorListWithDistances = VERIFIED_TUTORS.map((tutor) => {
    const dist = getEstimatedDistance(lead.locality, tutor.serviceAreas);
    const isWithinTravelRadius = dist <= tutor.travelRadiusKm;
    return {
      ...tutor,
      distanceKm: dist,
      isWithinTravelRadius,
    };
  });

  // Filter tutors
  const filteredTutors = tutorListWithDistances
    .filter((t) => {
      // Distance filter
      if (t.distanceKm > maxDistanceKm) return false;

      // Subject filter
      if (selectedSubjectFilter !== 'ALL') {
        const matchesSubj = t.subjects.some((s) => s.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));
        if (!matchesSubj) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'DISTANCE') return a.distanceKm - b.distanceKm;
      if (sortBy === 'RATING') return b.rating - a.rating;
      if (sortBy === 'EXPERIENCE') return b.experienceYears - a.experienceYears;
      return 0;
    });

  const handleMatch = (tutor: MockTutor & { distanceKm: number }) => {
    const note = `Matched proximity tutor: ${tutor.name} (${tutor.highestDegree}, ${tutor.distanceKm} KM away from ${lead.locality}). Rate: ₹${tutor.hourlyRateHome}/hr.`;
    setMatchedSuccessTutor(tutor.name);
    setTimeout(() => {
      onAssignTutor(tutor.name, tutor.id, note);
    }, 600);
  };

  const getWhatsAppPitchText = (tutor: MockTutor & { distanceKm: number }) => {
    return encodeURIComponent(
      `*TuitionForHome (SSSAM Academy) - Shortlisted Verified Tutor Profile*\n\n` +
      `Hello ${lead.parentName} ji,\n` +
      `Based on your request for *${lead.gradeClass} (${parsedSubjects})* in *${lead.locality}*, we have shortlisted a top verified home tutor located just *${tutor.distanceKm} KM* from your residence:\n\n` +
      `👨‍🏫 *Tutor:* ${tutor.name}\n` +
      `🎓 *Qualification:* ${tutor.highestDegree}\n` +
      `⭐ *Rating:* ${tutor.rating}/5.0 (${tutor.totalReviews} verified parent reviews)\n` +
      `⏳ *Experience:* ${tutor.experienceYears}+ Years\n` +
      `💰 *Session Fee:* ₹${tutor.hourlyRateHome}/hour\n` +
      `🛡️ *Background Check:* 100% Police & Document Verified\n\n` +
      `Would you like us to schedule your *1-on-1 Free Demo Class* for tomorrow?`
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="apple-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          padding: '1.25rem 1.5rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Clean Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Assign Tutor for {lead.parentName}
              </h2>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '3px' }}>
              📍 <strong>{lead.locality}</strong> • {lead.gradeClass} ({parsedSubjects}) • <strong>{lead.preferredMode === 'OFFLINE_HOME' ? 'Home Tuition' : 'Online'}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: '#F1F5F9', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', cursor: 'pointer', color: '#64748B', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Compact Filters Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #F1F5F9',
            marginBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700 }}>Distance:</span>
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 600, backgroundColor: '#F8FAFC', color: '#334155' }}
            >
              <option value={3}>Within 3 KM</option>
              <option value={6}>Within 6 KM</option>
              <option value={10}>Within 10 KM</option>
              <option value={25}>All Gurgaon / NCR</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.76rem', fontWeight: 600, backgroundColor: '#F8FAFC', color: '#334155' }}
            >
              <option value="DISTANCE">📍 Nearest First</option>
              <option value="RATING">⭐ Top Rated</option>
              <option value="EXPERIENCE">⏳ Experience</option>
            </select>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
            <strong style={{ color: '#0F172A' }}>{filteredTutors.length}</strong> tutors available
          </div>
        </div>

        {/* Clean, Compact Tutor Rows */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingRight: '0.25rem' }}>
          {filteredTutors.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.84rem' }}>
              No verified tutors found within {maxDistanceKm} KM. Try expanding distance.
            </div>
          ) : (
            filteredTutors.map((tutor) => {
              const isClose = tutor.distanceKm <= 3.0;
              const isAssigned = matchedSuccessTutor === tutor.name;

              return (
                <div
                  key={tutor.id}
                  style={{
                    backgroundColor: isAssigned ? '#F0FDF4' : '#FFFFFF',
                    border: `1px solid ${isAssigned ? '#86EFAC' : '#E2E8F0'}`,
                    borderRadius: '12px',
                    padding: '0.75rem 0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { if (!isAssigned) e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                  onMouseLeave={(e) => { if (!isAssigned) e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                >
                  {/* Left: Avatar + Details (Clickable to view Profile) */}
                  <div
                    onClick={() => setPreviewTutor(tutor)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0, cursor: 'pointer' }}
                    title="Click to view full tutor profile & credentials"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tutor.avatarUrl}
                      alt={tutor.name}
                      style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0, border: '1px solid #E2E8F0' }}
                    />

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.15s' }}>
                          {tutor.name}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>
                          ✓ Verified
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                          <Star size={11} fill="#D97706" /> {tutor.rating}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {tutor.highestDegree} • {tutor.experienceYears}y exp • <strong style={{ color: '#0F172A' }}>{tutor.subjects.join(', ')}</strong>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: isClose ? '#DCFCE7' : '#FEF3C7', color: isClose ? '#15803D' : '#92400E' }}>
                          📍 ~{tutor.distanceKm} km away
                        </span>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F766E' }}>
                          ₹{tutor.hourlyRateHome}/hr
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#6366F1', fontWeight: 700 }}>
                          View Profile ↗
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: WhatsApp Pitch + Assign Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                    <a
                      href={`https://wa.me/91${lead.parentPhone}?text=${getWhatsAppPitchText(tutor)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share Profile on WhatsApp"
                      style={{
                        padding: '0.35rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #86EFAC',
                        backgroundColor: '#F0FDF4',
                        color: '#15803D',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <MessageSquare size={12} color="#15803D" />
                      <span>Pitch</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleMatch(tutor)}
                      disabled={isAssigned}
                      style={{
                        padding: '0.38rem 0.85rem',
                        borderRadius: '7px',
                        backgroundColor: isAssigned ? '#15803D' : '#6366F1',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        cursor: isAssigned ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        boxShadow: isAssigned ? 'none' : '0 2px 6px rgba(99, 102, 241, 0.25)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isAssigned ? (
                        <>
                          <Check size={12} />
                          <span>Assigned!</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Assign</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FULL TUTOR PROFILE QUICK VIEW MODAL */}
      {previewTutor && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 1200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setPreviewTutor(null)}
        >
          <div
            className="apple-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewTutor.avatarUrl}
                  alt={previewTutor.name}
                  style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{previewTutor.name}</h3>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#15803D' }}>
                      ✓ Verified Pro
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    🎓 {previewTutor.highestDegree} • {previewTutor.experienceYears} Years Teaching Experience
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewTutor(null)}
                style={{ border: 'none', background: '#F1F5F9', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <div style={{ padding: '0.6rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>⭐ {previewTutor.rating} / 5.0</div>
              </div>
              <div style={{ padding: '0.6rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Home Rate</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F766E', marginTop: '2px' }}>₹{previewTutor.hourlyRateHome}/hr</div>
              </div>
              <div style={{ padding: '0.6rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Distance</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>📍 ~{previewTutor.distanceKm} KM</div>
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                <strong>Phone:</strong> +91 {previewTutor.phone}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                <strong>Email:</strong> {previewTutor.email}
              </div>
            </div>

            {/* Subjects & Classes */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Subjects &amp; Classes Taught
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {previewTutor.subjects.map((sub, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 700 }}>
                    {sub}
                  </span>
                ))}
                {previewTutor.classes.map((cls, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: '#F1F5F9', color: '#334155', fontSize: '0.78rem', fontWeight: 600 }}>
                    {cls}
                  </span>
                ))}
              </div>
            </div>

            {/* Service Areas */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Covered Service Sectors (Radius: {previewTutor.travelRadiusKm} KM)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, padding: '0.6rem 0.75rem', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                📍 {previewTutor.serviceAreas.join(' • ')}
              </div>
            </div>

            {/* Action Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
              <a
                href={`tel:${previewTutor.phone}`}
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#334155', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <Phone size={13} color="#15803D" /> Call
              </a>

              <a
                href={`https://wa.me/91${lead.parentPhone}?text=${getWhatsAppPitchText(previewTutor)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', border: '1px solid #86EFAC', backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <MessageSquare size={13} /> WhatsApp Pitch
              </a>

              <button
                type="button"
                onClick={() => {
                  handleMatch(previewTutor);
                  setPreviewTutor(null);
                }}
                style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#6366F1', color: '#FFFFFF', border: 'none', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <CheckCircle2 size={14} /> Assign This Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
