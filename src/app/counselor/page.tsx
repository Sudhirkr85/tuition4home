'use client';

import React, { useState, useEffect } from 'react';
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
  Calendar,
  Sparkles,
  QrCode,
  UserCheck,
  Video,
  Home,
  MapPin,
  Play,
  Plus,
} from 'lucide-react';

interface MockLead {
  id: string;
  parentName: string;
  parentPhone: string;
  mode: 'OFFLINE_HOME' | 'ONLINE_LIVE';
  locality: string;
  grade: string;
  subject: string;
  budgetRange: string;
  status: 'NEW_LEAD' | 'TRIAL_SCHEDULED' | 'TUITION_CONFIRMED' | 'COMMISSION_PAID';
  assignedTutor?: string;
  trialDate?: string;
  commissionAmount: number;
}

export default function CounselorPortal() {
  const [activeTab, setActiveTab] = useState<'LEADS' | 'INTERVIEWS' | 'INVOICE'>('LEADS');
  const [dbLoading, setDbLoading] = useState(false);

  // Leads State with budget preferences
  const [leads, setLeads] = useState<MockLead[]>([
    {
      id: 'LD-101',
      parentName: 'Mrs. Ritu Verma',
      parentPhone: '9811234567',
      mode: 'OFFLINE_HOME',
      locality: 'DLF Phase 5, Gurgaon',
      grade: 'Class 10 CBSE',
      subject: 'Mathematics',
      budgetRange: '₹6,000 – ₹10,000 / month',
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
      budgetRange: '₹8,000 – ₹12,000 / month',
      status: 'TRIAL_SCHEDULED',
      assignedTutor: 'Dr. Ananya Sengupta',
      trialDate: 'Tomorrow, 5:00 PM',
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
      budgetRange: '₹12,000+ / month',
      status: 'TUITION_CONFIRMED',
      assignedTutor: 'Rohit Sharma',
      commissionAmount: 7500,
    },
  ]);

  // Pending Tutors for Interview (Real DB list with a mock fallback)
  const [pendingTutors, setPendingTutors] = useState<any[]>([]);

  // Fetch pending tutors from database
  const fetchPendingTutors = async () => {
    setDbLoading(true);
    try {
      const res = await fetch('/api/counselor/tutors');
      const data = await res.json();
      if (data.success) {
        // Find tutors that are in PENDING_INTERVIEW or DRAFT status
        const pending = data.tutors.filter((t: any) => t.status === 'PENDING_INTERVIEW' || t.status === 'DRAFT');
        
        if (pending.length > 0) {
          setPendingTutors(pending);
        } else {
          // Fallback static mock tutor if the database is clean and has no entries
          setPendingTutors([
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
              boards: ['CBSE', 'IB'],
              serviceAreas: ['DLF Phase 2', 'DLF Phase 4', 'Sector 14'],
              travelRadiusKm: 6,
              hourlyRateHomeMin: 950,
              hourlyRateHomeMax: 1500,
              hourlyRateOnlineMin: 700,
              hourlyRateOnlineMax: 1200,
              status: 'PENDING_INTERVIEW',
              isVerified: false,
              rating: 5.0,
              bio: 'Physics mentor with 6 years experience specializing in CBSE 12th boards and NEET numerical problem solving.',
              kycDoc: {
                idType: 'AADHAAR_MASKED',
                idLast4: '4589',
                idNumberDecrypted: '1234-5678-4589',
                idDocUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=600&auto=format&fit=crop&q=80'
              }
            }
          ]);
        }
      }
    } catch (err) {
      console.error('Failed to retrieve tutor list:', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTutors();
  }, []);

  const [selectedInvoiceLead, setSelectedInvoiceLead] = useState<MockLead>(leads[2]);

  const handleApproveTutor = async (tutorId: string) => {
    // If it's the static mock tutor, handle locally
    if (tutorId === 'tut-pending-1') {
      alert('🎉 Mock Tutor Interview Cleared! Verified Badge Activated.');
      setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
      return;
    }

    try {
      const res = await fetch('/api/counselor/tutors/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorId })
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Tutor Interview Cleared! Verified Badge Activated & Profile is now Live.');
        setPendingTutors(pendingTutors.filter((t) => t.id !== tutorId));
      } else {
        alert('Failed to approve tutor: ' + (data.error || 'Server error'));
      }
    } catch (err) {
      alert('Network error approving tutor.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 4rem 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <div className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
                <ShieldCheck size={14} />
                <span>SSSAM ACADEMY • COUNSELOR OPERATIONS DESK</span>
              </div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Parent Lead Management & Matchmaking Desk
              </h1>
            </div>

            {/* Tab Switcher */}
            <div style={{
              display: 'flex',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('LEADS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'LEADS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'LEADS' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                📥 Parent Inquiries ({leads.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('INTERVIEWS')}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: activeTab === 'INTERVIEWS' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'INTERVIEWS' ? '#FFFFFF' : 'var(--text-muted)',
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
                  backgroundColor: activeTab === 'INVOICE' ? 'var(--brand-blue)' : 'transparent',
                  color: activeTab === 'INVOICE' ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                💳 Commission Generator
              </button>
            </div>
          </div>

          {/* TAB 1: PARENT LEADS STREAM */}
          {activeTab === 'LEADS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {leads.map((lead) => (
                <div key={lead.id} className="apple-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: lead.mode === 'OFFLINE_HOME' ? 'var(--brand-blue-light)' : 'var(--brand-emerald-light)',
                        color: lead.mode === 'OFFLINE_HOME' ? 'var(--brand-blue)' : 'var(--brand-emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {lead.mode === 'OFFLINE_HOME' ? <Home size={22} /> : <Video size={22} />}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{lead.parentName}</h3>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            [{lead.id}]
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          📍 {lead.locality} • <strong>{lead.grade} ({lead.subject})</strong> • Budget: <strong style={{ color: 'var(--brand-blue)' }}>{lead.budgetRange}</strong>
                        </div>
                      </div>
                    </div>

                    <span className="badge" style={{
                      backgroundColor:
                        lead.status === 'NEW_LEAD' ? '#FEF3C7' :
                        lead.status === 'TRIAL_SCHEDULED' ? '#DBEAFE' : '#D1FAE5',
                      color:
                        lead.status === 'NEW_LEAD' ? '#B45309' :
                        lead.status === 'TRIAL_SCHEDULED' ? '#1D4ED8' : '#059669',
                    }}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-hairline)',
                  }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Assigned Proximity Tutor: <strong style={{ color: 'var(--text-main)' }}>{lead.assignedTutor || 'Unassigned (Match Nearest Sector)'}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`tel:${lead.parentPhone}`}
                        className="btn btn-secondary btn-sm"
                      >
                        <Phone size={14} color="var(--brand-emerald)" />
                        <span>Call: +91 {lead.parentPhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${lead.parentPhone}?text=${encodeURIComponent(
                          `Hello ${lead.parentName}, this is TuitionForHome support (SSSAM Academy). We have shortlisted top verified tutors for ${lead.grade} ${lead.subject} near ${lead.locality}. When can we schedule your trial class?`
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
                            setLeads(leads.map((l) => l.id === lead.id ? { ...l, status: 'TRIAL_SCHEDULED', assignedTutor: 'Rohit Sharma' } : l));
                            alert('Trial Class Scheduled with Mr. Rohit Sharma!');
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          <Calendar size={14} />
                          <span>Schedule Trial Class</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: TUTOR INTERVIEWS */}
          {activeTab === 'INTERVIEWS' && (
            <div>
              {pendingTutors.length > 0 ? (
                pendingTutors.map((tutor) => (
                  <div key={tutor.id} className="apple-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={tutor.avatarUrl} alt={tutor.name} style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }} />
                          <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{tutor.name}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--brand-teal)', fontWeight: 700 }}>
                              {tutor.highestDegree} • {tutor.experienceYears} Yrs Exp
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              📞 Mobile: {tutor.phone} | ✉️ {tutor.email}
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong>Subjects:</strong> {Array.isArray(tutor.subjects) ? tutor.subjects.join(', ') : 'Not Specified'}
                          </div>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong>Classes:</strong> {Array.isArray(tutor.classes) ? tutor.classes.join(', ') : 'Not Specified'}
                          </div>
                          <div style={{ marginBottom: '0.4rem' }}>
                            <strong> Gurgaon Sectors:</strong> {Array.isArray(tutor.serviceAreas) ? tutor.serviceAreas.join(', ') : 'Not Specified'} (Radius: {tutor.travelRadiusKm} KM)
                          </div>
                          <div>
                            <strong>Hourly Rates Range:</strong>
                            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.2rem' }}>
                              <li>Home Visit: ₹{tutor.hourlyRateHomeMin} - ₹{tutor.hourlyRateHomeMax}/hr</li>
                              <li>Online 1-on-1: ₹{tutor.hourlyRateOnlineMin} - ₹{tutor.hourlyRateOnlineMax}/hr</li>
                            </ul>
                          </div>
                        </div>

                        {tutor.introVideoUrl && (
                          <a
                            href={tutor.introVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              padding: '0.85rem', 
                              backgroundColor: 'var(--brand-teal-light)', 
                              borderRadius: '12px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              color: 'var(--brand-teal)',
                              fontWeight: 700,
                              fontSize: '0.85rem'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Play size={15} fill="var(--brand-teal)" />
                              <span>Watch 60s Video Intro Submission</span>
                            </span>
                            <span style={{ fontSize: '0.75rem' }}>View Video ↗</span>
                          </a>
                        )}
                      </div>

                      {/* Scorecard */}
                      <div style={{
                        backgroundColor: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-hairline)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                      }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
                          Academic Interview Scorecard
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Communication:</span>
                            <strong style={{ color: 'var(--brand-emerald)' }}>9 / 10 (Clear)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subject Conceptual Depth:</span>
                            <strong style={{ color: 'var(--brand-emerald)' }}>High (Verified)</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0', borderTop: '1px solid var(--border-hairline)' }}>
                            <span style={{ fontWeight: 700 }}>Government Verification (KYC):</span>
                            <div>ID Type: <strong>{tutor.kycDoc ? tutor.kycDoc.idType : 'N/A'}</strong></div>
                            <div>Full ID Number (Decrypted): <strong style={{ color: 'var(--brand-teal)' }}>{tutor.kycDoc ? tutor.kycDoc.idNumberDecrypted : 'N/A'}</strong></div>
                            
                            {tutor.kycDoc?.idDocUrl && (
                              <a
                                href={tutor.kycDoc.idDocUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  color: 'var(--brand-teal)',
                                  textDecoration: 'underline',
                                  fontWeight: 700,
                                  fontSize: '0.8rem',
                                  marginTop: '0.25rem'
                                }}
                              >
                                👁️ View Secure Uploaded ID Document ↗
                              </a>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleApproveTutor(tutor.id)}
                          className="btn btn-emerald"
                          style={{ width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Approve & Activate Badge</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '20px' }}>
                  <CheckCircle2 size={48} color="var(--brand-teal)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>All Tutor Interviews Cleared!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>No pending tutors in the interview queue.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMISSION INVOICE */}
          {activeTab === 'INVOICE' && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="apple-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>1st-Month Bureau Fee Invoice</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issued by SSSAM Academy Gurugram</div>
                  </div>
                  <span className="badge badge-emerald">TUITION CONFIRMED</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Student & Parent:</span>
                    <strong>{selectedInvoiceLead.parentName} ({selectedInvoiceLead.locality})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subject / Grade:</span>
                    <strong>{selectedInvoiceLead.grade} • {selectedInvoiceLead.subject}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Tutor:</span>
                    <strong>{selectedInvoiceLead.assignedTutor}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-hairline)' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Bureau 50% Placement Fee:</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                      ₹{selectedInvoiceLead.commissionAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'var(--bg-card-subtle)',
                  border: '1.5px solid var(--border-hairline)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  marginBottom: '1.75rem',
                }}>
                  <div style={{
                    width: '140px',
                    height: '140px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-hairline)',
                    borderRadius: '12px',
                    margin: '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                  }}>
                    <QrCode size={90} />
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Scan & Pay via UPI / GPay / PhonePe / Paytm
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
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
