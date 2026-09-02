import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/counselor/',
        '/parent/',
        '/tutor/profile',
        '/tutor/review/',
        '/api/',
        '/checkout/',
      ],
    },
    sitemap: 'https://sssamacademy.tech/sitemap.xml',
  };
}
