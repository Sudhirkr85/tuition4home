import {
  PSEO_LOCALITIES,
  PSEO_SUBJECTS,
  PSEO_GRADE_LEVELS,
  PSEOLocality,
  PSEOSubject,
  PSEOGradeLevel,
} from './pseo-data';
import { SSSAM_OFFICE_DETAILS } from './data';

export interface PSEOPagePayload {
  slug: string;
  metaTitle: string;
  metaDesc: string;
  canonicalUrl: string;
  h1: string;
  subheading: string;
  intro: string;
  pedagogyHighlight: string;
  curriculumTopics: string[];
  keyBooks: string[];
  examFocus: string[];
  topSchools: string[];
  locality: PSEOLocality;
  subject: PSEOSubject;
  gradeLevel?: PSEOGradeLevel;
  pricing: {
    hourlyRateHome: string;
    hourlyRateOnline: string;
    monthly2Days: string;
    monthly3Days: string;
    monthly5Days: string;
  };
  faqs: Array<{ question: string; answer: string }>;
  schemaJsonLd: {
    courseSchema: any;
    localBusinessSchema: any;
    faqSchema: any;
    breadcrumbSchema: any;
  };
}

/**
 * Normalizes and extracts Subject, Locality and Grade from any URL slug
 */
export function resolvePSEOSlug(slug: string): {
  locality: PSEOLocality;
  subject: PSEOSubject;
  gradeLevel?: PSEOGradeLevel;
} {
  const cleanSlug = slug.toLowerCase().replace(/-home-tutor-in-|-tutor-in-|-tuition-in-|-tutor-|-tuition-|-home-tutor-/g, '-');
  
  // Find locality match
  let matchedLocality = PSEO_LOCALITIES.find((l) => slug.includes(l.slug) || cleanSlug.includes(l.slug.replace('-gurgaon', '').replace('-delhi', '')));
  
  if (!matchedLocality) {
    // Check city keyword
    if (slug.includes('delhi')) {
      matchedLocality = PSEO_LOCALITIES.find((l) => l.city === 'Delhi') || PSEO_LOCALITIES[0];
    } else {
      matchedLocality = PSEO_LOCALITIES[0]; // Default DLF Phase 5 Gurgaon
    }
  }

  // Find subject match
  let matchedSubject = PSEO_SUBJECTS.find((s) => slug.includes(s.slug) || cleanSlug.includes(s.slug));
  if (!matchedSubject) {
    if (slug.includes('math')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'mathematics');
    else if (slug.includes('physic')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'physics');
    else if (slug.includes('chem')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'chemistry');
    else if (slug.includes('bio')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'biology');
    else if (slug.includes('account')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'accountancy');
    else if (slug.includes('eco')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'economics');
    else if (slug.includes('french')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'french-language');
    else if (slug.includes('german')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'german-language');
    else if (slug.includes('python') || slug.includes('coding') || slug.includes('computer')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'computer-science-python');
    else matchedSubject = PSEO_SUBJECTS[0]; // Default Mathematics
  }

  // Find grade level match (optional)
  const matchedGrade = PSEO_GRADE_LEVELS.find((g) => slug.includes(g.slug) || cleanSlug.includes(g.slug));

  return {
    locality: matchedLocality || PSEO_LOCALITIES[0],
    subject: matchedSubject || PSEO_SUBJECTS[0],
    gradeLevel: matchedGrade,
  };
}

/**
 * Calculates dynamic hyper-local pricing based on affluence tier and subject
 */
