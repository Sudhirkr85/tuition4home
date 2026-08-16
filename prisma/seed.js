const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const GURGAON_LOCALITIES = [
  { slug: 'dlf-phase-5', name: 'DLF Phase 5', pincode: '122009', landmark: 'The Aralias, Magnolias, Horizon Centre' },
  { slug: 'golf-course-road', name: 'Golf Course Road', pincode: '122002', landmark: 'One Horizon, Mega Mall, Sector 42' },
  { slug: 'dlf-phase-1', name: 'DLF Phase 1', pincode: '122002', landmark: 'Silver Oaks, Mega Mall, Qutab Plaza' },
  { slug: 'dlf-phase-2', name: 'DLF Phase 2', pincode: '122002', landmark: 'Cyber City, Oakwood, Jacaranda Marg' },
  { slug: 'dlf-phase-4', name: 'DLF Phase 4', pincode: '122009', landmark: 'Galleria Market, Supermart, Ridgewood' },
  { slug: 'sohna-road', name: 'Sohna Road', pincode: '122018', landmark: 'Vatika City, Malibu Town, Subhash Chowk' },
  { slug: 'nirvana-country', name: 'Nirvana Country (Sector 50)', pincode: '122018', landmark: 'South City 2, Unitech Fresco' },
  { slug: 'sector-56', name: 'Sector 56', pincode: '122011', landmark: 'HUDA Market, Rapid Metro, Kendriya Vihar' },
  { slug: 'sector-57', name: 'Sector 57', pincode: '122003', landmark: 'Hong Kong Bazaar, Sushant Lok 3' },
  { slug: 'sector-14', name: 'Sector 14 & Old DLF', pincode: '122001', landmark: 'SSSAM Academy Center, HUDA Market' },
  { slug: 'sector-48', name: 'Sector 48', pincode: '122018', landmark: 'Vipul Greens, Central Park, JMD Megapolis' },
  { slug: 'palam-vihar', name: 'Palam Vihar', pincode: '122017', landmark: 'Ansal Plaza, Chiranjiv Bharati School' },
  { slug: 'sector-82', name: 'New Gurgaon (Sector 82-84)', pincode: '122004', landmark: 'Vatika India Next, Mapsko' },
  { slug: 'sushant-lok-1', name: 'Sushant Lok 1', pincode: '122009', landmark: 'Gold Souk, Vyapar Kendra, Fortis' },
];

// Generator pools for 100 realistic tutors
const FIRST_NAMES = [
  'Rohit', 'Ananya', 'Vikram', 'Pooja', 'Amit', 'Neha', 'Suresh', 'Kavita', 'Rajat', 'Priyanka',
  'Deepak', 'Meenakshi', 'Arjun', 'Sneha', 'Manish', 'Ritika', 'Harish', 'Divya', 'Naveen', 'Simran',
  'Siddharth', 'Bhavna', 'Gaurav', 'Tanvi', 'Karan', 'Aakanksha', 'Rahul', 'Sunita', 'Vikas', 'Swati',
  'Prateek', 'Shreya', 'Ashish', 'Komal', 'Abhishek', 'Pallavi', 'Tarun', 'Anushka', 'Sachin', 'Preeti',
  'Yash', 'Rashi', 'Varun', 'Isha', 'Alok', 'Mahima', 'Kunal', 'Jyoti', 'Hemant', 'Sonam'
];

const LAST_NAMES = [
  'Sharma', 'Sengupta', 'Choudhary', 'Malhotra', 'Bhatia', 'Aggarwal', 'Verma', 'Mathur', 'Mittal', 'Gupta',
  'Saxena', 'Mehta', 'Kapoor', 'Rao', 'Bansal', 'Jain', 'Singhania', 'Narang', 'Arora', 'Dubey',
  'Tiwari', 'Pandey', 'Mishra', 'Chauhan', 'Rawat', 'Reddy', 'Menon', 'Nair', 'Mukherjee', 'Dutta'
];

