'use client';

import React, { useState, useRef } from 'react';
import { MapPin, Users, Sparkles, CheckCircle2, ChevronRight, ShieldCheck, Award, BookOpen, Clock, ArrowRight, Play, Volume2, VolumeX, Maximize } from 'lucide-react';
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
      {/* Illustration / Video Area */}
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
        {illustration}
      </div>

      {/* Content Area */}
      <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Step Badge + Icon Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            backgroundColor: `${accentColor}15`,
            color: accentColor,
            fontSize: '0.78rem',
            fontWeight: 800,
          }}>
            <span>STEP 0{stepNumber}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{badgeText}</span>
          </div>

          <div style={{
            width: '38px',
            height: '38px',
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

// === Realistic Indian Photography & Real Video Step Illustrations ===

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

// Video 2: In-Person Tutor Arrival & Home Visit Autoplay Looping Clip
const Step3Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0F172A', overflow: 'hidden' }}>
    <video
      src="https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:eco,f_auto/v1787649418/tuitionforhome/marketing/tuitionforhome_tutor_home_visit.mp4"
      poster="https://res.cloudinary.com/jhwajyyw/video/upload/so_2,w_800,q_auto/v1787649418/tuitionforhome/marketing/tuitionforhome_tutor_home_visit.jpg"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
    <div style={{
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      backgroundColor: 'rgba(15, 23, 42, 0.82)',
      backdropFilter: 'blur(6px)',
      color: '#FFFFFF',
      fontSize: '0.68rem',
      fontWeight: 800,
      padding: '0.2rem 0.55rem',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
      <span>LIVE HOME VISIT</span>
    </div>
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const explainerVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMute = () => {
    if (explainerVideoRef.current) {
      explainerVideoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (explainerVideoRef.current) {
      if (isPlaying) {
        explainerVideoRef.current.pause();
        setIsPlaying(false);
      } else {
        explainerVideoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (explainerVideoRef.current) {
      if (explainerVideoRef.current.requestFullscreen) {
        explainerVideoRef.current.requestFullscreen();
      }
    }
  };

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
    <section id="how-it-works" style={{ padding: '3.75rem 0 3rem 0', backgroundColor: '#F8FAFC' }}>
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
          marginBottom: '2.5rem',
        }}>
          {steps.map((step) => (
            <StepCard key={step.stepNumber} {...step} />
          ))}
        </div>

        {/* =========================================================================
            CINEMA FULLSCREEN EXPLAINER VIDEO SECTION (VIDEO 1: 80s MASTERCLASS)
            ========================================================================= */}
        <div style={{
          backgroundColor: '#0F172A',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.16)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2.5rem',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            alignItems: 'center',
          }}>
            {/* Left Info Column */}
            <div style={{ padding: 'clamp(1.75rem, 3.5vw, 2.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(15, 110, 86, 0.25)',
                color: '#34D399',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.35rem 0.8rem',
                borderRadius: '999px',
                alignSelf: 'flex-start',
                border: '1px solid rgba(52, 211, 153, 0.3)',
              }}>
                <ShieldCheck size={14} color="#34D399" />
                <span>OFFICIAL PLATFORM MASTERCLASS (80s)</span>
              </div>

              <h3 style={{
                fontSize: 'clamp(1.4rem, 2.6vw, 1.95rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.25,
                margin: 0,
              }}>
                Watch How We Screen, Audit &amp; Match Teachers for Your Child
              </h3>

              <p style={{
                fontSize: '0.92rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                margin: 0,
              }}>
                See our complete in-person verification standards, curriculum coverage for Gurgaon top schools, and zero-risk 100% replacement policy.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#0F6E56',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span>Request Home Tutor</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  onClick={handleFullscreen}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <Maximize size={15} />
                  <span>Full Screen</span>
                </button>
              </div>
            </div>

            {/* Right Video Player Column */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000', overflow: 'hidden' }}>
              <video
                ref={explainerVideoRef}
                src="https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:eco,f_auto/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.mp4"
                poster="https://res.cloudinary.com/jhwajyyw/video/upload/so_3,w_800,q_auto/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.jpg"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="metadata"
                controls
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000000',
                  display: 'block',
                }}
              />

              {/* Floating Quick Controls Bar */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 3,
              }}>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute Video' : 'Mute Video'}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} color="#34D399" />}
                </button>
              </div>
            </div>
          </div>
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
