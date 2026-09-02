import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutor Dashboard & Profile | TuitionForHome',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TutorProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
