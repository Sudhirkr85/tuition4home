'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  VERIFIED_TUTORS,
  GURGAON_LOCALITIES,
  SSSAM_OFFICE_DETAILS,
  MockTutor,
} from '@/lib/data';
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  QrCode,
  FileText,
  UserCheck,
  Users,
  Video,
  Home,
  MapPin,
  Clock,
  Play,
} from 'lucide-react';

interface MockLead {
  id: string;
  parentName: string;
  parentPhone: string;
  mode: 'OFFLINE_HOME' | 'ONLINE_LIVE';
  locality: string;
  grade: string;
  subject: string;
  status: 'NEW_LEAD' | 'DEMO_SCHEDULED' | 'TUITION_CONFIRMED' | 'COMMISSION_PAID';
  assignedTutor?: string;
  demoDate?: string;
  commissionAmount: number;
}

export default function CounselorPortal() {
  const [activeTab, setActiveTab] = useState<'LEADS' | 'INTERVIEWS' | 'INVOICE'>('LEADS');

  // Leads State
  const [leads, setLeads] = useState<MockLead[]>([
    {
      id: 'LD-101',
      parentName: 'Mrs. Ritu Verma',
      parentPhone: '9811234567',
      mode: 'OFFLINE_HOME',
      locality: 'DLF Phase 5, Gurgaon',
      grade: 'Class 10 CBSE',
      subject: 'Mathematics',
      status: 'NEW_LEAD',
      commissionAmount: 4000,
    },
    {
      id: 'LD-102',
      parentName: 'Mr. Arvind Kapoor',
      parentPhone: '9871098765',
      mode: 'OFFLINE_HOME',
      locality: 'Golf Course Road, Gurgaon',
      grade: 'Class 12 CBSE',
      subject: 'Physics & Chemistry',
      status: 'DEMO_SCHEDULED',
      assignedTutor: 'Dr. Ananya Sengupta',
      demoDate: 'Tomorrow, 5:00 PM',
      commissionAmount: 6000,
    },
    {
      id: 'LD-103',
      parentName: 'Sanjay Singhania',
      parentPhone: '9910456123',
      mode: 'ONLINE_LIVE',
      locality: 'Delhi NCR (Online)',
      grade: 'IB Diploma (Maths HL)',
      subject: 'Mathematics',
      status: 'TUITION_CONFIRMED',
      assignedTutor: 'Rohit Sharma',
      commissionAmount: 7500,
    },
  ]);

  // Pending Tutors for Interview
  const [pendingTutors, setPendingTutors] = useState<MockTutor[]>([
    {
      id: 'tut-pending-1',
      name: 'Amitabh Mukherjee',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoDuration: '1m 20s',
      highestDegree: 'M.Sc. Physics (IIT Roorkee)',
      experienceYears: 6,
      teachingMode: 'BOTH',
      subjects: ['Physics', 'Mathematics'],
      classes: ['Class 11 & 12 (Board & JEE/NEET)'],
      boards: ['CBSE', 'IB (International Baccalaureate)'],
      serviceAreas: ['DLF Phase 2', 'DLF Phase 4', 'Sector 14 & Old DLF'],
      travelRadiusKm: 6,
      hourlyRateHome: 950,
      hourlyRateOnline: 700,
      monthlyRateMin: 8000,
      isVerified: false,
      hasPoliceCheck: true,
      rating: 5.0,
      totalReviews: 0,
      bio: 'Physics enthusiast with 6 years experience mentoring students for CBSE 12th board exams and JEE Main numerical problem solving.',
      badge: 'Pending Verification',
    },
  ]);

  // Selected Lead for Invoice / Slip
  const [selectedInvoiceLead, setSelectedInvoiceLead] = useState<MockLead>(leads[2]);

  // Approve Tutor
  const handleApproveTutor = (tutorId: string) => {
    alert('🎉 Tutor Interview Cleared! Verified Pro Badge Activated & Profile is now Live in Gurgaon search catalog.');
    setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-slate-50)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 4rem 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-trust" style={{ marginBottom: '0.35rem' }}>
                <ShieldCheck size={14} color="var(--color-emerald-500)" />
                <span>SSSAM ACADEMY • COUNSELOR OPERATIONS DESK</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>
                Telecalling & Lead Management Desk
              </h1>
            </div>

            {/* Tab Switcher */}
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem',
              boxShadow: 'var(--shadow-subtle)',
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('LEADS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'LEADS' ? 'var(--color-blue-600)' : 'transparent',
                  color: activeTab === 'LEADS' ? '#FFFFFF' : 'var(--color-slate-700)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                📥 Inbound Parent Leads ({leads.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('INTERVIEWS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'INTERVIEWS' ? 'var(--color-blue-600)' : 'transparent',
                  color: activeTab === 'INTERVIEWS' ? '#FFFFFF' : 'var(--color-slate-700)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                🎓 Tutor Interviews ({pendingTutors.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('INVOICE')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'INVOICE' ? 'var(--color-blue-600)' : 'transparent',
                  color: activeTab === 'INVOICE' ? '#FFFFFF' : 'var(--color-slate-700)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                💳 Commission Generator
              </button>
            </div>
          </div>

          {/* =========================================================================
              TAB 1: INBOUND PARENT LEADS STREAM
              ========================================================================= */}
          {activeTab === 'LEADS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {leads.map((lead) => (
                <div key={lead.id} className="luxury-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: lead.mode === 'OFFLINE_HOME' ? 'var(--color-blue-50)' : 'var(--color-emerald-50)',
                        color: lead.mode === 'OFFLINE_HOME' ? 'var(--color-blue-600)' : 'var(--color-emerald-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {lead.mode === 'OFFLINE_HOME' ? <Home size={22} /> : <Video size={22} />}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{lead.parentName}</h3>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-500)' }}>
                            [{lead.id}]
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                          📍 {lead.locality} • <strong>{lead.grade} ({lead.subject})</strong>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className="badge" style={{
                      backgroundColor:
                        lead.status === 'NEW_LEAD' ? '#FEF3C7' :
                        lead.status === 'DEMO_SCHEDULED' ? '#DBEAFE' : '#D1FAE5',
                      color:
                        lead.status === 'NEW_LEAD' ? '#B45309' :
                        lead.status === 'DEMO_SCHEDULED' ? '#1D4ED8' : '#059669',
                    }}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate-600)' }}>
                      Assigned Tutor: <strong style={{ color: 'var(--color-slate-900)' }}>{lead.assignedTutor || 'Unassigned (Select Nearest)'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`tel:${lead.parentPhone}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Phone size={14} color="var(--color-emerald-600)" />
                        <span>Call: +91 {lead.parentPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${lead.parentPhone}?text=${encodeURIComponent(
                          `Hello ${lead.parentName}, this is TuitionForHome support (SSSAM Academy). We have shortlisted top verified tutors for ${lead.grade} ${lead.subject} in ${lead.locality}. When can we arrange your free demo?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: '#25D366' }}
                      >
                        <MessageSquare size={14} color="#25D366" />
                        <span>WhatsApp Slip</span>
                      </a>

                      {lead.status === 'NEW_LEAD' && (
                        <button
                          onClick={() => {
                            setLeads(leads.map((l) => l.id === lead.id ? { ...l, status: 'DEMO_SCHEDULED', assignedTutor: 'Rohit Sharma' } : l));
                            alert('Demo Scheduled with Mr. Rohit Sharma! Reminder sent to parent & tutor.');
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Calendar size={14} />
                          <span>Schedule Demo</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================================
              TAB 2: TUTOR INTERVIEWS & KYC VERIFICATION
              ========================================================================= */}
          {activeTab === 'INTERVIEWS' && (
            <div>
              {pendingTutors.length > 0 ? (
                pendingTutors.map((tutor) => (
                  <div key={tutor.id} className="luxury-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
                      {/* Left: Tutor Bio & Video */}
                      <div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tutor.avatarUrl} alt={tutor.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tutor.name}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-blue-600)', fontWeight: 600 }}>
                              {tutor.highestDegree} • {tutor.experienceYears} Yrs Exp
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.88rem', color: 'var(--color-slate-600)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                          {tutor.bio}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                          {tutor.subjects.map((s) => (
                            <span key={s} style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem', backgroundColor: 'var(--color-slate-100)', borderRadius: '6px', fontWeight: 600 }}>
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Video player preview */}
                        <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-blue-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-blue-800)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Play size={15} fill="var(--color-blue-600)" />
                            <span>Watch 60s Intro Video Submission</span>
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-blue-600)' }}>{tutor.videoDuration}</span>
                        </div>
                      </div>

                      {/* Right: Interview Scorecard & Decision */}
                      <div style={{
                        backgroundColor: 'var(--color-slate-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                      }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-slate-900)' }}>
                          Academic Interview Scorecard
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Communication (English/Hindi):</span>
                            <strong style={{ color: 'var(--color-emerald-600)' }}>9 / 10 (Clear)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subject Conceptual Depth:</span>
                            <strong style={{ color: 'var(--color-emerald-600)' }}>High (Verified)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Aadhaar ID Proof (Last 4):</span>
                            <strong>XXXX-XXXX-4589 (Checked)</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            onClick={() => handleApproveTutor(tutor.id)}
                            className="btn btn-emerald"
                            style={{ flex: 1, justifyContent: 'center' }}
                          >
                            <CheckCircle2 size={16} />
                            <span>Approve & Activate Badge</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
                  <CheckCircle2 size={48} color="var(--color-emerald-500)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>All Tutor Interviews Cleared!</h3>
                  <p style={{ color: 'var(--color-slate-600)' }}>No pending tutors in the queue right now.</p>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: DIGITAL INVOICE & UPI QR CODE GENERATOR
              ========================================================================= */}
          {activeTab === 'INVOICE' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="luxury-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>1st-Month Bureau Fee Invoice</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>Issued by SSSAM Academy Gurugram</div>
                  </div>
                  <span className="badge badge-emerald">TUITION CONFIRMED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-slate-600)' }}>Student & Parent:</span>
                    <strong>{selectedInvoiceLead.parentName} ({selectedInvoiceLead.locality})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-slate-600)' }}>Subject / Grade:</span>
                    <strong>{selectedInvoiceLead.grade} • {selectedInvoiceLead.subject}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-slate-600)' }}>Assigned Tutor:</span>
                    <strong>{selectedInvoiceLead.assignedTutor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-subtle)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bureau 50% Placement Fee:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-blue-600)' }}>
                      ₹{selectedInvoiceLead.commissionAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* QR Code Placeholder Box */}
                <div style={{
                  backgroundColor: 'var(--color-slate-50)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.75rem',
                }}>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    margin: '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-slate-900)',
                  }}>
                    <QrCode size={90} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                    Scan & Pay via UPI / GPay / PhonePe / Paytm
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-slate-500)', marginTop: '2px' }}>
                    UPI ID: <strong>sssamacademy@okaxis</strong>
                  </div>
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `*TuitionForHome (SSSAM Academy) - Commission Invoice*\nParent: ${selectedInvoiceLead.parentName}\nGrade: ${selectedInvoiceLead.grade} ${selectedInvoiceLead.subject}\nAmount: ₹${selectedInvoiceLead.commissionAmount}\nUPI ID: sssamacademy@okaxis\nPlease clear within 48 hours to maintain your Verified Tutor Pro Badge.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={16} />
                  <span>Send WhatsApp Invoice to Tutor</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
