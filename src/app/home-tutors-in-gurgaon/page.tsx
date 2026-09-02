import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ShieldCheck, ArrowRight, Phone, Sparkles, CheckCircle2, Building2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Home Tutors in Gurgaon & South Delhi NCR — All Localities | SSSAM Academy',
  description: 'Find verified home tutors across 45+ localities in Gurgaon & South Delhi NCR — DLF Phase 1-5, Golf Course Rd, Dwarka, Vasant Kunj, Saket, Sector 14 & more. Background-checked educators.',
  alternates: { canonical: '/home-tutors-in-gurgaon' },
};

export default function GurgaonLocalitiesHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Home Tutors Across Gurgaon & Delhi NCR Localities',
    description: 'Find verified home tutors across 45+ residential sectors in Gurgaon, Dwarka, Vasant Kunj & South Delhi.',
    url: 'https://sssamacademy.tech/home-tutors-in-gurgaon',
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
        item: 'https://sssamacademy.tech',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gurgaon & Delhi Localities',
        item: 'https://sssamacademy.tech/home-tutors-in-gurgaon',
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
              <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Localities &amp; Sectors</span>
            </div>

            <div style={{ maxWidth: '800px' }}>
              <div className="badge badge-emerald" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} />
                <span>RESIDENTIAL SECTORS &amp; NCR BORDER HUBS</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.85rem)', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                Home Tutors in <span style={{ color: '#065F46' }}>Gurgaon &amp; Delhi NCR</span>
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Connect with verified home tutors residing within 3–5 km of your sector. Serving DLF Phase 1–5, Golf Course Road, Sohna Road, Dwarka, Vasant Kunj, Saket, and Sector 14.
              </p>

              {/* Trust Micro-Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Doorstep Home Visits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>In-Person Degree Audited</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Top School Homework Sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. LOCALITIES DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '3.5rem 0 5rem 0' }}>
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {GURGAON_LOCALITIES.map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/home-tutors-in-gurgaon/${loc.slug}`}
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
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#ECFDF5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#065F46',
                      }}>
                        <MapPin size={18} />
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        backgroundColor: '#F1F5F9',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                      }}>
                        PIN {loc.pincode}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                      {loc.name}
                    </h2>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                      📍 {loc.landmark}
                    </div>

                    {/* School Tags */}
                    {loc.schools && loc.schools.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {loc.schools.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#0369A1',
                              backgroundColor: '#F0F9FF',
                              border: '1px solid #BAE6FD',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              lineClamp: 1,
                            }}
                          >
                            🏫 {s}
                          </span>
                        ))}
                      </div>
                    )}
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
                    <span>View Verified Tutors</span>
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
                  <Building2 size={14} />
                  <span>PHYSICAL INSTITUTE IN GURUGRAM</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                  Need a Tutor in Your Sector Today?
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Submit your requirement and our counseling desk will match verified teachers residing within 3.5 km of your society within 2 hours.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                  <Link href="/request-tutor" className="btn btn-primary" style={{ backgroundColor: '#059669', textDecoration: 'none' }}>
                    <Sparkles size={16} />
                    <span>Find Tutor in My Sector</span>
                  </Link>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary" style={{ color: '#0F172A', textDecoration: 'none' }}>
                    <Phone size={16} />
                    <span>Call Sector 14 Center</span>
                  </a>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>OFFICIAL OPERATING ADDRESS</div>
                <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>{SSSAM_OFFICE_DETAILS.address}</div>

                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: '0.3rem' }}>HELPLINE NUMBERS</div>
                <div style={{ color: '#67E8F9', fontWeight: 800, fontSize: '1.1rem' }}>{SSSAM_OFFICE_DETAILS.phones[0]} • {SSSAM_OFFICE_DETAILS.phones[1]}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

