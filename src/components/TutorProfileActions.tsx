'use client';

import React, { useState } from 'react';
import { Share2, MessageCircle, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface TutorProfileActionsProps {
  tutorName: string;
  tutorId: string;
  subjects: string[];
  highestDegree: string;
  phone?: string;
}

export default function TutorProfileActions({
  tutorName,
  tutorId,
  subjects,
  highestDegree,
}: TutorProfileActionsProps) {
  const [copied, setCopied] = useState(false);

  const shareTitle = `${tutorName} - Verified Home Tutor in Gurgaon`;
  const shareText = `Check out ${tutorName}'s profile on TuitionForHome. Specializes in ${subjects.slice(0, 3).join(', ')} (${highestDegree}). Verified by SSSAM Academy.`;
  
  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://tuitionforhome.com/tutors/${tutorId}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
      } catch {
        handleCopy(url);
      }
    } else {
      handleCopy(url);
    }
  };

  const handleCopy = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SSSAM Academy, I want to book teacher ${tutorName} (${subjects.slice(0, 2).join(', ')}) for home tuition in Gurgaon. Please share available timings.`
  );
  const whatsappUrl = `https://wa.me/919217031899?text=${whatsappMessage}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* WhatsApp Direct Inquiry Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.55rem',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '0.92rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
          transition: 'all 0.2s ease',
        }}
      >
        <MessageCircle size={18} />
        <span>Chat on WhatsApp for {tutorName.split(' ')[0]}</span>
      </a>

      {/* Share / Copy Link Button */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={handleShare}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            backgroundColor: '#F8FAFC',
            color: '#334155',
            border: '1px solid #CBD5E1',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? (
            <>
              <Check size={16} color="#059669" />
              <span style={{ color: '#059669' }}>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 size={16} color="#64748B" />
              <span>Share Profile</span>
            </>
          )}
        </button>

        <Link
          href={`/tutor/review/${tutorId}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.84rem',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Rate Tutor</span>
          <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
