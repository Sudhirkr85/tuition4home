import { MetadataRoute } from 'next';
import { GURGAON_LOCALITIES } from '@/lib/data';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';
import { PSEO_LOCALITIES, PSEO_SUBJECTS } from '@/lib/pseo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tuitionforhome.com';

  const localityUrls = GURGAON_LOCALITIES.map((loc) => ({
    url: `${baseUrl}/home-tutors-in-gurgaon/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  const legacySubjectUrls = SUBJECT_SEO_PAGES.map((sub) => ({
    url: `${baseUrl}/tuition/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.95,
  }));

  // Programmatic Hyper-Local Gurgaon & Delhi URLs (Top High-Intent Combinations)
  const pseoUrls: MetadataRoute.Sitemap = [];
  PSEO_LOCALITIES.forEach((loc) => {
    PSEO_SUBJECTS.forEach((sub) => {
      pseoUrls.push({
        url: `${baseUrl}/tuition/${sub.slug}-home-tutor-in-${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: loc.affluenceTier === 'ULTRA_LUXURY' ? 0.92 : 0.88,
      });
    });
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home-tutors-in-gurgaon`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/tuition`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/tutors`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.98,
    },
    {
      url: `${baseUrl}/request-tutor`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/book-demo`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutor/register`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    ...localityUrls,
    ...legacySubjectUrls,
    ...pseoUrls,
  ];
}