const DEGREES = [
  'M.Sc. Mathematics (Delhi University)',
  'Ph.D. Organic Chemistry (IIT Delhi Alum)',
  'B.Tech Mechanical (IIT Roorkee)',
  'M.Sc. Physics (Hansraj College, DU)',
  'B.Com (Hons), CA Inter (SRCC)',
  'M.A. English Literature (JNU New Delhi)',
  'B.Tech Computer Science (DTU / DCE)',
  'M.Sc. Zoology & NEET Specialist (AIIMS Alum)',
  'M.A. Economics (Delhi School of Economics)',
  'B.El.Ed & Child Psychology Certified (DU)',
  'M.Sc. Biotechnology (Panjab University)',
  'B.Tech Electrical Engineering (NIT Kurukshetra)'
];

const SUBJECT_COMBOS = [
  ['Mathematics', 'Physics'],
  ['Chemistry', 'Biology'],
  ['Physics', 'Chemistry', 'Mathematics'],
  ['Mathematics'],
  ['Physics'],
  ['Chemistry'],
  ['Biology', 'Zoology'],
  ['Accounts', 'Economics', 'Business Studies'],
  ['Economics', 'Mathematics'],
  ['English Literature', 'Grammar'],
  ['Computer Science', 'Python', 'AI'],
  ['Science', 'Mathematics (Class 6-10)'],
  ['Primary All Subjects', 'Phonics (Class 1-5)'],
  ['French Language', 'English']
];

const LOCALITY_NAMES = [
  'DLF Phase 5', 'Golf Course Road', 'Sector 56', 'Sushant Lok 1',
  'DLF Phase 1', 'DLF Phase 2', 'DLF Phase 4', 'Cyber City',
  'Sohna Road', 'Nirvana Country', 'Sector 50', 'Sector 48',
  'Sector 14 & Old DLF', 'Palam Vihar', 'Sector 57', 'New Gurgaon (Sector 82-84)'
];

const AVATAR_URLS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80'
];

const GURGAON_COORDINATES = {
  'DLF Phase 5': { lat: 28.4552, lng: 77.0983 },
  'Golf Course Road': { lat: 28.4485, lng: 77.1050 },
  'Sector 56': { lat: 28.4285, lng: 77.1054 },
  'Sushant Lok 1': { lat: 28.4645, lng: 77.0780 },
  'DLF Phase 1': { lat: 28.4754, lng: 77.1023 },
  'DLF Phase 2': { lat: 28.4905, lng: 77.0898 },
  'DLF Phase 4': { lat: 28.4682, lng: 77.0872 },
  'Cyber City': { lat: 28.4950, lng: 77.0880 },
  'Sohna Road': { lat: 28.4198, lng: 77.0425 },
  'Nirvana Country': { lat: 28.4180, lng: 77.0650 },
  'Sector 50': { lat: 28.4175, lng: 77.0620 },
  'Sector 48': { lat: 28.4110, lng: 77.0380 },
  'Sector 14 & Old DLF': { lat: 28.4728, lng: 77.0345 },
  'Palam Vihar': { lat: 28.5080, lng: 77.0310 },
  'Sector 57': { lat: 28.4230, lng: 77.0870 },
  'New Gurgaon (Sector 82-84)': { lat: 28.3890, lng: 76.9680 }
};

