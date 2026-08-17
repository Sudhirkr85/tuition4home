export interface LocalityInfo {
  slug: string;
  name: string;
  pincode: string;
  landmark: string;
  activeTutorsCount: number;
  lat?: number;
  lng?: number;
  schools?: string[];
}

export interface MockTutor {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  introVideoUrl: string;
  videoDuration: string;
  highestDegree: string;
  experienceYears: number;
  gender?: string;
  teachingMode: 'OFFLINE_HOME' | 'ONLINE_LIVE' | 'BOTH';
  subjects: string[];
  classes: string[];
  boards: string[];
  serviceAreas: string[];
  travelRadiusKm: number;
  latitude?: number;
  longitude?: number;
  hourlyRateHome: number;
  hourlyRateHomeMin?: number;
  hourlyRateHomeMax?: number;
  hourlyRateOnline: number;
  hourlyRateOnlineMin?: number;
  hourlyRateOnlineMax?: number;
  monthlyRateMin: number;
  isVerified: boolean;
  hasPoliceCheck: boolean;
  rating: number;
  totalReviews: number;
  bio: string;
  badge: string;
}

export const GURGAON_LOCALITIES: LocalityInfo[] = [
  { slug: 'dlf-phase-5', name: 'DLF Phase 5', pincode: '122009', landmark: 'The Aralias, Magnolias, Horizon Centre', activeTutorsCount: 0, schools: ['The Shri Ram School Aravali', 'Shiv Nadar School', 'DPS International'] },
  { slug: 'golf-course-road', name: 'Golf Course Road', pincode: '122002', landmark: 'One Horizon, Mega Mall, Sector 42', activeTutorsCount: 0, schools: ['GD Goenka World School', 'Suncity School', 'Alpine Convent'] },
  { slug: 'golf-course-extension', name: 'Golf Course Extension (Sector 65-66)', pincode: '122018', landmark: 'M3M Golfestate, Emerald Hills, Trump Towers', activeTutorsCount: 0, schools: ['Pathways School', 'K.R. Mangalam World School'] },
  { slug: 'dlf-phase-1', name: 'DLF Phase 1', pincode: '122002', landmark: 'Silver Oaks, Mega Mall, Qutab Plaza', activeTutorsCount: 0, schools: ['Blue Bells Model School', 'Delhi Public School Maruti Kunj'] },
  { slug: 'dlf-phase-2', name: 'DLF Phase 2', pincode: '122002', landmark: 'Cyber City, Oakwood, Jacaranda Marg', activeTutorsCount: 0, schools: ['Euro International School', 'Ryan International'] },
  { slug: 'dlf-phase-3', name: 'DLF Phase 3 & Cyber City', pincode: '122002', landmark: 'Moulsari Avenue, Ambience Mall, Cyber Hub', activeTutorsCount: 0, schools: ['The Millennium School', 'Amity International'] },
  { slug: 'dlf-phase-4', name: 'DLF Phase 4', pincode: '122009', landmark: 'Galleria Market, Supermart, Ridgewood', activeTutorsCount: 0, schools: ['Lancers International School', 'Salwan Public School'] },
  { slug: 'sohna-road', name: 'Sohna Road', pincode: '122018', landmark: 'Vatika City, Malibu Town, Subhash Chowk', activeTutorsCount: 0, schools: ['GD Goenka Public School', 'Manav Rachna International'] },
  { slug: 'nirvana-country', name: 'Nirvana Country (Sector 50)', pincode: '122018', landmark: 'South City 2, Unitech Fresco', activeTutorsCount: 0, schools: ['Lotus Valley International', 'Suncity World School'] },
  { slug: 'south-city-gurgaon', name: 'South City 1 & 2', pincode: '122001', landmark: 'Unitech Arcadia, Nirvana South, Sector 49', activeTutorsCount: 0, schools: ['The Heritage School', 'Apeejay School'] },
  { slug: 'sector-51-mayfield', name: 'Sector 51 & Mayfield Garden', pincode: '122003', landmark: 'Mayfield Garden, Artemis Hospital, Samaspur', activeTutorsCount: 0, schools: ['Shalom Hills International', 'Paras World School'] },
  { slug: 'sector-56', name: 'Sector 56', pincode: '122011', landmark: 'HUDA Market, Rapid Metro, Kendriya Vihar', activeTutorsCount: 0, schools: ['DAV Public School Sector 56', 'Presidium School'] },
  { slug: 'sector-57', name: 'Sector 57', pincode: '122003', landmark: 'Hong Kong Bazaar, Sushant Lok 3', activeTutorsCount: 0, schools: ['Scottish High International', 'Vivekananda School'] },
  { slug: 'sector-14', name: 'Sector 14 & Old DLF', pincode: '122001', landmark: 'SSSAM Academy Center, HUDA Market', activeTutorsCount: 0, schools: ['St. Paul School Sector 14', 'Dronacharya Govt. College Area Schools'] },
  { slug: 'sector-47-uniworld', name: 'Sector 47 & Malibu Town', pincode: '122018', landmark: 'Uniworld Gardens, Malibu Town, ILD Spire', activeTutorsCount: 0, schools: ['Gems Modern Academy', 'Wisdom High International'] },
  { slug: 'sector-48', name: 'Sector 48', pincode: '122018', landmark: 'Vipul Greens, Central Park, JMD Megapolis', activeTutorsCount: 0, schools: ['CCA School', 'Manav Rachna'] },
  { slug: 'dwarka-expressway', name: 'Dwarka Expressway (Sector 102-109)', pincode: '122006', landmark: 'ATS Tourmaline, Sobha City, Puri Diplomatic', activeTutorsCount: 0, schools: ['KIIT World School', 'Indus World School'] },
  { slug: 'palam-vihar', name: 'Palam Vihar', pincode: '122017', landmark: 'Ansal Plaza, Chiranjiv Bharati School', activeTutorsCount: 0, schools: ['Chiranjiv Bharati School', 'Bal Bharti Public School'] },
  { slug: 'sector-82', name: 'New Gurgaon (Sector 82-84)', pincode: '122004', landmark: 'Vatika India Next, Mapsko', activeTutorsCount: 0, schools: ['Shree Ram Global School', 'MDN Edify Education'] },
  { slug: 'sushant-lok-1', name: 'Sushant Lok 1', pincode: '122009', landmark: 'Gold Souk, Vyapar Kendra, Fortis', activeTutorsCount: 0, schools: ['St. Xaviers School', 'DPS Sushant Lok'] },
  { slug: 'sector-45', name: 'Sector 45', pincode: '122003', landmark: 'HUDA City Centre Metro, DPS Gurgaon', activeTutorsCount: 0, schools: ['Delhi Public School Sector 45', 'Amity International Sector 46'] },
  { slug: 'sector-46', name: 'Sector 46', pincode: '122003', landmark: 'Rapid Metro, Mini Secretariat, IFFCO Chowk', activeTutorsCount: 0, schools: ['Amity International School', 'The Shriram Millennium'] },
  { slug: 'sector-49-50', name: 'Sector 49 & 50', pincode: '122018', landmark: 'Unitech Cyber Park, Nirvana Country Gate', activeTutorsCount: 0, schools: ['Lotus Valley International', 'The Northstar School'] },
  { slug: 'sector-52-53', name: 'Sector 52 & 53', pincode: '122003', landmark: 'Golf Course Road Extension, Rapid Metro Phase II', activeTutorsCount: 0, schools: ['Alpine Convent School', 'Euro International School'] },
  { slug: 'sector-54-55', name: 'Sector 54 & 55', pincode: '122003', landmark: 'Golf Course Road, DLF The Ultima', activeTutorsCount: 0, schools: ['Pathways World School', 'Suncity School'] },
  { slug: 'sector-62-63', name: 'Sector 62 & 63', pincode: '122011', landmark: 'Vatika Business Park, Iris Tech Park', activeTutorsCount: 0, schools: ['The Heritage School Sector 62', 'St. Xaviers High School'] },
  { slug: 'sector-67-68', name: 'Sector 67 & 68', pincode: '122018', landmark: 'JMD Megapolis, Bestech Business Tower', activeTutorsCount: 0, schools: ['GD Goenka Public School', 'K.R. Mangalam GRS'] },
  { slug: 'sector-69-70', name: 'Sector 69 & 70', pincode: '122101', landmark: 'Tata Primanti, Sohna Road Extension', activeTutorsCount: 0, schools: ['Delhi World Public School', 'RPS International'] },
  { slug: 'sector-72-73-74', name: 'Sector 72, 73 & 74', pincode: '122004', landmark: 'Southern Periphery, Badshahpur', activeTutorsCount: 0, schools: ['Ryan International Sector 74', 'Pragati Public School'] },
  { slug: 'sector-84-85-86', name: 'Sector 84, 85 & 86', pincode: '122004', landmark: 'New Gurgaon, Raheja Navodaya, Mapsko Royal Ville', activeTutorsCount: 0, schools: ['GD Goenka International', 'Indus World School'] },
  { slug: 'sector-89-90-91', name: 'Sector 89, 90 & 91', pincode: '122505', landmark: 'New Gurgaon Hub, KMP Expressway Side', activeTutorsCount: 0, schools: ['Shree Ram Millennium', 'KIIT World School'] },
  { slug: 'sector-92-95', name: 'Sector 92 & 95', pincode: '122505', landmark: 'Atul Kataria Chowk, Manesar Border', activeTutorsCount: 0, schools: ['Blue Bells School', 'Presidium School'] },
  { slug: 'sushant-lok-2-3', name: 'Sushant Lok 2 & 3', pincode: '122009', landmark: 'Near Huda City Centre, Sector 55-56 Border', activeTutorsCount: 0, schools: ['Scottish High International', 'Vivekananda School'] },
  { slug: 'ardee-city', name: 'Ardee City', pincode: '122003', landmark: 'Near Sector 52, Krishna Chowk', activeTutorsCount: 0, schools: ['Alpine Convent', 'Euro International School'] },
  { slug: 'sun-city', name: 'Sun City (Sector 54)', pincode: '122011', landmark: 'Unitech Sun City, Golf Course Road', activeTutorsCount: 0, schools: ['Suncity School', 'Amity International'] },
  { slug: 'dwarka-sector-1-12-delhi', name: 'Dwarka Sector 1-12 (South-West Delhi)', pincode: '110075', landmark: 'Venkateshwar Hospital, City Centre, Sector 6/10', activeTutorsCount: 0, schools: ['DPS Dwarka', 'Mount Carmel School', 'Venkateshwar International'] },
  { slug: 'dwarka-sector-13-23-delhi', name: 'Dwarka Sector 13-23 (Expressway Border)', pincode: '110077', landmark: 'Dwarka Sector 21 Metro, Vegas Mall, Sector 23', activeTutorsCount: 0, schools: ['BGS International Public School', 'Bal Bharati Public School', 'Indraprastha International'] },
  { slug: 'kapashera-bijwasan-border', name: 'Kapashera & Bijwasan (Delhi-Gurgaon Border)', pincode: '110037', landmark: 'Kapashera Border, Bijwasan Flyover, Fun N Food Village', activeTutorsCount: 0, schools: ['St. Marys School', 'Nirmal Bhartia School'] },
  { slug: 'vasant-kunj-delhi', name: 'Vasant Kunj (South Delhi)', pincode: '110070', landmark: 'DLF Promenade, Ambience Mall Vasant Kunj, Fortis', activeTutorsCount: 0, schools: ['Delhi Public School Vasant Kunj', 'Bloom Public School', 'Ryan International School'] },
  { slug: 'vasant-vihar-shanti-niketan', name: 'Vasant Vihar & Shanti Niketan (South Delhi)', pincode: '110057', landmark: 'Priya Complex, Basant Lok, Munirka Marg', activeTutorsCount: 0, schools: ['Modern School Vasant Vihar', 'Tagore International', 'DPS R.K. Puram Proximity'] },
  { slug: 'chhattarpur-dlf-farms', name: 'Chhattarpur & DLF Farms (South Delhi)', pincode: '110074', landmark: 'Chhattarpur Temple, Tivoli Garden, Sultanpur Metro', activeTutorsCount: 0, schools: ['St. Xaviers School', 'Bhatti Mines Heritage Area'] },
  { slug: 'saket-sainik-farm', name: 'Saket & Sainik Farm (South Delhi)', pincode: '110017', landmark: 'Select CITYWALK, Max Hospital, Saket District Centre', activeTutorsCount: 0, schools: ['Amity International School Saket', 'Apeejay School Saket', 'DPS International'] },
  { slug: 'hauz-khas-green-park', name: 'Hauz Khas & Green Park (South Delhi)', pincode: '110016', landmark: 'Hauz Khas Village, Aurobindo Market, IIT Delhi Area', activeTutorsCount: 0, schools: ['The Mothers International School', 'Delhi Public School R.K. Puram', 'Laxman Public School'] },
  { slug: 'rajokri-aerocity-mahipalpur', name: 'Rajokri, Aerocity & Mahipalpur (NH-48 Corridor)', pincode: '110038', landmark: 'Worldmark Aerocity, Rajokri Flyover, Radisson Blu', activeTutorsCount: 0, schools: ['Air Force Golden Jubilee Institute', 'St. Michaels Senior Secondary'] },
  { slug: 'janakpuri-vikaspuri-delhi', name: 'Janakpuri & Vikaspuri (West Delhi)', pincode: '110058', landmark: 'District Centre Janakpuri, Unity One Mall, Outer Ring Rd', activeTutorsCount: 0, schools: ['St. Francis de Sales School', 'St. Marks Senior Secondary School'] },
  { slug: 'palam-mahavir-enclave', name: 'Palam & Mahavir Enclave (South-West Delhi)', pincode: '110045', landmark: 'Palam Metro Station, Dwarka Flyover, Dashrathpuri', activeTutorsCount: 0, schools: ['Air Force Bal Bharati School', 'Kendriya Vidyalaya Sector 8'] },
];

