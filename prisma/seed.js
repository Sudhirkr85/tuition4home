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

async function main() {
  console.log('🚀 Initializing & Seeding Complete Database...');

  // 1. Seed Global Platform Config
  await prisma.platformConfig.upsert({
    where: { id: 'global_config' },
    update: {},
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

  // 2. Seed Locality SEO Pages
  for (const loc of GURGAON_LOCALITIES) {
    await prisma.localitySEO.upsert({
      where: { slug: loc.slug },
      update: {},
      create: {
        slug: loc.slug,
        name: loc.name,
        city: 'Gurgaon',
        pincode: loc.pincode,
        metaTitle: `Best Home Tutors in ${loc.name}, Gurgaon | SSSAM Academy`,
        metaDesc: `Find verified home and online tutors in ${loc.name}, Gurgaon (${loc.landmark}). 1 Free Demo Class + 100% Replacement Guarantee.`,
        h1Heading: `Best Home Tutors in ${loc.name}, Gurgaon`,
        contentBody: `Connect with verified educators serving residential communities in and around ${loc.landmark}.`,
        isActive: true,
      },
    });
  }

  // 3. Seed Default Admin User
  const defaultPasswordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@sssamacademy.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@sssamacademy.com',
      passwordHash: defaultPasswordHash,
      phone: '+91 95174 47689',
      role: 'SUPER_ADMIN',
    },
  });

  // 4. Seed Counselor Accounts
  const counselors = [
    { name: 'Pooja Sharma', email: 'pooja.sharma@sssamacademy.com', phone: '+91 98112 34567', role: 'TELECALLER' },
    { name: 'Amit Kumar', email: 'amit.kumar@sssamacademy.com', phone: '+91 98765 43210', role: 'TELECALLER' },
    { name: 'Sneha Verma', email: 'sneha.verma@sssamacademy.com', phone: '+91 99887 76655', role: 'TELECALLER' },
    { name: 'Rahul Dev', email: 'rahul.dev@sssamacademy.com', phone: '+91 97110 09988', role: 'TELECALLER' },
  ];

  for (const c of counselors) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        passwordHash: defaultPasswordHash,
        phone: c.phone,
        role: 'TELECALLER',
      },
    });
  }

  console.log('✅ Database completely initialized and seeded with all tables and records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
