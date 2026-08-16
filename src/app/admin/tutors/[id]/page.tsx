'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  FileText,
  Building2,
  MapPin,
  Phone,
  Mail,
  Award,
  Check,
  X,
  ExternalLink,
  Eye,
  UserCheck,
  BookOpen
} from 'lucide-react';

interface TutorAuditData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  highestDegree: string;
  experienceYears: number;
  teachingMode: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  serviceAreas: string[];
  travelRadiusKm: number;
  formattedAddress: string;
  hourlyRateHomeMin: number;
  hourlyRateHomeMax: number;
  hourlyRateOnlineMin: number;
  hourlyRateOnlineMax: number;
  status: string;
  isVerified: boolean;
  isAvailable: boolean;
  hasPoliceCheck: boolean;
  bio: string;
  qualifications: any[];
  experiences: any[];
  rating: number;
  kycDoc: {
    id?: string;
    idType?: string;
    idLast4?: string;
    idNumberDecrypted?: string;
    idDocUrl?: string;
    idStatus?: string;
    idRejectionNote?: string;
    degreeDocUrl?: string;
    degreeStatus?: string;
    degreeRejectionNote?: string;
  } | null;
}

export default function DedicatedTutorAuditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tutorId = params.id;

  const [tutor, setTutor] = useState<TutorAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [backUrl, setBackUrl] = useState('/admin');
  const [backLabel, setBackLabel] = useState('Back to Admin Portal');

  // Detect who is viewing: admin or counselor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const counselorSession = localStorage.getItem('tfh_counselor_user');
      const adminSession = localStorage.getItem('tfh_admin_user');
      if (counselorSession && !adminSession) {
        setBackUrl('/counselor');
        setBackLabel('Back to Counselor Portal');
      }
    }
  }, []);

  // Custom Centered Modals State (No browser native alert/confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'APPROVE_ID' | 'REJECT_ID' | 'APPROVE_DEGREE' | 'REJECT_DEGREE' | 'APPROVE_FINAL' | 'ACTIVATE_TUTOR' | 'DEACTIVATE_TUTOR';
    showNoteInput?: boolean;
    confirmText: string;
    confirmBgColor: string;
  } | null>(null);

  const [modalNoteText, setModalNoteText] = useState('');

  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Image lightbox
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  const fetchTutorDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/tutors/${tutorId}`);
      const data = await res.json();
      if (data.success && data.tutor) {
        setTutor(data.tutor);
      } else {
        setError(data.error || 'Failed to load tutor data.');
      }
    } catch (err) {
      setError('Connection error while fetching tutor profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tutorId) {
      fetchTutorDetails();
    }
  }, [tutorId]);

  // Trigger Confirmation Modal for any action
  const requestActionConfirmation = (
    actionType: 'APPROVE_ID' | 'REJECT_ID' | 'APPROVE_DEGREE' | 'REJECT_DEGREE' | 'APPROVE_FINAL' | 'ACTIVATE_TUTOR' | 'DEACTIVATE_TUTOR'
  ) => {
    setModalNoteText('');
    if (actionType === 'APPROVE_ID') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve Government ID?',
        description: `Confirm approval of government photo ID (${tutor?.kycDoc?.idType || 'Aadhaar Card'}) for ${tutor?.name}.`,
        actionType: 'APPROVE_ID',
        confirmText: '✓ Confirm Approval',
        confirmBgColor: '#059669'
      });
    } else if (actionType === 'REJECT_ID') {
      setConfirmModal({
        isOpen: true,
        title: 'Reject Government ID?',
        description: `Specify the reason for rejecting ${tutor?.name}'s government ID document.`,
        actionType: 'REJECT_ID',
        showNoteInput: true,
        confirmText: 'Confirm Rejection',
        confirmBgColor: '#DC2626'
      });
    } else if (actionType === 'APPROVE_DEGREE') {
      setConfirmModal({
        isOpen: true,
        title: 'Approve Degree Certificate?',
        description: `Confirm academic degree verification (${tutor?.highestDegree}) for ${tutor?.name}.`,
        actionType: 'APPROVE_DEGREE',
        confirmText: '✓ Confirm Approval',
        confirmBgColor: '#059669'
      });
    } else if (actionType === 'REJECT_DEGREE') {
      setConfirmModal({
        isOpen: true,
        title: 'Reject Degree Certificate?',
        description: `Specify the reason for rejecting ${tutor?.name}'s degree document.`,
        actionType: 'REJECT_DEGREE',
        showNoteInput: true,
        confirmText: 'Confirm Rejection',
        confirmBgColor: '#DC2626'
      });
    } else if (actionType === 'APPROVE_FINAL') {
      setConfirmModal({
        isOpen: true,
        title: 'Complete Profile & Activate Tutor?',
        description: `This will grant official SSSAM Verified status to ${tutor?.name} and activate their listing across Gurgaon.`,
        actionType: 'APPROVE_FINAL',
        confirmText: '🏆 Activate Profile Live',
        confirmBgColor: 'var(--brand-teal)'
      });
    } else if (actionType === 'ACTIVATE_TUTOR') {
      setConfirmModal({
        isOpen: true,
        title: 'Activate Tutor Status?',
        description: `This will make ${tutor?.name} ACTIVE & VISIBLE for parent home tuition searches.`,
        actionType: 'ACTIVATE_TUTOR',
        confirmText: '▶️ Activate Tutor',
        confirmBgColor: '#059669'
      });
    } else if (actionType === 'DEACTIVATE_TUTOR') {
      setConfirmModal({
        isOpen: true,
        title: 'Deactivate Tutor Status?',
        description: `This will DEACTIVATE ${tutor?.name} and temporarily hide them from parent listings.`,
        actionType: 'DEACTIVATE_TUTOR',
        confirmText: '⏸️ Deactivate Tutor',
        confirmBgColor: '#DC2626'
      });
    }
  };

  // Execute confirmed API action
  const executeConfirmedAction = async () => {
    if (!confirmModal || !tutor) return;
    setActionLoading(true);

    const { actionType } = confirmModal;

    try {
      if (actionType === 'ACTIVATE_TUTOR' || actionType === 'DEACTIVATE_TUTOR') {
        const isAvailable = actionType === 'ACTIVATE_TUTOR';
        const res = await fetch('/api/counselor/tutors/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tutorId: tutor.id,
            action: 'TOGGLE_AVAILABILITY',
            isAvailable
          })
        });

        const data = await res.json();
        setConfirmModal(null);

        if (data.success) {
          setFeedbackModal({
            isOpen: true,
            title: isAvailable ? '▶️ Tutor Activated' : '⏸️ Tutor Deactivated',
            message: `${tutor.name} is now ${isAvailable ? 'ACTIVE & VISIBLE for matching' : 'DEACTIVATED and hidden from parent listings'}.`,
            type: 'success'
          });
          fetchTutorDetails();
        } else {
          setFeedbackModal({
            isOpen: true,
            title: 'Action Failed',
            message: data.error || 'Failed to update availability status.',
            type: 'error'
          });
        }
      } else if (actionType === 'APPROVE_FINAL') {
        const res = await fetch('/api/counselor/tutors/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tutorId: tutor.id,
            action: 'APPROVE_FINAL_PROFILE'
          })
        });

        const data = await res.json();
        setConfirmModal(null);

        if (data.success) {
          setFeedbackModal({
            isOpen: true,
            title: '🏆 Profile & All Documents Fully Verified!',
            message: `${tutor.name}'s profile, Government ID, and Degree Certificate have all been marked APPROVED together and activated live across Gurgaon.`,
            type: 'success'
          });
          fetchTutorDetails();
        } else {
          setFeedbackModal({
            isOpen: true,
            title: 'Approval Failed',
            message: data.error || 'Failed to approve profile.',
            type: 'error'
          });
        }
      } else {
        const isDocId = actionType === 'APPROVE_ID' || actionType === 'REJECT_ID';
        const docType = isDocId ? 'ID_DOC' : 'DEGREE_DOC';
        const decision = (actionType === 'APPROVE_ID' || actionType === 'APPROVE_DEGREE') ? 'APPROVED' : 'REJECTED';

        const res = await fetch('/api/counselor/tutors/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tutorId: tutor.id,
            action: 'REVIEW_DOCUMENT',
            docType,
            decision,
            rejectionNote: modalNoteText
          })
        });

        const data = await res.json();
        setConfirmModal(null);

        if (data.success) {
          setFeedbackModal({
            isOpen: true,
            title: decision === 'APPROVED' ? '✨ Document Approved' : 'Document Rejected',
            message: `${isDocId ? 'Government ID' : 'Degree Certificate'} status updated to ${decision}.`,
            type: 'success'
          });
          fetchTutorDetails();
        } else {
          setFeedbackModal({
            isOpen: true,
            title: 'Update Failed',
            message: data.error || 'Failed to update document status.',
            type: 'error'
          });
        }
      }
    } catch (err) {
      setConfirmModal(null);
      setFeedbackModal({
        isOpen: true,
        title: 'Connection Error',
        message: 'Network error processing verification request.',
        type: 'error'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Loading Tutor Audit Workspace...</div>
            <span style={{ fontSize: '0.85rem' }}>Fetching database profile credentials &amp; document scans</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--border-hairline)', textAlign: 'center', maxWidth: '440px' }}>
            <AlertCircle size={40} color="#EF4444" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Tutor Not Found</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>{error || 'Unable to retrieve tutor record.'}</p>
            <button onClick={() => router.push(backUrl)} className="btn btn-primary btn-sm">
              ← Return to Portal
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const kyc = tutor.kycDoc;
  const idStatus = kyc?.idStatus || 'NOT_SUBMITTED';
  const degreeStatus = kyc?.degreeStatus || 'NOT_SUBMITTED';
  const isFullyApproved = tutor.isVerified || (idStatus === 'APPROVED' && degreeStatus === 'APPROVED' && tutor.status === 'ACTIVE_VERIFIED');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', color: 'var(--text-main)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          
          {/* Top Breadcrumb Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => router.push(backUrl)}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '10px', padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ArrowLeft size={16} />
                <span>{backLabel}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Availability Status Badge & Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {tutor.isAvailable ? (
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '0.35rem 0.85rem', borderRadius: '999px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    🟢 ACTIVE &amp; VISIBLE
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.35rem 0.85rem', borderRadius: '999px', border: '1px solid #FCA5A5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    🔴 DEACTIVATED / INACTIVE
                  </span>
                )}

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => requestActionConfirmation((tutor.isAvailable && tutor.status !== 'SUSPENDED') ? 'DEACTIVATE_TUTOR' : 'ACTIVATE_TUTOR')}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    padding: '0.4rem 0.85rem',
                    color: (tutor.isAvailable && tutor.status !== 'SUSPENDED') ? '#DC2626' : '#059669',
                    borderColor: (tutor.isAvailable && tutor.status !== 'SUSPENDED') ? '#FCA5A5' : '#6EE7B7',
                    backgroundColor: (tutor.isAvailable && tutor.status !== 'SUSPENDED') ? '#FEF2F2' : '#ECFDF5'
                  }}
                >
                  {(tutor.isAvailable && tutor.status !== 'SUSPENDED') ? '⏸️ Suspend / Deactivate (Admin)' : '▶️ Reactivate Tutor (Admin)'}
                </button>
              </div>

              {isFullyApproved ? (
                <span style={{ fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '0.35rem 0.85rem', borderRadius: '999px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ShieldCheck size={16} color="#166534" />
                  <span>🟢 FULLY VERIFIED</span>
                </span>
              ) : (
                <span style={{ fontSize: '0.78rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.35rem 0.85rem', borderRadius: '999px', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <AlertCircle size={16} color="#92400E" />
                  <span>🟡 AUDIT PENDING</span>
                </span>
              )}
            </div>
          </div>

          {/* Tutor Summary Header Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.75rem', borderRadius: '24px', border: '1.5px solid var(--border-hairline)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {tutor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={tutor.avatarUrl}
                  alt={tutor.name}
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand-teal-light)', boxShadow: '0 4px 15px rgba(13,148,136,0.15)' }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4rem', fontWeight: 900 }}>
                  {tutor.name.charAt(0)}
                </div>
              )}

              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{tutor.name}</h1>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    ID: {tutor.id.slice(0, 8)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={15} color="var(--brand-teal)" />
                    {tutor.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={15} color="var(--brand-teal)" />
                    <a href={`tel:${tutor.phone}`} style={{ color: 'var(--brand-teal)', fontWeight: 700, textDecoration: 'none' }}>{tutor.phone}</a>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} color="var(--brand-teal)" />
                    {tutor.formattedAddress || 'Sector 14, Gurgaon'} ({tutor.travelRadiusKm} KM)
                  </span>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {(tutor.subjects || []).map(sub => (
                    <span key={sub} style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {sub}
                    </span>
                  ))}
                  {(tutor.classes || []).map(cls => (
                    <span key={cls} style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Government ID Verification Audit */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid var(--border-hairline)', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '1.25rem 1.75rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={22} color="var(--brand-teal)" />
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  1. Government ID Verification (Aadhaar / Passport / DL)
                </strong>
              </div>

              {idStatus === 'APPROVED' ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ✓ ID APPROVED
                </span>
              ) : idStatus === 'REJECTED' ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ❌ ID REJECTED
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ⏳ PENDING AUDIT
                </span>
              )}
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="profile-form-2col">
                {/* ID Meta Data */}
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Document Type</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.92rem' }}>{kyc?.idType || 'Aadhaar Card / Govt Photo ID'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>ID Number (Decrypted Admin View)</span>
                      <strong style={{ color: 'var(--brand-teal)', fontSize: '1.05rem', letterSpacing: '0.05em' }}>{kyc?.idNumberDecrypted || 'Not Uploaded'}</strong>
                    </div>
                    {kyc?.idRejectionNote && (
                      <div style={{ backgroundColor: '#FEF2F2', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.78rem' }}>
                        <strong>Rejection Reason:</strong> {kyc.idRejectionNote}
                      </div>
                    )}
                  </div>

                  {/* Accept / Reject Action Buttons for ID */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={actionLoading || idStatus === 'APPROVED'}
                      onClick={() => requestActionConfirmation('APPROVE_ID')}
                      className="btn btn-primary"
                      style={{ backgroundColor: '#059669', borderColor: '#059669', fontSize: '0.85rem', padding: '0.6rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Check size={16} />
                      <span>{idStatus === 'APPROVED' ? 'ID Accepted ✓' : 'Accept Govt ID'}</span>
                    </button>

                    {idStatus !== 'APPROVED' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => requestActionConfirmation('REJECT_ID')}
                        className="btn btn-secondary"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', fontSize: '0.85rem', padding: '0.6rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <X size={16} />
                        <span>Reject Govt ID</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* ID Document Image Preview */}
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.35rem' }}>Document Scan Preview</span>
                  {kyc?.idDocUrl ? (
                    <div style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: '#0F172A',
                      height: '240px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={kyc.idDocUrl}
                        alt="Government ID Scan"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          margin: '0 auto'
                        }}
                        onClick={() => setActiveImageModal(kyc.idDocUrl!)}
                      />
                      <button
                        type="button"
                        onClick={() => setActiveImageModal(kyc.idDocUrl!)}
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Eye size={14} />
                        <span>View High-Res Scan</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: '240px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1.5px dashed var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                      No Government ID uploaded yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Educational Qualifications & Degree Document Audit */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1.5px solid var(--border-hairline)', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '1.25rem 1.75rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <GraduationCap size={22} color="var(--brand-teal)" />
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  2. Highest Degree &amp; Academic Qualification Audit
                </strong>
              </div>

              {degreeStatus === 'APPROVED' ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ✓ DEGREE APPROVED
                </span>
              ) : degreeStatus === 'REJECTED' ? (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FEE2E2', color: '#991B1B', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ❌ DEGREE REJECTED
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
                  ⏳ PENDING AUDIT
                </span>
              )}
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="profile-form-2col">
                {/* Degree Meta Data */}
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Highest Degree Claimed</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.98rem' }}>🎓 {tutor.highestDegree}</strong>
                    </div>

                    {(tutor.qualifications || []).map((q, idx) => (
                      <div key={idx} style={{ backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-hairline)' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>{q.degree}</strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{q.institute} • {q.year} {q.grade ? `(${q.grade})` : ''}</span>
                      </div>
                    ))}

                    {kyc?.degreeRejectionNote && (
                      <div style={{ backgroundColor: '#FEF2F2', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.78rem' }}>
                        <strong>Rejection Reason:</strong> {kyc.degreeRejectionNote}
                      </div>
                    )}
                  </div>

                  {/* Accept / Reject Action Buttons for Degree */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      disabled={actionLoading || degreeStatus === 'APPROVED'}
                      onClick={() => requestActionConfirmation('APPROVE_DEGREE')}
                      className="btn btn-primary"
                      style={{ backgroundColor: '#059669', borderColor: '#059669', fontSize: '0.85rem', padding: '0.6rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Check size={16} />
                      <span>{degreeStatus === 'APPROVED' ? 'Degree Accepted ✓' : 'Accept Degree Document'}</span>
                    </button>

                    {degreeStatus !== 'APPROVED' && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => requestActionConfirmation('REJECT_DEGREE')}
                        className="btn btn-secondary"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', fontSize: '0.85rem', padding: '0.6rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <X size={16} />
                        <span>Reject Degree</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Degree Document Image Preview */}
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', marginBottom: '0.35rem' }}>Degree Certificate Scan</span>
                  {kyc?.degreeDocUrl ? (
                    <div style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-hairline)',
                      backgroundColor: '#0F172A',
                      height: '240px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.5rem'
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={kyc.degreeDocUrl}
                        alt="Degree Certificate Scan"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          margin: '0 auto'
                        }}
                        onClick={() => setActiveImageModal(kyc.degreeDocUrl!)}
                      />
                      <button
                        type="button"
                        onClick={() => setActiveImageModal(kyc.degreeDocUrl!)}
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          color: '#FFFFFF',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        <Eye size={14} />
                        <span>View High-Res Certificate</span>
                      </button>
                    </div>
                  ) : (
                    <div style={{ height: '240px', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1.5px dashed var(--border-hairline)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.82rem' }}>
                      No Degree document uploaded yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Final Profile Approval & Activation */}
          <div style={{ backgroundColor: 'radial-gradient(circle at 50% 20%, #0F172A 0%, #020617 100%)', color: '#FFFFFF', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  3. Final Profile Activation Command
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.25rem', margin: 0 }}>
                  Activating the tutor grants official SSSAM Verified status and lists them in live parent matching searches across Gurgaon.
                </p>

                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
                  <span style={{ color: idStatus === 'APPROVED' ? '#4ADE80' : '#F87171', fontWeight: 700 }}>
                    {idStatus === 'APPROVED' ? '✓ Govt ID Approved' : '× Govt ID Pending/Rejected'}
                  </span>
                  <span style={{ color: degreeStatus === 'APPROVED' ? '#4ADE80' : '#F87171', fontWeight: 700 }}>
                    {degreeStatus === 'APPROVED' ? '✓ Degree Approved' : '× Degree Pending/Rejected'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={actionLoading || isFullyApproved}
                onClick={() => requestActionConfirmation('APPROVE_FINAL')}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  backgroundColor: isFullyApproved ? '#059669' : 'var(--brand-teal)',
                  borderColor: isFullyApproved ? '#059669' : 'var(--brand-teal)',
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <UserCheck size={20} />
                <span>{isFullyApproved ? 'Profile Fully Activated & Verified ✓' : '🏆 Complete & Approve Final Profile'}</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Centered Action Confirmation Modal */}
      {confirmModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '24px', maxWidth: '460px', width: '100%', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)', border: '1.5px solid var(--border-hairline)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: confirmModal.confirmBgColor + '18', color: confirmModal.confirmBgColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.5rem 0 1.25rem 0', lineHeight: 1.5 }}>
              {confirmModal.description}
            </p>

            {confirmModal.showNoteInput && (
              <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: '0.35rem' }}>
                  Rejection Reason (will be shown to tutor):
                </label>
                <input
                  type="text"
                  value={modalNoteText}
                  onChange={(e) => setModalNoteText(e.target.value)}
                  placeholder="e.g. Document image blurry, name mismatch..."
                  className="form-control"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem', fontWeight: 700 }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={executeConfirmedAction}
                className="btn btn-primary"
                style={{ flex: 1.3, padding: '0.75rem', fontSize: '0.88rem', fontWeight: 800, backgroundColor: confirmModal.confirmBgColor, borderColor: confirmModal.confirmBgColor }}
              >
                {actionLoading ? 'Processing...' : confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Centered Feedback / Success Modal */}
      {feedbackModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '24px', maxWidth: '420px', width: '100%', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)', border: '1.5px solid var(--border-hairline)', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: feedbackModal.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: feedbackModal.type === 'success' ? '#166534' : '#991B1B', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              {feedbackModal.type === 'success' ? <CheckCircle2 size={34} /> : <AlertCircle size={34} />}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {feedbackModal.title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.65rem 0 1.5rem 0', lineHeight: 1.45 }}>
              {feedbackModal.message}
            </p>

            <button
              type="button"
              onClick={() => setFeedbackModal(null)}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', fontWeight: 800, backgroundColor: 'var(--brand-teal)' }}
            >
              OK, Got It
            </button>
          </div>
        </div>
      )}

      {/* Document Image Viewer Lightbox Modal */}
      {activeImageModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={activeImageModal} alt="Document View" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain' }} />
            <button
              onClick={() => setActiveImageModal(null)}
              style={{ position: 'absolute', top: '-15px', right: '-15px', backgroundColor: '#FFFFFF', color: '#000000', border: 'none', borderRadius: '50%', width: '36px', height: '36px', fontWeight: 900, cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
