'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import BookingModal from '@/components/BookingModal';
import VideoModal from '@/components/VideoModal';
import StickyMobileBar from '@/components/StickyMobileBar';
import {
  GURGAON_LOCALITIES,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  VERIFIED_TUTORS,
  SSSAM_OFFICE_DETAILS,
  MockTutor,
} from '@/lib/data';
import {
  Sparkles,
  ShieldCheck,
  Star,
  Play,
  MapPin,
  CheckCircle,
  Video,
  Home,
  GraduationCap,
  ArrowRight,
  HelpCircle,
  Building2,
  Phone,
  Clock,
  Award,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<{
    tutorName?: string;
    grade?: string;
    mode?: string;
  } | undefined>(undefined);

  const [activeVideoTutor, setActiveVideoTutor] = useState<MockTutor | null>(null);

  // Search Filters State
  const [searchMode, setSearchMode] = useState<'OFFLINE_HOME' | 'ONLINE_LIVE'>('OFFLINE_HOME');
  const [selectedLocality, setSelectedLocality] = useState(GURGAON_LOCALITIES[0].name);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
  const [selectedGrade, setSelectedGrade] = useState(CLASS_OPTIONS[2]);

  // Open booking modal helper
  const handleOpenBooking = (tutor?: MockTutor) => {
    if (tutor) {
      setSelectedTutorForBooking({ tutorName: tutor.name });
    } else {
      setSelectedTutorForBooking(undefined);
    }
    setBookingOpen(true);
  };

  const handleBookWithEstimate = (data: { grade: string; mode: string; estimatedMonthly: string }) => {
    setSelectedTutorForBooking({ grade: data.grade, mode: data.mode });
    setBookingOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. HERO SECTION (HIGH CONVERSION & SEARCH)
            ========================================================================= */}
        <section style={{
          position: 'relative',
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          background: 'radial-gradient(circle at 50% 10%, rgba(219, 234, 254, 0.4), rgba(248, 250, 252, 1) 70%)',
        }}>
          <div className="container">
            {/* Top Verified Tag */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div className="badge badge-trust" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                <span className="pulse-emerald" />
                <span>OPERATED & MANAGED BY SSSAM ACADEMY (SECTOR 14 GURUGRAM)</span>
              </div>
            </div>

            {/* Main Headline */}
            <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2.5rem auto' }}>
              <h1 style={{ marginBottom: '1.25rem' }}>
                Verified <span className="text-gradient">Home & Online Tutors</span> in Gurgaon with 100% Trust
              </h1>
              <p style={{ fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)', color: 'var(--color-slate-600)', lineHeight: 1.6 }}>
                1-on-1 personalized tutoring for CBSE, ICSE, IB & Coding. Every tutor is academic-screened and background-verified with a <strong>1 Free Demo Class + 100% Replacement Guarantee</strong>.
              </p>
            </div>

            {/* Interactive Search Box */}
            <div style={{
              maxWidth: '960px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-hover)',
              border: '1.5px solid var(--border-subtle)',
            }}>
              {/* Mode Switcher */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSearchMode('OFFLINE_HOME')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: searchMode === 'OFFLINE_HOME' ? 'var(--color-slate-900)' : 'transparent',
                    color: searchMode === 'OFFLINE_HOME' ? '#FFFFFF' : 'var(--color-slate-600)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Home size={16} />
                  <span>Home Tuition (At My Home)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('ONLINE_LIVE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: searchMode === 'ONLINE_LIVE' ? 'var(--color-slate-900)' : 'transparent',
                    color: searchMode === 'ONLINE_LIVE' ? '#FFFFFF' : 'var(--color-slate-600)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Video size={16} />
                  <span>Online 1-on-1 Live</span>
                </button>
              </div>

              {/* Search Dropdowns Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'flex-end',
              }}>
                {/* Locality */}
                {searchMode === 'OFFLINE_HOME' ? (
                  <div>
                    <label className="form-label">Gurgaon Locality / Sector</label>
                    <select
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="form-control"
                    >
                      {GURGAON_LOCALITIES.map((loc) => (
                        <option key={loc.slug} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="form-label">City / Region</label>
                    <select className="form-control">
                      <option>Delhi NCR & Pan-India</option>
                      <option>Gurgaon & South Delhi</option>
                      <option>International / NRI Students</option>
                    </select>
                  </div>
                )}

                {/* Grade */}
                <div>
                  <label className="form-label">Grade / Board</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="form-control"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="form-label">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="form-control"
                  >
                    {SUBJECT_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="btn btn-primary"
                  style={{ height: '46px', width: '100%', justifyContent: 'center' }}
                >
                  <Sparkles size={16} />
                  <span>Find Tutors</span>
                </button>
              </div>
            </div>

            {/* Trust Highlights Bar */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              marginTop: '3rem',
              color: 'var(--color-slate-700)',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={18} color="var(--color-emerald-600)" />
                <span>100% Background Verified Tutors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Star size={18} color="var(--color-amber-500)" fill="var(--color-amber-500)" />
                <span>4.95 / 5 Parent Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={18} color="var(--color-blue-600)" />
                <span>1 Free Demo Class</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={18} color="var(--color-slate-900)" />
                <span>Physical Center in Sector 14 Gurugram</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. VERIFIED TUTORS SHOWCASE (WITH VIDEO INTRO TRIGGERS)
            ========================================================================= */}
        <section id="find-tutor" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
              <div>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <Award size={14} />
                  <span>FEATURED EDUCATORS</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800 }}>
                  Top Verified Home Tutors in Gurgaon
                </h2>
                <p style={{ color: 'var(--color-slate-600)', marginTop: '0.35rem' }}>
                  Watch their 60-second video introductions to evaluate communication and teaching style before booking.
                </p>
              </div>

              <button onClick={() => handleOpenBooking()} className="btn btn-secondary">
                <span>View All 500+ Tutors</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Tutors Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.75rem',
            }}>
              {VERIFIED_TUTORS.map((tutor) => (
                <div key={tutor.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Top Media Bar */}
                  <div style={{ position: 'relative', padding: '1.25rem', paddingBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        style={{ width: '68px', height: '68px', borderRadius: '16px', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        backgroundColor: 'var(--color-emerald-500)',
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
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                          {tutor.name}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-blue-600)', fontWeight: 700, margin: '2px 0' }}>
                        {tutor.badge}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--color-slate-600)' }}>
                        <Star size={13} color="var(--color-amber-500)" fill="var(--color-amber-500)" />
                        <strong>{tutor.rating}</strong>
                        <span>({tutor.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Tutor Body Details (Line-wise Clean Apple Aesthetic) */}
                  <div style={{ padding: '1.25rem', paddingTop: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-700)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={15} color="var(--color-blue-600)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{tutor.highestDegree}</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-700)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <MapPin size={15} color="var(--color-emerald-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{tutor.serviceAreas.join(' • ')}</span>
                    </div>

                    {/* Subjects Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--color-slate-100)', color: 'var(--color-slate-800)', borderRadius: '6px', fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* 60s Video Intro Trigger */}
                    <button
                      type="button"
                      onClick={() => setActiveVideoTutor(tutor)}
                      style={{
                        marginTop: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-blue-50)',
                        border: '1px solid var(--color-blue-100)',
                        color: 'var(--color-blue-700)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Play size={14} fill="var(--color-blue-600)" />
                        <span>Watch 60s Intro Video</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-blue-500)' }}>{tutor.videoDuration}</span>
                    </button>
                  </div>

                  {/* Card Footer Price & Action */}
                  <div style={{
                    padding: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--color-slate-50)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-slate-500)', fontWeight: 600 }}>STARTING FROM</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                        ₹{tutor.hourlyRateHome}<span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/hr</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(tutor)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Book Free Demo</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE FEE ESTIMATOR WIDGET
            ========================================================================= */}
        <FeeEstimator onBookWithEstimate={handleBookWithEstimate} />

        {/* =========================================================================
            4. SSSAM ACADEMY PHYSICAL CENTER ASSURANCE SECTION
            ========================================================================= */}
        <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{
              backgroundColor: 'var(--color-slate-900)',
              color: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}>
              <div>
                <div className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--color-emerald-500)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '1rem' }}>
                  <Building2 size={14} />
                  <span>ESTABLISHED PHYSICAL CENTER IN GURUGRAM</span>
                </div>
                <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
                  Not Just a Website. A Real Educational Institute.
                </h2>
                <p style={{ color: 'var(--color-slate-300)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Unlike unverified online classifieds where anyone can post a number, <strong>TuitionForHome</strong> is backed by <strong>SSSAM Academy</strong>, situated in Sector 14, Old DLF, Gurugram.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', fontSize: '0.92rem', color: 'var(--color-slate-200)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="var(--color-emerald-500)" />
                    <span>In-person tutor document audit & interview screening</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="var(--color-emerald-500)" />
                    <span>Option to have your 1st demo class at our Sector 14 classrooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="var(--color-emerald-500)" />
                    <span>100% Free tutor replacement guarantee if student is not satisfied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => handleOpenBooking()} className="btn btn-primary btn-lg">
                    <span>Schedule Free Demo</span>
                    <ArrowRight size={18} />
                  </button>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary btn-lg" style={{ color: 'var(--color-slate-900)' }}>
                    <Phone size={18} />
                    <span>Call Sector 14 Center</span>
                  </a>
                </div>
              </div>

              {/* Center Details Card */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                padding: '2rem',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={20} color="#60A5FA" />
                  <span>SSSAM Academy Gurugram Center</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--color-slate-300)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', fontWeight: 700 }}>OFFICIAL ADDRESS</div>
                    <div style={{ color: '#FFFFFF', marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.address}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', fontWeight: 700 }}>DIRECT HELPLINE NUMBERS</div>
                    <div style={{ color: '#93C5FD', fontWeight: 700, marginTop: '2px', fontSize: '1.05rem' }}>
                      {SSSAM_OFFICE_DETAILS.phones[0]} • {SSSAM_OFFICE_DETAILS.phones[1]}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', fontWeight: 700 }}>COUNSELOR DESK TIMINGS</div>
                    <div style={{ color: '#FFFFFF', marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.hours} (All 7 Days)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. GURGAON LOCALITIES SEO DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-slate-50)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
              <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
                <MapPin size={14} />
                <span>HYPER-LOCAL COVERAGE</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
                Home Tutors Available in Your Gurgaon Sector
              </h2>
              <p style={{ color: 'var(--color-slate-600)', marginTop: '0.35rem' }}>
                Over 500+ verified teachers ready to travel across all residential sectors of Gurgaon.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}>
              {GURGAON_LOCALITIES.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/home-tutors-in-gurgaon/${loc.slug}`}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-subtle)',
                    transition: 'var(--transition-fast)',
                  }}
                  className="locality-card"
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-slate-900)' }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                      {loc.landmark}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-blue-600)', backgroundColor: 'var(--color-blue-50)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
                    {loc.activeTutorsCount}+ Tutors
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialData={selectedTutorForBooking}
      />

      <VideoModal
        tutor={activeVideoTutor}
        onClose={() => setActiveVideoTutor(null)}
        onBookDemo={(tutor) => handleOpenBooking(tutor)}
      />

      <StickyMobileBar onOpenBooking={() => handleOpenBooking()} />

      <style jsx>{`
        .locality-card:hover {
          border-color: var(--color-blue-600) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-card) !important;
        }
      `}</style>
    </div>
  );
}
