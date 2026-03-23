const CACHE_NAME = 'replog-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install Event - cache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - clear old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Cache-First Strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip browser extensions and other non-http schemes
  if (!(event.request.url.indexOf('http') === 0)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache new static assets (JS, CSS, fonts, images)
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.destination === 'script' ||
           event.request.destination === 'style' ||
           event.request.destination === 'font' ||
           event.request.destination === 'image')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
