'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  User as UserIcon, 
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
  Edit2,
  Camera,
  Upload,
  Trash2,
  Loader2,
  Check
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [parentSession, setParentSession] = useState<{ 
    userId: string; 
    name: string; 
    email: string;
    phone?: string;
    image?: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BOOKINGS' | 'REVIEWS'>('PROFILE');
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<ParentLead[]>([]);
  const [reviews, setReviews] = useState<ParentReview[]>([]);

  // Profile Form States
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentImage, setParentImage] = useState<string | null>(null);
  const [childGrade, setChildGrade] = useState('Class 10');
  const [locality, setLocality] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [initialFormState, setInitialFormState] = useState<{
    name: string;
    phone: string;
    childGrade: string;
    locality: string;
    schoolName: string;
  }>({ name: '', phone: '', childGrade: 'Class 10', locality: '', schoolName: '' });

  // Sync initial state when loaded
  useEffect(() => {
    if (parentSession) {
      setInitialFormState({
        name: parentSession.name || '',
        phone: parentSession.phone || '',
        childGrade: 'Class 10',
        locality: '',
        schoolName: '',
      });
    }
  }, [parentSession]);

  const handleCancelEdit = () => {
    setParentName(initialFormState.name);
    setParentPhone(initialFormState.phone);
    setChildGrade(initialFormState.childGrade);
    setLocality(initialFormState.locality);
    setSchoolName(initialFormState.schoolName);
    setIsEditing(false);
  };

  // Check auth session & load latest profile from DB
  useEffect(() => {
    const saved = localStorage.getItem('parent_session');
    if (!saved) {
      router.push('/parent/login');
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setParentSession(parsed);
      setParentName(parsed.name || '');
      setParentPhone(parsed.phone || '');
      setParentImage(parsed.image || null);

      fetch(`/api/parent/dashboard?userId=${parsed.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setLeads(data.leads || []);
            setReviews(data.reviews || []);
            if (data.parent) {
              setParentName(data.parent.name || parsed.name);
              setParentPhone(data.parent.phone || '');
              if (data.parent.image) {
                setParentImage(data.parent.image);
                // Update local storage
                const updatedSession = { ...parsed, name: data.parent.name, image: data.parent.image, phone: data.parent.phone };
                localStorage.setItem('parent_session', JSON.stringify(updatedSession));
                setParentSession(updatedSession);
              }
            }
          }
        })
        .catch(err => console.error('Failed to load parent dashboard:', err))
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

  const [confirmDeletePhotoOpen, setConfirmDeletePhotoOpen] = useState(false);

  // Image Upload Handler (Supports Cloudinary API with instant Data URL fallback)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !parentSession) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMsg('⚠️ Photo size must be under 5MB.');
      setTimeout(() => setSaveMsg(''), 3500);
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'tuitionforhome/parents');
      formData.append('type', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      let newImageUrl = '';

      if (data.success && data.url) {
        newImageUrl = data.url;
      } else {
        // Fallback to local Data URI if Cloudinary isn't configured in dev
        newImageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      setParentImage(newImageUrl);

      // Auto-save photo to database
      await fetch('/api/parent/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parentSession.userId,
          image: newImageUrl,
        }),
      });

      // Update local storage
      const updatedSession = { ...parentSession, image: newImageUrl };
      localStorage.setItem('parent_session', JSON.stringify(updatedSession));
      setParentSession(updatedSession);

      setSaveMsg('✓ Profile photo updated successfully!');
      setTimeout(() => setSaveMsg(''), 3500);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setSaveMsg('⚠️ Failed to upload photo. Please try again.');
      setTimeout(() => setSaveMsg(''), 3500);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const executeRemovePhoto = async () => {
    if (!parentSession) return;
    setConfirmDeletePhotoOpen(false);
    setUploadingPhoto(true);
    try {
      setParentImage(null);
      await fetch('/api/parent/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parentSession.userId,
          image: null,
        }),
      });

      const updatedSession = { ...parentSession, image: undefined };
      localStorage.setItem('parent_session', JSON.stringify(updatedSession));
      setParentSession(updatedSession);

      setSaveMsg('✓ Profile photo removed successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err) {
      console.error('Failed to remove photo:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentSession) return;

    setSavingProfile(true);
    try {
      const res = await fetch('/api/parent/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parentSession.userId,
          name: parentName,
          phone: parentPhone,
          image: parentImage,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const updatedSession = { ...parentSession, name: parentName, phone: parentPhone, image: parentImage || undefined };
        localStorage.setItem('parent_session', JSON.stringify(updatedSession));
        setParentSession(updatedSession);
        setInitialFormState({
          name: parentName,
          phone: parentPhone,
          childGrade,
          locality,
          schoolName,
        });
        setIsEditing(false);
        setSaveMsg('✓ Profile and preferences saved successfully!');
        setTimeout(() => setSaveMsg(''), 3500);
      } else {
        alert(data.error || 'Failed to save profile.');
      }
    } catch (err: any) {
      console.error('Save profile error:', err);
      alert('Failed to save profile. Please check your network.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!parentSession || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #0F6E56', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem auto' }} />
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>Loading your Parent Dashboard...</p>
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
        
        {/* =========================================================================
            TOP PARENT IDENTITY CARD WITH PHOTO AVATAR
            ========================================================================= */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '2rem',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 12px 36px rgba(15, 110, 86, 0.04)',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Interactive Avatar with Photo Upload Trigger */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: '#0F6E56',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(15, 110, 86, 0.2)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '3px solid #FFFFFF',
                }}
                title="Click to change profile photo"
              >
                {parentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={parentImage} 
                    alt={parentName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <span>{(parentName || parentSession.name || 'P').charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* Camera Badge Icon */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                title="Upload Photo"
              >
                {uploadingPhoto ? <Loader2 size={12} className="animate-spin" /> : <Camera size={13} />}
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {parentName || parentSession.name}
                </h1>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  border: '1px solid #A7F3D0'
                }}>
                  <ShieldCheck size={13} />
                  <span>VERIFIED SSSAM PARENT</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '0.25rem', fontSize: '0.82rem', color: '#64748B' }}>
                <span>{parentSession.email}</span>
                {parentPhone && <span>• {parentPhone}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              href="/tutors"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0F6E56' }}
            >
              <Sparkles size={14} />
              <span>Browse Tutors</span>
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

        {/* Hidden File Input for Avatar */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          style={{ display: 'none' }}
          onChange={handleImageFileChange}
        />

        {/* =========================================================================
            DASHBOARD TABS HEADER
            ========================================================================= */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('PROFILE')}
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
              backgroundColor: activeTab === 'PROFILE' ? '#0F6E56' : '#FFFFFF',
              color: activeTab === 'PROFILE' ? '#FFFFFF' : '#64748B',
              boxShadow: activeTab === 'PROFILE' ? '0 4px 12px rgba(15, 110, 86, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <UserIcon size={16} />
            <span>My Profile &amp; Photo</span>
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
              backgroundColor: activeTab === 'BOOKINGS' ? '#0F6E56' : '#FFFFFF',
              color: activeTab === 'BOOKINGS' ? '#FFFFFF' : '#64748B',
              boxShadow: activeTab === 'BOOKINGS' ? '0 4px 12px rgba(15, 110, 86, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Calendar size={16} />
            <span>My Tuition Requests ({leads.length})</span>
          </button>

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
              backgroundColor: activeTab === 'REVIEWS' ? '#0F6E56' : '#FFFFFF',
              color: activeTab === 'REVIEWS' ? '#FFFFFF' : '#64748B',
              boxShadow: activeTab === 'REVIEWS' ? '0 4px 12px rgba(15, 110, 86, 0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Star size={16} />
            <span>My Reviews &amp; Ratings ({reviews.length})</span>
          </button>
        </div>

        {/* Global Save Feedback Alert */}
        {saveMsg && (
          <div style={{
            padding: '0.85rem 1.25rem',
            backgroundColor: '#ECFDF5',
            color: '#059669',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            border: '1px solid #A7F3D0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <CheckCircle2 size={18} />
            <span>{saveMsg}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: PARENT PROFILE & PHOTO MANAGEMENT
            ========================================================================= */}
        {activeTab === 'PROFILE' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2.25rem',
            border: '1.5px solid #E2E8F0',
            maxWidth: '740px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Parent Profile &amp; Preferences
                  </h2>
                  {isEditing && (
                    <span style={{
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '999px',
                      border: '1px solid #BFDBFE',
                    }}>
                      EDITING MODE
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.35rem', margin: 0, lineHeight: 1.5 }}>
                  {isEditing
                    ? 'Edit your details below and click "Save Changes" to update your account.'
                    : 'Your personal information, photo, and child tutoring preferences.'}
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    borderColor: '#0F6E56',
                    color: '#0F6E56',
                  }}
                >
                  <Edit2 size={14} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Profile Photo Upload Section */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.25rem',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                backgroundColor: '#0F6E56',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                flexShrink: 0,
                overflow: 'hidden',
                border: '3px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
              }}>
                {parentImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={parentImage} alt="Parent Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{(parentName || 'P').charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.2rem' }}>
                  Profile Picture
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.75rem' }}>
                  Upload a clean JPG, PNG or WebP photo (Max 5MB).
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                  >
                    {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>{parentImage ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {parentImage && (
                    <button
                      type="button"
                      onClick={() => setConfirmDeletePhotoOpen(true)}
                      disabled={uploadingPhoto}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#DC2626' }}
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Full Name <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isEditing}
                    placeholder="e.g. Pooja Sharma"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="form-control"
                    style={{
                      fontSize: '0.9rem',
                      borderRadius: '10px',
                      backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC',
                      cursor: isEditing ? 'text' : 'default',
                      border: isEditing ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Email Address <span style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>(Verified)</span>
                  </label>
                  <input
                    type="email"
                    value={parentSession.email}
                    disabled
                    className="form-control"
                    style={{ fontSize: '0.9rem', backgroundColor: '#F8FAFC', color: '#64748B', borderRadius: '10px', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Mobile Number (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    placeholder="e.g. +91 9811223344"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="form-control"
                    style={{
                      fontSize: '0.9rem',
                      borderRadius: '10px',
                      backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC',
                      cursor: isEditing ? 'text' : 'default',
                      border: isEditing ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                    }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Residential Locality (Gurgaon)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="e.g. DLF Phase 5, Sector 56"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="form-control"
                    style={{
                      fontSize: '0.9rem',
                      borderRadius: '10px',
                      backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC',
                      cursor: isEditing ? 'text' : 'default',
                      border: isEditing ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Child&apos;s Target Class
                  </label>
                  <select
                    value={childGrade}
                    disabled={!isEditing}
                    onChange={(e) => setChildGrade(e.target.value)}
                    className="form-control"
                    style={{
                      fontSize: '0.9rem',
                      borderRadius: '10px',
                      backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC',
                      cursor: isEditing ? 'pointer' : 'default',
                      border: isEditing ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                    }}
                  >
                    {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 12 (Science)', 'Class 12 (Commerce)', 'Competitive (JEE/NEET)'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Child&apos;s School Name (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    placeholder="e.g. The Shri Ram School, Aravali"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="form-control"
                    style={{
                      fontSize: '0.9rem',
                      borderRadius: '10px',
                      backgroundColor: isEditing ? '#FFFFFF' : '#F8FAFC',
                      cursor: isEditing ? 'text' : 'default',
                      border: isEditing ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {isEditing ? (
                  <>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="btn btn-primary btn-md"
                      style={{
                        backgroundColor: '#0F6E56',
                        padding: '0.75rem 1.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        fontWeight: 800,
                      }}
                    >
                      {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      <span>{savingProfile ? 'Saving Changes...' : 'Save Changes'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      className="btn btn-secondary btn-md"
                      style={{ padding: '0.75rem 1.25rem', fontWeight: 600 }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary btn-md"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontWeight: 700,
                      borderColor: '#0F6E56',
                      color: '#0F6E56',
                    }}
                  >
                    <Edit2 size={15} />
                    <span>Edit Profile Details</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 2: BOOKINGS & TUITION REQUESTS
            ========================================================================= */}
        {activeTab === 'BOOKINGS' && (
          <div>
            {leads.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                border: '1.5px dashed #CBD5E1'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <Calendar size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  No Active Tuition Requests Yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                  You haven’t requested an educator match yet. Browse our verified tutors or request a custom assignment in 2 minutes.
                </p>
                <Link
                  href="/tutors"
                  className="btn btn-primary btn-md"
                  style={{ backgroundColor: '#0F6E56', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Sparkles size={16} />
                  <span>Find Home Tutors in Gurgaon</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1.25rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.2rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          backgroundColor: lead.status === 'TUITION_CONFIRMED' ? '#ECFDF5' : '#FEF3C7',
                          color: lead.status === 'TUITION_CONFIRMED' ? '#059669' : '#D97706',
                          border: `1px solid ${lead.status === 'TUITION_CONFIRMED' ? '#A7F3D0' : '#FDE68A'}`
                        }}>
                          {lead.status.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                          Submitted: {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
                        {lead.gradeClass} • {(() => {
                          try {
                            const parsed = JSON.parse(lead.subjectsNeeded);
                            return Array.isArray(parsed) ? parsed.join(', ') : lead.subjectsNeeded;
                          } catch {
                            return lead.subjectsNeeded;
                          }
                        })()}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#64748B' }}>
                        <MapPin size={14} color="#0F6E56" />
                        <span>{lead.locality}</span>
                        <span>•</span>
                        <span>{lead.preferredMode === 'ONLINE_LIVE' ? '💻 Online 1-on-1' : '🏡 Home Visits'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
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

        {/* =========================================================================
            TAB 3: REVIEWS & RATINGS
            ========================================================================= */}
        {activeTab === 'REVIEWS' && (
          <div>
            {reviews.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                border: '1.5px dashed #CBD5E1'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                  <Star size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  No Educator Reviews Yet
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
                  Once your child starts regular classes, you can submit verified reviews and rate educator pacing directly from this portal.
                </p>
                <Link
                  href="/tutors"
                  className="btn btn-primary btn-md"
                  style={{ backgroundColor: '#0F6E56', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Sparkles size={16} />
                  <span>Browse Verified Educators</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '1.5rem',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#0F6E56', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                          {rev.tutorName.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{rev.tutorName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{rev.tutorDegree || 'Subject Specialist'}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={15} color="#F59E0B" fill="#F59E0B" />
                        ))}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          CENTERED CUSTOM CONFIRMATION POPUP MODAL
          ========================================================================= */}
      {confirmDeletePhotoOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '2.25rem 2rem',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              border: '1px solid #FECACA',
            }}>
              <Trash2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Remove Profile Photo?
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.75rem' }}>
              Are you sure you want to remove your profile photo? You can always upload a new one anytime.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setConfirmDeletePhotoOpen(false)}
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 700 }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={executeRemovePhoto}
                className="btn"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  fontWeight: 800,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <Trash2 size={15} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
