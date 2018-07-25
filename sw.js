const startCacheName = 'restaurant-review-';
const staticCacheName = 'restaurant-review-static-cache';
const imagesCachesName = 'restaurant-review-images-cache';
const allCaches = [
  staticCacheName,
  imagesCachesName
];
const filesToCache = [
  // icon
  'img/icon.ico',
  'img/icon-128.png',
  'img/icon-144.png',
  'img/icon-256.png',
  'img/icon-512.png',
  // html
  'index.html',
  'restaurant.html',
  // css
  'css/responsive.css',
  'css/styles.css',
  // js
  'js/dbhelper.js',
  'js/main.js'
];

const isNotInCache = cacheName =>
  cacheName.startsWith(startCacheName) && !allCaches.includes(cacheName);

function registerHook() {
  self.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      console.warn('Service worker: Availability ✓');
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.warn('Service worker: Register ✓');
          console.warn(registration.scope);
        })
        .catch(error => {
          console.warn('Service worker: Register ✗');
          console.error(error);
        });
    } else {
      console.error('Service worker: Availability ✗');
    }
  });
}

function installHook() {
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(staticCacheName).then(cache => cache.addAll(filesToCache))
    );
  });
}

function activateHook() {
  self.addEventListener('activate', event => {
    console.warn('Service worker: Activating... ✓');
    event.waitUntil(
      caches.keys().then(cacheNames => Promise.all(
        cacheNames.filter(isNotInCache).map(cacheName => caches.delete(cacheName))
      ))
    );
  });
}

function getOrFetchImage(request) {
  const url = request.url;

  return caches.open(imagesCachesName).then(cache => {
    return cache.match(url).then(response => {
      return response || fetch(request).then(networkResponse => {
        cache.put(url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

function fetchHook() {
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.origin === location.origin) {
      if (url.pathname === '/') {
        console.warn('Service worker: Fetching homepage ✓', event.request.url);
        event.respondWith(caches.match('index.html'));
        return;
      }
      if (url.pathname.startsWith('/img/')) {
        console.warn('Service worker: Fetching image ✓', event.request.url);
        event.respondWith(getOrFetchImage(event.request));
        return;
      }
    }

    event.respondWith(
      caches.match(event.request).then(response =>
        response || fetch(event.request)
      )
    );
  });
}

function messageHook() {
  self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
}

function app() {
  registerHook();
  installHook();
  activateHook();
  fetchHook();
  messageHook();
}

app();
