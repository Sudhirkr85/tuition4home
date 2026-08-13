'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import BookingModal from '@/components/BookingModal';
import VideoModal from '@/components/VideoModal';
import StickyMobileBar from '@/components/StickyMobileBar';
import RapidoStyleMap from '@/components/RapidoStyleMap';
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
  CheckCircle2,
  Video,
  Home,
  GraduationCap,
  ChevronRight,
  Building2,
  Phone,
  Users,
  Award,
  BookOpen,
  MessageSquare,
  Smartphone,
  Lock,
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. FIGMA SCREENSHOT 1 STYLE HERO SECTION
            ========================================================================= */}
        <section style={{
          paddingTop: '3.5rem',
          paddingBottom: '4.5rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}>
              {/* Left Column: Headline & Action Controls */}
              <div>
                <div className="badge badge-blue" style={{ marginBottom: '1rem' }}>
                  <ShieldCheck size={14} />
                  <span>BUILT FOR GURGAON & NCR • SSSAM ACADEMY</span>
                </div>

                <h1 style={{ marginBottom: '1.25rem' }}>
                  <span className="text-teal">Verified</span> Home & Online Tutors. End to End.
                </h1>

                <p style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  1-on-1 personalized tutoring for CBSE, ICSE, IB & Coding. Background-checked educators matched to your sector with a <strong>100% Replacement Guarantee</strong>.
                </p>

                {/* Mode Segmented Pill Switcher */}
                <div style={{
                  display: 'inline-flex',
                  backgroundColor: 'var(--bg-app)',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-hairline)',
                  marginBottom: '1.5rem',
                }}>
                  <button
                    type="button"
                    onClick={() => setSearchMode('OFFLINE_HOME')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      backgroundColor: searchMode === 'OFFLINE_HOME' ? 'var(--brand-teal)' : 'transparent',
                      color: searchMode === 'OFFLINE_HOME' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Home size={15} />
                    <span>Home Visit (Offline)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSearchMode('ONLINE_LIVE')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      backgroundColor: searchMode === 'ONLINE_LIVE' ? 'var(--brand-teal)' : 'transparent',
                      color: searchMode === 'ONLINE_LIVE' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Video size={15} />
                    <span>Online 1-on-1</span>
                  </button>
                </div>

                {/* Search Bar Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.75rem',
                }}>
                  {searchMode === 'OFFLINE_HOME' ? (
                    <div>
                      <label className="form-label">Gurgaon Sector</label>
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
                      <input className="form-control" value="Pan-India (Online Live)" readOnly />
                    </div>
                  )}

                  <div>
                    <label className="form-label">Class & Subject</label>
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
                </div>

                {/* Primary Pill Button + Side Arrow Link (Screenshot 1 Style) */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenBooking()}
                    className="btn btn-primary btn-lg"
                  >
                    <span>Request Trial Class</span>
                    <div className="btn-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </button>

                  <a
                    href="#find-tutor"
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span>View Tutor Catalog</span>
                    <ChevronRight size={16} color="var(--brand-teal)" />
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Teacher Cutout & Floating Feature Cards (Screenshot 1 Style) */}
              <div style={{ position: 'relative' }}>
                <div className="apple-card" style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', border: 'none', boxShadow: 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero_tutor_student_cutout.jpg"
                    alt="Verified Home Tutor in Gurgaon"
                    style={{ width: '100%', borderRadius: '20px', objectFit: 'cover' }}
                  />
                </div>

                {/* Bottom Floating Feature Cards (Screenshot 1 Style) */}
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '5%',
                  right: '5%',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}>
                  <div className="apple-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>SSSAM Academy</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sector 14 Gurugram</div>
                    </div>
                  </div>

                  <div className="apple-card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>100% Replacement</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Zero Advance Risk</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. RAPIDO-STYLE INTERACTIVE VISUAL PROXIMITY MAP (IF OFFLINE HOME TUITION)
            ========================================================================= */}
        {searchMode === 'OFFLINE_HOME' && (
          <section style={{ padding: '3.5rem 0 1rem 0' }}>
            <div className="container">
              <RapidoStyleMap
                onLocationSelected={(data) => {
                  setSelectedLocality(data.address);
                }}
              />
            </div>
          </section>
        )}

        {/* =========================================================================
            3. FIGMA SCREENSHOT 4 STYLE: "FROM SETUP TO SCORE IN MINUTES" (4-STEP GRID)
            ========================================================================= */}
        <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-app)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem auto' }}>
              <div className="badge badge-blue" style={{ marginBottom: '0.75rem' }}>
                <span>SIMPLE 4-STEP PROCESS</span>
              </div>
              <h2 style={{ fontSize: '2.35rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                From Setup to Score in Minutes
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
                No complex paperwork. Get your Gurgaon sector matched with verified tutors today.
              </p>
            </div>

            {/* 4 Horizontal Step Cards (Screenshot 4 Style) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3.5rem',
            }}>
              {/* Step 1 */}
              <div className="step-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="step-pill">• Step-1</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Select Mode & Sector
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Choose Home Visit or Online 1-on-1. Enter your Gurgaon sector or use 1-click GPS detection.
                </p>
              </div>

              {/* Step 2 */}
              <div className="step-card" style={{ borderColor: 'var(--brand-teal)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="step-pill">• Step-2</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Counselor Proximity Match
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Our team at SSSAM Academy shortlists verified educators residing within 3.5 km of your sector.
                </p>
              </div>

              {/* Step 3 */}
              <div className="step-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="step-pill">• Step-3</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Attend 1-on-1 Trial Class
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Evaluate teaching style and conceptual clarity. Watch tutor 60s intro video beforehand.
                </p>
              </div>

              {/* Step 4 */}
              <div className="step-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span className="step-pill">• Step-4</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Confirm & Start Regulars
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  Pay monthly tuition only when 100% satisfied. Full free replacement guarantee included.
                </p>
              </div>
            </div>

            {/* Visual Process Graphic Illustration */}
            <div className="apple-card" style={{ padding: '1.5rem', overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/how_it_works_graphic.jpg"
                alt="How TuitionForHome System Works"
                style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: '16px' }}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. FIGMA SCREENSHOT 3 STYLE: MOBILE EXPERIENCE CARD
            ========================================================================= */}
        <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
                <span>PARENT EXPERIENCE</span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
                The Simplest Tuition Experience. Ever.
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                No account required for parents. Receive your trial details directly via WhatsApp or Phone.
              </p>
            </div>

            <div className="apple-card" style={{
              backgroundColor: 'var(--bg-app)',
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}>
              {/* Left Column: Phone Mockup Image (Screenshot 3 Style) */}
              <div style={{ textAlign: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mobile_whatsapp_mockup.jpg"
                  alt="Mobile Trial Class Confirmation Mockup"
                  style={{ width: '100%', maxWidth: '380px', borderRadius: '20px', boxShadow: 'var(--shadow-hover)' }}
                />
              </div>

              {/* Right Column: Key Experience Points (Screenshot 3 Style) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      Receive Trial Slip via WhatsApp
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Parent gets tutor qualifications and schedule link directly on WhatsApp — zero app download needed.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      Attend on Any Device or Home Visit
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Home visits scheduled at your preferred timing in Gurgaon sectors, or online live on Google Meet.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      100% Free Replacement Guarantee
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      If student is unsatisfied after trial, counselor assigns a new top-tier tutor at zero additional fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. VERIFIED TUTORS SHOWCASE (FIGMA SOFT CARDS)
            ========================================================================= */}
        <section id="find-tutor" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-app)' }}>
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
                <ChevronRight size={16} color="var(--brand-teal)" />
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
                      <div style={{ fontSize: '0.78rem', color: 'var(--brand-teal)', fontWeight: 700, margin: '2px 0' }}>
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
                      <GraduationCap size={15} color="var(--brand-teal)" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{tutor.highestDegree} • {tutor.experienceYears}+ Yrs Exp</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <MapPin size={15} color="var(--brand-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{tutor.serviceAreas.join(' • ')}</span>
                    </div>

                    {/* Subjects Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', borderRadius: '6px', fontWeight: 600 }}>
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
                        backgroundColor: 'var(--brand-teal-light)',
                        border: '1px solid var(--border-teal)',
                        color: 'var(--brand-teal)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Play size={14} fill="var(--brand-teal)" />
                        <span>Watch 60s Video Intro</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--brand-teal)' }}>{tutor.videoDuration}</span>
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
                      <div className="btn-arrow">
                        <ChevronRight size={13} />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. INTERACTIVE FEE ESTIMATOR WIDGET
            ========================================================================= */}
        <FeeEstimator onBookWithEstimate={handleBookWithEstimate} />

        {/* =========================================================================
            7. SSSAM ACADEMY PHYSICAL CENTER TRUST SECTION
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
                <div className="badge" style={{ backgroundColor: 'rgba(45, 212, 191, 0.2)', color: '#2DD4BF', border: '1px solid rgba(45, 212, 191, 0.35)', marginBottom: '1rem' }}>
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
                    <CheckCircle2 size={18} color="#2DD4BF" />
                    <span>In-person tutor document audit & interview screening</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} color="#2DD4BF" />
                    <span>Option to have your trial class at our Sector 14 classrooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} color="#2DD4BF" />
                    <span>100% Free replacement guarantee if student is unsatisfied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <button onClick={() => handleOpenBooking()} className="btn btn-primary btn-lg">
                    <span>Request Trial Class</span>
                    <div className="btn-arrow">
                      <ChevronRight size={16} />
                    </div>
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
                  <MapPin size={20} color="#2DD4BF" />
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
            8. GURGAON LOCALITIES SEO DIRECTORY GRID
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-teal)', backgroundColor: 'var(--brand-teal-light)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
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
