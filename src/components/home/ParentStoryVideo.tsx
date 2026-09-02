'use client';

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function ParentStoryVideo() {
  const parentStoryVideoRef = useRef<HTMLVideoElement>(null);
  const [isParentStoryMuted, setIsParentStoryMuted] = useState(true);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '300px',
        borderRadius: '32px',
        backgroundColor: '#0F172A',
        padding: '10px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
        border: '3px solid #1E293B',
      }}>
        {/* Phone Screen Container */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '9/16',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#000000',
        }}>
          <video
            ref={parentStoryVideoRef}
            src="https://res.cloudinary.com/jhwajyyw/video/upload/v1787652806/tuitionforhome/marketing/tuitionforhome_student_learning_reel_hq.mp4"
            poster="https://res.cloudinary.com/jhwajyyw/video/upload/so_2,w_800/v1787652806/tuitionforhome/marketing/tuitionforhome_student_learning_reel_hq.jpg"
            autoPlay
            loop
            muted={isParentStoryMuted}
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Verified Parent Story Tag */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.25rem 0.6rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            zIndex: 2,
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
            <span>Gurgaon Parents Story</span>
          </div>

          {/* Clickable Sound Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (parentStoryVideoRef.current) {
                const nextMuted = !parentStoryVideoRef.current.muted;
                parentStoryVideoRef.current.muted = nextMuted;
                setIsParentStoryMuted(nextMuted);
              }
            }}
            aria-label={isParentStoryMuted ? 'Unmute video' : 'Mute video'}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
            }}
          >
            {isParentStoryMuted ? <VolumeX size={18} color="#FFFFFF" /> : <Volume2 size={18} color="#10B981" />}
          </button>
        </div>
      </div>
    </div>
  );
}
