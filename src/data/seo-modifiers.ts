export interface SEOModifier {
  modifier: string; // Slug (e.g. 'best', 'top', 'online', 'offline', 'weekend', 'affordable', 'certified', 'near-me')
  label: string; // Display title prefix/adjective
  badge: string; // Badge label for Hero & Cards
  ctaText: string; // Dynamic conversion CTA button text
  descriptionPrefix: string; // Snippet to enrich landing copy
  isTopModifier?: boolean;
}

export const SEO_MODIFIERS: SEOModifier[] = [
  {
    modifier: 'best',
    label: 'Best',
    badge: '🏆 #1 Top-Rated Educators',
    ctaText: 'Book #1 Rated Tutor Demo',
    descriptionPrefix:
      'Looking for the best-rated tutoring with proven academic track record and 5-star student reviews? Connect with verified master educators.',
    isTopModifier: true,
  },
  {
    modifier: 'top',
    label: 'Top-Rated',
    badge: '⭐ Top 1% Verified Faculty',
    ctaText: 'Find Top Verified Tutors',
    descriptionPrefix:
      'Gain a competitive academic edge with top-ranked private tutors who have guided hundreds of students to 95%+ marks.',
    isTopModifier: true,
  },
  {
    modifier: 'online',
    label: 'Online Live 1-on-1',
    badge: '💻 Interactive Live 1-on-1',
    ctaText: 'Start Free Online Class',
    descriptionPrefix:
      'Learn from the comfort of home with interactive digital whiteboards, screen sharing, recorded sessions, and instant doubt clearance.',
    isTopModifier: true,
  },
  {
    modifier: 'offline',
    label: 'In-Home Offline',
    badge: '🏡 Doorstep In-Person Classes',
    ctaText: 'Book In-Home Tutor Trial',
    descriptionPrefix:
      'Get verified, background-checked private tutors to teach at your home with personalized 1-on-1 attention and zero commute stress.',
    isTopModifier: true,
  },
  {
    modifier: 'weekend',
    label: 'Weekend Fast-Track',
    badge: '⚡ Flexible Weekend Batches',
    ctaText: 'Enroll in Weekend Batches',
    descriptionPrefix:
      'Designed for busy school weekdays. Intensive Saturday & Sunday power sessions focusing on concept revision, doubt clearing, and mock tests.',
    isTopModifier: false,
  },
  {
    modifier: 'affordable',
    label: 'Affordable & Budget-Friendly',
    badge: '💰 Best Value Guaranteed',
    ctaText: 'Check Affordable Rates',
    descriptionPrefix:
      'Get world-class 1-on-1 coaching at transparent, pocket-friendly hourly fees with no hidden mediation charges and free tutor replacement.',
    isTopModifier: true,
  },
  {
    modifier: 'certified',
    label: 'Certified Master',
    badge: '🎓 SSSAM Academy Certified',
    ctaText: 'Connect with Certified Faculty',
    descriptionPrefix:
      'All tutors are strictly audited: degree verified, Aadhaar KYC checked, and pedagogical demo approved by SSSAM Academy Gurugram.',
    isTopModifier: false,
  },
  {
    modifier: 'near-me',
    label: 'Near Me (Within 3km)',
    badge: '📍 Hyper-Local Fast Match',
    ctaText: 'Find Tutors Near Me',
    descriptionPrefix:
      'Discover top-tier educators living right in your neighborhood for rapid home visits, flexible scheduling, and emergency exam revision.',
    isTopModifier: true,
  },
  {
    modifier: 'crash-course',
    label: 'Intensive Crash Course',
    badge: '🚀 Rapid Board & Exam Revision',
    ctaText: 'Join Fast Crash Course',
    descriptionPrefix:
      'Fast-track your board or competitive exam preparation with high-yield summary notes, previous 10 years solved papers, and formula sheet drills.',
    isTopModifier: false,
  },
  {
    modifier: 'one-on-one',
    label: 'Personalized 1-on-1',
    badge: '🎯 100% Dedicated Attention',
    ctaText: 'Book 1-on-1 Free Session',
    descriptionPrefix:
      'Zero crowd distractions. Custom study pace tailored to your child’s unique strengths, learning style, and school syllabus timetable.',
    isTopModifier: true,
  },
  {
    modifier: 'female-tutor',
    label: 'Verified Female',
    badge: '👩 Verified Lady Educators',
    ctaText: 'Request Female Tutor Trial',
    descriptionPrefix:
      'Experienced and vetted female educators available for safe in-home tutoring across all primary, middle, and high school grades.',
    isTopModifier: false,
  },
];

// In-memory index map for O(1) query performance
const modifierMap = new Map<string, SEOModifier>();
SEO_MODIFIERS.forEach((m) => {
  modifierMap.set(m.modifier.toLowerCase(), m);
});

export function getModifierBySlug(slug: string): SEOModifier | undefined {
  if (!slug) return undefined;
  return modifierMap.get(slug.toLowerCase().trim());
}

export function getAllModifierSlugs(): string[] {
  return SEO_MODIFIERS.map((m) => m.modifier);
}

export function getTopModifiers(): SEOModifier[] {
  return SEO_MODIFIERS.filter((m) => m.isTopModifier);
}
