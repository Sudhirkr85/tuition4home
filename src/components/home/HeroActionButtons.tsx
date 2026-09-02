'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, GraduationCap } from 'lucide-react';
import { useHomeContext } from './HomeContext';

export function HeroActionButtons() {
  const { openBooking } = useHomeContext();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '440px' }}>
      {/* Live Animated Status Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
        border: '1px solid rgba(37, 211, 102, 0.3)',
        padding: '0.3rem 0.75rem',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: '#047857',
        alignSelf: 'flex-start',
      }}>
        <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
          <span style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            animation: 'ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.75,
          }} />
          <span style={{
            position: 'relative',
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#16A34A',
          }} />
        </span>
        <span>Counselors Active • Avg Matching: 15 Mins</span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => openBooking()}
          className="btn btn-primary btn-lg"
          style={{
            flex: '1 1 200px',
            fontSize: '1.05rem',
            padding: '0.9rem 1.4rem',
            justifyContent: 'center',
            backgroundColor: '#0F6E56',
            boxShadow: '0 8px 24px rgba(15, 110, 86, 0.3)',
            borderRadius: '14px',
            fontWeight: 800,
          }}
        >
          <span>Get a Home Teacher</span>
          <ChevronRight size={18} />
        </button>

        <Link
          href="/tutors"
          className="btn btn-secondary btn-lg"
          style={{
            flex: '1 1 160px',
            fontSize: '0.98rem',
            padding: '0.9rem 1.25rem',
            justifyContent: 'center',
            borderRadius: '14px',
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          <span>Find Teachers</span>
        </Link>
      </div>

      {/* Teacher CTA link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.2rem' }}>
        <GraduationCap size={15} color="#0F6E56" />
        <span style={{ fontSize: '0.84rem', color: '#64748B' }}>Are you an educator?</span>
        <Link href="/tutor/register" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F6E56', textDecoration: 'none' }}>
          Apply as Home Tutor →
        </Link>
      </div>
    </div>
  );
}
