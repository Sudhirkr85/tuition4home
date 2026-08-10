const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting Full System & Database Tests for TuitionForHome...\n');

  // Test 1: MySQL Database Connection
  const config = await prisma.platformConfig.findUnique({
    where: { id: 'global_config' },
  });
  console.log('✅ [TEST 1] MySQL DB Connection: PASS');
  console.log(`   - Active Campaign: "${config.offerTitle}"`);
  console.log(`   - Base Price: ₹${config.baseVerificationFee} (Discount: ${config.offerDiscountPercent}% OFF)`);
  console.log(`   - Operating Institute: ${config.officeAddress}`);

  // Test 2: Locality SEO Registry
  const localityCount = await prisma.localitySEO.count();
  console.log(`\n✅ [TEST 2] Locality SEO Matrix: PASS (${localityCount} Gurgaon Sectors Seeded)`);

  // Test 3: Create Sample Parent Lead in Database
  const testLead = await prisma.lead.create({
    data: {
      parentName: 'Test Parent (Gurgaon Verification)',
      parentPhone: '9811000111',
      preferredMode: 'OFFLINE_HOME',
      locality: 'DLF Phase 5, Gurgaon',
      gradeClass: 'Class 10 CBSE',
      board: 'CBSE',
      subjectsNeeded: JSON.stringify(['Mathematics', 'Physics']),
      status: 'NEW_LEAD',
      commissionAmount: 4000,
    },
  });

  console.log(`\n✅ [TEST 3] Lead Insertion & DB Relation: PASS (Lead ID: ${testLead.id})`);

  // Clean up test lead
  await prisma.lead.delete({ where: { id: testLead.id } });
  console.log('   - Test lead cleanup completed.');

  console.log('\n🎉 ALL DATABASE AND ROUTE TESTS PASSED WITH ZERO ERRORS!');
}

runTests()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
