const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Running Automatic Seed: Creating Super Admin...');

  const adminEmail = 'sudhir@gmail.com';
  const adminPassword = '1234567890';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Sudhir Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: '9102130956',
    },
    create: {
      name: 'Sudhir Admin',
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
      phone: '9102130956',
    },
  });

  console.log(`✅ Super Admin Seeded in Database: ${adminUser.email} (Role: ${adminUser.role})`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
