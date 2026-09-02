import {
  PSEO_LOCALITIES,
  PSEO_SUBJECTS,
  PSEO_INTENT_TRACKS,
  PSEOLocality,
  PSEOSubject,
  PSEOIntentTrack,
} from './pseo-data';
import { SSSAM_OFFICE_DETAILS } from './data';
import { SUBJECT_SEO_PAGES } from './seo-data';

export interface PSEOPagePayload {
  slug: string;
  metaTitle: string;
  metaDesc: string;
  canonicalUrl: string;
  h1: string;
  subheading: string;
  badgeLabel: string;
  intro: string;
  pedagogyHighlight: string;
  curriculumTopics: string[];
  keyBooks: string[];
  examFocus: string[];
  topSchools: string[];
  locality: PSEOLocality;
  subject: PSEOSubject;
  intentTrack: PSEOIntentTrack;
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
 * Resolves Locality, Subject and Intent Track from any URL slug
 * Returns null if no valid subject or locality match is found (prevents soft-404 traps)
 */
export function resolvePSEOSlug(slug: string): {
  locality: PSEOLocality;
  subject: PSEOSubject;
  intentTrack: PSEOIntentTrack;
} | null {
  if (!slug || typeof slug !== 'string') return null;
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Check direct Legacy Subject Pages match
  const legacyMatch = SUBJECT_SEO_PAGES.find((s) => s.slug === cleanSlug);
  if (legacyMatch) {
    const sortedSubjects = [...PSEO_SUBJECTS].sort((a, b) => b.slug.length - a.slug.length);
    const sub = sortedSubjects.find((s) => cleanSlug.includes(s.slug)) || PSEO_SUBJECTS[0];
    return {
      locality: PSEO_LOCALITIES[0],
      subject: sub,
      intentTrack: PSEO_INTENT_TRACKS[0],
    };
  }

  // 2. Resolve Intent Track
  let matchedIntent = PSEO_INTENT_TRACKS.find(
    (t) => t.prefix !== '' && cleanSlug.startsWith(t.prefix)
  );
  if (!matchedIntent) {
    matchedIntent = PSEO_INTENT_TRACKS[0]; // General
  }

  // 3. Resolve Subject Match (Must strictly match a real subject)
  const sortedSubjects = [...PSEO_SUBJECTS].sort((a, b) => b.slug.length - a.slug.length);
  let matchedSubject = sortedSubjects.find((s) => cleanSlug.includes(s.slug));

  if (!matchedSubject) {
    if (cleanSlug.includes('python') || cleanSlug.includes('coding') || cleanSlug.includes('computer')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'computer-science-python');
    else if (cleanSlug.includes('math')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'mathematics');
    else if (cleanSlug.includes('physic')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'physics');
    else if (cleanSlug.includes('chem')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'chemistry');
    else if (cleanSlug.includes('bio')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'biology');
    else if (cleanSlug.includes('account')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'accountancy');
    else if (cleanSlug.includes('eco')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'economics');
    else if (cleanSlug.includes('french')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'french-language');
    else if (cleanSlug.includes('german')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'german-language');
    else if (cleanSlug.includes('science')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'science-foundation');
    else if (cleanSlug.includes('english')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'english-literature');
    else if (cleanSlug.includes('hindi')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'hindi-language');
    else if (cleanSlug.includes('social-science')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'social-studies');
    else if (cleanSlug.includes('business')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'business-studies');
  }

  // If no subject keyword matched at all, it is an invalid route -> return null (trigger 404)
  if (!matchedSubject) {
    return null;
  }

  // 4. Resolve Locality Match
  const sortedLocalities = [...PSEO_LOCALITIES].sort((a, b) => b.slug.length - a.slug.length);
  let matchedLocality = sortedLocalities.find((l) => cleanSlug.includes(l.slug));

  if (!matchedLocality) {
    matchedLocality = sortedLocalities.find((l) => {
      const stripped = l.slug.replace('-gurgaon', '').replace('-delhi', '').replace('-noida', '');
      return cleanSlug.includes(stripped);
    });
  }

  // If the slug contains '-in-' or '-near-' specifying a locality but no known locality was found, reject it
  if (!matchedLocality && (cleanSlug.includes('-in-') || cleanSlug.includes('-near-'))) {
    return null;
  }

  // If no specific locality is in the slug (general subject query), default to primary hub (DLF Phase 5, Gurgaon)
  if (!matchedLocality) {
    matchedLocality = PSEO_LOCALITIES[0];
  }

  return {
    locality: matchedLocality,
    subject: matchedSubject,
    intentTrack: matchedIntent,
  };
}

/**
 * Calculates dynamic hyper-local pricing based on affluence tier and subject
 */
function calculatePseoPricing(locality: PSEOLocality, subject: PSEOSubject, intentTrack: PSEOIntentTrack) {
  let multiplier = 1.0;
  if (locality.affluenceTier === 'ULTRA_LUXURY') multiplier = 1.15;
  else if (locality.affluenceTier === 'PREMIUM') multiplier = 1.05;

  let baseRate = 450;
  if (intentTrack.slug === 'ib-board' || intentTrack.slug === 'igcse-cambridge') {
    baseRate = 750;
  } else if (intentTrack.slug === 'neet-prep' || intentTrack.slug === 'jee-main') {
    baseRate = 650;
  } else if (intentTrack.slug === 'class-12-cbse' || intentTrack.slug === 'class-11-cbse') {
    baseRate = 550;
  } else if (subject.slug === 'french-language' || subject.slug === 'german-language') {
    baseRate = 500;
  }

  const finalMinHourly = Math.round((baseRate * multiplier * 0.9) / 50) * 50;
  const finalMaxHourly = Math.round((baseRate * multiplier * 1.25) / 50) * 50;

  const onlineMinHourly = Math.round((finalMinHourly * 0.7) / 50) * 50;
  const onlineMaxHourly = Math.round((finalMaxHourly * 0.7) / 50) * 50;

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
export function generatePSEOPagePayload(slug: string): PSEOPagePayload | null {
  const resolved = resolvePSEOSlug(slug);
  if (!resolved) {
    return null;
  }

  const { locality, subject, intentTrack } = resolved;
  const pricing = calculatePseoPricing(locality, subject, intentTrack);
  const baseUrl = 'https://sssamacademy.tech';
  const canonicalUrl = `${baseUrl}/tuition/${slug}`;

  // Unique Dynamic Meta Title & Description
  const schoolMention = locality.topSchools.slice(0, 2).join(' & ');
  const trackTitle = intentTrack.titleSuffix;

  const metaTitle = `Best ${subject.name} ${trackTitle} in ${locality.name}, ${locality.city} | SSSAM Academy`;
  const metaDesc = `Hire verified 1-on-1 ${subject.name} ${trackTitle.toLowerCase()} in ${locality.name}, ${locality.city} (${locality.landmark}). ${intentTrack.descriptionSnippet} Aligned with ${schoolMention}. Free demo class.`;

  // Unique H1 and Subheading
  const h1 = `Best ${subject.name} ${trackTitle} in ${locality.name}, ${locality.city}`;
  const subheading = `Certified 1-on-1 In-Home Mentors across ${locality.name} (${locality.landmark}). ${intentTrack.specialHighlight}`;

  // Engaging Anti-Duplicate Intro tailored to Intent Track
  let intro = `${subject.name} mentoring requires individualized pace, conceptual problem solving, and steady weekly exam preparation. Our certified educators in ${locality.name}, ${locality.city} deliver customized 1-on-1 in-home coaching tailored to the rigorous academic benchmarks of premier schools in the vicinity including ${locality.topSchools.join(', ')}. Backed by SSSAM Academy Sector 14, each teacher undergoes multi-step in-person auditing and background checks.`;

  if (intentTrack.slug === 'female-tutor') {
    intro = `Looking for trusted lady home tutors for your child in ${locality.name}? Our verified female ${subject.name} educators in ${locality.name}, ${locality.city} provide compassionate, safe, and academically rigorous 1-on-1 mentoring. Aligned with curricula of institutions such as ${locality.topSchools.join(', ')}, each female tutor is background-checked and audited in person by SSSAM Academy.`;
  } else if (intentTrack.slug === 'ib-board') {
    intro = `Mastering ${subject.name} under the International Baccalaureate (IB MYP & DP) requires analytical depth, inquiry-based learning, and mastery of Internal Assessments (IAs). Our IB-certified home educators in ${locality.name} specialize in criterion-based rubrics for students of top international institutions including ${locality.topSchools.join(', ')}.`;
  } else if (intentTrack.slug === 'neet-prep' || intentTrack.slug === 'jee-main') {
    intro = `Cracking competitive entrance exams in ${subject.name} demands conceptual speed, high-frequency numerical practice, and error-elimination strategies. Our entrance faculty in ${locality.name}, ${locality.city} provides personalized 1-on-1 coaching focusing on previous 15-year papers and high-yield question formats.`;
  }

/**
 * Computes a realistic counselor matching time window with a meaningful spread.
 * Ensures the lower bound is always strictly less than the upper bound.
 */
function calculateMatchingTimeRange(averageTravelMin?: number): string {
  const travel = averageTravelMin || 8;
  const minMinutes = travel <= 7 ? 5 : travel <= 11 ? 10 : 15;
  const maxMinutes = minMinutes === 5 ? 15 : minMinutes === 10 ? 25 : 30;
  return `${minMinutes}–${maxMinutes} minutes`;
}

// Contextual Localized FAQs tailored to Intent & Locality
  const matchingTimeWindow = calculateMatchingTimeRange(locality.averageTravelMin);
  const faqs = [
    {
      question: `How quickly can a verified ${subject.name} teacher start in ${locality.name}, ${locality.city}?`,
      answer: `Following your request, SSSAM Academy academic counselors match a background-checked ${subject.name} educator within ${matchingTimeWindow}. A trial demo class can be scheduled at your residence in ${locality.name} within 24 to 48 hours.`,
    },
    {
      question: `Do your tutors follow the exact exam pattern of schools in ${locality.name}?`,
      answer: `Yes, our teachers specialize in the syllabi, assignment standards, and terminal exam question formats followed by leading schools around ${locality.name}, including ${locality.topSchools.join(', ')}.`,
    },
    {
      question: `What are the typical home tuition charges for ${subject.name} in ${locality.name}?`,
      answer: `In ${locality.name} (${locality.city}), verified 1-on-1 home tuition rates range from ${pricing.hourlyRateHome} depending on class level, frequency (2 to 5 days/week), and board (${locality.popularBoard}).`,
    },
    {
      question: `What if my child does not connect with the assigned tutor?`,
      answer: `TuitionForHome provides a 100% Free Replacement Guarantee backed by SSSAM Academy. If the student does not connect with the tutor's teaching pace, an alternate verified educator is arranged immediately at no extra charge.`,
    },
    {
      question: `Can students also visit your physical center for offline coaching?`,
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
      sameAs: 'https://sssamacademy.tech',
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
    badgeLabel: intentTrack.badgeLabel,
    intro,
    pedagogyHighlight: subject.pedagogyFocus,
    curriculumTopics: subject.curriculumTopics,
    keyBooks: subject.keyBooks,
    examFocus: subject.examFocus,
    topSchools: locality.topSchools,
    locality,
    subject,
    intentTrack,
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
