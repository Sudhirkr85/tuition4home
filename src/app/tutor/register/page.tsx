'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GURGAON_LOCALITIES,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  BOARD_OPTIONS,
  SSSAM_OFFICE_DETAILS,
} from '@/lib/data';
import {
  GraduationCap,
  ShieldCheck,
  Video,
  Home,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  Building2,
  Lock,
  UserCheck,
  Eye,
  EyeOff,
  Plus,
  X,
  Mail,
  Phone,
  User,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export default function TutorRegisterLoginPage() {
  // Authentication tabs: 'register' or 'login'
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  // Current step inside complete profile wizard
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Session & User Status State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Auth Form State (Register)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // Auth Form State (Login - Password)
  const [loginContact, setLoginContact] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Auth Form State (Login - OTP)
  const [otpContact, setOtpContact] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Show/Hide Password & Shake Animation States
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [loginErrorField, setLoginErrorField] = useState<'password' | 'contact' | 'both' | null>(null);
  const [regErrorField, setRegErrorField] = useState<'password' | 'confirm' | null>(null);

  // Dynamic rotation for Gurgaon leads
  const [activeLeadIndex, setActiveLeadIndex] = useState(0);
  const GURGAON_LEAD_EXEMPLARS = [
    { loc: 'DLF Phase 5', sub: 'Class 10 Math' },
    { loc: 'Golf Course Road', sub: 'IB Physics HL' },
    { loc: 'Sector 14', sub: 'Class 12 Chemistry' },
    { loc: 'Sohna Road', sub: 'Class 9 Science' },
    { loc: 'DLF Phase 2', sub: 'IIT-JEE Mathematics' },
    { loc: 'Sector 56', sub: 'German Language' },
    { loc: 'DLF Phase 4', sub: 'Class 12 CBSE Biology' },
    { loc: 'Sushant Lok 1', sub: 'Grade 8 Cambridge English' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLeadIndex((prev) => (prev + 1) % GURGAON_LEAD_EXEMPLARS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Profile Wizard Form State
  const [teachingMode, setTeachingMode] = useState<'BOTH' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('BOTH');
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [experienceYears, setExperienceYears] = useState(2);
  
  // Selectable lists (stored as arrays)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  
  // Custom "Other" write-in states for searchable multiselects
  const [customSubject, setCustomSubject] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [customBoard, setCustomBoard] = useState('');
  const [customArea, setCustomArea] = useState('');
  
  // Search query states for filtering list options
  const [subjectSearch, setSubjectSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  
  // Step 3: Locations & Travel
  const [travelRadius, setTravelRadius] = useState(5);
  const [tutorLatitude, setTutorLatitude] = useState<number | null>(null);
  const [tutorLongitude, setTutorLongitude] = useState<number | null>(null);
  const [tutorFormattedAddress, setTutorFormattedAddress] = useState('');
  const [showTutorLocationPicker, setShowTutorLocationPicker] = useState(false);
  const [isDetectingTutorGPS, setIsDetectingTutorGPS] = useState(false);
  const [isTutorReverseGeocoding, setIsTutorReverseGeocoding] = useState(false);
  const tutorPickerMapRef = React.useRef<HTMLDivElement>(null);
  const [tutorPickerMap, setTutorPickerMap] = useState<any>(null);
  const tutorPickerMarkerRef = React.useRef<any>(null);
  const [leafletLib, setLeafletLib] = useState<any>(null);

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((mod) => setLeafletLib(mod.default));
    }
  }, []);

  // Reverse geocode using unified maps utility (Google Maps Geocoder -> OSM Nominatim)
  const tutorReverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const { reverseGeocodeUnified } = await import('@/lib/maps');
    return await reverseGeocodeUnified(lat, lng);
  };

  // Init tutor location picker map
  useEffect(() => {
    if (!leafletLib || !showTutorLocationPicker || !tutorPickerMapRef.current || tutorPickerMap) return;
    const timer = setTimeout(() => {
      if (!tutorPickerMapRef.current) return;
      const center = tutorLatitude && tutorLongitude ? [tutorLatitude, tutorLongitude] : [28.4728, 77.0345];
      const pMap = leafletLib.map(tutorPickerMapRef.current, { center, zoom: 15, zoomControl: true, attributionControl: false });
      leafletLib.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(pMap);
      const markerIcon = leafletLib.divIcon({
        className: 'tutor-loc-pin',
        html: '<div style="display:flex;flex-direction:column;align-items:center;"><div style="width:36px;height:36px;border-radius:50%;background:#0F6E56;border:3px solid #FFF;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(15,110,86,0.5);cursor:grab;"><div style="width:12px;height:12px;border-radius:50%;background:#FFF;"></div></div><div style="width:3px;height:12px;background:#0F6E56;margin-top:-2px;"></div></div>',
        iconSize: [36, 50], iconAnchor: [18, 50],
      });
      const marker = leafletLib.marker(center, { icon: markerIcon, draggable: true }).addTo(pMap);
      tutorPickerMarkerRef.current = marker;
      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setTutorLatitude(pos.lat); setTutorLongitude(pos.lng);
        setIsTutorReverseGeocoding(true);
        const addr = await tutorReverseGeocode(pos.lat, pos.lng);
        setTutorFormattedAddress(addr);
        setIsTutorReverseGeocoding(false);
      });
      pMap.on('click', async (e: any) => {
        marker.setLatLng([e.latlng.lat, e.latlng.lng]);
        setTutorLatitude(e.latlng.lat); setTutorLongitude(e.latlng.lng);
        setIsTutorReverseGeocoding(true);
        const addr = await tutorReverseGeocode(e.latlng.lat, e.latlng.lng);
        setTutorFormattedAddress(addr);
        setIsTutorReverseGeocoding(false);
      });
      setTutorPickerMap(pMap);
    }, 150);
    return () => clearTimeout(timer);
  }, [leafletLib, showTutorLocationPicker]);

  useEffect(() => {
    if (!showTutorLocationPicker && tutorPickerMap) {
      tutorPickerMap.remove(); setTutorPickerMap(null); tutorPickerMarkerRef.current = null;
    }
  }, [showTutorLocationPicker]);
  
  // Step 4: Pricing Rates (Ranges)
  const [hourlyRateHomeMin, setHourlyRateHomeMin] = useState(600);
  const [hourlyRateHomeMax, setHourlyRateHomeMax] = useState(1200);
  const [hourlyRateOnlineMin, setHourlyRateOnlineMin] = useState(500);
  const [hourlyRateOnlineMax, setHourlyRateOnlineMax] = useState(1000);
  
  // Step 5: Media Uploads
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [profilePhotoName, setProfilePhotoName] = useState('');
  
  const [introVideoSource, setIntroVideoSource] = useState<'link' | 'upload'>('link');
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [introVideoFileName, setIntroVideoFileName] = useState('');
  
  // Step 6: KYC Document Upload
  const [idType, setIdType] = useState('AADHAAR_MASKED');
  const [idNumber, setIdNumber] = useState('');
  const [idDocUrl, setIdDocUrl] = useState('');
  const [idDocFileName, setIdDocFileName] = useState('');
  
  // Step 7: Agreement & T&Cs Modal
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  // Submission Lifecycle
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 500);
  };

  // Auto-save/Draft recovery on load if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('tutor_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUserId(parsed.userId);
      setUserName(parsed.name);
      setUserEmail(parsed.email);
      setIsLoggedIn(true);

      // Redirect to settings/profile dashboard if onboarding is already completed
      fetch(`/api/tutors/profile/setup?userId=${parsed.userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile && data.profile.status !== 'DRAFT') {
            window.location.href = '/tutor/profile';
          }
        })
        .catch(() => {});
      
      // Attempt draft recovery from localStorage
      const draft = localStorage.getItem(`tutor_draft_${parsed.userId}`);
      if (draft) {
        try {
          const p = JSON.parse(draft);
          if (p.currentStep) setCurrentStep(p.currentStep);
          if (p.teachingMode) setTeachingMode(p.teachingMode);
          if (p.degree) setDegree(p.degree);
          if (p.experienceYears) setExperienceYears(p.experienceYears);
          if (p.selectedSubjects) setSelectedSubjects(p.selectedSubjects);
          if (p.selectedClasses) setSelectedClasses(p.selectedClasses);
          if (p.selectedBoards) setSelectedBoards(p.selectedBoards);
          if (p.serviceAreas) setServiceAreas(p.serviceAreas);
          if (p.travelRadius) setTravelRadius(p.travelRadius);
          if (p.hourlyRateHomeMin) setHourlyRateHomeMin(p.hourlyRateHomeMin);
          if (p.hourlyRateHomeMax) setHourlyRateHomeMax(p.hourlyRateHomeMax);
          if (p.hourlyRateOnlineMin) setHourlyRateOnlineMin(p.hourlyRateOnlineMin);
          if (p.hourlyRateOnlineMax) setHourlyRateOnlineMax(p.hourlyRateOnlineMax);
          if (p.profilePhotoUrl) setProfilePhotoUrl(p.profilePhotoUrl);
          if (p.introVideoUrl) setIntroVideoUrl(p.introVideoUrl);
          if (p.idType) setIdType(p.idType);
        } catch (e) {
          console.error('Failed to parse draft details', e);
        }
      }
    }
  }, []);

  // Save draft whenever wizard states change
  useEffect(() => {
    if (isLoggedIn && userId) {
      const draftData = {
        currentStep,
        teachingMode,
        degree,
        experienceYears,
        selectedSubjects,
        selectedClasses,
        selectedBoards,
        serviceAreas,
        travelRadius,
        hourlyRateHomeMin,
        hourlyRateHomeMax,
        hourlyRateOnlineMin,
        hourlyRateOnlineMax,
        profilePhotoUrl,
        introVideoUrl,
        idType,
      };
      localStorage.setItem(`tutor_draft_${userId}`, JSON.stringify(draftData));
    }
  }, [
    isLoggedIn, userId, currentStep, teachingMode, degree, experienceYears,
    selectedSubjects, selectedClasses, selectedBoards, serviceAreas,
    travelRadius, hourlyRateHomeMin, hourlyRateHomeMax, hourlyRateOnlineMin,
    hourlyRateOnlineMax, profilePhotoUrl, introVideoUrl, idType
  ]);

  // Registration Email OTP Verification States
  const [regStep, setRegStep] = useState<'DETAILS' | 'OTP' | 'PASSWORD'>('DETAILS');
  const [regOtpCode, setRegOtpCode] = useState('');
  const [regEmailVerified, setRegEmailVerified] = useState(false);
  const [sendingRegOtp, setSendingRegOtp] = useState(false);
  const [verifyingRegOtp, setVerifyingRegOtp] = useState(false);

  // Step 1: Send Email OTP for Registration
  const handleSendRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      triggerShake();
      return;
    }
    if (!regPhone || regPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      triggerShake();
      return;
    }
    if (!regEmail || !regEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      triggerShake();
      return;
    }

    setSendingRegOtp(true);
    try {
      const res = await fetch('/api/tutors/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: regEmail.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setRegStep('OTP');
      } else {
        setErrorMessage(data.error || 'Failed to send verification code.');
        triggerShake();
      }
    } catch {
      setErrorMessage('Failed to connect to the server.');
    } finally {
      setSendingRegOtp(false);
    }
  };

  // Step 2: Verify Email OTP for Registration
  const handleVerifyRegOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regOtpCode || regOtpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      triggerShake();
      return;
    }

    setVerifyingRegOtp(true);
    try {
      const res = await fetch('/api/tutors/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: regEmail.toLowerCase().trim(),
          otpCode: regOtpCode.trim(),
          mode: 'REGISTRATION',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRegEmailVerified(true);
        setRegStep('PASSWORD');
      } else {
        setErrorMessage(data.error || 'Invalid or expired verification code.');
        triggerShake();
      }
    } catch {
      setErrorMessage('Failed to verify code.');
    } finally {
      setVerifyingRegOtp(false);
    }
  };

  // Step 3: Finalize Account Creation after Email Verification
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRegErrorField(null);

    if (!regEmailVerified) {
      setErrorMessage('Please verify your email address first before setting a password.');
      setRegStep('DETAILS');
      triggerShake();
      return;
    }
    
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setRegErrorField('password');
      triggerShake();
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter correctly.');
      setRegErrorField('confirm');
      triggerShake();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tutors/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.error || 'Registration failed.');
        setRegErrorField('password');
        triggerShake();
      } else {
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000 };
        localStorage.setItem('tutor_session', JSON.stringify(session));
        setUserId(data.userId);
        setUserName(data.name);
        setUserEmail(data.email);
        setIsLoggedIn(true);
        setCurrentStep(1); // Proceed to profile setup
      }
    } catch (err) {
      setErrorMessage('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoginErrorField(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tutors/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: loginContact,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.error || 'Invalid email/mobile or password.');
        setLoginErrorField('password');
        triggerShake();
      } else {
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000 };
        localStorage.setItem('tutor_session', JSON.stringify(session));
        setUserId(data.userId);
        setUserName(data.name);
        setUserEmail(data.email);
        setIsLoggedIn(true);

        if (data.isOnboardingComplete) {
          window.location.href = '/tutor/profile';
        } else {
          setCurrentStep(1); // Resume draft setup
        }
      }
    } catch (err) {
      setErrorMessage('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otpContact) {
      setErrorMessage('Please enter email or mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/tutors/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: otpContact }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.error || 'Failed to send OTP.');
      } else {
        setIsOtpSent(true);
        setErrorMessage('');
      }
    } catch (err) {
      setErrorMessage('Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutors/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: otpContact, otpCode }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.error || 'OTP verification failed.');
        triggerShake();
      } else {
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000 };
        localStorage.setItem('tutor_session', JSON.stringify(session));
        setUserId(data.userId);
        setUserName(data.name);
        setUserEmail(data.email);
        setIsLoggedIn(true);

        if (data.isOnboardingComplete) {
          window.location.href = '/tutor/profile';
        } else {
          setCurrentStep(1);
        }
      }
    } catch (err) {
      setErrorMessage('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login Simulation
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const session = { 
        userId: `GGL-${Math.floor(10000 + Math.random() * 90000)}`, 
        name: 'Google Educator Alum', 
        email: 'google.educator@example.com',
        loginAt: Date.now(),
        expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem('tutor_session', JSON.stringify(session));
      setUserId(session.userId);
      setUserName(session.name);
      setUserEmail(session.email);
      setIsLoggedIn(true);
      setCurrentStep(1);
      setLoading(false);
    }, 1200);
  };

  // Helper selectors
  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Profile Upload Helpers (reads file as base64 string mock upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video' | 'kyc') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'photo') {
        setProfilePhotoUrl(base64String);
        setProfilePhotoName(file.name);
      } else if (type === 'video') {
        setIntroVideoUrl(base64String);
        setIntroVideoFileName(file.name);
      } else if (type === 'kyc') {
        setIdDocUrl(base64String);
        setIdDocFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmit = async () => {
    if (!agreeTerms) {
      setErrorMessage('⚠️ Please read and agree to the Terms & Conditions and Privacy Policy first.');
      return;
    }
    if (!idDocUrl && !idDocFileName) {
      setErrorMessage('⚠️ ID Document Proof is MANDATORY. Please upload your ID proof in Step 6.');
      setCurrentStep(6);
      return;
    }
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/tutors/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          teachingMode,
          highestDegree: degree.trim(),
          qualifications: degree.trim() ? [{
            id: '1',
            degree: degree.trim(),
            institute: college.trim(),
            year: passingYear.trim(),
            grade: ''
          }] : [],
          experienceYears,
          subjects: selectedSubjects,
          classes: selectedClasses,
          boards: selectedBoards,
          serviceAreas: serviceAreas,
          travelRadiusKm: travelRadius,
          latitude: tutorLatitude,
          longitude: tutorLongitude,
          formattedAddress: tutorFormattedAddress || null,
          hourlyRateHomeMin,
          hourlyRateHomeMax,
          hourlyRateOnlineMin,
          hourlyRateOnlineMax,
          avatarUrl: profilePhotoUrl || '/placeholder-avatar.jpg',
          introVideoUrl: introVideoUrl || '/placeholder-video.mp4',
          idType,
          idNumber,
          idDocUrl: idDocUrl || '',
          status: 'PENDING_INTERVIEW',
        }),
      });
      const data = await res.json();
      
      if (!data.success) {
        setErrorMessage(data.error || 'Failed to submit profile.');
      } else {
        localStorage.removeItem(`tutor_draft_${userId}`);
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMessage('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tutor_session');
    setIsLoggedIn(false);
    setUserId('');
    setUserName('');
    setUserEmail('');
    setCurrentStep(1);
    setSubmitted(false);
  };

  // Filter subject list
  const filteredSubjects = SUBJECT_OPTIONS.filter(sub => 
    sub.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Filter sector list
  const filteredSectors = GURGAON_LOCALITIES.filter(loc =>
    loc.name.toLowerCase().includes(areaSearch.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: isLoggedIn ? '3.5rem 0 5rem 0' : 0 }}>
        
        {/* =========================================================================
            CENTERED ERROR NOTIFICATION POPUP MODAL
            ========================================================================= */}
        {errorMessage && (
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
              maxWidth: '440px',
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
                <AlertCircle size={26} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Registration Notice
              </h3>

              <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                {errorMessage}
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {errorMessage.toLowerCase().includes('already registered') ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setAuthTab('login');
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 800, backgroundColor: '#0F6E56' }}
                    >
                      <span>Switch to Login</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setErrorMessage('')}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.75rem 1rem', fontWeight: 700 }}
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setErrorMessage('')}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.75rem 1.5rem', fontWeight: 800, backgroundColor: '#0F6E56' }}
                  >
                    <span>Understood</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn ? (
          /* =========================================================================
             OPTION 1: SPLIT-SCREEN LAYOUT (BRAND SHOWCASE VS AUTHS CARD)
             ========================================================================= */
          <div className="split-screen-container" style={{
            display: 'flex',
            minHeight: 'calc(100vh - 72px)',
            width: '100%',
            backgroundColor: '#FFFFFF',
          }}>
            {/* Custom Responsive Styling for Split Screen */}
            <style jsx global>{`
              .split-screen-container {
                flex-direction: row;
              }
              .split-brand-panel {
                display: flex;
                flex: 1.15;
                background: radial-gradient(circle at 80% 20%, rgba(45, 212, 191, 0.12) 0%, transparent 60%), linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
                color: #FFFFFF;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding: 4.5rem 2rem;
                position: relative;
                overflow: hidden;
              }
              .split-auth-panel {
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: flex-start;
                padding: 4.5rem 3rem;
                background-color: #FFFFFF;
              }
              @keyframes float-slow {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(1deg); }
              }
              @keyframes float-slower {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(8px) rotate(-1deg); }
              }
              @keyframes pulse-dot {
                0%, 100% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.3); opacity: 1; }
              }
              .animate-float-slow {
                animation: float-slow 6s ease-in-out infinite;
              }
              .animate-float-slower {
                animation: float-slower 7s ease-in-out infinite;
              }
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                15%, 45%, 75% { transform: translateX(-6px); }
                30%, 60%, 90% { transform: translateX(6px); }
              }
              .shake-animation {
                animation: shake 0.45s ease-in-out;
              }
              .form-control {
                transition: all 0.2s ease-in-out !important;
              }
              .form-control:focus {
                border-color: var(--brand-teal) !important;
                box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.18) !important;
                outline: none !important;
              }
              @media (max-width: 900px) {
                .split-screen-container {
                  flex-direction: column !important;
                }
                .split-brand-panel {
                  display: none !important;
                }
                .split-auth-panel {
                  padding: 3rem 1.5rem !important;
                  min-height: calc(100vh - 120px);
                }
              }
            `}</style>

            {/* Left Brand Panel */}
            <div className="split-brand-panel">
              {/* Floating Math Symbol Watermarks */}
              <div style={{ position: 'absolute', opacity: 0.06, top: '8%', left: '10%', fontSize: '1.25rem', fontFamily: 'serif', fontStyle: 'italic' }}>E = mc²</div>
              <div style={{ position: 'absolute', opacity: 0.06, bottom: '10%', right: '12%', fontSize: '1.15rem', fontFamily: 'serif' }}>a² + b² = c²</div>
              <div style={{ position: 'absolute', opacity: 0.05, top: '45%', right: '8%', fontSize: '1.25rem', fontFamily: 'serif' }}>∫ f(x) dx</div>
              <div style={{ position: 'absolute', opacity: 0.06, bottom: '35%', left: '15%', fontSize: '1rem', fontFamily: 'monospace' }}>H₂O + CO₂ → H₂CO₃</div>

              <div style={{ maxWidth: '460px', position: 'relative', zIndex: 2 }}>
                
                {/* Brand Logo Container */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
                  marginBottom: '1.25rem',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/tuitionforhome.png"
                    alt="TuitionForHome Logo"
                    style={{
                      height: '38px',
                      width: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      TuitionForHome
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-teal)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '1px' }}>
                      Educator Portal • By SSSAM Academy
                    </span>
                  </div>
                </div>

                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                  Empowering Gurgaon's Elite Home & Online Tutors.
                </h1>

                <p style={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Set your own expected price ranges, teach in Gurgaon's top sectors, and get matched with background-checked student leads.
                </p>

                {/* Premium Trust & Help Center Footer Block */}
                <div style={{
                  marginTop: '2rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {/* Grid metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.78rem', color: '#E2E8F0', marginBottom: '0.2rem' }}>🤝 Verified Parent Leads</strong>
                      <span style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.35, display: 'block', textAlign: 'left' }}>
                        Get matched directly with verified student requirements across Gurgaon sectors.
                      </span>
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.78rem', color: '#E2E8F0', marginBottom: '0.2rem' }}>🔒 AES-256 Data Shield</strong>
                      <span style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.35, display: 'block', textAlign: 'left' }}>
                        Aadhaar & PAN are encrypted at-rest. Decrypted only for administrative verification.
                      </span>
                    </div>
                  </div>

                  {/* Walk-in office box */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    fontSize: '0.72rem',
                    color: '#94A3B8',
                    lineHeight: 1.45,
                    textAlign: 'left'
                  }}>
                    <div style={{ color: '#E2E8F0', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Building2 size={13} color="var(--brand-teal)" />
                      <span>Physical Verification Center (Gurgaon):</span>
                    </div>
                    M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram
                    <div style={{ marginTop: '0.35rem', color: 'var(--brand-teal)', fontWeight: 700 }}>
                      📞 Tutor Helpline: +91 92170 31899
                    </div>
                  </div>

                  {/* 3. SSSAM Tutor Promise & Match Steps */}
                  <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1.5px dashed rgba(45, 212, 191, 0.25)',
                    borderRadius: '16px',
                    padding: '1.15rem',
                    marginTop: '1.25rem',
                    textAlign: 'left'
                  }}>
                    {/* Part 1: Motivation */}
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.82rem', color: 'var(--brand-teal)', marginBottom: '0.35rem' }}>
                        🤝 SSSAM Tutor Promise
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                        &ldquo;Guaranteed On-Time Payments &amp; Zero Fee Hassle&rdquo;
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.45, display: 'block' }}>
                        SSSAM Academy handles parent negotiations and manages advance fee collection, guaranteeing your payouts on-time. You focus purely on delivering excellence in teaching!
                      </span>
                    </div>

                    {/* Part 2: 3-step Flow */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.85rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.75rem', color: '#E2E8F0', marginBottom: '0.4rem' }}>
                        How Profiles Get Verified & Matched:
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.7rem', color: '#94A3B8' }}>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <strong style={{ color: 'var(--brand-teal)' }}>Step 1:</strong>
                          <span>Submit the 7-step onboarding profile wizard.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <strong style={{ color: 'var(--brand-teal)' }}>Step 2:</strong>
                          <span>Our counselor conducts a quick verification screening call.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <strong style={{ color: 'var(--brand-teal)' }}>Step 3:</strong>
                          <span>Active badge goes Live. Get matched instantly via WhatsApp/SMS alerts!</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Right Form Panel */}
            <div className={`split-auth-panel ${shakeForm ? 'shake-animation' : ''}`}>
              <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
                
                {/* Tab Header Selector (Sliding Pill Switcher) */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '999px',
                  padding: '0.25rem',
                  width: '100%',
                  maxWidth: '340px',
                  margin: '0 auto 2.5rem auto',
                  border: '1px solid var(--border-hairline)'
                }}>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('register'); setErrorMessage(''); }}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: authTab === 'register' ? 'var(--brand-teal)' : 'transparent',
                      color: authTab === 'register' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    Apply as Tutor (Signup)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('login'); setErrorMessage(''); }}
                    style={{
                      flex: 1,
                      padding: '0.65rem',
                      borderRadius: '999px',
                      border: 'none',
                      backgroundColor: authTab === 'login' ? 'var(--brand-teal)' : 'transparent',
                      color: authTab === 'login' ? '#FFFFFF' : 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    Tutor Login
                  </button>
                </div>

                {/* 1. APPLY AS TUTOR (REGISTER) FORM WITH MANDATORY EMAIL OTP VERIFICATION FIRST */}
                {authTab === 'register' && (
                  <div>
                    {/* STEP 1: Details & Request Email Verification OTP */}
                    {regStep === 'DETAILS' && (
                      <form onSubmit={handleSendRegOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>STEP 1 OF 3</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>EMAIL VERIFICATION</span>
                          </div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>Create Account</h2>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Verify your email first, then set your account password.</p>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Amit Kumar"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              className="form-control"
                              style={{ paddingLeft: '2.5rem' }}
                            />
                            <User size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Mobile Number</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="tel"
                              required
                              placeholder="10-digit mobile number"
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                              className="form-control"
                              style={{ paddingLeft: '2.5rem' }}
                            />
                            <Phone size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Email Address (OTP Sent Here)</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="email"
                              required
                              placeholder="amit@example.com"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              className="form-control"
                              style={{ paddingLeft: '2.5rem' }}
                            />
                            <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={sendingRegOtp}
                          className="btn btn-primary"
                          style={{ padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          {sendingRegOtp ? 'Sending Email Verification Code...' : 'Send Verification Code to Email'}
                          <ArrowRight size={18} />
                        </button>
                      </form>
                    )}

                    {/* STEP 2: Enter Email OTP Code */}
                    {regStep === 'OTP' && (
                      <form onSubmit={handleVerifyRegOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>STEP 2 OF 3</span>
                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>ENTER CODE</span>
                          </div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>Verify Email OTP</h2>
                          <p style={{ fontSize: '0.85rem', color: '#0F6E56', marginTop: '0.2rem', fontWeight: 700 }}>
                            We sent a 6-digit verification code to <u>{regEmail}</u>
                          </p>
                        </div>

                        <div className="form-group">
                          <label className="form-label">6-Digit Verification Code</label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="e.g. 123456"
                            value={regOtpCode}
                            onChange={(e) => setRegOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="form-control"
                            style={{
                              fontSize: '1.4rem',
                              letterSpacing: '0.4rem',
                              textAlign: 'center',
                              fontWeight: 800,
                              borderRadius: '12px',
                              padding: '0.75rem',
                            }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={verifyingRegOtp || regOtpCode.length !== 6}
                          className="btn btn-primary"
                          style={{ padding: '0.9rem', fontSize: '0.95rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          {verifyingRegOtp ? 'Verifying Code...' : 'Verify Email & Proceed to Password'}
                          <CheckCircle2 size={18} />
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => setRegStep('DETAILS')}
                            style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            ← Change Details
                          </button>

                          <button
                            type="button"
                            onClick={handleSendRegOtp}
                            disabled={sendingRegOtp}
                            style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, cursor: 'pointer' }}
                          >
                            {sendingRegOtp ? 'Resending...' : 'Resend Code'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* STEP 3: Set Password & Finalize Account */}
                    {regStep === 'PASSWORD' && (
                      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ backgroundColor: '#ECFDF5', color: '#0F6E56', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>STEP 3 OF 3</span>
                            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 800 }}>✓ EMAIL VERIFIED</span>
                          </div>
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>Set Password</h2>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Create a secure password for your educator portal account.</p>
                        </div>

                        {/* Verified Email Summary Badge */}
                        <div style={{
                          backgroundColor: '#ECFDF5',
                          border: '1.5px solid #A7F3D0',
                          borderRadius: '12px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          fontSize: '0.85rem',
                          color: '#065F46',
                          fontWeight: 700,
                        }}>
                          <CheckCircle2 size={18} color="#059669" />
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Verified Email: <span>{regEmail}</span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Create Password</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              required
                              placeholder="Minimum 6 characters"
                              value={regPassword}
                              onChange={(e) => {
                                setRegPassword(e.target.value);
                                if (regErrorField === 'password') setRegErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                paddingLeft: '2.5rem',
                                paddingRight: '2.5rem',
                                borderColor: (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'password'
                                  ? '#EF4444'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 6)
                                  ? '#10B981'
                                  : undefined,
                                boxShadow: (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'password'
                                  ? '0 0 0 3px rgba(239, 68, 68, 0.18)'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 6)
                                  ? '0 0 0 3px rgba(16, 185, 129, 0.18)'
                                  : undefined,
                              }}
                            />
                            <Lock
                              size={16}
                              color={
                                (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'password'
                                  ? '#EF4444'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 6)
                                  ? '#10B981'
                                  : "var(--text-light)"
                              }
                              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-light)', padding: 0 }}
                            >
                              {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {regPassword.length > 0 && regPassword.length < 6 && (
                            <div style={{ fontSize: '0.74rem', color: '#EAB308', fontWeight: 600, marginTop: '0.3rem' }}>
                              ⚠️ Password must be at least 6 characters
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label className="form-label">Confirm Password</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showRegConfirmPassword ? 'text' : 'password'}
                              required
                              placeholder="Re-enter password"
                              value={regConfirmPassword}
                              onChange={(e) => {
                                setRegConfirmPassword(e.target.value);
                                if (regErrorField === 'confirm') setRegErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                paddingLeft: '2.5rem',
                                paddingRight: '2.5rem',
                                borderColor: (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'confirm'
                                  ? '#EF4444'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword)
                                  ? '#10B981'
                                  : undefined,
                                boxShadow: (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'confirm'
                                  ? '0 0 0 3px rgba(239, 68, 68, 0.18)'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword)
                                  ? '0 0 0 3px rgba(16, 185, 129, 0.18)'
                                  : undefined,
                              }}
                            />
                            <Lock size={16} color={regConfirmPassword.length > 0 && regPassword !== regConfirmPassword ? '#EF4444' : "var(--text-light)"} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <button
                              type="button"
                              onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-light)', padding: 0 }}
                            >
                              {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {/* Live Matching Message */}
                          {regConfirmPassword.length > 0 && regPassword !== regConfirmPassword && (
                            <div style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>✕ Passwords do not match</span>
                            </div>
                          )}
                          {regConfirmPassword.length > 0 && regPassword === regConfirmPassword && (
                            <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>✓ Passwords match</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary"
                          style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          {loading ? 'Finalizing Account...' : 'Complete Registration & Proceed'}
                          <ArrowRight size={18} />
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 2. LOGIN FORM */}
                {authTab === 'login' && (
                  <div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>Welcome Back</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Access your educator dashboard settings</p>
                    </div>

                    {/* Login method selectors */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <button
                        type="button"
                        onClick={() => { setLoginMethod('password'); setErrorMessage(''); setLoginErrorField(null); }}
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          backgroundColor: loginMethod === 'password' ? 'var(--brand-teal)' : '#FFFFFF',
                          color: loginMethod === 'password' ? '#FFFFFF' : 'var(--text-main)',
                          border: '1.5px solid var(--border-hairline)',
                        }}
                      >
                        Password
                      </button>
                      <button
                        type="button"
                        onClick={() => { setLoginMethod('otp'); setErrorMessage(''); setLoginErrorField(null); }}
                        className="btn btn-sm"
                        style={{
                          flex: 1,
                          backgroundColor: loginMethod === 'otp' ? 'var(--brand-teal)' : '#FFFFFF',
                          color: loginMethod === 'otp' ? '#FFFFFF' : 'var(--text-main)',
                          border: '1.5px solid var(--border-hairline)',
                        }}
                      >
                        OTP Code
                      </button>
                    </div>

                    {loginMethod === 'password' ? (
                      <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">Email or Mobile Number</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              required
                              placeholder="amit@example.com or mobile"
                              value={loginContact}
                              onChange={(e) => {
                                setLoginContact(e.target.value);
                                if (loginErrorField) setLoginErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                paddingLeft: '2.5rem',
                                borderColor: loginErrorField ? '#EF4444' : undefined,
                                boxShadow: loginErrorField ? '0 0 0 3px rgba(239, 68, 68, 0.18)' : undefined,
                              }}
                            />
                            <User size={16} color={loginErrorField ? '#EF4444' : "var(--text-light)"} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Password</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showLoginPassword ? 'text' : 'password'}
                              required
                              placeholder="Enter your account password"
                              value={loginPassword}
                              onChange={(e) => {
                                setLoginPassword(e.target.value);
                                if (loginErrorField) setLoginErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                paddingLeft: '2.5rem',
                                paddingRight: '2.5rem',
                                borderColor: loginErrorField ? '#EF4444' : undefined,
                                boxShadow: loginErrorField ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : undefined,
                              }}
                            />
                            <Lock size={16} color={loginErrorField ? '#EF4444' : "var(--text-light)"} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                              style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-light)', padding: 0 }}
                            >
                              {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                          {loginErrorField && (
                            <div style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>⚠️ Incorrect email/mobile or password. Please verify.</span>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary"
                          style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          {loading ? 'Logging in...' : 'Sign In with Password'}
                          <UserCheck size={18} />
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">Email or Mobile Number</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              required
                              disabled={isOtpSent}
                              placeholder="amit@example.com or mobile"
                              value={otpContact}
                              onChange={(e) => setOtpContact(e.target.value)}
                              className="form-control"
                              style={{ paddingLeft: '2.5rem' }}
                            />
                            <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        {isOtpSent && (
                          <div className="form-group">
                            <label className="form-label">Enter 6-Digit OTP</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="XXXXXX"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              className="form-control"
                              style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.3em', fontWeight: 'bold' }}
                            />
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="btn btn-primary"
                          style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)' }}
                        >
                          {loading ? 'Processing...' : isOtpSent ? 'Verify & Sign In' : 'Send Verification OTP'}
                          {isOtpSent ? <UserCheck size={18} /> : <Mail size={18} />}
                        </button>
                      </form>
                    )}

                    <div style={{ position: 'relative', textAlign: 'center', margin: '2rem 0 1.5rem 0' }}>
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'var(--border-hairline)', zIndex: 0 }} />
                      <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 1rem', color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600 }}>OR SOCIAL ACCESS</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="btn btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', fontWeight: 700 }}
                    >
                      {/* Google G logo SVG */}
                      <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
          ) : !submitted ? (
            /* =========================================================================
               ONBOARDING PROFILE COMPLETENESS WIZARD (7 STEPS)
               ========================================================================= */
            <div className="container" style={{ maxWidth: '780px' }}>
              <div className="apple-card" style={{ padding: 0, overflow: 'hidden' }}>
                
                {/* Wizard Title Bar */}
                <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.5rem 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span className="badge" style={{ backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', border: '1px solid var(--border-teal)' }}>
                      🛠️ COMPLETE PROFILE SETUP
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
                      Step {currentStep} of {totalSteps}
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Welcome {userName}, let's build your tutor badge!
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                    <ShieldCheck size={14} color="#34D399" />
                    <span>Your information is protected by SSSAM Academy encryption protocol.</span>
                  </div>
                </div>

                {/* Progress Slider Indicator */}
                <div style={{ height: '5px', backgroundColor: 'var(--border-hairline)' }}>
                  <div style={{
                    height: '100%',
                    width: `${(currentStep / totalSteps) * 100}%`,
                    backgroundColor: 'var(--brand-teal)',
                    transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }} />
                </div>

                <div style={{ padding: '2.5rem' }}>
                  
                  {/* STEP 1: Basic Professional Info */}
                  {currentStep === 1 && (
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 1: Teaching Mode & Basic Profile Info
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Select how you prefer to match with Gurgaon students.
                      </p>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">Preferred Teaching Mode</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                          {[
                            { id: 'BOTH', title: 'Both Modes', desc: 'Home & Online', icon: Sparkles },
                            { id: 'OFFLINE_HOME', title: 'Home Tuition', desc: 'Visit Student Home', icon: Home },
                            { id: 'ONLINE_LIVE', title: 'Online 1-on-1', desc: 'Live Virtual Lessons', icon: Video },
                          ].map((m) => {
                            const IconComponent = m.icon;
                            const isSelected = teachingMode === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setTeachingMode(m.id as any)}
                                style={{
                                  padding: '1rem 0.85rem',
                                  borderRadius: '12px',
                                  border: `2.5px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                                  backgroundColor: isSelected ? 'var(--bg-app)' : '#FFFFFF',
                                  color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <IconComponent size={22} color={isSelected ? 'var(--brand-teal)' : 'var(--text-muted)'} />
                                <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{m.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label">
                          Highest Qualification / Degree <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="e.g. B.Tech Computer Science or M.Sc Physics"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            className="form-control"
                            required
                          />
                          <GraduationCap size={16} color="var(--text-light)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">College / University Name</label>
                          <input
                            type="text"
                            placeholder="e.g. IIT Delhi, DU, GGSIPU"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Passing Year</label>
                          <input
                            type="text"
                            placeholder="e.g. 2022"
                            value={passingYear}
                            onChange={(e) => setPassingYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Total Teaching Experience (Years) <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={40}
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(Number(e.target.value))}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Teaching Expertise (Subjects, Classes, Boards - ALL SEARCHABLE / OTHER WRITE-IN) */}
                  {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                          Step 2: Subject & Board Expertise
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Select the subjects, grades, and boards you teach. You can search or add custom values.
                        </p>
                      </div>

                      {/* Subjects Section */}
                      <div className="form-group">
                        <label className="form-label">
                          Subjects Taught <span style={{ color: '#DC2626' }}>*</span> (Search or Add Custom)
                        </label>
                        
                        {/* Active Subjects Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {selectedSubjects.map(sub => (
                            <span key={sub} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: 'var(--brand-teal-light)',
                              color: 'var(--brand-teal)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              <span>{sub}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedSubjects(selectedSubjects.filter(s => s !== sub))}
                                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Search & Custom Input row */}
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
                              placeholder="Type Custom Subject..."
                              value={customSubject}
                              onChange={(e) => setCustomSubject(e.target.value)}
                              className="form-control"
                              style={{ minWidth: '180px' }}
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
                              style={{ padding: '0 0.85rem' }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Filtered Subject Options list */}
                        <div style={{ 
                          marginTop: '0.5rem', 
                          maxHeight: '130px', 
                          overflowY: 'auto', 
                          border: '1px solid var(--border-hairline)', 
                          borderRadius: '8px', 
                          padding: '0.5rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          backgroundColor: '#F8FAFC'
                        }}>
                          {filteredSubjects.map(sub => {
                            const isSelected = selectedSubjects.includes(sub);
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => toggleSelection(sub, selectedSubjects, setSelectedSubjects)}
                                style={{
                                  padding: '0.3rem 0.65rem',
                                  borderRadius: '6px',
                                  border: `1px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                                  backgroundColor: isSelected ? 'var(--brand-teal)' : '#FFFFFF',
                                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {isSelected ? '✓ ' : '+ '} {sub}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Classes Grid */}
                      <div className="form-group">
                        <label className="form-label">
                          Grade / Classes Taught <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          {selectedClasses.map(cl => (
                            <span key={cl} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#E0F2FE',
                              color: '#0369A1',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              <span>{cl}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedClasses(selectedClasses.filter(c => c !== cl))}
                                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {CLASS_OPTIONS.map(c => {
                            const isSelected = selectedClasses.includes(c);
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => toggleSelection(c, selectedClasses, setSelectedClasses)}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  borderRadius: '8px',
                                  border: `1.5px solid ${isSelected ? '#0284C7' : 'var(--border-hairline)'}`,
                                  backgroundColor: isSelected ? '#E0F2FE' : '#FFFFFF',
                                  color: isSelected ? '#0369A1' : 'var(--text-main)',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {c}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom write-in Class */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', maxWidth: '320px' }}>
                          <input
                            type="text"
                            placeholder="Type custom class..."
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
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Educational Boards */}
                      <div className="form-group">
                        <label className="form-label">
                          Affiliated Boards Taught <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          {selectedBoards.map(bd => (
                            <span key={bd} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: '#F3E8FF',
                              color: '#6B21A8',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              <span>{bd}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedBoards(selectedBoards.filter(b => b !== bd))}
                                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {BOARD_OPTIONS.map(b => {
                            const isSelected = selectedBoards.includes(b);
                            return (
                              <button
                                key={b}
                                type="button"
                                onClick={() => toggleSelection(b, selectedBoards, setSelectedBoards)}
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  borderRadius: '8px',
                                  border: `1.5px solid ${isSelected ? '#8B5CF6' : 'var(--border-hairline)'}`,
                                  backgroundColor: isSelected ? '#F3E8FF' : '#FFFFFF',
                                  color: isSelected ? '#6B21A8' : 'var(--text-main)',
                                  fontSize: '0.82rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                              >
                                {b}
                              </button>
                            );
                          })}
                        </div>

                        {/* Custom write-in Board */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', maxWidth: '320px' }}>
                          <input
                            type="text"
                            placeholder="Type custom board..."
                            value={customBoard}
                            onChange={(e) => setCustomBoard(e.target.value)}
                            className="form-control"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customBoard.trim() && !selectedBoards.includes(customBoard.trim())) {
                                setSelectedBoards([...selectedBoards, customBoard.trim()]);
                                setCustomBoard('');
                              }
                            }}
                            className="btn btn-secondary"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* STEP 3: Locations & Travel */}
                  {currentStep === 3 && (
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 3: Location Preferences & Travel Radius
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Select the preferred locations in Gurgaon you can visit for offline/home tuition.
                      </p>

                      <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label className="form-label">
                          Preferred Gurgaon Sectors / Areas <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        
                        {/* Active Sector Pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {serviceAreas.map(area => (
                            <span key={area} style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              backgroundColor: 'var(--brand-teal-light)',
                              color: 'var(--brand-teal)',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '999px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              <span>{area}</span>
                              <button
                                type="button"
                                onClick={() => setServiceAreas(serviceAreas.filter(a => a !== area))}
                                style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex' }}
                              >
                                <X size={13} />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Search & Custom sector row */}
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
                              placeholder="Type Custom Sector..."
                              value={customArea}
                              onChange={(e) => setCustomArea(e.target.value)}
                              className="form-control"
                              style={{ minWidth: '180px' }}
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
                              style={{ padding: '0 0.85rem' }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Filtered Sectors List */}
                        <div style={{ 
                          marginTop: '0.5rem', 
                          maxHeight: '140px', 
                          overflowY: 'auto', 
                          border: '1px solid var(--border-hairline)', 
                          borderRadius: '12px', 
                          padding: '0.75rem',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: '0.4rem',
                          backgroundColor: '#F8FAFC'
                        }}>
                          {filteredSectors.map(loc => {
                            const isSelected = serviceAreas.includes(loc.name);
                            return (
                              <button
                                key={loc.slug}
                                type="button"
                                onClick={() => toggleSelection(loc.name, serviceAreas, setServiceAreas)}
                                style={{
                                  padding: '0.45rem',
                                  borderRadius: '8px',
                                  border: `1px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                                  backgroundColor: isSelected ? 'var(--brand-teal-light)' : '#FFFFFF',
                                  color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                }}
                              >
                                {isSelected ? '✓ ' : '+ '} {loc.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Maximum Home Visit Travel Radius (KM from your location)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {[3, 5, 8, 12, 15, 20, 30].map((km) => (
                            <button
                              key={km}
                              type="button"
                              onClick={() => setTravelRadius(km)}
                              style={{
                                flex: 1,
                                padding: '0.75rem 0',
                                borderRadius: '8px',
                                border: `1.5px solid ${travelRadius === km ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                                backgroundColor: travelRadius === km ? 'var(--brand-teal)' : '#FFFFFF',
                                color: travelRadius === km ? '#FFFFFF' : 'var(--text-main)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                              }}
                            >
                              {km} KM
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* GPS Home Location Picker */}
                      {(teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME') && (
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">📍 Your Home / Base Location (for proximity matching)</label>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Set your current location so we can match you with nearby parents. This helps counselors assign students closest to you.
                          </p>

                          <div
                            onClick={() => setShowTutorLocationPicker(true)}
                            style={{
                              border: tutorLatitude ? '2px solid #0F6E56' : '2px dashed #CBD5E1',
                              borderRadius: '14px',
                              padding: '0.85rem 1rem',
                              cursor: 'pointer',
                              backgroundColor: tutorLatitude ? '#F0FDF4' : '#F8FAFC',
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: tutorLatitude ? '#DCFCE7' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <MapPin size={18} color={tutorLatitude ? '#059669' : '#94A3B8'} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {tutorLatitude ? (
                                <>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <CheckCircle2 size={14} color="#059669" />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tutorFormattedAddress || 'Location Set'}</span>
                                  </div>
                                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>Tap to change</div>
                                </>
                              ) : (
                                <>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748B' }}>📍 Tap to set your home location</div>
                                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>Helps match nearest students to you</div>
                                </>
                              )}
                            </div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0F6E56', backgroundColor: '#ECFDF5', padding: '0.3rem 0.6rem', borderRadius: '8px', flexShrink: 0 }}>
                              {tutorLatitude ? 'Change' : 'Set'}
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                  {/* STEP 4: Pricing & Rates */}
                  {currentStep === 4 && (
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 4: Expected Hourly Rates (Price Ranges)
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Set your expected hourly price range. Highly specialized and foreign language subjects can be priced higher.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        {/* Home Visit Rates */}
                        {(teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME') && (
                          <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid var(--border-hairline)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-teal)' }}>
                              <Home size={18} />
                              <strong style={{ fontSize: '0.95rem' }}>Home Visit Tuition Fee Range</strong>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div className="form-group">
                                <label className="form-label">Minimum Expected (per hour)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                                  <input
                                    type="number"
                                    min={300}
                                    value={hourlyRateHomeMin}
                                    onChange={(e) => setHourlyRateHomeMin(Number(e.target.value))}
                                    className="form-control"
                                    style={{ borderRadius: '0 8px 8px 0' }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Maximum Expected (per hour)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                                  <input
                                    type="number"
                                    min={hourlyRateHomeMin}
                                    value={hourlyRateHomeMax}
                                    onChange={(e) => setHourlyRateHomeMax(Number(e.target.value))}
                                    className="form-control"
                                    style={{ borderRadius: '0 8px 8px 0' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Online Rates */}
                        {(teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE') && (
                          <div style={{
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid var(--border-hairline)',
                            borderRadius: '16px',
                            padding: '1.25rem',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-teal)' }}>
                              <Video size={18} />
                              <strong style={{ fontSize: '0.95rem' }}>Online Live 1-on-1 Tuition Fee Range</strong>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div className="form-group">
                                <label className="form-label">Minimum Expected (per hour)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                                  <input
                                    type="number"
                                    min={200}
                                    value={hourlyRateOnlineMin}
                                    onChange={(e) => setHourlyRateOnlineMin(Number(e.target.value))}
                                    className="form-control"
                                    style={{ borderRadius: '0 8px 8px 0' }}
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Maximum Expected (per hour)</label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '8px 0 0 8px', fontWeight: 700 }}>₹</span>
                                  <input
                                    type="number"
                                    min={hourlyRateOnlineMin}
                                    value={hourlyRateOnlineMax}
                                    onChange={(e) => setHourlyRateOnlineMax(Number(e.target.value))}
                                    className="form-control"
                                    style={{ borderRadius: '0 8px 8px 0' }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* STEP 5: Media Uploads */}
                  {currentStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                          Step 5: Profile Photo & 60s Video Intro
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Add a professional photo and introduction video to attract parents.
                        </p>
                      </div>

                      {/* Profile Photo */}
                      <div className="form-group">
                        <label className="form-label">Tutor Profile Photo (Headshot)</label>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1.25rem',
                          padding: '1.1rem',
                          borderRadius: '12px',
                          border: '1.5px dashed var(--border-hairline)',
                          backgroundColor: '#F8FAFC',
                        }}>
                          {profilePhotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={profilePhotoUrl} 
                              alt="Preview" 
                              style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-teal)' }} 
                            />
                          ) : (
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={26} color="var(--text-light)" />
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="photo-upload" 
                              onChange={(e) => handleFileChange(e, 'photo')} 
                              style={{ display: 'none' }} 
                            />
                            <label htmlFor="photo-upload" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', cursor: 'pointer' }}>
                              <Upload size={14} />
                              <span>Select Photo</span>
                            </label>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {profilePhotoName ? `Selected: ${profilePhotoName}` : 'Format: JPG, PNG. Clear face photo.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Intro Video */}
                      <div className="form-group">
                        <label className="form-label">Introductory Video (60-90 Seconds)</label>
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => setIntroVideoSource('link')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: introVideoSource === 'link' ? 'var(--brand-teal)' : '#FFFFFF',
                              color: introVideoSource === 'link' ? '#FFFFFF' : 'var(--text-main)',
                              border: '1.5px solid var(--border-hairline)',
                            }}
                          >
                            Paste Video Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setIntroVideoSource('upload')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: introVideoSource === 'upload' ? 'var(--brand-teal)' : '#FFFFFF',
                              color: introVideoSource === 'upload' ? '#FFFFFF' : 'var(--text-main)',
                              border: '1.5px solid var(--border-hairline)',
                            }}
                          >
                            Upload Video File
                          </button>
                        </div>

                        {introVideoSource === 'link' ? (
                          <div>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=... (Or Google Drive link)"
                              value={introVideoUrl.startsWith('data:') ? '' : introVideoUrl}
                              onChange={(e) => setIntroVideoUrl(e.target.value)}
                              className="form-control"
                            />
                          </div>
                        ) : (
                          <div style={{
                            padding: '1.1rem',
                            borderRadius: '12px',
                            border: '1.5px dashed var(--border-hairline)',
                            backgroundColor: '#F8FAFC',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center',
                            textAlign: 'center',
                          }}>
                            <Video size={28} color="var(--brand-teal)" />
                            <div>
                              <input 
                                type="file" 
                                accept="video/*" 
                                id="video-upload" 
                                onChange={(e) => handleFileChange(e, 'video')} 
                                style={{ display: 'none' }} 
                              />
                              <label htmlFor="video-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                                <Upload size={14} />
                                <span>Select Video File</span>
                              </label>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {introVideoFileName ? `Selected: ${introVideoFileName}` : 'Max duration: 90 seconds. File size max: 100MB.'}
                            </span>
                          </div>
                        )}

                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.85rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-app)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                        }}>
                          <strong>💡 How to record a perfect intro video:</strong>
                          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                            <li>Introduce yourself, qualification, and teaching experience.</li>
                            <li>Explain your teaching technique (e.g. practical examples, solving past papers).</li>
                            <li>Keep it strictly between 60 to 90 seconds.</li>
                          </ul>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* STEP 6: KYC Document Upload */}
                  {currentStep === 6 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                          Step 6: Identity Verification (KYC) <span style={{ color: '#DC2626' }}>*</span>
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Upload your government ID to complete verification. Documents are securely encrypted.
                        </p>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>
                          Select ID Type <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <select
                          value={idType}
                          onChange={(e) => { setIdType(e.target.value); setIdNumber(''); }}
                          className="form-control"
                          style={{ fontWeight: 600 }}
                        >
                          <option value="AADHAAR_MASKED">Aadhaar Card (UIDAI)</option>
                          <option value="PAN">PAN Card (Income Tax Dept)</option>
                          <option value="DRIVING_LICENSE">Driving License (RTO)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>
                          {idType === 'AADHAAR_MASKED' ? '12-Digit Aadhaar Number' : idType === 'PAN' ? '10-Character PAN Number' : 'Document ID Number'} <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={idType === 'AADHAAR_MASKED' ? '5234 2389 4823' : 'ABCDE1234F'}
                          value={idNumber}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (idType === 'AADHAAR_MASKED') {
                              const rawDigits = val.replace(/\D/g, '').slice(0, 12);
                              const formatted = rawDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
                              setIdNumber(formatted);
                            } else {
                              setIdNumber(val.toUpperCase().slice(0, 15));
                            }
                          }}
                          className="form-control"
                          style={{ letterSpacing: idType === 'AADHAAR_MASKED' ? '0.12rem' : undefined, fontWeight: 700 }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          {idType === 'AADHAAR_MASKED' ? 'Must be 12 numerical digits.' : idType === 'PAN' ? 'Must be 10 characters (e.g. ABCDE1234F).' : 'Enter your registered license number.'}
                        </span>
                      </div>

                      {/* Mandatory Document Photo Upload */}
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>
                            Upload Government ID Document Photo <span style={{ color: '#DC2626' }}>* (Mandatory)</span>
                          </span>
                          {idDocFileName ? (
                            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={14} color="#059669" /> Document Attached
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700 }}>
                              Required to proceed
                            </span>
                          )}
                        </label>

                        <div style={{
                          padding: '1.4rem',
                          borderRadius: '14px',
                          border: idDocFileName ? '2px solid #059669' : '2px dashed #DC2626',
                          backgroundColor: idDocFileName ? '#F0FDF4' : '#FEF2F2',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          gap: '0.6rem',
                          transition: 'all 0.2s ease',
                        }}>
                          {idDocFileName ? (
                            <>
                              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={24} color="#059669" />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                                  {idDocFileName}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                                  ✓ Document ready for verification
                                </div>
                              </div>
                              <label htmlFor="kyc-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', marginTop: '0.25rem' }}>
                                <Upload size={13} />
                                <span>Change / Re-upload Document</span>
                              </label>
                            </>
                          ) : (
                            <>
                              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck size={24} color="#DC2626" />
                              </div>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#991B1B' }}>
                                  Upload Front Side of {idType === 'AADHAAR_MASKED' ? 'Aadhaar' : idType === 'PAN' ? 'PAN' : 'License'}
                                </div>
                                <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '2px' }}>
                                  Clear JPG, PNG, or PDF file (Max 5MB)
                                </div>
                              </div>
                              <label htmlFor="kyc-upload" className="btn btn-primary btn-sm" style={{ backgroundColor: '#DC2626', borderColor: '#DC2626', cursor: 'pointer', marginTop: '0.25rem' }}>
                                <Upload size={14} />
                                <span>Select Document File *</span>
                              </label>
                            </>
                          )}
                          <input 
                            type="file" 
                            accept="image/jpeg,image/png,image/webp,application/pdf" 
                            id="kyc-upload" 
                            onChange={(e) => handleFileChange(e, 'kyc')} 
                            style={{ display: 'none' }} 
                          />
                        </div>
                      </div>

                      <div style={{
                        backgroundColor: 'var(--bg-app)',
                        border: '1.5px solid var(--border-teal)',
                        borderRadius: '12px',
                        padding: '1rem',
                        fontSize: '0.82rem',
                        color: 'var(--brand-teal)',
                        lineHeight: 1.55,
                      }}>
                        🔒 <strong>Secure Encryption Protocol Active:</strong> Your complete ID Number and document images are encrypted using AES-256 algorithm and stored on private database drives. Your details are only decrypted when requested by verified SSSAM Academy administrative auditors for onboarding checks. It will never be exposed in public searches or shared with parents.
                      </div>
                    </div>
                  )}

                  {/* STEP 7: Agreement & terms popup */}
                  {currentStep === 7 && (
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 7: Privacy & Service Agreement
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Review and accept our terms to complete your application.
                      </p>

                      {/* Agreement Text Preview */}
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid var(--border-hairline)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        lineHeight: 1.6,
                        marginBottom: '1.5rem',
                      }}>
                        <p style={{ marginBottom: '0.75rem' }}>
                          By checking the agreement box below, you signify that you have read, understood, and agreed to the service protocols, payment commissions, screening interviews, and data safety terms of <strong>TuitionForHome (Operated by SSSAM Academy)</strong>.
                        </p>
                        
                        <button 
                          type="button" 
                          onClick={() => setShowTermsModal(true)} 
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--brand-teal)', border: '1.5px solid var(--brand-teal)', fontWeight: 700 }}
                        >
                          <FileText size={14} />
                          <span>Read Full Wording & Legal Policy (View Details)</span>
                        </button>
                      </div>

                      {/* Checkbox */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        backgroundColor: 'var(--bg-app)',
                        padding: '1.1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-hairline)',
                      }}>
                        <input
                          type="checkbox"
                          id="agree-checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          style={{ marginTop: '4px', width: '18px', height: '18px', accentColor: 'var(--brand-teal)', cursor: 'pointer' }}
                        />
                        <label htmlFor="agree-checkbox" style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, cursor: 'pointer', lineHeight: 1.5 }}>
                          I agree to SSSAM Academy's terms of service, full 1st-month commission allocation, mandatory interview verification, marketing promotion rights, and encrypted document safety regulations.
                        </label>
                      </div>

                    </div>
                  )}

                  {/* Wizard navigation buttons */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-hairline)',
                  }}>
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="btn btn-secondary"
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ color: '#B91C1C', borderColor: '#FCA5A5' }}
                      >
                        Logout / Exit
                      </button>
                    )}

                    {currentStep < totalSteps ? (
                      <button
                        type="button"
                        onClick={() => {
                          // Comprehensive step validations
                          if (currentStep === 1) {
                            if (!degree.trim()) {
                              setErrorMessage('⚠️ Highest Qualification / Degree is mandatory.');
                              return;
                            }
                            if (experienceYears === undefined || isNaN(experienceYears) || experienceYears < 0) {
                              setErrorMessage('⚠️ Total Teaching Experience (Years) is mandatory.');
                              return;
                            }
                          }
                          if (currentStep === 2) {
                            if (selectedSubjects.length === 0) {
                              setErrorMessage('⚠️ Please select at least one Subject you teach.');
                              return;
                            }
                            if (selectedClasses.length === 0) {
                              setErrorMessage('⚠️ Please select at least one Class / Grade you teach.');
                              return;
                            }
                            if (selectedBoards.length === 0) {
                              setErrorMessage('⚠️ Please select at least one Board (e.g. CBSE, ICSE, IB).');
                              return;
                            }
                          }
                          if (currentStep === 3 && serviceAreas.length === 0) {
                            setErrorMessage('⚠️ Please select at least one preferred sector/area in Gurgaon.');
                            return;
                          }
                          if (currentStep === 4) {
                            if (!hourlyRateHome || Number(hourlyRateHome) <= 0) {
                              setErrorMessage('⚠️ Expected Hourly Rate is mandatory.');
                              return;
                            }
                          }
                          if (currentStep === 6) {
                            const cleanId = idNumber.replace(/\s+/g, '');
                            if (!cleanId) {
                              setErrorMessage('⚠️ Government ID Number is mandatory.');
                              return;
                            }
                            if (idType === 'AADHAAR_MASKED' && cleanId.length !== 12) {
                              setErrorMessage('⚠️ Please enter a valid 12-digit Aadhaar Number (12 digits required).');
                              return;
                            }
                            if (idType === 'PAN' && cleanId.length !== 10) {
                              setErrorMessage('⚠️ Please enter a valid 10-character PAN Number (e.g. ABCDE1234F).');
                              return;
                            }
                            if (!idDocUrl && !idDocFileName) {
                              setErrorMessage('⚠️ ID Document Proof is MANDATORY! Please upload your ID document photo/PDF before proceeding.');
                              return;
                            }
                          }

                          setErrorMessage('');
                          setCurrentStep(currentStep + 1);
                        }}
                        className="btn btn-primary"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={loading || !agreeTerms}
                        className="btn btn-primary btn-lg"
                        style={{
                          backgroundColor: agreeTerms ? 'var(--brand-teal)' : '#CBD5E1',
                          cursor: agreeTerms ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <Sparkles size={18} />
                        <span>{loading ? 'Submitting Profile...' : 'Submit & Register Profile'}</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </div>
          ) : (
            /* =========================================================================
               ONBOARDING COMPLETION SUCCESS SCREEN
               ========================================================================= */
            <div className="container" style={{ maxWidth: '780px' }}>
              <div className="apple-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-teal-light)',
                  color: 'var(--brand-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                }}>
                  <CheckCircle2 size={42} />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Application Submitted Successfully! 🎉
                </h2>

                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto 2rem auto' }}>
                  Welcome aboard, <strong>{userName}</strong>! Your account has been registered. Your application status is currently: <strong>Pending Interview Verification</strong>.
                </p>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid var(--border-hairline)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  maxWidth: '520px',
                  margin: '0 auto 2rem auto',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={16} color="var(--brand-teal)" />
                    <span>WHAT HAPPENS NEXT?</span>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <li>Our administrative auditors will review your qualifications and intro video.</li>
                    <li>You will receive a call within 24 hours to schedule your online video interview or walk-in.</li>
                    <li>Once approved, your tutor profile will be set to <strong>Active & Verified</strong>, and you can start matching with parent leads!</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <a href="/tutor/profile" className="btn btn-primary" style={{ backgroundColor: 'var(--brand-teal)' }}>
                    <span>Go to Profile Dashboard</span>
                    <ArrowRight size={14} />
                  </a>
                  <a href="/counselor" className="btn btn-secondary">
                    <span>Counselor Desk (Preview)</span>
                    <ExternalLink size={14} />
                  </a>
                  <button type="button" onClick={handleLogout} className="btn btn-secondary" style={{ color: '#B91C1C', borderColor: '#FCA5A5' }}>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

      </main>

      {/* =========================================================================
         TERMS AND CONDITIONS MODAL POPUP (LONG LEGAL TEXT)
         ========================================================================= */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '1.5rem',
        }}>
          <div className="apple-card" style={{
            backgroundColor: '#FFFFFF',
            maxWidth: '640px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '16px',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.15)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-hairline)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>SSSAM Academy - Tutor Agreement</strong>
              <button 
                type="button" 
                onClick={() => setShowTermsModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Dense Legal Wording) */}
            <div style={{
              padding: '1.75rem',
              overflowY: 'auto',
              fontSize: '0.78rem',
              color: '#334155',
              lineHeight: '1.65',
              textAlign: 'justify'
            }}>
              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 1: IDENTITY DATA PRIVACY & ENCRYPTION PROTOCOLS</h4>
              <p style={{ marginBottom: '1rem' }}>
                TuitionForHome (the "Bureau"), operated and supervised by SSSAM Academy, sector 14 Gurgaon, adheres to the Digital Personal Data Protection (DPDP) Act of India. Tutors uploading credentials and identification documents (including Aadhaar Card, PAN Card, and Driving License) hereby consent that all such government ID records will be stored in an encrypted format. Standard cryptographic hashing and AES-256 block-cipher structures are applied to prevent unauthorized data exposure. The complete documentation remains confidential and is restricted to the internal administrative audit desk. Masked visual tags containing only the last four digits of the verified document shall be accessible to the tutor profile settings.
              </p>

              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 2: PROHIBITION OF DIRECT OR COLLUSIVE DEALS</h4>
              <p style={{ marginBottom: '1rem' }}>
                Tutors registered under SSSAM Academy are strictly prohibited from entering into private, direct, collusive, or bypass agreements with students or parents matched and assigned by the Bureau. All communication, scheduling, demos, and billing must be logged through the platform channels. Any attempt to collect payments directly, share private billing details, or circumvent the Academy's service portal will trigger immediate and permanent account suspension, forfeiture of accrued bonuses, blacklisting across Gurgaon educational networks, and legal recovery proceedings to claim double the equivalent bureau matching fees.
              </p>

              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 3: COMMISSION FEE RETENTION STRUCTURE (100% FIRST MONTH FEE)</h4>
              <p style={{ marginBottom: '1rem' }}>
                For every lead assignment finalized, the Bureau charges a matching and management commission equivalent to <strong>one hundred percent (100%) of the tuition fees generated during the first calendar month</strong> (or first 30 days of active tuition). The client (parent/student) is instructed to pay the first month's fees directly to SSSAM Academy. The tutor is legally bound to conduct all assigned sessions during this first month as part of the onboarding registry requirements, with no payout generated for this initial period. Sub-allocations, commission splits, or staggered payouts (e.g. 50/50 split option) are subject to discretionary approvals by the counselor desk.
              </p>

              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 4: REGISTRATION FEE WAIVER CONDITIONS</h4>
              <p style={{ marginBottom: '1rem' }}>
                The standard tutor registration and verification fee of INR 999 (Nine Hundred and Ninety-Nine Rupees Only) is waived under promotional seasonal drives. Tutors acknowledge that this waiver is not an absolute right and is subject to promotional availability. Tutors must verify with the SSSAM Academy helpline or Gurgaon sector 14 walk-in support to confirm if the free verification drive is active for their registered profile at the time of database approval.
              </p>

              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 5: MANDATORY INTERVIEW SCREENING AND PROFILE ACTIVATION</h4>
              <p style={{ marginBottom: '1rem' }}>
                Initial online registry does not constitute profile activation. Tutors must successfully pass a telephonic screening, followed by a mandatory online video call interview or physical walk-in evaluation at the physical office center. Profile badges (Verified, Star, Senior) and pricing limits are dynamically calibrated based on customer reviews, compliance track record, qualification checks, and active parent ratings.
              </p>

              <h4 style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#0F172A' }}>SECTION 6: SOCIAL MEDIA PROMOTION AND MARKETING CONSENT</h4>
              <p style={{ marginBottom: '1rem' }}>
                Registered tutors grant SSSAM Academy and TuitionForHome royalty-free, perpetual, and non-exclusive rights to publish, share, and promote their introductory video clips, educational degree details, and profile photos across social media channels (including Facebook, Instagram, Google Maps, YouTube, and digital ads) to generate student leads and match tutoring assignments.
              </p>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              justifyContent: 'flex-end',
              backgroundColor: '#F8FAFC'
            }}>
              <button
                type="button"
                onClick={() => { setAgreeTerms(true); setShowTermsModal(false); }}
                className="btn btn-primary btn-sm"
              >
                <span>Accept Terms & Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && <Footer />}

      {/* TUTOR LOCATION PICKER POPUP */}
      {showTutorLocationPicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2500, backgroundColor: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowTutorLocationPicker(false); }}
        >
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '500px', maxHeight: '85vh', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>📍 Set Your Home Location</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>Drag pin or tap on the map</p>
              </div>
              <button type="button" onClick={() => setShowTutorLocationPicker(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}>
                <X size={18} color="#64748B" />
              </button>
            </div>

            <div ref={tutorPickerMapRef} style={{ height: '250px', width: '100%', position: 'relative', zIndex: 10 }} />

            <div style={{ padding: '1rem 1.25rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.75rem 0.9rem', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>YOUR ADDRESS</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {isTutorReverseGeocoding ? (
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>Detecting address...</span>
                  ) : (
                    <>
                      {tutorFormattedAddress && <CheckCircle2 size={14} color="#059669" />}
                      <span>{tutorFormattedAddress || 'Tap on the map to select'}</span>
                    </>
                  )}
                </div>
                {tutorLatitude && tutorLongitude && (
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.2rem' }}>{tutorLatitude.toFixed(5)}, {tutorLongitude.toFixed(5)}</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!('geolocation' in navigator)) return;
                    setIsDetectingTutorGPS(true);
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude; const lng = pos.coords.longitude;
                        setTutorLatitude(lat); setTutorLongitude(lng);
                        if (tutorPickerMap && tutorPickerMarkerRef.current) {
                          tutorPickerMap.setView([lat, lng], 16);
                          tutorPickerMarkerRef.current.setLatLng([lat, lng]);
                        }
                        setIsTutorReverseGeocoding(true);
                        const addr = await tutorReverseGeocode(lat, lng);
                        setTutorFormattedAddress(addr);
                        setIsTutorReverseGeocoding(false); setIsDetectingTutorGPS(false);
                      },
                      () => { setIsDetectingTutorGPS(false); },
                      { enableHighAccuracy: true, timeout: 8000 }
                    );
                  }}
                  disabled={isDetectingTutorGPS}
                  style={{ flex: 1, padding: '0.65rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#334155', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                >
                  <MapPin size={14} />
                  {isDetectingTutorGPS ? 'Detecting...' : 'Use Current Location'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowTutorLocationPicker(false)}
                  disabled={!tutorLatitude || isTutorReverseGeocoding}
                  style={{ flex: 1.5, padding: '0.65rem', borderRadius: '12px', border: 'none', background: tutorLatitude ? '#0F6E56' : '#CBD5E1', color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', cursor: tutorLatitude ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', boxShadow: tutorLatitude ? '0 4px 14px rgba(15,110,86,0.3)' : 'none' }}
                >
                  <CheckCircle2 size={14} />
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
