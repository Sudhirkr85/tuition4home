const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'sudhir@gmail.com';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || '1234567890';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
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
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
