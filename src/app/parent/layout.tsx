import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parent Portal | TuitionForHome',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
