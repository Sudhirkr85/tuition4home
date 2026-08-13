'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import BookingModal from '@/components/BookingModal';
import VideoModal from '@/components/VideoModal';
import StickyMobileBar from '@/components/StickyMobileBar';
import RapidoStyleMap from '@/components/RapidoStyleMap';
import HowItWorks from '@/components/HowItWorks';

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
  Globe,
} from 'lucide-react';

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<{
    tutorName?: string;
    grade?: string;
    mode?: string;
  } | undefined>(undefined);

  const [activeVideoTutor, setActiveVideoTutor] = useState<MockTutor | null>(null);

  // Search Mode State
  const [searchMode, setSearchMode] = useState<'OFFLINE_HOME' | 'ONLINE_LIVE'>('OFFLINE_HOME');

  // Dynamic Sector Text Auto-Slide State
  const [currentSectorIndex, setCurrentSectorIndex] = useState(0);
  const sectorList = [
    'DLF Phase 5',
    'Golf Course Road',
    'Sector 56',
    'DLF Phase 1',
    'Sohna Road',
    'Nirvana Country',
    'Sushant Lok 1',
    'Sector 14 & Old DLF',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSectorIndex((prev) => (prev + 1) % sectorList.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [sectorList.length]);

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

  // LocalBusiness Schema JSON-LD Markup
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TuitionForHome',
    alternateName: 'SSSAM Academy Tuition Services',
    url: 'https://tuitionforhome.com',
    logo: 'https://tuitionforhome.com/logo.png',
    image: 'https://tuitionforhome.com/hero_young_teacher_girl_student_cutout.jpg',
    description: 'Verified home tutors in Gurgaon and online tutors for CBSE, ICSE, IB & Coding by SSSAM Academy.',
    telephone: '+91 92170 31899',
    email: 'info@tuitionforhome.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14',
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.4703,
      longitude: 77.0418,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
    priceRange: '₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.95',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Inject LocalBusiness JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. APPLE-STYLE MINIMALIST HERO SECTION (SEO & TRUST OPTIMIZED)
            ========================================================================= */}
        <section style={{
          paddingTop: '1.5rem',
          paddingBottom: '3.5rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E8ED',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}>
              {/* Left Column: Headline & Action Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* 1. Merged Top Badge */}
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.45rem 1rem',
                    borderRadius: '999px',
                    backgroundColor: '#E8F5E9',
                    border: '1px solid #C8E6C9',
                    color: '#0F6E56',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}>
                    <ShieldCheck size={16} color="#0F6E56" />
                    <span>Operated by SSSAM Academy · Active in <strong>{sectorList[currentSectorIndex]}</strong></span>
                  </div>
                </div>

                {/* 7. Single Primary Keyword H1 Headline */}
                <h1 style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  color: '#1D1D1F',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}>
                  Verified <span style={{ color: '#0F6E56' }}>Home & Online Tutors</span> in Gurgaon
                </h1>

                {/* 9. LSI Keywords Subtext */}
                <p style={{
                  fontSize: 'clamp(1.05rem, 2vw, 1.2rem)',
                  color: '#515154',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  Connect with background-checked <strong>home tutors in Gurgaon</strong> and <strong>online tutors in Gurgaon</strong> for CBSE, ICSE, IB & Coding. Matched within 3.5 km of your sector with a <strong>100% Free Replacement Guarantee</strong>.
                </p>

                {/* Mode Switcher */}
                <div>
                  <div style={{
                    display: 'inline-flex',
                    backgroundColor: '#F5F5F7',
                    padding: '0.35rem',
                    borderRadius: '999px',
                    border: '1px solid #E8E8ED',
                  }}>
                    <button
                      type="button"
                      onClick={() => setSearchMode('OFFLINE_HOME')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem 1.35rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: searchMode === 'OFFLINE_HOME' ? '#0F6E56' : 'transparent',
                        color: searchMode === 'OFFLINE_HOME' ? '#FFFFFF' : '#6E6E73',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
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
                        padding: '0.6rem 1.35rem',
                        borderRadius: '999px',
                        border: 'none',
                        backgroundColor: searchMode === 'ONLINE_LIVE' ? '#0F6E56' : 'transparent',
                        color: searchMode === 'ONLINE_LIVE' ? '#FFFFFF' : '#6E6E73',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Video size={15} />
                      <span>Online 1-on-1</span>
                    </button>
                  </div>
                </div>

                {/* 6. Bolder CTA Button Row */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => handleOpenBooking()}
                    className="btn btn-primary btn-lg"
                    style={{
                      backgroundColor: '#0F6E56',
                      padding: '0.9rem 2.2rem',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      borderRadius: '999px',
                      boxShadow: '0 4px 14px rgba(15, 110, 86, 0.28)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                    }}
                  >
                    <span>Book a Tutor — Free Callback</span>
                    <ChevronRight size={18} />
                  </button>

                  <a
                    href="#find-tutor"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#1D1D1F',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Tutor Catalog</span>
                    <ChevronRight size={16} color="#0F6E56" />
                  </a>
                </div>

                {/* 12. Visible Trust Metrics Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #E8E8ED',
                  fontSize: '0.82rem',
                  color: '#6E6E73',
                }}>
                  <div>
                    <strong style={{ fontSize: '1.2rem', color: '#0F6E56', display: 'block', fontWeight: 800 }}>500+</strong>
                    <span>Verified Tutors</span>
                  </div>
                  <div style={{ width: '1px', height: '28px', backgroundColor: '#E8E8ED' }} />
                  <div>
                    <strong style={{ fontSize: '1.2rem', color: '#0F6E56', display: 'block', fontWeight: 800 }}>14+</strong>
                    <span>Gurgaon Sectors</span>
                  </div>
                  <div style={{ width: '1px', height: '28px', backgroundColor: '#E8E8ED' }} />
                  <div>
                    <strong style={{ fontSize: '1.2rem', color: '#047857', display: 'block', fontWeight: 800 }}>4.95 ★</strong>
                    <span>Parent Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Frame with Rich Background Flower Scribble Line-Art */}
              <div style={{
                position: 'relative',
                minHeight: 'clamp(440px, 52vh, 540px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
                {/* Rich SVG Organic Flower Scribble Line-Art, Atomic Orbits & Math Formulas */}
                <svg
                  style={{
                    position: 'absolute',
                    top: '-25%',
                    left: '-15%',
                    width: '130%',
                    height: '150%',
                    pointerEvents: 'none',
                    opacity: 0.85,
                    zIndex: 0,
                    overflow: 'visible',
                  }}
                  viewBox="0 0 700 700"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="heroFlowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0F6E56" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>

                  {/* Organic Swirl Petal Loops Filling Upper Space Above Teacher Head */}
                  <path
                    d="M140,320 C70,160 210,60 380,120 C550,180 610,360 470,500 C330,640 130,500 190,340 C250,180 470,90 550,260 C630,430 430,590 230,530 C70,470 90,250 270,150 C450,50 630,210 530,410 C430,610 210,550 150,370 C90,190 270,80 430,160 C590,240 550,460 370,540"
                    stroke="url(#heroFlowerGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />

                  {/* Concentric Decorative Rings */}
                  <circle cx="350" cy="350" r="260" stroke="#E8E8ED" strokeWidth="1.5" strokeDasharray="6 6" />
                  <circle cx="350" cy="350" r="190" stroke="#0F6E56" strokeWidth="1.2" strokeOpacity="0.2" />

                  {/* Atomic Electron Orbit Rings (Physics/Chemistry Symbol) */}
                  <g opacity="0.45" transform="translate(130, 80) scale(0.85)">
                    <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#0F6E56" strokeWidth="1.5" transform="rotate(-30 50 50)" />
                    <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#0F6E56" strokeWidth="1.5" transform="rotate(30 50 50)" />
                    <circle cx="50" cy="50" r="5" fill="#0F6E56" />
                    <circle cx="85" cy="38" r="3" fill="#2DD4BF" />
                  </g>

                  {/* === Floating STEM Formulas — Left, Right, Center, and Behind/Above Image === */}

                  {/* LEFT SIDE — Distributed vertically */}
                  <text className="formula-float-8" x="18" y="55"  fontSize="12" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">NaCl → Na⁺ + Cl⁻</text>
                  <text className="formula-float-7" x="22" y="145" fontSize="13" fontFamily="serif" fill="#64748B" fontWeight="700">a² + b² = c²</text>
                  <text className="formula-float-9" x="15" y="240" fontSize="12" fontFamily="serif" fontStyle="italic" fill="#0891B2" fontWeight="700">sin²θ + cos²θ = 1</text>
                  <text className="formula-float-2" x="25" y="360" fontSize="14" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">∫ f(x) dx</text>
                  <text className="formula-float-10" x="15" y="470" fontSize="11" fontFamily="monospace" fill="#0891B2" fontWeight="700">print(&quot;Hello!&quot;)</text>
                  <text className="formula-float-5" x="22" y="570" fontSize="12" fontFamily="sans-serif" fill="#047857" fontWeight="700">ATP = Energy</text>

                  {/* RIGHT SIDE — Distributed vertically */}
                  <text className="formula-float-1" x="520" y="55"  fontSize="15" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">E = mc²</text>
                  <text className="formula-float-3" x="540" y="145" fontSize="13" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">H₂O + CO₂</text>
                  <text className="formula-float-4" x="550" y="240" fontSize="13" fontFamily="sans-serif" fill="#2DD4BF" fontWeight="800">A = πr²</text>
                  <text className="formula-float-6" x="560" y="360" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">F = ma</text>
                  <text className="formula-float-5" x="540" y="470" fontSize="12" fontFamily="sans-serif" fill="#047857" fontWeight="700">DNA → RNA</text>
                  <text className="formula-float-4" x="520" y="570" fontSize="11" fontFamily="sans-serif" fill="#B45309" fontWeight="700">Supply ∝ Price</text>
                  <text className="formula-float-7" x="535" y="630" fontSize="12" fontFamily="monospace" fill="#0F6E56" fontWeight="700">x = [1,2,3...]</text>

                  {/* CENTER & BEHIND IMAGE / JUST ABOVE IMAGE */}
                  {/* Just above image heads */}
                  <text className="formula-float-3" x="260" y="90" fontSize="13" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">CO₂ + H₂O</text>
                  <text className="formula-float-1" x="380" y="75" fontSize="15" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">dy/dx</text>
                  
                  {/* Behind teacher & student (layered underneath since SVG zIndex is 0 and image is 2) */}
                  <text className="formula-float-6" x="180" y="210" fontSize="14" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">PV = nRT</text>
                  <text className="formula-float-4" x="420" y="220" fontSize="13" fontFamily="sans-serif" fill="#2DD4BF" fontWeight="800">λ = h/p</text>
                  
                  <text className="formula-float-2" x="200" y="330" fontSize="15" fontFamily="serif" fontStyle="italic" fill="#0891B2" fontWeight="700">∑ x_i</text>
                  <text className="formula-float-10" x="450" y="340" fontSize="12" fontFamily="monospace" fill="#0F6E56" fontWeight="700">def match_tutor():</text>
                  
                  <text className="formula-float-9" x="230" y="460" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#7C3AED" fontWeight="700">lim (x→0)</text>
                  <text className="formula-float-5" x="410" y="470" fontSize="12" fontFamily="sans-serif" fill="#047857" fontWeight="700">C₆H₁₂O₆</text>
                  
                  <text className="formula-float-7" x="320" y="550" fontSize="12" fontFamily="monospace" fill="#B45309" fontWeight="700">import numpy as np</text>

                  {/* Sparkle Stars & Accents */}
                  <path d="M468,28 L470,36 L478,38 L470,40 L468,48 L466,40 L458,38 L466,36 Z" fill="#0F6E56" opacity="0.8" />
                  <path d="M8,155 L10,162 L17,164 L10,166 L8,173 L6,166 L-1,164 L6,162 Z" fill="#7C3AED" opacity="0.65" />
                  <path d="M570,480 L572,487 L579,489 L572,491 L570,498 L568,491 L561,489 L568,487 Z" fill="#2DD4BF" opacity="0.7" />

                  {/* Constellation line */}
                  <line x1="465" y1="55" x2="498" y2="45" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="465" cy="55" r="3" fill="#2DD4BF" />
                  <circle cx="498" cy="45" r="4" fill="#0F6E56" />
                </svg>



                {/* Physical Center Trust Badge */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 4,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E8ED',
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#1D1D1F',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap',
                }}>
                  <Building2 size={14} color="#0F6E56" />
                  <span>Physical Center in Sector 14 Gurugram</span>
                </div>


                {/* Soft Fade Blend Hero Image Cutout */}
                <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero_young_teacher_girl_student_cutout.png"
                    alt="Home tutor teaching CBSE student in Gurgaon"
                    style={{
                      width: '100%',
                      maxWidth: '490px',
                      height: 'auto',
                      borderRadius: '20px',
                      display: 'block',
                      mixBlendMode: 'multiply',
                      maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    }}
                  />
                </div>


                {/* 3. Combined Single Unified Bottom White Trust Card */}
                <div className="apple-card hero-unified-card" style={{
                  position: 'absolute',
                  bottom: '-32px',
                  left: '4%',
                  right: '4%',
                  padding: '0.95rem 1.25rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E8ED',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  zIndex: 3,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E8F5E9', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1D1D1F' }}>SSSAM Academy</div>
                      <div style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Sector 14 Gurugram</div>
                    </div>
                  </div>

                  <div className="hero-unified-divider" style={{ width: '1px', height: '28px', backgroundColor: '#E8E8ED' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#E8F5E9', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1D1D1F' }}>100% Replacement</div>
                      <div style={{ fontSize: '0.72rem', color: '#6E6E73' }}>Zero Advance Risk</div>
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
                onLocationSelected={() => {
                  handleOpenBooking();
                }}
              />
            </div>
          </section>
        )}

        {/* =========================================================================
            3. HOW IT WORKS — Animated Scroll Reveal Step-by-Step Section
            ========================================================================= */}
        <HowItWorks onOpenBooking={() => handleOpenBooking()} />



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
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--brand-teal-light)', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--brand-teal-light)', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                <ChevronRight size={16} color="#0F6E56" />
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
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {tutor.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#0F6E56', fontWeight: 700, margin: '2px 0' }}>
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
                      <GraduationCap size={15} color="#0F6E56" style={{ flexShrink: 0 }} />
                      <span style={{ fontWeight: 600 }}>{tutor.highestDegree} • {tutor.experienceYears}+ Yrs Exp</span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <MapPin size={15} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{tutor.serviceAreas.join(' • ')}</span>
                    </div>

                    {/* Subjects Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: 'var(--brand-teal-light)', color: '#0F6E56', borderRadius: '6px', fontWeight: 600 }}>
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
                        color: '#0F6E56',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Play size={14} fill="#0F6E56" />
                        <span>Watch 60s Video Intro</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#0F6E56' }}>{tutor.videoDuration}</span>
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
                      style={{ backgroundColor: '#0F6E56' }}
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
                  <button onClick={() => handleOpenBooking()} className="btn btn-primary btn-lg" style={{ backgroundColor: '#0F6E56' }}>
                    <span>Book a Tutor — Free Callback</span>
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
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F6E56', backgroundColor: 'var(--brand-teal-light)', padding: '0.25rem 0.6rem', borderRadius: '999px' }}>
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
