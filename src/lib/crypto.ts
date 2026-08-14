import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'tuitionforhome_super_secret_jwt_key_2026';

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
