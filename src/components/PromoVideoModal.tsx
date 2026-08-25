'use client';

import React, { useEffect } from 'react';
import { X, Play, ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react';

export interface PromoVideoData {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl?: string;
  badge?: string;
  aspectRatio?: '16/9' | '9/16';
}

interface PromoVideoModalProps {
  video: PromoVideoData | null;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export default function PromoVideoModal({ video, onClose, onOpenBooking }: PromoVideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (video) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [video, onClose]);

  if (!video) return null;

  const isVertical = video.aspectRatio === '9/16';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: isVertical ? '420px' : '720px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Video"
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={18} color="#FFFFFF" strokeWidth={2.5} />
        </button>

        {/* Video Player Box */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            backgroundColor: '#0A0F1D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: isVertical ? '9/16' : '16/9',
            maxHeight: isVertical ? '65vh' : 'auto',
          }}
        >
          <video
            src={video.videoUrl}
            poster={video.posterUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: '#000000',
            }}
          />
        </div>

        {/* Content & Action Bar */}
        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            {video.badge && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#0F6E56',
                  backgroundColor: '#E8F5E9',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  marginBottom: '0.4rem',
                }}
              >
                <ShieldCheck size={13} color="#0F6E56" />
                {video.badge}
              </span>
            )}
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              {video.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
              {video.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.35rem' }}>
            {onOpenBooking && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="btn btn-primary"
                style={{
                  backgroundColor: '#0F6E56',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: 'none',
                  cursor: 'pointer',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                <span>Request Free Demo Tutor</span>
                <ChevronRight size={16} />
              </button>
            )}
            <a
              href="https://wa.me/919217031899?text=Hello%20SSSAM%20Academy%2C%20I%20watched%20your%20video%20and%20want%20to%20know%20more%20about%20home%20tuition."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                padding: '0.65rem 1.1rem',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