export const SUBJECT_OPTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'NEET Biology Prep',
  'JEE Main & Advanced Maths',
  'JEE Physics',
  'Computer Science & Python',
  'C++ & Data Structures',
  'Java Programming (ICSE)',
  'Web Development & Coding for Kids',
  'Accountancy & Bookkeeping',
  'Business Studies',
  'Economics & Microeconomics',
  'English Language & Literature',
  'Hindi & Sanskrit',
  'Social Science (History, Geo, Civics, Eco)',
  'Science (Class 1 - 10 Combined)',
  'All Primary Subjects (Class 1 - 5)',
  'Psychology',
  'Political Science',
  'Sociology',
  'History & Fine Arts',
  'IB Diploma Math (AA / AI HL & SL)',
  'IB Physics & Chemistry',
  'IB Biology & Environmental Science',
  'IGCSE Combined Science',
  'French / German / Spanish Language',
  'Abacus & Vedic Mathematics',
  'Other / Specify Custom Subject',
];


export const CLASS_OPTIONS = [
  'Class 1 - 5 (Primary Foundation)',
  'Class 6 - 8 (Middle School)',
  'Class 9 & 10 (CBSE / ICSE Board)',
  'Class 11 & 12 (Board & JEE/NEET)',
  'IB / IGCSE / Cambridge Elite',
  'IIT-JEE / NEET Special Mentorship',
  'Coding & AI for Kids',
];

