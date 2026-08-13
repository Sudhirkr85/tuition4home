'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Edit2, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { VERIFIED_TUTORS, MockTutor } from '@/lib/data';

interface RapidoStyleMapProps {
  onLocationSelected: (data: { address: string; lat: number; lng: number; nearestTutorsCount: number }) => void;
}

export default function RapidoStyleMap({ onLocationSelected }: RapidoStyleMapProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState('DLF Phase 5, Golf Course Road, Gurugram');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<MockTutor | null>(VERIFIED_TUTORS[0]);

  // Mock nearby tutor map pins relative to center location
  const mockTutorPins = [
    { tutor: VERIFIED_TUTORS[0], distance: '1.2 km', top: '28%', left: '32%' },
    { tutor: VERIFIED_TUTORS[1], distance: '2.1 km', top: '45%', left: '68%' },
    { tutor: VERIFIED_TUTORS[2], distance: '3.4 km', top: '65%', left: '25%' },
  ];

  const handleAutoDetectGPS = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsDetecting(false);
          const newAddress = 'Sector 56, Golf Course Extension, Gurugram';
          setDetectedAddress(newAddress);
          onLocationSelected({
            address: newAddress,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            nearestTutorsCount: 14,
          });
        },
        (error) => {
          setIsDetecting(false);
          onLocationSelected({
            address: detectedAddress,
            lat: 28.4595,
            lng: 77.0266,
            nearestTutorsCount: 12,
          });
        }
      );
    } else {
      setIsDetecting(false);
    }
  };

  return (
    <div className="apple-card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
      {/* Map Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-emerald)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span className="pulse-emerald" />
            <span>LIVE TUTOR PROXIMITY MAP (RAPIDO STYLE)</span>
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
          <Navigation size={14} />
          <span>{isDetecting ? 'Detecting GPS...' : '📍 Auto-Detect My Location'}</span>
        </button>
      </div>

      {/* Interactive Map Visual Box */}
      <div style={{
        position: 'relative',
        height: '280px',
        borderRadius: '16px',
        backgroundColor: '#E2E8F0',
        backgroundImage: 'radial-gradient(#CBD5E1 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
        border: '1px solid var(--border-hairline)',
        marginBottom: '1.25rem',
      }}>
        {/* Map Grid Lines Effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.6), rgba(243, 244, 246, 0.8))',
        }} />

        {/* Center Parent Location Pin */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Radar Pulse */}
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.15)',
            border: '1px solid rgba(0, 102, 204, 0.4)',
            top: '-25px',
            left: '-25px',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--brand-blue)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 102, 204, 0.4)',
            border: '2px solid #FFFFFF',
          }}>
            <MapPin size={22} />
          </div>
          <span style={{
            marginTop: '4px',
            fontSize: '0.72rem',
            fontWeight: 800,
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}>
            YOUR LOCATION
          </span>
        </div>

        {/* Dynamic Floating Nearby Tutor Avatar Pins */}
        {mockTutorPins.map((item) => (
          <button
            key={item.tutor.id}
            type="button"
            onClick={() => setSelectedTutor(item.tutor)}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              zIndex: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'var(--transition-fast)',
            }}
          >
            <div style={{
              position: 'relative',
              padding: '2px',
              borderRadius: '50%',
              backgroundColor: selectedTutor?.id === item.tutor.id ? 'var(--brand-emerald)' : '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.tutor.avatarUrl}
                alt={item.tutor.name}
                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: 'var(--brand-emerald)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
              }}>
                ✓
              </span>
            </div>

            <span style={{
              marginTop: '3px',
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: 'var(--text-main)',
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-hairline)',
              whiteSpace: 'nowrap',
            }}>
              {item.tutor.name.split(' ')[0]} ({item.distance})
            </span>
          </button>
        ))}
      </div>

      {/* Selected Tutor Quick Preview Map Card */}
      {selectedTutor && (
        <div style={{
          backgroundColor: 'var(--brand-blue-light)',
          border: '1px solid rgba(0, 102, 204, 0.18)',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedTutor.avatarUrl} alt={selectedTutor.name} style={{ width: '42px', height: '42px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {selectedTutor.name} <span style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 700 }}>(1.2 km away)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {selectedTutor.highestDegree} • ₹{selectedTutor.hourlyRateHome}/hr
              </div>
            </div>
          </div>

          <span className="badge badge-emerald">
            <ShieldCheck size={12} />
            <span>VERIFIED PROXIMITY MATCH</span>
          </span>
        </div>
      )}

      {/* Auto-Fetched Address Confirmation & Editable Box */}
      <div style={{
        backgroundColor: 'var(--bg-card-subtle)',
        border: '1px solid var(--border-hairline)',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            AUTO-FETCHED LOCATION DETAILS (CONFIRM & EDIT)
          </span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            style={{ fontSize: '0.78rem', color: 'var(--brand-blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <Edit2 size={13} />
            <span>{isEditing ? 'Save Address' : 'Edit Sector'}</span>
          </button>
        </div>

        {isEditing ? (
          <input
            type="text"
            value={detectedAddress}
            onChange={(e) => setDetectedAddress(e.target.value)}
            className="form-control"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
          />
        ) : (
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--brand-emerald)" />
            <span>{detectedAddress}</span>
          </div>
        )}
      </div>
    </div>
  );
}
