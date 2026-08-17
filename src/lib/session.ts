/**
 * Unified Session Storage Helper with Configurable Expiry
 * 
 * Expiry Policy:
 * - Tutor Session: 30 Days
 * - Parent Session: 30 Days
 * - Counselor Session: 30 Days
 * - Admin Session: 7 Days
 */

export const SESSION_KEYS = {
  ADMIN: 'tfh_admin_user',
  COUNSELOR: 'tfh_counselor_user',
  TUTOR: 'tutor_session',
  PARENT: 'parent_session',
} as const;

export const SESSION_EXPIRY_DAYS = {
  ADMIN: 7,       // 7 Days
  COUNSELOR: 30,  // 30 Days
  TUTOR: 30,      // 30 Days
  PARENT: 30,     // 30 Days
} as const;

export interface SessionEnvelope<T = any> {
  data: T;
  expiresAt: number; // Unix timestamp in milliseconds
  createdAt: number;
}

/**
 * Save data to localStorage with an expiration date in days
 */
export function setSessionWithExpiry<T = any>(key: string, data: T, days: number): void {
  if (typeof window === 'undefined') return;
  try {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    // Also attach expiresAt directly to the object if it's an object, for backwards compatibility
    const sessionData = (typeof data === 'object' && data !== null)
      ? { ...data, expiresAt, _sessionExpiresAt: expiresAt }
      : data;

    const envelope: SessionEnvelope<T> = {
      data: sessionData,
      expiresAt,
      createdAt: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(envelope));
    // Also save raw data with expiresAt for direct legacy reads
    localStorage.setItem(`${key}_raw`, JSON.stringify(sessionData));
  } catch (err) {
    console.error(`[SESSION_SET_ERROR] Failed to save session for key: ${key}`, err);
  }
}

/**
 * Get data from localStorage. If expired, clears the session and returns null.
 */
export function getSessionWithExpiry<T = any>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    let parsed: any;
    try {
      parsed = JSON.parse(itemStr);
    } catch {
      return null;
    }

    // Case 1: Wrapped inside SessionEnvelope
    if (parsed && typeof parsed === 'object' && 'expiresAt' in parsed && 'data' in parsed && 'createdAt' in parsed) {
      if (Date.now() > parsed.expiresAt) {
        clearSession(key);
        return null;
      }
      return parsed.data as T;
    }

    // Case 2: Direct object with expiresAt attached
    if (parsed && typeof parsed === 'object' && ('expiresAt' in parsed || '_sessionExpiresAt' in parsed)) {
      const exp = parsed.expiresAt || parsed._sessionExpiresAt;
      if (typeof exp === 'number' && Date.now() > exp) {
        clearSession(key);
        return null;
      }
      return parsed as T;
    }

    // Legacy unexpired item (set expiry default now)
    return parsed as T;
  } catch (err) {
    console.error(`[SESSION_GET_ERROR] Failed to read session for key: ${key}`, err);
    return null;
  }
}

/**
 * Remove session from localStorage
 */
export function clearSession(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_raw`);
  } catch (err) {
    console.error(`[SESSION_CLEAR_ERROR] Failed to clear session for key: ${key}`, err);
  }
}
