'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { calculateHaversineKm, getDistanceInfo, POPULAR_GURGAON_SECTORS } from '@/components/RapidoStyleMap';

interface TutorDistanceBadgeProps {
  tutorLatitude?: number;
  tutorLongitude?: number;
  serviceAreas?: string[];
  tutorName: string;
}

export default function TutorDistanceBadge({
  tutorLatitude,
  tutorLongitude,
  serviceAreas = [],
  tutorName,
}: TutorDistanceBadgeProps) {
  const [parentLocation, setParentLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user_detected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lng) {
          setParentLocation(parsed);
        }
      }
    } catch {}
  }, []);

  // Compute distance if parent location exists
  const distanceDetails = React.useMemo(() => {
    if (!parentLocation) return null;

    let tLat = tutorLatitude;
    let tLng = tutorLongitude;

    // Fallback coordinates based on service areas if missing
    if (!tLat || !tLng) {
      if (serviceAreas.length > 0) {
        const matchedSector = POPULAR_GURGAON_SECTORS.find(s =>
          serviceAreas.some(area => area.toLowerCase().includes(s.name.toLowerCase()))
        );
        if (matchedSector) {
          tLat = matchedSector.lat;
          tLng = matchedSector.lng;
        }
      }
      if (!tLat || !tLng) {
        tLat = 28.4552;
        tLng = 77.0945;
      }
    }

    const km = calculateHaversineKm(parentLocation.lat, parentLocation.lng, tLat, tLng);
    const info = getDistanceInfo(km);

    const sectorName = parentLocation.address.split(',')[0].replace('(Auto-Detected GPS)', '').trim();

    return {
      km,
      info,
      sectorName,
    };
  }, [parentLocation, tutorLatitude, tutorLongitude, serviceAreas]);

  if (!distanceDetails) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.35rem 0.75rem',
        borderRadius: '8px',
        backgroundColor: '#F1F5F9',
        border: '1px solid #E2E8F0',
        fontSize: '0.78rem',
        color: '#475569',
        fontWeight: 600,
      }}>
        <MapPin size={13} color="#0F6E56" />
        <span>Service Area: {serviceAreas.slice(0, 2).join(' • ') || 'Gurgaon Sectors'}</span>
      </div>
    );
  }

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.45rem',
      padding: '0.4rem 0.85rem',
      borderRadius: '10px',
      backgroundColor: distanceDetails.info.badgeBg,
      border: `1px solid ${distanceDetails.info.badgeBorder}`,
      fontSize: '0.8rem',
      color: distanceDetails.info.badgeColor,
      fontWeight: 700,
      flexWrap: 'wrap',
    }}>
      <MapPin size={14} color={distanceDetails.info.badgeColor} />
      <span>
        {distanceDetails.info.distanceText} from your sector (<strong>{distanceDetails.sectorName}</strong>)
      </span>
      <span style={{ opacity: 0.6 }}>•</span>
      <span style={{ fontSize: '0.74rem' }}>
        {distanceDetails.info.travelTime}
      </span>
    </div>
  );
}
