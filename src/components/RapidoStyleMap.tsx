'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Loader2,
} from 'lucide-react';
import { VERIFIED_TUTORS, SSSAM_OFFICE_DETAILS, MockTutor } from '@/lib/data';
import {
  POPULAR_GURGAON_SECTORS,
  calculateHaversineKm,
  getTeacherCoordinates,
  getDistanceInfo,
  GurgaonSector,
} from '@/lib/geo';

// Re-export for backward compatibility
export {
  POPULAR_GURGAON_SECTORS,
  calculateHaversineKm,
  getTeacherCoordinates,
  getDistanceInfo,
};

interface RapidoStyleMapProps {
  onLocationSelected: (data: { address: string; lat: number; lng: number; nearestTutorsCount: number }) => void;
  onOpenBookingForTutor?: (tutor: MockTutor) => void;
  isCompact?: boolean;
  tutors?: MockTutor[];
}

export default function RapidoStyleMap({
  onLocationSelected,
  onOpenBookingForTutor,
  isCompact = false,
  tutors: propTutors,
}: RapidoStyleMapProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const popupMapRef = useRef<HTMLDivElement>(null);

  // Leaflet references
  const leafletMapInstanceRef = useRef<L.Map | null>(null);
  const leafletPopupMapInstanceRef = useRef<L.Map | null>(null);
  const leafletPopupMarkerRef = useRef<L.Marker | null>(null);
  const tutorLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const parentMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // State values
  const [isMapReady, setIsMapReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('DLF Phase 5, Golf Course Road, Gurugram');
  const [locationSource, setLocationSource] = useState<'SAVED' | 'GPS' | 'DEFAULT'>('DEFAULT');
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>(propTutors && propTutors.length > 0 ? propTutors : []);
  const [selectedTutor, setSelectedTutor] = useState<MockTutor | null>(null);

  // Sync with prop tutors if passed from parent
  useEffect(() => {
    if (propTutors && propTutors.length > 0) {
      setDynamicTutors(propTutors);
    }
  }, [propTutors]);

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

  // 1. Fetch live verified teachers only if not already provided by parent
  useEffect(() => {
    if (propTutors && propTutors.length > 0) return;
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.tutors) && data.tutors.length > 0) {
          setDynamicTutors(data.tutors);
        }
      })
      .catch(() => {});
  }, [propTutors]);

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

  const handleReverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      // Instant local resolution if close to known Gurgaon sector
      const nearest = getNearestKnownSector(lat, lng);
      if (nearest) {
        return `${nearest.name}, ${nearest.landmark.split(',')[0]}, Gurugram`;
      }
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
    },
    [getNearestKnownSector]
  );

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
          onLocationSelected({
            address: parsed.address,
            lat: parsed.lat,
            lng: parsed.lng,
            nearestTutorsCount: 12,
          });
        }
      }
    } catch {}
  }, [onLocationSelected]);

  const sortedTutorsWithDistance = useMemo(() => {
    return dynamicTutors
      .map((tutor, idx) => {
        const tCoords = getTeacherCoordinates(tutor);

        // Micro-jitter for pins in identical coordinates so they don't overlap on the map
        const jitterAngle = idx * 1.25 + 0.5;
        const jitterDist = 0.0025 + (idx % 3) * 0.0015;
        const finalLat = tCoords.lat + jitterDist * Math.sin(jitterAngle);
        const finalLng = tCoords.lng + jitterDist * Math.cos(jitterAngle);

        const km = calculateHaversineKm(
          currentCoords.lat,
          currentCoords.lng,
          tCoords.lat,
          tCoords.lng
        );
        const distanceInfo = getDistanceInfo(km);

        return {
          ...tutor,
          computedLat: finalLat,
          computedLng: finalLng,
          distanceKm: km,
          distanceInfo,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [dynamicTutors, currentCoords]);

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
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Gurgaon'
        )}&countrycodes=in&limit=4`,
        { headers: { 'Accept-Language': 'en' } }
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const osmResults = data.map((item) => ({
              name: item.display_name.split(',')[0],
              landmark: item.display_name.split(',').slice(1, 3).join(',').trim(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));
            const existingNames = new Set(localMatches.map((m) => m.name.toLowerCase()));
            setSearchResults([
              ...localMatches,
              ...osmResults.filter((o) => !existingNames.has(o.name.toLowerCase())),
            ]);
          }
        })
        .finally(() => setIsSearching(false));
    }
  };

  const handleSelectSearchResult = (result: {
    name: string;
    landmark?: string;
    lat: number;
    lng: number;
  }) => {
    setPopupCoords({ lat: result.lat, lng: result.lng });
    setPopupAddress(`${result.name}, ${result.landmark ? result.landmark + ', ' : ''}Gurugram`);
    setSearchQuery('');
    setSearchResults([]);
    if (leafletPopupMapInstanceRef.current && leafletPopupMarkerRef.current) {
      leafletPopupMapInstanceRef.current.setView([result.lat, result.lng], 16);
      leafletPopupMarkerRef.current.setLatLng([result.lat, result.lng]);
    }
  };

  const handleQuickSectorSelect = (sector: GurgaonSector) => {
    const addr = `${sector.name}, ${sector.landmark.split(',')[0]}, Gurugram`;
    setCurrentCoords({ lat: sector.lat, lng: sector.lng });
    setDetectedAddress(addr);
    setPopupCoords({ lat: sector.lat, lng: sector.lng });
    setPopupAddress(addr);
    setLocationSource('SAVED');
    try {
      localStorage.setItem(
        'user_detected_location',
        JSON.stringify({ address: addr, lat: sector.lat, lng: sector.lng })
      );
    } catch {}
    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.setView([sector.lat, sector.lng], 14);
    }
    onLocationSelected({ address: addr, lat: sector.lat, lng: sector.lng, nearestTutorsCount: 12 });
  };

  // Main Map Lifecycle
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapInstanceRef.current) {
      // Clean up leftover leaflet id if re-mounting
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
      tutorLayerGroupRef.current = L.layerGroup().addTo(map);
      setIsMapReady(true);
      setTimeout(() => map.invalidateSize(), 100);
    } else {
      leafletMapInstanceRef.current.setView(
        [currentCoords.lat, currentCoords.lng],
        leafletMapInstanceRef.current.getZoom() || 14
      );
    }

    const map = leafletMapInstanceRef.current;
    if (!map) return;

    // Render Parent Marker
    if (parentMarkerRef.current) {
      try {
        map.removeLayer(parentMarkerRef.current);
      } catch {}
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

    parentMarkerRef.current = L.marker([currentCoords.lat, currentCoords.lng], {
      icon: parentIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Clear & Re-render Tutor Markers
    if (tutorLayerGroupRef.current) {
      tutorLayerGroupRef.current.clearLayers();
    } else {
      tutorLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    if (radiusCircleRef.current) {
      try {
        map.removeLayer(radiusCircleRef.current);
      } catch {}
      radiusCircleRef.current = null;
    }

    const currentSelected = selectedTutor
      ? sortedTutorsWithDistance.find((t) => t.id === selectedTutor.id) || null
      : null;

    if (currentSelected) {
      radiusCircleRef.current = L.circle(
        [currentSelected.computedLat, currentSelected.computedLng],
        {
          radius: 2800,
          color: currentSelected.distanceInfo.circleColor,
          fillOpacity: 0.07,
          weight: 1.5,
          dashArray: '5 5',
        }
      ).addTo(map);
    }

    map.on('click', () => {
      setSelectedTutor(null);
    });

    sortedTutorsWithDistance.slice(0, 15).forEach((tutor) => {
      const isSelected = currentSelected && currentSelected.id === tutor.id;
      const hasAvatar = Boolean(tutor.avatarUrl && tutor.avatarUrl.trim());
      const initialLetter = tutor.name ? tutor.name.trim().charAt(0).toUpperCase() : 'T';

      const tutorIcon = L.divIcon({
        className: 'custom-tutor-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${
            isSelected ? 'scale(1.18)' : 'scale(1)'
          }; transition: transform 0.2s ease;">
            <div style="position: relative; width: 36px; height: 36px; border-radius: 50%; background: #E6F4EA; box-shadow: 0 4px 12px rgba(0,0,0,0.22); border: 2.5px solid ${
              isSelected ? '#0F766E' : tutor.distanceInfo.circleColor
            }; overflow: hidden; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0F6E56; font-size: 0.95rem;">
              ${
                hasAvatar
                  ? `<img src="${tutor.avatarUrl}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />`
                  : `<span>${initialLetter}</span>`
              }
            </div>
            <div style="display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; background: ${
              isSelected ? '#0F172A' : '#FFFFFF'
            }; color: ${
          isSelected ? '#FFFFFF' : '#0F172A'
        }; padding: 2px 7px; border-radius: 6px; border: 1px solid #CBD5E1; box-shadow: 0 2px 5px rgba(0,0,0,0.12); margin-top: -2px; white-space: nowrap;">
              <span>${tutor.name.split(' ')[0]}</span>
            </div>
          </div>
        `,
        iconSize: [80, 56],
        iconAnchor: [40, 18],
      });

      const popupHtml = `
        <div style="font-family: inherit; padding: 4px; min-width: 200px; text-align: left;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            ${
              hasAvatar
                ? `<img src="${tutor.avatarUrl}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1.5px solid #0F6E56;" />`
                : `<div style="width: 38px; height: 38px; border-radius: 8px; background: #E6F4EA; border: 1.5px solid #0F6E56; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0F6E56;">${initialLetter}</div>`
            }
            <div style="flex: 1; min-width: 0;">
              <div style="font-weight: 800; font-size: 0.9rem; color: #0F172A; line-height: 1.2;">${
                tutor.name
              }</div>
              <div style="font-size: 0.72rem; color: #64748B; margin-top: 1px;">${
                tutor.highestDegree || 'Verified Educator'
              }</div>
            </div>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; background: ${
            tutor.distanceInfo.badgeBg
          }; color: ${tutor.distanceInfo.badgeColor}; padding: 3px 6px; border-radius: 6px; border: 1px solid ${
        tutor.distanceInfo.badgeBorder
      }; margin-bottom: 8px; width: 100%; box-sizing: border-box;">
            <span>🟢 ${tutor.distanceInfo.distanceText} (${
        tutor.distanceInfo.travelTime
      })</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <a href="/tutors/${
              tutor.id
            }" class="map-view-profile-btn" data-tutor-id="${tutor.id}" style="flex: 1; text-align: center; font-size: 0.72rem; font-weight: 700; background: #F1F5F9; color: #0F172A; padding: 6px 8px; border-radius: 6px; text-decoration: none; border: 1px solid #CBD5E1;">View Profile</a>
            <a href="https://wa.me/919217031899?text=${encodeURIComponent(
              `Hello SSSAM, I want to book a home teacher in ${detectedAddress} (${tutor.name}).`
            )}" target="_blank" rel="noopener noreferrer" style="font-size: 0.72rem; font-weight: 700; background: #25D366; color: #FFFFFF; padding: 6px 8px; border-radius: 6px; text-decoration: none;">WhatsApp</a>
          </div>
        </div>
      `;

      if (tutorLayerGroupRef.current) {
        const tMarker = L.marker([tutor.computedLat, tutor.computedLng], {
          icon: tutorIcon,
          zIndexOffset: isSelected ? 500 : 100,
        }).addTo(tutorLayerGroupRef.current);
        tMarker.bindPopup(popupHtml, { offset: [0, -16] });
        tMarker.on('click', () => {
          try {
            router.prefetch(`/tutors/${tutor.id}`);
          } catch {}
          setSelectedTutor(tutor);
          tMarker.openPopup();
        });
      }
    });
  }, [isCompact, currentCoords, sortedTutorsWithDistance, selectedTutor, detectedAddress, router]);

  // Fast client-side navigation for Leaflet popup profile links
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.map-view-profile-btn');
      if (target) {
        const tutorId = target.getAttribute('data-tutor-id');
        if (tutorId) {
          e.preventDefault();
          router.push(`/tutors/${tutorId}`);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [router]);

  // Modal Popup Map Lifecycle
  useEffect(() => {
    if (!showLocationPopup || !popupMapRef.current) return;

    const timer = setTimeout(() => {
      if (!popupMapRef.current) return;
      if (leafletPopupMapInstanceRef.current) {
        try {
          leafletPopupMapInstanceRef.current.remove();
        } catch {}
        leafletPopupMapInstanceRef.current = null;
      }
      if ((popupMapRef.current as any)._leaflet_id) {
        delete (popupMapRef.current as any)._leaflet_id;
      }

      const map = L.map(popupMapRef.current, {
        center: [popupCoords.lat, popupCoords.lng],
        zoom: 15,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: 'custom-parent-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="width: 34px; height: 34px; border-radius: 50%; background: #0F6E56; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(15,110,86,0.6);">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #FFFFFF;"></div>
            </div>
            <div style="width: 3px; height: 14px; background: #0F6E56; margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [34, 48],
        iconAnchor: [17, 48],
      });

      const marker = L.marker([popupCoords.lat, popupCoords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      leafletPopupMarkerRef.current = marker;
      leafletPopupMapInstanceRef.current = map;

      const onPosChanged = async (lat: number, lng: number) => {
        setPopupCoords({ lat, lng });
        setIsReverseGeocoding(true);
        const addr = await handleReverseGeocode(lat, lng);
        setPopupAddress(addr);
        setIsReverseGeocoding(false);
      };

      marker.on('dragend', async () => {
        const pos = marker.getLatLng();
        await onPosChanged(pos.lat, pos.lng);
      });

      map.on('click', async (e: any) => {
        marker.setLatLng(e.latlng);
        await onPosChanged(e.latlng.lat, e.latlng.lng);
      });

      map.invalidateSize();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (leafletPopupMapInstanceRef.current) {
        try {
          leafletPopupMapInstanceRef.current.remove();
        } catch {}
        leafletPopupMapInstanceRef.current = null;
      }
      leafletPopupMarkerRef.current = null;
    };
  }, [showLocationPopup, popupCoords.lat, popupCoords.lng, handleReverseGeocode]);

  const handleAutoDetectGPS = () => {
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setCurrentCoords({ lat, lng });
        setPopupCoords({ lat, lng });
        setLocationSource('GPS');

        if (leafletMapInstanceRef.current) {
          leafletMapInstanceRef.current.flyTo([lat, lng], 15, { animate: true, duration: 1.2 });
        }

        const resolved = await handleReverseGeocode(lat, lng);
        setDetectedAddress(resolved);
        setIsDetecting(false);
        onLocationSelected({ address: resolved, lat, lng, nearestTutorsCount: 12 });
      },
      () => {
        setIsDetecting(false);
        setShowLocationPopup(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirmLocation = () => {
    setCurrentCoords(popupCoords);
    setDetectedAddress(popupAddress);
    setLocationSource('SAVED');
    setShowLocationPopup(false);

    if (leafletMapInstanceRef.current) {
      leafletMapInstanceRef.current.flyTo([popupCoords.lat, popupCoords.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }

    try {
      localStorage.setItem(
        'user_detected_location',
        JSON.stringify({ address: popupAddress, lat: popupCoords.lat, lng: popupCoords.lng })
      );
    } catch {}
    onLocationSelected({
      address: popupAddress,
      lat: popupCoords.lat,
      lng: popupCoords.lng,
      nearestTutorsCount: 12,
    });
  };

  const activeTutorDetail = selectedTutor
    ? sortedTutorsWithDistance.find((t) => t.id === selectedTutor.id) || null
    : null;
  const whatsappInquiryUrl = activeTutorDetail
    ? `https://wa.me/919217031899?text=${encodeURIComponent(
        `Hello SSSAM, looking for a teacher in ${detectedAddress}. Interested in ${activeTutorDetail.name}.`
      )}`
    : '#';

  return (
    <>
      <style jsx global>{`
        .custom-parent-pin,
        .custom-tutor-pin {
          background: transparent !important;
          border: none !important;
        }
        @keyframes slideUpMapCard {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div
        style={{
          padding: isCompact ? '0.25rem' : '1.25rem',
          backgroundColor: '#FFFFFF',
          borderRadius: isCompact ? '0px' : '24px',
          border: isCompact ? 'none' : '1px solid #E2E8F0',
        }}
      >
        {!isCompact && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#059669',
                  letterSpacing: '0.04em',
                }}
              >
                LIVE PROXIMITY ENGINE
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#0F172A' }}>
                Verified Teachers in Your Sector
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleAutoDetectGPS}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
                className="btn btn-secondary"
              >
                <Crosshair size={14} color="#059669" />
                <span>{isDetecting ? 'Detecting...' : 'Get Current Location'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPopupCoords(currentCoords);
                  setPopupAddress(detectedAddress);
                  setShowLocationPopup(true);
                }}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  backgroundColor: '#0F6E56',
                  color: '#FFFFFF',
                }}
                className="btn btn-primary"
              >
                Change Sector
              </button>
            </div>
          </div>
        )}

        {/* Outer Map Frame with Floating In-Map Overlays */}
        <div
          style={{
            position: 'relative',
            height: isCompact ? '280px' : '440px',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '1.5px solid #CBD5E1',
            backgroundColor: '#F1F5F9',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          {/* Skeleton Loader during initial tile render */}
          {!isMapReady && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F8FAFC',
                zIndex: 2,
                gap: '0.5rem',
                color: '#0F6E56',
                fontWeight: 700,
                fontSize: '0.88rem',
              }}
            >
              <Loader2 size={20} className="animate-spin" />
              <span>Loading Gurgaon Interactive Map...</span>
            </div>
          )}

          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

          {/* Floating In-Map Teacher Profile Card */}
          {activeTutorDetail && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                zIndex: 1000,
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1.5px solid ${activeTutorDetail.distanceInfo.badgeBorder}`,
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.18)',
                animation: 'slideUpMapCard 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.65rem',
                }}
              >
                <Link
                  href={`/tutors/${activeTutorDetail.id}`}
                  prefetch={true}
                  style={{ position: 'relative', display: 'block', flexShrink: 0 }}
                >
                  {activeTutorDetail.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeTutorDetail.avatarUrl}
                      alt={activeTutorDetail.name}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        border: '2px solid #059669',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        border: '2px solid #059669',
                        backgroundColor: '#E6F4EA',
                        color: '#0F6E56',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                      }}
                    >
                      {activeTutorDetail.name ? activeTutorDetail.name.trim().charAt(0).toUpperCase() : 'T'}
                    </div>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-3px',
                      right: '-3px',
                      backgroundColor: '#059669',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      border: '1.5px solid #FFFFFF',
                    }}
                  >
                    <ShieldCheck size={9} />
                  </span>
                </Link>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.4rem',
                    }}
                  >
                    <Link href={`/tutors/${activeTutorDetail.id}`} prefetch={true} style={{ textDecoration: 'none' }}>
                      <div
                        style={{
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {activeTutorDetail.name}
                      </div>
                    </Link>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#0F6E56',
                        backgroundColor: '#ECFDF5',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        border: '1px solid #A7F3D0',
                        flexShrink: 0,
                      }}
                    >
                      ₹{activeTutorDetail.hourlyRateHome || 600}/hr
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '1px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '140px',
                      }}
                    >
                      🎓 {activeTutorDetail.highestDegree || 'Verified Teacher'}
                    </span>
                    <span>•</span>
                    <span style={{ color: activeTutorDetail.distanceInfo.badgeColor, fontWeight: 700 }}>
                      🟢 {activeTutorDetail.distanceInfo.distanceText} (
                      {activeTutorDetail.distanceInfo.travelTime})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTutor(null)}
                  aria-label="Close card"
                  style={{
                    background: '#F1F5F9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '22px',
                    height: '22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: 'auto',
                  }}
                >
                  <X size={13} color="#64748B" />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <Link
                  href={`/tutors/${activeTutorDetail.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{
                    flex: '1 1 95px',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <span>Profile</span>
                  <ArrowUpRight size={13} />
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenBookingForTutor?.(activeTutorDetail)}
                  className="btn btn-primary btn-sm"
                  style={{
                    flex: '1 1 125px',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#0F6E56',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  Request Visit
                </button>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
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

              {/* Quick Sectors Pill Strip */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  overflowX: 'auto',
                  padding: '0.5rem 0 0.25rem',
                  scrollbarWidth: 'none',
                }}
              >
                {POPULAR_GURGAON_SECTORS.slice(0, 6).map((sec) => (
                  <button
                    key={sec.name}
                    type="button"
                    onClick={() => {
                      handleQuickSectorSelect(sec);
                      setShowLocationPopup(false);
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#0F6E56',
                      cursor: 'pointer',
                    }}
                  >
                    {sec.name}
                  </button>
                ))}
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
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                          {res.name}
                        </div>
                        {res.landmark && (
                          <div
                            style={{
                              fontSize: '0.72rem',
                              color: '#64748B',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
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
                  animation: isReverseGeocoding
                    ? 'none'
                    : 'gpsFloatingPulseMap 2.2s infinite cubic-bezier(0.4, 0, 0.6, 1)',
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
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.3rem',
                  }}
                >
                  DETECTED ADDRESS
                </div>
                <div
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
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
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: popupAddress ? '#0F6E56' : '#CBD5E1',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: popupAddress ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
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
