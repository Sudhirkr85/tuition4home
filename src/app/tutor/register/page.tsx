'use client';

import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  GURGAON_LOCALITIES,
  SUBJECT_OPTIONS,
  CLASS_OPTIONS,
  BOARD_OPTIONS,
  SSSAM_OFFICE_DETAILS,
} from '@/lib/data';
import { getVideoSourceInfo } from '@/lib/video';
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
  CreditCard,
  Info,
  HelpCircle,
  Check,
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
  const [wizardPhone, setWizardPhone] = useState('');
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

  // Forgot / Reset Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'EMAIL' | 'OTP_RESET'>('EMAIL');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');

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
  const [gender, setGender] = useState<'FEMALE' | 'MALE' | 'OTHER' | ''>('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [college, setCollege] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | string>(2);
  const [degreeDocUrl, setDegreeDocUrl] = useState('');
  const [degreeDocFileName, setDegreeDocFileName] = useState('');
  
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
  const [classSearch, setClassSearch] = useState('');
  const [boardSearch, setBoardSearch] = useState('');
  const [areaSearch, setAreaSearch] = useState('');
  const [tutorModalSearch, setTutorModalSearch] = useState('');
  const [tutorModalSearchResults, setTutorModalSearchResults] = useState<Array<{ name: string; landmark: string; lat: number; lng: number }>>([]);
  const [wizardErrorField, setWizardErrorField] = useState<string | null>(null);

  const triggerWizardError = (fieldId: string, message: string) => {
    setErrorMessage(message);
    setWizardErrorField(fieldId);
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 60);
  };

  // Scroll to top of wizard on step transitions with mobile keyboard dismissal and focus reset
  const scrollToWizardTop = () => {
    if (typeof document !== 'undefined' && document.activeElement && (document.activeElement as HTMLElement).blur) {
      (document.activeElement as HTMLElement).blur();
    }
    setTimeout(() => {
      const el = document.getElementById('wizard-form-top');
      if (el) {
        el.focus?.({ preventScroll: true });
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
    // Backup check for mobile Safari/Chrome delayed repaint
    setTimeout(() => {
      const el = document.getElementById('wizard-form-top');
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < -30 || rect.top > 150) {
          window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 15), behavior: 'smooth' });
        }
      }
    }, 150);
  };

  // Automatically scroll & reset focus whenever currentStep changes
  useEffect(() => {
    if (isLoggedIn) {
      scrollToWizardTop();
    }
  }, [currentStep, isLoggedIn]);
  
  // Step 3: Locations & Travel
  const [locationPrefType, setLocationPrefType] = useState<'BOTH' | 'SECTORS' | 'RADIUS'>('BOTH');
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
    if (!leafletLib || !showTutorLocationPicker || !tutorPickerMapRef.current) return;
    
    if (tutorPickerMap) {
      try { tutorPickerMap.remove(); } catch (e) {}
      setTutorPickerMap(null);
    }
    if ((tutorPickerMapRef.current as any)._leaflet_id) {
      delete (tutorPickerMapRef.current as any)._leaflet_id;
    }

    const timer = setTimeout(() => {
      if (!tutorPickerMapRef.current) return;
      if ((tutorPickerMapRef.current as any)._leaflet_id) {
        delete (tutorPickerMapRef.current as any)._leaflet_id;
      }
      const center = tutorLatitude && tutorLongitude ? [tutorLatitude, tutorLongitude] : [28.4595, 77.0266];
      const pMap = leafletLib.map(tutorPickerMapRef.current, {
        center,
        zoom: 17,
        zoomControl: true,
        attributionControl: false,
      });
      leafletLib.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        keepBuffer: 8,
      }).addTo(pMap);
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
      setTimeout(() => { if (pMap) pMap.invalidateSize(); }, 50);
      setTimeout(() => { if (pMap) pMap.invalidateSize(); }, 200);
      setTimeout(() => { if (pMap) pMap.invalidateSize(); }, 500);

      // Auto-fetch Live GPS if location is not yet set
      if (!tutorLatitude && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        setIsDetectingTutorGPS(true);
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            setTutorLatitude(lat);
            setTutorLongitude(lng);
            if (pMap && marker) {
              pMap.setView([lat, lng], 17);
              marker.setLatLng([lat, lng]);
              setTimeout(() => { if (pMap) pMap.invalidateSize(); }, 100);
            }
            setIsTutorReverseGeocoding(true);
            const addr = await tutorReverseGeocode(lat, lng);
            setTutorFormattedAddress(addr);
            setIsTutorReverseGeocoding(false);
            setIsDetectingTutorGPS(false);
          },
          () => {
            setIsDetectingTutorGPS(false);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [leafletLib, showTutorLocationPicker]);

  useEffect(() => {
    if (!showTutorLocationPicker && tutorPickerMap) {
      try { tutorPickerMap.remove(); } catch (e) {}
      setTutorPickerMap(null);
      tutorPickerMarkerRef.current = null;
      if (tutorPickerMapRef.current && (tutorPickerMapRef.current as any)._leaflet_id) {
        delete (tutorPickerMapRef.current as any)._leaflet_id;
      }
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
  
  // Step 7: Agreement, Privacy & Consent States
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeCommission, setAgreeCommission] = useState(false);
  const [agreeVerification, setAgreeVerification] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  
  const { data: authSession } = useSession();
  const isGoogleUser = Boolean(authSession?.user?.email) && !regPhone;

  // Submission Lifecycle
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sync real NextAuth Google session
  useEffect(() => {
    if (authSession?.user?.email) {
      const email = authSession.user.email;
      const name = authSession.user.name || 'Google Educator';
      const id = (authSession.user as any).id || `GGL-${email.split('@')[0]}`;
      const image = authSession.user.image || '';

      const sessionObj = {
        userId: id,
        name: name,
        email: email,
        image: image,
        avatarUrl: image,
        loginAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days auto-logout
      };

      try {
        localStorage.setItem('tutor_session', JSON.stringify(sessionObj));
      } catch {}

      setUserId(id);
      setUserName(name);
      setUserEmail(email);
      if ((authSession.user as any)?.phone && !wizardPhone) {
        setWizardPhone((authSession.user as any).phone);
      }
      if (image && !profilePhotoUrl) {
        setProfilePhotoUrl(image);
      }
      setIsLoggedIn(true);

      // Check if tutor already completed registration
      fetch(`/api/tutors/profile/setup?userId=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.profile && d.profile.status !== 'DRAFT') {
            window.location.href = '/tutor/profile';
          }
        })
        .catch(() => {});
    }
  }, [authSession]);

  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 500);
  };

  // Auto-save/Draft recovery on load if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('tutor_session');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('tutor_session');
          setIsLoggedIn(false);
          return;
        }
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
          if (p.college) setCollege(p.college);
          if (p.teachingMode) setTeachingMode(p.teachingMode);
          if (p.gender) setGender(p.gender);
          if (p.degree) setDegree(p.degree);
          if (p.specialization) setSpecialization(p.specialization);
          if (p.college) setCollege(p.college);
          if (p.passingYear) setPassingYear(p.passingYear);
          if (p.experienceYears !== undefined) setExperienceYears(p.experienceYears);
          if (p.selectedSubjects) setSelectedSubjects(p.selectedSubjects);
          if (p.selectedClasses) setSelectedClasses(p.selectedClasses);
          if (p.selectedBoards) setSelectedBoards(p.selectedBoards);
          if (p.locationPrefType) setLocationPrefType(p.locationPrefType);
          if (p.serviceAreas) setServiceAreas(p.serviceAreas);
          if (p.travelRadius) setTravelRadius(p.travelRadius);
          if (p.tutorLatitude) setTutorLatitude(p.tutorLatitude);
          if (p.tutorLongitude) setTutorLongitude(p.tutorLongitude);
          if (p.tutorFormattedAddress) setTutorFormattedAddress(p.tutorFormattedAddress);
          if (p.hourlyRateHomeMin) setHourlyRateHomeMin(p.hourlyRateHomeMin);
          if (p.hourlyRateHomeMax) setHourlyRateHomeMax(p.hourlyRateHomeMax);
          if (p.hourlyRateOnlineMin) setHourlyRateOnlineMin(p.hourlyRateOnlineMin);
          if (p.hourlyRateOnlineMax) setHourlyRateOnlineMax(p.hourlyRateOnlineMax);
          if (p.profilePhotoUrl) setProfilePhotoUrl(p.profilePhotoUrl);
          if (p.introVideoUrl) setIntroVideoUrl(p.introVideoUrl);
          if (p.idType) setIdType(p.idType);
          if (p.idNumber) setIdNumber(p.idNumber);
          if (p.idDocUrl) setIdDocUrl(p.idDocUrl);
          if (p.degreeDocUrl) setDegreeDocUrl(p.degreeDocUrl);
          if (p.degreeDocFileName) setDegreeDocFileName(p.degreeDocFileName);
          if (p.wizardPhone) setWizardPhone(p.wizardPhone);
        } catch (e) {
          console.error('Failed to parse draft details', e);
        }
      }
    } catch {}
  }
}, []);

  // Save draft whenever wizard states change
  useEffect(() => {
    if (isLoggedIn && userId) {
      const draftData = {
        currentStep,
        teachingMode,
        gender,
        degree,
        college,
        passingYear,
        experienceYears: Number(experienceYears) || 0,
        selectedSubjects,
        selectedClasses,
        selectedBoards,
        locationPrefType,
        serviceAreas,
        travelRadius,
        tutorLatitude,
        tutorLongitude,
        tutorFormattedAddress,
        hourlyRateHomeMin,
        hourlyRateHomeMax,
        hourlyRateOnlineMin,
        hourlyRateOnlineMax,
        profilePhotoUrl,
        introVideoUrl,
        idType,
        idNumber,
        idDocUrl,
        degreeDocUrl,
        degreeDocFileName,
        wizardPhone,
      };
      localStorage.setItem(`tutor_draft_${userId}`, JSON.stringify(draftData));
    }
  }, [
    isLoggedIn, userId, currentStep, teachingMode, degree, college, passingYear,
    experienceYears, selectedSubjects, selectedClasses, selectedBoards,
    locationPrefType, serviceAreas, travelRadius, tutorLatitude, tutorLongitude,
    tutorFormattedAddress, hourlyRateHomeMin, hourlyRateHomeMax,
    hourlyRateOnlineMin, hourlyRateOnlineMax, profilePhotoUrl, introVideoUrl,
    idType, idNumber, idDocUrl, degreeDocUrl, degreeDocFileName, wizardPhone
  ]);

  // Registration Email OTP Verification States
  const [regStep, setRegStep] = useState<'DETAILS' | 'OTP' | 'PASSWORD'>('DETAILS');
  const [regOtpCode, setRegOtpCode] = useState('');
  const [regEmailVerified, setRegEmailVerified] = useState(false);
  const [sendingRegOtp, setSendingRegOtp] = useState(false);
  const [verifyingRegOtp, setVerifyingRegOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [otpExpiryTimer, setOtpExpiryTimer] = useState(300);
  const [emailFocused, setEmailFocused] = useState(false);

  // OTP Countdown Timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (regStep === 'OTP') {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setOtpExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [regStep]);

  // Step 1: Send Email OTP for Registration
  const handleSendRegOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        setResendTimer(60);
        setOtpExpiryTimer(300);
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
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
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
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
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
      setErrorMessage('Please enter your email address.');
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
        const session = { userId: data.userId, name: data.name, email: data.email, loginAt: Date.now(), expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
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

  // Forgot / Reset Password Handlers
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErrorMsg('');
    setForgotSuccessMsg('');

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotErrorMsg('Please enter a valid email address.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/tutors/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REQUEST_OTP', email: forgotEmail.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep('OTP_RESET');
        setForgotSuccessMsg(data.message || 'Reset code sent to your email.');
      } else {
        setForgotErrorMsg(data.error || 'Failed to send reset code.');
      }
    } catch {
      setForgotErrorMsg('Failed to connect to the server.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotErrorMsg('');
    setForgotSuccessMsg('');

    if (!forgotOtpCode || forgotOtpCode.trim().length !== 6) {
      setForgotErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setForgotErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await fetch('/api/tutors/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESET_PASSWORD',
          email: forgotEmail.toLowerCase().trim(),
          otpCode: forgotOtpCode.trim(),
          newPassword: forgotNewPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const session = {
          userId: data.userId,
          name: data.name,
          email: data.email,
          loginAt: Date.now(),
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        };
        localStorage.setItem('tutor_session', JSON.stringify(session));
        setUserId(data.userId);
        setUserName(data.name || 'Educator');
        setUserEmail(data.email);
        setIsLoggedIn(true);

        if (data.isOnboardingComplete) {
          window.location.href = '/tutor/profile';
        } else {
          setShowForgotPassword(false);
          setCurrentStep(1);
        }
      } else {
        setForgotErrorMsg(data.error || 'Failed to reset password.');
      }
    } catch {
      setForgotErrorMsg('Failed to connect to the server.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Real Google 1-Click Login via NextAuth
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await signIn('google', { callbackUrl: '/tutor/register' });
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMessage('Failed to connect to Google Login.');
      setLoading(false);
    }
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'video' | 'kyc' | 'degree') => {
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
      } else if (type === 'degree') {
        setDegreeDocUrl(base64String);
        setDegreeDocFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmit = async () => {
    if (!agreeTerms) {
      setErrorMessage('⚠️ Please review and accept the agreement terms before completing registration.');
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
          email: userEmail,
          phone: wizardPhone || regPhone || '',
          teachingMode,
          gender,
          highestDegree: degree.trim(),
          qualifications: degree.trim() ? [{
            id: '1',
            degree: degree.trim(),
            institute: college.trim(),
            year: passingYear.trim(),
            grade: ''
          }] : [],
          experienceYears: Number(experienceYears) || 0,
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
          degreeDocUrl: degreeDocUrl || '',
          consentMarketing,
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

  const handleLogout = async () => {
    localStorage.removeItem('tutor_session');
    setIsLoggedIn(false);
    setUserId('');
    setUserName('');
    setUserEmail('');
    setCurrentStep(1);
    setSubmitted(false);
    try {
      await signOut({ redirect: false });
    } catch {}
    window.location.href = '/tutor/register';
  };

  // Filter subject list
  const filteredSubjects = SUBJECT_OPTIONS.filter(sub => 
    sub.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Filter class list
  const filteredClasses = CLASS_OPTIONS.filter(cl =>
    cl.toLowerCase().includes(classSearch.toLowerCase())
  );

  // Filter board list
  const filteredBoards = BOARD_OPTIONS.filter(bd =>
    bd.toLowerCase().includes(boardSearch.toLowerCase())
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
                    src="/tuitionforhome.webp"
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
                        🤝 TuitionForHome Tutor Promise
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>
                        &ldquo;Guaranteed On-Time Payments &amp; Zero Fee Hassle&rdquo;
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.45, display: 'block' }}>
                        TuitionForHome handles parent negotiations and manages advance fee collection, guaranteeing your payouts on-time. You focus purely on delivering excellence in teaching!
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
                              autoCapitalize="words"
                              placeholder="e.g. Amit Kumar"
                              value={regName}
                              onChange={(e) => {
                                const val = e.target.value;
                                // Automatically capitalize first letter of each word
                                const formatted = val.replace(/\b[a-z]/g, (char) => char.toUpperCase());
                                setRegName(formatted);
                              }}
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

                        <div className="form-group" style={{ position: 'relative' }}>
                          <label className="form-label">Email Address (OTP Sent Here)</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="email"
                              required
                              autoCapitalize="none"
                              autoCorrect="off"
                              placeholder="amit@gmail.com"
                              value={regEmail}
                              onFocus={() => setEmailFocused(true)}
                              onBlur={() => {
                                // Small timeout so mouse click on suggestion is registered
                                setTimeout(() => setEmailFocused(false), 200);
                              }}
                              onChange={(e) => setRegEmail(e.target.value.toLowerCase().trim())}
                              className="form-control"
                              style={{ paddingLeft: '2.5rem' }}
                            />
                            <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>

                          {/* Email Auto-Suggestions Dropdown after @ */}
                          {emailFocused && regEmail.includes('@') && (() => {
                            const [userPart, domainPart = ''] = regEmail.split('@');
                            const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'hotmail.com'];
                            const matchingDomains = commonDomains.filter((d) =>
                              d.startsWith(domainPart) && d !== domainPart
                            );
                            if (matchingDomains.length === 0 || !userPart) return null;
                            return (
                              <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                zIndex: 50,
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid #0D9488',
                                borderRadius: '10px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                                overflow: 'hidden',
                              }}>
                                <div style={{ padding: '0.35rem 0.65rem', fontSize: '0.68rem', fontWeight: 800, color: '#0F766E', backgroundColor: '#F0FDFA', borderBottom: '1px solid #CCFBF1' }}>
                                  SUGGESTIONS (TAP TO AUTO-FILL)
                                </div>
                                {matchingDomains.map((domain) => (
                                  <button
                                    key={domain}
                                    type="button"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setRegEmail(`${userPart}@${domain}`);
                                      setEmailFocused(false);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      width: '100%',
                                      textAlign: 'left',
                                      padding: '0.55rem 0.85rem',
                                      fontSize: '0.86rem',
                                      fontWeight: 600,
                                      color: '#1E293B',
                                      backgroundColor: '#FFFFFF',
                                      border: 'none',
                                      borderBottom: '1px solid #F1F5F9',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <span style={{ color: '#0F766E', fontWeight: 700 }}>{userPart}</span>
                                    <span style={{ color: '#2563EB', fontWeight: 800 }}>@{domain}</span>
                                  </button>
                                ))}
                              </div>
                            );
                          })()}

                          {/* Quick Domain Tap Chips */}
                          {regEmail && !regEmail.includes('@') && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                              {['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com'].map((dm) => (
                                <button
                                  key={dm}
                                  type="button"
                                  onClick={() => setRegEmail(`${regEmail}${dm}`)}
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '6px',
                                    backgroundColor: '#F1F5F9',
                                    border: '1px solid #E2E8F0',
                                    color: '#0F766E',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {dm}
                                </button>
                              ))}
                            </div>
                          )}
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

                        {/* Divider */}
                        <div style={{ position: 'relative', textAlign: 'center', margin: '0.5rem 0 0.25rem 0' }}>
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'var(--border-hairline)', zIndex: 0 }} />
                          <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 0.85rem', color: 'var(--text-light)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                            OR CONTINUE WITH GOOGLE
                          </span>
                        </div>

                        {/* Google Quick Registration at the Bottom */}
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={loading}
                          className="btn btn-secondary"
                          style={{
                            width: '100%',
                            padding: '0.8rem 1rem',
                            borderRadius: '12px',
                            border: '1.5px solid #E2E8F0',
                            backgroundColor: '#F8FAFC',
                            color: '#334155',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                          </svg>
                          <span>Sign up with Google (1-Click)</span>
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label className="form-label" style={{ margin: 0 }}>6-Digit Verification Code</label>
                            {otpExpiryTimer > 0 ? (
                              <span style={{
                                fontSize: '0.75rem',
                                color: otpExpiryTimer < 60 ? '#DC2626' : '#0F766E',
                                fontWeight: 700,
                                backgroundColor: otpExpiryTimer < 60 ? '#FEF2F2' : '#F0FDFA',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                border: otpExpiryTimer < 60 ? '1px solid #FECACA' : '1px solid #CCFBF1'
                              }}>
                                ⏱️ Expires in {Math.floor(otpExpiryTimer / 60).toString().padStart(2, '0')}:{(otpExpiryTimer % 60).toString().padStart(2, '0')}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 800, backgroundColor: '#FEF2F2', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid #FECACA' }}>
                                ⚠️ Code Expired
                              </span>
                            )}
                          </div>
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
                          disabled={verifyingRegOtp || regOtpCode.length !== 6 || otpExpiryTimer === 0}
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

                          {resendTimer > 0 ? (
                            <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.82rem' }}>
                              Resend Code in <strong style={{ color: '#0F766E' }}>{resendTimer}s</strong>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSendRegOtp()}
                              disabled={sendingRegOtp}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563EB',
                                fontWeight: 700,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                              }}
                            >
                              {sendingRegOtp ? 'Resending...' : 'Resend Code'}
                            </button>
                          )}
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
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label className="form-label" style={{ margin: 0 }}>Create Password</label>
                            {regPassword.length > 0 && (() => {
                              const isLen = regPassword.length >= 8;
                              const isMix = /[a-z]/.test(regPassword) && /[A-Z]/.test(regPassword);
                              const isNum = /\d/.test(regPassword);
                              const isSpec = /[^A-Za-z0-9]/.test(regPassword);
                              const score = [isLen, isMix, isNum, isSpec].filter(Boolean).length;
                              const labels = ['', 'Weak', 'Fair', 'Good', 'Strong Password'];
                              const colors = ['', '#EF4444', '#F97316', '#F59E0B', '#10B981'];
                              return (
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: colors[score] || '#64748B' }}>
                                  {labels[score] || 'Weak'}
                                </span>
                              );
                            })()}
                          </div>

                          <div style={{ position: 'relative' }}>
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              required
                              placeholder="Create a strong password (8+ chars)"
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
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 8)
                                  ? '#10B981'
                                  : undefined,
                                boxShadow: (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'password'
                                  ? '0 0 0 3px rgba(239, 68, 68, 0.18)'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 8)
                                  ? '0 0 0 3px rgba(16, 185, 129, 0.18)'
                                  : undefined,
                              }}
                            />
                            <Lock
                              size={16}
                              color={
                                (regConfirmPassword.length > 0 && regPassword !== regConfirmPassword) || regErrorField === 'password'
                                  ? '#EF4444'
                                  : (regConfirmPassword.length > 0 && regPassword === regConfirmPassword && regPassword.length >= 8)
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

                          {/* Dynamic Password Strength Progress Bar */}
                          {regPassword.length > 0 && (() => {
                            const isLen = regPassword.length >= 8;
                            const isMix = /[a-z]/.test(regPassword) && /[A-Z]/.test(regPassword);
                            const isNum = /\d/.test(regPassword);
                            const isSpec = /[^A-Za-z0-9]/.test(regPassword);
                            const score = [isLen, isMix, isNum, isSpec].filter(Boolean).length;
                            const colors = ['#E2E8F0', '#EF4444', '#F97316', '#F59E0B', '#10B981'];
                            const widthPercent = (score / 4) * 100;

                            return (
                              <div style={{ marginTop: '0.45rem' }}>
                                <div style={{ width: '100%', height: '4px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                                  <div style={{
                                    height: '100%',
                                    width: `${Math.max(15, widthPercent)}%`,
                                    backgroundColor: colors[score] || '#EF4444',
                                    borderRadius: '999px',
                                    transition: 'all 0.25s ease',
                                  }} />
                                </div>

                                {/* Security Criteria Checklist Chips (Only show while building password; hide once Strong) */}
                                {score < 4 && (
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', marginTop: '0.5rem' }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isLen ? '#059669' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span>{isLen ? '✓' : '○'}</span>
                                      <span>8+ Characters</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isMix ? '#059669' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span>{isMix ? '✓' : '○'}</span>
                                      <span>Uppercase &amp; Lowercase</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isNum ? '#059669' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span>{isNum ? '✓' : '○'}</span>
                                      <span>At least 1 Number (0-9)</span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: isSpec ? '#059669' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <span>{isSpec ? '✓' : '○'}</span>
                                      <span>Special Symbol (@, #, $)</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
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
                          {/* Live Non-Matching Error Message Only */}
                          {regConfirmPassword.length > 0 && regPassword !== regConfirmPassword && (
                            <div style={{ fontSize: '0.76rem', color: '#EF4444', fontWeight: 700, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span>✕ Passwords do not match</span>
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
                    {showForgotPassword ? (
                      /* =========================================================
                         FORGOT / RESET PASSWORD SUB-VIEW
                         ========================================================= */
                      <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: '#ECFDF5',
                            color: '#065F46',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            border: '1px solid #A7F3D0',
                            marginBottom: '0.5rem',
                          }}>
                            <ShieldCheck size={12} />
                            <span>ACCOUNT RECOVERY</span>
                          </div>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Reset Password</h2>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            {forgotStep === 'EMAIL' ? 'Enter your registered email address to receive a secure 6-digit verification code.' : 'Enter the verification code sent to your email and set your new password.'}
                          </p>
                        </div>

                        {forgotErrorMsg && (
                          <div style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            border: '1px solid #FECACA',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}>
                            <span>⚠️</span>
                            <span>{forgotErrorMsg}</span>
                          </div>
                        )}

                        {forgotSuccessMsg && (
                          <div style={{
                            padding: '0.75rem 1rem',
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            borderRadius: '12px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            marginBottom: '1rem',
                            border: '1px solid #A7F3D0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}>
                            <span>✓</span>
                            <span>{forgotSuccessMsg}</span>
                          </div>
                        )}

                        {forgotStep === 'EMAIL' ? (
                          <form onSubmit={handleRequestPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>Registered Email Address</label>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="email"
                                  required
                                  placeholder="amit@example.com"
                                  value={forgotEmail}
                                  onChange={(e) => setForgotEmail(e.target.value.toLowerCase().trim())}
                                  className="form-control"
                                  style={{ paddingLeft: '2.5rem', height: '48px' }}
                                />
                                <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={forgotLoading}
                              className="btn btn-primary"
                              style={{ padding: '0.9rem', fontSize: '0.95rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)', borderRadius: '12px' }}
                            >
                              <span>{forgotLoading ? 'Sending Reset Code...' : 'Send Password Reset Code'}</span>
                              <ArrowRight size={16} />
                            </button>
                          </form>
                        ) : (
                          <form onSubmit={handleConfirmPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>6-Digit Verification Code</label>
                              <input
                                type="text"
                                required
                                maxLength={6}
                                placeholder="XXXXXX"
                                value={forgotOtpCode}
                                onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                                className="form-control"
                                style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.3em', fontWeight: 'bold', height: '48px' }}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.86rem' }}>New Password (Min 6 Characters)</label>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type={showForgotNewPassword ? 'text' : 'password'}
                                  required
                                  minLength={6}
                                  placeholder="Enter new password"
                                  value={forgotNewPassword}
                                  onChange={(e) => setForgotNewPassword(e.target.value)}
                                  className="form-control"
                                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '48px' }}
                                />
                                <Lock size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <button
                                  type="button"
                                  onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-light)', padding: 0 }}
                                >
                                  {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={forgotLoading}
                              className="btn btn-primary"
                              style={{ padding: '0.9rem', fontSize: '0.95rem', width: '100%', justifyContent: 'center', backgroundColor: 'var(--brand-teal)', borderRadius: '12px' }}
                            >
                              <span>{forgotLoading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                              <CheckCircle2 size={16} />
                            </button>
                          </form>
                        )}

                        {/* Navigation options at Bottom */}
                        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-hairline)', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {/* Option 1: Quick OTP Login */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setLoginMethod('otp');
                              if (forgotEmail) setOtpContact(forgotEmail);
                              setForgotStep('EMAIL');
                              setForgotErrorMsg('');
                              setForgotSuccessMsg('');
                            }}
                            className="btn btn-secondary"
                            style={{
                              width: '100%',
                              justifyContent: 'center',
                              padding: '0.75rem 1rem',
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              borderRadius: '12px',
                              color: '#065F46',
                              backgroundColor: '#ECFDF5',
                              border: '1.5px solid #A7F3D0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Mail size={16} color="#059669" />
                            <span>Login with 1-Time OTP instead</span>
                          </button>

                          {/* Option 2: Back to Password Login */}
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(false);
                              setLoginMethod('password');
                              setForgotStep('EMAIL');
                              setForgotErrorMsg('');
                              setForgotSuccessMsg('');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '0.35rem',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#64748B',
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            ← Remember your password? Sign In
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* =========================================================
                         STANDARD LOGIN VIEW
                         ========================================================= */
                      <div>
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>Welcome Back</h2>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Access your educator dashboard settings</p>
                        </div>

                        {/* Login method selectors */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
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
                              <label className="form-label">Email Address</label>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="text"
                                  required
                                  placeholder="amit@example.com"
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
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                <label className="form-label" style={{ margin: 0 }}>Password</label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowForgotPassword(true);
                                    setForgotEmail(loginContact.includes('@') ? loginContact : '');
                                    setForgotStep('EMAIL');
                                    setForgotErrorMsg('');
                                    setForgotSuccessMsg('');
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    color: '#0F6E56',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  Forgot Password?
                                </button>
                              </div>
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
                                  <span>⚠️ Incorrect email or password. Please verify.</span>
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
                              <label className="form-label">Email Address</label>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="email"
                                  required
                                  disabled={isOtpSent}
                                  placeholder="amit@example.com"
                                  value={otpContact}
                                  onChange={(e) => setOtpContact(e.target.value)}
                                  className="form-control"
                                  style={{ paddingLeft: '2.5rem' }}
                                />
                                <Mail size={16} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                              </div>
                              <span style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                                Verification OTP will be sent directly to your email inbox.
                              </span>
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

                        {/* Divider */}
                        <div style={{ position: 'relative', textAlign: 'center', margin: '1.25rem 0 0.75rem 0' }}>
                          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'var(--border-hairline)', zIndex: 0 }} />
                          <span style={{ position: 'relative', backgroundColor: '#FFFFFF', padding: '0 0.85rem', color: 'var(--text-light)', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                            OR SIGN IN WITH GOOGLE
                          </span>
                        </div>

                        {/* Google Login at the Bottom */}
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={loading}
                          className="btn btn-secondary"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            fontWeight: 700,
                            padding: '0.8rem 1rem',
                            fontSize: '0.88rem',
                            backgroundColor: '#F8FAFC',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: '12px',
                            color: '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24">
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
                <div id="wizard-form-top" tabIndex={-1} style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '1.5rem 2rem', outline: 'none' }}>
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
                      {/* Mobile Number for Google Sign-in Users */}
                      {isGoogleUser && (
                        <div style={{
                          marginBottom: '1.5rem',
                          padding: '1.1rem',
                          borderRadius: '14px',
                          border: wizardErrorField === 'field-wizardPhone' ? '2px solid #EF4444' : '1.5px solid #A7F3D0',
                          backgroundColor: wizardErrorField === 'field-wizardPhone' ? '#FEF2F2' : '#F0FDF4',
                          boxShadow: wizardErrorField === 'field-wizardPhone' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : 'none',
                        }}>
                          <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Phone size={16} color="var(--brand-teal)" />
                            Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 600, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                              Required for Google Sign-in
                            </span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748B', fontSize: '0.9rem' }}>+91</span>
                            <input
                              id="field-wizardPhone"
                              type="tel"
                              maxLength={10}
                              placeholder="Enter 10-digit mobile number"
                              value={wizardPhone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setWizardPhone(val);
                                if (wizardErrorField === 'field-wizardPhone') setWizardErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                paddingLeft: '3.2rem',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                borderColor: wizardErrorField === 'field-wizardPhone' ? '#EF4444' : undefined,
                                boxShadow: wizardErrorField === 'field-wizardPhone' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                              }}
                              required
                            />
                          </div>
                          <p style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.35rem', margin: 0 }}>
                            We'll use this to contact you for student matching.
                          </p>
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 1: Teaching Mode & Basic Profile Info
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        Select how you prefer to match with Gurgaon students.
                      </p>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                          Preferred Teaching Mode
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                          {[
                            { id: 'BOTH', label: 'Both (Home & Online)' },
                            { id: 'OFFLINE_HOME', label: 'Home Tuition' },
                            { id: 'ONLINE_LIVE', label: 'Online 1-on-1' },
                          ].map((m) => {
                            const isSelected = teachingMode === m.id;
                            return (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => setTeachingMode(m.id as any)}
                                style={{
                                  padding: '0.65rem 0.5rem',
                                  borderRadius: '10px',
                                  border: `1.5px solid ${isSelected ? 'var(--brand-teal)' : '#CBD5E1'}`,
                                  backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                                  color: isSelected ? '#065F46' : '#334155',
                                  fontWeight: isSelected ? 800 : 600,
                                  fontSize: '0.82rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'center',
                                  boxShadow: isSelected ? '0 1px 4px rgba(15, 110, 86, 0.12)' : 'none',
                                }}
                              >
                                {isSelected ? '✓ ' : ''}{m.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div id="field-gender" style={{
                        marginBottom: '1.25rem',
                        padding: wizardErrorField === 'field-gender' ? '0.75rem' : '0',
                        borderRadius: '12px',
                        border: wizardErrorField === 'field-gender' ? '2px solid #EF4444' : 'none',
                        backgroundColor: wizardErrorField === 'field-gender' ? '#FEF2F2' : 'transparent',
                      }}>
                        <label className="form-label" style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          Gender <span style={{ color: '#DC2626' }}>*</span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500 }}>
                            (Required for student matching)
                          </span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                          {[
                            { id: 'FEMALE', label: 'Female' },
                            { id: 'MALE', label: 'Male' },
                            { id: 'OTHER', label: 'Other' },
                          ].map((g) => {
                            const isSelected = gender === g.id;
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => {
                                  setGender(g.id as any);
                                  if (wizardErrorField === 'field-gender') setWizardErrorField(null);
                                }}
                                style={{
                                  padding: '0.65rem 0.5rem',
                                  borderRadius: '10px',
                                  border: `1.5px solid ${isSelected ? 'var(--brand-teal)' : '#CBD5E1'}`,
                                  backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                                  color: isSelected ? '#065F46' : '#334155',
                                  fontWeight: isSelected ? 800 : 600,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  textAlign: 'center',
                                  boxShadow: isSelected ? '0 1px 4px rgba(15, 110, 86, 0.12)' : 'none',
                                }}
                              >
                                {isSelected ? '✓ ' : ''}{g.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">
                            Highest Qualification / Degree <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              id="field-degree"
                              type="text"
                              autoCapitalize="words"
                              placeholder="e.g. B.Tech, M.Sc, B.Ed, B.Com, MBA"
                              value={degree}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\b[a-z]/g, (c) => c.toUpperCase());
                                setDegree(val);
                                if (wizardErrorField === 'field-degree') setWizardErrorField(null);
                              }}
                              className="form-control"
                              style={{
                                borderColor: wizardErrorField === 'field-degree' ? '#EF4444' : undefined,
                                boxShadow: wizardErrorField === 'field-degree' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                              }}
                              required
                            />
                            <GraduationCap size={16} color="var(--text-light)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Specialization / Major Stream <span style={{ color: '#64748B', fontWeight: 500 }}>(Optional)</span>
                          </label>
                          <input
                            id="field-specialization"
                            type="text"
                            autoCapitalize="words"
                            placeholder="e.g. Mathematics, Physics, CS, Commerce"
                            value={specialization}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\b[a-z]/g, (c) => c.toUpperCase());
                              setSpecialization(val);
                              if (wizardErrorField === 'field-specialization') setWizardErrorField(null);
                            }}
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div className="form-group">
                          <label className="form-label">
                            College / University Name <span style={{ color: '#64748B', fontWeight: 500 }}>(Optional)</span>
                          </label>
                          <input
                            id="field-college"
                            type="text"
                            autoCapitalize="words"
                            placeholder="e.g. Delhi University (DU), IIT, MDU, Amity"
                            value={college}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\b[a-z]/g, (c) => c.toUpperCase());
                              setCollege(val);
                              if (wizardErrorField === 'field-college') setWizardErrorField(null);
                            }}
                            className="form-control"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            Passing Year / Status <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <input
                            id="field-passingYear"
                            type="text"
                            maxLength={25}
                            placeholder="e.g. 2024 or Final Year"
                            value={passingYear}
                            onChange={(e) => {
                              const val = e.target.value;
                              // If digits only, restrict strictly to 4 digits (e.g. 2024)
                              const clean = /^\d+$/.test(val) ? val.slice(0, 4) : val.slice(0, 25);
                              setPassingYear(clean);
                              if (wizardErrorField === 'field-passingYear') setWizardErrorField(null);
                            }}
                            className="form-control"
                            style={{
                              borderColor: wizardErrorField === 'field-passingYear' ? '#EF4444' : undefined,
                              boxShadow: wizardErrorField === 'field-passingYear' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                            }}
                            required
                          />
                          {/* Quick Year Selection Chips */}
                          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                            {['2025', '2024', '2023', '2022', 'Final Year / Pursuing'].map((yr) => (
                              <button
                                key={yr}
                                type="button"
                                onClick={() => {
                                  setPassingYear(yr);
                                  if (wizardErrorField === 'field-passingYear') setWizardErrorField(null);
                                }}
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.45rem',
                                  borderRadius: '6px',
                                  backgroundColor: passingYear === yr ? '#0D9488' : '#F1F5F9',
                                  border: '1px solid',
                                  borderColor: passingYear === yr ? '#0D9488' : '#E2E8F0',
                                  color: passingYear === yr ? '#FFFFFF' : '#475569',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {yr}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Total Teaching Experience (Years) <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                          id="field-experienceYears"
                          type="number"
                          min={0}
                          max={40}
                          placeholder="e.g. 2"
                          value={experienceYears}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setExperienceYears('');
                            } else {
                              const parsed = Math.min(40, Math.max(0, parseInt(val, 10) || 0));
                              setExperienceYears(parsed);
                            }
                            if (wizardErrorField === 'field-experienceYears') setWizardErrorField(null);
                          }}
                          className="form-control"
                          style={{
                            borderColor: wizardErrorField === 'field-experienceYears' ? '#EF4444' : undefined,
                            boxShadow: wizardErrorField === 'field-experienceYears' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                          }}
                          required
                        />
                      </div>

                      {/* Mandatory Highest Qualification Degree / Marksheet Document Upload */}
                      <div
                        id="field-degreeDoc"
                        className="form-group"
                        style={{
                          backgroundColor: wizardErrorField === 'field-degreeDoc' ? '#FEF2F2' : '#F8FAFC',
                          border: wizardErrorField === 'field-degreeDoc' ? '2px solid #EF4444' : '1.5px dashed #CBD5E1',
                          borderRadius: '12px',
                          padding: '1rem',
                          marginTop: '0.25rem',
                          boxShadow: wizardErrorField === 'field-degreeDoc' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                          <label className="form-label" style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} color="var(--brand-teal)" />
                            Highest Qualification Degree / Marksheet Proof <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          {degreeDocFileName && (
                            <span style={{ fontSize: '0.74rem', color: '#0F6E56', fontWeight: 800 }}>
                              ✓ Attached
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                          Upload Degree, Marksheet, or Certificate (PNG, JPG, or PDF). Required for tutor profile verification.
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            id="degreeDocUpload"
                            onChange={(e) => {
                              handleFileChange(e, 'degree');
                              if (wizardErrorField === 'field-degreeDoc') setWizardErrorField(null);
                            }}
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor="degreeDocUpload"
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.84rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Upload size={15} />
                            {degreeDocFileName ? 'Change Degree Document' : 'Upload Degree / Marksheet Proof'}
                          </label>
                          {degreeDocFileName && (
                            <span style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 600 }}>
                              📄 {degreeDocFileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Subject & Board Expertise */}
                  {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <style>{`
                        @keyframes tagPopIn {
                          0% { transform: scale(0.8); opacity: 0; }
                          60% { transform: scale(1.06); opacity: 1; }
                          100% { transform: scale(1); opacity: 1; }
                        }
                        .animate-tag-pop {
                          animation: tagPopIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
                        }
                        .pill-interactive-btn {
                          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                        }
                        .pill-interactive-btn:hover {
                          transform: translateY(-2px);
                        }
                        .pill-interactive-btn:active {
                          transform: scale(0.96);
                        }
                      `}</style>

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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                            Subjects Taught <span style={{ color: '#DC2626' }}>*</span>
                          </label>
                          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                            Selected: <strong style={{ color: '#0F6E56' }}>{selectedSubjects.length}</strong>
                          </span>
                        </div>

                        {/* Selected Subject Pills */}
                        {selectedSubjects.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                            {selectedSubjects.map(sub => (
                              <span key={sub} className="animate-tag-pop" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                                color: '#065F46',
                                border: '1px solid #A7F3D0',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 6px rgba(15, 110, 86, 0.08)',
                                transition: 'all 0.18s ease',
                              }}>
                                <span>{sub}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedSubjects(selectedSubjects.filter(s => s !== sub))}
                                  style={{
                                    background: 'rgba(6, 95, 70, 0.12)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#065F46',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#EF4444';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(6, 95, 70, 0.12)';
                                    e.currentTarget.style.color = '#065F46';
                                  }}
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Smart Searchable Subject Input with onKeyDown Enter */}
                        <div style={{ position: 'relative' }}>
                          <input
                            id="field-subjects"
                            type="text"
                            placeholder="🔍 Type subject name (e.g. Mathematics, Physics, French)..."
                            value={subjectSearch}
                            onChange={(e) => setSubjectSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = subjectSearch.trim();
                                if (trimmed && !selectedSubjects.includes(trimmed)) {
                                  setSelectedSubjects([...selectedSubjects, trimmed]);
                                  setSubjectSearch('');
                                  if (wizardErrorField === 'field-subjects') setWizardErrorField(null);
                                }
                              }
                            }}
                            className="form-control"
                            style={{
                              borderRadius: '12px',
                              fontWeight: 600,
                              height: '46px',
                              borderColor: wizardErrorField === 'field-subjects' ? '#EF4444' : undefined,
                              boxShadow: wizardErrorField === 'field-subjects' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                            }}
                          />
                        </div>

                        {/* Floating Dynamic Dropdown — Appears Only While Typing */}
                        {subjectSearch.trim() && (
                          <div style={{
                            marginTop: '0.35rem',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                          }}>
                            {/* Matching items from catalog */}
                            {filteredSubjects.map(sub => {
                              const isSelected = selectedSubjects.includes(sub);
                              return (
                                <button
                                  key={sub}
                                  type="button"
                                  onClick={() => {
                                    if (!isSelected) {
                                      setSelectedSubjects([...selectedSubjects, sub]);
                                    } else {
                                      setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
                                    }
                                    setSubjectSearch('');
                                    if (wizardErrorField === 'field-subjects') setWizardErrorField(null);
                                  }}
                                  className="pill-interactive-btn"
                                  style={{
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '8px',
                                    border: isSelected ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                                    background: isSelected ? '#ECFDF5' : '#F8FAFC',
                                    color: isSelected ? '#065F46' : '#1E293B',
                                    fontSize: '0.84rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <span>{sub}</span>
                                  <span style={{ fontSize: '0.74rem', color: isSelected ? '#059669' : '#64748B' }}>
                                    {isSelected ? '✓ Added' : '+ Add'}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Direct Custom Add Option */}
                            {subjectSearch.trim() && !filteredSubjects.some(s => s.toLowerCase() === subjectSearch.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = subjectSearch.trim();
                                  if (trimmed && !selectedSubjects.includes(trimmed)) {
                                    setSelectedSubjects([...selectedSubjects, trimmed]);
                                    setSubjectSearch('');
                                    if (wizardErrorField === 'field-subjects') setWizardErrorField(null);
                                  }
                                }}
                                className="pill-interactive-btn"
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  borderRadius: '8px',
                                  border: '1.5px dashed #0F6E56',
                                  background: '#F0FDF4',
                                  color: '#0F6E56',
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                }}
                              >
                                <Plus size={15} />
                                <span>Add <strong>&ldquo;{subjectSearch.trim()}&rdquo;</strong> as custom subject</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Classes / Grades Section */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                            Grade / Classes Taught <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>(Optional)</span>
                          </label>
                          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                            Selected: <strong style={{ color: '#0284C7' }}>{selectedClasses.length}</strong>
                          </span>
                        </div>

                        {/* Selected Class Pills */}
                        {selectedClasses.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                            {selectedClasses.map(cl => (
                              <span key={cl} className="animate-tag-pop" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                                color: '#0369A1',
                                border: '1px solid #7DD3FC',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)',
                                transition: 'all 0.18s ease',
                              }}>
                                <span>{cl}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedClasses(selectedClasses.filter(c => c !== cl))}
                                  style={{
                                    background: 'rgba(3, 105, 161, 0.12)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0369A1',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#EF4444';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(3, 105, 161, 0.12)';
                                    e.currentTarget.style.color = '#0369A1';
                                  }}
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Searchable Class Input */}
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="🔍 Type class or grade (e.g. Class 10, Class 12, Nursery, JEE)..."
                            value={classSearch}
                            onChange={(e) => setClassSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = classSearch.trim();
                                if (trimmed && !selectedClasses.includes(trimmed)) {
                                  setSelectedClasses([...selectedClasses, trimmed]);
                                  setClassSearch('');
                                }
                              }
                            }}
                            className="form-control"
                            style={{
                              borderRadius: '12px',
                              fontWeight: 600,
                              height: '46px',
                            }}
                          />
                        </div>

                        {/* Floating Dynamic Dropdown for Classes */}
                        {classSearch.trim() && (
                          <div style={{
                            marginTop: '0.35rem',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                          }}>
                            {filteredClasses.map(cl => {
                              const isSelected = selectedClasses.includes(cl);
                              return (
                                <button
                                  key={cl}
                                  type="button"
                                  onClick={() => {
                                    if (!isSelected) {
                                      setSelectedClasses([...selectedClasses, cl]);
                                    } else {
                                      setSelectedClasses(selectedClasses.filter(c => c !== cl));
                                    }
                                    setClassSearch('');
                                  }}
                                  className="pill-interactive-btn"
                                  style={{
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '8px',
                                    border: isSelected ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                                    background: isSelected ? '#E0F2FE' : '#F8FAFC',
                                    color: isSelected ? '#0369A1' : '#1E293B',
                                    fontSize: '0.84rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <span>{cl}</span>
                                  <span style={{ fontSize: '0.74rem', color: isSelected ? '#0284C7' : '#64748B' }}>
                                    {isSelected ? '✓ Added' : '+ Add'}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Direct Custom Class Option */}
                            {classSearch.trim() && !filteredClasses.some(c => c.toLowerCase() === classSearch.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = classSearch.trim();
                                  if (trimmed && !selectedClasses.includes(trimmed)) {
                                    setSelectedClasses([...selectedClasses, trimmed]);
                                    setClassSearch('');
                                  }
                                }}
                                className="pill-interactive-btn"
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  borderRadius: '8px',
                                  border: '1.5px dashed #0284C7',
                                  background: '#F0F9FF',
                                  color: '#0284C7',
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                }}
                              >
                                <Plus size={15} />
                                <span>Add <strong>&ldquo;{classSearch.trim()}&rdquo;</strong> as custom grade/class</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Educational Boards Section */}
                      <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                            Affiliated Boards Taught <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 500 }}>(Optional)</span>
                          </label>
                          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                            Selected: <strong style={{ color: '#7C3AED' }}>{selectedBoards.length}</strong>
                          </span>
                        </div>

                        {/* Selected Board Pills */}
                        {selectedBoards.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                            {selectedBoards.map(bd => (
                              <span key={bd} className="animate-tag-pop" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
                                color: '#6B21A8',
                                border: '1px solid #D8B4FE',
                                padding: '0.35rem 0.8rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.08)',
                                transition: 'all 0.18s ease',
                              }}>
                                <span>{bd}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedBoards(selectedBoards.filter(b => b !== bd))}
                                  style={{
                                    background: 'rgba(107, 33, 168, 0.12)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6B21A8',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#EF4444';
                                    e.currentTarget.style.color = '#FFFFFF';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(107, 33, 168, 0.12)';
                                    e.currentTarget.style.color = '#6B21A8';
                                  }}
                                >
                                  <X size={11} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Searchable Board Input */}
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="🔍 Type board (e.g. CBSE, ICSE, IB, Cambridge, State Board)..."
                            value={boardSearch}
                            onChange={(e) => setBoardSearch(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const trimmed = boardSearch.trim();
                                if (trimmed && !selectedBoards.includes(trimmed)) {
                                  setSelectedBoards([...selectedBoards, trimmed]);
                                  setBoardSearch('');
                                }
                              }
                            }}
                            className="form-control"
                            style={{
                              borderRadius: '12px',
                              fontWeight: 600,
                              height: '46px',
                            }}
                          />
                        </div>

                        {/* Floating Dynamic Dropdown for Boards */}
                        {boardSearch.trim() && (
                          <div style={{
                            marginTop: '0.35rem',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            border: '1.5px solid #CBD5E1',
                            borderRadius: '12px',
                            padding: '0.5rem',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                          }}>
                            {filteredBoards.map(bd => {
                              const isSelected = selectedBoards.includes(bd);
                              return (
                                <button
                                  key={bd}
                                  type="button"
                                  onClick={() => {
                                    if (!isSelected) {
                                      setSelectedBoards([...selectedBoards, bd]);
                                    } else {
                                      setSelectedBoards(selectedBoards.filter(b => b !== bd));
                                    }
                                    setBoardSearch('');
                                  }}
                                  className="pill-interactive-btn"
                                  style={{
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '8px',
                                    border: isSelected ? '1.5px solid #7C3AED' : '1px solid #E2E8F0',
                                    background: isSelected ? '#F3E8FF' : '#F8FAFC',
                                    color: isSelected ? '#6B21A8' : '#1E293B',
                                    fontSize: '0.84rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <span>{bd}</span>
                                  <span style={{ fontSize: '0.74rem', color: isSelected ? '#7C3AED' : '#64748B' }}>
                                    {isSelected ? '✓ Added' : '+ Add'}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Direct Custom Board Option */}
                            {boardSearch.trim() && !filteredBoards.some(b => b.toLowerCase() === boardSearch.trim().toLowerCase()) && (
                              <button
                                type="button"
                                onClick={() => {
                                  const trimmed = boardSearch.trim();
                                  if (trimmed && !selectedBoards.includes(trimmed)) {
                                    setSelectedBoards([...selectedBoards, trimmed]);
                                    setBoardSearch('');
                                  }
                                }}
                                className="pill-interactive-btn"
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  borderRadius: '8px',
                                  border: '1.5px dashed #7C3AED',
                                  background: '#FAF5FF',
                                  color: '#7C3AED',
                                  fontSize: '0.84rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                }}
                              >
                                <Plus size={15} />
                                <span>Add <strong>&ldquo;{boardSearch.trim()}&rdquo;</strong> as custom board</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* STEP 3: Locations & Travel */}
                  {currentStep === 3 && (
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem' }}>
                        Step 3: Location Preferences & Travel Radius
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Choose how you want to match with nearby Gurgaon students.
                      </p>

                      {/* Sleek Horizontal Mode Switcher */}
                      <div style={{
                        backgroundColor: '#F1F5F9',
                        padding: '0.3rem',
                        borderRadius: '12px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '0.3rem',
                        marginBottom: '1.25rem',
                        border: '1px solid #E2E8F0',
                      }}>
                        {[
                          { id: 'BOTH', label: '⚡ Both (Recommended)' },
                          { id: 'SECTORS', label: '📍 Specific Sectors' },
                          { id: 'RADIUS', label: '🎯 Travel Radius' },
                        ].map((tab) => {
                          const isActive = locationPrefType === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setLocationPrefType(tab.id as any)}
                              style={{
                                padding: '0.6rem 0.5rem',
                                borderRadius: '9px',
                                border: 'none',
                                background: isActive ? 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)' : 'transparent',
                                color: isActive ? '#FFFFFF' : '#475569',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive ? '0 3px 10px rgba(15, 110, 86, 0.25)' : 'none',
                                textAlign: 'center',
                              }}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* 1. SECTORS SECTION (Shown in 'BOTH' or 'SECTORS' mode) */}
                      {(locationPrefType === 'BOTH' || locationPrefType === 'SECTORS') && (
                        <div
                          id="field-serviceAreas"
                          className="form-group"
                          style={{
                            marginBottom: '1.5rem',
                            transition: 'all 0.3s ease',
                            padding: wizardErrorField === 'field-serviceAreas' ? '0.75rem' : '0',
                            borderRadius: '16px',
                            border: wizardErrorField === 'field-serviceAreas' ? '2px solid #EF4444' : 'none',
                            backgroundColor: wizardErrorField === 'field-serviceAreas' ? '#FEF2F2' : 'transparent',
                            boxShadow: wizardErrorField === 'field-serviceAreas' ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                            <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                              Preferred Gurgaon Sectors / Areas <span style={{ color: '#DC2626' }}>*</span>
                            </label>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                              Selected: <strong style={{ color: '#0F6E56' }}>{serviceAreas.length}</strong> sectors
                            </span>
                          </div>

                          {/* Selected Sector Pills */}
                          {serviceAreas.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                              {serviceAreas.map(area => (
                                <span key={area} className="animate-tag-pop" style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                                  color: '#065F46',
                                  border: '1px solid #A7F3D0',
                                  padding: '0.35rem 0.8rem',
                                  borderRadius: '999px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  boxShadow: '0 2px 6px rgba(15, 110, 86, 0.08)',
                                  transition: 'all 0.18s ease',
                                }}>
                                  <span>{area}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setServiceAreas(serviceAreas.filter(a => a !== area));
                                      if (wizardErrorField === 'field-serviceAreas') setWizardErrorField(null);
                                    }}
                                    style={{
                                      background: 'rgba(6, 95, 70, 0.12)',
                                      border: 'none',
                                      borderRadius: '50%',
                                      width: '18px',
                                      height: '18px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#065F46',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s ease',
                                      padding: 0,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = '#EF4444';
                                      e.currentTarget.style.color = '#FFFFFF';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'rgba(6, 95, 70, 0.12)';
                                      e.currentTarget.style.color = '#065F46';
                                    }}
                                  >
                                    <X size={11} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Smart Searchable Sector Input */}
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              placeholder="🔍 Type sector or area (e.g. DLF Phase 5, Sector 56, Sohna Road)..."
                              value={areaSearch}
                              onChange={(e) => setAreaSearch(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const trimmed = areaSearch.trim();
                                  if (trimmed && !serviceAreas.includes(trimmed)) {
                                    setServiceAreas([...serviceAreas, trimmed]);
                                    setAreaSearch('');
                                    if (wizardErrorField === 'field-serviceAreas') setWizardErrorField(null);
                                  }
                                }
                              }}
                              className="form-control"
                              style={{
                                borderRadius: '12px',
                                fontWeight: 600,
                                height: '46px',
                                borderColor: wizardErrorField === 'field-serviceAreas' ? '#EF4444' : undefined,
                                boxShadow: wizardErrorField === 'field-serviceAreas' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                              }}
                            />
                          </div>

                          {/* Dropdown results — only show when searching */}
                          {areaSearch.trim() && (
                            <div style={{
                              marginTop: '0.35rem',
                              maxHeight: '220px',
                              overflowY: 'auto',
                              border: '1.5px solid #CBD5E1',
                              borderRadius: '12px',
                              padding: '0.5rem',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.35rem',
                            }}>
                              {filteredSectors.map(loc => {
                                const isSelected = serviceAreas.includes(loc.name);
                                return (
                                  <button
                                    key={loc.slug}
                                    type="button"
                                    onClick={() => {
                                      if (!isSelected) {
                                        setServiceAreas([...serviceAreas, loc.name]);
                                      } else {
                                        setServiceAreas(serviceAreas.filter(a => a !== loc.name));
                                      }
                                      setAreaSearch('');
                                      if (wizardErrorField === 'field-serviceAreas') setWizardErrorField(null);
                                    }}
                                    className="pill-interactive-btn"
                                    style={{
                                      padding: '0.55rem 0.85rem',
                                      borderRadius: '8px',
                                      border: isSelected ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                                      background: isSelected ? '#ECFDF5' : '#F8FAFC',
                                      color: isSelected ? '#065F46' : '#1E293B',
                                      fontSize: '0.84rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      textAlign: 'left',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <span>{loc.name}</span>
                                    <span style={{ fontSize: '0.74rem', color: isSelected ? '#059669' : '#64748B' }}>
                                      {isSelected ? '✓ Added' : '+ Add'}
                                    </span>
                                  </button>
                                );
                              })}

                              {/* Direct Custom Area Add Option */}
                              {areaSearch.trim() && !filteredSectors.some(l => l.name.toLowerCase() === areaSearch.trim().toLowerCase()) && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const trimmed = areaSearch.trim();
                                    if (trimmed && !serviceAreas.includes(trimmed)) {
                                      setServiceAreas([...serviceAreas, trimmed]);
                                      setAreaSearch('');
                                      if (wizardErrorField === 'field-serviceAreas') setWizardErrorField(null);
                                    }
                                  }}
                                  className="pill-interactive-btn"
                                  style={{
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1.5px dashed #0F6E56',
                                    background: '#F0FDF4',
                                    color: '#0F6E56',
                                    fontSize: '0.84rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                  }}
                                >
                                  <Plus size={15} />
                                  <span>Add <strong>&ldquo;{areaSearch.trim()}&rdquo;</strong> as custom sector</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 2. TRAVEL RADIUS & HOME GPS SECTION (Shown in 'BOTH' or 'RADIUS' mode) */}
                      {(locationPrefType === 'BOTH' || locationPrefType === 'RADIUS') && (
                        <div style={{ transition: 'all 0.3s ease' }}>
                          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                              <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                                Maximum Travel Radius: <strong style={{ color: '#0F6E56' }}>{travelRadius} KM</strong>
                              </label>
                              <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                                From Home GPS
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '0.4rem' }}>
                              {[3, 5, 8, 12, 15, 20, 30].map((km) => {
                                const isSelected = travelRadius === km;
                                return (
                                  <button
                                    key={km}
                                    type="button"
                                    onClick={() => setTravelRadius(km)}
                                    className="pill-interactive-btn"
                                    style={{
                                      padding: '0.65rem 0.2rem',
                                      borderRadius: '10px',
                                      border: isSelected ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                                      background: isSelected ? 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)' : '#FFFFFF',
                                      color: isSelected ? '#FFFFFF' : '#334155',
                                      fontWeight: 800,
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                      boxShadow: isSelected ? '0 3px 10px rgba(15, 110, 86, 0.25)' : 'none',
                                      textAlign: 'center',
                                    }}
                                  >
                                    {km} KM
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* GPS Home Location Picker */}
                          {(teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME') && (
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                              <label className="form-label">
                                📍 Your Home / Base Location (for proximity matching) <span style={{ color: '#DC2626' }}>*</span>
                              </label>
                              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                Set your location so counselors assign student leads closest to you within your {travelRadius} KM radius.
                              </p>

                              <div
                                id="field-baseLocation"
                                tabIndex={0}
                                onClick={() => {
                                  setShowTutorLocationPicker(true);
                                  if (wizardErrorField === 'field-baseLocation') setWizardErrorField(null);
                                }}
                                style={{
                                  border: wizardErrorField === 'field-baseLocation'
                                    ? '2.5px solid #EF4444'
                                    : (tutorLatitude ? '2px solid #0F6E56' : '2px dashed #CBD5E1'),
                                  borderRadius: '14px',
                                  padding: '0.85rem 1rem',
                                  cursor: 'pointer',
                                  backgroundColor: wizardErrorField === 'field-baseLocation'
                                    ? '#FEF2F2'
                                    : (tutorLatitude ? '#F0FDF4' : '#F8FAFC'),
                                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                                  boxShadow: wizardErrorField === 'field-baseLocation'
                                    ? '0 0 0 4px rgba(239, 68, 68, 0.22)'
                                    : 'none',
                                  outline: 'none',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '12px',
                                  backgroundColor: wizardErrorField === 'field-baseLocation'
                                    ? '#FEE2E2'
                                    : (tutorLatitude ? '#DCFCE7' : '#E2E8F0'),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0
                                }}>
                                  <MapPin size={18} color={wizardErrorField === 'field-baseLocation' ? '#EF4444' : (tutorLatitude ? '#059669' : '#94A3B8')} />
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
                                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: wizardErrorField === 'field-baseLocation' ? '#DC2626' : '#64748B' }}>
                                        {wizardErrorField === 'field-baseLocation' ? '⚠️ Please tap here to set your location' : '📍 Tap to set your home location'}
                                      </div>
                                      <div style={{ fontSize: '0.72rem', color: wizardErrorField === 'field-baseLocation' ? '#EF4444' : '#94A3B8', marginTop: '2px' }}>
                                        Helps match nearest students to you
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: wizardErrorField === 'field-baseLocation' ? '#FFFFFF' : '#0F6E56',
                                  backgroundColor: wizardErrorField === 'field-baseLocation' ? '#EF4444' : '#ECFDF5',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '8px',
                                  flexShrink: 0
                                }}>
                                  {tutorLatitude ? 'Change' : 'Set'}
                                </div>
                              </div>
                            </div>
                          )}
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
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-teal)' }}>
                              <Home size={18} />
                              <strong style={{ fontSize: '0.95rem' }}>Home Visit Tuition Fee Range</strong>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div className="form-group">
                                <label className="form-label">
                                  Minimum Expected (per hour) <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem 0.9rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '10px 0 0 10px', fontWeight: 700 }}>₹</span>
                                  <input
                                    id="field-hourlyRateHomeMin"
                                    type="number"
                                    min={50}
                                    max={10000}
                                    value={hourlyRateHomeMin || ''}
                                    onChange={(e) => {
                                      setHourlyRateHomeMin(Number(e.target.value));
                                      if (wizardErrorField === 'field-hourlyRateHomeMin') setWizardErrorField(null);
                                    }}
                                    className="form-control"
                                    style={{
                                      borderRadius: '0 10px 10px 0',
                                      borderColor: wizardErrorField === 'field-hourlyRateHomeMin' ? '#EF4444' : undefined,
                                      boxShadow: wizardErrorField === 'field-hourlyRateHomeMin' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                                    }}
                                    placeholder="e.g. 600"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Maximum Expected (per hour) <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem 0.9rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '10px 0 0 10px', fontWeight: 700 }}>₹</span>
                                  <input
                                    id="field-hourlyRateHomeMax"
                                    type="number"
                                    min={hourlyRateHomeMin || 50}
                                    max={10000}
                                    value={hourlyRateHomeMax || ''}
                                    onChange={(e) => {
                                      setHourlyRateHomeMax(Number(e.target.value));
                                      if (wizardErrorField === 'field-hourlyRateHomeMax') setWizardErrorField(null);
                                    }}
                                    className="form-control"
                                    style={{
                                      borderRadius: '0 10px 10px 0',
                                      borderColor: wizardErrorField === 'field-hourlyRateHomeMax' ? '#EF4444' : undefined,
                                      boxShadow: wizardErrorField === 'field-hourlyRateHomeMax' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                                    }}
                                    placeholder="e.g. 1200"
                                    required
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
                            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--brand-teal)' }}>
                              <Video size={18} />
                              <strong style={{ fontSize: '0.95rem' }}>Online Live 1-on-1 Tuition Fee Range</strong>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                              <div className="form-group">
                                <label className="form-label">
                                  Minimum Expected (per hour) <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem 0.9rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '10px 0 0 10px', fontWeight: 700 }}>₹</span>
                                  <input
                                    id="field-hourlyRateOnlineMin"
                                    type="number"
                                    min={50}
                                    max={10000}
                                    value={hourlyRateOnlineMin || ''}
                                    onChange={(e) => {
                                      setHourlyRateOnlineMin(Number(e.target.value));
                                      if (wizardErrorField === 'field-hourlyRateOnlineMin') setWizardErrorField(null);
                                    }}
                                    className="form-control"
                                    style={{
                                      borderRadius: '0 10px 10px 0',
                                      borderColor: wizardErrorField === 'field-hourlyRateOnlineMin' ? '#EF4444' : undefined,
                                      boxShadow: wizardErrorField === 'field-hourlyRateOnlineMin' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                                    }}
                                    placeholder="e.g. 500"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Maximum Expected (per hour) <span style={{ color: '#DC2626' }}>*</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <span style={{ padding: '0.75rem 0.9rem', backgroundColor: '#F1F5F9', border: '1.5px solid var(--border-hairline)', borderRight: 'none', borderRadius: '10px 0 0 10px', fontWeight: 700 }}>₹</span>
                                  <input
                                    id="field-hourlyRateOnlineMax"
                                    type="number"
                                    min={hourlyRateOnlineMin || 50}
                                    max={10000}
                                    value={hourlyRateOnlineMax || ''}
                                    onChange={(e) => {
                                      setHourlyRateOnlineMax(Number(e.target.value));
                                      if (wizardErrorField === 'field-hourlyRateOnlineMax') setWizardErrorField(null);
                                    }}
                                    className="form-control"
                                    style={{
                                      borderRadius: '0 10px 10px 0',
                                      borderColor: wizardErrorField === 'field-hourlyRateOnlineMax' ? '#EF4444' : undefined,
                                      boxShadow: wizardErrorField === 'field-hourlyRateOnlineMax' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                                    }}
                                    placeholder="e.g. 1000"
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Animated Projected Monthly Earnings Card (Home Visit & Online Breakdown) */}
                        {(() => {
                          const showHome = teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME';
                          const showOnline = teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE';
                          const homeMinMonthly = (hourlyRateHomeMin || 0) * 12 * 4;
                          const homeMaxMonthly = (hourlyRateHomeMax || 0) * 16 * 4;
                          const onlineMinMonthly = (hourlyRateOnlineMin || 0) * 12 * 4;
                          const onlineMaxMonthly = (hourlyRateOnlineMax || 0) * 16 * 4;

                          return (
                            <div style={{
                              background: 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)',
                              borderRadius: '16px',
                              padding: '1.2rem 1.4rem',
                              color: '#FFFFFF',
                              boxShadow: '0 8px 24px rgba(15, 110, 86, 0.25)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.85rem',
                              transition: 'all 0.3s ease',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: '0.6rem' }}>
                                <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9, fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <span>💰 Projected Monthly Earnings (12-16 hrs/week)</span>
                                </div>
                                <div style={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  padding: '0.25rem 0.7rem',
                                  borderRadius: '999px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backdropFilter: 'blur(4px)',
                                }}>
                                  ⚡ Real-time Estimate
                                </div>
                              </div>

                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: showHome && showOnline ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
                                gap: '0.85rem',
                              }}>
                                {showHome && (
                                  <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                  }}>
                                    <div style={{ fontSize: '0.74rem', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <span>🏡 Home Visit Tuition</span>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.2px' }}>
                                      ₹{homeMinMonthly.toLocaleString('en-IN')} – ₹{homeMaxMonthly.toLocaleString('en-IN')}
                                      <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.85, marginLeft: '4px' }}>/ month</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                                      Based on ₹{hourlyRateHomeMin || 0} - ₹{hourlyRateHomeMax || 0}/hr
                                    </div>
                                  </div>
                                )}

                                {showOnline && (
                                  <div style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1rem',
                                    border: '1px solid rgba(255, 255, 255, 0.18)',
                                  }}>
                                    <div style={{ fontSize: '0.74rem', opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <span>💻 Online Live 1-on-1</span>
                                    </div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', letterSpacing: '-0.2px' }}>
                                      ₹{onlineMinMonthly.toLocaleString('en-IN')} – ₹{onlineMaxMonthly.toLocaleString('en-IN')}
                                      <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.85, marginLeft: '4px' }}>/ month</span>
                                    </div>
                                    <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>
                                      Based on ₹{hourlyRateOnlineMin || 0} - ₹{hourlyRateOnlineMax || 0}/hr
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

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
                        <label className="form-label">
                          Tutor Profile Photo (Headshot) <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <div
                          id="field-profilePhoto"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.25rem',
                            padding: '1.1rem',
                            borderRadius: '16px',
                            border: wizardErrorField === 'field-profilePhoto' ? '2px solid #EF4444' : '1.5px dashed var(--border-hairline)',
                            backgroundColor: wizardErrorField === 'field-profilePhoto' ? '#FEF2F2' : '#F8FAFC',
                            boxShadow: wizardErrorField === 'field-profilePhoto' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : 'none',
                            transition: 'all 0.25s ease',
                          }}
                        >
                          {profilePhotoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={profilePhotoUrl} 
                              alt="Preview" 
                              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2.5px solid var(--brand-teal)', boxShadow: '0 4px 12px rgba(15, 110, 86, 0.25)' }} 
                            />
                          ) : (
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: wizardErrorField === 'field-profilePhoto' ? '#FEE2E2' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={28} color={wizardErrorField === 'field-profilePhoto' ? '#EF4444' : 'var(--text-light)'} />
                            </div>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="photo-upload" 
                              onChange={(e) => {
                                handleFileChange(e, 'photo');
                                if (wizardErrorField === 'field-profilePhoto') setWizardErrorField(null);
                              }} 
                              style={{ display: 'none' }} 
                            />
                            <label htmlFor="photo-upload" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start', cursor: 'pointer', borderRadius: '8px' }}>
                              <Upload size={14} />
                              <span>{profilePhotoUrl ? 'Change Photo' : 'Select Photo'}</span>
                            </label>
                            <span style={{ fontSize: '0.74rem', color: wizardErrorField === 'field-profilePhoto' ? '#DC2626' : 'var(--text-muted)', fontWeight: wizardErrorField === 'field-profilePhoto' ? 700 : 400 }}>
                              {profilePhotoName ? `Selected: ${profilePhotoName}` : wizardErrorField === 'field-profilePhoto' ? '⚠️ Required: Upload a clear face photo.' : 'Format: JPG, PNG. Clear face photo.'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Intro Video */}
                      <div className="form-group">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.45rem' }}>
                          <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.35rem' }}>
                            <span>Introductory Video (60–90s)</span>
                            <span style={{ color: '#0F6E56', fontWeight: 800, fontSize: '0.72rem', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.12rem 0.45rem', borderRadius: '999px' }}>
                              ⚡ Recommended
                            </span>
                          </label>
                          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, backgroundColor: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                            Optional to skip
                          </span>
                        </div>

                        {/* Top Tutor Benefits Card */}
                        <div style={{
                          background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                          border: '1.5px solid #A7F3D0',
                          borderRadius: '12px',
                          padding: '0.75rem 0.9rem',
                          marginBottom: '0.75rem',
                          boxShadow: '0 2px 6px rgba(15, 110, 86, 0.04)',
                        }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Sparkles size={14} color="#059669" />
                            <span>Why add an Intro Video?</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem', fontSize: '0.73rem', color: '#047857' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                              <span>🚀</span>
                              <span><strong>3x More Callbacks</strong> — Parents prefer seeing tutors.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                              <span>⚡</span>
                              <span><strong>Fast Approval</strong> — Audit review within 4 hrs.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                              <span>💰</span>
                              <span><strong>Higher Fees</strong> — Justify ₹800–₹1800+/hr.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                              <span>⭐</span>
                              <span><strong>Star Badge</strong> — Top parent search rank.</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 2-Column Responsive Video Switcher Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => setIntroVideoSource('link')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: introVideoSource === 'link' ? 'var(--brand-teal)' : '#FFFFFF',
                              color: introVideoSource === 'link' ? '#FFFFFF' : 'var(--text-main)',
                              border: `1.5px solid ${introVideoSource === 'link' ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              padding: '0.55rem 0.35rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              width: '100%',
                            }}
                          >
                            🔗 Paste Video Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setIntroVideoSource('upload')}
                            className="btn btn-sm"
                            style={{
                              backgroundColor: introVideoSource === 'upload' ? 'var(--brand-teal)' : '#FFFFFF',
                              color: introVideoSource === 'upload' ? '#FFFFFF' : 'var(--text-main)',
                              border: `1.5px solid ${introVideoSource === 'upload' ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              padding: '0.55rem 0.35rem',
                              justifyContent: 'center',
                              textAlign: 'center',
                              width: '100%',
                            }}
                          >
                            📁 Upload Video File
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
                              style={{ borderRadius: '10px' }}
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
                              <label htmlFor="video-upload" className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', borderRadius: '8px' }}>
                                <Upload size={14} />
                                <span>Select Video File</span>
                              </label>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {introVideoFileName ? `Selected: ${introVideoFileName}` : 'Max duration: 90 seconds. File size max: 100MB.'}
                            </span>
                          </div>
                        )}

                        {/* Live Video Preview in Step 5 */}
                        {(() => {
                          const videoInfo = getVideoSourceInfo(introVideoUrl);
                          if (!videoInfo.isEmbeddable) return null;
                          return (
                            <div style={{ marginTop: '0.85rem', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border-teal)', backgroundColor: '#0F172A' }}>
                              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
                                {videoInfo.type === 'youtube' || videoInfo.type === 'vimeo' || videoInfo.type === 'gdrive' ? (
                                  <iframe
                                    src={videoInfo.embedUrl}
                                    title="Video Preview"
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    src={videoInfo.embedUrl}
                                    controls
                                    playsInline
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                  />
                                )}
                              </div>
                              <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#F0FDF4', color: '#15803D', fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <CheckCircle2 size={14} color="#15803D" />
                                <span>✓ Live Video Preview Active ({videoInfo.type === 'youtube' ? 'YouTube Link Embed' : 'Direct Video File'})</span>
                              </div>
                            </div>
                          );
                        })()}

                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.85rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-app)',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.5,
                        }}>
                          <strong>💡 Quick Tips to Record a 60s Intro Video:</strong>
                          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                            <li>Introduce your name, degree/college, and subjects you teach.</li>
                            <li>Highlight your teaching methodology (practical tricks, concept building, regular tests).</li>
                            <li>Keep lighting clear, camera at eye level, and speak confidently for 60–90 seconds.</li>
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
                          id="field-idNumber"
                          type="text"
                          required
                          maxLength={idType === 'AADHAAR_MASKED' ? 14 : idType === 'PAN' ? 10 : 16}
                          placeholder={idType === 'AADHAAR_MASKED' ? '5234 2389 4823' : idType === 'PAN' ? 'ABCDE1234F' : 'DL-1420110012345'}
                          value={idNumber}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (wizardErrorField === 'field-idNumber') setWizardErrorField(null);
                            if (idType === 'AADHAAR_MASKED') {
                              const rawDigits = val.replace(/\D/g, '').slice(0, 12);
                              const formatted = rawDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
                              setIdNumber(formatted);
                            } else if (idType === 'PAN') {
                              const cleanPan = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                              setIdNumber(cleanPan);
                            } else {
                              const cleanDl = val.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase().slice(0, 16);
                              setIdNumber(cleanDl);
                            }
                          }}
                          className="form-control"
                          style={{
                            letterSpacing: '0.12rem',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            borderRadius: '10px',
                            borderColor: wizardErrorField === 'field-idNumber' ? '#EF4444' : undefined,
                            boxShadow: wizardErrorField === 'field-idNumber' ? '0 0 0 3.5px rgba(239, 68, 68, 0.22)' : undefined,
                          }}
                        />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          {idType === 'AADHAAR_MASKED' ? 'Must be 12 numerical digits.' : idType === 'PAN' ? 'Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).' : 'Enter your registered license number.'}
                        </span>
                      </div>

                      {/* Mandatory Document Photo Upload */}
                      <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>
                            Upload Government ID Document Photo <span style={{ color: '#DC2626' }}>*</span>
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

                        <div
                          id="field-idDoc"
                          tabIndex={0}
                          style={{
                            padding: '1.4rem',
                            borderRadius: '14px',
                            border: idDocFileName
                              ? '2px solid #059669'
                              : (wizardErrorField === 'field-idDoc' ? '2.5px solid #EF4444' : '2px dashed #DC2626'),
                            backgroundColor: idDocFileName
                              ? '#F0FDF4'
                              : (wizardErrorField === 'field-idDoc' ? '#FEF2F2' : '#FEF2F2'),
                            boxShadow: wizardErrorField === 'field-idDoc'
                              ? '0 0 0 4px rgba(239, 68, 68, 0.22)'
                              : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '0.6rem',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
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

                  {/* STEP 7: Privacy & Service Agreement */}
                  {currentStep === 7 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#0F6E56', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.25rem 0.65rem', borderRadius: '999px', marginBottom: '0.5rem' }}>
                          <span>STEP 7 OF 7</span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem', letterSpacing: '-0.3px' }}>
                          Step 7: Privacy &amp; Service Agreement
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                          Review and accept our terms to complete your application.
                        </p>
                      </div>

                      {/* Clean Terms Card with View Details button */}
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                          By completing registration, you confirm your acceptance of the <strong>TuitionForHome (SSSAM Academy)</strong> service guidelines, 1st-month matching commission, interview verification, and document data protection policies.
                        </p>
                        <div>
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0F6E56',
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <FileText size={15} />
                            <span>Read Full Terms &amp; Policies (View Details)</span>
                          </button>
                        </div>
                      </div>

                      {/* Single Mandatory Agreement Checkbox */}
                      <label style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '1.1rem 1.25rem',
                        borderRadius: '14px',
                        backgroundColor: agreeTerms ? '#F0FDF4' : '#FFFFFF',
                        border: agreeTerms ? '1.5px solid #86EFAC' : '1.5px solid #CBD5E1',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      }}>
                        <input
                          type="checkbox"
                          id="agree-terms-main-check"
                          checked={agreeTerms}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setAgreeTerms(val);
                            setAgreeCommission(val);
                            setAgreeVerification(val);
                            setAgreePrivacy(val);
                            setConsentMarketing(val);
                          }}
                          style={{ marginTop: '3px', width: '20px', height: '20px', accentColor: '#0F6E56', cursor: 'pointer', flexShrink: 0 }}
                        />
                        <div style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.5 }}>
                          I agree to TuitionForHome &amp; SSSAM Academy&apos;s terms of service, full 1st-month commission allocation, mandatory interview verification, profile &amp; social media promotion rights, and encrypted document safety regulations.
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Wizard navigation buttons */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginTop: '2.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border-hairline)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.65rem',
                      width: '100%',
                    }}>
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(currentStep - 1);
                            setTimeout(() => {
                              const el = document.getElementById('wizard-form-top');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }, 60);
                          }}
                          className="btn btn-secondary"
                          style={{
                            padding: '0.75rem 1rem',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            borderRadius: '10px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowLeft size={16} />
                          <span>Back</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="btn btn-secondary"
                          style={{
                            color: '#B91C1C',
                            borderColor: '#FCA5A5',
                            padding: '0.75rem 1rem',
                            fontSize: '0.86rem',
                            fontWeight: 700,
                            borderRadius: '10px',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          Logout / Exit
                        </button>
                      )}

                      {currentStep < totalSteps ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (currentStep === 1) {
                              if (isGoogleUser && (!wizardPhone || wizardPhone.replace(/\D/g, '').length !== 10)) {
                                triggerWizardError('field-wizardPhone', '⚠️ Please enter a valid 10-digit mobile number.');
                                return;
                              }
                              if (!gender) {
                                triggerWizardError('field-gender', '⚠️ Please select your gender.');
                                return;
                              }
                              if (!degree.trim()) {
                                triggerWizardError('field-degree', '⚠️ Highest Qualification / Degree is mandatory (e.g. B.Tech, M.Sc, B.Ed).');
                                return;
                              }
                              if (!passingYear.trim()) {
                                triggerWizardError('field-passingYear', '⚠️ Passing Year / Status is mandatory (e.g. 2024 or Final Year).');
                                return;
                              }
                              if (/^\d+$/.test(passingYear.trim())) {
                                const yr = parseInt(passingYear.trim(), 10);
                                const currentYr = new Date().getFullYear();
                                if (passingYear.trim().length !== 4 || yr < 1970 || yr > currentYr + 6) {
                                  triggerWizardError('field-passingYear', `⚠️ Please enter a valid 4-digit passing year between 1970 and ${currentYr + 6} (e.g. 2024).`);
                                  return;
                                }
                              }
                              if (experienceYears === '' || experienceYears === undefined || (typeof experienceYears === 'number' && (isNaN(experienceYears) || experienceYears < 0))) {
                                triggerWizardError('field-experienceYears', '⚠️ Total Teaching Experience (Years) is mandatory.');
                                return;
                              }
                              if (!degreeDocUrl && !degreeDocFileName) {
                                triggerWizardError('field-degreeDoc', '⚠️ Highest Qualification Degree / Marksheet Document is MANDATORY. Please upload your degree certificate or marksheet.');
                                return;
                              }
                            }
                            if (currentStep === 2) {
                              if (selectedSubjects.length === 0) {
                                triggerWizardError('field-subjects', '⚠️ Please select at least one Subject you teach.');
                                return;
                              }
                            }
                            if (currentStep === 3) {
                              if (locationPrefType === 'SECTORS' && serviceAreas.length === 0) {
                                triggerWizardError('field-serviceAreas', '⚠️ Preferred Gurgaon Sectors are MANDATORY! Please select at least one sector you can visit.');
                                return;
                              }
                              if (locationPrefType === 'RADIUS' && (!tutorLatitude || !tutorFormattedAddress)) {
                                triggerWizardError('field-baseLocation', '⚠️ Home/Base Location is MANDATORY! Please tap on the map to set your location.');
                                return;
                              }
                              if (locationPrefType === 'BOTH') {
                                if (serviceAreas.length === 0) {
                                  triggerWizardError('field-serviceAreas', '⚠️ Preferred Gurgaon Sectors are MANDATORY! Please select at least one sector.');
                                  return;
                                }
                                if ((teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME') && (!tutorLatitude || !tutorFormattedAddress)) {
                                  triggerWizardError('field-baseLocation', '⚠️ Home/Base Location is MANDATORY! Please tap on the map to set your base location.');
                                  return;
                                }
                              }
                            }
                            if (currentStep === 5) {
                              if (!profilePhotoUrl && !profilePhotoName) {
                                triggerWizardError('field-profilePhoto', '⚠️ Profile Photo is MANDATORY. Please upload a clear photo.');
                                return;
                              }
                            }
                            if (currentStep === 6) {
                              if (!idNumber.trim()) {
                                triggerWizardError('field-idNumber', `⚠️ ${idType === 'AADHAAR' ? 'Aadhaar Number' : 'PAN Card Number'} is MANDATORY!`);
                                return;
                              }
                              const cleanId = idNumber.trim().toUpperCase();
                              if (idType === 'AADHAAR') {
                                const digitsOnly = cleanId.replace(/\D/g, '');
                                if (digitsOnly.length !== 12) {
                                  triggerWizardError('field-idNumber', '⚠️ Please enter a valid 12-digit Aadhaar number.');
                                  return;
                                }
                              } else if (idType === 'PAN') {
                                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                                if (!panRegex.test(cleanId)) {
                                  triggerWizardError('field-idNumber', '⚠️ Please enter a valid 10-character PAN (format: 5 letters, 4 digits, 1 letter, e.g. ABCDE1234F).');
                                  return;
                                }
                              }
                              if (!idDocUrl && !idDocFileName) {
                                triggerWizardError('field-idDoc', '⚠️ ID Document Proof is MANDATORY! Please upload your ID document photo/PDF before proceeding.');
                                return;
                              }
                            }

                            setErrorMessage('');
                            setWizardErrorField(null);
                            setCurrentStep(currentStep + 1);
                            setTimeout(() => {
                              const el = document.getElementById('wizard-form-top');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              } else {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }, 60);
                          }}
                          className="btn btn-primary"
                          style={{
                            padding: '0.75rem 1.25rem',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            borderRadius: '10px',
                            whiteSpace: 'nowrap',
                            backgroundColor: 'var(--brand-teal)',
                          }}
                        >
                          <span>Next Step</span>
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinalSubmit}
                          disabled={loading || !agreeTerms}
                          className="btn btn-primary"
                          style={{
                            backgroundColor: agreeTerms ? 'var(--brand-teal)' : '#94A3B8',
                            cursor: agreeTerms ? 'pointer' : 'not-allowed',
                            padding: '0.75rem 1.1rem',
                            fontSize: '0.86rem',
                            fontWeight: 800,
                            borderRadius: '10px',
                            boxShadow: agreeTerms ? '0 8px 24px rgba(15, 110, 86, 0.28)' : 'none',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            minWidth: 0,
                          }}
                        >
                          <Sparkles size={16} />
                          <span>{loading ? 'Completing...' : 'Complete Registration'}</span>
                        </button>
                      )}
                    </div>

                    {currentStep === 7 && (
                      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4 }}>
                        By completing registration, you confirm that the information you have provided is accurate and that you have accepted the required terms above.
                      </div>
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
              <div className="apple-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#0F6E56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem auto',
                  boxShadow: '0 8px 24px rgba(15, 110, 86, 0.15)',
                }}>
                  <CheckCircle2 size={42} />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
                  Application Submitted Successfully! 🎉
                </h2>

                <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto 1.75rem auto' }}>
                  Welcome aboard, <strong>{userName}</strong>! Your tutor profile has been registered on <strong>TuitionForHome</strong>. Your application status is currently: <span style={{ color: '#0F6E56', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Pending Interview Verification</span>.
                </p>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  maxWidth: '560px',
                  margin: '0 auto 1.75rem auto',
                  textAlign: 'left',
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={18} color="#0F6E56" />
                    <span>WHAT HAPPENS NEXT?</span>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.84rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.55rem', lineHeight: 1.5 }}>
                    <li>Our administrative auditors at <strong>SSSAM Academy (Sector 14, Gurugram)</strong> will review your qualifications and intro video.</li>
                    <li>You will receive a call within 24 hours to schedule your online video interview or physical walk-in evaluation.</li>
                    <li>Once approved, your tutor profile will be set to <strong>Active &amp; Verified</strong>, and you will start receiving matched parent leads!</li>
                  </ul>
                </div>

                {/* SSSAM Academy Helpline Card */}
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '12px',
                  padding: '1rem',
                  maxWidth: '560px',
                  margin: '0 auto 2rem auto',
                  fontSize: '0.84rem',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} color="#166534" />
                    <span><strong>Helpline Support:</strong> +91 92170 31899</span>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#15803D', fontWeight: 600 }}>Mon–Sun: 9 AM – 9 PM</span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a href="/tutor/profile" className="btn btn-primary" style={{ backgroundColor: 'var(--brand-teal)' }}>
                    <span>Go to Profile Dashboard</span>
                    <ArrowRight size={14} />
                  </a>
                  <a href="/" className="btn btn-secondary">
                    <span>Back to Home</span>
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
         TERMS AND CONDITIONS MODAL POPUP (TABBED TRANSPARENT LEGAL VIEWER)
         ========================================================================= */}
      {showTermsModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1.25rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowTermsModal(false); }}
        >
          <div className="apple-card" style={{
            backgroundColor: '#FFFFFF',
            maxWidth: '740px',
            width: '100%',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
            borderRadius: '20px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.22)',
            border: '1px solid #E2E8F0',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TuitionForHome • Operated by SSSAM Academy
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                  Tutor Service Agreement &amp; Policies
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowTermsModal(false)}
                aria-label="Close modal"
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.45rem', cursor: 'pointer', display: 'flex', color: '#64748B', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Single Clean Scrollable Document) */}
            <div style={{
              padding: '1.75rem',
              overflowY: 'auto',
              fontSize: '0.84rem',
              color: '#334155',
              lineHeight: '1.65',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.35rem',
            }}>
              {/* SECTION 1 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  1. Identity Data Privacy &amp; Encryption Protocols
                </h4>
                <p style={{ margin: 0 }}>
                  TuitionForHome, operated and supervised by SSSAM Academy, Sector 14 Gurugram, adheres to the Digital Personal Data Protection (DPDP) Act of India. Tutors uploading credentials and identification documents (including Aadhaar Card, PAN Card, and Driving License) hereby consent that all such government ID records will be stored in an encrypted format. The documentation remains confidential and is restricted to the internal administrative audit desk. Unmasked document files are never shared with parents or displayed publicly.
                </p>
              </div>

              {/* SECTION 2 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  2. Platform Service Standards &amp; Booking Integrity
                </h4>
                <p style={{ marginBottom: '0.5rem' }}>
                  TuitionForHome provides matched student opportunities, scheduling coordination, and administrative mediation for qualified educators in Gurugram. All introduced sessions, scheduling confirmations, and billing must be logged through the official platform channels to guarantee documented dispute resolution, verified rating accreditation, and transparent parent management. Tutors agree to maintain high professional standards, regular punctuality, student safety precautions during home visits, and adherence to the student&apos;s curriculum (CBSE, ICSE, IB, IGCSE, State Board).
                </p>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.55 }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>📢 Profile &amp; Social Media Promotion Rights:</strong>
                  Tutors grant TuitionForHome and SSSAM Academy the non-exclusive right to showcase and promote their verified tutor badge, introduction video, academic credentials, and teaching achievements across official websites, search engines, and social media channels (YouTube, Instagram, Facebook, LinkedIn) to generate direct student inquiries and tutoring leads.
                </div>
              </div>

              {/* SECTION 3 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  3. Commission Fee Retention Structure (100% First Month Fee)
                </h4>
                <p style={{ marginBottom: '0.65rem' }}>
                  For every finalized student assignment, TuitionForHome charges a matching and counseling management commission equivalent to <strong>100% of the tuition fees generated during the first calendar month</strong> (or first 30 days of active tuition).
                </p>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.55 }}>
                  <strong style={{ color: '#0F172A', display: 'block', marginBottom: '2px' }}>• Regular Disbursements from Month 2:</strong>
                  The client (parent/student) is instructed to deposit the first month&apos;s fees directly with TuitionForHome. Starting from Month 2 and all subsequent months, tutors receive their full scheduled tuition payments directly or via the platform per the agreed rates. If a student discontinues before 30 days, pro-rata protection or priority lead reassignment is promptly provided.
                </div>
              </div>

              {/* SECTION 4 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  4. Mandatory Interview Screening &amp; Profile Activation
                </h4>
                <p style={{ margin: 0 }}>
                  Initial online registration does not constitute instant profile activation. Tutors must successfully pass a telephonic screening followed by a brief 10-minute online video call interview or physical walk-in evaluation at SSSAM Academy (Sector 14, Gurugram). Profile badges (Verified Tutor, Star Mentor) and priority lead alerts activate immediately after verification.
                </p>
              </div>

              {/* SECTION 5 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  5. Registration Fee &amp; Promotional Waiver Policy
                </h4>
                <p style={{ margin: 0 }}>
                  The standard tutor onboarding and verification fee of ₹999 is currently <strong>100% waived under our promotional drive (₹0)</strong>. Any applicable fee in the future will be clearly disclosed before payment is requested.
                </p>
              </div>

              {/* SECTION 6 */}
              <div>
                <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.45rem', color: '#0F172A' }}>
                  6. Grievance Redressal, Center Walk-In &amp; Support
                </h4>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.8rem', color: '#475569', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div><strong>🏢 Physical Center:</strong> SSSAM Academy, M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001 (Near HUDA Market).</div>
                  <div><strong>📞 Helpline / WhatsApp:</strong> +91 92170 31899</div>
                  <div><strong>✉️ Support Email:</strong> support@tuitionforhome.com / info@tuitionforhome.com</div>
                  <div><strong>⏰ Office Timings:</strong> Monday to Sunday, 9:00 AM – 9:00 PM</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.1rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                TuitionForHome • Sector 14, Gurugram
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ borderRadius: '8px' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAgreeTerms(true);
                    setAgreeCommission(true);
                    setAgreeVerification(true);
                    setAgreePrivacy(true);
                    setConsentMarketing(true);
                    setShowTermsModal(false);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ backgroundColor: 'var(--brand-teal)', borderRadius: '8px', fontWeight: 700 }}
                >
                  <span>I Understand &amp; Accept</span>
                </button>
              </div>
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
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 80px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column', border: '1px solid #E2E8F0' }}>
            {/* Modal Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>📍 Set Your Home Location</h3>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>Search sector, drag pin, or tap on map</p>
              </div>
              <button
                type="button"
                onClick={() => setShowTutorLocationPicker(false)}
                aria-label="Close"
                style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.45rem', cursor: 'pointer', display: 'flex', transition: 'background 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {/* Sector Search Box with Dropdown */}
            <div style={{ padding: '0.75rem 1.25rem 0.5rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search Gurgaon sector, colony, or landmark..."
                  value={tutorModalSearch}
                  onChange={(e) => {
                    const q = e.target.value;
                    setTutorModalSearch(q);
                    if (q.trim().length >= 2) {
                      const lower = q.toLowerCase();
                      const matches = GURGAON_LOCALITIES.filter(
                        loc => loc.name.toLowerCase().includes(lower) || loc.landmark.toLowerCase().includes(lower)
                      ).slice(0, 5).map(loc => ({
                        name: loc.name,
                        landmark: loc.landmark,
                        lat: loc.lat ?? 28.4595,
                        lng: loc.lng ?? 77.0266,
                      }));
                      setTutorModalSearchResults(matches);
                    } else {
                      setTutorModalSearchResults([]);
                    }
                  }}
                  className="form-control"
                  style={{
                    paddingLeft: '1rem',
                    paddingRight: tutorModalSearch ? '2rem' : '1rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {tutorModalSearch && (
                  <button
                    type="button"
                    onClick={() => { setTutorModalSearch(''); setTutorModalSearchResults([]); }}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {tutorModalSearchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  border: '1.5px solid #E2E8F0',
                  zIndex: 2000,
                  maxHeight: '180px',
                  overflowY: 'auto',
                  marginTop: '4px',
                }}>
                  {tutorModalSearchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={async () => {
                        setTutorLatitude(res.lat);
                        setTutorLongitude(res.lng);
                        if (tutorPickerMap && tutorPickerMarkerRef.current) {
                          tutorPickerMap.setView([res.lat, res.lng], 17);
                          tutorPickerMarkerRef.current.setLatLng([res.lat, res.lng]);
                          setTimeout(() => { if (tutorPickerMap) tutorPickerMap.invalidateSize(); }, 60);
                        }
                        setIsTutorReverseGeocoding(true);
                        setTutorModalSearch('');
                        setTutorModalSearchResults([]);
                        const addr = await tutorReverseGeocode(res.lat, res.lng);
                        setTutorFormattedAddress(addr || res.name);
                        setIsTutorReverseGeocoding(false);
                      }}
                      style={{
                        padding: '0.6rem 0.9rem',
                        borderBottom: i < tutorModalSearchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <MapPin size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{res.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{res.landmark}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Map Container with Floating Animated GPS Radar Pill */}
            <div style={{ position: 'relative', width: '100%', height: '280px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
              <div ref={tutorPickerMapRef} style={{ height: '100%', width: '100%', position: 'relative', zIndex: 1 }} />

              <style>{`
                @keyframes tutorGpsFloatingPulse {
                  0% {
                    box-shadow: 0 0 0 0 rgba(15, 110, 86, 0.65), 0 4px 14px rgba(15, 110, 86, 0.35);
                    transform: scale(1);
                  }
                  50% {
                    box-shadow: 0 0 0 8px rgba(15, 110, 86, 0), 0 6px 20px rgba(15, 110, 86, 0.45);
                    transform: scale(1.05);
                  }
                  100% {
                    box-shadow: 0 0 0 0 rgba(15, 110, 86, 0), 0 4px 14px rgba(15, 110, 86, 0.35);
                    transform: scale(1);
                  }
                }
              `}</style>

              {/* Sleek Floating Animated GPS Button right on map */}
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
                        tutorPickerMap.setView([lat, lng], 17);
                        tutorPickerMarkerRef.current.setLatLng([lat, lng]);
                        setTimeout(() => { if (tutorPickerMap) tutorPickerMap.invalidateSize(); }, 60);
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
                title="Detect My Location"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  zIndex: 1000,
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: isDetectingTutorGPS 
                    ? '#94A3B8' 
                    : 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: isDetectingTutorGPS ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  animation: isDetectingTutorGPS ? 'none' : 'tutorGpsFloatingPulse 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <MapPin size={14} color="#FFFFFF" style={{ flexShrink: 0 }} />
                <span>{isDetectingTutorGPS ? 'Locating...' : '📍 My Location'}</span>
              </button>
            </div>

            {/* Address Details & Confirm Action */}
            <div style={{ padding: '1.15rem 1.25rem' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '0.75rem 0.95rem', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>DETECTED ADDRESS</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {isTutorReverseGeocoding ? (
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>Detecting address...</span>
                  ) : (
                    <>
                      {tutorFormattedAddress && <CheckCircle2 size={14} color="#059669" />}
                      <span>{tutorFormattedAddress || 'Tap on the map or search to select'}</span>
                    </>
                  )}
                </div>
                {tutorLatitude && tutorLongitude && (
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.2rem' }}>{tutorLatitude.toFixed(5)}, {tutorLongitude.toFixed(5)}</div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowTutorLocationPicker(false)}
                disabled={!tutorLatitude || isTutorReverseGeocoding}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: tutorLatitude ? 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)' : '#CBD5E1',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: tutorLatitude ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: tutorLatitude ? '0 4px 16px rgba(15,110,86,0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <CheckCircle2 size={16} />
                <span>Confirm Location</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
