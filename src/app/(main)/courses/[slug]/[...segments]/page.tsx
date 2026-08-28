import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getLocationBySlug,
  getTopLocations,
  getNearbyLocations,
  SEO_LOCATIONS,
} from '@/data/seo-locations';
import {
  getTopicBySlug,
  getTopTopics,
  getRelatedTopics,
  SEO_TOPICS,
} from '@/data/seo-topics';
import {
  getModifierBySlug,
  getTopModifiers,
  SEO_MODIFIERS,
} from '@/data/seo-modifiers';
import CourseFaqAccordion, { FAQItem } from '@/components/CourseFaqAccordion';
import CourseLeadCTA from '@/components/CourseLeadCTA';
import {
  ShieldCheck,
  Star,
  Award,
  BookOpen,
  CheckCircle2,
  MapPin,
  Clock,
  GraduationCap,
  Users,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Building2,
  Calendar,
  Check,
} from 'lucide-react';

// =========================================================================
// CRITICAL VERCEL & PERFORMANCE CONFIGURATION
// =========================================================================
export const dynamicParams = true; // Enables instant on-demand ISR for 100,000+ long-tail combinations
export const revalidate = 604800; // 7 days (604,800s) Edge CDN cache: 0 Serverless invocations on repeat visits

interface RouteParams {
  slug: string;
  segments: string[];
}

interface ParsedPageData {
  location: ReturnType<typeof getLocationBySlug> & object;
  topic: ReturnType<typeof getTopicBySlug> & object;
  modifier?: ReturnType<typeof getModifierBySlug>;
}

// O(1) in-memory route resolver
function parseRouteParams(params: RouteParams): ParsedPageData | null {
  const citySlug = params.slug;
  const segments = params.segments || [];

  const location = getLocationBySlug(citySlug);
  if (!location) return null;

  if (segments.length === 1) {
    const topic = getTopicBySlug(segments[0]);
    if (!topic) return null;
    return { location, topic, modifier: undefined };
  }

  if (segments.length === 2) {
    const modifier = getModifierBySlug(segments[0]);
    const topic = getTopicBySlug(segments[1]);
    if (!modifier || !topic) return null;
    return { location, topic, modifier };
  }

  return null;
}

// =========================================================================
// PRE-RENDER ONLY TOP SUBSET AT BUILD TIME (<20s build, 0 ENOSPC risk)
// =========================================================================
export async function generateStaticParams(): Promise<RouteParams[]> {
  const topCities = getTopLocations().slice(0, 10);
  const topTopics = getTopTopics().slice(0, 5);
  const topModifiers = getTopModifiers().slice(0, 3);

  const staticParams: RouteParams[] = [];

  // 1. Top 2-Segment combinations (city + topic) -> 50 pages
  topCities.forEach((loc) => {
    topTopics.forEach((top) => {
      staticParams.push({
        slug: loc.city,
        segments: [top.topic],
      });
    });
  });

  // 2. High-volume 3-Segment combinations (top 5 cities × top 3 modifiers × top 3 topics) -> 45 pages
  topCities.slice(0, 5).forEach((loc) => {
    topModifiers.forEach((mod) => {
      topTopics.slice(0, 3).forEach((top) => {
        staticParams.push({
          slug: loc.city,
          segments: [mod.modifier, top.topic],
        });
      });
    });
  });

  return staticParams;
}

