// Service Worker for caching 3D models
const CACHE_NAME = 'spline-model-cache-v1';

// Cache both the model and its dependencies
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('spline.design')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
}); 