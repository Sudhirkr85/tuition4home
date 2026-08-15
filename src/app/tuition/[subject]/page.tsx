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
    openGraph: {
      title: item.metaTitle,
      description: item.metaDesc,
      url: `https://tuitionforhome.com/tuition/${item.slug}`,
    },
  };
}

export default async function SubjectPage({ params }: PageProps) {
  const item = SUBJECT_SEO_PAGES.find((s) => s.slug === params.subject);
  if (!item) notFound();

  // Fetch live verified tutors from Prisma MySQL
  let dynamicTutors: MockTutor[] = VERIFIED_TUTORS;
  try {
    const dbTutors = await prisma.tutorProfile.findMany({
      where: { status: 'ACTIVE_VERIFIED' },
      include: { user: true },
      take: 6,
    });

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
          avatarUrl: tp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          introVideoUrl: tp.introVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          videoDuration: '1m 20s',
          highestDegree: tp.highestDegree || 'M.Sc.',
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
  } catch (err) {
    console.warn('DB query in subject page fallback to baseline:', err);
  }

  // Schema.org Structured Data
  const jsonLd = {
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
                  <Link href="/book-demo" className="btn btn-primary btn-lg">
                    <Sparkles size={18} />
                    <span>Book 1-on-1 Free {item.subjectName} Demo</span>
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

                <Link href="/book-demo" className="btn btn-emerald btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Schedule Free Demo Class</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-slate-600)' }}>
                          <Star size={12} color="var(--color-amber-500)" fill="var(--color-amber-500)" />
                          <strong>{tutor.rating}</strong> ({tutor.totalReviews} reviews)
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-600)', marginBottom: '0.75rem' }}>
                      🎓 {tutor.highestDegree} • {tutor.experienceYears}+ Yrs Exp
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-700)', marginBottom: '1rem' }}>
                      📍 {tutor.serviceAreas.join(' • ')}
                    </div>
                  </div>

                  <Link href="/book-demo" className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Book Demo Class</span>
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
