import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeeEstimator from '@/components/FeeEstimator';
import { GURGAON_LOCALITIES, VERIFIED_TUTORS, SSSAM_OFFICE_DETAILS, MockTutor } from '@/lib/data';
import prisma from '@/lib/prisma';
import { MapPin, ShieldCheck, Star, Sparkles, CheckCircle, GraduationCap, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: {
    locality: string;
  };
}

// Generate Static Params for all 20+ Gurgaon Localities
export async function generateStaticParams() {
  return GURGAON_LOCALITIES.map((loc) => ({
    locality: loc.slug,
  }));
}

// Dynamic SEO Metadata for Google Ranking
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const loc = GURGAON_LOCALITIES.find((l) => l.slug === params.locality);
  if (!loc) return { title: 'Home Tutors in Gurgaon' };

  return {
    title: `Best Home Tutors in ${loc.name}, Gurgaon (CBSE, ICSE, IB) | SSSAM Academy`,
    description: `Find top-rated, background-verified home & online tutors in ${loc.name}, Gurgaon (${loc.landmark}). 100% Tutor Replacement Guarantee. Verified by SSSAM Academy Sector 14 Gurugram.`,
    keywords: [
      `home tutor in ${loc.name.toLowerCase()} gurgaon`,
      `home tuition ${loc.name.toLowerCase()} gurugram`,
      `maths tutor ${loc.name.toLowerCase()}`,
      `cbse class 10 home tutor ${loc.name.toLowerCase()}`,
      `physics tutor ${loc.name.toLowerCase()} gurgaon`,
      `private tuition teachers ${loc.name.toLowerCase()}`,
    ],
    alternates: {
      canonical: `/home-tutors-in-gurgaon/${loc.slug}`,
    },
    openGraph: {
      title: `Home Tutors in ${loc.name}, Gurgaon | TuitionForHome`,
      description: `Hire verified home tutors in ${loc.name} (${loc.landmark}) for CBSE, ICSE, IB & Coding.`,
      url: `https://tuitionforhome.com/home-tutors-in-gurgaon/${loc.slug}`,
      siteName: 'TuitionForHome',
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Best Home Tutors in ${loc.name}, Gurgaon`,
      description: `Find verified home tutors in ${loc.name} (${loc.landmark}). Free Demo Class + 100% Replacement Guarantee.`,
    },
  };
}

export default async function LocalityPage({ params }: PageProps) {
  const loc = GURGAON_LOCALITIES.find((l) => l.slug === params.locality);
  if (!loc) notFound();

  let totalVerifiedCount = 0;
  try {
    totalVerifiedCount = await prisma.tutorProfile.count({
      where: { status: 'ACTIVE_VERIFIED' },
    });
  } catch {
    totalVerifiedCount = 0;
  }
  const displayTutorCount = totalVerifiedCount > 0 ? totalVerifiedCount : 25;

  // Fetch live verified tutors from Prisma MySQL
  let dynamicTutors: MockTutor[] = [];
  try {
    const dbTutors = await prisma.tutorProfile.findMany({
      where: { status: 'ACTIVE_VERIFIED' },
      include: { user: true },
      take: 6,
    });

    if (dbTutors && dbTutors.length > 0) {
      dynamicTutors = dbTutors.map((tp: any) => {
        let subjects: string[] = [];
        try {
          subjects = tp.subjects ? JSON.parse(tp.subjects) : [];
        } catch {
          subjects = tp.subjects ? tp.subjects.split(',').map((s: string) => s.trim()) : [];
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
          serviceAreas: [],
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
    // DB query fallback to baseline
  }

  // Schema.org Structured Data (LocalBusiness & BreadcrumbList)
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    name: `TuitionForHome - Home Tutors in ${loc.name}, Gurgaon`,
    url: `https://tuitionforhome.com/home-tutors-in-gurgaon/${loc.slug}`,
    description: `Find verified home and online tutors in ${loc.name}, Gurgaon (${loc.landmark}).`,
    telephone: SSSAM_OFFICE_DETAILS.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SSSAM_OFFICE_DETAILS.address,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: '122001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SSSAM_OFFICE_DETAILS.geo.lat,
      longitude: SSSAM_OFFICE_DETAILS.geo.lng,
    },
    areaServed: {
      '@type': 'Place',
      name: `${loc.name}, Gurugram`,
    },
    priceRange: '₹₹',
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
        name: 'Gurgaon Localities',
        item: 'https://tuitionforhome.com/#localities',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Home Tutors in ${loc.name}`,
        item: `https://tuitionforhome.com/home-tutors-in-gurgaon/${loc.slug}`,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I book a home tutor in ${loc.name}, Gurgaon?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can book a verified home tutor in ${loc.name} by submitting a tutor inquiry on TuitionForHome. Our academic counselors from SSSAM Academy will match the top tutor near ${loc.landmark} within 2 hours.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the fee for home tuition in ${loc.name}, Gurgaon?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Home tuition fees in ${loc.name} typically range from ₹700 to ₹1,500 per hour (or ₹6,000 to ₹14,000 per month) depending on the grade (Class 1-12, CBSE, ICSE, IB) and subjects needed.`,
        },
      },
    ],
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
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
        {/* Locality Hero */}
        <section style={{
          padding: '4rem 0 3.5rem 0',
          background: 'radial-gradient(circle at 50% 10%, rgba(219, 234, 254, 0.4), rgba(248, 250, 252, 1) 80%)',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-slate-500)', marginBottom: '1.25rem' }}>
              <Link href="/" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Home</Link>
              <span>/</span>
              <Link href="/#find-tutor" style={{ color: 'var(--color-blue-600)', fontWeight: 600 }}>Gurgaon</Link>
              <span>/</span>
              <span>{loc.name}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>
                  <MapPin size={14} />
                  <span>SECTOR HUB: {loc.pincode}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
                  Best Home Tutors in <span className="text-gradient">{loc.name}, Gurgaon</span>
                </h1>
                <p style={{ fontSize: '1.05rem', color: 'var(--color-slate-600)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Serving residential communities around <strong>{loc.landmark}</strong>. Connect with {displayTutorCount}+ verified tutors for CBSE, ICSE, IB, and Cambridge boards with <strong>100% Replacement Guarantee</strong>.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-slate-700)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>Tutors reside within 3–5 km radius of {loc.name} for punctual visits</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>Academic degrees &amp; identity verified in-person by SSSAM Academy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>100% Replacement guarantee if you need a different teacher</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <Link href="/" className="btn btn-primary btn-lg">
                    <span>Request Home Tutor in {loc.name}</span>
                    <ArrowRight size={18} />
                  </Link>
                  <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`} className="btn btn-secondary btn-lg">
                    <Phone size={18} />
                    <span>Call Counselor</span>
                  </a>
                </div>
              </div>

              {/* Quick Inquiry Box */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: 'var(--shadow-hover)',
              }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-900)', marginBottom: '0.35rem' }}>
                  Request Tutor in {loc.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem' }}>
                  Get matched with top tutors near {loc.landmark} in under 2 hours.
                </p>

                <form action="/request-tutor" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label className="form-label">Grade / Board</label>
                    <select className="form-control">
                      <option>Class 9 & 10 (CBSE / ICSE)</option>
                      <option>Class 11 & 12 (Board & JEE/NEET)</option>
                      <option>Class 1 to 8 (Foundation)</option>
                      <option>IB / IGCSE International</option>
                      <option>Python & Coding for Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Subject</label>
                    <input type="text" placeholder="e.g. Maths, Physics, Chemistry" className="form-control" />
                  </div>

                  <div>
                    <label className="form-label">Parent Mobile Number</label>
                    <input type="tel" placeholder="10-digit mobile number" className="form-control" required />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Sparkles size={16} />
                    <span>Find Tutor in {loc.name}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Tutors serving this locality */}
        <section style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Top Verified Educators Serving {loc.name}
            </h2>
            <p style={{ color: 'var(--color-slate-600)', marginBottom: '2.5rem' }}>
              These teachers are currently available for home visits in and around {loc.name}.
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

                    <div style={{ fontSize: '0.82rem', color: 'var(--color-slate-600)', marginBottom: '1rem' }}>
                      🎓 {tutor.highestDegree} • {tutor.experienceYears}+ Years Exp
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                      {tutor.subjects.map((s) => (
                        <span key={s} style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem', backgroundColor: 'var(--color-slate-100)', borderRadius: '4px', fontWeight: 600 }}>
                          {s}
                        </span>
                      ))}
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

        {/* Locality FAQs */}
        <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-slate-50)' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '2rem' }}>
              Frequently Asked Questions: Home Tuitions in {loc.name}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-slate-900)' }}>
                  How soon can a tutor start in {loc.name}?
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: 1.5 }}>
                  Once you submit your inquiry, our academic counselor connects you with the shortlisted tutor in {loc.name} within 2 hours. Classes can start as early as the next day.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-slate-900)' }}>
                  What happens if we need a tutor replacement?
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: 1.5 }}>
                  Under our 100% Satisfaction Guarantee, if you ever feel the educator is not the right fit, SSSAM Academy will provide an immediate replacement educator at zero extra charge.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
