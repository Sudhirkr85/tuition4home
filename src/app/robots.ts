import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/counselor/',
        '/parent/',
        '/tutor/profile',
        '/tutor/review/',
        '/api/',
      ],
    },
    sitemap: 'https://tuitionforhome.com/sitemap.xml',
  };
}
