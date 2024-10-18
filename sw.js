self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('cep-app-v1').then((cache) => {
            return cache.addAll([
                './index.html',
                './style.css',
                './app.js',
                './manifest.json',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});


const CACHE_NAME = 'cep-app-v2'; // Altere para v2, v3 conforme necessário

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './index.html',
                './style.css',
                './app.js',
                './manifest.json',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    // Remove caches antigos
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

