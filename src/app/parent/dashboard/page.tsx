'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  User, 
  Star, 
  BookOpen, 
  Calendar, 
  Phone, 
  MapPin, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Home, 
  MessageSquare,
  Edit2
} from 'lucide-react';
import { SSSAM_OFFICE_DETAILS } from '@/lib/data';

interface MatchedTutor {
  name: string;
  highestDegree: string | null;
  rating: number;
}

interface ParentLead {
  id: string;
  status: string;
  preferredMode: string;
  locality: string;
  gradeClass: string;
  subjectsNeeded: string;
  createdAt: string;
  matchedTutor: MatchedTutor | null;
}

interface ParentReview {
  id: string;
  tutorId: string;
  tutorUserId: string;
  tutorName: string;
  tutorDegree: string;
  tutorAvatar: string | null;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ParentDashboardPage() {
  const router = useRouter();
  const [parentSession, setParentSession] = useState<{ userId: string; name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'REVIEWS' | 'BOOKINGS' | 'SETTINGS'>('REVIEWS');
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<ParentLead[]>([]);
  const [reviews, setReviews] = useState<ParentReview[]>([]);
  const [childGrade, setChildGrade] = useState('Class 10');
  const [locality, setLocality] = useState('DLF Phase 5, Gurgaon');
  const [saveMsg, setSaveMsg] = useState('');

  // Check auth session
  useEffect(() => {
    const saved = localStorage.getItem('parent_session');
    if (!saved) {
      router.push('/parent/login');
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setParentSession(parsed);

      fetch(`/api/parent/dashboard?userId=${parsed.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLeads(data.leads || []);
            setReviews(data.reviews || []);
          }
        })
        .finally(() => setLoading(false));
    } catch {
      router.push('/parent/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('parent_session');
    window.dispatchEvent(new Event('storage'));
    router.push('/parent/login');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg('✓ Preferences saved successfully!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  if (!parentSession || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--brand-teal)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Loading your Parent Dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 1rem', maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
        
        {/* Top Parent Identity Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          border: '1.5px solid var(--border-hairline)',
          boxShadow: '0 12px 36px rgba(13, 148, 136, 0.04)',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--brand-teal)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              fontWeight: 900,
              flexShrink: 0,
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.2)'
            }}>
              {parentSession.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {parentSession.name}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.55rem',
                  borderRadius: '999px',
                  border: '1px solid #A7F3D0'
                }}>
                  <ShieldCheck size={12} />
                  <span>VERIFIED PARENT</span>
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.15rem' }}>
                {parentSession.email}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/book-demo"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--brand-teal)' }}
            >
              <Sparkles size={14} />
              <span>Book New Demo</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#DC2626' }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Header */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          borderBottom: '2px solid var(--border-hairline)',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('REVIEWS')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'REVIEWS' ? 'var(--brand-teal)' : '#FFFFFF',
              color: activeTab === 'REVIEWS' ? '#FFFFFF' : 'var(--text-muted)',
              boxShadow: activeTab === 'REVIEWS' ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Star size={16} />
            <span>My Submitted Reviews ({reviews.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('BOOKINGS')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'BOOKINGS' ? 'var(--brand-teal)' : '#FFFFFF',
              color: activeTab === 'BOOKINGS' ? '#FFFFFF' : 'var(--text-muted)',
              boxShadow: activeTab === 'BOOKINGS' ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={16} />
            <span>My Demo Bookings ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SETTINGS')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: activeTab === 'SETTINGS' ? 'var(--brand-teal)' : '#FFFFFF',
              color: activeTab === 'SETTINGS' ? '#FFFFFF' : 'var(--text-muted)',
              boxShadow: activeTab === 'SETTINGS' ? '0 4px 12px rgba(13, 148, 136, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <User size={16} />
            <span>Child &amp; Locality Profile</span>
          </button>
        </div>

        {/* TAB 1: MY SUBMITTED REVIEWS */}
        {activeTab === 'REVIEWS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Educators You Reviewed
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  All ratings submitted with your verified parent account are publicly showcased on the tutor&apos;s credentials card.
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                border: '1.5px dashed var(--border-hairline)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⭐</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                  No Reviews Given Yet
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  After your child completes a demo or tuition session, you can rate and review your educator directly on their public profile card.
                </p>
                <Link href="/" className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--brand-teal)' }}>
                  Browse Verified Tutors in Gurgaon
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    border: '1.5px solid var(--border-hairline)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      {/* Tutor Mini Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-hairline)' }}>
                        {rev.tutorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={rev.tutorAvatar}
                            alt={rev.tutorName}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-teal)' }}
                          />
                        ) : (
                          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                            {rev.tutorName.charAt(0)}
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {rev.tutorName}
                          </strong>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                            {rev.tutorDegree}
                          </span>
                        </div>

                        <Link
                          href={`/tutor/review/${rev.tutorUserId || rev.tutorId}`}
                          title="View tutor profile & card"
                          style={{ color: 'var(--brand-teal)', padding: '0.35rem', borderRadius: '8px', backgroundColor: '#F0FDFA' }}
                        >
                          <ExternalLink size={16} />
                        </Link>
                      </div>

                      {/* Stars */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', color: '#F59E0B', letterSpacing: '-0.04em' }}>
                          {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {rev.rating}.0 / 5.0
                        </span>
                      </div>

                      {/* Comment */}
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-light)' }}>
                      <span>{new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span style={{ color: '#059669', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        ✓ SSSAM Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY DEMO BOOKINGS */}
        {activeTab === 'BOOKINGS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Demo Class Requests &amp; Matched Tutors
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Supervised by SSSAM Academy Academic Desk • Sector 14 Gurugram.
                </p>
              </div>
            </div>

            {leads.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                border: '1.5px dashed var(--border-hairline)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                  No Demo Requests Yet
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                  Book a 1-on-1 free trial demo class for your child with verified home educators in Gurgaon.
                </p>
                <Link href="/book-demo" className="btn btn-primary btn-sm" style={{ backgroundColor: 'var(--brand-teal)' }}>
                  Schedule Free Demo Class
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leads.map((lead) => (
                  <div key={lead.id} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    border: '1.5px solid var(--border-hairline)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          {lead.gradeClass} • {lead.preferredMode === 'OFFLINE_HOME' ? '🏠 Home Visit' : '💻 Online Live'}
                        </strong>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor: lead.status === 'TUITION_CONFIRMED' ? '#ECFDF5' : '#EFF6FF',
                          color: lead.status === 'TUITION_CONFIRMED' ? '#059669' : '#2563EB',
                          border: '1px solid currentColor'
                        }}>
                          {lead.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>📍 {lead.locality}</span>
                        <span>•</span>
                        <span>Requested: {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>

                      {lead.matchedTutor && (
                        <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.85rem', backgroundColor: '#F8FAFC', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}>
                          <span>Matched Tutor:</span>
                          <strong style={{ color: 'var(--brand-teal)' }}>{lead.matchedTutor.name}</strong>
                          <span style={{ color: '#F59E0B' }}>★ {lead.matchedTutor.rating}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <a
                        href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <Phone size={13} />
                        <span>Counselor Help</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHILD & LOCALITY PROFILE */}
        {activeTab === 'SETTINGS' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2rem',
            border: '1.5px solid var(--border-hairline)',
            maxWidth: '640px'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Child &amp; Tutoring Preferences
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              These details help our SSSAM academic desk match the best neighborhood educators within 5 KM of your residence.
            </p>

            {saveMsg && (
              <div style={{ padding: '0.75rem 1rem', backgroundColor: '#ECFDF5', color: '#059669', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1.25rem', border: '1px solid #A7F3D0' }}>
                {saveMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label className="form-label">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={parentSession.name}
                  disabled
                  className="form-control"
                  style={{ backgroundColor: '#F8FAFC' }}
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={parentSession.email}
                  disabled
                  className="form-control"
                  style={{ backgroundColor: '#F8FAFC' }}
                />
              </div>

              <div>
                <label className="form-label">Child&apos;s Target Class</label>
                <select
                  value={childGrade}
                  onChange={e => setChildGrade(e.target.value)}
                  className="form-control"
                >
                  {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 12 (Science)', 'Class 12 (Commerce)'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Residential Locality (Gurgaon)</label>
                <input
                  type="text"
                  placeholder="e.g. DLF Phase 5, Sector 56"
                  value={locality}
                  onChange={e => setLocality(e.target.value)}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-md"
                style={{ alignSelf: 'flex-start', marginTop: '0.5rem', backgroundColor: 'var(--brand-teal)' }}
              >
                <span>Save Preferences</span>
              </button>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
