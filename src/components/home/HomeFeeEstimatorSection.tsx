'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useHomeContext } from './HomeContext';

const FeeEstimator = dynamic(() => import('@/components/FeeEstimator'), {
  ssr: true,
  loading: () => (
    <div style={{ minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading Fee Calculator...
    </div>
  ),
});

export function HomeFeeEstimatorSection() {
  const { openBooking } = useHomeContext();

  return (
    <section id="fee-estimator" aria-label="Tuition Fee Estimator" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-app)' }}>
      <div className="container">
        <FeeEstimator
          onBookWithEstimate={(data) => {
            openBooking(undefined, { grade: data.grade, mode: data.mode });
          }}
        />
      </div>
    </section>
  );
}
