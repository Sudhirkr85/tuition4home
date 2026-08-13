export interface LocalityInfo {
  slug: string;
  name: string;
  pincode: string;
  landmark: string;
  activeTutorsCount: number;
}

export interface MockTutor {
  id: string;
  name: string;
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
  hourlyRateHome: number;
  hourlyRateOnline: number;
  monthlyRateMin: number;
  isVerified: boolean;
  hasPoliceCheck: boolean;
  rating: number;
  totalReviews: number;
  bio: string;
  badge: string;
}

export const GURGAON_LOCALITIES: LocalityInfo[] = [
  { slug: 'dlf-phase-5', name: 'DLF Phase 5', pincode: '122009', landmark: 'The Aralias, Magnolias, Horizon Centre', activeTutorsCount: 38 },
  { slug: 'golf-course-road', name: 'Golf Course Road', pincode: '122002', landmark: 'One Horizon, Mega Mall, Sector 42', activeTutorsCount: 45 },
  { slug: 'dlf-phase-1', name: 'DLF Phase 1', pincode: '122002', landmark: 'Silver Oaks, Mega Mall, Qutab Plaza', activeTutorsCount: 29 },
  { slug: 'dlf-phase-2', name: 'DLF Phase 2', pincode: '122002', landmark: 'Cyber City, Oakwood, Jacaranda Marg', activeTutorsCount: 34 },
  { slug: 'dlf-phase-4', name: 'DLF Phase 4', pincode: '122009', landmark: 'Galleria Market, Supermart, Ridgewood', activeTutorsCount: 42 },
  { slug: 'sohna-road', name: 'Sohna Road', pincode: '122018', landmark: 'Vatika City, Malibu Town, Subhash Chowk', activeTutorsCount: 52 },
  { slug: 'nirvana-country', name: 'Nirvana Country (Sector 50)', pincode: '122018', landmark: 'South City 2, Unitech Fresco', activeTutorsCount: 31 },
  { slug: 'sector-56', name: 'Sector 56', pincode: '122011', landmark: 'HUDA Market, Rapid Metro, Kendriya Vihar', activeTutorsCount: 36 },
  { slug: 'sector-57', name: 'Sector 57', pincode: '122003', landmark: 'Hong Kong Bazaar, Sushant Lok 3', activeTutorsCount: 27 },
  { slug: 'sector-14', name: 'Sector 14 & Old DLF', pincode: '122001', landmark: 'SSSAM Academy Center, HUDA Market', activeTutorsCount: 48 },
  { slug: 'sector-48', name: 'Sector 48', pincode: '122018', landmark: 'Vipul Greens, Central Park, JMD Megapolis', activeTutorsCount: 33 },
  { slug: 'palam-vihar', name: 'Palam Vihar', pincode: '122017', landmark: 'Ansal Plaza, Chiranjiv Bharati School', activeTutorsCount: 30 },
  { slug: 'sector-82', name: 'New Gurgaon (Sector 82-84)', pincode: '122004', landmark: 'Vatika India Next, Mapsko', activeTutorsCount: 25 },
  { slug: 'sushant-lok-1', name: 'Sushant Lok 1', pincode: '122009', landmark: 'Gold Souk, Vyapar Kendra, Fortis', activeTutorsCount: 35 },
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

export const BOARD_OPTIONS = ['CBSE', 'ICSE', 'IB (International Baccalaureate)', 'IGCSE / Cambridge', 'State Board'];

export const VERIFIED_TUTORS: MockTutor[] = [
  {
    id: 'tut-1',
    name: 'Rohit Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '1m 15s',
    highestDegree: 'M.Sc. Mathematics (Delhi University)',
    experienceYears: 7,
    teachingMode: 'BOTH',
    subjects: ['Mathematics', 'Physics'],
    classes: ['Class 9 & 10 (CBSE / ICSE Board)', 'Class 11 & 12 (Board & JEE/NEET)'],
    boards: ['CBSE', 'ICSE', 'IB (International Baccalaureate)'],
    serviceAreas: ['DLF Phase 5', 'Golf Course Road', 'Sector 56', 'Sushant Lok 1'],
    travelRadiusKm: 6,
    hourlyRateHome: 900,
    hourlyRateOnline: 600,
    monthlyRateMin: 7500,
    isVerified: true,
    hasPoliceCheck: true,
    rating: 4.95,
    totalReviews: 38,
    bio: 'Former coaching faculty specializing in conceptual Maths and Board exam 95+ score strategy. 100% personalized pacing for each child.',
    badge: 'Top 1% Maths Mentor',
  },
  {
    id: 'tut-2',
    name: 'Dr. Ananya Sengupta',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '1m 40s',
    highestDegree: 'Ph.D. Organic Chemistry (IIT Delhi Alum)',
    experienceYears: 9,
    teachingMode: 'BOTH',
    subjects: ['Chemistry', 'Biology'],
    classes: ['Class 11 & 12 (Board & JEE/NEET)', 'IIT-JEE / NEET Special Mentorship', 'IB / IGCSE / Cambridge Elite'],
    boards: ['CBSE', 'IB (International Baccalaureate)', 'IGCSE / Cambridge'],
    serviceAreas: ['DLF Phase 1', 'DLF Phase 4', 'Nirvana Country', 'Sohna Road'],
    travelRadiusKm: 8,
    hourlyRateHome: 1200,
    hourlyRateOnline: 800,
    monthlyRateMin: 9500,
    isVerified: true,
    hasPoliceCheck: true,
    rating: 4.98,
    totalReviews: 52,
    bio: 'Passionate Chemistry educator helping NEET and IB Diploma students grasp organic reaction mechanisms with zero rote learning.',
    badge: 'NEET Chemistry Specialist',
  },
  {
    id: 'tut-3',
    name: 'Vikramaditya Rao',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '1m 10s',
    highestDegree: 'B.Tech Computer Science (SSSAM Academy Faculty)',
    experienceYears: 5,
    teachingMode: 'BOTH',
    subjects: ['Computer Science & Python', 'Web Development & Coding (SSSAM)', 'Mathematics'],
    classes: ['Class 9 & 10 (CBSE / ICSE Board)', 'Class 11 & 12 (Board & JEE/NEET)', 'Coding & AI for Kids'],
    boards: ['CBSE', 'ICSE', 'IGCSE / Cambridge'],
    serviceAreas: ['Sector 14 & Old DLF', 'Sector 48', 'Palam Vihar', 'DLF Phase 2'],
    travelRadiusKm: 7,
    hourlyRateHome: 1000,
    hourlyRateOnline: 700,
    monthlyRateMin: 8000,
    isVerified: true,
    hasPoliceCheck: false,
    rating: 4.92,
    totalReviews: 29,
    bio: 'Lead Python instructor at SSSAM Academy Sector 14. Mentoring school students in CBSE Python, algorithmic thinking, and building live web projects.',
    badge: 'Python & AI Lead Tutor',
  },
  {
    id: 'tut-4',
    name: 'Priyanka Aggarwal',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDuration: '1m 25s',
    highestDegree: 'M.Com, Chartered Accountant (Inter)',
    experienceYears: 6,
    teachingMode: 'OFFLINE_HOME',
    subjects: ['Accountancy & Commerce', 'Economics'],
    classes: ['Class 11 & 12 (Board & JEE/NEET)', 'Class 9 & 10 (CBSE / ICSE Board)'],
    boards: ['CBSE', 'ISC / ICSE'],
    serviceAreas: ['Sector 56', 'Sector 57', 'Golf Course Road', 'DLF Phase 5'],
    travelRadiusKm: 5,
    hourlyRateHome: 850,
    hourlyRateOnline: 600,
    monthlyRateMin: 7000,
    isVerified: true,
    hasPoliceCheck: true,
    rating: 4.90,
    totalReviews: 24,
    bio: 'Specialist in Class 11-12 CBSE Accounts & Economics. Simplifies balance sheets and cash flow statements with practical company examples.',
    badge: 'Commerce & Accounts Pro',
  },
];

export const SSSAM_OFFICE_DETAILS = {
  name: 'TuitionForHome',
  operatorName: 'SSSAM Academy',
  address: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
  geo: { lat: 28.4703, lng: 77.0418 },
  phones: ['+91 95174 47689', '+91 92170 31899'],
  email: 'info@sssamacademy.com',
  website: 'https://sssamacademy.com',
  hours: 'Mon - Sun: 9:00 AM – 9:00 PM',
};
