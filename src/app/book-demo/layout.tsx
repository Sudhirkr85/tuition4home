import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a 1-on-1 Trial Class with Verified Tutors in Gurgaon | TuitionForHome',
  description: 'Book a 1-on-1 trial class with background-checked CBSE, ICSE, IB home tutors in Gurgaon. No commitment. Operated by SSSAM Academy, Sector 14 Gurugram.',
  alternates: {
    canonical: '/book-demo',
  },
};

export default function BookDemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
