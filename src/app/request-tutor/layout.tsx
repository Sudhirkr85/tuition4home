import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request a Home Tutor in Gurgaon — 1-on-1 Trial Class | TuitionForHome',
  description: 'Submit your tuition requirement and get matched with a verified home tutor in Gurgaon within 24 hours. 1-on-1 Trial Class + 100% Replacement Guarantee.',
  alternates: {
    canonical: '/request-tutor',
  },
};

export default function RequestTutorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
