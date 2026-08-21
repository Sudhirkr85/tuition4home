'use client';

import React from 'react';
import { X, ShieldCheck, Play } from 'lucide-react';
import { MockTutor } from '@/lib/data';

import { getVideoSourceInfo } from '@/lib/video';

interface VideoModalProps {
  tutor: MockTutor | null;
  onClose: () => void;
  onSelectTutor: (tutor: MockTutor) => void;
}

export default function VideoModal({ tutor, onClose, onSelectTutor }: VideoModalProps) {
  if (!tutor) return null;

  const videoInfo = getVideoSourceInfo(tutor.introVideoUrl);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Floating Close (X) Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Modal"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 99999,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={20} color="#FFFFFF" strokeWidth={3} />
        </button>

        {/* Video Player Area */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#0F172A' }}>
          {videoInfo.isEmbeddable && (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'gdrive') ? (
            <iframe
              src={videoInfo.embedUrl}
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
          ) : videoInfo.isEmbeddable && videoInfo.type === 'direct' ? (
            <video
              key={videoInfo.embedUrl}
              src={videoInfo.embedUrl}
              controls
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#000000',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'radial-gradient(circle at 50% 50%, #1E293B 0%, #0F172A 100%)',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(13, 148, 136, 0.2)',
                  color: 'var(--brand-teal, #0D9488)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  border: '1px solid rgba(13, 148, 136, 0.4)',
                }}
              >
                <Play size={28} />
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 0.4rem 0', color: '#FFFFFF' }}>
                60s Video Intro &amp; Demo Session
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                {tutor.name}&apos;s live video intro is presented during official student demo matching. Click below to request a 1-on-1 trial class.
              </p>
            </div>
          )}
        </div>

        {/* Tutor Details & Booking Action */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {tutor.name}
                </h3>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#15803D', padding: '0.15rem 0.55rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={12} />
                  <span>VERIFIED TUTOR</span>
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                {tutor.highestDegree || 'Bachelor Degree'} {tutor.experienceYears ? `• ${tutor.experienceYears}+ Years Teaching Experience` : ''}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectTutor(tutor);
              }}
              className="btn btn-primary"
              style={{ backgroundColor: '#0D9488', padding: '0.65rem 1.35rem', fontWeight: 800, fontSize: '0.88rem' }}
            >
              <span>Select {tutor.name.split(' ')[0]}</span>
            </button>
          </div>

          {tutor.bio && (
            <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6, borderTop: '1px solid #F1F5F9', paddingTop: '0.85rem', margin: 0 }}>
              {tutor.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
