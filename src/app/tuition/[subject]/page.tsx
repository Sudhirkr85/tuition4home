import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import TutorAvatar from '@/components/TutorAvatar';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';
import { PSEO_LOCALITIES, PSEO_SUBJECTS } from '@/lib/pseo-data';
import { generatePSEOPagePayload, resolvePSEOSlug } from '@/lib/pseo-generator';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS, MockTutor } from '@/lib/data';
import prisma from '@/lib/prisma';
import {
  GraduationCap,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  Phone,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  MapPin,
  Building2,
  ChevronRight,
  School,
} from 'lucide-react';
import Link from 'next/link';

export const dynamicParams = true;
export const revalidate = 86400; // 24 hours ISR Edge CDN caching

interface PageProps {
  params: {
    subject: string;
  };
}

export async function generateStaticParams() {
  const staticParams: { subject: string }[] = [];

  // 1. All Legacy Subject Pages (25 paths)
  SUBJECT_SEO_PAGES.forEach((s) => {
    staticParams.push({ subject: s.slug });
  });

  // 2. High-Priority Top Locality + Subject Combinations (Pre-rendered for instantaneous load)
  PSEO_LOCALITIES.slice(0, 15).forEach((loc) => {
    PSEO_SUBJECTS.slice(0, 6).forEach((sub) => {
      staticParams.push({ subject: `${sub.slug}-home-tutor-in-${loc.slug}` });
    });
  });

  return staticParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const payload = generatePSEOPagePayload(params.subject);
  if (!payload) {
    return {
      title: 'Tuition Subject Not Found | TuitionForHome',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: payload.metaTitle,
    description: payload.metaDesc,
    keywords: [
      `${payload.subject.name.toLowerCase()} home tutor ${payload.locality.name.toLowerCase()}`,
      `${payload.subject.name.toLowerCase()} home tutor ${payload.locality.city.toLowerCase()}`,
      `best ${payload.subject.name.toLowerCase()} teacher ${payload.locality.landmark.toLowerCase()}`,
      `cbse icse ib ${payload.subject.name.toLowerCase()} tuition`,
      'SSSAM Academy',
      'TuitionForHome',
    ],
    alternates: {
      canonical: `/tuition/${payload.slug}`,
    },
    openGraph: {
      title: payload.metaTitle,
      description: payload.metaDesc,
      url: payload.canonicalUrl,
      siteName: 'TuitionForHome',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: payload.metaTitle,
      description: payload.metaDesc,
    },
  };
}

export default async function SubjectPage({ params }: PageProps) {
  const payload = generatePSEOPagePayload(params.subject);
  if (!payload) {
    notFound();
  }

  // Fetch live verified tutors from MySQL matching subject category
  let dynamicTutors: MockTutor[] = [];
  try {
    const isFemaleIntent = payload.intentTrack.slug === 'female-tutor';
    const isMaths = payload.subject.slug === 'mathematics';
    const isPhysics = payload.subject.slug === 'physics';
    const isChemistry = payload.subject.slug === 'chemistry';
    const isBiology = payload.subject.slug === 'biology';
    const isCS = payload.subject.slug.includes('computer') || payload.subject.slug.includes('python');
    const isCommerce = payload.subject.category === 'COMMERCE';

    const whereCondition: any = { status: 'ACTIVE_VERIFIED' };
    if (isFemaleIntent) whereCondition.gender = 'FEMALE';

    const dbTutors = await prisma.tutorProfile.findMany({
      where: whereCondition,
      include: { user: true },
      take: 8,
    });

    if (dbTutors && dbTutors.length > 0) {
      let filtered = dbTutors;
      if (isMaths) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('math'));
      else if (isPhysics) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('physic'));
      else if (isChemistry) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('chem'));
      else if (isBiology) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('bio'));
      else if (isCS) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('python') || (t.subjects || '').toLowerCase().includes('computer'));
      else if (isCommerce) filtered = dbTutors.filter((t) => (t.subjects || '').toLowerCase().includes('account') || (t.subjects || '').toLowerCase().includes('econ') || (t.subjects || '').toLowerCase().includes('commerce'));

      const sourceList = filtered.length > 0 ? filtered : dbTutors;

      dynamicTutors = sourceList.slice(0, 6).map((tp: any) => {
        let subjects: string[] = [];
        let serviceAreas: string[] = [];
        try {
          subjects = tp.subjects ? JSON.parse(tp.subjects) : [];
        } catch {
          subjects = tp.subjects ? tp.subjects.split(',').map((s: string) => s.trim()) : [];
        }
        try {
          serviceAreas = tp.serviceAreas ? JSON.parse(tp.serviceAreas) : [];
        } catch {
          serviceAreas = tp.serviceAreas ? tp.serviceAreas.split(',').map((s: string) => s.trim()) : [];
        }

        return {
          id: tp.id,
          name: tp.user.name,
          phone: tp.user.phone || '9811204921',
          email: tp.user.email,
          avatarUrl: tp.avatarUrl || '',
          introVideoUrl: tp.introVideoUrl || '',
          videoDuration: tp.introVideoUrl ? '1m 20s' : '',
          highestDegree: tp.highestDegree || '',
          experienceYears: tp.experienceYears,
          teachingMode: tp.teachingMode,
          subjects,
          classes: [],
          boards: [],
          serviceAreas: serviceAreas.length > 0 ? serviceAreas : [payload.locality.name, `${payload.locality.city} NCR`],
          travelRadiusKm: tp.travelRadiusKm,
          hourlyRateHome: tp.hourlyRateHome || 900,
          hourlyRateOnline: tp.hourlyRateOnline || 600,
          monthlyRateMin: tp.monthlyRateMin || 7500,
          isVerified: tp.isVerified,
          hasPoliceCheck: tp.hasPoliceCheck,
          rating: tp.rating || 4.9,
          totalReviews: tp.totalReviews || 28,
          bio: tp.bio || `Specialized educator for ${payload.subject.name} across ${payload.locality.name}.`,
          badge: tp.highestDegree ? `Verified Specialist (${tp.highestDegree})` : 'Verified Educator',
        };
      });
    }
  } catch {
    // Graceful fallback if database offline
  }

  const whatsappInquiryUrl = `https://wa.me/919217031899?text=${encodeURIComponent(
    `Hello SSSAM Academy, I am looking for a verified ${payload.subject.name} home tutor in ${payload.locality.name} (${payload.locality.city}). Please share available teachers and fee schedule.`
  )}`;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Schema.org Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.schemaJsonLd.courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.schemaJsonLd.localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.schemaJsonLd.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.schemaJsonLd.breadcrumbSchema) }}
      />

      <Navbar />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. HERO SECTION (HYPER-LOCAL & RESPONSIVE FIGMA GRADIENTS)
            ========================================================================= */}
        <section style={{
          padding: '4.5rem 0 3.5rem 0',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 55%, #F8FAFC 100%)',
          borderBottom: '1px solid var(--border-hairline)',
        }}>
          <div className="container">
            {/* Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748B', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#0F6E56', fontWeight: 700, textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/tuition" style={{ color: '#0F6E56', fontWeight: 700, textDecoration: 'none' }}>Tuition</Link>
              <span>/</span>
              <span style={{ color: '#0F172A', fontWeight: 800 }}>{payload.subject.name} in {payload.locality.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                {/* Live Status Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  color: '#047857',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}>
                  <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
                    <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#22C55E', animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite', opacity: 0.8 }} />
                    <span style={{ position: 'relative', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  </span>
                  <span>Verified {payload.subject.name} Tutors Active in {payload.locality.name}</span>
                </div>

                <h1 style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                }}>
                  {payload.h1}
                </h1>

                <p style={{
                  fontSize: '1.05rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                }}>
                  {payload.intro}
                </p>

                {/* Key Benefits Checkmarks */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem', marginBottom: '2rem', fontSize: '0.88rem', color: '#334155', fontWeight: 650 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={17} color="#059669" />
                    <span>In-person background verified by SSSAM</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={17} color="#059669" />
                    <span>Aligned with {payload.locality.popularBoard} syllabus</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={17} color="#059669" />
                    <span>100% Free replacement guarantee</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={17} color="#059669" />
                    <span>1 Free demo class at your home</span>
                  </div>
                </div>

                {/* High-Intent CTA Buttons */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    href="/request-tutor"
                    className="btn btn-primary btn-lg btn-cta-pulse"
                    style={{
                      backgroundColor: '#0F6E56',
                      padding: '0.85rem 1.75rem',
                      borderRadius: '14px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    <Sparkles size={17} color="#FDE047" style={{ animation: 'bounce 2s infinite' }} />
                    <span>Request {payload.subject.name} Teacher</span>
                    <ChevronRight size={17} />
                  </Link>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-lg"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#15803D',
                      border: '2px solid #22C55E',
                      padding: '0.85rem 1.5rem',
                      borderRadius: '14px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Right Side: Uncropped 16:9 Showcase & Trust Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                padding: '1.5rem',
                boxShadow: '0 12px 35px rgba(15, 23, 42, 0.08)',
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#0F172A',
                  marginBottom: '1.25rem',
                }}>
                  <Image
                    src="/images/how-it-works/step3_teaching.webp"
                    alt={`1-on-1 ${payload.subject.name} Home Tuition in ${payload.locality.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
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
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34D399' }}>
                      ✓ 1-on-1 In-Home Mentoring
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>
                      {payload.locality.name}, {payload.locality.city}
                    </span>
                  </div>
                </div>

                {/* Instant Pricing Highlight */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '1rem', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ESTIMATED {payload.locality.name.toUpperCase()} FEE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '2px' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>
                      {payload.pricing.hourlyRateHome}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>/ home class</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#0284C7', fontWeight: 700, marginTop: '4px' }}>
                    Online 1-on-1: {payload.pricing.hourlyRateOnline}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. LOCAL SCHOOL ALIGNMENT & TRUST BAR
            ========================================================================= */}
        {payload.topSchools.length > 0 && (
          <section style={{ padding: '2.5rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
            <div className="container">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <School size={20} color="#0F6E56" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                    Curriculum Aligned for Students of Premier Schools in {payload.locality.name}:
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {payload.topSchools.map((school) => (
                    <span
                      key={school}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: '#F0FDF4',
                        color: '#166534',
                        border: '1px solid #BBF7D0',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                      }}
                    >
                      🎓 {school}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
            3. PEDAGOGY, CURRICULUM TOPICS & KEY TEXTBOOKS
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#F8FAFC' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <BookOpen size={14} />
                <span>STRUCTURED ACADEMIC BLUEPRINT</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', fontWeight: 800, color: '#0F172A' }}>
                How We Master {payload.subject.name} for Top Board Scores
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.98rem', marginTop: '0.5rem' }}>
                {payload.pedagogyHighlight}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {/* Card 1: Core Curriculum Topics */}
              <div className="apple-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="#0F6E56" />
                  <span>Core Syllabus Focus</span>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>
                  {payload.curriculumTopics.map((topic, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Standard Reference Textbooks */}
              <div className="apple-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="#0F6E56" />
                  <span>Standard Books Mastered</span>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>
                  {payload.keyBooks.map((book, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                      <span>{book}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Board & Competitive Exam Goals */}
              <div className="apple-card" style={{ padding: '2rem', backgroundColor: '#FFFFFF' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={18} color="#0F6E56" />
                  <span>Target Exam Benchmarks</span>
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>
                  {payload.examFocus.map((exam, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: '#059669', fontWeight: 800 }}>★</span>
                      <span>{exam}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. LIVE VERIFIED TUTORS PROXIMITY GRID
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                  <ShieldCheck size={14} />
                  <span>INTERVIEW VERIFIED EDUCATORS</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0F172A' }}>
                  Available {payload.subject.name} Tutors in {payload.locality.name}
                </h2>
                <p style={{ color: '#64748B', marginTop: '0.35rem' }}>
                  Audited by SSSAM Academy with verified teaching credentials &amp; student results.
                </p>
              </div>

              <Link href="/tutors" className="btn btn-secondary">
                <span>Browse All Gurgaon &amp; Delhi Teachers</span>
                <ChevronRight size={16} color="#0F6E56" />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {dynamicTutors.map((tutor) => (
                <div key={tutor.id} className="apple-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <TutorAvatar src={tutor.avatarUrl} name={tutor.name} size={60} borderRadius="14px" />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>{tutor.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#0F6E56', fontWeight: 700 }}>{tutor.badge}</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
                        <Star size={13} fill="#EAB308" color="#EAB308" />
                        <span>{tutor.rating} ({tutor.totalReviews} parent reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {tutor.bio}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      {tutor.subjects.slice(0, 3).map((sub) => (
                        <span key={sub} style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '6px', fontWeight: 700 }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '1rem 1.25rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700 }}>ESTIMATED RATE</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>₹{tutor.hourlyRateHome}/hr</div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link href={`/tutors/${tutor.id}`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.8rem' }}>
                        Profile
                      </Link>
                      <Link href="/request-tutor" className="btn btn-primary btn-sm" style={{ backgroundColor: '#0F6E56', fontSize: '0.8rem' }}>
                        Request
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. SSSAM ACADEMY PHYSICAL CENTER TRUST SECTION
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#F8FAFC' }}>
          <div className="container">
            <div className="apple-card" style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 55%, #F8FAFC 100%)',
              color: '#0F172A',
              padding: 'clamp(1.75rem, 4vw, 3.5rem)',
              borderRadius: '32px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 15px 45px rgba(15, 23, 42, 0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}>
              <div>
                <div className="badge" style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', marginBottom: '1rem', fontWeight: 800 }}>
                  <Building2 size={14} />
                  <span>ESTABLISHED PHYSICAL CENTER IN GURUGRAM</span>
                </div>
                <h2 style={{ color: '#0F172A', fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
                  Not Just a Website. A Real Educational Institute.
                </h2>
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.65, marginBottom: '1.75rem' }}>
                  TuitionForHome is backed by <strong>SSSAM Academy</strong> (Sector 14, Old DLF, Gurugram). Every teacher undergoes rigorous in-person document screening, subject audits, and background checks.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', fontSize: '0.92rem', color: '#334155' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>In-person tutor document audit &amp; interview screening</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>Option to attend classes at our Sector 14 academy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>100% Free replacement guarantee if student is unsatisfied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <Link href="/request-tutor" className="btn btn-primary btn-lg btn-cta-pulse" style={{ backgroundColor: '#0F6E56', textDecoration: 'none' }}>
                    <span>Book {payload.subject.name} Demo</span>
                    <ChevronRight size={17} />
                  </Link>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary btn-lg" style={{ color: '#0F6E56', border: '2px solid #0F6E56', textDecoration: 'none' }}>
                    <Phone size={17} className="phone-icon-animated" />
                    <span>Call Sector 14 Center</span>
                  </a>
                </div>
              </div>

              {/* Right Side: Center Details Card */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '24px', padding: '1.75rem', boxShadow: '0 12px 35px rgba(15, 23, 42, 0.06)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="#0F6E56" />
                  <span>SSSAM Academy Gurugram Center</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: '#475569' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>OFFICIAL ADDRESS</div>
                    <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.address}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>DIRECT HELPLINE</div>
                    <div style={{ color: '#0F6E56', fontWeight: 800, marginTop: '2px', fontSize: '1.05rem' }}>
                      {SSSAM_OFFICE_DETAILS.phones.filter(Boolean).join(' • ')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>COUNSELOR TIMINGS</div>
                    <div style={{ color: '#0F172A', fontWeight: 600, marginTop: '2px' }}>{SSSAM_OFFICE_DETAILS.hours}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. CONTEXTUAL LOCALIZED FAQS WITH JSON-LD SCHEMA
            ========================================================================= */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container" style={{ maxWidth: '840px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>
                <HelpCircle size={14} />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0F172A' }}>
                Questions About {payload.subject.name} Tuition in {payload.locality.name}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {payload.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1.5px solid #E2E8F0',
                  }}
                >
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                    {faq.question}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: 1.6, margin: 0 }}>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. MULTI-DIMENSIONAL INTERNAL LINKING SPIDERWEB (GOOGLE CRAWLER ENGINE)
            ========================================================================= */}
        <section style={{ padding: '4rem 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
          <div className="container">
            {/* Grid 1: Related Search Intent Tracks in this Locality */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', textAlign: 'center' }}>
                Popular Search Tracks in {payload.locality.name} ({payload.locality.city})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                <Link
                  href={`/tuition/female-${payload.subject.slug}-home-tutor-in-${payload.locality.slug}`}
                  style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '0.4rem 0.8rem', borderRadius: '999px', textDecoration: 'none' }}
                >
                  👩‍🏫 Female {payload.subject.name} Tutors in {payload.locality.name}
                </Link>
                <Link
                  href={`/tuition/class-10-cbse-${payload.subject.slug}-home-tutor-in-${payload.locality.slug}`}
                  style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '0.4rem 0.8rem', borderRadius: '999px', textDecoration: 'none' }}
                >
                  🎯 Class 10 CBSE {payload.subject.name} in {payload.locality.name}
                </Link>
                <Link
                  href={`/tuition/class-12-cbse-${payload.subject.slug}-home-tutor-in-${payload.locality.slug}`}
                  style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE', padding: '0.4rem 0.8rem', borderRadius: '999px', textDecoration: 'none' }}
                >
                  📚 Class 12 Boards {payload.subject.name} in {payload.locality.name}
                </Link>
                <Link
                  href={`/tuition/ib-board-${payload.subject.slug}-home-tutor-in-${payload.locality.slug}`}
                  style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#FAF5FF', color: '#6B21A8', border: '1px solid #E9D5FF', padding: '0.4rem 0.8rem', borderRadius: '999px', textDecoration: 'none' }}
                >
                  🌍 IB Diploma {payload.subject.name} in {payload.locality.name}
                </Link>
                <Link
                  href={`/tuition/neet-${payload.subject.slug}-home-tutor-in-${payload.locality.slug}`}
                  style={{ fontSize: '0.78rem', fontWeight: 700, backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', padding: '0.4rem 0.8rem', borderRadius: '999px', textDecoration: 'none' }}
                >
                  🩺 NEET Prep {payload.subject.name} in {payload.locality.name}
                </Link>
              </div>
            </div>

            {/* Grid 2: Nearby Adjacent Localities & Sectors */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem', textAlign: 'center' }}>
                Explore {payload.subject.name} Home Tutors Across Other {payload.locality.city} &amp; NCR Sectors
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                {PSEO_LOCALITIES.slice(0, 32).map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/tuition/${payload.subject.slug}-home-tutor-in-${loc.slug}`}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: '#FFFFFF',
                      color: '#334155',
                      border: '1px solid #E2E8F0',
                      padding: '0.38rem 0.75rem',
                      borderRadius: '999px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    📍 {payload.subject.name} in {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
