'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Phone, Home, Video, Building2, User, ChevronRight, MapPin, Crosshair, Search } from 'lucide-react';
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

export default function BookingModal({
  isOpen = true,
  onClose,
  isInline = false,
  initialData,
}: BookingModalProps) {
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
          locality: mode === 'CENTER' ? 'SSSAM Academy Sector 14 Center' : locality || 'Gurgaon',
          formattedAddress: formattedAddress || locality || 'Gurgaon',
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
        <div style={{ padding: isInline ? '1.85rem 2rem' : '1.65rem 2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '1rem', paddingRight: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
              {initialData?.tutorName ? `Book ${initialData.tutorName}` : 'Request a Home Tutor'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Academic counselor calls within <strong>30 minutes</strong> for personalized matching
            </p>
          </div>

          {/* Selected Tutor Mini Strip */}
          {initialData?.tutorName && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              borderRadius: '12px',
              padding: '0.55rem 0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                {initialData.tutorAvatar ? (
                  <img src={initialData.tutorAvatar} alt={initialData.tutorName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #059669', flexShrink: 0 }} />
                ) : (
                  <User size={18} color="#059669" />
                )}
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#065F46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  🎯 Selected: <strong>{initialData.tutorName}</strong> {initialData.tutorRate ? `(₹${initialData.tutorRate}/hr)` : ''}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#047857', backgroundColor: '#DCFCE7', padding: '0.2rem 0.55rem', borderRadius: '6px', flexShrink: 0 }}>
                Priority Match
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Preferred Mode (Segmented Tabs) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '12px' }}>
              {modeOptions.map(({ key, icon, label }) => {
                const isSelected = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    style={{
                      padding: '0.6rem 0.4rem',
                      borderRadius: '9px',
                      border: 'none',
                      backgroundColor: isSelected ? '#0F6E56' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(15,110,86,0.25)' : 'none',
                    }}
                  >
                    {icon}
                    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Location Row */}
            {mode === 'HOME' ? (
              <div
                onClick={() => setShowLocationPicker(true)}
                style={{
                  border: (locationCoords || formattedAddress || locality) ? '1.5px solid #059669' : '1.5px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '0.65rem 1rem',
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
                      {formattedAddress || locality || 'Tap to select location on map'}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F6E56', backgroundColor: '#ECFDF5', padding: '0.25rem 0.65rem', borderRadius: '8px', flexShrink: 0 }}>
                  {(locationCoords || formattedAddress || locality) ? 'Change' : 'Set Location'}
                </span>
              </div>
            ) : (
              mode !== 'CENTER' && (
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="form-control"
                  style={{ fontSize: '0.9rem', padding: '0.7rem 0.95rem', borderRadius: '12px', minHeight: '48px' }}
                >
                  <option value="">Select your sector...</option>
                  {GURGAON_LOCALITIES.map((l) => (
                    <option key={l.name} value={l.name}>{l.name}</option>
                  ))}
                </select>
              )
            )}

            {/* Class & Subject (2 Columns on Desktop, 1 Column on Mobile) */}
            <div className="booking-form-grid">
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

              <SearchableSelect
                placeholder={grade ? "Select Subject..." : "Select Class first..."}
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
                  placeholder="Your Name *"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '2.4rem', fontSize: '0.92rem', paddingBlock: '0.7rem', borderRadius: '12px', minHeight: '48px', width: '100%' }}
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
                  style={{ paddingLeft: '2.4rem', fontSize: '0.92rem', paddingBlock: '0.7rem', borderRadius: '12px', minHeight: '48px', width: '100%' }}
                  required
                />
              </div>
            </div>

            {phoneError && (
              <div style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '0.82rem', fontWeight: 700 }}>
                ⚠️ {phoneError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.85rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: loading ? '#94A3B8' : '#0F6E56',
                color: '#FFFFFF',
                fontWeight: 800, fontSize: '0.96rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(15,110,86,0.3)',
                transition: 'all 0.15s ease',
                marginTop: '0.2rem',
                minHeight: '48px',
              }}
            >
              <span>{loading ? 'Submitting...' : 'Submit Request — Get Callback'}</span>
              {!loading && <ChevronRight size={17} />}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F6E56, #2DD4BF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}>
            <CheckCircle2 size={28} color="white" />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '0.35rem' }}>
            Request Received! 🎉
          </h3>
          <p style={{ color: '#515154', fontSize: '0.84rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
            Our counselor will call <strong>+91 {phone}</strong> within <strong>30 minutes</strong> to match verified tutors for <strong>{grade} · {subject}</strong> in <strong>{locality}</strong>.
          </p>

          <div style={{
            backgroundColor: '#F8FAFC', border: '1px solid #E8E8ED',
            borderRadius: '10px', padding: '0.65rem 0.9rem',
            textAlign: 'center', marginBottom: '1rem', fontSize: '0.8rem', color: '#475569',
          }}>
            📞 Direct SSSAM Support: <strong style={{ color: '#0F6E56' }}>{SSSAM_OFFICE_DETAILS.phones[0]}</strong>
          </div>

            {onClose ? (
              <button
                onClick={onClose}
                style={{
                  width: '100%', padding: '0.85rem',
                  borderRadius: '999px', border: '1.5px solid #E8E8ED',
                  backgroundColor: '#FFFFFF', color: '#1D1D1F',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                }}
              >
                Back to Website
              </button>
            ) : (
              <a
                href="/"
                style={{
                  display: 'block', width: '100%', padding: '0.85rem',
                  borderRadius: '999px', border: '1.5px solid #E8E8ED',
                  backgroundColor: '#FFFFFF', color: '#1D1D1F',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGPS || isReverseGeocoding}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                border: '1.5px solid #059669',
                backgroundColor: '#ECFDF5',
                color: '#047857',
                fontWeight: 800,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 2px 6px rgba(5,150,105,0.12)',
              }}
            >
              <Crosshair size={12} />
              <span>{isDetectingGPS || isReverseGeocoding ? 'Detecting...' : 'Get Current Location'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLocationPicker(false)}
              style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.4rem', cursor: 'pointer', display: 'flex' }}
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

        {/* Map */}
        <div
          ref={pickerMapRef}
          style={{ height: '240px', width: '100%', position: 'relative', zIndex: 10, backgroundColor: '#E2E8F0' }}
        />

        {/* Address + Actions */}
        <div style={{ padding: '1.1rem 1.25rem' }}>
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