function calculatePseoPricing(locality: PSEOLocality, subject: PSEOSubject, gradeLevel?: PSEOGradeLevel) {
  let multiplier = 1.0;
  if (locality.affluenceTier === 'ULTRA_LUXURY') multiplier = 1.35;
  else if (locality.affluenceTier === 'PREMIUM') multiplier = 1.15;

  let baseRate = 850;
  if (gradeLevel) {
    baseRate = gradeLevel.baseHourlyRate;
  } else if (subject.category === 'STEM' && (subject.slug === 'physics' || subject.slug === 'chemistry')) {
    baseRate = 950;
  } else if (subject.slug === 'french-language' || subject.slug === 'german-language') {
    baseRate = 1000;
  }

  const finalMinHourly = Math.round((baseRate * multiplier * 0.9) / 50) * 50;
  const finalMaxHourly = Math.round((baseRate * multiplier * 1.3) / 50) * 50;

  const onlineMinHourly = Math.round((finalMinHourly * 0.75) / 50) * 50;
  const onlineMaxHourly = Math.round((finalMaxHourly * 0.75) / 50) * 50;

  const monthly2Days = `₹${(finalMinHourly * 8).toLocaleString('en-IN')} – ₹${(finalMaxHourly * 8).toLocaleString('en-IN')}`;
  const monthly3Days = `₹${(finalMinHourly * 12).toLocaleString('en-IN')} – ₹${(finalMaxHourly * 12).toLocaleString('en-IN')}`;
  const monthly5Days = `₹${(finalMinHourly * 20).toLocaleString('en-IN')} – ₹${(finalMaxHourly * 20).toLocaleString('en-IN')}`;

  return {
    hourlyRateHome: `₹${finalMinHourly} – ₹${finalMaxHourly}/hr`,
    hourlyRateOnline: `₹${onlineMinHourly} – ₹${onlineMaxHourly}/hr`,
    monthly2Days,
    monthly3Days,
    monthly5Days,
  };
}

/**
 * Master Programmatic SEO Content Generator
 * Generates 100% unique, anti-duplicate landing page payloads
 */
