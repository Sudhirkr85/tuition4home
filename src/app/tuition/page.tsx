import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SUBJECT_SEO_PAGES } from '@/lib/seo-data';

export const metadata: Metadata = {
  title: 'Home Tuition in Gurgaon — All Subjects & Boards | TuitionForHome',
  description: 'Explore 25+ subject-wise home tutors in Gurgaon — Maths, Physics, Chemistry, Biology, IB/IGCSE, Coding, Commerce, French & more. Verified educators by SSSAM Academy, Sector 14.',
  alternates: { canonical: '/tuition' },
};

export default function TuitionHubPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#F0FDF9' }}>
        <section className="pt-24 pb-12 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#065F46' }}>
              Home Tuition in Gurgaon — All Subjects
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Find specialized home tutors for 25+ subjects across CBSE, ICSE, IB, IGCSE and competitive exams (JEE/NEET/CUET). 
              Verified educators for every subject and grade.
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBJECT_SEO_PAGES.map((sub) => (
              <Link 
                key={sub.slug} 
                href={`/tuition/${sub.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" style={{ color: '#065F46' }} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-700 transition-colors" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {sub.subjectName}
                </h2>
                <p className="text-sm font-medium text-green-700 mb-3">
                  {sub.targetGrades}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2 mt-auto">
                  {sub.intro}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
