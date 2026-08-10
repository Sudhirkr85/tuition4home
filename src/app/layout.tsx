import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TuitionForHome — #1 Verified Home & Online Tutors in Gurgaon | SSSAM Academy',
  description:
    'Find top-rated, background-checked CBSE, ICSE, IB & Coding home tutors in Gurgaon (DLF Phase 1-5, Golf Course Rd, Sohna Rd, Sector 56). Verified by SSSAM Academy Sector 14 Gurugram. 1 Free Demo Class + 100% Replacement Guarantee.',
  keywords: [
    'home tutor in gurgaon',
    'home tuition in gurgaon',
    'private tutors in gurugram',
    'maths tutor dlf phase 5 gurgaon',
    'physics tutor golf course road gurgaon',
    'online tutor india',
    'cbse class 10 home tutor gurgaon',
    'ib tutor gurgaon',
    'tuition bureau sector 14 gurgaon',
    'SSSAM Academy',
  ],
  authors: [{ name: 'SSSAM Academy' }],
  openGraph: {
    title: 'TuitionForHome — Verified Home & Online Tutors in Gurgaon',
    description:
      'Book top 1% verified home and online tutors in Gurgaon & Delhi NCR with a free demo class. Operated by SSSAM Academy, Sector 14 Gurugram.',
    url: 'https://tuitionforhome.com',
    siteName: 'TuitionForHome',
    images: [
      {
        url: 'https://sssamacademy.com/assets/home_page.webp',
        width: 1200,
        height: 630,
        alt: 'TuitionForHome Gurugram',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  other: {
    'geo.region': 'IN-HR',
    'geo.placename': 'Old DLF Colony, Sector 14, Gurugram, Haryana',
    'geo.position': '28.4703;77.0418',
    'ICBM': '28.4703, 77.0418',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Schema.org LocalBusiness & EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['LocalBusiness', 'EducationalOrganization'],
              name: 'TuitionForHome',
              url: 'https://tuitionforhome.com',
              logo: 'https://sssamacademy.com/assets/logo.webp',
              description:
                'Premier home and online tuition bureau in Gurgaon connecting parents with verified educators. Powered by SSSAM Academy.',
              telephone: ['+919517447689', '+919217031899'],
              email: 'info@sssamacademy.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14',
                addressLocality: 'Gurugram',
                addressRegion: 'Haryana',
                postalCode: '122001',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 28.4703,
                longitude: 77.0418,
              },
              areaServed: [
                'Gurugram',
                'DLF Phase 1',
                'DLF Phase 2',
                'DLF Phase 4',
                'DLF Phase 5',
                'Golf Course Road',
                'Sohna Road',
                'Sector 56 Gurgaon',
                'Delhi NCR',
              ],
              priceRange: '₹₹',
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
