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
    description: `Find top-rated, background-verified home & online tutors in ${loc.name}, Gurgaon (${loc.landmark}). 1 Free Demo Class + 100% Replacement Guarantee. Verified by SSSAM Academy Sector 14 Gurugram.`,
    keywords: [
      `home tutor in ${loc.name.toLowerCase()} gurgaon`,
      `home tuition ${loc.name.toLowerCase()} gurugram`,
      `maths tutor ${loc.name.toLowerCase()}`,
      `cbse class 10 home tutor ${loc.name.toLowerCase()}`,
      `physics tutor ${loc.name.toLowerCase()} gurgaon`,
      `private tuition teachers ${loc.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Home Tutors in ${loc.name}, Gurgaon | TuitionForHome`,
      description: `Hire verified home tutors in ${loc.name} (${loc.landmark}) for CBSE, ICSE, IB & Coding.`,
    },
  };
}

export default async function LocalityPage({ params }: PageProps) {
  const loc = GURGAON_LOCALITIES.find((l) => l.slug === params.locality);
  if (!loc) notFound();

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
          avatarUrl: tp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          introVideoUrl: tp.introVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          videoDuration: '1m 20s',
          highestDegree: tp.highestDegree || 'M.Sc.',
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
  } catch (err) {
    console.warn('DB query in locality page fallback to baseline:', err);
  }

  // Schema.org Structured Data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    name: `TuitionForHome - Home Tutors in ${loc.name}, Gurgaon`,
    url: `https://tuitionforhome.com/home-tutors-in-gurgaon/${loc.slug}`,
    description: `Find verified home and online tutors in ${loc.name}, Gurgaon (${loc.landmark}).`,
    telephone: SSSAM_OFFICE_DETAILS.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.landmark,
      addressLocality: 'Gurugram',
      addressRegion: 'Haryana',
      postalCode: loc.pincode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SSSAM_OFFICE_DETAILS.geo.lat,
      longitude: SSSAM_OFFICE_DETAILS.geo.lng,
    },
    areaServed: loc.name,
    priceRange: '₹₹',
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
          text: `You can book a verified home tutor in ${loc.name} by requesting a 1-on-1 free demo class on TuitionForHome. Our academic counselors from SSSAM Academy will match the top tutor near ${loc.landmark} within 2 hours.`,
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
                  Serving residential communities around <strong>{loc.landmark}</strong>. Connect with {loc.activeTutorsCount}+ verified tutors for CBSE, ICSE, IB, and Cambridge boards with a <strong>1 Free Demo Class</strong>.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--color-slate-700)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>Tutors reside within 3–5 km radius of {loc.name} for punctual visits</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>Academic & police-checked background verified by SSSAM Academy</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--color-emerald-600)" />
                    <span>Free tutor replacement guarantee if you are not 100% satisfied</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <Link href="/" className="btn btn-primary btn-lg">
                    <span>Book Free Demo in {loc.name}</span>
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

                <form action="/book-demo" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <span>Schedule Demo in {loc.name}</span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-slate-600)' }}>
                          <Star size={12} color="var(--color-amber-500)" fill="var(--color-amber-500)" />
                          <strong>{tutor.rating}</strong> ({tutor.totalReviews} reviews)
                        </div>
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
                    <span>Book Demo Class</span>
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
                  Once you request a demo, our academic counselor connects you with the shortlisted tutor in {loc.name} within 2 hours. Your 1st free demo class can be scheduled for the very next day.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-slate-900)' }}>
                  What happens if my child is not satisfied with the demo?
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: 1.5 }}>
                  Under our 100% Satisfaction Guarantee, you pay nothing for an unsatisfied demo, and we will arrange a demo with a new top-tier tutor from SSSAM Academy at no extra charge.
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
