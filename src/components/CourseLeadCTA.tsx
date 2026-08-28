'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Clock, Star } from 'lucide-react';
import dynamic from 'next/dynamic';

const BookingModal = dynamic(() => import('@/components/BookingModal'), {
  ssr: false,
});

interface CourseLeadCTAProps {
  topicLabel: string;
  locationLabel: string;
  modifierBadge?: string;
  ctaText?: string;
  price?: string;
}

export default function CourseLeadCTA({
  topicLabel,
  locationLabel,
  modifierBadge,
  ctaText = 'Book 1-on-1 Free Demo Class',
  price = '₹600 - ₹1,200/hr',
}: CourseLeadCTAProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [grade, setGrade] = useState('Class 10');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleQuickLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          studentClass: grade,
          subject: topicLabel,
          locality: locationLabel,
          source: `PSEO_${locationLabel}_${topicLabel}`,
          mode: 'HOME',
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        // Fallback to opening booking modal
        setIsBookingOpen(true);
      }
    } catch {
      setIsBookingOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello SSSAM Academy! I am looking for a verified home/online tutor for ${topicLabel} in ${locationLabel}. Please share available teachers and trial class details.`
  );

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '24px',
          padding: '2.25rem',
          color: '#FFFFFF',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span
            style={{
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              color: '#60A5FA',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid rgba(96, 165, 250, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Sparkles size={14} />
            {modifierBadge || 'Instant Tutor Matching'}
          </span>
          <span
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Star size={14} fill="#34D399" />
            100% Free Trial
          </span>
        </div>

        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3 }}>
          Request a Verified {topicLabel} Tutor in {locationLabel}
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          1-on-1 personalized classes starting at <strong style={{ color: '#38BDF8' }}>{price}</strong>.
          Audited by SSSAM Academy with 100% free teacher replacement guarantee.
        </p>

        {isSubmitted ? (
          <div
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '1.5rem',
              textAlign: 'center',
            }}
          >
            <CheckCircle2 size={36} color="#34D399" style={{ margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#34D399', marginBottom: '0.5rem' }}>
              Trial Class Request Received!
            </h4>
            <p style={{ color: '#E2E8F0', fontSize: '0.92rem' }}>
              Our senior academic counselor from SSSAM Academy will call you within 15 minutes with top-matched teacher profiles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleQuickLead} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Student Class / Grade
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                >
                  <option value="Class 1-5">Class 1 to 5 (Primary)</option>
                  <option value="Class 6-8">Class 6 to 8 (Middle)</option>
                  <option value="Class 9">Class 9 (CBSE / ICSE / IB)</option>
                  <option value="Class 10">Class 10 (Board Exam)</option>
                  <option value="Class 11">Class 11 (Science / Comm)</option>
                  <option value="Class 12">Class 12 (Board / JEE / NEET)</option>
                  <option value="Coding / Skill">Coding & Tech Skills</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '0.35rem' }}>
                  Parent Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.9rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1.05rem',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.2s',
                marginTop: '0.5rem',
              }}
            >
              {isSubmitting ? 'Submitting...' : ctaText}
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <a
            href={`https://wa.me/919217031899?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#22C55E',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={17} />
            WhatsApp Counselors (Instant)
          </a>

          <a
            href="tel:+919217031899"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#93C5FD',
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Phone size={17} />
            Call +91 92170 31899
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            marginTop: '1.25rem',
            fontSize: '0.8rem',
            color: '#64748B',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="#3B82F6" /> Aadhaar KYC Verified
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} color="#3B82F6" /> Matches in 24 Hours
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={14} color="#3B82F6" /> ₹0 Registration Fee
          </span>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          initialData={{
            subject: topicLabel,
            locality: locationLabel,
            mode: 'HOME',
          }}
        />
      )}
    </>
  );
}
