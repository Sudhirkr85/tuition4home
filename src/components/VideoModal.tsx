'use client';

import React from 'react';
import { X, ShieldCheck, GraduationCap } from 'lucide-react';
import { MockTutor } from '@/lib/data';

interface VideoModalProps {
  tutor: MockTutor | null;
  onClose: () => void;
  onBookDemo: (tutor: MockTutor) => void;
}

export default function VideoModal({ tutor, onClose, onBookDemo }: VideoModalProps) {
  if (!tutor) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2100,
      backgroundColor: 'rgba(11, 19, 43, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '680px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={18} color="var(--color-slate-900)" />
        </button>

        {/* Video Player Area */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, backgroundColor: '#000000' }}>
          <iframe
            src={`${tutor.introVideoUrl}?autoplay=1&rel=0`}
            title={`Video Intro: ${tutor.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>

        {/* Tutor Details & Booking Action */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                  {tutor.name}
                </h3>
                <span className="badge badge-verified">
                  <ShieldCheck size={13} />
                  <span>VERIFIED TUTOR</span>
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', fontWeight: 500 }}>
                {tutor.highestDegree} • {tutor.experienceYears}+ Years Teaching Experience
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookDemo(tutor);
              }}
              className="btn btn-primary"
            >
              <span>Book Demo with {tutor.name.split(' ')[0]}</span>
            </button>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', lineHeight: 1.5, borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
            {tutor.bio}
          </p>
        </div>
      </div>
    </div>
  );
}
