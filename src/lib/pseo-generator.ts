import {
  PSEO_LOCALITIES,
  PSEO_SUBJECTS,
  PSEO_INTENT_TRACKS,
  PSEOLocality,
  PSEOSubject,
  PSEOIntentTrack,
} from './pseo-data';
import { SSSAM_OFFICE_DETAILS } from './data';

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
 */
export function resolvePSEOSlug(slug: string): {
  locality: PSEOLocality;
  subject: PSEOSubject;
  intentTrack: PSEOIntentTrack;
} {
  const cleanSlug = slug.toLowerCase();

  // 1. Resolve Intent Track
  let matchedIntent = PSEO_INTENT_TRACKS.find(
    (t) => t.prefix !== '' && cleanSlug.startsWith(t.prefix)
  );
  if (!matchedIntent) {
    matchedIntent = PSEO_INTENT_TRACKS[0]; // General
  }

  // 2. Resolve Locality Match
  let matchedLocality = PSEO_LOCALITIES.find(
    (l) => cleanSlug.includes(l.slug) || cleanSlug.includes(l.slug.replace('-gurgaon', '').replace('-delhi', '').replace('-noida', ''))
  );

  if (!matchedLocality) {
    if (cleanSlug.includes('noida')) {
      matchedLocality = PSEO_LOCALITIES.find((l) => l.city === 'Noida') || PSEO_LOCALITIES[0];
    } else if (cleanSlug.includes('delhi')) {
      matchedLocality = PSEO_LOCALITIES.find((l) => l.city === 'Delhi') || PSEO_LOCALITIES[0];
    } else {
      matchedLocality = PSEO_LOCALITIES[0]; // DLF Phase 5
    }
  }

  // 3. Resolve Subject Match
  let matchedSubject = PSEO_SUBJECTS.find((s) => cleanSlug.includes(s.slug));
  if (!matchedSubject) {
    if (cleanSlug.includes('math')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'mathematics');
    else if (cleanSlug.includes('physic')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'physics');
    else if (cleanSlug.includes('chem')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'chemistry');
    else if (cleanSlug.includes('bio')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'biology');
    else if (cleanSlug.includes('account')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'accountancy');
    else if (cleanSlug.includes('eco')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'economics');
    else if (cleanSlug.includes('french')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'french-language');
    else if (cleanSlug.includes('german')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'german-language');
    else if (cleanSlug.includes('python') || cleanSlug.includes('coding') || cleanSlug.includes('computer')) matchedSubject = PSEO_SUBJECTS.find((s) => s.slug === 'computer-science-python');
    else matchedSubject = PSEO_SUBJECTS[0]; // Default Mathematics
  }

  return {
    locality: matchedLocality || PSEO_LOCALITIES[0],
    subject: matchedSubject || PSEO_SUBJECTS[0],
    intentTrack: matchedIntent,
  };
}

/**
 * Calculates dynamic hyper-local pricing based on affluence tier and subject
 */
function calculatePseoPricing(locality: PSEOLocality, subject: PSEOSubject, intentTrack: PSEOIntentTrack) {
  let multiplier = 1.0;
  if (locality.affluenceTier === 'ULTRA_LUXURY') multiplier = 1.35;
  else if (locality.affluenceTier === 'PREMIUM') multiplier = 1.15;

  let baseRate = 850;
  if (intentTrack.slug === 'ib-board' || intentTrack.slug === 'igcse-cambridge') {
    baseRate = 1400;
  } else if (intentTrack.slug === 'neet-prep' || intentTrack.slug === 'jee-main') {
    baseRate = 1300;
  } else if (intentTrack.slug === 'class-12-cbse' || intentTrack.slug === 'class-11-cbse') {
    baseRate = 1000;
  } else if (subject.slug === 'french-language' || subject.slug === 'german-language') {
    baseRate = 950;
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
 * Generates 100% unique, anti-duplicate landing page payloads for all 50,000+ paths
 */
export function generatePSEOPagePayload(slug: string): PSEOPagePayload {
  const { locality, subject, intentTrack } = resolvePSEOSlug(slug);
  const pricing = calculatePseoPricing(locality, subject, intentTrack);
  const baseUrl = 'https://tuitionforhome.com';
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

  // Contextual Localized FAQs tailored to Intent & Locality
  const faqs = [
    {
      question: `How quickly can a verified ${subject.name} teacher start in ${locality.name}, ${locality.city}?`,
      answer: `Following your request, SSSAM Academy academic counselors match a background-checked ${subject.name} educator within ${locality.averageTravelMin || 10}–15 minutes. A trial demo class can be scheduled at your residence in ${locality.name} within 24 to 48 hours.`,
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
