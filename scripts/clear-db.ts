import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup for fresh production launch...');

  // Delete all relational and test data in order
  const delActivities = await prisma.leadActivity.deleteMany({});
  console.log(`Deleted ${delActivities.count} lead activities.`);

  const delLeads = await prisma.lead.deleteMany({});
  console.log(`Deleted ${delLeads.count} leads.`);

  const delReviews = await prisma.review.deleteMany({});
  console.log(`Deleted ${delReviews.count} reviews.`);

  const delKYC = await prisma.tutorKYC.deleteMany({});
  console.log(`Deleted ${delKYC.count} tutor KYC records.`);

  const delTutors = await prisma.tutorProfile.deleteMany({});
  console.log(`Deleted ${delTutors.count} tutor profiles.`);

  const delOTPs = await prisma.emailOtpToken.deleteMany({});
  console.log(`Deleted ${delOTPs.count} email OTP tokens.`);

  const delUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${delUsers.count} users.`);

  // Reset Platform Config to clean baseline
  await prisma.platformConfig.upsert({
    where: { id: 'global_config' },
    update: {
      googleMapsUsageCount: 0,
    },
    create: {
      id: 'global_config',
      baseVerificationFee: 999,
      isOfferActive: true,
      offerDiscountPercent: 100,
      offerTitle: 'Academic Session Special Drive',
      offerSubtext: '100% Verification Fee Waiver for Gurgaon & NCR Educators',
      officeAddress: 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
      helplinePhones: '+91 95174 47689, +91 92170 31899',
      supportEmail: 'info@sssamacademy.com',
      mapProvider: 'OPENSTREETMAP',
      googleMapsUsageCount: 0,
      googleMapsLimit: 25000,
    },
  });

  console.log('✅ Database is now 100% clean and ready for live production!');
}

main()
  .catch((e) => {
    console.error('❌ Error during cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
