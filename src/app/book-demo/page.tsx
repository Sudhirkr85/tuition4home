'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';

function BookDemoContent() {
  const searchParams = useSearchParams();
  const tutorName = searchParams.get('tutor') || undefined;
  const grade = searchParams.get('grade') || undefined;
  const subject = searchParams.get('subject') || undefined;
  const mode = searchParams.get('mode') || undefined;
  const locality = searchParams.get('locality') || undefined;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '3rem 1rem 4rem' }}>
        <div className="container" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <BookingModal
            isInline={true}
            initialData={{
              tutorName,
              grade,
              subject,
              mode,
              locality,
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function BookDemoPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading demo form...</div>}>
      <BookDemoContent />
    </Suspense>
  );
}
