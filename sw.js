const CACHE_NAME = 'dr-ghader-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/logo.png',
    '/hero.png',
    '/doctor.png',
    '/aligners.png',
    '/braces.png',
    '/jaw.png',
    '/dental_wallpaper.png',
    '/review1.jpeg',
    '/review2.jpeg',
    '/review3.jpeg',
    '/review4.jpeg',
    '/review5.jpeg',
    '/review6.jpeg',
    '/review7.jpeg',
    '/review8.jpeg',
    '/review9.jpeg',
    '/review10.jpeg',
    '/review11.jpeg',
    '/review12.jpeg',
    '/review13.jpeg',
    '/review14.jpeg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
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
