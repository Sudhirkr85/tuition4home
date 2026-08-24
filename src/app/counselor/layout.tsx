import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Counselor Portal | TuitionForHome',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