// =========================================================================
// DYNAMIC SEO METADATA GENERATOR
// =========================================================================
export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const resolved = parseRouteParams(params);
  if (!resolved) {
    return {
      title: 'Course Not Found | TuitionForHome',
      robots: { index: false, follow: false },
    };
  }

  const { location, topic, modifier } = resolved;
  const baseUrl = 'https://tuitionforhome.com';

  const canonicalPath = modifier
    ? `/courses/${location.city}/${modifier.modifier}/${topic.topic}`
    : `/courses/${location.city}/${topic.topic}`;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const metaTitle = modifier
    ? `${modifier.label} ${topic.label} in ${location.label} | TuitionForHome`
    : `${topic.label} Classes & Home Tutors in ${location.label} | TuitionForHome`;

  const metaDescription = modifier
    ? `${modifier.descriptionPrefix} Top verified 1-on-1 ${topic.label} tutors in ${location.label}. Audited by SSSAM Academy. 1-on-1 free demo class & free replacement guarantee. Fees starting ${topic.price}.`
    : `Find verified home & online ${topic.label} tutors in ${location.label}. Top 1% educators audited by SSSAM Academy. Free 1-on-1 trial class, custom syllabus & 100% replacement guarantee. Fees: ${topic.price}.`;

  const dynamicKeywords = [
    ...topic.keywords.map((kw) => `${kw} in ${location.label}`),
    `${topic.label.toLowerCase()} tutor in ${location.city}`,
    `${topic.label.toLowerCase()} home tuition ${location.state}`,
    `${modifier ? modifier.label.toLowerCase() + ' ' : ''}${topic.label.toLowerCase()} classes ${location.label}`,
    'SSSAM Academy home tutors',
    'tuitionforhome verified teachers',
  ];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: dynamicKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'TuitionForHome',
      type: 'website',
      locale: 'en_IN',
      images: [
        {
          url: 'https://sssamacademy.com/assets/home_page.webp',
          width: 1200,
          height: 630,
          alt: `${topic.label} in ${location.label}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: ['https://sssamacademy.com/assets/home_page.webp'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

// =========================================================================
// MAIN PROGRAMMATIC LANDING PAGE COMPONENT (SERVER RENDERED)
// =========================================================================
export default function ProgrammaticCoursePage({
  params,
}: {
  params: RouteParams;
}) {
  const resolved = parseRouteParams(params);
  if (!resolved) {
    notFound();
  }

  const { location, topic, modifier } = resolved;
  const baseUrl = 'https://tuitionforhome.com';

  const pageTitle = modifier
    ? `${modifier.label} ${topic.label} Classes in ${location.label}`
    : `${topic.label} Tutors & Home Tuition in ${location.label}`;

  const currentPath = modifier
    ? `/courses/${location.city}/${modifier.modifier}/${topic.topic}`
    : `/courses/${location.city}/${topic.topic}`;

  // Generate dynamic FAQs tailored to this exact entity pair
  const pageFaqs: FAQItem[] = [
    {
      question: `How does TuitionForHome screen and verify ${topic.label} tutors in ${location.label}?`,
      answer: `Every ${topic.label} educator in ${location.label} undergoes a strict 3-tier auditing pipeline administered by SSSAM Academy: government Aadhaar KYC identity verification, degree authentication, and an in-person pedagogical audition evaluating concept explanation and student engagement.`,
    },
    {
      question: `What is the fee structure for ${topic.label} private tuition in ${location.label}?`,
      answer: `Hourly rates for ${topic.label} in ${location.label} typically start from ${topic.price}, depending on the student's grade level (Class 1-12, Board exams, or competitive entrance), lesson frequency, and mode (in-home offline vs. interactive online).`,
    },
    {
      question: `Can I schedule a 1-on-1 trial demo class before committing?`,
      answer: `Yes! We provide a 100% Free 1-on-1 Trial Class for all students in ${location.label}. This allows the student and parent to evaluate the tutor's teaching methodology, communication, and chemistry before confirming regular schedules.`,
    },
    {
      question: `What happens if my child needs a tutor change in ${location.label}?`,
      answer: `TuitionForHome offers a 100% Free Tutor Replacement Guarantee. If the educator does not meet your learning expectations, our senior counseling team will assign a new vetted specialist within 24 hours at ₹0 extra fee.`,
    },
    {
      question: `Which school curricula and boards are supported for ${topic.label}?`,
      answer: `Our ${topic.label} educators in ${location.label} cover CBSE, ICSE / ISC, IB DP / MYP, Cambridge IGCSE / A-Levels, State Boards, as well as competitive entrance exam foundations (JEE, NEET, Olympiads).`,
    },
    {
      question: `How fast can classes begin in ${location.label}?`,
      answer: `Once you submit your trial request, our counseling team matches your requirement with top educators living within 3 to 5 km in ${location.label}. In most cases, trial classes are scheduled within 24 to 48 hours.`,
    },
  ];

  // Dynamic Internal Linking Graphs
  const nearbyLocations = getNearbyLocations(location.city, 8);
  const relatedTopics = getRelatedTopics(topic.topic, 8);
  const allModifiers = SEO_MODIFIERS;

  // Schema.org Structured Data
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: pageTitle,
    description: topic.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'TuitionForHome — SSSAM Academy',
      sameAs: baseUrl,
      url: baseUrl,
    },
    offers: {
      '@type': 'Offer',
      category: 'Paid',
      priceCurrency: 'INR',
      price: topic.price.replace(/\D/g, '').slice(0, 4) || '600',
      availability: 'https://schema.org/InStock',
      validFrom: '2024-01-01',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: modifier?.modifier === 'online' ? 'Online' : 'Blended',
      location: location.label,
      courseWorkload: topic.duration,
    },
    educationalLevel: topic.level,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Courses & Tuition',
        item: `${baseUrl}/tuition`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${topic.label} in ${location.label}`,
        item: `${baseUrl}/courses/${location.city}/${topic.topic}`,
      },
      ...(modifier
        ? [
            {
              '@type': 'ListItem',
              position: 4,
              name: `${modifier.label} ${topic.label}`,
              item: `${baseUrl}${currentPath}`,
            },
          ]
        : []),
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EducationalOrganization'],
    name: `TuitionForHome ${location.label} — SSSAM Academy`,
    url: `${baseUrl}${currentPath}`,
    telephone: '+919217031899',
    email: 'info@sssamacademy.com',
    priceRange: '₹₹ - ₹₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.label,
      addressRegion: location.state,
      addressCountry: 'IN',
      ...(location.pincode ? { postalCode: location.pincode } : {}),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.95',
      reviewCount: '520',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      {/* Schema.org Structured Data Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', color: '#0F172A' }}>
        {/* =========================================================================
            BREADCRUMBS BAR
            ========================================================================= */}
        <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.85rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748B', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: '#64748B', textDecoration: 'none' }} className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/tuition" style={{ color: '#64748B', textDecoration: 'none' }} className="hover:text-blue-600">
              Tuition
            </Link>
            <ChevronRight size={14} />
            <Link href={`/courses/${location.city}/${topic.topic}`} style={{ color: modifier ? '#64748B' : '#0F172A', fontWeight: modifier ? 400 : 600, textDecoration: 'none' }}>
              {topic.label} ({location.label})
            </Link>
            {modifier && (
              <>
                <ChevronRight size={14} />
                <span style={{ color: '#0F172A', fontWeight: 600 }}>{modifier.label}</span>
              </>
            )}
          </div>
        </div>

        {/* =========================================================================
            HERO SECTION WITH CONVERSION CARD
            ========================================================================= */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '3.5rem 0', borderBottom: '1px solid #E2E8F0' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              {/* Left Column: Value Proposition */}
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid #DBEAFE' }}>
                  <Sparkles size={16} />
                  <span>{modifier ? modifier.badge : 'Verified 1-on-1 Faculty'}</span>
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, color: '#0F172A', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                  {pageTitle}
                </h1>

                <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {modifier?.descriptionPrefix ? `${modifier.descriptionPrefix} ` : ''}
                  {topic.description} Connect with top 1% verified home and online educators in{' '}
                  <strong>{location.label}</strong> with tailored lesson plans and transparent pricing.
                </p>

                {/* Trust Metrics Pill Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#F59E0B', fontWeight: 700, fontSize: '1.2rem' }}>
                      <Star size={18} fill="#F59E0B" /> 4.95 / 5
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>520+ Parent Reviews</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563EB', fontWeight: 700, fontSize: '1.2rem' }}>
                      <Clock size={18} /> &lt;24 Hours
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>Rapid Tutor Matching</div>
                  </div>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700, fontSize: '1.2rem' }}>
                      <ShieldCheck size={18} /> 100% KYC
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>SSSAM Audited Faculty</div>
                  </div>
                </div>

                {/* Highlights List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} color="#2563EB" />
                    <span><strong>Free 1-on-1 Demo Session</strong> before confirming any schedule</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} color="#2563EB" />
                    <span><strong>100% Free Tutor Replacement</strong> guarantee if satisfaction drops</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155', fontSize: '0.95rem' }}>
                    <CheckCircle2 size={18} color="#2563EB" />
                    <span><strong>Transparent Fee Structure</strong> starting at {topic.price}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Form Card */}
              <div>
                <CourseLeadCTA
                  topicLabel={topic.label}
                  locationLabel={location.label}
                  modifierBadge={modifier?.badge}
                  ctaText={modifier?.ctaText}
                  price={topic.price}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            CURRICULUM HIGHLIGHTS & WHAT STUDENTS LEARN
            ========================================================================= */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                {topic.label} Curriculum & Learning Roadmap
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Structured syllabus mastery designed specifically for students in <strong>{location.label}</strong>, targeting top school exam scores and conceptual clarity.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {topic.curriculumHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '1.75rem',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: '#EFF6FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563EB',
                      fontWeight: 700,
                      marginBottom: '1rem',
                    }}
                  >
                    0{idx + 1}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Module {idx + 1}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            TRANSPARENT PRICING & STUDY PLANS
            ========================================================================= */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '4rem 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                <TrendingUp size={15} />
                <span>Zero Hidden Brokerage Fees</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                Affordable & Flexible Tutoring Packages
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
                Customized for your child&apos;s frequency, target board, and academic milestones in {location.label}.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {/* Plan 1: Regular Tuition */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '2.25rem', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Foundation & Support
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Ideal for weekly homework help, fundamental concepts, and regular school tests.
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                    {topic.price}
                    <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#64748B' }}> / hour</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> 2-3 Classes per week (1 hr each)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> School Syllabus & NCERT Coverage
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> Monthly Parent Progress Report
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> 100% Free Tutor Replacement
                    </div>
                  </div>
                </div>

                <Link
                  href={`/request-tutor?subject=${encodeURIComponent(topic.label)}&locality=${encodeURIComponent(location.label)}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 600,
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    textDecoration: 'none',
                  }}
                  className="hover:bg-slate-100"
                >
                  Choose Foundation Plan
                </Link>
              </div>

              {/* Plan 2: Intensive Board / Exam Prep (Featured) */}
              <div style={{ backgroundColor: '#1E293B', color: '#FFFFFF', padding: '2.25rem', borderRadius: '24px', border: '2px solid #3B82F6', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)' }}>
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '0.25rem 0.9rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  MOST POPULAR
                </div>

                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                    Target 95%+ Board & Exam Prep
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Rigorous problem-solving, past 10 years papers, and speed strategies for {topic.label}.
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38BDF8', marginBottom: '1.5rem' }}>
                    {topic.price}
                    <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#94A3B8' }}> / hour</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <Check size={16} color="#38BDF8" /> 3-4 Sessions per week (1.5 hrs each)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <Check size={16} color="#38BDF8" /> Weekly Timed Mock Exam Papers
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#E2E8F0' }}>
                      <Check size={16} color="#38BDF8" /> Dedicated WhatsApp Doubt Support
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#38BDF8' }}>
                      <Check size={16} color="#38BDF8" /> Senior SSSAM Faculty Oversight
                    </div>
                  </div>
                </div>

                <Link
                  href={`/request-tutor?subject=${encodeURIComponent(topic.label)}&locality=${encodeURIComponent(location.label)}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.85rem',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    borderRadius: '14px',
                    textDecoration: 'none',
                  }}
                  className="hover:bg-blue-700"
                >
                  Book Free Trial for Exam Prep
                </Link>
              </div>

              {/* Plan 3: Masterclass / IB / Competitive */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '2.25rem', borderRadius: '24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    IB / Olympiad / IIT-JEE
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Elite educators specializing in IB DP HL/SL, Cambridge A-Levels, and JEE/NEET.
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                    Custom Quote
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> Specialized High-Tier Curriculum
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> Internal Assessment (IA) & Past Papers
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> Ex-IB / IITian Mentorship
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: '#334155' }}>
                      <Check size={16} color="#2563EB" /> Flexible Online & Offline Options
                    </div>
                  </div>
                </div>

                <Link
                  href={`/request-tutor?subject=${encodeURIComponent(topic.label)}&locality=${encodeURIComponent(location.label)}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 600,
                    borderRadius: '14px',
                    border: '1px solid #CBD5E1',
                    textDecoration: 'none',
                  }}
                  className="hover:bg-slate-100"
                >
                  Consult Senior Counselor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SSSAM ACADEMY 3-STAGE TUTOR AUDIT PIPELINE
            ========================================================================= */}
        <section style={{ padding: '4rem 0' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                Why Parents in {location.label} Trust TuitionForHome
              </h2>
              <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
                Only the top 1% of applicant educators pass our rigorous verification standards operated by SSSAM Academy.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <ShieldCheck size={36} color="#2563EB" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  1. Aadhaar KYC & Background Check
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Strict identity authentication, address verification, and background vetting ensure safety for home visits.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <GraduationCap size={36} color="#2563EB" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  2. Degree & Academic Audit
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Verification of university degrees, past teaching experience, and subject-matter expertise across boards.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <Award size={36} color="#2563EB" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  3. Live Teaching Audition
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Our academic council tests teaching pedagogy, communication clarity, patience, and doubt-handling skills.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <Users size={36} color="#2563EB" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  4. Free Trial & Ongoing Support
                </h3>
                <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Parents get a risk-free 1-on-1 trial class plus continuous progress tracking from dedicated counselors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION + SCHEMA)
            ========================================================================= */}
        <section style={{ backgroundColor: '#FFFFFF', padding: '4rem 0', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
          <div className="container" style={{ maxWidth: '840px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                <HelpCircle size={15} />
                <span>Got Questions?</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                Frequently Asked Questions about {topic.label} in {location.label}
              </h2>
              <p style={{ color: '#64748B', fontSize: '1rem' }}>
                Everything you need to know about booking, pricing, tutor background checks, and trial classes.
              </p>
            </div>

            <CourseFaqAccordion
              faqs={pageFaqs}
              topicLabel={topic.label}
              locationLabel={location.label}
            />
          </div>
        </section>

        {/* =========================================================================
            PROGRAMMATIC INTERNAL LINKING SPIDERING NETWORK
            ========================================================================= */}
        <section style={{ padding: '4rem 0', backgroundColor: '#F1F5F9' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0F172A', marginBottom: '2rem', textAlign: 'center' }}>
              Explore More Tutoring Options in {location.label} & NCR
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Cluster 1: Intent / Modifiers in this City */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#2563EB" />
                  Browse by Learning Mode
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {allModifiers.map((mod) => (
                    <li key={mod.modifier}>
                      <Link
                        href={`/courses/${location.city}/${mod.modifier}/${topic.topic}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: modifier?.modifier === mod.modifier ? '#2563EB' : '#475569',
                          fontWeight: modifier?.modifier === mod.modifier ? 700 : 500,
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                        }}
                        className="hover:text-blue-600"
                      >
                        <span>{mod.label} {topic.label} in {location.label}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cluster 2: Other Topics in this City */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={18} color="#2563EB" />
                  Other Subjects in {location.label}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {relatedTopics.map((relTopic) => (
                    <li key={relTopic.topic}>
                      <Link
                        href={`/courses/${location.city}/${relTopic.topic}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: '#475569',
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                        }}
                        className="hover:text-blue-600"
                      >
                        <span>{relTopic.label} in {location.label}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cluster 3: Same Topic in Nearby Localities & Cities */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} color="#2563EB" />
                  {topic.label} in Nearby Areas
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {nearbyLocations.map((nearLoc) => (
                    <li key={nearLoc.city}>
                      <Link
                        href={`/courses/${nearLoc.city}/${modifier ? modifier.modifier + '/' : ''}${topic.topic}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: '#475569',
                          fontSize: '0.92rem',
                          textDecoration: 'none',
                        }}
                        className="hover:text-blue-600"
                      >
                        <span>{topic.label} in {nearLoc.label}</span>
                        <ChevronRight size={14} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Popular Localities Quick Pills */}
            {location.popularLocalities && location.popularLocalities.length > 0 && (
              <div style={{ marginTop: '2.5rem', backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748B', marginBottom: '0.75rem' }}>
                  Serving All Prominent Neighborhoods in {location.label}:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {location.popularLocalities.map((locName, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      📍 {locName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CONVERSION BANNER
            ========================================================================= */}
        <section style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '4.5rem 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '720px' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.3 }}>
              Ready to Accelerate Your Child&apos;s Academic Success?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Book a 1-on-1 trial class with a verified <strong>{topic.label}</strong> educator in <strong>{location.label}</strong> today. 100% free with zero registration fees.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href={`/request-tutor?subject=${encodeURIComponent(topic.label)}&locality=${encodeURIComponent(location.label)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  padding: '0.9rem 2rem',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                }}
                className="hover:bg-blue-700"
              >
                Book 1-on-1 Free Trial Class <ArrowRight size={18} />
              </Link>
              <a
                href="tel:+919217031899"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '0.9rem 1.75rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                📞 Call +91 92170 31899
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
