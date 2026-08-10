'use client';

import React from 'react';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface StickyMobileBarProps {
  onOpenBooking: () => void;
}

export default function StickyMobileBar({ onOpenBooking }: StickyMobileBarProps) {
  const whatsappUrl = `https://wa.me/919517447689?text=${encodeURIComponent(
    'Hello TuitionForHome, I am looking for a verified home/online tutor in Gurgaon. Please share available teachers.'
  )}`;

  return (
    <div className="mobile-sticky-bar">
      <a
        href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
        className="btn btn-secondary btn-sm"
        style={{ flex: 1, padding: '0.65rem 0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
      >
        <Phone size={15} color="var(--color-emerald-600)" />
        <span>Call Counselor</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
        style={{ flex: 1, padding: '0.65rem 0.5rem', fontSize: '0.85rem', justifyContent: 'center', borderColor: '#25D366' }}
      >
        <MessageSquare size={15} color="#25D366" />
        <span>WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={onOpenBooking}
        className="btn btn-primary btn-sm"
        style={{ flex: 1.2, padding: '0.65rem 0.5rem', fontSize: '0.85rem', justifyContent: 'center' }}
      >
        <Sparkles size={15} />
        <span>Book Demo</span>
      </button>
    </div>
  );
}
