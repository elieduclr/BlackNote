// BlackNote.js Service Worker v2.0.1
// Ultra-secure offline-first note manager

const CACHE_NAME = 'blacknote-v2.0.1';
const STATIC_CACHE = 'blacknote-static-v2.0.1';
const DYNAMIC_CACHE = 'blacknote-dynamic-v2.0.1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing BlackNote.js Service Worker v2.0.1');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('[SW] Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating BlackNote.js Service Worker v2.0.1');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache non-successful responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Add to dynamic cache
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                console.log('[SW] Caching dynamic resource:', request.url);
                cache.put(request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            console.log('[SW] Network request failed, serving offline fallback:', error);
            
            // Return offline fallback for HTML requests
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for future data synchronization
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'blacknote-sync') {
    event.waitUntil(
      syncNotes()
    );
  }
});

// Push notifications for future features
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'BlackNote.js notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'blacknote-notification',
    requireInteraction: false,
    silent: true
  };

  event.waitUntil(
    self.registration.showNotification('BlackNote.js', options)
  );
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0.1' });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Utility function for future note synchronization
async function syncNotes() {
  try {
    console.log('[SW] Syncing notes in background...');
    
    // Get stored notes from IndexedDB/localStorage
    const notes = await getStoredNotes();
    
    // Process any pending sync operations
    // This will be expanded in future versions for P2P sync
    
    console.log('[SW] Notes sync completed');
    return Promise.resolve();
  } catch (error) {
    console.error('[SW] Notes sync failed:', error);
    return Promise.reject(error);
  }
}

// Utility function to get stored notes
async function getStoredNotes() {
  // This will interface with the main storage system
  // For now, return empty array as placeholder
  return [];
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] BlackNote.js Service Worker v2.0.1 loaded');