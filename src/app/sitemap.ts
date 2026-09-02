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
  const baseUrl = 'https://sssamacademy.tech';
  const currentDate = new Date();

  // 1. Core High-Priority Static Landing Routes & Legal Trust Pages
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
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Gurgaon Residential Locality Hubs (Primary Local Search Equity)
  const localityUrls: MetadataRoute.Sitemap = GURGAON_LOCALITIES.map((loc) => ({
    url: `${baseUrl}/home-tutors-in-gurgaon/${loc.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 3. Subject Directory Hub URLs
  const subjectUrls: MetadataRoute.Sitemap = SUBJECT_SEO_PAGES.map((sub) => ({
    url: `${baseUrl}/tuition/${sub.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  // 4. Curated Delhi NCR NCR City × Topic Hubs (Clean Local Authority)
  const course2SegmentUrls: MetadataRoute.Sitemap = [];
  SEO_LOCATIONS.forEach((loc) => {
    SEO_TOPICS.forEach((topic) => {
      course2SegmentUrls.push({
        url: `${baseUrl}/courses/${loc.city}/${topic.topic}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: loc.city === 'gurgaon' ? 0.92 : 0.85,
      });
    });
  });

  // 5. Curated Top Modifier × Topic Pages for NCR Hubs
  const course3SegmentUrls: MetadataRoute.Sitemap = [];
  const topModifiers = SEO_MODIFIERS.filter((m) => m.isTopModifier);
  SEO_LOCATIONS.forEach((loc) => {
    topModifiers.forEach((mod) => {
      SEO_TOPICS.slice(0, 8).forEach((topic) => {
        course3SegmentUrls.push({
          url: `${baseUrl}/courses/${loc.city}/${mod.modifier}/${topic.topic}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.82,
        });
      });
    });
  });

  // 6. Hyper-Local NCR Micro-Landing Pages (Curated High-Intent Localities)
  const pseoUrls: MetadataRoute.Sitemap = [];
  const curatedLocalities = PSEO_LOCALITIES.slice(0, 35); // Top 35 Gurgaon/NCR localities
  curatedLocalities.forEach((loc) => {
    PSEO_SUBJECTS.forEach((sub) => {
      pseoUrls.push({
        url: `${baseUrl}/tuition/${sub.slug}-home-tutor-in-${loc.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: loc.affluenceTier === 'ULTRA_LUXURY' ? 0.88 : 0.82,
      });

      // Include top intent tracks (e.g. female tutor, ib board)
      PSEO_INTENT_TRACKS.slice(1, 3).forEach((track) => {
        pseoUrls.push({
          url: `${baseUrl}/tuition/${track.prefix}${sub.slug}-home-tutor-in-${loc.slug}`,
          lastModified: currentDate,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    });
  });

  return [
    ...coreRoutes,
    ...localityUrls,
    ...subjectUrls,
    ...course2SegmentUrls,
    ...course3SegmentUrls,
    ...pseoUrls,
  ];
}
