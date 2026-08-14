'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GURGAON_LOCALITIES,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
} from '@/lib/data';
import {
  GraduationCap,
  ShieldCheck,
  Video,
  Home,
  MapPin,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  User,
  Mail,
  Phone,
  Settings,
  Edit2,
  Lock,
  Plus,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  LogOut,
  Menu,
  Globe,
  Share2,
  Camera,
  Image as ImageIcon,
  Briefcase,
  Building,
  BookOpen,
  Trash2,
  Calendar,
  Award
} from 'lucide-react';

export interface QualificationItem {
  id: string;
  degree: string;
  institute: string;
  year: string;
  grade?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  description?: string;
}

export default function TutorProfileDashboard() {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'EDIT_INFO' | 'KYC_SECURITY'>('STATUS');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Loading & Session states
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tutor session info
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('tutor_session');
    window.location.href = '/tutor/register';
  };

  // Profile data states
  const [profileStatus, setProfileStatus] = useState('DRAFT');
  const [isVerified, setIsVerified] = useState(false);
  const [hasPoliceCheck, setHasPoliceCheck] = useState(false);
  const [rating, setRating] = useState(5.0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [reviews, setReviews] = useState<{ id: string; parentName: string; rating: number; comment: string; createdAt: string }[]>([]);
  const [reviewLink, setReviewLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [bio, setBio] = useState('');
  const [highestDegree, setHighestDegree] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [teachingMode, setTeachingMode] = useState<'BOTH' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('BOTH');
  
  // LinkedIn-style Qualifications & Experiences
  const [qualifications, setQualifications] = useState<QualificationItem[]>([]);
  const [showAddQual, setShowAddQual] = useState(false);
  const [draftQual, setDraftQual] = useState<{ degree: string; institute: string; year: string; grade: string }>({
    degree: '',
    institute: '',
    year: '',
    grade: ''
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [showAddExp, setShowAddExp] = useState(false);
  const [draftExp, setDraftExp] = useState<{ role: string; organization: string; startYear: string; endYear: string; isCurrent: boolean; description: string }>({
    role: '',
    organization: '',
    startYear: '',
    endYear: '',
    isCurrent: true,
    description: ''
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Arrays
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);

  // Search & Custom Adders
  const [subjectSearch, setSubjectSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [customBoard, setCustomBoard] = useState('');
  const [customArea, setCustomArea] = useState('');

  // Rates
  const [hourlyRateHomeMin, setHourlyRateHomeMin] = useState(500);
  const [hourlyRateHomeMax, setHourlyRateHomeMax] = useState(1000);
  const [hourlyRateOnlineMin, setHourlyRateOnlineMin] = useState(400);
  const [hourlyRateOnlineMax, setHourlyRateOnlineMax] = useState(800);
  const [travelRadiusKm, setTravelRadiusKm] = useState(5);

  // KYC
  const [idType, setIdType] = useState('AADHAAR_MASKED');
  const [idLast4, setIdLast4] = useState('');
  const [idDocUrl, setIdDocUrl] = useState('');
  const [isPublicVisibility, setIsPublicVisibility] = useState(true);

  // Load session and fetch database profile details
  useEffect(() => {
    const savedUser = localStorage.getItem('tutor_session');
    if (!savedUser) {
      // Redirect to login if no session is active
      window.location.href = '/tutor/register';
      return;
    }
    
    const parsed = JSON.parse(savedUser);
    setUserId(parsed.userId);
    setUserName(parsed.name);
    setUserEmail(parsed.email);

    // Fetch live profile details
    fetch(`/api/tutors/profile/setup?userId=${parsed.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          const prof = data.profile;
          setProfileStatus(prof.status);
          setIsVerified(prof.isVerified);
          setHasPoliceCheck(prof.hasPoliceCheck || false);
          setRating(prof.rating || 5.0);
          setAvatarUrl(prof.avatarUrl || '');
          setBio(prof.bio || '');
          setHighestDegree(prof.highestDegree || '');
          setExperienceYears(prof.experienceYears || 0);
          setTeachingMode(prof.teachingMode || 'BOTH');
          
          if (prof.qualifications && prof.qualifications.length > 0) {
            setQualifications(prof.qualifications);
          } else if (prof.highestDegree) {
            setQualifications([{
              id: '1',
              degree: prof.highestDegree,
              institute: 'Delhi University / Reputed College',
              year: '2021',
              grade: 'First Division'
            }]);
          }

          if (prof.experiences && prof.experiences.length > 0) {
            setExperiences(prof.experiences);
          } else if (prof.experienceYears > 0) {
            setExperiences([{
              id: '1',
              role: 'Senior Private Educator & Subject Expert',
              organization: 'Gurgaon Home & Online Tutoring',
              startYear: `${new Date().getFullYear() - (prof.experienceYears || 3)}`,
              endYear: 'Present',
              isCurrent: true,
              description: 'Providing personalized one-on-one conceptual learning and test preparation for students.'
            }]);
          }

          setSelectedSubjects(prof.subjects || []);
          setSelectedClasses(prof.classes || []);
          setSelectedBoards(prof.boards || []);
          setServiceAreas(prof.serviceAreas || []);
          
          setHourlyRateHomeMin(prof.hourlyRateHomeMin || 500);
          setHourlyRateHomeMax(prof.hourlyRateHomeMax || 1000);
          setHourlyRateOnlineMin(prof.hourlyRateOnlineMin || 400);
          setHourlyRateOnlineMax(prof.hourlyRateOnlineMax || 800);
          setTravelRadiusKm(prof.travelRadiusKm || 5);

          if (prof.kycDoc) {
            setIdType(prof.kycDoc.idType);
            setIdLast4(prof.kycDoc.idLast4);
            setIdDocUrl(prof.kycDoc.idDocUrl);
          }

          // Set the official hosted review & profile link for this tutor
          setReviewLink(`https://tuitionforhome.com/tutor/review/${parsed.userId}`);

          // Fetch reviews for this tutor
          fetch(`/api/tutors/reviews?userId=${parsed.userId}`)
            .then(r => r.json())
            .then(rd => {
              if (rd.success) setReviews(rd.reviews || []);
            });

          // If the profile is in DRAFT status, redirect to register to complete onboarding first
          if (prof.status === 'DRAFT') {
            window.location.href = '/tutor/register';
          }
        } else {
          setErrorMsg(data.error || 'Failed to fetch tutor profile.');
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg('Network error fetching profile details.');
        setLoading(false);
      });
  }, []);

  // Handle direct profile picture upload from Camera icon or file picker
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Profile photo size must be less than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      setAvatarUrl(base64Data);
      setAvatarUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const res = await fetch('/api/tutors/profile/setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            avatarUrl: base64Data,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('✨ Profile picture updated successfully!');
        } else {
          setErrorMsg(data.error || 'Failed to save profile picture.');
        }
      } catch {
        setErrorMsg('Network error updating profile picture.');
      } finally {
        setAvatarUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Qualifications Add & Delete Handlers
  const handleAddQualification = () => {
    if (!draftQual.degree.trim() || !draftQual.institute.trim()) {
      setErrorMsg('Please enter both Degree / Course and Institute name.');
      return;
    }
    const item: QualificationItem = {
      id: Date.now().toString(),
      degree: draftQual.degree.trim(),
      institute: draftQual.institute.trim(),
      year: draftQual.year.trim() || `${new Date().getFullYear()}`,
      grade: draftQual.grade.trim() || undefined
    };
    const updated = [...qualifications, item];
    setQualifications(updated);
    if (!highestDegree) setHighestDegree(item.degree);
    setDraftQual({ degree: '', institute: '', year: '', grade: '' });
    setShowAddQual(false);
    setSuccessMsg('Education qualification added.');
  };

  const handleDeleteQualification = (id: string) => {
    setQualifications(prev => prev.filter(q => q.id !== id));
  };

  // Helper to auto-calculate total experience years from teaching timeline
  const calculateTotalExperienceYears = (items: ExperienceItem[]) => {
    if (!items || items.length === 0) return 0;
    const currentYear = new Date().getFullYear();
    let earliestYear = currentYear;
    let hasValidYear = false;

    items.forEach(item => {
      const start = parseInt(item.startYear, 10);
      if (!isNaN(start) && start > 1980 && start <= currentYear) {
        hasValidYear = true;
        if (start < earliestYear) earliestYear = start;
      }
    });

    if (!hasValidYear) return items.length * 2;
    return Math.max(1, currentYear - earliestYear);
  };

  // Experiences Add & Delete Handlers
  const handleAddExperience = () => {
    if (!draftExp.role.trim() || !draftExp.organization.trim()) {
      setErrorMsg('Please enter both Role Title and School / Organization.');
      return;
    }
    const item: ExperienceItem = {
      id: Date.now().toString(),
      role: draftExp.role.trim(),
      organization: draftExp.organization.trim(),
      startYear: draftExp.startYear.trim() || `${new Date().getFullYear() - 2}`,
      endYear: draftExp.isCurrent ? 'Present' : (draftExp.endYear.trim() || `${new Date().getFullYear()}`),
      isCurrent: draftExp.isCurrent,
      description: draftExp.description.trim() || undefined
    };
    const updated = [...experiences, item];
    setExperiences(updated);
    setExperienceYears(calculateTotalExperienceYears(updated));
    setDraftExp({ role: '', organization: '', startYear: '', endYear: '', isCurrent: true, description: '' });
    setShowAddExp(false);
    setSuccessMsg('Teaching experience added.');
  };

  const handleDeleteExperience = (id: string) => {
    const updated = experiences.filter(e => e.id !== id);
    setExperiences(updated);
    setExperienceYears(calculateTotalExperienceYears(updated));
  };

  // Save profile updates to the database after confirmation in Preview
  const handleActualSaveProfile = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    setSaveLoading(true);

    try {
      const res = await fetch('/api/tutors/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          highestDegree,
          qualifications,
          experiences,
          experienceYears,
          teachingMode,
          subjects: selectedSubjects,
          classes: selectedClasses,
          boards: selectedBoards,
          serviceAreas,
          travelRadiusKm,
          hourlyRateHomeMin,
          hourlyRateHomeMax,
          hourlyRateOnlineMin,
          hourlyRateOnlineMax,
          bio,
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('🎉 Professional profile saved successfully.');
        setShowPreviewModal(false);
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (e) {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreviewModal(true);
  };

  // Helper toggle list
  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Filter list options
  const filteredSubjects = SUBJECT_OPTIONS.filter(sub => 
    sub.toLowerCase().includes(subjectSearch.toLowerCase())
  );
  
  const filteredSectors = GURGAON_LOCALITIES.filter(loc =>
    loc.name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border-hairline)', borderTopColor: 'var(--brand-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
            <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Loading educator dashboard...</strong>
          </div>
          <style jsx>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)', width: '100%', overflowX: 'hidden' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.75rem 0 5rem 0', width: '100%' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          
          <div className="profile-dashboard-layout">
            
            {/* 1. LEFT STICKY BRAND SIDEBAR (Figma Style) */}
            <aside className="profile-sidebar-wrapper">
              <div>
                {/* User Avatar + Camera Update Icon + Status Block */}
                <div className="profile-sidebar-avatar-row" style={{ textAlign: 'center', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-hairline)' }}>
                  
                  {/* Hidden File Input for Avatar */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {/* Avatar Circle Container with Camera Badge */}
                  <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 0.75rem auto' }}>
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={userName}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #FFFFFF',
                          boxShadow: '0 8px 20px rgba(13, 148, 136, 0.22)',
                          cursor: 'pointer'
                        }}
                      />
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--brand-teal)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.85rem',
                          fontWeight: 900,
                          boxShadow: '0 8px 20px rgba(13, 148, 136, 0.22)',
                          border: '3px solid #FFFFFF',
                          cursor: 'pointer'
                        }}
                      >
                        {userName.charAt(0)}
                      </div>
                    )}

                    {/* Camera Change Button Icon */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Update profile picture"
                      disabled={avatarUploading}
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-teal)',
                        color: '#FFFFFF',
                        border: '2px solid #FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.backgroundColor = 'var(--brand-teal-hover)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = 'var(--brand-teal)';
                      }}
                    >
                      {avatarUploading ? (
                        <div style={{ width: '10px', height: '10px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                      ) : (
                        <Camera size={13} />
                      )}
                    </button>
                  </div>

                  <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>{userName}</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>{userEmail}</span>
                  
                  {/* Status Badges */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    {profileStatus === 'ACTIVE_VERIFIED' ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        backgroundColor: 'var(--brand-teal-light)',
                        color: 'var(--brand-teal)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(45,212,191,0.4)'
                      }}>
                        ✓ ACTIVE VERIFIED
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        backgroundColor: '#FEF3C7',
                        color: '#D97706',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        border: '1px solid rgba(217,119,6,0.25)'
                      }}>
                        ⏳ UNDER VERIFICATION
                      </span>
                    )}

                    {hasPoliceCheck && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#FFFBEB',
                        color: '#D97706',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        border: '1px solid #FCD34D'
                      }}>
                        🛡️ GOLD SHIELD
                      </span>
                    )}
                  </div>
                </div>

                {/* Navigation Tabs List (Figma Style) */}
                <nav className="profile-sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('STATUS'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'STATUS' ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Profile Status</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('EDIT_INFO'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'EDIT_INFO' ? 'active' : ''}`}
                  >
                    <Edit2 size={18} />
                    <span>Teaching Info</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('KYC_SECURITY'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'KYC_SECURITY' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={18} />
                    <span>KYC & Reviews</span>
                  </button>
                </nav>

                {/* On-Page Quick Jump Links (Visible when Editing Info) */}
                {activeTab === 'EDIT_INFO' && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '14px',
                    border: '1px solid var(--border-hairline)'
                  }}>
                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                      On This Form
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.78rem' }}>
                      <a href="#section-photo" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '0.25rem 0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        📸 <span>Photo &amp; Qualifications</span>
                      </a>
                      <a href="#section-experience" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '0.25rem 0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        💼 <span>Teaching Experience</span>
                      </a>
                      <a href="#section-mode" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '0.25rem 0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        🏠 <span>Teaching Mode &amp; Bio</span>
                      </a>
                      <a href="#section-subjects" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '0.25rem 0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        📚 <span>Subjects &amp; Classes</span>
                      </a>
                      <a href="#section-pricing" style={{ color: 'var(--text-muted)', textDecoration: 'none', padding: '0.25rem 0.4rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        📍 <span>Sectors &amp; Hourly Rates</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Profile Completeness Meter */}
                <div style={{
                  marginTop: '1.25rem',
                  padding: '1rem',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border-hairline)',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>Profile Strength</span>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-teal)' }}>
                      {avatarUrl && qualifications.length > 0 && experiences.length > 0 && selectedSubjects.length > 0 ? '95%' : '75%'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.65rem' }}>
                    <div style={{
                      width: avatarUrl && qualifications.length > 0 && experiences.length > 0 && selectedSubjects.length > 0 ? '95%' : '75%',
                      height: '100%',
                      backgroundColor: 'var(--brand-teal)',
                      borderRadius: '999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: avatarUrl ? 'var(--brand-teal)' : 'var(--text-light)' }}>
                      ✓ {avatarUrl ? 'Photo Uploaded' : 'Add Profile Photo'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: qualifications.length > 0 ? 'var(--brand-teal)' : 'var(--text-light)' }}>
                      ✓ {qualifications.length > 0 ? 'Degrees Verified' : 'Add Qualifications'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: experiences.length > 0 ? 'var(--brand-teal)' : 'var(--text-light)' }}>
                      ✓ {experiences.length > 0 ? 'Experience Listed' : 'Add Experience'}
                    </div>
                  </div>
                </div>

                {/* Counselor Quick Hotline Card */}
                <div style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid var(--border-hairline)',
                  borderRadius: '14px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}>
                  <strong style={{ fontSize: '0.76rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={13} style={{ color: 'var(--brand-teal)' }} />
                    <span>Counselor Hotline</span>
                  </strong>
                  <span>Need help? Call our Gurgaon desk:</span>
                  <a href="tel:+919217031899" style={{ color: 'var(--brand-teal)', fontWeight: 800, textDecoration: 'none', fontSize: '0.8rem' }}>
                    +91 92170 31899
                  </a>
                </div>
              </div>

              {/* Sidebar Bottom SSSAM Seal */}
              <div style={{
                backgroundColor: 'var(--brand-teal-light)',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                borderRadius: '14px',
                padding: '0.85rem',
                fontSize: '0.72rem',
                color: 'var(--brand-teal)',
                lineHeight: 1.45
              }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                  <ShieldCheck size={14} />
                  <span>SSSAM Verified Portal</span>
                </div>
                <span>Central document verification & physical audit center in Sector 14, Gurgaon.</span>
              </div>
            </aside>

            {/* 2. RIGHT CONTENT PANEL */}
            <div className="profile-content-card">
              
              {/* Error and Success notifications */}
              {errorMsg && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.85rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  {successMsg}
                </div>
              )}

              {/* TAB 1: PROFILE STATUS & STEPPER */}
              {activeTab === 'STATUS' && (
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Account Verification Status</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Track your onboarding and audit status supervised by SSSAM Academy.</p>

                  {/* Verification Progress Stepper */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2.5rem', marginBottom: '2.5rem' }}>
                    {/* Vertical connecting bar */}
                    <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', backgroundColor: 'var(--border-hairline)', zIndex: 0 }} />

                    {/* Step 1 */}
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-2.5rem', top: '2px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 1 }}>✓</div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>Step 1: Complete Onboarding Profile Setup</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--brand-teal)', fontWeight: 700 }}>COMPLETED (Onboarding wizard successfully submitted)</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: '-2.5rem', 
                        top: '2px', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: profileStatus === 'ACTIVE_VERIFIED' ? 'var(--brand-teal)' : '#FEF3C7', 
                        color: profileStatus === 'ACTIVE_VERIFIED' ? '#FFFFFF' : '#D97706', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        zIndex: 1 
                      }}>
                        {profileStatus === 'ACTIVE_VERIFIED' ? '✓' : '2'}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>Step 2: Counselor Screening & Auditing</strong>
                        {profileStatus === 'ACTIVE_VERIFIED' ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--brand-teal)', fontWeight: 700 }}>COMPLETED (Verification cleared by SSSAM counselor)</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>IN PROGRESS (Our counselor will call you within 24 hours to schedule video call screening)</span>
                        )}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div style={{ position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', 
                        left: '-2.5rem', 
                        top: '2px', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: profileStatus === 'ACTIVE_VERIFIED' ? 'var(--brand-teal)' : '#F1F5F9', 
                        color: profileStatus === 'ACTIVE_VERIFIED' ? '#FFFFFF' : 'var(--text-light)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        zIndex: 1 
                      }}>
                        {profileStatus === 'ACTIVE_VERIFIED' ? '✓' : '3'}
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)' }}>Step 3: Profile Active & Search Listing Live</strong>
                        {profileStatus === 'ACTIVE_VERIFIED' ? (
                          <span style={{ fontSize: '0.75rem', color: 'var(--brand-teal)', fontWeight: 700 }}>ACTIVE (Your profile is now live in Gurgaon tutor directory!)</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>PENDING (Profile search is locked until screening is cleared)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Public profile view preview if active */}
                  {profileStatus === 'ACTIVE_VERIFIED' && (
                    <div style={{
                      backgroundColor: 'var(--brand-teal-light)',
                      border: '1.5px solid var(--border-teal)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={16} />
                        <span>Congratulations! Your profile is public.</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--brand-teal)', lineHeight: 1.5, margin: 0 }}>
                        Gurgaon parents looking for tutors matching your subjects and sectors can now view your professional stats, experience, hourly fee tiers, and intro video. Active matches will be sent directly to your mobile phone!
                      </p>
                    </div>
                  )}

                  {/* Academic Counselor Screening & Support Widget */}
                  <div style={{
                    marginTop: '1.75rem',
                    padding: '1.5rem',
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid var(--border-hairline)',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--brand-teal-light)',
                        color: 'var(--brand-teal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Phone size={20} />
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.98rem', color: 'var(--text-main)', display: 'block', fontWeight: 800 }}>
                          Academic Counselor Support &amp; Verification Help
                        </strong>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          Our verification team is available Mon–Sat (10:00 AM – 6:00 PM) to assist you
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      {/* Box 1: Callback Expectation */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Expected Callback Window</span>
                        <strong style={{ fontSize: '0.88rem', color: '#D97706', display: 'block', marginTop: '0.2rem' }}>
                          Within 24 Hours (10 AM – 6 PM)
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                          For quick 5-minute video screening &amp; parent lead allotment.
                        </span>
                      </div>

                      {/* Box 2: Direct Helpline & WhatsApp */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Direct Helpline &amp; WhatsApp</span>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--brand-teal)', display: 'block', marginTop: '0.2rem' }}>
                          +91 92170 31899
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                          SSSAM Academy, Sector 14, Old DLF, Gurgaon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Digital Visiting Card Showcase */}
                  <div style={{ marginTop: '2.25rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 800 }}>
                          📇 Official Tutor Business Visiting Card
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          Share your verified digital card with Gurgaon parents on WhatsApp &amp; social media
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        backgroundColor: '#FEF3C7',
                        color: '#B45309',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #FDE68A'
                      }}>
                        ID: TFH-{userId ? userId.slice(0, 6).toUpperCase() : 'GUR01'}
                      </span>
                    </div>

                    {/* The Card Itself */}
                    <div
                      id="tutor-digital-visiting-card"
                      style={{
                        width: '100%',
                        maxWidth: '480px',
                        background: 'linear-gradient(135deg, #0F172A 0%, #115E59 65%, #0F172A 100%)',
                        color: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 16px 36px rgba(13, 148, 136, 0.18)',
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        boxSizing: 'border-box'
                      }}
                    >
                      {/* Decorative Ambient Circles */}
                      <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.22) 0%, transparent 70%)', filter: 'blur(12px)', pointerEvents: 'none' }} />
                      <div style={{ position: 'absolute', left: '-30px', top: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)', filter: 'blur(8px)', pointerEvents: 'none' }} />

                      {/* Top Header of Card */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '0.3rem 0.65rem', borderRadius: '8px' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/tuitionforhome.png" alt="Logo" style={{ height: '18px', width: 'auto' }} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>TuitionForHome</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            color: '#E2E8F0',
                            letterSpacing: '0.04em',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.15)'
                          }}>
                            ID: TFH-{userId ? userId.slice(0, 6).toUpperCase() : 'GUR01'}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.68rem', fontWeight: 800, color: '#FCD34D', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.55rem', borderRadius: '999px', border: '1px solid rgba(252, 211, 77, 0.3)' }}>
                            <ShieldCheck size={13} />
                            <span>SSSAM VERIFIED</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Middle Row: Avatar, Name, Degree, QR */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                        
                        {/* Left: Avatar + Details */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                          {avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatarUrl}
                              alt={userName}
                              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2DD4BF', boxShadow: '0 4px 10px rgba(0,0,0,0.25)', flexShrink: 0 }}
                            />
                          ) : (
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, border: '2px solid #2DD4BF', flexShrink: 0 }}>
                              {userName.charAt(0)}
                            </div>
                          )}

                          <div style={{ minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {userName}
                            </strong>
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#2DD4BF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.1rem' }}>
                              {highestDegree || 'Verified Educator'}
                            </span>
                            <span style={{ display: 'block', fontSize: '0.68rem', color: '#CBD5E1', marginTop: '0.2rem' }}>
                              {teachingMode === 'BOTH' ? '🏠 Home Visit & Online' : teachingMode === 'OFFLINE_HOME' ? '🏠 Home Visit Tuition' : '💻 Online Live Classes'}
                              {selectedClasses.length > 0 ? ` • ${selectedClasses.slice(0, 2).join(', ')}` : ` • ${experienceYears || 3}+ Yrs Exp`}
                            </span>
                          </div>
                        </div>

                        {/* Right: Real Scannable QR Code */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                          <div style={{ backgroundColor: '#FFFFFF', padding: '0.35rem', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(reviewLink || `https://tuitionforhome.com/tutor/review/${userId}`)}`}
                              alt="Scan Profile QR"
                              style={{ width: '50px', height: '50px', display: 'block' }}
                            />
                          </div>
                          <span style={{ fontSize: '0.55rem', color: '#CBD5E1', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                            Scan to View
                          </span>
                        </div>
                      </div>

                      {/* Bottom Pills Row: Subjects, Boards & Location */}
                      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {selectedSubjects.slice(0, 3).map(sub => (
                            <span key={sub} style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.12)', color: '#E2E8F0', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              {sub}
                            </span>
                          ))}
                          {selectedBoards.length > 0 && (
                            <span style={{ fontSize: '0.62rem', fontWeight: 700, backgroundColor: 'rgba(45,212,191,0.2)', color: '#2DD4BF', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              {selectedBoards[0]}
                            </span>
                          )}
                          {selectedSubjects.length > 3 && (
                            <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>+{selectedSubjects.length - 3}</span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.65rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={11} style={{ color: '#2DD4BF' }} />
                          <span>{serviceAreas.length > 0 ? serviceAreas.slice(0, 2).join(', ') : 'Gurgaon'} ({travelRadiusKm} KM)</span>
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Buttons Below Card */}
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                      {/* WhatsApp Share */}
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hello! View my verified TuitionForHome tutor profile and book a home tuition demo in Gurgaon: ${reviewLink || `https://tuitionforhome.com/tutor/review/${userId}`}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.78rem',
                          backgroundColor: '#ECFDF5',
                          color: '#059669',
                          borderColor: '#A7F3D0',
                          textDecoration: 'none'
                        }}
                      >
                        <Share2 size={13} />
                        <span>Share on WhatsApp</span>
                      </a>

                      {/* Copy Profile Link */}
                      <button
                        type="button"
                        onClick={() => {
                          const link = reviewLink || `https://tuitionforhome.com/tutor/review/${userId}`;
                          navigator.clipboard.writeText(link);
                          setLinkCopied(true);
                          setSuccessMsg('📋 Profile & visiting card link copied to clipboard!');
                          setTimeout(() => setLinkCopied(false), 3000);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}
                      >
                        <FileText size={13} />
                        <span>{linkCopied ? '✓ Link Copied!' : 'Copy Card Link'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: EDIT PROFESSIONAL INFO FORM */}
              {activeTab === 'EDIT_INFO' && (
                <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Update Teaching Profile Details</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update your qualifications, subjects, classes, pricing, and locations.</p>

                    {/* Dynamic Specialty Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.75rem', textAlign: 'left' }}>
                      {selectedSubjects.some(s => ['Mathematics', 'Maths', 'Math', 'Physics', 'Chemistry', 'Biology', 'Science'].includes(s)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.15)', display: 'inline-block' }}>
                          🔬 SCIENCE SPECIALIST
                        </span>
                      )}
                      {selectedBoards.some(b => ['IB', 'IGCSE', 'Cambridge'].includes(b)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(22,163,74,0.15)', display: 'inline-block' }}>
                          📐 PREMIUM BOARD EXPERT (IB/CIE)
                        </span>
                      )}
                      {selectedClasses.some(c => ['Class 11', 'Class 12', 'Grade 11', 'Grade 12'].includes(c)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(124,58,237,0.15)', display: 'inline-block' }}>
                          🎓 SENIOR GRADE EXPERT (11-12)
                        </span>
                      )}
                      {serviceAreas.length > 0 && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#FFF7ED', color: '#EA580C', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(234,88,12,0.15)', display: 'inline-block' }}>
                          📍 LOCAL MATCH ELIGIBLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Photo Tile */}
                  <div id="section-photo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.15rem 1.35rem',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)'
                  }}>
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={userName}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.15)',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-teal)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        flexShrink: 0
                      }}>
                        {userName.charAt(0)}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 750 }}>
                        Profile Photograph
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        Upload a clear portrait to build trust with parents. (PNG, JPG, max 4MB)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap', fontSize: '0.78rem' }}
                    >
                      <Camera size={14} />
                      <span>{avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                  </div>

                  {/* 1. LinkedIn-style Education & Qualifications Section */}
                  <div id="section-education" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                            Education &amp; Qualifications
                          </h3>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Degrees, diplomas, and certifications that verify your academic background
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddQual(prev => !prev)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Plus size={14} />
                        <span>Add Education</span>
                      </button>
                    </div>

                    {/* Inline Add Education Form */}
                    {showAddQual && (
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid var(--border-teal)',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--brand-teal)', fontWeight: 800 }}>
                          + Add New Degree / Qualification
                        </strong>

                        <div className="profile-form-2col">
                          <div className="form-group">
                            <label className="form-label">Degree / Course Name *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. B.Tech Computer Science, M.Sc. Mathematics"
                              value={draftQual.degree}
                              onChange={e => setDraftQual({ ...draftQual, degree: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">College / University / Board *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Delhi University, IIT Delhi, CBSE"
                              value={draftQual.institute}
                              onChange={e => setDraftQual({ ...draftQual, institute: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="profile-form-2col">
                          <div className="form-group">
                            <label className="form-label">Passing Year</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 2021 or 2018-2022"
                              value={draftQual.year}
                              onChange={e => setDraftQual({ ...draftQual, year: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Grade / Percentage / Honors (Optional)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 8.8 CGPA / First Class Distinction"
                              value={draftQual.grade}
                              onChange={e => setDraftQual({ ...draftQual, grade: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => setShowAddQual(false)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddQualification}
                            className="btn btn-primary btn-sm"
                          >
                            Add to Profile
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Qualifications List Cards (LinkedIn Style) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {qualifications.map((q) => (
                        <div
                          key={q.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            padding: '1rem 1.15rem',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid var(--border-hairline)',
                            borderRadius: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        >
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-hairline)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--brand-teal)',
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                          }}>
                            <GraduationCap size={22} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '0.94rem', color: 'var(--text-main)', fontWeight: 800 }}>
                              {q.degree}
                            </strong>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                              {q.institute}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Calendar size={12} />
                                {q.year}
                              </span>
                              {q.grade && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  backgroundColor: 'var(--brand-teal-light)',
                                  color: 'var(--brand-teal)',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '6px'
                                }}>
                                  {q.grade}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteQualification(q.id)}
                            title="Remove"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {qualifications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1.5px dashed var(--border-hairline)', borderRadius: '12px' }}>
                          No qualifications added yet. Click <strong>&quot;Add Education&quot;</strong> to add your degrees and colleges.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 2. LinkedIn-style Professional Teaching Experience Section */}
                  <div id="section-experience" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                              Professional Teaching Experience
                            </h3>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              backgroundColor: '#EFF6FF',
                              color: '#2563EB',
                              padding: '0.15rem 0.55rem',
                              borderRadius: '6px',
                              border: '1px solid #DBEAFE'
                            }}>
                              {experienceYears}+ Years (Auto-Calculated)
                            </span>
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Past schools, coaching institutes, and private tutoring engagements
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddExp(prev => !prev)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}
                      >
                        <Plus size={14} />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {/* Inline Add Experience Form */}
                    {showAddExp && (
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #93C5FD',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}>
                        <strong style={{ fontSize: '0.88rem', color: '#2563EB', fontWeight: 800 }}>
                          + Add Teaching Experience
                        </strong>

                        <div className="profile-form-2col">
                          <div className="form-group">
                            <label className="form-label">Designation / Role Title *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. Senior Math Teacher, Physics Faculty, Private Tutor"
                              value={draftExp.role}
                              onChange={e => setDraftExp({ ...draftExp, role: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">School / Institute / Organization *</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. DPS Gurgaon, FIITJEE, Self-Employed"
                              value={draftExp.organization}
                              onChange={e => setDraftExp({ ...draftExp, organization: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="profile-form-2col">
                          <div className="form-group">
                            <label className="form-label">Start Year</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 2020"
                              value={draftExp.startYear}
                              onChange={e => setDraftExp({ ...draftExp, startYear: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">End Year</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. 2023 or Present"
                              disabled={draftExp.isCurrent}
                              value={draftExp.isCurrent ? 'Present' : draftExp.endYear}
                              onChange={e => setDraftExp({ ...draftExp, endYear: e.target.value })}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', marginTop: '0.35rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                              <input
                                type="checkbox"
                                checked={draftExp.isCurrent}
                                onChange={e => setDraftExp({ ...draftExp, isCurrent: e.target.checked })}
                                style={{ accentColor: 'var(--brand-teal)' }}
                              />
                              I currently teach here
                            </label>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Key Highlights / Methodology (Optional)</label>
                          <textarea
                            rows={2}
                            className="form-control"
                            style={{ height: 'auto', resize: 'vertical' }}
                            placeholder="e.g. Mentored 50+ students in Gurgaon for CBSE Board exams with average 92%+ score."
                            value={draftExp.description}
                            onChange={e => setDraftExp({ ...draftExp, description: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => setShowAddExp(false)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddExperience}
                            className="btn btn-primary btn-sm"
                          >
                            Add Experience
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Experience List Cards (LinkedIn Style) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {experiences.map((exp) => (
                        <div
                          key={exp.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            padding: '1rem 1.15rem',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid var(--border-hairline)',
                            borderRadius: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        >
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--border-hairline)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2563EB',
                            flexShrink: 0,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                          }}>
                            <Building size={22} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <strong style={{ fontSize: '0.94rem', color: 'var(--text-main)', fontWeight: 800 }}>
                                {exp.role}
                              </strong>
                              {exp.isCurrent && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 800,
                                  backgroundColor: '#ECFDF5',
                                  color: '#059669',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '6px',
                                  border: '1px solid #A7F3D0'
                                }}>
                                  Current Role
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
                              {exp.organization}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.35rem' }}>
                              <Calendar size={12} />
                              {exp.startYear} – {exp.endYear || 'Present'}
                            </span>
                            {exp.description && (
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.45rem 0 0 0', lineHeight: 1.45 }}>
                                {exp.description}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteExperience(exp.id)}
                            title="Remove"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '0.35rem',
                              borderRadius: '6px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {experiences.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1.5px dashed var(--border-hairline)', borderRadius: '12px' }}>
                          No experience items added. Click <strong>&quot;Add Experience&quot;</strong> to list your past teaching engagements.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teaching Mode Interactive Checkbox Cards */}
                  <div id="section-mode" className="form-group">
                    <label className="form-label" style={{ marginBottom: '0.65rem' }}>Teaching Mode (Select all that apply)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="profile-form-2col">
                      {/* Checkbox 1: Home Visit Tuition */}
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '1.1rem 1.25rem',
                          borderRadius: '16px',
                          border: `2px solid ${teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME' ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME' ? '0 4px 16px rgba(13, 148, 136, 0.09)' : '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME'}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const isOnline = teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE';
                            if (isChecked && isOnline) setTeachingMode('BOTH');
                            else if (isChecked && !isOnline) setTeachingMode('OFFLINE_HOME');
                            else if (!isChecked && isOnline) setTeachingMode('ONLINE_LIVE');
                            else setTeachingMode('ONLINE_LIVE');
                          }}
                          style={{
                            accentColor: 'var(--brand-teal)',
                            width: '18px',
                            height: '18px',
                            marginTop: '0.15rem',
                            cursor: 'pointer'
                          }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 800 }}>
                            🏠 Home Visit Tuition
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, display: 'block', marginTop: '0.2rem' }}>
                            You travel to the student&apos;s home in Gurgaon
                          </span>
                        </div>
                      </label>

                      {/* Checkbox 2: Online 1-on-1 Live */}
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.85rem',
                          padding: '1.1rem 1.25rem',
                          borderRadius: '16px',
                          border: `2px solid ${teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE' ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                          backgroundColor: '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE' ? '0 4px 16px rgba(13, 148, 136, 0.09)' : '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE'}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const isHome = teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME';
                            if (isChecked && isHome) setTeachingMode('BOTH');
                            else if (isChecked && !isHome) setTeachingMode('ONLINE_LIVE');
                            else if (!isChecked && isHome) setTeachingMode('OFFLINE_HOME');
                            else setTeachingMode('OFFLINE_HOME');
                          }}
                          style={{
                            accentColor: 'var(--brand-teal)',
                            width: '18px',
                            height: '18px',
                            marginTop: '0.15rem',
                            cursor: 'pointer'
                          }}
                        />
                        <div>
                          <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 800 }}>
                            💻 Online Live Classes
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, display: 'block', marginTop: '0.2rem' }}>
                            Interactive video classes (Zoom / Google Meet)
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Status Summary Pill */}
                    <div style={{ marginTop: '0.65rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.72rem',
                        fontWeight: 750,
                        padding: '0.22rem 0.7rem',
                        borderRadius: '999px',
                        backgroundColor: '#F0FDFA',
                        color: 'var(--brand-teal)',
                        border: '1px solid rgba(13, 148, 136, 0.25)'
                      }}>
                        ✓ Selected: {teachingMode === 'BOTH' ? 'Both Home Visit & Online (Maximum Leads)' : teachingMode === 'OFFLINE_HOME' ? 'Home Visit Only' : 'Online Only'}
                      </span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Summary (Bio)</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      style={{ height: 'auto', resize: 'vertical' }}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Explain your teaching pedagogy, past track record, and style..."
                    />
                  </div>

                  {/* Subjects Search & Multiselect */}
                  <div id="section-subjects" className="form-group">
                    <label className="form-label">Subjects Taught (Search or Add Custom)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {selectedSubjects.map(sub => (
                        <span key={sub} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedSubjects(selectedSubjects.filter(s => s !== sub))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Search standard subjects..."
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        className="form-control"
                      />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <input
                          type="text"
                          placeholder="Custom Subject..."
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '150px' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
                              setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
                              setCustomSubject('');
                            }
                          }}
                          className="btn btn-secondary"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', maxHeight: '110px', overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#F8FAFC' }}>
                      {filteredSubjects.map(sub => {
                        const isSelected = selectedSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSelection(sub, selectedSubjects, setSelectedSubjects)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              border: `1px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--brand-teal)' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                              fontSize: '0.72rem',
                              fontWeight: 650,
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ ' : '+ '} {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grades / Classes Taught */}
                  <div className="form-group">
                    <label className="form-label">Grade Levels Taught</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      {selectedClasses.map(c => (
                        <span key={c} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          <span>{c}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedClasses(selectedClasses.filter(x => x !== c))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Search or select grade levels..."
                        className="form-control"
                        style={{ display: 'none' }} // placeholder hidden
                      />
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      {CLASS_OPTIONS.map(c => {
                        const isSelected = selectedClasses.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleSelection(c, selectedClasses, setSelectedClasses)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--brand-teal-light)' : '#FFFFFF',
                              color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '280px', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Add Custom Grade..."
                        value={customClass}
                        onChange={(e) => setCustomClass(e.target.value)}
                        className="form-control"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customClass.trim() && !selectedClasses.includes(customClass.trim())) {
                            setSelectedClasses([...selectedClasses, customClass.trim()]);
                            setCustomClass('');
                          }
                        }}
                        className="btn btn-secondary"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Preferred Sectors (Service Areas) */}
                  <div className="form-group">
                    <label className="form-label">Preferred Gurgaon Sectors / Localities</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {serviceAreas.map(area => (
                        <span key={area} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          <span>{area}</span>
                          <button
                            type="button"
                            onClick={() => setServiceAreas(serviceAreas.filter(a => a !== area))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Search Gurgaon sectors..."
                        value={areaSearch}
                        onChange={(e) => setAreaSearch(e.target.value)}
                        className="form-control"
                      />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <input
                          type="text"
                          placeholder="Custom Sector..."
                          value={customArea}
                          onChange={(e) => setCustomArea(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '150px' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customArea.trim() && !serviceAreas.includes(customArea.trim())) {
                              setServiceAreas([...serviceAreas, customArea.trim()]);
                              setCustomArea('');
                            }
                          }}
                          className="btn btn-secondary"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '0.5rem', maxHeight: '110px', overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: '8px', padding: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#F8FAFC' }}>
                      {filteredSectors.map(loc => {
                        const isSelected = serviceAreas.includes(loc.name);
                        return (
                          <button
                            key={loc.slug}
                            type="button"
                            onClick={() => toggleSelection(loc.name, serviceAreas, setServiceAreas)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              border: `1px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--brand-teal-light)' : '#FFFFFF',
                              color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                              fontSize: '0.72rem',
                              fontWeight: 650,
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ ' : '+ '} {loc.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rates and Travel Limits */}
                  <div id="section-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                    
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                        <Home size={14} />
                        <span>Home visit Min-Max (₹/hr)</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <input type="number" className="form-control form-control-sm" value={hourlyRateHomeMin} onChange={(e) => setHourlyRateHomeMin(Number(e.target.value))} />
                        <span style={{ alignSelf: 'center', color: 'var(--text-light)' }}>-</span>
                        <input type="number" className="form-control form-control-sm" value={hourlyRateHomeMax} onChange={(e) => setHourlyRateHomeMax(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                        <Video size={14} />
                        <span>Online tuition Min-Max (₹/hr)</span>
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                        <input type="number" className="form-control form-control-sm" value={hourlyRateOnlineMin} onChange={(e) => setHourlyRateOnlineMin(Number(e.target.value))} />
                        <span style={{ alignSelf: 'center', color: 'var(--text-light)' }}>-</span>
                        <input type="number" className="form-control form-control-sm" value={hourlyRateOnlineMax} onChange={(e) => setHourlyRateOnlineMax(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                        <MapPin size={14} />
                        <span>Max Travel Radius (KM)</span>
                      </label>
                      <input type="number" className="form-control form-control-sm" style={{ marginTop: '0.2rem' }} value={travelRadiusKm} onChange={(e) => setTravelRadiusKm(Number(e.target.value))} />
                    </div>

                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="btn btn-secondary"
                      style={{
                        padding: '0.85rem 1.5rem',
                        fontSize: '0.92rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderColor: 'var(--brand-teal)',
                        color: 'var(--brand-teal)'
                      }}
                    >
                      <Eye size={17} />
                      <span>View as Parent (Live Preview)</span>
                    </button>

                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="btn btn-primary"
                      style={{ padding: '0.85rem 1.75rem', fontSize: '0.92rem', backgroundColor: 'var(--brand-teal)' }}
                    >
                      {saveLoading ? 'Saving changes...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: KYC, IDENTITY SECURITY & PUBLIC VISIBILITY SWITCH */}
              {activeTab === 'KYC_SECURITY' && (
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Identity Verification & Visibility</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your encrypted document parameters and search visibility control.</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Document details box */}
                    <div style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
                        <ShieldCheck size={16} color="var(--brand-teal)" />
                        <span>Encrypted Government Credentials</span>
                      </div>
                      
                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Document Type:</span>
                          <strong>{idType === 'AADHAAR_MASKED' ? 'Aadhaar Card' : idType === 'PAN' ? 'PAN Card' : idType}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Masked ID Number:</span>
                          <strong style={{ letterSpacing: '0.1em' }}>XXXX-XXXX-{idLast4 || '4589'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Document Photo:</span>
                          {idDocUrl ? (
                            <a href={idDocUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-teal)', fontWeight: 700, textDecoration: 'underline', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                              <span>👁️ View Uploaded Copy</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not Uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Search Visibility Control Switcher */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                          {isPublicVisibility ? <Eye size={16} color="var(--brand-teal)" /> : <EyeOff size={16} color="var(--text-light)" />}
                          <span>Tutor Profile Visibility Settings</span>
                        </div>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {isPublicVisibility 
                            ? 'Your profile is currently PUBLIC. Parents searching for home/online tutors in Gurgaon can view your info.'
                            : 'Your profile is currently PRIVATE/PAUSED. You will not show up in searches. Toggle on to get matched again.'
                          }
                        </span>
                      </div>

                      {/* Custom Sliding Toggle Switch */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsPublicVisibility(!isPublicVisibility);
                          setSuccessMsg(`🎉 Profile visibility status switched to ${!isPublicVisibility ? 'PUBLIC' : 'PRIVATE'}.`);
                        }}
                        style={{
                          width: '56px',
                          height: '30px',
                          borderRadius: '999px',
                          backgroundColor: isPublicVisibility ? 'var(--brand-teal)' : '#CBD5E1',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          padding: 0,
                          transition: 'background-color 0.25s ease',
                          flexShrink: 0
                        }}
                      >
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          position: 'absolute',
                          top: '3px',
                          left: isPublicVisibility ? '29px' : '3px',
                          transition: 'left 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }} />
                      </button>
                    </div>

                    {/* ── My Reviews ── */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      textAlign: 'left'
                    }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Sparkles size={16} color="var(--brand-teal)" />
                          <span>Parent Reviews ({reviews.length})</span>
                        </div>
                        {reviews.length > 0 && (
                          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>
                            {'★'.repeat(Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length))}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginLeft: '0.3rem' }}>
                              {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)} / 5
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Get Review Link Row */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Your Review Link — Share with Parents
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{
                            flex: 1,
                            minWidth: 0,
                            backgroundColor: '#F8FAFC',
                            border: '1px solid var(--border-hairline)',
                            borderRadius: '10px',
                            padding: '0.55rem 0.85rem',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            fontFamily: 'monospace',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {reviewLink || 'Loading...'}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(reviewLink);
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2500);
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: '0.72rem', padding: '0.5rem 0.85rem', flexShrink: 0, backgroundColor: linkCopied ? 'var(--brand-teal)' : undefined, color: linkCopied ? '#fff' : undefined, transition: 'all 0.2s ease' }}
                          >
                            {linkCopied ? '✓ Copied!' : 'Copy Link'}
                          </button>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(`Please take a moment to rate my tutoring sessions here: ${reviewLink}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              backgroundColor: '#25D366',
                              color: '#fff',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.5rem 0.85rem',
                              borderRadius: '10px',
                              textDecoration: 'none',
                              flexShrink: 0,
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </a>
                        </div>
                      </div>

                      {/* Reviews List */}
                      {reviews.length === 0 ? (
                        <div style={{
                          textAlign: 'center',
                          padding: '1.5rem 1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px dashed var(--border-hairline)'
                        }}>
                          <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>⭐</div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                            No reviews yet. Share your review link with past parents to get your first rating.
                          </p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {reviews.map((rev) => (
                            <div key={rev.id} style={{
                              padding: '0.9rem 1rem',
                              backgroundColor: '#F8FAFC',
                              borderRadius: '12px',
                              border: '1px solid var(--border-hairline)'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                                <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{rev.parentName}</strong>
                                <span style={{ fontSize: '0.85rem', color: '#F59E0B', letterSpacing: '-0.02em' }}>
                                  {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{rev.comment}</p>
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', display: 'block', marginTop: '0.35rem' }}>
                                {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SSSAM Academy Gurgaon Sector 14 help box */}
                    <div style={{
                      backgroundColor: 'var(--brand-teal-light)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      fontSize: '0.78rem',
                      color: 'var(--brand-teal)',
                      lineHeight: 1.55,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>📍 Need verification assistance?</div>
                      <span>Visit our Gurgaon Sector 14 center for physical document auditing, qualification credentials vetting, and active badge updates.</span>
                      <strong style={{ display: 'block', marginTop: '0.2rem' }}>📞 Walk-in support hotline: +91 92170 31899</strong>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* PARENT PERSPECTIVE LIVE PREVIEW MODAL */}
      {showPreviewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '780px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
            border: '1.5px solid var(--border-hairline)',
            overflow: 'hidden'
          }}>
            {/* Modal Top Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              backgroundColor: 'var(--brand-teal)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Eye size={20} />
                <div>
                  <strong style={{ fontSize: '1rem', display: 'block', fontWeight: 800 }}>
                    Parent Perspective Live Preview
                  </strong>
                  <span style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                    This is how parents across Gurgaon will view your profile &amp; credentials
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#F8FAFC' }}>
              
              {/* Tutor Top Card (Parent View) */}
              <div style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1.5px solid var(--border-hairline)',
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={userName}
                    style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand-teal-light)', boxShadow: '0 4px 15px rgba(13, 148, 136, 0.15)' }}
                  />
                ) : (
                  <div style={{ width: '84px', height: '84px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 900 }}>
                    {userName.charAt(0)}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)' }}>{userName}</h3>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                      ✓ SSSAM VERIFIED
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <span style={{ color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      ★ {rating.toFixed(1)} Rating
                    </span>
                    <span>•</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{experienceYears}+ Years Experience</span>
                    <span>•</span>
                    <span>{teachingMode === 'BOTH' ? 'Home & Online' : teachingMode === 'OFFLINE_HOME' ? 'Home Visits Only' : 'Online Classes Only'}</span>
                  </div>

                  {bio && (
                    <p style={{ margin: '0.6rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Subjects & Classes Badges */}
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.65rem' }}>
                  📚 Subjects &amp; Grade Levels Taught
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {selectedSubjects.map(sub => (
                    <span key={sub} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                      {sub}
                    </span>
                  ))}
                  {selectedClasses.map(cls => (
                    <span key={cls} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #F3E8FF' }}>
                      {cls}
                    </span>
                  ))}
                  {selectedBoards.map(brd => (
                    <span key={brd} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                      {brd} Board
                    </span>
                  ))}
                </div>
              </div>

              {/* LinkedIn-Style Education Timeline (Parent View) */}
              {qualifications.length > 0 && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    🎓 Academic Qualifications
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {qualifications.map(q => (
                      <div key={q.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)', display: 'block' }}>{q.degree}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{q.institute} • {q.year} {q.grade ? `(${q.grade})` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LinkedIn-Style Experience Timeline (Parent View) */}
              {experiences.length > 0 && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    💼 Teaching Track Record &amp; Past Experience
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {experiences.map(exp => (
                      <div key={exp.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Building size={18} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <strong style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>{exp.role}</strong>
                            {exp.isCurrent && <span style={{ fontSize: '0.62rem', fontWeight: 800, backgroundColor: '#ECFDF5', color: '#059669', padding: '0.05rem 0.4rem', borderRadius: '4px' }}>Active</span>}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{exp.organization} • {exp.startYear} – {exp.endYear || 'Present'}</span>
                          {exp.description && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rates & Coverage */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Pricing</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--brand-teal)', display: 'block', marginTop: '0.2rem' }}>
                    ₹{hourlyRateHomeMin} - ₹{hourlyRateHomeMax} / hr
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Home Visits in Gurgaon</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Service Sectors</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'block', marginTop: '0.2rem' }}>
                    {serviceAreas.length > 0 ? serviceAreas.slice(0, 3).join(', ') + (serviceAreas.length > 3 ? ` +${serviceAreas.length - 3} more` : '') : 'Gurgaon City Wide'}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Within {travelRadiusKm} KM radius</span>
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer Actions */}
            <div style={{
              padding: '1.15rem 1.75rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1.5px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              flexShrink: 0
            }}>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="btn btn-secondary"
                style={{ fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}
              >
                ← Back to Edit
              </button>

              <button
                type="button"
                onClick={handleActualSaveProfile}
                disabled={saveLoading}
                className="btn btn-primary"
                style={{ fontSize: '0.9rem', padding: '0.75rem 1.65rem', backgroundColor: 'var(--brand-teal)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', boxShadow: '0 4px 14px rgba(13, 148, 136, 0.25)' }}
              >
                <span>{saveLoading ? 'Saving to Database...' : '✓ Looks Good, Confirm & Save Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
