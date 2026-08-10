import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/counselor/', '/api/'],
    },
    sitemap: 'https://tuitionforhome.com/sitemap.xml',
  };
}