export function generatePSEOPagePayload(slug: string): PSEOPagePayload {
  const { locality, subject, gradeLevel } = resolvePSEOSlug(slug);
  const pricing = calculatePseoPricing(locality, subject, gradeLevel);
  const baseUrl = 'https://tuitionforhome.com';
  const canonicalUrl = `${baseUrl}/tuition/${slug}`;

  // Unique Dynamic Meta Title & Description
  const schoolMention = locality.topSchools.slice(0, 2).join(' & ');
  const gradeLabel = gradeLevel ? `${gradeLevel.name} ` : '';
  
  const metaTitle = `Best ${gradeLabel}${subject.name} Home Tutors in ${locality.name}, ${locality.city} | SSSAM Academy`;
  const metaDesc = `Hire verified 1-on-1 ${subject.name} home tutors in ${locality.name}, ${locality.city} (${locality.landmark}). Tailored mentoring for students of ${schoolMention}. 100% in-person verified & free demo class.`;

  // Unique H1 and Subheading
  const h1 = `Best ${subject.name} Home Tutors in ${locality.name}, ${locality.city}`;
  const subheading = `Verified In-Person 1-on-1 Educators for CBSE, ICSE, IB & Cambridge curricula across ${locality.name} (${locality.landmark}).`;

  // Engaging Anti-Duplicate Intro
  const intro = `${subject.name} mastery requires individualized attention, structured doubt-clearing sessions, and steady weekly exam preparation. Our certified educators in ${locality.name}, ${locality.city} provide customized 1-on-1 in-home mentoring tailored to the specific examination schedules of leading local institutions including ${locality.topSchools.join(', ')}. Backed by SSSAM Academy Sector 14, every educator is rigorously audited with verified credentials and classroom pedagogy.`;

  // Contextual Localized FAQs
  const faqs = [
    {
      question: `How quickly can a verified ${subject.name} home teacher start in ${locality.name}, ${locality.city}?`,
      answer: `Following your inquiry, SSSAM Academy academic counselors match a background-checked ${subject.name} educator within ${locality.averageTravelMin || 10}–15 minutes. A trial demo class can be scheduled at your residence in ${locality.name} within 24 to 48 hours.`,
    },
    {
      question: `Do your tutors teach according to the curriculum of schools near ${locality.name}?`,
      answer: `Yes, our teachers specialize in the exact syllabi and terminal exam question patterns followed by premier schools around ${locality.name}, including ${locality.topSchools.join(', ')}.`,
    },
    {
      question: `What are the typical home tuition charges for ${subject.name} in ${locality.name}?`,
      answer: `In ${locality.name} (${locality.city}), verified 1-on-1 home tuition rates range from ${pricing.hourlyRateHome} depending on the student's grade level, weekly frequency, and board (CBSE, ICSE, IB DP, or IGCSE).`,
    },
    {
      question: `What if my child is unsatisfied with the assigned tutor?`,
      answer: `TuitionForHome provides a 100% Free Replacement Guarantee backed by SSSAM Academy. If the student does not connect with the tutor's teaching pace, an alternate verified educator is arranged immediately at no extra matchmaking fee.`,
    },
    {
      question: `Are offline in-person classes also available at your Sector 14 center?`,
      answer: `Yes! Parents who prefer classroom coaching can also enroll their children directly at our SSSAM Academy Physical Learning Center located in Sector 14, Old DLF, Gurugram.`,
    },
  ];

  // Schema.org Structured Data
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${subject.name} Home Tuition in ${locality.name}, ${locality.city}`,
    description: metaDesc,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'TuitionForHome by SSSAM Academy',
      sameAs: 'https://tuitionforhome.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: SSSAM_OFFICE_DETAILS.address,
        addressLocality: locality.city,
        addressRegion: locality.state,
        addressCountry: 'IN',
      },
    },
    offers: {
      '@type': 'Offer',
      category: '1-on-1 Academic Tutoring',
      priceCurrency: 'INR',
      price: pricing.hourlyRateHome.split('–')[0].replace('₹', '').trim(),
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: `TuitionForHome - ${locality.name} Academic Tutoring Desk`,
    url: canonicalUrl,
    telephone: SSSAM_OFFICE_DETAILS.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${locality.name}, ${locality.landmark}`,
      addressLocality: locality.city,
      addressRegion: locality.state,
      postalCode: locality.pincode || '122001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: locality.lat,
      longitude: locality.lng,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${locality.name}, ${locality.city}`,
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
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
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${locality.city} Localities`,
        item: `${baseUrl}/home-tutors-in-gurgaon`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locality.name,
        item: `${baseUrl}/home-tutors-in-gurgaon/${locality.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${subject.name} Tutors`,
        item: canonicalUrl,
      },
    ],
  };

  return {
    slug,
    metaTitle,
    metaDesc,
    canonicalUrl,
    h1,
    subheading,
    intro,
    pedagogyHighlight: subject.pedagogyFocus,
    curriculumTopics: subject.curriculumTopics,
    keyBooks: subject.keyBooks,
    examFocus: subject.examFocus,
    topSchools: locality.topSchools,
    locality,
    subject,
    gradeLevel,
    pricing,
    faqs,
    schemaJsonLd: {
      courseSchema,
      localBusinessSchema,
      faqSchema,
      breadcrumbSchema,
    },
  };
}

/**
 * Generates all Programmatic Slugs for Gurgaon & Delhi matrix (12,000+ paths)
 */
export function getAllPSEOSlugs(): string[] {
  const slugs: string[] = [];

  for (const locality of PSEO_LOCALITIES) {
    for (const subject of PSEO_SUBJECTS) {
      // 1. Subject in Locality pattern (e.g. maths-home-tutor-in-dlf-phase-5-gurgaon)
      slugs.push(`${subject.slug}-home-tutor-in-${locality.slug}`);
      
      // 2. Class-specific patterns for top STEM subjects
      if (subject.slug === 'mathematics' || subject.slug === 'physics' || subject.slug === 'chemistry') {
        slugs.push(`class-10-cbse-${subject.slug}-tutor-in-${locality.slug}`);
        slugs.push(`class-12-${subject.slug}-tutor-in-${locality.slug}`);
      }
    }
  }

  return slugs;
}
