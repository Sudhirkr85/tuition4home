export interface SEOLocation {
  city: string; // Slug (e.g. 'gurgaon', 'delhi', 'noida')
  label: string; // Display name (e.g. 'Gurgaon (Gurugram)')
  state: string; // State / Territory (e.g. 'Haryana', 'Delhi NCR', 'Uttar Pradesh')
  region: string; // Zone ('Delhi NCR')
  pincode?: string;
  popularLocalities?: string[];
  isTopCity?: boolean;
}

export const SEO_LOCATIONS: SEOLocation[] = [
  // --- CURATED DELHI NCR & GURUGRAM HUBS (GENUINE PHYSICAL OPERATIONAL REACH) ---
  {
    city: 'gurgaon',
    label: 'Gurgaon (Gurugram)',
    state: 'Haryana',
    region: 'Delhi NCR',
    pincode: '122001',
    popularLocalities: ['DLF Phase 1-5', 'Golf Course Road', 'Sohna Road', 'Sector 14', 'Sector 56', 'Nirvana Country'],
    isTopCity: true,
  },
  {
    city: 'delhi',
    label: 'Delhi',
    state: 'Delhi NCR',
    region: 'Delhi NCR',
    pincode: '110001',
    popularLocalities: ['Dwarka', 'Vasant Kunj', 'South Extension', 'Rohini', 'Hauz Khas', 'Janakpuri'],
    isTopCity: true,
  },
  {
    city: 'noida',
    label: 'Noida',
    state: 'Uttar Pradesh',
    region: 'Delhi NCR',
    pincode: '201301',
    popularLocalities: ['Sector 62', 'Sector 50', 'Sector 137', 'Sector 18', 'Sector 76', 'Sector 128'],
    isTopCity: true,
  },
  {
    city: 'greater-noida',
    label: 'Greater Noida',
    state: 'Uttar Pradesh',
    region: 'Delhi NCR',
    pincode: '201310',
    popularLocalities: ['Knowledge Park', 'Pari Chowk', 'Alpha 1', 'Beta 2', 'Omnicron'],
    isTopCity: true,
  },
  {
    city: 'faridabad',
    label: 'Faridabad',
    state: 'Haryana',
    region: 'Delhi NCR',
    pincode: '121001',
    popularLocalities: ['Sector 15', 'Sector 16', 'Sector 21C', 'Greenfield Colony', 'Surajkund'],
    isTopCity: true,
  },
  {
    city: 'ghaziabad',
    label: 'Ghaziabad',
    state: 'Uttar Pradesh',
    region: 'Delhi NCR',
    pincode: '201001',
    popularLocalities: ['Indirapuram', 'Vaishali', 'Vasundhara', 'Crossings Republik', 'Raj Nagar Extension'],
    isTopCity: true,
  },
];

// In-memory index map for O(1) query performance
const locationMap = new Map<string, SEOLocation>();
SEO_LOCATIONS.forEach((loc) => {
  locationMap.set(loc.city.toLowerCase(), loc);
});

export function getLocationBySlug(slug: string): SEOLocation | undefined {
  if (!slug) return undefined;
  return locationMap.get(slug.toLowerCase().trim());
}

export function getAllLocationSlugs(): string[] {
  return SEO_LOCATIONS.map((l) => l.city);
}

export function getTopLocations(): SEOLocation[] {
  return SEO_LOCATIONS.filter((l) => l.isTopCity);
}

export function getNearbyLocations(citySlug: string, limit?: number): SEOLocation[] {
  const nearby = SEO_LOCATIONS.filter((l) => l.city !== citySlug.toLowerCase().trim());
  return limit ? nearby.slice(0, limit) : nearby;
}