// Generate 100 Verified Tutors Data
const GENERATED_TUTORS = [];
for (let i = 1; i <= 100; i++) {
  const fName = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
  const lName = LAST_NAMES[Math.floor((i * 7) % LAST_NAMES.length)];
  const name = `${fName} ${lName}`;
  const id = `tut-${i}`;
  const phone = `98${String(11000000 + i * 8371).slice(0, 8)}`;
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@tuitionforhome.com`;
  const degree = DEGREES[i % DEGREES.length];
  const exp = 3 + (i % 12);
  const subjects = SUBJECT_COMBOS[i % SUBJECT_COMBOS.length];
  const avatarUrl = AVATAR_URLS[i % AVATAR_URLS.length];
  
  // Pick 3-4 service areas
  const startLoc = i % LOCALITY_NAMES.length;
  const primaryLoc = LOCALITY_NAMES[startLoc];
  const serviceAreas = [
    primaryLoc,
    LOCALITY_NAMES[(startLoc + 1) % LOCALITY_NAMES.length],
    LOCALITY_NAMES[(startLoc + 2) % LOCALITY_NAMES.length],
    LOCALITY_NAMES[(startLoc + 3) % LOCALITY_NAMES.length]
  ];

  const baseCoords = GURGAON_COORDINATES[primaryLoc] || { lat: 28.4552, lng: 77.0983 };
  // Organic jitter around the primary sector within ~300-500 meters
  const angle = (i * 137.5) * (Math.PI / 180);
  const jitterDist = 0.002 + ((i % 5) * 0.001);
  const latitude = Number((baseCoords.lat + Math.sin(angle) * jitterDist).toFixed(6));
  const longitude = Number((baseCoords.lng + Math.cos(angle) * jitterDist).toFixed(6));

  const rating = Number((4.75 + ((i * 3) % 25) * 0.01).toFixed(2));
  const totalReviews = 12 + ((i * 11) % 65);
  const hourlyRateHome = 700 + ((i % 8) * 100);
  const hourlyRateOnline = hourlyRateHome - 300;
  const monthlyRateMin = hourlyRateHome * 8;

  GENERATED_TUTORS.push({
    id,
    name,
    phone,
    email,
    avatarUrl,
    introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    highestDegree: degree,
    experienceYears: exp,
    teachingMode: i % 3 === 0 ? 'OFFLINE_HOME' : i % 3 === 1 ? 'ONLINE_LIVE' : 'BOTH',
    subjects: JSON.stringify(subjects),
    classes: JSON.stringify(['Class 9 & 10 (CBSE / ICSE)', 'Class 11 & 12 (Board & Entrance)', 'Middle School (Class 6-8)']),
    boards: JSON.stringify(['CBSE', 'ICSE', 'IB', 'Cambridge IGCSE']),
    serviceAreas: JSON.stringify(serviceAreas),
    travelRadiusKm: 5 + (i % 4),
    latitude,
    longitude,
    hourlyRateHome,
    hourlyRateOnline,
    monthlyRateMin,
    isVerified: true,
    hasPoliceCheck: true,
    rating,
    totalReviews,
    bio: `Passionate educator with ${exp}+ years experience specializing in ${subjects.join(', ')}. Strong track record of improving student grades and building conceptual clarity for board and competitive exams.`,
    kycLast4: String(1000 + ((i * 37) % 9000))
  });
}

// Generate 50 Realistic Leads / Parents Data
const PARENT_NAMES = [
  'Mrs. Ritu Verma', 'Dr. Alok Nath Mehra', 'Col. Rajiv Mathur', 'Mrs. Sunita Bansal', 'Dr. Vivek Malhotra',
  'Mr. Sandeep Kapoor', 'Mrs. Shalini Gupta', 'Mr. Amitav Roy', 'Mrs. Preeti Choudhary', 'Dr. Harsh Vardhan',
  'Mrs. Meenakshi Sundaram', 'Mr. Rajesh Khurana', 'Mrs. Deepika Sethi', 'Mr. Anupam Mittal', 'Mrs. Radhika Singhal',
  'Mr. Vikramaditya Rao', 'Mrs. Kavita Sachdeva', 'Mr. Puneet Oberoi', 'Mrs. Neerja Aggarwal', 'Dr. Rohit Batra',
  'Mrs. Sangeeta Ahuja', 'Mr. Manish Khandelwal', 'Mrs. Vandana Nambiar', 'Mr. Tarun Grover', 'Mrs. Archana Joshi',
  'Mr. Gaurav Chawla', 'Mrs. Anjali Talwar', 'Mr. Sudhir Srivastava', 'Mrs. Parul Goel', 'Mr. Hemant Somani',
  'Mrs. Smriti Kashyap', 'Mr. Nikhil Dhawan', 'Mrs. Bhavna Juneja', 'Mr. Ritesh Deshmukh', 'Mrs. Swati Mahajan',
  'Mr. Ashutosh Bhardwaj', 'Mrs. Tanya Arora', 'Mr. Kunal Rawat', 'Mrs. Monica Chhabra', 'Mr. Sanjay Bajaj',
  'Mrs. Rekha Tripathi', 'Mr. Deepanshu Sood', 'Mrs. Payal Vashisht', 'Mr. Mohit Singla', 'Mrs. Garima Chopra',
  'Mr. Vishal Taneja', 'Mrs. Nupur Kaushik', 'Mr. Devendra Sahni', 'Mrs. Rashmi Saxena', 'Mr. Akhil Duggal'
];

const LEAD_STATUSES = [
  'NEW_LEAD', 'CALL_SCHEDULED', 'TUTOR_MATCHED',
  'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'TUITION_CONFIRMED', 'COMMISSION_RECEIVED'
];

const GRADES = [
  'Class 10 CBSE Board', 'Class 12 CBSE Physics & Maths', 'Class 9 ICSE Science',
  'Class 11 NEET Biology', 'Class 8 CBSE All Subjects', 'Class 12 Commerce & Accounts',
  'Class 7 Cambridge Checkpoint', 'Class 11 JEE Advanced Maths', 'Class 5 Primary Phonics & Maths',
  'Class 10 ICSE Computer Applications'
];

const GENERATED_LEADS = [];
for (let i = 1; i <= 50; i++) {
  const pName = PARENT_NAMES[i - 1];
  const pPhone = `98${String(12000000 + i * 9431).slice(0, 8)}`;
  const pEmail = `${pName.toLowerCase().replace(/[^a-z]/g, '')}${i}@gmail.com`;
  const loc = LOCALITY_NAMES[i % LOCALITY_NAMES.length];
  const grade = GRADES[i % GRADES.length];
  const subjects = SUBJECT_COMBOS[i % SUBJECT_COMBOS.length];
  const status = LEAD_STATUSES[i % LEAD_STATUSES.length];
  const budget = 7000 + ((i % 10) * 1000);
  
  // Assign a tutor if status is TUTOR_MATCHED, DEMO_SCHEDULED, DEMO_COMPLETED, or TUITION_CONFIRMED
  let assignedTutorId = null;
  if (['TUTOR_MATCHED', 'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'TUITION_CONFIRMED', 'COMMISSION_RECEIVED'].includes(status)) {
    assignedTutorId = `tut-${((i * 3) % 100) + 1}`;
  }

  const daysAgo = (i % 15);
  const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  const updatedAt = new Date(Date.now() - Math.max(0, daysAgo - 1) * 24 * 60 * 60 * 1000);

  GENERATED_LEADS.push({
    id: `LD-${100 + i}`,
    parentName: pName,
    parentPhone: pPhone,
    parentEmail: pEmail,
    preferredMode: i % 4 === 0 ? 'ONLINE_LIVE' : 'OFFLINE_HOME',
    locality: loc,
    gradeClass: grade,
    subjectsNeeded: JSON.stringify(subjects),
    board: grade.includes('ICSE') ? 'ICSE' : grade.includes('Cambridge') ? 'Cambridge' : 'CBSE',
    budgetMonthly: budget,
    status,
    notes: `Parent inquiry for ${grade} in ${loc}. Looking for an experienced educator with focus on fundamentals and regular tests.`,
    assignedTutorId,
    commissionAmount: status === 'TUITION_CONFIRMED' || status === 'COMMISSION_RECEIVED' ? Math.round(budget * 0.5) : 0,
    createdAt,
    updatedAt
  });
}

async function main() {
  console.log('🚀 Starting Complete High-Capacity Database Seeding (100 Tutors + 50 Leads)...');

  // 1. Platform Global Config
  await prisma.platformConfig.upsert({
    where: { id: 'global_config' },
    update: {
      baseVerificationFee: 999,
      isOfferActive: true,
      offerDiscountPercent: 100,
      offerTitle: 'Academic Session 2026-27 Special Drive',
      offerSubtext: '100% Verification Fee Waiver for Gurgaon & NCR Educators',
      officeAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
      helplinePhones: '+91 95174 47689, +91 92170 31899',
      supportEmail: 'info@sssamacademy.com',
    },
    create: {
      id: 'global_config',
      baseVerificationFee: 999,
      isOfferActive: true,
      offerDiscountPercent: 100,
      offerTitle: 'Academic Session 2026-27 Special Drive',
      offerSubtext: '100% Verification Fee Waiver for Gurgaon & NCR Educators',
      officeAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
      helplinePhones: '+91 95174 47689, +91 92170 31899',
      supportEmail: 'info@sssamacademy.com',
    },
  });
  console.log('✅ Global Platform Config upserted');

  // 2. Gurgaon Locality SEO
  for (const loc of GURGAON_LOCALITIES) {
    await prisma.localitySEO.upsert({
      where: { slug: loc.slug },
      update: {
        name: loc.name,
        pincode: loc.pincode,
        metaTitle: `Best Home Tutors in ${loc.name}, Gurgaon | SSSAM Academy`,
        metaDesc: `Find top-rated, background-verified home & online tutors in ${loc.name}, Gurgaon (${loc.landmark}). 1 Free Demo Class.`,
        h1Heading: `Best Home Tutors in ${loc.name}, Gurgaon`,
        city: 'Gurgaon',
      },
      create: {
        slug: loc.slug,
        name: loc.name,
        pincode: loc.pincode,
        metaTitle: `Best Home Tutors in ${loc.name}, Gurgaon | SSSAM Academy`,
        metaDesc: `Find top-rated, background-verified home & online tutors in ${loc.name}, Gurgaon (${loc.landmark}). 1 Free Demo Class.`,
        h1Heading: `Best Home Tutors in ${loc.name}, Gurgaon`,
        city: 'Gurgaon',
      },
    });
  }
  console.log(`✅ ${GURGAON_LOCALITIES.length} Locality SEO records upserted`);

  // 3. Super Admin & Counselor Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sssamacademy.com' },
    update: { role: 'SUPER_ADMIN', name: 'SSSAM Super Admin' },
    create: {
      email: 'admin@sssamacademy.com',
      name: 'SSSAM Super Admin',
      phone: '9517447689',
      role: 'SUPER_ADMIN',
      passwordHash,
    },
  });

  const counselors = [
    { name: 'Counselor Pooja', email: 'pooja.counselor@sssamacademy.com', phone: '9811234101' },
    { name: 'Counselor Rajesh', email: 'rajesh.counselor@sssamacademy.com', phone: '9811234102' },
    { name: 'Counselor Ankit', email: 'ankit.counselor@sssamacademy.com', phone: '9811234103' },
    { name: 'Counselor Neha', email: 'neha.counselor@sssamacademy.com', phone: '9811234104' },
  ];

  for (const c of counselors) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: { name: c.name, role: 'TELECALLER', phone: c.phone },
      create: {
        email: c.email,
        name: c.name,
        phone: c.phone,
        role: 'TELECALLER',
        passwordHash,
      },
    });
  }
  console.log('✅ Super Admin and 4 Counselor accounts upserted');

  // 4. 100 Verified Tutors + KYC records
  for (const tut of GENERATED_TUTORS) {
    const user = await prisma.user.upsert({
      where: { email: tut.email },
      update: { name: tut.name, phone: tut.phone, role: 'TUTOR' },
      create: {
        email: tut.email,
        name: tut.name,
        phone: tut.phone,
        role: 'TUTOR',
        passwordHash,
      },
    });

    const tutorProfile = await prisma.tutorProfile.upsert({
      where: { id: tut.id },
      update: {
        userId: user.id,
        avatarUrl: tut.avatarUrl,
        introVideoUrl: tut.introVideoUrl,
        highestDegree: tut.highestDegree,
        experienceYears: tut.experienceYears,
        teachingMode: tut.teachingMode,
        subjects: tut.subjects,
        classes: tut.classes,
        boards: tut.boards,
        serviceAreas: tut.serviceAreas,
        travelRadiusKm: tut.travelRadiusKm,
        latitude: tut.latitude,
        longitude: tut.longitude,
        hourlyRateHome: tut.hourlyRateHome,
        hourlyRateOnline: tut.hourlyRateOnline,
        monthlyRateMin: tut.monthlyRateMin,
        isVerified: tut.isVerified,
        hasPoliceCheck: tut.hasPoliceCheck,
        rating: tut.rating,
        totalReviews: tut.totalReviews,
        bio: tut.bio,
        status: 'ACTIVE_VERIFIED',
      },
      create: {
        id: tut.id,
        userId: user.id,
        avatarUrl: tut.avatarUrl,
        introVideoUrl: tut.introVideoUrl,
        highestDegree: tut.highestDegree,
        experienceYears: tut.experienceYears,
        teachingMode: tut.teachingMode,
        subjects: tut.subjects,
        classes: tut.classes,
        boards: tut.boards,
        serviceAreas: tut.serviceAreas,
        travelRadiusKm: tut.travelRadiusKm,
        latitude: tut.latitude,
        longitude: tut.longitude,
        hourlyRateHome: tut.hourlyRateHome,
        hourlyRateOnline: tut.hourlyRateOnline,
        monthlyRateMin: tut.monthlyRateMin,
        isVerified: tut.isVerified,
        hasPoliceCheck: tut.hasPoliceCheck,
        rating: tut.rating,
        totalReviews: tut.totalReviews,
        bio: tut.bio,
        status: 'ACTIVE_VERIFIED',
      },
    });

    await prisma.tutorKYC.upsert({
      where: { tutorId: tutorProfile.id },
      update: {
        idType: 'AADHAAR_MASKED',
        idLast4: tut.kycLast4,
        idDocUrl: 'https://res.cloudinary.com/demo/image/upload/sample_aadhaar.jpg',
        verificationDate: new Date(),
        verifiedByAdmin: 'SSSAM Super Admin',
      },
      create: {
        tutorId: tutorProfile.id,
        idType: 'AADHAAR_MASKED',
        idLast4: tut.kycLast4,
        idDocUrl: 'https://res.cloudinary.com/demo/image/upload/sample_aadhaar.jpg',
        verificationDate: new Date(),
        verifiedByAdmin: 'SSSAM Super Admin',
      },
    });
  }
  console.log(`✅ ${GENERATED_TUTORS.length} Verified Tutors & KYC records upserted`);

  // 5. 50 Realistic Leads & Parent Records
  for (const lead of GENERATED_LEADS) {
    const createdLead = await prisma.lead.upsert({
      where: { id: lead.id },
      update: {
        parentName: lead.parentName,
        parentPhone: lead.parentPhone,
        parentEmail: lead.parentEmail,
        preferredMode: lead.preferredMode,
        locality: lead.locality,
        gradeClass: lead.gradeClass,
        subjectsNeeded: lead.subjectsNeeded,
        board: lead.board,
        budgetMonthly: lead.budgetMonthly,
        status: lead.status,
        notes: lead.notes,
        assignedTutorId: lead.assignedTutorId,
        commissionAmount: lead.commissionAmount,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      },
      create: {
        id: lead.id,
        parentName: lead.parentName,
        parentPhone: lead.parentPhone,
        parentEmail: lead.parentEmail,
        preferredMode: lead.preferredMode,
        locality: lead.locality,
        gradeClass: lead.gradeClass,
        subjectsNeeded: lead.subjectsNeeded,
        board: lead.board,
        budgetMonthly: lead.budgetMonthly,
        status: lead.status,
        notes: lead.notes,
        assignedTutorId: lead.assignedTutorId,
        commissionAmount: lead.commissionAmount,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      },
    });

    // Add activity log
    const existingAct = await prisma.leadActivity.findFirst({
      where: { leadId: createdLead.id },
    });

    if (!existingAct) {
      await prisma.leadActivity.create({
        data: {
          leadId: createdLead.id,
          actionType: lead.status === 'NEW_LEAD' ? 'NEW_LEAD' : 'NOTE_ADDED',
          description: `Lead status is ${lead.status}. Requirement: ${lead.gradeClass} in ${lead.locality}.`,
          performedBy: 'Counselor Desk (SSSAM System)',
          createdAt: lead.createdAt,
        },
      });
    }
  }
  console.log(`✅ ${GENERATED_LEADS.length} Leads & Parent inquiries upserted with Activity history`);

  console.log('🎉 Complete Database successfully initialized with 100 Tutors and 50 Parent Leads!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
