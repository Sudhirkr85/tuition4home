'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Navigation,
  X,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowUpRight,
  Crosshair,
  Search,
  MessageCircle,
  Clock,
  Sparkles,
  Phone,
  Check,
} from 'lucide-react';
import { VERIFIED_TUTORS, SSSAM_OFFICE_DETAILS, MockTutor } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

interface RapidoStyleMapProps {
  onLocationSelected: (data: { address: string; lat: number; lng: number; nearestTutorsCount: number }) => void;
  onOpenBookingForTutor?: (tutor: MockTutor) => void;
  isCompact?: boolean;
}

export const POPULAR_GURGAON_SECTORS = [
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

/**
 * Calculates distance between two GPS coordinates using Haversine formula
 */
export function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolves stable GPS coordinates for any teacher based on their stored GPS or primary Gurgaon sector
 */
export function getTeacherCoordinates(tutor: { latitude?: number; longitude?: number; serviceAreas?: string[] }): { lat: number; lng: number } {
  if (tutor.latitude && tutor.longitude && !isNaN(tutor.latitude) && !isNaN(tutor.longitude) && tutor.latitude > 25) {
    return { lat: tutor.latitude, lng: tutor.longitude };
  }
  if (tutor.serviceAreas && tutor.serviceAreas.length > 0) {
    for (const area of tutor.serviceAreas) {
      const match = POPULAR_GURGAON_SECTORS.find((s) => area.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(area.toLowerCase()));
      if (match) return { lat: match.lat, lng: match.lng };
    }
  }
  return { lat: 28.4552, lng: 77.0945 }; // Default DLF Phase 5
}

/**
 * Formats distance into human-friendly Gurgaon travel text with color zones
 */
export function getDistanceInfo(km: number) {
  const approxMins = Math.max(5, Math.round(km * 3.5)); // ~3.5 mins per km in Gurgaon traffic
  if (km < 0.6) {
    return {
      km,
      distanceText: '~500 m away',
      travelTime: '< 5 mins travel',
      zone: 'green' as const,
      badgeText: 'In Immediate Sector (Home Visit Ready)',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      circleColor: '#059669',
    };
  }
  if (km < 1.0) {
    return {
      km,
      distanceText: '~800 m away',
      travelTime: '< 5 mins travel',
      zone: 'green' as const,
      badgeText: 'In Immediate Sector (Home Visit Ready)',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      circleColor: '#059669',
    };
  }
  const distStr = km < 10 ? km.toFixed(1) : Math.round(km).toString();
  if (km <= 3.5) {
    return {
      km,
      distanceText: `~${distStr} km away`,
      travelTime: `~${approxMins} mins travel`,
      zone: 'green' as const,
      badgeText: 'In Service Zone (Home Visit Ready)',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      circleColor: '#059669',
    };
  } else if (km <= 7.0) {
    return {
      km,
      distanceText: `~${distStr} km away`,
      travelTime: `~${approxMins} mins travel`,
      zone: 'yellow' as const,
      badgeText: 'Moderate Distance (Home Visit / Online)',
      badgeColor: '#D97706',
      badgeBg: '#FFFBEB',
      badgeBorder: '#FDE68A',
      circleColor: '#D97706',
    };
  } else {
    return {
      km,
      distanceText: `~${distStr} km away`,
      travelTime: `~${approxMins} mins travel`,
      zone: 'red' as const,
      badgeText: 'Far Distance (Online 1-on-1 Recommended)',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2',
      badgeBorder: '#FECACA',
      circleColor: '#DC2626',
    };
  }
}

export default function RapidoStyleMap({
  onLocationSelected,
  onOpenBookingForTutor,
  isCompact = false,
}: RapidoStyleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupMapRef = useRef<HTMLDivElement>(null);

  // Leaflet references
  const [L, setL] = useState<any>(null);
  const leafletMapInstanceRef = useRef<any>(null);
  const leafletPopupMapInstanceRef = useRef<any>(null);
  const leafletPopupMarkerRef = useRef<any>(null);
  const tutorLayerGroupRef = useRef<any>(null);
  const parentMarkerRef = useRef<any>(null);
  const radiusCircleRef = useRef<any>(null);

  // State values
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('DLF Phase 5, Golf Course Road, Gurugram');
  const [locationSource, setLocationSource] = useState<'SAVED' | 'GPS' | 'DEFAULT'>('DEFAULT');
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<MockTutor | null>(null);

  // Location popup state
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [popupAddress, setPopupAddress] = useState('');
  const [popupCoords, setPopupCoords] = useState({ lat: 28.4552, lng: 77.0945 });
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; landmark?: string; lat: number; lng: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Current coordinates (Default: DLF Phase 5, Gurgaon)
  const [currentCoords, setCurrentCoords] = useState({ lat: 28.4552, lng: 77.0945 });

  // 1. Fetch live verified teachers strictly from Database
  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors)) {
          setDynamicTutors(data.tutors);
        } else {
          setDynamicTutors([]);
        }
      })
      .catch(() => setDynamicTutors([]));
  }, []);

  // 2. Preload Leaflet on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((mod) => setL(mod.default));
    }
  }, []);

  const handleReverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      return data.display_name || 'Gurugram, Haryana';
    } catch { return 'Gurugram, Haryana'; }
  }, []);

  const getNearestKnownSector = useCallback((lat: number, lng: number) => {
    let nearest = POPULAR_GURGAON_SECTORS[0];
    let minDistance = Infinity;
    for (const sector of POPULAR_GURGAON_SECTORS) {
      const d = Math.hypot(sector.lat - lat, sector.lng - lng);
      if (d < minDistance) { minDistance = d; nearest = sector; }
    }
    return minDistance < 0.15 ? nearest : null;
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_detected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.address && parsed.lat && parsed.lng) {
          setDetectedAddress(parsed.address);
          setCurrentCoords({ lat: parsed.lat, lng: parsed.lng });
          setPopupCoords({ lat: parsed.lat, lng: parsed.lng });
          setPopupAddress(parsed.address);
          setLocationSource('SAVED');
          onLocationSelected({ address: parsed.address, lat: parsed.lat, lng: parsed.lng, nearestTutorsCount: 12 });
        }
      }
    } catch {}
  }, [onLocationSelected]);

  const sortedTutorsWithDistance = useMemo(() => {
    return dynamicTutors.map((tutor, idx) => {
      const tCoords = getTeacherCoordinates(tutor);

      // Micro-jitter for pins in identical coordinates so they don't overlap on the map
      const jitterAngle = (idx * 1.25) + 0.5;
      const jitterDist = 0.0025 + ((idx % 3) * 0.0015);
      const finalLat = tCoords.lat + jitterDist * Math.sin(jitterAngle);
      const finalLng = tCoords.lng + jitterDist * Math.cos(jitterAngle);

      const km = calculateHaversineKm(currentCoords.lat, currentCoords.lng, tCoords.lat, tCoords.lng);
      const distanceInfo = getDistanceInfo(km);

      return { ...tutor, computedLat: finalLat, computedLng: finalLng, distanceKm: km, distanceInfo };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [dynamicTutors, currentCoords]);

  useEffect(() => {
    if (sortedTutorsWithDistance.length > 0) {
      if (!selectedTutor || !sortedTutorsWithDistance.some((t) => t.id === selectedTutor.id)) {
        setSelectedTutor(sortedTutorsWithDistance[0]);
      }
    }
  }, [sortedTutorsWithDistance, selectedTutor]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length === 0) { setSearchResults([]); return; }
    const q = query.toLowerCase().trim();
    const localMatches = POPULAR_GURGAON_SECTORS.filter((s) => s.name.toLowerCase().includes(q) || s.landmark.toLowerCase().includes(q));
    setSearchResults(localMatches);
    if (q.length >= 3) {
      setIsSearching(true);
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Gurgaon')}&countrycodes=in&limit=4`, { headers: { 'Accept-Language': 'en' } })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const osmResults = data.map((item) => ({ name: item.display_name.split(',')[0], landmark: item.display_name.split(',').slice(1, 3).join(',').trim(), lat: parseFloat(item.lat), lng: parseFloat(item.lon) }));
            const existingNames = new Set(localMatches.map((m) => m.name.toLowerCase()));
            setSearchResults([...localMatches, ...osmResults.filter((o) => !existingNames.has(o.name.toLowerCase()))]);
          }
        })
        .finally(() => setIsSearching(false));
    }
  };

  const handleSelectSearchResult = (result: { name: string; landmark?: string; lat: number; lng: number }) => {
    setPopupCoords({ lat: result.lat, lng: result.lng });
    setPopupAddress(`${result.name}, ${result.landmark ? result.landmark + ', ' : ''}Gurugram`);
    setSearchQuery('');
    setSearchResults([]);
    if (leafletPopupMapInstanceRef.current && leafletPopupMarkerRef.current) {
      leafletPopupMapInstanceRef.current.setView([result.lat, result.lng], 16);
      leafletPopupMarkerRef.current.setLatLng([result.lat, result.lng]);
    }
  };

  const handleQuickSectorSelect = (sector: typeof POPULAR_GURGAON_SECTORS[0]) => {
    const addr = `${sector.name}, ${sector.landmark.split(',')[0]}, Gurugram`;
    setCurrentCoords({ lat: sector.lat, lng: sector.lng });
    setDetectedAddress(addr);
    setPopupCoords({ lat: sector.lat, lng: sector.lng });
    setPopupAddress(addr);
    setLocationSource('SAVED');
    try { localStorage.setItem('user_detected_location', JSON.stringify({ address: addr, lat: sector.lat, lng: sector.lng })); } catch {}
    if (leafletMapInstanceRef.current) leafletMapInstanceRef.current.setView([sector.lat, sector.lng], 14);
    onLocationSelected({ address: addr, lat: sector.lat, lng: sector.lng, nearestTutorsCount: 12 });
  };

  useEffect(() => {
    if (!L || !mapContainerRef.current) return;

    if (!leafletMapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCoords.lat, currentCoords.lng],
        zoom: 14,
        zoomControl: !isCompact,
        attributionControl: false,
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);
      leafletMapInstanceRef.current = map;
      tutorLayerGroupRef.current = L.layerGroup().addTo(map);
      setTimeout(() => map.invalidateSize(), 150);
    } else {
      leafletMapInstanceRef.current.setView([currentCoords.lat, currentCoords.lng], leafletMapInstanceRef.current.getZoom() || 14);
    }

    const map = leafletMapInstanceRef.current;
    if (!map) return;

    // Render Parent Marker
    if (parentMarkerRef.current) {
      try { map.removeLayer(parentMarkerRef.current); } catch {}
    }
    const parentIcon = L.divIcon({
      className: 'custom-parent-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #0F6E56; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(15,110,86,0.5);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #FFFFFF;"></div>
          </div>
          <span style="font-size: 0.68rem; font-weight: 800; background: #0F6E56; color: #FFFFFF; padding: 2px 7px; border-radius: 999px; margin-top: 2px; box-shadow: 0 2px 6px rgba(0,0,0,0.18); white-space: nowrap;">
            📍 Your Sector
          </span>
        </div>
      `,
      iconSize: [90, 56],
      iconAnchor: [45, 16],
    });
    parentMarkerRef.current = L.marker([currentCoords.lat, currentCoords.lng], { icon: parentIcon, zIndexOffset: 1000 }).addTo(map);

    // Clear & Re-render Tutor Markers
    if (tutorLayerGroupRef.current) {
      tutorLayerGroupRef.current.clearLayers();
    } else {
      tutorLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    if (radiusCircleRef.current) {
      try { map.removeLayer(radiusCircleRef.current); } catch {}
      radiusCircleRef.current = null;
    }

    const currentSelected = selectedTutor ? sortedTutorsWithDistance.find((t) => t.id === selectedTutor.id) || sortedTutorsWithDistance[0] : sortedTutorsWithDistance[0];

    if (currentSelected) {
      radiusCircleRef.current = L.circle([currentSelected.computedLat, currentSelected.computedLng], {
        radius: 2800,
        color: currentSelected.distanceInfo.circleColor,
        fillOpacity: 0.07,
        weight: 1.5,
        dashArray: '5 5',
      }).addTo(map);
    }

    sortedTutorsWithDistance.slice(0, 15).forEach((tutor) => {
      const isSelected = currentSelected && currentSelected.id === tutor.id;
      const tutorIcon = L.divIcon({
        className: 'custom-tutor-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? 'scale(1.18)' : 'scale(1)'}; transition: transform 0.2s ease;">
            <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.22); border: 2.5px solid ${isSelected ? '#0F766E' : tutor.distanceInfo.circleColor}; overflow: hidden; display: flex; align-items: center; justify-content: center;">
              <img src="${tutor.avatarUrl || '/placeholder-avatar.jpg'}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            </div>
            <div style="display: flex; align-items: center; gap: 2px; font-size: 0.66rem; font-weight: 800; background: ${isSelected ? '#0F172A' : '#FFFFFF'}; color: ${isSelected ? '#FFFFFF' : '#0F172A'}; padding: 2px 5px; border-radius: 5px; border: 1px solid #CBD5E1; box-shadow: 0 2px 5px rgba(0,0,0,0.12); margin-top: -2px; white-space: nowrap;">
              <span>${tutor.name.split(' ')[0]}</span>
              <span style="color: #F59E0B;">★${tutor.rating || 5}</span>
            </div>
          </div>
        `,
        iconSize: [80, 56],
        iconAnchor: [40, 18],
      });

      const tMarker = L.marker([tutor.computedLat, tutor.computedLng], { icon: tutorIcon, zIndexOffset: isSelected ? 500 : 100 }).addTo(tutorLayerGroupRef.current);
      tMarker.on('click', () => setSelectedTutor(tutor));
    });
  }, [L, isCompact, currentCoords, sortedTutorsWithDistance, selectedTutor]);

  const handleAutoDetectGPS = () => {
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setCurrentCoords({ lat, lng });
      setPopupCoords({ lat, lng });
      setLocationSource('GPS');
      const resolved = await handleReverseGeocode(lat, lng);
      setDetectedAddress(resolved);
      setIsDetecting(false);
      onLocationSelected({ address: resolved, lat, lng, nearestTutorsCount: 12 });
    }, () => { setIsDetecting(false); setShowLocationPopup(true); }, { enableHighAccuracy: true });
  };

  const handleConfirmLocation = () => {
    setCurrentCoords(popupCoords);
    setDetectedAddress(popupAddress);
    setLocationSource('SAVED');
    setShowLocationPopup(false);
    try { localStorage.setItem('user_detected_location', JSON.stringify({ address: popupAddress, lat: popupCoords.lat, lng: popupCoords.lng })); } catch {}
    onLocationSelected({ address: popupAddress, lat: popupCoords.lat, lng: popupCoords.lng, nearestTutorsCount: 12 });
  };

  const activeTutorDetail = selectedTutor ? sortedTutorsWithDistance.find((t) => t.id === selectedTutor.id) || sortedTutorsWithDistance[0] : sortedTutorsWithDistance[0];
  const whatsappInquiryUrl = activeTutorDetail ? `https://wa.me/919217031899?text=${encodeURIComponent(`Hello SSSAM, looking for a teacher in ${detectedAddress}. Interested in ${activeTutorDetail.name}.`)}` : '#';

  return (
    <>
      <style jsx global>{`
        .custom-parent-pin, .custom-tutor-pin {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
      <div style={{ padding: isCompact ? '0.5rem' : '1.5rem', backgroundColor: '#FFFFFF', borderRadius: isCompact ? '0px' : '24px', border: isCompact ? 'none' : '1px solid #E2E8F0' }}>
        {!isCompact && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', letterSpacing: '0.04em' }}>LIVE PROXIMITY ENGINE</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0F172A' }}>Verified Teachers in Your Sector</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAutoDetectGPS} style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0.45rem 0.85rem', borderRadius: '10px' }} className="btn btn-secondary">Use GPS</button>
              <button onClick={() => setShowLocationPopup(true)} style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.45rem 0.85rem', borderRadius: '10px', backgroundColor: '#0F6E56', color: '#FFFFFF' }} className="btn btn-primary">Change Sector</button>
            </div>
          </div>
        )}

        <div ref={mapContainerRef} style={{ position: 'relative', height: isCompact ? '200px' : '380px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #CBD5E1', marginBottom: '0.85rem', zIndex: 1, backgroundColor: '#E2E8F0' }} />

        {activeTutorDetail && (
          <div style={{ backgroundColor: '#F8FAFC', border: `1.5px solid ${activeTutorDetail.distanceInfo.badgeBorder}`, borderRadius: '16px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img src={activeTutorDetail.avatarUrl} style={{ width: '48px', height: '48px', borderRadius: '12px', border: '2px solid #059669', objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{activeTutorDetail.name}</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  🎓 {activeTutorDetail.highestDegree} • {activeTutorDetail.distanceInfo.distanceText}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => onOpenBookingForTutor?.(activeTutorDetail)} className="btn btn-primary" style={{ flex: 1, padding: '0.55rem', borderRadius: '10px', backgroundColor: '#0F6E56' }}>Request Home Visit</button>
              <a href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', backgroundColor: '#25D366', color: '#FFFFFF', border: 'none', fontWeight: 700 }}>WhatsApp</a>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODAL FOR CUSTOM SECTOR SEARCH / PIN DRAG */}
      {showLocationPopup && (
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
            if (e.target === e.currentTarget) setShowLocationPopup(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '92vh',
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
                gap: '0.75rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  📍 Set Your Gurgaon Sector
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>
                  Search your sector, colony, or drag the marker to your location
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowLocationPopup(false)}
                aria-label="Close location popup"
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
            <div
              style={{
                padding: '0.75rem 1.25rem 0.5rem',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                position: 'relative',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search sector (e.g. DLF Phase 5, Sector 56, Golf Course Road)..."
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
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '1.25rem',
                    right: '1.25rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    zIndex: 100,
                    marginTop: '4px',
                  }}
                >
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSearchResult(res)}
                      style={{
                        padding: '0.65rem 0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderBottom: i < searchResults.length - 1 ? '1px solid #F1F5F9' : 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <MapPin size={14} color="#0F6E56" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{res.name}</div>
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
