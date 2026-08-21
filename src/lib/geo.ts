export interface GurgaonSector {
  name: string;
  landmark: string;
  lat: number;
  lng: number;
}

export const POPULAR_GURGAON_SECTORS: GurgaonSector[] = [
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