export function getSubjectsForClass(selectedClass: string): string[] {
  if (!selectedClass) return SUBJECT_OPTIONS;

  if (selectedClass.includes('Class 1 - 5') || selectedClass.includes('Primary')) {
    return [
      'All Primary Subjects (Class 1 - 5)',
      'Mathematics (Primary Foundation)',
      'English Language & Phonics',
      'Hindi & Sanskrit Basics',
      'EVS & General Science',
      'Abacus & Vedic Mathematics',
      'Coding & Scratch for Kids',
    ];
  }

  if (selectedClass.includes('Class 6 - 8') || selectedClass.includes('Middle')) {
    return [
      'Mathematics (Class 6-8)',
      'Science (Physics, Chemistry, Biology)',
      'Social Science (History, Civics, Geography)',
      'English Grammar & Literature',
      'Hindi & Sanskrit',
      'Computer Science & Python Basics',
      'French / German Language',
    ];
  }

  if (selectedClass.includes('Class 9 & 10') || selectedClass.includes('Board')) {
    return [
      'Mathematics (Standard / Basic CBSE & ICSE)',
      'Physics (Conceptual & Numerical)',
      'Chemistry',
      'Biology',
      'Social Science (History, Geo, Civics, Eco)',
      'English Language & Literature',
      'Hindi / Sanskrit (Course A & B)',
      'Computer Applications & Python (Code 165/402)',
      'French / German Language',
    ];
  }

  if (selectedClass.includes('Class 11 & 12')) {
    return [
      'Mathematics (Applied & Core Maths)',
      'Physics (CBSE/ISC Core)',
      'Chemistry (Organic & Physical)',
      'Biology (Botany & Zoology)',
      'Accountancy & Financial Statements',
      'Economics & Macroeconomics',
      'Business Studies',
      'Computer Science (Python & SQL)',
      'Informatics Practices (IP)',
      'English Core & Literature',
      'Psychology',
      'Political Science & Sociology',
      'Applied Mathematics',
    ];
  }

  if (selectedClass.includes('IIT-JEE') || selectedClass.includes('NEET')) {
    return [
      'JEE Main & Advanced Mathematics',
      'JEE Physics (Mechanics, Electromagnetism, Modern Physics)',
      'JEE / NEET Physical & Organic Chemistry',
      'NEET Biology (Botany & Zoology Complete)',
      'NEET Inorganic Chemistry Specialist',
      'Foundation JEE/NEET for Class 9 & 10',
    ];
  }

  if (selectedClass.includes('IB') || selectedClass.includes('IGCSE') || selectedClass.includes('Cambridge')) {
    return [
      'IB Diploma Math (AA HL & SL)',
      'IB Diploma Math (AI HL & SL)',
      'IB Physics HL/SL',
      'IB Chemistry HL/SL',
      'IB Biology HL/SL',
      'IB Economics HL/SL',
      'IB Business Management',
      'IGCSE Extended Mathematics (0580)',
      'IGCSE Combined & Co-ordinated Science',
      'IGCSE Physics (0625) & Chemistry (0620)',
      'IGCSE English Language & Literature',
    ];
  }

  if (selectedClass.includes('Coding') || selectedClass.includes('AI')) {
    return [
      'Python Programming for Beginners & Kids',
      'Scratch & Block-Based Game Design',
      'Web Development (HTML, CSS, JavaScript)',
      'AI & Machine Learning Foundations for School Students',
      'Robotics & Arduino Basics',
      'C++ / Java School Curriculum Prep',
    ];
  }

  return SUBJECT_OPTIONS;
}

export const BOARD_OPTIONS = ['CBSE', 'ICSE', 'IB (International Baccalaureate)', 'IGCSE / Cambridge', 'State Board'];
export const FALLBACK_SHOWCASE_TUTORS: MockTutor[] = [];

export const VERIFIED_TUTORS: MockTutor[] = [];

export const SSSAM_OFFICE_DETAILS = {
  name: 'TuitionForHome',
  operatorName: 'SSSAM Academy',
  address: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
  geo: { lat: 28.4703, lng: 77.0418 },
  phones: ['+91 92170 31899'],
  email: 'info@tuitionforhome.com', // General default contact/info
  contactEmail: 'contact@tuitionforhome.com',
  supportEmail: 'support@tuitionforhome.com',
  tutorsEmail: 'tutors@tuitionforhome.com',
  website: 'https://tuitionforhome.com',
  hours: 'Mon - Sun: 9:00 AM – 9:00 PM',
};

