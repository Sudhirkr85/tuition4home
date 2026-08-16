import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || 'tuitionforhome_super_secret_jwt_key_2026';

// Deriving a 32-byte key from our secret key using SHA-256
const KEY = crypto.createHash('sha256').update(SECRET_KEY).digest();

/**
 * Encrypts a plain text string using AES-256-CBC.
 * Returns the format `iv:encryptedText` in hex.
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts an encrypted hex string (`iv:encryptedText`) back to plain text.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    const ivHex = parts[0];
    const encryptedHex = parts[1];
    
    if (!ivHex || !encryptedHex) {
      return '';
    }
    
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('KYC ID Decryption error:', error);
    return '';
  }
}

/**
 * Masking Helpers for Zero Contact / Zero PII Leakage
 */

/** Mask Aadhaar: e.g. "123456789012" -> "XXXX-XXXX-9012" */
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return 'XXXX-XXXX-XXXX';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXX-XXXX-XXXX';
  const last4 = clean.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

/** Mask PAN Card: e.g. "ABCDE1234F" -> "ABCDE****F" */
export function maskPan(pan: string): string {
  if (!pan || pan.length < 5) return 'XXXXX****X';
  const first5 = pan.slice(0, 5).toUpperCase();
  const last1 = pan.slice(-1).toUpperCase();
  return `${first5}****${last1}`;
}

/** Mask Phone Number: e.g. "9811204921" -> "+91 ****** 4921" */
export function maskPhone(phone: string): string {
  if (!phone) return '+91 ****** XXXX';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 4) return '+91 ****** XXXX';
  const last4 = clean.slice(-4);
  return `+91 ****** ${last4}`;
}

/** Mask Bank Account: e.g. "5010023456789" -> "XXXXXXXXXX6789" */
export function maskBankAccount(accountNo: string): string {
  if (!accountNo) return 'XXXXXXXXXXXX';
  const clean = accountNo.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXXXXXXXXXX';
  const last4 = clean.slice(-4);
  return `XXXXXXXXXX${last4}`;
}
