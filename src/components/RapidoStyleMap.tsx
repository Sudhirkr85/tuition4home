'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Edit2, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { VERIFIED_TUTORS, MockTutor } from '@/lib/data';
import 'leaflet/dist/leaflet.css';

interface RapidoStyleMapProps {
  onLocationSelected: (data: { address: string; lat: number; lng: number; nearestTutorsCount: number }) => void;
  isCompact?: boolean;
}

export default function RapidoStyleMap({ onLocationSelected, isCompact = false }: RapidoStyleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [L, setL] = useState<any>(null);
  const [map, setMap] = useState<any>(null);
  
  // State values
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('DLF Phase 5, Golf Course Road, Gurugram');
  const [isEditing, setIsEditing] = useState(false);
  const [dynamicTutors, setDynamicTutors] = useState<MockTutor[]>(VERIFIED_TUTORS);
  const [selectedTutor, setSelectedTutor] = useState<MockTutor | null>(VERIFIED_TUTORS[0]);
  
  // Current coordinates (Center of Gurgaon, Haryana)
  const [currentCoords, setCurrentCoords] = useState({ lat: 28.4728, lng: 77.0345 });

  // Fetch live verified tutors from database API
  useEffect(() => {
    fetch('/api/tutors/list')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tutors && data.tutors.length > 0) {
          setDynamicTutors(data.tutors);
          setSelectedTutor(data.tutors[0]);
        }
      })
      .catch((err) => console.error('Failed to fetch live tutors for map:', err));
  }, []);

  // Load Leaflet dynamically on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        setL(leaflet.default);
      });
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!L || !mapContainerRef.current || map) return;

    // Create Leaflet Map instance
    const leafletMap = L.map(mapContainerRef.current, {
      center: [currentCoords.lat, currentCoords.lng],
      zoom: 14,
      zoomControl: !isCompact,
      attributionControl: false,
    });

    // Add OpenStreetMap light styled tiles (jawg or osm standard)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, [L]);

  // Handle markers placement on map load/coordinate updates
  useEffect(() => {
    if (!L || !map) return;

    // Clear existing markers/layers (except tile layer)
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // 1. YOUR LOCATION marker
    const parentIcon = L.divIcon({
      className: 'custom-parent-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #2563EB; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(37,99,235,0.45);">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #FFFFFF;"></div>
          </div>
          <span style="margin-top: 3px; font-size: 0.65rem; font-weight: 800; background: #0F172A; color: #FFFFFF; padding: 0.15rem 0.45rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); white-space: nowrap;">
            YOUR LOCATION
          </span>
        </div>
      `,
      iconSize: [80, 50],
      iconAnchor: [40, 16],
    });

    L.marker([currentCoords.lat, currentCoords.lng], { icon: parentIcon }).addTo(map);

    // 2. TUTOR pins mapped around center coordinates
    const tutorCoordinates = [
      { id: 'tut-1', latOffset: 0.007, lngOffset: 0.005, distance: '1.2 km' },
      { id: 'tut-2', latOffset: -0.004, lngOffset: 0.012, distance: '2.1 km' },
      { id: 'tut-3', latOffset: -0.012, lngOffset: -0.008, distance: '3.4 km' },
    ];

    dynamicTutors.forEach((tutor, idx) => {
      const match = tutorCoordinates.find((tc) => tc.id === tutor.id) || {
        id: tutor.id,
        latOffset: (idx % 2 === 0 ? 1 : -1) * (0.004 * (idx + 1)),
        lngOffset: (idx % 3 === 0 ? 1 : -1) * (0.005 * (idx + 1)),
        distance: `${(1.2 + idx * 0.7).toFixed(1)} km`,
      };

      const tLat = currentCoords.lat + match.latOffset;
      const tLng = currentCoords.lng + match.lngOffset;

      const tutorIcon = L.divIcon({
        className: 'custom-tutor-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: relative; padding: 2px; border-radius: 50%; background: ${selectedTutor?.id === tutor.id ? '#0F6E56' : '#FFFFFF'}; box-shadow: 0 4px 12px rgba(0,0,0,0.18);">
              <img src="${tutor.avatarUrl}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover; display: block;" />
              <div style="position: absolute; bottom: -2px; right: -2px; background: #047857; color: #FFFFFF; border-radius: 50%; width: 12px; height: 12px; display: flex; align-items: center; justify-content: center; font-size: 7px;">✓</div>
            </div>
            <span style="margin-top: 2px; font-size: 0.62rem; font-weight: 700; background: #FFFFFF; color: #1D1D1F; padding: 0.1rem 0.35rem; border-radius: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); border: 1px solid #E8E8ED; white-space: nowrap;">
              ${tutor.name.split(' ')[0]} (${match.distance})
            </span>
          </div>
        `,
        iconSize: [60, 50],
        iconAnchor: [30, 16],
      });

      const tMarker = L.marker([tLat, tLng], { icon: tutorIcon }).addTo(map);
      tMarker.on('click', () => {
        setSelectedTutor(tutor);
      });
    });

  }, [L, map, currentCoords, selectedTutor, dynamicTutors]);

  // Handle GPS location auto-detect
  const handleAutoDetectGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Center map to new coordinates
          setCurrentCoords({ lat, lng });
          if (map) {
            map.setView([lat, lng], 14);
          }

          // Mock Gurgaon address mapping near coordinates
          const mockSectors = ['Sector 49', 'Sector 47', 'DLF Phase 5', 'Golf Course Road', 'Sector 14'];
          const randomSector = mockSectors[Math.floor(Math.random() * mockSectors.length)];
          const newAddress = `${randomSector}, Gurugram (Auto-Detected GPS)`;
          
          setDetectedAddress(newAddress);
          onLocationSelected({
            address: newAddress,
            lat,
            lng,
            nearestTutorsCount: 12,
          });
        },
        (error) => {
          setIsDetecting(false);
          console.warn('GPS location unavailable, defaulting to Gurgaon Sector 14:', error);
          setDetectedAddress('Sector 14, Old DLF Colony, Gurugram');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsDetecting(false);
      console.warn('Geolocation not supported by browser.');
      setDetectedAddress('Sector 14, Old DLF Colony, Gurugram');
    }
  };

  return (
    <div style={{
      padding: isCompact ? '0.5rem' : '1.5rem',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      borderRadius: isCompact ? '0px' : '24px',
    }}>
      {/* Map Header */}
      {!isCompact && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="pulse-emerald" />
              <span>LIVE TUTOR PROXIMITY MAP (REAL-TIME OPENSTREETMAP)</span>
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
            <span>{isDetecting ? 'Detecting GPS...' : '📍 Auto-Detect My Location'}</span>
          </button>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={mapContainerRef}
        style={{
          position: 'relative',
          height: isCompact ? '180px' : '280px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid var(--border-hairline)',
          marginBottom: isCompact ? '0.5rem' : '1.25rem',
          zIndex: 2,
          touchAction: 'pan-y',
        }}
      />

      {/* Selected Tutor Preview Card */}
      {selectedTutor && (
        <div style={{
          backgroundColor: 'var(--brand-blue-light)',
          border: '1px solid rgba(0, 102, 204, 0.18)',
          borderRadius: '12px',
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isCompact ? '0.5rem' : '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <img src={selectedTutor.avatarUrl} alt={selectedTutor.name} style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedTutor.name} <span style={{ fontSize: '0.7rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>({selectedTutor.id === 'tut-1' ? '1.2' : selectedTutor.id === 'tut-2' ? '2.1' : '3.4'} km away)</span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {selectedTutor.highestDegree} • ₹{selectedTutor.hourlyRateHome}/hr
              </div>
            </div>
          </div>

          <span className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
            <span>MATCHED</span>
          </span>
        </div>
      )}

      {/* Auto-Fetched Address Confirmation */}
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
            onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: '0.72rem', color: 'var(--brand-blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <span>{isEditing ? 'Save' : 'Edit'}</span>
          </button>
        </div>

        {isEditing ? (
          <input
            type="text"
            value={detectedAddress}
            onChange={(e) => {
              setDetectedAddress(e.target.value);
              onLocationSelected({ address: e.target.value, lat: currentCoords.lat, lng: currentCoords.lng, nearestTutorsCount: 3 });
            }}
            className="form-control"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', height: '32px' }}
          />
        ) : (
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={14} color="var(--brand-emerald)" />
            <span>{detectedAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
}
