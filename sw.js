const CACHE_NAME = 'tcp-gestor-v4';
const LOCAL_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalación: solo recursos locales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(LOCAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: limpieza de cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: caché primero para todo, pero con manejo de errores
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Para recursos de CDN, intenta caché, si no, red y guarda en caché después
  if (url.hostname === 'cdn.jsdelivr.net' || url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        // Si no está en caché, descarga y guarda
        return fetch(request).then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        }).catch(() => {
          // Si falla la red, devuelve algo (ej. un mensaje offline)
          return new Response('Recurso no disponible offline', { status: 404 });
        });
      })
    );
  } else {
    // Para recursos locales, estrategia caché primero con fallback a red
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).catch(() => {
          // Fallback a index.html para SPA
          return caches.match('./index.html');
        });
      })
    );
  }
});