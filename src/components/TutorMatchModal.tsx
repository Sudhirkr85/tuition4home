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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="apple-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#FFFFFF',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <div className="badge badge-blue" style={{ marginBottom: '0.35rem' }}>
              <Navigation size={13} />
              <span>SMART PROXIMITY TUTOR MATCHMAKER</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Match Verified Tutor for {lead.parentName}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              📍 Target Locality: <strong style={{ color: 'var(--text-main)' }}>{lead.locality}</strong> • Class: <strong>{lead.gradeClass}</strong> ({parsedSubjects}) • Mode: <strong>{lead.preferredMode === 'OFFLINE_HOME' ? 'Home Visit' : 'Online Live'}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-app)',
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <Filter size={14} color="var(--brand-blue)" />
              <span>Max Distance:</span>
              <select
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-hairline)', fontSize: '0.82rem', fontWeight: 700, backgroundColor: '#FFFFFF' }}
              >
                <option value={3}>Within 3 KM (Immediate Area)</option>
                <option value={6}>Within 6 KM (Adjacent Sectors)</option>
                <option value={10}>Within 10 KM (Across Gurgaon)</option>
                <option value={25}>All NCR (Including Online)</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-hairline)', fontSize: '0.82rem', fontWeight: 700, backgroundColor: '#FFFFFF' }}
              >
                <option value="DISTANCE">📍 Closest Distance First</option>
                <option value="RATING">⭐ Highest Rated (5.0)</option>
                <option value="EXPERIENCE">⏳ Most Experienced</option>
              </select>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Found <strong>{filteredTutors.length}</strong> nearby verified tutors
          </div>
        </div>

        {/* Tutor Cards Scrollable List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.3rem' }}>
          {filteredTutors.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tutors found within {maxDistanceKm} KM radius. Try increasing the distance filter.
            </div>
          ) : (
            filteredTutors.map((tutor) => {
              const isClose = tutor.distanceKm <= 3.0;
              const isAssigned = matchedSuccessTutor === tutor.name;

              return (
                <div
                  key={tutor.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${isAssigned ? 'var(--brand-emerald)' : 'var(--border-hairline)'}`,
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {/* Tutor Profile Thumbnail & Details */}
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--brand-blue-light)' }}
                      />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{tutor.name}</h3>
                          <span className="badge badge-emerald" style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}>
                            <ShieldCheck size={12} />
                            <span>VERIFIED PRO</span>
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Star size={13} fill="#D97706" /> {tutor.rating} ({tutor.totalReviews} rev)
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--brand-teal)', fontWeight: 700, marginTop: '2px' }}>
                          {tutor.highestDegree} • {tutor.experienceYears} Years Exp
                        </div>

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          📚 Teaches: <strong>{tutor.subjects.join(', ')}</strong> ({tutor.classes[0]})
                        </div>
                      </div>
                    </div>

                    {/* Proximity & Rate Pill */}
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: isClose ? '#DCFCE7' : '#FEF3C7',
                          color: isClose ? '#166534' : '#92400E',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                        }}
                      >
                        <Navigation size={13} />
                        <span>~{tutor.distanceKm} KM AWAY</span>
                      </div>

                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '4px' }}>
                        ₹{tutor.hourlyRateHome}/hr <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Home Visit</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-app)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    📍 <strong>Covered Sectors:</strong> {tutor.serviceAreas.join(' • ')} (Travel radius: {tutor.travelRadiusKm} KM)
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`https://wa.me/91${lead.parentPhone}?text=${getWhatsAppPitchText(tutor)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: '#25D366', color: '#15803D', fontWeight: 700 }}
                      >
                        <MessageSquare size={14} color="#25D366" />
                        <span>WhatsApp Pitch to Parent</span>
                      </a>

                      <a
                        href={`/tutor/review/${tutor.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem' }}
                      >
                        <span>View Public Bio ↗</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMatch(tutor)}
                      className={`btn btn-sm ${isAssigned ? 'btn-emerald' : 'btn-primary'}`}
                      style={{ backgroundColor: isAssigned ? 'var(--brand-emerald)' : 'var(--brand-blue)', fontWeight: 800 }}
                    >
                      {isAssigned ? (
                        <>
                          <Check size={14} />
                          <span>Matched & Assigned!</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Assign & Fix Demo</span>
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
    </div>
  );
}
