import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TutorProfileActions from '@/components/TutorProfileActions';
import prisma from '@/lib/prisma';
import { VERIFIED_TUTORS, SSSAM_OFFICE_DETAILS, MockTutor } from '@/lib/data';
import {
  ShieldCheck,
  Star,
  GraduationCap,
  MapPin,
  Clock,
  BookOpen,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
  MessageSquare,
  Award,
  Briefcase,
  ExternalLink,
  ThumbsUp,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { getVideoSourceInfo } from '@/lib/video';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let tutor = VERIFIED_TUTORS.find((t) => t.id === params.id);
  let tutorName = tutor ? tutor.name : 'Verified Home Tutor';
  let subjects = tutor ? tutor.subjects.join(', ') : 'All Subjects';
  let avatarUrl = tutor?.avatarUrl || 'https://sssamacademy.com/assets/home_page.webp';

  try {
    const dbProfile: any = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: params.id },
          { userId: params.id },
        ],
      },
      include: {
        user: { select: { name: true } },
      },
    });

    if (dbProfile) {
      tutorName = dbProfile.user?.name || tutorName;
      if (dbProfile.avatarUrl) avatarUrl = dbProfile.avatarUrl;
      if (dbProfile.subjects) {
        try {
          const parsed = JSON.parse(dbProfile.subjects);
          if (Array.isArray(parsed) && parsed.length > 0) subjects = parsed.join(', ');
        } catch {
          subjects = dbProfile.subjects;
        }
      }
    }
  } catch {}

  return {
    title: `${tutorName} - Verified Home & Online Tutor in Gurgaon | SSSAM Academy`,
    description: `Hire ${tutorName} for 1-on-1 home tuition in Gurgaon. Specializes in ${subjects}. Background & KYC verified by SSSAM Academy. 100% Replacement Guarantee.`,
    alternates: {
      canonical: `/tutors/${params.id}`,
    },
    openGraph: {
      title: `${tutorName} — Verified Tutor in Gurgaon`,
      description: `Hire ${tutorName} for ${subjects} in Gurgaon. Verified by SSSAM Academy.`,
      url: `https://tuitionforhome.com/tutors/${params.id}`,
      siteName: 'TuitionForHome',
      images: [
        {
          url: avatarUrl,
          width: 800,
          height: 800,
          alt: `${tutorName} Tutor Profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tutorName} — Verified Tutor in Gurgaon`,
      description: `Hire ${tutorName} for ${subjects} in Gurgaon. Verified by SSSAM Academy.`,
    },
  };
}

export default async function TutorProfilePage({ params }: PageProps) {
  // Fetch tutor from Prisma MySQL database with fallback to baseline mock data
  let tutorData: MockTutor | null = null;

  try {
    let dbProfile: any = await prisma.tutorProfile.findFirst({
      where: {
        OR: [
          { id: params.id },
          { userId: params.id },
        ],
      },
      include: {
        user: {
          select: { name: true }, // STRICT: DO NOT select phone, email, or password
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          take: 6,
        },
      },
    });

    // Fallback: If not found directly on TutorProfile, check if params.id is User.id or User.email
    if (!dbProfile) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: params.id },
            { email: params.id },
          ],
        },
        include: {
          tutorProfile: {
            include: {
              reviews: {
                where: { isApproved: true },
                orderBy: { createdAt: 'desc' },
                take: 6,
              },
            },
          },
        },
      });

      if (user?.tutorProfile) {
        dbProfile = {
          ...user.tutorProfile,
          user: { name: user.name },
        };
      }
    }

    if (dbProfile) {
      let subjects: string[] = [];
      let classes: string[] = [];
      let boards: string[] = [];
      let serviceAreas: string[] = [];
      let qualifications = [];
      let experiences = [];

      try { subjects = dbProfile.subjects ? JSON.parse(dbProfile.subjects) : []; } catch { subjects = dbProfile.subjects ? dbProfile.subjects.split(',') : []; }
      try { classes = dbProfile.classes ? JSON.parse(dbProfile.classes) : []; } catch { classes = []; }
      try { boards = dbProfile.boards ? JSON.parse(dbProfile.boards) : []; } catch { boards = []; }
      try { serviceAreas = dbProfile.serviceAreas ? JSON.parse(dbProfile.serviceAreas) : []; } catch { serviceAreas = []; }
      try { qualifications = dbProfile.qualifications ? JSON.parse(dbProfile.qualifications) : []; } catch { qualifications = []; }
      try { experiences = dbProfile.experiences ? JSON.parse(dbProfile.experiences) : []; } catch { experiences = []; }

      const reviews = (dbProfile.reviews || []).map((r: any) => ({
        id: r.id,
        parentName: r.parentName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }));

      const hasRealReviews = reviews.length > 0;
      const calculatedRating = hasRealReviews
        ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / reviews.length
        : dbProfile.rating && dbProfile.totalReviews > 0
        ? dbProfile.rating
        : null;

      tutorData = {
        id: dbProfile.id,
        name: dbProfile.user.name,
        phone: '', // STRICT PRIVACY: NEVER EXPOSE
        email: '', // STRICT PRIVACY: NEVER EXPOSE
        avatarUrl: dbProfile.avatarUrl || '',
        introVideoUrl: dbProfile.introVideoUrl || '',
        videoDuration: dbProfile.introVideoUrl ? '1m 20s' : '',
        highestDegree: dbProfile.highestDegree || '',
        experienceYears: dbProfile.experienceYears || 0,
        teachingMode: dbProfile.teachingMode,
        subjects,
        classes,
        boards,
        serviceAreas,
        travelRadiusKm: dbProfile.travelRadiusKm || 5,
        hourlyRateHome: dbProfile.hourlyRateHome || dbProfile.hourlyRateHomeMin || 600,
        hourlyRateHomeMin: dbProfile.hourlyRateHomeMin || dbProfile.hourlyRateHome || 600,
        hourlyRateHomeMax: dbProfile.hourlyRateHomeMax || (dbProfile.hourlyRateHome ? Math.round((dbProfile.hourlyRateHome * 1.4) / 50) * 50 : 900),
        hourlyRateOnline: dbProfile.hourlyRateOnline || dbProfile.hourlyRateOnlineMin || 500,
        hourlyRateOnlineMin: dbProfile.hourlyRateOnlineMin || dbProfile.hourlyRateOnline || 500,
        hourlyRateOnlineMax: dbProfile.hourlyRateOnlineMax || (dbProfile.hourlyRateOnline ? Math.round((dbProfile.hourlyRateOnline * 1.4) / 50) * 50 : 750),
        monthlyRateMin: dbProfile.monthlyRateMin || 5000,
        isVerified: dbProfile.isVerified,
        hasPoliceCheck: dbProfile.hasPoliceCheck,
        rating: calculatedRating || 5.0,
        totalReviews: reviews.length || dbProfile.totalReviews || 0,
        bio: dbProfile.bio || '',
        badge: dbProfile.highestDegree ? `Specialist (${dbProfile.highestDegree})` : 'Verified Educator',
        qualifications,
        experiences,
        reviews,
      };
    }
  } catch {
    // DB query fallback
  }

  // Fallback to static mock if not in DB
  if (!tutorData) {
    const fallback = VERIFIED_TUTORS.find((t) => t.id === params.id);
    if (fallback) {
      tutorData = {
        ...fallback,
        phone: '', // STRICT PRIVACY
        email: '', // STRICT PRIVACY
      };
    }
  }

  if (!tutorData) {
    notFound();
  }

  const tutorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: tutorData.name,
    jobTitle: 'Home & Online Tutor',
    description: tutorData.bio || `Verified home tutor specializing in ${tutorData.subjects.join(', ')} in Gurgaon.`,
    image: tutorData.avatarUrl,
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'TuitionForHome (SSSAM Academy)',
      url: 'https://tuitionforhome.com',
    },
    knowsAbout: tutorData.subjects,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: tutorData.highestDegree,
    },
    aggregateRating: tutorData.totalReviews > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: tutorData.rating.toString(),
      reviewCount: tutorData.totalReviews.toString(),
      bestRating: '5',
      worstRating: '1',
    } : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tuitionforhome.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gurgaon Tutors',
        item: 'https://tuitionforhome.com/tutors',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tutorData.name,
        item: `https://tuitionforhome.com/tutors/${params.id}`,
      },
    ],
  };

  const hasRealExperiences = tutorData.experiences && tutorData.experiences.length > 0;
  const hasRealQualifications = tutorData.qualifications && tutorData.qualifications.length > 0;
  const hasReviews = tutorData.reviews && tutorData.reviews.length > 0;
  const isNewTutor = tutorData.totalReviews === 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tutorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main style={{ flex: 1, padding: '2rem 0 5rem 0' }}>
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#64748B' }}>
              <Link href="/" style={{ color: '#0F6E56', fontWeight: 600, textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/tutors" style={{ color: '#0F6E56', fontWeight: 600, textDecoration: 'none' }}>Gurgaon Tutors</Link>
              <span>/</span>
              <span style={{ color: '#0F172A', fontWeight: 700 }}>{tutorData.name}</span>
            </div>

            <Link
              href={`/tutor/review/${params.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#0F6E56',
                textDecoration: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
              }}
            >
              <Star size={13} fill="#059669" color="#059669" />
              <span>Write a Review</span>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 380px)',
            gap: '2.5rem',
            alignItems: 'start',
          }} className="tutor-profile-grid">
            {/* LEFT COLUMN: Main Profile Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Profile Card Header */}
              <div className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
                    {tutorData.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tutorData.avatarUrl}
                        alt={tutorData.name}
                        style={{ width: '100%', height: '100%', borderRadius: '22px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '22px',
                          backgroundColor: '#0F766E',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2.5rem',
                          fontWeight: 900,
                          border: '2px solid #E2E8F0'
                        }}
                      >
                        {tutorData.name ? tutorData.name.charAt(0).toUpperCase() : 'T'}
                      </div>
                    )}
                    <span style={{
                      position: 'absolute',
                      bottom: '-4px',
                      right: '-4px',
                      backgroundColor: '#047857',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      border: '3px solid #FFFFFF',
                    }}>
                      <ShieldCheck size={14} />
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={13} />
                        <span>SSSAM ACADEMY VERIFIED PRO</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '6px', fontWeight: 700 }}>
                        {tutorData.teachingMode === 'OFFLINE_HOME' ? '🏡 Home Visits Only' : tutorData.teachingMode === 'ONLINE_LIVE' ? '💻 Online 1-on-1' : '🏡 Home & Online'}
                      </span>
                    </div>

                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                      {tutorData.name}
                    </h1>

                    {/* Star Rating & Review Count Strip (Honest Airbnb Standard) */}
                    {!isNewTutor ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={star <= Math.round(tutorData.rating || 5) ? '#F59E0B' : '#E2E8F0'}
                              color={star <= Math.round(tutorData.rating || 5) ? '#F59E0B' : '#CBD5E1'}
                            />
                          ))}
                        </div>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                          {(tutorData.rating || 5.0).toFixed(1)}
                        </span>
                        <span style={{ color: '#64748B', fontSize: '0.85rem' }}>•</span>
                        <a
                          href="#parent-reviews"
                          style={{ color: '#0F6E56', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}
                        >
                          {tutorData.totalReviews} Verified Parent Reviews
                        </a>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: '#065F46',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}>
                          <Sparkles size={12} color="#059669" />
                          <span>✨ New Verified Educator</span>
                        </span>
                        <span style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: 600 }}>
                          • First session reviews pending
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4-Pillar Quick Stats Strip */}
                <div className="tutor-stats-strip">
                  <div className="tutor-stat-item">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', flexShrink: 0 }}>
                      <Star size={16} fill="#D97706" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>RATING</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#92400E', whiteSpace: 'nowrap' }}>
                        {!isNewTutor ? `${(tutorData.rating || 5.0).toFixed(1)} / 5.0` : 'New Educator'}
                      </div>
                    </div>
                  </div>

                  <div className="tutor-stat-item">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                      <Briefcase size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>EXPERIENCE</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065F46', whiteSpace: 'nowrap' }}>
                        {tutorData.experienceYears > 0 ? `${tutorData.experienceYears}+ Years` : 'Educator'}
                      </div>
                    </div>
                  </div>

                  <div className="tutor-stat-item">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                      <GraduationCap size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>DEGREE</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E3A8A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tutorData.highestDegree}>
                        {tutorData.highestDegree || 'Graduate'}
                      </div>
                    </div>
                  </div>

                  <div className="tutor-stat-item">
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0 }}>
                      <MapPin size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>COVERAGE</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#5B21B6', whiteSpace: 'nowrap' }}>
                        {tutorData.travelRadiusKm || 5} KM Radius
                      </div>
                    </div>
                  </div>
                </div>

                {/* SSSAM Academy Trust Strip */}
                <div style={{
                  padding: '0.9rem 1.15rem',
                  borderRadius: '14px',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.65rem',
                  fontSize: '0.82rem',
                  color: '#166534',
                  fontWeight: 600,
                  marginTop: '0.85rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>Degree Transcripts Audited</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>Government ID &amp; KYC Verified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>Interview Verified • {tutorData.serviceAreas.length > 0 ? tutorData.serviceAreas[0] : 'Gurgaon'}</span>
                  </div>
                </div>
              </div>

              {/* LinkedIn-Style Professional Experience & Education Timeline */}
              <div className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                  <Briefcase size={20} color="#0F6E56" />
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Experience &amp; Academic Credentials
                  </h2>
                </div>

                {/* 1. Experience Timeline Section */}
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.04em' }}>
                    TEACHING &amp; MENTORSHIP EXPERIENCE
                  </div>

                  {hasRealExperiences ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {tutorData.experiences!.map((exp, idx) => (
                        <div key={exp.id || idx} style={{ display: 'flex', gap: '1.15rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: '#ECFDF5',
                            border: '1.5px solid #A7F3D0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#047857',
                            flexShrink: 0,
                          }}>
                            <Briefcase size={20} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                              {exp.role}
                            </h3>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F6E56', marginBottom: '2px' }}>
                              {exp.organization}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: exp.description ? '0.5rem' : 0 }}>
                              {exp.startYear} {exp.endYear ? `– ${exp.endYear}` : exp.isCurrent ? '– Present' : ''}
                            </div>
                            {exp.description && (
                              <div style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, backgroundColor: '#F8FAFC', padding: '0.75rem 0.95rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                                {exp.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#ECFDF5',
                        border: '1.5px solid #A7F3D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#047857',
                        flexShrink: 0,
                      }}>
                        <Briefcase size={20} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
                          {tutorData.experienceYears > 0 ? `${tutorData.experienceYears}+ Years Teaching & Mentorship Experience` : 'Verified Home & Online Educator'}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>
                          Providing 1-on-1 personalized home tuition visits and interactive online sessions across Gurgaon &amp; Delhi NCR.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Education & Qualifications Section */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.04em' }}>
                    ACADEMIC DEGREES &amp; QUALIFICATIONS
                  </div>

                  {hasRealQualifications ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {tutorData.qualifications!.map((qual, idx) => (
                        <div key={qual.id || idx} style={{ display: 'flex', gap: '1.15rem' }}>
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: '#EFF6FF',
                            border: '1.5px solid #BFDBFE',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563EB',
                            flexShrink: 0,
                          }}>
                            <GraduationCap size={22} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 2px 0' }}>
                              {qual.degree}
                            </h3>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#2563EB', marginBottom: '2px' }}>
                              {qual.institute}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                              {qual.year ? `Graduation Year: ${qual.year}` : 'Verified Academic Transcript'} {qual.grade ? `• Grade: ${qual.grade}` : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '1.15rem', alignItems: 'center', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#EFF6FF',
                        border: '1.5px solid #BFDBFE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#2563EB',
                        flexShrink: 0,
                      }}>
                        <GraduationCap size={22} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A', margin: '0 0 3px 0' }}>
                          {tutorData.highestDegree || 'Bachelor Degree'}
                        </h3>
                        <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                          Degree transcripts and identity credentials audited &amp; verified by SSSAM Academy.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 60s Video Audition & Teaching Introduction */}
              {(() => {
                const videoInfo = getVideoSourceInfo(tutorData.introVideoUrl);
                if (!videoInfo.isEmbeddable) {
                  return (
                    <div className="apple-card-static" style={{ padding: '1.25rem 1.5rem', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0 }}>
                        <Award size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B', marginBottom: '2px' }}>
                          🎥 Video Introduction In-Progress
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          {tutorData.name}&apos;s academic degrees and KYC verification are 100% verified. You can book a 1-on-1 trial class directly.
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={18} color="#0F6E56" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                          60-Second Video Introduction &amp; Audition
                        </h2>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Duration: {tutorData.videoDuration || 'Audition'}</span>
                    </div>

                    <div style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '56.25%',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      backgroundColor: '#0F172A',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    }}>
                      {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'gdrive' ? (
                        <iframe
                          src={videoInfo.embedUrl}
                          title={`${tutorData.name} Video Intro`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={videoInfo.embedUrl}
                          controls
                          playsInline
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000000',
                            objectFit: 'contain',
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* About & Teaching Methodology */}
              <div className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                  Teaching Philosophy &amp; Methodology
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {tutorData.bio || `${tutorData.name} is a verified educator with ${tutorData.experienceYears > 0 ? `${tutorData.experienceYears}+ years of teaching experience` : 'specialized academic expertise'}${tutorData.highestDegree ? `, holding a ${tutorData.highestDegree} degree` : ''}. Focuses on personalized 1-on-1 learning, concept clarity, regular practice assessments, and homework assistance for ${tutorData.subjects.length > 0 ? tutorData.subjects.join(', ') : 'academic subjects'} across Gurgaon.`}
                </p>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                  Academic Capabilities &amp; Subjects Taught:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {tutorData.subjects.map((sub) => (
                    <span
                      key={sub}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        color: '#166534',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      CLASSES &amp; LEVELS
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>
                      {tutorData.classes.length > 0 ? tutorData.classes.join(' • ') : 'Classes specified on consultation'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      BOARDS SUPPORTED
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>
                      {tutorData.boards.length > 0 ? tutorData.boards.join(' • ') : 'CBSE • ICSE • State & International Boards'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Parent Reviews Section */}
              <div id="parent-reviews" className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={20} color="#0F6E56" />
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Verified Parent Reviews
                    </h2>
                  </div>

                  <Link
                    href={`/tutor/review/${params.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#0F6E56',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Leave a Review</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>

                {hasReviews ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Overall Summary Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1.25rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ textAlign: 'center', minWidth: '100px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                          {(tutorData.rating || 5.0).toFixed(1)}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', margin: '0.35rem 0' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} fill="#F59E0B" color="#F59E0B" />
                          ))}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          {tutorData.totalReviews} Total Reviews
                        </div>
                      </div>

                      <div style={{ flex: 1, minWidth: '200px', borderLeft: '1px solid #CBD5E1', paddingLeft: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                          <ThumbsUp size={16} />
                          <span>100% Recommended by Parents in Gurgaon</span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5 }}>
                          All reviews are submitted by parents who completed verified tuition sessions through TuitionForHome / SSSAM Academy.
                        </div>
                      </div>
                    </div>

                    {/* Individual Review Cards */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {tutorData.reviews!.map((review) => (
                        <div
                          key={review.id}
                          style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: '#E0F2FE',
                                color: '#0284C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                              }}>
                                {review.parentName ? review.parentName.charAt(0).toUpperCase() : 'P'}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                                  {review.parentName}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                                  <CheckCircle2 size={12} />
                                  <span>Verified Parent</span>
                                </div>
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={13}
                                    fill={star <= review.rating ? '#F59E0B' : '#E2E8F0'}
                                    color={star <= review.rating ? '#F59E0B' : '#CBD5E1'}
                                  />
                                ))}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                                {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </div>

                          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                            &ldquo;{review.comment}&rdquo;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '18px',
                    border: '1px dashed #CBD5E1',
                  }}>
                    <div style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>✨</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                      Newly Verified Home Tutor
                    </div>
                    <p style={{ fontSize: '0.86rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 1.25rem auto', lineHeight: 1.6 }}>
                      {tutorData.name}&apos;s background check, KYC credentials, and academic degrees are verified by SSSAM Academy. Book a trial session and be the first parent to share review feedback!
                    </p>
                    <Link
                      href={`/tutor/review/${params.id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.6rem 1.35rem', fontSize: '0.86rem', fontWeight: 700 }}
                    >
                      Write First Review ✍️
                    </Link>
                  </div>
                )}
              </div>

              {/* Service Sectors & Travel Range */}
              <div className="apple-card-static" style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <MapPin size={18} color="#047857" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Home Visit Coverage in Gurgaon
                  </h2>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.25rem' }}>
                  {tutorData.name} travels up to <strong>{tutorData.travelRadiusKm} km</strong> for home tuition visits across the following sectors:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {tutorData.serviceAreas.map((area) => (
                    <span
                      key={area}
                      style={{
                        padding: '0.4rem 0.85rem',
                        borderRadius: '8px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                      }}
                    >
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Full-Height Balanced Information Suite */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Card 1: Tuition Fee & 1-Click Request */}
              <div className="apple-card-static" style={{
                padding: '2rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #CBD5E1',
                boxShadow: '0 12px 30px -8px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: '90px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    ESTIMATED TUITION FEE
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.82rem', fontWeight: 800, color: '#D97706' }}>
                    {!isNewTutor ? (
                      <>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{(tutorData.rating || 5.0).toFixed(1)}</span>
                        <span style={{ color: '#94A3B8', fontWeight: 500 }}>({tutorData.totalReviews})</span>
                      </>
                    ) : (
                      <span style={{ color: '#059669', fontSize: '0.76rem', fontWeight: 700 }}>✨ Verified</span>
                    )}
                  </div>
                </div>

                {tutorData.teachingMode === 'ONLINE_LIVE' ? (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
                      ₹{tutorData.hourlyRateOnlineMin || 500} – ₹{tutorData.hourlyRateOnlineMax && tutorData.hourlyRateOnlineMax !== tutorData.hourlyRateOnlineMin ? tutorData.hourlyRateOnlineMax : Math.round(((tutorData.hourlyRateOnlineMin || 500) * 1.4) / 50) * 50}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>/ hr (Online 1-on-1)</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>
                      ₹{tutorData.hourlyRateHomeMin || 600} – ₹{tutorData.hourlyRateHomeMax && tutorData.hourlyRateHomeMax !== tutorData.hourlyRateHomeMin ? tutorData.hourlyRateHomeMax : Math.round(((tutorData.hourlyRateHomeMin || 600) * 1.4) / 50) * 50}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>/ hr (Home Visit)</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  {(!tutorData.teachingMode || tutorData.teachingMode === 'BOTH') && (
                    <div style={{ fontSize: '0.82rem', color: '#0369A1', fontWeight: 700, padding: '0.35rem 0.65rem', backgroundColor: '#F0F9FF', borderRadius: '6px' }}>
                      💻 Online 1-on-1: ₹{tutorData.hourlyRateOnlineMin || 500} – ₹{tutorData.hourlyRateOnlineMax && tutorData.hourlyRateOnlineMax !== tutorData.hourlyRateOnlineMin ? tutorData.hourlyRateOnlineMax : Math.round(((tutorData.hourlyRateOnlineMin || 500) * 1.4) / 50) * 50}/hr
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#64748B', paddingLeft: '0.35rem' }}>
                    📦 Monthly approx: ₹{(tutorData.monthlyRateMin || 5000).toLocaleString('en-IN')} – ₹{(Math.round((tutorData.monthlyRateMin || 5000) * 1.4 / 500) * 500).toLocaleString('en-IN')}/mo
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.88rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>100% Tutor Replacement Guarantee</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>Direct Coordination by SSSAM Academy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span>Monthly Progress &amp; Attendance Tracking</span>
                  </div>
                </div>

                {/* Primary Booking CTA */}
                <Link
                  href={`/request-tutor?tutor=${encodeURIComponent(tutorData.name)}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '0.95rem', marginBottom: '0.85rem' }}
                >
                  <Sparkles size={18} />
                  <span>Request Classes with {tutorData.name.split(' ')[0]}</span>
                </Link>

                {/* Client Interactive Actions (WhatsApp & Share) */}
                <TutorProfileActions
                  tutorName={tutorData.name}
                  tutorId={params.id}
                  subjects={tutorData.subjects}
                  highestDegree={tutorData.highestDegree}
                />

                <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.75rem' }}>
                  🔒 Secure Placement • Coordinated by SSSAM Academy
                </div>
              </div>

              {/* Card 2: How It Works in 3 Simple Steps */}
              <div className="apple-card-static" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F6E56', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  PLACEMENT PROCESS
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                  How Tuition Matching Works
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      1
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Submit Parent Inquiry</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Choose learning mode, subjects, and suitable home visit timings.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      2
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>Counselor Match &amp; Schedule</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>SSSAM Academy counselor coordinates directly with {tutorData.name.split(' ')[0]} within 2 hours.</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FDF2F8', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      3
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>1st Class &amp; 100% Guarantee</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Personalized classes start with our 100% tutor replacement guarantee.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: SSSAM Academy 4-Pillar Guarantee Shield */}
              <div className="apple-card-static" style={{ padding: '1.75rem', backgroundColor: '#F0FDF4', borderRadius: '22px', border: '1.5px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={20} color="#047857" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#065F46', margin: 0 }}>
                    SSSAM Academy Parent Guarantee
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: '#166534', lineHeight: 1.5 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontWeight: 800, color: '#059669' }}>✓</span>
                    <span><strong>100% Replacement:</strong> If you ever feel teacher alignment is not right, we replace at zero extra fee.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontWeight: 800, color: '#059669' }}>✓</span>
                    <span><strong>Transparent Billing:</strong> Official academy fee receipts and secure monthly ledger tracking.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <span style={{ fontWeight: 800, color: '#059669' }}>✓</span>
                    <span><strong>Dedicated Academic Cell:</strong> Assigned coordinator overseeing monthly syllabus coverage.</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Verified Physical Academy Center Card */}
              <div className="apple-card-static" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Building2 size={16} color="#0F6E56" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>OFFICIAL VERIFIED CENTER</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                  {SSSAM_OFFICE_DETAILS.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.4rem' }}>
                  <Phone size={15} color="#059669" />
                  <span>Counselor Helpline: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                  ⏰ Counselor Desk: Mon – Sun (9:00 AM – 8:00 PM)
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
