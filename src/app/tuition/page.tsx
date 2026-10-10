import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, GraduationCap, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Home Tuition in Gurgaon & Delhi NCR — All Subjects & Boards | SSSAM Academy',
  description: 'Explore 25+ subject-wise home tutors across Gurgaon, Dwarka & South Delhi — Maths, Physics, Chemistry, Biology, IB/IGCSE, Coding, Commerce, French & more. Verified educators by SSSAM Academy.',
  alternates: { canonical: '/tuition' },
};

export default function TuitionHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Home Tuition Subjects in Gurgaon & Delhi NCR',
    description: 'Comprehensive directory of 25+ subject home tutors for CBSE, ICSE, IB, Cambridge & competitive exams.',
    url: 'https://tuitionforhome.com/tuition',
    provider: {
      '@type': 'EducationalOrganization',
      name: 'TuitionForHome (SSSAM Academy)',
      address: SSSAM_OFFICE_DETAILS.address,
      telephone: SSSAM_OFFICE_DETAILS.phones[0],
    },
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
        item: 'https://tuitionforhome.com/tuition',
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Navbar />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. HERO SECTION (Apple Clean Style)
            ========================================================================= */}
        <section style={{
          padding: '3.5rem 0 3rem 0',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-hairline)',
        }}>
          <div className="container">
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <Link href="/" style={{ color: '#0284C7', fontWeight: 600, textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Tuition Subjects</span>
            </div>

            <div style={{ maxWidth: '780px' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} />
                <span>25+ SPECIALIZED SUBJECTS &amp; CURRICULA</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.85rem)', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                Home Tuition in <span style={{ color: '#065F46' }}>Gurgaon &amp; Delhi NCR</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Find top-rated, background-verified 1-on-1 home and online tutors for <strong>CBSE, ICSE, IB (DP/MYP), Cambridge (IGCSE)</strong> and competitive entrance exams (JEE, NEET, CUET).
              </p>

              {/* Trust Micro-Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>100% Verified Tutors</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Free Replacement Guarantee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Transparent Hourly Rates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. SUBJECT DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '3.5rem 0 5rem 0' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}>
              {SUBJECT_SEO_PAGES.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/tuition/${sub.slug}`}
                  className="apple-card"
                  style={{
                    padding: '1.5rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    border: '1px solid var(--border-hairline)',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#065F46',
                      }}>
                        <BookOpen size={20} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#065F46',
                          backgroundColor: '#F0FDF4',
                          border: '1px solid #BBF7D0',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                        }}>
                          {sub.avgHourlyFee}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-light)', fontWeight: 500 }}>
                          *Price varies on tutor
                        </span>
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                      {sub.subjectName}
                    </h2>

                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284C7', marginBottom: '0.75rem' }}>
                      🎓 {sub.targetGrades}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {sub.intro}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.85rem',
                    borderTop: '1px solid var(--border-hairline)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#065F46',
                  }}>
                    <span>Explore Tutors &amp; Syllabus</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. PHYSICAL CENTER TRUST SECTION
            ========================================================================= */}
        <section style={{ padding: '0 0 5rem 0' }}>
          <div className="container">
            <div className="apple-card" style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', backgroundColor: 'rgba(45, 212, 191, 0.15)', color: '#2DD4BF', border: '1px solid rgba(45, 212, 191, 0.3)', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '1rem' }}>
                  <ShieldCheck size={14} />
                  <span>OPERATED BY SSSAM ACADEMY</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Need Guidance Choosing the Right Educator?
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Our academic counselors from Sector 14 Gurugram will analyze your child’s current grade, school syllabus, and learning speed to match the ideal verified teacher in 2 hours.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <Link href="/request-tutor" className="btn btn-primary" style={{ backgroundColor: '#059669', textDecoration: 'none' }}>
                    <Sparkles size={16} />
                    <span>Request Free Callback</span>
                  </Link>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary" style={{ color: '#0F172A', textDecoration: 'none' }}>
                    <Phone size={16} />
                    <span>Call Counselor Desk</span>
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>PHYSICAL OFFICE HUB</div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>{SSSAM_OFFICE_DETAILS.address}</div>

                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>HELPLINE</div>
                <div style={{ color: '#67E8F9', fontWeight: 800, fontSize: '1.1rem' }}>{SSSAM_OFFICE_DETAILS.phones[0]}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
