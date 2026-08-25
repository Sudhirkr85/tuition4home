'use client';

import React from 'react';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface StickyMobileBarProps {
  onOpenBooking: () => void;
}

export default function StickyMobileBar({ onOpenBooking }: StickyMobileBarProps) {
  const whatsappUrl = `https://wa.me/919217031899?text=${encodeURIComponent(
    'Hello TuitionForHome, I am looking for a verified home/online tutor in Gurgaon. Please share available teachers.'
  )}`;

  return (
    <div className="mobile-sticky-bar">
      <a
        href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
        className="btn btn-secondary btn-sm"
        style={{ flex: 1, minWidth: 0, padding: '0.65rem 0.4rem', fontSize: '0.82rem', fontWeight: 700, justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'hidden', gap: '0.35rem' }}
      >
        <Phone size={15} color="#0F6E56" className="phone-icon-animated" style={{ flexShrink: 0 }} />
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
        style={{ flex: 1.1, minWidth: 0, padding: '0.65rem 0.4rem', fontSize: '0.82rem', fontWeight: 700, justifyContent: 'center', borderColor: '#25D366', color: '#15803D', whiteSpace: 'nowrap', overflow: 'hidden', gap: '0.35rem' }}
      >
        <MessageSquare size={14} color="#25D366" style={{ flexShrink: 0 }} />
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={onOpenBooking}
        className="btn btn-primary btn-sm"
        style={{
          flex: 1.4,
          minWidth: 0,
          padding: '0.65rem 0.5rem',
          fontSize: '0.82rem',
          fontWeight: 800,
          justifyContent: 'center',
          backgroundColor: '#0F6E56',
          boxShadow: '0 4px 14px rgba(15, 110, 86, 0.38)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          gap: '0.35rem',
        }}
      >
        <Sparkles size={14} color="#FDE047" style={{ flexShrink: 0, animation: 'bounce 2s infinite' }} />
        <span>Find a Teacher</span>
      </button>
    </div>
  );
}
