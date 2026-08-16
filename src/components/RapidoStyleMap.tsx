'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Navigation, X, CheckCircle2, ShieldCheck, MapPin, ArrowUpRight, Crosshair, Search } from 'lucide-react';
import { VERIFIED_TUTORS, MockTutor } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

interface RapidoStyleMapProps {
  onLocationSelected: (data: { address: string; lat: number; lng: number; nearestTutorsCount: number }) => void;
  isCompact?: boolean;
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
  { name: 'Sector 49', landmark: 'South City 2, Orchid Petals, Vatika City', lat: 28.4125, lng: 77.0515 },
  { name: 'Sector 31', landmark: 'HUDA Market, Sector 31 Gurgaon', lat: 28.4555, lng: 77.0505 },
  { name: 'Sector 45', landmark: 'Greenwoods City, DPS Gurgaon', lat: 28.4485, lng: 77.0715 },
  { name: 'Sector 46', landmark: 'Amity International School, Sector 46', lat: 28.4415, lng: 77.0625 },
];

export default function RapidoStyleMap({ onLocationSelected, isCompact = false }: RapidoStyleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupMapRef = useRef<HTMLDivElement>(null);

  // Leaflet references
  const [L, setL] = useState<any>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletPopupMapInstanceRef = useRef<any>(null);
  const leafletPopupMarkerRef = useRef<any>(null);

  // State values
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('DLF Phase 5, Golf Course Road, Gurugram');
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<MockTutor | null>(null);

  // Location popup state
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [popupAddress, setPopupAddress] = useState('');
  const [popupCoords, setPopupCoords] = useState({ lat: 28.4728, lng: 77.0345 });
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; landmark?: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Current coordinates (Center of Gurgaon, Haryana)
  const [currentCoords, setCurrentCoords] = useState({ lat: 28.4728, lng: 77.0345 });

  // 1. Fetch live verified tutors
  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors) && data.tutors.length > 0) {
          setDynamicTutors(data.tutors);
          setSelectedTutor(data.tutors[0]);
        } else {
          setDynamicTutors([]);
          setSelectedTutor(null);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch live tutors for map:', err);
        setDynamicTutors([]);
        setSelectedTutor(null);
      });
  }, []);

  // 2. Preload Leaflet on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((mod) => {
        setL(mod.default);
      });
    }
  }, []);

  // Reverse Geocoding with OSM Nominatim
  const handleReverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
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
  }, []);

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

    // If query has 3+ chars, also query Nominatim for additional specific landmarks
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

            // Merge local matches and OSM matches without duplicate names
            const existingNames = new Set(localMatches.map((m) => m.name.toLowerCase()));
            const uniqueOsm = osmResults.filter((o) => !existingNames.has(o.name.toLowerCase()));
            setSearchResults([...localMatches, ...uniqueOsm]);
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false));
    }
  };

  // Select search result
  const handleSelectSearchResult = (result: { name: string; landmark?: string; lat: number; lng: number }) => {
    setPopupCoords({ lat: result.lat, lng: result.lng });
    setPopupAddress(result.name + (result.landmark ? ` (${result.landmark})` : '') + ', Gurugram');
    setSearchQuery('');
    setSearchResults([]);

    if (leafletPopupMapInstanceRef.current && leafletPopupMarkerRef.current) {
      leafletPopupMapInstanceRef.current.setView([result.lat, result.lng], 16);
      leafletPopupMarkerRef.current.setLatLng([result.lat, result.lng]);
    }
  };

  // =========================================================================
  // MAIN MAP INITIALIZATION (100% PURE OPENSTREETMAP LEAFLET)
  // =========================================================================
  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.remove();
      leafletMapInstanceRef.current = null;
    }
    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [currentCoords.lat, currentCoords.lng],
      zoom: 14,
      zoomControl: !isCompact,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; OpenStreetMap &copy; CARTO',
    }).addTo(map);

    leafletMapInstanceRef.current = map;

    // Trigger invalidateSize to ensure tiles render immediately
    map.invalidateSize();
    setTimeout(() => { if (map) map.invalidateSize(); }, 100);
    setTimeout(() => { if (map) map.invalidateSize(); }, 300);
    setTimeout(() => { if (map) map.invalidateSize(); }, 800);

    // Parent pin
    try {
      const parentIcon = L.divIcon({
        className: 'custom-parent-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(37,99,235,0.45);">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker([currentCoords.lat, currentCoords.lng], { icon: parentIcon }).addTo(map);
    } catch (e) {
      console.warn('Parent marker error:', e);
    }

    // Tutor pins
    const nearbyTutorsList = Array.isArray(dynamicTutors) ? dynamicTutors.slice(0, 12) : [];
    nearbyTutorsList.forEach((tutor, idx) => {
      try {
        let tLat = tutor.latitude;
        let tLng = tutor.longitude;

        if (!tLat || !tLng) {
          const angle = idx * 2.399963;
          const distanceKm = 0.8 + idx * 0.32;
          tLat = currentCoords.lat + (distanceKm / 110.85) * Math.sin(angle);
          tLng = currentCoords.lng + (distanceKm / 97.8) * Math.cos(angle);
        }

        const tutorName = tutor?.name || 'Verified Tutor';
        const tutorAvatar = tutor?.avatarUrl || '';
        const initial = tutorName.charAt(0).toUpperCase() || 'T';

        const tutorIcon = L.divIcon({
          className: 'custom-tutor-pin',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="position: relative; padding: 2px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.18);">
                ${tutorAvatar 
                  ? `<img src="${tutorAvatar}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; display: block;" />`
                  : `<div style="width: 28px; height: 28px; border-radius: 50%; background: #0F766E; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px;">${initial}</div>`}
              </div>
              <span style="font-size: 0.65rem; font-weight: 800; background: #FFF; color: #0F172A; padding: 0.1rem 0.35rem; border-radius: 4px; border: 1px solid #CBD5E1; margin-top: 1px;">
                ${tutorName.split(' ')[0]}
              </span>
            </div>
          `,
          iconSize: [60, 50],
          iconAnchor: [30, 15],
        });

        const homeMin = tutor.hourlyRateHomeMin || tutor.hourlyRateHome || 600;
        const homeMax = tutor.hourlyRateHomeMax && tutor.hourlyRateHomeMax !== homeMin ? tutor.hourlyRateHomeMax : Math.round((homeMin * 1.4) / 50) * 50;
        const onlineMin = tutor.hourlyRateOnlineMin || tutor.hourlyRateOnline || 500;
        const onlineMax = tutor.hourlyRateOnlineMax && tutor.hourlyRateOnlineMax !== onlineMin ? tutor.hourlyRateOnlineMax : Math.round((onlineMin * 1.4) / 50) * 50;

        let priceHtml = '';
        if (!tutor.teachingMode || tutor.teachingMode === 'BOTH') {
          priceHtml = `<div>🏠 Home: ₹${homeMin}–₹${homeMax}/hr</div><div style="margin-top:2px;">💻 Online: ₹${onlineMin}–₹${onlineMax}/hr</div>`;
        } else if (tutor.teachingMode === 'ONLINE_LIVE') {
          priceHtml = `<div>💻 Online: ₹${onlineMin}–₹${onlineMax}/hr</div>`;
        } else {
          priceHtml = `<div>🏠 Home: ₹${homeMin}–₹${homeMax}/hr</div>`;
        }

        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 190px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              ${tutorAvatar ? `<img src="${tutorAvatar}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1.5px solid #059669;" />` : ''}
              <div>
                <div style="font-weight: 800; font-size: 13px; color: #0F172A;">${tutorName}</div>
                <div style="font-size: 10px; color: #047857; font-weight: 700;">✓ SSSAM Verified</div>
              </div>
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 8px; line-height: 1.4;">
              <div style="font-weight: 700; color: #334155;">🎓 ${tutor.highestDegree || 'Verified Educator'}</div>
              <div style="color: #0F766E; font-weight: 700; margin-top: 3px; font-size: 11px;">
                ${priceHtml}
              </div>
            </div>
            <a href="/tutors/${tutor.id}" style="display: flex; align-items: center; justify-content: center; gap: 4px; background: #0F172A; color: #FFFFFF; text-decoration: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 800;">
              <span>View Profile</span>
              <span>↗</span>
            </a>
          </div>
        `;

        const tMarker = L.marker([tLat, tLng], { icon: tutorIcon }).addTo(map);
        tMarker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -10],
          className: 'custom-map-popup',
        });

        tMarker.on('click', () => {
          setSelectedTutor(tutor);
          tMarker.openPopup();
        });
      } catch (err) {
        console.warn('Tutor marker error:', err);
      }
    });

    return () => {
      if (map) {
        map.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, [L, currentCoords, dynamicTutors, isCompact]);

  // =========================================================================
  // POPUP MAP INITIALIZATION (100% PURE LEAFLET)
  // =========================================================================
  useEffect(() => {
    if (!showLocationPopup || !popupMapRef.current || !L) return;

    const timer = setTimeout(() => {
      if (!popupMapRef.current) return;

      if (leafletPopupMapInstanceRef.current) {
        leafletPopupMapInstanceRef.current.remove();
        leafletPopupMapInstanceRef.current = null;
      }
      if ((popupMapRef.current as any)._leaflet_id) {
        delete (popupMapRef.current as any)._leaflet_id;
      }

      const pMap = L.map(popupMapRef.current, {
        center: [popupCoords.lat, popupCoords.lng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(pMap);

      const markerIcon = L.divIcon({
        className: 'popup-location-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(37,99,235,0.5); cursor: grab;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
            <div style="width: 3px; height: 12px; background: #2563EB; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [36, 50],
        iconAnchor: [18, 50],
      });

      const marker = L.marker([popupCoords.lat, popupCoords.lng], {
        icon: markerIcon,
        draggable: true,
      }).addTo(pMap);

      leafletPopupMarkerRef.current = marker;

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        setPopupCoords({ lat: pos.lat, lng: pos.lng });
        setIsReverseGeocoding(true);
        const addr = await handleReverseGeocode(pos.lat, pos.lng);
        setPopupAddress(addr);
        setIsReverseGeocoding(false);
      });

      pMap.on('click', async (e: any) => {
        marker.setLatLng(e.latlng);
        setPopupCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        setIsReverseGeocoding(true);
        const addr = await handleReverseGeocode(e.latlng.lat, e.latlng.lng);
        setPopupAddress(addr);
        setIsReverseGeocoding(false);
      });

      leafletPopupMapInstanceRef.current = pMap;

      setTimeout(() => {
        if (pMap) pMap.invalidateSize();
      }, 150);
    }, 150);

    return () => clearTimeout(timer);
  }, [showLocationPopup, L]);

  // Cleanup popup map
  useEffect(() => {
    if (!showLocationPopup) {
      if (leafletPopupMapInstanceRef.current) {
        leafletPopupMapInstanceRef.current.remove();
        leafletPopupMapInstanceRef.current = null;
      }
    }
  }, [showLocationPopup]);

  // GPS Auto-detection handler
  const handleAutoDetectGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPopupCoords({ lat, lng });
          setShowLocationPopup(true);
          setIsDetecting(false);
          setIsReverseGeocoding(true);
          const addr = await handleReverseGeocode(lat, lng);
          setPopupAddress(addr);
          setIsReverseGeocoding(false);
        },
        () => {
          setIsDetecting(false);
          setPopupCoords({ lat: 28.4728, lng: 77.0345 });
          setPopupAddress('Sector 14, Gurugram, Haryana');
          setShowLocationPopup(true);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetecting(false);
      setShowLocationPopup(true);
    }
  };

  const handleConfirmLocation = () => {
    setCurrentCoords(popupCoords);
    setDetectedAddress(popupAddress);
    setShowLocationPopup(false);

    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([popupCoords.lat, popupCoords.lng], 14);
    }

    onLocationSelected({
      address: popupAddress,
      lat: popupCoords.lat,
      lng: popupCoords.lng,
      nearestTutorsCount: 12,
    });
  };

  return (
    <>
      <div style={{
        padding: isCompact ? '0.5rem' : '1.5rem',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderRadius: isCompact ? '0px' : '24px',
      }}>
        {!isCompact && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span className="pulse-emerald" />
                <span>📍 LIVE LOCATION PROXIMITY ENGINE</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                Nearby Verified Tutors in Your Sector
              </h4>
            </div>

            <button
              type="button"
              onClick={handleAutoDetectGPS}
              disabled={isDetecting}
              className="btn btn-primary btn-sm"
            >
              <span>{isDetecting ? 'Detecting...' : '📍 Use Current Location'}</span>
            </button>
          </div>
        )}

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          style={{
            position: 'relative',
            height: isCompact ? '180px' : '280px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border-hairline)',
            marginBottom: isCompact ? '0.5rem' : '1.25rem',
            zIndex: 1,
            backgroundColor: '#E2E8F0',
          }}
        />

        {/* Selected Tutor Clickable Card */}
        {selectedTutor && (
          <Link
            href={`/tutors/${selectedTutor.id}`}
            style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: isCompact ? '0.5rem' : '1rem',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
              <img src={selectedTutor.avatarUrl} alt={selectedTutor.name} style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1.5px solid #059669', flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>{selectedTutor.name}</span>
                  <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 700, backgroundColor: '#DCFCE7', padding: '0.1rem 0.4rem', borderRadius: '6px' }}>✓ SSSAM Verified</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600 }}>{selectedTutor.highestDegree}</span>
                  <span>•</span>
                  {(!selectedTutor.teachingMode || selectedTutor.teachingMode === 'BOTH') ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#0F6E56', fontWeight: 700, backgroundColor: '#F0FDF4', padding: '1px 5px', borderRadius: '4px' }}>
                        🏠 Home: ₹{selectedTutor.hourlyRateHomeMin || selectedTutor.hourlyRateHome || 600}–₹{selectedTutor.hourlyRateHomeMax && selectedTutor.hourlyRateHomeMax !== selectedTutor.hourlyRateHomeMin ? selectedTutor.hourlyRateHomeMax : Math.round(((selectedTutor.hourlyRateHomeMin || selectedTutor.hourlyRateHome || 600) * 1.4) / 50) * 50}/hr
                      </span>
                      <span style={{ color: '#0284C7', fontWeight: 700, backgroundColor: '#F0F9FF', padding: '1px 5px', borderRadius: '4px' }}>
                        💻 Online: ₹{selectedTutor.hourlyRateOnlineMin || selectedTutor.hourlyRateOnline || 500}–₹{selectedTutor.hourlyRateOnlineMax && selectedTutor.hourlyRateOnlineMax !== selectedTutor.hourlyRateOnlineMin ? selectedTutor.hourlyRateOnlineMax : Math.round(((selectedTutor.hourlyRateOnlineMin || selectedTutor.hourlyRateOnline || 500) * 1.4) / 50) * 50}/hr
                      </span>
                    </span>
                  ) : selectedTutor.teachingMode === 'ONLINE_LIVE' ? (
                    <span style={{ color: '#0284C7', fontWeight: 700, backgroundColor: '#F0F9FF', padding: '1px 5px', borderRadius: '4px' }}>
                      💻 Online: ₹{selectedTutor.hourlyRateOnlineMin || selectedTutor.hourlyRateOnline || 500}–₹{selectedTutor.hourlyRateOnlineMax && selectedTutor.hourlyRateOnlineMax !== selectedTutor.hourlyRateOnlineMin ? selectedTutor.hourlyRateOnlineMax : Math.round(((selectedTutor.hourlyRateOnlineMin || selectedTutor.hourlyRateOnline || 500) * 1.4) / 50) * 50}/hr
                    </span>
                  ) : (
                    <span style={{ color: '#0F6E56', fontWeight: 700, backgroundColor: '#F0FDF4', padding: '1px 5px', borderRadius: '4px' }}>
                      🏠 Home Visit: ₹{selectedTutor.hourlyRateHomeMin || selectedTutor.hourlyRateHome || 600}–₹{selectedTutor.hourlyRateHomeMax && selectedTutor.hourlyRateHomeMax !== selectedTutor.hourlyRateHomeMin ? selectedTutor.hourlyRateHomeMax : Math.round(((selectedTutor.hourlyRateHomeMin || selectedTutor.hourlyRateHome || 600) * 1.4) / 50) * 50}/hr
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
              <span>View Profile</span>
              <ArrowUpRight size={13} />
            </div>
          </Link>
        )}

        {/* Current Address display & Edit button */}
        <div style={{
          backgroundColor: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-hairline)',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              CONFIRM NEAREST SECTOR
            </span>
            <button
              type="button"
              onClick={() => setShowLocationPopup(true)}
              style={{ fontSize: '0.72rem', color: 'var(--brand-blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <MapPin size={12} />
              <span>Change Location</span>
            </button>
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={14} color="var(--brand-emerald)" />
            <span>{detectedAddress}</span>
          </div>
        </div>
      </div>

      {/* POPUP MODAL */}
      {showLocationPopup && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem', backdropFilter: 'blur(4px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLocationPopup(false); }}
        >
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '92vh',
            overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem 1rem',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  📍 Set Your Location
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Search sector, drag pin, or tap on map
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowLocationPopup(false)}
                  aria-label="Close location popup"
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '0.45rem', cursor: 'pointer', display: 'flex', transition: 'background 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E2E8F0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
                >
                  <X size={18} color="#64748B" />
                </button>
              </div>
            </div>

            {/* Sector / Landmark Search Box */}
            <div style={{ padding: '0.75rem 1.25rem 0.5rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search Gurgaon sector, colony, or landmark (e.g. Sector 56, DLF Phase 5)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: '2.4rem',
                    paddingRight: searchQuery ? '2rem' : '0.75rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Live Search Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '1.25rem',
                  right: '1.25rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  border: '1.5px solid #E2E8F0',
                  zIndex: 100,
                  maxHeight: '200px',
                  overflowY: 'auto',
                  marginTop: '4px',
                }}>
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSearchResult(res)}
                      style={{
                        padding: '0.65rem 1rem',
                        borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <MapPin size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A' }}>
                          {res.name}
                        </div>
                        {res.landmark && (
                          <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {res.landmark}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popup Map Container with Floating Animated GPS Radar Pill */}
            <div style={{ position: 'relative', width: '100%', height: '240px' }}>
              <div
                ref={popupMapRef}
                style={{ height: '100%', width: '100%', zIndex: 10, backgroundColor: '#E2E8F0' }}
              />

              <style>{`
                @keyframes gpsFloatingPulseMap {
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
                @keyframes gpsIconSpinMap {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>

              {/* Sleek Floating Animated GPS Button right on map */}
              <button
                type="button"
                onClick={() => {
                  if ('geolocation' in navigator) {
                    setIsReverseGeocoding(true);
                    navigator.geolocation.getCurrentPosition(
                      async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        setPopupCoords({ lat, lng });
                        if (leafletPopupMapInstanceRef.current && leafletPopupMarkerRef.current) {
                          leafletPopupMapInstanceRef.current.setView([lat, lng], 16);
                          leafletPopupMarkerRef.current.setLatLng([lat, lng]);
                        }
                        const addr = await handleReverseGeocode(lat, lng);
                        setPopupAddress(addr);
                        setIsReverseGeocoding(false);
                      },
                      () => setIsReverseGeocoding(false),
                      { enableHighAccuracy: true, timeout: 8000 }
                    );
                  }
                }}
                disabled={isReverseGeocoding}
                title="Auto-detect current GPS location"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  zIndex: 1000,
                  padding: '0.45rem 0.9rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: isReverseGeocoding 
                    ? '#94A3B8' 
                    : 'linear-gradient(135deg, #0F6E56 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: isReverseGeocoding ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  animation: isReverseGeocoding ? 'none' : 'gpsFloatingPulseMap 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Crosshair
                  size={14}
                  color="#FFFFFF"
                  style={{
                    animation: isReverseGeocoding ? 'gpsIconSpinMap 1s linear infinite' : 'none',
                    flexShrink: 0,
                  }}
                />
                <span>{isReverseGeocoding ? 'Locating...' : '📍 My Location'}</span>
              </button>
            </div>

            {/* Address Details & Confirm */}
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.3rem' }}>
                  DETECTED ADDRESS
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {isReverseGeocoding ? (
                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>Detecting address...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={15} color="#059669" />
                      <span>{popupAddress || 'Tap on map or drag pin'}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmLocation}
                disabled={isReverseGeocoding || !popupAddress}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
                  background: popupAddress ? '#0F6E56' : '#CBD5E1', color: '#FFFFFF',
                  fontWeight: 800, fontSize: '0.92rem', cursor: popupAddress ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                  boxShadow: popupAddress ? '0 4px 14px rgba(15,110,86,0.3)' : 'none',
                }}
              >
                <CheckCircle2 size={16} />
                <span>Confirm Location</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
