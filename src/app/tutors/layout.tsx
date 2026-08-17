import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Verified Home Tutors in Gurgaon — CBSE, ICSE, IB | TuitionForHome',
  description: 'Browse 100+ verified, background-checked home & online tutors in Gurgaon. Filter by subject, locality, gender, and price. Operated by SSSAM Academy, Sector 14 Gurugram.',
  alternates: {
    canonical: '/tutors',
  },
};

export default function TutorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
