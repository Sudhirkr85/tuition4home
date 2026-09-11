import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS } from '@/lib/data';
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
  Briefcase,
  Headphones,
  RotateCcw,
  BadgeCheck,
  Clock,
} from 'lucide-react';
import { HomeClientProvider } from '@/components/home/HomeContext';
import { HomeNavbar } from '@/components/home/HomeNavbar';
import { HeroSectorBadge } from '@/components/home/HeroSectorBadge';
import { HeroActionButtons } from '@/components/home/HeroActionButtons';
import { HomeMapSection } from '@/components/home/HomeMapSection';
import { HomeHowItWorksSection } from '@/components/home/HomeHowItWorksSection';
import { ParentStoryVideo } from '@/components/home/ParentStoryVideo';
import { HomeTutorSection } from '@/components/home/HomeTutorSection';
import { HomeFeeEstimatorSection } from '@/components/home/HomeFeeEstimatorSection';
import { LocalityDirectoryToggle } from '@/components/home/LocalityDirectoryToggle';
import { HomeFaqAccordion } from '@/components/home/HomeFaqAccordion';

export const revalidate = 3600; // 1 hour ISR Edge CDN caching

export const metadata: Metadata = {
  title: 'TuitionForHome — #1 Verified Home & Online Tutors in Gurgaon | SSSAM Academy',
  description:
    'Find top-rated, background-checked CBSE, ICSE, IB & Coding home tutors in Gurgaon (DLF Phase 1-5, Golf Course Rd, Sohna Rd, Sector 56). Verified by SSSAM Academy Sector 14 Gurugram. 1-on-1 Trial Class + 100% Replacement Guarantee.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TuitionForHome — Verified Home & Online Tutors in Gurgaon',
    description:
      'Book top 1% verified home and online tutors in Gurgaon & Delhi NCR with 1-on-1 trial class. Operated by SSSAM Academy, Sector 14 Gurugram.',
    url: 'https://sssamacademy.tech',
    siteName: 'TuitionForHome',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <HomeClientProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
        
        {/* Navigation Bar */}
        <HomeNavbar />

        <main style={{ flex: 1 }}>
          {/* =========================================================================
              1. MINIMALIST HERO SECTION (SEO & TRUST OPTIMIZED)
              ========================================================================= */}
          <section aria-label="Hero Search and Overview" className="home-hero-section">
            <div className="container">
              <div className="home-hero-grid">
                {/* Left Column: Headline & Action Controls */}
                <div className="home-hero-content">
                  {/* Dynamic Sector Badge */}
                  <div>
                    <HeroSectorBadge />
                  </div>

                  {/* Primary Keyword H1 Headline */}
                  <h1 className="home-hero-title">
                    Find a <span style={{ color: '#0F6E56' }}>Home Teacher</span> for Your Child in Gurgaon
                  </h1>

                  {/* Subtext */}
                  <p className="home-hero-subtitle">
                    Connect with background-checked <strong>home teachers in Gurgaon</strong> for CBSE, ICSE, IB &amp; Coding. Matched within 3.5 km of your sector with a <strong>100% Free Replacement Guarantee</strong>.
                  </p>

                  {/* Hero CTA Button Row */}
                  <HeroActionButtons />

                  {/* Trust Signal Pillars */}
                  <div className="home-hero-trust-bar">
                    <div className="home-hero-trust-item">
                      <ShieldCheck size={16} color="#059669" />
                      <span>In-Person KYC Vetted</span>
                    </div>
                    <div className="home-hero-trust-item">
                      <Video size={16} color="#0D9488" />
                      <span>60s Video Auditions</span>
                    </div>
                    <div className="home-hero-trust-item">
                      <RotateCcw size={16} color="#2563EB" />
                      <span>Free Replacement</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Visual Asset Optimized with next/image & Animated STEM Formulas */}
                <div className="home-hero-visual">
                  {/* Rich SVG Organic Flower Scribble Line-Art, Atomic Orbits & Math Formulas */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: '-15%',
                      left: '-15%',
                      width: '130%',
                      height: '135%',
                      pointerEvents: 'none',
                      opacity: 0.9,
                      zIndex: 1,
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

                    {/* Organic Swirl Petal Loops */}
                    <path
                      d="M140,320 C70,160 210,60 380,120 C550,180 610,360 470,500 C330,640 130,500 190,340 C250,180 470,90 550,260 C630,430 430,590 230,530 C70,470 90,250 270,150 C450,50 630,210 530,410 C430,610 210,550 150,370 C90,190 270,80 430,160 C590,240 550,460 370,540"
                      stroke="url(#heroFlowerGrad)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Concentric Decorative Rings */}
                    <circle cx="350" cy="350" r="260" stroke="#E8E8ED" strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="350" cy="350" r="190" stroke="#0F6E56" strokeWidth="1.2" strokeOpacity="0.2" />

                    {/* Atomic Electron Orbit Rings */}
                    <g opacity="0.5" transform="translate(130, 80) scale(0.85)">
                      <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#0F6E56" strokeWidth="1.5" transform="rotate(-30 50 50)" />
                      <ellipse cx="50" cy="50" rx="42" ry="16" stroke="#0F6E56" strokeWidth="1.5" transform="rotate(30 50 50)" />
                      <circle cx="50" cy="50" r="5" fill="#0F6E56" />
                      <circle cx="85" cy="38" r="3" fill="#2DD4BF" />
                    </g>

                    {/* === Floating STEM Formulas === */}
                    {/* LEFT SIDE */}
                    <text className="formula-float-8" x="18" y="55" fontSize="12" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">NaCl → Na⁺ + Cl⁻</text>
                    <text className="formula-float-7" x="22" y="145" fontSize="13" fontFamily="serif" fill="#64748B" fontWeight="700">a² + b² = c²</text>
                    <text className="formula-float-9" x="15" y="240" fontSize="12" fontFamily="serif" fontStyle="italic" fill="#0891B2" fontWeight="700">sin²θ + cos²θ = 1</text>
                    <text className="formula-float-2" x="25" y="360" fontSize="14" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">∫ f(x) dx</text>
                    <text className="formula-float-10" x="15" y="470" fontSize="11" fontFamily="monospace" fill="#0891B2" fontWeight="700">print(&quot;Hello!&quot;)</text>
                    <text className="formula-float-5" x="22" y="570" fontSize="12" fontFamily="sans-serif" fill="#047857" fontWeight="700">ATP = Energy</text>

                    {/* RIGHT SIDE */}
                    <text className="formula-float-1" x="520" y="55" fontSize="15" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">E = mc²</text>
                    <text className="formula-float-3" x="540" y="145" fontSize="13" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">H₂O + CO₂</text>
                    <text className="formula-float-4" x="550" y="240" fontSize="13" fontFamily="sans-serif" fill="#2DD4BF" fontWeight="800">A = πr²</text>
                    <text className="formula-float-6" x="560" y="360" fontSize="13" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">F = ma</text>
                    <text className="formula-float-5" x="540" y="470" fontSize="12" fontFamily="sans-serif" fill="#047857" fontWeight="700">DNA → RNA</text>
                    <text className="formula-float-4" x="520" y="570" fontSize="11" fontFamily="sans-serif" fill="#B45309" fontWeight="700">Supply ∝ Price</text>
                    <text className="formula-float-7" x="535" y="630" fontSize="12" fontFamily="monospace" fill="#0F6E56" fontWeight="700">x = [1,2,3...]</text>

                    {/* CENTER & BEHIND IMAGE */}
                    <text className="formula-float-3" x="260" y="90" fontSize="13" fontFamily="sans-serif" fill="#7C3AED" fontWeight="700">CO₂ + H₂O</text>
                    <text className="formula-float-1" x="380" y="75" fontSize="15" fontFamily="serif" fontStyle="italic" fill="#0F6E56" fontWeight="700">dy/dx</text>
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

                  <div className="home-hero-glow-circle" />

                  <Image
                    src="/hero_young_teacher_girl_student_cutout.webp"
                    alt="Verified Home Tutor and Student in Gurgaon"
                    width={600}
                    height={600}
                    priority
                    sizes="(max-width: 992px) 100vw, 520px"
                    className="home-hero-img"
                  />

                  {/* Floating Animated Badge 1 (Bottom-Left: SSSAM Academy Center) */}
                  <div className="home-hero-floating-card-1">
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>
                        SSSAM Academy Center
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669', display: 'inline-block' }} />
                        Sector 14 Gurugram
                      </div>
                    </div>
                  </div>

                  {/* Floating Animated Badge 2 (Top-Right: Rating & Tutors Count) */}
                  <div className="home-hero-floating-card-2">
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#FEF3C7',
                      color: '#D97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Star size={18} fill="#D97706" color="#D97706" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap' }}>
                        4.9 ★ (500+ Tutors)
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#D97706', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        CBSE • ICSE • IB Board
                      </div>
                    </div>
                  </div>

                  {/* Floating Animated Badge 3 (Top-Left: 100% Vetted) */}
                  <div className="home-hero-floating-card-3">
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <ShieldCheck size={18} />
                    </div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#166534', whiteSpace: 'nowrap' }}>
                      100% KYC Vetted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              2. INTERACTIVE VISUAL PROXIMITY MAP
              ========================================================================= */}
          <HomeMapSection />

          {/* =========================================================================
              3. HOW IT WORKS SECTION
              ========================================================================= */}
          <HomeHowItWorksSection />

          {/* =========================================================================
              4. MOBILE PARENT EXPERIENCE CARD & VIDEO
              ========================================================================= */}
          <section aria-label="WhatsApp and SMS Class Confirmation" style={{ padding: '3rem 0 3.75rem 0', backgroundColor: '#FFFFFF' }}>
            <div className="container">
              <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <span>PARENT EXPERIENCE</span>
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>
                  The Simplest Tuition Experience. Ever.
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  No account required for parents. Receive your verified tutor match details directly via WhatsApp or Phone.
                </p>
              </div>

              <div className="apple-card" style={{
                backgroundColor: 'var(--bg-app)',
                padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
              }}>
                {/* Left Column: Live Parent Discussion Video in Smartphone Frame */}
                <ParentStoryVideo />

                {/* Right Column: 3-Step WhatsApp Experience Flow */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      1
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                        Submit Your Learning Need
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        Select student class (1–12 or Board prep), subjects, and preferred tutor timing in your Gurgaon sector.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      2
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                        Review Verified Teacher Video Profiles
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        Our academic counselor shares top 2–3 educator profiles with degrees and 60-second video intros right on WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}>
                      3
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                        1-on-1 Trial Class at Home
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                        Confirm your trial session. If satisfied, regular classes begin with weekly attendance tracking and our 100% Free Replacement Guarantee.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              5. VERIFIED TUTORS SHOWCASE (SECTOR & GENDER DYNAMIC)
              ========================================================================= */}
          <HomeTutorSection />

          {/* =========================================================================
              6. INTERACTIVE FEE ESTIMATOR
              ========================================================================= */}
          <HomeFeeEstimatorSection />

          {/* =========================================================================
              7. SSSAM ACADEMY PHYSICAL CENTER TRUST SECTION
              ========================================================================= */}
          <section aria-label="Why Parents Trust SSSAM Academy" style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
            <div className="container">
              <div className="apple-card" style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 55%, #F8FAFC 100%)',
                color: '#0F172A',
                padding: 'clamp(1.75rem, 4vw, 3.5rem)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(1.75rem, 3.5vw, 3.5rem)',
                alignItems: 'center',
                borderRadius: '32px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 15px 45px rgba(15, 23, 42, 0.06)',
              }}>
                <div>
                  <div className="badge" style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', marginBottom: '1rem', fontWeight: 800, letterSpacing: '0.03em' }}>
                    <Building2 size={14} />
                    <span>ESTABLISHED PHYSICAL CENTER IN GURUGRAM</span>
                  </div>
                  <h2 style={{ color: '#0F172A', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    Not Just a Website. A Real Educational Institute.
                  </h2>
                  <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                    Backed by <strong style={{ color: '#0F172A' }}>SSSAM Academy</strong>, situated in Sector 14, Old DLF, Gurugram. Tutors undergo in-person document screening and video intro audits.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.92rem', color: '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <span>In-person tutor document audit &amp; interview screening</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <span>Option to have classes at our Sector 14 classrooms</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} color="#059669" />
                      <span>100% Free replacement guarantee if student is unsatisfied</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <Link
                      href="/request-tutor"
                      className="btn btn-primary btn-lg"
                      style={{
                        backgroundColor: '#0F6E56',
                        padding: '0.9rem 1.85rem',
                        borderRadius: '14px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none',
                      }}
                    >
                      <Sparkles size={17} color="#FDE047" />
                      <span>Get a Home Teacher</span>
                      <ChevronRight size={17} />
                    </Link>

                    <a
                      href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
                      className="btn btn-secondary btn-lg"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#0F6E56',
                        border: '2px solid #0F6E56',
                        padding: '0.9rem 1.75rem',
                        borderRadius: '14px',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={18} color="#0F6E56" />
                      <span>Call Sector 14 Center</span>
                    </a>
                  </div>
                </div>

                {/* Right Side: Integrated Showcase Image & Address Card */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
                }}>
                  {/* 1-on-1 Academic Tutoring Showcase Image */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#0F172A',
                    overflow: 'hidden',
                  }}>
                    <Image
                      src="/images/how-it-works/step3_teaching.webp"
                      alt="1-on-1 In-Home Tutoring Session in Gurgaon"
                      fill
                      sizes="(max-width: 768px) 100vw, 550px"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.35rem',
                    }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#34D399' }}>
                        ✓ 1-on-1 Verified Faculty
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
                        Sector 14 &amp; All Gurgaon Sectors
                      </span>
                    </div>
                  </div>

                  {/* Address & Helpline Details */}
                  <div style={{ padding: '1.5rem', backgroundColor: '#F8FAFC' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={18} color="#0F6E56" />
                      <span>SSSAM Academy Gurugram Center</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.86rem', color: '#475569' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>OFFICIAL ADDRESS</div>
                        <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.address}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>DIRECT HELPLINE NUMBER</div>
                        <div style={{ color: '#0F6E56', fontWeight: 800, marginTop: '2px', fontSize: '1.05rem' }}>
                          {SSSAM_OFFICE_DETAILS.phones.filter(Boolean).join(' • ')}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>COUNSELOR DESK TIMINGS</div>
                        <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.hours}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              8. WHY CHOOSE TUITIONFORHOME (6 PILLARS OF TRUST)
              ========================================================================= */}
          <section aria-label="Why Choose TuitionForHome" style={{ padding: '5rem 0', backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <BadgeCheck size={14} />
                  <span>THE SSSAM ACADEMY ADVANTAGE</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-main)' }}>
                  Why Gurgaon &amp; Delhi NCR Parents Trust TuitionForHome
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                  Unlike anonymous aggregator websites, every educator on our platform is verified in-person at our physical institute in Sector 14, Gurugram.
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}>
                {/* Card 1 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46' }}>
                    <Building2 size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Physical Center Anchor</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Backed by SSSAM Academy at Sector 14, Old DLF, Gurugram. You have a real physical address, helpline numbers, and center classrooms for personalized classes.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369A1' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>In-Person KYC &amp; Degree Audit</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Every tutor’s degree certificates, Aadhaar KYC, address, and past teaching track record are audited before granting the verified educator badge.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                    <Video size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>60-Second Video Intro Auditions</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Watch concise video introduction clips of shortlisted teachers to judge communication clarity, accent, and subject confidence before scheduling.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BE185D' }}>
                    <RotateCcw size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>100% Free Replacement Guarantee</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    If your child does not connect with the tutor’s style, our counselors assign an alternate top-matched educator within 24 hours at no extra charge.
                  </p>
                </div>

                {/* Card 5 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6D28D9' }}>
                    <Award size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Top Gurgaon &amp; Delhi School Alignment</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Experienced mentors for CBSE, ICSE, IB (DP/MYP), and Cambridge (IGCSE) aligned with The Shri Ram School, DPS, Heritage, and Pathways curricula.
                  </p>
                </div>

                {/* Card 6 */}
                <div className="apple-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#065F46' }}>
                    <Headphones size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Dedicated Academic Counselor</h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Get 1-on-1 human assistance via phone and WhatsApp. We monitor attendance, test score progress, and parent feedback continuously.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              9. GURGAON & DELHI NCR LOCALITIES SEO DIRECTORY GRID
              ========================================================================= */}
          <section aria-label="Hyper-Local Area Directory" style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-app)' }}>
            <div className="container">
              <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <MapPin size={14} />
                  <span>HYPER-LOCAL COVERAGE (45+ AREAS)</span>
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>
                  Home Tutors Available Across Gurgaon &amp; Delhi NCR
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Verified 1-on-1 home and online educators available across all sectors of Gurgaon and prime South/West Delhi hubs.
                </p>
              </div>

              {/* Locality Toggle and Directory */}
              <LocalityDirectoryToggle localities={GURGAON_LOCALITIES} />
            </div>
          </section>

          {/* =========================================================================
              10. FREQUENTLY ASKED QUESTIONS
              ========================================================================= */}
          <HomeFaqAccordion />

        </main>

        <Footer />
      </div>
    </HomeClientProvider>
  );
}
