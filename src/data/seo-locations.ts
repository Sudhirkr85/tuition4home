export interface SEOLocation {
  city: string; // Slug (e.g. 'gurgaon', 'dlf-phase-5', 'delhi', 'bangalore')
  label: string; // Display name (e.g. 'Gurgaon', 'DLF Phase 5, Gurgaon')
  state: string; // State / Territory (e.g. 'Haryana', 'Delhi NCR', 'Karnataka')
  region: string; // Zone (e.g. 'North India', 'South India', 'West India')
  pincode?: string;
  popularLocalities?: string[];
  isTopCity?: boolean;
}

export const SEO_LOCATIONS: SEOLocation[] = [
  // --- TOP METROS & NCR CITIES (PRIMARY HUBS) ---
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
  {
    city: 'bangalore',
    label: 'Bangalore (Bengaluru)',
    state: 'Karnataka',
    region: 'South India',
    pincode: '560001',
    popularLocalities: ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Jayanagar', 'Electronic City'],
    isTopCity: true,
  },
  {
    city: 'mumbai',
    label: 'Mumbai',
    state: 'Maharashtra',
    region: 'West India',
    pincode: '400001',
    popularLocalities: ['Bandra', 'Andheri', 'Powai', 'Juhu', 'Worli', 'Thane'],
    isTopCity: true,
  },
  {
    city: 'hyderabad',
    label: 'Hyderabad',
    state: 'Telangana',
    region: 'South India',
    pincode: '500001',
    popularLocalities: ['Hitec City', 'Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills', 'Kondapur'],
    isTopCity: true,
  },
  {
    city: 'pune',
    label: 'Pune',
    state: 'Maharashtra',
    region: 'West India',
    pincode: '411001',
    popularLocalities: ['Kothrud', 'Viman Nagar', 'Baner', 'Aundh', 'Wakad', 'Hinjewadi'],
    isTopCity: true,
  },
  {
    city: 'chennai',
    label: 'Chennai',
    state: 'Tamil Nadu',
    region: 'South India',
    pincode: '600001',
    popularLocalities: ['Anna Nagar', 'Adyar', 'T. Nagar', 'Velachery', 'Besant Nagar', 'Mylapore'],
    isTopCity: false,
  },
  {
    city: 'kolkata',
    label: 'Kolkata',
    state: 'West Bengal',
    region: 'East India',
    pincode: '700001',
    popularLocalities: ['Salt Lake', 'New Town', 'Ballygunge', 'Alipore', 'Park Street', 'Howrah'],
    isTopCity: false,
  },
  {
    city: 'chandigarh',
    label: 'Chandigarh',
    state: 'Punjab & Haryana',
    region: 'North India',
    pincode: '160017',
    popularLocalities: ['Sector 17', 'Sector 35', 'Sector 8', 'Panchkula Sector 20', 'Mohali Phase 7'],
    isTopCity: false,
  },
  {
    city: 'jaipur',
    label: 'Jaipur',
    state: 'Rajasthan',
    region: 'North India',
    pincode: '302001',
    popularLocalities: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park'],
    isTopCity: false,
  },
  {
    city: 'lucknow',
    label: 'Lucknow',
    state: 'Uttar Pradesh',
    region: 'North India',
    pincode: '226001',
    popularLocalities: ['Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Hazratganj', 'Mahanagar'],
    isTopCity: false,
  },
  {
    city: 'ahmedabad',
    label: 'Ahmedabad',
    state: 'Gujarat',
    region: 'West India',
    pincode: '380001',
    popularLocalities: ['Bodakdev', 'Satellite', 'Vastrapur', 'Navrangpura', 'Prahlad Nagar'],
    isTopCity: false,
  },

  // --- GURGAON MICRO-LOCALITIES & SECTORS ---
  {
    city: 'dlf-phase-5',
    label: 'DLF Phase 5, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Ultra-Luxury',
    pincode: '122009',
    popularLocalities: ['The Aralias', 'The Magnolias', 'The Camellias', 'Horizon Centre', 'Carlton Estate'],
    isTopCity: true,
  },
  {
    city: 'golf-course-road',
    label: 'Golf Course Road, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Premium',
    pincode: '122002',
    popularLocalities: ['Sector 42', 'Sector 43', 'Sector 53', 'Palm Springs', 'One Horizon Center'],
    isTopCity: true,
  },
  {
    city: 'golf-course-extension',
    label: 'Golf Course Ext Road, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Prime',
    pincode: '122102',
    popularLocalities: ['Sector 65', 'Sector 66', 'M3M Golfestate', 'Pioneer Araya', 'Emaar Palm Drive'],
    isTopCity: true,
  },
  {
    city: 'dlf-phase-1',
    label: 'DLF Phase 1, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon North',
    pincode: '122002',
    popularLocalities: ['Silver Oaks', 'Qutab Plaza', 'Mega Mall', 'Block A to H'],
    isTopCity: false,
  },
  {
    city: 'dlf-phase-2',
    label: 'DLF Phase 2, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon North',
    pincode: '122008',
    popularLocalities: ['Cyber City', 'Heritage School area', 'Oakwood Estate', 'Belvedere Park'],
    isTopCity: false,
  },
  {
    city: 'dlf-phase-3',
    label: 'DLF Phase 3, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon North',
    pincode: '122010',
    popularLocalities: ['Moulsari Avenue', 'Ambience Mall Zone', 'U-Block', 'Pink Town Houses'],
    isTopCity: false,
  },
  {
    city: 'dlf-phase-4',
    label: 'DLF Phase 4, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon North',
    pincode: '122009',
    popularLocalities: ['Galleria Market', 'Ridgewood Estate', 'Regency Park', 'Hamilton Court'],
    isTopCity: false,
  },
  {
    city: 'sohna-road',
    label: 'Sohna Road, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon South',
    pincode: '122018',
    popularLocalities: ['Sector 47', 'Sector 48', 'Sector 49', 'Vipul Greens', 'Sispal Vihar'],
    isTopCity: true,
  },
  {
    city: 'sector-14-gurgaon',
    label: 'Sector 14 (Old DLF), Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Central',
    pincode: '122001',
    popularLocalities: ['Old DLF Colony', 'M-Block Market', 'Air Force School Area', 'Mehrauli Road'],
    isTopCity: true,
  },
  {
    city: 'sector-56-gurgaon',
    label: 'Sector 56 & 57, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon East',
    pincode: '122011',
    popularLocalities: ['Kendriya Vihar', 'Devinder Vihar', 'Rail Vihar', 'Hong Kong Bazaar'],
    isTopCity: false,
  },
  {
    city: 'nirvana-country',
    label: 'Nirvana Country & Sector 50, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Central',
    pincode: '122018',
    popularLocalities: ['South City 2', 'Fresco', 'Unitech Woodlands', 'Rosewood City'],
    isTopCity: false,
  },
  {
    city: 'palam-vihar',
    label: 'Palam Vihar, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon West',
    pincode: '122017',
    popularLocalities: ['Block C1', 'Block C2', 'Ansal Plaza Area', 'Sector 23', 'Carterpuri'],
    isTopCity: false,
  },
  {
    city: 'south-city-1',
    label: 'South City 1 & Sector 30, Gurgaon',
    state: 'Haryana',
    region: 'Gurgaon Central',
    pincode: '122001',
    popularLocalities: ['Signature Towers area', 'Silk Board', 'Unitech Palms', 'Block A-N'],
    isTopCity: false,
  },
  {
    city: 'new-gurgaon',
    label: 'New Gurgaon (Sectors 82-95)',
    state: 'Haryana',
    region: 'Gurgaon West',
    pincode: '122004',
    popularLocalities: ['Sector 82', 'Sector 83', 'Sector 84', 'Vatika India Next', 'Mapsko Mount Ville'],
    isTopCity: false,
  },

  // --- DELHI NCR MICRO-HUBS ---
  {
    city: 'dwarka',
    label: 'Dwarka, New Delhi',
    state: 'Delhi NCR',
    region: 'South West Delhi',
    pincode: '110075',
    popularLocalities: ['Sector 6', 'Sector 10', 'Sector 12', 'Sector 22', 'Sector 23', 'Ramphal Chowk'],
    isTopCity: true,
  },
  {
    city: 'vasant-kunj',
    label: 'Vasant Kunj, New Delhi',
    state: 'Delhi NCR',
    region: 'South Delhi',
    pincode: '110070',
    popularLocalities: ['Sector A', 'Sector B', 'Sector C', 'Sector D', 'Promenade Mall area'],
    isTopCity: true,
  },
  {
    city: 'vasant-vihar',
    label: 'Vasant Vihar & Chanakyapuri',
    state: 'Delhi NCR',
    region: 'South Delhi',
    pincode: '110057',
    popularLocalities: ['Basant Lok', 'Priya Cinema zone', 'Diplomatic Enclave', 'Anand Niketan'],
    isTopCity: false,
  },
  {
    city: 'saket',
    label: 'Saket & Hauz Khas, New Delhi',
    state: 'Delhi NCR',
    region: 'South Delhi',
    pincode: '110017',
    popularLocalities: ['Select Citywalk area', 'J-Block', 'SDA Market', 'Green Park', 'Malviya Nagar'],
    isTopCity: false,
  },
  {
    city: 'rohini',
    label: 'Rohini & Pitampura, New Delhi',
    state: 'Delhi NCR',
    region: 'North West Delhi',
    pincode: '110085',
    popularLocalities: ['Sector 7', 'Sector 9', 'Sector 13', 'Pitampura Netaji Subhash Place', 'Prashant Vihar'],
    isTopCity: false,
  },
  {
    city: 'janakpuri',
    label: 'Janakpuri & West Delhi',
    state: 'Delhi NCR',
    region: 'West Delhi',
    pincode: '110058',
    popularLocalities: ['District Centre', 'C-Block', 'A-Block', 'Tilak Nagar', 'Vikaspuri', 'Rajouri Garden'],
    isTopCity: false,
  },
  {
    city: 'indirapuram',
    label: 'Indirapuram & Vaishali',
    state: 'Uttar Pradesh',
    region: 'Ghaziabad NCR',
    pincode: '201014',
    popularLocalities: ['Ahinsa Khand 1 & 2', 'Nyay Khand', 'Vaishali Sector 4', 'Shipra Sun City'],
    isTopCity: false,
  },
  {
    city: 'noida-sector-62',
    label: 'Sector 62 & 50, Noida',
    state: 'Uttar Pradesh',
    region: 'Noida Central',
    pincode: '201309',
    popularLocalities: ['Electronic City', 'Sector 50 Mahagun', 'Sector 76 Metro Zone', 'Sector 137 Expressway'],
    isTopCity: false,
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
  return SEO_LOCATIONS.map((loc) => loc.city);
}

export function getTopLocations(): SEOLocation[] {
  return SEO_LOCATIONS.filter((loc) => loc.isTopCity);
}

export function getNearbyLocations(currentSlug: string, count: number = 6): SEOLocation[] {
  const current = getLocationBySlug(currentSlug);
  if (!current) return SEO_LOCATIONS.slice(0, count);

  const sameRegion = SEO_LOCATIONS.filter(
    (loc) => loc.city !== current.city && (loc.state === current.state || loc.region === current.region)
  );

  if (sameRegion.length >= count) {
    return sameRegion.slice(0, count);
  }

  const others = SEO_LOCATIONS.filter(
    (loc) => loc.city !== current.city && loc.state !== current.state && loc.region !== current.region
  );

  return [...sameRegion, ...others].slice(0, count);
}
