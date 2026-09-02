'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const SECTOR_LIST = [
  'DLF Phase 5',
  'Golf Course Road',
  'Sector 56',
  'DLF Phase 1',
  'Sohna Road',
  'Nirvana Country',
  'Sushant Lok 1',
  'Sector 14 & Old DLF',
];

export function HeroSectorBadge() {
  const [currentSectorIndex, setCurrentSectorIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSectorIndex((prev) => (prev + 1) % SECTOR_LIST.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.55rem',
      padding: '0.4rem 0.9rem',
      borderRadius: '999px',
      backgroundColor: '#E8F5E9',
      border: '1px solid #C8E6C9',
      color: '#0F6E56',
      fontSize: '0.82rem',
      fontWeight: 700,
      maxWidth: '100%',
    }}>
      <MapPin size={14} color="#0F6E56" style={{ flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        Active in <strong>{SECTOR_LIST[currentSectorIndex]}</strong>
      </span>
    </div>
  );
}
