'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, ChevronRight, ShieldCheck, Star, Clock, GraduationCap, Briefcase, MapPin, Play, Sparkles } from 'lucide-react';
import TutorAvatar from '@/components/TutorAvatar';
import { MockTutor } from '@/lib/data';
import { calculateHaversineKm, getDistanceInfo, getTeacherCoordinates, POPULAR_GURGAON_SECTORS } from '@/lib/geo';
import { useHomeContext } from './HomeContext';

const SECTORS = [
  'All Sectors',
  'DLF Phase 5',
  'Golf Course Road',
  'Sector 14 & Old DLF',
  'Sohna Road',
  'Sector 56',
  'Nirvana Country',
  'Sushant Lok 1',
  'DLF Phase 1',
  'Cyber City',
  'Sector 57',
  'Sector 48',
];

export function HomeTutorSection() {
  const { openBooking, openVideo } = useHomeContext();
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>([]);
  const [selectedShowcaseSector, setSelectedShowcaseSector] = useState<string>('All Sectors');
  const [selectedShowcaseGender, setSelectedShowcaseGender] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');

  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors)) {
          setDynamicTutors(data.tutors);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch tutors in showcase:', err);
      });
  }, []);

  const showcaseSectorCoords = (() => {
    const match = POPULAR_GURGAON_SECTORS.find((s) =>
      s.name.toLowerCase().includes(selectedShowcaseSector.toLowerCase())
    );
    if (match) return { lat: match.lat, lng: match.lng };
    return { lat: 28.4552, lng: 77.0945 };
  })();

  const baseList =
    selectedShowcaseGender === 'ALL'
      ? dynamicTutors
      : dynamicTutors.filter((t) => (t.gender || '').toUpperCase() === selectedShowcaseGender);

  const filtered =
    selectedShowcaseSector === 'All Sectors'
      ? baseList.slice(0, 6)
      : (() => {
          const matched = baseList.filter((t) =>
            t.serviceAreas.some((area) =>
              area.toLowerCase().includes(selectedShowcaseSector.toLowerCase())
            )
          );
          if (matched.length >= 6) return matched.slice(0, 6);
          const remaining = baseList.filter((t) => !matched.some((m) => m.id === t.id));
          return [...matched, ...remaining].slice(0, 6);
        })();

  return (
    <section id="find-tutor" aria-label="Verified Tutors in Gurgaon" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-app)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
              <Award size={14} />
              <span>REVIEW-VERIFIED EDUCATORS</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800 }}>
              Top Verified Teachers {selectedShowcaseSector === 'All Sectors' ? 'Near Your Sector' : `in ${selectedShowcaseSector}`}
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Watch 60-second intro videos and connect with verified educators ready to teach in {selectedShowcaseSector === 'All Sectors' ? 'your Gurgaon sector' : selectedShowcaseSector}.
            </p>
          </div>

          <Link href="/tutors" className="btn btn-secondary">
            <span>Browse All Verified Teachers</span>
            <ChevronRight size={16} color="#0F6E56" />
          </Link>
        </div>

        {/* Quick Specialty / Gender Highlight Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          overflowX: 'auto',
          padding: '0.2rem 0.25rem 0.65rem 0.25rem',
          marginBottom: '0.75rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Filter:
          </span>
          {[
            { id: 'ALL', label: '🌐 All Verified Teachers' },
            { id: 'FEMALE', label: '👩 Female Teachers Only', highlight: true },
            { id: 'MALE', label: '👨 Male Teachers' },
          ].map((cat) => {
            const isSel = selectedShowcaseGender === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedShowcaseGender(cat.id as any)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  border: isSel 
                    ? (cat.highlight ? '2px solid #0D9488' : '2px solid #0F172A') 
                    : (cat.highlight ? '2px solid #CCFBF1' : '1px solid #E2E8F0'),
                  backgroundColor: isSel 
                    ? (cat.highlight ? '#0F766E' : '#0F172A') 
                    : (cat.highlight ? '#F0FDFA' : '#FFFFFF'),
                  color: isSel ? '#FFFFFF' : (cat.highlight ? '#0F766E' : '#334155'),
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isSel ? '0 4px 12px rgba(13, 148, 136, 0.25)' : '0 1px 2px rgba(0,0,0,0.03)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{cat.label}</span>
                {cat.highlight && !isSel && (
                  <span style={{ backgroundColor: '#0D9488', color: '#FFFFFF', fontSize: '0.65rem', padding: '0.1rem 0.45rem', borderRadius: '999px', fontWeight: 900 }}>
                    POPULAR
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sector Selector Filter Pills */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          padding: '0.2rem 0.25rem 0.75rem 0.25rem',
          marginBottom: '1.75rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}>
          {SECTORS.map((sec) => {
            const isSel = selectedShowcaseSector === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedShowcaseSector(sec)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  border: isSel ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                  backgroundColor: isSel ? '#0F6E56' : '#FFFFFF',
                  color: isSel ? '#FFFFFF' : '#334155',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSel ? '0 4px 12px rgba(15,110,86,0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                {sec === 'All Sectors' ? '🌐 All Sectors' : `📍 ${sec}`}
              </button>
            );
          })}
        </div>

        {/* Teachers Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.75rem',
        }}>
          {filtered.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              border: '1.5px dashed #CBD5E1',
              boxShadow: 'var(--shadow-subtle)',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-teal-light)',
                color: '#0F6E56',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}>
                <Sparkles size={28} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Teacher Verification &amp; Matching Active
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', maxWidth: '540px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                SSSAM Academy academic counselors are actively matching verified teachers across all Gurgaon sectors. Submit your requirement to get matched directly within 2 hours!
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => openBooking()}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.75rem', backgroundColor: 'var(--brand-teal)' }}
                >
                  <span>Request a Home Teacher</span>
                  <ChevronRight size={16} />
                </button>
                <Link href="/tutor/register" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem' }}>
                  <span>Apply as Educator</span>
                </Link>
              </div>
            </div>
          ) : (
            filtered.map((tutor) => {
              const tCoords = getTeacherCoordinates(tutor);
              const distanceKm = calculateHaversineKm(showcaseSectorCoords.lat, showcaseSectorCoords.lng, tCoords.lat, tCoords.lng);
              const distanceInfo = getDistanceInfo(distanceKm);

              return (
                <div key={tutor.id} className="apple-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Top Bar */}
                  <div style={{ padding: '1.25rem', paddingBottom: '0.45rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href={`/tutors/${tutor.id}`} style={{ position: 'relative', display: 'block', flexShrink: 0 }}>
                      <TutorAvatar
                        src={tutor.avatarUrl}
                        name={tutor.name}
                        size={64}
                        borderRadius="16px"
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        backgroundColor: '#047857',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        border: '2px solid #FFFFFF',
                      }}>
                        <ShieldCheck size={11} />
                      </span>
                    </Link>

                    <div style={{ flex: 1 }}>
                      <Link href={`/tutors/${tutor.id}`} style={{ textDecoration: 'none' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          {tutor.name}
                        </h3>
                      </Link>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', margin: '2px 0' }}>
                        <span style={{ fontSize: '0.78rem', color: '#0F6E56', fontWeight: 700 }}>
                          {tutor.badge}
                        </span>
                        {tutor.gender?.toUpperCase() === 'FEMALE' && (
                          <span style={{ backgroundColor: '#F0FDFA', color: '#0F766E', fontSize: '0.7rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', border: '1px solid #CCFBF1' }}>
                            👩 Female Educator
                          </span>
                        )}
                      </div>
                      {tutor.totalReviews > 0 && tutor.rating > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <Star size={13} color="var(--brand-amber)" fill="var(--brand-amber)" />
                          <strong>{tutor.rating}</strong>
                          <span>({tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'})</span>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.74rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', marginTop: '2px' }}>
                          <span>✨ New Verified Teacher</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Proximity Badge */}
                  <div style={{ padding: '0 1.25rem', marginBottom: '0.4rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.28rem 0.65rem',
                      borderRadius: '8px',
                      backgroundColor: distanceInfo.badgeBg,
                      color: distanceInfo.badgeColor,
                      border: `1px solid ${distanceInfo.badgeBorder}`,
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}>
                      <Clock size={12} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {distanceInfo.distanceText} ({distanceInfo.travelTime})
                      </span>
                    </div>
                  </div>

                  {/* Education & Experience Stat Box */}
                  <div style={{ padding: '1.25rem', paddingTop: '0.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      gap: '0.5rem',
                      padding: '0.65rem 0.75rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                          <GraduationCap size={15} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Degree</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tutor.highestDegree}>
                            {tutor.highestDegree}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, borderLeft: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                          <Briefcase size={15} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Experience</div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tutor.experienceYears}+ Years
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginTop: '0.1rem' }}>
                      <MapPin size={15} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {tutor.serviceAreas.join(' • ')}
                      </span>
                    </div>

                    {/* Subjects Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #DCFCE7', borderRadius: '6px', fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* 60s Video Intro Pill */}
                    {tutor.introVideoUrl && tutor.introVideoUrl.trim() !== '' ? (
                      <button
                        type="button"
                        onClick={() => openVideo(tutor)}
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.85rem',
                          borderRadius: '10px',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          color: '#0F6E56',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Play size={14} fill="#0F6E56" />
                          <span>Watch 60s Intro Video</span>
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#0F6E56' }}>{tutor.videoDuration || 'Preview'}</span>
                      </button>
                    ) : (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#0F6E56',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        <ShieldCheck size={14} color="#059669" />
                        <span>Background Verified by SSSAM Academy</span>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom CTA */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: '#F8FAFC',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Home / 1-on-1</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>₹{tutor.hourlyRateHome}<span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>/hr</span></div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link
                        href={`/tutors/${tutor.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.45rem 0.65rem' }}
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        onClick={() => openBooking(tutor)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem', backgroundColor: '#0F6E56' }}
                      >
                        <span>Book Demo</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
