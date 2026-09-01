const { PrismaClient } = require('@prisma/client');
const sharp = require('sharp');

const prisma = new PrismaClient();

async function optimizeBase64Avatar(base64Str) {
  // If not base64 or short, return as is
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }

  // Use sharp to resize to 300x300 JPEG quality 75 (< 20KB)
  try {
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const resizedBuffer = await sharp(buffer)
      .resize(300, 300, { fit: 'cover' })
      .jpeg({ quality: 75 })
      .toBuffer();
    return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
  } catch (err) {
    console.error('Sharp compression failed:', err.message);
    return '/placeholder-avatar.jpg';
  }
}

async function optimizeBase64Doc(base64Str) {
  if (!base64Str || !base64Str.startsWith('data:image/')) {
    return base64Str;
  }

  try {
    const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const resizedBuffer = await sharp(buffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
    return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
  } catch (e) {
    return base64Str;
  }
}

async function run() {
  console.log('🚀 Starting Database Base64 Cleanup & Optimization...\n');

  // 1. Clean TutorProfile Avatars
  const tutors = await prisma.tutorProfile.findMany({
    select: { id: true, userId: true, avatarUrl: true },
  });

  console.log(`Found ${tutors.length} tutor profiles to inspect.`);
  let cleanedAvatars = 0;

  for (const t of tutors) {
    if (t.avatarUrl && t.avatarUrl.startsWith('data:image/')) {
      const initialKb = (t.avatarUrl.length / 1024).toFixed(1);
      console.log(`Optimizing avatar for tutor ${t.id} (Current size: ${initialKb} KB)...`);
      const optimized = await optimizeBase64Avatar(t.avatarUrl);
      const newKb = (optimized.length / 1024).toFixed(1);

      await prisma.tutorProfile.update({
        where: { id: t.id },
        data: { avatarUrl: optimized },
      });

      console.log(` -> Reduced avatar from ${initialKb} KB to ${newKb} KB! ✅`);
      cleanedAvatars++;
    }
  }

  // 2. Clean TutorKYC Documents
  const kycDocs = await prisma.tutorKYC.findMany({
    select: { id: true, tutorId: true, idDocUrl: true, degreeDocUrl: true },
  });

  console.log(`\nFound ${kycDocs.length} KYC documents to inspect.`);
  let cleanedKyc = 0;

  for (const kyc of kycDocs) {
    let updateData = {};

    if (kyc.idDocUrl && kyc.idDocUrl.startsWith('data:image/')) {
      const initialKb = (kyc.idDocUrl.length / 1024).toFixed(1);
      console.log(`Optimizing KYC ID Doc for tutor ${kyc.tutorId} (Size: ${initialKb} KB)...`);
      const optimizedId = await optimizeBase64Doc(kyc.idDocUrl);
      const newKb = (optimizedId.length / 1024).toFixed(1);
      updateData.idDocUrl = optimizedId;
      console.log(` -> Reduced ID Doc from ${initialKb} KB to ${newKb} KB! ✅`);
      cleanedKyc++;
    }

    if (kyc.degreeDocUrl && kyc.degreeDocUrl.startsWith('data:image/')) {
      const initialKb = (kyc.degreeDocUrl.length / 1024).toFixed(1);
      console.log(`Optimizing KYC Degree Doc for tutor ${kyc.tutorId} (Size: ${initialKb} KB)...`);
      const optimizedDegree = await optimizeBase64Doc(kyc.degreeDocUrl);
      const newKb = (optimizedDegree.length / 1024).toFixed(1);
      updateData.degreeDocUrl = optimizedDegree;
      console.log(` -> Reduced Degree Doc from ${initialKb} KB to ${newKb} KB! ✅`);
      cleanedKyc++;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.tutorKYC.update({
        where: { id: kyc.id },
        data: updateData,
      });
    }
  }

  console.log(`\n🎉 Cleanup Completed successfully!`);
  console.log(`- Avatars optimized: ${cleanedAvatars}`);
  console.log(`- KYC Documents optimized: ${cleanedKyc}`);

  await prisma.$disconnect();
}

run().catch((e) => {
  console.error('Cleanup script error:', e);
  prisma.$disconnect();
  process.exit(1);
});
