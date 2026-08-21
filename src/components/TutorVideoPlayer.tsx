'use client';

import React, { useState, useEffect } from 'react';
import { Play, Video, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { getVideoSourceInfo } from '@/lib/video';

interface TutorVideoPlayerProps {
  videoUrl?: string | null;
  tutorName?: string;
  maxHeight?: string;
  autoPlay?: boolean;
  onSetTestVideo?: (url: string) => void;
}

export default function TutorVideoPlayer({
  videoUrl,
  tutorName = 'Tutor',
  maxHeight = '230px',
  autoPlay = false,
  onSetTestVideo,
}: TutorVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const info = getVideoSourceInfo(videoUrl);

  // Reset error when URL changes
  useEffect(() => {
    setHasError(false);
  }, [videoUrl]);

  if (!videoUrl || info.type === 'none') {
    return (
      <div
        style={{
          padding: '1.75rem 1rem',
          textAlign: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: '14px',
          border: '1.5px dashed #CBD5E1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: maxHeight,
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.65rem', color: '#64748B' }}>
          <Video size={24} />
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#334155' }}>No Introduction Video Uploaded</div>
        <p style={{ fontSize: '0.76rem', color: '#94A3B8', margin: '0.25rem 0 0', maxWidth: '280px' }}>
          Upload an MP4 file or paste a YouTube / Vimeo link.
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#0F172A', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      {/* YouTube or Vimeo iframe embed */}
      {info.type === 'youtube' || info.type === 'vimeo' || info.type === 'gdrive' ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight }}>
          <iframe
            src={info.embedUrl}
            title={`${tutorName} Introduction Video`}
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              display: 'block',
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        /* Direct Video (MP4 / WebM / Cloudinary / Stream) */
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000000' }}>
          <video
            key={info.embedUrl}
            src={info.embedUrl}
            controls
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              backgroundColor: '#000000',
            }}
            onError={() => setHasError(true)}
          />

          {hasError && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', color: '#FFFFFF', textAlign: 'center' }}>
              <AlertCircle size={24} color="#EF4444" style={{ marginBottom: '0.4rem' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Direct video stream failed to load</span>
              <a
                href={info.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38BDF8', fontSize: '0.74rem', marginTop: '0.35rem', textDecoration: 'none', fontWeight: 600 }}
              >
                Open video in new tab ↗
              </a>
            </div>
          )}
        </div>
      )}

      {/* Video Footer Info Bar */}
      <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#0B1120', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#94A3B8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: info.type === 'youtube' ? '#EF4444' : info.type === 'vimeo' ? '#0284C7' : '#059669', color: '#FFFFFF', padding: '1px 6px', borderRadius: '4px' }}>
            {info.type.toUpperCase()}
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
            {info.originalUrl}
          </span>
        </div>

        <a
          href={info.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#38BDF8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}
        >
          <span>Open External</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
