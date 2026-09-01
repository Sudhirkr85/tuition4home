import { MetadataRoute } from 'next';
import { GURGAON_LOCALITIES } from '@/lib/data';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';
import { PSEO_LOCALITIES, PSEO_SUBJECTS, PSEO_INTENT_TRACKS } from '@/lib/pseo-data';
import { SEO_LOCATIONS } from '@/data/seo-locations';
import { SEO_TOPICS } from '@/data/seo-topics';
import { SEO_MODIFIERS } from '@/data/seo-modifiers';

// =========================================================================
// GOOGLE-COMPLIANT CACHED SITEMAP CONFIGURATION (<100ms response time)
// =========================================================================
export const dynamic = 'force-static';
export const revalidate = 604800; // 7 days Edge CDN caching

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tuitionforhome.com';
  const currentDate = new Date();

  // 1. Core High-Priority Static Landing Routes
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home-tutors-in-gurgaon`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.98,
    },
    {
      url: `${baseUrl}/tuition`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.98,
    },
    {
      url: `${baseUrl}/tutors`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.98,
    },
    {
      url: `${baseUrl}/request-tutor`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/book-demo`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/tutor/register`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // 2. Programmatic Course Landing Pages: City × Topic (2-Segment URLs)
  const course2SegmentUrls: MetadataRoute.Sitemap = [];
  SEO_LOCATIONS.forEach((loc) => {
    SEO_TOPICS.forEach((topic) => {
      course2SegmentUrls.push({
        url: `${baseUrl}/courses/${loc.city}/${topic.topic}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: loc.isTopCity ? 0.92 : 0.85,
      });
    });
  });

  // 3. Programmatic Course Intent Pages: City × Modifier × Topic (3-Segment URLs)
  const course3SegmentUrls: MetadataRoute.Sitemap = [];
  SEO_LOCATIONS.forEach((loc) => {
    SEO_MODIFIERS.forEach((mod) => {
      SEO_TOPICS.forEach((topic) => {
        course3SegmentUrls.push({
          url: `${baseUrl}/courses/${loc.city}/${mod.modifier}/${topic.topic}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: mod.isTopModifier && loc.isTopCity ? 0.9 : 0.8,
        });
      });
    });
  });

  // 4. Locality-Specific Hub URLs
  const localityUrls: MetadataRoute.Sitemap = GURGAON_LOCALITIES.map((loc) => ({
    url: `${baseUrl}/home-tutors-in-gurgaon/${loc.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 5. Subject SEO Hub URLs
  const subjectUrls: MetadataRoute.Sitemap = SUBJECT_SEO_PAGES.map((sub) => ({
    url: `${baseUrl}/tuition/${sub.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 6. Hyper-Local NCR Micro-Landing Pages
  const pseoUrls: MetadataRoute.Sitemap = [];
  PSEO_LOCALITIES.forEach((loc) => {
    PSEO_SUBJECTS.forEach((sub) => {
      pseoUrls.push({
        url: `${baseUrl}/tuition/${sub.slug}-home-tutor-in-${loc.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: loc.affluenceTier === 'ULTRA_LUXURY' ? 0.88 : 0.82,
      });

      PSEO_INTENT_TRACKS.slice(1, 4).forEach((track) => {
        pseoUrls.push({
          url: `${baseUrl}/tuition/${track.prefix}${sub.slug}-home-tutor-in-${loc.slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    });
  });

  // Combine and safely cap under Google's 50,000 limit
  // Place high-priority core, locality, subject hubs & PSEO pages first
  const combinedSitemap = [
    ...coreRoutes,
    ...localityUrls,
    ...subjectUrls,
    ...pseoUrls,
    ...course2SegmentUrls,
    ...course3SegmentUrls,
  ];

  return combinedSitemap.slice(0, 48000);
}
