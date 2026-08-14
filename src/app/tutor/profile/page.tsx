'use client';

import React, { useState, useEffect } from 'react';
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
  EyeOff
} from 'lucide-react';

export default function TutorProfileDashboard() {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'EDIT_INFO' | 'KYC_SECURITY'>('STATUS');
  
  // Loading & Session states
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tutor session info
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Profile data states
  const [profileStatus, setProfileStatus] = useState('DRAFT');
  const [isVerified, setIsVerified] = useState(false);
  const [hasPoliceCheck, setHasPoliceCheck] = useState(false);
  const [rating, setRating] = useState(5.0);
  const [bio, setBio] = useState('');
  const [highestDegree, setHighestDegree] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [teachingMode, setTeachingMode] = useState<'BOTH' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('BOTH');
  
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
          setBio(prof.bio || '');
          setHighestDegree(prof.highestDegree || '');
          setExperienceYears(prof.experienceYears || 0);
          setTeachingMode(prof.teachingMode || 'BOTH');
          
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

  // Save profile updates to the database
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setSuccessMsg('🎉 Professional profile updated successfully.');
      } else {
        setErrorMsg(data.error || 'Failed to update profile.');
      }
    } catch (e) {
      setErrorMsg('Failed to connect to the server.');
    } finally {
      setSaveLoading(false);
    }
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
            <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Loading educator settings dashboard...</strong>
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '3.5rem 0 5rem 0' }}>
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          <div className="profile-dashboard-grid">
            <style jsx>{`
              .profile-dashboard-grid {
                display: grid;
                grid-template-columns: 260px 1fr;
                gap: 2.5rem;
                align-items: flex-start;
              }
              .sidebar-nav-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              }
              @media (max-width: 850px) {
                .profile-dashboard-grid {
                  display: flex;
                  flex-direction: column;
                  gap: 1.5rem;
                }
                .sidebar-nav-list {
                  flex-direction: row;
                  overflow-x: auto;
                  padding-bottom: 0.55rem;
                  border-bottom: 1px solid var(--border-hairline);
                  gap: 0.75rem;
                }
                .sidebar-nav-list::-webkit-scrollbar {
                  height: 4px;
                }
                .sidebar-nav-list::-webkit-scrollbar-thumb {
                  background-color: var(--border-hairline);
                  border-radius: 4px;
                }
              }
            `}</style>
            
            {/* 1. LEFT SIDEBAR PANEL */}
            <div className="apple-card" style={{ padding: '1.75rem', backgroundColor: '#FFFFFF' }}>
              
              {/* Tutor Profile Avatar Snapshot */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-hairline)' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-teal-light)',
                  color: 'var(--brand-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                  fontSize: '2rem',
                  fontWeight: 900,
                  border: '3px solid var(--brand-teal-light)'
                }}>
                  {userName.charAt(0)}
                </div>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 800 }}>{userName}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{userEmail}</span>
                
                {profileStatus === 'ACTIVE_VERIFIED' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                      backgroundColor: 'var(--brand-teal-light)',
                      color: 'var(--brand-teal)',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(45,212,191,0.3)'
                    }}>
                      ✓ ACTIVE VERIFIED
                    </span>
                    {hasPoliceCheck && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: '#FFFBEB',
                        color: '#D97706',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        border: '1px solid #FCD34D'
                      }}>
                        🛡️ GOLD SHIELD
                      </span>
                    )}
                  </div>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    backgroundColor: '#FEF3C7',
                    color: '#D97706',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    marginTop: '0.5rem',
                    border: '1px solid rgba(217,119,6,0.2)'
                  }}>
                    🕒 PENDING AUDIT
                  </span>
                )}
              </div>

              {/* Sidebar Tabs List */}
              <nav className="sidebar-nav-list">
                <button
                  type="button"
                  onClick={() => { setActiveTab('STATUS'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: activeTab === 'STATUS' ? 'var(--brand-teal-light)' : 'transparent',
                    color: activeTab === 'STATUS' ? 'var(--brand-teal)' : 'var(--text-main)',
                    fontWeight: 750,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <User size={16} />
                  <span>Profile Status</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: activeTab === 'STATUS' ? 1 : 0 }} />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('EDIT_INFO'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: activeTab === 'EDIT_INFO' ? 'var(--brand-teal-light)' : 'transparent',
                    color: activeTab === 'EDIT_INFO' ? 'var(--brand-teal)' : 'var(--text-main)',
                    fontWeight: 750,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Edit2 size={16} />
                  <span>Edit Teaching Info</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: activeTab === 'EDIT_INFO' ? 1 : 0 }} />
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('KYC_SECURITY'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: activeTab === 'KYC_SECURITY' ? 'var(--brand-teal-light)' : 'transparent',
                    color: activeTab === 'KYC_SECURITY' ? 'var(--brand-teal)' : 'var(--text-main)',
                    fontWeight: 750,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <Lock size={16} />
                  <span>KYC & Visibility</span>
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: activeTab === 'KYC_SECURITY' ? 1 : 0 }} />
                </button>
              </nav>

            </div>

            {/* 2. RIGHT CONTENT PANEL */}
            <div className="apple-card" style={{ padding: '2.5rem', backgroundColor: '#FFFFFF', minHeight: '440px' }}>
              
              {/* Error and Success notifications */}
              {errorMsg && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', padding: '0.75rem 1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
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

                  {/* 3. SSSAM Verification Audit Checklist */}
                  <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: '#F8FAFC', border: '1px solid var(--border-hairline)', borderRadius: '16px', textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>🛡️ SSSAM Verification Audit Checklist</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-teal)' }}>
                        <CheckCircle2 size={14} />
                        <span>Government KYC Document Encryption Secured</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: profileStatus === 'ACTIVE_VERIFIED' ? 'var(--brand-teal)' : '#D97706' }}>
                        {profileStatus === 'ACTIVE_VERIFIED' ? <CheckCircle2 size={14} /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #D97706', display: 'inline-block' }} />}
                        <span>Tutor Video Demo Screening {profileStatus === 'ACTIVE_VERIFIED' ? 'Cleared' : 'Pending Callback'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: profileStatus === 'ACTIVE_VERIFIED' ? 'var(--brand-teal)' : 'var(--text-muted)' }}>
                        {profileStatus === 'ACTIVE_VERIFIED' ? <CheckCircle2 size={14} /> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid var(--text-light)', display: 'inline-block' }} />}
                        <span>SSSAM Sector 14 Office Physical Audit {profileStatus === 'ACTIVE_VERIFIED' ? 'Cleared' : 'Pending Walk-in'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 4. Experience Journey Bridge */}
                  <div style={{ marginTop: '2rem', padding: '1.25rem', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-hairline)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>🌉 Experience Journey Bridge</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      Connecting your <strong>{experienceYears} Years</strong> of expertise with local teaching needs in Gurgaon:
                    </span>
                    
                    <div style={{ display: 'flex', alignItems: 'stretch', gap: '1rem', marginTop: '0.25rem' }}>
                      <div style={{ width: '2px', backgroundColor: 'var(--brand-teal)', margin: '4px 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '0', left: '-3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)' }} />
                        <div style={{ position: 'absolute', bottom: '0', left: '-3px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-teal)' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.75rem' }}>
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>School / Institutional Tenure ({Math.max(1, experienceYears - 3)} Years)</strong>
                          <span style={{ display: 'block', color: 'var(--text-muted)' }}>Core curriculum delivery and structured teaching methodologies.</span>
                        </div>
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>Home Visits & Local Gurgaon Tutoring (3 Years)</strong>
                          <span style={{ display: 'block', color: 'var(--text-muted)' }}>One-on-one student coaching, customized learning, and score boosters.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Digital Visiting Card Mockup */}
                  <div style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.85rem' }}>📇 Your Digital Business Visiting Card</strong>
                    
                    <div className="visiting-card" style={{
                      width: '100%',
                      maxWidth: '420px',
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%)', filter: 'blur(10px)' }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '0.35rem 0.65rem', borderRadius: '8px', marginBottom: '1.15rem', width: 'fit-content' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/tuitionforhome.png" alt="Logo" style={{ height: '20px', width: 'auto' }} />
                            <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>TuitionForHome</span>
                          </div>

                          <strong style={{ display: 'block', fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800 }}>{userName}</strong>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--brand-teal)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.15rem' }}>
                            {highestDegree || 'Professional Educator'}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.65rem', color: '#94A3B8', marginTop: '0.5rem' }}>
                            📍 Gurgaon Tutors • {travelRadiusKm} KM Limit
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ backgroundColor: '#FFFFFF', padding: '0.3rem', borderRadius: '6px', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="48" height="48" viewBox="0 0 29 29" style={{ shapeRendering: 'crispEdges' }}>
                              <path fill="#0F172A" d="M0 0h7v7H0zm1 1v5h5V1zm21-1h7v7h-7zm1 1v5h5V1zm-22 21h7v7H0zm1 1v5h5v-5zm21-1h7v7h-7zm1 1v5h5v-5zM9 0h2v2H9zm4 0h2v3h-2zm4 0h2v1h-2zm-8 4h2v3H9zm4 0h2v1h-2zm2 2h3v2h-3zm-6 3h3v2H9zm4 0h2v1h-2zm2 2h2v2h-2zm-8 10h2v2H9zm2 2h2v3h-2zm2-2h2v1h-2zm4-3h2v2h-2zm2 2h2v2h-2zm-6 3h3v2h-3zm4 0h2v1h-2z" />
                            </svg>
                          </div>
                          <span style={{
                            fontSize: '0.55rem',
                            fontWeight: 800,
                            backgroundColor: profileStatus === 'ACTIVE_VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                            color: profileStatus === 'ACTIVE_VERIFIED' ? '#34D399' : '#FBBF24',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}>
                            {profileStatus === 'ACTIVE_VERIFIED' ? '✓ Verified' : 'Pending'}
                          </span>
                        </div>
                      </div>
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

                  {/* Degree & Experience */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Highest Degree / Qualification</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={highestDegree}
                        onChange={(e) => setHighestDegree(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input
                        type="number"
                        min={0}
                        required
                        className="form-control"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  {/* Mode & Bio */}
                  <div className="form-group">
                    <label className="form-label">Teaching Mode</label>
                    <select
                      value={teachingMode}
                      onChange={(e) => setTeachingMode(e.target.value as any)}
                      className="form-control"
                    >
                      <option value="BOTH">Both Home Visit & Online</option>
                      <option value="OFFLINE_HOME">Home Visit Only</option>
                      <option value="ONLINE_LIVE">Online Only</option>
                    </select>
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
                  <div className="form-group">
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
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', padding: '1.25rem', backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                    
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

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="btn btn-primary"
                    style={{ padding: '0.85rem 1.75rem', fontSize: '0.92rem', alignSelf: 'flex-start', backgroundColor: 'var(--brand-teal)' }}
                  >
                    {saveLoading ? 'Saving changes...' : 'Save Profile Changes'}
                  </button>
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

                    {/* Request Parent Reviews Card */}
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      textAlign: 'left'
                    }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={16} color="var(--brand-teal)" />
                        <span>Request Parent Reviews</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, margin: 0 }}>
                        Get reviews from your past parents in Gurgaon to boost your tutor rating (★ 5.0) and match frequency. Copy or share this direct template:
                      </p>

                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--border-hairline)',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-main)',
                        lineHeight: 1.45,
                        fontFamily: 'monospace'
                      }}>
                        {`Hi! I am registered as a home tutor on TuitionForHome. Please take 10 seconds to share your review for my classes here: http://localhost:3000/tutor/review/${userId}`}
                      </div>

                      <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`Hi! I am registered as a home tutor on TuitionForHome. Please take 10 seconds to share your review for my classes here: http://localhost:3000/tutor/review/${userId}`);
                            setSuccessMsg('📋 Review request message copied to clipboard!');
                          }}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem' }}
                        >
                          Copy Template
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Hi! I am registered as a home tutor on TuitionForHome. Please take 10 seconds to share your review for my classes here: http://localhost:3000/tutor/review/${userId}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem', backgroundColor: '#25D366', borderColor: '#25D366', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Share on WhatsApp
                        </a>
                      </div>
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

      <Footer />
    </div>
  );
}
