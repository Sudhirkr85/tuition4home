import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GURGAON_LOCALITIES, SSSAM_OFFICE_DETAILS } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Home Tutors in Gurgaon — All Localities | Verified by SSSAM Academy',
  description: 'Find verified home tutors across 35+ Gurgaon localities — DLF Phase 1-5, Golf Course Road, Sohna Road, Nirvana Country, Sector 56, Sector 45 & more. Background-checked educators by SSSAM Academy.',
  alternates: { canonical: '/home-tutors-in-gurgaon' },
};

export default function GurgaonLocalitiesHubPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16" style={{ backgroundColor: '#F0FDF9' }}>
        <section className="pt-24 pb-12 px-4 text-center">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#065F46' }}>
              Home Tutors in Gurgaon — All Localities
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Find verified, background-checked home tutors across 35+ premium localities and sectors in Gurgaon. 
              Powered by SSSAM Academy.
            </p>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {GURGAON_LOCALITIES.map((loc) => (
              <Link 
                key={loc.slug} 
                href={`/home-tutors-in-gurgaon/${loc.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full group"
              >
                <div className="flex items-start justify-between mb-3">
                  <MapPin className="w-6 h-6" style={{ color: '#065F46' }} />
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-700 transition-colors" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {loc.name}
                </h2>
                <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                  Landmark: {loc.landmark}
                </p>
                <p className="text-xs text-gray-400 mt-auto pt-4 font-mono">
                  Pincode: {loc.pincode}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-100 text-center">
            <ShieldCheck className="w-12 h-12 mx-auto mb-4" style={{ color: '#065F46' }} />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Trusted by Parents in Gurgaon</h2>
            <p className="text-gray-600 mb-6">
              All our educators go through a strict background check and teaching evaluation at the {SSSAM_OFFICE_DETAILS.operatorName} center in Sector 14.
            </p>
            <div className="flex items-center justify-center gap-2 text-lg font-medium text-green-800">
              <Phone className="w-5 h-5" />
              <a href={`tel:${SSSAM_OFFICE_DETAILS.phones[0].replace(/\s+/g, '')}`}>{SSSAM_OFFICE_DETAILS.phones[0]}</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
