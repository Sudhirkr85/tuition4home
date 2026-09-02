'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LocalityInfo } from '@/lib/data';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

export function LocalityDirectoryToggle({ localities }: { localities: LocalityInfo[] }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
      }}>
        {(showAll ? localities : localities.slice(0, 8)).map((loc) => (
          <Link
            key={loc.slug}
            href={`/home-tutors-in-gurgaon/${loc.slug}`}
            className="apple-card"
            style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-main)' }}>
                {loc.name}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px', lineClamp: 1 }}>
                {loc.landmark}
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.25rem 0.65rem', borderRadius: '999px', whiteSpace: 'nowrap' }}>
              Explore →
            </span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {localities.length > 8 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.75rem 1.4rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              backgroundColor: '#0F6E56',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(15, 110, 86, 0.15)',
            }}
          >
            <span>{showAll ? 'Show Fewer Sectors' : 'Explore All Gurgaon & NCR Sectors'}</span>
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}

        <Link
          href="/home-tutors-in-gurgaon"
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.75rem 1.25rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            borderRadius: '12px',
          }}
        >
          <span>Full Directory Page</span>
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}
