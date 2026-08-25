'use client';

import React, { useState } from 'react';

interface TutorAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: string;
}

export default function TutorAvatar({
  src,
  name,
  size = 64,
  borderRadius = '16px',
  className,
  style,
  fontSize,
}: TutorAvatarProps) {
  const [hasError, setHasError] = useState(false);

  const cleanName = (name || '').trim();
  const initials = cleanName
    ? cleanName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n.charAt(0).toUpperCase())
        .join('')
    : 'T';

  // Palette of elegant, high-contrast academic gradients
  const colorIndex = (cleanName.charCodeAt(0) || 0) % 5;
  const gradients = [
    'linear-gradient(135deg, #0F6E56 0%, #10B981 100%)',
    'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
    'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
    'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
  ];

  const calculatedFontSize = fontSize || `${Math.max(13, Math.round(size * 0.35))}px`;

  if (!src || !src.trim() || hasError) {
    return (
      <div
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius,
          background: gradients[colorIndex],
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: calculatedFontSize,
          fontWeight: 800,
          letterSpacing: '0.02em',
          flexShrink: 0,
          userSelect: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          ...style,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={cleanName || 'Tutor Avatar'}
      onError={() => setHasError(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius,
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
        ...style,
      }}
      className={className}
    />
  );
}
