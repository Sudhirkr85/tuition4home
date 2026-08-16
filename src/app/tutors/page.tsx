'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import VideoModal from '@/components/VideoModal';
import { GURGAON_LOCALITIES, VERIFIED_TUTORS, MockTutor, SSSAM_OFFICE_DETAILS } from '@/lib/data';
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
} from 'lucide-react';
import Link from 'next/link';

export default function TutorsDirectoryPage() {
  const [tutors, setTutors] = useState<MockTutor[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('ALL');
  const [localitySearchText, setLocalitySearchText] = useState('');
  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);
  const localityRef = useRef<HTMLDivElement>(null);
  const [selectedMode, setSelectedMode] = useState<'ALL' | 'OFFLINE_HOME' | 'ONLINE_LIVE'>('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState<'ALL' | 'UNDER_800' | '800_1200' | 'ABOVE_1200'>('ALL');
  const [sortBy, setSortBy] = useState<'RATING' | 'EXPERIENCE' | 'PRICE_LOW' | 'PRICE_HIGH'>('RATING');

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

  // Close locality dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (localityRef.current && !localityRef.current.contains(e.target as Node)) {
        setLocalityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Fetch live verified tutors from database API
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

  // Filter & Sort Logic
  const filteredTutors = useMemo(() => {
    return tutors
      .filter((tut) => {
        // Mode filter
        if (selectedMode !== 'ALL') {
          if (selectedMode === 'OFFLINE_HOME' && tut.teachingMode === 'ONLINE_LIVE') return false;
          if (selectedMode === 'ONLINE_LIVE' && tut.teachingMode === 'OFFLINE_HOME') return false;
        }

        // Price Range filter
        if (selectedPriceRange === 'UNDER_800' && tut.hourlyRateHome > 800) return false;
        if (selectedPriceRange === '800_1200' && (tut.hourlyRateHome < 800 || tut.hourlyRateHome > 1200)) return false;
        if (selectedPriceRange === 'ABOVE_1200' && tut.hourlyRateHome < 1200) return false;

        // Locality filter
        if (selectedLocality !== 'ALL') {
          const matchLoc = tut.serviceAreas.some((a) => a.toLowerCase().includes(selectedLocality.toLowerCase()));
          if (!matchLoc) return false;
        }

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
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'EXPERIENCE') return b.experienceYears - a.experienceYears;
        if (sortBy === 'PRICE_LOW') return a.hourlyRateHome - b.hourlyRateHome;
        if (sortBy === 'PRICE_HIGH') return b.hourlyRateHome - a.hourlyRateHome;
        return 0;
      });
  }, [tutors, selectedMode, selectedPriceRange, selectedLocality, searchQuery, sortBy]);

  // Check if any filter is actively applied
  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedLocality !== 'ALL' ||
    selectedMode !== 'ALL' ||
    selectedPriceRange !== 'ALL';

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedLocality('ALL');
    setLocalitySearchText('');
    setSelectedMode('ALL');
    setSelectedPriceRange('ALL');
    setSortBy('RATING');
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
            DIRECTORY HERO: GRAND SEARCH & INSTANT QUICK FILTERS
            ========================================================================= */}
        <section style={{
          padding: 'clamp(2rem, 3.5vw, 2.75rem) 0 clamp(1rem, 2vw, 1.5rem) 0',
          background: 'radial-gradient(circle at 50% 0%, rgba(209, 250, 229, 0.55), rgba(248, 250, 252, 1) 85%)',
          borderBottom: '1px solid #E2E8F0',
        }}>
          <div className="container">
            <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
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
                <span>1,000+ SSSAM ACADEMY VERIFIED EDUCATORS IN GURGAON</span>
              </div>

              <h1 style={{ fontSize: 'clamp(1.85rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#0F172A', lineHeight: 1.18, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
                Find Top Verified Home &amp; Online Tutors in Gurgaon
              </h1>
              <p style={{ fontSize: '0.98rem', color: '#64748B', lineHeight: 1.55, maxWidth: '680px', margin: '0 auto 1.25rem auto' }}>
                Screened subject specialists across DLF, Golf Course, Sohna Road, Nirvana Country &amp; all Gurgaon sectors. Watch 60-second video introductions &amp; request personalized classes.
              </p>

              {/* Central Search Bar */}
              <div style={{
                position: 'relative',
                maxWidth: '640px',
                margin: '0 auto 0.85rem auto',
                boxShadow: '0 8px 24px -4px rgba(15, 110, 86, 0.1)',
                borderRadius: '16px',
              }}>
                <Search size={19} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0F6E56' }} />
                <input
                  type="text"
                  placeholder="Search by subject (e.g. Maths, Physics), degree (e.g. IIT, M.Sc), or teacher name..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="form-control"
                  style={{
                    paddingLeft: '3.1rem',
                    paddingRight: searchQuery ? '3rem' : '1.25rem',
                    paddingTop: '0.85rem',
                    paddingBottom: '0.85rem',
                    borderRadius: '16px',
                    fontSize: '0.94rem',
                    border: '1.5px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'none',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Trending Quick Search Chips */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.45rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, marginRight: '0.2rem' }}>Popular:</span>
                {popularKeywords.map((item) => {
                  const isSelected = searchQuery.toLowerCase() === item.query.toLowerCase();
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSearchQuery('');
                        } else {
                          setSearchQuery(item.query);
                        }
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '0.3rem 0.7rem',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        border: isSelected ? '1.5px solid #0F6E56' : '1px solid #E2E8F0',
                        backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
                        color: isSelected ? '#0F6E56' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FILTERS TOOLBAR & DIRECTORY GRID
            ========================================================================= */}
        <section style={{ padding: '1.25rem 0 4rem 0' }}>
          <div className="container">
            {/* Embedded Responsive Styles */}
            <style jsx global>{`
              .filter-toolbar-box {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                align-items: center;
                justify-content: space-between;
              }
              .filter-left-controls {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
                align-items: center;
                flex: 1;
              }
              .locality-box-wrapper {
                position: relative;
                min-width: 240px;
                max-width: 320px;
                flex: 1;
                z-index: 70;
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
                width: 100%;
              }
              .mode-btn-group {
                display: inline-flex;
                border-radius: 10px;
                border: 1px solid #CBD5E1;
                overflow: hidden;
                height: 38px;
              }
              @media (max-width: 768px) {
                .filter-toolbar-box {
                  flex-direction: column !important;
                  align-items: stretch !important;
                  gap: 0.75rem !important;
                }
                .filter-left-controls {
                  flex-direction: column !important;
                  align-items: stretch !important;
                  gap: 0.75rem !important;
                  width: 100% !important;
                }
                .locality-box-wrapper {
                  max-width: 100% !important;
                  width: 100% !important;
                  min-width: 0 !important;
                }
                .mobile-two-col {
                  display: grid !important;
                  grid-template-columns: 1fr 1fr !important;
                  gap: 0.5rem !important;
                  width: 100% !important;
                }
                .mode-btn-group {
                  width: 100% !important;
                  display: flex !important;
                }
                .mode-btn-group button {
                  flex: 1 !important;
                  padding: 0 0.4rem !important;
                  font-size: 0.74rem !important;
                  text-align: center !important;
                  white-space: nowrap !important;
                }
                .filter-right-controls {
                  width: 100% !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: space-between !important;
                  gap: 0.5rem !important;
                }
                .filter-right-controls select {
                  flex: 1 !important;
                }
              }
            `}</style>

            {/* Filter Hub Toolbar */}
            <div className="apple-card" style={{
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              position: 'relative',
              zIndex: 60,
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            }}>
              <div className="filter-toolbar-box">
                {/* Left Controls: Location, Price, Mode */}
                <div className="filter-left-controls">
                  {/* Searchable Writable Locality Combobox */}
                  <div ref={localityRef} className="locality-box-wrapper">
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '10px',
                      border: localityDropdownOpen ? '1.5px solid #0F6E56' : '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      boxShadow: localityDropdownOpen ? '0 0 0 3px rgba(15, 110, 86, 0.12)' : 'none',
                      transition: 'all 0.15s ease',
                      height: '38px',
                      boxSizing: 'border-box',
                    }}>
                      <MapPin size={15} color="#047857" style={{ flexShrink: 0 }} />
                      <input
                        type="text"
                        placeholder="Search Sector / Locality..."
                        value={localitySearchText}
                        onFocus={() => setLocalityDropdownOpen(true)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocalitySearchText(val);
                          setSelectedLocality(val.trim() === '' ? 'ALL' : val);
                          setLocalityDropdownOpen(true);
                          setCurrentPage(1);
                        }}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: '#0F172A',
                          width: '100%',
                          backgroundColor: 'transparent',
                        }}
                      />
                      {localitySearchText ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLocality('ALL');
                            setLocalitySearchText('');
                            setLocalityDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: '#94A3B8',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Clear filter"
                        >
                          <X size={14} />
                        </button>
                      ) : (
                        <ChevronDown
                          size={14}
                          color="#94A3B8"
                          style={{
                            cursor: 'pointer',
                            transform: localityDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.15s ease',
                            flexShrink: 0,
                          }}
                          onClick={() => setLocalityDropdownOpen(!localityDropdownOpen)}
                        />
                      )}
                    </div>

                    {/* Dropdown Suggestions List */}
                    {localityDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: 0,
                        right: 0,
                        minWidth: '280px',
                        maxHeight: '280px',
                        overflowY: 'auto',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
                        zIndex: 9999,
                        padding: '0.4rem',
                      }}>
                        <div
                          onClick={() => {
                            setSelectedLocality('ALL');
                            setLocalitySearchText('');
                            setLocalityDropdownOpen(false);
                            setCurrentPage(1);
                          }}
                          style={{
                            padding: '0.55rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: selectedLocality === 'ALL' ? '#0F6E56' : '#1E293B',
                            backgroundColor: selectedLocality === 'ALL' ? '#ECFDF5' : 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>All Gurgaon Sectors</span>
                          {selectedLocality === 'ALL' && <Check size={14} color="#0F6E56" />}
                        </div>

                        {GURGAON_LOCALITIES.filter((l) => {
                          if (!localitySearchText) return true;
                          const q = localitySearchText.toLowerCase();
                          return l.name.toLowerCase().includes(q) || l.landmark.toLowerCase().includes(q) || l.pincode.includes(q);
                        }).map((loc) => {
                          const isSel = selectedLocality.toLowerCase() === loc.name.toLowerCase();
                          return (
                            <div
                              key={loc.slug}
                              onClick={() => {
                                setSelectedLocality(loc.name);
                                setLocalitySearchText(loc.name);
                                setLocalityDropdownOpen(false);
                                setCurrentPage(1);
                              }}
                              style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: isSel ? '#ECFDF5' : 'transparent',
                                transition: 'background-color 0.1s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSel) (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSel) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                              }}
                            >
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isSel ? '#0F6E56' : '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{loc.name}</span>
                                {isSel && <Check size={14} color="#0F6E56" />}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1px' }}>
                                {loc.landmark}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Budget Price Range Dropdown */}
                  <div style={{ minWidth: '160px', flex: 1 }}>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => {
                        setSelectedPriceRange(e.target.value as any);
                        setCurrentPage(1);
                      }}
                      className="filter-dropdown-select"
                    >
                      <option value="ALL">All Fee Ranges</option>
                      <option value="UNDER_800">Under ₹800 / hr</option>
                      <option value="800_1200">₹800 – ₹1,200 / hr</option>
                      <option value="ABOVE_1200">Above ₹1,200 / hr</option>
                    </select>
                  </div>

                  {/* Mode Buttons */}
                  <div className="mode-btn-group">
                    <button
                      type="button"
                      onClick={() => { setSelectedMode('ALL'); setCurrentPage(1); }}
                      style={{
                        padding: '0 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        backgroundColor: selectedMode === 'ALL' ? '#0F172A' : '#FFFFFF',
                        color: selectedMode === 'ALL' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      All
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
                        transition: 'all 0.15s ease',
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
                        transition: 'all 0.15s ease',
                      }}
                    >
                      💻 Online 1-on-1
                    </button>
                  </div>
                </div>

                {/* Right Controls: Sort Dropdown & Reset Button */}
                <div className="filter-right-controls" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                        boxSizing: 'border-box',
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Clear</span>
                    </button>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="filter-dropdown-select"
                      style={{ minWidth: '160px' }}
                    >
                      <option value="RATING">Highest Rating (★ 5.0)</option>
                      <option value="EXPERIENCE">Most Experience</option>
                      <option value="PRICE_LOW">Fee: Low to High</option>
                      <option value="PRICE_HIGH">Fee: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count & Trust Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.92rem', color: '#475569', fontWeight: 700 }}>
                Showing <strong style={{ color: '#0F172A' }}>{filteredTutors.length}</strong> verified educators in Gurgaon
                {isFilterActive && <span style={{ color: '#0F6E56', marginLeft: '0.4rem' }}>(Filter Applied)</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                <ShieldCheck size={16} />
                <span>100% Background Verified by SSSAM Academy</span>
              </div>
            </div>

            {/* DIRECTORY GRID */}
            {paginatedTutors.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px dashed #CBD5E1',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: '#64748B',
                boxShadow: 'var(--shadow-subtle)',
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#0F6E56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}>
                  <Search size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  No educators match your exact search criteria
                </h3>
                <p style={{ fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
                  Our academic counselors can handpick and assign a verified subject specialist for your child within 2 hours.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="btn btn-secondary"
                  >
                    Reset All Filters
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenBooking()}
                    className="btn btn-primary"
                    style={{ backgroundColor: '#0F6E56' }}
                  >
                    <span>Request Custom Tutor Match</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.75rem',
              }}>
                {paginatedTutors.map((tutor) => (
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
                    {/* Top Bar with Avatar and Badges */}
                    <div style={{ padding: '1.25rem', paddingBottom: '0.65rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#64748B' }}>
                          <Star size={13} color="#F59E0B" fill="#F59E0B" />
                          <strong style={{ color: '#0F172A' }}>{tutor.rating}</strong>
                          <span>({tutor.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Education & Experience Stat Box */}
                    <div style={{ padding: '1.25rem', paddingTop: '0.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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

                      <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginTop: '0.1rem' }}>
                        <MapPin size={15} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
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

                      {/* 60s Video Intro Pill (Optional) */}
                      {tutor.introVideoUrl && tutor.introVideoUrl.trim() !== '' ? (
                        <button
                          type="button"
                          onClick={() => setActiveVideoTutor(tutor)}
                          style={{
                            marginTop: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.6rem 0.85rem',
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
                            <span>Watch 60s Intro Video</span>
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
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            color: '#0F6E56',
                            fontSize: '0.78rem',
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
                      padding: '1.1rem 1.25rem',
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

                        {(!tutor.teachingMode || tutor.teachingMode === 'BOTH' || (tutor.hourlyRateHome && tutor.hourlyRateOnline)) ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            {/* Home Tuition Rate */}
                            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px', backgroundColor: '#F0FDF4', padding: '2px 6px', borderRadius: '6px' }}>
                              <span style={{ fontSize: '0.7rem', color: '#0F6E56', fontWeight: 800 }}>🏠 Home:</span>
                              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                                {tutor.hourlyRateHomeMin && tutor.hourlyRateHomeMax && tutor.hourlyRateHomeMin !== tutor.hourlyRateHomeMax
                                  ? `₹${tutor.hourlyRateHomeMin}–${tutor.hourlyRateHomeMax}`
                                  : `₹${tutor.hourlyRateHome || tutor.hourlyRateHomeMin || 600}`}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>/hr</span>
                            </div>

                            {/* Online Tuition Rate */}
                            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '2px', backgroundColor: '#F0F9FF', padding: '2px 6px', borderRadius: '6px' }}>
                              <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 800 }}>💻 Online:</span>
                              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                                {tutor.hourlyRateOnlineMin && tutor.hourlyRateOnlineMax && tutor.hourlyRateOnlineMin !== tutor.hourlyRateOnlineMax
                                  ? `₹${tutor.hourlyRateOnlineMin}–${tutor.hourlyRateOnlineMax}`
                                  : `₹${tutor.hourlyRateOnline || tutor.hourlyRateOnlineMin || 400}`}
                              </span>
                              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 600 }}>/hr</span>
                            </div>
                          </div>
                        ) : tutor.teachingMode === 'ONLINE_LIVE' ? (
                          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '3px', backgroundColor: '#F0F9FF', padding: '3px 8px', borderRadius: '6px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 800 }}>💻 Online 1-on-1:</span>
                            <span style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                              {tutor.hourlyRateOnlineMin && tutor.hourlyRateOnlineMax && tutor.hourlyRateOnlineMin !== tutor.hourlyRateOnlineMax
                                ? `₹${tutor.hourlyRateOnlineMin} – ₹${tutor.hourlyRateOnlineMax}`
                                : `₹${tutor.hourlyRateOnline || tutor.hourlyRateOnlineMin || 400}`}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>/hr</span>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '3px', backgroundColor: '#F0FDF4', padding: '3px 8px', borderRadius: '6px' }}>
                            <span style={{ fontSize: '0.74rem', color: '#0F6E56', fontWeight: 800 }}>🏠 Home Visit:</span>
                            <span style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0F172A' }}>
                              {tutor.hourlyRateHomeMin && tutor.hourlyRateHomeMax && tutor.hourlyRateHomeMin !== tutor.hourlyRateHomeMax
                                ? `₹${tutor.hourlyRateHomeMin} – ₹${tutor.hourlyRateHomeMax}`
                                : `₹${tutor.hourlyRateHome || tutor.hourlyRateHomeMin || 600}`}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>/hr</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          href={`/tutors/${tutor.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.45rem 0.7rem', fontSize: '0.8rem' }}
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleOpenBooking(tutor)}
                          className="btn btn-primary btn-sm"
                          style={{ backgroundColor: '#0F6E56' }}
                        >
                          <span>Request</span>
                          <div className="btn-arrow">
                            <ChevronRight size={14} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

            {/* =========================================================================
                BOTTOM CONCIERGE ASSISTANCE CARD: CAN'T FIND EXACT TUTOR?
                ========================================================================= */}
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
                  <span>Request Custom Tutor Match</span>
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
