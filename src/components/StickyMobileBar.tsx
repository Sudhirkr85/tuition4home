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
        style={{ flex: 1, minWidth: 0, padding: '0.65rem 0.4rem', fontSize: '0.8rem', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        <Phone size={14} color="var(--color-emerald-600)" style={{ flexShrink: 0 }} />
        <span>Call</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
        style={{ flex: 1, minWidth: 0, padding: '0.65rem 0.4rem', fontSize: '0.8rem', justifyContent: 'center', borderColor: '#25D366', whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        <MessageSquare size={14} color="#25D366" style={{ flexShrink: 0 }} />
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={onOpenBooking}
        className="btn btn-primary btn-sm"
        style={{ flex: 1.3, minWidth: 0, padding: '0.65rem 0.5rem', fontSize: '0.8rem', justifyContent: 'center', whiteSpace: 'nowrap', overflow: 'hidden' }}
      >
        <Sparkles size={14} style={{ flexShrink: 0 }} />
        <span>Request Tutor</span>
      </button>
    </div>
  );
}
