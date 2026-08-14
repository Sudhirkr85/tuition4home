'use client';

import React, { useState, useEffect, use } from 'react';
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
  Award
} from 'lucide-react';

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
  params: Promise<{ tutorId: string }>;
}) {
  const resolvedParams = use(params);
  const tutorId = resolvedParams.tutorId;

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
    // Read logged-in parent session if any
    const rawParent = localStorage.getItem('parent_session');
    if (rawParent) {
      try {
        const parsed = JSON.parse(rawParent);
        setParentSession(parsed);
        setParentName(parsed.name || '');
      } catch {}
    }

    if (!tutorId) return;

    // Fetch tutor profile data
    fetch(`/api/tutors/profile/setup?userId=${tutorId}`)
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

    // Fetch reviews
    fetch(`/api/tutors/reviews?userId=${tutorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews || []);
          if (data.averageRating > 0) setAverageRating(data.averageRating);
        }
      })
      .catch(() => {});
  }, [tutorId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
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
          reviewerId: parentSession?.userId || null,
          parentName: parentName.trim(),
          rating,
          comment: comment.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setSubmitSuccess(true);
        if (!parentSession) setParentName('');
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
          <div style={{ maxWidth: '460px', width: '100%', backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '20px', textAlign: 'center', border: '1px solid var(--border-hairline)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Profile Not Available</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>{errorMsg || 'This educator profile is not active.'}</p>
            <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Return to Homepage</a>
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
  const serviceAreas = tutor.serviceAreas || [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1rem', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
        
        {/* Top Verified Header Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          border: '1.5px solid var(--border-hairline)',
          boxShadow: '0 12px 36px rgba(13, 148, 136, 0.04)',
          marginBottom: '1.75rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, var(--brand-teal), #2563EB)'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              {tutor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tutor.avatarUrl}
                  alt={tutorName}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--brand-teal)',
                    boxShadow: '0 8px 24px rgba(13, 148, 136, 0.15)',
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-teal)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {tutorName.charAt(0)}
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.55rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
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
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                    border: '1px solid #A7F3D0'
                  }}>
                    <ShieldCheck size={14} />
                    <span>SSSAM VERIFIED EDUCATOR</span>
                  </span>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.35rem 0 0.5rem 0' }}>
                  {tutor.highestDegree || 'Senior Educator'} • {tutor.experienceYears || 3}+ Years Teaching Experience
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#D97706', fontWeight: 800 }}>
                    <Star size={15} fill="#D97706" />
                    <span>{averageRating} ({reviews.length} Parent Reviews)</span>
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} style={{ color: 'var(--brand-teal)' }} />
                    <span>Gurgaon ({tutor.travelRadiusKm || 5} KM Radius)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Demo Booking CTA */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              minWidth: '220px'
            }}>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hello TuitionForHome Counselor! I would like to book a home tuition demo session with tutor ${tutorName} (ID: TFH-${tutorId.slice(0, 6).toUpperCase()}) in Gurgaon.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.88rem',
                  backgroundColor: 'var(--brand-teal)',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)'
                }}
              >
                <Phone size={16} />
                <span>Book 1-on-1 Demo</span>
              </a>

              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'center' }}>
                Helpline: <strong>+91 92170 31899</strong> (10 AM - 6 PM)
              </span>
            </div>
          </div>

          {/* Subjects and Classes Tags */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                Subjects Taught
              </strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {subjects.map((sub: string) => (
                  <span key={sub} style={{
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    backgroundColor: 'var(--brand-teal-light)',
                    color: 'var(--brand-teal)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px'
                  }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {classes.length > 0 && (
              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
                  Target Classes &amp; Boards
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {classes.map((cls: string) => (
                    <span key={cls} style={{ fontSize: '0.72rem', fontWeight: 650, backgroundColor: '#F1F5F9', color: 'var(--text-main)', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {cls}
                    </span>
                  ))}
                  {boards.map((b: string) => (
                    <span key={b} style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2-Column Content Grid: Bio & History on Left, Reviews & Form on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.75rem' }} className="profile-dashboard-layout">
          
          {/* Left Column: Bio, Qualifications & Experience */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Bio Card */}
            {tutor.bio && (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)' }}>
                <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 800, marginBottom: '0.65rem' }}>
                  About the Educator
                </strong>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                  {tutor.bio}
                </p>
              </div>
            )}

            {/* Academic Qualifications Timeline */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <GraduationCap size={18} style={{ color: 'var(--brand-teal)' }} />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Education &amp; Qualifications
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {qualifications.map((q: any) => (
                  <div key={q.id} style={{ padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 800 }}>{q.degree}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{q.institute}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'inline-block' }}>{q.year} {q.grade ? `• ${q.grade}` : ''}</span>
                  </div>
                ))}

                {qualifications.length === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Degree details verified by SSSAM Academic Desk.</span>
                )}
              </div>
            </div>

            {/* Experience Timeline */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Briefcase size={18} style={{ color: '#2563EB' }} />
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Teaching Experience
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {experiences.map((exp: any) => (
                  <div key={exp.id} style={{ padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 800 }}>{exp.role}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>{exp.organization}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem', display: 'inline-block' }}>{exp.startYear} – {exp.endYear || 'Present'}</span>
                    {exp.description && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Review Submission Form & Past Reviews */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Submit Review Form Card */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} style={{ color: 'var(--brand-teal)' }} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                    Rate &amp; Review This Educator
                  </strong>
                </div>

                {parentSession ? (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    border: '1px solid #BFDBFE'
                  }}>
                    <ShieldCheck size={12} />
                    <span>Verified Parent Active</span>
                  </span>
                ) : (
                  <Link
                    href="/parent/login"
                    style={{ fontSize: '0.74rem', color: '#2563EB', fontWeight: 700, textDecoration: 'none' }}
                  >
                    Parent Login →
                  </Link>
                )}
              </div>

              {parentSession && (
                <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', fontSize: '0.78rem', color: '#0F766E', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldCheck size={15} />
                  <span>Posting as verified parent <strong>{parentSession.name}</strong> ({parentSession.email})</span>
                </div>
              )}

              {submitSuccess && (
                <div style={{ padding: '0.85rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', color: '#065F46', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  🎉 Thank you! Your verified parent review has been submitted.
                </div>
              )}

              {submitError && (
                <div style={{ padding: '0.85rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', color: '#991B1B', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Your Name (Parent / Guardian) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Sharma (Sector 56)"
                    className="form-control"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Star Rating *</label>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          color: star <= rating ? '#F59E0B' : '#CBD5E1',
                          transition: 'transform 0.15s'
                        }}
                      >
                        <Star size={24} fill={star <= rating ? '#F59E0B' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.78rem' }}>Written Review / Feedback *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe how the educator helped your child in understanding concepts, homework, or exam scores..."
                    className="form-control"
                    style={{ height: 'auto', resize: 'vertical' }}
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
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    backgroundColor: 'var(--brand-teal)',
                    padding: '0.75rem 1.25rem',
                    marginTop: '0.25rem'
                  }}
                >
                  <Send size={14} />
                  <span>{submitting ? 'Submitting Review...' : 'Submit Parent Review'}</span>
                </button>
              </form>
            </div>

            {/* Approved Past Parent Reviews List */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  Verified Parent Feedback ({reviews.length})
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 800 }}>
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
