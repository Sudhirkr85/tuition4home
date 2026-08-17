import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS, VERIFIED_TUTORS, MockTutor } from '@/lib/data';
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
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    subject: string;
  };
}

export async function generateStaticParams() {
  return SUBJECT_SEO_PAGES.map((s) => ({
    subject: s.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = SUBJECT_SEO_PAGES.find((s) => s.slug === params.subject);
  if (!item) return { title: 'Home Tutors in Gurgaon' };

  return {
    title: item.metaTitle,
    description: item.metaDesc,
    keywords: [
      `${item.subjectName.toLowerCase()} home tutor gurgaon`,
      `best ${item.subjectName.toLowerCase()} teacher gurugram`,
      `cbse ${item.subjectName.toLowerCase()} tutor dlf phase 5`,
      `online ${item.subjectName.toLowerCase()} tutor india`,
      'SSSAM Academy',
    ],
    alternates: {
      canonical: `/tuition/${item.slug}`,
    },
    openGraph: {
      title: item.metaTitle,
      description: item.metaDesc,
      url: `https://tuitionforhome.com/tuition/${item.slug}`,
      siteName: 'TuitionForHome',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.metaTitle,
      description: item.metaDesc,
    },
  };
}

export default async function SubjectPage({ params }: PageProps) {
  const item = SUBJECT_SEO_PAGES.find((s) => s.slug === params.subject);
  if (!item) notFound();

  // Fetch live verified tutors from Prisma MySQL with dynamic subject/gender filtering
  let dynamicTutors: MockTutor[] = [];
  try {
    const isFemalePage = params.subject.includes('female');
    const isMaths = params.subject.includes('maths');
    const isPhysics = params.subject.includes('physics');
    const isChemistry = params.subject.includes('chemistry');
    const isBiology = params.subject.includes('biology');
    const isCS = params.subject.includes('computer-science') || params.subject.includes('python');
    const isCommerce = params.subject.includes('accounts') || params.subject.includes('economics');
    const isPrimary = params.subject.includes('primary');

    let whereClause: any = { status: 'ACTIVE_VERIFIED' };
    if (isFemalePage) {
      whereClause.gender = 'FEMALE';
    }

    let dbTutors = await prisma.tutorProfile.findMany({
      where: whereClause,
      include: { user: true },
      take: 6,
    });

    // In-memory subject matching if multiple verified tutors exist
    if (dbTutors.length > 0 && !isFemalePage) {
      let filtered = dbTutors;
      if (isMaths) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('math'));
      else if (isPhysics) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('physic'));
      else if (isChemistry) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('chem'));
      else if (isBiology) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('bio'));
      else if (isCS) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('python') || (t.subjects || '').toLowerCase().includes('computer'));
      else if (isCommerce) filtered = dbTutors.filter(t => (t.subjects || '').toLowerCase().includes('account') || (t.subjects || '').toLowerCase().includes('econ') || (t.subjects || '').toLowerCase().includes('commerce'));
      else if (isPrimary) filtered = dbTutors.filter(t => (t.classes || '').toLowerCase().includes('class 1') || (t.classes || '').toLowerCase().includes('primary'));

      if (filtered.length > 0) {
        dbTutors = filtered;
      }
    }

    if (dbTutors && dbTutors.length > 0) {
      dynamicTutors = dbTutors.map((tp: any) => {
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
          serviceAreas,
          travelRadiusKm: tp.travelRadiusKm,
          hourlyRateHome: tp.hourlyRateHome || 900,
          hourlyRateOnline: tp.hourlyRateOnline || 600,
          monthlyRateMin: tp.monthlyRateMin || 7500,
          isVerified: tp.isVerified,
          hasPoliceCheck: tp.hasPoliceCheck,
          rating: tp.rating,
          totalReviews: tp.totalReviews,
          bio: tp.bio || '',
          badge: tp.highestDegree ? `Specialist (${tp.highestDegree})` : 'Verified Tutor',
        };
      });
    }
  } catch {
    // DB query fallback
  }

  // Schema.org Structured Data (Course, FAQPage & BreadcrumbList)
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': ['Course', 'EducationalOrganization'],
    name: item.h1,
    description: item.metaDesc,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'TuitionForHome (SSSAM Academy)',
      address: SSSAM_OFFICE_DETAILS.address,
      telephone: SSSAM_OFFICE_DETAILS.phones[0],
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: item.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
        name: 'Tuition Subjects',
        item: 'https://tuitionforhome.com/#find-tutor',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.subjectName,
        item: `https://tuitionforhome.com/tuition/${item.slug}`,
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <main style={{ flex: 1 }}>
        {/* Subject Hero */}
        <section style={{
          padding: '4.5rem 0 3.5rem 0',
          background: 'radial-gradient(circle at 50% 10%, rgba(219, 234, 254, 0.4), rgba(248, 250, 252, 1) 80%)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-slate-500)', marginBottom: '1.25rem' }}>
              <Link href="/" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <Link href="/#find-tutor" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Subjects</Link>
              <span>/</span>
              <span>{item.subjectName}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <div className="badge badge-trust" style={{ marginBottom: '0.75rem' }}>
                  <ShieldCheck size={14} color="var(--color-emerald-500)" />
                  <span>{item.targetGrades} • SSSAM ACADEMY VERIFIED</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
                  {item.h1}
                </h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--color-slate-600)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  {item.intro}
                </p>

                {/* Subject Highlights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {item.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--color-slate-700)' }}>
                      <CheckCircle2 size={18} color="var(--color-emerald-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <Link href="/request-tutor" className="btn btn-primary btn-lg">
                    <Sparkles size={18} />
                    <span>Request {item.subjectName} Tutor</span>
                  </Link>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary btn-lg">
                    <Phone size={18} />
                    <span>Talk to Academic Counselor</span>
                  </a>
                </div>
              </div>

              {/* Subject Fee & Fast Action Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '24px',
                padding: '2.25rem',
                boxShadow: 'var(--shadow-hover)',
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-slate-500)', marginBottom: '0.35rem' }}>
                  AVERAGE TUITION FEE IN GURGAON
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.25rem' }}>
                  {item.avgHourlyFee}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--color-blue-600)', fontWeight: 600, marginBottom: '1.5rem' }}>
                  Monthly approx: {item.avgMonthlyFee} (3–4 classes/week)
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--color-slate-900)' }}>
                    Why Choose Our {item.subjectName} Tutors:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                    <div>✓ In-person interviews at SSSAM Academy Sector 14</div>
                    <div>✓ 60-Second introductory video communication audit</div>
                    <div>✓ 100% Free replacement guarantee if unsatisfied</div>
                    <div>✓ Regular chapter mock tests & parent progress reports</div>
                  </div>
                </div>

                <Link href="/request-tutor" className="btn btn-emerald btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Request Verified Tutor</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Tutors for this Subject */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Top Verified {item.subjectName} Educators in Gurgaon
            </h2>
            <p style={{ color: 'var(--color-slate-600)', marginBottom: '2.5rem' }}>
              Available for home visits in DLF Phase 1-5, Golf Course Rd, Sohna Rd, and online classes.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}>
              {dynamicTutors.slice(0, 3).map((tutor) => (
                <div key={tutor.id} className="luxury-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tutor.avatarUrl} alt={tutor.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{tutor.name}</h4>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-blue-600)', fontWeight: 700 }}>{tutor.badge}</div>
                        {tutor.totalReviews > 0 && tutor.rating > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-slate-600)' }}>
                            <Star size={12} color="var(--color-amber-500)" fill="var(--color-amber-500)" />
                            <strong>{tutor.rating}</strong> ({tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'})
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.74rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', marginTop: '2px' }}>
                            <span>✨ New Verified Tutor</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-600)', marginBottom: '0.75rem' }}>
                      🎓 {tutor.highestDegree} • {tutor.experienceYears}+ Yrs Exp
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-700)', marginBottom: '1rem' }}>
                      📍 {tutor.serviceAreas.join(' • ')}
                    </div>
                  </div>

                  <Link href="/" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Request Classes</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-slate-50)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
              Frequently Asked Questions: {item.subjectName} Tuition in Gurgaon
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {item.faqs.map((f, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-slate-900)' }}>
                    {f.question}
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: 1.5 }}>
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
