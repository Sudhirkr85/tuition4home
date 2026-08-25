import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tuitionforhome.com'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'TuitionForHome — #1 Verified Home & Online Tutors in Gurgaon | SSSAM Academy',
    template: '%s | TuitionForHome Gurgaon',
  },
  description:
    'Find top-rated, background-checked CBSE, ICSE, IB & Coding home tutors in Gurgaon (DLF Phase 1-5, Golf Course Rd, Sohna Rd, Sector 56). Verified by SSSAM Academy Sector 14 Gurugram. 1-on-1 Trial Class + 100% Replacement Guarantee.',
  keywords: [
    'home tutor in gurgaon',
    'home tuition in gurgaon',
    'private tutors in gurugram',
    'maths tutor dlf phase 5 gurgaon',
    'physics tutor golf course road gurgaon',
    'online tutor india',
    'cbse class 10 home tutor gurgaon',
    'ib tutor gurgaon',
    'home tuition academy sector 14 gurgaon',
    'SSSAM Academy',
  ],
  authors: [{ name: 'SSSAM Academy', url: 'https://sssamacademy.com' }],
  icons: {
    icon: [
      { url: '/logo.webp', type: 'image/webp' },
    ],
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },

  openGraph: {
    title: 'TuitionForHome — Verified Home & Online Tutors in Gurgaon',
    description:
      'Book top 1% verified home and online tutors in Gurgaon & Delhi NCR with 1-on-1 trial class. Operated by SSSAM Academy, Sector 14 Gurugram.',
    url: 'https://tuitionforhome.com',
    siteName: 'TuitionForHome',
    images: [
      {
        url: 'https://sssamacademy.com/assets/home_page.webp',
        width: 1200,
        height: 630,
        alt: 'TuitionForHome Gurugram — Verified Home & Online Tutors',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuitionForHome — #1 Verified Home & Online Tutors in Gurgaon',
    description:
      'Book background-checked CBSE, ICSE & IB home tutors in Gurgaon within 3.5 km. 1-on-1 Trial Class + 100% Replacement Guarantee.',
    images: ['https://sssamacademy.com/assets/home_page.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN-HR',
    'geo.placename': 'Old DLF Colony, Sector 14, Gurugram, Haryana',
    'geo.position': '28.4703;77.0418',
    'ICBM': '28.4703, 77.0418',
  },
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://a.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://b.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://c.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="preconnect" href="https://d.basemaps.cartocdn.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://a.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://b.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://c.basemaps.cartocdn.com" />
        <link rel="dns-prefetch" href="https://d.basemaps.cartocdn.com" />
        {/* Schema.org LocalBusiness & EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['LocalBusiness', 'EducationalOrganization'],
              name: 'TuitionForHome — SSSAM Academy',
              url: 'https://tuitionforhome.com',
              logo: 'https://sssamacademy.com/assets/logo.webp',
              image: 'https://sssamacademy.com/assets/home_page.webp',
              description:
                'Premier home and online tutoring platform in Gurgaon connecting parents with background-verified educators for CBSE, ICSE, IB & Cambridge curricula.',
              telephone: ['+919217031899'],
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
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  opens: '08:00',
                  closes: '20:00',
                },
              ],
              areaServed: [
                'Gurugram',
                'DLF Phase 1',
                'DLF Phase 2',
                'DLF Phase 4',
                'DLF Phase 5',
                'Golf Course Road',
                'Golf Course Extension',
                'Sohna Road',
                'Sector 14 Gurgaon',
                'Sector 56 Gurgaon',
                'Sector 57 Gurgaon',
                'Nirvana Country',
                'South City 1',
                'South City 2',
                'Palam Vihar',
                'Dwarka Delhi',
                'Vasant Kunj Delhi',
                'Vasant Vihar Delhi',
                'Saket South Delhi',
                'Hauz Khas Delhi',
                'Chhattarpur Delhi',
                'Kapashera & Bijwasan',
                'Janakpuri West Delhi',
                'Delhi NCR',
              ],
              priceRange: '₹₹ - ₹₹₹',
              currenciesAccepted: 'INR',
              paymentAccepted: 'Cash, UPI, Net Banking, Credit Card',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.95',
                reviewCount: '500',
                bestRating: '5',
                worstRating: '1',
              },
              sameAs: [
                'https://www.instagram.com/tuition4home',
                'https://www.facebook.com/share/1FL3vBLgqm/',
                'https://www.youtube.com/@codingwithsudhir',
              ],
            }),
          }}
        />
        {/* Schema.org FAQPage for Google PAA & Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'How does TuitionForHome verify and screen home tutors in Gurgaon & Delhi NCR?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Every educator undergoes a strict 3-stage auditing pipeline by SSSAM Academy: Aadhaar KYC background verification, in-person academic degree audit, and a 60-second video teaching audition.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What are the home tuition fees in Gurgaon, Dwarka, and South Delhi?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Tuition rates typically range from ₹600 to ₹1,500/hr for CBSE/ICSE and ₹1,500 to ₹2,500/hr for IB/IGCSE curricula, with transparent online fee estimation.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What happens if my child is not satisfied with the allocated tutor?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TuitionForHome provides a 100% Free Tutor Replacement Guarantee within 24 hours at zero extra charge.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can we visit your physical center in Sector 14 Gurugram?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! TuitionForHome is operated by SSSAM Academy at M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram. Parents are welcome to visit our counseling desk or attend offline trial classes.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={outfit.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
