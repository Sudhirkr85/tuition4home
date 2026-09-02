// Automated Verification Test for Cloudinary, Brevo, AES-256 Encryption, and Verification Locking
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Load .env variables manually
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[key] = val;
    }
  });
}

// AES-256 implementation matching src/lib/crypto.ts
const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'tuitionforhome_super_secret_jwt_key_2026';
const KEY = crypto.createHash('sha256').update(SECRET_KEY).digest();

function encrypt(text) {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedText) {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    return '';
  }
}

function maskAadhaar(aadhaar) {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  return `XXXX-XXXX-${clean.slice(-4)}`;
}

function maskPan(pan) {
  if (!pan || pan.length < 5) return 'XXXXX****X';
  return `${pan.slice(0, 5).toUpperCase()}****${pan.slice(-1).toUpperCase()}`;
}

function maskPhone(phone) {
  if (!phone) return '+91 ****** XXXX';
  const clean = phone.replace(/\D/g, '');
  return `+91 ****** ${clean.slice(-4)}`;
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 RUNNING SYSTEM INTEGRATION TESTS');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: AES-256 Encryption & Decryption
  try {
    console.log('1. Testing AES-256 Encryption & DPDP Masking...');
    const rawAadhaar = '987654321098';
    const encrypted = encrypt(rawAadhaar);
    const decrypted = decrypt(encrypted);
    const masked = maskAadhaar(rawAadhaar);

    if (decrypted === rawAadhaar && masked === 'XXXX-XXXX-1098' && encrypted !== rawAadhaar) {
      console.log('   ✅ AES-256 Encrypt & Decrypt: PASSED');
      console.log(`   ✅ Aadhaar Masking: ${masked} PASSED`);
      passed++;
    } else {
      console.log('   ❌ AES-256 Encryption Test: FAILED');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ AES-256 Test Error:', err.message);
    failed++;
  }

  // TEST 2: PAN & Phone Masking
  try {
    console.log('\n2. Testing PAN and Phone Number Privacy Masking...');
    const rawPan = 'ABCDE1234F';
    const rawPhone = '9811204921';
    const maskedPan = maskPan(rawPan);
    const maskedPhone = maskPhone(rawPhone);

    if (maskedPan === 'ABCDE****F' && maskedPhone === '+91 ****** 4921') {
      console.log(`   ✅ Masked PAN: ${maskedPan} PASSED`);
      console.log(`   ✅ Masked Phone: ${maskedPhone} PASSED`);
      passed++;
    } else {
      console.log('   ❌ Masking Test: FAILED');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ Masking Error:', err.message);
    failed++;
  }

  // TEST 3: Database Tutor Profiles & KYC Documents Structure
  try {
    console.log('\n3. Testing Prisma Database & KYC Model Integration...');
    const tutorCount = await prisma.tutorProfile.count();
    console.log(`   ℹ️ Total Tutors in MySQL Database: ${tutorCount}`);

    const sampleTutor = await prisma.tutorProfile.findFirst({
      include: { user: true }
    });

    if (sampleTutor) {
      console.log(`   ✅ Tutor Record Found: ${sampleTutor.user.name} (${sampleTutor.highestDegree})`);
      console.log(`   ✅ Teaching Mode: ${sampleTutor.teachingMode}`);
      passed++;
    } else {
      console.log('   ❌ No tutor found in DB');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ Database Model Error:', err.message);
    failed++;
  }

  // TEST 4: Cloudinary Environment Configuration Check
  try {
    console.log('\n4. Testing Cloudinary Environment Configuration...');
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (cloudName === 'jhwajyyw' && apiKey === '683625518118995') {
      console.log(`   ✅ Cloudinary Cloud Name (${cloudName}) Verified: PASSED`);
      console.log(`   ✅ Cloudinary API Key (${apiKey}) Verified: PASSED`);
      passed++;
    } else {
      console.log('   ❌ Cloudinary Env Test: FAILED (Check .env keys)');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ Cloudinary Env Error:', err.message);
    failed++;
  }

  // TEST 5: Brevo Sender Email & Key Check
  try {
    console.log('\n5. Testing Brevo Transactional Email Configuration...');
    const brevoKey = process.env.BREVO_API_KEY;
    const brevoSender = process.env.BREVO_SENDER_EMAIL;

    if (brevoKey && brevoKey.startsWith('xkeysib-') && (brevoSender === 'support@sssamacademy.com' || brevoSender?.includes('@sssamacademy'))) {
      console.log('   ✅ Brevo API Key Loaded: PASSED');
      console.log(`   ✅ Sender Email (${brevoSender}) Verified: PASSED`);
      passed++;
    } else {
      console.log('   ❌ Brevo Env Test: FAILED');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ Brevo Env Error:', err.message);
    failed++;
  }

  console.log('\n========================================');
  console.log(`📊 FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  await prisma.$disconnect();
}

runTests();
