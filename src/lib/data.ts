export interface LocalityInfo {
  slug: string;
  name: string;
  pincode: string;
  landmark: string;
  activeTutorsCount: number;
  lat?: number;
  lng?: number;
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
  { slug: 'dlf-phase-5', name: 'DLF Phase 5', pincode: '122009', landmark: 'The Aralias, Magnolias, Horizon Centre', activeTutorsCount: 0 },
  { slug: 'golf-course-road', name: 'Golf Course Road', pincode: '122002', landmark: 'One Horizon, Mega Mall, Sector 42', activeTutorsCount: 0 },
  { slug: 'dlf-phase-1', name: 'DLF Phase 1', pincode: '122002', landmark: 'Silver Oaks, Mega Mall, Qutab Plaza', activeTutorsCount: 0 },
  { slug: 'dlf-phase-2', name: 'DLF Phase 2', pincode: '122002', landmark: 'Cyber City, Oakwood, Jacaranda Marg', activeTutorsCount: 0 },
  { slug: 'dlf-phase-4', name: 'DLF Phase 4', pincode: '122009', landmark: 'Galleria Market, Supermart, Ridgewood', activeTutorsCount: 0 },
  { slug: 'sohna-road', name: 'Sohna Road', pincode: '122018', landmark: 'Vatika City, Malibu Town, Subhash Chowk', activeTutorsCount: 0 },
  { slug: 'nirvana-country', name: 'Nirvana Country (Sector 50)', pincode: '122018', landmark: 'South City 2, Unitech Fresco', activeTutorsCount: 0 },
  { slug: 'sector-56', name: 'Sector 56', pincode: '122011', landmark: 'HUDA Market, Rapid Metro, Kendriya Vihar', activeTutorsCount: 0 },
  { slug: 'sector-57', name: 'Sector 57', pincode: '122003', landmark: 'Hong Kong Bazaar, Sushant Lok 3', activeTutorsCount: 0 },
  { slug: 'sector-14', name: 'Sector 14 & Old DLF', pincode: '122001', landmark: 'SSSAM Academy Center, HUDA Market', activeTutorsCount: 0 },
  { slug: 'sector-48', name: 'Sector 48', pincode: '122018', landmark: 'Vipul Greens, Central Park, JMD Megapolis', activeTutorsCount: 0 },
  { slug: 'palam-vihar', name: 'Palam Vihar', pincode: '122017', landmark: 'Ansal Plaza, Chiranjiv Bharati School', activeTutorsCount: 0 },
  { slug: 'sector-82', name: 'New Gurgaon (Sector 82-84)', pincode: '122004', landmark: 'Vatika India Next, Mapsko', activeTutorsCount: 0 },
  { slug: 'sushant-lok-1', name: 'Sushant Lok 1', pincode: '122009', landmark: 'Gold Souk, Vyapar Kendra, Fortis', activeTutorsCount: 0 },
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
  phones: ['+91 92170 31899', '+91 95174 47689'],
  email: 'info@tuitionforhome.com', // General default contact/info
  contactEmail: 'contact@tuitionforhome.com',
  supportEmail: 'support@tuitionforhome.com',
  tutorsEmail: 'tutors@tuitionforhome.com',
  website: 'https://tuitionforhome.com',
  hours: 'Mon - Sun: 9:00 AM – 9:00 PM',
};

