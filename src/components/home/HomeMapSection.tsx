'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MockTutor } from '@/lib/data';
import { useHomeContext } from './HomeContext';

const RapidoStyleMap = dynamic(() => import('@/components/RapidoStyleMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '480px', backgroundColor: '#F8FAFC', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
      Loading Gurgaon Teachers Map...
    </div>
  ),
});

export function HomeMapSection() {
  const { openBooking } = useHomeContext();
  const [tutors, setTutors] = useState<MockTutor[]>([]);

  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors)) {
          setTutors(data.tutors);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section aria-label="Interactive Gurgaon Tutor Map" style={{ padding: '3.5rem 0 1rem 0' }}>
      <div className="container">
        <RapidoStyleMap
          tutors={tutors}
          onLocationSelected={() => {}}
          onOpenBookingForTutor={(tutor) => openBooking(tutor)}
        />
      </div>
    </section>
  );
}
