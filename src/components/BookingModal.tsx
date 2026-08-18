'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, Home, Video, Building2, User, ChevronRight, MapPin, Crosshair, Search, Globe } from 'lucide-react';
import SearchableSelect from '@/components/SearchableSelect';
import { GURGAON_LOCALITIES, SUBJECT_OPTIONS, CLASS_OPTIONS, SSSAM_OFFICE_DETAILS, getSubjectsForClass } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

export interface BookingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
  initialData?: {
    tutorName?: string;
    tutorAvatar?: string;
    tutorDegree?: string;
    tutorRate?: number;
    tutorId?: string;
    grade?: string;
    mode?: string;
    subject?: string;
    locality?: string;
  };
}

const POPULAR_GURGAON_SECTORS = [
  { name: 'DLF Phase 5', landmark: 'The Aralias, Magnolias, Horizon Centre', lat: 28.4552, lng: 77.0945 },
  { name: 'Golf Course Road', landmark: 'Sector 42, One Horizon, Mega Mall', lat: 28.4595, lng: 77.0988 },
  { name: 'DLF Phase 1', landmark: 'Silver Oaks, Qutab Plaza', lat: 28.4795, lng: 77.1025 },
  { name: 'DLF Phase 2', landmark: 'Cyber City, Jacaranda Marg', lat: 28.4895, lng: 77.0895 },
  { name: 'DLF Phase 4', landmark: 'Galleria Market, Supermart 1 & 2', lat: 28.4685, lng: 77.0855 },
  { name: 'Sector 14 & Old DLF', landmark: 'SSSAM Academy Center, Sector 14 Market', lat: 28.4728, lng: 77.0345 },
  { name: 'Sector 56', landmark: 'HUDA Market, Rapid Metro, Kendriya Vihar', lat: 28.4315, lng: 77.1035 },
  { name: 'Sector 57', landmark: 'Hong Kong Bazaar, Sushant Lok 3', lat: 28.4255, lng: 77.0885 },
  { name: 'Sector 50 / Nirvana Country', landmark: 'Unitech Fresco, South City 2', lat: 28.4185, lng: 77.0655 },
  { name: 'Sector 48 / Sohna Road', landmark: 'Vipul Greens, Central Park 2, JMD Megapolis', lat: 28.4205, lng: 77.0395 },
  { name: 'Sushant Lok 1', landmark: 'Gold Souk, Vyapar Kendra, Fortis Hospital', lat: 28.4615, lng: 77.0785 },
  { name: 'Palam Vihar', landmark: 'Ansal Plaza, Chiranjiv Bharati School', lat: 28.5095, lng: 77.0425 },
  { name: 'New Gurgaon (Sector 82-84)', landmark: 'Vatika India Next, Mapsko Mount Ville', lat: 28.3895, lng: 76.9655 },
];

