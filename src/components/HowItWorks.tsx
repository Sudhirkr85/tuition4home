'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  bgColor: string;
  illustration: React.ReactNode;
  delay: number;
  isActive?: boolean;
}

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function StepCard({ stepNumber, title, description, icon, accentColor, bgColor, illustration, delay, isActive }: StepCardProps) {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(48px)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: isActive ? `2px solid ${accentColor}` : '1.5px solid #E8E8ED',
        overflow: 'hidden',
        boxShadow: isActive
          ? `0 20px 48px ${accentColor}22`
          : '0 4px 16px rgba(0,0,0,0.04)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, box-shadow 0.3s ease`,
      }}

    >
      {/* Illustration Area */}
      <div style={{
        height: '200px',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decorative circles */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${accentColor}18 0%, transparent 60%)`,
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '-20px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `1.5px dashed ${accentColor}30`,
        }} />

        {/* SVG Illustration */}
        {illustration}
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.5rem' }}>
        {/* Step Badge + Icon Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            fontSize: '0.78rem',
            fontWeight: 800,
          }}>
            Step {stepNumber}
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
        </div>

        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#1D1D1F',
          marginBottom: '0.5rem',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '0.88rem',
          color: '#515154',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// === Individual Step SVG Illustrations ===

const Step1Illustration = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Phone with location selector */}
    <rect x="45" y="20" width="70" height="120" rx="14" fill="#FFFFFF" stroke="#0F6E56" strokeWidth="2"/>
    <rect x="55" y="35" width="50" height="70" rx="6" fill="#E8F5E9"/>
    {/* Map pin icon */}
    <circle cx="80" cy="60" r="10" fill="#0F6E56"/>
    <path d="M80 70 L80 82" stroke="#0F6E56" strokeWidth="3" strokeLinecap="round"/>
    {/* Map grid lines */}
    <line x1="57" y1="55" x2="100" y2="55" stroke="#CBD5E1" strokeWidth="1"/>
    <line x1="57" y1="68" x2="100" y2="68" stroke="#CBD5E1" strokeWidth="1"/>
    <line x1="70" y1="37" x2="70" y2="103" stroke="#CBD5E1" strokeWidth="1"/>
    <line x1="85" y1="37" x2="85" y2="103" stroke="#CBD5E1" strokeWidth="1"/>
    {/* Home/Online toggle chips */}
    <rect x="55" y="112" width="22" height="8" rx="4" fill="#0F6E56"/>
    <rect x="82" y="112" width="22" height="8" rx="4" fill="#E8E8ED"/>
    {/* Pulse ring */}
    <circle cx="80" cy="60" r="16" stroke="#0F6E56" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 3"/>
  </svg>
);

const Step2Illustration = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Counselor matching visual */}
    {/* Center parent circle */}
    <circle cx="80" cy="80" r="22" fill="#2DD4BF" opacity="0.2"/>
    <circle cx="80" cy="80" r="15" fill="#0F6E56"/>
    <text x="80" y="85" textAnchor="middle" fontSize="14" fill="white">👤</text>
    {/* Connecting lines to tutors */}
    <line x1="80" y1="65" x2="80" y2="35" stroke="#0F6E56" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="67" y1="68" x2="38" y2="95" stroke="#0F6E56" strokeWidth="1.5" strokeDasharray="4 3"/>
    <line x1="93" y1="68" x2="122" y2="95" stroke="#0F6E56" strokeWidth="1.5" strokeDasharray="4 3"/>
    {/* Tutor avatars */}
    <circle cx="80" cy="25" r="14" fill="#E8F5E9" stroke="#0F6E56" strokeWidth="1.5"/>
    <text x="80" y="30" textAnchor="middle" fontSize="12" fill="#0F6E56">👩‍🏫</text>
    <circle cx="28" cy="105" r="14" fill="#E8F5E9" stroke="#0F6E56" strokeWidth="1.5"/>
    <text x="28" y="110" textAnchor="middle" fontSize="12" fill="#0F6E56">👨‍🏫</text>
    <circle cx="132" cy="105" r="14" fill="#E8F5E9" stroke="#0F6E56" strokeWidth="1.5"/>
    <text x="132" y="110" textAnchor="middle" fontSize="12" fill="#0F6E56">👩‍🔬</text>
    {/* Distance labels */}
    <rect x="52" y="38" width="30" height="10" rx="5" fill="#0F6E56"/>
    <text x="67" y="46" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">1.2 km</text>
    {/* Verified check */}
    <circle cx="90" cy="17" r="7" fill="#047857"/>
    <path d="M86 17 L89 20 L94 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Step3Illustration = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Laptop/video screen trial class */}
    <rect x="25" y="45" width="110" height="75" rx="10" fill="#FFFFFF" stroke="#0F6E56" strokeWidth="2"/>
    <rect x="33" y="53" width="94" height="59" rx="6" fill="#E8F5E9"/>
    {/* Video screen split - tutor and student */}
    <rect x="35" y="55" width="44" height="55" rx="4" fill="#0F6E56" opacity="0.9"/>
    <rect x="83" y="55" width="42" height="55" rx="4" fill="#047857" opacity="0.8"/>
    {/* Tutor emoji */}
    <text x="57" y="90" textAnchor="middle" fontSize="22" fill="white">👩‍🏫</text>
    {/* Student emoji */}
    <text x="104" y="90" textAnchor="middle" fontSize="18" fill="white">🧑‍💻</text>
    {/* Laptop base */}
    <path d="M10 122 L150 122" stroke="#E8E8ED" strokeWidth="1.5"/>
    <rect x="25" y="120" width="110" height="6" rx="3" fill="#E8E8ED"/>
    {/* Trial badge */}
    <rect x="55" y="132" width="50" height="14" rx="7" fill="#0F6E56"/>
    <text x="80" y="142" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">FREE TRIAL CLASS</text>
    {/* Stars */}
    <text x="45" y="48" fontSize="10" fill="#F59E0B">★★★★★</text>
  </svg>
);

const Step4Illustration = () => (
  <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Confirmation / Certificate illustration */}
    {/* Document */}
    <rect x="35" y="25" width="90" height="115" rx="12" fill="#FFFFFF" stroke="#047857" strokeWidth="2"/>
    {/* Header strip */}
    <rect x="35" y="25" width="90" height="30" rx="12" fill="#047857"/>
    <rect x="35" y="45" width="90" height="10" fill="#047857"/>
    <text x="80" y="45" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">CONFIRMED</text>
    {/* Checklist items */}
    <circle cx="52" cy="75" r="6" fill="#047857"/>
    <path d="M49 75 L51 77 L55 72" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="62" y="71" width="50" height="5" rx="2.5" fill="#E8E8ED"/>
    <rect x="62" y="78" width="35" height="4" rx="2" fill="#D1FAE5"/>

    <circle cx="52" cy="95" r="6" fill="#047857"/>
    <path d="M49 95 L51 97 L55 92" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="62" y="91" width="50" height="5" rx="2.5" fill="#E8E8ED"/>
    <rect x="62" y="98" width="40" height="4" rx="2" fill="#D1FAE5"/>

    <circle cx="52" cy="115" r="6" fill="#047857"/>
    <path d="M49 115 L51 117 L55 112" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="62" y="111" width="50" height="5" rx="2.5" fill="#E8E8ED"/>
    <rect x="62" y="118" width="30" height="4" rx="2" fill="#D1FAE5"/>

    {/* Big check seal */}
    <circle cx="115" cy="125" r="18" fill="#047857"/>
    <circle cx="115" cy="125" r="14" fill="none" stroke="white" strokeWidth="1.5"/>
    <path d="M108 125 L113 130 L122 120" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HowItWorks({ onOpenBooking }: { onOpenBooking: () => void }) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      stepNumber: 1,
      title: 'Select Mode & Your Sector',
      description: 'Choose Home Visit or Online 1-on-1. Enter your Gurgaon sector — or tap GPS for instant auto-detection.',
      icon: <MapPin size={18} />,
      accentColor: '#0F6E56',
      bgColor: 'linear-gradient(135deg, #E8F5E9 0%, #F0FDF4 100%)',
      illustration: <Step1Illustration />,
      delay: 0,
    },
    {
      stepNumber: 2,
      title: 'Counselor Proximity Match',
      description: 'SSSAM Academy shortlists 3 verified tutors living within 3.5 km of your sector — matched in under 6 hours.',
      icon: <Users size={18} />,
      accentColor: '#0891B2',
      bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)',
      illustration: <Step2Illustration />,
      delay: 150,
      isActive: true,
    },
    {
      stepNumber: 3,
      title: 'Attend 1-on-1 Free Trial',
      description: 'Meet your matched tutor. Evaluate teaching style, pace, and conceptual clarity — entirely free, zero obligation.',
      icon: <Sparkles size={18} />,
      accentColor: '#7C3AED',
      bgColor: 'linear-gradient(135deg, #EDE9FE 0%, #F5F3FF 100%)',
      illustration: <Step3Illustration />,
      delay: 300,
    },
    {
      stepNumber: 4,
      title: 'Confirm & Start Regular Sessions',
      description: 'Happy? Confirm and start regular classes. 100% free replacement guarantee if dissatisfied at any point.',
      icon: <CheckCircle2 size={18} />,
      accentColor: '#047857',
      bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
      illustration: <Step4Illustration />,
      delay: 450,
    },
  ];

  return (
    <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: '#F8FAFB' }}>
      <div className="container">
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 3.5rem auto',
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div className="badge badge-blue" style={{ marginBottom: '0.85rem' }}>
            <span>SIMPLE 4-STEP PROCESS</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#1D1D1F',
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
          }}>
            From Enquiry to First Class <span style={{ color: '#0F6E56' }}>in 24 Hours</span>
          </h2>
          <p style={{ color: '#515154', fontSize: '1rem', lineHeight: 1.65 }}>
            No complex paperwork. No advance payment. Just tell us your Gurgaon sector and let SSSAM Academy counselors do the matching.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}>
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>

        {/* Connector CTA Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          padding: '2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1.5px solid #E8E8ED',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1D1D1F' }}>
              Ready to get started?
            </div>
            <div style={{ fontSize: '0.88rem', color: '#515154', marginTop: '2px' }}>
              Trial class is free. No advance payment required.
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenBooking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.85rem 2rem',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: '#0F6E56',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(15,110,86,0.28)',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(15,110,86,0.35)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 14px rgba(15,110,86,0.28)';
            }}
          >
            <span>Request Free Trial Class</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
