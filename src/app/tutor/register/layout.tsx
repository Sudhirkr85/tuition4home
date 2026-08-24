import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Registration & Login — Join TuitionForHome | SSSAM Academy',
  description:
    'Join Gurgaon & Delhi NCR’s fastest-growing home and online tutor network. Register as a verified tutor with SSSAM Academy. Get premium students in your locality.',
  alternates: {
    canonical: '/tutor/register',
  },
};

export default function TutorRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