function formatNameCase(name?: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

export default function BookingModal({
  isOpen = true,
  onClose,
  isInline = false,
  initialData,
}: BookingModalProps) {
  const tutorDisplayName = formatNameCase(initialData?.tutorName);
  const [mode, setMode] = useState<'HOME' | 'ONLINE' | 'CENTER'>(
    initialData?.mode === 'ONLINE' ? 'ONLINE' : initialData?.mode === 'CENTER' ? 'CENTER' : 'HOME'
  );
  const [grade, setGrade] = useState(initialData?.grade || '');
  const [subject, setSubject] = useState(initialData?.subject || '');
  const [locality, setLocality] = useState(initialData?.locality || '');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; landmark?: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Location state for GPS coordinates
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Leaflet refs
  const [L, setL] = useState<any>(null);
  const pickerMapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);

  // Preload Leaflet on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((mod) => setL(mod.default));
    }
  }, []);

  // Reverse Geocoding using Nominatim
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data?.address) {
        const a = data.address;
        const parts: string[] = [];
        if (a.neighbourhood) parts.push(a.neighbourhood);
        else if (a.suburb) parts.push(a.suburb);
        if (a.road) parts.push(a.road);
        if (a.city || a.town || a.village) parts.push(a.city || a.town || a.village);
        if (a.state_district) parts.push(a.state_district);
        return parts.length > 0 ? parts.join(', ') : (data.display_name || 'Gurugram, Haryana');
      }
      return data.display_name || 'Gurugram, Haryana';
    } catch {
      return 'Gurugram, Haryana';
    }
  };

  // Search handler for Gurgaon sectors & landmarks
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const localMatches = POPULAR_GURGAON_SECTORS.filter(
      (s) => s.name.toLowerCase().includes(q) || s.landmark.toLowerCase().includes(q)
    );

    setSearchResults(localMatches);

    if (q.length >= 3) {
      setIsSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Gurgaon')}&countrycodes=in&limit=4`, {
        headers: { 'Accept-Language': 'en' }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const osmResults = data.map((item) => ({
              name: item.display_name.split(',')[0],
              landmark: item.display_name.split(',').slice(1, 3).join(',').trim(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));

            const existingNames = new Set(localMatches.map((m) => m.name.toLowerCase()));
            const uniqueOsm = osmResults.filter((o) => !existingNames.has(o.name.toLowerCase()));
            setSearchResults([...localMatches, ...uniqueOsm]);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }
  };

  const handleSelectSearchResult = (result: { name: string; landmark?: string; lat: number; lng: number }) => {
    setLocationCoords({ lat: result.lat, lng: result.lng });
    const fullAddr = result.name + (result.landmark ? ` (${result.landmark})` : '') + ', Gurugram';
    setFormattedAddress(fullAddr);
    setLocality(result.name);
    setSearchQuery('');
    setSearchResults([]);

    if (leafletMapInstanceRef.current && leafletMarkerRef.current) {
      leafletMapInstanceRef.current.setView([result.lat, result.lng], 16);
      leafletMarkerRef.current.setLatLng([result.lat, result.lng]);
    }
  };

  // Init location picker map when popup opens
  useEffect(() => {
    if (!showLocationPicker || !pickerMapRef.current || !L) return;

    const timer = setTimeout(() => {
      if (!pickerMapRef.current) return;
      const defaultCenter = locationCoords || { lat: 28.4728, lng: 77.0345 };

      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
      if ((pickerMapRef.current as any)._leaflet_id) {
        delete (pickerMapRef.current as any)._leaflet_id;
      }

      const pMap = L.map(pickerMapRef.current, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });
      leafletMapInstanceRef.current = pMap;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(pMap);

      const markerIcon = L.divIcon({
        className: 'booking-location-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.5); cursor: grab;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
            <div style="width: 3px; height: 14px; background: #2563EB; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [36, 50],
        iconAnchor: [18, 50],
      });

      const marker = L.marker([defaultCenter.lat, defaultCenter.lng], {
        icon: markerIcon,
        draggable: true,
      }).addTo(pMap);

      leafletMarkerRef.current = marker;

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setLocationCoords({ lat: pos.lat, lng: pos.lng });
        setIsReverseGeocoding(true);
        const addr = await reverseGeocode(pos.lat, pos.lng);
        setFormattedAddress(addr);
        setLocality(addr.split(',')[0].trim());
        setIsReverseGeocoding(false);
      });

      pMap.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setLocationCoords({ lat, lng });
        setIsReverseGeocoding(true);
        const addr = await reverseGeocode(lat, lng);
        setFormattedAddress(addr);
        setLocality(addr.split(',')[0].trim());
        setIsReverseGeocoding(false);
      });

      setTimeout(() => {
        if (pMap) pMap.invalidateSize();
      }, 150);
    }, 150);

    return () => clearTimeout(timer);
  }, [showLocationPicker, L]);

  // Cleanup picker map
  useEffect(() => {
    if (!showLocationPicker) {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    }
  }, [showLocationPicker]);

  const handleDetectGPS = () => {
    if (!('geolocation' in navigator)) return;
    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocationCoords({ lat, lng });

        if (leafletMapInstanceRef.current && leafletMarkerRef.current) {
          leafletMapInstanceRef.current.setView([lat, lng], 16);
          leafletMarkerRef.current.setLatLng([lat, lng]);
        }

        setIsReverseGeocoding(true);
        const addr = await reverseGeocode(lat, lng);
        setFormattedAddress(addr);
        setLocality(addr.split(',')[0].trim());
        setIsReverseGeocoding(false);
        setIsDetectingGPS(false);
      },
      () => {
        setIsDetectingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grade) {
      setPhoneError('Please select Class / Grade.');
      return;
    }

    if (!subject) {
      setPhoneError('Please select Subject.');
      return;
    }

    if (mode === 'HOME' && !locationCoords && !formattedAddress && !locality) {
      setPhoneError('Please tap "Set Location" to select your sector on the map.');
      return;
    }

    if (!parentName.trim()) {
      setPhoneError('Please enter your full name.');
      return;
    }

    if (!phone || phone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setPhoneError('');
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName || 'Parent (Gurgaon)',
          parentPhone: phone,
          preferredMode: mode === 'HOME' ? 'OFFLINE_HOME' : mode === 'ONLINE' ? 'ONLINE_LIVE' : 'BOTH',
          locality: mode === 'CENTER' ? 'SSSAM Academy Sector 14 Center' : mode === 'ONLINE' ? 'Online (Remote / Pan-India)' : locality || 'Gurgaon',
          formattedAddress: mode === 'ONLINE' ? 'Online Live 1-on-1 Session' : formattedAddress || locality || 'Gurgaon',
          latitude: locationCoords?.lat || null,
          longitude: locationCoords?.lng || null,
          gradeClass: grade,
          board: 'CBSE',
          subjectsNeeded: [subject],
          assignedTutorName: initialData?.tutorName || null,
          requestedTutorName: initialData?.tutorName || null,
          requestedTutorId: initialData?.tutorId || null,
        }),
      });
    } catch (err) {
      console.error('[LEAD_SUBMIT_ERROR]:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  const modeOptions = [
    { key: 'HOME', icon: <Home size={16} />, label: 'Home Visit' },
    { key: 'ONLINE', icon: <Video size={16} />, label: 'Online 1-on-1' },
    { key: 'CENTER', icon: <Building2 size={16} />, label: 'Center Visit' },
  ] as const;

  if (!isOpen && !isInline) return null;

  const modalContent = (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: isInline ? '22px' : '24px',
      maxWidth: isInline ? '660px' : '660px',
      width: '100%',
      margin: isInline ? '0 auto' : undefined,
      boxShadow: isInline ? '0 16px 40px rgba(13, 148, 136, 0.08)' : '0 28px 72px rgba(0,0,0,0.24)',
      border: '1px solid #E2E8F0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #0F6E56 0%, #2DD4BF 50%, #0891B2 100%)',
      }} />

      {onClose && !isInline && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Modal"
          style={{
            position: 'absolute', top: '1rem', right: '1.15rem',
            width: '38px', height: '38px', borderRadius: '50%',
            border: '2px solid #FFFFFF', backgroundColor: '#0F172A',
            color: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 99999,
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <X size={18} color="#FFFFFF" strokeWidth={3} />
        </button>
      )}

      {!submitted ? (
        <div style={{ padding: isInline ? '2rem 2.25rem' : '1.75rem 2.25rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '1.25rem', paddingRight: onClose && !isInline ? '2.5rem' : '0' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 800, color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              <ShieldCheck size={14} color="#0F6E56" />
              <span>TUITIONFORHOME OFFICIAL MATCHING</span>
            </div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
              {tutorDisplayName ? `Book Trial Class with ${tutorDisplayName}` : 'Request a Verified Home & Online Tutor'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Academic counselor calls within <strong>30 minutes</strong> for personalized teacher alignment.
            </p>
          </div>

          {/* Selected Tutor Premium Card */}
          {tutorDisplayName && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 8px rgba(5,150,105,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                {initialData?.tutorAvatar ? (
                  <img src={initialData.tutorAvatar} alt={tutorDisplayName} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#0F6E56', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>
                    {tutorDisplayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#065F46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tutorDisplayName}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      ✓ Verified
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#047857' }}>
                    {initialData?.tutorDegree ? `${initialData.tutorDegree} • ` : ''}Target Tutor Request
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', backgroundColor: '#DCFCE7', padding: '0.25rem 0.65rem', borderRadius: '6px', flexShrink: 0 }}>
                Priority Match
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Preferred Mode (Segmented Tabs) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              {modeOptions.map(({ key, icon, label }) => {
                const isSelected = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    style={{
                      padding: '0.65rem 0.4rem',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: isSelected ? '#0F6E56' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(15,110,86,0.3)' : 'none',
                    }}
                  >
                    {icon}
                    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Mode-Specific Location / Sector View */}
            {mode === 'HOME' ? (
              <div
                onClick={() => setShowLocationPicker(true)}
                style={{
                  border: (locationCoords || formattedAddress || locality) ? '1.5px solid #059669' : '1.5px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: (locationCoords || formattedAddress || locality) ? '#F0FDF4' : '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  minHeight: '48px',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <MapPin size={18} color={(locationCoords || formattedAddress || locality) ? '#059669' : '#94A3B8'} style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: (locationCoords || formattedAddress || locality) ? 800 : 500, color: (locationCoords || formattedAddress || locality) ? '#0F172A' : '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {formattedAddress || locality || 'Tap to select home sector on map'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F6E56', backgroundColor: '#ECFDF5', padding: '0.25rem 0.65rem', borderRadius: '8px', flexShrink: 0 }}>
                  {(locationCoords || formattedAddress || locality) ? 'Change' : 'Set Location'}
                </span>
              </div>
            ) : mode === 'ONLINE' ? (
              <div
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#F0F9FF',
                  border: '1.5px solid #BAE6FD',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.84rem',
                  color: '#0369A1',
                  fontWeight: 700,
                  minHeight: '48px',
                }}
              >
                <Globe size={18} color="#0284C7" style={{ flexShrink: 0 }} />
                <span>🌐 Online Live 1-on-1 Class (Connect from anywhere on Zoom/Google Meet)</span>
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#FEF3C7',
                  border: '1.5px solid #FDE68A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.84rem',
                  color: '#92400E',
                  fontWeight: 700,
                  minHeight: '48px',
                }}
              >
                <Building2 size={18} color="#D97706" style={{ flexShrink: 0 }} />
                <span>🏢 SSSAM Center: M24 Ground Floor, Sector 14, Gurugram</span>
              </div>
            )}

            {/* Class Selection (Full Width so full text is visible) */}
            <div>
              <SearchableSelect
                placeholder="Select Class / Grade..."
                options={CLASS_OPTIONS}
                value={grade}
                onChange={(newGrade) => {
                  setGrade(newGrade);
                  const newSubs = getSubjectsForClass(newGrade);
                  if (!newSubs.includes(subject)) {
                    setSubject(newSubs[0] || '');
                  }
                }}
                required
              />
            </div>

            {/* Subject Selection (Full Width so full text is visible) */}
            <div>
              <SearchableSelect
                placeholder={grade ? "Select Subject..." : "Select Class first to view subjects..."}
                options={grade ? getSubjectsForClass(grade) : SUBJECT_OPTIONS}
                value={subject}
                onChange={setSubject}
                required
              />
            </div>

            {/* Parent Name & Phone (2 Columns on Desktop, 1 Column on Mobile) */}
            <div className="booking-form-grid">
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  value={parentName}
                  onChange={(e) => {
                    const val = e.target.value;
                    const capitalized = val.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
                    setParentName(capitalized);
                  }}
                  autoCapitalize="words"
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.92rem', paddingBlock: '0.75rem', borderRadius: '12px', minHeight: '48px', width: '100%', border: '1.5px solid #CBD5E1', textTransform: 'capitalize' }}
                  required
                />
              </div>

              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="tel"
                  placeholder="10-digit Mobile Number *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.92rem', paddingBlock: '0.75rem', borderRadius: '12px', minHeight: '48px', width: '100%', border: '1.5px solid #CBD5E1' }}
                  required
                />
              </div>
            </div>

            {phoneError && (
              <div style={{ padding: '0.65rem 0.95rem', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>⚠️</span>
                <span>{phoneError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.95rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)',
                color: '#FFFFFF',
                fontWeight: 800, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(15,110,86,0.35)',
                transition: 'all 0.15s ease',
                marginTop: '0.25rem',
                minHeight: '50px',
              }}
            >
              <span>{loading ? 'Submitting...' : 'Submit Request — Get Callback'}</span>
              {!loading && <ChevronRight size={18} />}
            </button>

            {/* Micro-Trust Badges */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.4rem', fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={13} color="#059669" />
                <span>Verified Tutors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={13} color="#059669" />
                <span>30-Min Fast Response</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={13} color="#059669" />
                <span>100% Parent Privacy</span>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ padding: '2.5rem 1.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <style>{`
            @keyframes bookSuccessPop {
              0% { transform: scale(0.5); opacity: 0; }
              70% { transform: scale(1.12); opacity: 1; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bookRippleGlow {
              0% { transform: scale(0.95); opacity: 0.8; }
              100% { transform: scale(1.6); opacity: 0; }
            }
            @keyframes floatStarA {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(12deg); }
            }
            @keyframes floatStarB {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(-14deg); }
            }
          `}</style>

          {/* Animated Pop-in Success Badge */}
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.25rem auto' }}>
            <div style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              animation: 'bookRippleGlow 2.4s infinite cubic-bezier(0.16, 1, 0.3, 1)',
            }} />
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '14px',
              left: '14px',
              boxShadow: '0 10px 24px rgba(5, 150, 105, 0.3)',
              animation: 'bookSuccessPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            }}>
              <CheckCircle2 size={38} color="#FFFFFF" strokeWidth={2.5} />
            </div>
            <span style={{ position: 'absolute', top: '0px', left: '-4px', fontSize: '1.2rem', animation: 'floatStarA 2.5s ease-in-out infinite' }}>🎉</span>
            <span style={{ position: 'absolute', top: '4px', right: '-2px', fontSize: '1.1rem', animation: 'floatStarB 2.7s ease-in-out infinite 0.3s' }}>✨</span>
            <span style={{ position: 'absolute', bottom: '2px', left: '0px', fontSize: '1.1rem', animation: 'floatStarB 2.4s ease-in-out infinite 0.6s' }}>⭐</span>
            <span style={{ position: 'absolute', bottom: '0px', right: '2px', fontSize: '1.15rem', animation: 'floatStarA 2.6s ease-in-out infinite 0.2s' }}>🎊</span>
          </div>

          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.4rem', letterSpacing: '-0.3px' }}>
            Demo Request Received! 🎉
          </h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
            Our academic counselor will call <strong style={{ color: '#0F172A' }}>+91 {phone}</strong> within <strong style={{ color: '#0F6E56' }}>30 minutes</strong> to align top-rated verified tutors for <strong style={{ color: '#0F172A' }}>{grade || 'Your Class'}{subject ? ` · ${subject}` : ''}</strong> in <strong style={{ color: '#0F172A' }}>{locality || 'Gurugram'}</strong>.
          </p>

          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
          }}>
            <Phone size={15} color="#15803D" />
            <span>Direct Support: <strong style={{ color: '#14532D' }}>+91 92170 31899</strong> (Mon–Sun 9 AM–9 PM)</span>
          </div>

          {onClose ? (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--brand-teal)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(15, 110, 86, 0.25)',
              }}
            >
              Done &amp; Continue
            </button>
          ) : (
            <a
              href="/"
              style={{
                display: 'block',
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--brand-teal)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(15, 110, 86, 0.25)',
              }}
            >
              Back to Home
            </a>
          )}
        </div>
        )}
      </div>
    );

  const locationPickerModal = showLocationPicker && (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2500,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setShowLocationPicker(false); }}
    >
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.1rem 1.25rem 0.9rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '0.65rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
              📍 Select Your Location
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Search sector, drag pin, or tap on map
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setShowLocationPicker(false)}
              aria-label="Close location picker"
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.45rem', cursor: 'pointer', display: 'flex', transition: 'background 0.15s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
            >
              <X size={18} color="#64748B" />
            </button>
          </div>
        </div>

        {/* Sector / Landmark Search Box */}
        <div style={{ padding: '0.65rem 1.15rem 0.45rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search Gurgaon sector (e.g. Sector 56, DLF Phase 5)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '2.2rem',
                paddingRight: searchQuery ? '1.8rem' : '0.65rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                backgroundColor: '#FFFFFF',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '1.15rem',
              right: '1.15rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
              border: '1.5px solid #E2E8F0',
              zIndex: 100,
              maxHeight: '180px',
              overflowY: 'auto',
              marginTop: '3px',
            }}>
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectSearchResult(res)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                >
                  <MapPin size={13} color="#059669" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0F172A' }}>
                      {res.name}
                    </div>
                    {res.landmark && (
                      <div style={{ fontSize: '0.7rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {res.landmark}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Map Container with Floating GPS Target Button */}
        <div style={{ position: 'relative', width: '100%', height: '240px' }}>
          <div
            ref={pickerMapRef}
            style={{ height: '100%', width: '100%', zIndex: 10, backgroundColor: '#E2E8F0' }}
          />

          <style>{`
            @keyframes gpsFloatingPulse {
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
            @keyframes gpsIconSpin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>

          {/* Sleek Floating Animated GPS Button right on map */}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetectingGPS || isReverseGeocoding}
            title="Auto-detect current GPS location"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              zIndex: 1000,
              padding: '0.45rem 0.9rem',
              borderRadius: '999px',
              border: 'none',
              background: isDetectingGPS || isReverseGeocoding 
                ? '#94A3B8' 
                : 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: isDetectingGPS || isReverseGeocoding ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              animation: isDetectingGPS || isReverseGeocoding ? 'none' : 'gpsFloatingPulse 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
              transition: 'all 0.2s ease',
            }}
          >
            <Crosshair
              size={14}
              color="#FFFFFF"
              style={{
                animation: (isDetectingGPS || isReverseGeocoding) ? 'gpsIconSpin 1s linear infinite' : 'none',
                flexShrink: 0,
              }}
            />
            <span>{isDetectingGPS || isReverseGeocoding ? 'Locating...' : '📍 My Location'}</span>
          </button>
        </div>

        {/* Address + Actions */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '0.75rem 0.9rem',
            marginBottom: '0.85rem',
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
              DETECTED ADDRESS
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {isReverseGeocoding ? (
                <span style={{ color: '#94A3B8', fontWeight: 600 }}>Detecting address...</span>
              ) : (
                <>
                  <CheckCircle2 size={14} color="#059669" />
                  <span>{formattedAddress || 'Tap on map or drag pin'}</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLocationPicker(false)}
            disabled={!locationCoords || isReverseGeocoding}
            style={{
              width: '100%', padding: '0.8rem',
              borderRadius: '12px', border: 'none',
              background: locationCoords ? '#0F6E56' : '#CBD5E1',
              color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem',
              cursor: locationCoords ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
              boxShadow: locationCoords ? '0 4px 14px rgba(15,110,86,0.3)' : 'none',
            }}
          >
            <CheckCircle2 size={15} />
            <span>Confirm Location</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <>
        {modalContent}
        {locationPickerModal}
      </>
    );
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        backgroundColor: 'rgba(15,23,42,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem 1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
    >
      {modalContent}
      {locationPickerModal}
    </div>
  );
}
