import { MetadataRoute } from 'next';
import { GURGAON_LOCALITIES } from '@/lib/data';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tuitionforhome.com';

  const localityUrls = GURGAON_LOCALITIES.map((loc) => ({
    url: `${baseUrl}/home-tutors-in-gurgaon/${loc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const subjectUrls = SUBJECT_SEO_PAGES.map((sub) => ({
    url: `${baseUrl}/tuition/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tutor/register`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/book-demo`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    ...localityUrls,
    ...subjectUrls,
  ];
}

