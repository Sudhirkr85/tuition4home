'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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
  Navigation,
  Trash2,
  Calendar,
  Award,
  Download,
  Search,
  Star,
  Copy,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { reverseGeocodeUnified } from '@/lib/maps';

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
  const [activeTab, setActiveTab] = useState<'STATUS' | 'SUBJECTS' | 'LOCATIONS' | 'EXPERIENCE' | 'KYC_SECURITY' | 'REVIEWS'>('STATUS');
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
  const [gender, setGender] = useState<string>('FEMALE');
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
  const [formattedAddress, setFormattedAddress] = useState('Sector 14, Gurgaon');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [detectingGps, setDetectingGps] = useState(false);

  // Interactive Map Picker Modal States & Refs
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapTempCoords, setMapTempCoords] = useState<{ lat: number; lng: number }>({ lat: 28.4595, lng: 77.0266 });
  const [mapTempAddress, setMapTempAddress] = useState('');
  const [isMapGeocoding, setIsMapGeocoding] = useState(false);
  const [L, setL] = useState<any>(null);

  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markerInstanceRef = React.useRef<any>(null);
  const circleInstanceRef = React.useRef<any>(null);

  // Dynamically load Leaflet library on browser mount
  useEffect(() => {
    import('leaflet').then((mod) => {
      setL(mod.default);
    }).catch(() => {});
  }, []);

  // Initialize interactive Leaflet Map in Modal
  useEffect(() => {
    if (!showMapModal || !L || !mapContainerRef.current) return;

    const centerLat = latitude || mapTempCoords.lat || 28.4595;
    const centerLng = longitude || mapTempCoords.lng || 77.0266;
    setMapTempCoords({ lat: centerLat, lng: centerLng });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'custom-map-picker-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #0D9488; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(13,148,136,0.4); cursor: grab;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
            <div style="width: 3px; height: 12px; background: #0D9488; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [38, 50],
        iconAnchor: [19, 50],
      });

      const marker = L.marker([centerLat, centerLng], { icon: markerIcon, draggable: true }).addTo(map);
      markerInstanceRef.current = marker;

      const circle = L.circle([centerLat, centerLng], {
        radius: (travelRadiusKm || 5) * 1000,
        color: '#0D9488',
        fillColor: '#0D9488',
        fillOpacity: 0.14,
        weight: 2,
        dashArray: '5, 8',
      }).addTo(map);
      circleInstanceRef.current = circle;

      reverseGeocodeUnified(centerLat, centerLng).then(addr => {
        setMapTempAddress(addr);
      });

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setMapTempCoords({ lat: pos.lat, lng: pos.lng });
        if (circleInstanceRef.current) circleInstanceRef.current.setLatLng(pos);
        setIsMapGeocoding(true);
        const addr = await reverseGeocodeUnified(pos.lat, pos.lng);
        setMapTempAddress(addr);
        setIsMapGeocoding(false);
      });

      map.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        if (circleInstanceRef.current) circleInstanceRef.current.setLatLng([lat, lng]);
        setMapTempCoords({ lat, lng });
        setIsMapGeocoding(true);
        const addr = await reverseGeocodeUnified(lat, lng);
        setMapTempAddress(addr);
        setIsMapGeocoding(false);
      });

      mapInstanceRef.current = map;
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 200);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [showMapModal, L]);

  const handleMapSearchLocation = async () => {
    if (!mapSearchQuery.trim()) return;
    setMapSearchLoading(true);
    try {
      const q = encodeURIComponent(`${mapSearchQuery.trim()}, Gurgaon, Haryana, India`);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await res.json();
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapTempCoords({ lat, lng });
        setMapTempAddress(data[0].display_name);

        if (mapInstanceRef.current && markerInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lng], 15);
          markerInstanceRef.current.setLatLng([lat, lng]);
          if (circleInstanceRef.current) circleInstanceRef.current.setLatLng([lat, lng]);
        }
      } else {
        setErrorMsg('Location not found. Try searching by sector number.');
      }
    } catch {
      setErrorMsg('Search failed. Please try clicking directly on the map.');
    } finally {
      setMapSearchLoading(false);
    }
  };

  // KYC & Uploads
  const [idType, setIdType] = useState('AADHAAR');
  const [idNumber, setIdNumber] = useState('');
  const [idLast4, setIdLast4] = useState('');
  const [idDocUrl, setIdDocUrl] = useState('');
  const [idDocUploading, setIdDocUploading] = useState(false);
  const [degreeDocUrl, setDegreeDocUrl] = useState('');
  const [degreeDocUploading, setDegreeDocUploading] = useState(false);
  const [introVideoUrl, setIntroVideoUrl] = useState('');
  const [idStatus, setIdStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [idRejectionNote, setIdRejectionNote] = useState('');
  const { data: authSession, status: authStatus } = useSession();
  const [degreeStatus, setDegreeStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [degreeRejectionNote, setDegreeRejectionNote] = useState('');
  const [isPublicVisibility, setIsPublicVisibility] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [docPreviewModalUrl, setDocPreviewModalUrl] = useState<string | null>(null);

  // Load session and fetch database profile details
  useEffect(() => {
    if (authStatus === 'loading') {
      return;
    }

    const savedUser = localStorage.getItem('tutor_session');
    let effectiveUserId = '';

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('tutor_session');
          window.location.href = '/tutor/register';
          return;
        }
        effectiveUserId = parsed.userId;
        setUserId(parsed.userId);
        setUserName(parsed.name);
        setUserEmail(parsed.email);
        if (parsed.avatarUrl || parsed.image) {
          setAvatarUrl(parsed.avatarUrl || parsed.image);
        }
      } catch {}
    } else if (authStatus === 'authenticated' && authSession?.user?.email) {
      const email = authSession.user.email;
      const name = authSession.user.name || 'Educator';
      const id = (authSession.user as any).id || `GGL-${email.split('@')[0]}`;
      const image = authSession.user.image || '';

      const sessionObj = {
        userId: id,
        name: name,
        email: email,
        image: image,
        avatarUrl: image,
        loginAt: Date.now(),
        expiresAt: Date.now() + 60 * 24 * 60 * 60 * 1000,
      };

      try {
        localStorage.setItem('tutor_session', JSON.stringify(sessionObj));
        window.dispatchEvent(new Event('storage'));
      } catch {}

      effectiveUserId = id;
      setUserId(id);
      setUserName(name);
      setUserEmail(email);
      setAvatarUrl(image);
    } else if (authStatus === 'unauthenticated' && !savedUser) {
      window.location.href = '/tutor/register';
      return;
    }

    if (!effectiveUserId) return;

    // Fetch live profile details
    fetch(`/api/tutors/profile/setup?userId=${encodeURIComponent(effectiveUserId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          const prof = data.profile;
          setProfileStatus(prof.status);
          setIsVerified(prof.isVerified);
          setHasPoliceCheck(prof.hasPoliceCheck || false);
          setRating(prof.rating || 5.0);
          setAvatarUrl(prof.avatarUrl || '');
          if (prof.avatarUrl) {
            try {
              const session = JSON.parse(localStorage.getItem('tutor_session') || '{}');
              session.avatarUrl = prof.avatarUrl;
              session.image = prof.avatarUrl;
              localStorage.setItem('tutor_session', JSON.stringify(session));
              window.dispatchEvent(new Event('storage'));
            } catch {}
          }
          if (prof.isAvailable !== undefined) setIsAvailable(Boolean(prof.isAvailable));
          setBio(prof.bio || '');
          setGender(prof.gender || 'FEMALE');
          setHighestDegree(prof.highestDegree || '');
          setExperienceYears(prof.experienceYears || 0);
          setTeachingMode(prof.teachingMode || 'BOTH');
          
          if (prof.qualifications && prof.qualifications.length > 0) {
            setQualifications(prof.qualifications);
          } else if (prof.highestDegree) {
            setQualifications([{
              id: '1',
              degree: prof.highestDegree,
              institute: '',
              year: '',
              grade: ''
            }]);
          } else {
            setQualifications([]);
          }

          if (prof.experiences && prof.experiences.length > 0) {
            setExperiences(prof.experiences);
          } else {
            setExperiences([]);
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
          if (prof.formattedAddress) setFormattedAddress(prof.formattedAddress);
          if (prof.latitude) setLatitude(prof.latitude);
          if (prof.longitude) setLongitude(prof.longitude);

          if (prof.kycDoc) {
            setIdType(prof.kycDoc.idType || 'AADHAAR');
            setIdLast4(prof.kycDoc.idLast4 || '');
            setIdDocUrl(prof.kycDoc.idDocUrl || '');
            setIdStatus(prof.kycDoc.idStatus || 'PENDING');
            setIdRejectionNote(prof.kycDoc.idRejectionNote || '');
            setDegreeDocUrl(prof.kycDoc.degreeDocUrl || '');
            setDegreeStatus(prof.kycDoc.degreeStatus || 'PENDING');
            setDegreeRejectionNote(prof.kycDoc.degreeRejectionNote || '');
          }
          setIntroVideoUrl(prof.introVideoUrl || '');

          // Set the official hosted review & profile link for this tutor
          const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tuitionforhome.com';
          setReviewLink(`${origin}/tutor/review/${effectiveUserId}`);

          // Fetch reviews for this tutor
          fetch(`/api/tutors/reviews?userId=${encodeURIComponent(effectiveUserId)}`)
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
  }, [authStatus, authSession]);

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
          try {
            const session = JSON.parse(localStorage.getItem('tutor_session') || '{}');
            session.avatarUrl = base64Data;
            session.image = base64Data;
            localStorage.setItem('tutor_session', JSON.stringify(session));
            window.dispatchEvent(new Event('storage'));
          } catch {}
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

  // Save profile updates to the database after confirmation in Preview modal
  const handleActualSaveProfile = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    setSaveLoading(true);

    const activeUserId = userId || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('tutor_session') || '{}')?.userId);
    if (!activeUserId) {
      setErrorMsg('⚠️ Session expired. Please log in again to save changes.');
      setSaveLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tutors/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          gender,
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
          formattedAddress,
          latitude,
          longitude,
          hourlyRateHomeMin,
          hourlyRateHomeMax,
          hourlyRateOnlineMin,
          hourlyRateOnlineMax,
          bio,
          isAvailable,
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('🎉 Success! Your professional profile changes have been saved successfully.');
        setErrorMsg('');
        setShowPreviewModal(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.error || '⚠️ Failed to save profile changes. Please try again.');
      }
    } catch (e: any) {
      console.error('[PROFILE_SAVE_ERROR]:', e);
      setErrorMsg('⚠️ Connection issue. Please check your internet connection and try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setShowPreviewModal(true);
  };

  // Direct 1-Click High Resolution Image Card Download (Always Standard Desktop Layout on Phone/Tablet/PC)
  const handleDirectDownloadCard = async () => {
    const cardElement = document.getElementById('tutor-digital-visiting-card');
    if (!cardElement) return;

    try {
      setSuccessMsg('Generating your official HD desktop-standard visiting card...');
      const html2canvas = (await import('html2canvas')).default;

      // Clone card into fixed 480px desktop viewport to guarantee desktop layout on phones and tablets
      const clone = cardElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '480px';
      clone.style.minWidth = '480px';
      clone.style.maxWidth = '480px';
      clone.style.padding = '1.5rem';
      clone.style.zIndex = '-9999';
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxSizing = 'border-box';

      document.body.appendChild(clone);

      // Brief wait for layout render
      await new Promise((r) => setTimeout(r, 120));

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        width: 480,
        windowWidth: 1280,
        logging: false,
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `TuitionForHome-VisitingCard-${userName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSuccessMsg('🎉 Official visiting card downloaded successfully in HD desktop format!');
    } catch (err) {
      console.error('Error generating card image:', err);
      setErrorMsg('Unable to download card directly. Please try again.');
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

                  {/* User Identity & Status Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minWidth: 0, gap: '0.15rem' }}>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>{userName}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {userEmail}
                    </span>
                    
                    {/* Status Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
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
                    onClick={() => { setActiveTab('SUBJECTS'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'SUBJECTS' ? 'active' : ''}`}
                  >
                    <BookOpen size={18} />
                    <span>Manage Subject Area</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('LOCATIONS'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'LOCATIONS' ? 'active' : ''}`}
                  >
                    <MapPin size={18} />
                    <span>Locations &amp; Radius</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('EXPERIENCE'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'EXPERIENCE' ? 'active' : ''}`}
                  >
                    <GraduationCap size={18} />
                    <span>Qualifications &amp; Bio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('KYC_SECURITY'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'KYC_SECURITY' ? 'active' : ''}`}
                  >
                    <ShieldCheck size={18} />
                    <span>KYC &amp; Security</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveTab('REVIEWS'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`profile-nav-btn ${activeTab === 'REVIEWS' ? 'active' : ''}`}
                  >
                    <Star size={18} />
                    <span>Parent Reviews &amp; QR</span>
                  </button>
                </nav>

                {/* Profile Completeness Meter */}
                {/* Profile Strength Progress Card (Dynamic Real-Time Calculation) */}
                {(() => {
                  let strength = 0;
                  const hasPhoto = Boolean(avatarUrl);
                  const hasSubjects = selectedSubjects.length > 0;
                  const hasBaseLoc = Boolean(formattedAddress);
                  const hasRates = (hourlyRateHomeMin > 0 || hourlyRateOnlineMin > 0);
                  const hasDegree = qualifications.length > 0 || Boolean(degreeDocUrl) || Boolean(highestDegree);
                  const hasIdDoc = Boolean(idDocUrl) || idStatus === 'APPROVED';

                  if (hasPhoto) strength += 15;
                  if (hasSubjects) strength += 20;
                  if (hasBaseLoc) strength += 15;
                  if (hasRates) strength += 15;
                  if (hasDegree) strength += 20;
                  if (hasIdDoc) strength += 15;

                  return (
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
                        <span style={{ fontSize: '0.78rem', fontWeight: 900, color: strength >= 80 ? 'var(--brand-teal)' : strength >= 50 ? '#D97706' : '#EF4444' }}>
                          {strength}%
                        </span>
                      </div>

                      <div style={{ width: '100%', height: '7px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.65rem' }}>
                        <div style={{
                          width: `${strength}%`,
                          height: '100%',
                          backgroundColor: strength >= 80 ? 'var(--brand-teal)' : strength >= 50 ? '#F59E0B' : '#EF4444',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.71rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasPhoto ? '#059669' : '#94A3B8', fontWeight: hasPhoto ? 700 : 500 }}>
                          <span>{hasPhoto ? '✓' : '○'}</span>
                          <span>{hasPhoto ? 'Profile Photo Uploaded' : 'Add Profile Photo (+15%)'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasSubjects ? '#059669' : '#94A3B8', fontWeight: hasSubjects ? 700 : 500 }}>
                          <span>{hasSubjects ? '✓' : '○'}</span>
                          <span>{hasSubjects ? 'Subjects & Grades Set' : 'Select Teaching Subjects (+20%)'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasBaseLoc ? '#059669' : '#94A3B8', fontWeight: hasBaseLoc ? 700 : 500 }}>
                          <span>{hasBaseLoc ? '✓' : '○'}</span>
                          <span>{hasBaseLoc ? 'Base Location Configured' : 'Set Base Location & Radius (+15%)'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasDegree ? '#059669' : '#94A3B8', fontWeight: hasDegree ? 700 : 500 }}>
                          <span>{hasDegree ? '✓' : '○'}</span>
                          <span>{hasDegree ? 'Degrees & Qualifications Added' : 'Add Qualifications & Bio (+20%)'}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: hasIdDoc ? '#059669' : '#94A3B8', fontWeight: hasIdDoc ? 700 : 500 }}>
                          <span>{hasIdDoc ? '✓' : '○'}</span>
                          <span>{hasIdDoc ? 'KYC Verification Uploaded' : 'Upload Govt ID for KYC (+15%)'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

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
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Account Verification &amp; Service Availability</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Track your onboarding audit status and control your tuition service availability.</p>

                  {/* Active / Inactive Service Availability Toggle Card */}
                  <div style={{
                    backgroundColor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#FEF2F2' : isAvailable ? '#ECFDF5' : '#FFFBEB',
                    border: `1.5px solid ${profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#FCA5A5' : isAvailable ? '#A7F3D0' : '#FDE68A'}`,
                    borderRadius: '16px',
                    padding: '1.1rem 1.35rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#EF4444' : isAvailable ? '#10B981' : '#F59E0B',
                          boxShadow: isAvailable && profileStatus === 'ACTIVE_VERIFIED' ? '0 0 8px #10B981' : 'none'
                        }} />
                        <strong style={{ fontSize: '0.95rem', color: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#991B1B' : isAvailable ? '#065F46' : '#92400E', fontWeight: 800 }}>
                          {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                            ? '🔒 ACCOUNT DEACTIVATED BY ADMIN (Contact Admin)'
                            : isAvailable ? '🟢 TUTOR SELF-AVAILABILITY: Accepting Tuition Leads' : '⏸️ TUTOR SELF-PAUSE: Temporarily On Leave'}
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#991B1B' : isAvailable ? '#047857' : '#B45309', display: 'block', lineHeight: 1.4 }}>
                        {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                          ? 'Your account has been administratively deactivated by SSSAM Academy Admin. Contact Admin (support@tuitionforhome.com / +91-9876543210) to request profile reactivation.'
                          : isAvailable 
                            ? 'Your profile is active. You are receiving automated match alerts for home & online tuition leads.' 
                            : 'You have voluntarily paused accepting new tuition leads. You can resume at any time below.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'}
                      onClick={async () => {
                        if (profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED') return;
                        const nextState = !isAvailable;
                        setIsAvailable(nextState);
                        setSuccessMsg(`🎉 Tutor self-availability updated: ${nextState ? 'Accepting Leads' : 'Temporarily Paused'}.`);
                        try {
                          await fetch('/api/tutors/profile/setup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, isAvailable: nextState })
                          });
                        } catch {}
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.6rem 1.15rem',
                        borderRadius: '999px',
                        backgroundColor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#94A3B8' : isAvailable ? '#059669' : '#D97706',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span>
                        {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                          ? '🔒 Locked by Admin'
                          : isAvailable ? '⏸️ Voluntary Pause (Self)' : '▶️ Resume Acceptance (Self)'}
                      </span>
                    </button>
                  </div>

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
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.6rem',
                        borderBottom: '1px solid rgba(255,255,255,0.12)',
                        paddingBottom: '0.85rem',
                        marginBottom: '1rem'
                      }}>
                        {/* Left: Brand Logo Pill */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src="/tuitionforhome.webp" alt="Logo" style={{ height: '18px', width: 'auto' }} />
                          <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em' }}>TuitionForHome</span>
                        </div>

                        {/* Right: ID & SSSAM Verification Badges (Guaranteed No Overlap) */}
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          flexWrap: 'nowrap',
                          flexShrink: 0
                        }}>
                          <span style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            color: '#E2E8F0',
                            letterSpacing: '0.03em',
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.18)',
                            whiteSpace: 'nowrap'
                          }}>
                            ID: TFH-{userId ? userId.slice(0, 6).toUpperCase() : 'GUR01'}
                          </span>

                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            color: '#FCD34D',
                            backgroundColor: 'rgba(0,0,0,0.35)',
                            padding: '0.22rem 0.55rem',
                            borderRadius: '999px',
                            border: '1px solid rgba(252, 211, 77, 0.35)',
                            whiteSpace: 'nowrap'
                          }}>
                            <ShieldCheck size={12} />
                            <span>SSSAM VERIFIED</span>
                          </div>
                        </div>
                      </div>

                      {/* Main Middle Row: Avatar, Name, Degree, QR */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
                        
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
                    <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                      {/* Direct 1-Click Card Download */}
                      <button
                        type="button"
                        onClick={handleDirectDownloadCard}
                        className="btn btn-primary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.78rem',
                          backgroundColor: 'var(--brand-teal)',
                          borderColor: 'var(--brand-teal)',
                          boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                        }}
                      >
                        <Download size={13} />
                        <span>Download Card</span>
                      </button>

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

                  {/* TAB 2: MANAGE SUBJECT AREA */}
              {activeTab === 'SUBJECTS' && (
                <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={24} color="var(--brand-teal)" />
                      <span>Manage Subject Area &amp; Tuition Rates</span>
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Select the subjects, classes/grades, and educational boards you teach, and specify your hourly rates.
                    </p>

                    {/* Dynamic Specialty Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.75rem', textAlign: 'left' }}>
                      {(selectedSubjects || []).some(s => ['Mathematics', 'Maths', 'Math', 'Physics', 'Chemistry', 'Biology', 'Science'].includes(s)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(37,99,235,0.15)', display: 'inline-block' }}>
                          🔬 SCIENCE SPECIALIST
                        </span>
                      )}
                      {(selectedBoards || []).some(b => ['IB', 'IGCSE', 'Cambridge'].includes(b)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(22,163,74,0.15)', display: 'inline-block' }}>
                          📐 PREMIUM BOARD EXPERT (IB/CIE)
                        </span>
                      )}
                      {(selectedClasses || []).some(c => ['Class 11', 'Class 12', 'Grade 11', 'Grade 12'].includes(c)) && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(124,58,237,0.15)', display: 'inline-block' }}>
                          🎓 SENIOR GRADE EXPERT (11-12)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subjects Taught Section */}
                  <div className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <BookOpen size={16} color="var(--brand-teal)" />
                      <span>Subjects Taught</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {(selectedSubjects || []).map(sub => (
                        <span key={sub} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
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

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="Filter subject list..."
                        value={subjectSearch}
                        onChange={(e) => setSubjectSearch(e.target.value)}
                        className="form-control"
                      />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <input
                          type="text"
                          placeholder="Add Custom Subject..."
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          className="form-control"
                          style={{ minWidth: '160px' }}
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

                    <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: '10px', padding: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#F8FAFC' }}>
                      {filteredSubjects.map(sub => {
                        const isSelected = selectedSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSelection(sub, selectedSubjects, setSelectedSubjects)}
                            style={{
                              padding: '0.28rem 0.6rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--brand-teal-light)' : '#FFFFFF',
                              color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {isSelected ? '✓ ' : '+ '} {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Classes & Grades Taught Section */}
                  <div className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>Classes / Grades Taught</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {(selectedClasses || []).map(cls => (
                        <span key={cls} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          <span>{cls}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedClasses(selectedClasses.filter(c => c !== cls))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
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

                    <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '280px' }}>
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

                  {/* Educational Boards Taught Section */}
                  <div className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>Educational Boards Taught</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {(selectedBoards || []).map(b => (
                        <span key={b} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          <span>{b}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedBoards(selectedBoards.filter(x => x !== b))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.6rem' }}>
                      {['CBSE', 'ICSE / ISC', 'IB (International Baccalaureate)', 'IGCSE / Cambridge', 'State Board'].map(b => {
                        const isSelected = selectedBoards.includes(b);
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => toggleSelection(b, selectedBoards, setSelectedBoards)}
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
                            {b}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '280px' }}>
                      <input
                        type="text"
                        placeholder="Add Custom Board..."
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
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Hourly Pricing & Fees Structure */}
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <strong style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                      Hourly Pricing &amp; Fees (₹/Hour)
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                      
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                          <Home size={14} color="var(--brand-teal)" />
                          <span>Home Visit Tuition (₹/hr)</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <input type="number" className="form-control form-control-sm" value={hourlyRateHomeMin} onChange={(e) => setHourlyRateHomeMin(Number(e.target.value))} />
                          <span style={{ alignSelf: 'center', color: 'var(--text-light)' }}>-</span>
                          <input type="number" className="form-control form-control-sm" value={hourlyRateHomeMax} onChange={(e) => setHourlyRateHomeMax(Number(e.target.value))} />
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem' }}>
                          <Video size={14} color="var(--brand-teal)" />
                          <span>Online 1-on-1 Tuition (₹/hr)</span>
                        </label>
                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <input type="number" className="form-control form-control-sm" value={hourlyRateOnlineMin} onChange={(e) => setHourlyRateOnlineMin(Number(e.target.value))} />
                          <span style={{ alignSelf: 'center', color: 'var(--text-light)' }}>-</span>
                          <input type="number" className="form-control form-control-sm" value={hourlyRateOnlineMax} onChange={(e) => setHourlyRateOnlineMax(Number(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
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
                      {saveLoading ? 'Saving changes...' : 'Save Subject Area & Rates'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: LOCATIONS & TRAVEL RADIUS */}
              {activeTab === 'LOCATIONS' && (
                <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={24} color="var(--brand-teal)" />
                      <span>Teaching Locations &amp; Travel Radius</span>
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Configure your base residential location, preferred teaching mode, preferred Gurgaon sectors/localities, and maximum travel radius.
                    </p>
                  </div>



                  {/* Teaching Mode Interactive Checkbox Cards */}
                  <div id="section-mode" className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.95rem' }}>
                      Teaching Mode Preference
                    </label>
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
                          backgroundColor: teachingMode === 'BOTH' || teachingMode === 'OFFLINE_HOME' ? 'var(--brand-teal-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
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
                          backgroundColor: teachingMode === 'BOTH' || teachingMode === 'ONLINE_LIVE' ? 'var(--brand-teal-light)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
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
                            💻 Online 1-on-1 Live
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.35, display: 'block', marginTop: '0.2rem' }}>
                            Teach interactive live sessions online via Zoom / Meet
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Preferred Gurgaon Sectors (Service Areas) */}
                  <div className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                      Preferred Gurgaon Sectors &amp; Localities
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {(serviceAreas || []).map(area => (
                        <span key={area} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          backgroundColor: 'var(--brand-teal-light)',
                          color: 'var(--brand-teal)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}>
                          <span>{area}</span>
                          <button
                            type="button"
                            onClick={() => setServiceAreas(serviceAreas.filter(a => a !== area))}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex' }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
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

                    <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--border-hairline)', borderRadius: '10px', padding: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#F8FAFC' }}>
                      {filteredSectors.map(loc => {
                        const isSelected = serviceAreas.includes(loc.name);
                        return (
                          <button
                            key={loc.slug}
                            type="button"
                            onClick={() => toggleSelection(loc.name, serviceAreas, setServiceAreas)}
                            style={{
                              padding: '0.28rem 0.6rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--brand-teal-light)' : '#FFFFFF',
                              color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                              fontSize: '0.74rem',
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

                  {/* Travel Radius Parameter */}
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      <MapPin size={16} color="var(--brand-teal)" />
                      <span>Maximum Travel Radius (KM from base)</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <input
                        type="range"
                        min={1}
                        max={25}
                        value={travelRadiusKm}
                        onChange={(e) => setTravelRadiusKm(Number(e.target.value))}
                        style={{ flex: 1, accentColor: 'var(--brand-teal)' }}
                      />
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--brand-teal)', minWidth: '60px', textAlign: 'right' }}>
                        {travelRadiusKm} KM
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                      We match you with home tuition inquiries within this travel radius from your base location.
                    </span>

                    {/* Dynamic Match Coverage Summary Box with Inline Location Changer */}
                    <div style={{ marginTop: '1rem', backgroundColor: '#F0FDFA', borderRadius: '14px', padding: '1rem 1.15rem', border: '1.5px solid rgba(13, 148, 136, 0.35)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={16} color="var(--brand-teal)" />
                          <strong style={{ fontSize: '0.86rem', color: 'var(--brand-teal)', fontWeight: 800 }}>
                            Active Match Boundary &amp; Base Location
                          </strong>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setMapTempCoords({ lat: latitude || 28.4595, lng: longitude || 77.0266 });
                              setMapTempAddress(formattedAddress || 'Gurugram, Haryana');
                              setShowMapModal(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{
                              fontSize: '0.74rem',
                              padding: '0.3rem 0.65rem',
                              backgroundColor: 'var(--brand-teal)',
                              color: '#FFFFFF',
                              borderColor: 'var(--brand-teal)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <MapPin size={12} />
                            <span>🗺️ Change Base / Select on Map</span>
                          </button>

                          <button
                            type="button"
                            disabled={detectingGps}
                            onClick={() => {
                              if (!navigator.geolocation) {
                                setErrorMsg('Geolocation is not supported by your browser.');
                                return;
                              }
                              setDetectingGps(true);
                              setErrorMsg('');
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  const lat = pos.coords.latitude;
                                  const lng = pos.coords.longitude;
                                  setLatitude(lat);
                                  setLongitude(lng);
                                  setFormattedAddress(`Sector 14, Gurgaon (GPS: ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`);
                                  setDetectingGps(false);
                                  setSuccessMsg('🎯 Exact GPS location detected & updated!');
                                },
                                () => {
                                  setDetectingGps(false);
                                  setErrorMsg('Could not fetch GPS location. Please type your base locality manually.');
                                }
                              );
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem', color: 'var(--brand-teal)', borderColor: 'var(--brand-teal)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                          >
                            <Navigation size={12} />
                            <span>{detectingGps ? 'Fetching Location...' : '📍 Get Current Location'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Current Base Location Display & Fast Text Input */}
                      <div style={{ marginBottom: '0.65rem' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Current Base:</span>
                          <span style={{ backgroundColor: '#FFFFFF', padding: '0.2rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-hairline)', color: '#0F172A', fontWeight: 800 }}>
                            📍 {formattedAddress || 'Sector 14, Gurgaon'}
                          </span>
                          <span style={{ color: 'var(--text-muted)' }}>• Travel Radius:</span>
                          <span style={{ backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', padding: '0.2rem 0.65rem', borderRadius: '8px', fontWeight: 800 }}>
                            {travelRadiusKm} KM
                          </span>
                        </div>
                      </div>

                      {serviceAreas && serviceAreas.length > 0 && (
                        <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 650 }}>Selected Preferred Sectors:</span>
                          {serviceAreas.map(area => (
                            <span key={area} style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#FFFFFF', color: 'var(--brand-teal)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(13,148,136,0.3)' }}>
                              ✓ {area}
                            </span>
                          ))}
                        </div>
                      )}

                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                        🎯 You will receive automated match alerts for home tuition inquiries within <strong>{travelRadiusKm} KM</strong> of <strong>{formattedAddress || 'Sector 14, Gurgaon'}</strong>.
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
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
                      {saveLoading ? 'Saving changes...' : 'Save Locations & Radius'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 4: QUALIFICATIONS & EXPERIENCE */}
              {activeTab === 'EXPERIENCE' && (
                <form onSubmit={handleSaveChanges} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GraduationCap size={24} color="var(--brand-teal)" />
                      <span>Qualifications, Experience &amp; Bio</span>
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Display your educational background, teaching accomplishments, and personal bio.
                    </p>
                  </div>

                  {/* Profile Photo Tile */}
                  <div id="section-photo" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.15rem 1.35rem',
                    backgroundColor: '#FFFFFF',
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
                        Upload a clear portrait photo to build trust with parents. (PNG, JPG, max 4MB)
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

                  {/* Gender Selector Tile */}
                  <div style={{
                    padding: '1.15rem 1.35rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 750, marginBottom: '0.25rem' }}>
                      Gender / Identity Category
                    </strong>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                      Helps match you with Gurgaon parents requesting Verified Lady Tutors or Home Tutors.
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                      {[
                        { id: 'FEMALE', label: 'Female 👩', desc: 'Lady Educator' },
                        { id: 'MALE', label: 'Male 👨', desc: 'Male Educator' },
                        { id: 'OTHER', label: 'Other 👤', desc: 'Educator' },
                      ].map((g) => {
                        const isSelected = gender === g.id;
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setGender(g.id)}
                            style={{
                              padding: '0.75rem 0.65rem',
                              borderRadius: '12px',
                              border: `2px solid ${isSelected ? 'var(--brand-teal)' : 'var(--border-hairline)'}`,
                              backgroundColor: isSelected ? 'var(--bg-app)' : '#FFFFFF',
                              color: isSelected ? 'var(--brand-teal)' : 'var(--text-main)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '0.2rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{g.label}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Education & Qualifications Section */}
                  <div id="section-education" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)',
                    padding: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={20} color="var(--brand-teal)" />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          Education &amp; Qualifications
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddQual(true)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--brand-teal)', borderColor: 'var(--brand-teal)' }}
                      >
                        <Plus size={14} />
                        <span>Add Qualification</span>
                      </button>
                    </div>

                    {showAddQual && (
                      <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid var(--border-hairline)' }}>
                        <strong style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Add Degree / Certification</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            placeholder="Degree e.g. M.Sc Physics"
                            value={draftQual.degree}
                            onChange={e => setDraftQual({ ...draftQual, degree: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="Institute e.g. Delhi University"
                            value={draftQual.institute}
                            onChange={e => setDraftQual({ ...draftQual, institute: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="Passing Year e.g. 2021"
                            value={draftQual.year}
                            onChange={e => setDraftQual({ ...draftQual, year: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="Grade / Marks e.g. 8.5 CGPA"
                            value={draftQual.grade}
                            onChange={e => setDraftQual({ ...draftQual, grade: e.target.value })}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setShowAddQual(false)} className="btn btn-sm btn-ghost">Cancel</button>
                          <button type="button" onClick={handleAddQualification} className="btn btn-sm btn-primary" style={{ backgroundColor: 'var(--brand-teal)' }}>Save</button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {(qualifications || []).map(q => (
                        <div key={q.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                              🎓
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 800 }}>{q.degree}</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{q.institute} • Pass Year: {q.year}</span>
                              {q.grade && <span style={{ fontSize: '0.72rem', color: 'var(--brand-teal)', fontWeight: 700, display: 'inline-block', marginTop: '0.15rem' }}>Grade: {q.grade}</span>}
                            </div>
                          </div>
                          <button type="button" onClick={() => handleDeleteQualification(q.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {qualifications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1.5px dashed var(--border-hairline)', borderRadius: '12px' }}>
                          No qualifications added. Click <strong>&quot;Add Qualification&quot;</strong> to list your degree background.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Teaching Experience Section */}
                  <div id="section-experience" style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid var(--border-hairline)',
                    padding: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Briefcase size={20} color="var(--brand-teal)" />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                          Teaching Experience History ({experienceYears} Years Total)
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddExp(true)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--brand-teal)', borderColor: 'var(--brand-teal)' }}
                      >
                        <Plus size={14} />
                        <span>Add Experience</span>
                      </button>
                    </div>

                    {showAddExp && (
                      <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1.1rem', marginBottom: '1.25rem', border: '1px solid var(--border-hairline)' }}>
                        <strong style={{ display: 'block', fontSize: '0.84rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>Add School / Coaching Engagement</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <input
                            type="text"
                            placeholder="Role Title e.g. Senior PGT Maths Educator"
                            value={draftExp.role}
                            onChange={e => setDraftExp({ ...draftExp, role: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="School / Academy e.g. DPS Gurgaon / Home Tutoring"
                            value={draftExp.organization}
                            onChange={e => setDraftExp({ ...draftExp, organization: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="Start Year e.g. 2019"
                            value={draftExp.startYear}
                            onChange={e => setDraftExp({ ...draftExp, startYear: e.target.value })}
                            className="form-control form-control-sm"
                          />
                          <input
                            type="text"
                            placeholder="End Year e.g. Present"
                            value={draftExp.endYear}
                            disabled={draftExp.isCurrent}
                            onChange={e => setDraftExp({ ...draftExp, endYear: e.target.value })}
                            className="form-control form-control-sm"
                          />
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={draftExp.isCurrent}
                              onChange={e => setDraftExp({ ...draftExp, isCurrent: e.target.checked })}
                            />
                            <span>Currently teaching here</span>
                          </label>
                        </div>
                        <textarea
                          placeholder="Brief details e.g. Taught Class 10-12 Board students with 100% pass record..."
                          value={draftExp.description}
                          onChange={e => setDraftExp({ ...draftExp, description: e.target.value })}
                          rows={2}
                          className="form-control form-control-sm"
                          style={{ marginBottom: '0.75rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button type="button" onClick={() => setShowAddExp(false)} className="btn btn-sm btn-ghost">Cancel</button>
                          <button type="button" onClick={handleAddExperience} className="btn btn-sm btn-primary" style={{ backgroundColor: 'var(--brand-teal)' }}>Save</button>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      {(experiences || []).map(e => (
                        <div key={e.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                          <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                              💼
                            </div>
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 800 }}>{e.role}</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>{e.organization} • {e.startYear} - {e.isCurrent ? 'Present' : e.endYear}</span>
                              {e.description && <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', display: 'block', marginTop: '0.2rem' }}>{e.description}</span>}
                            </div>
                          </div>
                          <button type="button" onClick={() => handleDeleteExperience(e.id)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}>
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

                  {/* Bio & Teaching Philosophy */}
                  <div className="form-group" style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1.5px solid var(--border-hairline)' }}>
                    <label className="form-label" style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                      Bio &amp; Teaching Philosophy
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Introduce yourself to parents in 3-4 sentences. Mention your teaching approach, board specialization, student success stories, and availability..."
                    />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.35rem' }}>
                      A clear and detailed bio significantly improves parent inquiries and booking confidence.
                    </span>
                  </div>

                  {/* Actions */}
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
                      {saveLoading ? 'Saving changes...' : 'Save Qualifications & Bio'}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: KYC, IDENTITY SECURITY & PUBLIC VISIBILITY SWITCH */}
              {activeTab === 'KYC_SECURITY' && (
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Identity Verification &amp; Service Controls</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Active / Inactive Service Availability Card */}
                    <div style={{
                      backgroundColor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#FEF2F2' : isAvailable ? '#ECFDF5' : '#FFFBEB',
                      border: `1.5px solid ${profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#FCA5A5' : isAvailable ? '#A7F3D0' : '#FDE68A'}`,
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#991B1B' : isAvailable ? '#065F46' : '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          <span>
                            {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                              ? '🔒 ACCOUNT DEACTIVATED BY ADMIN (Contact Admin)'
                              : isAvailable ? '🟢 TUTOR SELF-AVAILABILITY: Accepting Tuition Leads' : '⏸️ TUTOR SELF-PAUSE: Temporarily On Leave'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#991B1B' : isAvailable ? '#047857' : '#B45309' }}>
                          {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                            ? 'Your profile was administratively deactivated by Admin. Contact Admin (support@tuitionforhome.com / +91-9876543210) to reactivate.'
                            : isAvailable ? 'Parents & counselors can match and assign home / online tuition inquiries to you.' : 'You have voluntarily paused accepting new tuition leads.'}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'}
                        onClick={async () => {
                          if (profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED') return;
                          const nextState = !isAvailable;
                          setIsAvailable(nextState);
                          setSuccessMsg(`🎉 Self-availability updated: ${nextState ? 'Accepting Leads' : 'Temporarily Paused'}.`);
                          try {
                            await fetch('/api/tutors/profile/setup', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ userId, isAvailable: nextState })
                            });
                          } catch {}
                        }}
                        style={{
                          padding: '0.55rem 1.1rem',
                          borderRadius: '999px',
                          backgroundColor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? '#94A3B8' : isAvailable ? '#059669' : '#D97706',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED' ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {profileStatus === 'SUSPENDED' || profileStatus === 'DEACTIVATED' || profileStatus === 'REJECTED'
                          ? '🔒 Locked by Admin'
                          : isAvailable ? '⏸️ Voluntary Pause (Self)' : '▶️ Resume Acceptance (Self)'}
                      </button>
                    </div>

                    {/* KYC Document 1: Highest Qualification Degree */}
                    <div style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <GraduationCap size={17} color="var(--brand-teal)" />
                          <span>1. Highest Qualification Degree / Marksheet</span>
                        </div>
                        {degreeStatus === 'APPROVED' ? (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #A7F3D0' }}>
                            🔒 VERIFIED &amp; APPROVED
                          </span>
                        ) : degreeStatus === 'REJECTED' ? (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #FECACA' }}>
                            ❌ REJECTED (RE-UPLOAD REQUIRED)
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#FFFBEB', color: '#D97706', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #FCD34D' }}>
                            ⏳ AUDIT PENDING BY ADMIN
                          </span>
                        )}
                      </div>

                      {degreeStatus === 'REJECTED' && (
                        <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', color: '#991B1B', fontSize: '0.78rem' }}>
                          <strong>❌ Document Rejected by Admin:</strong> {degreeRejectionNote || 'Uploaded degree proof was unreadable or incomplete. Please re-upload a clear copy.'}
                        </div>
                      )}

                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Highest Degree:</span>
                          <strong>{highestDegree || 'Not Specified'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Uploaded Degree Proof:</span>
                          {degreeDocUrl ? (
                            <button
                              type="button"
                              onClick={() => setDocPreviewModalUrl(degreeDocUrl)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--brand-teal)',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                cursor: 'pointer'
                              }}
                            >
                              <span>👁️ View Uploaded Copy</span>
                              <ExternalLink size={12} />
                            </button>
                          ) : (
                            <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.8rem' }}>⚠️ Pending Upload</span>
                          )}
                        </div>

                        {/* Replace / Upload Button for Degree (Enabled if NOT approved) */}
                        {degreeStatus !== 'APPROVED' && (
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-hairline)' }}>
                            <label style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.85rem',
                              backgroundColor: '#FFFFFF',
                              border: '1.5px solid var(--brand-teal)',
                              borderRadius: '8px',
                              cursor: degreeDocUploading ? 'wait' : 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--brand-teal)',
                            }}>
                              <Upload size={14} />
                              <span>{degreeDocUploading ? 'Uploading to Cloudinary...' : degreeDocUrl ? '🔄 Re-upload Degree Document' : '📤 Upload Degree Marksheet (PDF/JPG)'}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                disabled={degreeDocUploading}
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setDegreeDocUploading(true);
                                  setErrorMsg('');
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', file.type.includes('pdf') ? 'raw' : 'image');
                                    formData.append('folder', 'tuitionforhome/kyc');
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const d = await res.json();
                                    if (d.success) {
                                      setDegreeDocUrl(d.url);
                                      setDegreeStatus('PENDING');
                                      setDegreeRejectionNote('');
                                      setSuccessMsg('🎉 Degree document uploaded to Cloudinary! Submitted for admin verification.');
                                    } else {
                                      setErrorMsg(d.error || 'Upload failed');
                                    }
                                  } catch {
                                    setErrorMsg('Network error uploading degree proof.');
                                  } finally {
                                    setDegreeDocUploading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KYC Document 2: Government Identity Proof (Aadhaar OR PAN) */}
                    <div style={{
                      backgroundColor: 'var(--bg-card-subtle)',
                      border: '1.5px solid var(--border-hairline)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.85rem',
                    }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-hairline)', paddingBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <ShieldCheck size={17} color="var(--brand-teal)" />
                          <span>2. Government Identity Proof (Aadhaar / PAN)</span>
                        </div>
                        {idStatus === 'APPROVED' ? (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#ECFDF5', color: '#059669', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #A7F3D0' }}>
                            🔒 VERIFIED &amp; APPROVED
                          </span>
                        ) : idStatus === 'REJECTED' ? (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #FECACA' }}>
                            ❌ REJECTED (RE-UPLOAD REQUIRED)
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', backgroundColor: '#FFFBEB', color: '#D97706', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800, border: '1px solid #FCD34D' }}>
                            ⏳ AUDIT PENDING BY ADMIN
                          </span>
                        )}
                      </div>

                      {idStatus === 'REJECTED' && (
                        <div style={{ padding: '0.65rem 0.85rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '10px', color: '#991B1B', fontSize: '0.78rem' }}>
                          <strong>❌ Document Rejected by Admin:</strong> {idRejectionNote || 'Uploaded ID proof was unreadable or incomplete. Please re-upload a clear copy.'}
                        </div>
                      )}
                      
                      <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Document Type:</span>
                          <strong>{idType === 'AADHAAR_MASKED' || idType === 'AADHAAR' ? 'Aadhaar Card (UIDAI)' : idType === 'PAN' ? 'PAN Card' : idType === 'DRIVING_LICENSE' ? 'Driving License (RTO)' : idType}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Masked ID Number:</span>
                          <strong style={{ letterSpacing: '0.1em' }}>XXXX-XXXX-{idLast4 || '4921'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Government ID Photo:</span>
                          {idDocUrl ? (
                            <button
                              type="button"
                              onClick={() => setDocPreviewModalUrl(idDocUrl)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--brand-teal)',
                                fontWeight: 700,
                                textDecoration: 'underline',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                cursor: 'pointer'
                              }}
                            >
                              <span>👁️ View Uploaded Copy</span>
                              <ExternalLink size={12} />
                            </button>
                          ) : (
                            <span style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.8rem' }}>⚠️ Pending Upload</span>
                          )}
                        </div>

                        {/* Replace / Upload Button for ID (Enabled if NOT approved) */}
                        {idStatus !== 'APPROVED' && (
                          <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-hairline)', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <select
                              value={idType}
                              onChange={(e) => setIdType(e.target.value)}
                              className="form-control form-control-sm"
                              style={{ width: '160px', fontSize: '0.78rem', fontWeight: 600 }}
                            >
                              <option value="AADHAAR_MASKED">Aadhaar Card</option>
                              <option value="PAN">PAN Card</option>
                              <option value="DRIVING_LICENSE">Driving License</option>
                            </select>

                            <label style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.85rem',
                              backgroundColor: '#FFFFFF',
                              border: '1.5px solid var(--brand-teal)',
                              borderRadius: '8px',
                              cursor: idDocUploading ? 'wait' : 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: 'var(--brand-teal)',
                            }}>
                              <Upload size={14} />
                              <span>{idDocUploading ? 'Uploading to Cloudinary...' : idDocUrl ? '🔄 Re-upload ID Document' : '📤 Upload ID Proof (PDF/JPG)'}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                disabled={idDocUploading}
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setIdDocUploading(true);
                                  setErrorMsg('');
                                  try {
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    formData.append('type', file.type.includes('pdf') ? 'raw' : 'image');
                                    formData.append('folder', 'tuitionforhome/kyc');
                                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                    const d = await res.json();
                                    if (d.success) {
                                      setIdDocUrl(d.url);
                                      setIdStatus('PENDING');
                                      setIdRejectionNote('');
                                      setSuccessMsg('🎉 ID document uploaded to Cloudinary! Submitted for admin verification.');
                                    } else {
                                      setErrorMsg(d.error || 'Upload failed');
                                    }
                                  } catch {
                                    setErrorMsg('Network error uploading ID proof.');
                                  } finally {
                                    setIdDocUploading(false);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
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

              {/* REVIEWS & QR CODE SHARE TAB */}
              {activeTab === 'REVIEWS' && (
                <div className="profile-tab-pane">
                  <div className="profile-section-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <div>
                        <h2 className="profile-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                          <Star size={20} color="#F59E0B" fill="#F59E0B" />
                          <span>Parent Reviews &amp; Public Share Hub</span>
                        </h2>
                        <p className="profile-section-desc" style={{ margin: '0.25rem 0 0 0' }}>
                          Share your public review link &amp; QR code with parents to build trust and collect verified ratings.
                        </p>
                      </div>

                      <a
                        href={reviewLink || `/tutor/review/${userId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '0.82rem', padding: '0.55rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Eye size={15} />
                        <span>View Live Public Page</span>
                      </a>
                    </div>

                    {/* Share Link & QR Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
                      {/* Left: Link & Social Share */}
                      <div style={{ backgroundColor: '#F8FAFC', padding: '1.35rem', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                        <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                          🔗 Your Direct Public Review Link
                        </strong>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '1rem' }}>
                          Send this link to parents via WhatsApp or SMS to collect verified 5-star ratings for your home tuition sessions.
                        </p>

                        <div style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid var(--border-hairline)',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          fontSize: '0.78rem',
                          color: '#0F172A',
                          fontFamily: 'monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: '0.85rem',
                        }}>
                          {reviewLink || 'Loading...'}
                        </div>

                        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(reviewLink);
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 2500);
                            }}
                            className="btn btn-primary"
                            style={{
                              fontSize: '0.82rem',
                              padding: '0.6rem 1.15rem',
                              backgroundColor: linkCopied ? '#059669' : '#0F766E',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                            }}
                          >
                            <Copy size={15} />
                            <span>{linkCopied ? '✓ Link Copied!' : 'Copy Review Link'}</span>
                          </button>

                          <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hello! Please take a moment to rate and review my home tuition sessions on TuitionForHome: ${reviewLink}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              backgroundColor: '#25D366',
                              color: '#FFFFFF',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              padding: '0.6rem 1.15rem',
                              borderRadius: '10px',
                              textDecoration: 'none',
                            }}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            <span>Share on WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      {/* Right: QR Code Card */}
                      <div style={{ backgroundColor: '#F0FDFA', padding: '1.35rem', borderRadius: '16px', border: '1.5px solid #99F6E4', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #CCFBF1', boxShadow: '0 4px 12px rgba(13,148,136,0.1)', flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(reviewLink || `https://tuitionforhome.com/tutor/review/${userId}`)}`}
                            alt="Public Profile Review QR Code"
                            style={{ width: '100px', height: '100px', display: 'block' }}
                          />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: '#0F766E', display: 'block', marginBottom: '0.35rem' }}>
                            📱 Instant Scan QR Code
                          </strong>
                          <p style={{ fontSize: '0.78rem', color: '#115E59', lineHeight: 1.45, margin: 0 }}>
                            Parents can scan this QR code directly from your phone screen or printed visiting card to open your verified rating page instantly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Verified Parent Reviews Directory */}
                    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.5rem', border: '1.5px solid var(--border-hairline)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '1rem', color: '#0F172A', fontWeight: 800, display: 'block' }}>
                            Verified Parent Feedback ({reviews ? reviews.length : 0})
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            Ratings submitted by verified parents after home tuition sessions
                          </span>
                        </div>

                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Star size={20} fill="#D97706" color="#D97706" />
                          <span>
                            {reviews && reviews.length > 0
                              ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                              : '5.0'} / 5.0
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {reviews && reviews.map(rev => (
                          <div key={rev.id} style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid var(--border-hairline)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <strong style={{ fontSize: '0.88rem', color: '#0F172A' }}>{rev.parentName}</strong>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#ECFDF5', color: '#059669', padding: '0.1rem 0.45rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                  <ShieldCheck size={11} />
                                  <span>Verified Parent</span>
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.15rem' }}>
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                                ))}
                              </div>
                            </div>
                            <p style={{ fontSize: '0.84rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block', marginTop: '0.4rem' }}>
                              {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        ))}

                        {(!reviews || reviews.length === 0) && (
                          <div style={{ textAlign: 'center', padding: '2rem 1rem', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                            <Star size={32} color="#CBD5E1" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                            <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>
                              No Parent Reviews Collected Yet
                            </strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '420px', margin: '0 auto' }}>
                              Copy your public review link above and share it with your existing home tuition parents on WhatsApp to start collecting 5-star ratings!
                            </p>
                          </div>
                        )}
                      </div>
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
                      ★ {reviews && reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : rating.toFixed(1)} Rating ({reviews ? reviews.length : 0} Reviews)
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
                {selectedSubjects.length === 0 && selectedClasses.length === 0 && selectedBoards.length === 0 ? (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    ⚠️ No subjects selected yet. (Go to &quot;Manage Subject Area&quot; tab to add your teaching subjects, classes, and boards).
                  </span>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {(selectedSubjects || []).map(sub => (
                      <span key={sub} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #DBEAFE' }}>
                        {sub}
                      </span>
                    ))}
                    {(selectedClasses || []).map(cls => (
                      <span key={cls} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#FAF5FF', color: '#7C3AED', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #F3E8FF' }}>
                        {cls}
                      </span>
                    ))}
                    {(selectedBoards || []).map(brd => (
                      <span key={brd} style={{ fontSize: '0.76rem', fontWeight: 700, backgroundColor: '#F0FDF4', color: '#16A34A', padding: '0.3rem 0.65rem', borderRadius: '8px', border: '1px solid #DCFCE7' }}>
                        {brd} Board
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* LinkedIn-Style Education Timeline (Parent View) */}
              {qualifications.length > 0 && (
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border-hairline)' }}>
                  <strong style={{ display: 'block', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                    🎓 Academic Qualifications
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(qualifications || []).map(q => (
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
                    {(experiences || []).map(exp => (
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="profile-form-2col">
                <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Pricing</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--brand-teal)', display: 'block', marginTop: '0.2rem' }}>
                    ₹{hourlyRateHomeMin} - ₹{hourlyRateHomeMax} / hr
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Home Visits in Gurgaon</span>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '1.15rem', borderRadius: '14px', border: '1px solid var(--border-hairline)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                    Primary Base &amp; Preferred Sectors
                  </span>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      📍 Base: {(formattedAddress || 'Sector 14, Gurgaon').replace(/\s*\(GPS:.*?\)/i, '')}
                    </strong>
                    
                    {serviceAreas && serviceAreas.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 650 }}>Sectors:</span>
                        {serviceAreas.map((area: string) => (
                          <span key={area} style={{ fontSize: '0.68rem', fontWeight: 750, backgroundColor: 'var(--brand-teal-light)', color: 'var(--brand-teal)', padding: '0.12rem 0.45rem', borderRadius: '6px' }}>
                            ✓ {area}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Sectors: Gurgaon City Wide ({travelRadiusKm} KM radius)
                      </span>
                    )}

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.1rem' }}>
                      Radius: Within {travelRadiusKm} KM of home base
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Bottom Footer Actions */}
            <div style={{
              padding: '1.15rem 1.75rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1.5px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              flexShrink: 0
            }}>
              {errorMsg && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                  <span>{saveLoading ? 'Saving changes...' : '✓ Confirm & Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIVE MAP LOCATION PICKER MODAL */}
      {showMapModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          overflowY: 'auto'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '720px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 24px 50px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.1rem 1.5rem',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} color="#2DD4BF" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Select Base Location on Interactive Map
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    Click anywhere on the map or drag the pin to set your exact base address
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.35rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input Bar */}
            <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-hairline)' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleMapSearchLocation();
                }}
                style={{ display: 'flex', gap: '0.5rem' }}
              >
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={mapSearchQuery}
                    onChange={(e) => setMapSearchQuery(e.target.value)}
                    placeholder="Search Gurgaon sector, society, landmark e.g. Sector 56, DLF Phase 5..."
                    className="form-control"
                    style={{ fontSize: '0.86rem', paddingLeft: '2.4rem' }}
                  />
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>
                <button
                  type="submit"
                  disabled={mapSearchLoading}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 1rem', whiteSpace: 'nowrap' }}
                >
                  {mapSearchLoading ? 'Searching...' : 'Search Location'}
                </button>
              </form>
            </div>

            {/* Leaflet Map Canvas Container */}
            <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: '#E2E8F0' }}>
              <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
              {isMapGeocoding && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 999,
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  color: '#FFFFFF',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(4px)',
                }}>
                  ⏳ Updating address details...
                </div>
              )}
            </div>

            {/* Selected Location Address Preview & Action */}
            <div style={{ padding: '1.1rem 1.5rem', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: '#F0FDFA',
                borderRadius: '14px',
                border: '1px solid rgba(13,148,136,0.3)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}>
                <MapPin size={18} color="var(--brand-teal)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--brand-teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Selected Pin Address &amp; Coordinates
                  </strong>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {mapTempAddress || `${mapTempCoords.lat.toFixed(4)}° N, ${mapTempCoords.lng.toFixed(4)}° E`}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>
                    Shows your active {travelRadiusKm} KM travel radius boundary circle on the map above.
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowMapModal(false)}
                  className="btn btn-ghost"
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLatitude(mapTempCoords.lat);
                    setLongitude(mapTempCoords.lng);
                    if (mapTempAddress) setFormattedAddress(mapTempAddress);
                    setShowMapModal(false);
                    setSuccessMsg(`🎯 Base location updated to: ${mapTempAddress || 'Selected Map Pin'}`);
                  }}
                  className="btn btn-primary"
                  style={{ backgroundColor: 'var(--brand-teal)', fontSize: '0.88rem', padding: '0.65rem 1.4rem' }}
                >
                  Confirm &amp; Apply Map Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Lightbox Modal Overlay */}
      {docPreviewModalUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setDocPreviewModalUrl(null)}
        >
          <div
            style={{
              position: 'relative',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '1.5rem',
              maxWidth: '750px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1.5px solid var(--border-hairline)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>
                Uploaded Verification Document Preview
              </strong>
              <button
                type="button"
                onClick={() => setDocPreviewModalUrl(null)}
                style={{
                  backgroundColor: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ width: '100%', height: '480px', backgroundColor: '#0F172A', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
              {docPreviewModalUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                <iframe src={docPreviewModalUrl} style={{ width: '100%', height: '100%', border: 'none' }} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={docPreviewModalUrl}
                  alt="Uploaded Document Copy"
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', margin: '0 auto', borderRadius: '8px' }}
                />
              )}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', width: '100%' }}>
              <a
                href={docPreviewModalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.82rem', fontWeight: 700 }}
              >
                Open Original File ↗
              </a>
              <button
                type="button"
                onClick={() => setDocPreviewModalUrl(null)}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.82rem', backgroundColor: 'var(--brand-teal)', padding: '0.55rem 1.3rem', fontWeight: 800 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
