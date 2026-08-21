'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import VideoModal from '@/components/VideoModal';
import { GURGAON_LOCALITIES, VERIFIED_TUTORS, MockTutor, SSSAM_OFFICE_DETAILS } from '@/lib/data';
import {
  calculateHaversineKm,
  getDistanceInfo,
  getTeacherCoordinates,
  POPULAR_GURGAON_SECTORS,
} from '@/lib/geo';
import {
  Search,
  MapPin,
  GraduationCap,
  Star,
  ShieldCheck,
  Play,
  ChevronRight,
  Sparkles,
  Award,
  Briefcase,
  ChevronDown,
  Check,
  X,
  PhoneCall,
  RotateCcw,
  SlidersHorizontal,
  Home,
  Laptop,
  Crosshair,
  MessageCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function TutorsDirectoryPage() {
  const [tutors, setTutors] = useState<MockTutor[]>([]);
  const [loading, setLoading] = useState(true);

  // Parent Location Proximity State (Auto-synced with localStorage)
  const [parentLocation, setParentLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
    source: 'GPS' | 'SAVED' | 'DEFAULT';
  }>({
    address: 'DLF Phase 5, Golf Course Road, Gurugram',
    lat: 28.4552,
    lng: 77.0945,
    source: 'DEFAULT',
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showLocationSectorModal, setShowLocationSectorModal] = useState(false);
  const [sectorSearchQuery, setSectorSearchQuery] = useState('');

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | 'WITHIN_3_5' | 'WITHIN_7'>('ALL');
  const [selectedGender, setSelectedGender] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');
  const [selectedMode, setSelectedMode] = useState<'ALL' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'ALL' | 'UNDER_800' | '800_1200' | 'ABOVE_1200'>('ALL');
  const [sortBy, setSortBy] = useState<'DISTANCE_ASC' | 'RATING' | 'EXPERIENCE' | 'PRICE_LOW' | 'PRICE_HIGH'>('DISTANCE_ASC');

  // Quick Trending Search Chips
  const popularKeywords = [
    { label: 'Class 9-10 Maths', query: 'Maths' },
    { label: 'NEET Biology', query: 'Biology' },
    { label: 'JEE Physics', query: 'Physics' },
    { label: 'Commerce & Accounts', query: 'Accountancy' },
    { label: 'Coding & Python', query: 'Python' },
    { label: 'IB Diploma Math', query: 'IB' },
    { label: 'English Literature', query: 'English' },
  ];

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Modals
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<{
    tutorName?: string;
    tutorAvatar?: string;
    tutorDegree?: string;
    tutorRate?: number;
    tutorId?: string;
    grade?: string;
    mode?: string;
    subject?: string;
  } | undefined>(undefined);
  const [activeVideoTutor, setActiveVideoTutor] = useState<MockTutor | null>(null);

  // Load saved location on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_detected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.lat && parsed.lng) {
          setParentLocation({
            address: parsed.address,
            lat: parsed.lat,
            lng: parsed.lng,
            source: 'SAVED',
          });
        }
      }
    } catch {}
  }, []);

  // Fetch live verified tutors strictly from database API
  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors)) {
          setTutors(data.tutors);
        } else {
          setTutors([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch tutors for directory:', err);
        setTutors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Reverse Geocoding with OSM Nominatim
  const handleReverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      return data.display_name || 'Gurugram, Haryana';
    } catch {
      return 'Gurugram, Haryana';
    }
  }, []);

  // Helper to find nearest known sector from POPULAR_GURGAON_SECTORS
  const getNearestKnownSector = useCallback((lat: number, lng: number) => {
    let nearest = POPULAR_GURGAON_SECTORS[0];
    let minDistance = Infinity;
    for (const sector of POPULAR_GURGAON_SECTORS) {
      const d = Math.hypot(sector.lat - lat, sector.lng - lng);
      if (d < minDistance) {
        minDistance = d;
        nearest = sector;
      }
    }
    return minDistance < 0.15 ? nearest : null;
  }, []);

  // Handle GPS detection on button click
  const handleDetectGPS = () => {
    setIsDetectingLocation(true);
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const nearestSector = getNearestKnownSector(lat, lng);
          let resolvedAddress = nearestSector
            ? `${nearestSector.name}, ${nearestSector.landmark ? nearestSector.landmark.split(',')[0] + ', ' : ''}Gurugram`
            : '';

          if (!resolvedAddress) {
            resolvedAddress = await handleReverseGeocode(lat, lng);
          }

          setParentLocation({
            address: resolvedAddress,
            lat,
            lng,
            source: 'GPS',
          });

          try {
            localStorage.setItem('user_detected_location', JSON.stringify({ address: resolvedAddress, lat, lng }));
          } catch {}

          setIsDetectingLocation(false);
          setCurrentPage(1);
        },
        () => {
          setIsDetectingLocation(false);
          setShowLocationSectorModal(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetectingLocation(false);
      setShowLocationSectorModal(true);
    }
  };

  // Select quick sector
  const handleSelectSector = (sector: typeof POPULAR_GURGAON_SECTORS[0]) => {
    const addr = `${sector.name}, ${sector.landmark.split(',')[0]}, Gurugram`;
    setParentLocation({
      address: addr,
      lat: sector.lat,
      lng: sector.lng,
      source: 'SAVED',
    });

    try {
      localStorage.setItem('user_detected_location', JSON.stringify({ address: addr, lat: sector.lat, lng: sector.lng }));
    } catch {}

    setShowLocationSectorModal(false);
    setCurrentPage(1);
  };

  const handleOpenBooking = (tutor?: MockTutor) => {
    if (tutor) {
      setSelectedTutorForBooking({
        tutorName: tutor.name,
        tutorAvatar: tutor.avatarUrl,
        tutorDegree: tutor.highestDegree,
        tutorRate: tutor.hourlyRateHome,
        tutorId: tutor.id,
        grade: tutor.classes?.[0],
        subject: tutor.subjects?.[0],
      });
    } else {
      setSelectedTutorForBooking(undefined);
    }
    setBookingOpen(true);
  };

  // Compute distance for each tutor and filter & sort
  const filteredTutors = useMemo(() => {
    const list = tutors;

    return list
      .map((tut) => {
        const tCoords = getTeacherCoordinates(tut);
        const distanceKm = calculateHaversineKm(parentLocation.lat, parentLocation.lng, tCoords.lat, tCoords.lng);
        const distanceInfo = getDistanceInfo(distanceKm);

        return {
          ...tut,
          distanceKm,
          distanceInfo,
        };
      })
      .filter((tut) => {
        // Distance Filter
        if (distanceFilter === 'WITHIN_3_5' && tut.distanceKm > 3.5) return false;
        if (distanceFilter === 'WITHIN_7' && tut.distanceKm > 7.0) return false;

        // Gender filter
        if (selectedGender === 'FEMALE') {
          if (tut.gender && tut.gender.toUpperCase() !== 'FEMALE') return false;
        } else if (selectedGender === 'MALE') {
          if (tut.gender && tut.gender.toUpperCase() !== 'MALE') return false;
        }

        // Mode filter
        if (selectedMode !== 'ALL') {
          if (selectedMode === 'OFFLINE_HOME' && tut.teachingMode === 'ONLINE_LIVE') return false;
          if (selectedMode === 'ONLINE_LIVE' && tut.teachingMode === 'OFFLINE_HOME') return false;
        }

        // Price Range filter
        if (selectedPriceRange === 'UNDER_800' && tut.hourlyRateHome > 800) return false;
        if (selectedPriceRange === '800_1200' && (tut.hourlyRateHome < 800 || tut.hourlyRateHome > 1200)) return false;
        if (selectedPriceRange === 'ABOVE_1200' && tut.hourlyRateHome < 1200) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchQ =
            tut.name.toLowerCase().includes(q) ||
            tut.highestDegree.toLowerCase().includes(q) ||
            tut.subjects.some((s) => s.toLowerCase().includes(q)) ||
            tut.serviceAreas.some((a) => a.toLowerCase().includes(q));
          if (!matchQ) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'DISTANCE_ASC') return a.distanceKm - b.distanceKm;
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'EXPERIENCE') return b.experienceYears - a.experienceYears;
        if (sortBy === 'PRICE_LOW') return a.hourlyRateHome - b.hourlyRateHome;
        if (sortBy === 'PRICE_HIGH') return b.hourlyRateHome - a.hourlyRateHome;
        return 0;
      });
  }, [tutors, parentLocation, distanceFilter, selectedGender, selectedMode, selectedPriceRange, searchQuery, sortBy]);

  const isFilterActive =
    searchQuery.trim() !== '' ||
    distanceFilter !== 'ALL' ||
    selectedGender !== 'ALL' ||
    selectedMode !== 'ALL' ||
    selectedPriceRange !== 'ALL' ||
    sortBy !== 'DISTANCE_ASC';

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setDistanceFilter('ALL');
    setSelectedGender('ALL');
    setSelectedMode('ALL');
    setSelectedPriceRange('ALL');
    setSortBy('DISTANCE_ASC');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredTutors.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTutors = filteredTutors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* =========================================================================
            1. HERO & LOCATION PROXIMITY HEADER
            ========================================================================= */}
        <section style={{
          padding: 'clamp(2rem, 4vw, 3rem) 0 clamp(1rem, 2vw, 1.5rem) 0',
          background: 'radial-gradient(circle at 50% 0%, rgba(209, 250, 229, 0.55), rgba(248, 250, 252, 1) 85%)',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <div className="container">
            <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
              {/* Trust Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.3rem 0.85rem',
                borderRadius: '999px',
                border: '1px solid #A7F3D0',
                marginBottom: '0.75rem',
              }}>
                <ShieldCheck size={14} />
                <span>1,000+ SSSAM ACADEMY VERIFIED TEACHERS IN GURGAON</span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.6rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                Find Verified Home Teachers in Gurgaon
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#64748B', lineHeight: 1.55, maxWidth: '680px', margin: '0 auto 1.5rem auto' }}>
                Showing nearest background-verified subject specialists matched by distance to your sector.
              </p>

              {/* LIVE LOCATION PROXIMITY BAR */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #CBD5E1',
                padding: '0.85rem 1.15rem',
                boxShadow: '0 8px 30px rgba(15, 110, 86, 0.08)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, textAlign: 'left' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    backgroundColor: isDetectingLocation ? '#FEF3C7' : '#EFF6FF',
                    color: isDetectingLocation ? '#D97706' : '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                  }}>
                    {isDetectingLocation ? (
                      <Crosshair size={20} style={{ animation: 'radarSpin 1s linear infinite' }} />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {isDetectingLocation ? 'DETECTING YOUR GPS LOCATION...' : 'SHOWING TEACHERS NEAR YOUR SECTOR'}
                    </div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {parentLocation.address}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isDetectingLocation}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#0F6E56',
                    }}
                  >
                    <Crosshair size={15} color="#0F6E56" />
                    <span>{isDetectingLocation ? 'Scanning GPS...' : 'Use Current Location'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLocationSectorModal(true)}
                    className="btn btn-primary btn-sm"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.5rem 0.95rem',
                      borderRadius: '10px',
                      backgroundColor: '#0F6E56',
                    }}
                  >
                    <MapPin size={15} />
                    <span>Change Sector</span>
                  </button>
                </div>
              </div>

              {/* Quick Sector Chips (1-Click Switcher) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Quick Sectors:
                </span>
                {POPULAR_GURGAON_SECTORS.slice(0, 7).map((sec) => {
                  const isSelected = parentLocation.address.toLowerCase().includes(sec.name.toLowerCase());
                  return (
                    <button
                      key={sec.name}
                      type="button"
                      onClick={() => handleSelectSector(sec)}
                      style={{
                        padding: '0.32rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: isSelected ? 800 : 600,
                        border: isSelected ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#0F6E56' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {sec.name}
                    </button>
                  );
                })}
              </div>

              {/* Central Search Bar */}
              <div style={{
                position: 'relative',
                maxWidth: '640px',
                margin: '0.75rem auto 0.75rem auto',
                boxShadow: '0 8px 24px -4px rgba(15, 110, 86, 0.1)',
                borderRadius: '16px',
              }}>
                <Search size={19} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0F6E56' }} />
                <input
                  type="text"
                  placeholder="Search by subject, teacher name, or qualifications..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-control"
                  style={{
                    paddingLeft: '3.1rem',
                    paddingRight: '1.25rem',
                    paddingTop: '0.85rem',
                    paddingBottom: '0.85rem',
                    borderRadius: '16px',
                    fontSize: '0.94rem',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. FILTERS TOOLBAR & DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '1.25rem 0 4rem 0' }}>
          <div className="container">
            {/* Embedded Responsive Styles & Keyframes */}
            <style jsx global>{`
              .proximity-filter-toolbar {
                display: flex;
                gap: 0.85rem;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
              }
              .proximity-filter-left {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                align-items: center;
                flex: 1;
              }
              .filter-dropdown-select {
                padding: 0.52rem 0.85rem;
                border-radius: 10px;
                border: 1px solid #CBD5E1;
                font-size: 0.84rem;
                font-weight: 600;
                background-color: #FFFFFF;
                color: #0F172A;
                cursor: pointer;
                height: 38px;
              }
              .mode-btn-group {
                display: inline-flex;
                border-radius: 10px;
                border: 1px solid #CBD5E1;
                overflow: hidden;
                height: 38px;
              }
              @keyframes radarWave {
                0% { transform: scale(0.95); opacity: 0.8; }
                100% { transform: scale(1.6); opacity: 0; }
              }
              @keyframes radarSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @media (max-width: 768px) {
                .proximity-filter-toolbar {
                  flex-direction: column !important;
                  align-items: stretch !important;
                  gap: 0.75rem !important;
                }
                .proximity-filter-left {
                  width: 100% !important;
                }
                .mode-btn-group {
                  width: 100% !important;
                  display: flex !important;
                }
                .mode-btn-group button {
                  flex: 1 !important;
                  padding: 0 0.4rem !important;
                  font-size: 0.76rem !important;
                }
                .filter-right-controls {
                  width: 100% !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: space-between !important;
                }
                .filter-right-controls select {
                  flex: 1 !important;
                }
              }
            `}</style>

            {/* Filter Hub Toolbar */}
            <div className="apple-card" style={{
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}>
              <div className="proximity-filter-toolbar">
                {/* Left Controls: Distance Filters & Modes */}
                <div className="proximity-filter-left">
                  {/* Distance Range Filter Pills */}
                  {[
                    { id: 'ALL', label: '🌐 All Gurgaon' },
                    { id: 'WITHIN_3_5', label: '🟢 Within 3.5 km' },
                    { id: 'WITHIN_7', label: '🟡 Within 7 km' },
                  ].map((pill) => {
                    const isSel = distanceFilter === pill.id;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => {
                          setDistanceFilter(pill.id as any);
                          setCurrentPage(1);
                        }}
                        style={{
                          padding: '0.45rem 0.85rem',
                          borderRadius: '10px',
                          fontSize: '0.8rem',
                          fontWeight: isSel ? 800 : 600,
                          border: isSel ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                          backgroundColor: isSel ? '#ECFDF5' : '#FFFFFF',
                          color: isSel ? '#0F6E56' : '#475569',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {pill.label}
                      </button>
                    );
                  })}

                  {/* Gender Filter Dropdown */}
                  <select
                    value={selectedGender}
                    onChange={(e) => {
                      setSelectedGender(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="filter-dropdown-select"
                  >
                    <option value="ALL">All Teachers</option>
                    <option value="FEMALE">👩 Female Teachers Only</option>
                    <option value="MALE">👨 Male Teachers Only</option>
                  </select>

                  {/* Price Range Filter */}
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => {
                      setSelectedPriceRange(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="filter-dropdown-select"
                  >
                    <option value="ALL">All Budget Ranges</option>
                    <option value="UNDER_800">Under ₹800/hr</option>
                    <option value="800_1200">₹800 – ₹1,200/hr</option>
                    <option value="ABOVE_1200">₹1,200+/hr (IIT/IB Masters)</option>
                  </select>

                  {/* Teaching Mode Group */}
                  <div className="mode-btn-group">
                    <button
                      type="button"
                      onClick={() => { setSelectedMode('ALL'); setCurrentPage(1); }}
                      style={{
                        padding: '0 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: selectedMode === 'ALL' ? '#0F6E56' : '#FFFFFF',
                        color: selectedMode === 'ALL' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      All Modes
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedMode('OFFLINE_HOME'); setCurrentPage(1); }}
                      style={{
                        padding: '0 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: selectedMode === 'OFFLINE_HOME' ? '#0F6E56' : '#FFFFFF',
                        color: selectedMode === 'OFFLINE_HOME' ? '#FFFFFF' : '#475569',
                        borderLeft: '1px solid #E2E8F0',
                        borderRight: '1px solid #E2E8F0',
                        borderTop: 'none',
                        borderBottom: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      🏡 Home Visits
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSelectedMode('ONLINE_LIVE'); setCurrentPage(1); }}
                      style={{
                        padding: '0 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: selectedMode === 'ONLINE_LIVE' ? '#0F6E56' : '#FFFFFF',
                        color: selectedMode === 'ONLINE_LIVE' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      💻 Online 1-on-1
                    </button>
                  </div>
                </div>

                {/* Right Controls: Sort Dropdown & Reset */}
                <div className="filter-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={handleResetAllFilters}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        height: '38px',
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="filter-dropdown-select"
                      style={{ minWidth: '165px' }}
                    >
                      <option value="DISTANCE_ASC">📍 Nearest to My Sector</option>
                      <option value="RATING">★ Highest Rating (5.0)</option>
                      <option value="EXPERIENCE">Most Experience</option>
                      <option value="PRICE_LOW">Fee: Low to High</option>
                      <option value="PRICE_HIGH">Fee: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count & Trust Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 700 }}>
                Showing <strong style={{ color: '#0F172A' }}>{filteredTutors.length}</strong> verified teachers near <strong style={{ color: '#0F6E56' }}>{parentLocation.address.split(',')[0]}</strong>
                {isFilterActive && <span style={{ color: '#0F6E56', marginLeft: '0.4rem' }}>(Filters Applied)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>100% Background Verified by TuitionForHome</span>
              </div>
            </div>

            {/* DIRECTORY GRID */}
            {paginatedTutors.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px dashed #CBD5E1',
                padding: '3.5rem 2rem',
                textAlign: 'center',
                color: '#64748B',
                boxShadow: 'var(--shadow-subtle)',
              }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.25rem auto' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#0F6E56',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    boxShadow: '0 6px 18px rgba(15, 110, 86, 0.18)',
                  }}>
                    <Search size={28} />
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.45rem' }}>
                  No educators match your exact search criteria
                </h3>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}>
                {paginatedTutors.map((tutor) => {
                  const whatsappMsg = encodeURIComponent(
                    `Hello SSSAM Academy, I want to book home teacher ${tutor.name} (${tutor.distanceInfo.distanceText} from ${parentLocation.address}). Please share available timings.`
                  );
                  const whatsappUrl = `https://wa.me/919217031899?text=${whatsappMsg}`;

                  return (
                    <div
                      key={tutor.id}
                      className="apple-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #E2E8F0',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Top Bar with Avatar, Badges & Proximity Pill */}
                      <div style={{ padding: '1.25rem', paddingBottom: '0.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link href={`/tutors/${tutor.id}`} style={{ position: 'relative', display: 'block', flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={tutor.avatarUrl}
                            alt={tutor.name}
                            style={{ width: '64px', height: '64px', borderRadius: '16px', objectFit: 'cover' }}
                          />
                          <span style={{
                            position: 'absolute',
                            bottom: '-4px',
                            right: '-4px',
                            backgroundColor: '#047857',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            border: '2px solid #FFFFFF',
                          }}>
                            <ShieldCheck size={11} />
                          </span>
                        </Link>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Link href={`/tutors/${tutor.id}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0F172A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {tutor.name}
                            </h3>
                          </Link>
                          <div style={{ fontSize: '0.76rem', color: '#0F6E56', fontWeight: 700, margin: '2px 0' }}>
                            {tutor.badge}
                          </div>
                          {tutor.totalReviews > 0 && tutor.rating > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748B' }}>
                              <Star size={13} color="#F59E0B" fill="#F59E0B" />
                              <strong style={{ color: '#0F172A' }}>{tutor.rating}</strong>
                              <span>({tutor.totalReviews} {tutor.totalReviews === 1 ? 'review' : 'reviews'})</span>
                            </div>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.74rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', marginTop: '2px' }}>
                              <span>✨ New Verified Teacher</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Live Proximity Badge */}
                      <div style={{ padding: '0 1.25rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '8px',
                          backgroundColor: tutor.distanceInfo.badgeBg,
                          color: tutor.distanceInfo.badgeColor,
                          border: `1px solid ${tutor.distanceInfo.badgeBorder}`,
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          width: '100%',
                          boxSizing: 'border-box',
                        }}>
                          <Clock size={12} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tutor.distanceInfo.distanceText} ({tutor.distanceInfo.travelTime})
                          </span>
                        </div>
                      </div>

                      {/* Prominent Education & Experience Stat Box */}
                      <div style={{ padding: '1.25rem', paddingTop: '0.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                          gap: '0.5rem',
                          padding: '0.65rem 0.75rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          alignItems: 'center',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                              <GraduationCap size={15} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Degree</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={tutor.highestDegree}>
                                {tutor.highestDegree}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0, borderLeft: '1px solid #E2E8F0', paddingLeft: '0.5rem' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0 }}>
                              <Briefcase size={15} />
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Experience</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {tutor.experienceYears}+ Years
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginTop: '0.1rem' }}>
                          <MapPin size={14} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                            {tutor.serviceAreas.join(' • ')}
                          </span>
                        </div>

                        {/* Subjects Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                          {tutor.subjects.map((s) => (
                            <span key={s} style={{ fontSize: '0.74rem', padding: '0.2rem 0.55rem', backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #DCFCE7', borderRadius: '6px', fontWeight: 600 }}>
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* 60s Video Intro Pill */}
                        {tutor.introVideoUrl && tutor.introVideoUrl.trim() !== '' ? (
                          <button
                            type="button"
                            onClick={() => setActiveVideoTutor(tutor)}
                            style={{
                              marginTop: '0.4rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '0.55rem 0.85rem',
                              borderRadius: '10px',
                              backgroundColor: '#F0FDF4',
                              border: '1px solid #BBF7D0',
                              color: '#0F6E56',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Play size={13} fill="#0F6E56" />
                              <span>Watch 60s Video Intro</span>
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#0F6E56' }}>{tutor.videoDuration || 'Preview'}</span>
                          </button>
                        ) : (
                          <div
                            style={{
                              marginTop: '0.4rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              padding: '0.5rem 0.85rem',
                              borderRadius: '10px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              color: '#0F6E56',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                            }}
                          >
                            <ShieldCheck size={14} color="#059669" />
                            <span>Interview Verified • SSSAM Sector 14</span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer Price & Action */}
                      <div style={{
                        padding: '1rem 1.25rem',
                        borderTop: '1px solid #F1F5F9',
                        backgroundColor: '#F8FAFC',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}>
                        <div>
                          <div style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.04em' }}>
                            ESTIMATED FEE
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                            <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A' }}>
                              ₹{tutor.hourlyRateHomeMin || tutor.hourlyRateHome || 600}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>/hr</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.45rem 0.6rem', color: '#15803D', backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '8px' }}
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle size={14} />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(tutor)}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: '#0F6E56', padding: '0.5rem 0.85rem', borderRadius: '8px', fontWeight: 800 }}
                          >
                            <span>Request</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                  const isActive = currentPage === pg;
                  return (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: `1.5px solid ${isActive ? '#0F6E56' : '#E2E8F0'}`,
                        backgroundColor: isActive ? '#0F6E56' : '#FFFFFF',
                        color: isActive ? '#FFFFFF' : '#0F172A',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm"
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}

            {/* Concierge Assistance Card */}
            <div style={{
              marginTop: '4.5rem',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
                marginBottom: '1.25rem',
              }}>
                <Sparkles size={14} />
                <span>FREE ACADEMIC COUNSELOR MATCHING DESK</span>
              </div>

              <h2 style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
                maxWidth: '650px',
              }}>
                Need a Custom Timing or Special Syllabus Mentor?
              </h2>

              <p style={{ fontSize: '0.96rem', color: '#94A3B8', maxWidth: '580px', lineHeight: 1.6, marginBottom: '2rem' }}>
                Tell our SSSAM Academy counselors your child’s grade, board (CBSE / ICSE / IB / Cambridge), and timing preference. We will match and verify the best educator within 2 hours.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="btn btn-primary btn-lg"
                  style={{
                    backgroundColor: '#0F6E56',
                    padding: '0.9rem 2rem',
                    fontSize: '0.96rem',
                    fontWeight: 800,
                  }}
                >
                  <span>Request Custom Teacher Match</span>
                  <ChevronRight size={18} />
                </button>

                <a
                  href={`tel:${SSSAM_OFFICE_DETAILS.phones[0]}`}
                  className="btn btn-secondary btn-lg"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.9rem 1.75rem',
                    fontSize: '0.96rem',
                    fontWeight: 700,
                  }}
                >
                  <PhoneCall size={16} />
                  <span>Call Helpline: {SSSAM_OFFICE_DETAILS.phones[0]}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* POPUP MODAL FOR SELECTING GURGAON SECTOR */}
      {showLocationSectorModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLocationSectorModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              maxHeight: '85vh',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem 1rem',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  📍 Select Your Gurgaon Sector
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  We will show background-verified teachers sorted by distance from your sector
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLocationSectorModal(false)}
                aria-label="Close sector modal"
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.45rem',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <X size={18} color="#64748B" />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search sector (e.g. DLF Phase 5, Sector 56, Sohna Road)..."
                  value={sectorSearchQuery}
                  onChange={(e) => setSectorSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: '2.4rem',
                    paddingRight: sectorSearchQuery ? '2rem' : '0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {sectorSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setSectorSearchQuery('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* List of Gurgaon Sectors */}
            <div style={{ overflowY: 'auto', maxHeight: '350px', padding: '0.5rem' }}>
              {POPULAR_GURGAON_SECTORS.filter((sec) => {
                if (!sectorSearchQuery) return true;
                const q = sectorSearchQuery.toLowerCase();
                return sec.name.toLowerCase().includes(q) || sec.landmark.toLowerCase().includes(q);
              }).map((sec) => {
                const isSelected = parentLocation.address.toLowerCase().includes(sec.name.toLowerCase());
                return (
                  <button
                    key={sec.name}
                    type="button"
                    onClick={() => handleSelectSector(sec)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isSelected ? '#ECFDF5' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: isSelected ? '#0F6E56' : '#0F172A' }}>
                        {sec.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '1px' }}>
                        {sec.landmark}
                      </div>
                    </div>
                    {isSelected && <Check size={16} color="#0F6E56" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialData={selectedTutorForBooking}
      />

      <VideoModal
        tutor={activeVideoTutor}
        onClose={() => setActiveVideoTutor(null)}
        onSelectTutor={(tutor) => handleOpenBooking(tutor)}
      />

      <Footer />
    </div>
  );
}
