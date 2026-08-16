// Utility to handle Dual Map Provider: Google Maps (Primary) + OpenStreetMap (Fallback)

export interface MapConfig {
  provider: 'GOOGLE_MAPS' | 'OPENSTREETMAP';
  requestedProvider: 'GOOGLE_MAPS' | 'OPENSTREETMAP';
  googleMapsApiKey: string | null;
  hasValidGoogleKey: boolean;
  usageCount: number;
  limit: number;
}

let cachedConfig: MapConfig | null = null;
let configFetchPromise: Promise<MapConfig> | null = null;

// Fetch map configuration from backend
export async function getMapConfig(): Promise<MapConfig> {
  if (cachedConfig) return cachedConfig;
  if (configFetchPromise) return configFetchPromise;

  configFetchPromise = (async () => {
    try {
      const res = await fetch('/api/config/maps');
      const data = await res.json();
      if (data && data.success) {
        cachedConfig = {
          provider: data.provider || 'OPENSTREETMAP',
          requestedProvider: data.requestedProvider || 'OPENSTREETMAP',
          googleMapsApiKey: data.googleMapsApiKey || null,
          hasValidGoogleKey: Boolean(data.hasValidGoogleKey),
          usageCount: data.usageCount || 0,
          limit: data.limit || 25000,
        };
        return cachedConfig;
      }
    } catch {
      // Map config fetch fallback
    }
    cachedConfig = {
      provider: 'OPENSTREETMAP',
      requestedProvider: 'OPENSTREETMAP',
      googleMapsApiKey: null,
      hasValidGoogleKey: false,
      usageCount: 0,
      limit: 25000,
    };
    return cachedConfig;
  })();

  return configFetchPromise;
}

// Invalidate cached config (useful when admin updates setting)
export function invalidateMapConfig() {
  cachedConfig = null;
  configFetchPromise = null;
}

// Load Google Maps JavaScript SDK dynamically
let googleMapsPromise: Promise<any> | null = null;

export function loadGoogleMapsSdk(apiKey: string): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if ((window as any).google && (window as any).google.maps) {
    return Promise.resolve((window as any).google.maps);
  }
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script already exists in document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve((window as any).google.maps));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Notify backend of Google Maps usage
      try {
        fetch('/api/config/maps', { method: 'POST' }).catch(() => {});
      } catch {}
      resolve((window as any).google.maps);
    };
    script.onerror = (err) => {
      googleMapsPromise = null;
      reject(err);
    };
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

// Reverse Geocode with automatic fallback: Google Geocoder -> OSM Nominatim
export async function reverseGeocodeUnified(lat: number, lng: number): Promise<string> {
  // Try Google Geocoder if available
  if (typeof window !== 'undefined' && (window as any).google?.maps?.Geocoder) {
    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await new Promise<any>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject(new Error(`Google Geocoder status: ${status}`));
          }
        });
      });
      if (response) return response;
    } catch {
      // Google reverse geocode fallback to OSM
    }
  }

  // Fallback: OpenStreetMap Nominatim (Free, No Key)
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      const parts: string[] = [];
      if (a.neighbourhood) parts.push(a.neighbourhood);
      else if (a.suburb) parts.push(a.suburb);
      if (a.road) parts.push(a.road);
      if (a.city || a.town || a.village) parts.push(a.city || a.town || a.village);
      if (a.state_district) parts.push(a.state_district);
      return parts.length > 0 ? parts.join(', ') : (data.display_name || 'Gurugram, Haryana');
    }
    return data.display_name || 'Gurugram, Haryana';
  } catch (err) {
    console.error('OSM reverse geocoding failed:', err);
    return 'Gurugram, Haryana';
  }
}
