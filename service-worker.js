const CACHE_NAME = 'weighted-matrix-tool-v1';

// Use relative paths without leading slash for GitHub Pages compatibility
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './src/styles/main.css',
  './src/styles/components/matrix.css',
  './src/styles/components/toast.css',
  './src/styles/components/export.css',
  './src/styles/components/heatmap.css',
  './src/js/index.js',
  './src/js/components/Matrix.js',
  './src/js/components/Export.js',
  './src/js/components/Toast.js',
  './src/js/utils/helpers.js',
  './manifest.json'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a one-time use
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache same-origin requests
              if (event.request.url.startsWith(self.location.origin)) {
                cache.put(event.request, responseToCache);
              }
            });
          
          return response;
        }).catch(error => {
          console.log('Fetch failed:', error);
          // You could return a custom offline page here
        });
      })
  );
}); 