'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AdminTutorMap = dynamic(() => import('@/components/AdminTutorMap'), { ssr: false });
const TutorVideoPlayer = dynamic(() => import('@/components/TutorVideoPlayer'), { ssr: false });
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
  BookOpen,
  Video,
  Play,
  Navigation,
  Compass,
  DollarSign,
  Edit3,
  Save,
  Globe,
  MessageCircle,
  Sparkles,
  Layers,
  Clock,
  Upload,
} from 'lucide-react';

interface TutorAuditData {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  introVideoUrl: string;
  highestDegree: string;
  gender?: string;
  experienceYears: number;
  teachingMode: string;
  subjects: string[];
  classes: string[];
  boards: string[];
  serviceAreas: string[];
  travelRadiusKm: number;
  latitude?: number | null;
  longitude?: number | null;
  formattedAddress: string;
  hourlyRateHome?: number;
  hourlyRateHomeMin: number;
  hourlyRateHomeMax: number;
  hourlyRateOnline?: number;
  hourlyRateOnlineMin: number;
  hourlyRateOnlineMax: number;
  monthlyRateMin?: number;
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

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editSaving, setEditSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');
      formData.append('folder', 'tuitionforhome/videos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditFormData((prev: any) => ({ ...prev, introVideoUrl: data.url }));
      } else {
        const localUrl = URL.createObjectURL(file);
        setEditFormData((prev: any) => ({ ...prev, introVideoUrl: localUrl }));
      }
    } catch (err) {
      console.error('Video upload error:', err);
    } finally {
      setUploadingVideo(false);
    }
  };

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

  // Open Edit Modal with pre-populated values
  const handleOpenEditModal = () => {
    if (!tutor) return;
    setEditFormData({
      name: tutor.name || '',
      email: tutor.email || '',
      phone: tutor.phone || '',
      gender: tutor.gender || 'OTHER',
      bio: tutor.bio || '',
      highestDegree: tutor.highestDegree || '',
      experienceYears: tutor.experienceYears || 0,
      teachingMode: tutor.teachingMode || 'BOTH',
      subjects: (tutor.subjects || []).join(', '),
      classes: (tutor.classes || []).join(', '),
      boards: (tutor.boards || []).join(', '),
      serviceAreas: (tutor.serviceAreas || []).join(', '),
      formattedAddress: tutor.formattedAddress || '',
      travelRadiusKm: tutor.travelRadiusKm || 5,
      latitude: tutor.latitude !== null && tutor.latitude !== undefined ? tutor.latitude : '',
      longitude: tutor.longitude !== null && tutor.longitude !== undefined ? tutor.longitude : '',
      hourlyRateHomeMin: tutor.hourlyRateHomeMin || 500,
      hourlyRateHomeMax: tutor.hourlyRateHomeMax || 1000,
      hourlyRateOnlineMin: tutor.hourlyRateOnlineMin || 400,
      hourlyRateOnlineMax: tutor.hourlyRateOnlineMax || 800,
      monthlyRateMin: tutor.monthlyRateMin || 6000,
      avatarUrl: tutor.avatarUrl || '',
      introVideoUrl: tutor.introVideoUrl || '',
      status: tutor.status || 'ACTIVE_VERIFIED',
      isVerified: tutor.isVerified || false,
      isAvailable: tutor.isAvailable !== undefined ? tutor.isAvailable : true,
      hasPoliceCheck: tutor.hasPoliceCheck || false,
      rating: tutor.rating || 5.0,
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit Modal Changes
  const handleSaveTutorEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutor) return;
    setEditSaving(true);

    try {
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        gender: editFormData.gender,
        bio: editFormData.bio,
        highestDegree: editFormData.highestDegree,
        experienceYears: Number(editFormData.experienceYears) || 0,
        teachingMode: editFormData.teachingMode,
        subjects: editFormData.subjects.split(',').map((s: string) => s.trim()).filter(Boolean),
        classes: editFormData.classes.split(',').map((s: string) => s.trim()).filter(Boolean),
        boards: editFormData.boards.split(',').map((s: string) => s.trim()).filter(Boolean),
        serviceAreas: editFormData.serviceAreas.split(',').map((s: string) => s.trim()).filter(Boolean),
        formattedAddress: editFormData.formattedAddress,
        travelRadiusKm: Number(editFormData.travelRadiusKm) || 5,
        latitude: editFormData.latitude !== '' ? parseFloat(editFormData.latitude) : null,
        longitude: editFormData.longitude !== '' ? parseFloat(editFormData.longitude) : null,
        hourlyRateHomeMin: Number(editFormData.hourlyRateHomeMin) || 500,
        hourlyRateHomeMax: Number(editFormData.hourlyRateHomeMax) || 1000,
        hourlyRateHome: Number(editFormData.hourlyRateHomeMin) || 500,
        hourlyRateOnlineMin: Number(editFormData.hourlyRateOnlineMin) || 400,
        hourlyRateOnlineMax: Number(editFormData.hourlyRateOnlineMax) || 800,
        hourlyRateOnline: Number(editFormData.hourlyRateOnlineMin) || 400,
        monthlyRateMin: Number(editFormData.monthlyRateMin) || 6000,
        avatarUrl: editFormData.avatarUrl,
        introVideoUrl: editFormData.introVideoUrl,
        status: editFormData.status,
        isVerified: Boolean(editFormData.isVerified),
        isAvailable: Boolean(editFormData.isAvailable),
        hasPoliceCheck: Boolean(editFormData.hasPoliceCheck),
        rating: parseFloat(editFormData.rating) || 5.0,
      };

      const res = await fetch(`/api/admin/tutors/${tutor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setEditSaving(false);

      if (data.success) {
        setIsEditModalOpen(false);
        setFeedbackModal({
          isOpen: true,
          title: '✅ Tutor Updated Successfully',
          message: 'All profile fields, rates, radius, and verification settings have been saved to the MySQL database.',
          type: 'success',
        });
        fetchTutorDetails();
      } else {
        setFeedbackModal({
          isOpen: true,
          title: 'Update Failed',
          message: data.error || 'Could not save changes to tutor profile.',
          type: 'error',
        });
      }
    } catch (err: any) {
      setEditSaving(false);
      setFeedbackModal({
        isOpen: true,
        title: 'Connection Error',
        message: err.message || 'Failed to communicate with server.',
        type: 'error',
      });
    }
  };

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
        confirmBgColor: '#0F6E56'
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
              {/* Edit Button */}
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="btn btn-primary btn-sm"
                style={{ borderRadius: '10px', padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--brand-teal)' }}
              >
                <Edit3 size={16} />
                <span>Edit Details</span>
              </button>

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

          {/* Tutor Summary Hero Card */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '20px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                {tutor.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tutor.avatarUrl}
                    alt={tutor.name}
                    style={{ width: '84px', height: '84px', borderRadius: '20px', objectFit: 'cover', border: '2.5px solid #0F6E56', boxShadow: '0 4px 12px rgba(15,110,86,0.18)' }}
                  />
                ) : (
                  <div style={{ width: '84px', height: '84px', borderRadius: '20px', backgroundColor: '#0F6E56', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 900 }}>
                    {tutor.name.charAt(0)}
                  </div>
                )}
                {tutor.isVerified && (
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#059669', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', border: '2px solid #FFFFFF' }}>
                    <ShieldCheck size={12} />
                  </span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>{tutor.name}</h1>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                      ID: {tutor.id.slice(0, 8)}
                    </span>
                    {tutor.gender && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                        {tutor.gender}
                      </span>
                    )}
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                      ★ {tutor.rating || 5.0} Rating
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    <Link
                      href={`/tutors/${tutor.id}`}
                      target="_blank"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.76rem', fontWeight: 700, padding: '0.35rem 0.65rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <span>Public Profile</span>
                      <ExternalLink size={12} />
                    </Link>
                    {tutor.phone && tutor.phone !== 'N/A' ? (
                      <a
                        href={`https://wa.me/91${tutor.phone?.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.76rem', fontWeight: 700, padding: '0.35rem 0.65rem', borderRadius: '8px', backgroundColor: '#25D366', color: '#FFFFFF', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.76rem', fontWeight: 700, padding: '0.35rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        title="Click to add phone number"
                      >
                        <MessageCircle size={13} />
                        <span>+ Add Phone for WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap', fontSize: '0.84rem', color: '#64748B' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={14} color="#0F6E56" />
                    {tutor.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={14} color="#0F6E56" />
                    {tutor.phone && tutor.phone !== 'N/A' ? (
                      <a href={`tel:${tutor.phone}`} style={{ color: '#0F6E56', fontWeight: 700, textDecoration: 'none' }}>{tutor.phone}</a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenEditModal}
                        style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, padding: 0, cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}
                      >
                        N/A (Click to Add)
                      </button>
                    )}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <GraduationCap size={14} color="#0F6E56" />
                    <strong>{tutor.highestDegree}</strong> ({tutor.experienceYears} Years Exp)
                  </span>
                </div>

                {tutor.bio && (
                  <p style={{ fontSize: '0.82rem', color: '#334155', margin: '0.65rem 0 0 0', lineHeight: 1.45, backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    &ldquo;{tutor.bio}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Section: Introduction Video Preview */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Video size={18} color="#0F6E56" />
                  <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    Introduction Video (60-90s)
                  </strong>
                </div>
                {tutor.introVideoUrl ? (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 7px', borderRadius: '6px' }}>
                    ✓ Video Active
                  </span>
                ) : (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 7px', borderRadius: '6px' }}>
                    No Video
                  </span>
                )}
              </div>

              <TutorVideoPlayer
                videoUrl={tutor.introVideoUrl}
                tutorName={tutor.name}
                maxHeight="220px"
                onSetTestVideo={(url) => {
                  setEditFormData((prev: any) => ({ ...prev, introVideoUrl: url }));
                  handleOpenEditModal();
                }}
              />
            </div>

            {/* Section: Location, Travel Radius & Covered Sectors */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Navigation size={18} color="#0F6E56" />
                  <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    Location &amp; Travel Radius
                  </strong>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '2px 7px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                  {tutor.travelRadiusKm} KM Travel Radius
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Base Location / Sector</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.88rem' }}>
                    📍 {tutor.formattedAddress || 'Gurgaon, Haryana'}
                  </strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.7rem' }}>GPS Coordinates</span>
                    <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.78rem' }}>
                      {tutor.latitude ? `${tutor.latitude.toFixed(4)}, ${tutor.longitude?.toFixed(4)}` : 'Auto-Resolved from Sector'}
                    </span>
                  </div>
                  {tutor.latitude && tutor.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${tutor.latitude},${tutor.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0F6E56', textDecoration: 'none' }}
                    >
                      Map ↗
                    </a>
                  )}
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <AdminTutorMap
                    mode="view"
                    lat={tutor.latitude}
                    lng={tutor.longitude}
                    radiusKm={tutor.travelRadiusKm}
                    tutorName={tutor.name}
                    address={tutor.formattedAddress}
                  />
                </div>

                <div style={{ marginTop: '0.25rem' }}>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                    Preferred Service Sectors &amp; Societies ({tutor.serviceAreas?.length || 0}):
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {tutor.serviceAreas && tutor.serviceAreas.length > 0 ? (
                      tutor.serviceAreas.map((area) => (
                        <span key={area} style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 7px', borderRadius: '6px', fontWeight: 600, border: '1px solid #E2E8F0' }}>
                          {area}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>All Gurgaon sectors within {tutor.travelRadiusKm} km</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            
            {/* Section: Teaching Credentials & Subject Matrix */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                <BookOpen size={18} color="#0F6E56" />
                <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                  Subjects, Grades &amp; Boards
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', marginBottom: '0.3rem' }}>Subjects Handled</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(tutor.subjects || []).map((sub) => (
                      <span key={sub} style={{ fontSize: '0.74rem', backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #DBEAFE' }}>
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', marginBottom: '0.3rem' }}>Classes &amp; Grades</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(tutor.classes || []).map((cls) => (
                      <span key={cls} style={{ fontSize: '0.74rem', backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #F3E8FF' }}>
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', marginBottom: '0.3rem' }}>Education Boards</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {(tutor.boards || []).map((b) => (
                      <span key={b} style={{ fontSize: '0.74rem', backgroundColor: '#ECFDF5', color: '#065F46', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ color: '#64748B', fontSize: '0.74rem' }}>Teaching Mode:</span>
                  <strong style={{ color: '#0F172A', fontSize: '0.8rem' }}>
                    {tutor.teachingMode === 'BOTH' ? '🏡 Home Visit + 💻 Online' : tutor.teachingMode === 'OFFLINE_HOME' ? '🏡 Offline Home Visit Only' : '💻 Online Live Only'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Section: Pricing & Rates */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #E2E8F0', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
                <DollarSign size={18} color="#0F6E56" />
                <strong style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                  Tuition Fee Structure
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Offline Home Visit Rate</span>
                    <strong style={{ color: '#0F6E56', fontSize: '1rem' }}>
                      ₹{tutor.hourlyRateHomeMin || tutor.hourlyRateHome || 500} - ₹{tutor.hourlyRateHomeMax || 1000} / hr
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Home Visit
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Online Live 1-on-1 Rate</span>
                    <strong style={{ color: '#2563EB', fontSize: '1rem' }}>
                      ₹{tutor.hourlyRateOnlineMin || tutor.hourlyRateOnline || 400} - ₹{tutor.hourlyRateOnlineMax || 800} / hr
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Online 1-on-1
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>Monthly Package Baseline</span>
                    <strong style={{ color: '#0F172A', fontSize: '1rem' }}>
                      ₹{tutor.monthlyRateMin || 6000} / month
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Monthly Min
                  </span>
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
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: '1.18rem', fontWeight: 800, margin: 0, color: '#FFFFFF', letterSpacing: '0.01em' }}>
                  3. Final Profile Activation Command
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#CBD5E1', marginTop: '0.35rem', margin: 0, lineHeight: 1.45 }}>
                  Activating the tutor grants official SSSAM Verified status and lists them in live parent matching searches across Gurgaon.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ color: idStatus === 'APPROVED' ? '#4ADE80' : '#FCA5A5', fontWeight: 700, backgroundColor: idStatus === 'APPROVED' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                    {idStatus === 'APPROVED' ? '✓ Govt ID Approved' : '× Govt ID Pending/Rejected'}
                  </span>
                  <span style={{ color: degreeStatus === 'APPROVED' ? '#4ADE80' : '#FCA5A5', fontWeight: 700, backgroundColor: degreeStatus === 'APPROVED' ? 'rgba(74, 222, 128, 0.12)' : 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
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
                  padding: '0.85rem 1.65rem',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  backgroundColor: isFullyApproved ? '#059669' : '#0D9488',
                  borderColor: isFullyApproved ? '#059669' : '#0D9488',
                  boxShadow: '0 4px 20px rgba(13, 148, 136, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: (actionLoading || isFullyApproved) ? 'not-allowed' : 'pointer'
                }}
              >
                <UserCheck size={18} />
                <span>{isFullyApproved ? 'Profile Fully Activated & Verified ✓' : '🏆 Complete & Approve Final Profile'}</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* FULL ADMIN EDIT MODAL */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(5px)' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.3)', border: '1.5px solid #E2E8F0' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F8FAFC', position: 'sticky', top: 0, zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Edit3 size={20} color="#0F6E56" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Edit Tutor Details (Admin Control)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveTutorEdits} style={{ padding: '1.75rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Gender</label>
                  <select
                    value={editFormData.gender}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other / Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Bio / Teacher Headline</label>
                <textarea
                  rows={2}
                  value={editFormData.bio}
                  onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Mentor specializing in CBSE / ICSE board exam preparation..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Highest Degree</label>
                  <input
                    type="text"
                    value={editFormData.highestDegree}
                    onChange={(e) => setEditFormData({ ...editFormData, highestDegree: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    placeholder="M.Sc Mathematics (Delhi University)"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Experience (Years)</label>
                  <input
                    type="number"
                    value={editFormData.experienceYears}
                    onChange={(e) => setEditFormData({ ...editFormData, experienceYears: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Teaching Mode</label>
                  <select
                    value={editFormData.teachingMode}
                    onChange={(e) => setEditFormData({ ...editFormData, teachingMode: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="BOTH">Both (Offline Home + Online)</option>
                    <option value="OFFLINE_HOME">Offline Home Visit Only</option>
                    <option value="ONLINE_LIVE">Online Live 1-on-1 Only</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Subjects (Comma-separated)</label>
                <input
                  type="text"
                  value={editFormData.subjects}
                  onChange={(e) => setEditFormData({ ...editFormData, subjects: e.target.value })}
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Mathematics, Physics, Chemistry"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Classes / Grades (Comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.classes}
                    onChange={(e) => setEditFormData({ ...editFormData, classes: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    placeholder="Class 9 & 10, Class 11 & 12"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Boards Handled (Comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.boards}
                    onChange={(e) => setEditFormData({ ...editFormData, boards: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.85rem' }}
                    placeholder="CBSE, ICSE, IB, IGCSE"
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F6E56', display: 'block', marginBottom: '0.75rem' }}>
                  📍 Interactive Location &amp; Travel Radius Map
                </strong>

                {/* Interactive Map Picker for Admin */}
                <div style={{ marginBottom: '1rem' }}>
                  <AdminTutorMap
                    mode="edit"
                    lat={editFormData.latitude ? parseFloat(editFormData.latitude) : 28.4595}
                    lng={editFormData.longitude ? parseFloat(editFormData.longitude) : 77.0988}
                    radiusKm={Number(editFormData.travelRadiusKm) || 5}
                    tutorName={editFormData.name || 'Tutor'}
                    address={editFormData.formattedAddress || 'Gurgaon, Haryana'}
                    onChangeLocation={(data) => {
                      setEditFormData({
                        ...editFormData,
                        latitude: data.lat,
                        longitude: data.lng,
                        formattedAddress: data.address,
                        travelRadiusKm: data.radiusKm,
                      });
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Base Address / Sector</label>
                    <input
                      type="text"
                      value={editFormData.formattedAddress}
                      onChange={(e) => setEditFormData({ ...editFormData, formattedAddress: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                      placeholder="e.g. DLF Phase 5, Sector 56, Gurgaon"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Auto-Resolved GPS Coordinates</label>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        {editFormData.latitude ? `${editFormData.latitude}, ${editFormData.longitude}` : 'Auto-Calculated from Map Pin'}
                      </span>
                      <span style={{ fontSize: '0.68rem', backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '1px 6px', borderRadius: '4px' }}>
                        LIVE GPS
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Service Sectors &amp; Societies (Comma-separated)</label>
                  <input
                    type="text"
                    value={editFormData.serviceAreas}
                    onChange={(e) => setEditFormData({ ...editFormData, serviceAreas: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.82rem' }}
                    placeholder="DLF Phase 5, Golf Course Road, Sector 56, Sushant Lok"
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F6E56', display: 'block', marginBottom: '0.75rem' }}>
                  💰 Tuition Fee Rates
                </strong>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Home Visit Min (₹/hr)</label>
                    <input
                      type="number"
                      value={editFormData.hourlyRateHomeMin}
                      onChange={(e) => setEditFormData({ ...editFormData, hourlyRateHomeMin: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Home Visit Max (₹/hr)</label>
                    <input
                      type="number"
                      value={editFormData.hourlyRateHomeMax}
                      onChange={(e) => setEditFormData({ ...editFormData, hourlyRateHomeMax: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Online Min (₹/hr)</label>
                    <input
                      type="number"
                      value={editFormData.hourlyRateOnlineMin}
                      onChange={(e) => setEditFormData({ ...editFormData, hourlyRateOnlineMin: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Online Max (₹/hr)</label>
                    <input
                      type="number"
                      value={editFormData.hourlyRateOnlineMax}
                      onChange={(e) => setEditFormData({ ...editFormData, hourlyRateOnlineMax: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Monthly Baseline (₹)</label>
                    <input
                      type="number"
                      value={editFormData.monthlyRateMin}
                      onChange={(e) => setEditFormData({ ...editFormData, monthlyRateMin: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F6E56', display: 'block', marginBottom: '0.75rem' }}>
                  🎥 Introduction Video &amp; Media
                </strong>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.35rem' }}>Profile Photo Avatar URL</label>
                    <input
                      type="text"
                      value={editFormData.avatarUrl}
                      onChange={(e) => setEditFormData({ ...editFormData, avatarUrl: e.target.value })}
                      className="form-control"
                      style={{ fontSize: '0.82rem' }}
                      placeholder="https://images.unsplash.com/... or Cloudinary URL"
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Video size={13} />
                        <span>Introduction Video</span>
                      </label>
                      {uploadingVideo && (
                        <span style={{ fontSize: '0.72rem', color: '#0F6E56', fontWeight: 700 }}>
                          Uploading video...
                        </span>
                      )}
                    </div>

                    {/* Video Options / Input */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                        <label
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            backgroundColor: '#0F6E56',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '0.4rem 0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Upload size={13} />
                          <span>{uploadingVideo ? 'Uploading...' : (editFormData.introVideoUrl ? 'Change / Upload New Video' : 'Upload Video File')}</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={handleVideoFileUpload}
                            disabled={uploadingVideo}
                            style={{ display: 'none' }}
                          />
                        </label>

                        {editFormData.introVideoUrl && (
                          <button
                            type="button"
                            onClick={() => setEditFormData({ ...editFormData, introVideoUrl: '' })}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              border: '1px solid #FCA5A5',
                              borderRadius: '8px',
                              padding: '0.4rem 0.65rem',
                              cursor: 'pointer',
                            }}
                          >
                            <X size={13} />
                            <span>Remove Video</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                          Or Paste YouTube / Google Drive / Vimeo URL:
                        </span>
                        <input
                          type="text"
                          value={editFormData.introVideoUrl.startsWith('data:') ? 'Uploaded video file stored' : editFormData.introVideoUrl}
                          onChange={(e) => setEditFormData({ ...editFormData, introVideoUrl: e.target.value })}
                          className="form-control"
                          style={{ fontSize: '0.8rem' }}
                          placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtu.be/..."
                        />
                      </div>

                      {/* Live Video Preview Inside Modal */}
                      {editFormData.introVideoUrl && (
                        <div style={{ marginTop: '0.85rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '0.35rem' }}>
                            Live Video Playback Preview:
                          </span>
                          <div style={{ maxWidth: '400px', borderRadius: '10px', overflow: 'hidden' }}>
                            <TutorVideoPlayer
                              videoUrl={editFormData.introVideoUrl}
                              tutorName={editFormData.name}
                              maxHeight="160px"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Platform Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.82rem' }}
                  >
                    <option value="ACTIVE_VERIFIED">ACTIVE_VERIFIED</option>
                    <option value="PENDING_INTERVIEW">PENDING_INTERVIEW</option>
                    <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>Rating (out of 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editFormData.rating}
                    onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                    className="form-control"
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editFormData.isVerified}
                      onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.checked })}
                    />
                    <span>Verified Badge (isVerified)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={editFormData.hasPoliceCheck}
                      onChange={(e) => setEditFormData({ ...editFormData, hasPoliceCheck: e.target.checked })}
                    />
                    <span>Police Check Badge</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem', fontWeight: 800, backgroundColor: '#0F6E56', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Save size={16} />
                  <span>{editSaving ? 'Saving to Database...' : '💾 Save All Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
