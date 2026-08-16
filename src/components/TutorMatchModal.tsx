'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  VERIFIED_TUTORS,
  MockTutor,
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
  Search,
  ArrowLeft,
  X,
  GraduationCap,
  Clock,
  Zap,
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
  const normParent = (parentLocality || '').toLowerCase();

  for (const area of tutorServiceAreas) {
    if (normParent.includes(area.toLowerCase()) || area.toLowerCase().includes(normParent)) {
      return 1.2;
    }
  }

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

  return 5.4;
};

export default function TutorMatchModal({
  lead,
  currentOperator = 'Counselor Desk',
  onClose,
  onAssignTutor,
}: TutorMatchModalProps) {
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(10);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'SMART_MATCH' | 'DISTANCE' | 'RATING' | 'EXPERIENCE' | 'FEE_LOW'>('SMART_MATCH');
  const [matchedSuccessTutor, setMatchedSuccessTutor] = useState<string | null>(null);
  const [previewTutor, setPreviewTutor] = useState<(MockTutor & { distanceKm: number; isSubjectMatch: boolean }) | null>(null);
  const [pendingAssignTutor, setPendingAssignTutor] = useState<(MockTutor & { distanceKm: number }) | null>(null);

  // Tutor Pagination State
  const [tutorCurrentPage, setTutorCurrentPage] = useState(1);
  const [tutorsPerPage, setTutorsPerPage] = useState(4);

  // Fetch live verified tutors from database API
  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors)) {
          setDynamicTutors(data.tutors);
        } else {
          setDynamicTutors([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch live tutors for matcher:', err);
        setDynamicTutors([]);
      });
  }, []);

  const parsedSubjects = Array.isArray(lead.subjectsNeeded)
    ? lead.subjectsNeeded.join(', ')
    : (lead.subjectsNeeded || '').replace(/[\[\]"]/g, '');

  const requiredSubjectWords = useMemo(() => {
    return parsedSubjects
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((w) => w.length > 2);
  }, [parsedSubjects]);

  // Calculate distance & subject match for all verified tutors
  const tutorListWithDistances = useMemo(() => {
    return dynamicTutors.map((tutor) => {
      const dist = getEstimatedDistance(lead.locality, tutor.serviceAreas);
      const isWithinTravelRadius = dist <= tutor.travelRadiusKm;

      // Check if tutor teaches the exact required subject
      const tutorSubjectsCombined = tutor.subjects.join(' ').toLowerCase();
      const isSubjectMatch = requiredSubjectWords.length === 0 || requiredSubjectWords.some((w) => tutorSubjectsCombined.includes(w));

      return {
        ...tutor,
        distanceKm: dist,
        isWithinTravelRadius,
        isSubjectMatch,
      };
    });
  }, [lead.locality, requiredSubjectWords, dynamicTutors]);

  // Filter & Sort tutors
  const filteredTutors = useMemo(() => {
    return tutorListWithDistances
      .filter((t) => {
        // Distance filter
        if (t.distanceKm > maxDistanceKm) return false;

        // Subject pill filter
        if (selectedSubjectFilter !== 'ALL') {
          const matchesSubj = t.subjects.some((s) => s.toLowerCase().includes(selectedSubjectFilter.toLowerCase()));
          if (!matchesSubj) return false;
        }

        // Live text search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesQuery =
            t.name.toLowerCase().includes(q) ||
            t.highestDegree.toLowerCase().includes(q) ||
            t.subjects.some((s) => s.toLowerCase().includes(q)) ||
            t.serviceAreas.some((a) => a.toLowerCase().includes(q));
          if (!matchesQuery) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'SMART_MATCH') {
          // Exact subject match first, then closest distance
          if (a.isSubjectMatch && !b.isSubjectMatch) return -1;
          if (!a.isSubjectMatch && b.isSubjectMatch) return 1;
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'DISTANCE') return a.distanceKm - b.distanceKm;
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'EXPERIENCE') return b.experienceYears - a.experienceYears;
        if (sortBy === 'FEE_LOW') return a.hourlyRateHome - b.hourlyRateHome;
        return 0;
      });
  }, [tutorListWithDistances, maxDistanceKm, selectedSubjectFilter, searchQuery, sortBy]);

  // Tutor Pagination Calculations
  const tutorTotalPages = Math.ceil(filteredTutors.length / tutorsPerPage) || 1;
  const tutorStartIndex = (tutorCurrentPage - 1) * tutorsPerPage;
  const tutorEndIndex = Math.min(tutorStartIndex + tutorsPerPage, filteredTutors.length);
  const paginatedTutors = filteredTutors.slice(tutorStartIndex, tutorEndIndex);

  const handleMatch = (tutor: MockTutor & { distanceKm: number }) => {
    const note = `Matched tutor: ${tutor.name} (${tutor.highestDegree}, ~${tutor.distanceKm} KM from ${lead.locality}). Rate: ₹${tutor.hourlyRateHome}/hr. Confirmed by ${currentOperator}.`;
    setMatchedSuccessTutor(tutor.name);
    setPendingAssignTutor(null);
    setTimeout(() => {
      onAssignTutor(tutor.name, tutor.id, note);
    }, 500);
  };

  const getWhatsAppPitchText = (tutor: MockTutor & { distanceKm: number }) => {
    return encodeURIComponent(
      `*TuitionForHome (SSSAM Academy) - Shortlisted Verified Tutor Profile*\n\n` +
      `Hello ${lead.parentName} ji,\n` +
      `Based on your requirement for *${lead.gradeClass} (${parsedSubjects})* in *${lead.locality}*, we have matched a top verified tutor located *${tutor.distanceKm} KM* away:\n\n` +
      `👨‍🏫 *Tutor:* ${tutor.name}\n` +
      `🎓 *Qualification:* ${tutor.highestDegree}\n` +
      `⭐ *Rating:* ${tutor.rating}/5.0 (${tutor.totalReviews} verified reviews)\n` +
      `⏳ *Experience:* ${tutor.experienceYears}+ Years\n` +
      `💰 *Fee:* ₹${tutor.hourlyRateHome}/hour\n` +
      `🛡️ *Verification:* 100% Academic & KYC Verified by SSSAM\n\n` +
      `Shall we confirm ${tutor.name} for your home tuition sessions?`
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      {/* SLIDE-OVER RIGHT DRAWER PANEL */}
      <div
        className="slide-over-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          height: '100vh',
          backgroundColor: '#FFFFFF',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 1. TOP FIXED HEADER: Parent Context & Close Button */}
        <div
          style={{
            padding: '1.15rem 1.35rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: '#1E293B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                }}
              >
                <Zap size={16} />
              </div>
              <h2 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Match &amp; Assign Tutor
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: '#1E293B',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94A3B8',
                transition: 'all 0.15s ease',
              }}
              title="Close Drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Parent Requirement Context Strip */}
          <div
            style={{
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              border: '1px solid #334155',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#F8FAFC' }}>
                {lead.parentName}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#38BDF8', fontWeight: 700 }}>
                {lead.preferredMode === 'OFFLINE_HOME' ? '🏠 Home Tuition' : '💻 Online 1-on-1'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.76rem', color: '#94A3B8' }}>
              <span style={{ color: '#E2E8F0', fontWeight: 700 }}>
                📚 {lead.gradeClass} ({parsedSubjects})
              </span>
              <span>•</span>
              <span>📍 {lead.locality}</span>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & SMART FILTER TOOLBAR */}
        <div
          style={{
            padding: '0.85rem 1.35rem',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by tutor name, college, or subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setTutorCurrentPage(1);
              }}
              className="form-control"
              style={{
                paddingLeft: '2.3rem',
                borderRadius: '9px',
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
                borderColor: '#CBD5E1',
              }}
            />
          </div>

          {/* Filter Dropdowns & Available Count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setTutorCurrentPage(1);
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                <option value="SMART_MATCH">⚡ Best Match</option>
                <option value="DISTANCE">📍 Nearest First</option>
                <option value="RATING">⭐ Top Rated</option>
                <option value="EXPERIENCE">⏳ Experience</option>
                <option value="FEE_LOW">💰 Lowest Fee</option>
              </select>

              <select
                value={maxDistanceKm}
                onChange={(e) => {
                  setMaxDistanceKm(Number(e.target.value));
                  setTutorCurrentPage(1);
                }}
                style={{
                  padding: '0.3rem 0.6rem',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                <option value={3}>Within 3 KM</option>
                <option value={6}>Within 6 KM</option>
                <option value={10}>Within 10 KM</option>
                <option value={25}>All Gurgaon / NCR</option>
              </select>
            </div>

            <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700 }}>
              <strong style={{ color: '#0F172A' }}>{filteredTutors.length}</strong> verified tutors
            </div>
          </div>
        </div>

        {/* 3. SCROLLABLE TUTOR MATCH LIST */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 1.35rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTutors.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🔍</div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>No tutors found matching filters</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>Try increasing distance or clearing search keywords.</div>
            </div>
          ) : (
            paginatedTutors.map((tutor) => {
              const isAssigned = matchedSuccessTutor === tutor.name;
              const isClose = tutor.distanceKm <= 3.0;

              return (
                <div
                  key={tutor.id}
                  style={{
                    backgroundColor: isAssigned ? '#F0FDF4' : '#FFFFFF',
                    border: `1.5px solid ${isAssigned ? '#22C55E' : tutor.isSubjectMatch ? '#BAE6FD' : '#E2E8F0'}`,
                    borderRadius: '14px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Top Row: Avatar + Name + Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '1.5px solid #E2E8F0',
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span
                            onClick={() => setPreviewTutor(tutor)}
                            style={{
                              fontSize: '0.94rem',
                              fontWeight: 800,
                              color: '#0F172A',
                              cursor: 'pointer',
                            }}
                            title="Click to view full credentials"
                          >
                            {tutor.name}
                          </span>

                          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                            ✓ Verified
                          </span>

                          {tutor.isSubjectMatch && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#E0F2FE', color: '#0369A1' }}>
                              ⚡ Subject Match
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          🎓 {tutor.highestDegree} • {tutor.experienceYears}y exp
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: '#FEF3C7', padding: '3px 7px', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 800, color: '#B45309' }}>
                      <Star size={12} fill="#B45309" />
                      <span>{tutor.rating}</span>
                    </div>
                  </div>

                  {/* Middle Row: Subjects & Key Highlights */}
                  <div style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Subjects:</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{tutor.subjects.join(', ')}</span>
                  </div>

                  {/* Bottom Row: Distance, Rate & Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.55rem',
                      borderTop: '1px solid #F1F5F9',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          backgroundColor: isClose ? '#DCFCE7' : '#FEF3C7',
                          color: isClose ? '#15803D' : '#92400E',
                        }}
                      >
                        📍 ~{tutor.distanceKm} km
                      </span>

                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F766E' }}>
                        ₹{tutor.hourlyRateHome}/hr
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {/* WhatsApp Pitch */}
                      <a
                        href={`https://wa.me/91${lead.parentPhone}?text=${getWhatsAppPitchText(tutor)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '0.4rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid #86EFAC',
                          backgroundColor: '#F0FDF4',
                          color: '#15803D',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                        title="Share pitch with parent on WhatsApp"
                      >
                        <MessageSquare size={13} color="#15803D" />
                        <span>Pitch</span>
                      </a>

                      {/* View Profile */}
                      <button
                        type="button"
                        onClick={() => setPreviewTutor(tutor)}
                        style={{
                          padding: '0.4rem 0.65rem',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          color: '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Profile
                      </button>

                      {/* Assign Tutor */}
                      <button
                        type="button"
                        onClick={() => setPendingAssignTutor(tutor)}
                        disabled={isAssigned}
                        style={{
                          padding: '0.4rem 0.95rem',
                          borderRadius: '8px',
                          backgroundColor: isAssigned ? '#15803D' : '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: isAssigned ? 'default' : 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          boxShadow: isAssigned ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.2)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isAssigned ? (
                          <>
                            <Check size={13} />
                            <span>Assigned!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Assign</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. DRAWER PAGINATION FOOTER */}
        {filteredTutors.length > 0 && (
          <div
            style={{
              padding: '0.75rem 1.35rem',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#FAFAFA',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontSize: '0.76rem',
              color: '#475569',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>
                Showing <strong>{tutorStartIndex + 1}</strong> to <strong>{tutorEndIndex}</strong> of <strong>{filteredTutors.length}</strong> tutors
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ color: '#94A3B8' }}>Per page:</span>
                <select
                  value={tutorsPerPage}
                  onChange={(e) => {
                    setTutorsPerPage(Number(e.target.value));
                    setTutorCurrentPage(1);
                  }}
                  style={{
                    padding: '0.15rem 0.4rem',
                    borderRadius: '5px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                </select>
              </div>
            </div>

            {/* Page Navigation Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <button
                type="button"
                disabled={tutorCurrentPage === 1}
                onClick={() => setTutorCurrentPage((p) => Math.max(1, p - 1))}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: tutorCurrentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                  color: tutorCurrentPage === 1 ? '#94A3B8' : '#334155',
                  cursor: tutorCurrentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                }}
              >
                ← Prev
              </button>

              {Array.from({ length: tutorTotalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setTutorCurrentPage(pageNum)}
                  style={{
                    minWidth: '24px',
                    height: '24px',
                    borderRadius: '5px',
                    border: tutorCurrentPage === pageNum ? 'none' : '1px solid #CBD5E1',
                    backgroundColor: tutorCurrentPage === pageNum ? '#0F172A' : '#FFFFFF',
                    color: tutorCurrentPage === pageNum ? '#FFFFFF' : '#334155',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                  }}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={tutorCurrentPage >= tutorTotalPages}
                onClick={() => setTutorCurrentPage((p) => Math.min(tutorTotalPages, p + 1))}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: tutorCurrentPage >= tutorTotalPages ? '#F1F5F9' : '#FFFFFF',
                  color: tutorCurrentPage >= tutorTotalPages ? '#94A3B8' : '#334155',
                  cursor: tutorCurrentPage >= tutorTotalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.74rem',
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* 5. IN-DRAWER FULL PROFILE INSPECTOR (SLIDES OVER THE DRAWER) */}
        {previewTutor && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#FFFFFF',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.2s ease',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setPreviewTutor(null)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '7px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Matches</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTutor(null)}
                style={{ border: 'none', background: 'transparent', color: '#94A3B8', cursor: 'pointer', fontSize: '1rem' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Tutor Header Card */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewTutor.avatarUrl}
                  alt={previewTutor.name}
                  style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {previewTutor.name}
                    </h3>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534' }}>
                      ✓ Verified Pro
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
                    🎓 {previewTutor.highestDegree}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#D97706', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                    <Star size={12} fill="#D97706" /> {previewTutor.rating} / 5.0 ({previewTutor.totalReviews} verified parent reviews)
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5, border: '1px solid #E2E8F0' }}>
                &ldquo;{previewTutor.bio}&rdquo;
              </div>

              {/* Badges Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>TEACHING EXPERIENCE</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {previewTutor.experienceYears}+ Years Active
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>HOME TUITION FEE</div>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F766E', marginTop: '2px' }}>
                    ₹{previewTutor.hourlyRateHome} / hour
                  </div>
                </div>
              </div>

              {/* Subjects & Covered Areas */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                <div>
                  <strong style={{ color: '#0F172A' }}>Subjects:</strong> {previewTutor.subjects.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Classes:</strong> {previewTutor.classes.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Boards:</strong> {previewTutor.boards.join(', ')}
                </div>
                <div>
                  <strong style={{ color: '#0F172A' }}>Covered Sectors:</strong> {previewTutor.serviceAreas.join(', ')}
                </div>
              </div>
            </div>

            {/* In-Inspector Bottom Action Bar */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', gap: '0.65rem' }}>
              <a
                href={`https://wa.me/91${lead.parentPhone}?text=${getWhatsAppPitchText(previewTutor)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '9px',
                  border: '1px solid #86EFAC',
                  backgroundColor: '#F0FDF4',
                  color: '#15803D',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <MessageSquare size={14} />
                <span>Pitch on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setPendingAssignTutor(previewTutor)}
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  borderRadius: '9px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Assign This Tutor</span>
              </button>
            </div>
          </div>
        )}

        {/* 6. CENTERED "CONFIRM TUTOR ASSIGNMENT" DIALOG (YES / NO) */}
        {pendingAssignTutor && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(5px)',
              zIndex: 1300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
            onClick={() => setPendingAssignTutor(null)}
          >
            <div
              className="apple-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '440px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
                textAlign: 'center',
              }}
            >
              {/* Top Icon Badge */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: '#0284C7',
                }}
              >
                <UserCheck size={28} />
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Confirm Tutor Match?
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  Please confirm assigning this verified tutor to the student enquiry.
                </p>
              </div>

              {/* Match Comparison Card */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Student / Enquiry:</span>
                  <div style={{ fontWeight: 800, color: '#0F172A', marginTop: '1px' }}>
                    {lead.parentName}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {lead.gradeClass} ({parsedSubjects}) • 📍 {lead.locality}
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#E2E8F0' }} />

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Assigned Tutor:</span>
                  <div style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1px' }}>
                    <span>{pendingAssignTutor.name}</span>
                    <span style={{ fontSize: '0.66rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#DCFCE7', color: '#166534', fontWeight: 800 }}>✓ Verified</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                    {pendingAssignTutor.highestDegree} • 📍 ~{pendingAssignTutor.distanceKm} km away • <strong style={{ color: '#0F766E' }}>₹{pendingAssignTutor.hourlyRateHome}/hr</strong>
                  </div>
                </div>
              </div>

              {/* Yes / No Action Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setPendingAssignTutor(null)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Cancel / No
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleMatch(pendingAssignTutor);
                    setPreviewTutor(null);
                  }}
                  style={{
                    flex: 1.3,
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Check size={16} color="#38BDF8" />
                  <span>Yes, Confirm &amp; Assign</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
