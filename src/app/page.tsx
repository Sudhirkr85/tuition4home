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
  Building2,
  Phone,
  Users,
  Award,
  BookOpen,
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
  const [detectingGps, setDetectingGps] = useState(false);

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

  // GPS Current Location Detector
  const handleDetectGps = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDetectingGps(false);
          setSelectedLocality('DLF Phase 5, Gurgaon (Auto-Detected)');
        },
        (error) => {
          setDetectingGps(false);
          setSelectedLocality(GURGAON_LOCALITIES[0].name);
        }
      );
    } else {
      setDetectingGps(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. CLEAN APPLE LIGHT HERO SECTION
            ========================================================================= */}
        <section style={{
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
        }}>
          <div className="container">
            {/* SSSAM Academy Trust Tag */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div className="badge badge-emerald" style={{ padding: '0.45rem 1.1rem' }}>
                <ShieldCheck size={14} />
                <span>OPERATED & MANAGED BY SSSAM ACADEMY • SECTOR 14 GURUGRAM</span>
              </div>
            </div>

            {/* Main Headline & Subtitle (Clean Line-wise) */}
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem auto' }}>
              <h1 style={{ marginBottom: '1rem' }}>
                Verified <span className="text-gradient">Home & Online Tutors</span> in Gurgaon
              </h1>
              <p style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                1-on-1 personalized tutoring for CBSE, ICSE, IB & Coding. Background-checked educators with a <strong>100% Replacement Guarantee</strong>.
              </p>
            </div>

            {/* Interactive Search Box */}
            <div className="apple-card" style={{
              maxWidth: '940px',
              margin: '0 auto',
              padding: '1.75rem',
            }}>
              {/* Mode Segmented Switcher */}
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setSearchMode('OFFLINE_HOME')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.35rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: searchMode === 'OFFLINE_HOME' ? 'var(--text-main)' : 'transparent',
                    color: searchMode === 'OFFLINE_HOME' ? '#FFFFFF' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <Home size={16} />
                  <span>Home Tuition (Offline)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSearchMode('ONLINE_LIVE')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 1.35rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    backgroundColor: searchMode === 'ONLINE_LIVE' ? 'var(--text-main)' : 'transparent',
                    color: searchMode === 'ONLINE_LIVE' ? '#FFFFFF' : 'var(--text-muted)',
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

              {/* Delivery-App Proximity Indicator (If Offline selected) */}
              {searchMode === 'OFFLINE_HOME' && (
                <div style={{
                  backgroundColor: 'var(--brand-emerald-light)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--brand-emerald)',
                  fontWeight: 700,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} />
                    <span>⚡ 14 Verified Tutors available within 3.5 km of {selectedLocality}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    style={{ background: 'none', border: 'none', color: 'var(--brand-blue)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    <MapPin size={14} />
                    <span>{detectingGps ? 'Detecting...' : 'GPS Auto-Detect'}</span>
                  </button>
                </div>
              )}

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
                    <label className="form-label">Gurgaon Sector / Locality</label>
                    <input
                      type="text"
                      value={selectedLocality}
                      onChange={(e) => setSelectedLocality(e.target.value)}
                      className="form-control"
                      placeholder="Enter Sector or Locality"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="form-label">Location</label>
                    <input className="form-control" value="Pan-India & Delhi NCR (Online 1-on-1)" readOnly />
                  </div>
                )}

                {/* Grade */}
                <div>
                  <label className="form-label">Grade / Class</label>
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
                  <span>Check Available Tutors</span>
                </button>
              </div>
            </div>

            {/* Quick Line-wise Trust Pillars */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3vw, 2.5rem)',
              marginTop: '3rem',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={18} color="var(--brand-emerald)" />
                <span>100% Verified Tutors & Police Audit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Star size={18} color="var(--brand-amber)" fill="var(--brand-amber)" />
                <span>4.95 / 5 Verified Parent Rating</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={18} color="var(--text-main)" />
                <span>Physical Institute in Sector 14 Gurugram</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. "HOW SYSTEM WORKS" (VIDEO + GRAPHIC STEP CARDS)
            ========================================================================= */}
        <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-app)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
              <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                <BookOpen size={14} />
                <span>TRANSPARENT SYSTEM PROCESS</span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                How TuitionForHome Works in 3 Simple Steps
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Zero hassle for parents. From sector selection to trial class in under 2 hours.
              </p>
            </div>

            {/* Visual 3-Step Process Graphic */}
            <div className="apple-card" style={{ padding: '2rem', marginBottom: '3rem', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/how_it_works_graphic.jpg"
                alt="How TuitionForHome Works Process"
                style={{ width: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '16px' }}
              />
            </div>

            {/* 3 Step Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
              marginBottom: '3.5rem',
            }}>
              <div className="apple-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-blue)', marginBottom: '0.5rem' }}>
                  STEP 1
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Select Mode & Gurgaon Sector
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Choose Home Tuition or Online 1-on-1. Enter your Gurgaon sector or use 1-click GPS auto-detection.
                </p>
              </div>

              <div className="apple-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-blue)', marginBottom: '0.5rem' }}>
                  STEP 2
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Counselor Matches Nearby Tutor
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Our academic team at SSSAM Academy shortlists the top verified educator residing within 3 km of your sector.
                </p>
              </div>

              <div className="apple-card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-emerald)', marginBottom: '0.5rem' }}>
                  STEP 3
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Start Trial Class & Confirm
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Attend the trial class. Pay only when 100% satisfied. Full free replacement guarantee included.
                </p>
              </div>
            </div>

            {/* Video Player Box for System Walkthrough */}
            <div className="apple-card" style={{
              padding: '2.5rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}>
              <div>
                <div className="badge" style={{ backgroundColor: 'rgba(0, 102, 204, 0.25)', color: '#60A5FA', border: '1px solid rgba(0, 102, 204, 0.4)', marginBottom: '0.85rem' }}>
                  <Play size={14} fill="#60A5FA" />
                  <span>SYSTEM WALKTHROUGH VIDEO</span>
                </div>
                <h3 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Watch How We Verify Tutors & Match Parents
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  See our step-by-step counselor verification workflow, in-person center screening, and trial class confirmation process.
                </p>

                <button onClick={() => handleOpenBooking()} className="btn btn-emerald">
                  <span>Request Trial Callback</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* Video Player Box Placeholder */}
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                backgroundColor: '#000000',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              }}>
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                  title="How TuitionForHome Works Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. VERIFIED TUTORS SHOWCASE (DYNAMIC REVIEWS & SENIOR TIERS)
            ========================================================================= */}
        <section id="find-tutor" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
              <div>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <Award size={14} />
                  <span>REVIEW-VERIFIED EDUCATORS</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800 }}>
                  Top Verified Tutors Near Your Sector
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Watch 60-second intro videos and read verified parent reviews before requesting a trial class.
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
                <div key={tutor.id} className="apple-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Top Bar */}
                  <div style={{ padding: '1.25rem', paddingBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        backgroundColor: 'var(--brand-emerald)',
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
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {tutor.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 700, margin: '2px 0' }}>
                        {tutor.badge}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        <Star size={13} color="var(--brand-amber)" fill="var(--brand-amber)" />
                        <strong>{tutor.rating}</strong>
                        <span>({tutor.totalReviews} parent reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Line-wise Points */}
                  <div style={{ padding: '1.25rem', paddingTop: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <GraduationCap size={15} color="var(--brand-blue)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{tutor.highestDegree} • {tutor.experienceYears}+ Yrs Exp</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <MapPin size={15} color="var(--brand-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{tutor.serviceAreas.join(' • ')}</span>
                    </div>

                    {/* Subjects Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)', borderRadius: '6px', fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* 60s Video Intro Pill */}
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
                        backgroundColor: 'var(--brand-blue-light)',
                        border: '1px solid rgba(0, 102, 204, 0.15)',
                        color: 'var(--brand-blue)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Play size={14} fill="var(--brand-blue)" />
                        <span>Watch 60s Video Intro</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--brand-blue)' }}>{tutor.videoDuration}</span>
                    </button>
                  </div>

                  {/* Card Footer Price & Action */}
                  <div style={{
                    padding: '1.25rem',
                    borderTop: '1px solid var(--border-hairline)',
                    backgroundColor: 'var(--bg-card-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>STARTING FROM</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{tutor.hourlyRateHome}<span style={{ fontSize: '0.75rem', fontWeight: 500 }}>/hr</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(tutor)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Request Trial</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. INTERACTIVE FEE ESTIMATOR WIDGET
            ========================================================================= */}
        <FeeEstimator onBookWithEstimate={handleBookWithEstimate} />

        {/* =========================================================================
            5. SSSAM ACADEMY PHYSICAL CENTER TRUST SECTION
            ========================================================================= */}
        <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div className="apple-card" style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}>
              <div>
                <div className="badge" style={{ backgroundColor: 'rgba(5, 150, 105, 0.25)', color: '#34D399', border: '1px solid rgba(5, 150, 105, 0.4)', marginBottom: '1rem' }}>
                  <Building2 size={14} />
                  <span>ESTABLISHED PHYSICAL CENTER IN GURUGRAM</span>
                </div>
                <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
                  Not Just a Website. A Real Educational Institute.
                </h2>
                <p style={{ color: '#CBD5E1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Backed by <strong>SSSAM Academy</strong>, situated in Sector 14, Old DLF, Gurugram. Tutors undergo in-person document screening and video intro audits.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', fontSize: '0.92rem', color: '#E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="#34D399" />
                    <span>In-person tutor document audit & interview screening</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="#34D399" />
                    <span>Option to have your trial class at our Sector 14 classrooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle size={18} color="#34D399" />
                    <span>100% Free replacement guarantee if student is unsatisfied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => handleOpenBooking()} className="btn btn-primary btn-lg">
                    <span>Request Trial Callback</span>
                    <ArrowRight size={18} />
                  </button>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary btn-lg" style={{ color: 'var(--text-main)' }}>
                    <Phone size={18} />
                    <span>Call Sector 14 Center</span>
                  </a>
                </div>
              </div>

              {/* Address Card */}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: '#CBD5E1' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>OFFICIAL ADDRESS</div>
                    <div style={{ color: '#FFFFFF', marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.address}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>DIRECT HELPLINE NUMBERS</div>
                    <div style={{ color: '#93C5FD', fontWeight: 700, marginTop: '2px', fontSize: '1.05rem' }}>
                      {SSSAM_OFFICE_DETAILS.phones[0]} • {SSSAM_OFFICE_DETAILS.phones[1]}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>COUNSELOR DESK TIMINGS</div>
                    <div style={{ color: '#FFFFFF', marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.hours} (All 7 Days)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. GURGAON LOCALITIES SEO DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-app)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
              <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
                <MapPin size={14} />
                <span>HYPER-LOCAL COVERAGE</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
                Home Tutors Available in Your Gurgaon Sector
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
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
                  className="apple-card"
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                      {loc.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {loc.landmark}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-blue)', backgroundColor: 'var(--brand-blue-light)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
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
    </div>
  );
}
