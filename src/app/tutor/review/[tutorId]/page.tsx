'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Phone,
  Send,
  MessageSquare,
  Sparkles,
  BookOpen,
  Award,
  ArrowRight,
  LogIn,
  UserCheck
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ReviewItem {
  id: string;
  parentName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerId?: string | null;
  reviewer?: {
    id: string;
    name: string;
    image?: string | null;
    role?: string;
  } | null;
}

export default function TutorPublicReviewPage({
  params
}: {
  params: { tutorId: string };
}) {
  const tutorId = params.tutorId;
  const { data: authSession } = useSession();

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(5.0);

  // Submit Review Form
  const [parentName, setParentName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [parentSession, setParentSession] = useState<{ userId: string; name: string; email: string } | null>(null);

  useEffect(() => {
    // 1. Read logged-in parent session from localStorage
    const rawParent = localStorage.getItem('parent_session');
    if (rawParent) {
      try {
        const parsed = JSON.parse(rawParent);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('parent_session');
        } else {
          setParentSession(parsed);
          setParentName(parsed.name || '');
        }
      } catch {}
    } else if (authSession?.user?.email) {
      // Fallback: If logged in via NextAuth Google session
      const fallbackSession = {
        userId: (authSession.user as any).id || (authSession.user as any).sub || authSession.user.email,
        name: authSession.user.name || 'Parent',
        email: authSession.user.email,
      };
      setParentSession(fallbackSession);
      setParentName(fallbackSession.name);
      try {
        localStorage.setItem('parent_session', JSON.stringify({
          ...fallbackSession,
          loginAt: Date.now(),
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        }));
      } catch {}
    }

    if (!tutorId) return;

    // 2. Fetch tutor profile data
    fetch(`/api/tutors/profile/setup?userId=${encodeURIComponent(tutorId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setTutor(data.profile);
        } else {
          setErrorMsg('Tutor profile not found or is currently private.');
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg('Unable to load tutor profile.');
        setLoading(false);
      });

    // 3. Fetch reviews
    fetch(`/api/tutors/reviews?userId=${encodeURIComponent(tutorId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews || []);
          if (data.averageRating > 0) setAverageRating(data.averageRating);
        }
      })
      .catch(() => {});
  }, [tutorId, authSession]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parentSession) {
      setSubmitError('Parent login required to post a verified review. Please log in first.');
      return;
    }

    if (!parentName.trim() || !comment.trim()) {
      setSubmitError('Please fill in your name and review comment.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/tutors/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: tutorId,
          reviewerId: parentSession.userId,
          parentName: parentName.trim(),
          rating,
          comment: comment.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setSubmitSuccess(true);
        setComment('');
        setRating(5);
      } else {
        setSubmitError(data.error || 'Failed to submit review.');
      }
    } catch {
      setSubmitError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading verified tutor profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg || !tutor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
          <div style={{ maxWidth: '460px', width: '100%', backgroundColor: '#FFFFFF', padding: '2.5rem 1.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-hairline)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Profile Not Available</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{errorMsg || 'This educator profile is not active.'}</p>
            <a href="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>Return to Homepage</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tutorName = tutor.user?.name || 'Verified Educator';
  const qualifications = tutor.qualifications || [];
  const experiences = tutor.experiences || [];
  const subjects = tutor.subjects || [];
  const classes = tutor.classes || [];
  const boards = tutor.boards || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main className="tutor-review-main">
        {/* Responsive CSS styles */}
        <style jsx global>{`
          .tutor-review-main {
            flex: 1;
            padding: 2rem 1rem;
            max-width: 1040px;
            width: 100%;
            margin: 0 auto;
            box-sizing: border-box;
          }
          .tutor-review-header-card {
            background-color: #FFFFFF;
            border-radius: 20px;
            padding: 1.75rem;
            border: 1.5px solid var(--border-hairline);
            box-shadow: 0 8px 30px rgba(13, 148, 136, 0.04);
            margin-bottom: 1.75rem;
            position: relative;
            overflow: hidden;
          }
          .tutor-review-header-flex {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1.25rem;
          }
          .tutor-review-profile-info {
            display: flex;
            align-items: center;
            gap: 1.25rem;
            flex-wrap: wrap;
            flex: 1;
            min-width: 280px;
          }
          .tutor-review-cta-wrap {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 200px;
          }
          .tutor-review-grid {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 1.75rem;
            align-items: flex-start;
            width: 100%;
          }
          .tutor-review-card {
            background-color: #FFFFFF;
            border-radius: 20px;
            padding: 1.5rem;
            border: 1.5px solid var(--border-hairline);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
            box-sizing: border-box;
          }
          .tutor-star-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.35rem;
            min-width: 36px;
            min-height: 36px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.15s ease;
          }
          .tutor-star-btn:hover {
            transform: scale(1.15);
          }
          @media (max-width: 880px) {
            .tutor-review-main {
              padding: 1.25rem 0.85rem !important;
            }
            .tutor-review-header-card {
              padding: 1.25rem !important;
              border-radius: 16px !important;
            }
            .tutor-review-grid {
              grid-template-columns: 1fr !important;
              gap: 1.25rem !important;
            }
            .tutor-review-cta-wrap {
              width: 100% !important;
            }
            .tutor-review-card {
              padding: 1.25rem !important;
              border-radius: 16px !important;
            }
            .tutor-review-profile-info {
              gap: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .tutor-review-main {
              padding: 1rem 0.65rem !important;
            }
            .tutor-review-header-card {
              padding: 1rem !important;
            }
            .tutor-avatar-img, .tutor-avatar-fallback {
              width: 72px !important;
              height: 72px !important;
            }
          }
        `}</style>
        
        {/* Top Verified Header Card */}
        <div className="tutor-review-header-card">
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, var(--brand-teal), #2563EB)'
          }} />

          <div className="tutor-review-header-flex">
            <div className="tutor-review-profile-info">
              {tutor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tutor.avatarUrl}
                  alt={tutorName}
                  className="tutor-avatar-img"
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--brand-teal)',
                    boxShadow: '0 6px 20px rgba(13, 148, 136, 0.15)',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div
                  className="tutor-avatar-fallback"
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-teal)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 900,
                    flexShrink: 0
                  }}
                >
                  {tutorName.charAt(0)}
                </div>
              )}

              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                    {tutorName}
                  </h1>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    border: '1px solid #A7F3D0'
                  }}>
                    <ShieldCheck size={14} />
                    <span>SSSAM VERIFIED EDUCATOR</span>
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0.35rem 0 0.5rem 0' }}>
                  {tutor.highestDegree || 'Senior Educator'} • {tutor.experienceYears || 3}+ Years Teaching Experience
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {reviews.length > 0 ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D97706', fontWeight: 800 }}>
                      <Star size={15} fill="#D97706" />
                      <span>{averageRating} ({reviews.length} {reviews.length === 1 ? 'Verified Review' : 'Verified Reviews'})</span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#047857', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '0.15rem 0.55rem', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                      <Sparkles size={13} color="#059669" />
                      <span>New Verified Educator</span>
                    </span>
                  )}
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} style={{ color: 'var(--brand-teal)' }} />
                    <span>Gurgaon ({tutor.travelRadiusKm || 5} KM Radius)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Trial Booking CTA */}
            <div className="tutor-review-cta-wrap">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hello TuitionForHome Counselor! I would like to request 1-on-1 home tuition classes with tutor ${tutorName} (ID: TFH-${tutorId.slice(0, 6).toUpperCase()}) in Gurgaon.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.8rem 1.25rem',
                  fontSize: '0.88rem',
                  backgroundColor: 'var(--brand-teal)',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <Phone size={16} />
                <span>Book 1-on-1 Trial Class</span>
              </a>

              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', textAlign: 'center' }}>
                Center Helpline: <strong>+91 92170 31899</strong>
              </span>
            </div>
          </div>

          {/* Subjects and Classes Tags */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                Subjects Taught
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {subjects.map((sub: string) => (
                  <span key={sub} style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--brand-teal-light)',
                    color: 'var(--brand-teal)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {classes.length > 0 && (
              <div>
                <strong style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                  Target Classes &amp; Boards
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {classes.map((cls: string) => (
                    <span key={cls} style={{ fontSize: '0.72rem', fontWeight: 650, backgroundColor: '#F1F5F9', color: 'var(--text-main)', padding: '0.18rem 0.5rem', borderRadius: '6px' }}>
                      {cls}
                    </span>
                  ))}
                  {boards.map((b: string) => (
                    <span key={b} style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.18rem 0.5rem', borderRadius: '6px' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="tutor-review-grid">
          
          {/* Left Column: Bio, Qualifications & Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Bio Card */}
            {tutor.bio && (
              <div className="tutor-review-card">
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.65rem' }}>
                  About the Educator
                </strong>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                  {tutor.bio}
                </p>
              </div>
            )}

            {/* Academic Qualifications Timeline */}
            <div className="tutor-review-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--brand-teal)' }} />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Education &amp; Qualifications
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {qualifications.map((q: any) => (
                  <div key={q.id || q.degree} style={{ padding: '0.8rem 0.95rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 800 }}>{q.degree}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{q.institute}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem', display: 'inline-block' }}>{q.year} {q.grade ? `• ${q.grade}` : ''}</span>
                  </div>
                ))}

                {qualifications.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Degree details verified by SSSAM Academic Desk.</span>
                )}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="tutor-review-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Briefcase size={18} style={{ color: '#2563EB' }} />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Teaching Experience
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {experiences.map((exp: any) => (
                  <div key={exp.id || exp.role} style={{ padding: '0.8rem 0.95rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <strong style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 800 }}>{exp.role}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{exp.organization}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem', display: 'inline-block' }}>{exp.startYear} – {exp.endYear || 'Present'}</span>
                    {exp.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', lineHeight: 1.45 }}>{exp.description}</p>
                    )}
                  </div>
                ))}

                {experiences.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Classroom &amp; 1-on-1 tutoring experience verified by SSSAM Academy.</span>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Review Submission Form & Past Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Submit Review Form Card */}
            <div className="tutor-review-card" style={{ borderTop: '4px solid var(--brand-teal)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} style={{ color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)', fontWeight: 800 }}>
                    Rate &amp; Review This Educator
                  </strong>
                </div>

                {parentSession && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '999px',
                    border: '1px solid #BFDBFE'
                  }}>
                    <ShieldCheck size={13} />
                    <span>Verified Parent</span>
                  </span>
                )}
              </div>

              {!parentSession ? (
                <div style={{
                  padding: '1.35rem 1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '16px',
                  border: '1.5px solid #CBD5E1',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                    border: '1px solid #BFDBFE',
                  }}>
                    <UserCheck size={24} />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    Parent Verification Required to Post Review
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1.15rem 0' }}>
                    To ensure 100% genuine feedback from real students and parents, reviews require a quick, secure sign-in.
                  </p>
                  <Link
                    href={`/parent/login?redirectTo=${encodeURIComponent(`/tutor/review/${tutorId}`)}`}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: '#0F6E56',
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.8rem 1rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <LogIn size={16} />
                    <span>Login as Parent / Get OTP</span>
                  </Link>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.65rem', display: 'block' }}>
                    Instant access via Email OTP or Google 1-Click
                  </span>
                </div>
              ) : (
                <>
                  <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', fontSize: '0.78rem', color: '#0F766E', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <ShieldCheck size={15} style={{ flexShrink: 0 }} />
                    <span>Posting as verified parent <strong>{parentSession.name}</strong> ({parentSession.email})</span>
                  </div>

                  {submitSuccess && (
                    <div style={{ padding: '0.85rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', color: '#065F46', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      🎉 Thank you! Your verified parent review has been published.
                    </div>
                  )}

                  {submitError && (
                    <div style={{ padding: '0.85rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', color: '#991B1B', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Your Name (Parent / Student) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mrs. Sharma (Sector 56)"
                        className="form-control"
                        style={{ height: '44px', width: '100%', boxSizing: 'border-box' }}
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Rating *</label>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className="tutor-star-btn"
                            onClick={() => setRating(star)}
                            aria-label={`Rate ${star} star`}
                          >
                            <Star
                              size={26}
                              fill={star <= rating ? '#F59E0B' : 'none'}
                              color={star <= rating ? '#F59E0B' : '#CBD5E1'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Written Review / Feedback *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Describe how the educator helped your child in understanding concepts, exam preparation, or regularity..."
                        className="form-control"
                        style={{ height: 'auto', resize: 'vertical', width: '100%', boxSizing: 'border-box' }}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.45rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        backgroundColor: 'var(--brand-teal)',
                        padding: '0.8rem 1.25rem',
                        marginTop: '0.25rem',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    >
                      <Send size={15} />
                      <span>{submitting ? 'Submitting Review...' : 'Submit Verified Parent Review'}</span>
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Approved Past Parent Reviews List */}
            <div className="tutor-review-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Verified Parent Feedback ({reviews.length})
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 800 }}>
                  ★ {averageRating} / 5.0
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} style={{ padding: '0.9rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{rev.parentName}</strong>
                        {(rev.reviewerId || rev.reviewer) && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            padding: '0.08rem 0.4rem',
                            borderRadius: '4px'
                          }}>
                            ✓ SSSAM Verified
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.15rem' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', display: 'block', marginTop: '0.35rem' }}>
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    No reviews submitted yet. Be the first parent to share feedback!
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
