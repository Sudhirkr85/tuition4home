'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
    <Image
      src="/images/how-it-works/step1_location.webp"
      alt="Select Mode and Sector"
      width={600}
      height={328}
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
    <Image
      src="/images/how-it-works/step2_matching.webp"
      alt="Counselor Proximity Match"
      width={600}
      height={330}
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
const Step3Illustration = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0F172A', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src="https://res.cloudinary.com/jhwajyyw/video/upload/v1787651802/tuitionforhome/marketing/tuitionforhome_tutor_home_visit_hq.mp4"
        poster="https://res.cloudinary.com/jhwajyyw/video/upload/so_2,w_800/v1787651802/tuitionforhome/marketing/tuitionforhome_tutor_home_visit_hq.jpg"
        autoPlay
        loop
        muted={isMuted}
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

      {/* Clickable Sound Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (videoRef.current) {
            const nextMuted = !videoRef.current.muted;
            videoRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
          }
        }}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease, background-color 0.2s ease',
        }}
      >
        {isMuted ? <VolumeX size={15} color="#FFFFFF" /> : <Volume2 size={15} color="#10B981" />}
      </button>
    </div>
  );
};

const Step4Illustration = () => (
  <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Image
      src="/images/how-it-works/step4_guarantee.webp"
      alt="100% Parent Guarantee"
      width={600}
      height={328}
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
  const [isWalkthroughMuted, setIsWalkthroughMuted] = useState(true);
  const walkthroughVideoRef = useRef<HTMLVideoElement | null>(null);

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
            CINEMA RESPONSIVE SHOWCASE (DESKTOP: 2-COL | TAB/MOBILE: 1-COL)
            ========================================================================= */}
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 55%, #F8FAFC 100%)',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.06)',
          border: '1.5px solid #E2E8F0',
          padding: 'clamp(1.75rem, 4.5vw, 3.25rem)',
          marginBottom: '2.5rem',
        }}>
          <div className="how-it-works-showcase-grid">
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                fontSize: '0.76rem',
                fontWeight: 800,
                padding: '0.35rem 0.8rem',
                borderRadius: '999px',
                alignSelf: 'flex-start',
                border: '1px solid #A7F3D0',
                letterSpacing: '0.04em',
              }}>
                <ShieldCheck size={14} />
                <span>HOW SSSAM ACADEMY WORKS</span>
              </div>

              <h3 style={{
                fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.22,
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Watch How We Screen &amp; Match the Right Teacher for Your Child
              </h3>

              <p style={{
                fontSize: '0.96rem',
                color: '#475569',
                lineHeight: 1.65,
                margin: 0,
              }}>
                From in-person document screening at our Sector 14 center to customized curriculum pacing for CBSE, ICSE &amp; IB boards.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <CheckCircle2 size={17} color="#059669" />
                  <span>3-Stage verification: Aadhaar, degrees &amp; video teaching audition</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <CheckCircle2 size={17} color="#059669" />
                  <span>Direct WhatsApp match with tutor intro video in under 2 hours</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <CheckCircle2 size={17} color="#059669" />
                  <span>100% Free replacement guarantee with no lock-in contract</span>
                </div>
              </div>
            </div>

            {/* Right Video Mockup Column (16:9 Studio Screen) */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '24px',
                backgroundColor: '#0F172A',
                padding: '8px',
                boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
                border: '3px solid #1E293B',
              }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#000000',
                }}>
                  <video
                    ref={walkthroughVideoRef}
                    src="https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:best,f_auto/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.mp4"
                    poster="https://res.cloudinary.com/jhwajyyw/video/upload/so_3,w_800,q_auto:best/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.jpg"
                    autoPlay
                    loop
                    muted={isWalkthroughMuted}
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Floating Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (walkthroughVideoRef.current) {
                        const nextMuted = !walkthroughVideoRef.current.muted;
                        walkthroughVideoRef.current.muted = nextMuted;
                        setIsWalkthroughMuted(nextMuted);
                      }
                    }}
                    aria-label={isWalkthroughMuted ? 'Unmute video' : 'Mute video'}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 5,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {isWalkthroughMuted ? <VolumeX size={17} color="#FFFFFF" /> : <Volume2 size={17} color="#10B981" />}
                  </button>

                  {/* Live Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                    <span>TuitionForHome Platform Tour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Row (Centered on Mobile, Row on Desktop) */}
        <div
          className="how-it-works-bottom-cta"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: 'clamp(1.5rem, 3.5vw, 2rem)',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          }}
        >
          <div className="how-it-works-bottom-cta-info">
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Ready to match with a top verified educator?</div>
              <div style={{ fontSize: '0.84rem', color: '#64748B' }}>Tell us your sector in Gurgaon &amp; child’s subject requirements.</div>
            </div>
          </div>

          <div className="how-it-works-bottom-cta-btn-wrap">
            <button
              type="button"
              onClick={onOpenBooking}
              className="btn btn-primary btn-lg"
              style={{
                backgroundColor: '#0F6E56',
                padding: '0.85rem 1.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                borderRadius: '14px',
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
