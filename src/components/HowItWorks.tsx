'use client';

import React, { useState } from 'react';
import { MapPin, Users, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, Award, BookOpen, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StepCardProps {
  stepNumber: number;
  title: string;
  badgeText: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  illustration: React.ReactNode;
  isActive?: boolean;
}

function StepCard({ stepNumber, title, badgeText, description, icon, accentColor, bgColor, illustration, isActive }: StepCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: isHovered || isActive ? `2px solid ${accentColor}` : '1.5px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: isHovered || isActive
          ? `0 20px 40px ${accentColor}18, 0 4px 12px rgba(0,0,0,0.04)`
          : '0 4px 16px rgba(0,0,0,0.03)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0px)',
        transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Illustration Area */}
      <div style={{
        height: '210px',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
      }}>
        {/* Dynamic Card Illustration */}
        {illustration}
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Step Badge + Icon Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}>
            Step {stepNumber} • {badgeText}
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 10px ${accentColor}15`,
          }}>
            {icon}
          </div>
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '0.6rem',
          lineHeight: 1.35,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.88rem',
          color: '#64748B',
          lineHeight: 1.6,
          margin: 0,
          flex: 1,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// === Realistic Indian Photography Step Illustrations ===

const Step1Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src="/images/how-it-works/step1_location.webp"
      alt="Select Mode and Sector"
      width={600}
      height={328}
      loading="lazy"
      decoding="async"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

const Step2Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src="/images/how-it-works/step2_matching.webp"
      alt="Counselor Proximity Match"
      width={600}
      height={330}
      loading="lazy"
      decoding="async"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

const Step3Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src="/images/how-it-works/step3_teaching.webp"
      alt="1st In-Person Academic Class"
      width={600}
      height={328}
      loading="lazy"
      decoding="async"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

const Step4Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img
      src="/images/how-it-works/step4_guarantee.webp"
      alt="100% Parent Guarantee"
      width={600}
      height={328}
      loading="lazy"
      decoding="async"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  </div>
);

export default function HowItWorks({ onOpenBooking }: { onOpenBooking: () => void }) {
  const steps = [
    {
      stepNumber: 1,
      badgeText: 'Instant Sector Setup',
      title: 'Select Learning Mode & Sector',
      description: 'Choose Home Visits in your Gurgaon sector or 1-on-1 Live Online. Enter your child’s grade and subject requirements.',
      icon: <MapPin size={18} />,
      accentColor: '#0F6E56',
      bgColor: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
      illustration: <Step1Illustration />,
    },
    {
      stepNumber: 2,
      badgeText: 'Matched in < 2 Hours',
      title: 'Counselor Proximity Match',
      description: 'SSSAM Academy academic supervisor shortlists top verified faculty living within 3.5 km of your residence.',
      icon: <Users size={18} />,
      accentColor: '#0284C7',
      bgColor: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
      illustration: <Step2Illustration />,
      isActive: true,
    },
    {
      stepNumber: 3,
      badgeText: 'Zero Pressure',
      title: '1st In-Person Academic Class',
      description: 'Meet your matched educator for the 1st scheduled class at your home. Evaluate conceptual clarity and syllabus pacing.',
      icon: <BookOpen size={18} />,
      accentColor: '#7C3AED',
      bgColor: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
      illustration: <Step3Illustration />,
    },
    {
      stepNumber: 4,
      badgeText: '100% Guaranteed',
      title: 'Regular Classes & Progress Tracking',
      description: 'Continue regular sessions with weekly mock test audits, monthly parent progress reports, and 100% free tutor replacement.',
      icon: <ShieldCheck size={18} />,
      accentColor: '#047857',
      bgColor: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      illustration: <Step4Illustration />,
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '3.75rem 0 2.5rem 0', backgroundColor: '#F8FAFC' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          <div className="badge badge-emerald" style={{ marginBottom: '0.85rem' }}>
            <span>ACADEMY PLACEMENT TIMELINE</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.85rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
          }}>
            From Inquiry to First Class <span style={{ color: '#0F6E56' }}>in 24 Hours</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.02rem', lineHeight: 1.65, margin: 0 }}>
            Direct placement backed by SSSAM Academy. Verified educators, syllabus pacing, and 100% tutor replacement guarantee.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>

        {/* Bottom CTA Row */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.75rem 2rem',
          border: '1.5px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Ready to match with a top verified educator?</div>
              <div style={{ fontSize: '0.84rem', color: '#64748B' }}>Tell us your sector in Gurgaon &amp; child’s subject requirements.</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: '#0F6E56',
                padding: '0.85rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
              }}
            >
              <span>Request Home Tutor</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
