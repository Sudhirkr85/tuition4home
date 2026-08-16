// Auto-cleanup script for legacy service worker registrations on localhost
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.registration.unregister().then(() => {
    console.log('[SW] Cleaned up legacy service worker.');
  });
});
