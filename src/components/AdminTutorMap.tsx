'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Crosshair, ZoomIn, ZoomOut, Check, Sliders } from 'lucide-react';
import { POPULAR_GURGAON_SECTORS } from '@/lib/geo';
import 'leaflet/dist/leaflet.css';

interface AdminTutorMapProps {
  mode: 'view' | 'edit';
  lat?: number | null;
  lng?: number | null;
  radiusKm?: number;
  tutorName?: string;
  address?: string;
  onChangeLocation?: (data: { lat: number; lng: number; address: string; radiusKm: number }) => void;
}

export default function AdminTutorMap({
  mode,
  lat = 28.4595,
  lng = 77.0988,
  radiusKm = 5,
  tutorName = 'Tutor',
  address = 'Gurgaon, Haryana',
  onChangeLocation,
}: AdminTutorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [currentLat, setCurrentLat] = useState<number>(lat || 28.4595);
  const [currentLng, setCurrentLng] = useState<number>(lng || 77.0988);
  const [currentRadius, setCurrentRadius] = useState<number>(radiusKm || 5);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      setCurrentLat(lat);
      setCurrentLng(lng);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (radiusKm) {
      setCurrentRadius(radiusKm);
    }
  }, [radiusKm]);

  // Initialize Map
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = await import('leaflet');
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialCenter: [number, number] = [currentLat || 28.4595, currentLng || 77.0988];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: mode === 'edit' ? 14 : 13,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // CartoDB Voyager tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom tutor pin icon
      const createTutorIcon = () => {
        return L.divIcon({
          className: 'custom-admin-tutor-pin',
          html: `
            <div style="
              position: relative;
              transform: translate(-50%, -100%);
              cursor: ${mode === 'edit' ? 'grab' : 'pointer'};
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                background: linear-gradient(135deg, #0F6E56 0%, #059669 100%);
                color: #FFFFFF;
                font-weight: 800;
                font-size: 11px;
                padding: 4px 10px;
                border-radius: 999px;
                box-shadow: 0 4px 12px rgba(15, 110, 86, 0.4);
                border: 2px solid #FFFFFF;
                white-space: nowrap;
                margin-bottom: 2px;
                display: flex;
                align-items: center;
                gap: 4px;
              ">
                <span>📍 ${tutorName}</span>
              </div>
              <div style="
                width: 14px;
                height: 14px;
                background-color: #0F6E56;
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
            </div>
          `,
          iconSize: [0, 0],
        });
      };

      // Add Coverage Radius Circle
      const circle = L.circle(initialCenter, {
        radius: (currentRadius || 5) * 1000,
        color: '#0F6E56',
        weight: 2,
        fillColor: '#059669',
        fillOpacity: 0.15,
        dashArray: mode === 'edit' ? '6, 6' : undefined,
      }).addTo(map);
      circleRef.current = circle;

      // Add Tutor Marker
      const marker = L.marker(initialCenter, {
        icon: createTutorIcon(),
        draggable: mode === 'edit',
      }).addTo(map);
      markerRef.current = marker;

      // In edit mode: handle dragging marker
      if (mode === 'edit') {
        marker.on('dragend', (e: any) => {
          const newPos = e.target.getLatLng();
          const newLat = parseFloat(newPos.lat.toFixed(5));
          const newLng = parseFloat(newPos.lng.toFixed(5));
          setCurrentLat(newLat);
          setCurrentLng(newLng);
          circle.setLatLng(newPos);
          if (onChangeLocation) {
            onChangeLocation({
              lat: newLat,
              lng: newLng,
              address: address || 'Selected Location, Gurgaon',
              radiusKm: currentRadius,
            });
          }
        });

        // In edit mode: click on map to move marker
        map.on('click', (e: any) => {
          const newPos = e.latlng;
          const newLat = parseFloat(newPos.lat.toFixed(5));
          const newLng = parseFloat(newPos.lng.toFixed(5));
          setCurrentLat(newLat);
          setCurrentLng(newLng);
          marker.setLatLng(newPos);
          circle.setLatLng(newPos);
          if (onChangeLocation) {
            onChangeLocation({
              lat: newLat,
              lng: newLng,
              address: address || 'Selected Location, Gurgaon',
              radiusKm: currentRadius,
            });
          }
        });
      }

      // Auto fit bounds to circle
      map.fitBounds(circle.getBounds(), { padding: [25, 25], maxZoom: 15 });
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker and circle when coordinates or radius change
  const updateMapPosition = (newLat: number, newLng: number, newRadius: number) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([newLat, newLng]);
    }
    if (circleRef.current) {
      circleRef.current.setLatLng([newLat, newLng]);
      circleRef.current.setRadius(newRadius * 1000);
    }
    if (mapInstanceRef.current && circleRef.current) {
      mapInstanceRef.current.flyToBounds(circleRef.current.getBounds(), {
        padding: [25, 25],
        duration: 0.6,
        maxZoom: 15,
      });
    }
  };

  // Handle Sector Dropdown Selection
  const handleSelectSector = (sectorName: string) => {
    setSelectedSector(sectorName);
    const sector = POPULAR_GURGAON_SECTORS.find((s) => s.name === sectorName);
    if (sector) {
      setCurrentLat(sector.lat);
      setCurrentLng(sector.lng);
      updateMapPosition(sector.lat, sector.lng, currentRadius);
      if (onChangeLocation) {
        onChangeLocation({
          lat: sector.lat,
          lng: sector.lng,
          address: `${sector.name}, Gurgaon`,
          radiusKm: currentRadius,
        });
      }
    }
  };

  // Handle Radius Slider
  const handleRadiusChange = (newRadius: number) => {
    setCurrentRadius(newRadius);
    if (circleRef.current) {
      circleRef.current.setRadius(newRadius * 1000);
    }
    if (mapInstanceRef.current && circleRef.current) {
      mapInstanceRef.current.fitBounds(circleRef.current.getBounds(), {
        padding: [20, 20],
        maxZoom: 15,
      });
    }
    if (onChangeLocation) {
      onChangeLocation({
        lat: currentLat,
        lng: currentLng,
        address: address,
        radiusKm: newRadius,
      });
    }
  };

  // Get Current Location
  const handleGetCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        const newLat = parseFloat(latitude.toFixed(5));
        const newLng = parseFloat(longitude.toFixed(5));
        setCurrentLat(newLat);
        setCurrentLng(newLng);
        updateMapPosition(newLat, newLng, currentRadius);
        if (onChangeLocation) {
          onChangeLocation({
            lat: newLat,
            lng: newLng,
            address: address || 'Current Detected Location, Gurgaon',
            radiusKm: currentRadius,
          });
        }
      },
      () => {
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Edit Mode Top Controls */}
      {mode === 'edit' && (
        <div style={{ marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.65rem' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                Quick Sector Select / Search
              </label>
              <select
                value={selectedSector}
                onChange={(e) => handleSelectSector(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem' }}
              >
                <option value="">-- Choose Gurgaon Sector or Click Map --</option>
                {POPULAR_GURGAON_SECTORS.map((sec) => (
                  <option key={sec.name} value={sec.name}>
                    {sec.name} ({sec.landmark})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={locating}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.48rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: '#F8FAFC',
                }}
              >
                <Crosshair size={14} color="#0F6E56" />
                <span>{locating ? 'Locating...' : 'Get Current GPS'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Radius Slider */}
          <div style={{ backgroundColor: '#F1F5F9', padding: '0.65rem 0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: '150px' }}>
              <Sliders size={15} color="#0F6E56" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                Service Radius: <strong style={{ color: '#0F6E56' }}>{currentRadius} KM</strong>
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={currentRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#0F6E56', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>1 km - 25 km</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: mode === 'edit' ? '250px' : '200px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Map Legend Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            zIndex: 999,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(6px)',
            padding: '3px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(0,0,0,0.08)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'rgba(5, 150, 105, 0.35)', border: '1.5px solid #0F6E56' }}></span>
          <span>{currentRadius} KM Home Tuition Travel Coverage</span>
        </div>

        {mode === 'edit' && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 999,
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              padding: '3px 7px',
              borderRadius: '6px',
              fontSize: '0.68rem',
              color: '#FFFFFF',
              fontWeight: 600,
            }}
          >
            💡 Click or drag pin to set location
          </div>
        )}
      </div>
    </div>
  );
}
